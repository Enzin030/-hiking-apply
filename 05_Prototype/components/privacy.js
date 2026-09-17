/* ============================================================
   privacy.js — 隱私權宣告資料與初始化
   對應線上站：https://hike.taiwan.gov.tw/privacy.aspx
   ============================================================ */

const PRIVACY_NAV_ITEMS = [
  { id: "scope", label: "適用範圍" },
  { id: "collection", label: "資料蒐集與使用" },
  { id: "protection", label: "資料保護" },
  { id: "links", label: "對外相關連結" },
  { id: "cookies", label: "Cookie 之使用" },
  { id: "amendment", label: "政策之修正" },
];

thPage({
  data() {
    return {
      navItems: PRIVACY_NAV_ITEMS,
    };
  },
});
