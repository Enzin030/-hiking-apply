/* ============================================================
   PageName.js — 新頁的資料與初始化範本（Vue 3 global build）
   ------------------------------------------------------------
   **版面不放這裡。** 頁面骨架寫在 <頁名>.html 的 in-DOM template，
   本檔只留資料、computed、methods，最後呼叫一次 thPage() 登記。
   這是 in-DOM template 的必然結果：只有共用元件的 template 是 JS 字串，
   頁面版面留在 .html —— 一支數十行寫一次、32 頁共用，字串編輯的痛可攤提；
   整頁版面搬進 JS 字串則不可攤提。

   由 <頁名>.html 的 head-loader `data-page-init` 載入，排在所有共用元件之後、
   app-boot 掛載之前。**檔名要與 data-page-init 一致。**

   thPage() 只登記 root options，實際 createApp／註冊元件／mount 由
   assets/app-boot.js 統一負責（契約六條在該檔檔頭）。

   ------------------------------------------------------------
   五個常踩的地方
   ------------------------------------------------------------
   1. **大宗資料常數放模組層，不要進 data()**。放進 data() 會被 Vue 遞迴
      建成 reactive proxy，白付代價；頁面也不會去改它。
   2. **sort() 前先 slice()**。sort 原地改陣列，直接對 data 裡的陣列排序
      會連原始順序一起毀掉。
   3. **判空要確認值不可能是 0**。`if (!count)` 在 count 為 0 時也成立，
      這一類 falsy 陷阱在遷移期造成過實際缺陷。
   4. **只有這一頁用的小元件寫在 options.components**，不要塞進全域
      window.thComponents —— 那是 32 頁共用的命名空間。
   5. **區域元件不會被子元件繼承**。頁面自己註冊的元件，若被另一個頁面
      元件的 template 用到，那個元件也要自己註冊一份（給它 .components）。
      漏了會靜默留下未解析的自訂標籤，prod build 一聲不吭。
   ============================================================ */

/* 大宗常數放這裡（模組層），不進 data() */
const NAV_ITEMS = [
  { id: "sec1", label: "第一節" },
];

thPage({
  data() {
    return {
      navItems: NAV_ITEMS,
      sectionTitle: "第一節",
    };
  },

  computed: {
    // 由 data 推導的值放這裡，不要在 template 裡算
  },

  methods: {
    // 事件處理放這裡
  },

  mounted() {
    // **這裡量不到版面。** app-boot 掛載時 #th-app 仍帶 v-cloak（display:none），
    // 所有 getBoundingClientRect() 都是 0。要量版面請包一層：
    //   requestAnimationFrame(() => { ... })
  },
});
