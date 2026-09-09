/* ============================================================
   campsite.js — 宿營地與床位查詢
   原 Campsite.jsx（1050 行）。版面與 11 組檢視全部搬到本檔的頁面區域元件。
   ============================================================

   ------------------------------------------------------------
   為什麼 20 支元件全部走 options.components，不進 assets/components/
   ------------------------------------------------------------
   11 支共用件（月曆、彈窗、圖例、月份列、快照提醒、總表型檢視…）的
   **消費端只有 campsite 這一頁**。依 §4.2「擁有者是元件、退場條件是最後一個
   消費端」，單一消費端不該升為全站共用層——升上去之後 assets/components/
   會出現一批只有一頁在用的東西，反而讓「共用」這個判準失效。
   2026-09-09 使用者裁決批准此界線。

   **例外：兩個彈窗改用既有的 th-modal。**
   原 DayModal／ForestryDayModal 的 DOM 與 th-modal 完全同構
   （bulletin-modal-overlay → bulletin-modal → head／meta／title／close → body），
   只差 body-class 而該 prop 存在。比照 open.html 的前例直接用共用元件；
   本檔的 p-campsite-day-modal／-forestry-day-modal 只是包一層 th-modal
   並填內容，不是另一套彈窗。
   **Esc 關閉不必自己寫**：原 React 兩個彈窗各自 useEffect 掛 keydown，
   th-modal 已內建，重複掛反而會關兩次。

   ------------------------------------------------------------
   11 組檢視不是對等結構
   ------------------------------------------------------------
     薄殼（只包 p-campsite-node-calendar，零自有狀態）
       雪霸路線／太魯閣山屋／太魯閣路線／玉山宿營地／玉山單日往返
     自有狀態的月曆
       雪霸宿營地（3）／林業署宿營地（3）／林業署區域（4）
     表格：玉山抽籤結果（2）
     純資料表：玉山抽籤日期（0）／玉山可申請退費日期（0）

   ------------------------------------------------------------
   5 支資料檔不進 data()
   ------------------------------------------------------------
   合計 359KB。照通則 1，用 computed 回傳原陣列——放進 data() 會被深度轉成
   reactive proxy，既浪費也改變物件識別（月曆格與總表列的 :key 比對）。

   ------------------------------------------------------------
   切子選時整個重掛
   ------------------------------------------------------------
   原 React 是 `<View key={org:kind} />`，用 key 強制重掛，避免把前一個子選的
   下拉與彈窗狀態帶過去。Vue 用 `<component :is>` ＋ 同樣的 :key，語意相同。
   ============================================================ */

const CAMPSITE_ORGS = [
  { key: "shei-pa",  label: "雪霸",           built: true },
  { key: "taroko",   label: "太魯閣",         built: true },
  { key: "yushan",   label: "玉山",           built: true },
  { key: "forestry", label: "林業及自然保育署", built: true },
];

const CAMPSITE_KINDS = {
  "shei-pa":  [{ key: "camp", label: "宿營地", built: true }, { key: "route", label: "路線", built: true }],
  taroko:     [{ key: "hut", label: "山屋", built: true }, { key: "route", label: "路線", built: true }],
  yushan:     [{ key: "camp", label: "宿營地", built: true }, { key: "oneday", label: "單日往返路線", built: true },
               { key: "lot", label: "抽籤結果", built: true }, { key: "lotdate", label: "抽籤日期", built: true },
               { key: "refund", label: "可申請退費日期", built: true }],
  forestry:   [{ key: "camp", label: "宿營地", built: true }, { key: "area", label: "區域申請及抽籤", built: true }],
};

const remainFlag = (value) => {
  const nums = String(value).match(/\d+/g);
  if (!nums) return null;
  return nums.some((n) => parseInt(n, 10) > 0) ? "is-yes" : "is-no";
};

const detailUrl = (page, orgId, site, day, idParam = "node_id") =>
  `https://service.skyeyes.tw/hikenationpark/${page}?orgid=${orgId}&${idParam}=${site.id}&sdate=${day.sdate}`;

const normalizeHead = (head) => {
  if (!head || !head.length) return { rows: [], leaf: [] };
  const rows = typeof head[0] === "string" ? [head.map((t) => ({ t, c: 1, r: 1 }))] : head;
  if (rows.length === 1) return { rows, leaf: rows[0].map((h) => ({ t: h.t })) };
  /*
    兩層表頭要算出**實際欄數**，不能拿第一層的格數當欄數——
    玉山 bed_6 的「平日承載量(人)」colSpan=2（底下是山屋床位／營地營位），
    第一層只有 4 格但實際是 6 欄；照 4 欄畫會少畫兩欄、資料整排錯位。
    rowSpan 跨到底的格自成一欄，其餘依 colSpan 依序吃第二層的格。
  */
  const sub = [...rows[1]];
  const leaf = [];
  rows[0].forEach((h) => {
    if (h.r >= rows.length) { leaf.push({ t: h.t }); return; }
    for (let i = 0; i < (h.c || 1); i++) {
      const s = sub.shift();
      leaf.push({ t: s && s.t ? `${h.t} ${s.t}` : h.t });
    }
  });
  return { rows, leaf };
};

/* ── 當日明細彈窗（包一層 th-modal）── */
const pCampsiteDayModal = {
  props: {
    site: { type: Object, required: true },
    day: { type: Object, default: null },
    snapshot: { type: String, default: "" },
    detailPage: { type: String, default: "" },
    orgId: { type: String, default: "" },
    idParam: { type: String, default: "node_id" },
  },
  emits: ["close"],
  computed: {
    /* 餘額固定是 labels 的第一項（正式站的排列順序） */
    flag() { return remainFlag(this.day.v[0]); },
    detailHref() { return detailUrl(this.detailPage, this.orgId, this.site, this.day, this.idParam); },
  },
  template: `
    <th-modal :meta="site.name" :title="day.sdate || (day.d + ' 日')"
              body-class="p-campsite-daybody" @close="$emit('close')">
      <table class="th-table th-table--zebra p-campsite-daytable">
        <tbody>
          <tr v-for="(label, i) in site.labels" :key="label || ('unlabeled-' + i)">
            <th scope="row"><span v-if="!label" class="p-campsite-sub">（正式站未標示項目，[待確認]）</span><template v-else>{{ label }}</template><span v-if="label === '外籍提前'" class="p-campsite-sub">（外國人＋本國人）</span></th>
            <td :class="label === '餘額' ? 'p-campsite-strong' : ''">{{ day.v[i] }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="flag" class="p-campsite-daynote">
        <span :class="['th-flag', flag]"><i :class="flag === 'is-yes' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"></i>{{ flag === 'is-yes' ? '尚有餘額' : '已無餘額' }}</span>餘額為 {{ snapshot }} 擷取之快照，實際可申請數量以線上申請流程查驗結果為準。</p>
      <p v-if="day.sdate" class="p-campsite-daynote">當日申請隊伍明細：<a class="th-inline-link" :href="detailHref" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i>查看明細</a><span class="th-legacy-tag">前往現行網站</span></p>
    </th-modal>
  `,
};

/* ── 月曆（有「餘額」概念者）── */
const pCampsiteBedCalendar = {
  props: { site: { type: Object, required: true }, weekHead: { type: Array, required: true } },
  emits: ["pick"],
  computed: {
    cells() {
      const byDay = {};
      this.site.days.forEach((d) => { byDay[d.d] = d; });
      const first = this.site.days[0];
      /* 第一天的星期決定月初留白格數 */
      const lead = first ? first.w : 0;
      const last = this.site.days[this.site.days.length - 1];
      const cells = [];
      for (let i = 0; i < lead; i++) cells.push(null);
      for (let d = first ? first.d : 1; d <= (last ? last.d : 0); d++) cells.push(byDay[d] || { d, v: [] });
      while (cells.length % 7 !== 0) cells.push(null);
      return cells;
    },
  },
  methods: {
    flagOf(c) { return remainFlag(c.v[0]); },
  },
  template: `
    <div class="p-campsite-cal">
      <div class="p-campsite-cal-head">
        <!-- 行動版七欄塞不下「星期日」，改顯示末字；兩種寫法都在 DOM，由 CSS 切換 -->
        <div v-for="w in weekHead" :key="w" class="p-campsite-cal-week">
          <span class="p-campsite-cal-week-full">{{ w }}</span>
          <span class="p-campsite-cal-week-short">{{ w.slice(-1) }}</span>
        </div>
      </div>
      <div class="p-campsite-cal-grid">
        <template v-for="(c, i) in cells" :key="i">
          <div v-if="!c" class="p-campsite-cal-cell is-blank"></div>
          <div v-else-if="!c.v.length" class="p-campsite-cal-cell is-empty">
            <span class="p-campsite-cal-day">{{ c.d }}</span>
            <span class="p-campsite-cal-none">無資料</span>
          </div>
          <button v-else type="button"
                  :class="['p-campsite-cal-cell', flagOf(c) === 'is-no' ? 'is-full' : 'is-open']"
                  @click="$emit('pick', c)"
                  :aria-label="c.sdate + ' 餘額 ' + c.v[0] + '，查看當日明細'">
            <span class="p-campsite-cal-day">{{ c.d }}</span>
            <span class="p-campsite-cal-remain">{{ c.v[0] }}</span>
            <span class="p-campsite-cal-unit">餘額</span>
          </button>
        </template>
      </div>
    </div>
  `,
};

/* ── 宿營地介紹卡 ── */
const pCampsiteSiteIntro = {
  props: { site: { type: Object, required: true } },
  computed: { intro() { return this.site.intro; } },
  template: `
    <th-callout v-if="!intro" type="warning">「{{ site.name }}」在正式站沒有提供宿營地介紹（海拔、水源、訊號等），此處不補寫。</th-callout>
    <section v-else class="th-card">
      <div class="th-card-head">
        <i class="fa-solid fa-tent"></i>
        <h2 class="th-card-title">{{ site.name }}</h2>
      </div>
      <div class="th-card-body ">
        <div class="p-campsite-intro">
          <figure v-if="intro.image" class="p-campsite-intro-pic">
            <img :src="intro.image" :alt="site.name + '實景'" loading="lazy" />
          </figure>
          <div class="p-campsite-intro-body">
            <ul class="p-campsite-intro-lines">
              <li v-for="(l, i) in intro.lines" :key="i">{{ l }}</li>
            </ul>
            <div class="p-campsite-intro-tags">
              <span v-if="intro.waters" class="p-campsite-tag"><i class="fa-solid fa-droplet"></i>{{ intro.waters.replace(/、$/, '') }}</span>
              <span v-if="intro.signals" class="p-campsite-tag"><i class="fa-solid fa-tower-broadcast"></i>{{ intro.signals.replace(/、$/, '') }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
};

/* ── 月曆下方圖例 ── */
const pCampsiteCalLegend = {
  props: { site: { type: Object, required: true }, hint: { type: String, default: "" } },
  template: `
    <div class="p-campsite-legend">
      <span class="th-flag is-yes"><i class="fa-solid fa-circle-check"></i>尚有餘額</span>
      <span class="th-flag is-no"><i class="fa-solid fa-circle-xmark"></i>已無餘額</span>
      <span class="p-campsite-legend-hint">{{ hint || ('點日期可看該日 ' + site.labels.length + ' 項計數明細') }}</span>
    </div>
  `,
};

/* ── 月份切換（本雛形是單月快照，停用並明說）── */
const pCampsiteMonthBar = {
  props: { ym: { type: Object, required: true } },
  template: `
    <div class="p-campsite-monthbar">
      <span class="p-campsite-monthbar-btn th-todo-link">上個月</span>
      <span class="p-campsite-month">{{ ym.year }} 年 {{ ym.month }} 月</span>
      <span class="p-campsite-monthbar-btn th-todo-link">下個月</span>
    </div>
  `,
};

/* ── 快照提醒 ── */
const pCampsiteSnapshotNote = {
  props: {
    snapshot: { type: String, required: true },
    ym: { type: Object, required: true },
    metric: { type: String, default: "餘額" },
  },
  template: `<th-callout type="warning">{{ metric }}為 <strong>{{ snapshot }}</strong> 自現行網站擷取的快照，非即時查詢結果；
雛形資料僅含 {{ ym.year }} 年 {{ ym.month }} 月，故月份切換尚未建置。</th-callout>`,
};

/* ── 說明區（正式站 alert 原文，逐條保留，含 FB 社團連結）── */
const pCampsiteNoticeList = {
  props: { items: { type: Array, required: true } },
  methods: {
    before(li) { return li.text.split(li.link.text)[0]; },
    after(li) { return li.text.split(li.link.text)[1]; },
  },
  template: `
    <th-callout>
      <ul class="p-campsite-notice">
        <li v-for="(li, i) in items" :key="i"><template v-if="li.link">{{ before(li) }}<a class="th-inline-link" :href="li.link.href" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i>{{ li.link.text }}</a>{{ after(li) }}</template><template v-else>{{ li.text }}</template></li>
      </ul>
    </th-callout>
  `,
};

/*
  承載量總表的欄位。表頭取自實抓的 summary.head，不寫死。
  **原 React 的 render 回傳 JSX（名稱欄是按鈕），改走 th-data-table 的 cell slot**，
  所以這裡只回欄位定義，不回 render。
*/
const summaryColumns = (summary) => {
  const [nameHead, ...valueHeads] = normalizeHead(summary.head).leaf;
  return [
    { key: "name", label: nameHead ? nameHead.t : "名稱" },
    ...valueHeads.map((h, i) => ({
      key: "c" + i,
      label: h.t,
      align: summary.rows.every((r) => /^\d+$/.test(r.cols[i])) ? "center" : undefined,
    })),
  ];
};

/* ── 「承載量總表 ＋ 下拉查詢 ＋ 月曆」型的子選 ── */
const pCampsiteNodeCalendar = {
  props: {
    summary: { type: Object, default: null },
    nodes: { type: Array, required: true },
    weekHead: { type: Array, required: true },
    snapshot: { type: String, default: "" },
    orgId: { type: String, default: "" },
    detailPage: { type: String, default: "" },
    idParam: { type: String, default: "node_id" },
    defaultIndex: { type: Number, default: 0 },
    summaryTitle: { type: String, default: "" },
    summaryIcon: { type: String, default: "" },
    summaryUnit: { type: String, default: "" },
    summaryHint: { type: String, default: "" },
    selectLabel: { type: String, default: "" },
    selectIcon: { type: String, default: "" },
    calTitle: { type: String, default: "" },
  },
  data() {
    const fallback = this.nodes[this.defaultIndex] || this.nodes[0];
    return { draftNode: fallback.id, nodeId: fallback.id, day: null };
  },
  computed: {
    fallback() { return this.nodes[this.defaultIndex] || this.nodes[0]; },
    node() { return this.nodes.find((n) => n.id === this.nodeId) || this.fallback; },
    ym() { return this.node.ym || {}; },
    head() { return this.summary ? normalizeHead(this.summary.head) : null; },
    columns() { return this.summary ? summaryColumns(this.summary) : []; },
    headRows() {
      if (!this.head || this.head.rows.length <= 1) return null;
      return this.head.rows.map((hr) => hr.map((h) => ({ label: h.t, colSpan: h.c, rowSpan: h.r })));
    },
    /*
      列 key 優先用正式站的節點代碼；只有在有列缺 id 或 id 重複時才退回名稱。
      不一律用名稱——名稱在跨機關的資料裡不保證唯一。
    */
    summaryKey() {
      const s = this.summary;
      return s && s.rows.every((r) => r.id) && new Set(s.rows.map((r) => r.id)).size === s.rows.length
        ? "id" : "name";
    },
  },
  methods: {
    submit() { this.nodeId = this.draftNode; this.day = null; },
    /* 總表點名稱：下拉與月曆一起跳到該節點，等同正式站的 postback */
    pick(id) { this.draftNode = id; this.nodeId = id; this.day = null; },
    pickable(r) { return r.id && this.nodes.some((n) => n.id === r.id); },
    colVal(row, key) {
      const v = row.cols[Number(key.slice(1))];
      /* 正式站的空值以破折號表示，不臆造內容 */
      return v === "" ? "—" : v;
    },
  },
  template: `
      <section v-if="summary" class="th-card">
        <div class="th-card-head">
          <i :class="summaryIcon"></i>
          <h2 class="th-card-title">{{ summaryTitle }}</h2>
          <span class="th-card-note">共 {{ summary.rows.length }} {{ summaryUnit }}</span>
        </div>
        <div class="th-card-body ">
          <th-data-table :columns="columns" :rows="summary.rows" :row-key="summaryKey"
                         table-class="th-table--zebra" :head-rows="headRows">
            <template #cell="{ row, column }">
              <template v-if="column.key === 'name'"><button v-if="pickable(row)" type="button" class="th-btn th-btn-ghost th-btn-sm" @click="pick(row.id)">{{ row.name }}</button><template v-else>{{ row.name }}</template></template>
              <template v-else>{{ colVal(row, column.key) }}</template>
            </template>
          </th-data-table>
          <div class="p-campsite-legend">
            <span class="p-campsite-legend-hint">{{ summaryHint }}</span>
          </div>
        </div>
      </section>

      <form class="bulletin-card" @submit.prevent="submit">
        <div class="bulletin-filter-row">
          <span class="bulletin-filter-label"><i :class="selectIcon"></i>{{ selectLabel }}</span>
          <select class="th-select p-campsite-select" :value="draftNode"
                  @change="draftNode = $event.target.value" :aria-label="selectLabel">
            <option v-for="n in nodes" :key="n.id" :value="n.id">{{ n.name }}</option>
          </select>
          <button type="submit" class="th-btn th-btn-primary">
            <i class="fa-solid fa-magnifying-glass"></i>查詢
          </button>
        </div>
      </form>

      <div class="bulletin-section-head">
        <h2 class="th-section-title">{{ calTitle }}</h2>
        <span class="bulletin-count">{{ node.name }}／共 <strong>{{ node.days.length }}</strong> 天</span>
      </div>

      <p-campsite-month-bar :ym="ym"></p-campsite-month-bar>
      <p-campsite-snapshot-note :snapshot="snapshot" :ym="ym"></p-campsite-snapshot-note>

      <p-campsite-bed-calendar :site="node" :week-head="weekHead" @pick="day = $event"></p-campsite-bed-calendar>
      <p-campsite-cal-legend :site="node"></p-campsite-cal-legend>

      <p-campsite-day-modal v-if="day" :site="node" :day="day" @close="day = null"
                            :snapshot="snapshot" :detail-page="detailPage" :org-id="orgId"
                            :id-param="idParam"></p-campsite-day-modal>
  `,
};

/*
  林業署月曆。與 p-campsite-bed-calendar 分開寫，因為：
  一、沒有「餘額」概念，0 不等於額滿，不能套 remainFlag 的紅／綠語意；
  二、計數項目每日不一致（「剩餘數量」非每日都有）。
*/
const pCampsiteForestryCalendar = {
  props: {
    site: { type: Object, required: true },
    weekHead: { type: Array, required: true },
    primaryLabel: { type: String, default: "" },
  },
  emits: ["pick"],
  computed: {
    cells() {
      const byDay = {};
      this.site.days.forEach((d) => { byDay[d.d] = d; });
      const first = this.site.days[0];
      const lead = first ? first.w : 0;
      const last = this.site.days[this.site.days.length - 1];
      const cells = [];
      for (let i = 0; i < lead; i++) cells.push(null);
      for (let d = first ? first.d : 1; d <= (last ? last.d : 0); d++) {
        cells.push(byDay[d] || { d, counts: [], note: "" });
      }
      while (cells.length % 7 !== 0) cells.push(null);
      return cells;
    },
  },
  methods: {
    /* 主要數字由 primaryLabel 指定，找不到該項就退回第一項 */
    mainOf(c) {
      const counts = c.counts || [];
      return counts.find((x) => x.label === this.primaryLabel) || counts[0];
    },
  },
  template: `
    <div class="p-campsite-cal">
      <div class="p-campsite-cal-head">
        <div v-for="w in weekHead" :key="w" class="p-campsite-cal-week">
          <span class="p-campsite-cal-week-full">{{ w }}</span>
          <span class="p-campsite-cal-week-short">{{ w.slice(-1) }}</span>
        </div>
      </div>
      <div class="p-campsite-cal-grid">
        <template v-for="(c, i) in cells" :key="i">
          <div v-if="!c" class="p-campsite-cal-cell is-blank"></div>
          <div v-else-if="!(c.counts || []).length" class="p-campsite-cal-cell is-empty">
            <span class="p-campsite-cal-day">{{ c.d }}</span>
            <!-- 正式站寫「查無資料」就照抄；正式站留空白的日子這裡也留空 -->
            <span v-if="c.note" class="p-campsite-cal-none">{{ c.note }}</span>
          </div>
          <button v-else type="button" class="p-campsite-cal-cell is-open" @click="$emit('pick', c)"
                  :aria-label="(c.sdate || (c.d + ' 日')) + ' ' + mainOf(c).label + ' ' + mainOf(c).value + '，查看該日明細'">
            <span class="p-campsite-cal-day">{{ c.d }}</span>
            <span class="p-campsite-cal-remain">{{ mainOf(c).value }}</span>
            <span class="p-campsite-cal-unit">{{ mainOf(c).label }}</span>
          </button>
        </template>
      </div>
    </div>
  `,
};

/* ── 林業署當日明細彈窗（同樣包一層 th-modal）── */
const pCampsiteForestryDayModal = {
  props: {
    site: { type: Object, required: true },
    day: { type: Object, default: null },
    snapshot: { type: String, default: "" },
    catId: { type: String, default: "" },
  },
  emits: ["close"],
  computed: {
    lotUrl() {
      return this.day.sdate && this.catId
        ? "https://service.skyeyes.tw/hikenationpark/bed_11Detail.aspx?orgCode=" + this.catId +
          "&areaCode=" + this.site.id + "&sdate=" + this.day.sdate
        : "";
    },
  },
  template: `
    <th-modal :meta="site.name" :title="day.sdate || (day.d + ' 日')"
              body-class="p-campsite-daybody" @close="$emit('close')">
      <table class="th-table th-table--zebra p-campsite-daytable">
        <tbody>
          <tr v-for="c in (day.counts || [])" :key="c.label">
            <th scope="row">{{ c.label }}</th>
            <td>{{ c.value }}</td>
          </tr>
        </tbody>
      </table>
      <p class="p-campsite-daynote">本頁為 {{ snapshot }} 擷取之快照，實際數量以線上申請流程查驗結果為準。</p>
      <p v-if="lotUrl" class="p-campsite-daynote">當日抽籤結果：<a class="th-inline-link" :href="lotUrl" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i>查詢抽籤結果</a><span class="th-legacy-tag">前往現行網站</span></p>
      <p class="p-campsite-daynote">該日正式站未提供抽籤結果連結。</p>
    </th-modal>
  `,
};

/*
  正式站 bed_8／bed_9 的表格沒有 thead，表頭是 tbody 第一列。
  這裡把第一列當表頭、其餘當資料；只有一列時不硬拆。
*/
const pCampsitePlainTable = {
  props: {
    table: { type: Object, default: null },
    title: { type: String, default: "" },
    icon: { type: String, default: "" },
    emptyHint: { type: String, default: "" },
    snapshotDate: { type: String, required: true },
  },
  computed: {
    rows() { return (this.table && this.table.rows) || []; },
    hasHeader() { return this.rows.length > 1; },
    head() { return this.hasHeader ? this.rows[0].map((c) => c.t) : []; },
    body() { return this.hasHeader ? this.rows.slice(1) : []; },
    columns() { return this.head.map((h, i) => ({ key: "c" + i, label: h })); },
    bodyRows() { return this.body.map((cells, i) => ({ id: i, cells })); },
    joinFirst() { return this.rows[0] ? this.rows[0].map((c) => c.t).join("／") : "查無資料"; },
  },
  methods: {
    cellOf(row, key) { return row.cells[Number(key.slice(1))] || { t: "" }; },
  },
  template: `
    <section class="th-card">
      <div class="th-card-head">
        <i :class="icon"></i>
        <h2 class="th-card-title">{{ title }}</h2>
        <span v-if="hasHeader" class="th-card-note">共 {{ body.length }} 筆</span>
      </div>
      <div class="th-card-body ">
        <th-callout v-for="(n, i) in ((table && table.notice) || [])" :key="i">{{ n }}</th-callout>
        <th-data-table v-if="hasHeader" :columns="columns" :rows="bodyRows" row-key="id"
                       table-class="th-table--zebra">
          <template #cell="{ row, column }">
            <a v-if="cellOf(row, column.key).link" class="th-inline-link"
               :href="'https://service.skyeyes.tw/hikenationpark/' + cellOf(row, column.key).link.href"
               target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i>{{ cellOf(row, column.key).link.text || cellOf(row, column.key).t }}</a><template v-else>{{ cellOf(row, column.key).t || '—' }}</template>
          </template>
        </th-data-table>
        <!-- 正式站自己就寫「查無資料」，照抄，不編一張假的表 -->
        <th-callout v-else type="warning">正式站目前的內容是「{{ rows[0] ? joinFirst : "查無資料" }}」。<span v-if="emptyHint" class="th-todo-link">{{ emptyHint }}</span></th-callout>
        <div class="p-campsite-legend"><span class="p-campsite-legend-hint">內容為 {{ snapshotDate }} 自現行網站擷取的快照。</span></div>
      </div>
    </section>
  `,
};

/* ── 雪霸「宿營地」子選（正式站 bed_1）── */
const pCampsiteSheipaCamp = {
  /* 預設七卡山莊 */
  data() { return { draftSite: SHEIPA_CAMPSITES[2].id, siteId: SHEIPA_CAMPSITES[2].id, day: null }; },
  computed: {
    sites() { return SHEIPA_CAMPSITES; },
    notice() { return CAMPSITE_NOTICE; },
    snapshot() { return CAMPSITE_SNAPSHOT_DATE; },
    weekHead() { return CAMPSITE_WEEK_HEAD; },
    orgId() { return CAMPSITE_ORG_ID; },
    site() { return SHEIPA_CAMPSITES.find((s) => s.id === this.siteId) || SHEIPA_CAMPSITES[0]; },
    ym() { return this.site.ym || {}; },
  },
  methods: { submit() { this.siteId = this.draftSite; this.day = null; } },
  template: `
      <p-campsite-notice-list :items="notice"></p-campsite-notice-list>

      <form class="bulletin-card" @submit.prevent="submit">
        <div class="bulletin-filter-row">
          <span class="bulletin-filter-label"><i class="fa-solid fa-tent"></i>宿營地點</span>
          <select class="th-select p-campsite-select" :value="draftSite"
                  @change="draftSite = $event.target.value" aria-label="宿營地點">
            <option v-for="s in sites" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
          <button type="submit" class="th-btn th-btn-primary">
            <i class="fa-solid fa-magnifying-glass"></i>查詢
          </button>
        </div>
      </form>

      <div class="bulletin-section-head">
        <h2 class="th-section-title">山屋／營地概況</h2>
        <span class="bulletin-count">{{ site.name }}／共 <strong>{{ site.days.length }}</strong> 天</span>
      </div>

      <p-campsite-month-bar :ym="ym"></p-campsite-month-bar>
      <p-campsite-snapshot-note :snapshot="snapshot" :ym="ym"></p-campsite-snapshot-note>

      <p-campsite-bed-calendar :site="site" :week-head="weekHead" @pick="day = $event"></p-campsite-bed-calendar>
      <p-campsite-cal-legend :site="site"></p-campsite-cal-legend>

      <p-campsite-site-intro :site="site"></p-campsite-site-intro>

      <p-campsite-day-modal v-if="day" :site="site" :day="day" @close="day = null"
                            :snapshot="snapshot" detail-page="bed_1main.aspx"
                            :org-id="orgId"></p-campsite-day-modal>
  `,
};

/* ── 雪霸「路線」子選（正式站 bed_10）── */
/* 首項「自訂登山口」承載量為 0，預設落在雪山登山口 */
const pCampsiteSheipaRoute = {
  computed: { summary() { return SHEIPA_ROUTE_SUMMARY; }, nodes() { return SHEIPA_ROUTE_NODES; }, weekHead() { return SHEIPA_ROUTE_WEEK_HEAD; }, snapshot() { return SHEIPA_ROUTE_SNAPSHOT_DATE; }, orgId() { return SHEIPA_ROUTE_ORG_ID; }, detailPage() { return "bed_10main.aspx"; }, idParam() { return "node_id"; } },
  template: `
    <p-campsite-node-calendar
      :summary="summary" :nodes="nodes" :week-head="weekHead" :snapshot="snapshot"
      :org-id="orgId" :detail-page="detailPage" :id-param="idParam" :default-index="1"
      summary-title="登山口承載量" summary-icon="fa-solid fa-person-hiking" summary-unit="個登山口"
      summary-hint="平日／假日為該登山口每日承載量上限；點登山口名稱可切換下方月曆。"
      select-label="登山口" select-icon="fa-solid fa-person-hiking"
      cal-title="登山口每日餘額"></p-campsite-node-calendar>
  `,
};

/* ── 太魯閣「山屋」子選（正式站 bed_4）── */
const pCampsiteTarokoHut = {
  computed: { summary() { return TAROKO_HUT_SUMMARY; }, nodes() { return TAROKO_HUT_NODES; }, weekHead() { return TAROKO_WEEK_HEAD; }, snapshot() { return TAROKO_SNAPSHOT_DATE; }, orgId() { return TAROKO_ORG_ID; }, detailPage() { return TAROKO_HUT_DETAIL_PAGE; }, idParam() { return TAROKO_HUT_ID_PARAM; } },
  template: `
    <p-campsite-node-calendar
      :summary="summary" :nodes="nodes" :week-head="weekHead" :snapshot="snapshot"
      :org-id="orgId" :detail-page="detailPage" :id-param="idParam"
      summary-title="山屋床位承載量" summary-icon="fa-solid fa-house-chimney" summary-unit="處"
      summary-hint="平日／假日底下的「山屋床位」為正式站表頭原文；點宿營地名稱可切換下方月曆。"
      select-label="宿營地" select-icon="fa-solid fa-house-chimney"
      cal-title="山屋每日餘額"></p-campsite-node-calendar>
  `,
};

/* ── 太魯閣「路線」子選（正式站 bed_5）── */
const pCampsiteTarokoRoute = {
  computed: { summary() { return TAROKO_ROUTE_SUMMARY; }, nodes() { return TAROKO_ROUTE_NODES; }, weekHead() { return TAROKO_WEEK_HEAD; }, snapshot() { return TAROKO_SNAPSHOT_DATE; }, orgId() { return TAROKO_ORG_ID; }, detailPage() { return TAROKO_ROUTE_DETAIL_PAGE; }, idParam() { return TAROKO_ROUTE_ID_PARAM; } },
  template: `
    <p-campsite-node-calendar
      :summary="summary" :nodes="nodes" :week-head="weekHead" :snapshot="snapshot"
      :org-id="orgId" :detail-page="detailPage" :id-param="idParam"
      summary-title="路線承載量" summary-icon="fa-solid fa-route" summary-unit="條路線"
      summary-hint="平日／假日為正式站列出的承載量數值，正式站未加註其定義［待確認］；點路線名稱可切換下方月曆。"
      select-label="路線" select-icon="fa-solid fa-route"
      cal-title="路線每日餘額"></p-campsite-node-calendar>
  `,
};

/* ── 玉山「單日往返路線」子選（正式站 bed_7）── */
const pCampsiteYushanOneday = {
  computed: { summary() { return YUSHAN_ONEDAY_SUMMARY; }, nodes() { return YUSHAN_ONEDAY_NODES; }, weekHead() { return YUSHAN_WEEK_HEAD; }, snapshot() { return YUSHAN_SNAPSHOT_DATE; }, orgId() { return YUSHAN_ORG_ID; }, detailPage() { return YUSHAN_ONEDAY_DETAIL_PAGE; }, idParam() { return YUSHAN_ONEDAY_ID_PARAM; } },
  template: `
    <p-campsite-node-calendar
      :summary="summary" :nodes="nodes" :week-head="weekHead" :snapshot="snapshot"
      :org-id="orgId" :detail-page="detailPage" :id-param="idParam"
      summary-title="單日往返路線承載量" summary-icon="fa-solid fa-route" summary-unit="條路線"
      summary-hint="平日／假日承載量為正式站表頭原文（單位：人）；點路線名稱可切換下方月曆。"
      select-label="路線" select-icon="fa-solid fa-route"
      cal-title="路線每日餘額"></p-campsite-node-calendar>
  `,
};

/* ── 玉山「宿營地」子選（正式站 bed_6）── */
const pCampsiteYushanCampInner = {
  computed: { summary() { return YUSHAN_CAMP_SUMMARY; }, nodes() { return YUSHAN_CAMP_NODES; }, weekHead() { return YUSHAN_WEEK_HEAD; }, snapshot() { return YUSHAN_SNAPSHOT_DATE; }, orgId() { return YUSHAN_ORG_ID; }, detailPage() { return YUSHAN_CAMP_DETAIL_PAGE; }, idParam() { return YUSHAN_CAMP_ID_PARAM; } },
  template: `
    <p-campsite-node-calendar
      :summary="summary" :nodes="nodes" :week-head="weekHead" :snapshot="snapshot"
      :org-id="orgId" :detail-page="detailPage" :id-param="idParam"
      summary-title="宿營地承載量" summary-icon="fa-solid fa-tent" summary-unit="處"
      summary-hint="平日／假日承載量各分「山屋床位」與「營地營位」兩欄，為正式站表頭原文；點宿營地名稱可切換下方月曆。"
      select-label="宿營地" select-icon="fa-solid fa-tent"
      cal-title="宿營地每日餘額"></p-campsite-node-calendar>
  `,
};
const pCampsiteYushanCamp = {
  computed: { notice() { return YUSHAN_CAMP_NOTICE; } },
  template: `
      <th-callout>
        <ul class="p-campsite-notice">
          <li v-for="(t, i) in notice" :key="i">{{ t }}</li>
        </ul>
      </th-callout>
      <p-campsite-yushan-camp-inner></p-campsite-yushan-camp-inner>
  `,
};

/* ── 林業署「宿營地」子選（正式站 bed_0）── */
const pCampsiteForestryCamp = {
  data() {
    return { draftSite: FORESTRY_CAMP_SITES[0].id, siteId: FORESTRY_CAMP_SITES[0].id, day: null };
  },
  computed: {
    sites() { return FORESTRY_CAMP_SITES; },
    weekHead() { return FORESTRY_WEEK_HEAD; },
    snapshot() { return FORESTRY_SNAPSHOT_DATE; },
    site() { return FORESTRY_CAMP_SITES.find((s) => s.id === this.siteId) || FORESTRY_CAMP_SITES[0]; },
    ym() { return this.site.ym || {}; },
    withData() { return this.site.days.filter((d) => (d.counts || []).length).length; },
  },
  methods: { submit() { this.siteId = this.draftSite; this.day = null; } },
  template: `
      <!--
        正式站現況：四個宿營地 × 9-12 月，每一格都是「查無資料」。
        依 2026-09-07 使用者裁決照實呈現空月曆，並在上方明說，不假造數字。
      -->
      <th-callout type="warning">正式站的林業及自然保育署宿營地查詢<strong>目前沒有任何可用資料</strong>——
2026-09-07 實測 {{ sites.length }} 個宿營地、9 至 12 月，每一天都顯示「查無資料」，
既無承載量也無當日明細。下方月曆照實呈現該現況。<span class="th-todo-link">［待確認］正式站為何長期無資料，需向機關確認；
待機關上架後重抓快照。</span></th-callout>

      <form class="bulletin-card" @submit.prevent="submit">
        <div class="bulletin-filter-row">
          <span class="bulletin-filter-label"><i class="fa-solid fa-tent"></i>宿營地</span>
          <select class="th-select p-campsite-select" :value="draftSite"
                  @change="draftSite = $event.target.value" aria-label="宿營地">
            <option v-for="s in sites" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
          <button type="submit" class="th-btn th-btn-primary">
            <i class="fa-solid fa-magnifying-glass"></i>查詢
          </button>
        </div>
      </form>

      <div class="bulletin-section-head">
        <h2 class="th-section-title">宿營地每日狀況</h2>
        <span class="bulletin-count">{{ site.name }}／共 <strong>{{ site.days.length }}</strong> 天，其中有資料 <strong>{{ withData }}</strong> 天</span>
      </div>

      <p-campsite-month-bar :ym="ym"></p-campsite-month-bar>

      <p-campsite-forestry-calendar :site="site" :week-head="weekHead"
                                    primary-label="現在申請量" @pick="day = $event"></p-campsite-forestry-calendar>

      <p-campsite-forestry-day-modal v-if="day" :site="site" :day="day" @close="day = null"
                                     :snapshot="snapshot" cat-id=""></p-campsite-forestry-day-modal>
  `,
};

/*
  ── 林業署「區域申請及抽籤」子選（正式站 bed_11）──
  兩層下拉照正式站保留：區域類別 → 區域名稱。不得壓平成一層。
*/
const pCampsiteForestryArea = {
  data() {
    /*
      預設落在第一個查得到月曆的區域——第一類別的第一項「插天山自然保留區」
      在正式站是總項、按查詢不出月曆，拿它當預設會讓人以為頁面壞了。
    */
    const firstArea = FORESTRY_AREA_CATS[0].areas.find((a) => a.hasCalendar) || FORESTRY_AREA_CATS[0].areas[0];
    return {
      draftCat: FORESTRY_AREA_CATS[0].id,
      draftArea: firstArea.id,
      picked: { cat: FORESTRY_AREA_CATS[0].id, area: firstArea.id },
      day: null,
    };
  },
  computed: {
    cats() { return FORESTRY_AREA_CATS; },
    weekHead() { return FORESTRY_WEEK_HEAD; },
    snapshot() { return FORESTRY_SNAPSHOT_DATE; },
    draftCatObj() { return FORESTRY_AREA_CATS.find((c) => c.id === this.draftCat) || FORESTRY_AREA_CATS[0]; },
    cat() { return FORESTRY_AREA_CATS.find((c) => c.id === this.picked.cat) || FORESTRY_AREA_CATS[0]; },
    area() { return this.cat.areas.find((a) => a.id === this.picked.area) || this.cat.areas[0]; },
    ym() { return this.area.ym || {}; },
  },
  methods: {
    /* 換第一層要跟著換第二層的預設值，否則會留著上一個類別的區域 */
    pickCat(id) {
      const next = FORESTRY_AREA_CATS.find((c) => c.id === id);
      this.draftCat = id;
      this.draftArea = next && next.areas[0] ? next.areas[0].id : "";
    },
    submit() { this.picked = { cat: this.draftCat, area: this.draftArea }; this.day = null; },
  },
  template: `
      <form class="bulletin-card" @submit.prevent="submit">
        <div class="bulletin-filter-row">
          <span class="bulletin-filter-label"><i class="fa-solid fa-layer-group"></i>區域類別</span>
          <select class="th-select p-campsite-select" :value="draftCat"
                  @change="pickCat($event.target.value)" aria-label="區域類別">
            <option v-for="c in cats" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
          <span class="bulletin-filter-label"><i class="fa-solid fa-mountain"></i>區域名稱</span>
          <select class="th-select p-campsite-select" :value="draftArea"
                  @change="draftArea = $event.target.value" aria-label="區域名稱">
            <option v-for="a in draftCatObj.areas" :key="a.id" :value="a.id">{{ a.name }}</option>
          </select>
          <button type="submit" class="th-btn th-btn-primary">
            <i class="fa-solid fa-magnifying-glass"></i>查詢
          </button>
        </div>
      </form>

      <div class="bulletin-section-head">
        <h2 class="th-section-title">區域每日申請量</h2>
        <span class="bulletin-count">{{ cat.name }}／{{ area.name }}<template v-if="area.hasCalendar">／共 <strong>{{ area.days.length }}</strong> 天</template></span>
      </div>

      <template v-if="area.hasCalendar">
        <p-campsite-month-bar :ym="ym"></p-campsite-month-bar>
        <p-campsite-snapshot-note :snapshot="snapshot" :ym="ym" metric="申請量"></p-campsite-snapshot-note>
        <p-campsite-forestry-calendar :site="area" :week-head="weekHead"
                                      primary-label="現在申請量" @pick="day = $event"></p-campsite-forestry-calendar>
        <div class="p-campsite-legend">
          <span class="p-campsite-legend-hint">數字為該日「現在申請量」；有申請量的日期另有「剩餘數量」，
點日期可看全部計數與抽籤結果連結。</span>
        </div>
      </template>
      <!-- 正式站按查詢後不出月曆，重試三次確認過；不編造空月曆冒充有查到 -->
      <th-callout v-else type="warning">正式站對「{{ area.name }}」按查詢後<strong>不會出現月曆</strong>（2026-09-07 實測三次皆然）。<template v-if="area.name === '插天山自然保留區'">該項在正式站是總項，實際可查的是其下三條路線
（福巴越嶺步道／北插天山步道及其支線／其他路線），請於上方「區域名稱」改選。</template><span class="th-todo-link">［待確認］此為停用、無開放申請或其他原因，正式站未說明。</span></th-callout>

      <p-campsite-forestry-day-modal v-if="day" :site="area" :day="day" @close="day = null"
                                     :snapshot="snapshot" :cat-id="cat.id"></p-campsite-forestry-day-modal>
  `,
};

/*
  ── 玉山「抽籤結果」子選（正式站 bed_3）──
  這是公告列表不是名單表：選宿營地後列出該地的抽籤結果公告（標題／發布單位）。
*/
const pCampsiteYushanLot = {
  data() { return { draft: YUSHAN_LOT_NODES[0].id, nodeId: YUSHAN_LOT_NODES[0].id }; },
  computed: {
    nodes() { return YUSHAN_LOT_NODES; },
    snapshotDate() { return YUSHAN_SNAPSHOT_DATE; },
    node() { return YUSHAN_LOT_NODES.find((n) => n.id === this.nodeId) || YUSHAN_LOT_NODES[0]; },
    /* 表頭取自正式站實抓，不寫死 */
    columns() {
      const head = this.node.head.length ? this.node.head : ['標題', '發布單位'];
      return head.map((h, i) => ({ key: "c" + i, label: h }));
    },
    rows() { return this.node.rows.map((cells, i) => ({ id: this.node.id + "-" + i, cells })); },
  },
  methods: {
    submit() { this.nodeId = this.draft; },
    cellOf(row, key) { return row.cells[Number(key.slice(1))] || { t: "" }; },
  },
  template: `
      <form class="bulletin-card" @submit.prevent="submit">
        <div class="bulletin-filter-row">
          <span class="bulletin-filter-label"><i class="fa-solid fa-tent"></i>宿營地</span>
          <select class="th-select p-campsite-select" :value="draft"
                  @change="draft = $event.target.value" aria-label="宿營地">
            <option v-for="n in nodes" :key="n.id" :value="n.id">{{ n.name }}</option>
          </select>
          <button type="submit" class="th-btn th-btn-primary">
            <i class="fa-solid fa-magnifying-glass"></i>查詢
          </button>
        </div>
      </form>

      <div class="bulletin-section-head">
        <h2 class="th-section-title">抽籤結果公告</h2>
        <span class="bulletin-count">{{ node.name }}／共 <strong>{{ rows.length }}</strong> 則</span>
      </div>

      <th-data-table :columns="columns" :rows="rows" row-key="id" table-class="th-table--zebra"
                     empty="正式站此宿營地目前沒有抽籤結果公告">
        <template #cell="{ row, column }">
          <a v-if="cellOf(row, column.key).link" class="th-inline-link"
             :href="'https://service.skyeyes.tw/hikenationpark/' + cellOf(row, column.key).link.href"
             target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i>{{ cellOf(row, column.key).link.text || cellOf(row, column.key).t }}</a><template v-else>{{ cellOf(row, column.key).t || '—' }}</template>
        </template>
      </th-data-table>
      <div class="p-campsite-legend">
        <span class="p-campsite-legend-hint">公告內容為 {{ snapshotDate }} 自現行網站擷取的快照；公告詳細內容尚未建置，連結前往現行網站。</span>
      </div>
  `,
};

/* ── 玉山「抽籤日期」子選（正式站 bed_8）── */
const pCampsiteYushanLotdate = {
  computed: {
    table() { return YUSHAN_LOTDATE_TABLE; },
    snapshotDate() { return YUSHAN_SNAPSHOT_DATE; },
  },
  template: `
    <p-campsite-plain-table :table="table" title="抽籤日期" icon="fa-solid fa-calendar-days"
                            :snapshot-date="snapshotDate"></p-campsite-plain-table>
  `,
};

/* ── 玉山「可申請退費日期」子選（正式站 bed_9）── */
const pCampsiteYushanRefund = {
  computed: {
    table() { return YUSHAN_REFUND_TABLE; },
    snapshotDate() { return YUSHAN_SNAPSHOT_DATE; },
  },
  template: `
      <p-campsite-plain-table :table="table" title="可申請退費日期" icon="fa-solid fa-money-bill-transfer"
                              :snapshot-date="snapshotDate"
                              empty-hint="［待確認］派工卡記載的欄位（未入園可退費期間／宿營地／退費原因／原因／相關訊息）在本次快照未出現，需確認是暫時無資料還是頁面已改版。"></p-campsite-plain-table>
      <div class="p-campsite-legend">
        <span class="p-campsite-legend-hint">退費申請與繳費紀錄請至繳費與退費查詢（正式站 apply_4）：</span>
        <th-todo-link label="繳費與退費查詢"></th-todo-link>
      </div>
  `,
};

/*
  子選 → 元件名。key 是「機關:類別」，對應正式站各張 bed_* 子頁。
  trail 是麵包屑末節，比照正式站 site_map.aspx 的頁名。
*/
const CAMPSITE_VIEWS = {
  "shei-pa:camp":  { view: "p-campsite-sheipa-camp",   trail: "雪霸宿營地查詢" },
  "shei-pa:route": { view: "p-campsite-sheipa-route",  trail: "雪霸路線登山口查詢" },
  "taroko:hut":    { view: "p-campsite-taroko-hut",    trail: "太魯閣山屋查詢" },
  "taroko:route":  { view: "p-campsite-taroko-route",  trail: "太魯閣路線查詢" },
  "forestry:camp": { view: "p-campsite-forestry-camp", trail: "林業及自然保育署宿營地查詢" },
  "forestry:area": { view: "p-campsite-forestry-area", trail: "林業及自然保育署區域申請及抽籤查詢" },
  "yushan:camp":   { view: "p-campsite-yushan-camp",    trail: "玉山宿營地查詢" },
  "yushan:oneday": { view: "p-campsite-yushan-oneday",  trail: "玉山單日往返路線查詢" },
  "yushan:lot":    { view: "p-campsite-yushan-lot",     trail: "玉山抽籤結果查詢" },
  "yushan:lotdate":{ view: "p-campsite-yushan-lotdate", trail: "玉山抽籤日期" },
  "yushan:refund": { view: "p-campsite-yushan-refund",  trail: "玉山可申請退費日期查詢" },
};

const firstKind = (orgKey) => {
  const kinds = CAMPSITE_KINDS[orgKey] || [];
  const hit = kinds.find((k) => k.built) || kinds[0];
  return hit ? hit.key : "";
};

/*
  **區域元件是逐元件註冊，不會從根元件繼承。**
  檢視（p-campsite-sheipa-camp 之類）本身也是區域元件，它們樣板裡用到的共用件
  必須在**自己**的 components 上註冊一次；只註冊在根元件上，子層會解析不到，
  在 DOM 裡留下 <p-campsite-notice-list> 這種未知標籤。
  **而且 vue.global.prod.js 不發 warning**，console 完全乾淨——三重驗收是靠
  「computed 元素數不同」與「像素尺寸不同」抓到的。
  全域註冊（window.thComponents）可以一次解決，但那會把只有一頁用的東西放進
  全站共用層，違反本檔檔頭的界線，所以改成共用一份 map 逐元件掛上去。
*/
const CAMPSITE_PARTS = {
  "p-campsite-notice-list": pCampsiteNoticeList,
  "p-campsite-day-modal": pCampsiteDayModal,
  "p-campsite-forestry-day-modal": pCampsiteForestryDayModal,
  "p-campsite-bed-calendar": pCampsiteBedCalendar,
  "p-campsite-forestry-calendar": pCampsiteForestryCalendar,
  "p-campsite-site-intro": pCampsiteSiteIntro,
  "p-campsite-cal-legend": pCampsiteCalLegend,
  "p-campsite-month-bar": pCampsiteMonthBar,
  "p-campsite-snapshot-note": pCampsiteSnapshotNote,
  "p-campsite-node-calendar": pCampsiteNodeCalendar,
  "p-campsite-plain-table": pCampsitePlainTable,
  "p-campsite-yushan-camp-inner": pCampsiteYushanCampInner,
};

[
  pCampsiteNodeCalendar,
  pCampsiteSheipaCamp, pCampsiteSheipaRoute, pCampsiteTarokoHut, pCampsiteTarokoRoute,
  pCampsiteForestryCamp, pCampsiteForestryArea,
  pCampsiteYushanCamp, pCampsiteYushanCampInner, pCampsiteYushanOneday,
  pCampsiteYushanLot, pCampsiteYushanLotdate, pCampsiteYushanRefund,
].forEach((c) => { c.components = CAMPSITE_PARTS; });

thPage({
  components: {
    ...CAMPSITE_PARTS,
    "p-campsite-sheipa-camp": pCampsiteSheipaCamp,
    "p-campsite-sheipa-route": pCampsiteSheipaRoute,
    "p-campsite-taroko-hut": pCampsiteTarokoHut,
    "p-campsite-taroko-route": pCampsiteTarokoRoute,
    "p-campsite-forestry-camp": pCampsiteForestryCamp,
    "p-campsite-forestry-area": pCampsiteForestryArea,
    "p-campsite-yushan-camp": pCampsiteYushanCamp,
    "p-campsite-yushan-oneday": pCampsiteYushanOneday,
    "p-campsite-yushan-lot": pCampsiteYushanLot,
    "p-campsite-yushan-lotdate": pCampsiteYushanLotdate,
    "p-campsite-yushan-refund": pCampsiteYushanRefund,
  },

  data() { return { org: "shei-pa", kind: "camp" }; },

  computed: {
    orgs() { return CAMPSITE_ORGS; },
    kindList() { return CAMPSITE_KINDS[this.org] || []; },
    current() { return CAMPSITE_VIEWS[this.org + ":" + this.kind] || CAMPSITE_VIEWS["shei-pa:camp"]; },
    /* 切子選時整個重掛，不把前一個子選的下拉／彈窗狀態帶過去（原 React 的 key） */
    viewKey() { return this.org + ":" + this.kind; },
  },

  methods: {
    /* 切機關時，原本的類別多半不存在，落回該機關第一個已建類別 */
    pickOrg(key) { this.org = key; this.kind = firstKind(key); },
  },
});
