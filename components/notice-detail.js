/* ============================================================
   notice-detail.js — 17 頁公告的頁面初始化（原 NoticeDetail.jsx 的 App 部分）
   ------------------------------------------------------------
   由 head-loader 的 data-page-init 載入，是載入序列的最後一支。
   只呼叫 thPage() 登記 root options；createApp／註冊／掛載由
   assets/app-boot.js 負責（掛載契約見該檔檔頭）。

   版面已搬回各頁 .html（§5 階段 3 第 1 項），文件內容的遞迴渲染在
   assets/components/th-doc.js（17 頁共用）。本檔只剩「取哪一頁的資料」
   與「要不要出頁內目錄」兩件事。

   哪一頁：讀容器的 data-notice。原本是 NoticeDetail.jsx 讀
   `document.getElementById("root").dataset.notice`，現在改讀 #th-app 的
   同一個屬性（掛載契約第 6 條，慣例不變）。

   **NOTICE_DETAILS 在 data() 內才讀**，不在檔案 top-level 讀：
   資料檔是 body 底部的一般 <script>，而 data() 在掛載時才執行
   （掛載發生在 includesLoaded 之後），這樣就不必依賴「body script 一定
   早於 page-init」這種隱性順序。
   ============================================================ */

thPage({
  data() {
    var el = document.getElementById("th-app");
    var pageId = el.dataset.notice;
    var data = window.NOTICE_DETAILS[pageId];

    if (!data) {
      console.error(
        "[notice-detail] 找不到 data-notice=\"" + pageId + "\" 的資料。" +
        "請確認 components/NoticeDetailData.js 已載入，且該頁的鍵值存在。"
      );
    }

    return { pageId: pageId, data: data || { title: "", blocks: [] } };
  },

  computed: {
    /* 頁內目錄：只收有標題的區塊，錨點對應各 section 的 id="blk{n}" */
    navItems() {
      return this.data.blocks
        .map(function (b, i) { return { id: "blk" + (i + 1), label: b.title }; })
        .filter(function (n) { return n.label; });
    },

    /* 只有一個區塊的頁面（如 notice_a2）不需要頁內目錄 */
    hasNav() {
      return this.navItems.length > 1;
    },
  },
});
