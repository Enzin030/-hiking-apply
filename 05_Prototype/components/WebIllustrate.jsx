/*
  本站使用說明
  內容來源：舊站 https://service.skyeyes.tw/hikenationpark/web_illustrate.aspx

  [待確認] 舊站本頁附有操作截圖，新版 UI 已改版，截圖待雛形定版後補。

  FAQ 的 links：[{ label, href, todo }]
    href 有值 → 實際導頁；todo: true → 目標頁本雛形尚未建置，標「待建置」且不導頁，
    不給假路徑（不用 `#`）。一題可有多個入口。
*/

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
      { label: "常見問答", todo: true },
    ],
  },
];

/* FAQ 內的操作入口；todo 者以「待建置」標記呈現，不做成可點連結 */
function FaqLinks({ links }) {
  if (!links || links.length === 0) return null;
  return (
    <p className="th-faq-links">
      {links.map((l) =>
        l.todo ? (
          <span key={l.label} className="th-faq-link is-todo">
            {l.label}
            <span className="th-todo-tag">待建置</span>
          </span>
        ) : (
          <a key={l.label} className="th-faq-link" href={l.href}>
            {l.label}
            <i className="fa-solid fa-angle-right"></i>
          </a>
        )
      )}
    </p>
  );
}

function WebIllustrateApp() {
  return (
    <div>
      <Header active="info" />

      <PageHero
        trail={["本站使用說明"]}
        title="本站使用說明"
        lead="本站提供國家公園入園與入山申請服務。依國家公園法第十九條，進入玉山、太魯閣、雪霸國家公園生態保護區須申請「國家公園入園許可」；若登山路線同時進入山地管制區，另須申請「入山許可證」。本站會自動判斷申請者需要哪幾份許可。"
        updated="2026-09-01"
      />

      <div className="th-page has-nav">
        <div className="th-page-main">
          {/*
            舊站原文只寫「國家公園法第十九條」與入山許可的存在。
            下表的核發機關、以及入山許可的法源依據，係比對登山須知頁的機關分組推得，
            未經業務確認 → 逐格標「待確認」，不呈現為已定案資訊（core.md §3.4）。
          */}
          <SectionCard id="permit" title="兩種許可的差別" icon="fa-solid fa-id-card"
                       note="部分欄位待訪談確認">
            <Callout type="warning">
              下表標示<span className="th-todo-tag">待確認</span>的欄位為推得內容，
              <strong>尚未經主管機關確認，不得作為正式依據</strong>；確認後再行更新。
            </Callout>
            <Callout>
              一次申請即可，<strong>本站會依所選路線自動判斷需要哪幾份許可</strong>，
              不需分別到各機關網站送件。
            </Callout>
            <div className="th-table-wrap">
              <table className="th-table">
                <thead>
                  <tr>
                    <th>許可種類</th>
                    <th>法源依據</th>
                    <th>適用情形</th>
                    <th>核發機關</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>國家公園入園許可</td>
                    <td>國家公園法第十九條</td>
                    <td>進入玉山、太魯閣、雪霸國家公園生態保護區</td>
                    <td>各國家公園管理處<span className="th-todo-tag">待確認</span></td>
                  </tr>
                  <tr>
                    <td>入山許可證</td>
                    <td>國家安全法第五條<span className="th-todo-tag">待確認</span></td>
                    <td>登山路線進入山地管制區</td>
                    <td>警政署<span className="th-todo-tag">待確認</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard id="faq" title="首次使用常見問題" icon="fa-solid fa-circle-question" note={`${GUIDE_FAQS.length} 則`} flush>
            <div className="th-faq">
              {GUIDE_FAQS.map((f, i) => (
                <details key={f.q} open={i === 0 || undefined}>
                  <summary>
                    {f.q}
                    <i className="fa-solid fa-chevron-down"></i>
                  </summary>
                  <div className="th-faq-body">
                    <p>{f.a}</p>
                    <FaqLinks links={f.links} />
                  </div>
                </details>
              ))}
            </div>
          </SectionCard>

          {/* 頁尾主要 CTA：比照正式站 web_illustrate.aspx 的「進入登山申請」按鈕 */}
          <div className="th-page-cta">
            <p className="th-page-cta-text">看完說明後，即可開始申請入園／入山許可。</p>
            <a className="th-btn th-btn-primary th-btn-lg" href="apply-1.html">
              <i className="fa-solid fa-pen-to-square"></i>進入登山申請
            </a>
          </div>
        </div>

        <PageNav
          items={[
            { id: "permit", label: "兩種許可的差別" },
            { id: "faq", label: "首次使用常見問題" },
          ]}
        />
      </div>

      <ExperienceNav />
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<WebIllustrateApp />);
