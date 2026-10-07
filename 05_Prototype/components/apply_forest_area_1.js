/* ============================================================
   apply_forest_area_1.js — 林保署自然保護區域申請 步驟 1：日期確認
   ------------------------------------------------------------
   2026-09-30 新增。依據 02_Spec/05e §二（正式站 2026-09-29 實走北插天山）：
   - 標題列為區域類型（自然保留區），推薦行程為區域名稱
   - 行程天數依區域（北插天山只有 1）；出發日期最早今日＋5、共 57 個；出發人數 1～15
   - 正式站選天數後以 Func=FormForestAreaList 查可申請日期與名額，雛形以連續日期示意
   網址參數比照正式站：?unit=<機關代碼>&tmpc_id=<cId>&tmpf_id=<fId>。
   區域資料取 window.TH_FOREST_AREAS[tmpc_id]（正式站路線清單上的 23 區，2026-10-01 補齊），
   天數、人數上限、最早天數與日期數依區域；**沒有資料的區域顯示尚未盤點**，不套用任何一筆。
   暫存：帶 unit 進來＝新的一張申請，先清 thFcState（同 apply_npa_1）。
   ============================================================ */

const FA1_P = new URLSearchParams(window.location.search);

thPage({
  data() {
    if (FA1_P.get("unit")) window.thFcState.reset();
    const st = window.thFcState.load();
    const cid = FA1_P.get("tmpc_id") || st.areaCid || "630";
    const area = (window.TH_FOREST_AREAS || {})[cid] || null;
    /* 沒有資料的區域：麵包屑仍顯示路線列表上的名稱 */
    const route = (window.ROUTE_DATA || []).find(r => r.cId === cid);
    const same = st.kind === "area" && st.areaCid === cid;
    const today = window.thTodayValue();
    return {
      area: area,
      cid: cid,
      crumb: area ? area.name : (route ? route.name : "自然保護區域"),
      nowTime: new Date().toTimeString().slice(0, 5),
      dates: area ? Array.from({ length: area.dateCount }, (_, i) => window.thAddDaysToDateValue(today, area.minDaysAhead + i)) : [],
      /* 必填欄位預設帶入示意資料（2026-10-02）：區域第一個天數、第 3 個可選日、2 人 */
      days: same ? Number(st.days) || (area ? area.days[0] : 0) : (area ? area.days[0] : 0),
      start: same && st.start ? st.start : (area ? window.thAddDaysToDateValue(today, area.minDaysAhead + 2) : ""),
      headcount: same ? Number(st.headcount) || 2 : 2,
    };
  },
  computed: {
    /* 離開日期（2026-10-07）：出發日＋天數－1 */
    endDate() { return this.start && this.days ? window.thAddDaysToDateValue(this.start, this.days - 1) : ""; },
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
        kind: "area",
        title: "自然保護區域申請",
        crumb: this.area.name,
        backUrl: "apply_forest_area_2.html",
        areaCid: this.cid,
        areaType: this.area.typeCode,
        plan: { unit: this.area.type, main: this.area.name, route: this.area.name },
        days: this.days, start: this.start, headcount: this.headcount,
      });
      window.location.href = "apply_forest_area_2.html";
    },
  },
});
