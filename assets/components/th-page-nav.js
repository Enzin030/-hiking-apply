/* th-page-nav — 頁內目錄（原 Shared.jsx 的 PageNav）
   items = [{ id, label }]，錨點對應 th-card 的 id。
   給了本元件，th-page-shell 的內容區才會變成「主欄 ＋ 232 右側目錄」兩欄。 */
window.thComponents = window.thComponents || {};
window.thComponents["th-page-nav"] = {
  props: {
    items: { type: Array, required: true },
    title: { type: String, default: "本頁內容" },
  },
  template: `
    <nav class="th-pagenav">
      <p class="th-pagenav-title">{{ title }}</p>
      <ul>
        <li v-for="it in items" :key="it.id"><a :href="'#' + it.id">{{ it.label }}</a></li>
      </ul>
    </nav>
  `,
};
