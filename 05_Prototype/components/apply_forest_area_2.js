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
   附件上傳（2026-10-01 依正式站 apply_forest_area_2 頁面程式碼 ForestAreaChk／ForestAreaNext 與 js/HSTS/Swal.js）：
     勾選須附件的目的後，在該選項下出現「檔案格式：PDF,JPG,PNG」與 attach 個檔案欄位；
     選檔時檢查格式（pdf／jpg／jpeg／png，否則「檔案格式錯誤」）與大小（5MB，否則「上傳檔案過大」）；
     下一步時有任一欄未上傳即「未上傳附件」。紅字附件說明與「下載範本」連結照正式站（note／template）。
     data-limit＞0 的目的，申請人數小於限制人數不得選（「申請人數小於限制人數」）。
     **不照抄的正式站缺陷**：正式站每次點選目的都會清掉所有上傳欄位、只留最後點的那個，
     複選（鴛鴦湖）時先勾的目的的上傳欄位會消失；雛形每個已勾目的各自保留。
     **雛形只記檔名，不讀取、不送出檔案內容。** 正式站選檔即壓縮後以 Func=FilesUpload 上傳，
     上傳後畫面、以及第 4／6 步是否列出這些附件，盤點環境禁止上傳而未實見〔待確認〕。
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
      attachFiles: saved.attachFiles || {},   // { 目的: [第 1 件檔名, 第 2 件檔名…] }
      headcount: Number(st.headcount) || 0,
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
    /* 所選目的中，還沒選檔的附件件數 */
    attachMissing() {
      return this.area.purposes.filter(p => this.isChosen(p.value)).reduce((s, p) => {
        const got = this.attachFiles[p.value] || [];
        for (let i = 0; i < (p.attach || 0); i++) if (!got[i]) s += 1;
        return s;
      }, 0);
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
    isChosen(v) { return this.chosenPurposes.indexOf(v) >= 0; },
    fileName(v, i) { return (this.attachFiles[v] || [])[i] || ""; },
    /* 檢查同正式站（ForestAreaAAcceptFileTypes、MaxFileSize＝5MB），通過才記檔名 */
    pickFile(v, i, ev) {
      const f = ev.target.files && ev.target.files[0];
      if (!f) return;
      let msg = "";
      if (!/(\.|\/)(pdf|jpe?g|png)$/i.test(f.name)) msg = "檔案格式錯誤";
      else if (f.size > 5 * 1024 * 1024) msg = "上傳檔案過大";
      ev.target.value = "";
      if (msg) { this.errors = [msg]; this.errorOpen = true; return; }
      const list = (this.attachFiles[v] || []).slice();
      list[i] = f.name;
      this.attachFiles = Object.assign({}, this.attachFiles, { [v]: list });
    },
    plan() {
      return { picked: this.picked, notes: this.notes, entr: this.entr, entrTime: this.entrTime,
               exit: this.exit, exitTime: this.exitTime, purpose: this.purpose, purposes: this.purposes,
               attachFiles: this.attachFiles, confirms: this.confirms };
    },
    check() {
      const e = [];
      if (!this.picked.length) e.push("請選擇進入範圍");
      if (!this.entr || !this.entrTime) e.push("請選擇入口與抵達入口時間");
      if (!this.exit || !this.exitTime) e.push("請選擇出口與抵達出口時間");
      if (!this.chosenPurposes.length) e.push("申請目的或項目未選擇");
      if (this.area.purposes.some(p => this.isChosen(p.value) && p.limit && this.headcount < p.limit)) e.push("申請人數小於限制人數");
      if (this.attachMissing) e.push("未上傳附件");
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
