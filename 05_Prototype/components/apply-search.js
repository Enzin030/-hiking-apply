/* ============================================================
   apply-search.js — 申請進度查詢／繳費／異動／取消
   原 ApplySearch.jsx（371 行）。版面已搬回 applySearch.html。
   ============================================================

   ------------------------------------------------------------
   useState / useRef → Vue 的逐一對應（不批次轉，逐項確認過）
   ------------------------------------------------------------
   | 原 React                    | Vue              | 備註 |
   |-----------------------------|------------------|------|
   | useState("")    serial      | data.serial      | 申請編號 |
   | useState("")    nation      | data.nation      | 國籍下拉，同時決定身分證欄的 placeholder |
   | useState("")    sid         | data.sid         | 身分證／護照 |
   | useState("")    vcode       | data.vcode       | 驗證碼（雛形不驗） |
   | useState(false) submitted   | data.submitted   | 只控制結果區是否出現 |
   | useRef(null)    formRef     | $refs.serial    | 入口卡捲動後要聚焦的第一個欄位 |
   | columns（render 回 JSX）     | data.columns ＋ cell slot | 見下 |

   ------------------------------------------------------------
   columns 的 render 為什麼改走 slot
   ------------------------------------------------------------
   React 版三欄（隊伍／領隊、審核狀態、許可證）的 render 回傳 JSX 元素。
   th-data-table 的 render 只收字串（prop 傳函式再回 VNode 在 Vue 裡不自然），
   要回元素一律走 cell slot，在 slot 內以 column.key 分流。
   其餘四欄沒有 render，走 slot 的 v-else 分支直接輸出 value，
   與元件的預設 slot 內容相同。

   ------------------------------------------------------------
   SEARCH_ACTIONS／DEMO_RESULTS／STATE_FLAG 不放進 data()
   ------------------------------------------------------------
   照「大宗資料常數不進 data()」的通則（v4 遷移互動頁的四條通則之一）：
   放進 data() 會被深度轉成 reactive proxy，物件識別改變會影響 v-for 的 :key
   比對。這三份在頁面生命週期內唯讀，改用 computed 回傳原陣列。
   ============================================================ */

/* 舊站四個操作入口。built=false 者在本雛形尚未建置，出待建置標記不給假連結。 */
const SEARCH_ACTIONS = [
  {
    id: "progress",
    title: "申請進度查詢",
    icon: "fa-solid fa-magnifying-glass",
    desc: "入園申請僅查詢、下載許可證；林保署山屋可繳費、異動資料。",
    cabins: ["天池山莊", "檜谷山莊／營地", "嘉明湖山屋／營地", "向陽山屋"],
    legacy: "apply_3.aspx",
    built: true,
  },
  {
    id: "modify",
    title: "申請資料異動及取消",
    icon: "fa-solid fa-pen-to-square",
    desc: "入園申請可異動資料。",
    cabins: [],
    legacy: "apply_2.aspx",
    built: false,
  },
  {
    id: "pay",
    title: "國家公園線上繳費",
    icon: "fa-solid fa-credit-card",
    desc: "國家公園山屋列印繳費說明及線上繳費。",
    cabins: ["排雲山莊", "觀高山屋"],
    legacy: "apply_4.aspx",
    built: false,
  },
  {
    id: "refund",
    title: "國家公園線上退費",
    icon: "fa-solid fa-rotate-left",
    desc: "國家公園山屋退費功能。",
    cabins: ["排雲山莊", "觀高山屋"],
    legacy: "apply_5.aspx",
    built: false,
  },
];

/*
  結果區示意資料（匿名假資料，非真實案件）。
  欄位組成與狀態值皆 [待確認]——舊站查詢結果需真實案號才看得到。
*/
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
        { id: "actions", label: "請選擇操作方式" },
              { id: "progress", label: "申請進度查詢" },
              { id: "rules", label: "列印與退費規定" }
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
    // 唯讀常數，不進 data()（理由見檔頭）
    actions() { return SEARCH_ACTIONS; },
    demoResults() { return DEMO_RESULTS; },
    stateFlag() { return STATE_FLAG; },
    applyCrumb() { return window.TH_APPLY_CRUMB; },
  },

  methods: {
    /* 入口卡的第一張不另開頁，捲到本頁查詢區並聚焦第一個欄位 */
    gotoForm() {
      const el = document.getElementById("progress");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      // 350ms 是原 React 版的值：等平滑捲動走完再聚焦，否則瀏覽器會把捲動打斷
      if (this.$refs.serial) window.setTimeout(() => this.$refs.serial.focus(), 350);
    },

    reset() {
      this.serial = "";
      this.nation = "";
      this.sid = "";
      this.vcode = "";
      this.submitted = false;
    },
  },
});
