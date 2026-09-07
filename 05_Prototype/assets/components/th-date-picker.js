/* ============================================================
   th-date-picker — 日期欄位（原生 input[type=date] 的薄包裝）
   ------------------------------------------------------------
   **本元件不是自訂日曆彈窗，是原生 input[type=date] 加一層 label／hint／error。**
   2026-09-07 經使用者確認採此設計。

   為什麼是薄包裝：
   1. 全站現有四處日期輸入本來就都是原生 input：Apply3.jsx:128、
      ForestCamp1.jsx:5（自己包了一層一樣的東西）、News.jsx:528／531。
      沒有任何頁面有自訂日曆，所以薄包裝不會讓任何頁面倒退。
   2. **AA 本輪不列範圍**（計畫 §1），而自建彈窗日曆（鍵盤導覽、焦點囚鎖、
      螢幕閱讀報讀、aria-activedescendant）正是最容易欠下 AA 債的元件。
      原生 input 免費拿到作業系統層的鍵盤、觸控與報讀支援。
   3. 因此它會是十三支元件裡最小的一支，v4 §5 階段 2 擔心的
      「th-date-picker 是其中變數最大者」不成立。

   外觀沿用 shared.css 既有 class：.th-field／.th-label／.th-label .req／
   .th-input／.th-field-hint。只有 .th-field-error 是新增的（shared.css 沒有），
   寫在 components.css。

   **預設不套 .th-input--date**：那支規則寫死 `width: 165px; flex: 0 0 auto`，
   是 news.html 篩選列的情境專用。實際盤點——ForestCamp1 用純 .th-input、
   apply-3 用 .th-input ＋ 自己的 p3-date-input、只有 news.html 用 --date。
   多數不需要，所以依 §6.2.1「元件的可覆寫預設尺寸」原則給最寬鬆的預設，
   要窄的頁面自己加：

     <th-date-picker v-model="from" input-class="th-input--date" />

   這樣元件不會替頁面決定寬度。

   ------------------------------------------------------------
   刻意不做進本元件的兩件事
   ------------------------------------------------------------
   一、**迄日推算留在頁面的 computed**，不做成 prop。各頁規則不同：
       - forest-camp-1：起日 ＋ 夜數，夜數還受 cabin.minDays／maxDays 限制
       - apply-3：起日 ＋ 天數
       做成 prop 等於把兩套業務規則塞進元件。頁面寫法：

         computed: {
           endDate() {
             if (!this.startDate) return "";
             return thAddDaysToDateValue(this.startDate, this.nights);
           },
         }

       迄日本身是唯讀顯示，用既有的 .th-input-readonly，不是第二個 picker。

   二、**日期區間不另做 range 元件**。兩支 picker，第二支的 min 綁第一支的值：

         <th-date-picker v-model="startDate" label="開始日期" />
         <th-date-picker v-model="endDate" label="結束日期" :min="startDate" />

       news.html 的兩欄日期篩選就是這個形狀，夠用。

   ------------------------------------------------------------
   用法
   ------------------------------------------------------------
     <th-date-picker v-model="startDate"
                     label="起登日期"
                     :min="thTodayValue()"
                     hint="可選 2～4 晚"
                     :required="true" />

   props：
     modelValue  "YYYY-MM-DD"，用 v-model 綁
     label       欄位標籤（不給則不出 <label>）
     min／max    "YYYY-MM-DD"；min 未給時**不預設今天**——查詢用的日期欄位
                 常需要選過去日期（news.html 的公告日期篩選），
                 預設擋住反而是錯的。要擋過去日期就明確傳 thTodayValue()
     required    出 .req 星號並加 required 屬性
     hint        欄位下方灰字說明
     error       有值時出錯誤訊息（預留給未來的卡控，見計畫 §6.4 的 th-form-field）
     disabled／readonly／name／inputId
     inputClass  附加在 input 上的修飾 class（如 th-input--date 收窄寬度）
   emits：
     update:modelValue（v-model）、change（原生 change 事件冒泡後才發）
   ============================================================ */
window.thComponents = window.thComponents || {};
window.thComponents["th-date-picker"] = {
  props: {
    modelValue: { type: String, default: "" },
    label: { type: String, default: "" },
    min: { type: String, default: "" },
    max: { type: String, default: "" },
    required: { type: Boolean, default: false },
    hint: { type: String, default: "" },
    error: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    name: { type: String, default: "" },
    inputId: { type: String, default: "" },
    inputClass: { type: String, default: "" },
  },

  emits: ["update:modelValue", "change"],

  data() {
    // label 的 for 與 input 的 id 要對得起來，點 label 才會聚焦到欄位。
    // 頁面沒給 inputId 就自動生一個唯一值——在 data() 生成而非 computed，
    // computed 應該是純函式，在裡面遞增序號是副作用。
    window.__thDatePickerSeq = (window.__thDatePickerSeq || 0) + 1;
    return { autoId: "th-date-" + window.__thDatePickerSeq };
  },

  computed: {
    resolvedId() { return this.inputId || this.autoId; },
  },

  methods: {
    onInput(e) {
      this.$emit("update:modelValue", e.target.value);
    },
    onChange(e) {
      this.$emit("change", e.target.value);
    },
  },

  template: `
    <div class="th-field">
      <label v-if="label" class="th-label" :for="resolvedId">
        {{ label }}<span v-if="required" class="req">*</span>
      </label>
      <input
        type="date"
        :class="['th-input', inputClass]"
        :id="resolvedId"
        :name="name || null"
        :value="modelValue"
        :min="min || null"
        :max="max || null"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        @input="onInput"
        @change="onChange" />
      <div v-if="error" class="th-field-hint th-field-error">{{ error }}</div>
      <div v-else-if="hint" class="th-field-hint">{{ hint }}</div>
    </div>
  `,
};
