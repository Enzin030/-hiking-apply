/* ============================================================
   bed_4main.js — 太魯閣山屋「當日申請名單」明細（對應正式站 bed_4main.aspx）
   ------------------------------------------------------------
   資料在 components/Bed4MainData.js 及 components/Bed4Data.js。
   依專案慣例，只在 data() 裡讀取 window.*。
   ============================================================ */

thPage({
  data() {
    const sites = window.BED4_SITES || [];
    const notes = window.BED4MAIN_NOTES || [];
    const params = new URLSearchParams(window.location.search);
    const qNode = params.get("node") || "";
    const qDate = params.get("date") || "";

    const defSite = sites.find((s) => s.id === qNode) || sites.find((s) => s.id === "125") || sites[0];
    const defDate = qDate && /^\d{4}-\d{2}-\d{2}$/.test(qDate) ? qDate : "2026-09-25";

    return {
      sites,
      notes,
      siteId: defSite ? defSite.id : "",
      date: defDate,
      draftSite: defSite ? defSite.id : "",
      draftDate: defDate,
    };
  },

  computed: {
    site() {
      return this.sites.find((s) => s.id === this.siteId) || this.sites[0];
    },
    key() {
      return `${this.siteId}|${this.date}`;
    },
    rec() {
      const all = window.BED4MAIN || {};
      return all[this.key] || null;
    },
    rows() {
      return this.rec ? this.rec.rows : [];
    },
    stat() {
      if (this.rec && this.rec.stat) {
        return [
          { k: "承載量", v: this.rec.cap || this.site.cap.wdBed, unit: true },
          { k: "已通過", v: this.rec.stat.passed || "0", unit: true },
          { k: "待處理", v: this.rec.stat.pending || "0", unit: true },
          { k: "餘額", v: this.rec.stat.remain || "0", unit: true },
        ];
      }
      return [
        { k: "平日承載量", v: this.site.cap.wdBed, unit: true },
        { k: "假日承載量", v: this.site.cap.heBed, unit: true },
      ];
    },
  },

  methods: {
    submit() {
      this.siteId = this.draftSite;
      this.date = this.draftDate;
      const url = new URL(window.location.href);
      url.searchParams.set("node", this.siteId);
      url.searchParams.set("date", this.date);
      window.history.replaceState({}, "", url.toString());
    },
  },
});
