/* ============================================================
   apply2-edit.js — 資料線上異動/取消入園（舊站 apply_2.aspx）
   ------------------------------------------------------------
   **檔名不叫 apply-2.js**：那支已被申請流程第二步占用，兩者無關。
   對應頁面 `apply_2.html`（底線版，比照舊站 aspx 命名）。

   本檔只放資料、computed、methods；版面在 apply_2.html 的 in-DOM template。

   ------------------------------------------------------------
   查詢欄位與舊站的對應（2026-09-16 curl 實抓原始 HTML，非摘要）
   ------------------------------------------------------------
   | 舊站控制項              | 本頁 data | 備註 |
   |-------------------------|-----------|------|
   | ctl00$con$serial        | serial    | (一站式/入園)申請編號 |
   | ctl00$con$nation        | nation    | 國籍，**獨立一列** |
   | ctl00$con$sid           | sid       | 身分證號/護照號碼(居留證) |
   | ctl00$con$vcode         | vcode     | 驗證碼，走 th-captcha |

   注意 apply_3（申請進度查詢）的國籍控制項是 `con_apply_nation` 且**併在身分證那一列**，
   本頁是 `con_nation` 且獨立一列。兩頁看起來像但不同構。
   **2026-10-08 使用者裁示改為與 apply_3 相同：國籍併在身分證那一列，預設「中華民國」**（以上為舊站對照紀錄）。
   ============================================================ */

/* 大宗唯讀常數放模組層，不進 data()（進 data() 會被遞迴轉成 reactive proxy，白付代價） */

/* 結果區示意資料（匿名假資料，非真實案件）。
   欄位取自規格 06d 的「申請行程資料」段：申請編號、申請機關、入園日期、離園日期、
   隊名、登山主路線、次路線（2026-10-08 補上次路線欄與示意值，原本欄位清單漏列）。 */
const DEMO_RESULTS = [
  {
    serial: "115090300127",
    org: "玉山國家公園",
    dateIn: "2026-10-05",
    dateOut: "2026-10-06",
    team: "晨曦登山隊",
    route: "玉山主峰線（塔塔加登山口）",
    sub: "2~5天(塔塔加 - 玉山線 - 塔塔加)",
  },
];

/* 查詢通過後的兩種動作。**兩者必須在畫面上分開**（任務卡驗收條件）：
   異動是改人不改案，取消是撤案，期限與後果都不同。
   期限規則依各國家公園管理處自治條例，規格 06d 未列具體天數，一律標待確認，不猜。 */
const RESULT_ACTIONS = [
  {
    id: "modify",
    title: "線上資料異動",
    icon: "fa-solid fa-pen-to-square",
    desc: "修改領隊、隊員、留守人資料，或辦理隊員與領隊互換。經核准入園後，主路線與入園日期不得變更。",
    limit: "異動期限依各國家公園管理處自治條例規範。",
  },
  {
    id: "cancel",
    title: "取消入園",
    icon: "fa-solid fa-ban",
    desc: "領隊操作為整隊取消，隊員操作僅取消個人。取消後不可復原，需重新提出申請。",
    limit: "",
  },
];

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
        { key: "serial", label: "申請編號" },
        { key: "org", label: "申請機關" },
        { key: "team", label: "隊名" },
        { key: "route", label: "登山主路線" },
        { key: "sub", label: "次路線" },
        { key: "dateIn", label: "入園日期" },
        { key: "dateOut", label: "離園日期" },
      ],
    };
  },

  computed: {
    demoResults() { return DEMO_RESULTS; },
    resultActions() { return RESULT_ACTIONS; },
    /* window.* 只能在這裡取，不能在模組層：資料檔與頁面腳本的載入先後沒有保證，
       模組層取值時 window.TH_APPLY_CRUMB 可能還沒定義。computed 在掛載時才求值。 */
    applyCrumb() { return window.TH_APPLY_CRUMB; },
  },

  methods: {
    /* 進入申請步驟（異動模式，2026-10-12）：帶申請編號、管理處、隊名、入園日期與天數到國家公園行程規劃頁 */
    enterEdit(row) {
      const park = { "玉山國家公園": "yushan", "雪霸國家公園": "shei-pa", "太魯閣國家公園": "taroko" }[row.org] || "yushan";
      const q = new URLSearchParams({ unit: park, edit: row.serial, teams_name: row.team, applystart: row.dateIn });
      if (park !== "yushan") q.set("park", park);
      window.location.href = "apply-3.html?" + q.toString();
    },
    reset() {
      this.serial = "";
      this.nation = "中華民國";
      this.sid = "";
      this.vcode = "";
      this.submitted = false;
    },
  },
});
