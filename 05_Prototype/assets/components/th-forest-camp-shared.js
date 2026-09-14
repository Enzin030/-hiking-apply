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

/* 山屋設定資料（對應 RouteData unit=forestry-camp）
   minDays／maxDays 是 forest-camp-1 夜數 stepper 的上下限來源，
   forest-camp-2 的價格小計也取自 facilities[].pricePerNight。 */
window.TH_CABIN_DATA = {
  "jiaming": {
    name: "嘉明湖山屋",
    manager: "臺東林區管理處",
    location: "嘉明湖步道 9.5K，海拔 3,310m",
    image: "assets/route-nanheng.png",
    minDays: 2, maxDays: 4,
    facilities: [
      { id: "hut",  label: "山屋床位", unit: "床", max: 72,  pricePerNight: 200, icon: "ph-bold ph-house" },
      { id: "camp", label: "營地營位", unit: "頂", max: 30,  pricePerNight: 100, icon: "ph-bold ph-tent" },
    ],
    notices: [
      "採線上抽籤制，熱門日期請提早申請。",
      "山屋提供睡袋（另計費），自帶睡袋可享折扣。",
      "入住日前 14 天可申請取消，取消費用依規定收取。",
    ],
  },
  "tianchi": {
    name: "天池山莊",
    manager: "南投林區管理處",
    location: "能高越嶺道西段 22K，海拔 2,860m",
    image: "assets/route-qilai.png",
    minDays: 1, maxDays: 3,
    facilities: [
      { id: "hut",  label: "山屋床位", unit: "床", max: 64,  pricePerNight: 200, icon: "ph-bold ph-house" },
      { id: "camp", label: "營地營位", unit: "頂", max: 20,  pricePerNight: 100, icon: "ph-bold ph-tent" },
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
      { id: "hut",  label: "山屋床位", unit: "床", max: 48,  pricePerNight: 200, icon: "ph-bold ph-house" },
    ],
    notices: [
      "採線上申請制，開放日期前 60 天受理。",
      "山莊無對外供餐，請自備糧食。",
    ],
  },
  "walami": {
    name: "瓦拉米山屋",
    manager: "花蓮林區管理處",
    location: "瓦拉米步道 13.1K，海拔 1,068m",
    image: "assets/route-nanheng.png",
    minDays: 1, maxDays: 2,
    facilities: [
      { id: "hut",  label: "山屋床位", unit: "床", max: 24,  pricePerNight: 200, icon: "ph-bold ph-house" },
      { id: "camp", label: "營地營位", unit: "頂", max: 10,  pricePerNight: 100, icon: "ph-bold ph-tent" },
    ],
    notices: [
      "採線上申請制，開放日期前 30 天受理。",
    ],
  },
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
