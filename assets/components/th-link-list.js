/* ============================================================
   th-link-list — 條列連結（原 Shared.jsx 的 LinkList）
   ------------------------------------------------------------
   item：{ label, href, kind }
     kind — "internal"（站內頁）／"external"（外部網站）／"file"（附件下載）
            ／"todo"（連結目標未取得，標 [待確認]，不給假路徑）
     未給 kind 時：有 href → internal，沒有 → todo
   numbered = 顯示序號

   外部網站與檔案下載（PDF）都另開分頁，避免使用者離開本站——照原樣保留。

   外觀沿用 components.css 的 .th-linklist／.th-linkrow／.th-linkrow-num／
   .th-linkrow-text／.th-linkrow-icon／.th-todo-tag，本元件不新增 CSS。
   ============================================================ */
window.thComponents = window.thComponents || {};
window.thComponents["th-link-list"] = {
  props: {
    items: { type: Array, required: true },
    numbered: { type: Boolean, default: false },
  },

  data() {
    return {
      ICON: {
        internal: "fa-solid fa-angle-right",
        external: "fa-solid fa-arrow-up-right-from-square",
        file: "fa-solid fa-file-pdf",
      },
    };
  },

  methods: {
    kindOf(it) { return it.kind || (it.href ? "internal" : "todo"); },
    isTodo(it) { return this.kindOf(it) === "todo"; },
    newTab(it) {
      var k = this.kindOf(it);
      return k === "external" || k === "file";
    },
    iconOf(it) { return this.ICON[this.kindOf(it)]; },
  },

  template: `
    <ul class="th-linklist">
      <li v-for="(it, i) in items" :key="it.label">
        <div v-if="isTodo(it)" class="th-linkrow is-todo">
          <span v-if="numbered" class="th-linkrow-num">{{ i + 1 }}</span>
          <span class="th-linkrow-text">{{ it.label }}</span>
          <span class="th-todo-tag">待確認</span>
        </div>
        <a v-else class="th-linkrow" :href="it.href"
           :target="newTab(it) ? '_blank' : null"
           :rel="newTab(it) ? 'noopener noreferrer' : null">
          <span v-if="numbered" class="th-linkrow-num">{{ i + 1 }}</span>
          <span class="th-linkrow-text">{{ it.label }}</span>
          <i :class="['th-linkrow-icon', iconOf(it)]" aria-hidden="true"></i>
        </a>
      </li>
    </ul>
  `,
};
