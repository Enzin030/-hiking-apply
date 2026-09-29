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
   之後這些頁建好了，把 `#` 換成檔名即可。

   2026-09-24 依會議紀錄（一）3 調整：
   - 預設只顯示 8 個，`more: true` 的收進右下角「more」（會議指名 PAC 與統計數據）。
     **用旗標而非「前 8 個」決定收合**，之後增減磁磚不會誤收別的項目。
   - PAC 沒有官方圖示檔，`glyph` 以文字「PAC」暫代；警政署以 fa-dove 暫代鴿子標誌。
     兩者皆〔待確認〕，待管處提供正式圖檔後換成圖片。
   - 「警政署入山管制區」只是首頁磁磚的名稱；會議指明內頁與圖台仍用專有名詞「山坡地經常管制區」。
   - 「待援點」涵蓋停機坪、吊掛點及山屋。
   - 「國家公園山域事故熱點」將進本系統圖台（事故座標畫約 2 公里範圍、縮小時聚合成數字），
     圖台尚未建置，維持 `#`；功能以最終討論版本為準。
   - 「統計數據」暫連既有的山域事故統計儀表板，應提供哪些統計〔待確認〕（會議待議）。 */
const EDU_FUNCTIONS = [
  { key: "video",    label: "登山安全影片",       icon: "fa-circle-play",         href: "https://www.youtube.com/watch?v=HgnaQaKFjNo&list=PL8CdSPNjegIZKIN75OXLB9uk_4eQmgsAm&index=3", external: true },
  { key: "weather",  label: "山區氣象",           icon: "fa-cloud-sun",           href: "information_2.html" },
  { key: "pac",      label: "PAC 位置",           glyph: "PAC",                   href: "#", more: true },
  { key: "peaks",    label: "百岳位置",           icon: "fa-mountain",            href: "#" },
  { key: "law",      label: "法令資訊",           icon: "fa-scale-balanced",      href: "#" },
  { key: "gear",     label: "步道分級及建議裝備", icon: "fa-list-check",          href: "information_6.html" },
  { key: "control",  label: "警政署入山管制區",   icon: "fa-dove",                href: "#" },
  { key: "helipad",  label: "待援點",             icon: "fa-helicopter",          href: "#" },
  { key: "accident", label: "國家公園山域事故熱點", icon: "fa-location-crosshairs", href: "#" },
  // 會議紀錄（一）4(3)：由登山線上申請區移入。收進 more 以維持預設 8 個——
  // 會議要求預設 8 個且只點名收合 PAC 與統計數據，但加上本項後不收就是 9 個，〔待確認〕。
  { key: "travel",   label: "旅遊登山資訊",       icon: "fa-compass",             href: "information_1.html", more: true },
  { key: "stats",    label: "統計數據",           icon: "fa-chart-column",        href: "accident-dashboard.html", more: true },
];

/* 登山線上申請 — 右區服務入口。對應關係取自 th-header.js 的 TH_HEADER_NAV，不自創路徑。
   「宿營地及床位查詢」原連 forest-camp-1.html（林場露營），與標籤不符，
   2026-09-18 改連 bed_0.html（林業及自然保育署宿營地查詢，導覽列該區第一項）。
   2026-09-24 依會議紀錄（一）4 調整：
   - 原「申請日期查詢」實為申請進度查詢（applySearch.html），改名以免與日期試算混淆。
   - 新增「可申請日期試算」（現行首頁公告右方的同名功能），`action` 項開彈窗而非換頁。
   - 「旅遊登山資訊」移到登山教育區；「登山須知」移除（與教育區「法令資訊」重複）。 */
const APPLY_LINKS = [
  { key: "apply",     label: "登山申請",         icon: "fa-pen-to-square",   href: "apply-1.html" },
  { key: "calc",      label: "可申請日期試算",   icon: "fa-calculator",      action: "calc" },
  { key: "progress",  label: "申請進度查詢",     icon: "fa-calendar-check",  href: "applySearch.html" },
  { key: "violation", label: "違規名單",         icon: "fa-user-xmark",      href: "news_5.html" },
  { key: "faq",       label: "常見問題",         icon: "fa-circle-question", href: "news_7.html" },
  { key: "status",    label: "登山路線開放狀態", icon: "fa-signs-post",      href: "open.html" },
  { key: "bed",       label: "宿營地及床位查詢", icon: "fa-bed",             href: "bed_0.html" },
];

/* 可申請日期試算 — 規則**以正式站首頁同名功能實測為準**（2026-09-29，入園日 2026-12-31／2027-03-31
   ／2026-10-01／2026-10-15 等多組比對；腳本在 scratchpad，未入版控）。
   可申請期間＝「入園日前 monthsBefore 個月（或 daysFrom 天）」至「入園日前 daysBefore 天」。

   routes：該單位在正式站有幾層路線下拉
     sub       路線＋次路線（太魯閣、雪霸）
     main      只有路線（國家步道）
     category  「路線」下拉其實是申請類別、沒有次路線（玉山：開放路線／長程縱走／外國人提前／其他）
     none      沒有路線，只填日期（三類自然保護區域）
   style：顯示格式照正式站
     park      「起~迄」，太魯閣另帶時刻「起 07:00 至 迄 15:00」
     forestry  「YYYY/MM/DD 至 YYYY/MM/DD」＋今天仍可申請／尚未開始／已截止

   實測結果：
   - 太魯閣 2 個月 07:00 至前 7 天 15:00；羊頭山單攻、畢祿山前 3 天。錐麓古道前 1 天
     （本雛形的錐麓古道是 demo 路線，不列入）。**不是**測試機 Fixedclimb 的 5 天。
   - 玉山 開放路線、長程縱走 2 個月～5 天；外國人提前 4 個月～35 天；其他路線 2 個月～10 天。附註為正式站原文。
   - 雪霸 2 個月～5 天；迄日已過時正式站只回「申請期限超過期限範圍」。正式站下拉不列外籍提前路線。
   - 國家步道、自然保留區、自然保護區 前 60 天～5 天；野生動物保護區 前 30 天～5 天。
     迄日等於今天時正式站已顯示「已截止」，故以 today >= 迄日 判定截止。
   順序與名稱照正式站下拉。 */
const CALC_UNITS = [
  { key: "taroko", label: "太魯閣國家公園管理處", org: "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
    routes: "sub", style: "park", monthsBefore: 2, daysBefore: 7, fromTime: "07:00", toTime: "15:00", sep: " 至 ",
    overrides: { "羊頭山單攻": { daysBefore: 3 }, "畢祿山": { daysBefore: 3 } } },
  { key: "yushan", label: "玉山國家公園管理處", routes: "category", style: "park",
    categories: [
      { value: "open",     label: "開放路線", monthsBefore: 2, daysBefore: 5,
        note: "預定住宿日前1個月抽籤，公告後可申請候補。" },
      { value: "long",     label: "開放(須具長程縱走登山經驗)路線", monthsBefore: 2, daysBefore: 5,
        note: "依序審查隊伍申請資格。" },
      { value: "foreign",  label: "外國人提前申請", monthsBefore: 4, daysBefore: 35,
        note: "非假日(週日至週四)每日提供24個名額，依序審查隊伍申請資格。" },
      { value: "other",    label: "其他路線", monthsBefore: 2, daysBefore: 10, note: "" },
    ] },
  { key: "shei-pa", label: "雪霸國家公園管理處", org: "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
    routes: "sub", style: "park", monthsBefore: 2, daysBefore: 5, expiredText: "申請期限超過期限範圍", hideForeign: true },
  { key: "trail",    label: "國家步道(山屋/營地)", org: "84BC7D2B-AD3E-4F39-B568-A96681087F74",
    routes: "main", style: "forestry", daysFrom: 60, daysBefore: 5 },
  { key: "reserve",  label: "自然保留區",     org: "7D0ED03D-E3FF-4482-8254-96F6434F5A85", routes: "none", style: "forestry", daysFrom: 60, daysBefore: 5 },
  { key: "protect",  label: "自然保護區",     org: "7D0ED03D-E3FF-4482-8254-96F6434F5A86", routes: "none", style: "forestry", daysFrom: 60, daysBefore: 5 },
  { key: "wildlife", label: "野生動物保護區", org: "7D0ED03D-E3FF-4482-8254-96F6434F5A87", routes: "none", style: "forestry", daysFrom: 30, daysBefore: 5 },
];

/* "YYYY-MM-DD" 往前 n 個月；目標月沒有該日時取月底（例：04-30 前 2 個月 → 02-28） */
function calcSubMonths(value, n) {
  var p = value.split("-").map(Number);
  var d = new Date(p[0], p[1] - 1 - n, 1);
  var last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(p[2], last));
  return window.thFormatDateInputValue(d);
}

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
      eduExpanded: false,
      // 可申請日期試算。ROUTE_DATA 是 body 底部的資料檔，須在 data() 內取（見 CLAUDE.md）
      calcOpen: false,
      calcUnits: CALC_UNITS,
      calcRoutesAll: (window.ROUTE_DATA || []).filter(function (r) { return !r.demo; }),
      calcUnit: CALC_UNITS[0].key,
      calcMain: "",       // 主路線（ROUTE_DATA.routeGroup；玉山為申請類別 value）
      calcRoute: "",      // 次路線（ROUTE_DATA.id）
      calcDate: "",
      calcError: "",
      calcResult: null,
      calcNow: "",        // 正式站同一區塊最上方的「現在時間」，開著彈窗時每秒更新
    };
  },
  computed: {
    /* 收合時只列非 more 項；展開時把 more 項接在後面，而非插回原位——
       插回原位會讓已看到的 8 個磁磚整批換位置。 */
    eduVisible() {
      var base = this.eduFunctions.filter(function (f) { return !f.more; });
      if (!this.eduExpanded) return base;
      return base.concat(this.eduFunctions.filter(function (f) { return f.more; }));
    },
    calcUnitObj() {
      var key = this.calcUnit;
      return this.calcUnits.find(function (u) { return u.key === key; });
    },
    calcShowMain() { return this.calcUnitObj.routes !== "none"; },
    calcShowSub() { return this.calcUnitObj.routes === "sub"; },
    // 以 orgId 對單位（ROUTE_DATA.unit 把三類自然保護區域併成一類，orgId 才分得開）
    calcRoutes() {
      var u = this.calcUnitObj;
      if (!u.org) return [];
      var org = u.org.toUpperCase();
      return this.calcRoutesAll.filter(function (r) {
        if ((r.orgId || "").toUpperCase() !== org) return false;
        return !(u.hideForeign && (r.displayName || r.name).indexOf("外籍提前") >= 0);
      });
    },
    /* 主路線：依資料出現順序去重（正式站下拉也是照 DB 順序，不重排）；玉山改列申請類別 */
    calcMainOptions() {
      var u = this.calcUnitObj;
      if (u.routes === "category") return u.categories.map(function (c) { return { value: c.value, label: c.label }; });
      var seen = {}, out = [];
      this.calcRoutes.forEach(function (r) {
        if (!seen[r.routeGroup]) { seen[r.routeGroup] = 1; out.push({ value: r.routeGroup, label: r.routeGroup }); }
      });
      return out;
    },
    calcSubOptions() {
      if (!this.calcShowSub) return [];
      var main = this.calcMain;
      return this.calcRoutes
        .filter(function (r) { return r.routeGroup === main; })
        .map(function (r) { return { value: r.id, label: r.displayName || r.name }; });
    },
    calcToday() { return window.thTodayValue(); },
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
    clearInterval(this._calcTimer);
  },
  methods: {
    /* 展開後焦點移到第一個新出現的磁磚：新磁磚在 DOM 上位於按鈕之前，
       不移焦點的話鍵盤使用者得倒退 Tab 才找得到。收合時焦點留在按鈕上。 */
    toggleEdu() {
      var self = this;
      var firstNew = this.eduFunctions.filter(function (f) { return !f.more; }).length;
      this.eduExpanded = !this.eduExpanded;
      if (!this.eduExpanded) return;
      this.$nextTick(function () {
        var tiles = self.$refs.eduGrid ? self.$refs.eduGrid.querySelectorAll(".th-tile") : [];
        if (tiles[firstNew]) tiles[firstNew].focus();
      });
    },
    openCalc() {
      var self = this;
      this.calcOpen = true;
      this.tickCalcNow();
      this._calcTimer = setInterval(function () { self.tickCalcNow(); }, 1000);
      this.$nextTick(function () {
        var first = document.getElementById("calc-unit");
        if (first) first.focus();
      });
    },
    // th-modal 不管焦點，關閉後自行還給觸發的磁磚
    closeCalc() {
      this.calcOpen = false;
      clearInterval(this._calcTimer);
      this.$nextTick(function () {
        var tile = document.querySelector('[data-tile="calc"]');
        if (tile) tile.focus();
      });
    },
    tickCalcNow() {
      var d = new Date(), pad = function (n) { return String(n).padStart(2, "0"); };
      this.calcNow = window.thFormatDateInputValue(d) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    },
    // 單位變了清主、次路線；主路線變了清次路線（正式站是 postback 重載下拉，效果相同）
    onCalcUnitChange() {
      this.calcMain = "";
      this.calcRoute = "";
      this.calcResult = null;
    },
    onCalcMainChange() {
      this.calcRoute = "";
      this.calcResult = null;
      // 只有一條次路線時直接帶入，免得多點一次
      if (this.calcSubOptions.length === 1) this.calcRoute = this.calcSubOptions[0].value;
    },
    calcFmt(value, style) { return style === "forestry" ? value.replace(/-/g, "/") : value; },
    runCalc() {
      var u = this.calcUnitObj;
      this.calcResult = null;
      var missing = [];
      if (this.calcShowMain && !this.calcMain) missing.push("路線");
      if (this.calcShowSub && !this.calcRoute) missing.push("次路線");
      if (!this.calcDate) missing.push("預計入園日期");
      if (missing.length) { this.calcError = "請選擇" + missing.join("、") + "。"; return; }
      this.calcError = "";

      var rule = u;
      if (u.routes === "category") {
        var main = this.calcMain;
        rule = u.categories.find(function (c) { return c.value === main; });
      } else if (u.overrides && u.overrides[this.calcMain]) {
        rule = Object.assign({}, u, u.overrides[this.calcMain]);
      }
      var from = rule.daysFrom ? window.thAddDaysToDateValue(this.calcDate, -rule.daysFrom)
                               : calcSubMonths(this.calcDate, rule.monthsBefore);
      var to = window.thAddDaysToDateValue(this.calcDate, -rule.daysBefore);
      var today = this.calcToday;
      var range = {
        from: this.calcFmt(from, u.style) + (u.fromTime ? " " + u.fromTime : ""),
        to: this.calcFmt(to, u.style) + (u.toTime ? " " + u.toTime : ""),
        sep: u.sep || (u.style === "forestry" ? " 至 " : "~"),
      };

      if (u.style === "forestry") {
        var status = today < from ? "可申請日期尚未開始，將於 " + this.calcFmt(from, u.style) + " 開始申請。"
          : today >= to ? "可申請日期已截止。"
          : "今天仍可申請！";
        this.calcResult = { range: range, message: status, note: "" };
        return;
      }
      if (u.expiredText && to < today) {
        this.calcResult = { range: null, message: u.expiredText, note: "" };
        return;
      }
      this.calcResult = { range: range, message: "", note: rule.note || "" };
    },
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
