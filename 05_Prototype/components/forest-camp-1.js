/* ============================================================
   forest-camp-1.js — 山屋住宿申請 步驟 1：日期確認
   原 ForestCamp1.jsx（277 行）。版面已搬回 forest-camp-1.html。
   ============================================================

   ------------------------------------------------------------
   useState / useMemo → Vue 的逐一對應（不批次轉，逐項確認過）
   ------------------------------------------------------------
   | 原 React                        | Vue                  | 備註 |
   |---------------------------------|----------------------|------|
   | useState(todayStr)  startDate   | data.startDate       | 出發日 |
   | useState(cabin.minDays) nights  | data.nights          | 夜數，上下限來自 cabin |
   | useState(4)        headcount    | data.headcount       | 1～12（notice_b3） |
   | useState(false)    queried      | data.queried         | 查詢結果區與「下一步」的閘門 |
   | useMemo endDate [startDate,nights] | computed.endDate  | 依賴由 Vue 自動追蹤 |
   | canQuery（每次 render 重算）      | computed.canQuery    | 純函式，包成 computed 等價 |
   | 區域元件 AvailabilityBar          | components 的 p-fc1-avail-bar | 只有這頁用 |
   | 區域元件 DatePicker               | 共用的 th-date-picker | 見下 |

   ------------------------------------------------------------
   三件與 React 版不同的地方，逐一說明
   ------------------------------------------------------------
   一、**DatePicker 改用共用的 th-date-picker**。原檔自己包了一層
       `.th-field > .th-label + input[type=date].th-input`，與 th-date-picker
       的輸出同構（階段 2 建該元件時就是照這裡的形狀做的）。
       **唯一的 DOM 差異**：th-date-picker 會給 input 一個 id、label 一個對應的
       for，原 React 版兩者都沒有。外觀不變，但點 label 現在會聚焦欄位。
       這是元件在階段 2 就定案的設計，不是本次新增。

   二、**每個 setter 後面的 setQueried(false) 收斂成 methods**。原碼是三處
       各自 `setXxx(...); setQueried(false);`，Vue 改為 addNights／addHeadcount／
       setStartDate 三個方法，行為相同（改任一查詢條件就讓結果區失效）。

   三、**查詢按鈕的 className 尾端有個永遠成立的三元運算**
       （`${!canQuery ? "" : ""}`），輸出只是多一個尾端空白，DOM 正規化後相同，
       不重現。

   ------------------------------------------------------------
   inline style 照搬，沒有改成 class
   ------------------------------------------------------------
   可用量長條的 `width: N%` 與狀態色是**依資料算出來的**，不是固定值，
   無法收成靜態 class。原 React 用 inline style，這裡用 :style 綁同樣的物件，
   輸出的 style 屬性逐字相同。
   **與 apply-1 的處理不同是刻意的**：那裡是 `style={{marginBottom:8}}` 這種
   靜態值，收成 class 零風險；這裡收成 class 會改變行為。
   另外 scarce 狀態的 #dc2626 是原碼寫死的色碼、不在 tokens 內，照搬未動。
   ============================================================ */

/* 逐頁參數：route 取自查詢字串，與 React 版同一行邏輯 */
const FC1_ROUTE_ID = new URLSearchParams(window.location.search).get("route") || "jiaming";
const FC1_CABIN = window.TH_CABIN_DATA[FC1_ROUTE_ID] || window.TH_CABIN_DATA["jiaming"];
/* 只取一次：分兩次呼叫會在跨午夜時拿到不同的日期 */
const FC1_TODAY = window.thTodayValue();

const FC1_STATUS_LABEL = { avail: "充足", tight: "尚有名額", scarce: "名額有限", full: "已額滿" };
const FC1_STATUS_COLOR = { avail: "var(--success-fg)", tight: "var(--warning-fg)", scarce: "#dc2626", full: "var(--fg-4)" };
/* 長條底色與文字色不同源：full 狀態文字用 --fg-4、長條用 --slate-300（照原碼） */
const FC1_BAR_BG = {
  avail: "var(--success-fg)",
  tight: "var(--warning-fg)",
  scarce: "#dc2626",
  full: "var(--slate-300)",
};

/* 床位／營位可用狀態列（原 AvailabilityBar）。只有本頁用，走 options.components */
const pFc1AvailBar = {
  props: {
    facility: { type: Object, required: true },
    date: { type: String, default: "" },
    nights: { type: Number, default: 0 },
  },
  computed: {
    /* 原型用固定種子模擬每日可用數，不是隨機——重新整理數字要一樣 */
    seed() {
      return (this.date + this.facility.id).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    },
    available() {
      return Math.max(0, this.facility.max - (this.seed % (this.facility.max + 1)));
    },
    pct() { return Math.round((this.available / this.facility.max) * 100); },
    status() {
      return this.pct > 50 ? "avail" : this.pct > 20 ? "tight" : this.pct > 0 ? "scarce" : "full";
    },
    statusLabel() { return FC1_STATUS_LABEL[this.status]; },
    statusColor() { return FC1_STATUS_COLOR[this.status]; },
    barStyle() { return { width: this.pct + "%", background: FC1_BAR_BG[this.status] }; },
  },
  template: `
    <div v-if="date && nights" class="p-fc1-avail-row">
      <div class="p-fc1-avail-head">
        <span class="p-fc1-avail-icon"><i :class="facility.icon" aria-hidden="true"></i></span>
        <span class="p-fc1-avail-name">{{ facility.label }}</span>
        <span class="p-fc1-avail-status" :style="{ color: statusColor }">{{ statusLabel }}</span>
        <span class="p-fc1-avail-count">{{ available }} / {{ facility.max }} {{ facility.unit }}可預訂</span>
      </div>
      <div class="p-fc1-avail-bar-wrap">
        <div class="p-fc1-avail-bar" :style="barStyle"></div>
      </div>
      <div class="p-fc1-avail-meta">
        <span>每{{ facility.unit }} NT$ {{ facility.price.weekday }}～{{ facility.price.holiday }} / 晚</span>
        <span>{{ nights }} 晚 × {{ facility.max }} {{ facility.unit }} 上限</span>
      </div>
    </div>
  `,
};

thPage({
  components: { "p-fc1-avail-bar": pFc1AvailBar },

  data() {
    return {
      startDate: FC1_TODAY,
      nights: FC1_CABIN.minDays,
      headcount: 4,
      queried: false,
      todayStr: FC1_TODAY,
    };
  },

  computed: {
    // 唯讀常數，不進 data()（大宗資料常數不進 data() 的通則）
    cabin() { return FC1_CABIN; },
    applyCrumb() { return window.TH_APPLY_CRUMB; },

    endDate() {
      if (!this.startDate) return "";
      return window.thAddDaysToDateValue(this.startDate, this.nights);
    },
    canQuery() { return !!this.startDate && this.headcount >= 1; },
  },

  methods: {
    /* 改任一查詢條件都讓結果區失效——原碼是每個 setter 後面各接一次 */
    setStartDate(v) { this.startDate = v; this.queried = false; },
    addNights(d) {
      this.nights = d < 0
        ? Math.max(this.cabin.minDays, this.nights - 1)
        : Math.min(this.cabin.maxDays, this.nights + 1);
      this.queried = false;
    },
    addHeadcount(d) {
      /* 上限 12 依 notice_b3「每隊人數 1〜12 名」（原寫死 20，無依據） */
      this.headcount = d < 0 ? Math.max(1, this.headcount - 1) : Math.min(12, this.headcount + 1);
      this.queried = false;
    },

    handleQuery() { if (this.canQuery) this.queried = true; },

    handleNext() {
      const params = new URLSearchParams({
        route: FC1_ROUTE_ID,
        start: this.startDate,
        nights: this.nights,
        headcount: this.headcount,
      });
      window.location.href = `forest-camp-2.html?${params}`;
    },

    goBack() { window.location.href = "apply-1.html"; },
  },
});
