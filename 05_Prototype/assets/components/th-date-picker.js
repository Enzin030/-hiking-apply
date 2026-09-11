/* ============================================================
   th-date-picker — 日期欄位（flatpickr 彈窗 ＋ label／hint／error）
   ------------------------------------------------------------
   **2026-09-10 由原生 input[type=date] 改為 flatpickr（模式 2，理由是外觀）。**
   原生的日曆圖示、年/月/日 排版、展開的月曆彈窗都不可控，跨瀏覽器差異明顯
   （Safari 連日曆圖示都沒有）。功能上原生夠用（單選 ＋ min/max），純為外觀換。

   **消費端一行都沒改** —— props、emits、v-model 的值格式（"YYYY-MM-DD"）
   全部不變。這正是 2026-09-07 決定「包一層薄 wrapper」的目的：
   換掉底層實作時，頁面不需要知道。

   ------------------------------------------------------------
   降級：flatpickr 沒載到時會怎樣
   ------------------------------------------------------------
   `initPicker()` 開頭檢查 `typeof flatpickr === "undefined"`，沒載到就直接 return，
   欄位維持成一個普通的文字輸入框（`type="text"`＋`placeholder="YYYY-MM-DD"`）。
   仍可鍵入、仍會 emit，只是沒有彈窗。**不會整頁壞掉，也不會靜默出錯**。

   ⚠ 但這時 **min／max 不會生效**（原本由原生 input 的屬性負責，
   現在改由 flatpickr 的 minDate／maxDate 負責）。降級狀態下需要卡控的頁面
   要自己在送出前檢查。

   ------------------------------------------------------------
   下面這段是 2026-09-07 採原生方案時的理由，保留供回溯
   ------------------------------------------------------------

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
   .th-input／.th-field-hint。`.th-field-error` 與 **flatpickr 的主題覆寫**
   寫在 components.css（一律用 tokens，不用 flatpickr 預設的藍色主題）。

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
    /*
      bare：不輸出外層的 `.th-field`，只留 `.th-fp-wrap > input`。
      給「頁面已經自己有 .th-field 與 <label>，只想把 input 換成 flatpickr」
      的情境用——apply-3 的入山日期與 news 的發布日期起訖都是這種。
      不給 bare 的話會多一層 flex column 容器，把原本的橫向排版拆開。
    */
    bare: { type: Boolean, default: false },
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

    /*
      兩個 template 分支（有 .th-field 與 bare）共用同一組 input 屬性。
      寫成 computed 而不是在樣板裡重複一遍——重複的兩份遲早會漂移，
      而且那種漂移在 prod build 下不會有任何提示。

      type="text" 而非 "date"：flatpickr 接管彈窗之後，原生的日曆圖示與
      年/月/日 分段輸入若還在，會與 flatpickr 的彈窗疊在一起。
      min／max 改由 flatpickr 的 minDate／maxDate 負責（見 initPicker 與 watch），
      但**值的格式仍是 "YYYY-MM-DD"**，v-model 的契約沒有變。
    */
    inputAttrs() {
      return {
        type: "text",
        inputmode: "numeric",
        autocomplete: "off",
        placeholder: "YYYY-MM-DD",
        class: ["th-input", "th-input--fp", this.inputClass],
        id: this.resolvedId,
        name: this.name || null,
        value: this.modelValue,
        required: this.required,
        disabled: this.disabled,
        readonly: this.readonly,
      };
    },
  },

  methods: {
    onInput(e) {
      this.$emit("update:modelValue", e.target.value);
    },
    onChange(e) {
      this.$emit("change", e.target.value);
    },

    /* flatpickr 掛載。失敗時**保留原生 input 的行為**，見檔頭「降級」一節。 */
    initPicker() {
      if (typeof flatpickr === "undefined" || !this.$refs.input) return;
      var self = this;
      this.fp = flatpickr(this.$refs.input, {
        // **dateFormat 固定 Y-m-d**：v-model 的契約是 "YYYY-MM-DD"，
        // 換掉它就等於改了所有消費端拿到的值。顯示格式若要中文化，
        // 用 altInput／altFormat，不要動 dateFormat。
        dateFormat: "Y-m-d",
        locale: (window.flatpickr && flatpickr.l10ns && flatpickr.l10ns.zh_tw) || "default",
        minDate: this.min || null,
        maxDate: this.max || null,
        allowInput: true,          // 仍可直接鍵入，不是唯讀欄位
        disableMobile: true,       // 行動裝置也用同一個彈窗，否則又退回原生外觀
        onChange: function (dates, str) {
          // flatpickr 不會觸發原生 input/change 事件，要自己把值送回 v-model
          self.$emit("update:modelValue", str);
          self.$emit("change", str);
        },
      });
    },
    destroyPicker() {
      if (this.fp) { this.fp.destroy(); this.fp = null; }
    },
  },

  mounted() {
    this.initPicker();
  },

  beforeUnmount() {
    this.destroyPicker();
  },

  watch: {
    // min／max 是 reactive prop（forest-camp-1 的迄日 min 綁起日），
    // 值變了要同步給 flatpickr，否則限制會停在初始值。
    min(v) { if (this.fp) this.fp.set("minDate", v || null); },
    max(v) { if (this.fp) this.fp.set("maxDate", v || null); },
    // 頁面用程式改值時（不是使用者操作），要讓彈窗的選取狀態跟上
    modelValue(v) {
      if (this.fp && v !== this.fp.input.value) this.fp.setDate(v || "", false);
    },
  },

  template: `
    <div v-if="!bare" class="th-field">
      <label v-if="label" class="th-label" :for="resolvedId">
        {{ label }}<span v-if="required" class="req">*</span>
      </label>
      <span class="th-fp-wrap"><input v-bind="inputAttrs" ref="input" @input="onInput" @change="onChange" /></span>
      <div v-if="error" class="th-field-hint th-field-error">{{ error }}</div>
      <div v-else-if="hint" class="th-field-hint">{{ hint }}</div>
    </div>
    <span v-else class="th-fp-wrap"><input v-bind="inputAttrs" ref="input" @input="onInput" @change="onChange" /></span>
  `,
};