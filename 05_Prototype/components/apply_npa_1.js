/* ============================================================
   apply_npa_1.js — 警政署入山證申請 步驟 1：日期確認
   ------------------------------------------------------------
   2026-09-30 新增。依據 02_Spec/05d §二（正式站 2026-09-29）：
   - 行程天數 1～19；選了天數才有出發日期；出發日期最早為今日＋3、共 60 個
   - 出發人數 1～19（隊伍人數含領隊）
   - 正式站路線資料 sumdaymax＝1 與畫面 1～19 不一致〔待確認〕，雛形照畫面
   - 正式站從路線列表進入前有「複合申請」詢問彈窗（測試站觀察，05d 未實走），雛形未做

   暫存：從路線列表帶 ?unit= 進來＝新的一張申請，先清掉 thFcState（避免正式站
   跨申請殘留缺陷，05e §7）；從第 2 步按上一步回來（無 unit）則保留已填內容。
   ============================================================ */

const NPA1_P = new URLSearchParams(window.location.search);

thPage({
  data() {
    if (NPA1_P.get("unit")) window.thFcState.reset();
    const st = window.thFcState.load();
    const same = st.kind === "npa";
    const today = window.thTodayValue();
    return {
      nowTime: new Date().toTimeString().slice(0, 5),
      /* 出發日期：今日＋3 起連續 60 個（正式站 2026-09-29 為 10-02～11-30，無排除日） */
      dates: Array.from({ length: 60 }, (_, i) => window.thAddDaysToDateValue(today, 3 + i)),
      /* 必填欄位預設帶入示意資料（2026-10-02）：2 天、第 3 個可選日、2 人 */
      days: same ? Number(st.days) || 2 : 2,
      start: same && st.start ? st.start : window.thAddDaysToDateValue(today, 3 + 2),
      headcount: same ? Number(st.headcount) || 2 : 2,
    };
  },
  computed: {
    applyCrumb() { return window.TH_APPLY_CRUMB; },
  },
  methods: {
    next() {
      const e = [];
      if (!this.days) e.push("請選擇行程天數");
      if (!this.start) e.push("請選擇出發日期");
      if (!this.headcount) e.push("請選擇出發人數");
      if (e.length) { window.thAlertList(e); return; }
      window.thFcState.save({
        kind: "npa",
        title: "警政署入山證申請",
        crumb: "警政署入山證",
        backUrl: "apply_npa_2.html",
        plan: { unit: "警政署入山", main: "入山證申請", route: "入山證申請" },
        days: this.days, start: this.start, headcount: this.headcount,
      });
      window.location.href = "apply_npa_2.html";
    },
  },
});
