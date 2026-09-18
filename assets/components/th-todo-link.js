/* th-todo-link — 尚未建置的頁面標記（原 Shared.jsx 的 TodoLink）
   不給 `#` 假路徑，改輸出非連結的「待建置」標記（2026-09-02 裁決）。
   樣式：assets/css/components.css 的 .th-todo-link。onDark = 深色底（footer）用的配色。 */
window.thComponents = window.thComponents || {};
window.thComponents["th-todo-link"] = {
  props: {
    label: { type: String, required: true },
    onDark: { type: Boolean, default: false },
    extraClass: { type: String, default: "" },
  },
  template: `
    <span :class="['th-todo-link', { 'on-dark': onDark }, extraClass]">{{ label }}</span>
  `,
};
