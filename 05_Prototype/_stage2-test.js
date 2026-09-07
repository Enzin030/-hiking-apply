/* 階段 2 驗收頁的初始化腳本。只登記 root options，掛載由 assets/app-boot.js 負責。 */

/* 月曆測資：刻意用「1 號不是星期日」來驗月初留白，並在林業署版留缺漏日驗 empty slot */
function makeCalDays(count, firstWeekday) {
  var out = [];
  for (var i = 1; i <= count; i++) {
    out.push({
      d: i,
      w: (firstWeekday + i - 1) % 7,
      sdate: "2026-09-" + String(i).padStart(2, "0"),
      v: [String(i % 4 === 0 ? 0 : 9999 - i), "0", "0", "0"],
    });
  }
  return out;
}

function makeForestryDays(count, firstWeekday) {
  var out = [];
  for (var i = 1; i <= count; i++) {
    if (i % 7 === 3) continue;              // 缺漏日 → 走 empty slot
    out.push({
      d: i,
      w: (firstWeekday + i - 1) % 7,
      sdate: "2026-09-" + String(i).padStart(2, "0"),
      counts: [{ label: "抽籤人數", value: String(20 + i) }, { label: "剩餘數量", value: String(i % 5) }],
    });
  }
  return out;
}

thPage({
  data() {
    return {
      modal: null,
      cabinData: window.TH_CABIN_DATA,
      today: window.thTodayValue(),
      plus3: window.thAddDaysToDateValue(window.thTodayValue(), 3),

      // th-date-picker 情境一：起日 ＋ 夜數 → 迄日
      startDate: window.thTodayValue(),
      nights: 2,

      // th-date-picker 情境二：日期區間
      rangeFrom: "",
      rangeTo: "",

      // th-calendar-grid：2026-09-01 是星期二（w=2）
      weekHead: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
      calDays: makeCalDays(30, 2),
      forestryDays: makeForestryDays(30, 2),

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

    /* 迄日推算刻意留在頁面：各頁規則不同（此處是夜數，apply-3 是天數），
       做進 th-date-picker 等於把業務規則塞進元件 */
    endDate() {
      if (!this.startDate) return "";
      return window.thAddDaysToDateValue(this.startDate, this.nights);
    },

    /* 示範 th-date-picker 的 error prop（未來卡控的統一出口） */
    rangeError() {
      if (this.rangeFrom && this.rangeTo && this.rangeTo < this.rangeFrom) {
        return "迄日不得早於起日";
      }
      return "";
    },
  },
});
