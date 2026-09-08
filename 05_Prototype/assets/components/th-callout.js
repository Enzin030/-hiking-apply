/* ============================================================
   th-callout — 提示區塊（原 Shared.jsx 的 Callout）
   ------------------------------------------------------------
   type = "warning" 時加 .is-warning 並改用三角警示圖示，否則用資訊圖示。
   icon 可覆寫圖示 class。內容走預設 slot（原 React 版是 children，
   內容常含連結，所以必須是 slot 而不是 prop）。

   外觀沿用 shared.css 既有的 .th-callout／.th-callout.is-warning，
   本元件不新增 CSS。

   ------------------------------------------------------------
   用 slot 傳內文時的空白規則（2026-09-08 實測，凡有 slot 的元件都適用）
   ------------------------------------------------------------
   JSX 與 Vue template 對空白的處理不同：
   - JSX 把「行首／行尾的換行＋縮排」整段去掉
   - Vue 的 whitespace: 'condense' 只刪「純空白且含換行」的節點；
     「文字＋換行＋縮排」會折疊成「文字＋一個空白」

   所以要與 React 版逐字相同，**換行只能出現在兩段文字之間**，不能出現在
   文字與標籤之間：

       。↵進入…        ← 保留：JSX 也會折成「。 進入」的一個空白
       許可證。↵<span>  ← 不可：JSX 沒有空白，Vue 會多一個

   notice.html 實測：多那一個空白，內層 div 由 866.28px 變成 869.64px，
   全頁 600 個像素不同（justify 重新分配、徽章右移約 3px）。修正後降到 43px，
   剩下的是 th-page-shell 註解記載的 updated 那一行的既知差異。

   另外，Vue 的 slot 會在內容前後各留一個**空字串 text node**（fragment 的
   anchor），節點數因此比 React 多 2 個。實測寬度貢獻為 0，不影響版面，
   把內容擠成一行也不會消失——那是 Vue 內部機制，不是空白處理造成的。
   ============================================================ */
window.thComponents = window.thComponents || {};
window.thComponents["th-callout"] = {
  props: {
    type: { type: String, default: "" },
    icon: { type: String, default: "" },
  },
  computed: {
    iconClass() {
      if (this.icon) return this.icon;
      return this.type === "warning"
        ? "fa-solid fa-triangle-exclamation"
        : "fa-solid fa-circle-info";
    },
  },
  template: `
    <div :class="['th-callout', { 'is-warning': type === 'warning' }]">
      <i :class="iconClass"></i>
      <div><slot></slot></div>
    </div>
  `,
};
