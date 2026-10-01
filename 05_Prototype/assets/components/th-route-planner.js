/* ============================================================
   th-route-planner — 登山申請的路線規劃器（逐節點選擇）
   ------------------------------------------------------------
   2026-10-01 由 apply_1_5.js 的頁面區域元件 p-apply15-planner 提升
   （「二次即提升」：雪霸 apply_1_3 是第二個消費端）。邏輯與輸出 DOM 不變，
   只把根元素 class 由 .p-apply15-planner 改為 .th-route-planner（兩者皆無 CSS 規則）。

   舊站行為（實走確認）：逐節點選擇，下一批可選節點由目前位置決定；
   只有停在宿營地才能完成當日路線；完成當日後下一天從該宿營地出發。
   最後一天須回到登山口（2026-09-18 測試站實走玉山確認，舊站訊息「最後一天行程的點必須為登山口」）。
   玉山、太魯閣、雪霸是同一套（節點與按鈕 ID 相同；雪霸 2026-09-24 正式站實走，02_Spec/05b §3.3）。

   ------------------------------------------------------------
   props
   ------------------------------------------------------------
   graph      { start, starts?, exits[], camps[], edges[[a,b]...] }，相鄰關係為無向
   days       登山總日數
   modelValue { days: [[節點...]], finished: bool }
   readonly   只顯示逐日行程
   pickStart  **正式站第一步是「請選擇起點：」**，由使用者點選起點（玉山、雪霸實走皆同）。
              預設 false＝沿用 apply_1_5 原行為（直接從 graph.start 出發）；
              為 true 時 modelValue.days 為空即顯示起點選擇，選項為 graph.starts（缺省為 [graph.start]）。

   用法：
       <th-route-planner :graph="graph" :days="sumday" v-model="plan"></th-route-planner>
       <th-route-planner :graph="graph" :days="sumday" v-model="plan" pick-start></th-route-planner>

   本元件不新增任何 CSS，沿用 .th-chip／.th-btn／.th-input-readonly 與 Tailwind。
   ============================================================ */
(function () {
  "use strict";

  window.thComponents = window.thComponents || {};
  window.thComponents["th-route-planner"] = {
    props: {
      graph: { type: Object, required: true },
      days: { type: Number, required: true },
      modelValue: { type: Object, required: true },   // { days: [[節點...]], finished: bool }
      readonly: { type: Boolean, default: false },
      pickStart: { type: Boolean, default: false },
    },
    emits: ["update:modelValue"],
    data() {
      return { msg: "" };
    },
    computed: {
      needStart() { return this.pickStart && !this.modelValue.days.length; },
      starts() { return this.graph.starts || [this.graph.start]; },
      plan() { return this.modelValue.days.length ? this.modelValue.days : [[this.graph.start]]; },
      dayIndex() { return this.plan.length - 1; },
      today() { return this.plan[this.dayIndex]; },
      here() { return this.today[this.today.length - 1]; },
      isLastDay() { return this.dayIndex === this.days - 1; },
      options() {
        var here = this.here;
        var out = [];
        this.graph.edges.forEach(function (e) {
          if (e[0] === here) out.push(e[1]);
          else if (e[1] === here) out.push(e[0]);
        });
        return out;
      },
    },
    watch: {
      days() { if (!this.readonly) this.reset(); },
    },
    methods: {
      isCamp(n) { return this.graph.camps.indexOf(n) >= 0; },
      push(days, finished) { this.$emit("update:modelValue", { days: days, finished: !!finished }); },
      copy() { return this.plan.map(function (d) { return d.slice(); }); },
      pickStartNode(n) {
        this.msg = "";
        this.push([[n]], false);
      },
      pick(n) {
        this.msg = "";
        var days = this.copy();
        days[this.dayIndex].push(n);
        this.push(days, false);
      },
      back() {
        this.msg = "";
        var days = this.copy();
        if (days[this.dayIndex].length > 1) days[this.dayIndex].pop();
        else if (this.dayIndex > 0) days.pop();
        else if (this.pickStart) days = [];          // 第 1 天只剩起點：回到「請選擇起點」
        this.push(days, false);
      },
      reset() {
        this.msg = "";
        this.push(this.pickStart ? [] : [[this.graph.start]], false);
      },
      finishDay() {
        if (this.today.length < 2) { this.msg = "請先選擇今日行經的地點"; return; }
        if (this.isLastDay) {
          if (this.graph.exits.indexOf(this.here) < 0) { this.msg = "最後一天行程的點必須為登山口"; return; }
          this.msg = "";
          this.push(this.plan, true);
          return;
        }
        if (!this.isCamp(this.here)) { this.msg = "只有宿營地才能完成今日路線"; return; }
        this.msg = "";
        var days = this.copy();
        days.push([this.here]);
        this.push(days, false);
      },
    },
    template: `
      <div class="th-route-planner">
        <template v-if="needStart">
          <template v-if="!readonly">
            <p class="th-label">第 1 天 · 請選擇起點</p>
            <div class="th-chip-row mb-3">
              <button v-for="n in starts" :key="n" type="button" class="th-chip" @click="pickStartNode(n)">{{ n }}</button>
            </div>
          </template>
        </template>
        <template v-else>
        <ol class="grid gap-2 mb-3">
          <li v-for="(d, i) in plan" :key="i" class="th-input th-input-readonly">
            <strong>第 {{ i + 1 }} 天：</strong>{{ d.join(' → ') }}<span v-if="isCamp(d[d.length - 1]) && (i < plan.length - 1 || modelValue.finished)" class="th-flag ml-2">宿營</span>
          </li>
        </ol>

        <template v-if="!readonly && !modelValue.finished">
          <p class="th-label">第 {{ dayIndex + 1 }} 天 · 目前位置：{{ here }}，請選擇下一個地點</p>
          <div class="th-chip-row mb-3">
            <button v-for="n in options" :key="n" type="button" class="th-chip" @click="pick(n)">
              <i v-if="isCamp(n)" class="fa-solid fa-campground" aria-hidden="true"></i>{{ n }}</button>
          </div>
          <div class="flex flex-wrap gap-2">
            <button type="button" class="th-btn th-btn-ghost th-btn-sm" @click="reset"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i>重新規劃</button>
            <button type="button" class="th-btn th-btn-ghost th-btn-sm" @click="back"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i>返回上個地點</button>
            <button type="button" class="th-btn th-btn-primary th-btn-sm" @click="finishDay"><i class="fa-solid fa-check" aria-hidden="true"></i>{{ isLastDay ? '完成路線' : '完成今日路線' }}</button>
          </div>
          <p v-if="msg" class="th-field-hint mt-2" role="alert">{{ msg }}</p>
        </template>
        <!-- 舊站完成路線後「完成路線」消失，仍保留「重新規劃」「返回上個地點」（2026-09-17 截圖 TAR026_S02_ready） -->
        <div v-else-if="!readonly" class="flex flex-wrap items-center gap-2">
          <span class="th-field-hint">路線規劃完成。</span>
          <button type="button" class="th-btn th-btn-ghost th-btn-sm" @click="reset"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i>重新規劃</button>
          <button type="button" class="th-btn th-btn-ghost th-btn-sm" @click="back"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i>返回上個地點</button>
        </div>
        </template>
      </div>
    `,
  };
})();
