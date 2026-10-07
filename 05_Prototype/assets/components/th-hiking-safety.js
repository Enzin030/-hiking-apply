/* ============================================================
   th-hiking-safety — 登山安全管理（三管處行程規劃頁）
   ------------------------------------------------------------
   2026-10-06 新增。依據：使用者提供的正式站「資料線上異動/取消入園」雪霸步驟一截圖
   （雪山主峰線／雪山主峰(多日行程)，入園 2026-09-16），與正式站 apply_1_3.aspx 頁面程式碼
   check_setp1()（`#con_safetyManagement` 可見時的檢查；2026-09-24 擷取，標記由伺服器端決定是否輸出，
   當時擷取的路線都沒有輸出）。DB 對應：Fixedclimb.is_hiking_safety（推測為顯示條件〔待確認〕）、
   applylist.hikingsafetynotes／emergencyRoute／safetyAssessment／lostContactHours／lastDayDelayHours／stayPlanNote。
   使用者 2026-10-06 說明：異動頁與線上申請同一套，所以做成共用元件。

   區塊（文字照正式站）：
   1～4 四條聲明，比照保護區宣達「說明＋勾選確認」：
     自我評估（另有文字欄）、告知親屬、路線變更規定、國賠法第 3 條
   5 每日行程時間節點規劃（24 小時制）：依路線規劃結果逐日逐節點填到達時間
   6 自主安全管理事項：應變路線（附註＋範例框）
   7 安全評估
   8 留守計畫：失聯超過 N 小時通報、最後一天超過 N 小時未聯繫，另有文字欄
   檢查（同正式站 check_setp1，訊息照原文）：前三條必勾（國賠法那條正式站未檢查）、每個節點時間必填且為 HH:mm、
   應變路線與安全評估必填、兩個時數必填且為 ≥0 的整數。由 window.thHikingSafetyErrors 提供給頁面。

   props：
     days        [{ date: "YYYY-MM-DD", nodes: [節點名稱…] }]（路線規劃結果）
     modelValue  { checks: { assess, contact, change, law }, selfNote, times: { "日-序": "HH:mm" },
                   emergencyRoute, safetyAssessment, lostHours, lastDayHours, stayNote }
     hint        應變路線下方的附註（依管理處，例：雪霸「若經雪山主峰相關路線…」）
     example     應變路線範例框文字
   外觀沿用 .th-field／.th-label／.th-textarea／.th-input／.th-field-hint／
   .th-npa-plan-example（範例框，外層 .th-npa），本元件不新增 CSS。
   ============================================================ */
window.thComponents = window.thComponents || {};
(function () {
  var STATEMENTS = [
    { key: "assess", label: "領隊及隊員經自我評估，體能、經歷及隊伍成員新舊比例均符合此登山路線需要。", note: true },
    { key: "contact", label: "已確實告知親屬(或緊急聯絡人/留守人員)登山行程、可能風險及緊急聯絡事宜",
      text: ["長程縱走登山行程務請約定與留守人員通聯地點及時段，以利行程掌握或山域意外事故救援時能快速掌握狀況。登山時應量力而為，如遇危險或困難路段請勿強行通過，以安全第一為原則。登山可能遭遇高山病症、失溫、墜落或迷途等意外事故風險，應隨時注意隊伍人員狀況、路況及天候狀況，且避免人員落單，以減少意外事故發生。行進間或宿營時應避免破壞原有自然生態環境。"] },
    { key: "change", label: "我已了解並同意遵守路線變更規定",
      text: ["避免非不可抗力因素隨意迫降，或迫降後又任意返回原訂路線，除影響到其他山友權益外，亦會違反「雪霸國家公園區域內公告禁止事項」第十三條：「進出生態保護區禁止任意變更核准路線或行程」，遭處以罰鍰及不予許可入園半年。請注意，經安全避難後，後續行程即變更為「撤退至最近登山口之最短路線」，不得再返回或續行原申請路線，且因體能不佳等自身因素迫降，仍屬違反任意變更核准路線之規定，請審慎評估自身狀況安排登山行程。"] },
    { key: "law", label: "已詳閱國賠法 第 3 條",
      text: [
        "公共設施因設置或管理有欠缺，致人民生命、身體、人身自由或財產受損害者，國家應負損害賠償責任。",
        "前項設施委託民間團體或個人管理時，因管理欠缺致人民生命、身體、人身自由或財產受損害者，國家應負損害賠償責任。",
        "前二項情形，於開放之山域、水域等自然公物，經管理機關、受委託管理之民間團體或個人已就使用該公物為適當之警告或標示，而人民仍從事冒險或具危險性活動，國家不負損害賠償責任。",
        "第一項及第二項情形，於開放之山域、水域等自然公物內之設施，經管理機關、受委託管理之民間團體或個人已就使用該設施為適當之警告或標示，而人民仍從事冒險或具危險性活動，得減輕或免除國家應負之損害賠償責任。",
        "第一項、第二項及前項情形，就損害原因有應負責任之人時，賠償義務機關對之有求償權。",
      ] },
  ];

  var TIME_RE = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  var INT_RE = /^\d+$/;

  /* 檢查（同正式站 check_setp1 的 #con_safetyManagement 段，訊息照原文） */
  window.thHikingSafetyErrors = function (v, days) {
    v = v || {}; var c = v.checks || {}; var t = v.times || {}; var e = [];
    if (!c.assess) e.push("請確認已評估隊伍體能與經歷");
    if (!c.contact) e.push("請確認已告知緊急聯絡人相關事宜");
    if (!c.change) e.push("請確認已了解路線變更規定");
    var empty = false, bad = false;
    (days || []).forEach(function (d, di) {
      d.nodes.forEach(function (n, ni) {
        var x = String(t[di + "-" + ni] || "").trim();
        if (!x) empty = true; else if (!TIME_RE.test(x)) bad = true;
      });
    });
    if (empty) e.push("請填寫所有到達時間");
    if (bad) e.push("到達時間格式不正確，請使用24小時制(HH:mm)");
    if (!String(v.emergencyRoute || "").trim()) e.push("請填寫應變路線");
    if (!String(v.safetyAssessment || "").trim()) e.push("請填寫安全評估");
    var lh = String(v.lostHours == null ? "" : v.lostHours).trim();
    if (!lh) e.push("請填寫失聯時數"); else if (!INT_RE.test(lh)) e.push("失聯時數必須為大於或等於0的數字");
    var dh = String(v.lastDayHours == null ? "" : v.lastDayHours).trim();
    if (!dh) e.push("請填寫最後一天延誤時數"); else if (!INT_RE.test(dh)) e.push("最後一天延誤時數必須為大於或等於0的數字");
    return e;
  };

  window.thComponents["th-hiking-safety"] = {
    props: {
      days: { type: Array, default: function () { return []; } },
      modelValue: { type: Object, default: function () { return {}; } },
      hint: { type: String, default: "" },
      example: { type: String, default: "" },
    },
    emits: ["update:modelValue"],
    data() { return { statements: STATEMENTS }; },
    computed: {
      v() { return Object.assign({ checks: {}, times: {} }, this.modelValue); },
    },
    methods: {
      set(patch) { this.$emit("update:modelValue", Object.assign({}, this.v, patch)); },
      check(k, on) { var c = Object.assign({}, this.v.checks); c[k] = on; this.set({ checks: c }); },
      time(di, ni) { return (this.v.times || {})[di + "-" + ni] || ""; },
      setTime(di, ni, val) { var t = Object.assign({}, this.v.times); t[di + "-" + ni] = val; this.set({ times: t }); },
    },
    template: `
      <div class="grid gap-6">
        <!-- 1～4 聲明：照正式站每條一框、勾選在上、說明在下 -->
        <div v-for="s in statements" :key="s.key" class="grid gap-3 border border-slate-200 rounded-md p-4">
          <label class="flex items-start gap-2 font-semibold cursor-pointer">
            <input type="checkbox" class="mt-1" :checked="!!v.checks[s.key]" @change="check(s.key, $event.target.checked)" />
            <span><span class="req">*</span>{{ s.label }}</span>
          </label>
          <textarea v-if="s.note" class="th-textarea" rows="2" :value="v.selfNote || ''" @input="set({ selfNote: $event.target.value })" :aria-label="s.label"></textarea>
          <p v-for="(p, pi) in s.text || []" :key="pi" class="text-slate-700 leading-relaxed">{{ p }}</p>
        </div>

        <!-- 5 每日行程時間節點規劃：依路線規劃結果，逐日逐節點填到達時間 -->
        <div class="th-field">
          <span class="th-label"><span><span class="req">*</span>每日行程時間節點規劃（24小時制 00:00～23:59）</span></span>
          <div class="grid gap-3">
            <div v-for="(d, di) in days" :key="di" class="flex flex-wrap items-center gap-x-2 gap-y-2">
              <span class="font-semibold text-slate-800 whitespace-nowrap">第{{ di + 1 }}天行程（{{ d.date }}）</span>
              <template v-for="(n, ni) in d.nodes" :key="ni">
                <i v-if="ni" class="fa-solid fa-arrow-right text-slate-400" aria-hidden="true"></i>
                <span class="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <span class="text-slate-800">{{ n }}</span>
                  <!-- 24 小時制文字欄（原生 type=time 會依語系顯示上午／下午，與正式站 24 小時制不符） -->
                  <input type="text" inputmode="numeric" maxlength="5" placeholder="HH:mm" class="th-input w-20 text-center" :value="time(di, ni)" @input="setTime(di, ni, $event.target.value)" :aria-label="'第' + (di + 1) + '天 ' + n + ' 到達時間'" />
                </span>
              </template>
            </div>
          </div>
        </div>

        <!-- 6 自主安全管理事項：應變路線 -->
        <div class="th-field th-npa">
          <label class="th-label" for="hs-emergency"><span><span class="req">*</span>應變路線（請說明每日撤退路線的安排計畫，包含撤退路線或撤退時間）</span></label>
          <span v-if="hint" class="th-field-hint is-accent">{{ hint }}</span>
          <textarea id="hs-emergency" class="th-textarea" rows="3" :value="v.emergencyRoute || ''" @input="set({ emergencyRoute: $event.target.value })"></textarea>
          <div v-if="example" class="th-npa-plan-example"><p>{{ example }}</p></div>
        </div>

        <!-- 7 安全評估 -->
        <div class="th-field">
          <label class="th-label" for="hs-assess"><span><span class="req">*</span>安全評估（請說明攀登時人員受傷處置、防範措施）</span></label>
          <textarea id="hs-assess" class="th-textarea" rows="3" :value="v.safetyAssessment || ''" @input="set({ safetyAssessment: $event.target.value })"></textarea>
        </div>

        <!-- 8 留守計畫 -->
        <div class="th-field">
          <span class="th-label"><span><span class="req">*</span>留守計畫（留守人必須清楚掌握登山計畫與隊員狀況）</span></span>
          <div class="grid gap-2 text-slate-800">
            <label class="flex flex-wrap items-center gap-2">失聯超過
              <input type="text" inputmode="numeric" class="th-input w-20 text-center" :value="v.lostHours == null ? '' : v.lostHours" @input="set({ lostHours: $event.target.value })" aria-label="失聯時數" />
              小時，留守人會進行通報</label>
            <label class="flex flex-wrap items-center gap-2">最後一天預計抵達登山口時間超過
              <input type="text" inputmode="numeric" class="th-input w-20 text-center" :value="v.lastDayHours == null ? '' : v.lastDayHours" @input="set({ lastDayHours: $event.target.value })" aria-label="最後一天延誤時數" />
              小時，未與留守人聯繫，則需留意並準備後續救援計畫。</label>
          </div>
          <textarea class="th-textarea mt-2" rows="3" :value="v.stayNote || ''" @input="set({ stayNote: $event.target.value })" aria-label="留守計畫說明"></textarea>
        </div>
      </div>
    `,
  };
})();
