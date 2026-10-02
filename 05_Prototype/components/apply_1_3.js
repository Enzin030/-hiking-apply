/* 2026-10-02：三管處改為共用玉山 apply-3／4／5（decisions.md），本頁（雪霸）不再使用，
   一進來就帶原網址參數轉到 apply-3.html?park=shei-pa。原內容保留在下方，去留待使用者決定。 */
(function () { var q = new URLSearchParams(window.location.search); q.set("park", "shei-pa");
  window.location.replace("apply-3.html?" + q.toString()); })();

/* ============================================================
   apply_1_3.js — 登山線上申請：行程登記及登山申請（雪霸）
   ------------------------------------------------------------
   2026-10-01 新增。對應正式站 apply_1_3.aspx，以「雪山主峰線／(3級) 雪山主峰(多日行程)」為例。
   依據 02_Spec/05b（2026-09-24 正式站實走，全程未送出）。

   以 apply_1_5（太魯閣）為底稿：兩者在正式站同為頁內三步驟、人員區塊與確認頁結構相近。
   **雛形原本沒有雪霸申請頁**：同意書按「同意」後導向玉山的 apply-3，
   雪霸使用者會看到玉山的主路線、GPS 欄位與警政署入山證區塊（2026-10-01 實走確認）。

   ------------------------------------------------------------
   與太魯閣（apply_1_5）的差異——全部照正式站雪霸
   ------------------------------------------------------------
   步驟一
   - 有「隊名」（必填）；有無人機空拍申請說明
   - **沒有警政署入山證區塊**（機關層級差異，05b §3.1）、沒有 GPS、沒有路線承載量查詢與「已詳閱說明」勾選
   - 登山總日數依次路線（雪山主峰多日行程 2～4 天）；入園日期選了天數才可選
   - 入園日期：今日＋5 天起連續 57 個（正式站 10-01 實測 10-06～12-01，與同意書「入園日前 5 日」一致；
     09-24 擷取為 +6 天起 56 個，兩次終點皆為 +61 天）
   - 路線規劃第一步是「請選擇起點」（th-route-planner 的 pick-start）
   - 登山行前講習**預設空白**（玉山預設網路線上學習）
   - 「登山安全管理」區塊正式站只有空標題（05b §3.4）；2026-10-01 再實測：切換次路線、路線規劃完成後
     仍只有標題，表單從未出現。雛形只放標題與〔待確認〕說明，不做表單
   步驟二
   - 「國家公園行程計畫」多列隊名；沒有「承載量隊狀況」區塊
   - 附件區顯示「無需上傳資料」
   - 隊伍 1 人時出現單人獨攀勾選（正式站 lineonechk，附「獨攀登山安全宣導」PDF），未勾擋下
     「請勾選單人獨攀注意事項」；2 人以上不出現（2026-10-01 實測 1 人、09-24 擷取 2 人）
   - 宿營地排隊表的宿營地點下拉只有當晚宿營地一項（無「自備搭帳」），說明欄為固定文字＋宿營地與床位查詢連結
   步驟三
   - 申請人、留守人各一張表，欄位與順序照正式站雪霸確認頁；隊員表以「領隊」欄 V 標示、無傳真欄
   - 不列逐日行程

   網址參數：同意書頁帶來的 fid（主路線）與 cid（次路線）有對應資料就預選，否則用示範路線（fid 4／cid 99）。

   ------------------------------------------------------------
   互動約定（沿用 apply_1_5，2026-09-17 使用者指示）
   ------------------------------------------------------------
   - 示意資料**預設帶入**；欄位檢核在**按下一步／確認送出時**以 th-modal 提醒
   - 隊伍人數唯讀＝隊員數＋1（含領隊），隊員逐筆新增；示意帶 1 名隊員（隊伍 2 人）

   資料：components/Apply13Data.js、RouteData.js、TrailLevelData.js 都在 <body> 底部載入，
   **只在 data() 裡讀 window.***（踩坑總表第七類）。
   ============================================================ */

function apply13Iso(y, m, d) {
  var x = new Date(y, m, d);
  return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
}

function apply13AddDays(iso, n) {
  if (!iso) return "";
  var p = iso.split("-").map(Number);
  return apply13Iso(p[0], p[1] - 1, p[2] + n);
}

/* 可選入園日期：今日＋5 天起連續 57 個（正式站 2026-10-01 實測，無排除日；示意） */
function apply13Dates() {
  var t = new Date();
  var out = [];
  for (var i = 0; i < 57; i++) out.push(apply13Iso(t.getFullYear(), t.getMonth(), t.getDate() + 5 + i));
  return out;
}

var APPLY13_STEPS = [
  { n: 1, title: "行程規劃" },
  { n: 2, title: "人員資料" },
  { n: 3, title: "確認送出" },
  { n: 4, title: "申請完成" },
];

/* 確認頁欄位：順序與標題照正式站雪霸確認頁（2026-09-24 prod-SHP002-S03-confirm）。
   緊急聯絡人一格內含姓名與電話；聯絡地址＝縣市＋鄉鎮＋地址 */
var APPLY13_APPLICANT_COLUMNS = [
  { key: "name", label: "姓名" },
  { key: "tel", label: "電話" },
  { key: "fax", label: "傳真" },
  { key: "addr", label: "聯絡地址" },
  { key: "email", label: "E-mail" },
  { key: "nation", label: "國籍" },
  { key: "sid", label: "身份證號/護照號碼" },
  { key: "sex", label: "性別", align: "center" },
  { key: "birthday", label: "生日" },
  { key: "mobile", label: "手機" },
  { key: "contact", label: "緊急聯絡人" },
];
var APPLY13_STAY_COLUMNS = [
  { key: "name", label: "姓名" },
  { key: "tel", label: "電話" },
  { key: "fax", label: "傳真" },
  { key: "email", label: "E-mail" },
  { key: "sid", label: "身份證號/護照號碼" },
  { key: "birthday", label: "生日" },
  { key: "mobile", label: "手機" },
];
/* 隊員表：申請人欄位去掉傳真，前面加 No. 與領隊 */
var APPLY13_TEAM_COLUMNS = [
  { key: "no", label: "No.", align: "center" },
  { key: "leader", label: "領隊", align: "center" },
].concat(APPLY13_APPLICANT_COLUMNS.filter(function (c) { return c.key !== "fax"; }));

var APPLY13_QUEUE_COLUMNS = [
  { key: "date", label: "日期" },
  { key: "camp", label: "宿營地點" },
  { key: "qty", label: "數量", align: "center" },
  { key: "note", label: "說明" },
];

function apply13PersonRow(p) {
  var dash = function (v) { return v ? v : "—"; };
  return {
    name: dash(p.name), tel: dash(p.tel), fax: dash(p.fax),
    addr: dash([p.country, p.city, p.addr].filter(Boolean).join("")),
    email: dash(p.email), nation: dash(p.nation), sid: dash(p.sid), sex: dash(p.sex),
    birthday: dash(p.birthday), mobile: dash(p.mobile),
    contact: dash([p.contactname, p.contacttel].filter(Boolean).join(" ")),
  };
}

/* 次路線名稱的「(N級)」前綴 → 步道分級 */
function apply13Level(name) {
  var m = /\((\d)級\)/.exec(name || "");
  return m ? Number(m[1]) : undefined;
}

var APPLY13_P = new URLSearchParams(window.location.search);

thPage({
  data() {
    var demo = window.APPLY13_DEMO_PEOPLE;
    var dates = apply13Dates();
    var mains = window.APPLY13_MAINS;
    /* 同意書帶來的 fid／cid 有對應才預選，否則用示範路線 */
    var qMain = APPLY13_P.get("fid"), qSub = APPLY13_P.get("cid");
    var mainId = mains.some(function (m) { return m.id === qMain; }) ? qMain : "4";
    var isDemo = mainId === "4" && (!qSub || qSub === "99");
    return {
      mains: mains,
      subsSeenMap: window.APPLY13_SUBS_SEEN,
      routeData: (window.ROUTE_DATA || []).filter(function (r) { return r.agency === "shei-pa"; }),
      planners: window.APPLY13_PLANNER,
      levels: window.TRAIL_LEVELS,
      kitPdf: window.KIT_PDF,
      droneUrl: "https://eform.spnp.gov.tw/ap/forms/Dro/index.aspx",
      dates: dates,
      stepperSteps: APPLY13_STEPS,
      teamColumns: APPLY13_TEAM_COLUMNS,
      applicantColumns: APPLY13_APPLICANT_COLUMNS,
      stayColumns: APPLY13_STAY_COLUMNS,
      queueColumns: APPLY13_QUEUE_COLUMNS,
      /* 舊站顯示伺服器時間；雛形取載入當下的本機時間 */
      nowTime: new Date().toTimeString().slice(0, 5),

      step: 1,               // 1／2／3；4＝申請完成
      errors: [],
      errorOpen: false,
      levelOpen: false,
      draftOpen: false,

      /* 步驟一（示意資料預設帶入；非示範路線只帶主／次路線） */
      teamName: "天眼1隊",
      mainId: mainId,
      subId: isDemo ? "99" : (qSub || ""),
      sumday: isDemo ? 2 : 0,
      startDate: isDemo ? dates[2] : "",
      plan: isDemo ? { days: window.APPLY13_DEMO_DAYS, finished: true } : { days: [], finished: false },
      seminar: "",
      satellitephone: "",
      frequency: "",
      noteUser: "",

      /* 步驟二 */
      open: { apply: true, leader: true, member: true, stay: true, file: true },
      applyConsent: true,
      applicant: Object.assign({}, demo.applicant),
      leaderSame: true,
      leader: {},
      memberConsent: true,
      teamMax: 12,
      members: [Object.assign({}, demo.member)],
      staySame: false,
      stay: Object.assign({}, demo.stay),
      soloChecked: false,
      soloPdf: "https://hike.taiwan.gov.tw/images/雪霸獨攀登山安全宣導.pdf",
      vcode2: "",

      /* 步驟三 */
      vcode3: "",
    };
  },

  computed: {
    main() { var id = this.mainId; return this.mains.find(function (r) { return r.id === id; }); },
    /* 實走過的主路線用正式站下拉；其餘取 RouteData（正式站路線清單），去掉申請頁下拉不出現的「外籍提前」 */
    subsSeen() { return this.subsSeenMap[this.mainId] || null; },
    subs() {
      if (this.subsSeen) return this.subsSeen;
      var id = this.mainId;
      return this.routeData
        .filter(function (r) { return r.fId === id && (r.originalName || "").indexOf("外籍提前") < 0; })
        .map(function (r) { return { id: r.cId, name: r.originalName, level: apply13Level(r.originalName), dayMin: r.days, dayMax: r.dayMax }; });
    },
    sub() { var id = this.subId; return this.subs.find(function (s) { return s.id === id; }); },
    /* 天數：實走值優先，否則 RouteData 的 days～dayMax（測試機 DB，〔待確認〕） */
    dayOptions() {
      var s = this.sub;
      if (!s) return [];
      if (s.days) return s.days;
      var r = this.routeData.find(function (x) { return x.cId === s.id; });
      var lo = (r && r.days) || 1, hi = (r && r.dayMax) || lo;
      var out = [];
      for (var n = lo; n <= hi; n++) out.push(n);
      return out;
    },
    graph() { return (this.sub && this.sub.planner && this.planners[this.sub.id]) || null; },
    /* 等級 0 是合法值，判空不能用 falsy */
    levelRow() {
      var lv = this.sub ? this.sub.level : undefined;
      if (lv === undefined || lv === null) return null;
      return this.levels.find(function (l) { return l.level === lv; }) || null;
    },
    endDate() { return this.sumday ? apply13AddDays(this.startDate, this.sumday - 1) : ""; },
    leaderView() { return this.leaderSame ? Object.assign({}, this.applicant) : this.leader; },
    teamsCount() { return this.members.length + 1; },   // 含領隊
    isSolo() { return this.teamsCount === 1; },
    teamRows() {
      return [Object.assign({ isLeader: true }, this.leaderView)].concat(this.members).map(function (p, i) {
        return Object.assign({ no: i + 1, leader: p.isLeader ? "V" : "" }, apply13PersonRow(p));
      });
    },
    applicantRows() { return [apply13PersonRow(this.applicant)]; },
    stayRows() {
      var r = apply13PersonRow(this.stay);
      return [{ name: r.name, tel: r.tel, fax: r.fax, email: r.email, sid: r.sid, birthday: r.birthday, mobile: r.mobile }];
    },
    /* 每晚一列：日期＝入園日＋第幾晚，宿營地點＝當天終點 */
    queueRows() {
      var self = this;
      if (!this.plan.finished) return [];
      return this.plan.days.slice(0, -1).map(function (d, i) {
        return { index: i, date: apply13AddDays(self.startDate, i), camp: d[d.length - 1], qty: self.teamsCount };
      });
    },
  },

  watch: {
    mainId() {
      var first = this.subs[0];
      this.subId = first ? first.id : "";
    },
    subId() {
      this.sumday = 0;
      this.startDate = "";
      this.plan = { days: [], finished: false };
    },
    applicant: {
      deep: true,
      handler(v) { if (this.staySame) this.stay = this.pickStay(v); },
    },
    staySame(on) { if (on) this.stay = this.pickStay(this.applicant); },
  },

  methods: {
    isArray(v) { return Array.isArray(v); },
    pickStay(p) {
      var keys = ["name", "tel", "mobile", "fax", "email", "nation", "nationid", "sid", "birthday"];
      var out = {};
      keys.forEach(function (k) { out[k] = p[k] || ""; });
      return out;
    },
    toggle(k) { this.open[k] = !this.open[k]; },
    setMember(i, v) {
      var list = this.members.slice();
      list[i] = v;
      this.members = list;
    },
    /* 正式站：勾隊員區的委託同意（member_keytype）後才出現「新增隊員」 */
    addMember() {
      if (this.teamsCount >= this.teamMax) return;
      this.members = this.members.concat([{ nation: "中華民國" }]);
    },
    removeMember(i) {
      this.members = this.members.filter(function (_, j) { return j !== i; });
    },
    remind(errs) {
      this.errors = errs;
      this.errorOpen = errs.length > 0;
      return errs.length === 0;
    },
    next() {
      var errs = this.step === 1 ? this.checkStep1() : this.checkStep2();
      if (!this.remind(errs)) return;
      this.step += 1;
      this.scrollTop();
    },
    prev() {
      this.step -= 1;
      this.scrollTop();
    },
    scrollTop() { window.scrollTo({ top: 0, behavior: "smooth" }); },
    checkStep1() {
      var e = [];
      if (!this.teamName) e.push("請填寫隊名");
      if (!this.sub) e.push("請選擇次路線");
      if (!this.sumday) e.push("請選擇登山總日數");
      if (!this.startDate) e.push("請選擇入園日期");
      if (this.graph && !this.plan.finished) e.push("路線規劃行程尚未安排完成");
      return e;
    },
    checkStep2() {
      var e = [];
      if (!this.applyConsent) e.push("請勾選申請人的委託同意");
      if (!this.applicant.name || !this.applicant.sid) e.push("申請人姓名與證號為必填");
      if (!this.leaderSame && !this.leader.name) e.push("請填寫領隊資料，或勾選「同申請人」");
      if (this.members.length && !this.memberConsent) e.push("請勾選隊員的委託同意");
      if (this.members.some(function (m) { return !m.name || !m.sid; })) e.push("隊員姓名與證號為必填");
      if (!this.stay.name) e.push("請填寫留守人資料");
      if (this.isSolo && !this.soloChecked) e.push("請勾選單人獨攀注意事項");
      if (!this.vcode2) e.push("請輸入送件驗證碼");
      return e;
    },
    submit() {
      if (!this.remind(this.vcode3 ? [] : ["請輸入送件驗證碼"])) return;
      this.step = 4;
      this.scrollTop();
    },
  },
});
