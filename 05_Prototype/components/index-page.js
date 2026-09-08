/* ============================================================
   index-page.js — 首頁的資料與初始化（原 Index.jsx）
   ------------------------------------------------------------
   版面已搬回 index.html；本檔只留三組資料與 thPage 登記。

   首頁 Index — 資訊與申請並重版型（115 改版）
   2026-09-03 版面統一：原是 index.html 內嵌的 <script type="text/babel">，
   同名的舊 components/Index.jsx 沒有任何頁面引用、內容也已過期，一併取代。
   樣式在 styles/shared.css 的「首頁」段；本次遷移另把原 inline style 改為
   assets/css/pages.css 的 .p-home-* class（§7 禁 inline style）。

   首頁刻意保留自己的置中頁首（landing page 版型），不套用 th-header；
   其餘共用件（th-quick-nav、th-footer）走共用。
   ============================================================ */

const MARQUEE_ITEMS = [
  { text: "115年4月1日起至4月19日辦理奇萊稜線新山屋吊掛作業，影響入園申請", href: "#" },
  { text: "雪霸國家公園清明連假期間入園申請注意事項", href: "#" },
  { text: "排雲山莊容宿量調整措施延長辦理通知", href: "#" },
  { text: "颱風期間各國家公園入園申請暫停及退費說明", href: "#" },
];

// 登山教育及路線介紹 — 8 項功能入口
const EDU_FUNCTIONS = [
  { key: "weather",  label: "山區氣象",           icon: "fa-cloud-sun",           href: "#" },
  { key: "pac",      label: "PAC 位置",           icon: "fa-briefcase-medical",   href: "#" },
  { key: "peaks",    label: "百岳位置",           icon: "fa-mountain",            href: "#" },
  { key: "law",      label: "法令資訊",           icon: "fa-scale-balanced",      href: "#" },
  { key: "gear",     label: "登山建議裝備清單",   icon: "fa-list-check",          href: "#" },
  { key: "control",  label: "山坡地經常管制區",   icon: "fa-triangle-exclamation", href: "#" },
  { key: "helipad",  label: "救難直升機停機坪",   icon: "fa-helicopter",          href: "#" },
  { key: "accident", label: "生態保護區事故熱點", icon: "fa-location-crosshairs", href: "#" },
];

// 登山線上申請 — 右區服務入口
const APPLY_LINKS = [
  { key: "apply",     label: "登山申請",         icon: "fa-pen-to-square",   href: "apply-1.html" },
  { key: "datequery", label: "申請日期查詢",     icon: "fa-calendar-check",  href: "#" },
  { key: "violation", label: "違規名單",         icon: "fa-user-xmark",      href: "#" },
  { key: "faq",       label: "常見問題",         icon: "fa-circle-question", href: "#" },
  { key: "status",    label: "登山路線開放狀態", icon: "fa-signs-post",      href: "open.html" },
  { key: "bed",       label: "宿營地及床位查詢", icon: "fa-bed",             href: "forest-camp-1.html" },
  { key: "notice",    label: "登山須知",         icon: "fa-book-open-reader", href: "#" },
  { key: "travel",    label: "旅遊登山資訊",     icon: "fa-compass",         href: "#" },
];

thPage({
  data() {
    return {
      marqueeItems: MARQUEE_ITEMS,
      eduFunctions: EDU_FUNCTIONS,
      applyLinks: APPLY_LINKS,
    };
  },
});
