/* ============================================================
   app-boot.js — Vue 掛載契約（計畫 §5 階段 1.5，2026-09-07 使用者確認）
   ------------------------------------------------------------
   契約六條，全站一致，不逐頁自訂：

   1. **每頁單一 createApp**，掛在包住整個內容區的容器上。
      多島各自註冊全部共用元件是重複工，除非某頁真的必要——那時每個 app
      都必須各自註冊全部元件（計畫 §5 階段 1.5）。

   2. **容器 id 固定 `#th-app`**。不逐頁自訂，也**絕不重用 `#root`**
      ——併存期 `#root` 是 React 專屬，兩個框架不得管理同一段 DOM。

   3. **掛載範圍＝今天 `<div class="bg-white min-h-screen text-slate-800
      antialiased">` 的角色**：th-header 到 th-footer，modal 也在容器內。
      Vue 會保留掛載元素自身的 attribute，所以那組 wrapper class 直接寫在
      容器上，不會被 template 蓋掉。

   4. **容器包住全部 → 內部不得再另建島。** `th-page-shell` 已在容器內，
      不可在它裡面再 createApp——兩個 Vue 實例會爭奪同一段 DOM。

   5. **遷移後該頁刪掉 `#root`，只留 `#th-app`。** 併存期一頁若同時有兩者，
      兩塊 DOM 必須完全不相交（本檔會實際檢查並回報）。

   6. **逐頁參數沿用現有慣例**：改版前 notice_*.html 是
      `<div id="root" data-notice="a1">`，由 NoticeDetail.jsx 讀
      `rootEl.dataset.notice`。改成 `<div id="th-app" data-notice="a1">`，
      由本檔讀出後以 `$page` 提供給所有元件（`this.$page.notice`）。

   ------------------------------------------------------------
   為什麼契約是「一頁一容器、全有全無」，而不是「兩框架共用一頁」
   ------------------------------------------------------------
   React／Vue 同頁並存**只有階段 1 驗收需要**（見 _island-test.html）。
   階段 3 第 7 項會移除該頁的 React，所以真實頁面永遠不會半 React 半 Vue。

   而且半半的頁面是**實際錯誤**、不只是不整齊：Shared.jsx 的 Header 在
   document 層綁 keydown／mousedown（Shared.jsx:63-74），並切換
   body.th-noscroll；React Header 與 Vue th-header 同時存在會雙重綁定、
   scroll lock 互搶。**所以同一頁不得同時有兩套 header／footer。**

   ------------------------------------------------------------
   用法
   ------------------------------------------------------------
   頁面的初始化腳本（head-loader 的 data-page-init）只需登記 root options：

       thPage({
         data() { return { keyword: "", modal: null }; },
         computed: { ... },
         methods: { ... },
       });

   實際 createApp／註冊／mount 由本檔在 includesLoaded 後執行——因為
   page-init 是 loader 的最後一支，執行時序一定早於 includesLoaded。
   沒有 page-init 的純靜態頁不必寫，本檔會以空 options 掛載，
   共用元件照樣生效。

   共用元件的登記方式（階段 2 的每支元件檔都這樣寫）：

       window.thComponents = window.thComponents || {};
       window.thComponents["th-header"] = { props: {...}, template: `...` };

   ------------------------------------------------------------
   mounted() 裡不能量版面 —— v-cloak 那時還在（2026-09-09 實測）
   ------------------------------------------------------------
   `[v-cloak] { display: none }` 是靠 Vue 掛載後移除屬性才解除的，而
   **`mounted()` 執行時屬性還在**，整個 `#th-app` 仍是 `display: none`。
   於是 `getBoundingClientRect()`／`offsetTop`／`clientHeight` 全部回 0。

   實測（apply-2 的 scroll-spy）：19 條條文的 top 全讀成 0，於是全部滿足
   `top <= 160`，「目前條款」停在最後一條（React 是第 0 條）。
   **像素比對抓不到**——.is-active 的視覺差異落在初始捲動範圍外，
   是互動對照才發現的。

   要在進頁面時先量一次，排進 `requestAnimationFrame`：

     mounted() {
       window.addEventListener("scroll", this._sync, { passive: true });
       requestAnimationFrame(() => this.sync());   // ← 不要直接 this.sync()
     }

   原 React 用 `useEffect`（在 paint 之後才跑）不會遇到這件事，
   requestAnimationFrame 是最接近的對應。

   ============================================================ */

(function () {
  "use strict";

  var MOUNT_ID = "th-app";
  var pageOptions = null;

  /* 頁面登記 root options；重複呼叫視為錯誤（一頁一個 app） */
  window.thPage = function (options) {
    if (pageOptions) {
      console.error(
        "[app-boot] thPage() 被呼叫超過一次。契約是每頁單一 createApp，" +
        "請把 data／methods 合併成一份，不要分次登記。"
      );
      return;
    }
    pageOptions = options || {};
  };

  function checkContract(el) {
    var rootEl = document.getElementById("root");
    if (!rootEl) return true;

    // 併存期允許同頁有 #root，但兩塊 DOM 必須完全不相交（契約第 5 條）
    if (el.contains(rootEl) || rootEl.contains(el)) {
      console.error(
        "[app-boot] 違反掛載契約：#th-app 與 #root 互相包含，兩個框架會管理" +
        "同一段 DOM。請讓兩者成為兄弟節點，或（已遷移的頁面）直接刪掉 #root。"
      );
      return false;
    }
    console.warn(
      "[app-boot] 本頁同時存在 #root（React）與 #th-app（Vue）。" +
      "這只該出現在階段 1 的驗收頁 _island-test.html；已遷移的頁面應刪掉 #root。" +
      "另注意同頁不得同時有 React Header 與 th-header——兩者都在 document 層" +
      "綁事件並切換 body.th-noscroll，會雙重綁定。"
    );
    return true;
  }

  function boot() {
    var el = document.getElementById(MOUNT_ID);
    if (!el) {
      // 未遷移頁沒有 #th-app 是正常的，不吵
      return;
    }
    if (typeof Vue === "undefined") {
      console.error("[app-boot] Vue 未載入，無法掛載。請確認 head.html 的 Vue script 有成功載入。");
      return;
    }
    if (!checkContract(el)) return;

    // **掛載成功不等於初始化生效。** 純靜態頁沒有 page-init 是正常的（見檔頭「用法」），
    // 但頁面若宣告了 data-page-init 而 thPage() 從未被呼叫，就是壞掉了——
    // 腳本 404、檔名打錯、或在呼叫前先拋錯，都會讓這裡以空 options 掛載，
    // 畫面渲染出外殼、資料全空，而 console 一聲不吭（prod build 不發 warning）。
    var declared = document.querySelector("script[data-page-init]");
    if (declared && !pageOptions) {
      console.error(
        "[app-boot] 頁面宣告了 data-page-init=\"" +
        declared.getAttribute("data-page-init") +
        "\"，但 thPage() 從未被呼叫。將以空 options 掛載——" +
        "頁面資料不會生效。請確認該腳本存在、且在頂層呼叫了 thPage()。"
      );
    }
    var options = pageOptions || {};
    var app = Vue.createApp(options);

    // 全域註冊共用元件：一次註冊，32 頁共用（計畫 §3 配套規則）
    var registry = window.thComponents || {};
    var names = Object.keys(registry);
    names.forEach(function (name) { app.component(name, registry[name]); });

    // 契約第 6 條：容器的 data-* 以 $page 提供給所有元件
    app.config.globalProperties.$page = Object.assign({}, el.dataset);

    app.config.errorHandler = function (err, vm, info) {
      console.error("[app-boot] Vue 執行期錯誤（" + info + "）：", err);
    };

    try {
      app.mount("#" + MOUNT_ID);
    } catch (e) {
      console.error("[app-boot] 掛載 #" + MOUNT_ID + " 失敗：", e);
      return;
    }
    window.thApp = app;
  }

  if (typeof window.onIncludesLoaded === "function") {
    window.onIncludesLoaded(boot);
  } else {
    // 沒有走 head-loader 的頁面（例如手動 link Vue）也能用
    console.warn("[app-boot] 找不到 onIncludesLoaded，改用 DOMContentLoaded。" +
                 "正常情況應由 assets/includes/head-loader.js 載入本檔。");
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else { boot(); }
  }
})();
