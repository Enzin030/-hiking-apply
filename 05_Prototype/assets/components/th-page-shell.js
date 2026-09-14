/* ============================================================
   th-page-shell — 全站唯一的頁面外殼（原 Shared.jsx 的 PageShell）
   ------------------------------------------------------------
   DOM 結構（class 與改版前相同）：

     main#main.th-page           白底全幅外框
       #AC 導盲磚                中間主要內容區（Alt+C）
       .th-crumb                 麵包屑（th-breadcrumb）
       .th-page-inner            1280 版心置中、左右 32 內距
         .th-page-head           標題／導言／更新日期
         [stepper slot]          申請流程步驟條，非申請頁不給
         .th-page-body[.has-nav] 內容區；有 nav 時為「主欄 ＋ 232 右側目錄」兩欄
           .th-page-main         主欄（flex column，區塊間距 24）
           [nav slot]            th-page-nav

   **本元件不含 header／footer**（v4 §5 階段 1.5 掛載契約）：
   `<th-header>`／`<th-footer>` 置於 `<th-page-shell>` 之外，避免 shell 包住
   內容又在內部另建島的重疊管理問題。

   ------------------------------------------------------------
   已知的次像素差異：updated 那一行（2026-09-08 實測，可重現）
   ------------------------------------------------------------
   有傳 `updated` 的頁面，`更新日期：` 這一行與 React 版會有**約 43 個像素**的
   反鋸齒差異（全頁 0.001%、最大灰階差 50，集中在緊接冒號後那個數字的一格
   8x10 範圍內）。原因不是樣式：

     React  `更新日期：{updated}`  → **兩個相鄰的 text node**
     Vue    `更新日期：{{ updated }}` → 編譯成**一個串接後的 text node**

   瀏覽器以 text run 為單位做字形排版，run 的邊界不同會讓後面第一個字元的
   水平位置差幾分之一像素，於是反鋸齒不同。textContent 的字元碼逐一相同、
   computed 屬性逐一相同、視覺上看不出來。

   **不要為了消掉它而把值包進 <span>** —— 那會真的改變 DOM 結構，用一個真實的
   差異換掉一個不存在的差異。公告頁沒有這個現象，因為那些頁不傳 updated
   （正式站未標更新日期）。
   ------------------------------------------------------------

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
    <main id="main" class="th-page">
      <!-- 導盲磚：中間主要內容區（2026-09-14 無障礙骨架）。#main 是 th-header 跳至主要內容的目標。
           麵包屑移進 main、排在導盲磚之後（照設計檔）：原本麵包屑在 main 之外，
           「:::」會落到頁面標題那一列而不是內容區起點。 -->
      <a class="th-accesskey" id="AC" href="#AC" accesskey="C"
         title="快速鍵 Alt+C：中間主要內容區" aria-label="中間主要內容區（快速鍵 Alt+C）"><span aria-hidden="true">:::</span></a>
      <th-breadcrumb :trail="trail"></th-breadcrumb>
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
