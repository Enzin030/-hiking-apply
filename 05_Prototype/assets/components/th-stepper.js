/* th-stepper — 登山申請流程的四步驟條（原 Shared.jsx 的 Stepper）
   預設步驟文字與順序照原樣，不可改動；current 為 1–4。

   2026-09-17：加選用的 `steps`（[{ n, title }]）。不給時行為與原本完全相同；
   apply_1_5 給自己的頁內步驟（步驟一～三＋申請完成），用同一個外觀。 */
window.thComponents = window.thComponents || {};
window.thComponents["th-stepper"] = {
  props: {
    current: { type: Number, required: true },
    steps: { type: Array, default: null },
  },
  computed: {
    list() {
      return this.steps || [
        { n: 1, title: "選擇路線" },
        { n: 2, title: "閱讀同意書" },
        { n: 3, title: "行程登記" },
        { n: 4, title: "申請完成" },
      ];
    },
  },
  methods: {
    cls(n) { return n < this.current ? "is-done" : n === this.current ? "is-current" : ""; },
  },
  template: `
    <div class="th-stepper">
      <template v-for="(s, i) in list" :key="s.n">
        <div :class="['th-step', cls(s.n)]">
          <span class="th-step-num"><span>{{ s.n }}</span></span>
          <div class="th-step-label"><span class="lbl-title">{{ s.title }}</span></div>
        </div>
        <div v-if="i < list.length - 1" :class="['th-step-line', { 'is-done': s.n < current }]"></div>
      </template>
    </div>
  `,
};
