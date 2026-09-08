// DEPRECATED 2026-09-08：該頁已遷移為 Vue（rss.html ＋ components/rss.js），本檔已無任何
// <script> 引用，請勿編輯。實際刪除排在階段 4——階段 3 剩餘頁面
// 仍需對照 Shared.jsx，故舊 JSX 一併保留到階段 3 結束。
/*
  RSS 訂閱
  內容來源：正式站 https://hike.taiwan.gov.tw/RssWeb.aspx（2026-09-03 抓取原始 HTML 比對）

  正式站本頁只有麵包屑、標題與「何謂RSS?」「如何訂閱RSS」兩段說明，
  **通篇沒有列出任何一個可訂閱的網址**——想訂閱的人看完這頁仍然不知道要貼什麼進閱讀器。
  全站唯一的 RSS 圖示在 news_0.aspx（最新消息）標題右側，連向 rss.aspx。

  本頁改版的核心就是補上那張清單，並把訂閱網址直接放在畫面上可複製。

  網址查證（2026-09-03）：
    https://hike.taiwan.gov.tw/rss.aspx
      → HTTP 200，但回傳的是全站的「系統維護中」頁面，不是 XML feed。
        同時間 news_0／news_5／news_6／news_7 等頁皆正常回應，
        故為該端點自身失效，不是全站維護。
    其餘頁籤（違規名單／檔案下載／常見問答）與登山路線開放狀態
      → 正式站不存在對應的 feed 端點，一律標「待建置」，不編造 rss.aspx?type=… 之類的網址。
*/

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

/*
  訂閱網址 ＋ 複製按鈕。
  複製走 navigator.clipboard（localhost 與 https 皆為 secure context）；
  不可用時退回選取 input 的舊做法，不讓按鈕變成沒有反應的裝飾。
*/
function FeedUrl({ url }) {
  const [copied, setCopied] = React.useState(false);

  const copy = () => {
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(fallback);
    } else {
      fallback();
    }
    function fallback() {
      const el = document.createElement("textarea");
      el.value = url;
      el.setAttribute("readonly", "");
      el.className = "rss-offscreen";
      document.body.appendChild(el);
      el.select();
      try { document.execCommand("copy"); done(); } catch (e) { /* 環境不支援時靜默 */ }
      document.body.removeChild(el);
    }
  };

  return (
    <div className="rss-url">
      <a className="rss-url-text" href={url} target="_blank" rel="noopener noreferrer">{url}</a>
      <button type="button" className="th-btn th-btn-ghost th-btn-sm rss-copy" onClick={copy}>
        <i className={copied ? "fa-solid fa-check" : "fa-regular fa-copy"}></i>
        {copied ? "已複製" : "複製網址"}
      </button>
    </div>
  );
}

function RssApp() {
  const feedColumns = [
    {
      key: "label",
      label: "頻道",
      render: (r) => (
        <span className="rss-channel">
          <i className={r.icon}></i>
          <span>{r.label}</span>
        </span>
      ),
    },
    { key: "desc", label: "內容", render: (r) => r.desc },
    {
      key: "url",
      label: "訂閱網址",
      render: (r) =>
        r.todo ? (
          <span className="rss-url is-todo">
            尚未提供<span className="th-todo-tag">待建置</span>
          </span>
        ) : (
          <React.Fragment>
            <FeedUrl url={r.url} />
            {r.status === "maintenance" && (
              <p className="rss-url-note">
                <i className="fa-solid fa-triangle-exclamation"></i>
                此端點 2026-09-03 實測回傳「系統維護中」，尚無法取得內容。
              </p>
            )}
          </React.Fragment>
        ),
    },
    {
      key: "page",
      label: "對應頁面",
      align: "center",
      render: (r) => (
        <a className="th-inline-link" href={r.page}>
          前往<i className="fa-solid fa-angle-right"></i>
        </a>
      ),
    },
  ];

  return (
    <div>
      {/* RSS 不屬於主導覽任何一項（正式站放在工具列），故不傳 active，不點亮任何項目 */}
      <Header />

      <PageShell
        trail={["RSS 訂閱"]}
        title="RSS 訂閱"
        lead="訂閱本站的 RSS 頻道，各機關的入園公告與異動有更新時，閱讀器會自動通知，不需要每天回來看，也不必留下電子郵件或任何個人資料。"
        updated="2026-09-03"
        nav={<PageNav
               items={[
                 { id: "feeds", label: "可訂閱的頻道" },
                 { id: "what", label: "何謂 RSS？" },
                 { id: "how", label: "如何訂閱" },
               ]}
             />}
      >
        <SectionCard id="feeds" title="可訂閱的頻道" icon="fa-solid fa-square-rss"
                     note={`${FEEDS.length} 個頻道`} flush>
          <div className="th-card-body">
            <Callout type="warning">
              目前僅<strong>最新消息</strong>一個頻道有訂閱網址，且該端點實測無法取得內容
              （見表格內註記）；其餘頻道正式站尚未提供 feed，本頁不編造網址。
              各頻道的實際供應範圍與更新頻率 <strong>[待確認]</strong>。
            </Callout>
          </div>
          <DataTable
            columns={feedColumns}
            rows={FEEDS}
            rowKey="key"
            className="tbl-rss"
          />
        </SectionCard>

        <SectionCard id="what" title="何謂 RSS？" icon="fa-solid fa-circle-info">
          {/* 定義段落沿用正式站原文，未改寫 */}
          <p>
            RSS（Real Simple Syndication）－網頁資料交換技術架構，是一種用來分發和匯集網頁內容的
            XML 格式，您可以想像您可以訂閱許多您有興趣的資訊來源，但是不用留下基本資料、電子郵件信箱⋯⋯，
            對於 RSS 的訂閱者而言，可以最快的得到最新訊息以及頭條新聞，而不用被動式的去每個網站上去搜索。
          </p>
          <p className="th-table-note">本段文字取自正式站 RssWeb.aspx 原文。</p>
        </SectionCard>

        <SectionCard id="how" title="如何訂閱" icon="fa-solid fa-list-check">
          <StepList steps={SUBSCRIBE_STEPS} />
          <Callout>
            各家閱讀器的操作介面不同，實際新增訂閱的步驟請依所用軟體的說明為準。
          </Callout>
        </SectionCard>
      </PageShell>

      <ExperienceNav />
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<RssApp />);
