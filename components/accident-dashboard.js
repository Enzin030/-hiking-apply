/* ============================================================
   accident-dashboard.js — 山域事故統計儀表板（對應正式站 MountainDashboard.aspx）
   ------------------------------------------------------------
   版面在 accident-dashboard.html；資料在 components/AccidentDashboardData.js（快照）。

   **篩選照正式站實測行為**（2026-09-14 使用者裁決：與規格不符處照正式站）：
     分類「山域事故原因分類」    → 次層「事故原因」＋ 年度
     分類「山域事故登山路線分類」→ 次層「管理處」＋ 年度
     分類「申請/實際入園隊伍數及總人數」→ 無次層，只有年度
   變更任一下拉即更新（正式站為 AutoPostBack，無查詢鈕）。

   **圖表以 ECharts 繪製，呈現照正式站的三支 Chart.js 函式**（2026-09-14 使用者裁決，
   取代同日稍早的 HTML 橫條版）：
     原因分類（type A，initOrUpdateChart）  橫軸三個管理處、每個原因一個數列（分組長條），
                                             圖例在下方、可點擊隱藏數列，y 軸標題「案件數」
     路線分類（type B，initOrUpdateChart3） 以管理處為圖標題，橫軸各登山路線（標籤斜 45°），
                                             每根長條依序取色、無圖例，y 軸標題「案件數」
     申請隊伍數（type C，initOrUpdateChart2）同 A，數列為申請人數／申請隊伍數，y 軸標題「數量」
   色值取自 tokens.css 的 --chart-cat-*（正式站原色），這裡不寫 hex。

   ECharts 的 aria 開啟並改用自訂繁中描述（預設描述是簡體且數值夾序號）；
   另附資料表（正式站沒有，無障礙補償）。
   ============================================================ */

const DASH = window.ACCIDENT_DASHBOARD;

const DASH_CATEGORIES = [
  { key: "reason",          label: "山域事故原因分類" },
  { key: "climbline",       label: "山域事故登山路線分類" },
  { key: "applylistNumber", label: "申請/實際入園隊伍數及總人數" },
];

/* 正式站各分類取色的方式（色格序號，1 起算） */
const DASH_APPLY_COLOR_SLOTS = [1, 9];
const DASH_CAT_COUNT = 15;

function dashCssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
function dashPalette() {
  const out = [];
  for (let i = 1; i <= DASH_CAT_COUNT; i++) out.push(dashCssVar("--chart-cat-" + i));
  return out;
}

thPage({
  data() {
    return {
      categories: DASH_CATEGORIES,
      years: DASH.years,
      reasons: DASH.reasons,
      parks: DASH.parks,
      category: "reason",
      reason: "",
      org: DASH.parks[0],
      year: "",
    };
  },

  computed: {
    categoryLabel() {
      var self = this;
      return this.categories.find(function (c) { return c.key === self.category; }).label;
    },

    /* 「分類｜次層｜年度」：畫面上不顯示（2026-09-14 拿掉），只用於圖表 aria 描述 */
    chartTitle() {
      var parts = [this.categoryLabel];
      if (this.category === "reason") parts.push(this.reason || "全部原因");
      if (this.category === "climbline") parts.push(this.org);
      parts.push(this.year ? this.year + " 年" : "全部年度");
      return parts.join("｜");
    },

    /* 目前篩選對應的快照；路線分類查無資料時為 null */
    current() {
      if (this.category === "reason") return DASH.reason[this.reason][this.year];
      if (this.category === "climbline") return DASH.climbline[this.org][this.year];
      return DASH.applylistNumber[this.year];
    },

    isEmpty() { return !this.current; },

    tableColumns() {
      if (this.category === "climbline") {
        return [{ key: "label", label: "登山路線" }, { key: "value", label: "案件數", align: "right" }];
      }
      var d = this.current, unit = this.category === "reason" ? "（件）" : "";
      return [{ key: "label", label: this.category === "reason" ? "事故原因" : "項目" }].concat(
        d.parks.map(function (p) { return { key: p.name, label: p.name + unit, align: "right" }; }));
    },

    tableRows() {
      var d = this.current, fmt = this.fmt;
      if (!d) return [];
      if (this.category === "climbline") {
        return d.labels.map(function (l, i) { return { label: l, value: fmt(d.values[i]) }; });
      }
      return d.labels.map(function (l, i) {
        var row = { label: l };
        d.parks.forEach(function (p) { row[p.name] = fmt(p.values[i]); });
        return row;
      });
    },
  },

  watch: {
    category() { this.render(); },
    reason() { this.render(); },
    org() { this.render(); },
    year() { this.render(); },
  },

  methods: {
    fmt(n) { return Number(n).toLocaleString("zh-TW"); },

    onCategory(key) {
      this.category = key;
      this.reason = "";
      this.org = this.parks[0];
    },

    /* ECharts 預設的 aria 描述是簡體中文，且會把序號混進數值（「太魯閣的数据是0，57」），
       會誤導螢幕閱讀器使用者；改為自訂繁中描述，數字交給下方資料表。 */
    ariaOption() {
      return { enabled: true, label: { description: "長條圖：" + this.chartTitle + "。各項數字請展開下方「檢視資料表」。" } };
    },

    /* 分組長條（type A／C）：橫軸管理處、每個 label 一個數列 */
    groupedOption(d, colors, yName) {
      var ink = dashCssVar("--fg-2"), grid = dashCssVar("--chart-grid");
      return {
        aria: this.ariaOption(),
        color: colors,
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        legend: { bottom: 0, itemGap: 20, textStyle: { fontSize: 12, color: ink } },
        grid: { left: 56, right: 16, top: 24, bottom: 72, containLabel: true },
        xAxis: {
          type: "category",
          data: d.parks.map(function (p) { return p.name; }),
          axisTick: { show: false },
          axisLabel: { fontSize: 14, fontWeight: "bold", color: ink },
        },
        yAxis: {
          type: "value", name: yName, nameLocation: "middle", nameGap: 48, nameTextStyle: { fontSize: 14, color: ink },
          axisLabel: { color: ink }, splitLine: { lineStyle: { color: grid } },
        },
        series: d.labels.map(function (label, i) {
          return {
            name: label, type: "bar", barGap: "5%", barCategoryGap: "10%",
            itemStyle: { borderRadius: [2, 2, 0, 0] },
            data: d.parks.map(function (p) { return p.values[i]; }),
          };
        }),
      };
    },

    /* 單一管理處的路線長條（type B）：每根長條依序取色、無圖例、標籤斜 45° */
    routeOption(d, colors) {
      var ink = dashCssVar("--fg-2"), grid = dashCssVar("--chart-grid"), title = dashCssVar("--fg-1");
      return {
        aria: this.ariaOption(),
        title: { text: this.org, left: "center", textStyle: { fontSize: 18, fontWeight: "bold", color: title } },
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        grid: { left: 56, right: 16, top: 56, bottom: 16, containLabel: true },
        xAxis: {
          type: "category", data: d.labels, axisTick: { show: false },
          axisLabel: { rotate: 45, fontSize: 12, color: ink, interval: 0 },
        },
        yAxis: {
          type: "value", name: "案件數", nameLocation: "middle", nameGap: 40, nameTextStyle: { fontSize: 14, color: ink },
          axisLabel: { color: ink }, splitLine: { lineStyle: { color: grid } },
        },
        series: [{
          name: this.org, type: "bar", barCategoryGap: "20%",
          data: d.values.map(function (v, i) {
            return { value: v, itemStyle: { color: colors[i % colors.length], borderRadius: [2, 2, 0, 0] } };
          }),
        }],
      };
    },

    render() {
      var self = this;
      this.$nextTick(function () {
        var el = self.$refs.chart;
        if (!el || !window.echarts) return;
        if (self.isEmpty) { if (self._chart) self._chart.clear(); return; }
        if (!self._chart) self._chart = window.echarts.init(el, null, { renderer: "canvas" });
        var colors = dashPalette(), d = self.current, option;
        if (self.category === "reason") {
          /* 全部原因取前 13 格；單一原因時正式站沿用該原因在 13 格中的原位色 */
          var reasonColors = self.reason ? [colors[DASH.reasons.indexOf(self.reason)]] : colors.slice(0, d.labels.length);
          option = self.groupedOption(d, reasonColors, "案件數");
        } else if (self.category === "climbline") {
          option = self.routeOption(d, colors);
        } else {
          option = self.groupedOption(d, DASH_APPLY_COLOR_SLOTS.map(function (n) { return colors[n - 1]; }), "數量");
        }
        self._chart.setOption(option, true);
        self._chart.resize();
      });
    },
  },

  mounted() {
    var self = this;
    /* 掛載當下 #th-app 仍帶 v-cloak（display:none），量不到寬度，延一個 frame 再畫 */
    requestAnimationFrame(function () { self.render(); });
    this._onResize = function () { if (self._chart) self._chart.resize(); };
    window.addEventListener("resize", this._onResize);
  },

  unmounted() {
    window.removeEventListener("resize", this._onResize);
    if (this._chart) this._chart.dispose();
  },
});
