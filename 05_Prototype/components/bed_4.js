/* ============================================================
   bed_4.js — 太魯閣山屋查詢（對應正式站 bed_4.aspx）
   ------------------------------------------------------------
   資料在 components/Bed4Data.js（正式站快照）。
   依專案慣例，**只在 data() 裡讀 window.BED4_***，不在模組層讀。

   版面比照 bed_0 與 bed_1，並依太魯閣山屋規格（02_Spec/12_太魯閣山屋查詢.md）：
   - 宿營地點下拉（15 處宿營地），選取即切換月曆與山屋介紹。
   - 保留承載量總表（可收合/展開），表格內點選宿營地名稱可連動切換下方月曆。
   - 月曆概況使用共用元件 th-bed-calendar，格內顯示「餘額」與「已通過」，
     點擊日格彈出當日明細彈窗（含待處理、已通過、餘額）並可前往當日申請名單明細頁。
   - 月曆下方提供山屋介紹卡片（海拔高度、水源、廁所型式、通訊品質與住宿提醒）。
   ============================================================ */

thPage({
  data() {
    const sites = window.BED4_SITES || [];
    const first = sites.length && sites[0].months.length ? sites[0].months[0] : { y: 2026, m: 9 };
    /* 預設成功山屋 (125) 或首項 (124 黑水塘) */
    const def = sites.find((s) => s.id === "125") || sites[0];
    return {
      sites,
      labels: window.BED4_LABELS || ["餘額", "待處理", "已通過"],
      summary: window.BED4_SUMMARY || null,
      snapshotDate: window.BED4_SNAPSHOT_DATE || "2026-09-07",
      orgId: window.BED4_ORG_ID || "105e956f-d8da-49f7-a9b7-3aefdda88a12",
      siteId: def ? def.id : "",
      year: first.y,
      month: first.m,
      startYm: { y: first.y, m: first.m },
      day: null,
      showSummary: false, // 承載量總表預設收合，點按鈕展開
    };
  },

  computed: {
    /* 正式站年份下拉是 2026–2030 */
    years() { return [2026, 2027, 2028, 2029, 2030]; },
    site() {
      return this.sites.find((s) => s.id === this.siteId) || this.sites[0];
    },
    monthData() {
      if (!this.site || !this.site.months) return null;
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
      return md.days.map((e) => (e ? [Number(e.v[0]), Number(e.v[2])] : null));
    },
    /* 當日申請名單頁（bed_4main.html，比照正式站 bed_4main.aspx） */
    detailUrl() {
      if (!this.day) return "";
      return "bed_4main.html?node=" + encodeURIComponent(this.site.id) + "&date=" + this.day.s;
    },
  },

  methods: {
    pickSite(id) {
      this.siteId = id;
      this.year = this.startYm.y;
      this.month = this.startYm.m;
      this.day = null;
    },
    pickSiteAndScroll(id) {
      this.pickSite(id);
      this.$nextTick(() => {
        const el = document.getElementById("cal-section");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
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
