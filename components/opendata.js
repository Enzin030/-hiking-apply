/* ============================================================
   opendata.js — 政府網站資料開放宣告資料與初始化
   對應線上站：https://hike.taiwan.gov.tw/OpenData.aspx
   ============================================================ */

const OPENDATA_NAV_ITEMS = [
  { id: "scope", label: "授權方式及範圍" },
  { id: "notes", label: "相關事項說明" },
  { id: "moral-rights", label: "第三人著作人格權" },
  { id: "liability", label: "惡意變更之法律責任" },
  { id: "disclaimer", label: "加值衍生物之地位" },
];

thPage({
  data() {
    return {
      navItems: OPENDATA_NAV_ITEMS,
    };
  },
});
