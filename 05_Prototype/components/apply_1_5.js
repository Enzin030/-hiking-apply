/* ============================================================
   apply_1_5.js — 登山線上申請：行程登記及登山申請（太魯閣）
   ------------------------------------------------------------
   2026-09-17 新增。對應舊站 apply_1_5.aspx，以「南湖大山線」為例。

   **步驟放在頁首的 th-stepper**（步驟一 行程規劃 → 步驟二 人員資料 →
   步驟三 確認送出 → 申請完成），不另做頁內頁籤（2026-09-17 使用者指示）。

   ------------------------------------------------------------
   用到的共用元件
   ------------------------------------------------------------
   th-page-shell／th-stepper（steps）／th-hybrid-select／th-data-table／
   th-modal／th-callout／th-captcha／th-todo-link，以及本頁新增的
   th-person-form（人員資料，吃 role）與 th-npa-permit（入山證區塊）。

   難度等級照步道分級的處理方式：`th-level lv-N` 徽章，點開 th-modal 顯示
   window.TRAIL_LEVELS 的說明／適合對象／建議裝備（與步道分級頁、開放狀態頁同一份資料）。

   **路線規劃器是頁面區域元件**：雪霸也有節點概念但資料表不同，
   能否共用待確認，先不進 .th-* 命名空間。

   ------------------------------------------------------------
   互動約定（2026-09-17 使用者指示）
   ------------------------------------------------------------
   - 示意資料**預設帶入**，不另放「填入示意資料」按鈕，也不放雛形提示條
   - 欄位檢核在**按下一步／確認送出時**以 th-modal 提醒，不在頁面上常駐錯誤清單
   - 太魯閣沒有隊伍名稱欄位（舊站 teams_name 是 HiddenField），本頁照做

   ------------------------------------------------------------
   資料
   ------------------------------------------------------------
   components/Apply15Data.js 與 components/TrailLevelData.js 都在 <body> 底部載入。
   **只在 data() 裡讀 window.***，不在模組層讀（踩坑總表第七類）。
   ============================================================ */

function apply15Iso(y, m, d) {
  var x = new Date(y, m, d);
  return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
}

function apply15AddDays(iso, n) {
  if (!iso) return "";
  var p = iso.split("-").map(Number);
  return apply15Iso(p[0], p[1] - 1, p[2] + n);
}

/* 可選入園日期（測試站當下為 2026-09-22 起，示意） */
function apply15Dates() {
  var out = [];
  for (var i = 0; i < 20; i++) out.push(apply15Iso(2026, 8, 22 + i));
  return out;
}

var APPLY15_STEPS = [
  { n: 1, title: "行程規劃" },
  { n: 2, title: "人員資料" },
  { n: 3, title: "確認送出" },
  { n: 4, title: "申請完成" },
];

var APPLY15_TEAM_COLUMNS = [
  { key: "no", label: "No.", align: "center" },
  { key: "leader", label: "領隊", align: "center" },
  { key: "name", label: "姓名" },
  { key: "mobile", label: "手機" },
  { key: "email", label: "E-mail" },
  { key: "nation", label: "國籍" },
  { key: "sid", label: "身分證號／護照號碼" },
  { key: "sex", label: "性別", align: "center" },
  { key: "birthday", label: "生日" },
];

var APPLY15_QUEUE_COLUMNS = [
  { key: "date", label: "日期" },
  { key: "camp", label: "宿營地點" },
  { key: "qty", label: "數量", align: "center" },
  { key: "note", label: "說明" },
];

/* ------------------------------------------------------------
   頁面區域元件：路線規劃器
   舊站行為（實走確認）：逐節點選擇，下一批可選節點由目前位置決定；
   只有停在宿營地才能完成當日路線；完成當日後下一天從該宿營地出發。
   最後一天須回到出口 [推定]。
   ------------------------------------------------------------ */
var P_APPLY15_PLANNER = {
  props: {
    graph: { type: Object, required: true },
    days: { type: Number, required: true },
    modelValue: { type: Object, required: true },   // { days: [[節點...]], finished: bool }
    readonly: { type: Boolean, default: false },
  },
  emits: ["update:modelValue"],
  data() {
    return { msg: "" };
  },
  computed: {
    plan() { return this.modelValue.days.length ? this.modelValue.days : [[this.graph.start]]; },
    dayIndex() { return this.plan.length - 1; },
    today() { return this.plan[this.dayIndex]; },
    here() { return this.today[this.today.length - 1]; },
    isLastDay() { return this.dayIndex === this.days - 1; },
    options() {
      var here = this.here;
      var out = [];
      this.graph.edges.forEach(function (e) {
        if (e[0] === here) out.push(e[1]);
        else if (e[1] === here) out.push(e[0]);
      });
      return out;
    },
  },
  watch: {
    days() { if (!this.readonly) this.reset(); },
  },
  methods: {
    isCamp(n) { return this.graph.camps.indexOf(n) >= 0; },
    push(days, finished) { this.$emit("update:modelValue", { days: days, finished: !!finished }); },
    copy() { return this.plan.map(function (d) { return d.slice(); }); },
    pick(n) {
      this.msg = "";
      var days = this.copy();
      days[this.dayIndex].push(n);
      this.push(days, false);
    },
    back() {
      this.msg = "";
      var days = this.copy();
      if (days[this.dayIndex].length > 1) days[this.dayIndex].pop();
      else if (this.dayIndex > 0) days.pop();
      this.push(days, false);
    },
    reset() {
      this.msg = "";
      this.push([[this.graph.start]], false);
    },
    finishDay() {
      if (this.today.length < 2) { this.msg = "請先選擇今日行經的地點"; return; }
      if (this.isLastDay) {
        if (this.graph.exits.indexOf(this.here) < 0) { this.msg = "最後一天須回到出口（" + this.graph.exits.join("、") + "）"; return; }
        this.msg = "";
        this.push(this.plan, true);
        return;
      }
      if (!this.isCamp(this.here)) { this.msg = "只有宿營地才能完成今日路線"; return; }
      this.msg = "";
      var days = this.copy();
      days.push([this.here]);
      this.push(days, false);
    },
  },
  template: `
    <div class="p-apply15-planner">
      <ol class="grid gap-2 mb-3">
        <li v-for="(d, i) in plan" :key="i" class="th-input th-input-readonly">
          <strong>第 {{ i + 1 }} 天：</strong>{{ d.join(' → ') }}<span v-if="isCamp(d[d.length - 1]) && (i < plan.length - 1 || modelValue.finished)" class="th-flag ml-2">宿營</span>
        </li>
      </ol>

      <template v-if="!readonly && !modelValue.finished">
        <p class="th-label">第 {{ dayIndex + 1 }} 天 · 目前位置：{{ here }}，請選擇下一個地點</p>
        <div class="th-chip-row mb-3">
          <button v-for="n in options" :key="n" type="button" class="th-chip" @click="pick(n)">
            <i v-if="isCamp(n)" class="fa-solid fa-campground" aria-hidden="true"></i>{{ n }}</button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button type="button" class="th-btn th-btn-ghost th-btn-sm" @click="reset"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i>重新規劃</button>
          <button type="button" class="th-btn th-btn-ghost th-btn-sm" @click="back"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i>返回上個地點</button>
          <button type="button" class="th-btn th-btn-primary th-btn-sm" @click="finishDay"><i class="fa-solid fa-check" aria-hidden="true"></i>{{ isLastDay ? '完成路線' : '完成今日路線' }}</button>
        </div>
        <p v-if="msg" class="th-field-hint mt-2" role="alert">{{ msg }}</p>
      </template>
      <div v-else-if="!readonly" class="flex items-center gap-2">
        <span class="th-field-hint">路線規劃完成。</span>
        <button type="button" class="th-btn th-btn-ghost th-btn-sm" @click="reset"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i>重新規劃</button>
      </div>
    </div>
  `,
};

thPage({
  components: {
    "p-apply15-planner": P_APPLY15_PLANNER,
  },

  data() {
    var demo = window.APPLY15_DEMO_PEOPLE;
    var dates = apply15Dates();
    return {
      routes: window.APPLY15_ROUTES,
      routeNotes: window.APPLY15_ROUTE_NOTES,
      levels: window.TRAIL_LEVELS,
      kitPdf: window.KIT_PDF,
      graph: window.APPLY15_PLANNER,
      capacity: window.APPLY15_CAPACITY,
      campRemain: window.APPLY15_CAMP_REMAIN,
      dates: dates,
      stepperSteps: APPLY15_STEPS,
      teamColumns: APPLY15_TEAM_COLUMNS,
      queueColumns: APPLY15_QUEUE_COLUMNS,

      step: 1,               // 1／2／3；4＝申請完成
      errors: [],
      errorOpen: false,
      levelOpen: false,
      draftOpen: false,

      /* 步驟一（示意資料預設帶入） */
      mainId: "16",
      subId: "26",
      sumday: 3,
      startDate: dates[2],
      noteChecked: true,
      plan: {
        days: [
          ["思源埡口", "5.1K登山口", "木杆鞍部", "雲稜營地"],
          ["雲稜營地", "審馬陣登山口", "審馬陣山屋"],
          ["審馬陣山屋", "審馬陣登山口", "雲稜營地", "木杆鞍部", "5.1K登山口", "思源埡口"],
        ],
        finished: true,
      },
      satellitephone: "",
      frequency: "",
      noteUser: "",
      npa: {
        reason: "登山健行",
        places: [{ code: "865+10002+10002110+1+0", name: "南湖中央尖山(宜蘭縣-大同鄉)", desc: "南湖大山線，經雲稜營地、審馬陣山屋" }],
        lib: "TM00",
        sub: "M15",
        plan: "D1：思源埡口→5.1K登山口→木杆鞍部→雲稜營地。\nD2：雲稜營地→審馬陣登山口→審馬陣山屋。\nD3：審馬陣山屋→審馬陣登山口→雲稜營地→木杆鞍部→5.1K登山口→思源埡口。",
      },

      /* 步驟二 */
      open: { apply: true, leader: true, member: true, stay: true, file: true },
      applyConsent: true,
      applicant: Object.assign({}, demo.applicant),
      leaderSame: true,
      leader: {},
      memberConsent: true,
      teamsCount: 1,
      members: [],
      staySame: false,
      stay: Object.assign({}, demo.stay),
      soloChecked: true,
      vcode2: "",

      /* 步驟三 */
      vcode3: "",
    };
  },

  computed: {
    main() { var id = this.mainId; return this.routes.find(function (r) { return r.id === id; }); },
    sub() { var id = this.subId; return (this.main ? this.main.subs : []).find(function (s) { return s.id === id; }); },
    hasPlanner() { return !!(this.sub && this.sub.planner); },
    needsNpa() { return !!(this.sub && this.sub.needsNpa); },
    notes() { return (this.sub && this.routeNotes[this.sub.id]) || []; },
    /* 等級 0 是合法值，判空不能用 falsy */
    levelRow() {
      var lv = this.sub ? this.sub.level : undefined;
      if (lv === undefined || lv === null) return null;
      return this.levels.find(function (l) { return l.level === lv; }) || null;
    },
    endDate() { return apply15AddDays(this.startDate, this.sumday - 1); },
    leaderView() { return this.leaderSame ? Object.assign({}, this.applicant, { student: !!this.leader.student }) : this.leader; },
    planDays() { return this.plan.days.length ? this.plan.days : [[this.graph.start]]; },
    isSolo() { return this.teamsCount === 1; },
    teamRows() {
      return [Object.assign({ isLeader: true }, this.leaderView)].concat(this.members).map(function (p, i) {
        return {
          no: i + 1, leader: p.isLeader ? "V" : "", name: p.name || "—", mobile: p.mobile || "—",
          email: p.email || "—", nation: p.nation || "—", sid: p.sid || "—", sex: p.sex || "—",
          birthday: p.birthday || "—",
        };
      });
    },
    queueRows() {
      var self = this;
      return this.planDays.slice(0, -1).map(function (d, i) {
        var camp = d[d.length - 1];
        return { date: apply15AddDays(self.startDate, i), camp: camp, qty: self.teamsCount, note: self.campNote(camp) };
      });
    },
  },

  watch: {
    mainId() {
      var first = this.main && this.main.subs[0];
      this.subId = first ? first.id : "";
    },
    subId() { this.plan = { days: [], finished: false }; },
    teamsCount(n) {
      var want = Math.max(0, Math.min(11, (Number(n) || 1) - 1));
      var list = this.members.slice(0, want);
      while (list.length < want) list.push({ nation: "中華民國" });
      this.members = list;
    },
    applicant: {
      deep: true,
      handler(v) { if (this.staySame) this.stay = this.pickStay(v); },
    },
    staySame(on) { if (on) this.stay = this.pickStay(this.applicant); },
  },

  methods: {
    campNote(camp) {
      var r = this.campRemain[camp];
      if (!r) return "尚無資料";
      if (r.kind === "tent") return "剩餘數量 4人營位數=" + r.remain4 + "，2人營位數=" + r.remain2 + "，實際順位以送出後為準";
      return "剩餘數量：" + r.remain + "，已預約待審：" + r.pending + "，本件需求數量：" + this.teamsCount + "，實際順位以送出後為準";
    },
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
      if (!this.sub) e.push("請選擇次路線");
      if (this.sub && this.sub.closed) e.push("此路線目前關閉（" + this.sub.closed + "），無法選擇入園日期");
      if (!this.startDate) e.push("請選擇入園日期");
      if (!this.noteChecked) e.push("請勾選「已詳閱以下說明，並同意相關注意事項」");
      if (this.hasPlanner && !this.plan.finished) e.push("路線規劃行程尚未安排完成");
      if (this.needsNpa) {
        if (!this.npa.places.length) e.push("入山證：請至少加入一個前往地點");
        if (this.npa.places.some(function (p) { return !p.desc; })) e.push("入山證：前往地點描述未填寫");
        if (!this.npa.lib || !this.npa.sub) e.push("入山證：請選擇登山路線圖");
        if (!this.npa.plan) e.push("入山證：請填寫登山計畫書");
      }
      return e;
    },
    checkStep2() {
      var e = [];
      if (!this.applyConsent) e.push("請勾選申請人的委託同意");
      if (!this.applicant.name || !this.applicant.sid) e.push("申請人姓名與證號為必填");
      if (!this.leaderSame && !this.leader.name) e.push("請填寫領隊資料，或勾選「同申請人」");
      if (this.members.length && !this.memberConsent) e.push("請勾選隊員的委託同意");
      if (!this.stay.name) e.push("請填寫留守人資料");
      if (this.isSolo && !this.soloChecked) e.push("獨攀：請勾選已詳閱獨攀申請承諾書");
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
