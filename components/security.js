/* ============================================================
   security.js — 資訊安全政策資料與初始化
   對應線上站：https://hike.taiwan.gov.tw/security.aspx
   ============================================================ */

const SECURITY_NAV_ITEMS = [
  { id: "collection", label: "個人資料之蒐集及運用" },
  { id: "training", label: "權責與教育訓練" },
  { id: "protection", label: "資訊安全作業及保護" },
  { id: "network", label: "網路安全管理" },
  { id: "access", label: "系統存取控制管理" },
];

thPage({
  data() {
    return {
      navItems: SECURITY_NAV_ITEMS,
    };
  },
});
