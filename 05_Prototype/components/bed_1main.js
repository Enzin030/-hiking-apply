/* ============================================================
   bed_1main.js — 雪霸宿營地當日申請名單（對應正式站 bed_1main.aspx）
   ------------------------------------------------------------
   資料：components/Bed1Data.js（宿營地清單與六項統計）＋
         components/Bed1MainData.js（承載量與當日名單，領隊已匿名）。
   依專案慣例，**只在 data() 裡讀 window.BED1***，不在模組層讀。

   網址參數（比照正式站 bed_1main.aspx?orgid=&node_id=&sdate=）：
     ?node=<宿營地 id>&date=<yyyy-mm-dd>
   兩者省略時落在七卡山莊與快照首日。

   申請狀態說明的七條為正式站原文；其中兩條的數值規格已標 [待確認]
   （外籍提前 24 名額／出園前 4 個月至入園前 65 日、補件 2 日內），
   見 02_Spec/14_雪霸宿營地查詢.md 檔頭。
   ============================================================ */

/* 申請狀態說明與狀態對應已提升至 components/Bed1MainData.js（2026-09-18），
   bed_1 的當日名單彈窗共用同一份。依專案慣例只在 data() 內讀 window.*。 */

thPage({
  data() {
    const sites = window.BED1_SITES || [];
    const detail = window.BED1MAIN || {};
    const params = new URLSearchParams(window.location.search);
    const node = params.get("node");
    const site = sites.find((s) => s.id === node) || sites.find((s) => s.name === "七卡山莊") || sites[0];
    /* 沒帶日期就用該宿營地在快照裡的第一個有名單的日子 */
    const first = Object.keys(detail).filter((k) => k.indexOf(site.id + "|") === 0).sort()[0];
    const date = params.get("date") || (first ? first.split("|")[1] : "2026-09-22");
    return {
      sites,
      detail,
      labels: window.BED1_LABELS || [],
      orgId: window.BED1_ORG_ID || "",
      snapshot: window.BED1MAIN_SNAPSHOT_DATE || "",
      notes: window.BED1MAIN_NOTES || [],
      siteId: site.id,
      date,
      draftSite: site.id,
      draftDate: date,
    };
  },

  computed: {
    site() { return this.sites.find((s) => s.id === this.siteId) || this.sites[0]; },
    rec() { return this.detail[this.siteId + "|" + this.date] || null; },
    rows() { return this.rec ? this.rec.rows : null; },
    /* 當日的六項統計取自月曆（同一份快照），承載量取自本頁 */
    stat() {
      if (!this.rec) return null;
      const [y, m, d] = this.date.split("-").map(Number);
      const md = this.site.months.find((x) => x.y === y && x.m === m);
      const e = md && md.days[d - 1];
      if (!e) return null;
      const by = (k) => e.v[this.labels.indexOf(k)];
      return [
        { k: "承載量", v: this.rec.cap, unit: true },
        { k: "待處理", v: by("待處理"), unit: true },
        { k: "補件", v: by("補件"), unit: true },
        { k: "已通過", v: by("已通過"), unit: true },
        { k: "待系統排定", v: by("待系統排定"), unit: true },
        { k: "宿營地不足候補", v: by("宿營地不足候補"), unit: true },
        { k: "餘額", v: by("餘額"), unit: true },
      ];
    },
    officialUrl() {
      return "https://hike.taiwan.gov.tw/bed_1main.aspx?orgid=" + this.orgId +
        "&node_id=" + this.siteId + "&sdate=" + this.date;
    },
  },

  methods: {
    submit() {
      this.siteId = this.draftSite;
      this.date = this.draftDate;
      /* 讓網址可分享、可重整（比照正式站帶 node_id 與 sdate） */
      const u = new URL(window.location.href);
      u.searchParams.set("node", this.siteId);
      u.searchParams.set("date", this.date);
      window.history.replaceState(null, "", u);
    },
    statusClass(s) { return (window.BED1MAIN_STATUS || {})[s] || ""; },
  },
});
