/* ============================================================
   bed_0.js — 林業及自然保育署宿營地查詢（對應正式站 bed_0.aspx）
   ------------------------------------------------------------
   資料在 components/Bed0Data.js（正式站快照）。依專案慣例，
   **只在 data() 裡讀 window.BED0_***，不在模組層讀——資料檔是 body 底部的
   一般 script，與本檔沒有保證的先後。

   與正式站的刻意差異（2026-09-17 使用者裁決）：
   - 進頁面預設天池，並直接出月曆（正式站要先按查詢）。
   - 地點與設施都是按鈕，點了就切換（正式站是下拉＋查詢）。
   - 月曆一次只看一個設施：格內「剩餘 N」與「申請 N」，白底，額滿改顯示「額滿」
     （正式站格內列出該地全部設施的兩個數字）。

   月份列與月曆由共用元件 th-bed-calendar 負責（2026-09-17 提升，bed_1 也用）。
   仍比照正式站：上個月／年／月／下個月可換月，年份 2026–2030。
   快照範圍外的月份明說沒有資料，不編數字。
   ============================================================ */

thPage({
  data() {
    const sites = window.BED0_SITES || [];
    const first = sites.length && sites[0].months.length ? sites[0].months[0] : { y: 2026, m: 1 };
    const tianchi = sites.find((s) => s.name.indexOf("天池") === 0) || sites[0];
    return {
      sites,
      siteId: tianchi ? tianchi.id : "",
      facilityPick: "",
      year: first.y,
      month: first.m,
      startYm: { y: first.y, m: first.m },
    };
  },

  computed: {
    /* 正式站年份下拉是 2026–2030 */
    years() { return [2026, 2027, 2028, 2029, 2030]; },
    site() { return this.sites.find((s) => s.id === this.siteId) || null; },
    /* 該地點出現過的設施，依正式站格內順序 */
    facilities() {
      const seen = [];
      (this.site ? this.site.months : []).forEach((m) =>
        m.days.forEach((items) => items.forEach((it) => { if (!seen.includes(it[0])) seen.push(it[0]); })));
      return seen;
    },
    facility() {
      return this.facilities.includes(this.facilityPick) ? this.facilityPick : (this.facilities[0] || "");
    },
    monthData() {
      if (!this.site) return null;
      return this.site.months.find((m) => m.y === this.year && m.m === this.month) || null;
    },
    rangeText() {
      const ms = this.sites.length ? this.sites[0].months : [];
      if (!ms.length) return "";
      const a = ms[0];
      const b = ms[ms.length - 1];
      return `${a.y} 年 ${a.m} 月至 ${b.y} 年 ${b.m} 月`;
    },
    /* 交給 th-bed-calendar：每日 [剩餘, 申請]，當日無此設施為 null；整月無快照為 null */
    calDays() {
      const md = this.monthData;
      if (!md) return null;
      return md.days.map((items) => {
        const hit = items.find((it) => it[0] === this.facility);
        return hit ? [hit[1], hit[2]] : null;
      });
    },
  },

  methods: {
    /* 換地點時設施回到該地第一項，月份回到快照首月（比照正式站查詢後停在當月） */
    pickSite(id) {
      this.siteId = id;
      this.facilityPick = "";
      this.year = this.startYm.y;
      this.month = this.startYm.m;
    },
  },
});
