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
   columns 的 render 為什麼改走 slot（以下為 2026-10-08 改結構前的說明，slot 分流做法沿用）
   ------------------------------------------------------------
   React 版三欄（隊伍／領隊、審核狀態、許可證）的 render 回傳 JSX 元素。
   th-data-table 的 render 只收字串（prop 傳函式再回 VNode 在 Vue 裡不自然），
   要回元素一律走 cell slot，在 slot 內以 column.key 分流。
   其餘四欄沒有 render，走 slot 的 v-else 分支直接輸出 value。
   ============================================================ */

/* 大宗唯讀常數放模組層，不進 data()。

   結果區示意資料（匿名假資料，非真實案件）。2026-10-08 依規格截圖（02_Spec/06a「申請進度查詢-已通過／待處理」）改結構：
   案件表頭（申請日期／案件編號／單位／申請項目）＋項目表（項目單位｜項目案件編號｜狀態｜功能，
   狀態值照截圖「已通過／待處理」，已通過才有「下載許可證」）＋「國家公園行程計畫」＋「山屋及營地申請」。
   示意案件含國家公園（已通過）與警政署入山證（待處理）兩個項目，兩種狀態一次看得到。 */
const DEMO_CASE = {
  applyDate: "2026-09-11",
  caseSerial: "202609110001",
  unit: "雪霸國家公園管理處",
  item: "(3級) 雪山主峰(多日行程)",
  team: "天眼1隊",
  items: [
    { unit: "國家公園", serial: "S115000019", state: "已通過" },
    { unit: "警政署入山證", serial: "N115000233", state: "待處理" },
  ],
};
/* 摘要卡（2026-10-12 改用 th-summary-card、拿掉單位）：照片與難度取路線列表同一條（RouteData np-99 雪山主峰(多日行程)，第 3 級） */
const DEMO_PLAN = {
  image: "assets/route-wuling.png", diff: 3,
  start: "2026-09-16", end: "2026-09-17", days: 2, people: 4,
  main: "雪山主峰線", sub: "雪山主峰(多日行程)",
  daysPlan: [["雪山登山口", "七卡山莊", "雪山東峰", "三六九山莊"], ["三六九山莊", "雪山東峰", "七卡山莊", "雪山登山口"]],
};
const DEMO_CAMP = [
  { key: 1, date: "2026-09-16", place: "三六九山莊", need: 4, booked: 4, bed: "21、22、23、24" },
];

const STATE_FLAG = {
  已通過: "is-open",
  待處理: "is-proof",
};

thPage({
  data() {
    return {
      serial: "",
      nation: "中華民國",   // 預設中華民國（使用者 2026-10-08）
      sid: "",
      vcode: "",
      vcodeCode: "7K4M",   // 驗證碼顯示碼（th-captcha 可換碼模式，同線上申請確認頁）
      submitted: false,

      columns: [
        { key: "unit", label: "項目單位" },
        { key: "serial", label: "項目案件編號" },
        { key: "state", label: "狀態", align: "center" },
        { key: "fn", label: "功能", align: "center" },
      ],
      campColumns: [
        { key: "date", label: "住宿日期" },
        { key: "place", label: "住宿點" },
        { key: "need", label: "需求床位數", align: "center" },
        { key: "booked", label: "排定床位數", align: "center" },
        { key: "bed", label: "床號" },
      ],
    };
  },

  computed: {
    caseInfo() { return DEMO_CASE; },
    plan() { return DEMO_PLAN; },
    campRows() { return DEMO_CAMP; },
    stateFlag() { return STATE_FLAG; },
    /* window.* 一律在這裡取，不在模組層（載入先後無保證） */
    applyCrumb() { return window.TH_APPLY_CRUMB; },
  },

  methods: {
    /* 下載許可證：尚未建置，跳 SweetAlert 提示（使用者 2026-10-12） */
    downloadPermit() { window.thAlert("此功能建置中", "info"); },
  },
});
