/* ============================================================
   th-callout — 提示區塊（原 Shared.jsx 的 Callout）
   ------------------------------------------------------------
   type = "warning" 時加 .is-warning 並改用三角警示圖示，否則用資訊圖示。
   icon 可覆寫圖示 class。內容走預設 slot（原 React 版是 children，
   內容常含連結，所以必須是 slot 而不是 prop）。

   外觀沿用 shared.css 既有的 .th-callout／.th-callout.is-warning，
   本元件不新增 CSS。
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
