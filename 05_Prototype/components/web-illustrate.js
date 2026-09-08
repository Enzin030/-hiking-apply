/* ============================================================
   web-illustrate.js — 本站使用說明的頁面資料與初始化（原 WebIllustrate.jsx）
   ------------------------------------------------------------
   版面已搬回 web_illustrate.html；本檔只留 FAQ 資料與 thPage 登記。

   內容來源：舊站 https://service.skyeyes.tw/hikenationpark/web_illustrate.aspx

   [待確認] 舊站本頁附有操作截圖，新版 UI 已改版，截圖待雛形定版後補。

   FAQ 的 links：[{ label, href, todo }]
     href 有值 → 實際導頁；todo: true → 目標頁本雛形尚未建置，標「待建置」且不導頁，
     不給假路徑（不用 `#`）。一題可有多個入口。
   ============================================================ */

const GUIDE_FAQS = [
  {
    q: "想爬的山可以在本站申請嗎？",
    a: "可利用路線查詢功能確認，並用「展開地圖」功能詳細確認範圍。",
    links: [{ label: "前往路線查詢", href: "apply-1.html" }],
  },
  {
    q: "想爬的山目前有開放進入嗎？",
    a: "可用「登山路線開放狀態」查詢。",
    links: [{ label: "登山路線開放狀態", todo: true }],
  },
  {
    q: "想爬的山目前可以申請嗎？",
    a: "首頁右方提供可申請日期試算功能。",
    links: [{ label: "回首頁試算", href: "index.html" }],
  },
  {
    q: "怎麼申請入園？",
    a: "點擊「進入登山申請」按鈕依步驟完成。",
    links: [
      { label: "進入登山申請", href: "apply-1.html" },
      { label: "查看線上申請教學", href: "apply_teach.html" },
    ],
  },
  {
    q: "更多入園規定去哪查？",
    a: "查詢「登山入園須知」頁面。",
    links: [{ label: "前往登山須知", href: "notice.html" }],
  },
  {
    q: "如何判斷登山路線難度？",
    a: "所有申請路線都提供難度等級說明。",
    links: [{ label: "查看國家公園步道分級", href: "information_6.html" }],
  },
  {
    q: "更多登山和住宿申請資訊在哪？",
    a: "查詢「登山入園須知」和「常見問答」。",
    links: [
      { label: "前往登山須知", href: "notice.html" },
      // 帶 ?tab=faq 直接落在公布欄的常見問答頁籤，不停在預設的最新消息
      // （News.jsx 的 getInitialTab 解析此參數，亦接受 ?tab=3）
      { label: "常見問答", href: "news.html?tab=faq" },
    ],
  },
];

thPage({
  data() {
    return { faqs: GUIDE_FAQS };
  },
});
