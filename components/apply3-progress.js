/* ============================================================
   apply3-progress.js — 申請進度查詢/許可證下載（舊站 apply_3.aspx）
   ------------------------------------------------------------
   **檔名不叫 apply-3.js**：那支已被申請流程第三步占用，兩者無關。
   對應頁面 `apply_3.html`（底線版，比照舊站 aspx 命名）。

   2026-09-16 由 `components/apply-search.js` 搬來：這些狀態與資料原本掛在入口頁上，
   但正式站的 applySearch.aspx 只有四張入口卡，查詢表單屬於 apply_3.aspx。
   搬移時邏輯未改，只換了檔案。

   ------------------------------------------------------------
   查詢欄位與舊站的對應（2026-09-16 curl 實抓原始 HTML）
   ------------------------------------------------------------
   | 舊站控制項                | 本頁 data | 備註 |
   |---------------------------|-----------|------|
   | ctl00$con$serial          | serial    | (一站式/入園)申請編號 |
   | ctl00$con$apply_nation    | nation    | 國籍，**併在身分證那一列** |
   | ctl00$con$sid             | sid       | 身分證號/護照號碼(居留證) |
   | ctl00$con$vcode           | vcode     | 驗證碼，走 th-captcha |

   注意 apply_2（資料線上異動）的國籍是 `con_nation` 且**獨立一列**，本頁是
   `con_apply_nation` 且併列。兩頁看起來像但不同構，不要為了統一而改任何一邊。

   ------------------------------------------------------------
   columns 的 render 為什麼改走 slot
   ------------------------------------------------------------
   React 版三欄（隊伍／領隊、審核狀態、許可證）的 render 回傳 JSX 元素。
   th-data-table 的 render 只收字串（prop 傳函式再回 VNode 在 Vue 裡不自然），
   要回元素一律走 cell slot，在 slot 內以 column.key 分流。
   其餘四欄沒有 render，走 slot 的 v-else 分支直接輸出 value。
   ============================================================ */

/* 大宗唯讀常數放模組層，不進 data()。

   結果區示意資料（匿名假資料，非真實案件）。
   欄位組成與狀態值皆 [待確認]——舊站查詢結果需真實案號才看得到。 */
const DEMO_RESULTS = [
  {
    serial: "115090300127",
    org: "玉山國家公園",
    route: "玉山主峰線（塔塔加登山口）",
    date: "2026-10-05 ～ 2026-10-06",
    team: "晨曦登山隊",
    leader: "王小明",
    members: 6,
    state: "已核准",
    permit: true,
  },
  {
    serial: "115082900461",
    org: "林業及自然保育署",
    route: "嘉明湖國家步道（向陽登山口）",
    date: "2026-11-12 ～ 2026-11-14",
    team: "山行者隊",
    leader: "陳美芳",
    members: 4,
    state: "審核中",
    permit: false,
  },
];

const STATE_FLAG = {
  已核准: "is-open",
  審核中: "is-proof",
  未通過: "is-closed",
};

thPage({
  data() {
    return {
      serial: "",
      nation: "",
      sid: "",
      vcode: "",
      submitted: false,

      navItems: [
        { id: "progress", label: "申請進度查詢" },
        { id: "rules", label: "列印與退費規定" },
      ],

      // 表格欄位定義：label 逐字取自原 JSX，render 全數改由 cell slot 處理
      columns: [
        { key: "serial", label: "申請編號" },
        { key: "org", label: "受理機關" },
        { key: "route", label: "申請路線" },
        { key: "date", label: "入園（住宿）日期" },
        { key: "team", label: "隊伍／領隊" },
        { key: "state", label: "審核狀態" },
        { key: "permit", label: "許可證" },
      ],

      refundColumns: [
        { key: "when", label: "取消時間（以起算日計）" },
        { key: "refund", label: "退費比例" },
      ],
      refundRows: [
        { when: "起算日前 5 日前取消成功", refund: "全額退還已付金額" },
        { when: "起算日前 4 日取消成功", refund: "退還已付金額百分之五十" },
        { when: "起算日前 3 日內取消，及住宿當日未到", refund: "不退還已付之金額" },
      ],
    };
  },

  computed: {
    demoResults() { return DEMO_RESULTS; },
    stateFlag() { return STATE_FLAG; },
    /* window.* 一律在這裡取，不在模組層（載入先後無保證） */
    applyCrumb() { return window.TH_APPLY_CRUMB; },
  },

  methods: {
    reset() {
      this.serial = "";
      this.nation = "";
      this.sid = "";
      this.vcode = "";
      this.submitted = false;
    },
  },
});
