/* ============================================================
   th-captcha — 圖形驗證碼欄位（查詢型頁面共用）
   ------------------------------------------------------------
   舊站 apply_2 / apply_3 / apply_4 / apply_4t 的驗證碼區塊完全同構：
   一個文字輸入框 ＋ 一張驗證碼圖（`CheckImageCode.aspx`）＋「換一組」按鈕
   （`onclick="changevcode();"`）。原本只有 applySearch.html 一份，
   2026-09-16 新增 apply_2／apply_4 後變成三份，依樣式歸屬的「二次即提升」
   提升為共用元件，前綴 `.th-*`。

   **本元件不新增任何 CSS**，沿用 components.css 既有的
   .th-field／.th-label／.th-input／.th-input-readonly／.th-btn-ghost／.th-field-hint
   與 Tailwind utility，組合與提升前的 applySearch.html 逐字相同。

   ------------------------------------------------------------
   靜態與可換碼模式
   ------------------------------------------------------------
   預設為靜態示意碼，換碼按鈕停用並顯示提示。送件流程可啟用 refreshable 模式，
   按鈕透過 update:code / update:modelValue 更新顯示碼並清空輸入值。這仍是前端示意，
   不代表已連接後端驗證碼服務。

   ------------------------------------------------------------
   用法
   ------------------------------------------------------------
   靜態頁：
       <th-captcha v-model="vcode" input-id="f-vcode"></th-captcha>

   可換碼送件頁（由共用元件產碼、輸入與顯示值保持連動）：
       <th-captcha v-model="captchaInput" v-model:code="captchaCode" :refreshable="true"
         input-id="f-captcha" label="送件驗證碼" layout="stack" hide-hint
         ref="captchaField"></th-captcha>

   input-id 要逐頁給不同值，避免 label 指到錯的輸入框。
   ============================================================ */
window.thComponents = window.thComponents || {};
window.thComponents["th-captcha"] = {
  props: {
    modelValue: { type: String, default: "" },
    /* 靜態示意字樣；可換碼模式由父頁以 v-model:code 綁定最新值 */
    code: { type: String, default: "7K4M" },
    inputId: { type: String, default: "f-vcode" },
    label: { type: String, default: "請輸入驗證碼" },
    hideHint: { type: Boolean, default: false },
    layout: { type: String, default: "stack" },
    refreshable: { type: Boolean, default: false },
  },
  emits: ["update:modelValue", "update:code"],

  methods: {
    refresh() {
      if (!this.refreshable) return;
      const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
      let nextCode = "";
      do {
        nextCode = "";
        for (let i = 0; i < 4; i++) {
          nextCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      } while (nextCode === this.code);
      this.$emit("update:code", nextCode);
      this.$emit("update:modelValue", "");
    },
  },

  template: `
    <div v-if="layout === 'col12'" class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start sm:items-center">
      <label class="sm:col-span-3 lg:col-span-2 text-[length:var(--fs-sm)] font-bold text-slate-700 text-left" :for="inputId">
        <span class="text-red-500 mr-1 req">*</span>{{ label }}
      </label>
      <div class="sm:col-span-9 lg:col-span-10">
        <div class="flex items-center gap-2 max-w-md">
          <input
            :id="inputId"
            name="vcode"
            type="text"
            class="th-input flex-1 min-w-0"
            autocomplete="off"
            placeholder="請輸入驗證碼"
            maxlength="6"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)" />
          <span
            :class="refreshable
              ? 'flex items-center justify-center shrink-0 w-28 h-[42px] text-center font-mono font-bold tracking-[0.25em] text-blue-900 bg-indigo-50 border border-indigo-200 rounded-md select-none text-base'
              : 'th-input th-input-readonly w-28 h-[42px] text-center tracking-[0.3em]'">{{ code }}</span>
          <button
            type="button"
            :class="refreshable
              ? 'th-btn th-btn-primary shrink-0 w-[42px] h-[42px] !p-0 flex items-center justify-center !shadow-none hover:opacity-85 transition-opacity'
              : 'th-btn th-btn-ghost shrink-0'"
            :disabled="!refreshable"
            :title="refreshable ? '換一組驗證碼' : '雛形驗證碼不提供更換'"
            :aria-label="refreshable ? '換一組驗證碼' : null"
            @click="refresh">
            <i class="fa-solid fa-rotate" aria-hidden="true"></i>
            <span v-if="!refreshable" class="ml-1">換一組</span>
          </button>
        </div>
        <div v-if="!hideHint" class="th-field-hint">
          {{ refreshable ? '原型示意碼由前端更新，尚未連接後端驗證。' : '雛形不做真實驗證，驗證碼為靜態字樣，「換一組」不會產生新驗證碼。' }}
        </div>
      </div>
    </div>

    <div v-else class="th-field">
      <label class="th-label" :for="inputId">
        <span class="req">*</span>{{ label }}
      </label>
      <div class="flex items-center gap-2">
        <input
          :id="inputId"
          name="vcode"
          type="text"
          class="th-input flex-1 min-w-0"
          autocomplete="off"
          placeholder="請輸入驗證碼"
          maxlength="6"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)" />
        <span
          :class="refreshable
            ? 'flex items-center justify-center shrink-0 w-28 h-[42px] text-center font-mono font-bold tracking-[0.25em] text-blue-900 bg-indigo-50 border border-indigo-200 rounded-md select-none text-base'
            : 'th-input th-input-readonly w-28 h-[42px] text-center tracking-[0.3em]'">{{ code }}</span>
        <button
          type="button"
          :class="refreshable
            ? 'th-btn th-btn-primary shrink-0 w-[42px] h-[42px] !p-0 flex items-center justify-center !shadow-none hover:opacity-85 transition-opacity'
            : 'th-btn th-btn-ghost shrink-0'"
          :disabled="!refreshable"
          :title="refreshable ? '換一組驗證碼' : '雛形驗證碼不提供更換'"
          :aria-label="refreshable ? '換一組驗證碼' : null"
          @click="refresh">
          <i class="fa-solid fa-rotate" aria-hidden="true"></i>
          <span v-if="!refreshable" class="ml-1">換一組</span>
        </button>
      </div>
      <div v-if="!hideHint" class="th-field-hint">
        {{ refreshable ? '原型示意碼由前端更新，尚未連接後端驗證。' : '雛形不做真實驗證，驗證碼為靜態字樣，「換一組」不會產生新驗證碼。' }}
      </div>
    </div>
  `,
};
