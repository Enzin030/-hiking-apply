/* ============================================================
   apply_04.js — 六步驟家族 步驟 4：附件上傳（警政署、自然保護區域、山屋共用）
   ------------------------------------------------------------
   2026-09-30 新增（原 forest-camp-4.js）。正式站 apply_04.aspx 三類本次實走的路線都「無須上傳附件」，
   雛形照此呈現空表；清單由 thFcState.attachments 決定（目前沒有頁面寫入）。
   需要附件的情形〔待確認〕，雛形未做：自然保護區域部分區域的申請目的「須附行程計畫書」
   （測試站鴛鴦湖，05e）、山屋外籍人士提前申請須上傳護照（注意事項）。
   ============================================================ */

const A04_COLUMNS = [
  { key: "no", label: "NO.", align: "center" },
  { key: "name", label: "檢附資料名稱" },
  { key: "file", label: "上傳檔案" },
];

thPage({
  data() {
    const st = Object.assign({ title: "山屋住宿申請", crumb: "嘉明湖山屋" }, window.thFcState.load());
    return { st: st, columns: A04_COLUMNS, rows: st.attachments || [] };
  },
  computed: {
    applyCrumb() { return window.TH_APPLY_CRUMB; },
  },
  methods: {
    go(url) { window.location.href = url; },
  },
});
