/* ============================================================
   information_1.js — 登山路線介紹（規格 02_Spec/23_登山路線介紹.md）
   ------------------------------------------------------------
   舊站 information_1.aspx。兩層頁籤，內容區依 kind 決定有哪些區塊。

   **window.* 一律在 data() 裡讀**：RouteIntroData.js 是 <body> 底部的
   parser-inserted script，本檔由 head-loader 佇列載入，兩者沒有保證的先後。
   模組層取值會拿到 undefined（踩坑總表第七類）。

   切換機關時把路線標籤重設為該機關的第一個——留著上一個機關的 id
   會找不到對應標籤，內容區整個變空白（prod build 不出聲）。
   ============================================================ */

/* 資料的落點，由 data() 填入 */
let INTRO_ORGS = [];
let INTRO_SECTIONS = {};
let INTRO_SECTION_META = {};

thPage({
  data() {
    INTRO_ORGS = window.ROUTE_INTRO_ORGS || [];
    INTRO_SECTIONS = window.ROUTE_INTRO_SECTIONS || {};
    INTRO_SECTION_META = window.ROUTE_INTRO_SECTION_META || {};

    const first = INTRO_ORGS[0];
    return {
      org: first ? first.key : "",
      tab: first && first.tabs[0] ? first.tabs[0].id : "",
    };
  },

  computed: {
    orgs() { return INTRO_ORGS; },

    currentOrg() {
      return INTRO_ORGS.find((o) => o.key === this.org) || { label: "", tabs: [], official: false };
    },

    tabs() { return this.currentOrg.tabs || []; },

    currentTab() {
      return this.tabs.find((t) => t.id === this.tab) || this.tabs[0] || { id: "", name: "", kind: "map" };
    },

    /* 由 kind 展開成該標籤要顯示的區塊清單 */
    sections() {
      const keys = INTRO_SECTIONS[this.currentTab.kind] || [];
      return keys.map((k) => Object.assign({ key: k }, INTRO_SECTION_META[k]));
    },
  },

  methods: {
    pickOrg(key) {
      this.org = key;
      const o = INTRO_ORGS.find((x) => x.key === key);
      this.tab = o && o.tabs[0] ? o.tabs[0].id : "";
    },
  },
});
