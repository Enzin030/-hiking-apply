/* ============================================================
   bed_1.js — 雪霸宿營地查詢（對應正式站 bed_1.aspx）
   ------------------------------------------------------------
   資料在 components/Bed1Data.js（正式站快照）。依專案慣例，
   **只在 data() 裡讀 window.BED1_***，不在模組層讀——資料檔是 body 底部的
   一般 script，與本檔沒有保證的先後。

   版面比照 bed_0（2026-09-17 使用者指示），差異見 bed_1.html 檔頭。
   月份列與月曆由共用元件 th-bed-calendar 負責。
   ============================================================ */

thPage({
  data() {
    const sites = window.BED1_SITES || [];
    const first = sites.length && sites[0].months.length ? sites[0].months[0] : { y: 2026, m: 1 };
    /* 預設七卡山莊：沿用拆頁前 campsite.html 雪霸宿營地的預設 */
    const def = sites.find((s) => s.name === "七卡山莊") || sites[0];
    return {
      sites,
      labels: window.BED1_LABELS || [],
      notice: window.BED1_NOTICE || [],
      orgId: window.BED1_ORG_ID || "",
      siteId: def ? def.id : "",
      year: first.y,
      month: first.m,
      startYm: { y: first.y, m: first.m },
      day: null,
    };
  },

  computed: {
    /* 正式站年份下拉是 2026–2030 */
    years() { return [2026, 2027, 2028, 2029, 2030]; },
    site() { return this.sites.find((s) => s.id === this.siteId) || this.sites[0]; },
    monthData() {
      return this.site.months.find((m) => m.y === this.year && m.m === this.month) || null;
    },
    rangeText() {
      const ms = this.sites.length ? this.sites[0].months : [];
      if (!ms.length) return "";
      const a = ms[0];
      const b = ms[ms.length - 1];
      return `${a.y} 年 ${a.m} 月至 ${b.y} 年 ${b.m} 月`;
    },
    /* 交給 th-bed-calendar：每日 [餘額, 已通過]（數字），無資料為 null */
    calDays() {
      const md = this.monthData;
      if (!md) return null;
      const iRemain = this.labels.indexOf("餘額");
      const iPassed = this.labels.indexOf("已通過");
      return md.days.map((e) => (e ? [Number(e.v[iRemain]), Number(e.v[iPassed])] : null));
    },
    /* 當日申請名單頁（本站 bed_1main.html，比照正式站 bed_1main.aspx 的 node_id／sdate） */
    detailUrl() {
      if (!this.day) return "";
      return "bed_1main.html?node=" + encodeURIComponent(this.site.id) + "&date=" + this.day.s;
    },
  },

  methods: {
    /* 換地點時月份回到快照首月（比照正式站查詢後停在當月） */
    pickSite(id) {
      this.siteId = id;
      this.year = this.startYm.y;
      this.month = this.startYm.m;
      this.day = null;
    },
    pickDay(d) {
      const e = this.monthData && this.monthData.days[d - 1];
      if (!e) return;
      const mm = String(this.month).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      this.day = Object.assign({ date: `${this.year}-${mm}-${dd}` }, e);
    },
  },
});
