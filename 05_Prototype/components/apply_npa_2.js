/* ============================================================
   apply_npa_2.js — 警政署入山證申請 步驟 2：行程規劃（正式站稱行程計畫）
   ------------------------------------------------------------
   2026-09-30 新增。依據 02_Spec/05d §三（正式站 2026-09-29）：
   - 入山事由（預設登山健行）、前往地點（加入清單，每筆描述**必填**）、登山路線圖（兩層詞庫）、
     登山計畫書——沿用共用元件 th-npa-permit，**全部空白起手**
   - 下一步檢核照正式站 NpaNext：地點至少一筆、描述必填、路線圖、計畫書
     （測試站 2026-09-17 曾卡在描述未填，正式站 2026-09-29 證實填了即可通過）
   第 3～6 步為家族共用頁 apply_03～06（kind＝npa）。

   2026-10-08 使用者裁示「日期確認併入行程規劃」：原第 1 步 apply_npa_1 的日期卡（行程天數 1～19、出發日期今日＋3 起 60 個、
   離開日期）改用共用元件 th-trip-basics 放在本頁頂端，原 apply_npa_1 的狀態寫入（kind、title、crumb、plan、days、start、
   headcount）一併搬到本頁 next()／prev()。同意書頁帶 ?new=1 進來＝新的一張申請（thFcState.enter() 清掉上一張暫存）。
   出發人數第 1 步已不選（2026-10-06），headcount 仍存示意值 2，隊伍資料頁據此預先產生隊員列。
   ============================================================ */

thPage({
  data() {
    window.thFcState.enter();
    const st = window.thFcState.load();
    const same = st.kind === "npa";
    const today = window.thTodayValue();
    return {
      /* 出發日期：今日＋3 起連續 60 個（正式站 2026-09-29 為 10-02～11-30，無排除日） */
      dates: Array.from({ length: 60 }, (_, i) => window.thAddDaysToDateValue(today, 3 + i)),
      /* 必填欄位預設帶入示意資料（2026-10-02）：2 天、第 3 個可選日、2 人 */
      days: same ? Number(st.days) || 2 : 2,
      start: same && st.start ? st.start : window.thAddDaysToDateValue(today, 3 + 2),
      headcount: same ? Number(st.headcount) || 2 : 2,
      /* 必填欄位預設帶入示意資料（2026-10-02）：前往地點與路線圖同正式站南湖大山線預設，計畫書為示意 */
      npa: st.npa || { reason: "登山健行",
        places: [{ code: "532+10002+10002110+1+0", name: "南湖北山(宜蘭縣-大同鄉)", desc: "南湖大山線，經雲稜山屋、審馬陣山屋" }],
        lib: "TM00", sub: "M15",
        plan: "D1:思源埡口→5.1K登山口→多加屯山登山口→木杆鞍部→雲稜山屋。\nD2:雲稜山屋→審馬陣登山口→審馬陣山屋。\nD3:審馬陣山屋→審馬陣登山口→雲稜山屋→木杆鞍部→多加屯山登山口→5.1K登山口→思源埡口。" },
      activeNavIndex: 0,   // 本頁內容導覽目前項目
    };
  },
  computed: {
    /* 本頁內容導覽（2026-10-07）：卡內四個欄位（th-npa-permit 的 id 為 npa-reason／-place／-lib／-plan）；完成條件同 check() */
    sideItems() {
      const n = this.npa;
      return [
        { key: "basic", sec: "sec-basic", label: "路線與基本資料", ok: !!(this.days && this.start) },
        { key: "reason", sec: "npa-reason", label: "入山事由", ok: !!n.reason },
        { key: "place", sec: "npa-place", label: "前往地點", ok: n.places.length > 0 && n.places.every(p => p.desc) },
        { key: "lib", sec: "npa-lib", label: "登山路線圖", ok: !!(n.lib && n.sub) },
        { key: "plan", sec: "npa-plan", label: "登山計畫書", ok: !!n.plan },
      ];
    },
    completedSectionsCount() { return this.sideItems.filter(it => it.ok).length; },
    applyCrumb() { return window.TH_APPLY_CRUMB; },
    dayOptions() { return Array.from({ length: 19 }, (_, i) => i + 1); },
  },
  methods: {
    /* 本頁內容導覽：捲到區塊（欄位則捲到所在 .th-field），同 apply_03 */
    scrollToSection(id, i) {
      this.activeNavIndex = i;
      const el = document.getElementById(id);
      if (el) (el.closest(".th-field") || el).scrollIntoView({ behavior: "smooth", block: "start" });
    },
    check() {
      const e = [];
      if (!this.days) e.push("請選擇行程天數");
      if (!this.start) e.push("請選擇出發日期");
      const n = this.npa;
      if (!n.places.length) e.push("請至少加入一個前往地點");
      if (n.places.some(p => !p.desc)) e.push("前往地點描述未填寫");
      // 無圖幅的詞庫（正式站 E00／D00／C00／B00／A00）只需選詞庫
      const lib = (window.TH_NPA_LIBS || []).find(l => l.id === n.lib);
      if (!n.lib || (!n.sub && (!lib || lib.subs.length))) e.push("請選擇登山路線圖");
      if (!n.plan) e.push("請填寫登山計畫書");
      return e;
    },
    next() {
      const e = this.check();
      if (e.length) { window.thAlertList(e); return; }
      /* 正式站確認頁不顯示入山證明細：「入山路線」列 id="npaRoute" 為 sethide 且無值（2026-09-29 擷取） */
      window.thFcState.save(this.stateOf());
      window.location.href = "apply_03.html";
    },
    /* 上一步回第一步「閱讀同意書」，已填內容先存起來 */
    prev() {
      window.thFcState.save(this.stateOf());
      const q = new URLSearchParams(window.location.search);
      q.set("kind", "npa");
      window.location.href = "apply-2.html?" + q.toString();
    },
    /* 交給第 3～6 步的狀態（原 apply_npa_1 next() 寫的欄位＋入山證） */
    stateOf() {
      return {
        kind: "npa",
        title: "警政署入山證申請",
        crumb: "警政署入山證",
        backUrl: "apply_npa_2.html",
        plan: { unit: "警政署入山", main: "入山證申請", route: "入山證申請" },
        days: this.days, start: this.start, headcount: this.headcount,
        npa: this.npa,
      };
    },
  },
});
