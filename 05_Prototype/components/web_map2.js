/* ============================================================
   web_map2.js — 登山路線圖資查詢（規格 02_Spec/22_登山路線圖資查詢.md）
   ------------------------------------------------------------
   舊站 web_map2.aspx。圖台是佔位框（理由見 web_map2.html 檔頭），
   查詢條件、圖層開關、結果清單三者可操作。

   **ROUTE_DATA 一律在 data() 裡讀**，不在模組層。
   它由 <body> 底部的 components/RouteData.js 提供，而本檔由 head-loader
   佇列載入，兩者沒有保證的先後；模組層取值會拿到 undefined
   （踩坑總表第七類，information_4.js 踩過同一個坑）。
   ============================================================ */

const MAP2_MODES = [
  { key: "select", label: "選擇路線查詢", icon: "fa-solid fa-list-ul" },
  { key: "keyword", label: "輸入關鍵字查詢", icon: "fa-solid fa-keyboard" },
];

/* 管理單位：舊站的 8 個選項。前 5 個對得上 ROUTE_DATA 的 agency，
   後 3 個（自然保留區／自然保護區／野生動物保護區）在現有資料沒有對應路線，
   選了會查無資料——照舊站保留選項，不刪。 */
const MAP2_ORGS = [
  { id: "taroko", name: "太魯閣國家公園管理處" },
  { id: "yushan", name: "玉山國家公園管理處" },
  { id: "shei-pa", name: "雪霸國家公園管理處" },
  { id: "forestry", name: "國家步道(山屋/營地)" },
  { id: "police", name: "警政署入山" },
  { id: "reserve", name: "自然保留區" },
  { id: "protect", name: "自然保護區" },
  { id: "wildlife", name: "野生動物保護區" },
];

const MAP2_BASEMAPS = [
  { id: "google", label: "GoogleMap" },
  { id: "osm", label: "開放地圖" },
  { id: "emap5", label: "臺灣通用電子地圖(含等高線)" },
];

/* 19 個疊加圖層，id 沿用舊站的 checkbox id（接圖台時可直接對照） */
const MAP2_OVERLAY_GROUPS = [
  {
    title: "遊客中心（點位）",
    layers: [
      { id: "VisitorCenter_Taroko", label: "太管處遊客中心" },
      { id: "VisitorCenter_Yushan", label: "玉管處遊客中心" },
      { id: "VisitorCenter_SheiPa", label: "雪管處遊客中心" },
    ],
  },
  {
    title: "救難停機坪（點位）",
    layers: [
      { id: "EmergencyHelipad_Taroko", label: "太管處救難停機坪" },
      { id: "EmergencyHelipad_Yushan", label: "玉管處救難停機坪" },
      { id: "EmergencyHelipad_SheiPa", label: "雪管處救難停機坪" },
    ],
  },
  {
    title: "可通訊據點（點位）",
    layers: [
      { id: "CommunicationOutpost_Taroko", label: "太管處可通訊據點" },
      { id: "CommunicationOutpost_Yushan", label: "玉管處可通訊據點" },
      { id: "CommunicationOutpost_SheiPa", label: "雪管處可通訊據點" },
    ],
  },
  {
    title: "國家公園分區圖（面圖）",
    layers: [
      { id: "NationalParkZoningMap_Taroko", label: "太管處國家公園分區圖" },
      { id: "NationalParkZoningMap_Yushan", label: "玉管處國家公園分區圖" },
      { id: "NationalParkZoningMap_SheiPa", label: "雪管處國家公園分區圖" },
    ],
  },
  {
    title: "國家公園範圍（面圖）",
    layers: [
      { id: "NationalParkArea_Taroko", label: "太管處國家公園範圍" },
      { id: "NationalParkArea_Yushan", label: "玉管處國家公園範圍" },
      { id: "NationalParkArea_SheiPa", label: "雪管處國家公園範圍" },
    ],
  },
  {
    title: "國家生態保護區（面圖）",
    layers: [
      { id: "EcologicalProtectionArea_Taroko", label: "太管處國家生態保護區" },
      { id: "EcologicalProtectionArea_Yushan", label: "玉管處國家生態保護區" },
      { id: "EcologicalProtectionArea_SheiPa", label: "雪管處國家生態保護區" },
    ],
  },
  {
    title: "應申請入山證範圍（面圖）",
    layers: [{ id: "NAPControlledArea_Nap", label: "應申請入山證範圍" }],
  },
];

/* ROUTE_DATA 的落點：由 data() 於掛載時填入（那時 body 的資料檔必定已執行），
   再由 computed.routes 回傳。**不放進 data() 回傳的物件**——112KB 的陣列
   進了 data() 會被 Vue 深度轉成 reactive proxy，白付代價，本頁也不會改它。 */
let MAP2_ROUTES = [];

const MAP2_LEVEL_TEXT = {
  1: "第 1 級：路徑明確、坡度平緩，一般體能即可完成。",
  2: "第 2 級：有連續上坡與少量岩石地形，需基本登山經驗。",
  3: "第 3 級：多日行程或有較長陡上，需具備體能與裝備。",
  4: "第 4 級：長天數縱走或高落差，需充足高山經驗。",
  5: "第 5 級：地形複雜、撤退不易，需熟練攀降與確保技術。",
  6: "第 6 級：路況不明或需技術攀登，僅適合具專業能力的隊伍。",
};

thPage({
  data() {
    /* window.* 一律在這裡取，不在模組層（見檔頭） */
    MAP2_ROUTES = window.ROUTE_DATA || [];

    return {
      mode: "select",
      org: "",
      mainRoute: "",
      subRoute: "",
      keyword: "",
      applied: null,

      layerOpen: false,
      baseMap: "google",
      overlays: [],
      plotted: [],
      levelModal: null,

      modes: MAP2_MODES,
      orgOptions: MAP2_ORGS,
      baseMaps: MAP2_BASEMAPS,
      overlayGroups: MAP2_OVERLAY_GROUPS,
    };
  },

  computed: {
    routes() { return MAP2_ROUTES; },

    layerCount() {
      return MAP2_BASEMAPS.length + MAP2_OVERLAY_GROUPS.reduce((n, g) => n + g.layers.length, 0);
    },

    baseLabel() {
      const b = MAP2_BASEMAPS.find((x) => x.id === this.baseMap);
      return b ? b.label : "未選定";
    },

    activeOverlays() { return this.overlays; },

    /* 主路線清單：同一個 routeGroup 只留一筆 */
    mainOptions() {
      if (!this.org) return [];
      const seen = [];
      this.routes.forEach((r) => {
        if (r.agency !== this.org) return;
        const g = r.routeGroup || r.name;
        if (seen.indexOf(g) === -1) seen.push(g);
      });
      return seen;
    },

    subOptions() {
      if (!this.mainRoute) return [];
      return this.routes
        .filter((r) => r.agency === this.org && (r.routeGroup || r.name) === this.mainRoute)
        .map((r) => ({ id: r.id, name: r.displayName || r.name }));
    },

    /* 查詢前（applied 為 null）不列任何結果，與舊站 PostBack 後才有清單一致 */
    results() {
      if (!this.applied) return [];
      const a = this.applied;
      let list = this.routes;

      if (a.mode === "keyword") {
        const kw = a.keyword.trim();
        if (!kw) return [];
        list = list.filter((r) => (r.displayName || r.name).indexOf(kw) !== -1);
      } else {
        if (a.org) list = list.filter((r) => r.agency === a.org);
        if (a.mainRoute) list = list.filter((r) => (r.routeGroup || r.name) === a.mainRoute);
        if (a.subRoute) list = list.filter((r) => r.id === a.subRoute);
      }

      return list.map((r) => {
        const name = r.displayName || r.name;
        /* 舊站的路線名稱含天數，例如「2~5天(塔塔加 - 玉山線 - 塔塔加)」。
           路線名本身已含天數字樣時不再前綴，否則會出現
           「單日往返（玉山前峰單日往返）」這種重複。 */
        const label =
          r.durationLabel && name.indexOf(r.durationLabel) === -1
            ? r.durationLabel + "（" + name + "）"
            : name;

        return {
          id: r.id,
          name: name,
          label: label,
          diff: r.diff,
          status: r.status,
          canApply: r.status === "open",
          requiresNpa: !!r.requiresNpa,
        };
      });
    },

    levelText() {
      if (!this.levelModal) return "";
      return MAP2_LEVEL_TEXT[this.levelModal.diff] || "分級說明待確認。";
    },
  },

  methods: {
    pickOrg(v) {
      this.org = v;
      this.mainRoute = "";
      this.subRoute = "";
    },

    pickMain(v) {
      this.mainRoute = v;
      this.subRoute = "";
    },

    search() {
      this.applied = {
        mode: this.mode,
        org: this.org,
        mainRoute: this.mainRoute,
        subRoute: this.subRoute,
        keyword: this.keyword,
      };
    },

    reset() {
      this.org = "";
      this.mainRoute = "";
      this.subRoute = "";
      this.keyword = "";
      this.applied = null;
      this.plotted = [];
    },

    toggleOverlay(id) {
      const i = this.overlays.indexOf(id);
      if (i === -1) this.overlays.push(id);
      else this.overlays.splice(i, 1);
    },

    togglePlot(id) {
      const i = this.plotted.indexOf(id);
      if (i === -1) this.plotted.push(id);
      else this.plotted.splice(i, 1);
    },
  },
});
