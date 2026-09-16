/* ============================================================
   forest-camp-2.js — 山屋住宿申請 步驟 2：行程計畫
   原 ForestCamp2.jsx（356 行）。版面已搬回 forest-camp-2.html。
   ============================================================

   ------------------------------------------------------------
   狀態形狀對照（本頁最容易出現語意落差的地方）
   ------------------------------------------------------------
   **alloc：夜次 × 設施的二維數量矩陣**

     形狀   { [夜次索引]: { [設施 id]: 數量 } }
     實例   { "0": { "hut": 2, "camp": 0 },
              "1": { "hut": 2, "camp": 1 } }

     - 夜次索引是 **0-based 整數**，但物件鍵一律是字串（JS 的物件鍵強制轉字串）。
       畫面上的「第 N 晚」是 index + 1，寫進 alloc 的是 index。
     - 設施 id 來自 cabin.facilities[].id（"hut"／"camp"），不是索引。
       檜谷山莊只有 hut 一種，所以內層物件的鍵數會隨山屋不同。
     - **初始化時就把所有夜次 × 所有設施的鍵補成 0**，不留稀疏洞。
       原 React 用 useMemo 產生 initAlloc 再交給 useState；
       useState 只在首次 render 取用初值，之後 initAlloc 就算重算也不會回寫。
       nights／cabin 都只從網址讀一次、頁面生命週期內不變，所以行為等價。
       Vue 這裡在 data() 裡呼叫同一個函式產生初值，同樣只做一次。
     - **Vue 3 的巢狀賦值是響應式的**（Vue 2 才需要 $set）。原 React 的 setQty
       用展開運算子造新物件，Vue 直接 `this.alloc[night][id] = qty`。
       之所以安全，是因為上一條：鍵在初始化時已經存在，不是新增鍵。

   **衍生值全部是 computed／method，不另存狀態**

     | 值            | 來源                                        | 型別 |
     |---------------|---------------------------------------------|------|
     | qtyOf(i, id)  | alloc[i]?.[id] \|\| 0                        | number |
     | nightTotal(i) | 該夜所有設施數量相加                          | number |
     | nightCost(i)  | 該夜 Σ 數量 × pricePerNight                  | number |
     | subtotals     | 每個設施 { ...f, total: Σ 各夜數量 × 單價 }   | array |
     | grandTotal    | Σ subtotals[].total                          | number |
     | nightsValid   | 每一夜的 nightTotal ≥ 1                      | boolean |
     | canNext       | 隊名 trim 長度 ≥ 2 且 payment 非空 且 nightsValid | boolean |

     **「每晚至少 1 項」的判準是「該夜所有設施數量相加 ≥ 1」**，
     不是「每個設施都要 ≥ 1」——畫面上的說明文字寫「各設施每晚至少填入 1 個
     單位」與程式碼不一致，這是原碼既有的文案落差，照搬未改。

   **0 的處理（避免 falsy 陷阱）**

     數量 0 是合法值也是「未填」，兩者同義，所以 `|| 0` 是安全的。
     但判斷一律用 `> 0` 而非真假值，與原碼一致：
     nightTotal(i) > 0（是否已填寫徽章）、f.total > 0（小計顯示破折號）、
     grandTotal > 0（每晚明細是否出現）。

   **轉頁：URLSearchParams 帶 alloc JSON**

     handleNext 組 apply-3.html?route&start&nights&headcount&team&payment&alloc&total
     其中 alloc 是 `JSON.stringify(alloc)`。**Vue 的 reactive proxy 不影響
     JSON.stringify 的輸出**（proxy 會轉發列舉與取值），鍵序仍是插入序 0,1,2…，
     與 React 版逐字相同——已實測比對轉頁後的完整網址。
     total 帶的是數字 grandTotal，不是 toLocaleString() 後的字串。

   ------------------------------------------------------------
   useState / useMemo → Vue 的逐一對應（不批次轉）
   ------------------------------------------------------------
   | 原 React                     | Vue                | 備註 |
   |------------------------------|--------------------|------|
   | useState("")   teamName      | data.teamName      | trim 後長度 ≥ 2 才算填妥 |
   | useState("")   payment       | data.payment       | "" 代表未選 |
   | useState(initAlloc) alloc    | data.alloc         | 二維矩陣，見上 |
   | useMemo initAlloc            | makeInitAlloc()    | 只在 data() 呼叫一次 |
   | useMemo subtotals            | computed.subtotals | |
   | useMemo nightsValid          | computed.nightsValid | |
   | grandTotal（render 時算）     | computed.grandTotal | |
   | canNext（render 時算）        | computed.canNext   | |
   | 區域元件 Stepper2             | options.components 的 p-fc2-stepper | 只有這頁用 |

   ------------------------------------------------------------
   靜態 inline style 已收成 .p-fc2-* class（2026-09-09 裁決）
   ------------------------------------------------------------
   原 JSX 有五處 inline style，值全是固定的，依 §7「禁止 inline style」
   收進 assets/css/pages.css：
     maxWidth:400 → .p-fc2-team-field      color:--danger-fg → .p-fc2-required
     display:none → .p-fc2-payment-radio   color:--fg-4      → .p-fc2-cost-dash
     width:120    → .p-fc2-stepper-input
   **只收靜態的**：forest-camp-1 的可用量長條是依資料算出來的，維持 :style。

   ------------------------------------------------------------
   addDays 照搬，**不可換成 th-date-utils**
   ------------------------------------------------------------
   本頁的 addDays 走 `new Date(dateStr)` ＋ `toISOString().slice(0,10)`，
   是 **UTC 路徑**；th-date-utils 的 thAddDaysToDateValue 是拆 Y/M/D 的
   **本地路徑**。兩者在多數情況下同值，但換掉就是改行為，屬改善不是遷移。
   fmtDate 同理（用 UTC 解析出來的 Date 取本地 getMonth／getDate／getDay）。
   ============================================================ */

const PAYMENT_OPTIONS = [
  { id: "credit", label: "信用卡", icon: "ph-bold ph-credit-card",     note: "Visa / Mastercard / JCB，限本人持卡" },
  { id: "atm",    label: "ATM 轉帳", icon: "ph-bold ph-bank",          note: "核准後 3 日內完成匯款" },
  { id: "post",   label: "郵政劃撥", icon: "ph-bold ph-envelope",      note: "劃撥帳號於核准通知中提供" },
];

/* 日期字串 +N 天（UTC 路徑，理由見檔頭：不可換成 th-date-utils） */
function fc2AddDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

/* 顯示格式：2025-07-20 → 7/20（週六） */
function fc2FmtDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  return `${d.getMonth() + 1}/${d.getDate()}（週${weekdays[d.getDay()]}）`;
}

/* 逐頁參數：全部從查詢字串讀，與 React 版同一組預設值 */
const FC2_P = new URLSearchParams(window.location.search);
const FC2_ROUTE_ID = FC2_P.get("route") || "jiaming";
/* 直接開本頁（未經第一步）時 start 會是空的，而 addDays("") 產生 Invalid Date、
   後續 toISOString() 拋 RangeError 讓整頁白畫面；比照第一步預設為今天。 */
const FC2_START = FC2_P.get("start") || window.thTodayValue();
const FC2_NIGHTS = parseInt(FC2_P.get("nights") || "2", 10);
const FC2_HEADCOUNT = parseInt(FC2_P.get("headcount") || "4", 10);
const FC2_CABIN = window.TH_CABIN_DATA[FC2_ROUTE_ID] || window.TH_CABIN_DATA["jiaming"];

/* 二維矩陣的初值：所有夜次 × 所有設施都補 0，不留稀疏洞（理由見檔頭） */
function fc2MakeInitAlloc() {
  const obj = {};
  for (let i = 0; i < FC2_NIGHTS; i++) {
    obj[i] = {};
    FC2_CABIN.facilities.forEach(f => { obj[i][f.id] = 0; });
  }
  return obj;
}

/* 數量增減小元件（原 Stepper2）。只有本頁用，走 options.components */
const pFc2Stepper = {
  props: {
    value: { type: Number, required: true },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
  },
  emits: ["change"],
  template: `
    <div class="fc-stepper-input p-fc2-stepper-input">
      <button class="fc-stepper-btn" @click="$emit('change', Math.max(min, value - 1))" :disabled="value <= min">
        <i class="fa-solid fa-minus" aria-hidden="true"></i>
      </button>
      <span class="fc-stepper-val">{{ value }}</span>
      <button class="fc-stepper-btn" @click="$emit('change', Math.min(max, value + 1))" :disabled="value >= max">
        <i class="fa-solid fa-plus" aria-hidden="true"></i>
      </button>
    </div>
  `,
};

thPage({
  components: { "p-fc2-stepper": pFc2Stepper },

  data() {
    return {
      teamName: "",
      payment: "",
      alloc: fc2MakeInitAlloc(),
      startDate: FC2_START,
      nights: FC2_NIGHTS,
      headcount: FC2_HEADCOUNT,
    };
  },

  computed: {
    // 唯讀常數，不進 data()
    cabin() { return FC2_CABIN; },
    paymentOptions() { return PAYMENT_OPTIONS; },
    applyCrumb() { return window.TH_APPLY_CRUMB; },
    // v-for 用；原 React 是 Array.from({length: nights}, (_, i) => ...)
    nightIndexes() { return Array.from({ length: this.nights }, (_, i) => i); },

    /* 二價（2026-09-16）：逐夜取當夜費率。原本是 `* f.pricePerNight` 單一數值——
       迴圈本來就逐夜迭代，所以換成 priceOf(f, i) 不必改結構。 */
    subtotals() {
      return this.cabin.facilities.map(f => {
        let total = 0;
        for (let i = 0; i < this.nights; i++) {
          total += this.qtyOf(i, f.id) * this.priceOf(f, i);
        }
        return { ...f, total };
      });
    },
    grandTotal() { return this.subtotals.reduce((s, f) => s + f.total, 0); },

    nightsValid() {
      for (let i = 0; i < this.nights; i++) {
        if (this.nightTotal(i) < 1) return false;
      }
      return true;
    },
    canNext() {
      return this.teamName.trim().length >= 2 && this.payment !== "" && this.nightsValid;
    },
  },

  methods: {
    fmtDate: fc2FmtDate,
    nightDate(i) { return fc2AddDays(this.startDate, i); },

    qtyOf(i, facilityId) {
      const n = this.alloc[i];
      return (n && n[facilityId]) || 0;
    },
    /* 鍵在初始化時已存在，Vue 3 直接賦值即為響應式（見檔頭） */
    setQty(night, facilityId, qty) {
      this.alloc[night][facilityId] = qty;
    },

    nightTotal(i) {
      return this.cabin.facilities.reduce((s, f) => s + this.qtyOf(i, f.id), 0);
    },
    nightCost(i) {
      return this.cabin.facilities.reduce((s, f) => s + this.qtyOf(i, f.id) * this.priceOf(f, i), 0);
    },

    /* 第 i 夜的日期是不是假日（只認週五六，近似——見 th-date-utils.js） */
    isHoliday(i) { return window.thIsHolidayApprox(this.nightDate(i)); },

    /* 第 i 夜、某設施的單價。**所有金額計算都走這支**，不要直接讀 price.weekday */
    priceOf(f, i) { return window.thFcPriceOf(f, this.nightDate(i)); },

    handleNext() {
      const params = new URLSearchParams({
        route: FC2_ROUTE_ID,
        start: this.startDate,
        nights: this.nights,
        headcount: this.headcount,
        team: this.teamName.trim(),
        payment: this.payment,
        alloc: JSON.stringify(this.alloc),
        total: this.grandTotal,
      });
      window.location.href = `apply-3.html?${params}`;
    },

    goBack() {
      const params = new URLSearchParams({
        route: FC2_ROUTE_ID,
        start: this.startDate,
        nights: this.nights,
        headcount: this.headcount,
      });
      window.location.href = `forest-camp-1.html?${params}`;
    },
  },
});
