/* ============================================================
   apply_06.js — 六步驟家族 步驟 6：確認送出（警政署、自然保護區域、山屋共用）
   ------------------------------------------------------------
   2026-09-30 新增（原 forest-camp-6.js）。依據正式站 apply_06.aspx（2026-09-29 實走三類）：
   - 行程計畫標題：警政署為「警政署入山行程計畫」，其餘「行程計畫」
   - 下列「山屋及營地申請單明細」只有山屋有（kind＝camp）
   - 山屋及營地申請單明細：床位/營位、住宿費用、申請單位數；費用明細「【日期】N元」；
     「本申請單總金額為：NT$N元」；付款方式
   - 隊伍資料：NO.／姓名／身分／證號／電話／聯絡地址／緊急連絡人／緊急連絡電話；
     **申請人與領隊各列一行**（同一人），**證號遮罩**（A******789）
   - 附件資料：無須上傳附件；送件驗證碼**在本頁**（國家公園流程在人員資料頁）
   費用一律走 window.thFcPriceOf（假日二價），與第 2 步同一出口。
   ============================================================ */

const FC6_BOOKING_COLUMNS = [
  { key: "date", label: "日期" },
  { key: "room", label: "床位/營位" },
  { key: "price", label: "住宿費用", align: "right" },
  { key: "qty", label: "申請單位數", align: "center" },
];
const FC6_TEAM_COLUMNS = [
  { key: "no", label: "NO.", align: "center" },
  { key: "name", label: "姓名" },
  { key: "role", label: "身分", align: "center" },
  { key: "sid", label: "證號" },
  { key: "tel", label: "電話" },
  { key: "addr", label: "聯絡地址" },
  { key: "contact", label: "緊急連絡人" },
  { key: "contacttel", label: "緊急連絡電話" },
];
const FC6_FILE_COLUMNS = [
  { key: "no", label: "NO.", align: "center" },
  { key: "name", label: "檢附資料名稱" },
  { key: "file", label: "上傳檔案" },
];

/* 證號遮罩：保留第 1 碼與末 3 碼（正式站 A******789） */
function fc6Mask(sid) {
  if (!sid) return "—";
  if (sid.length <= 4) return sid;
  return sid[0] + "*".repeat(sid.length - 4) + sid.slice(-3);
}

thPage({
  data() {
    const st = Object.assign({ kind: "camp", title: "山屋住宿申請", crumb: "嘉明湖山屋" }, window.thFcState.load());
    return {
      st: st,
      cabin: window.TH_CABIN_DATA[st.route] || window.TH_CABIN_DATA.jiaming,
      bookingColumns: FC6_BOOKING_COLUMNS,
      teamColumns: FC6_TEAM_COLUMNS,
      fileColumns: FC6_FILE_COLUMNS,
      vcode: "",
      done: false,
      draftOpen: false,
      errors: [],
      errorOpen: false,
    };
  },

  computed: {
    applyCrumb() { return window.TH_APPLY_CRUMB; },
    planRows() { return window.thApply6PlanRows(this.st, window.thTodayValue()); },
    planTitle() { return this.st.kind === "npa" ? "警政署入山行程計畫" : "行程計畫"; },
    /* 送出後說明：依類別的後續流程（各規格／注意事項原文），雛形示意 */
    doneText() {
      if (this.st.kind === "npa") return "您的入山申請已送出。審核通過後，請至「進度查詢與取消作業」或電子郵件下載入山許可證及名冊（以自行列印為原則）。";
      /* 抽籤對象依區域類型（第 5 步宣達原文）：85 自然保留區只抽「民眾為環境教育之需要」；
         86／87 抽「非因科學研究或其他特殊目的申請入園者」 */
      if (this.st.kind === "area") return "您的自然保護區域進入申請已送出。進入日期前 14 日"
        + (this.st.areaType === "85" ? "抽籤（僅「民眾為環境教育之需要」）" : "申請人數超過生態承載量時抽籤（科學研究或其他特殊目的者除外）")
        + "，結果以電子郵件通知；核准者於進入日期前 4 日起可下載許可證。";
      return "您的山屋住宿申請已送出。住宿日前 30 日下午 3 時抽籤，結果將以電子郵件通知；抽中後請依繳費通知期限完成繳費。";
    },
    nights() { return Number(this.st.nights) || 0; },
    nightDates() {
      return Array.from({ length: this.nights }, (_, i) => window.thAddDaysToDateValue(this.st.start, i));
    },
    bookingRows() {
      const alloc = this.st.alloc || {};
      const rows = [];
      this.nightDates.forEach((d, i) => {
        this.cabin.facilities.forEach(f => {
          const q = (alloc[i] && alloc[i][f.id]) || 0;
          if (q > 0) rows.push({ key: i + f.id, date: d, room: f.label, price: window.thFcPriceOf(f, d), qty: q });
        });
      });
      return rows;
    },
    nightCosts() {
      return this.nightDates.map(d => ({
        date: d,
        cost: this.bookingRows.filter(r => r.date === d).reduce((s, r) => s + r.price * r.qty, 0),
      }));
    },
    total() { return this.nightCosts.reduce((s, n) => s + n.cost, 0); },
    paymentLabel() {
      const p = window.TH_FC_PAYMENTS.find(x => x.id === this.st.payment);
      return p ? p.label : "—";
    },
    teamRows() {
      const a = this.st.applicant || {};
      /* 保護區可另填領隊（apply_03 的 leaderSame） */
      const leader = this.st.leaderSame === false && this.st.leader ? this.st.leader : a;
      const people = [["申請人", a], ["領隊", leader]].concat((this.st.members || []).map(m => ["隊員", m]));
      return people.map(([role, p], i) => ({
        no: i + 1, name: p.name || "—", role: role, sid: fc6Mask(p.sid), tel: p.tel || "—",
        addr: [p.country, p.city, p.addr].filter(Boolean).join("") || "—",
        contact: p.contactname || "—", contacttel: p.contacttel || "—",
      }));
    },
  },

  methods: {
    prev() { window.location.href = "apply_05.html"; },
    submit() {
      const e = [];
      if (this.st.kind === "camp" && !this.bookingRows.length) e.push("尚未選擇床位或營位，請回第 2 步");
      if (!(this.st.applicant && this.st.applicant.name)) e.push("尚未填寫申請人資料，請回第 3 步");
      if (!this.st.agreed) e.push("尚未勾選同意聲明，請回第 5 步");
      if (!this.vcode) e.push("請輸入送件驗證碼");
      if (e.length) { this.errors = e; this.errorOpen = true; return; }
      this.done = true;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
});
