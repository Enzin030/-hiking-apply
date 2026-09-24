/* th-apply-stepper — 登山線上申請主流程的六步驟條（2026-09-24）
   ------------------------------------------------------------
   步驟依正式站 apply_1_4.aspx 的實際流程拆分（2026-09-21 實走）：原本第 3 步
   「行程登記」在正式站是三個步驟，同頁切換。這份清單原本在 apply-2（同意書）、
   apply-3、apply-4、apply-5 各寫一份一模一樣的 :steps，apply-1 還停在 th-stepper
   預設的舊四步驟。依「二次即提升」收成本元件，步驟只在這裡改一次。

   用法：<th-apply-stepper :current="1"></th-apply-stepper>（current 為 1–6）

   外觀與結構完全交給 th-stepper，本元件只提供步驟清單。
   **不要改 th-stepper 的預設四步驟**：apply-2 的申請前摘要（林保署區域、警政署）
   與其他頁仍在用預設值，改了會一起變。 */
window.thComponents = window.thComponents || {};
window.thComponents["th-apply-stepper"] = {
  props: {
    current: { type: Number, required: true },
  },
  computed: {
    /* 唯讀常數，放 computed 而不是 data()，避免被包成 reactive proxy */
    steps() {
      return [
        { n: 1, title: "選擇路線" },
        { n: 2, title: "閱讀同意書" },
        { n: 3, title: "行程規劃" },
        { n: 4, title: "人員資料" },
        { n: 5, title: "確認資料" },
        { n: 6, title: "申請完成" },
      ];
    },
  },
  template: `<th-stepper :current="current" :steps="steps"></th-stepper>`,
};
