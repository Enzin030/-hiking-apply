/* ============================================================
   apply1.js — 登山線上申請（路線選擇）的狀態、區域元件與初始化
   原 Apply1.jsx（359 行）。版面已搬回 apply-1.html。
   ============================================================

   ------------------------------------------------------------
   useState / useMemo → Vue 的逐一對應（不批次轉，逐項確認過）
   ------------------------------------------------------------
   | 原 React                                    | Vue                        | 備註 |
   |---------------------------------------------|----------------------------|------|
   | useState("")      search／setSearch         | data.search                | 搜尋字串 |
   | useState("all")   agency／setAgency         | data.agency                | 管理機關膠囊 |
   | useState("all")   days／setDays             | data.days                  | 行程天數膠囊 |
   | useState("all")   diff／setDiff             | data.diff                  | 難度等級（可再按一次取消） |
   | useState(false)   hotOnly／setHotOnly       | data.hotOnly               | 開關 |
   | useState(false)   openOnly／setOpenOnly     | data.openOnly              | 開關 |
   | useState("default") sort／setSort           | data.sort                  | 排序下拉 |
   | useState(null)    suspendedRoute            | data.suspendedRoute        | null＝不開 modal |
   | useMemo filtered  [7 個 deps]               | computed.filtered          | 依賴由 Vue 自動追蹤 |
   | useMemo grouped   [filtered]                | computed.grouped           | 串接前一個 computed |
   | reset()                                     | methods.reset()            | 一次清六項 |
   | totalActive（每次 render 重算）              | computed.totalActive       | React 沒包 useMemo，Vue 包成 computed 是等價的（純函式） |
   | 區域元件 SuspendedModal                      | components 的 p-apply1-suspend-modal | 只有這頁用 |
   | 區域元件 RouteCard                           | components 的 p-apply1-route-card    | 只有這頁用 |

   ------------------------------------------------------------
   兩處語意差異，已逐一確認不影響行為
   ------------------------------------------------------------
   一、**批次更新的時序**。React 的 reset() 連續呼叫六個 setter，18 之後會批次成
       一次 re-render；Vue 是同步改六個 data 屬性，DOM 更新排到 nextTick，
       同樣只重繪一次。**兩者都不會出現「改到第三個時畫面已用新舊混合值算過一輪」**，
       因為 filtered／grouped 是 computed，只在讀取時求值，不是在每次 set 時求值。
       唯一會看出差別的寫法是「set 完立刻讀 DOM」，本頁沒有這種程式碼。

   二、**filtered 內對陣列做 sort()**。原碼是 ROUTE_DATA.slice() 之後才 sort，
       改寫時保留 slice()，**不可省**——少了它會就地排序 window.ROUTE_DATA，
       污染全域資料（React 版當初也是靠 slice 避開）。

   ------------------------------------------------------------
   ROUTE_DATA／AGENCIES／AGENCY_DESC 刻意不放進 data()
   ------------------------------------------------------------
   放進 data() 會被 Vue 深度轉成 reactive proxy——ROUTE_DATA 是 112KB、數百個
   路線物件，包 proxy 既浪費也讓物件識別改變（RouteCard 的 :key 與 v-for 比對）。
   改用 computed 回傳原陣列：computed 的回傳值不會被再包一層 reactive，
   而這三份資料在頁面生命週期內是唯讀的，不需要響應式。
   ============================================================ */

// unit → 下一步目的地
const buildApplyQuery = route => {
  const q = new URLSearchParams();
  q.set("unit", route.unit || "");
  q.set("route", route.id || "");
  if (route.orgId) q.set("orgId", route.orgId);
  if (route.cId) q.set("cid", route.cId);
  if (route.fId) q.set("fid", route.fId);
  if (route.sourceGuid) q.set("source_guid", route.sourceGuid);
  if (route.campId) q.set("camp_id", route.campId);
  if (route.parkForm) q.set("park", route.parkForm);
  return q.toString();
};

const UNIT_NEXT = {
  "yushan":         r => `apply-2.html?${buildApplyQuery(r)}`,
  "shei-pa":        r => `apply-2.html?${buildApplyQuery(r)}`,
  "taroko":         r => `apply-2.html?${buildApplyQuery(r)}`,
  "forestry-camp":  null,   // 待開發：顯示提示
  "forestry-area":  r => `apply-2.html?${buildApplyQuery(r)}`,
  "police":         r => `apply-2.html?${buildApplyQuery(r)}`,
  "suspended":      null,   // 顯示暫停 modal
};

/* ------------------------------------------------------------
   區域元件一：暫停申請的提示 modal（原 SuspendedModal）
   原本整支用 inline style 寫成，§7 禁 inline style，已改為 pages.css 的
   .p-apply1-suspend-* class（外觀不變，見 pages.css 註解）。
   不用 th-modal：它的外殼是 .bulletin-modal（720px、head 有分隔線），
   這支是 440px 的小卡片、頭部是圖示＋兩行字，外觀不同，套用會改變畫面。
   ------------------------------------------------------------ */
var pApply1SuspendModal = {
  props: { route: { type: Object, default: null } },
  emits: ["close"],
  template: `
    <div v-if="route" class="p-apply1-suspend-overlay" @click="$emit('close')">
      <div class="p-apply1-suspend-card" @click.stop>
        <div class="p-apply1-suspend-head">
          <span class="p-apply1-suspend-icon"><i class="fa-solid fa-circle-xmark"></i></span>
          <div>
            <div class="p-apply1-suspend-title">此路線暫停申請</div>
            <div class="p-apply1-suspend-name">{{ route.name }}</div>
          </div>
        </div>
        <p class="p-apply1-suspend-text">{{ route.suspendReason || '此路線目前暫停開放申請，請關注管理處公告以掌握最新開放訊息。' }}</p>
        <button class="p-apply1-suspend-btn" @click="$emit('close')">我知道了</button>
      </div>
    </div>
  `,
};

/* ------------------------------------------------------------
   區域元件二：路線卡（原 RouteCard）
   點擊行為與原碼逐字相同：暫停→開 modal；forestry-camp→轉 forest-camp-1；
   其餘查 UNIT_NEXT 取得目的地。
   ------------------------------------------------------------ */
var pApply1RouteCard = {
  props: { r: { type: Object, required: true } },
  emits: ["suspended"],
  computed: {
    statusInfo() {
      var map = {
        open:    { cls: "s-open",    label: "目前可申請", icon: "fa-solid fa-circle" },
        lottery: { cls: "s-lottery", label: "抽籤期間",   icon: "fa-solid fa-shuffle" },
        closed:  { cls: "s-closed",  label: "暫停申請",   icon: "fa-solid fa-circle-xmark" },
      };
      return map[this.r.status] || map.open;
    },
    isSuspended() { return this.r.status === "closed" || this.r.unit === "suspended"; },
    goLabel() { return this.isSuspended ? "查看原因" : "進入申請"; },
    goIcon() { return this.isSuspended ? "fa-solid fa-info-circle" : "fa-solid fa-arrow-right"; },
    title() { return this.r.displayName || this.r.name; },
    routePath() { return this.r.routePath || this.r.subroute; },
    duration() {
      if (this.r.durationLabel) return this.r.durationLabel;
      return this.r.days === 1 ? "單日往返" : this.r.days + "天" + (this.r.days - 1) + "夜";
    },
    groupIcon() {
      if (this.r.agency === "police") return "ph-bold ph-shield-check";
      if (this.r.agency === "forestry") return "ph-bold ph-tree";
      return "ph-bold ph-mountains";
    },
  },
  methods: {
    handleClick() {
      var unit = this.r.unit || "yushan";
      if (this.r.status === "closed" || unit === "suspended") {
        this.$emit("suspended");
        return;
      }
      if (unit === "forestry-camp") {
        window.location.href = "forest-camp-1.html?route=" + this.r.id;
        return;
      }
      var nextFn = UNIT_NEXT[unit];
      if (nextFn) window.location.href = nextFn(this.r);
    },
  },
  template: `
    <article :class="['p-apply1-route', { 'is-suspended': isSuspended }]" @click="handleClick">
      <div class="p-apply1-route-thumb">
        <img :src="r.image" alt="" />
        <span class="p-apply1-route-diff">第 {{ r.diff }} 級</span>
      </div>
      <div class="p-apply1-route-body">
        <div class="p-apply1-route-title-row">
          <h3 class="p-apply1-route-title">{{ title }}</h3>
          <div class="p-apply1-route-badges">
            <span v-if="r.hot" class="badge-hot"><i class="fa-solid fa-fire"></i>熱門</span>
            <span v-if="r.status === 'lottery'" class="badge-lottery"><i class="fa-solid fa-shuffle"></i>抽籤</span>
            <span v-if="isSuspended" class="badge-closed"><i class="fa-solid fa-circle-xmark"></i>暫停</span>
          </div>
        </div>
        <div class="p-apply1-route-sub">{{ routePath }}</div>
        <div class="p-apply1-route-meta">
          <span><i class="ph-bold ph-map-trifold"></i>{{ r.routeGroup || r.peak }}</span>
          <span><i class="fa-regular fa-clock"></i>{{ duration }}</span>
        </div>
        <div class="p-apply1-route-foot">
          <span :class="['p-apply1-status-pill', statusInfo.cls]">
            <i :class="statusInfo.icon"></i>{{ statusInfo.label }}
          </span>
          <span :class="['p-apply1-route-go', { 'go-muted': isSuspended }]">
            {{ goLabel }}<i :class="goIcon"></i>
          </span>
        </div>
      </div>
    </article>
  `,
};

thPage({
  components: {
    "p-apply1-suspend-modal": pApply1SuspendModal,
    "p-apply1-route-card": pApply1RouteCard,
  },

  data() {
    return {
      search: "",
      agency: "all",
      days: "all",
      diff: "all",
      hotOnly: false,
      openOnly: false,
      sort: "default",
      suspendedRoute: null,
      dayOptions: [
        { v: "all", l: "全部" },
        { v: "1", l: "單日" },
        { v: "2-3", l: "2–3 天" },
        { v: "4+", l: "4 天以上" },
      ],
      diffLevels: [1, 2, 3, 4, 5, 6],
      hotTags: ["玉山主峰", "嘉明湖", "雪山主東", "奇萊南華", "南湖大山"],
    };
  },

  computed: {
    /* 唯讀資料以 computed 取得，避免被包成 reactive proxy（見檔頭） */
    agencies() { return AGENCIES; },
    agencyDesc() { return AGENCY_DESC; },

    /* 原 useMemo filtered，過濾與排序邏輯逐字照搬 */
    filtered() {
      var r = ROUTE_DATA.slice();   // slice 不可省，否則會就地排序全域資料
      var agency = this.agency, days = this.days, diff = this.diff;
      if (agency !== "all") r = r.filter(function (x) { return x.agency === agency; });
      if (days !== "all") {
        r = r.filter(function (x) {
          if (days === "1") return x.days === 1;
          if (days === "2-3") return x.days >= 2 && x.days <= 3;
          if (days === "4+") return x.days >= 4;
          return true;
        });
      }
      if (diff !== "all") r = r.filter(function (x) { return x.diff === Number(diff); });
      if (this.hotOnly) r = r.filter(function (x) { return x.hot; });
      if (this.openOnly) r = r.filter(function (x) { return x.status === "open"; });
      if (this.search.trim()) {
        var q = this.search.trim().toLowerCase();
        r = r.filter(function (x) {
          return x.name.toLowerCase().indexOf(q) >= 0 ||
                 x.subroute.toLowerCase().indexOf(q) >= 0 ||
                 x.peak.toLowerCase().indexOf(q) >= 0 ||
                 x.agencyName.toLowerCase().indexOf(q) >= 0;
        });
      }
      if (this.sort === "diff-asc") r.sort(function (a, b) { return a.diff - b.diff; });
      if (this.sort === "diff-desc") r.sort(function (a, b) { return b.diff - a.diff; });
      if (this.sort === "days-asc") r.sort(function (a, b) { return a.days - b.days; });
      return r;
    },

    /* 原 useMemo grouped：依機關分組，順序固定 */
    grouped() {
      var order = ["yushan", "shei-pa", "taroko", "forestry", "police"];
      var map = {};
      this.filtered.forEach(function (r) {
        if (!map[r.agency]) map[r.agency] = [];
        map[r.agency].push(r);
      });
      return order.filter(function (k) { return map[k]; }).map(function (k) {
        return {
          agency: k,
          name: AGENCIES.find(function (a) { return a.id === k; }).name,
          items: map[k],
        };
      });
    },

    totalActive() {
      return (this.agency !== "all" ? 1 : 0) + (this.days !== "all" ? 1 : 0) +
             (this.diff !== "all" ? 1 : 0) + (this.hotOnly ? 1 : 0) + (this.openOnly ? 1 : 0);
    },
  },

  methods: {
    reset() {
      this.agency = "all";
      this.days = "all";
      this.diff = "all";
      this.hotOnly = false;
      this.openOnly = false;
      this.search = "";
    },
    /* 難度膠囊：再按一次同一級就取消（原碼的三元式照搬） */
    pickDiff(n) {
      this.diff = this.diff === String(n) ? "all" : String(n);
    },
    groupIcon(agency) {
      if (agency === "police") return "ph-bold ph-shield-check";
      if (agency === "forestry") return "ph-bold ph-tree";
      return "ph-bold ph-mountains";
    },
  },
});
