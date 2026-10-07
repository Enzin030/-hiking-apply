/* ============================================================
   forest-camp-1.js — 山屋住宿申請 步驟 1：日期確認
   ------------------------------------------------------------
   原 ForestCamp1.jsx 階段 3 遷移；2026-10-07 依使用者要求改版，比照其他日期確認頁
   （apply_npa_1／apply_forest_area_1）並對照正式站 apply_forest_camp_1（2026-09-29 擷取 prod-FC001-S01-stay）：
   - 標題列「路線與基本資料」＋系統時間、受理時段提示、兩欄欄位、置中按鈕
   - 欄位：推薦行程（唯讀）、行程天數（下拉，正式站 2 起含下山日；晚數＝天數－1）、出發日期（今日＋5～60）、
     預計回程日（純文字）；出發人數拿掉（第 2 步逐晚選數量、隊伍資料決定人數，2026-10-07）；推薦行程、「查詢住宿」鈕拿掉（使用者 2026-10-07：比照正式站選完即查詢）
   - 山屋/營地概況：正式站 #CampsInfo 的月表（每列一種床位／營位、每欄一天、格內剩餘數量／現在申請數、
     可切換月份）。數字為固定種子示意值（沿用原可用量長條的算法）；選中區間（出發日～回程日）標底色；
     格內比照 bed_1 月曆的餘額呈現（共用 .th-bedcal-main／-unit／-num／-sub，0 顯示「額滿」）
   - 拿掉：山屋圖片卡、可用量長條（AvailabilityBar）、右欄注意事項與費用參考（正式站本步驟沒有；
     注意事項在同意聲明、費用在第 2 步試算）。pages.css 的 .p-fc1-* 規則因此不再使用，未清理
   概況一律顯示，改出發日時月份跟著切換。
   ============================================================ */

/* 逐頁參數：route 取自查詢字串，與 React 版同一行邏輯 */
const FC1_ROUTE_ID = new URLSearchParams(window.location.search).get("route") || "jiaming";
const FC1_CABIN = window.thFcIsShowcase() ? window.thFcShowcaseCabin()   // 元件總覽（見 th-forest-camp-shared.js）
  : window.TH_CABIN_DATA[FC1_ROUTE_ID] || window.TH_CABIN_DATA["jiaming"];
/* 只取一次：分兩次呼叫會在跨午夜時拿到不同的日期 */
const FC1_TODAY = window.thTodayValue();
/* 可選出發日：今日＋5 天起，至約 2 個月後（正式站 apply_forest_camp_1 的 TravelStep01StartDate：
   StartDay＝今日＋5、EndDay＝AddMonths(StartDay−5, 2)；注意事項「一般申請：住宿日前60日至前5日」） */
const FC1_MIN_DATE = window.thAddDaysToDateValue(FC1_TODAY, 5);
const FC1_MAX_DATE = window.thAddDaysToDateValue(FC1_TODAY, 60);

/* 山屋/營地概況（2026-10-07 改版，取代原可用量長條 AvailabilityBar）：
   原型用固定種子模擬每日剩餘數量與申請數，不是隨機——重新整理數字要一樣（沿用原長條的種子算法） */
function fc1Seed(dateStr, fid) { return (dateStr + fid).split("").reduce((a, c) => a + c.charCodeAt(0), 0); }
const FC1_WEEK = ["日", "一", "二", "三", "四", "五", "六"];

thPage({
  /* 每張申請從第 1 步重新開始：清掉上一張的第 3～6 步暫存（見 th-forest-camp-shared.js thFcState） */
  created() { window.thFcState.reset(); },

  data() {
    return {
      startDate: FC1_MIN_DATE,
      days: Math.min(3, FC1_CABIN.maxDays + 1),   // 行程天數預設 3（使用者 2026-10-07；天池上限 3）；正式站 2 起含下山日，晚數＝天數－1
      month: FC1_MIN_DATE.slice(0, 7),   // 概況表目前顯示的月份 YYYY-MM
      nowTime: new Date().toTimeString().slice(0, 5),
    };
  },

  computed: {
    // 唯讀常數，不進 data()（大宗資料常數不進 data() 的通則）
    cabin() { return FC1_CABIN; },
    applyCrumb() { return window.TH_APPLY_CRUMB; },
    nights() { return this.days - 1; },
    dayOptions() { const out = []; for (let n = this.cabin.minDays + 1; n <= this.cabin.maxDays + 1; n++) out.push(n); return out; },
    /* 可選出發日：今日＋5 天起至約 2 個月後（同改版前 th-date-picker 的 min／max） */
    dateOptions() {
      const out = [];
      for (let d = FC1_MIN_DATE; d <= FC1_MAX_DATE; d = window.thAddDaysToDateValue(d, 1)) out.push(d);
      return out;
    },
    endDate() { return this.startDate ? window.thAddDaysToDateValue(this.startDate, this.nights) : ""; },
    monthDates() {
      const [y, m] = this.month.split("-").map(Number);
      const n = new Date(y, m, 0).getDate();
      /* 只列可申請的日期（今日＋5～60），月初還不能申請的日子不佔欄位，預設就看得到本次住宿的晚上 */
      return Array.from({ length: n }, (_, i) => this.month + "-" + String(i + 1).padStart(2, "0")).filter(d => this.inRange(d));
    },
    monthLabel() { const [y, m] = this.month.split("-"); return y + " 年 " + Number(m) + " 月"; },
    canPrevMonth() { return this.month > FC1_MIN_DATE.slice(0, 7); },
    canNextMonth() { return this.month < FC1_MAX_DATE.slice(0, 7); },
  },

  watch: {
    /* 選完即查詢（比照正式站）：改出發日時概況表切到該月 */
    startDate(v) { if (v) this.month = v.slice(0, 7); },
  },

  methods: {
    shiftMonth(d) {
      const [y, m] = this.month.split("-").map(Number);
      const t = new Date(y, m - 1 + d, 1);
      this.month = t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0");
    },
    fmtDay(d) { return d.slice(5).replace("-", "/") + "（" + FC1_WEEK[new Date(d + "T00:00:00").getDay()] + "）"; },
    inRange(d) { return d >= FC1_MIN_DATE && d <= FC1_MAX_DATE; },
    /* 選中區間：出發日～回程日（共「行程天數」天，使用者 2026-10-07：不要只標出發日） */
    inTrip(d) { return !!this.startDate && d >= this.startDate && d <= this.endDate; },
    remain(f, d) { return Math.max(0, f.max - (fc1Seed(d, f.id) % (f.max + 1))); },
    applied(f, d) { return fc1Seed(d + "a", f.id) % (f.max * 2 + 1); },

    handleNext() {
      const params = new URLSearchParams({
        route: FC1_ROUTE_ID,
        start: this.startDate,
        nights: this.nights,
      });
      window.location.href = `forest-camp-2.html?${params}`;
    },

    goBack() { window.location.href = "apply-1.html"; },
  },
});
