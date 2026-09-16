/* ============================================================
   apply_modify.js — 申請資料異動及取消（規格 02_Spec/06d_申請資料異動及取消.md）
   ------------------------------------------------------------
   舊站 apply_2.aspx。三個 alert／confirm（互換提示、整隊取消確認、送出完成）
   在本頁改用共用的 th-modal——瀏覽器原生彈窗會擋住後續的自動化驗收。

   members 會被使用者改（勾選取消），所以**它必須進 data()**，
   與「大宗資料常數不進 data()」不衝突：那條講的是唯讀常數。
   ============================================================ */

const MOD_TRIP = [
  { label: "申請編號", value: "TW1150918003" },
  { label: "申請機關", value: "玉山國家公園管理處" },
  { label: "入園日期", value: "2026-10-18" },
  { label: "離園日期", value: "2026-10-20" },
  { label: "隊名", value: "曉風登山隊" },
  { label: "登山主路線", value: "玉山線" },
  { label: "登山次路線", value: "塔塔加 － 玉山主峰 － 塔塔加" },
];

const MOD_LEADER_FIELDS = [
  { key: "name", label: "姓名" },
  { key: "phone", label: "電話" },
  { key: "mobile", label: "手機" },
  { key: "fax", label: "傳真" },
  { key: "email", label: "Email" },
  { key: "sid", label: "證號" },
  { key: "gender", label: "性別" },
  { key: "birthday", label: "生日" },
  { key: "emgName", label: "緊急聯絡人" },
  { key: "emgPhone", label: "緊急聯絡人電話" },
];

const MOD_WATCHER_FIELDS = [
  { key: "name", label: "姓名" },
  { key: "phone", label: "電話" },
  { key: "mobile", label: "手機" },
  { key: "email", label: "Email" },
  { key: "sid", label: "證號" },
  { key: "birthday", label: "生日" },
];

/* 申請人資料：勾「同申請人」時代入留守人欄位 */
const MOD_APPLICANT = {
  name: "王小明",
  phone: "049-2771234",
  mobile: "0912345678",
  email: "hiker.wang@example.com",
  sid: "A12****789",
  birthday: "1988-04-12",
};

const MOD_MEMBERS = [
  {
    id: "m1", name: "陳雅文", role: "隊員", cancelled: false,
    detail: [
      { label: "證號", value: "B22****456" },
      { label: "手機", value: "0922***456" },
      { label: "緊急聯絡人", value: "陳大山　0933***789" },
    ],
  },
  {
    id: "m2", name: "林志豪", role: "隊員", cancelled: false,
    detail: [
      { label: "證號", value: "C12****321" },
      { label: "手機", value: "0955***321" },
      { label: "緊急聯絡人", value: "林秀琴　0966***123" },
    ],
  },
  {
    id: "m3", name: "Alex Carter", role: "隊員（外籍）", cancelled: false,
    detail: [
      { label: "證號", value: "護照 3****12" },
      { label: "手機", value: "0977***654" },
      { label: "緊急聯絡人", value: "Mia Carter　+1-415-***-1234" },
    ],
  },
];

thPage({
  data() {
    return {
      /* 這三段是可編輯的表單值，所以放 data()，不走 computed */
      leader: {
        name: "王小明", phone: "049-2771234", mobile: "0912345678", fax: "",
        email: "hiker.wang@example.com", sid: "A12****789", gender: "男",
        birthday: "1988-04-12", emgName: "王美玲", emgPhone: "0988***321",
      },
      watcher: { name: "", phone: "", mobile: "", email: "", sid: "", birthday: "" },
      members: MOD_MEMBERS.map((m) => Object.assign({}, m)),

      watcherSame: false,
      vcode: "",
      showSwap: false,
      showCancelAll: false,
      showDone: false,

      navItems: [
        { id: "trip", label: "申請行程資料" },
        { id: "member", label: "領隊與隊員異動" },
        { id: "watcher", label: "留守人資料異動" },
        { id: "submit", label: "異動確認與送出" },
      ],

      kvColumns: [
        { key: "label", label: "項目" },
        { key: "value", label: "內容" },
      ],
    };
  },

  computed: {
    applyCrumb() { return window.TH_APPLY_CRUMB; },
    tripRows() { return MOD_TRIP; },
    leaderFields() { return MOD_LEADER_FIELDS; },
    watcherFields() { return MOD_WATCHER_FIELDS; },

    cancelledCount() {
      return this.members.filter((m) => m.cancelled).length;
    },
  },

  methods: {
    /* 與第一位未取消的隊員互換。全部取消時不做事，避免把領隊換成已取消的人。 */
    swap() {
      const target = this.members.find((m) => !m.cancelled);
      if (!target) return;
      const leaderName = this.leader.name;
      this.leader.name = target.name;
      target.name = leaderName;
      this.showSwap = true;
    },

    toggleWatcherSame() {
      this.watcherSame = !this.watcherSame;
      if (!this.watcherSame) return;
      MOD_WATCHER_FIELDS.forEach((f) => {
        this.watcher[f.key] = MOD_APPLICANT[f.key] || "";
      });
    },

    confirmModify() {
      this.showDone = true;
    },
  },
});
