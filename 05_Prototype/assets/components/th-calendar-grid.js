/* ============================================================
   th-calendar-grid — 月曆格陣（一支涵蓋原 BedCalendar 與 ForestryCalendar）
   ------------------------------------------------------------
   2026-09-07 經使用者確認：獨立元件，**不與 th-date-picker 合併**。
   兩者需求不重疊——本元件是**唯讀的數量格陣**，輸出是「點了哪一天」給頁面開
   明細彈窗；th-date-picker 是表單欄位，輸出是一個日期值。真正共用的只有日期
   運算，已抽在 th-date-utils.js。

   ------------------------------------------------------------
   為什麼原本兩支可以併成一支
   ------------------------------------------------------------
   Campsite.jsx:525 的註解說明了 ForestryCalendar 要與 BedCalendar 分開寫的理由：
   林業署沒有「餘額」概念（0 不等於額滿，不能套 remainFlag 的紅／綠語意），
   且計數項目每日不一致。**那個理由完全成立，但它只影響「格子裡畫什麼」。**

   實際比對兩支的程式碼：格陣建構部分（月初留白格數、逐日填格、補到 7 的倍數）
   **逐字相同**，差異全部在 cell 的內容與 class。React 沒有 scoped slot，只能
   整支複製一份；Vue 用 scoped slot 就能把差異外包給呼叫端。

   → 所以是「一支元件 ＋ 兩種 slot 內容」，不是「兩支元件」。
     那條業務差異沒有消失，它變成 slot 內容，而不是第二個檔案。

   ------------------------------------------------------------
   props
   ------------------------------------------------------------
     days      該地點的日資料陣列。每個元素至少要有：
                 d  當月日數（1–31）
                 w  星期（0=日 … 6=六）——**只有第一個元素的 w 會被使用**，
                    用來決定月初要留幾個空格
               其餘欄位（sdate／v／counts／note…）原樣傳回給 slot，本元件不解讀。
     weekHead  星期表頭文字陣列，由資料檔提供（CAMPSITE_WEEK_HEAD 等）。
               行動版七欄塞不下「星期日」，故同時輸出全稱與末字，由 CSS 切換
               （.camp-cal-week-full／.camp-cal-week-short），兩種寫法都在 DOM。

   ------------------------------------------------------------
   slots
   ------------------------------------------------------------
     cell（scoped）  每一個「有資料的日子」的格內內容，可用 { day } 取該日資料。
                     不給的話只出日期數字。
     empty（scoped） 「該日無資料」時的格內內容，可用 { day }。
                     不給的話只出日期數字——**刻意不預設補「無資料」四個字**：
                     正式站 bed_0 當月前 11 天是留空白的，自己補字等於冒充
                     正式站的說法（原 ForestryCalendar 的註解已載明這點）。

   呼叫端決定格子是按鈕還是靜態格：本元件只負責格陣與 @pick 事件，
   is-open／is-full／is-empty 這些狀態 class 由 slot 內容自己帶。

   ------------------------------------------------------------
   emits
   ------------------------------------------------------------
     pick(day)  點擊某一天。頁面拿去開 th-modal：

       <th-calendar-grid :days="site.days" :week-head="CAMPSITE_WEEK_HEAD"
                         @pick="day = $event">
         <template #cell="{ day }">…</template>
       </th-calendar-grid>

   外觀全部沿用 shared.css 既有的 .camp-cal-* 規則，本元件不新增 CSS。
   ============================================================ */
window.thComponents = window.thComponents || {};
window.thComponents["th-calendar-grid"] = {
  props: {
    days: { type: Array, required: true },
    weekHead: { type: Array, required: true },
  },

  emits: ["pick"],

  computed: {
    /*
      建構格陣。這段是原 BedCalendar 與 ForestryCalendar 逐字相同的部分：
      1. 第一天的星期決定月初留白格數
      2. 從第一天填到最後一天，資料缺漏的日子補一個「只有 d」的物件
         （由 empty slot 決定怎麼呈現）
      3. 補到 7 的倍數，讓最後一列不缺格
    */
    cells() {
      var byDay = {};
      this.days.forEach(function (d) { byDay[d.d] = d; });

      var first = this.days[0];
      var last = this.days[this.days.length - 1];
      var out = [];

      var lead = first ? first.w : 0;
      for (var i = 0; i < lead; i++) out.push(null);

      var from = first ? first.d : 1;
      var to = last ? last.d : 0;
      for (var d = from; d <= to; d++) {
        out.push(byDay[d] || { d: d, __missing: true });
      }

      while (out.length % 7 !== 0) out.push(null);
      return out;
    },
  },

  methods: {
    // 有資料 = 這天在 days 裡真的存在；缺漏的日子走 empty slot
    hasData(c) { return !c.__missing; },
  },

  template: `
    <div class="camp-cal">
      <div class="camp-cal-head">
        <div v-for="w in weekHead" :key="w" class="camp-cal-week">
          <span class="camp-cal-week-full">{{ w }}</span>
          <span class="camp-cal-week-short">{{ w.slice(-1) }}</span>
        </div>
      </div>
      <div class="camp-cal-grid">
        <template v-for="(c, i) in cells" :key="i">
          <div v-if="!c" class="camp-cal-cell is-blank"></div>
          <slot v-else-if="hasData(c)" name="cell" :day="c" :pick="() => $emit('pick', c)">
            <div class="camp-cal-cell">
              <span class="camp-cal-day">{{ c.d }}</span>
            </div>
          </slot>
          <slot v-else name="empty" :day="c">
            <div class="camp-cal-cell is-empty">
              <span class="camp-cal-day">{{ c.d }}</span>
            </div>
          </slot>
        </template>
      </div>
    </div>
  `,
};
