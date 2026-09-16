/* ============================================================
   apply_draft.js — 草稿編輯（規格 02_Spec/07_草稿編輯.md 第一、二節）
   ------------------------------------------------------------
   舊站 apply_2_1.aspx。規格第三～六節是申請流程步驟一～四，雛形已有
   apply-1／apply-2／apply-3，不在本頁重做（理由寫在 apply_draft.html 檔頭）。

   drafts 會被刪除，所以進 data()；欄位定義與檢核訊息才是唯讀常數。
   ============================================================ */

const DRAFT_COLUMNS = [
  { key: "saved", label: "草稿紀錄時間" },
  { key: "org", label: "機關" },
  { key: "route", label: "登山路線" },
  { key: "enter", label: "入園日期" },
  { key: "team", label: "隊名" },
  { key: "ops", label: "功能" },
];

const DRAFT_ROWS = [
  { id: "d1", saved: "2026-09-12 21:04", org: "玉山國家公園管理處", route: "玉山線／塔塔加 － 玉山主峰 － 塔塔加", enter: "2026-11-08", team: "曉風登山隊" },
  { id: "d2", saved: "2026-09-09 08:37", org: "雪霸國家公園管理處", route: "雪東線／武陵 － 雪山主峰", enter: "2026-12-06", team: "北稜練習隊" },
  { id: "d3", saved: "2026-08-30 19:50", org: "太魯閣國家公園管理處", route: "奇萊主北峰", enter: "2026-10-25", team: "週末小隊" },
];

/* Email 只檢查「有沒有 @ 與網域」，不追求 RFC 完整性——舊站前端也只做形式檢查 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

thPage({
  data() {
    return {
      nation: "",
      sid: "",
      email: "",
      vcode: "",
      errors: { sid: "", email: "" },
      queried: false,
      showOpenHours: false,

      drafts: DRAFT_ROWS.slice(),

      navItems: [
        { id: "query", label: "查詢草稿" },
        { id: "list", label: "草稿清單" },
      ],

      draftColumns: DRAFT_COLUMNS,
    };
  },

  computed: {
    applyCrumb() { return window.TH_APPLY_CRUMB; },
  },

  methods: {
    query() {
      /* 舊站送出前跑 trimdata() 清前後空白，這裡照做 */
      this.sid = this.sid.trim();
      this.email = this.email.trim();

      this.errors.sid = this.sid ? "" : "請填寫身分證號／護照號碼（或居留證）";
      this.errors.email = EMAIL_RE.test(this.email) ? "" : "Email 格式不符";
      if (this.errors.sid || this.errors.email) return;

      this.queried = true;
      this.showOpenHours = true;
    },

    reset() {
      this.nation = "";
      this.sid = "";
      this.email = "";
      this.vcode = "";
      this.errors.sid = "";
      this.errors.email = "";
      this.queried = false;
    },

    removeDraft(id) {
      this.drafts = this.drafts.filter((d) => d.id !== id);
    },
  },
});
