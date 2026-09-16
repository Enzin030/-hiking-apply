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
   2. **天池山莊的營位只呈現小營位（3×3m）**：官網另有大營位 4×4m
      平日 700／假日 800，本雛形未呈現（不做第三種設施，理由見第 3 點）。
   3. **檜谷山莊的營地未納入雛形**：官網有營地費率（不分假日 400／營地／晚），
      但本檔檜谷只有山屋床位。加一個 facility 會動到 `facilities[].id` 集合，
      而那是 forest-camp-2 `alloc` 二維矩陣的鍵——屬另一輪工程。
   4. **檜谷山莊是「每人每晚」計價**，其餘是「每床／每床位」。本檔統一用
      `unit: "床"`，於是 FC2 的數量 stepper 在檜谷語意上是人數、在別家是床數。
      本輪不改（見 decisions.md 2026-09-16）。
   5. **天池、檜谷的床位數官網未公布**，`max` 沿用原示意值（64／48）。
      嘉明湖 70、向陽 70、嘉明湖營地 6 座則有 notice_b3 依據。
   6. **maxDays 全部無依據**：官網沒有規定單次申請的最多夜數。
      `minDays` 已依 notice_b3 改為 1（原嘉明湖寫 2，b3 全文無此規定），
      但 **maxDays 維持原值**——minDays 有依據可改，不代表 maxDays 也有。
   7. **嘉明湖山屋的 location 與官網不符**：本檔寫「9.5K」，notice_b3 的
      沿線據點是「8.4公里處：嘉明湖山屋」。未在本輪授權範圍，未改。

   `minDays`／`maxDays` 是 forest-camp-1 夜數 stepper 的上下限來源；
   `price` 供 forest-camp-1 的費用參考與 forest-camp-2 的小計／總計。
   ============================================================ */
window.TH_CABIN_DATA = {
  "jiaming": {
    name: "嘉明湖山屋",
    manager: "臺東林區管理處",
    location: "嘉明湖步道 9.5K，海拔 3,310m",
    image: "assets/route-nanheng.png",
    /* minDays 由 2 改為 1：notice_b3 全文沒有「至少 2 晚」的規定。
       maxDays 維持 4，官網無依據，見檔頭 [待確認] 6。 */
    minDays: 1, maxDays: 4,
    facilities: [
      /* notice_b3：「兩山屋床位分別數計70床，營位數計6座營位」
         notice_b6：山屋 假日 600／平日 400 每床位；營地 假日 600／平日 500 每營地 */
      { id: "hut",  label: "山屋床位", unit: "床", max: 70, price: { weekday: 400, holiday: 600 }, icon: "ph-bold ph-house" },
      { id: "camp", label: "營地營位", unit: "頂", max: 6,  price: { weekday: 500, holiday: 600 }, icon: "ph-bold ph-tent" },
    ],
    priceNotes: [],
    notices: [
      "採線上抽籤制，熱門日期請提早申請。",
      "山屋提供睡袋（另計費），自帶睡袋可享折扣。",
      "入住日前 14 天可申請取消，取消費用依規定收取。",
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
    manager: "臺東林區管理處",
    location: "嘉明湖步道 4.3K",
    image: "assets/route-nanheng.png",
    minDays: 1, maxDays: 4,
    facilities: [
      /* notice_b3：向陽山屋 70 床。
         notice_b3 的指定宿營地點只列「向陽山屋、嘉明湖山屋及嘉明湖營地」，
         **向陽沒有營地在該步道系統內**（notice_b6 另提「向陽遊樂區營地」，
         位置與該步道的關係未載），故本項不設營位。 */
      { id: "hut", label: "山屋床位", unit: "床", max: 70, price: { weekday: 400, holiday: 600 }, icon: "ph-bold ph-house" },
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
    manager: "南投林區管理處",
    location: "能高越嶺道西段 22K，海拔 2,860m",
    image: "assets/route-qilai.png",
    minDays: 1, maxDays: 3,
    facilities: [
      /* notice_b5：山莊內通鋪 假日 480／非假日 450 每床；
         小營位 3×3m 假日 600／非假日 500 每座。床位數官網未公布，max 沿用示意值。 */
      { id: "hut",  label: "山莊內通鋪", unit: "床", max: 64, price: { weekday: 450, holiday: 480 }, icon: "ph-bold ph-house" },
      { id: "camp", label: "小營位（3×3m）", unit: "座", max: 20, price: { weekday: 500, holiday: 600 }, icon: "ph-bold ph-tent" },
    ],
    priceNotes: [
      "官網另有大營位 4×4m（建議 8 人帳）：平日 700 元／假日 800 元每座，本雛形僅呈現小營位。〔待確認〕",
    ],
    notices: [
      "採先到先得制，建議至少提前 7 天申請。",
      "山莊提供熱食，需於申請時預約餐食人數。",
    ],
  },
  "guigu": {
    name: "檜谷山莊",
    manager: "屏東林區管理處",
    location: "北大武山登山口 7.5K，海拔 2,230m",
    image: "assets/route-qilai.png",
    minDays: 1, maxDays: 2,
    facilities: [
      /* notice_b4：假日 300／平日 250，**每人每晚**（其餘山屋是每床）。
         床位數官網未公布，max 沿用示意值。 */
      { id: "hut", label: "山屋床位", unit: "床", max: 48, price: { weekday: 250, holiday: 300 }, icon: "ph-bold ph-house" },
    ],
    priceNotes: [
      "官網的檜谷山莊費率是「每人每晚」，與其他山屋的「每床」計價單位不同。〔待確認〕",
      "官網另有露營地費率（不分假日 400 元／營地／晚），營地未納入雛形。〔待確認〕",
    ],
    notices: [
      "採線上申請制，開放日期前 60 天受理。",
      "山莊無對外供餐，請自備糧食。",
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

window.TH_FC_STEPS = [
  { n: 1, label: "日期確認" },
  { n: 2, label: "行程計畫" },
  { n: 3, label: "隊伍資料" },
  { n: 4, label: "附件上傳" },
  { n: 5, label: "申請須知" },
  { n: 6, label: "確認送出" },
];

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
