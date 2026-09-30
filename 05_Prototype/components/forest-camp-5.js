/* ============================================================
   forest-camp-5.js — 山屋住宿申請 步驟 5：同意聲明
   ------------------------------------------------------------
   2026-09-30 新增。全文取自 window.TH_FC_NOTICES（ForestCampNoticeData.js，
   正式站原文、四間山屋都有）。**只在 data() 裡讀**——資料檔在 <body> 底部載入，
   與本腳本沒有保證的先後（踩坑總表第七類）。
   未勾選按下一步：正式站跳「請確認已勾選同意聲明」，雛形以欄位下方提示呈現。
   ============================================================ */

thPage({
  data() {
    const st = window.thFcState.load();
    const route = st.route || "jiaming";
    const all = window.TH_FC_NOTICES || {};
    return {
      cabin: window.TH_CABIN_DATA[route] || window.TH_CABIN_DATA.jiaming,
      notice: all[route] || all.jiaming || { title: "", paras: [] },
      agreed: !!st.agreed,
      warn: false,
    };
  },
  computed: {
    applyCrumb() { return window.TH_APPLY_CRUMB; },
  },
  methods: {
    next() {
      if (!this.agreed) { this.warn = true; return; }
      window.thFcState.save({ agreed: true });
      window.location.href = "forest-camp-6.html";
    },
    prev() {
      window.thFcState.save({ agreed: this.agreed });
      window.location.href = "forest-camp-4.html";
    },
  },
});
