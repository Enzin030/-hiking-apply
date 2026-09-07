/*
  宿營地與床位查詢（campsite.html）
  對應正式站 https://service.skyeyes.tw/hikenationpark/bed_1.aspx 等 11 張子頁。

  依 2026-09-02 使用者裁決：
  一、11 張子頁收成單一頁面，上層機關 Tab ＋ 次層類別子選（宿營地／路線），
      不做 11 張獨立頁；已實作雪霸的宿營地（bed_1）與路線（bed_10）、
      太魯閣的山屋（bed_4）與路線（bed_5），其餘 Tab 與子選出「待建置」標記。
  二、月曆格以餘額為主角（大字＋狀態色），其餘計數收進點格後的明細彈窗，
      欄位一項不減。各子選的計數項目數不同（雪霸路線 5 項、太魯閣山屋 3 項、
      太魯閣路線 4 項），一律取正式站原樣，不對齊成同一組。

  資料：components/CampsiteData.jsx（正式站實跑轉檔，37 個宿營地）
        components/CampsiteRouteData.jsx（正式站實跑轉檔，8 個登山口）
        components/CampsiteTarokoData.jsx（正式站實跑轉檔，14 處山屋＋19 條路線）
  版型沿用 shared.css 的 bulletin-* 查詢型骨架與 th-flag 狀態膠囊；
  月曆與兩個子選共用同一組 BedCalendar／DayModal，不另做一種版型。
  路線子選比宿營地多一張「登山口承載量」總表（登山口／平日／假日／備註），
  那是正式站 bed_10 未選取狀態的畫面，選了登山口後才換成月曆。

  餘額是即時資料，本頁是快照，畫面上明示擷取日期，不假裝即時查詢。
*/

/* 上層機關 Tab；built = 本雛形已建，其餘出待建置標記 */
const CAMPSITE_ORGS = [
  { key: "shei-pa",  label: "雪霸",           built: true },
  { key: "taroko",   label: "太魯閣",         built: true },
  { key: "yushan",   label: "玉山",           built: false },
  { key: "forestry", label: "林業及自然保育署", built: false },
];

/*
  次層類別子選。對應正式站的子頁：
    雪霸 宿營地 bed_1（已建）／路線 bed_10（已建）
    太魯閣 山屋 bed_4／路線 bed_5；玉山 宿營地 bed_6／單日往返 bed_7
    林業署 宿營地 bed_0／區域申請及抽籤 bed_11
  玉山另有抽籤結果 bed_3、抽籤日期 bed_8、可申請退費日期 bed_9 三張日期型子頁。
*/
const CAMPSITE_KINDS = {
  "shei-pa":  [{ key: "camp", label: "宿營地", built: true }, { key: "route", label: "路線", built: true }],
  taroko:     [{ key: "hut", label: "山屋", built: true }, { key: "route", label: "路線", built: true }],
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

/*
  當日明細網址：各子選對應正式站不同的 *main.aspx，本雛形未建當日隊伍明細頁，
  一律連回現行網站。節點參數名不統一——bed_1／bed_4／bed_10 是 node_id，
  bed_5 是 c_id，故由呼叫端傳入 idParam，不寫死。
*/
const detailUrl = (page, orgId, site, day, idParam = "node_id") =>
  `https://service.skyeyes.tw/hikenationpark/${page}?orgid=${orgId}&${idParam}=${site.id}&sdate=${day.sdate}`;

/* ── 當日明細彈窗（計數一項不少，各子選共用）── */
function DayModal({ site, day, onClose, snapshot, detailPage, orgId, idParam }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
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
              餘額為 {snapshot} 擷取之快照，實際可申請數量以線上申請流程查驗結果為準。
            </p>
          )}
          {day.sdate && (
            <p className="camp-daynote">
              當日申請隊伍明細：
              <a className="th-inline-link" href={detailUrl(detailPage, orgId, site, day, idParam)}
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
function BedCalendar({ site, onPick, weekHead }) {
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
        {weekHead.map((w) => (
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

/* ── 月曆下方圖例（宿營地與路線共用；項目數依該地點實際計數項目而定）── */
function CalLegend({ site, hint }) {
  return (
    <div className="camp-legend">
      <span className="th-flag is-yes"><i className="fa-solid fa-circle-check"></i>尚有餘額</span>
      <span className="th-flag is-no"><i className="fa-solid fa-circle-xmark"></i>已無餘額</span>
      <span className="camp-legend-hint">{hint || `點日期可看該日 ${site.labels.length} 項計數明細`}</span>
    </div>
  );
}

/*
  月份切換：正式站是「上個月／年月下拉／下個月」的 postback。
  本雛形的資料是單月快照，切月沒有資料可換，故停用並明說，
  不做點了沒反應的假按鈕。
*/
function MonthBar({ ym }) {
  return (
    <div className="camp-monthbar">
      <span className="camp-monthbar-btn th-todo-link">上個月</span>
      <span className="camp-month">{ym.year} 年 {ym.month} 月</span>
      <span className="camp-monthbar-btn th-todo-link">下個月</span>
    </div>
  );
}

/* 快照提醒（兩個子選共用，只有擷取日期與年月不同）*/
function SnapshotNote({ snapshot, ym }) {
  return (
    <Callout type="warning">
      餘額為 <strong>{snapshot}</strong> 自現行網站擷取的快照，非即時查詢結果；
      雛形資料僅含 {ym.year} 年 {ym.month} 月，故月份切換尚未建置。
    </Callout>
  );
}

/* ── 雪霸「宿營地」子選（正式站 bed_1）── */
function SheipaCampView() {
  const [draftSite, setDraftSite] = React.useState(SHEIPA_CAMPSITES[2].id); /* 預設七卡山莊 */
  const [siteId, setSiteId] = React.useState(SHEIPA_CAMPSITES[2].id);
  const [day, setDay] = React.useState(null);

  const site = SHEIPA_CAMPSITES.find((s) => s.id === siteId) || SHEIPA_CAMPSITES[0];
  const ym = site.ym || {};
  const submit = (e) => { e.preventDefault(); setSiteId(draftSite); setDay(null); };

  return (
    <React.Fragment>
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

      <MonthBar ym={ym} />
      <SnapshotNote snapshot={CAMPSITE_SNAPSHOT_DATE} ym={ym} />

      <BedCalendar site={site} onPick={setDay} weekHead={CAMPSITE_WEEK_HEAD} />
      <CalLegend site={site} />

      <SiteIntro site={site} />

      {day && (
        <DayModal site={site} day={day} onClose={() => setDay(null)}
                  snapshot={CAMPSITE_SNAPSHOT_DATE} detailPage="bed_1main.aspx" orgId={CAMPSITE_ORG_ID} />
      )}
    </React.Fragment>
  );
}

/*
  承載量總表的表頭在各子選有兩種形狀：
    雪霸 bed_10 是字串陣列（單層）；太魯閣 bed_4／bed_5 是列陣列，
    每格 { t 文字, c colSpan, r rowSpan }，bed_4 有兩層（平日／假日 底下是「山屋床位」）。
  統一正規化成 { rows, leaf }：rows 給 DataTable 還原合併表頭，
  leaf 是最上層那列（決定 tbody 的欄位與 data-label）。
*/
const normalizeHead = (head) => {
  if (!head || !head.length) return { rows: [], leaf: [] };
  if (typeof head[0] === "string") {
    const leaf = head.map((t) => ({ t, c: 1, r: 1 }));
    return { rows: [leaf], leaf };
  }
  return { rows: head, leaf: head[0] };
};

/*
  承載量總表的欄位。表頭取自實抓的 summary.head，不寫死，資料改了欄位跟著改。
  第一欄是名稱兼查詢入口，其餘依內容決定對齊：全數字置中、文字靠左。
  總表列數可能多於下拉選項——太魯閣 bed_4 的總表有 15 列，下拉只有 14 個（「天空營地」
  只列承載量、不開放查詢）。查不到對應節點的列出純文字，不給點了會跳錯地方的按鈕。
*/
const summaryColumns = (summary, nodes, onPick) => {
  const [nameHead, ...valueHeads] = normalizeHead(summary.head).leaf;
  const pickable = (r) => r.id && nodes.some((n) => n.id === r.id);
  return [
    {
      key: "name",
      label: nameHead ? nameHead.t : "名稱",
      render: (r) => (pickable(r) ? (
        <button type="button" className="th-btn th-btn-ghost th-btn-sm"
                onClick={() => onPick(r.id)}>{r.name}</button>
      ) : r.name),
    },
    ...valueHeads.map((h, i) => ({
      key: `c${i}`,
      label: h.t,
      align: summary.rows.every((r) => /^\d+$/.test(r.cols[i])) ? "center" : undefined,
      /* 正式站的空值以破折號表示，不臆造內容 */
      render: (r) => (r.cols[i] === "" ? "—" : r.cols[i]),
    })),
  ];
};

/*
  「承載量總表 ＋ 下拉查詢 ＋ 月曆」型的子選（雪霸路線 bed_10、太魯閣山屋 bed_4／
  路線 bed_5 等）。各機關差的只有資料與文案，版型一套。
  summary 傳 null 則不出總表。
*/
function NodeCalendarView({
  summary, nodes, weekHead, snapshot, orgId, detailPage, idParam,
  defaultIndex = 0, summaryTitle, summaryIcon, summaryUnit, summaryHint,
  selectLabel, selectIcon, calTitle,
}) {
  const fallback = nodes[defaultIndex] || nodes[0];
  const [draftNode, setDraftNode] = React.useState(fallback.id);
  const [nodeId, setNodeId] = React.useState(fallback.id);
  const [day, setDay] = React.useState(null);

  const node = nodes.find((n) => n.id === nodeId) || fallback;
  const ym = node.ym || {};
  const submit = (e) => { e.preventDefault(); setNodeId(draftNode); setDay(null); };
  /* 總表點名稱：下拉與月曆一起跳到該節點，等同正式站的 postback */
  const pick = (id) => { setDraftNode(id); setNodeId(id); setDay(null); };
  const head = summary ? normalizeHead(summary.head) : null;

  return (
    <React.Fragment>
      {summary && (
        <SectionCard title={summaryTitle} icon={summaryIcon}
                     note={`共 ${summary.rows.length} ${summaryUnit}`}>
          <DataTable columns={summaryColumns(summary, nodes, pick)} rows={summary.rows}
                     rowKey="name" className="th-table--zebra"
                     headRows={head.rows.length > 1 ? head.rows.map((hr) => hr.map((h) => ({
                       label: h.t, colSpan: h.c, rowSpan: h.r,
                     }))) : undefined} />
          <div className="camp-legend">
            <span className="camp-legend-hint">{summaryHint}</span>
          </div>
        </SectionCard>
      )}

      <form className="bulletin-card" onSubmit={submit}>
        <div className="bulletin-filter-row">
          <span className="bulletin-filter-label"><i className={selectIcon}></i>{selectLabel}</span>
          <select className="th-select camp-select" value={draftNode}
                  onChange={(e) => setDraftNode(e.target.value)} aria-label={selectLabel}>
            {nodes.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
          </select>
          <button type="submit" className="th-btn th-btn-primary">
            <i className="fa-solid fa-magnifying-glass"></i>查詢
          </button>
        </div>
      </form>

      <div className="bulletin-section-head">
        <h2 className="th-section-title">{calTitle}</h2>
        <span className="bulletin-count">{node.name}／共 <strong>{node.days.length}</strong> 天</span>
      </div>

      <MonthBar ym={ym} />
      <SnapshotNote snapshot={snapshot} ym={ym} />

      <BedCalendar site={node} onPick={setDay} weekHead={weekHead} />
      <CalLegend site={node} />

      {day && (
        <DayModal site={node} day={day} onClose={() => setDay(null)}
                  snapshot={snapshot} detailPage={detailPage} orgId={orgId} idParam={idParam} />
      )}
    </React.Fragment>
  );
}

/* ── 雪霸「路線」子選（正式站 bed_10）── */
function SheipaRouteView() {
  return (
    <NodeCalendarView
      summary={SHEIPA_ROUTE_SUMMARY} nodes={SHEIPA_ROUTE_NODES}
      weekHead={SHEIPA_ROUTE_WEEK_HEAD} snapshot={SHEIPA_ROUTE_SNAPSHOT_DATE}
      orgId={SHEIPA_ROUTE_ORG_ID} detailPage="bed_10main.aspx" idParam="node_id"
      /* 首項「自訂登山口」承載量為 0，預設落在雪山登山口 */
      defaultIndex={1}
      summaryTitle="登山口承載量" summaryIcon="fa-solid fa-person-hiking" summaryUnit="個登山口"
      /* 「每日承載量上限」是推導而非正式站原文，依據寫在 CampsiteRouteData.jsx 檔頭 */
      summaryHint="平日／假日為該登山口每日承載量上限；點登山口名稱可切換下方月曆。"
      selectLabel="登山口" selectIcon="fa-solid fa-person-hiking"
      calTitle="登山口每日餘額"
    />
  );
}

/* ── 太魯閣「山屋」子選（正式站 bed_4）── */
function TarokoHutView() {
  return (
    <NodeCalendarView
      summary={TAROKO_HUT_SUMMARY} nodes={TAROKO_HUT_NODES}
      weekHead={TAROKO_WEEK_HEAD} snapshot={TAROKO_SNAPSHOT_DATE}
      orgId={TAROKO_ORG_ID} detailPage={TAROKO_HUT_DETAIL_PAGE} idParam={TAROKO_HUT_ID_PARAM}
      summaryTitle="山屋床位承載量" summaryIcon="fa-solid fa-house-chimney" summaryUnit="處"
      /* 「山屋床位」是正式站 bed_4 表頭第二層的原文，非推導 */
      summaryHint="平日／假日底下的「山屋床位」為正式站表頭原文；點宿營地名稱可切換下方月曆。"
      selectLabel="宿營地" selectIcon="fa-solid fa-house-chimney"
      calTitle="山屋每日餘額"
    />
  );
}

/* ── 太魯閣「路線」子選（正式站 bed_5）── */
function TarokoRouteView() {
  return (
    <NodeCalendarView
      summary={TAROKO_ROUTE_SUMMARY} nodes={TAROKO_ROUTE_NODES}
      weekHead={TAROKO_WEEK_HEAD} snapshot={TAROKO_SNAPSHOT_DATE}
      orgId={TAROKO_ORG_ID} detailPage={TAROKO_ROUTE_DETAIL_PAGE} idParam={TAROKO_ROUTE_ID_PARAM}
      summaryTitle="路線承載量" summaryIcon="fa-solid fa-route" summaryUnit="條路線"
      /* 正式站 bed_5 未加註平日／假日的定義，也沒有說明區，不比照雪霸逕自推導 */
      summaryHint="平日／假日為正式站列出的承載量數值，正式站未加註其定義［待確認］；點路線名稱可切換下方月曆。"
      selectLabel="路線" selectIcon="fa-solid fa-route"
      calTitle="路線每日餘額"
    />
  );
}

/*
  子選 → 畫面。key 是「機關:類別」，對應正式站各張 bed_* 子頁。
  trail 是麵包屑末節，比照正式站 site_map.aspx 的頁名。
  沒列在這裡的組合就是還沒建，Tab 與 chip 會出待建置標記。
*/
const CAMPSITE_VIEWS = {
  "shei-pa:camp":  { view: SheipaCampView,  trail: "雪霸宿營地查詢" },
  "shei-pa:route": { view: SheipaRouteView, trail: "雪霸路線登山口查詢" },
  "taroko:hut":    { view: TarokoHutView,   trail: "太魯閣山屋查詢" },
  "taroko:route":  { view: TarokoRouteView, trail: "太魯閣路線查詢" },
};

/* 切機關時，原本的類別多半不存在（雪霸 camp → 太魯閣 hut），落回該機關第一個已建類別 */
const firstKind = (orgKey) => {
  const kinds = CAMPSITE_KINDS[orgKey] || [];
  const hit = kinds.find((k) => k.built) || kinds[0];
  return hit ? hit.key : "";
};

/* ── 主元件 ── */
function CampsiteApp() {
  const [org, setOrg] = React.useState("shei-pa");
  const [kind, setKind] = React.useState("camp");

  const pickOrg = (key) => { setOrg(key); setKind(firstKind(key)); };
  const current = CAMPSITE_VIEWS[`${org}:${kind}`] || CAMPSITE_VIEWS["shei-pa:camp"];
  const View = current.view;

  return (
    <div className="bg-white min-h-screen text-slate-800 antialiased">
      <Header active="campsite" />
      <PageShell
        trail={["宿營地與床位查詢", current.trail]}
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
                      onClick={() => pickOrg(o.key)}>
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

        {/* key 讓切子選時整個重掛，不把前一個子選的下拉／彈窗狀態帶過去 */}
        <View key={`${org}:${kind}`} />
      </PageShell>

      <ExperienceNav />
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<CampsiteApp />);
