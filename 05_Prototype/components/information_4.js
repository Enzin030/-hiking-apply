/* ============================================================
   information_4.js — 即時影像觀看的頁面狀態與初始化
   對應規格：02_Spec/27_即時影像觀看.md（舊系統 information_4.aspx）
   ------------------------------------------------------------
   版面在 information_4.html；本檔只留狀態與方法。
   景點資料由 components/CctvData.js 提供（window.CCTV_SPOTS），
   在 data() 裡取用（理由見下方註解）。

   預設景點為觀霧遊客中心（規格：預設為觀霧遊客中心）。
   ============================================================ */

/* window.CCTV_SPOTS 在 data() 裡才讀，**不要在模組層捕捉引用**：
   資料檔是 <body> 底部的 parser-inserted script，本檔由 head-loader 佇列載入，
   兩者沒有保證的先後（踩坑總表第七類）。data() 在 app-boot 掛載時才執行，
   那時 body 的 script 都跑完了——information6.js 也是這樣寫的。 */

thPage({
  data() {
    var list = window.CCTV_SPOTS;
    return {
      spots: list,
      current: list[0].key,
      /* MJPEG 串流連不上時改顯示替代訊息。以 key 逐一預先建好，
         不要在事件裡新增欄位——Vue 3 雖然吃得下，但預先宣告較好讀。 */
      failed: list.reduce(function (acc, s) { acc[s.key] = false; return acc; }, {}),
    };
  },

  computed: {
    spot() {
      var self = this;
      return this.spots.find(function (s) { return s.key === self.current; }) || this.spots[0];
    },
  },

  methods: {
    markFailed(key) { this.failed[key] = true; },
  },
});
