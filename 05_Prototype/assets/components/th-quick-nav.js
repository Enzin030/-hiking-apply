/* ============================================================
   th-quick-nav — 右下角快捷選單（原 Shared.jsx 的 ExperienceNav，含第三個互動）
   ------------------------------------------------------------
   互動三：**右下角快捷選單開關**（.th-quickbtn／.th-quickmask／.th-quickpanel）

   舊站是右下角浮動按鈕 `#f_search`（放大鏡 ＋「快捷選單」），點開 Bootstrap
   modal，標題「依據登山經驗建議參考資料」；本雛形沿用同一種呈現方式。
   項目與 href 取自 notice.aspx 的 modal 原始碼，`old` 欄位註記舊站對應頁；
   本雛形尚未建置的頁面留 href: null，點擊不導頁。

   2026-09-07：面板改為登山旅程五階段的流程式版面——序號徽章（01–05，由陣列
   順序推導）＋ 虛線山徑 ＋ 階段箭頭，襯底為 assets/teach/mountain-journey-background.svg。
   資料結構未變，只動呈現。

   未建置的項目輸出非連結的 <span class="is-todo">，不給 `#` 假路徑
   （2026-09-02 裁決）——原本是 <a href="#" onClick={preventDefault}>，看起來
   像連結、可聚焦、可複製網址，點下去卻沒有反應。「待建置」徽章由
   .th-expcard .is-todo::after 提供。

   全域副作用：開啟時對 body 加 .th-noscroll、綁 document keydown（Esc 關閉）。
   與 th-header 同樣受掛載契約「一頁一容器、全有全無」約束。
   React 版只在 open 時綁 listener；這裡改為 mounted 綁一次，noscroll 以 watch
   處理——省掉反覆增刪，行為相同。
   ============================================================ */

window.TH_EXPERIENCE_GROUPS = [
  {
    icon: "fa-solid fa-mountain",
    title: "認識登山",
    sub: "獲取登山知識",
    groups: [
      {
        label: "登山安全影片",
        items: [
          { label: "登山安全防護原則", href: "https://www.youtube.com/watch?v=HgnaQaKFjNo", kind: "external" },
          { label: "國家公園步道分級", href: "https://www.youtube.com/watch?v=OrVgsQFbuOs", kind: "external" },
          { label: "登山必要裝備", href: "https://www.youtube.com/watch?v=syBRav_eZAA", kind: "external" },
          { label: "登山留守制度", href: "https://www.youtube.com/watch?v=vvkmAks0fD8", kind: "external" },
          { label: "高山症處理與預防", href: "https://www.youtube.com/watch?v=e4_GSy6vdYI", kind: "external" },
        ],
      },
    ],
    items: [
      { label: "路線及景點介紹", old: "information_place.aspx" },
      { label: "如何申請入山／入園許可證", href: "web_illustrate.html", old: "web_illustrate.aspx" },
    ],
  },
  {
    icon: "fa-solid fa-map-location-dot",
    title: "規劃行程",
    sub: "選擇路線與地圖",
    items: [
      { label: "登山路線圖資查詢", old: "web_map2.aspx" },
      { label: "各機關登山申辦須知", href: "notice.html", old: "notice.aspx" },
      { label: "可申請路線查詢", href: "open.html", old: "open.aspx" },
      { label: "單日往返可申請數量", href: "campsite.html", old: "bed_7.aspx" },
      { label: "宿營地及山屋可申請數量", href: "campsite.html", old: "bed_0.aspx" },
    ],
  },
  {
    icon: "fa-solid fa-pen-to-square",
    title: "辦理申請",
    sub: "申請／修改資料",
    items: [
      { label: "線上申請", href: "apply-1.html", old: "apply_1.aspx" },
      { label: "草稿編輯", old: "apply_2_1.aspx" },
      /* 舊站入口是 applySearch.aspx（四選一），apply_3.aspx 是其中的進度查詢頁；
         本雛形把兩者併為 applySearch.html（2026-09-07 裁決）。 */
      { label: "申請進度查詢", href: "applySearch.html", old: "apply_3.aspx" },
      { label: "申請資料異動", old: "apply_2.aspx" },
      { label: "繳費／退費（含退費日期）查詢", old: "apply_4.aspx" },
    ],
  },
  {
    icon: "fa-solid fa-calendar-check",
    title: "行前確認",
    sub: "必要整備",
    items: [
      { label: "路線開放狀態查詢", href: "open.html", old: "open.aspx" },
      { label: "天候狀況查詢", old: "information_3.aspx" },
      { label: "登山教育影片", href: "https://www.youtube.com/playlist?list=PL8CdSPNjegIZKIN75OXLB9uk_4eQmgsAm", kind: "external" },
    ],
  },
  {
    icon: "fa-solid fa-person-hiking",
    title: "完成登山",
    sub: "下山回報",
    items: [{ label: "出園回報", old: "apply_6.aspx" }],
  },
];

window.thComponents = window.thComponents || {};
window.thComponents["th-quick-nav"] = {
  props: {
    title: { type: String, default: "依據登山經驗建議參考資料" },
    label: { type: String, default: "快捷選單" },
  },

  data() {
    return { open: false, groups: window.TH_EXPERIENCE_GROUPS };
  },

  watch: {
    open(v) { document.body.classList[v ? "add" : "remove"]("th-noscroll"); },
  },

  mounted() {
    var self = this;
    this._onKey = function (e) { if (e.key === "Escape") self.open = false; };
    document.addEventListener("keydown", this._onKey);
  },

  unmounted() {
    document.removeEventListener("keydown", this._onKey);
    document.body.classList.remove("th-noscroll");
  },

  methods: {
    isExternal(it) { return it.kind === "external"; },
  },

  template: `
    <button type="button" class="th-quickbtn" @click="open = true"
            aria-haspopup="dialog" :aria-expanded="open ? 'true' : 'false'">
      <i class="ph-bold ph-squares-four"></i>
      <span>{{ label }}</span>
    </button>

    <div v-if="open" class="th-quickmask" @click="open = false">
      <div class="th-quickpanel" role="dialog" aria-modal="true" :aria-label="title" @click.stop>
        <div class="th-quickpanel-head">
          <h2 class="bulletin-modal-title" style="margin: 0;">{{ title }}</h2>
          <button type="button" class="th-quickpanel-close" @click="open = false" aria-label="關閉">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="th-quickpanel-body">
          <!-- 頂部階段步驟列（完全比照首頁 5 階段風格） -->
          <ul class="th-quick-steps">
            <li v-for="g in groups" :key="g.title" :class="['th-quick-step', { 'is-active': g.title === '認識登山' }]">
              <span class="step-circle"><i :class="g.icon"></i></span>
              <strong>{{ g.title }}</strong>
              <small>{{ g.sub }}</small>
            </li>
          </ul>

          <!-- 下方選單卡片 -->
          <div class="th-expnav-grid">
            <div class="th-expcard" v-for="g in groups" :key="g.title">
              <div class="th-expcard-group" v-for="sub in (g.groups || [])" :key="sub.label">
                <div class="th-expcard-grouptitle">{{ sub.label }}</div>
                <ul class="th-expcard-nested">
                  <li v-for="(it, i) in sub.items" :key="i">
                    <span v-if="!it.href" :class="['is-todo', { 'is-external': isExternal(it) }]">
                      <i v-if="isExternal(it)" class="fa-solid fa-arrow-up-right-from-square"></i>{{ it.label }}
                    </span>
                    <a v-else :href="it.href"
                       :class="isExternal(it) ? 'is-external' : null"
                       :target="isExternal(it) ? '_blank' : null"
                       :rel="isExternal(it) ? 'noopener noreferrer' : null">
                      <i v-if="isExternal(it)" class="fa-solid fa-arrow-up-right-from-square"></i>{{ it.label }}
                    </a>
                  </li>
                </ul>
              </div>
              <ul v-if="g.items">
                <li v-for="(it, i) in g.items" :key="i">
                  <span v-if="!it.href" :class="['is-todo', { 'is-external': isExternal(it) }]">
                    <i v-if="isExternal(it)" class="fa-solid fa-arrow-up-right-from-square"></i>{{ it.label }}
                  </span>
                  <a v-else :href="it.href"
                     :class="isExternal(it) ? 'is-external' : null"
                     :target="isExternal(it) ? '_blank' : null"
                     :rel="isExternal(it) ? 'noopener noreferrer' : null">
                    <i v-if="isExternal(it)" class="fa-solid fa-arrow-up-right-from-square"></i>{{ it.label }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};
