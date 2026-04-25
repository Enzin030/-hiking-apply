/* Page 2: Consent / Notices */

const CONSENT_SECTIONS = [
  {
    id: "timing",
    icon: "fa-regular fa-calendar",
    title: "申請時間與期限",
    summary: "送件時間、有效時段、抽籤期間說明",
    clauses: [
      { html: "一般路線請於入園日之 <strong>5 天至 2 個月前</strong>提出申請。若為熱門需抽籤路線（如玉山主峰、雪山主峰），請依各國家公園管理處之<strong>抽籤規定時程</strong>辦理。" },
      { html: "<strong>每日 23:00 至次日 07:00 系統暫停申請</strong>，將進行夜間維護作業，請於開放時段內提交。" },
      { html: "申請成功後請於審核通過 <strong>30 日內完成繳費</strong>，逾期視同放棄。" },
    ],
  },
  {
    id: "identity",
    icon: "ph-bold ph-identification-card",
    title: "身分與隊員資料",
    summary: "本國國民、外籍人士、隊員人數規定",
    clauses: [
      { html: "<strong>國人申請</strong>請輸入身分證字號；<strong>外籍人士</strong>填寫時請選擇「護照」，並輸入護照號碼。未滿 16 歲者須由 20 歲以上家屬同行。" },
      { html: "申請通過後原則上不可任意更換人員，若有特殊情況請依各國家公園的<strong>異動規定</strong>辦理。" },
      { html: "每隊隊員人數限制：<strong>玉山國家公園 2–12 人</strong>、<strong>雪霸 3–12 人</strong>、<strong>太魯閣 4–12 人</strong>，未達下限請與其他申請人併隊。" },
    ],
  },
  {
    id: "permit",
    icon: "ph-bold ph-shield-check",
    title: "入園與入山許可",
    summary: "區分國家公園入園證與警政署入山證",
    clauses: [
      { html: "「<strong>入園許可</strong>」由各國家公園管理處核發，「<strong>入山許可</strong>」由警政署核發，兩者法定意義不同，本系統會依您選擇之路線自動帶入需要的許可項目。" },
      { html: "若進入<strong>山地管制區</strong>或國家公園生態保護區，須同時取得入園與入山許可。", note: "詳閱「入山許可一覽」可知是否需另申請入山證。" },
    ],
  },
  {
    id: "safety",
    icon: "ph-bold ph-warning-octagon",
    title: "登山安全與裝備要求",
    summary: "保險、通訊、留守人聯絡規範",
    clauses: [
      { html: "申請人應自行投保登山綜合保險（含<strong>搜救費用</strong>），並於行程中攜帶。", danger: true },
      { html: "建議攜帶<strong>衛星電話、無線電或具離線地圖之 GPS 裝置（含智慧型手機）</strong>，並於申請表上填寫設備資訊。" },
      { html: "出發前請指定<strong>留守人</strong>，並提供其姓名與聯絡電話；若行程逾時未歸，留守人應立即通報。" },
    ],
  },
  {
    id: "regulations",
    icon: "ph-bold ph-leaf",
    title: "山域行為與環境保護",
    summary: "禁止行為、垃圾、火源、野生動物",
    clauses: [
      { html: "山屋內禁止使用明火炊煮，請於指定區域使用<strong>瓦斯爐具</strong>。" },
      { html: "落實<strong>垃圾全部攜出</strong>、廚餘集中處理；不得餵食或騷擾野生動物。" },
      { html: "未經許可不得擅自更動既有路線、紮營於非指定營地。" },
    ],
  },
  {
    id: "privacy",
    icon: "ph-bold ph-lock",
    title: "個人資料蒐集告知",
    summary: "資料用途、保存期限與當事人權利",
    clauses: [
      { html: "本網站依《個人資料保護法》規定，蒐集您填寫之個人資料僅供<strong>登山申請審核、緊急聯絡及統計分析</strong>之用，不會作為其他用途。" },
      { html: "您得依個資法第三條規定，向本機關行使<strong>查詢、更正、刪除</strong>等權利。詳細條文請參閱 <a href='#'>個資蒐集告知聲明</a>。" },
    ],
  },
];

function Page2App() {
  const [collapsed, setCollapsed] = React.useState(() =>
    Object.fromEntries(CONSENT_SECTIONS.map(s => [s.id, false]))
  );
  const [acked, setAcked] = React.useState(() =>
    Object.fromEntries(CONSENT_SECTIONS.map(s => [s.id, false]))
  );
  const [master, setMaster] = React.useState(false);

  const ackedCount = Object.values(acked).filter(Boolean).length;
  const total = CONSENT_SECTIONS.length;
  const allAcked = ackedCount === total;
  const canSubmit = allAcked && master;

  const toggleCollapse = (id) =>
    setCollapsed(c => ({ ...c, [id]: !c[id] }));

  const toggleAck = (id) => {
    setAcked(a => ({ ...a, [id]: !a[id] }));
    // auto-collapse on ack
    setCollapsed(c => ({ ...c, [id]: !acked[id] }));
  };

  const ackAll = () => {
    const v = !allAcked;
    setAcked(Object.fromEntries(CONSENT_SECTIONS.map(s => [s.id, v])));
  };

  const scrollToSection = (id) => {
    const el = document.getElementById("sec-" + id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setCollapsed(c => ({ ...c, [id]: false }));
  };

  return (
    <div data-screen-label="02 同意書">
      <Header active="apply" />
      <Breadcrumb trail={["登山申請", "登山線上申請", "申請須知與同意書"]} />

      <main className="th-page">
        <div className="th-page-inner">
          <h1 className="th-page-title">申請須知與同意書</h1>
          <Stepper current={2} />

          <div className="p2-layout">
            <div>
              <div className="p2-intro">
                <div className="p2-intro-icon">
                  <i className="ph-bold ph-info"></i>
                </div>
                <div>
                  <h2>請先閱讀以下說明後，始可進行後續之申請作業</h2>
                  <p>為了您的登山安全與行政審核作業順利，請逐項閱讀並勾選每組事項。完成所有勾選後，下方「同意並下一步」按鈕即可使用。</p>
                </div>
              </div>

              {CONSENT_SECTIONS.map((s, idx) => {
                const isAcked = acked[s.id];
                const isCollapsed = collapsed[s.id];
                return (
                  <section key={s.id} id={"sec-" + s.id}
                    className={`p2-sec ${isAcked ? "is-acked" : ""} ${isCollapsed ? "is-collapsed" : ""}`}>
                    <div className="p2-sec-head" onClick={() => toggleCollapse(s.id)}>
                      <div className="p2-sec-head-left">
                        <div className="p2-sec-num">
                          {isAcked ? <i className="fa-solid fa-check"></i> : (idx + 1)}
                        </div>
                        <div className="p2-sec-titles">
                          <h3 className="p2-sec-title">{s.title}</h3>
                          <p className="p2-sec-summary">{s.summary}</p>
                        </div>
                      </div>
                      <div className="p2-sec-head-right">
                        <span className="p2-sec-count">{isAcked ? "已確認" : `${s.clauses.length} 項`}</span>
                        <i className="p2-sec-chev fa-solid fa-chevron-down"></i>
                      </div>
                    </div>

                    <div className="p2-sec-body">
                      {s.clauses.map((c, i) => (
                        <div key={i} className="p2-clause">
                          <span className="p2-clause-num">{i + 1}</span>
                          <div className="p2-clause-body">
                            <span dangerouslySetInnerHTML={{ __html: c.html }} />
                            {c.danger && (
                              <div className="p2-callout">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                                <span><strong>強烈建議：</strong>未投保保險者，搜救衍生費用將由申請人自行負擔。</span>
                              </div>
                            )}
                            {c.note && (
                              <div className="p2-info-box">
                                <span className="lbl">補充：</span>{c.note}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      <label className="p2-sec-ack" onClick={e => e.stopPropagation()}>
                        <input type="checkbox" checked={isAcked} onChange={() => toggleAck(s.id)} />
                        <span className="p2-sec-ack-box"></span>
                        <span className="p2-sec-ack-text">
                          我已閱讀並理解上述<strong>「{s.title}」</strong>之全部事項
                        </span>
                      </label>
                    </div>
                  </section>
                );
              })}
            </div>

            {/* SIDEBAR TOC */}
            <aside className="p2-toc">
              <h3><i className="ph-bold ph-list-numbers"></i>閱讀進度</h3>
              <div className="p2-progress">
                <div className="p2-progress-bar" style={{ width: `${(ackedCount / total) * 100}%` }}></div>
              </div>
              <div className="p2-progress-label">
                <span>已確認 <strong>{ackedCount}/{total}</strong> 組</span>
                <span>{Math.round((ackedCount / total) * 100)}%</span>
              </div>

              <ul className="p2-toc-list">
                {CONSENT_SECTIONS.map((s, i) => (
                  <li key={s.id} className={acked[s.id] ? "is-acked" : ""}>
                    <button onClick={() => scrollToSection(s.id)}>
                      <span className="p2-toc-dot"><span>{i + 1}</span></span>
                      <span>{s.title}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="p2-toc-actions">
                <button className="p2-toc-mini" onClick={ackAll}>
                  <i className={allAcked ? "fa-solid fa-square-minus" : "fa-solid fa-square-check"}></i>
                  {allAcked ? "全部取消" : "全部展開閱讀並標記"}
                </button>
                <button className="p2-toc-mini">
                  <i className="fa-solid fa-print"></i>列印同意書全文
                </button>
              </div>
            </aside>
          </div>

          {/* STICKY FOOTER */}
          <div className={`p2-footbar ${canSubmit ? "is-ready" : ""}`}>
            <div className="p2-footbar-status">
              <div className="p2-footbar-icon">
                <i className={canSubmit ? "fa-solid fa-check" : "fa-solid fa-list-check"}></i>
              </div>
              <div>
                <div>已確認 <span className="num">{ackedCount}</span> / {total} 組事項</div>
                <div style={{ fontSize: 12, color: "var(--fg-3)" }}>
                  {allAcked ? "請勾選下方確認語並繼續" : "請完成所有勾選後才能進入下一步"}
                </div>
              </div>
            </div>

            <label className={`p2-master-ack ${!allAcked ? "is-disabled" : ""}`}>
              <input type="checkbox" disabled={!allAcked} checked={master} onChange={e => setMaster(e.target.checked)} />
              <span className="p2-master-ack-box"></span>
              <span>本人已閱讀並同意以上全部注意事項</span>
            </label>

            <div className="p2-footbar-actions">
              <button className="th-btn th-btn-ghost" onClick={() => window.location.href = "apply-1.html"}>
                <i className="fa-solid fa-arrow-left"></i>上一步
              </button>
              <button className="th-btn th-btn-primary" disabled={!canSubmit}
                onClick={() => window.location.href = "apply-3.html"}>
                同意並下一步<i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Page2App />);
