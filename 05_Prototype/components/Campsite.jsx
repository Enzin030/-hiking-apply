/*
  宿營地與床位查詢（campsite.html）
  對應正式站 https://service.skyeyes.tw/hikenationpark/bed_1.aspx 等 11 張子頁。

  依 2026-09-02 使用者裁決：
  一、11 張子頁收成單一頁面，上層機關 Tab ＋ 次層類別子選（宿營地／路線），
      不做 11 張獨立頁；本次只實作雪霸宿營地，其餘 Tab 與子選出「待建置」標記。
  二、月曆格以餘額為主角（大字＋狀態色），其餘 6 項計數收進點格後的明細彈窗，
      欄位一項不減。

  資料：components/CampsiteData.jsx（正式站實跑轉檔，37 個宿營地）
  版型沿用 shared.css 的 bulletin-* 查詢型骨架與 th-flag 狀態膠囊；
  月曆本身是本頁專屬，寫在 styles/campsite.css。

  餘額是即時資料，本頁是快照，畫面上明示擷取日期，不假裝即時查詢。
*/

/* 上層機關 Tab；built = 本雛形已建，其餘出待建置標記 */
const CAMPSITE_ORGS = [
  { key: "shei-pa",  label: "雪霸",           built: true },
  { key: "taroko",   label: "太魯閣",         built: false },
  { key: "yushan",   label: "玉山",           built: false },
  { key: "forestry", label: "林業及自然保育署", built: false },
];

/*
  次層類別子選。對應正式站的子頁：
    雪霸 宿營地 bed_1（已建）／路線 bed_10
    太魯閣 山屋 bed_4／路線 bed_5；玉山 宿營地 bed_6／單日往返 bed_7
    林業署 宿營地 bed_0／區域申請及抽籤 bed_11
  玉山另有抽籤結果 bed_3、抽籤日期 bed_8、可申請退費日期 bed_9 三張日期型子頁。
*/
const CAMPSITE_KINDS = {
  "shei-pa":  [{ key: "camp", label: "宿營地", built: true }, { key: "route", label: "路線", built: false }],
  taroko:     [{ key: "hut", label: "山屋", built: false }, { key: "route", label: "路線", built: false }],
  yushan:     [{ key: "camp", label: "宿營地", built: false }, { key: "oneday", label: "單日往返路線", built: false },
               { key: "lot", label: "抽籤結果", built: false }, { key: "lotdate", label: "抽籤日期", built: false },
               { key: "refund", label: "可申請退費日期", built: false }],
  forestry:   [{ key: "camp", label: "宿營地", built: false }, { key: "area", label: "區域申請及抽籤", built: false }],
};

/* 餘額 0 視為已滿，其餘視為尚有餘額——正式站未提供每日承載量，不編造中間級距 */
const remainFlag = (value) => {
  const n = parseInt(String(value).replace(/[^\d]/g, ""), 10);
  if (!Number.isFinite(n)) return null;
  return n > 0 ? "is-yes" : "is-no";
};

/* ── 說明區（正式站 alert 原文，逐條保留，含 FB 社團連結）── */
function NoticeList() {
  return (
    <Callout>
      <ul className="camp-notice">
        {CAMPSITE_NOTICE.map((li, i) => (
          <li key={i}>
            {li.link ? (
              <React.Fragment>
                {li.text.split(li.link.text)[0]}
                <a className="th-inline-link" href={li.link.href} target="_blank" rel="noopener noreferrer">
                  <i className="fa-solid fa-arrow-up-right-from-square"></i>{li.link.text}
                </a>
                {li.text.split(li.link.text)[1]}
              </React.Fragment>
            ) : li.text}
          </li>
        ))}
      </ul>
    </Callout>
  );
}

/* 當日明細網址：正式站 bed_1main.aspx，本雛形未建當日隊伍明細頁 */
const detailUrl = (site, day) =>
  `https://service.skyeyes.tw/hikenationpark/bed_1main.aspx?orgid=${CAMPSITE_ORG_ID}&node_id=${site.id}&sdate=${day.sdate}`;

/* ── 當日明細彈窗（計數一項不少）── */
function DayModal({ site, day, onClose }) {
  if (!day) return null;
  /* 餘額固定是 labels 的第一項（正式站的排列順序） */
  const flag = remainFlag(day.v[0]);
  return (
    <div className="bulletin-modal-overlay" onClick={onClose}>
      <div className="bulletin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bulletin-modal-head">
          <div>
            <div className="bulletin-modal-meta">{site.name}</div>
            <h2 className="bulletin-modal-title">{day.sdate || `${day.d} 日`}</h2>
          </div>
          <button type="button" className="bulletin-modal-close" onClick={onClose} aria-label="關閉">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="bulletin-modal-body camp-daybody">
          <table className="th-table th-table--zebra camp-daytable">
            <tbody>
              {site.labels.map((label, i) => (
                <tr key={label}>
                  <th scope="row">{label}{label === "外籍提前" && <span className="camp-sub">（外國人＋本國人）</span>}</th>
                  <td className={label === "餘額" ? "camp-strong" : ""}>{day.v[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {flag && (
            <p className="camp-daynote">
              <span className={`th-flag ${flag}`}>
                <i className={flag === "is-yes" ? "fa-solid fa-circle-check" : "fa-solid fa-circle-xmark"}></i>
                {flag === "is-yes" ? "尚有餘額" : "已無餘額"}
              </span>
              餘額為 {CAMPSITE_SNAPSHOT_DATE} 擷取之快照，實際可申請數量以線上申請流程查驗結果為準。
            </p>
          )}
          {day.sdate && (
            <p className="camp-daynote">
              當日申請隊伍明細：
              <a className="th-inline-link" href={detailUrl(site, day)}
                 target="_blank" rel="noopener noreferrer">
                <i className="fa-solid fa-arrow-up-right-from-square"></i>查看明細
              </a>
              <span className="th-legacy-tag">前往現行網站</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── 月曆 ── */
function BedCalendar({ site, onPick }) {
  const byDay = {};
  site.days.forEach((d) => { byDay[d.d] = d; });
  const first = site.days[0];
  /* 第一天的星期決定月初留白格數 */
  const lead = first ? first.w : 0;
  const last = site.days[site.days.length - 1];
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = first ? first.d : 1; d <= (last ? last.d : 0); d++) cells.push(byDay[d] || { d, v: [] });
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="camp-cal">
      <div className="camp-cal-head">
        {/* 行動版七欄塞不下「星期日」，改顯示末字；兩種寫法都在 DOM，由 CSS 切換 */}
        {CAMPSITE_WEEK_HEAD.map((w) => (
          <div key={w} className="camp-cal-week">
            <span className="camp-cal-week-full">{w}</span>
            <span className="camp-cal-week-short">{w.slice(-1)}</span>
          </div>
        ))}
      </div>
      <div className="camp-cal-grid">
        {cells.map((c, i) => {
          if (!c) return <div key={i} className="camp-cal-cell is-blank"></div>;
          const remain = c.v[0];
          const flag = remainFlag(remain);
          if (!c.v.length) {
            return (
              <div key={i} className="camp-cal-cell is-empty">
                <span className="camp-cal-day">{c.d}</span>
                <span className="camp-cal-none">無資料</span>
              </div>
            );
          }
          return (
            <button key={i} type="button" className={`camp-cal-cell ${flag === "is-no" ? "is-full" : "is-open"}`}
                    onClick={() => onPick(c)}
                    aria-label={`${c.sdate} 餘額 ${remain}，查看當日明細`}>
              <span className="camp-cal-day">{c.d}</span>
              <span className="camp-cal-remain">{remain}</span>
              <span className="camp-cal-unit">餘額</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── 宿營地介紹卡 ── */
function SiteIntro({ site }) {
  const intro = site.intro;
  if (!intro) {
    return (
      <Callout type="warning">
        「{site.name}」在正式站沒有提供宿營地介紹（海拔、水源、訊號等），此處不補寫。
      </Callout>
    );
  }
  return (
    <SectionCard title={site.name} icon="fa-solid fa-tent">
      <div className="camp-intro">
        {intro.image && (
          <figure className="camp-intro-pic">
            <img src={intro.image} alt={`${site.name}實景`} loading="lazy" />
          </figure>
        )}
        <div className="camp-intro-body">
          <ul className="camp-intro-lines">
            {intro.lines.map((l, i) => <li key={i}>{l}</li>)}
          </ul>
          <div className="camp-intro-tags">
            {intro.waters && <span className="camp-tag"><i className="fa-solid fa-droplet"></i>{intro.waters.replace(/、$/, "")}</span>}
            {intro.signals && <span className="camp-tag"><i className="fa-solid fa-tower-broadcast"></i>{intro.signals.replace(/、$/, "")}</span>}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

/* ── 主元件 ── */
function CampsiteApp() {
  const [org, setOrg] = React.useState("shei-pa");
  const [kind, setKind] = React.useState("camp");
  const [draftSite, setDraftSite] = React.useState(SHEIPA_CAMPSITES[2].id); /* 預設七卡山莊 */
  const [siteId, setSiteId] = React.useState(SHEIPA_CAMPSITES[2].id);
  const [day, setDay] = React.useState(null);

  const site = SHEIPA_CAMPSITES.find((s) => s.id === siteId) || SHEIPA_CAMPSITES[0];
  const ym = site.ym || {};

  React.useEffect(() => {
    if (!day) return;
    const onKey = (e) => { if (e.key === "Escape") setDay(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [day]);

  const submit = (e) => { e.preventDefault(); setSiteId(draftSite); setDay(null); };

  return (
    <div className="bg-white min-h-screen text-slate-800 antialiased">
      <Header active="campsite" />
      <PageShell
        trail={["宿營地與床位查詢", "雪霸宿營地查詢"]}
        title="宿營地與床位查詢"
        bare
      >

        {/* 上層：機關 */}
        <div className="bulletin-tabs">
          <nav className="bulletin-tabs-nav" aria-label="管理機關">
            {CAMPSITE_ORGS.map((o) => o.built ? (
              <button key={o.key} type="button"
                      className={`bulletin-tab ${org === o.key ? "is-active" : ""}`}
                      aria-current={org === o.key ? "page" : undefined}
                      onClick={() => setOrg(o.key)}>
                <i className="fa-solid fa-mountain-sun"></i><span>{o.label}</span>
              </button>
            ) : (
              /* 尚未建置的機關不給可點的 Tab */
              <span key={o.key} className="bulletin-tab is-todo th-todo-link">{o.label}</span>
            ))}
          </nav>
        </div>

        {/* 次層：類別 */}
        <div className="bulletin-filter-row camp-kindrow">
          <span className="bulletin-filter-label"><i className="fa-solid fa-layer-group"></i>查詢類別</span>
          {(CAMPSITE_KINDS[org] || []).map((k) => k.built ? (
            <button key={k.key} type="button"
                    className={`th-chip ${kind === k.key ? "is-active" : ""}`}
                    aria-pressed={kind === k.key}
                    onClick={() => setKind(k.key)}>
              {k.label}
            </button>
          ) : (
            <span key={k.key} className="th-chip is-todo th-todo-link">{k.label}</span>
          ))}
        </div>

        <NoticeList />

        <form className="bulletin-card" onSubmit={submit}>
          <div className="bulletin-filter-row">
            <span className="bulletin-filter-label"><i className="fa-solid fa-tent"></i>宿營地點</span>
            <select className="th-select camp-select" value={draftSite}
                    onChange={(e) => setDraftSite(e.target.value)} aria-label="宿營地點">
              {SHEIPA_CAMPSITES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <button type="submit" className="th-btn th-btn-primary">
              <i className="fa-solid fa-magnifying-glass"></i>查詢
            </button>
          </div>
        </form>

        <div className="bulletin-section-head">
          <h2 className="th-section-title">山屋／營地概況</h2>
          <span className="bulletin-count">{site.name}／共 <strong>{site.days.length}</strong> 天</span>
        </div>

        {/*
          月份切換：正式站是「上個月／年月下拉／下個月」的 postback。
          本雛形的資料是單月快照，切月沒有資料可換，故停用並明說，
          不做點了沒反應的假按鈕。
        */}
        <div className="camp-monthbar">
          <span className="camp-monthbar-btn th-todo-link">上個月</span>
          <span className="camp-month">{ym.year} 年 {ym.month} 月</span>
          <span className="camp-monthbar-btn th-todo-link">下個月</span>
        </div>

        <Callout type="warning">
          餘額為 <strong>{CAMPSITE_SNAPSHOT_DATE}</strong> 自現行網站擷取的快照，非即時查詢結果；
          雛形資料僅含 {ym.year} 年 {ym.month} 月，故月份切換尚未建置。
        </Callout>

        <BedCalendar site={site} onPick={setDay} />

        <div className="camp-legend">
          <span className="th-flag is-yes"><i className="fa-solid fa-circle-check"></i>尚有餘額</span>
          <span className="th-flag is-no"><i className="fa-solid fa-circle-xmark"></i>已無餘額</span>
          <span className="camp-legend-hint">點日期可看該日 {CAMPSITE_COUNT_LABELS.length} 項計數明細</span>
        </div>

        <SiteIntro site={site} />
      </PageShell>

      <ExperienceNav />
      <Footer />

      {day && <DayModal site={site} day={day} onClose={() => setDay(null)} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<CampsiteApp />);
