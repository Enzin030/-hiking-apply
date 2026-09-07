/* 階段 2 驗收頁的初始化腳本。只登記 root options，掛載由 assets/app-boot.js 負責。 */
thPage({
  data() {
    return {
      modal: null,
      cabinData: window.TH_CABIN_DATA,
      today: window.thTodayValue(),
      plus3: window.thAddDaysToDateValue(window.thTodayValue(), 3),
      demoDay: {
        labels: ["餘額", "待處理", "補件", "已通過", "待系統排定", "宿營地不足候補"],
        v: ["9999", "0", "0", "0", "0", "0"],
      },
      demoForestry: [
        { label: "抽籤人數", value: "38" },
        { label: "剩餘數量", value: "12" },
      ],
    };
  },
  computed: {
    cabinCount() { return Object.keys(this.cabinData).length; },
  },
});
