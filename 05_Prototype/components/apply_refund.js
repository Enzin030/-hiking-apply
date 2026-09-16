/* ============================================================
   apply_refund.js — 排雲山莊線上申請退費（規格 02_Spec/06c_線上申請退費(排雲).md）
   ------------------------------------------------------------
   舊站 apply_5.aspx 的四個畫面在本頁是 `stage` 的四個值：
     verify（驗證身分）→ info（退費資訊）→ account（新增退款帳戶）→ detail（退款明細維護）
   舊站 account 儲存後導向 detail，本頁照同樣的去向。

   身分證與手機的檢核只做「有沒有填」與「像不像手機號碼」，不實作
   舊站 UserNO()／UserNO2() 的檢查碼演算法——雛形沒有真實案件可對。
   ============================================================ */

const REFUND_REASONS = [
  "因人力不可抗拒之天然災害或公告禁止入園",
  "於預定入園日前 14 天取消入園",
  "隊伍或個人特殊狀況",
];

const REFUND_PERSON = [
  { label: "身分證字號", value: "A12****789" },
  { label: "姓名", value: "王小明" },
  { label: "聯絡電話", value: "0912-***-678" },
  { label: "申請日期", value: "2026-09-15" },
];

const REFUND_ACCOUNT = [
  { label: "受款金融機構", value: "（009）彰化商業銀行 南投分行" },
  { label: "戶名", value: "王小明" },
  { label: "存簿帳號", value: "0123****6789" },
  { label: "本次申請退費金額", value: "2,880 元" },
  { label: "實退金額", value: "2,850 元（已扣銀行手續費 30 元）" },
];

const REFUND_HISTORY = [
  {
    id: "2026-09-10 14:22",
    bank: "（009）彰化商業銀行 南投分行",
    owner: "王小明　0123****6789",
    copy: "影本附件",
    amount: "2,880 元",
    net: "2,850 元",
    state: "審核中",
    ops: "",
  },
];

const REFUND_STATE_FLAG = {
  審核中: "is-proof",
  補件中: "is-proof",
  審核完成: "is-open",
  已退款: "is-open",
};

/* 金融機構與分行：示意用的三家，分行依所選機構連動 */
const REFUND_BANKS = [
  { code: "009", name: "彰化商業銀行", branches: ["南投分行", "水里分行", "營業部"] },
  { code: "700", name: "中華郵政", branches: ["南投郵局", "水里郵局"] },
  { code: "004", name: "臺灣銀行", branches: ["南投分行", "埔里分行"] },
];

const REFUND_RECEIPTS = [
  { id: "R115-0918-0031", amount: "2,880" },
];

const REFUND_MEMBERS = [
  { name: "王小明", note: "115.10.05 全隊取消", fee: 480 },
  { name: "陳雅文", note: "115.10.05 全隊取消", fee: 480 },
  { name: "林志豪", note: "115.10.05 全隊取消", fee: 480 },
  { name: "黃思涵", note: "115.10.05 全隊取消", fee: 480 },
  { name: "吳建良", note: "115.10.05 全隊取消", fee: 480 },
  { name: "Alex Carter", note: "115.10.05 全隊取消", fee: 480 },
];

const REFUND_BANK_FEE = 30;

thPage({
  data() {
    return {
      stage: "verify",

      sid: "",
      mobile: "",
      pwd: "",
      pwdSent: false,
      errors: { sid: "", mobile: "" },

      bank: "",
      branch: "",
      owner: "",
      acct: "",

      reason: "",
      receipt: "",
      picked: [],

      navItems: [
        { id: "rules", label: "申請前置與退費規定" },
        { id: "verify", label: "驗證身分" },
        { id: "info", label: "退費申請資訊" },
        { id: "detail", label: "退款明細維護" },
      ],

      personColumns: [
        { key: "label", label: "項目" },
        { key: "value", label: "內容" },
      ],

      historyColumns: [
        { key: "id", label: "退費申請時間" },
        { key: "bank", label: "金融機構" },
        { key: "owner", label: "戶名／存簿帳號" },
        { key: "copy", label: "存摺封面影本" },
        { key: "amount", label: "本次申請退費金額" },
        { key: "net", label: "實退金額" },
        { key: "state", label: "狀態" },
        { key: "ops", label: "功能" },
      ],
    };
  },

  computed: {
    applyCrumb() { return window.TH_APPLY_CRUMB; },
    reasons() { return REFUND_REASONS; },
    personRows() { return REFUND_PERSON; },
    accountRows() { return REFUND_ACCOUNT; },
    historyRows() { return REFUND_HISTORY; },
    stateFlag() { return REFUND_STATE_FLAG; },
    banks() { return REFUND_BANKS; },
    receipts() { return REFUND_RECEIPTS; },
    members() { return REFUND_MEMBERS; },

    branchList() {
      const b = REFUND_BANKS.find((x) => x.code === this.bank);
      return b ? b.branches : [];
    },

    /* picked.length 可能是 0，不可用 !picked.length 當「還沒選」的判斷之外的用途 */
    allPicked() { return this.picked.length === REFUND_MEMBERS.length; },

    refundTotal() {
      return REFUND_MEMBERS
        .filter((m) => this.picked.includes(m.name))
        .reduce((sum, m) => sum + m.fee, 0);
    },
    refundText() { return this.refundTotal.toLocaleString("zh-TW") + " 元"; },
    netText() {
      if (this.refundTotal === 0) return "0 元";
      return Math.max(this.refundTotal - REFUND_BANK_FEE, 0).toLocaleString("zh-TW") + " 元";
    },
  },

  methods: {
    sendPwd() {
      this.errors.mobile = /^09\d{8}$/.test(this.mobile.trim()) ? "" : "手機號碼格式不符";
      this.pwdSent = !this.errors.mobile;
    },

    verify() {
      this.errors.sid = this.sid.trim() ? "" : "請填寫申請人身分證字號";
      this.errors.mobile = /^09\d{8}$/.test(this.mobile.trim()) ? "" : "手機號碼格式不符";
      if (!this.errors.sid && !this.errors.mobile) this.stage = "info";
    },

    backToVerify() {
      this.stage = "verify";
      this.pwd = "";
      this.pwdSent = false;
    },

    pickBank(code) {
      this.bank = code;
      this.branch = "";
    },

    toggleAll() {
      this.picked = this.allPicked ? [] : REFUND_MEMBERS.map((m) => m.name);
    },

    toggleMember(name) {
      const i = this.picked.indexOf(name);
      if (i === -1) this.picked.push(name);
      else this.picked.splice(i, 1);
    },
  },
});
