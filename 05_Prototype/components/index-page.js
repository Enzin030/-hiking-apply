/* ============================================================
   index-page.js — 首頁的資料與初始化（原 Index.jsx）
   ------------------------------------------------------------
   版面已搬回 index.html；本檔只留三組資料與 thPage 登記。

   首頁 Index — 資訊與申請並重版型（115 改版）
   2026-09-03 版面統一：原是 index.html 內嵌的 <script type="text/babel">，
   同名的舊 components/Index.jsx 沒有任何頁面引用、內容也已過期，一併取代。
   樣式在 assets/css/components.css 的「首頁」段（.th-home-*／.th-tile*／.th-marquee*），
   2026-09-17 起版面 class 改用設計檔 home.css 的寫法，原 pages.css 的 .p-home-* 已刪除。

   首頁刻意保留自己的置中頁首（landing page 版型），不套用 th-header；
   其餘共用件（th-quick-nav、th-footer）走共用。
   ============================================================ */

/* 跑馬燈導到**對應的公告內頁**（2026-09-18 使用者指示）。
   內頁 news_0_1.html 以 ?id= 取文（見 components/news-detail.js 的 getQueryId）。
   **四則文字已改為 NewsData.js 既有公告的真實標題**——原本的文字有兩則
   （清明連假、颱風退費說明）在資料裡沒有對應公告，硬連會點到不相干的內容。
   id 對應：a1 奇萊吊掛／a2 雪霸雪季／a7 排雲容宿量／a10 颱風警覺。 */
const MARQUEE_ITEMS = [
  { text: "公告115年4月1日起至4月19日辦理奇萊稜線新山屋吊掛作業", href: "news_0_1.html?id=a1" },
  { text: "115年雪霸國家公園生態保護區雪季期間登山申請規定及注意事項", href: "news_0_1.html?id=a2" },
  { text: "排雲山莊容宿量調整措施延長辦理通知", href: "news_0_1.html?id=a7" },
  { text: "沙德爾颱風接近又逢大潮，國家公園署提醒山海遊憩提高警覺", href: "news_0_1.html?id=a10" },
];

/* 登山教育及路線介紹 — 8 項功能入口。
   **本頁是專案唯一容許 `#` 假連結的地方**（2026-09-18 使用者裁決）：
   首頁要拿去跟機關確認功能範圍，磁磚少一個就會被當成「沒有這項服務」，
   所以未建置的頁也給 `#`、不出待建置標記。
   其餘頁面一律維持「不給假連結」的慣例（見 th-header.js 的 url: null）。
   之後這些頁建好了，把 `#` 換成檔名即可。 */
const EDU_FUNCTIONS = [
  { key: "weather",  label: "山區氣象",           icon: "fa-cloud-sun",           href: "information_2.html" },
  { key: "pac",      label: "PAC 位置",           icon: "fa-briefcase-medical",   href: "#" },
  { key: "peaks",    label: "百岳位置",           icon: "fa-mountain",            href: "#" },
  { key: "law",      label: "法令資訊",           icon: "fa-scale-balanced",      href: "#" },
  { key: "gear",     label: "登山建議裝備清單",   icon: "fa-list-check",          href: "#" },
  { key: "control",  label: "山坡地經常管制區",   icon: "fa-triangle-exclamation", href: "#" },
  { key: "helipad",  label: "救難直升機停機坪",   icon: "fa-helicopter",          href: "#" },
  { key: "accident", label: "生態保護區事故熱點", icon: "fa-location-crosshairs", href: "#" },
];

// 登山線上申請 — 右區服務入口
/* 登山線上申請 — 右區服務入口。對應關係取自 th-header.js 的 TH_HEADER_NAV，
   不自創路徑；「申請日期查詢」雛形無對應頁，維持待建置。
   「宿營地及床位查詢」原連 forest-camp-1.html（林場露營），與標籤不符，
   2026-09-18 改連 bed_0.html（林業及自然保育署宿營地查詢，導覽列該區第一項）。 */
const APPLY_LINKS = [
  { key: "apply",     label: "登山申請",         icon: "fa-pen-to-square",   href: "apply-1.html" },
  { key: "datequery", label: "申請日期查詢",     icon: "fa-calendar-check",  href: "applySearch.html" },
  { key: "violation", label: "違規名單",         icon: "fa-user-xmark",      href: "news_5.html" },
  { key: "faq",       label: "常見問題",         icon: "fa-circle-question", href: "news_7.html" },
  { key: "status",    label: "登山路線開放狀態", icon: "fa-signs-post",      href: "open.html" },
  { key: "bed",       label: "宿營地及床位查詢", icon: "fa-bed",             href: "bed_0.html" },
  { key: "notice",    label: "登山須知",         icon: "fa-book-open-reader", href: "notice.html" },
  { key: "travel",    label: "旅遊登山資訊",     icon: "fa-compass",         href: "information_1.html" },
];

/* 語言選單（2026-09-17 依設計檔補上）
   首頁不用 th-header，所以這裡自備一份，鍵盤行為與 th-header.js 的「互動二」相同：
   ↓ 開啟並聚焦第一項、↑↓ 循環、Home／End、Esc 關閉並把焦點還給按鈕、
   Tab 移出或點外部自動關閉。語系清單沿用 th-header.js 定義的 window.TH_LANGUAGES。
   兩份邏輯重複，是抽成共用元件的候選（見 decisions.md 2026-09-17）。 */
thPage({
  data() {
    return {
      marqueeItems: MARQUEE_ITEMS,
      eduFunctions: EDU_FUNCTIONS,
      applyLinks: APPLY_LINKS,
      // 跑馬燈暫停鈕（WCAG 2.2.2）。系統設定「減少動態效果」時以暫停狀態載入
      marqueePaused: !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches),
      langOpen: false,
      currentLang: "zh-TW",
      languages: window.TH_LANGUAGES || [],
    };
  },
  computed: {
    currentLangLabel() {
      var self = this;
      var cur = this.languages.find(function (l) { return l.key === self.currentLang; });
      return cur ? cur.label : "";
    },
  },
  mounted() {
    var self = this;
    this._onClickOutside = function (e) {
      if (self.langOpen && self.$refs.langWrapper && !self.$refs.langWrapper.contains(e.target)) {
        self.closeLang(false);
      }
    };
    document.addEventListener("mousedown", this._onClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("mousedown", this._onClickOutside);
  },
  methods: {
    langItems() {
      var menu = this.$refs.langMenu;
      return menu ? Array.prototype.slice.call(menu.querySelectorAll("button")) : [];
    },
    openLang(focusFirst) {
      this.langOpen = true;
      var self = this;
      this.$nextTick(function () {
        if (focusFirst) {
          var list = self.langItems();
          if (list.length) list[0].focus();
        }
      });
    },
    closeLang(focusBtn) {
      this.langOpen = false;
      if (focusBtn && this.$refs.langBtn) this.$refs.langBtn.focus();
    },
    onLangBtnKey(e) {
      if (e.key === "ArrowDown") { e.preventDefault(); this.openLang(true); }
      else if (e.key === "Escape" && this.langOpen) { e.preventDefault(); this.closeLang(true); }
    },
    onLangMenuKey(e) {
      var list = this.langItems();
      if (!list.length) return;
      var idx = list.indexOf(document.activeElement);
      if (e.key === "Escape") { e.preventDefault(); this.closeLang(true); }
      else if (e.key === "ArrowDown") { e.preventDefault(); list[(idx + 1) % list.length].focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); list[(idx - 1 + list.length) % list.length].focus(); }
      else if (e.key === "Home") { e.preventDefault(); list[0].focus(); }
      else if (e.key === "End") { e.preventDefault(); list[list.length - 1].focus(); }
    },
    onLangFocusOut(e) {
      if (this.langOpen && this.$refs.langWrapper && !this.$refs.langWrapper.contains(e.relatedTarget)) {
        this.langOpen = false;
      }
    },
    pickLang(key) {
      this.currentLang = key;
      this.closeLang(true);
    },
  },
});
