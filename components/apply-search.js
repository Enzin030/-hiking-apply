/* ============================================================
   apply-search.js — 申請進度查詢/繳費/異動/取消（舊站 applySearch.aspx）
   ------------------------------------------------------------
   **本頁是純入口頁，沒有表單、沒有狀態。**

   2026-09-16 大幅縮減：原本這支還帶著申請進度查詢表單的 serial／nation／sid／vcode／
   submitted、結果表格的 columns 與 DEMO_RESULTS、退費規定的 refundRows，以及把畫面
   捲到同頁表單的 gotoForm()。那些全部屬於 apply_3.aspx，已連同版面搬到
   `apply_3.html` ＋ `components/apply3-progress.js`。

   正式站的 applySearch.aspx 只有一個「請選擇操作方式」區塊與四顆按鈕，
   四顆都是連到別頁的連結。**不要再把下游頁的內容搬回本頁。**
   ============================================================ */

/* 舊站四個操作入口。標題、說明、山屋清單與 legacy 目標於 2026-09-16 以 curl
   實抓 applySearch.aspx 原始 HTML 複核，與本表逐字相同，未作修改。

   cta 是卡片下方那行「前往…」的文字，四張各不相同，逐字取自設計參考圖
   `01_Raw_Input/操作畫面截圖/2026-09-16_11-23-48.png`。
   **該圖只有 386px 寬**，第三、四張的字是放大後判讀的（繳費／辦理），
   若與設計稿不符，改這裡四個字串即可，版型不受影響。

   href 是本雛形對應頁的檔名，**底線版是刻意的**（2026-09-02 裁決「新頁檔名比照舊站
   aspx」）：連字號的 `apply-2.html`／`apply-3.html` 是申請流程的第二、三步，與這裡無關。 */
const SEARCH_ACTIONS = [
  {
    id: "progress",
    cta: "前往查詢",
    title: "申請進度查詢",
    icon: "fa-solid fa-magnifying-glass",
    desc: "入園申請僅查詢、下載許可證；林保署山屋可繳費、異動資料",
    cabins: ["天池山莊", "檜谷山莊／營地", "嘉明湖山屋／營地", "向陽山屋"],
    legacy: "apply_3.aspx",
    href: "apply_3.html",
  },
  {
    id: "modify",
    cta: "前往辦理",
    title: "申請資料異動及取消",
    icon: "fa-solid fa-pen-to-square",
    desc: "入園申請可異動資料",
    cabins: [],
    legacy: "apply_2.aspx",
    href: "apply_2.html",
  },
  {
    id: "pay",
    cta: "前往繳費",
    title: "國家公園線上繳費",
    icon: "fa-solid fa-credit-card",
    desc: "國家公園山屋列印繳費說明及線上繳費",
    cabins: ["排雲山莊", "觀高山屋"],
    legacy: "apply_4.aspx",
    href: "apply_4.html",
  },
  {
    id: "refund",
    cta: "前往辦理",
    title: "國家公園線上退費",
    icon: "fa-solid fa-rotate-left",
    desc: "國家公園山屋退費功能",
    cabins: ["排雲山莊", "觀高山屋"],
    legacy: "apply_5.aspx",
    href: "apply_5.html",
  },
];

thPage({
  data() {
    return {};
  },

  computed: {
    /* 唯讀常數，不進 data()（進 data() 會被遞迴轉成 reactive proxy，白付代價） */
    actions() { return SEARCH_ACTIONS; },
    /* window.* 一律在這裡取，不在模組層（載入先後無保證） */
    applyCrumb() { return window.TH_APPLY_CRUMB; },
  },
});
