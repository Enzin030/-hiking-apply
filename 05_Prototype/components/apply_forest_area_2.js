/* ============================================================
   apply_forest_area_2.js — 林保署自然保護區域申請 步驟 2：行程計畫
   ------------------------------------------------------------
   2026-09-30 新增。依據 02_Spec/05e §三（正式站 2026-09-29 實走北插天山）：
   - 進入範圍可多選；**入口、出口選項只列已勾選範圍的對應入口**（正式站即時過濾，純前端）
   - 抵達入口／出口時間：05:00～18:00 每半小時
   - 申請目的：依區域，多數單選（radio），鴛鴦湖為複選（checkbox，purposeInput）；
     每項的須附件數為 attach（北插天山不須；十八羅漢山只有「人員入出」不須；鴛鴦湖全部須附件）
   - 安全聲明與宣達清單（4～9）的數量與內容依區域設定；宣達一律勾選確認、必勾
     （2026-10-06 使用者統一；正式站 OtherName7／8 為唯讀已帶入文字、不需勾選）；
     待填的「行程計畫」比照警政署登山計畫書版面（欄位＋下方範例框）
   附件上傳（2026-10-01 依正式站 apply_forest_area_2 頁面程式碼 ForestAreaChk／ForestAreaNext 與 js/HSTS/Swal.js）：
     2026-10-06 起附件與目的拆開：所選目的須附的文件集中在獨立的「4. 附件上傳」卡（共用 th-attach-table，與三管處統一），
     其後宣達卡編號順延一號；
     暫存格式 attachFiles＝{ "目的#第幾件": 檔名 }（舊格式 { 目的: [檔名…] } 載入時轉換）。
     正式站為勾選須附件的目的後，在該選項下出現「檔案格式：PDF,JPG,PNG」與 attach 個檔案欄位；
     選檔時檢查格式（pdf／jpg／jpeg／png，否則「檔案格式錯誤」）與大小（5MB，否則「上傳檔案過大」）；
     下一步時有任一欄未上傳即「未上傳附件」。紅字附件說明與「下載範本」連結照正式站（note／template）。
     data-limit＞0 的目的，申請人數小於限制人數不得選（「申請人數小於限制人數」）。
     **不照抄的正式站缺陷**：正式站每次點選目的都會清掉所有上傳欄位、只留最後點的那個，
     複選（鴛鴦湖）時先勾的目的的上傳欄位會消失；雛形每個已勾目的各自保留。
     **雛形只記檔名，不讀取、不送出檔案內容。** 正式站選檔即壓縮後以 Func=FilesUpload 上傳，
     上傳後畫面、以及第 4／6 步是否列出這些附件，盤點環境禁止上傳而未實見〔待確認〕。
   第 3～6 步為家族共用頁 apply_03～06（kind＝area）。
   ============================================================ */

/* 宣達區塊分兩類（2026-10-06）：待填的「行程計畫」（textarea，或翡翠水庫的空白 text）與其餘宣達（一律勾選確認）。
   以標題判斷「行程計畫」：插天山（631）的「禁止行為」也是空白 text，但它是宣達、不是要使用者填寫的欄位
   （原以「空白 text＝待填」判斷，誤把它顯示成「請輸入禁止行為」的文字框）。 */
function fa2IsFillIn(b) { return b.input === "textarea" || b.title === "行程計畫"; }

/* 附件暫存的 key：目的＋第幾件；舊格式（目的: [檔名…]）轉成新格式 */
function fa2AttachKey(v, n) { return v + "#" + n; }
function fa2NormalizeFiles(files) {
  const out = {};
  Object.keys(files || {}).forEach(k => {
    const v = files[k];
    if (Array.isArray(v)) v.forEach((name, i) => { if (name) out[fa2AttachKey(k, i + 1)] = name; });
    else if (v) out[k] = v;
  });
  return out;
}

/* 必填欄位預設帶入示意資料（2026-10-02）：沒有暫存時，勾第一段範圍、取對應出入口與時間、
   選第一個不須附件的目的（都須附件時選第一個並帶示意檔名）、宣達全勾、待填欄位帶示意行程 */
function fa2Demo(area) {
  const free = area.purposes.find(p => !p.attach);
  const pick = free || area.purposes[0];
  const seg = area.segments[0];
  const entr = seg ? (area.entrances.find(o => o.value === seg.value) || {}).value || "" : "";
  const exit = seg ? (area.exits.find(o => o.value === seg.value) || {}).value || "" : "";
  const confirms = {}, fills = {};
  area.blocks.forEach(b => {
    if (fa2IsFillIn(b)) fills[b.name] = "第一天 08:00 登山口→12:00 主要步道→16:00 登山口";
    else confirms[b.name] = true;
  });
  const files = {};
  if (pick && pick.attach) for (let n = 1; n <= pick.attach; n++) files[fa2AttachKey(pick.value, n)] = "行程計畫書" + (n > 1 ? "-" + n : "") + ".pdf";
  return {
    picked: seg ? [seg.value] : [], notes: area.gateText ? "主要步道" : "",
    entr: entr, exit: exit, entrTime: area.times[0] || "", exitTime: area.times[area.times.length - 1] || "",
    entrText: area.gateText ? "登山口" : "", exitText: area.gateText ? "登山口" : "",
    purpose: area.purposeInput === "checkbox" ? "" : (pick ? pick.value : ""),
    purposes: area.purposeInput === "checkbox" && pick ? [pick.value] : [],
    attachFiles: files, confirms: confirms, fills: fills,
  };
}

thPage({
  data() {
    const st = window.thFcState.load();
    const area = (window.TH_FOREST_AREAS || {})[st.areaCid || "630"] || window.TH_FOREST_AREAS["630"];
    const saved = st.areaPlan || fa2Demo(area);
    const confirms = {};
    area.blocks.forEach(b => { if (!fa2IsFillIn(b)) confirms[b.name] = !!(saved.confirms && saved.confirms[b.name]); });
    return {
      area: area,
      picked: saved.picked || [],
      notes: saved.notes || "",
      entr: saved.entr || "",
      entrTime: saved.entrTime || "",
      exit: saved.exit || "",
      exitTime: saved.exitTime || "",
      entrText: saved.entrText || "",   // gateText 區域的入口／出口文字
      exitText: saved.exitText || "",
      purpose: saved.purpose || "",
      purposes: saved.purposes || [],
      attachFiles: fa2NormalizeFiles(saved.attachFiles),   // { "目的#第幾件": 檔名 }
      headcount: Number(st.headcount) || 2,
      confirms: confirms,
      fills: Object.assign({}, saved.fills),   // 空白待填區塊（行程計畫）的內容
    };
  },
  computed: {
    applyCrumb() { return window.TH_APPLY_CRUMB; },
    entrOptions() { return this.area.entrances.filter(o => this.picked.indexOf(o.value) >= 0); },
    exitOptions() { return this.area.exits.filter(o => this.picked.indexOf(o.value) >= 0); },
    multiPurpose() { return this.area.purposeInput === "checkbox"; },
    /* 附件上傳卡的列 */
    attachRows() { return this.attachItems(); },
    chosenPurposes() { return this.multiPurpose ? this.purposes : (this.purpose ? [this.purpose] : []); },
    /* 所選目的中，還沒選檔的附件件數 */
    attachMissing() {
      return this.attachItems().filter(it => !this.attachFiles[it.key]).length;
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
    isFillIn(b) { return fa2IsFillIn(b); },
    /* 宣達卡編號：資料為 4 起；有附件上傳卡（4.）時順延一號 */
    blockNo(b) { return b.no + (this.attachRows.length ? 1 : 0); },
    /* 確認文字照區域資料；插天山（631）「禁止行為」正式站預設值空白，沿用同保留區（629／630）同一條的「我已確認並會向團員宣達」 */
    confirmText(b) { return b.confirm || "我已確認並會向團員宣達"; },
    /* 行程計畫的填寫說明拆行放進範例框：第一行為標題，其後在「第N天」「範例：」「1、」前斷行（文字照正式站） */
    planLines(b) {
      return b.text.split("\n").flatMap(s => s.split(/\s+(?=第[一二三四五六七八九十]+天|範例：|\d、)/)).map(s => s.trim()).filter(Boolean);
    },
    /* 附件上傳表的列：所選目的各 attach 件，名稱同原本「目的＋相關證明文件（附件 N）」；
       格式與大小檢查（PDF／JPG／PNG、5MB，同正式站 ForestAreaAAcceptFileTypes／MaxFileSize）由 th-attach-table 執行 */
    attachItems() {
      return this.area.purposes.filter(p => p.attach && this.isChosen(p.value)).flatMap(p =>
        Array.from({ length: p.attach }, (_, i) => ({
          key: fa2AttachKey(p.value, i + 1),
          name: p.value + "相關證明文件" + (p.attach > 1 ? "（附件 " + (i + 1) + "）" : ""),
          required: true,
          hint: "格式限制：PDF、JPG、PNG，單檔大小不超過 5MB",
        })));
    },
    plan() {
      return { picked: this.picked, notes: this.notes, entr: this.entr, entrTime: this.entrTime,
               exit: this.exit, exitTime: this.exitTime, entrText: this.entrText, exitText: this.exitText,
               purpose: this.purpose, purposes: this.purposes,
               attachFiles: this.attachFiles, confirms: this.confirms, fills: this.fills };
    },
    check() {
      const e = [];
      /* 訊息照正式站 js/HSTS/Swal.js：沒勾範圍且備註空白＝-60「進入範圍未選擇」；必填文字欄空白＝-4 */
      if (!this.picked.length && !this.notes.trim()) e.push("進入範圍未選擇");
      if (this.area.gateText) {
        if (!this.entrText.trim() || !this.exitText.trim()) e.push("必填欄位未填寫");
        if (!this.entrTime || !this.exitTime) e.push("請選擇抵達入口與出口時間");
      } else {
        if (!this.entr || !this.entrTime) e.push("請選擇入口與抵達入口時間");
        if (!this.exit || !this.exitTime) e.push("請選擇出口與抵達出口時間");
      }
      if (!this.chosenPurposes.length) e.push("申請目的或項目未選擇");
      if (this.area.purposes.some(p => this.isChosen(p.value) && p.limit && this.headcount < p.limit)) e.push("申請人數小於限制人數");
      if (this.attachMissing) e.push("未上傳附件");
      this.area.blocks.forEach(b => {
        if (!fa2IsFillIn(b) && !this.confirms[b.name]) e.push(b.name === "rdo-use-safe" ? "安全聲明未選擇" : "請確認「" + b.title + "」");
      });
      return e;
    },
    next() {
      const e = this.check();
      if (e.length) { window.thAlertList(e); return; }
      window.thFcState.save({ areaPlan: this.plan() });
      window.location.href = "apply_03.html";
    },
    prev() {
      window.thFcState.save({ areaPlan: this.plan() });
      window.location.href = "apply_forest_area_1.html";
    },
  },
});
