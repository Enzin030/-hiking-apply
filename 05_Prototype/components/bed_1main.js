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

const BED1MAIN_NOTES = [
  { k: "待系統排定", t: "送件第一天狀態皆為「待系統排定」，不納入宿營地統計，請等候系統當日 23:00 排定床位，並於隔日重新確認申請狀態。" },
  { k: "宿營地不足候補", t: "一般申請隊伍（外籍提前申請除外）。系統將統計每日釋出之床位總數於每晚 23:00 統一排定；若任一日宿營地不足，則繼續候補程序，每日釋出床位數量大於第一順位之候補名額則由第一順位者取得，若床位釋出數量小於第一順位者則改由更小名額之次順位隊伍遞補，若仍無床位，將於入園前 5 日（不含入園日）自動退件。" },
  { k: "待處理", t: "已成功預約行程每日宿營地，等候管理者審核。" },
  { k: "補件", t: "申請資料及所需附件填寫不全，由管理者以電子郵件通知補件。需於 2 日內（含通知當日）完成補件，逾期將退件處理。" },
  { k: "已通過", t: "已完成入園審核。" },
  { k: "餘額", t: "＝承載量－已通過－待處理－補件（不包含「待系統排定」與「候補」的隊伍）。" },
  { k: "外籍提前", t: "外籍提前申請人數（外國人＋本國人）。於週日至週四（國定假日除外）每日提供七卡山莊、三六九山莊及九九山莊各 24 個外籍保留名額住宿。請於出園日前 4 個月至入園日前 65 日提出申請。" },
];

/* 正式站的狀態字樣對應到既有的 .th-flag 修飾 class */
const BED1MAIN_STATUS = {
  已通過: "is-yes",
  宿營地不足: "is-no",
  待系統排定: "is-proof",
  補件: "is-proof",
  待處理: "is-proof",
  "待處理-未繳費": "is-proof",
};

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
      notes: BED1MAIN_NOTES,
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
    statusClass(s) { return BED1MAIN_STATUS[s] || ""; },
  },
});
