/* ============================================================
   th-date-utils — 日期工具（原 ForestCampShared.jsx 的兩支函式）
   ------------------------------------------------------------
   刻意抽成獨立一支、不塞進某個元件裡，因為使用者橫跨三處：
   - forest-camp-1：起日 ＋ 夜數 → 迄日
   - apply-3：起日 ＋ 天數 → 迄日
   - 未來的 th-date-picker：min 預設值（今天）

   ------------------------------------------------------------
   為什麼不用 toISOString().slice(0,10)
   ------------------------------------------------------------
   `toISOString()` 會轉成 UTC。臺灣是 UTC+8，所以當地時間 00:00–07:59 之間
   算出來的日期會**倒退一天**。原 ForestCampShared.jsx 用逐欄組字串的寫法
   正是為了避開這個坑，這裡照抄，不要「簡化」成 toISOString。

   同理 addDays 用 `new Date(y, m-1, d)`（當地時區建構）而非
   `new Date("2026-09-07")`（會被當成 UTC 午夜）。
   ============================================================ */

/* Date 物件 → <input type="date"> 需要的 "YYYY-MM-DD" */
window.thFormatDateInputValue = function (date) {
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
};

/* "YYYY-MM-DD" ＋ n 天 → "YYYY-MM-DD"（跨月跨年由 Date 自行處理） */
window.thAddDaysToDateValue = function (dateValue, days) {
  var parts = dateValue.split("-").map(Number);
  var date = new Date(parts[0], parts[1] - 1, parts[2]);
  date.setDate(date.getDate() + days);
  return window.thFormatDateInputValue(date);
};

/* 今天的 "YYYY-MM-DD"，供 th-date-picker 的 min 預設值用 */
window.thTodayValue = function () {
  return window.thFormatDateInputValue(new Date());
};

/* ------------------------------------------------------------
   假日判定（**近似**，2026-09-16）
   ------------------------------------------------------------
   只認**星期五、星期六**。這不是官網的完整定義：

     天池山莊（notice_b5）：星期五、六、國定假日前一晚及農曆連假
     嘉明湖・向陽・檜谷（notice_b6／b4）：星期五、六及連續假日前一日至收假前一日

   「國定假日」「農曆連假」「收假日」需要外部行事曆資料，本雛形沒有，
   **也不自己編一份**（編出來的假行事曆會被當成規則）。所以只做週五六近似，
   並在畫面上標明「假日費率以週五六估算，連假另計」。
   [待確認] 假日行事曆的資料來源。

   各家假日定義不同這件事本身也沒有在此實作——近似值對四家都一樣。
   ------------------------------------------------------------ */
window.thIsHolidayApprox = function (dateValue) {
  if (!dateValue) return false;
  var parts = String(dateValue).split("-").map(Number);
  if (parts.length !== 3 || !parts[0]) return false;
  var d = new Date(parts[0], parts[1] - 1, parts[2]).getDay();
  return d === 5 || d === 6;   // 5=五 6=六
};
