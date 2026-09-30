/* ============================================================
   forest-camp-4.js — 山屋住宿申請 步驟 4：附件上傳
   ------------------------------------------------------------
   2026-09-30 新增。正式站 apply_04.aspx 嘉明湖一般申請「無須上傳附件」，
   雛形照此呈現空表。注意事項另載「外籍人士提前申請：應上傳所有外籍人士護照等
   身分證明電子檔」——該分支的上傳清單〔待確認〕，雛形未做。
   ============================================================ */

const FC4_COLUMNS = [
  { key: "no", label: "NO.", align: "center" },
  { key: "name", label: "檢附資料名稱" },
  { key: "file", label: "上傳檔案" },
];

thPage({
  data() {
    const st = window.thFcState.load();
    return {
      cabin: window.TH_CABIN_DATA[st.route] || window.TH_CABIN_DATA.jiaming,
      columns: FC4_COLUMNS,
      rows: [],
    };
  },
  computed: {
    applyCrumb() { return window.TH_APPLY_CRUMB; },
  },
  methods: {
    go(url) { window.location.href = url; },
  },
});
