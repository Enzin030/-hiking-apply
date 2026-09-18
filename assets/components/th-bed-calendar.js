/* ============================================================
   th-bed-calendar — 宿營地／床位查詢的月份列＋單一數字月曆
   ------------------------------------------------------------
   2026-09-17 由 bed_0.html 提升（第二個消費端是 bed_1.html，二次即提升）。
   樣式在 components.css 的 .th-bedcal-*（原 pages.css 的 .p-bed0-*）。

   版面（使用者 2026-09-17 逐項定案）：
     月份列：上個月／年、月下拉（共用 th-hybrid-select）／下個月，無底色
     格子：白底；有值時「<主標籤> N」（N 為 --green-700），下方小字「<副標籤> N」；
           主數字為 0 時改顯示「額滿」（置頂標記字色）；
           整週都沒資料的列自動變矮
     ≤ 640px：星期簡寫，只留大數字

   props：
     year／month   目前年月（v-model:year／v-model:month）
     years         年份下拉選項
     days          該月每日的值，第 i 項＝第 i+1 日：[主數字, 副數字, 副數字2?] 或 null（該日無資料）；
                   整個月沒有快照時傳 null，元件顯示 emptyText
     mainLabel     主數字標籤，預設「剩餘」
     subLabel      副數字標籤，預設「申請」
     sub2Label     第二個副數字的標籤；**給了才渲染第二行**（2026-09-18 為 bed_1 的
                   「餘額／待處理／已通過」三數字而加）。不給就完全不產生該元素，
                   所以 bed_0 的 DOM 與樣式一字未變。兩行都是 .th-bedcal-sub，
                   沿用同一條既有樣式，components.css 不必新增規則。
     emptyText     整月無資料時的說明
     clickable     true 時有值的格子是按鈕，點了 emit pick(日)
   emits：update:year、update:month、pick(d)

   1 日是星期幾由年月直接算，資料檔不必存。
   ============================================================ */
window.thComponents = window.thComponents || {};
window.thComponents["th-bed-calendar"] = {
  props: {
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    years: { type: Array, required: true },
    days: { type: Array, default: null },
    mainLabel: { type: String, default: "剩餘" },
    subLabel: { type: String, default: "申請" },
    sub2Label: { type: String, default: "" },
    emptyText: { type: String, default: "" },
    clickable: { type: Boolean, default: false },
    ariaLabel: { type: String, default: "" },
  },
  emits: ["update:year", "update:month", "pick"],
  computed: {
    weekHead() { return ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]; },
    weekShort() { return ["日", "一", "二", "三", "四", "五", "六"]; },
    cells() {
      if (!this.days) return [];
      const lead = new Date(this.year, this.month - 1, 1).getDay();
      const cells = [];
      for (let i = 0; i < lead; i++) cells.push(null);
      this.days.forEach((v, i) => cells.push({ d: i + 1, w: (lead + i) % 7, v }));
      while (cells.length % 7 !== 0) cells.push(null);
      return cells;
    },
  },
  methods: {
    shift(step) {
      const t = this.year * 12 + (this.month - 1) + step;
      const y = Math.floor(t / 12);
      if (!this.years.includes(y)) return;
      this.$emit("update:year", y);
      this.$emit("update:month", (t % 12) + 1);
    },
  },
  template: `
    <div class="th-bedcal">
      <div class="th-bedcal-monthbar">
        <button type="button" class="th-btn th-btn-ghost th-btn-sm" @click="shift(-1)">
          <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>上個月
        </button>
        <div class="th-bedcal-ym">
          <th-hybrid-select>
            <select class="th-select" :value="year" @change="$emit('update:year', +$event.target.value)" aria-label="年">
              <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
            </select>
          </th-hybrid-select>
          <span>年</span>
          <th-hybrid-select>
            <select class="th-select" :value="month" @change="$emit('update:month', +$event.target.value)" aria-label="月">
              <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
            </select>
          </th-hybrid-select>
          <span>月</span>
        </div>
        <button type="button" class="th-btn th-btn-ghost th-btn-sm" @click="shift(1)">
          下個月<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
        </button>
      </div>

      <div v-if="!days" class="th-empty">
        <i class="fa-solid fa-calendar-xmark" aria-hidden="true"></i>
        <p>{{ emptyText }}</p>
      </div>

      <div v-else class="th-bedcal-cal">
        <div class="th-bedcal-head" aria-hidden="true">
          <div v-for="(w, i) in weekHead" :key="w" class="th-bedcal-week"><span class="th-bedcal-week-full">{{ w }}</span><span class="th-bedcal-week-short">{{ weekShort[i] }}</span></div>
        </div>
        <ol class="th-bedcal-grid" :aria-label="ariaLabel || (year + ' 年 ' + month + ' 月')">
          <template v-for="(c, i) in cells" :key="i">
            <li v-if="!c" class="th-bedcal-cell is-blank" aria-hidden="true"></li>
            <li v-else-if="!c.v" class="th-bedcal-cell is-empty">
              <span class="th-bedcal-day">{{ c.d }}</span>
            </li>
            <li v-else :class="['th-bedcal-cell', c.v[0] > 0 ? 'is-open' : 'is-full']">
              <component :is="clickable ? 'button' : 'div'" :type="clickable ? 'button' : null"
                         :class="['th-bedcal-body', { 'is-btn': clickable }]"
                         :aria-label="clickable ? (month + ' 月 ' + c.d + ' 日，' + (c.v[0] > 0 ? mainLabel + ' ' + c.v[0] : '額滿') + '，查看明細') : null"
                         @click="clickable && $emit('pick', c.d)">
                <span class="th-bedcal-day">{{ c.d }}</span>
                <span class="th-bedcal-main">
                  <template v-if="c.v[0] > 0"><span class="th-bedcal-unit">{{ mainLabel }}</span><b class="th-bedcal-num">{{ c.v[0] }}</b></template>
                  <b v-else class="th-bedcal-num is-text">額滿</b>
                </span>
                <span class="th-bedcal-sub">{{ subLabel }} {{ c.v[1] }}</span>
                <span v-if="sub2Label && c.v[2] != null" class="th-bedcal-sub">{{ sub2Label }} {{ c.v[2] }}</span>
              </component>
            </li>
          </template>
        </ol>
      </div>
    </div>
  `,
};
