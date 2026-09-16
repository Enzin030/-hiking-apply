/* ============================================================
   apply_report.js — 國家公園出園回報（規格 02_Spec/08_國家公園出園回報.md）
   ------------------------------------------------------------
   舊站 apply_6.aspx。查詢頁與回報填寫頁是同一支 .aspx 的兩個狀態，
   本頁用 `queried` 切換。

   規格的「有入園／未入園」是兩個互斥核取方塊。互斥的核取方塊在語意上就是
   單選，所以改用 radio——核取方塊要靠 JS 維持互斥，讀屏也讀不出互斥關係。

   members 可編輯（勾狀態、填體溫），所以進 data()。
   ============================================================ */

const REPORT_BASIC = [
  { label: "入園日期", value: "2026-09-12" },
  { label: "離園日期", value: "2026-09-14" },
  { label: "登山申請編號", value: "TW1150905017" },
  { label: "隊伍名稱", value: "曉風登山隊" },
  { label: "領隊姓名", value: "王小明" },
  { label: "隊伍人數（含領隊）", value: "5 人" },
];

/* 今日字串：出園日期預設當日。用本地時間切，不用 toISOString()——
   那會先轉 UTC，臺灣時間 08:00 前會切到前一天。 */
function todayStr() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}

const REPORT_MEMBERS = [
  { id: "p1", role: "領隊", name: "王小明", checkin: "2026-09-12 05:40", locked: false },
  { id: "p2", role: "隊員", name: "陳雅文", checkin: "2026-09-12 05:41", locked: false },
  { id: "p3", role: "隊員", name: "林志豪", checkin: "2026-09-12 05:41", locked: true },
  { id: "p4", role: "隊員", name: "黃思涵", checkin: "未報到", locked: false },
  { id: "p5", role: "隊員", name: "Alex Carter", checkin: "2026-09-12 05:43", locked: false },
];

const EMPTY_ERRORS = { serial: "", sid: "" };

thPage({
  data() {
    const today = todayStr();
    return {
      serial: "",
      nation: "",
      sid: "",
      vcode: "",
      errors: Object.assign({}, EMPTY_ERRORS),
      queried: false,
      showConfirm: false,
      showDone: false,

      members: REPORT_MEMBERS.map((m) =>
        Object.assign({}, m, {
          /* 已確認離園者（locked）預設就是有入園並帶當日日期 */
          status: m.locked ? "out" : "",
          outDate: m.locked ? today : today,
          tempIn: "",
          tempOut: "",
          note: "",
        })
      ),

      navItems: [
        { id: "query", label: "出園回報查詢" },
        { id: "basic", label: "案件基本資料" },
        { id: "detail", label: "出園回報明細" },
      ],

      kvColumns: [
        { key: "label", label: "項目" },
        { key: "value", label: "內容" },
      ],
    };
  },

  computed: {
    applyCrumb() { return window.TH_APPLY_CRUMB; },
    basicRows() { return REPORT_BASIC; },

    doneCount() { return this.members.filter((m) => m.status === "out" && m.outDate).length; },
    noneCount() { return this.members.filter((m) => m.status === "none").length; },
  },

  methods: {
    query() {
      this.serial = this.serial.trim();
      this.sid = this.sid.trim();
      this.errors.serial = this.serial ? "" : "請填寫申請編號";
      this.errors.sid = this.sid ? "" : "請填寫身分證號／護照號碼（居留證）";
      if (this.errors.serial || this.errors.sid) return;
      this.queried = true;
    },

    reset() {
      this.serial = "";
      this.nation = "";
      this.sid = "";
      this.vcode = "";
      this.errors = Object.assign({}, EMPTY_ERRORS);
      this.queried = false;
    },

    setStatus(m, v) {
      if (m.locked) return;
      m.status = v;
    },

    submitReport() {
      this.showConfirm = false;
      this.showDone = true;
    },
  },
});
