/* ============================================================
   apply_05.js — 六步驟家族 步驟 5：同意聲明（警政署、自然保護區域、山屋共用）
   ------------------------------------------------------------
   2026-09-30 新增（原 forest-camp-5.js）。聲明內容依 thFcState.kind：
     npa  ：window.TH_APPLY6_NOTICES.npa，勾選「同意上述聲明」
     area ：window.TH_APPLY6_NOTICES.area[areaType]（85 自然保留區／86 自然保護區／87 野生動物保護區）
     camp ：window.TH_FC_NOTICES[route]（山屋注意事項）
   area、camp 勾選「以上說明，本人業已完全明瞭，並同意確實遵守相關規定。」
   **只在 data() 裡讀資料檔**——資料檔在 <body> 底部載入，與本腳本沒有保證的先後。
   正式站未勾選按下一步跳「請確認已勾選同意聲明」，雛形以欄位下方提示呈現。
   ============================================================ */

thPage({
  data() {
    const st = Object.assign({ kind: "camp", title: "山屋住宿申請", crumb: "嘉明湖山屋", route: "jiaming" }, window.thFcState.load());
    const a6 = window.TH_APPLY6_NOTICES || { npa: {}, area: {}, areaAgree: "" };
    const fc = window.TH_FC_NOTICES || {};
    let notice = { title: "", paras: [] };
    if (st.kind === "area") {
      const n = a6.area[st.areaType] || a6.area["85"] || { lines: [], title: "" };
      /* 原文第一行即區域類型名稱，與卡片標題重複，略去 */
      notice = { title: "", paras: n.lines[0] === n.title ? n.lines.slice(1) : n.lines };
    } else if (st.kind === "camp") {
      notice = fc[st.route] || fc.jiaming || notice;
    }
    /* 警政署條目：隱私權保護政策（連結）、作業使用說明（彈窗）、正式站 body 三段（含「我同意並了解以上⋯」） */
    const npaItems = [{ id: "privacy", type: "privacy" }, { id: "manual", type: "manual" }]
      .concat(((a6.npa && a6.npa.body) || []).map((t, i) => ({ id: "body" + i, type: "text", text: t })));
    const allOn = st.agreed !== false;   // 預設全勾（必填預帶）；從後面步驟按上一步回來時沿用
    const acked = {};
    npaItems.forEach(it => { acked[it.id] = allOn; });
    return {
      st: st,
      npa: a6.npa,
      npaItems: npaItems,
      acked: acked,
      notice: notice,
      areaAgree: a6.areaAgree,
      agreed: st.agreed !== undefined ? !!st.agreed : true,   // 預設帶入勾選（2026-10-02）
      warn: false,
      manualOpen: false,
    };
  },
  computed: {
    applyCrumb() { return window.TH_APPLY_CRUMB; },
    blockTitle() {
      if (this.st.kind === "npa") return "警政署";
      if (this.st.kind === "area") return (this.st.plan && this.st.plan.unit) || "自然保護區域";
      return "山屋/營地";
    },
    icon() {
      if (this.st.kind === "npa") return "ph-bold ph-shield-check";
      if (this.st.kind === "area") return "ph-bold ph-tree";
      return "ph-bold ph-house";
    },
    agreeText() { return this.st.kind === "npa" ? this.npa.agree : this.areaAgree; },
  },
  methods: {
    toggleAck(id) { this.acked[id] = !this.acked[id]; this.warn = false; },
    ack(id) { this.acked[id] = true; this.warn = false; },
    openManual(id) { this.ack(id); this.manualOpen = true; },
    next() {
      // 警政署：條目全部點閱才算同意
      if (this.st.kind === "npa") this.agreed = this.npaItems.every(it => this.acked[it.id]);
      if (!this.agreed) { this.warn = true; return; }
      window.thFcState.save({ agreed: true });
      window.location.href = "apply_06.html";
    },
    prev() {
      window.thFcState.save({ agreed: this.agreed });
      window.location.href = "apply_04.html";
    },
  },
});
