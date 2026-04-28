/* Page 2: Consent / Notices
 * 依 ?unit 分三種模式：
 *   national-park  → yushan / shei-pa / taroko：逐條勾選同意書
 *   summary        → forestry-area / police：申請前摘要頁
 *   預設 (無 unit)  → national-park (向下相容)
 */

// ---------- 工具 ----------
function getParam(key) {
  return new URLSearchParams(window.location.search).get(key) || "";
}

function getRouteFromQuery() {
  const routeId = getParam("route");
  if (!routeId || typeof ROUTE_DATA === "undefined") return null;
  return ROUTE_DATA.find(r => r.id === routeId) || null;
}

function getParkConfig(unit, routeData) {
  const parkByUnit = window.PARK_BY_UNIT || {};
  const queryOrgId = getParam("orgId") || "";
  const orgMatched = Object.values(parkByUnit).find(p =>
    p.orgId && (
      p.orgId.toLowerCase() === queryOrgId.toLowerCase() ||
      p.orgId.toLowerCase() === String(unit || "").toLowerCase()
    )
  );
  if (orgMatched) return orgMatched;

  const key = routeData?.parkForm || routeData?.unit || unit || "yushan";
  return (window.PARK_BY_UNIT && window.PARK_BY_UNIT[key]) || {
    unit: key,
    orgId: queryOrgId || routeData?.orgId || "",
    parkName: routeData?.agencyName || "國家公園",
    agencyName: routeData?.agencyName || "國家公園管理處",
    color: "var(--national-700)",
    nextPage: "apply-3.html",
  };
}

function getConsentItems(orgId, unit) {
  const byOrg = window.CONSENT_BY_ORG || {};
  const parkByUnit = window.PARK_BY_UNIT || {};
  const fallbackOrgId = parkByUnit[unit]?.orgId;
  const items = byOrg[orgId] || byOrg[fallbackOrgId] || [];

  return items.map(item => ({
    id: item.id,
    title: item.title || getConsentTitle(item.name || item.contentHtml || "", item.order),
    summary: item.summary || `attention #${item.dbId || item.id} · ord ${item.order || item.ord || "-"}`,
    clauses: [{ html: item.contentHtml || item.name || "" }],
    defaultChecked: item.defaultChecked ?? (item.selectchk === "1"),
    order: item.order || Number(item.ord) || 0,
  }));
}

function getConsentTitle(html, order) {
  const div = document.createElement("div");
  div.innerHTML = html;
  const text = (div.textContent || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return `注意事項 ${order || ""}`;
  return text.length > 34 ? `${text.slice(0, 34)}...` : text;
}

function nextUrl(page) {
  const q = new URLSearchParams(window.location.search);
  return `${page}?${q.toString()}`;
}

// Deprecated inline prototype copy. The rendered national-park consent list uses ConsentData.jsx.
// Kept temporarily while the DB attention export is not available.
const NP_CONSENT = {
  yushan: {
    parkName: "玉山國家公園",
    color: "var(--park-yushan)",
    nextPage: "apply-3.html",
    sections: [
      {
        id: "timing", icon: "fa-regular fa-calendar", title: "申請時間與期限",
        summary: "送件時間、有效時段、抽籤期間說明",
        clauses: [
          { html: "一般路線請於入園日之 <strong>5 天至 2 個月前</strong>提出申請。主峰路線（玉山主峰）請依<strong>抽籤規定時程</strong>辦理。" },
          { html: "<strong>每日 23:00 至次日 07:00 系統暫停申請</strong>，請於開放時段內提交。" },
          { html: "申請成功後請於審核通過 <strong>30 日內完成繳費</strong>，逾期視同放棄。" },
        ],
      },
      {
        id: "identity", icon: "ph-bold ph-identification-card", title: "身分與隊員資料",
        summary: "本國國民、外籍人士、隊員人數規定",
        clauses: [
          { html: "<strong>國人申請</strong>請輸入身分證字號；<strong>外籍人士</strong>填寫護照號碼。未滿 16 歲者須由 20 歲以上家屬同行。" },
          { html: "每隊隊員人數限制：<strong>玉山國家公園 2–12 人</strong>，未達下限請與其他申請人併隊。" },
          { html: "申請通過後不可任意更換人員，特殊情況依玉山國家公園管理處之<strong>異動規定</strong>辦理。" },
        ],
      },
      {
        id: "permit", icon: "ph-bold ph-shield-check", title: "入園與入山許可",
        summary: "區分國家公園入園證與警政署入山證",
        clauses: [
          { html: "「<strong>入園許可</strong>」由玉山國家公園管理處核發；若進入山地管制區，另須取得警政署「<strong>入山許可</strong>」。" },
          { html: "本系統依您選擇之路線自動帶入需要的許可項目。", note: "可於「入山許可一覽」查詢是否需另申請入山證。" },
        ],
      },
      {
        id: "safety", icon: "ph-bold ph-warning-octagon", title: "登山安全與裝備要求",
        summary: "保險、通訊、留守人聯絡規範",
        clauses: [
          { html: "申請人應自行投保登山綜合保險（含<strong>搜救費用</strong>），並於行程中攜帶。", danger: true },
          { html: "建議攜帶<strong>衛星電話、無線電或具離線地圖之 GPS 裝置</strong>，並於申請表填寫設備資訊。" },
          { html: "出發前請指定<strong>留守人</strong>，行程逾時未歸，留守人應立即通報。" },
        ],
      },
      {
        id: "regulations", icon: "ph-bold ph-leaf", title: "山域行為與環境保護",
        summary: "禁止行為、垃圾、火源、野生動物",
        clauses: [
          { html: "山屋內禁止使用明火炊煮，請於指定區域使用<strong>瓦斯爐具</strong>。" },
          { html: "落實<strong>垃圾全部攜出</strong>、廚餘集中處理；不得餵食或騷擾野生動物。" },
          { html: "未經許可不得擅自更動既有路線、紮營於非指定營地。" },
        ],
      },
      {
        id: "privacy", icon: "ph-bold ph-lock", title: "個人資料蒐集告知",
        summary: "資料用途、保存期限與當事人權利",
        clauses: [
          { html: "依《個人資料保護法》，蒐集之個人資料僅供<strong>登山申請審核、緊急聯絡及統計分析</strong>之用。" },
          { html: "您得依個資法第三條向本機關行使<strong>查詢、更正、刪除</strong>等權利。" },
        ],
      },
    ],
  },
  "shei-pa": {
    parkName: "雪霸國家公園",
    color: "var(--park-shei-pa)",
    nextPage: "apply-3.html",
    sections: [
      {
        id: "timing", icon: "fa-regular fa-calendar", title: "申請時間與期限",
        summary: "送件時間、有效時段、抽籤期間說明",
        clauses: [
          { html: "一般路線請於入園日之 <strong>5 天至 2 個月前</strong>提出申請。雪山主東線旺季依<strong>抽籤規定時程</strong>辦理。" },
          { html: "<strong>每日 23:00 至次日 07:00 系統暫停申請</strong>，請於開放時段內提交。" },
          { html: "申請成功後請於審核通過 <strong>30 日內完成繳費</strong>，逾期視同放棄。" },
        ],
      },
      {
        id: "identity", icon: "ph-bold ph-identification-card", title: "身分與隊員資料",
        summary: "本國國民、外籍人士、隊員人數規定",
        clauses: [
          { html: "<strong>國人申請</strong>請輸入身分證字號；<strong>外籍人士</strong>填寫護照號碼。未滿 16 歲者須由 20 歲以上家屬同行。" },
          { html: "每隊隊員人數限制：<strong>雪霸國家公園 3–12 人</strong>，未達下限請與其他申請人併隊。" },
          { html: "申請通過後不可任意更換人員，特殊情況依雪霸國家公園管理處之<strong>異動規定</strong>辦理。" },
        ],
      },
      {
        id: "permit", icon: "ph-bold ph-shield-check", title: "入園與入山許可",
        summary: "區分國家公園入園證與警政署入山證",
        clauses: [
          { html: "「<strong>入園許可</strong>」由雪霸國家公園管理處核發；若進入山地管制區，另須取得警政署「<strong>入山許可</strong>」。" },
          { html: "本系統依您選擇之路線自動帶入需要的許可項目。", note: "可於「入山許可一覽」查詢是否需另申請入山證。" },
        ],
      },
      {
        id: "safety", icon: "ph-bold ph-warning-octagon", title: "登山安全與裝備要求",
        summary: "保險、通訊、留守人聯絡規範",
        clauses: [
          { html: "申請人應自行投保登山綜合保險（含<strong>搜救費用</strong>），並於行程中攜帶。", danger: true },
          { html: "建議攜帶<strong>衛星電話、無線電或具離線地圖之 GPS 裝置</strong>，並於申請表填寫設備資訊。" },
          { html: "出發前請指定<strong>留守人</strong>，行程逾時未歸，留守人應立即通報。" },
        ],
      },
      {
        id: "regulations", icon: "ph-bold ph-leaf", title: "山域行為與環境保護",
        summary: "禁止行為、垃圾、火源、野生動物",
        clauses: [
          { html: "山屋內禁止使用明火炊煮，請於指定區域使用<strong>瓦斯爐具</strong>。" },
          { html: "落實<strong>垃圾全部攜出</strong>、廚餘集中處理；不得餵食或騷擾野生動物。" },
          { html: "未經許可不得擅自更動既有路線、紮營於非指定營地。" },
        ],
      },
      {
        id: "privacy", icon: "ph-bold ph-lock", title: "個人資料蒐集告知",
        summary: "資料用途、保存期限與當事人權利",
        clauses: [
          { html: "依《個人資料保護法》，蒐集之個人資料僅供<strong>登山申請審核、緊急聯絡及統計分析</strong>之用。" },
          { html: "您得依個資法第三條向本機關行使<strong>查詢、更正、刪除</strong>等權利。" },
        ],
      },
    ],
  },
  taroko: {
    parkName: "太魯閣國家公園",
    color: "var(--park-taroko)",
    nextPage: "apply-3.html",
    sections: [
      {
        id: "timing", icon: "fa-regular fa-calendar", title: "申請時間與期限",
        summary: "送件時間、有效時段說明",
        clauses: [
          { html: "一般路線請於入園日之 <strong>5 天至 2 個月前</strong>提出申請。" },
          { html: "<strong>每日 23:00 至次日 07:00 系統暫停申請</strong>，請於開放時段內提交。" },
          { html: "申請成功後請於審核通過 <strong>30 日內完成繳費</strong>，逾期視同放棄。" },
        ],
      },
      {
        id: "identity", icon: "ph-bold ph-identification-card", title: "身分與隊員資料",
        summary: "本國國民、外籍人士、隊員人數規定",
        clauses: [
          { html: "<strong>國人申請</strong>請輸入身分證字號；<strong>外籍人士</strong>填寫護照號碼。未滿 16 歲者須由 20 歲以上家屬同行。" },
          { html: "每隊隊員人數限制：<strong>太魯閣國家公園 4–12 人</strong>，未達下限請與其他申請人併隊。" },
          { html: "申請通過後不可任意更換人員，特殊情況依太魯閣國家公園管理處之<strong>異動規定</strong>辦理。" },
        ],
      },
      {
        id: "permit", icon: "ph-bold ph-shield-check", title: "入園與入山許可",
        summary: "區分國家公園入園證與警政署入山證",
        clauses: [
          { html: "「<strong>入園許可</strong>」由太魯閣國家公園管理處核發；若進入山地管制區，另須取得警政署「<strong>入山許可</strong>」。" },
          { html: "本系統依您選擇之路線自動帶入需要的許可項目。", note: "可於「入山許可一覽」查詢是否需另申請入山證。" },
        ],
      },
      {
        id: "safety", icon: "ph-bold ph-warning-octagon", title: "登山安全與裝備要求",
        summary: "保險、通訊、留守人聯絡規範",
        clauses: [
          { html: "申請人應自行投保登山綜合保險（含<strong>搜救費用</strong>），並於行程中攜帶。", danger: true },
          { html: "建議攜帶<strong>衛星電話、無線電或具離線地圖之 GPS 裝置</strong>，並於申請表填寫設備資訊。" },
          { html: "出發前請指定<strong>留守人</strong>，行程逾時未歸，留守人應立即通報。" },
        ],
      },
      {
        id: "regulations", icon: "ph-bold ph-leaf", title: "山域行為與環境保護",
        summary: "禁止行為、垃圾、火源、野生動物",
        clauses: [
          { html: "山屋內禁止使用明火炊煮，請於指定區域使用<strong>瓦斯爐具</strong>。" },
          { html: "落實<strong>垃圾全部攜出</strong>、廚餘集中處理；不得餵食或騷擾野生動物。" },
          { html: "未經許可不得擅自更動既有路線、紮營於非指定營地。" },
        ],
      },
      {
        id: "privacy", icon: "ph-bold ph-lock", title: "個人資料蒐集告知",
        summary: "資料用途、保存期限與當事人權利",
        clauses: [
          { html: "依《個人資料保護法》，蒐集之個人資料僅供<strong>登山申請審核、緊急聯絡及統計分析</strong>之用。" },
          { html: "您得依個資法第三條向本機關行使<strong>查詢、更正、刪除</strong>等權利。" },
        ],
      },
    ],
  },
};

// ---------- 摘要模式設定（forestry-area / police）----------
const SUMMARY_CONFIG = {
  "forestry-area": {
    icon: "ph-bold ph-tree",
    color: "var(--park-forestry)",
    agencyName: "林業及自然保育署",
    title: "自然保護區申請前摘要",
    nextPage: "apply-3.html",
    notices: [
      { icon: "ph-bold ph-map-trifold",      text: "請確認您申請之路線在自然保護區或野生動物保護區範圍內，部分路段需另持有進入許可。" },
      { icon: "ph-bold ph-buildings",        text: "管理機關為林業及自然保育署所屬各林區管理處，申請核准後不得擅自更改路線或日期。" },
      { icon: "ph-bold ph-warning-octagon",  text: "進入保護區請落實無痕山林原則，嚴禁採集動植物或擾動生態。", warn: true },
    ],
  },
  police: {
    icon: "ph-bold ph-shield-check",
    color: "var(--park-police)",
    agencyName: "內政部警政署",
    title: "入山許可申請前確認",
    nextPage: "apply-3.html",
    notices: [
      { icon: "ph-bold ph-identification-card", text: "入山許可（警政署）與入園許可（國家公園）為不同證件，本次申請僅送警政署。" },
      { icon: "ph-bold ph-user-circle",          text: "填寫之個人資料（姓名、身分證字號）將傳送至警政署審核，請確認資料正確。" },
      { icon: "ph-bold ph-clock",               text: "入山許可申請請於入山日 <strong>3 天前</strong>提出，緊急情況請洽各地警察局山地管制站。" },
    ],
  },
};

// ===================================================================
// 國家公園同意書模式
// ===================================================================
function NationalParkConsent({ unit }) {
  const routeData = getRouteFromQuery();
  const parkConfig = getParkConfig(unit, routeData);
  const orgId = getParam("orgId") || routeData?.orgId || parkConfig.orgId || unit;
  const sections = getConsentItems(orgId, parkConfig.unit);
  const config = {
    ...parkConfig,
    orgId,
    sections,
  };

  const [acked, setAcked] = React.useState(() =>
    Object.fromEntries(sections.map(s => [s.id, Boolean(s.defaultChecked)]))
  );
  const [collapsed, setCollapsed] = React.useState(() =>
    Object.fromEntries(sections.map(s => [s.id, Boolean(s.defaultChecked)]))
  );
  const [master, setMaster] = React.useState(false);

  const ackedCount = Object.values(acked).filter(Boolean).length;
  const total = sections.length;
  const allAcked = ackedCount === total;
  const canSubmit = allAcked && master;

  const toggleCollapse = id => setCollapsed(c => ({ ...c, [id]: !c[id] }));
  const toggleAck = id => {
    setAcked(a => ({ ...a, [id]: !a[id] }));
    setCollapsed(c => ({ ...c, [id]: !acked[id] }));
  };
  const scrollToSection = id => {
    const el = document.getElementById("sec-" + id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setCollapsed(c => ({ ...c, [id]: false }));
  };

  return (
    <div data-screen-label="02 同意書（國家公園）">
      <Header active="apply" />
      <Breadcrumb trail={["登山申請", "登山線上申請", "申請須知與同意書"]} />

      <main className="th-page">
        <div className="th-page-inner">
          <h1 className="th-page-title">申請須知與同意書</h1>
          <Stepper current={2} />

          {/* 機關標頭 */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            marginBottom: 24, padding: "12px 16px",
            background: "var(--bg-mist)", borderRadius: "var(--r-md)",
            border: "1px solid var(--bg-mist-3)",
          }}>
            <span style={{
              width: 32, height: 32, borderRadius: "var(--r-sm)",
              background: config.color, display: "flex",
              alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <i className="ph-bold ph-mountains" style={{ color: "#fff", fontSize: 16 }}></i>
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: "var(--fs-sm)", color: "var(--fg-1)" }}>{config.parkName}</div>
              <div style={{ fontSize: "var(--fs-xs)", color: "var(--fg-3)" }}>
                {config.agencyName || config.parkName} · 入園許可申請同意書
              </div>
            </div>
          </div>

          {routeData && (
            <div className="p2-route-brief">
              <div>
                <span className="p2-route-brief-label">申請路線</span>
                <strong>{routeData.name}</strong>
                <span>{routeData.subroute}</span>
              </div>
              <div>
                <span className="p2-route-brief-label">舊系統參數</span>
                <code>cid={getParam("cid") || routeData.cId || "-"}</code>
                <code>fid={getParam("fid") || routeData.fId || "-"}</code>
                <code>camp_id={getParam("camp_id") || routeData.campId || "0"}</code>
              </div>
            </div>
          )}

          <div className="p2-layout">
            <div>
              <div className="p2-intro">
                <div className="p2-intro-icon"><i className="ph-bold ph-info"></i></div>
                <div>
                  <h2>請先閱讀以下說明後，始可進行後續之申請作業</h2>
                  <p>為了您的登山安全與行政審核作業順利，請逐項閱讀並勾選每組事項。完成所有勾選後，下方「同意並下一步」按鈕即可使用。</p>
                </div>
              </div>

              {sections.map((s, idx) => {
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
                {sections.map((s, i) => (
                  <li key={s.id} className={acked[s.id] ? "is-acked" : ""}>
                    <button onClick={() => scrollToSection(s.id)}>
                      <span className="p2-toc-dot"><span>{i + 1}</span></span>
                      <span>{s.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
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
                  {allAcked ? "請勾選總確認後繼續" : "請完成所有勾選後才能進入下一步"}
                </div>
              </div>
            </div>

            <label className={`p2-master-ack ${!allAcked ? "is-disabled" : ""}`}>
              <input type="checkbox" disabled={!allAcked} checked={master} onChange={e => setMaster(e.target.checked)} />
              <span className="p2-master-ack-box"></span>
              <span>本人已閱讀並充分瞭解上述注意事項，並會遵守國家公園、警政署各項規定。</span>
            </label>

            <div className="p2-footbar-actions">
              <button className="th-btn th-btn-ghost" onClick={() => window.location.href = "apply-1.html"}>
                <i className="fa-solid fa-arrow-left"></i>上一步
              </button>
              <button className="th-btn th-btn-primary" disabled={!canSubmit}
                onClick={() => window.location.href = nextUrl(config.nextPage)}>
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

// ===================================================================
// 摘要模式（forestry-area / police）
// ===================================================================
function SummaryPage({ unit }) {
  const cfg = SUMMARY_CONFIG[unit];
  if (!cfg) return null;

  const routeId = getParam("route");
  // 從 ROUTE_DATA 找路線名（若 RouteData 已載入）
  const routeData = (typeof ROUTE_DATA !== "undefined")
    ? ROUTE_DATA.find(r => r.id === routeId)
    : null;

  return (
    <div data-screen-label="02 申請前摘要">
      <Header active="apply" />
      <Breadcrumb trail={["登山申請", "登山線上申請", "申請前摘要"]} />

      <main className="th-page">
        <div className="th-page-inner" style={{ maxWidth: 680 }}>
          <h1 className="th-page-title">{cfg.title}</h1>
          <Stepper current={2} />

          {/* 路線資訊欄 */}
          {routeData && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              marginBottom: 24, padding: "12px 16px",
              background: "var(--bg-mist)", borderRadius: "var(--r-md)",
              border: "1px solid var(--bg-mist-3)",
            }}>
              <span style={{
                width: 32, height: 32, borderRadius: "var(--r-sm)",
                background: cfg.color, display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <i className={cfg.icon} style={{ color: "#fff", fontSize: 16 }}></i>
              </span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "var(--fs-sm)", color: "var(--fg-1)" }}>{routeData.name}</div>
                <div style={{ fontSize: "var(--fs-xs)", color: "var(--fg-3)" }}>{cfg.agencyName} · {routeData.subroute}</div>
              </div>
            </div>
          )}

          {/* 注意事項列表 */}
          <div style={{
            background: "var(--bg-1)", border: "1px solid var(--slate-200)",
            borderRadius: "var(--r-xl)", overflow: "hidden",
            boxShadow: "var(--sh-card)", marginBottom: 32,
          }}>
            <div style={{
              padding: "16px 20px", borderBottom: "1px solid var(--slate-200)",
              background: "var(--bg-mist)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <i className="ph-bold ph-info" style={{ color: cfg.color, fontSize: 18 }}></i>
              <span style={{ fontWeight: 700, fontSize: "var(--fs-sm)", color: "var(--fg-1)" }}>申請前請確認以下事項</span>
            </div>

            {cfg.notices.map((n, i) => (
              <div key={i} style={{
                display: "flex", gap: 14, padding: "16px 20px",
                borderBottom: i < cfg.notices.length - 1 ? "1px solid var(--slate-100)" : "none",
                background: n.warn ? "var(--warning-bg)" : "var(--bg-1)",
              }}>
                <span style={{
                  width: 32, height: 32, borderRadius: "var(--r-sm)", flexShrink: 0,
                  background: n.warn ? "#fef3c7" : "var(--bg-mist-2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <i className={n.icon} style={{ color: n.warn ? "var(--warning-fg)" : cfg.color, fontSize: 16 }}></i>
                </span>
                <div style={{
                  fontSize: "var(--fs-sm)", color: n.warn ? "var(--warning-fg)" : "var(--fg-2)",
                  lineHeight: "var(--lh-loose)", paddingTop: 6,
                }} dangerouslySetInnerHTML={{ __html: n.text }} />
              </div>
            ))}
          </div>

          {/* 操作按鈕 */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button className="th-btn th-btn-ghost" onClick={() => window.location.href = "apply-1.html"}>
              <i className="fa-solid fa-arrow-left"></i>上一步
            </button>
            <button className="th-btn th-btn-primary"
              onClick={() => window.location.href = nextUrl(cfg.nextPage)}>
              我已了解，進入申請<i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ===================================================================
// 入口：依 unit 分派模式
// ===================================================================
function Page2App() {
  const unit = getParam("unit") || "yushan";

  if (unit === "forestry-area" || unit === "police") {
    return <SummaryPage unit={unit} />;
  }
  // yushan / shei-pa / taroko（或無 unit 向下相容）
  return <NationalParkConsent unit={unit} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<Page2App />);
