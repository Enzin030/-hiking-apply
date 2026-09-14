/* ============================================================
   sitemap.js — 網站導覽（對應正式站 site_map.aspx）
   ------------------------------------------------------------
   版面在 sitemap.html；本檔只組資料。

   **內容來源（2026-09-14 使用者裁決，不得自行增刪）**
   1. 正式站 site_map.aspx 的 10 組，順序照抄
   2. 另加第 11 組「網站資訊」＝正式站 footer 的 5 項（導覽頁本身漏列）
   名稱照正式站導覽頁寫法（「玉山抽籤日期查詢」「RSS訂閱」、半形「/」）。

   **連結目標以 th-header 的 TH_HEADER_NAV 為準，不在這裡另抄一份**：
   頁首某項建好（url 由 null 改成實際頁）時，本頁自動跟著變成連結，
   不會出現頁首能點、導覽頁卻還標「待建置」的漂移。
   頁首沒有、正式站導覽頁有的項目（EXTRA_ITEMS）才在本檔寫死。

   **刻意不列**
   - 快捷選單：全站浮動元件，不是頁面
   - index-b.html（首頁 B 案未定案）、_stage2-test.html（回歸證據）
   - 流程內／列表內頁面（apply-2/3、forest-camp-1/2、apply_teach、內容頁）：
     正式站導覽頁同樣不列

   [待確認] 以下三項規格有、正式站導覽頁沒有，是否補進導覽待業務端回覆，
   **未回覆前不列入**：
   - 歷史消息（news_0_HIS.aspx，規格 最新消息.md）
   - 線上申請退費（排雲）（apply_5.aspx，規格 線上申請退費(排雲).md）
   - 山域事故統計儀表板（MountainDashboard.aspx，規格 山域事故統計儀表板.md）
   ============================================================ */

/* 頁首沒有、正式站導覽頁有的子項。after＝插在頁首哪一個 key 後面 */
const SITEMAP_EXTRA_ITEMS = {
  apply: [
    { after: "apply_draft", key: "apply_pay", label: "線上繳費/列印繳費說明單", url: null },
  ],
};

const SITEMAP_GROUPS = (function () {
  const nav = window.TH_HEADER_NAV || [];
  const byKey = {};
  nav.forEach(function (n) { byKey[n.key] = n; });

  function children(key) {
    const src = (byKey[key] && byKey[key].children) || [];
    const extras = SITEMAP_EXTRA_ITEMS[key] || [];
    const out = [];
    src.forEach(function (c) {
      out.push({ key: c.key, label: c.label, url: c.url });
      extras.filter(function (e) { return e.after === c.key; }).forEach(function (e) { out.push(e); });
    });
    return out;
  }
  function leaf(key) {
    const n = byKey[key] || {};
    return n.url || null;
  }

  return [
    { key: "sitemap",  label: "網站導覽", url: "sitemap.html", current: true },
    { key: "bulletin", label: "公布欄", children: children("bulletin") },
    { key: "apply",    label: "登山申請", children: children("apply") },
    { key: "notice",   label: "登山須知", url: leaf("notice") },
    { key: "status",   label: "登山路線開放狀態", url: leaf("status") },
    { key: "campsite", label: "宿營地與床位查詢", children: children("campsite") },
    { key: "info",     label: "旅遊登山資訊", children: children("info") },
    /* 頁首沒有此項；雛形已有頁面 */
    { key: "illustrate", label: "本站使用說明", url: "web_illustrate.html" },
    { key: "warning",  label: "警特報", url: "https://www.cwa.gov.tw/V8/C/P/Warning/FIFOWS.html", external: true },
    { key: "rss",      label: "RSS訂閱", url: "rss.html" },
    /* 與 th-footer 同步：常見問答＝公布欄第四頁籤，其餘四項 footer 亦為待建置 */
    { key: "siteinfo", label: "網站資訊", children: [
      { key: "faq",      label: "常見問答", url: "news.html?tab=faq" },
      { key: "contact",  label: "聯絡我們", url: null },
      { key: "privacy",  label: "隱私權宣告", url: null },
      { key: "security", label: "資訊安全政策", url: null },
      { key: "opendata", label: "資料開放宣告", url: null },
    ] },
  ];
})();

thPage({
  data() {
    return {
      groups: SITEMAP_GROUPS,
    };
  },
});
