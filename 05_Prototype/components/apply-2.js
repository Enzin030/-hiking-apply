/* ============================================================
   apply-2.js — 申請須知與同意書
   原 Apply2.jsx（604 行）。版面已搬回 apply-2.html。
   ============================================================

   ------------------------------------------------------------
   兩種模式，由 ?unit 決定，載入後不再切換
   ------------------------------------------------------------
     forestry-area／police → 申請前摘要（原 SummaryPage）
     其餘（yushan／shei-pa／taroko／無 unit）→ 逐條同意書（原 NationalParkConsent）
   原碼是 Page2App 依 unit 回傳兩個不同元件；Vue 這裡是同一個 app 用
   v-if／v-else 分兩個 <div>，兩者的 data-screen-label 與原 JSX 逐字相同。

   ------------------------------------------------------------
   狀態形狀：acked 由 CONSENT_BY_ORG 動態產生
   ------------------------------------------------------------
     形狀   { [條文 id]: 是否已確認 }
     來源   getConsentItems(orgId, unit) 回傳的 sections，鍵是每條的 id，
            初值取 item.defaultChecked ?? (item.selectchk === "1")
     **鍵的數量與名稱隨 orgId 不同**（各機關的同意書條數不一樣），
     所以不能寫死；原碼用 Object.fromEntries，這裡照搬。

     與 forest-camp-2 的 alloc 一樣，鍵在初始化時就全部建好，
     之後只改值不新增鍵，Vue 3 直接賦值即為響應式。

   ------------------------------------------------------------
   useState / useEffect → Vue 的逐一對應（不批次轉）
   ------------------------------------------------------------
   | 原 React                        | Vue                   | 備註 |
   |---------------------------------|-----------------------|------|
   | useState(初值函式) acked         | data.acked            | 見上 |
   | useState(0) activeIndex         | data.activeIndex      | scroll-spy 的目前條款 |
   | ackedCount／total／allAcked      | computed              | 純衍生值 |
   | canSubmit = allAcked            | computed.canSubmit    | |
   | toggleAck                       | methods.toggleAck     | |
   | scrollToSection                 | methods.scrollToSection | |
   | useEffect([sectionIds])         | mounted／unmounted     | 見下 |

   **useEffect 的依賴 [sectionIds] 在本頁等同「只跑一次」**：sections 由
   ?orgId／?unit 推導，頁面生命週期內不會變。所以 Vue 用 mounted 掛監聽、
   unmounted 卸載，語意相同。原碼在掛監聽前先呼叫一次 syncActiveSection()，
   這裡也保留——少了它，進頁面時 activeIndex 會停在 0 而不是實際位置。

   **但那一次首量必須排進 requestAnimationFrame**：mounted 執行時
   #th-app 的 v-cloak 還在、整個 app 是 display:none，量到的 rect 全是 0，
   19 條會全部滿足 top <= 160，activeIndex 反而停在最後一條（實測 18，
   React 是 0）。像素比對抓不到（.is-active 的視覺差異落在捲動範圍外），
   是互動對照才發現的。詳見 assets/app-boot.js 檔頭。

   **原碼有一個未使用的 readingPercent**（`((activeIndex + 1) / total) * 100`），
   整份 JSX 沒有任何地方引用它，未移植。

   ------------------------------------------------------------
   NP_CONSENT 未移植
   ------------------------------------------------------------
   原檔 113–292 行有一份 180 行的 NP_CONSENT，檔內註解自己寫著
   「Deprecated inline prototype copy…Kept temporarily」，且**全檔零引用**
   （實際渲染走 window.CONSENT_BY_ORG）。不把死碼複製到新檔；
   舊的 Apply2.jsx 仍在原地保留，需要時查得到。

   ------------------------------------------------------------
   SummaryPage 的 inline style
   ------------------------------------------------------------
   依 2026-09-09 通則收成 .p-apply2-sum-* 進 pages.css；留在 :style 的只有
   cfg.color、n.warn 的分支、依索引決定的 borderBottom（見 pages.css 該節）。
   ============================================================ */

function getParam(key) {
  return new URLSearchParams(window.location.search).get(key) || "";
}

function getRouteFromQuery() {
  const routeId = getParam("route");
  if (!routeId || typeof ROUTE_DATA === "undefined") return null;
  return ROUTE_DATA.find(r => r.id === routeId) || null;
}

function getParkConfig(unit, routeData) {
  const parkByUnit = window.PARK_BY_UNIT || {};
  const queryOrgId = getParam("orgId") || "";
  const orgMatched = Object.values(parkByUnit).find(p =>
    p.orgId && (
      p.orgId.toLowerCase() === queryOrgId.toLowerCase() ||
      p.orgId.toLowerCase() === String(unit || "").toLowerCase()
    )
  );
  if (orgMatched) return orgMatched;

  const key = routeData?.parkForm || routeData?.unit || unit || "yushan";
  return (window.PARK_BY_UNIT && window.PARK_BY_UNIT[key]) || {
    unit: key,
    orgId: queryOrgId || routeData?.orgId || "",
    parkName: routeData?.agencyName || "國家公園",
    agencyName: routeData?.agencyName || "國家公園管理處",
    color: "var(--national-700)",
    nextPage: "apply-3.html",
  };
}

function getConsentItems(orgId, unit) {
  const byOrg = window.CONSENT_BY_ORG || {};
  const parkByUnit = window.PARK_BY_UNIT || {};
  const fallbackOrgId = parkByUnit[unit]?.orgId;
  const items = byOrg[orgId] || byOrg[fallbackOrgId] || [];

  return items.map((item, index) => ({
    id: item.id,
    label: `條文 ${String(index + 1).padStart(2, "0")}`,
    title: item.title || getConsentTopic(item),
    clauses: [{ html: item.contentHtml || item.name || "" }],
    defaultChecked: item.defaultChecked ?? (item.selectchk === "1"),
    order: item.order || Number(item.ord) || 0,
  }));
}

function getPlainConsentText(item) {
  const div = document.createElement("div");
  div.innerHTML = item.contentHtml || item.name || "";
  return (div.textContent || "")
    .replace(/\s+/g, " ")
    .trim();
}

function getConsentTopic(item) {
  const text = getPlainConsentText(item);
  const compact = text.replace(/\s+/g, "");
  const has = (...words) => words.every(word => compact.includes(word));

  const rules = [
    [() => has("抽籤", "申請期限"), "申請期限與抽籤"],
    [() => has("登山綜合保險") || has("優先審核"), "保險與審查排序"],
    [() => has("外國人", "提前申請") || has("外籍", "提前"), "外籍提前申請"],
    [() => has("07", "23") && has("系統"), "系統受理時段"],
    [() => has("入山許可", "警政署"), "入山許可代辦"],
    [() => has("申請及入園注意事項") || has("申辦規定"), "申辦規定告知"],
    [() => has("颱風警報") || has("森林火災"), "天災停開與許可廢止"],
    [() => has("公開抽籤") && has("暫停"), "宿營地抽籤暫停異動"],
    [() => has("領隊責任"), "領隊責任"],
    [() => has("生態保護"), "生態保護承諾"],
    [() => has("登山安全"), "登山安全承諾"],
    [() => has("個人資料"), "個資使用同意"],
    [() => has("領隊需為成年人") || has("領隊未到"), "領隊資格與入園責任"],
    [() => has("緊急災難") || has("緊急災害"), "緊急應變準備"],
    [() => has("環境維護") || has("環境保護"), "環境維護規範"],
    [() => has("錐麓古道") && has("收費"), "錐麓古道收費與查核"],
    [() => has("錐麓古道") && has("安全宣導影片"), "錐麓古道安全宣導"],
    [() => has("其他路線"), "其他路線申請限制"],
    [() => has("高山症") || has("高海拔"), "高山症風險提醒"],
    [() => has("雪季管制"), "雪季管制"],
    [() => has("多日行程") && has("名額"), "多日行程名額規則"],
    [() => has("學生身分") || has("學校社團"), "學生隊員通報"],
    [() => has("身分證明文件") || has("入園許可證"), "入園證件查核"],
    [() => has("居家隔離") || has("自主健康"), "健康狀況告知"],
    [() => has("傳統領域") || has("原住民族"), "原住民族傳統領域"],
  ];

  const matched = rules.find(([test]) => test());
  if (matched) return matched[1];

  const lead = text.split(/[：:。]/)[0]?.trim();
  if (lead && lead.length <= 18) return lead;
  return "其他申請提醒";
}

function nextUrl(page) {
  const q = new URLSearchParams(window.location.search);
  return `${page}?${q.toString()}`;
}

const SUMMARY_CONFIG = {
  "forestry-area": {
    icon: "ph-bold ph-tree",
    color: "var(--park-forestry)",
    agencyName: "林業及自然保育署",
    title: "自然保護區申請前摘要",
    nextPage: "apply-3.html",
    notices: [
      { icon: "ph-bold ph-map-trifold",      text: "請確認您申請之路線在自然保護區或野生動物保護區範圍內，部分路段需另持有進入許可。" },
      { icon: "ph-bold ph-buildings",        text: "管理機關為林業及自然保育署所屬各林區管理處，申請核准後不得擅自更改路線或日期。" },
      { icon: "ph-bold ph-warning-octagon",  text: "進入保護區請落實無痕山林原則，嚴禁採集動植物或擾動生態。", warn: true },
    ],
  },
  police: {
    icon: "ph-bold ph-shield-check",
    color: "var(--park-police)",
    agencyName: "內政部警政署",
    title: "入山許可申請前確認",
    nextPage: "apply-3.html",
    notices: [
      { icon: "ph-bold ph-identification-card", text: "入山許可（警政署）與入園許可（國家公園）為不同證件，本次申請僅送警政署。" },
      { icon: "ph-bold ph-user-circle",          text: "填寫之個人資料（姓名、身分證字號）將傳送至警政署審核，請確認資料正確。" },
      { icon: "ph-bold ph-clock",               text: "入山許可申請請於入山日 <strong>3 天前</strong>提出，緊急情況請洽各地警察局山地管制站。" },
    ],
  },
};

/* 逐頁參數：全部從查詢字串推導，載入後不變，所以放模組層級而非 data() */
const A2_UNIT = getParam("unit") || "yushan";
const A2_MODE = (A2_UNIT === "forestry-area" || A2_UNIT === "police") ? "summary" : "consent";
const A2_ROUTE = A2_MODE === "summary"
  ? ((typeof ROUTE_DATA !== "undefined") ? ROUTE_DATA.find(r => r.id === getParam("route")) || null : null)
  : getRouteFromQuery();
const A2_PARK = getParkConfig(A2_UNIT, A2_ROUTE);
const A2_ORGID = getParam("orgId") || (A2_ROUTE && A2_ROUTE.orgId) || A2_PARK.orgId || A2_UNIT;
const A2_SECTIONS = A2_MODE === "consent" ? getConsentItems(A2_ORGID, A2_PARK.unit) : [];
const A2_CFG = A2_MODE === "summary"
  ? SUMMARY_CONFIG[A2_UNIT]
  : Object.assign({}, A2_PARK, { orgId: A2_ORGID, sections: A2_SECTIONS });

thPage({
  data() {
    return {
      /* 鍵的數量與名稱隨 orgId 不同，初始化時一次建好（見檔頭） */
      acked: Object.fromEntries(A2_SECTIONS.map(s => [s.id, Boolean(s.defaultChecked)])),
      activeIndex: 0,
    };
  },

  computed: {
    // 唯讀常數，不進 data()
    mode() { return A2_MODE; },
    cfg() { return A2_CFG; },
    sections() { return A2_SECTIONS; },
    routeData() { return A2_ROUTE; },
    applyCrumb() { return window.TH_APPLY_CRUMB; },

    total() { return this.sections.length; },
    ackedCount() { return Object.values(this.acked).filter(Boolean).length; },
    allAcked() { return this.ackedCount === this.total; },
    canSubmit() { return this.allAcked; },
  },

  methods: {
    clauseHtml(s) {
      // 原碼：s.clauses[0]?.html || ""
      return (s.clauses[0] && s.clauses[0].html) || "";
    },

    toggleAck(id) { this.acked[id] = !this.acked[id]; },

    scrollToSection(id) {
      const el = document.getElementById("sec-" + id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
      }
    },

    /* scroll-spy：由上往下掃，最後一個「頂端已捲到 160px 以內」的就是目前條款。
       門檻 160 與「最後一個成立者勝出」都照原碼，不可改成 IntersectionObserver
       ——那會換一套判定語意。 */
    syncActiveSection() {
      let nextIndex = 0;
      this.sections.forEach((section, index) => {
        const el = document.getElementById("sec-" + section.id);
        if (el && el.getBoundingClientRect().top <= 160) {
          nextIndex = index;
        }
      });
      this.activeIndex = nextIndex;
    },

    goApply1() { window.location.href = "apply-1.html"; },
    goNext() { window.location.href = nextUrl(this.cfg.nextPage); },
  },

  mounted() {
    if (this.mode !== "consent") return;
    this._sync = this.syncActiveSection.bind(this);
    window.addEventListener("scroll", this._sync, { passive: true });
    window.addEventListener("resize", this._sync);

    /* **首次量測必須排到下一個 frame，不能直接在 mounted 裡跑。**
       mounted 執行時 #th-app 上的 v-cloak 還沒被移除，整個 app 還是
       display:none，getBoundingClientRect() 全部回 0 —— 19 條條文於是
       全部滿足 top <= 160，activeIndex 會停在最後一條（實測 18）。
       原 React 用 useEffect（在 paint 之後才跑）不會遇到，
       requestAnimationFrame 是最接近的對應。 */
    requestAnimationFrame(() => this.syncActiveSection());
  },

  unmounted() {
    if (!this._sync) return;
    window.removeEventListener("scroll", this._sync);
    window.removeEventListener("resize", this._sync);
  },
});
