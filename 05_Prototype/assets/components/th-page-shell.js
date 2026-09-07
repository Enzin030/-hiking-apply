/* ============================================================
   th-page-shell — 全站唯一的頁面外殼（原 Shared.jsx 的 PageShell）
   ------------------------------------------------------------
   DOM 結構與改版前完全相同，class 一個不改：

     .th-crumb                   麵包屑（th-breadcrumb）
     main.th-page                白底全幅外框
       .th-page-inner            1280 版心置中、左右 32 內距
         .th-page-head           標題／導言／更新日期
         [stepper slot]          申請流程步驟條，非申請頁不給
         .th-page-body[.has-nav] 內容區；有 nav 時為「主欄 ＋ 232 右側目錄」兩欄
           .th-page-main         主欄（flex column，區塊間距 24）
           [nav slot]            th-page-nav

   **本元件不含 header／footer**（v4 §5 階段 1.5 掛載契約）：
   `<th-header>`／`<th-footer>` 置於 `<th-page-shell>` 之外，避免 shell 包住
   內容又在內部另建島的重疊管理問題。

   props／slot 對照原 React：
     trail   → prop（陣列，傳給 th-breadcrumb）
     title   → prop
     lead    → prop（可省）
     updated → prop（可省）
     bare    → prop（不要 .th-page-main 的 flex 包裝，版面自帶 grid 的申請頁用）
     stepper → slot（原本是直接給 element，Vue 改用具名 slot）
     nav     → slot（給了才會變兩欄；has-nav 由 slot 是否存在自動判定）
     children→ 預設 slot
   ============================================================ */
window.thComponents = window.thComponents || {};
window.thComponents["th-page-shell"] = {
  props: {
    trail: { type: Array, default: () => [] },
    title: { type: String, required: true },
    lead: { type: String, default: "" },
    updated: { type: String, default: "" },
    bare: { type: Boolean, default: false },
  },
  computed: {
    // 原 React 是 `nav ? " has-nav" : ""`；Vue 改由 slot 是否有內容判定，
    // 頁面就不必同時給 nav slot 又給一個 has-nav 旗標（兩處會不同步）
    hasNav() { return !!this.$slots.nav; },
  },
  template: `
    <th-breadcrumb :trail="trail"></th-breadcrumb>
    <main class="th-page">
      <div class="th-page-inner">
        <div class="th-page-head">
          <h1 class="th-page-title">{{ title }}</h1>
          <p v-if="lead" class="th-page-lead">{{ lead }}</p>
          <div v-if="updated" class="th-page-meta">更新日期：{{ updated }}</div>
        </div>
        <slot name="stepper"></slot>
        <div :class="['th-page-body', { 'has-nav': hasNav }]">
          <template v-if="bare"><slot></slot></template>
          <div v-else class="th-page-main"><slot></slot></div>
          <slot name="nav"></slot>
        </div>
      </div>
    </main>
  `,
};
