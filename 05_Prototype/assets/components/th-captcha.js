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
   雛形不做真實驗證
   ------------------------------------------------------------
   驗證碼是靜態字樣，「換一組」按鈕 disabled。這是刻意的：做成看似會換的按鈕
   會讓驗收的人以為功能已接上。真實驗證碼圖由後端 `CheckImageCode.aspx` 產生，
   雛形階段沒有後端。

   ------------------------------------------------------------
   用法
   ------------------------------------------------------------
       <th-captcha v-model="vcode" input-id="f-vcode"></th-captcha>

   input-id 要逐頁給不同值：同一頁若出現兩個驗證碼欄位，id 重複會讓
   <label for> 指到錯的輸入框（無障礙檢查會抓到，畫面上看不出來）。
   ============================================================ */
window.thComponents = window.thComponents || {};
window.thComponents["th-captcha"] = {
  props: {
    modelValue: { type: String, default: "" },
    /* 靜態示意字樣。要換成別組字時給 code，不要改元件預設值 */
    code: { type: String, default: "7K4M" },
    inputId: { type: String, default: "f-vcode" },
  },
  emits: ["update:modelValue"],
  template: `
    <div class="th-field">
      <label class="th-label" :for="inputId">
        <span class="req">*</span>請輸入驗證碼
      </label>
      <div class="flex flex-col sm:flex-row gap-2 items-start">
        <input
          :id="inputId"
          name="vcode"
          type="text"
          class="th-input sm:w-44"
          autocomplete="off"
          placeholder="請輸入驗證碼"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)" />
        <span class="th-input th-input-readonly sm:w-32 text-center tracking-[0.3em]">{{ code }}</span>
        <button type="button" class="th-btn th-btn-ghost" disabled>
          <i class="fa-solid fa-rotate" aria-hidden="true"></i>換一組
        </button>
      </div>
      <div class="th-field-hint">
        雛形不做真實驗證，驗證碼為靜態字樣，「換一組」不會產生新驗證碼。
      </div>
    </div>
  `,
};
