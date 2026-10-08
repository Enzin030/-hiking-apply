/* th-trip-basics — 「路線與基本資料」卡：行程天數、出發日期、離開日期（2026-10-08）
   ------------------------------------------------------------
   2026-10-08 使用者裁示「日期確認併入行程規劃」：警政署、自然保護區域、山屋原第 1 步（日期確認）
   的日期卡併到行程規劃頁頂端。三頁原本各寫一份幾乎逐字相同的 markup（apply_npa_1、
   apply_forest_area_1、forest-camp-1），依「二次即提升」收成本元件；文字與樣式逐字照搬。
   （設計稿 .scratch/outputs/申請模塊整併設計_20261008.md 的 M01；國家公園 apply-3 的同類區塊另有主次路線、
   隊名，本次不併）

   用法：
     <th-trip-basics id="sec-basic" v-model:days="days" v-model:start="start"
                     :day-options="[1,2,3]" :date-options="dates"
                     start-hint="※因作業規定，最晚須於3天前申請。"></th-trip-basics>
   - placeholder（預設 true）：天數、日期下拉首項「請選擇」，未選天數前日期停用（警政署、保護區）；
     山屋為 false（兩欄一律有值，同原 forest-camp-1）
   - title（預設「路線與基本資料」）：卡片有編號的頁面傳入含編號的標題（保護區「1. 路線與基本資料」，其後卡片順延）
   - compact（預設 false）：複合申請的子項目（2026-10-08，國家公園路線＋山屋）不重複顯示系統時間與受理時段提示
   - 預設 slot 放在日期欄位下方、同一張卡內（山屋的隊名、天池停留地點）
   - 離開日期＝出發日期＋天數－1（系統計算、純文字；未選前顯示「──（系統自動計算）」，使用者 2026-10-07）
   - 受理時段提示照原三頁原文（「國家公園路線…」照抄自國家公園頁，對非國家公園類別不準確，
     已列為範圍外候選，本元件不改字）
   ------------------------------------------------------------ */
window.thComponents = window.thComponents || {};
window.thComponents["th-trip-basics"] = {
  props: {
    days: { type: Number, default: 0 },
    start: { type: String, default: "" },
    dayOptions: { type: Array, required: true },
    dateOptions: { type: Array, required: true },
    placeholder: { type: Boolean, default: true },
    startHint: { type: String, default: "" },
    title: { type: String, default: "路線與基本資料" },
    compact: { type: Boolean, default: false },
  },
  emits: ["update:days", "update:start"],
  data() {
    return { nowTime: new Date().toTimeString().slice(0, 5) };
  },
  computed: {
    daysModel: {
      get() { return this.days; },
      set(v) { this.$emit("update:days", v); },
    },
    startModel: {
      get() { return this.start; },
      set(v) { this.$emit("update:start", v); },
    },
    endDate() { return this.start && this.days ? window.thAddDaysToDateValue(this.start, this.days - 1) : ""; },
  },
  template: `
    <section class="th-card">
      <div class="th-card-head">
        <h2 class="th-card-title">{{ title }}</h2>
        <span v-if="!compact" class="th-flag is-snow th-systime ml-auto"><i class="fa-regular fa-clock" aria-hidden="true"></i><span class="th-systime-label">目前系統時間：</span>{{ nowTime }}</span>
      </div>
      <div class="th-card-body grid gap-4">
        <div v-if="!compact" class="th-callout">
          <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
          <div><strong>請注意：</strong>國家公園路線<strong>於每日 23:00 至隔日 07:00 暫停受理申請</strong>。</div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="th-field">
            <label class="th-label" for="f-days"><span class="req">*</span>行程天數</label>
            <th-hybrid-select><select id="f-days" class="th-select" v-model.number="daysModel">
              <option v-if="placeholder" :value="0">請選擇</option>
              <option v-for="n in dayOptions" :key="n" :value="n">{{ n }}</option>
            </select></th-hybrid-select>
          </div>
          <div class="th-field">
            <label class="th-label" for="f-start"><span class="req">*</span>出發日期</label>
            <th-hybrid-select><select id="f-start" class="th-select" v-model="startModel" :disabled="placeholder && !days">
              <option v-if="placeholder" value="">請選擇</option>
              <option v-for="d in dateOptions" :key="d" :value="d">{{ d }}</option>
            </select></th-hybrid-select>
            <span v-if="startHint" class="th-field-hint is-accent">{{ startHint }}</span>
          </div>
          <div class="th-field">
            <span class="th-label">離開日期</span>
            <p class="py-2 text-base text-slate-900">{{ endDate || '──（系統自動計算）' }}</p>
          </div>
        </div>
        <slot></slot>
      </div>
    </section>
  `,
};
