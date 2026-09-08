/* ============================================================
   rss.js — RSS 訂閱頁的資料、頁面區域元件與初始化（原 Rss.jsx）
   ------------------------------------------------------------
   版面已搬回 rss.html；本檔留三樣東西：

   1. 資料（FEEDS、SUBSCRIBE_STEPS）
   2. **頁面區域元件 p-rss-feed-url**（原 Rss.jsx 內的 FeedUrl）
   3. thPage 登記

   為什麼 FeedUrl 做成「頁面區域元件」而不是共用元件或頁面狀態：
   - 它有自己的 copied 狀態，而且**每一列各一份**（表格每列一個複製鈕），
     放在頁面根層的 data 會變成所有列共用一個旗標
   - 目前只有本頁用得到，依 §6.4「元件優先」的反面——還沒有第二個消費端，
     不必進 assets/components/
   → 走 Vue 的 createApp options.components，只註冊在這一頁的 app 裡。
     app-boot.js 把 thPage 的 options 原封不動交給 createApp，所以這條路可行，
     而且不會污染全域元件表。這是**頁面區域元件的標準做法**。
   ============================================================ */

const FEED_BASE = "https://hike.taiwan.gov.tw/rss.aspx";

/*
  可訂閱頻道。
  url 有值 → 實際存在且已查證的端點；todo: true → 正式站尚無此 feed，不給假網址。
*/
const FEEDS = [
  {
    key: "news",
    label: "最新消息",
    icon: "fa-solid fa-bullhorn",
    desc: "各機關入園規定異動、系統維護、園區封閉與活動公告。",
    url: FEED_BASE,
    status: "maintenance",
    page: "news.html?tab=news",
  },
  {
    key: "violation",
    label: "違規名單",
    icon: "fa-solid fa-user-slash",
    desc: "各管理處公告之不予許可入園名單異動。",
    todo: true,
    page: "news.html?tab=violation",
  },
  {
    key: "download",
    label: "檔案下載",
    icon: "fa-solid fa-file-arrow-down",
    desc: "申請書表、裝備自主檢查表等檔案的新增與改版。",
    todo: true,
    page: "news.html?tab=download",
  },
  {
    key: "faq",
    label: "常見問答",
    icon: "fa-solid fa-circle-question",
    desc: "常見問答的新增與內容異動。",
    todo: true,
    page: "news.html?tab=faq",
  },
  {
    key: "open",
    label: "登山路線開放狀態",
    icon: "fa-solid fa-route",
    desc: "路線開放、關閉與雪季管制狀態的變更。",
    todo: true,
    page: "open.html",
  },
];

/* 訂閱步驟；正式站原文教的是 IE 外掛與 Firefox 的 Sage，兩者皆已停止維護，此處改寫為現行做法 */
const SUBSCRIBE_STEPS = [
  {
    title: "準備一個 RSS 閱讀器",
    body: "主流瀏覽器目前皆未內建 RSS 訂閱功能，需另外準備閱讀器：可安裝瀏覽器擴充套件，或使用網頁版、行動裝置上的閱讀器應用程式。",
  },
  {
    title: "複製本頁的訂閱網址",
    body: "在上方「可訂閱的頻道」表格中，按該頻道的「複製網址」按鈕即可；也可以在網址上按滑鼠右鍵選擇「複製連結網址」。",
  },
  {
    title: "貼進閱讀器的「新增訂閱」",
    body: "在閱讀器中找到新增訂閱（Add feed／Subscribe）的欄位，貼上網址後確認。之後該頻道有新內容時，閱讀器就會自動收到。",
  },
];

/* 頁面區域元件：訂閱網址 ＋ 複製按鈕
   複製走 navigator.clipboard（localhost 與 https 皆為 secure context）；
   不可用時退回選取 textarea 的舊做法，不讓按鈕變成沒有反應的裝飾。 */
var pRssFeedUrl = {
  props: { url: { type: String, required: true } },
  data() {
    return { copied: false };
  },
  methods: {
    copy() {
      var self = this;
      var url = this.url;
      function done() {
        self.copied = true;
        window.setTimeout(function () { self.copied = false; }, 2000);
      }
      function fallback() {
        var el = document.createElement("textarea");
        el.value = url;
        el.setAttribute("readonly", "");
        el.className = "p-rss-offscreen";
        document.body.appendChild(el);
        el.select();
        try { document.execCommand("copy"); done(); } catch (e) { /* 環境不支援時靜默 */ }
        document.body.removeChild(el);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done).catch(fallback);
      } else {
        fallback();
      }
    },
  },
  template: `
    <div class="p-rss-url">
      <a class="p-rss-url-text" :href="url" target="_blank" rel="noopener noreferrer">{{ url }}</a>
      <button type="button" class="th-btn th-btn-ghost th-btn-sm p-rss-copy" @click="copy">
        <i :class="copied ? 'fa-solid fa-check' : 'fa-regular fa-copy'"></i>{{ copied ? '已複製' : '複製網址' }}
      </button>
    </div>
  `,
};

thPage({
  components: { "p-rss-feed-url": pRssFeedUrl },
  data() {
    return {
      feeds: FEEDS,
      steps: SUBSCRIBE_STEPS,
      columns: [
        { key: "label", label: "頻道" },
        { key: "desc", label: "內容" },
        { key: "url", label: "訂閱網址" },
        { key: "page", label: "對應頁面", align: "center" },
      ],
    };
  },
});
