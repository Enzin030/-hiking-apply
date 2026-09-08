/* ============================================================
   head-loader.js — 載入 assets/includes/head.html（計畫 §5 階段 1.3）
   ------------------------------------------------------------
   用法（頁面 <head> 內）：

     <script src="assets/includes/head-loader.js" data-page-init="components/xxx.js"></script>

   data-page-init（可省）：頁面自己的初始化腳本。會排在最後一支，
   保證前面的 Vue 與共用元件都已執行完才執行。

   ------------------------------------------------------------
   為什麼不能用 innerHTML
   ------------------------------------------------------------
   `fetch` 回來的 HTML 直接塞 innerHTML，其中的 <script> **不會執行**
   （HTML 規範：innerHTML 插入的 script 不執行）。所以本檔把 script 節點
   一律用 document.createElement('script') 重建。

   ------------------------------------------------------------
   2026-09-08 改為「一次插入、平行下載、順序執行」
   ------------------------------------------------------------
   **原本是嚴格序列**：前一支 onload 才建下一支。實測（threaded dev server、
   notice.html）那條串聯鏈有 **24 支**：
     head-loader.js → head.html → vue.global.prod.js → 20 支元件 → app-boot → page-init
   每支元件檔本身只要 10–15ms，但因為要等前一支 onload，20 支就串成
   20 個來回。掛載完成中位數 **1139ms**（單執行緒 dev server 1330ms）。

   改法：把所有 script 元素先建好、統一設 `script.async = false`，然後一次全部
   append。這是 HTML 規範保證的組合——**下載可以並行，執行仍照插入順序**
   （async=false 的動態 script 會進「end of document」佇列依序執行）。
   於是 Vue → 共用元件 → app-boot → page-init 的順序不變，但少掉 20 個來回。

   **前提：head.html 內不能有 inline script。** inline script 一 append 就同步
   執行，會插到還沒下載完的外部 script 前面，順序就壞了。目前 head.html 是
   22 支全部有 src、0 支 inline（Tailwind 的 config 早已抽成靜態檔）。
   本檔仍保留序列模式作為退路：偵測到 inline script 就自動走舊路徑，
   並在 console 說明原因，不會靜默改變語意。

   ------------------------------------------------------------
   page-init 必須等 DOMContentLoaded（2026-09-08，平行化的必要配套）
   ------------------------------------------------------------
   **這是平行化引進的回歸，不是原本就有的問題。**

   body 底部的資料檔（components/*Data.js）是 **parser-inserted**；
   head 這 22 支改成平行後是 **動態插入 ＋ async=false** 佇列。
   規範沒有規定這兩個佇列的相對順序——舊的序列版有 24 段串聯、約 1.5 秒
   的安全邊際，所以資料檔一定先到；平行版把邊際壓到約 200ms 就翻車。

   實測（資料檔延遲 800ms、threaded server）：
     序列版  open／apply-1／notice_a1／news／index 五頁全數正常
     平行版  open      ReferenceError: OPEN_ORG_BUTTONS is not defined
             apply-1   ReferenceError: AGENCIES is not defined
             notice_a1 掛載失敗、整頁空白
   會炸的原因正好是計畫的通則：大宗資料常數不進 data()，所以 page-init
   在**頂層**就讀 window.XXX。

   修法：head 那 22 支照舊平行（效益保留），但 page-init 等到
   **head 全部載完 && DOMContentLoaded** 才 append。DOMContentLoaded
   保證所有 parser-inserted script（含 body 底部的資料檔）都已執行。
   同時對 page-init 下 <link rel="preload" as="script">，讓它的下載仍然
   並行、只延後執行，不把延遲加回來。

   **不要把資料檔搬進 loader 來解這件事**——那會改掉掛載契約，
   而且資料檔位置是逐頁的，屬使用者拍板範圍。

   ------------------------------------------------------------
   完成訊號代表「依賴真的載入成功」，不是「節點已建立」
   ------------------------------------------------------------
   - 每支 script 逐一綁 onload / onerror
   - **全部 onload 後**才 dispatch includesLoaded
   - 任一 onerror 立刻 console.error 具名回報並 dispatch includesFailed，
     **不靜默繼續**——否則畫面空白時看不出是哪支依賴掛了
   - **不可單靠 DOMContentLoaded 判定**：本檔是 async fetch，
     DOMContentLoaded 常常早於依賴載入完成

   等待方式（頁面／元件端）：

     onIncludesLoaded(() => { ... });   // 已完成則立即執行，否則掛事件

   ============================================================ */

(function () {
  "use strict";

  var SELF = document.currentScript;
  var BASE = "assets/includes/head.html";
  var state = "loading"; // loading | loaded | failed

  // 讓晚註冊的呼叫端也能拿到結果，不必擔心錯過事件
  window.headIncludes = { get state() { return state; } };

  window.onIncludesLoaded = function (fn) {
    if (state === "loaded") { fn(); return; }
    if (state === "failed") { return; }
    document.addEventListener("includesLoaded", function () { fn(); }, { once: true });
  };

  function fail(what, err) {
    if (state === "failed") return;
    state = "failed";
    console.error("[head-loader] 載入失敗：" + what + "。頁面依賴不完整，後續初始化已中止。", err || "");
    document.dispatchEvent(new CustomEvent("includesFailed", { detail: { what: what } }));
  }

  function done() {
    if (state !== "loading") return;
    state = "loaded";
    document.dispatchEvent(new CustomEvent("includesLoaded"));
  }

  function build(spec) {
    var el = document.createElement("script");
    for (var i = 0; i < spec.attrs.length; i++) {
      el.setAttribute(spec.attrs[i].name, spec.attrs[i].value);
    }
    if (!spec.src) el.textContent = spec.text;
    return el;
  }

  /* DOM 解析完成（含 body 底部 parser-inserted 的資料檔都已執行） */
  function whenDomReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  /* 讓 page-init 的下載與 head 並行，只把「執行」延後到 DOMContentLoaded */
  function preload(src) {
    var l = document.createElement("link");
    l.rel = "preload";
    l.as = "script";
    l.href = src;
    document.head.appendChild(l);
  }

  /* page-init 一定排在最後，且必須等 DOMContentLoaded（理由見檔頭） */
  function runPageInit(spec) {
    if (!spec) { done(); return; }
    whenDomReady(function () {
      var el = build(spec);
      el.async = false;
      el.onload = function () { done(); };
      el.onerror = function (e) { fail(spec.src, e); };
      document.head.appendChild(el);
    });
  }

  /* 平行下載、順序執行：全部先建好、async=false、一次 append */
  function loadParallel(specs, pageInit) {
    if (pageInit && pageInit.src) preload(pageInit.src);

    var remaining = specs.length;
    if (!remaining) { runPageInit(pageInit); return; }

    var nodes = specs.map(function (spec) {
      var el = build(spec);
      el.async = false;                       // 關鍵：保留執行順序
      el.onload = function () {
        remaining--;
        if (remaining === 0) runPageInit(pageInit);
      };
      el.onerror = function (e) { fail(spec.src, e); };
      return el;
    });

    var frag = document.createDocumentFragment();
    nodes.forEach(function (n) { frag.appendChild(n); });
    document.head.appendChild(frag);
  }

  /* 退路：嚴格序列。只有 head.html 出現 inline script 時才會走到這裡 */
  function loadSequentially(specs, index, pageInit) {
    if (index >= specs.length) { runPageInit(pageInit); return; }
    var spec = specs[index];
    var el = build(spec);
    if (spec.src) {
      el.onload = function () { loadSequentially(specs, index + 1, pageInit); };
      el.onerror = function (e) { fail(spec.src, e); };
      document.head.appendChild(el);
    } else {
      try {
        document.head.appendChild(el);        // inline script：append 當下同步執行
      } catch (e) {
        fail("inline script #" + index, e);
        return;
      }
      loadSequentially(specs, index + 1, pageInit);
    }
  }

  fetch(BASE)
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.text();
    })
    .then(function (html) {
      // DOMParser 解析出的 script 不會執行，正好用來當「待重建清單」
      var doc = new DOMParser().parseFromString(
        "<!doctype html><html><head>" + html + "</head><body></body></html>",
        "text/html"
      );

      var specs = [];
      Array.prototype.slice.call(doc.head.childNodes).forEach(function (node) {
        if (node.nodeType === Node.COMMENT_NODE) return;
        if (node.nodeType === Node.TEXT_NODE) return;
        if (node.tagName === "SCRIPT") {
          specs.push({
            src: node.getAttribute("src"),
            text: node.textContent,
            attrs: Array.prototype.slice.call(node.attributes),
          });
          return;
        }
        // meta / link / style 等非 script 節點：直接搬進本頁 head，維持原順序。
        // 這些不需要 onload 排序——CSS 的層級由 index.css 的 @import 順序決定，
        // 與插入時序無關。Tailwind 的 runtime <style> 一律落在這些之後（見 head.html 註解）。
        document.head.appendChild(document.importNode(node, true));
      });

      // 頁面自己的初始化腳本排最後，且不併進 specs——它要多等一個
      // DOMContentLoaded（理由見檔頭「page-init 必須等 DOMContentLoaded」）
      var initSrc = SELF && SELF.getAttribute("data-page-init");
      var pageInit = initSrc
        ? { src: initSrc, text: "", attrs: [{ name: "src", value: initSrc }] }
        : null;

      var hasInline = specs.some(function (s) { return !s.src; });
      if (hasInline) {
        console.warn("[head-loader] head.html 含 inline script，改用序列模式載入" +
                     "（inline script 一 append 就同步執行，平行模式會弄亂執行順序）。");
        loadSequentially(specs, 0, pageInit);
      } else {
        loadParallel(specs, pageInit);
      }
    })
    .catch(function (err) { fail(BASE, err); });
})();
