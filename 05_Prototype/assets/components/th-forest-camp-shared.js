/* ============================================================
   th-forest-camp-shared — 山屋住宿申請流程（forest-camp-1／2）的共用資料與元件
   ------------------------------------------------------------
   原 components/ForestCampShared.jsx（119 行）。v3 未歸屬，v4 §5 階段 2 指定
   一併移入 assets/components/。

   原檔存在的理由（保留這段說明，因為它記錄了一個真實的坑）：
   這些原本都放在 ForestCamp1.jsx，forest-camp-2.html 為了取 CABIN_DATA 而連同
   整支 ForestCamp1.jsx 一起載入——該檔檔尾自帶
   `ReactDOM.createRoot(...).render(<ForestCamp1App/>)`，於是 #root 被連續
   render 兩次（先第一步、再被第二步覆蓋），console 固定出 createRoot 警告。
   抽成共用檔後兩頁各自只載入自己的 App。

   **Vue 版不會再有這個坑**：掛載由 assets/app-boot.js 統一負責，元件檔只登記
   定義、不自己 mount（見 app-boot.js 的掛載契約）。

   日期工具（formatDateInputValue／addDaysToDateValue）已移到 th-date-utils.js，
   因為 apply-3 與未來的 th-date-picker 也要用，不該綁在山屋流程底下。
   ============================================================ */

/* ============================================================
   山屋設定資料（對應 RouteData unit=forestry-camp）
   ------------------------------------------------------------
   **內容來源**：正式站 https://hike.taiwan.gov.tw/ 的收費基準與申請須知，
   擷取日 **2026-09-16**：

     檜谷山莊        notice_b1（申請須知）／notice_b4（收費基準）
     天池山莊        notice_b2（申請須知）／notice_b5（收費基準）
     嘉明湖・向陽    notice_b3（申請須知）／notice_b6（收費基準）

   2026-09-16 之前本檔的費率是**我方自訂的示意值**（四間山屋一律 200／100），
   與測試站、正式站都不符。整齊劃一是示意值的指紋——真實費率是分級的。
   通則見 `_knowledge/shared/tech/擷取內容的溯源與可信度.md`。

   ------------------------------------------------------------
   費率結構：假日／非假日二價
   ------------------------------------------------------------
   `price: { weekday, holiday }`（原為單一數值）。
   取某日費率請用 `window.thFcPriceOf(facility, dateValue)`，
   **不要直接讀 `price.weekday`** —— 那會漏掉假日。
   假日判定用 `window.thIsHolidayApprox`，**只認週五六**（見該函式說明）。

   ------------------------------------------------------------
   [待確認] 清單
   ------------------------------------------------------------
   1. **假日行事曆**：官網的假日含「國定假日前一晚／農曆連假／收假前一日」，
      且各家定義不同；本檔只做週五六近似，畫面已標明。
   2. ~~天池只呈現小營位~~ → 2026-10-01 依正式站 2026-09-30 補走（02_Spec/05f §七之一）補上 4×4 營位，房型名稱照正式站訂位下拉。
   3. ~~檜谷營地未納入~~ → 同上補「檜谷山莊周圍營地四人帳篷」（費率依 notice_b4 不分假日 400／營地／晚）。
      alloc 由 facilities 動態建立，加 facility 不需改 forest-camp-2。
   11. **人數上限依山屋**（peopleMax）：檜谷 10、其餘 12（正式站 2026-09-30 補走（02_Spec/05f §七之一）第 1 步人數下拉）。
   12. **房型 label 照正式站訂位下拉原文**（2026-10-01）：嘉明湖與向陽可訂同一組三種（兩山屋共用步道），
      只是排序不同；天池三種、檜谷兩種。新增項的 max 為示意值（官網未公布）。
   13. **天池第 2 步有停留地點（必填多選）與進入／離山地點**（stayAreas／gateAreas），其他三間沒有。
   4. **檜谷山莊是「每人每晚」計價**，其餘是「每床／每床位」。本檔統一用
      `unit: "床"`，於是 FC2 的數量 stepper 在檜谷語意上是人數、在別家是床數。
      本輪不改（見 decisions.md 2026-09-16）。
   5. **天池、檜谷的床位數官網未公布**，`max` 沿用原示意值（64／48）。
      嘉明湖 70、向陽 70、嘉明湖營地 6 座則有 notice_b3 依據。
   6. ~~maxDays 全部無依據~~ → **2026-09-30 依正式站改**（正式站 apply_05.aspx 同意聲明（2026-09-29 擷取 prod-FC001-S05，頁內含四間山屋的注意事項））：
      天池「連續住宿之申請，以2日為限」→ 2；檜谷「以3日為限」→ 3（原本兩者寫反）；
      嘉明湖、向陽無上限條文，改用 apply_forest_camp_1 天數下拉 2～19 天（寫死在頁面程式碼）→ 18 晚。
   7. ~~嘉明湖 location 與官網不符~~ → 2026-09-30 改為「8.4公里處」（同上注意事項第二點）。
   8. **manager 2026-09-30 依同一份注意事項改為分署名**（林務局改制後的機關名）：
      臺東分署（嘉明湖、向陽）、南投分署（天池）、屏東分署（檜谷）。
   9. **嘉明湖路線的房型**：正式站訂位下拉有「嘉明湖山屋床位／嘉明湖營地營地／向陽山屋床位」三種
      （2026-09-29 實走），本檔補上向陽山屋床位（費率同 notice_b6）。
   10. ~~天池、檜谷的 notices 未核對~~ 2026-10-01 已依正式站注意事項改寫（抽籤制、自備餐飲）。

   `minDays`／`maxDays` 是 forest-camp-1 夜數 stepper 的上下限來源；
   `price` 供 forest-camp-1 的費用參考與 forest-camp-2 的小計／總計。
   ============================================================ */
window.TH_CABIN_DATA = {
  "jiaming": {
    name: "嘉明湖山屋",
    manager: "林業及自然保育署臺東分署",
    location: "嘉明湖國家步道 8.4K",
    image: "assets/route-nanheng.png",
    /* minDays 由 2 改為 1：notice_b3 全文沒有「至少 2 晚」的規定。
       maxDays 18：注意事項無上限條文，依正式站天數下拉 2～19 天（見檔頭 [待確認] 6）。 */
    minDays: 1, maxDays: 18, peopleMax: 12,
    facilities: [
      /* notice_b3：「兩山屋床位分別數計70床，營位數計6座營位」
         notice_b6：山屋 假日 600／平日 400 每床位；營地 假日 600／平日 500 每營地
         正式站訂位下拉另有「向陽山屋床位」（2026-09-29 實走嘉明湖），費率同 b6 */
      { id: "hut",  label: "嘉明湖山屋床位", unit: "床", max: 70, price: { weekday: 400, holiday: 600 }, icon: "ph-bold ph-house" },
      { id: "camp", label: "嘉明湖營地營地", unit: "頂", max: 6,  price: { weekday: 500, holiday: 600 }, icon: "ph-bold ph-tent" },
      { id: "xyhut", label: "向陽山屋床位", unit: "床", max: 70, price: { weekday: 400, holiday: 600 }, icon: "ph-bold ph-house" },
    ],
    priceNotes: [],
    /* 2026-09-30 依正式站注意事項改寫（原「提供睡袋」「入住日前 14 天可取消」與官網矛盾，
       見 decisions.md 2026-09-16 待辦 (A)） */
    notices: [
      "採線上抽籤制：住宿日前 30 日下午 3 時抽籤，未中籤者列入候補，於住宿日前 29 日至前 4 日每日抽籤。",
      "一般申請：住宿日前 60 日至前 5 日。",
      "床位與營位皆不含睡袋及供餐，請自備餐飲、營帳、睡袋。",
      "同一住宿日內不得同時申請山屋與營地。",
      "取消退費：起算日前 5 日前全額、前 4 日退 50%、前 3 日內不退。",
    ],
  },
  /* 向陽山屋：2026-09-16 取代原本的「瓦拉米山屋」。
     瓦拉米屬**玉山國家公園**（notice_a1／a3，洽詢單位為玉管處南安遊客中心），
     走玉山的入園申請與抽籤，不該出現在林保署山屋流程裡；原資料還把管理機關
     誤記為花蓮林區管理處。向陽與嘉明湖同屬 notice_b3 指定宿營地點、
     共用 notice_b6 收費基準，可呈現「同一份基準管兩間山屋」的真實結構。
     理由與依據見 decisions.md 2026-09-16。 */
  "xiangyang": {
    name: "向陽山屋",
    manager: "林業及自然保育署臺東分署",
    location: "嘉明湖步道 4.3K",
    image: "assets/route-nanheng.png",
    minDays: 1, maxDays: 18, peopleMax: 12,   // 同嘉明湖：無上限條文，依正式站天數下拉 2～19 天
    facilities: [
      /* notice_b3：向陽山屋 70 床。
         notice_b3 的指定宿營地點只列「向陽山屋、嘉明湖山屋及嘉明湖營地」，
         **向陽沒有營地在該步道系統內**（notice_b6 另提「向陽遊樂區營地」，
         位置與該步道的關係未載），故本項不設營位。 */
      { id: "hut",    label: "向陽山屋床位",   unit: "床", max: 70, price: { weekday: 400, holiday: 600 }, icon: "ph-bold ph-house" },
      /* 正式站向陽的訂位下拉另有嘉明湖兩種（2026-09-30 實走），費率同 notice_b6 */
      { id: "jmhut",  label: "嘉明湖山屋床位", unit: "床", max: 70, price: { weekday: 400, holiday: 600 }, icon: "ph-bold ph-house" },
      { id: "jmcamp", label: "嘉明湖營地營地", unit: "頂", max: 6,  price: { weekday: 500, holiday: 600 }, icon: "ph-bold ph-tent" },
    ],
    priceNotes: [
      "本山屋與嘉明湖山屋共用同一份收費基準（notice_b6）。",
    ],
    notices: [
      "採線上抽籤制，與嘉明湖山屋同一申請系統。",
      "一般申請：住宿日前 60 日至前 5 日。",
    ],
  },
  "tianchi": {
    name: "天池山莊",
    manager: "林業及自然保育署南投分署",
    location: "能高越嶺道西段 22K，海拔 2,860m",
    image: "assets/route-qilai.png",
    minDays: 1, maxDays: 2, peopleMax: 12,   // 正式站注意事項「連續住宿之申請，以2日為限」
    facilities: [
      /* notice_b5：山莊內通鋪 假日 480／非假日 450 每床；大營位 4×4m 平日 700／假日 800；
         小營位 3×3m 假日 600／非假日 500 每座。label 與順序照正式站訂位下拉（2026-09-30）。
         床位、營位數官網未公布，max 為示意值。 */
      { id: "hut",    label: "天池山莊床位",             unit: "床", max: 64, price: { weekday: 450, holiday: 480 }, icon: "ph-bold ph-house" },
      { id: "camp44", label: "天池營地帳篷4*4(建議8人)", unit: "座", max: 10, price: { weekday: 700, holiday: 800 }, icon: "ph-bold ph-tent" },
      { id: "camp",   label: "天池營地帳篷3*3(建議6人)", unit: "座", max: 20, price: { weekday: 500, holiday: 600 }, icon: "ph-bold ph-tent" },
    ],
    priceNotes: [],
    /* 第 2 步停留地點（必填多選）、進入／離山地點（選填），正式站 2026-09-30 原文；天池與太管處併案審查 */
    stayAreas: ["雲海", "天池", "南華山", "光被八表", "檜林保線所", "奇萊山莊"],
    gateAreas: ["屯原", "奧萬大", "合歡山", "銅門"],
    /* 2026-10-01 依正式站注意事項（ForestCampNoticeData.js tianchi）改寫：原「採先到先得制」「山莊提供熱食」與原文矛盾 */
    notices: [
      "採線上抽籤制：住宿日前 30 日下午 3 時抽籤，未中籤者列入候補，於住宿日前 29 日至前 5 日每日抽籤。",
      "一般申請：住宿日前 60 日至前 5 日。",
      "連續住宿以 2 日為限，系統抽籤為每日獨立作業。",
      "請自備活動所需餐飲、營帳、睡袋。",
      "取消退費：起算日前 5 日前全額、前 4 日退 50%、前 3 日內不退。",
    ],
  },
  "guigu": {
    name: "檜谷山莊",
    manager: "林業及自然保育署屏東分署",
    location: "北大武山登山口 7.5K，海拔 2,230m",
    image: "assets/route-qilai.png",
    /* 人數上限 10：正式站檜谷第 1 步人數下拉 1～10（2026-09-30 實走），其餘山屋 12 */
    minDays: 1, maxDays: 3, peopleMax: 10,   // 正式站注意事項「連續住宿之申請，以3日為限」
    facilities: [
      /* notice_b4：假日 300／平日 250，**每人每晚**（其餘山屋是每床）；正式站 1 晚 2 人 500 元印證。
         營地：notice_b4 不分假日 400 元／營地／晚。label 照正式站訂位下拉；數量官網未公布，max 為示意值。 */
      { id: "hut",  label: "檜谷山莊",                 unit: "床", max: 48, price: { weekday: 250, holiday: 300 }, icon: "ph-bold ph-house" },
      { id: "camp", label: "檜谷山莊周圍營地四人帳篷", unit: "頂", max: 10, price: { weekday: 400, holiday: 400 }, icon: "ph-bold ph-tent" },
    ],
    priceNotes: [
      "檜谷山莊費率以「每人每晚」計價。",
    ],
    /* 2026-10-01 依正式站注意事項（ForestCampNoticeData.js guigu）改寫：原「採線上申請制」未寫抽籤 */
    notices: [
      "採線上抽籤制：住宿日前 30 日下午 3 時抽籤，未中籤者列入候補，於住宿日前 29 日至前 4 日每日抽籤。",
      "一般申請：住宿日前 60 日至前 5 日。",
      "連續住宿以 3 日為限，系統抽籤為每日獨立作業。",
      "請自備活動所需餐飲、營帳、睡袋。",
      "取消退費：起算日前 5 日前全額、前 4 日退 50%、前 3 日內不退。",
    ],
  },
};

/* 取某一天的費率。**所有消費端都要走這支**，不要直接讀 price.weekday。
   假日判定只認週五六（近似），見 th-date-utils.js 的 thIsHolidayApprox。 */
window.thFcPriceOf = function (facility, dateValue) {
  if (!facility || !facility.price) return 0;
  return window.thIsHolidayApprox(dateValue)
    ? facility.price.holiday
    : facility.price.weekday;
};

/* 2026-10-06 使用者裁示拿掉「附件上傳」（正式站第 4 步）：警政署、山屋實走皆「無須上傳附件」，
   保護區的附件已在第 2 步依申請目的上傳，太魯閣也併在人員資料頁——獨立一步沒有內容。改為 6 步，已列 PM 確認事項。
   apply_04.html 保留但不再連入。 */
window.TH_FC_STEPS = [
  { n: 1, label: "日期確認" },
  { n: 2, label: "行程計畫" },
  { n: 3, label: "人員資料" },   // 正式站為「隊伍資料」；內容含申請人、留守人，統一為三管處的名稱（2026-10-05）
  { n: 4, label: "同意聲明" },   // 正式站步驟條原文（2026-09-29），原寫「申請須知」；正式站為第 5 步
  /* 2026-10-05 使用者裁示：正式站第 6 步「確認送出」本身就是確認資料頁，但進度條沒有送出後的一格；
     改名「確認資料」並加「申請完成」，與三管處（…→確認資料→申請完成）結尾對齊。已列 PM 確認事項。 */
  { n: 5, label: "確認資料" },
  { n: 6, label: "申請完成" },
];

/* ------------------------------------------------------------
   六步驟家族（山屋、警政署入山證、林保署自然保護區域）第 3～6 步的跨頁狀態
   （2026-09-30 新增；同日第二類起用時擴為家族共用，名稱沿用 thFcState 不改）
   第 3～6 步頁面 apply_03～06.html 三類共用（檔名比照正式站 apply_03～06.aspx），
   以 state.kind（camp／npa／area）切換內容。
   ------------------------------------------------------------
   第 1、2 步沿用查詢字串；第 2 步按下一步起，訂位、隊伍資料等存成**單一**
   sessionStorage key。人員資料不放網址（個資、長度）。
   **第 1 步載入時一律 reset**：正式站同分頁連續申請會殘留上一張的暫存
   （02_Spec/05e §7 缺陷），雛形不重蹈。sessionStorage 不可用時退回記憶體，
   頁面照常可操作（重新整理會遺失，雛形可接受）。 */
(function () {
  var KEY = "th_fc_apply";
  var mem = null;
  window.thFcState = {
    load: function () {
      try { var v = window.sessionStorage.getItem(KEY); return v ? JSON.parse(v) : (mem || {}); }
      catch (e) { return mem || {}; }
    },
    save: function (patch) {
      var next = Object.assign({}, this.load(), patch);
      mem = next;
      try { window.sessionStorage.setItem(KEY, JSON.stringify(next)); } catch (e) { /* 退回記憶體 */ }
      return next;
    },
    reset: function () {
      mem = null;
      try { window.sessionStorage.removeItem(KEY); } catch (e) { /* 無 storage 時略過 */ }
    },
  };
})();

/* 付款方式（第 2 步選、第 6 步顯示共用同一份）：照正式站只有匯款／線上刷卡 */
window.TH_FC_PAYMENTS = [
  { id: "remit", label: "匯款",     icon: "ph-bold ph-bank",        note: "抽中後依繳費通知期限匯款（訂房後不可更改）" },
  { id: "card",  label: "線上刷卡", icon: "ph-bold ph-credit-card", note: "抽中後依繳費通知期限刷卡（訂房後不可更改）" },
];

/* 第 3～6 步頂端「行程計畫」摘要，欄位照正式站 apply_03／apply_06（2026-09-29）：
   單位／主路線／申辦日期／出發日期／行程天數／出發人數／路線。
   各類別的第 1、2 步把 kind 與 plan（單位、主路線、路線）存進 thFcState，這裡不分類別。 */
window.thApply6PlanRows = function (st, today) {
  var plan = st.plan || {};
  var days = Number(st.days) || 0;
  var nights = Number(st.nights) || 0;
  return [
    { label: "單位",     value: plan.unit || "—" },
    { label: "主路線",   value: plan.main || "—" },
    { label: "申辦日期", value: today },
    { label: "出發日期", value: st.start || "—" },
    { label: "行程天數", value: days ? days + " 天" + (st.kind === "camp" && nights ? "（" + nights + " 晚）" : "") : "—" },
    { label: "出發人數", value: st.headcount ? st.headcount + " 人" : "—" },
    { label: "路線",     value: plan.route || "—" },
  ];
};

/* th-fc-stepper — 山屋流程的六步驟條（原 FcStepper）。
   與 th-stepper（登山申請四步驟）刻意分開：兩者步驟數、DOM 與 class 前綴
   都不同（.fc-step-* vs .th-step-*），合併只會多一個 variant 旗標。 */
window.thComponents = window.thComponents || {};
window.thComponents["th-fc-stepper"] = {
  props: { current: { type: Number, required: true } },
  data() { return { steps: window.TH_FC_STEPS }; },
  methods: {
    cls(n) { return n < this.current ? "is-done" : n === this.current ? "is-current" : ""; },
  },
  template: `
    <div class="fc-stepper">
      <template v-for="(s, i) in steps" :key="s.n">
        <div :class="['fc-step', cls(s.n)]">
          <div class="fc-step-dot">
            <i v-if="s.n < current" class="fa-solid fa-check" aria-hidden="true"></i>
            <span v-else>{{ s.n }}</span>
          </div>
          <span class="fc-step-label">{{ s.label }}</span>
        </div>
        <div v-if="i < steps.length - 1" :class="['fc-step-line', { 'is-done': s.n < current }]"></div>
      </template>
    </div>
  `,
};
