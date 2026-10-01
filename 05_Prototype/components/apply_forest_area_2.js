/* ============================================================
   apply_forest_area_2.js — 林保署自然保護區域申請 步驟 2：行程計畫
   ------------------------------------------------------------
   2026-09-30 新增。依據 02_Spec/05e §三（正式站 2026-09-29 實走北插天山）：
   - 進入範圍可多選；**入口、出口選項只列已勾選範圍的對應入口**（正式站即時過濾，純前端）
   - 抵達入口／出口時間：05:00～18:00 每半小時
   - 申請目的：依區域，多數單選（radio），鴛鴦湖為複選（checkbox，purposeInput）；
     每項的須附件數為 attach（北插天山不須；十八羅漢山只有「人員入出」不須；鴛鴦湖全部須附件）
   - 安全聲明與宣達清單（4～9）的數量與內容依區域設定；radio 類必勾，
     正式站 OtherName7／8 為唯讀已帶入文字，雛形照呈現、不需勾選
   選到須附件的目的時，下一步擋下並說明：正式站於本步驟要求上傳（盤點環境禁止上傳，未看到上傳介面）〔待確認〕。
   第 3～6 步為家族共用頁 apply_03～06（kind＝area）。
   ============================================================ */

thPage({
  data() {
    const st = window.thFcState.load();
    const area = (window.TH_FOREST_AREAS || {})[st.areaCid || "630"] || window.TH_FOREST_AREAS["630"];
    const saved = st.areaPlan || {};
    const confirms = {};
    area.blocks.forEach(b => { if (b.input === "radio") confirms[b.name] = !!(saved.confirms && saved.confirms[b.name]); });
    return {
      area: area,
      picked: saved.picked || [],
      notes: saved.notes || "",
      entr: saved.entr || "",
      entrTime: saved.entrTime || "",
      exit: saved.exit || "",
      exitTime: saved.exitTime || "",
      purpose: saved.purpose || "",
      purposes: saved.purposes || [],
      confirms: confirms,
      errors: [],
      errorOpen: false,
    };
  },
  computed: {
    applyCrumb() { return window.TH_APPLY_CRUMB; },
    entrOptions() { return this.area.entrances.filter(o => this.picked.indexOf(o.value) >= 0); },
    exitOptions() { return this.area.exits.filter(o => this.picked.indexOf(o.value) >= 0); },
    multiPurpose() { return this.area.purposeInput === "checkbox"; },
    chosenPurposes() { return this.multiPurpose ? this.purposes : (this.purpose ? [this.purpose] : []); },
    /* 所選目的的須附件數合計 */
    attachNeeded() {
      return this.area.purposes.filter(p => this.chosenPurposes.indexOf(p.value) >= 0).reduce((s, p) => s + (p.attach || 0), 0);
    },
  },
  watch: {
    /* 取消勾選某範圍時，已選的入口／出口若不在清單內就清掉 */
    picked() {
      if (this.entr && this.picked.indexOf(this.entr) < 0) this.entr = "";
      if (this.exit && this.picked.indexOf(this.exit) < 0) this.exit = "";
    },
  },
  methods: {
    plan() {
      return { picked: this.picked, notes: this.notes, entr: this.entr, entrTime: this.entrTime,
               exit: this.exit, exitTime: this.exitTime, purpose: this.purpose, purposes: this.purposes, confirms: this.confirms };
    },
    check() {
      const e = [];
      if (!this.picked.length) e.push("請選擇進入範圍");
      if (!this.entr || !this.entrTime) e.push("請選擇入口與抵達入口時間");
      if (!this.exit || !this.exitTime) e.push("請選擇出口與抵達出口時間");
      if (!this.chosenPurposes.length) e.push("申請目的或項目未選擇");
      else if (this.attachNeeded) e.push(this.area.purposes.some(p => !p.attach)
        ? "所選申請目的須上傳附件（雛形未做上傳），請改選不須附件的目的"
        : "此區域的申請目的皆須上傳附件，雛形未做上傳，無法進入下一步〔待確認〕");
      this.area.blocks.forEach(b => { if (b.input === "radio" && !this.confirms[b.name]) e.push("請確認「" + b.title + "」"); });
      return e;
    },
    next() {
      const e = this.check();
      if (e.length) { this.errors = e; this.errorOpen = true; return; }
      window.thFcState.save({ areaPlan: this.plan() });
      window.location.href = "apply_03.html";
    },
    prev() {
      window.thFcState.save({ areaPlan: this.plan() });
      window.location.href = "apply_forest_area_1.html";
    },
  },
});
