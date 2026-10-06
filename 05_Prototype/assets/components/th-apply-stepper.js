/* th-apply-stepper — 登山線上申請主流程的六步驟條（2026-09-24）
   ------------------------------------------------------------
   步驟依正式站 apply_1_4.aspx 的實際流程拆分（2026-09-21 實走）：原本第 3 步
   「行程登記」在正式站是三個步驟，同頁切換。這份清單原本在 apply-2（同意書）、
   apply-3、apply-4、apply-5 各寫一份一模一樣的 :steps，apply-1 還停在 th-stepper
   預設的舊四步驟。依「二次即提升」收成本元件，步驟只在這裡改一次。

   用法：<th-apply-stepper :current="1"></th-apply-stepper>（current 為 1–5）

   2026-10-05 拿掉第 1 步「選擇路線」，路線列表 apply-1 也不再掛步驟條（使用者裁示）：
   列表是所有機關共用的查詢入口，掛三管處的步驟條對警政署／保護區／山屋（另一套 7 步）是錯的；
   正式站列表本身也沒有步驟條。改後兩類流程都從「點了路線之後」起算。已列 PM 確認事項。

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
        { n: 1, title: "閱讀同意書" },
        { n: 2, title: "行程規劃" },
        { n: 3, title: "隊伍資料" },   // 2026-10-06 使用者裁示步驟名稱統一為「隊伍資料」
        { n: 4, title: "確認資料" },
        { n: 5, title: "申請完成" },
      ];
    },
  },
  template: `<th-stepper :current="current" :steps="steps"></th-stepper>`,
};
