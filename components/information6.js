/* ============================================================
   information6.js — 國家公園步道分級的頁面初始化（原 Information6.jsx）
   ------------------------------------------------------------
   版面已搬回 information_6.html；本檔只留欄位定義與 thPage 登記。

   內容來源：舊站 https://service.skyeyes.tw/hikenationpark/information_6.aspx（逐字）
   ——說明／適合對象／建議裝備／表格後兩則註記皆照原文，僅正規化原始碼中
     「檢查表</a> ，依」多出來的半形空白（ASP.NET 控制項渲染產生，非編輯意圖）。

   TRAIL_LEVELS／KIT_PDF／OFFICIAL_SITE 由 components/TrailLevelData.js 提供
   （與 open.html 共用；2026-09-08 隨本頁遷移一併改為一般 script）。

   欄位只給 key／label／align，**不給 render**：這張表的四欄有三欄要輸出元素
   （等級徽章、說明的 <ol>、建議裝備的連結段落），而 th-data-table 的 render prop
   只收字串。輸出元素要走它的 cell scoped slot，實際模板寫在 information_6.html
   裡——那也符合「版面留在 HTML」的原則。
   ============================================================ */

thPage({
  data() {
    return {
      rows: window.TRAIL_LEVELS,
      kitPdf: window.KIT_PDF,
      columns: [
        { key: "level", label: "難度等級", align: "center" },
        { key: "desc", label: "說明" },
        { key: "who", label: "適合對象" },
        { key: "kit", label: "建議裝備" },
      ],
    };
  },
  methods: {
    isArray(v) { return Array.isArray(v); },
  },
});
