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
   ROUTE_DATA／AGENCIES 刻意不放進 data()
   ------------------------------------------------------------
   放進 data() 會被 Vue 深度轉成 reactive proxy——ROUTE_DATA 是 112KB、數百個
   路線物件，包 proxy 既浪費也讓物件識別改變（RouteCard 的 :key 與 v-for 比對）。
   改用 computed 回傳原陣列：computed 的回傳值不會被再包一層 reactive，
   而這兩份資料在頁面生命週期內是唯讀的，不需要響應式。

   ------------------------------------------------------------
   2026-09-24 資料改依正式站（RouteData.js 由 scripts/sync-route-data.js 產生）
   ------------------------------------------------------------
   · 機關由 5 類改為正式站的 6 類：林保署拆成 forestry-area（自然保護區域）與
     forestry-camp（自然步道山屋）。grouped() 的 order 沒列到的機關會被**靜默丟掉**，
     新增機關時這裡、AGENCIES、groupIcon、pages.css 的 .tag-<機關> 要一起改。
   · 正式站沒有縮圖、林保署區域與警政署沒有難度與天數，所以路線卡對
     image／diff／days 缺值各有退路（見 RouteCard 的 duration 與 template）。
   · 分組標頭原本附機關說明（AGENCY_DESC），依使用者要求拿掉，資料一併移除。
   ============================================================ */

/* 機關圖示：分組標頭與路線卡縮圖佔位共用 */
const agencyIcon = agency => {
  if (agency === "police") return "fa-solid fa-dove";
  if (agency === "forestry-area") return "ph-bold ph-tree";
  if (agency === "forestry-camp") return "ph-bold ph-house-line";
  return "ph-bold ph-mountains";
};

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
  /* 2026-09-30：原導向國家公園同意書 apply-2。正式站自然保護區域沒有同意書頁，直接進
     apply_forest_area_1.aspx?unit=<機關代碼>&tmpc_id=<cId>&tmpf_id=<fId>（02_Spec/05e） */
  "forestry-area":  r => `apply_forest_area_1.html?${new URLSearchParams({ unit: r.orgId || "", tmpc_id: r.cId || "", tmpf_id: r.fId || "" })}`,
  /* 2026-09-30：原導向國家公園同意書 apply-2（錯的流程）。正式站警政署沒有同意書頁，
     直接進 apply_npa_1.aspx?unit=<機關代碼>（02_Spec/05d） */
  "police":         r => `apply_npa_1.html?unit=${encodeURIComponent(r.orgId || "")}`,
  "suspended":      null,   // 顯示暫停 modal
};

/* 複合申請詢問框（正式站 apply_1.aspx OtherRoute，2026-10-01 讀原始碼）：
   點路線時以 Func=ApplyFixedclimbRelation 查關聯路線，有就問「是否需要同時申請以下入山/山屋/路線?」。
   關聯資料 window.TH_ROUTE_RELATIONS 由 scripts/fetch-route-relations.py 擷取正式站產生；
   2026-10-01 全 98 條只有警政署入山證（157）有關聯（→ 太管處舊南湖大山線 c_id 26，已不在路線清單）。
   選「是」的導向照 OtherRoute：
   - 起點為國家公園：進自己的同意書，camp_id＝所選關聯路線
   - 所選為國家公園（起點為警政署／保護區／山屋）：改進所選路線的同意書，camp_id 警政署為 0、其餘＝所選 c_id
   - 山屋與警政署互選：正式站進 apply_forest_camp_1?hasNpa=1（目前無此關聯資料，雛形未做〔待確認〕）
   選「否」＝走原路線自己的入口（UNIT_NEXT）。 */
var PARK_UNIT_BY_ORG = {
  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12": "taroko",
  "E6DD4652-2D37-4346-8F5D-6E538353E0C2": "shei-pa",
  "C951CDCD-B75A-46B9-8002-8EF952EC95FD": "yushan",
};
var NPA_ORG = "8F7C09DC-AFEB-4708-A7BB-B20DA2A24648";

function compositeUrl(r, o) {
  var org = String(r.orgId || "").toUpperCase();
  var q;
  if (PARK_UNIT_BY_ORG[org]) {
    q = { unit: PARK_UNIT_BY_ORG[org], route: r.id, orgId: org, cid: r.cId, fid: r.fId, camp_id: o.cId, park: PARK_UNIT_BY_ORG[org] };
  } else if (PARK_UNIT_BY_ORG[o.orgId]) {
    q = { unit: PARK_UNIT_BY_ORG[o.orgId], orgId: o.orgId, cid: o.cId, fid: o.fId, camp_id: org === NPA_ORG ? "0" : o.cId, park: PARK_UNIT_BY_ORG[o.orgId] };
  } else {
    return "";
  }
  return "apply-2.html?" + new URLSearchParams(q).toString();
}

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
          <span class="p-apply1-suspend-icon"><i class="fa-solid fa-circle-xmark" aria-hidden="true"></i></span>
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
  emits: ["suspended", "composite"],
  computed: {
    isSuspended() { return this.r.status === "closed" || this.r.unit === "suspended"; },
    goLabel() { return this.isSuspended ? "查看原因" : "進入申請"; },
    goIcon() { return this.isSuspended ? "fa-solid fa-info-circle" : "fa-solid fa-arrow-right"; },
    title() { return this.r.displayName || this.r.name; },
    /* 路線節點；沒有節點時才退回 subroute，且與標題或主路線同字就不重複顯示
       （正式站林保署區域的主路線名＝路線名，不擋掉會同一串字出現三次） */
    routePath() {
      if (this.r.routePath) return this.r.routePath;
      var s = this.r.subroute;
      return s && s !== this.title && s !== this.r.routeGroup ? s : "";
    },
    /* 國家公園的主路線一律顯示，即使與路線名同字（例如大霸線）。
       林保署兩類與警政署不顯示：正式站的主路線名就是路線名本身（使用者 2026-09-24 裁示）。 */
    groupLabel() {
      if (["forestry-area", "forestry-camp", "police"].indexOf(this.r.agency) >= 0) return "";
      return this.r.routeGroup || this.r.peak;
    },
    /* 空字串＝不顯示。林保署區域與警政署沒有天數的概念；國家公園路線缺天數時
       （正式站新出現、既有資料沒有的路線）明講待確認，不猜。 */
    duration() {
      if (this.r.durationLabel) return this.r.durationLabel;
      if (this.r.days) return this.r.days === 1 ? "單日往返" : this.r.days + "天" + (this.r.days - 1) + "夜";
      return ["yushan", "shei-pa", "taroko"].indexOf(this.r.agency) >= 0 ? "" : "";
    },
    groupIcon() { return agencyIcon(this.r.agency); },
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
      /* 有關聯路線就先開複合申請詢問框（正式站 OtherRoute），由頁面決定導向 */
      var rel = (window.TH_ROUTE_RELATIONS || {})[this.r.cId];
      if (rel && rel.options.length) {
        this.$emit("composite", this.r);
        return;
      }
      var nextFn = UNIT_NEXT[unit];
      if (nextFn) window.location.href = nextFn(this.r);
    },
  },
  template: `
    <article :class="['p-apply1-route', { 'is-suspended': isSuspended }]" @click="handleClick">
      <div class="p-apply1-route-thumb">
        <img v-if="r.image" :src="r.image" alt="" />
        <!-- 正式站路線卡沒有縮圖，RouteData 的 image 全是示意（來源見 scripts/sync-route-data.js）；
             image 空值時的機關圖示佔位保留作退路 -->
        <span v-else class="p-apply1-route-thumb-ph"><i :class="groupIcon" aria-hidden="true"></i></span>
        <span v-if="r.diff" class="p-apply1-route-diff">第 {{ r.diff }} 級</span>
      </div>
      <div class="p-apply1-route-body">
        <div class="p-apply1-route-title-row">
          <h3 class="p-apply1-route-title">{{ title }}</h3>
          <div class="p-apply1-route-badges">
            <span v-if="r.hot && !isSuspended" class="badge-hot"><i class="fa-solid fa-fire" aria-hidden="true"></i>熱門</span>
            <span v-if="r.status === 'lottery'" class="badge-lottery"><i class="fa-solid fa-shuffle" aria-hidden="true"></i>抽籤</span>
            <span v-if="isSuspended" class="badge-closed"><i class="fa-solid fa-circle-xmark" aria-hidden="true"></i>暫停申請</span>
          </div>
        </div>
        <div v-if="routePath" class="p-apply1-route-sub">{{ routePath }}</div>
        <div v-if="groupLabel || duration || r.mapUrl" class="p-apply1-route-meta">
          <span v-if="groupLabel"><i class="ph-bold ph-map-trifold" aria-hidden="true"></i>{{ groupLabel }}</span>
          <span v-if="duration"><i class="fa-regular fa-clock" aria-hidden="true"></i>{{ duration }}</span>
          <!-- 正式站卡片的「地圖」鈕（2026-09-24 快照 53／95 條有）。外部連結沿用共用的 th-inline-link
               （底線＋品牌色）；前面放圖示、不放外開圖示（使用者 2026-09-24 裁示）。
               圖示的間距與不加底線由 .th-inline-link i 處理。@click.stop：點地圖不觸發卡片導頁 -->
          <a v-if="r.mapUrl" class="th-inline-link" :href="r.mapUrl" target="_blank" rel="noopener noreferrer"
             title="路線地圖（另開新視窗）" @click.stop><i class="ph-bold ph-image" aria-hidden="true"></i>路線地圖</a>
        </div>
        <!-- 2026-10-05 狀態只標例外、集中在標題列（熱門／抽籤／暫停申請）；底部只放動作（使用者裁示）。
             原底部狀態標籤（目前可申請／抽籤期間／暫停申請）與標題列「暫停」重複，已移除 -->
        <div class="p-apply1-route-foot">
          <span :class="['p-apply1-route-go', { 'go-muted': isSuspended }]">
            {{ goLabel }}<i :class="goIcon" aria-hidden="true"></i>
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
      compositeRoute: null,   // 複合申請詢問框的起點路線；null＝不開
      compositePick: 0,
      dayOptions: [
        { v: "all", l: "全部" },
        { v: "1", l: "單日" },
        { v: "2-3", l: "2–3 天" },
        { v: "4+", l: "4 天以上" },
      ],
      diffLevels: [1, 2, 3, 4, 5, 6],
      /* 每個詞都要查得到路線（2026-09-24 改：原「玉山主峰」「雪山主東」「奇萊南華」
         在正式站路線名中不存在，點下去是空結果） */
      hotTags: ["玉山線", "嘉明湖", "雪山主峰", "奇萊", "南湖大山"],
    };
  },

  computed: {
    /* 唯讀資料以 computed 取得，避免被包成 reactive proxy（見檔頭） */
    agencies() { return AGENCIES; },
    compositeRel() { return this.compositeRoute ? (window.TH_ROUTE_RELATIONS || {})[this.compositeRoute.cId] : null; },
    compositeOpt() { return this.compositeRel ? this.compositeRel.options[this.compositePick] : null; },
    /* 審查單位兩列：所選關聯路線＋起點（message 原文「X的審查單位:Y」拆成名稱與機關） */
    compositeOrgs() {
      var rows = [];
      if (this.compositeOpt) rows.push({ name: this.compositeOpt.name, org: this.compositeOpt.orgName });
      var m = this.compositeRel && /^(.*)的審查單位[:：](.*)$/.exec(this.compositeRel.message || "");
      if (m) rows.push({ name: m[1], org: m[2] });
      return rows;
    },

    /* 原 useMemo filtered，過濾與排序邏輯逐字照搬 */
    filtered() {
      var r = ROUTE_DATA.slice();   // slice 不可省，否則會就地排序全域資料
      var agency = this.agency, days = this.days, diff = this.diff;
      if (agency !== "all") r = r.filter(function (x) { return x.agency === agency; });
      if (days !== "all") {
        r = r.filter(function (x) {
          /* days／dayMax 是申請天數範圍：範圍與選項有交集就列出（例：可申請 1-5 天
             在單日、2–3 天、4 天以上都會出現）。沒有天數的（林保署、警政署）不列。 */
          if (!x.days) return false;
          var lo = x.days, hi = x.dayMax || x.days;
          if (days === "1") return lo <= 1;
          if (days === "2-3") return lo <= 3 && hi >= 2;
          if (days === "4+") return hi >= 4;
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
      /* 天數缺值（天數待確認、林保署區域、警政署）排最後，不當成 0 天排第一 */
      if (this.sort === "days-asc") r.sort(function (a, b) {
        return (a.days == null ? Infinity : a.days) - (b.days == null ? Infinity : b.days);
      });
      return r;
    },

    /* 原 useMemo grouped：依機關分組，順序固定。以正式站列表順序為底，
       林保署山屋與自然保護區域對調、山屋在前（使用者 2026-09-24） */
    grouped() {
      var order = ["taroko", "shei-pa", "yushan", "forestry-camp", "forestry-area", "police"];
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
    groupIcon(agency) { return agencyIcon(agency); },
    /* 複合申請詢問框：SweetAlert，內容維持舊系統（正式站 OtherRoute sweet-alert）的樣式——
       路線選擇下拉、是／否兩行說明、審查單位文字（使用者 2026-10-02：維持舊系統樣式，色系沿用全站）。
       按「是」＝複合申請、「否」＝走原路線入口；按 × 或點外面＝取消，留在列表。 */
    openComposite(r) {
      var self = this;
      this.compositePick = 0;
      this.compositeRoute = r;
      var rel = this.compositeRel;
      if (!rel) return;
      var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
      var currentOrg = function () {
        return (self.compositeOpt && self.compositeOpt.orgName) || "太管處";
      };
      var html =
        '<div>' +
          '<div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 16px;">' +
            '<label for="f-composite">路線選擇</label>' +
            '<select id="f-composite" class="th-select">' +
              rel.options.map(function (o, i) { return '<option value="' + i + '">' + esc(o.name) + "</option>"; }).join("") +
            "</select>" +
          "</div>" +
          '<div style="font-size: var(--fs-md, 16px); line-height: 1.8; text-align: center;">' +
            '<div style="color: var(--national-700); font-weight: 700; margin-bottom: 6px;">是（審查單位：<span id="f-composite-org-yes">' + esc(currentOrg()) + '</span>）：系統將協助進行複合申請</div>' +
            '<div>否（審查單位：警政署）：直接進行該項目申請流程</div>' +
          "</div>" +
        "</div>";
      var fallback = function () {
        if (window.confirm("是否需要同時申請以下入山/山屋/路線?\n是（審查單位：" + currentOrg() + "）：系統將協助進行複合申請\n否（審查單位：警政署）：直接進行該項目申請流程")) self.compositeYes();
        else self.compositeNo();
      };
      if (!window.thSwal || !window.Swal) { fallback(); return; }
      window.thSwal({
        icon: "warning",
        title: "是否需要同時申請以下入山/山屋/路線?",
        html: html,
        width: "38rem",
        showCancelButton: true,
        showCloseButton: true,
        reverseButtons: true,
        confirmButtonText: "是",
        cancelButtonText: "否",
        didOpen: function (el) {
          var sel = el.querySelector("#f-composite");
          if (sel) {
            sel.addEventListener("change", function () {
              self.compositePick = Number(sel.value);
              var orgEl = el.querySelector("#f-composite-org-yes");
              if (orgEl) orgEl.textContent = currentOrg();
            });
          }
        },
      }).then(function (res) {
        if (!res) return;
        if (res.isConfirmed) self.compositeYes();
        else if (res.dismiss === (window.Swal ? window.Swal.DismissReason.cancel : "cancel")) self.compositeNo();
        else self.compositeRoute = null;   // × 或點外面：留在列表
      });
    },
    compositeYes() {
      var url = compositeUrl(this.compositeRoute, this.compositeOpt);
      if (url) window.location.href = url;
      else this.compositeNo();
    },
    compositeNo() {
      var r = this.compositeRoute, nextFn = UNIT_NEXT[r.unit || "yushan"];
      if (nextFn) window.location.href = nextFn(r);
    },
  },
});
