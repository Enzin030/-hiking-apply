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

/* 示意案件（匿名假資料，非真實案件）。2026-10-12 起查詢後不顯示結果表，直接以此案件進入異動頁（apply-3?edit=）；
   欄位取自規格 06d 的「申請行程資料」段（申請編號、申請機關、入園／離園日期、隊名、主／次路線）。 */
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

thPage({
  data() {
    return {
      serial: "",
      nation: "中華民國",   // 預設中華民國（使用者 2026-10-08）
      sid: "",
      vcode: "",
      vcodeCode: "7K4M",   // 驗證碼顯示碼（th-captcha 可換碼模式，同線上申請確認頁）
    };
  },

  computed: {
    demoResults() { return DEMO_RESULTS; },
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
    },
  },
});
