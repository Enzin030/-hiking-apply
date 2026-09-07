/* ============================================================
   head-loader.js — 載入 assets/includes/head.html（計畫 §5 階段 1.3）
   ------------------------------------------------------------
   用法（頁面 <head> 內）：

     <script src="assets/includes/head-loader.js" data-page-init="components/xxx.js"></script>

   data-page-init（可省）：頁面自己的初始化腳本。會排在最後一支，
   保證前面的 Vue 與共用元件都已 onload 才執行。

   ------------------------------------------------------------
   為什麼不能用 innerHTML
   ------------------------------------------------------------
   `fetch` 回來的 HTML 直接塞 innerHTML，其中的 <script> **不會執行**
   （HTML 規範：innerHTML 插入的 script 不執行）。所以本檔把 script 節點
   一律用 document.createElement('script') 重建，並逐支等 onload 才接下一支。

   ------------------------------------------------------------
   完成訊號代表「依賴真的載入成功」，不是「節點已建立」
   ------------------------------------------------------------
   - 每支 script 逐一綁 onload / onerror
   - 全部 onload 後才 dispatch includesLoaded 事件
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
    state = "failed";
    console.error("[head-loader] 載入失敗：" + what + "。頁面依賴不完整，後續初始化已中止。", err || "");
    document.dispatchEvent(new CustomEvent("includesFailed", { detail: { what: what } }));
  }

  function done() {
    state = "loaded";
    document.dispatchEvent(new CustomEvent("includesLoaded"));
  }

  /* 依序建立 script：前一支 onload 才建下一支，保證
     Tailwind → config → Vue → 共用元件 → 頁面初始化 的順序 */
  function loadScriptsSequentially(specs, index) {
    if (index >= specs.length) { done(); return; }
    var spec = specs[index];
    var el = document.createElement("script");

    for (var i = 0; i < spec.attrs.length; i++) {
      el.setAttribute(spec.attrs[i].name, spec.attrs[i].value);
    }

    if (spec.src) {
      el.onload = function () { loadScriptsSequentially(specs, index + 1); };
      el.onerror = function (e) { fail(spec.src, e); };
      document.head.appendChild(el);
      // src 已在 attrs 內設好，appendChild 時開始載入
    } else {
      // inline script：appendChild 當下同步執行，不會觸發 onload
      el.textContent = spec.text;
      try {
        document.head.appendChild(el);
      } catch (e) {
        fail("inline script #" + index, e);
        return;
      }
      loadScriptsSequentially(specs, index + 1);
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
      var nodes = Array.prototype.slice.call(doc.head.childNodes);

      nodes.forEach(function (node) {
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

      // 頁面自己的初始化腳本排最後
      var pageInit = SELF && SELF.getAttribute("data-page-init");
      if (pageInit) {
        specs.push({ src: pageInit, text: "", attrs: [{ name: "src", value: pageInit }] });
      }

      loadScriptsSequentially(specs, 0);
    })
    .catch(function (err) { fail(BASE, err); });
})();
