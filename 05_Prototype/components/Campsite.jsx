/*
  宿營地與床位查詢（campsite.html）
  對應正式站 https://service.skyeyes.tw/hikenationpark/bed_1.aspx 等 11 張子頁。

  依 2026-09-02 使用者裁決：
  一、11 張子頁收成單一頁面，上層機關 Tab ＋ 次層類別子選，不做 11 張獨立頁。
      已實作：雪霸宿營地（bed_1）／路線（bed_10）、太魯閣山屋（bed_4）／路線（bed_5）、
      林業署宿營地（bed_0）／區域申請及抽籤（bed_11）。玉山五個子選尚未建置。
  二、月曆格以主要數字為主角（大字），其餘計數收進點格後的明細彈窗，欄位一項不減。
      各子選的計數項目不一致，一律取正式站原樣，不對齊成同一組：
      雪霸宿營地 7 項、雪霸路線 5 項、太魯閣山屋 3 項、太魯閣路線 4 項、
      林業署區域 2 項（剩餘數量／現在申請量，且「剩餘數量」非每日都有）。

  資料：components/CampsiteData.jsx（雪霸宿營地，37 個）
        components/CampsiteRouteData.jsx（雪霸路線，8 個登山口）
        components/CampsiteTarokoData.jsx（太魯閣，14 處山屋＋19 條路線）
        components/CampsiteForestryData.jsx（林業署，4 個宿營地＋25 個區域）
        皆為正式站實跑轉檔，腳本在 .scratch/outputs/，非手抄。
  版型沿用 shared.css 的 bulletin-* 查詢型骨架與 th-flag 狀態膠囊。
  兩種月曆：BedCalendar／DayModal 給有「餘額」概念的雪霸與太魯閣；
  ForestryCalendar／ForestryDayModal 給林業署——後者沒有餘額，0 不等於額滿，
  不能套 remainFlag 的紅／綠語意，故分開寫，不硬塞成同一個元件。

  餘額與申請量都是即時資料，本頁是快照，畫面上明示擷取日期，不假裝即時查詢。
*/

/* 上層機關 Tab；built = 本雛形已建，其餘出待建置標記 */
const CAMPSITE_ORGS = [
  { key: "shei-pa",  label: "雪霸",           built: true },
  { key: "taroko",   label: "太魯閣",         built: true },
  { key: "yushan",   label: "玉山",           built: false },
  { key: "forestry", label: "林業及自然保育署", built: true },
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
  forestry:   [{ key: "camp", label: "宿營地", built: true }, { key: "area", label: "區域申請及抽籤", built: true }],
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
function SnapshotNote({ snapshot, ym, metric = "餘額" }) {
  return (
    <Callout type="warning">
      {/* metric：林業署的區域查詢沒有「餘額」，主數字是「現在申請量」，不能沿用同一句 */}
      {metric}為 <strong>{snapshot}</strong> 自現行網站擷取的快照，非即時查詢結果；
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
  /*
    列 key 優先用正式站的節點代碼；只有在有列缺 id 或 id 重複時才退回名稱
    （bed_4 的「天空營地」那類只列承載量、不開放查詢的列）。
    不一律用名稱——名稱在跨機關的資料裡不保證唯一。
  */
  const summaryKey = summary && summary.rows.every((r) => r.id)
    && new Set(summary.rows.map((r) => r.id)).size === summary.rows.length ? "id" : "name";

  return (
    <React.Fragment>
      {summary && (
        <SectionCard title={summaryTitle} icon={summaryIcon}
                     note={`共 ${summary.rows.length} ${summaryUnit}`}>
          <DataTable columns={summaryColumns(summary, nodes, pick)} rows={summary.rows}
                     rowKey={summaryKey} className="th-table--zebra"
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

/* ══════════ 林業及自然保育署（bed_0 宿營地／bed_11 區域申請及抽籤）══════════
   這兩張子頁與雪霸／太魯閣不同構，不能套 NodeCalendarView：
     沒有承載量總表；日格不是「餘額」而是「查無資料」（bed_0）
     或「剩餘數量／現在申請量」（bed_11）；當日連結是抽籤結果不是隊伍明細。
   依據與實測見 components/CampsiteForestryData.jsx 檔頭。
   本段刻意不動 Shared.jsx 與 shared.css，只沿用既有 class。
*/

/*
  林業署月曆。與 BedCalendar 分開寫，因為：
  一、沒有「餘額」概念，0 不等於額滿，不能套 remainFlag 的紅／綠語意；
  二、計數項目每日不一致（「剩餘數量」非每日都有）。
  主要數字由 primaryLabel 指定，找不到該項就退回第一項；完全沒有計數的日子出 note 原文。
*/
function ForestryCalendar({ site, weekHead, primaryLabel, onPick }) {
  const byDay = {};
  site.days.forEach((d) => { byDay[d.d] = d; });
  const first = site.days[0];
  const lead = first ? first.w : 0;
  const last = site.days[site.days.length - 1];
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = first ? first.d : 1; d <= (last ? last.d : 0); d++) cells.push(byDay[d] || { d, counts: [], note: "" });
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="camp-cal">
      <div className="camp-cal-head">
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
          const counts = c.counts || [];
          if (!counts.length) {
            return (
              <div key={i} className="camp-cal-cell is-empty">
                <span className="camp-cal-day">{c.d}</span>
                {/*
                  正式站寫「查無資料」就照抄；正式站留空白的日子（bed_0 是當月前 11 天）
                  這裡也留空，不自己補「無資料」四個字冒充正式站的說法。
                */}
                {c.note && <span className="camp-cal-none">{c.note}</span>}
              </div>
            );
          }
          const main = counts.find((x) => x.label === primaryLabel) || counts[0];
          return (
            <button key={i} type="button" className="camp-cal-cell is-open"
                    onClick={() => onPick(c)}
                    aria-label={`${c.sdate || `${c.d} 日`} ${main.label} ${main.value}，查看該日明細`}>
              <span className="camp-cal-day">{c.d}</span>
              <span className="camp-cal-remain">{main.value}</span>
              <span className="camp-cal-unit">{main.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/*
  林業署當日明細彈窗。計數一項不少；有抽籤結果連結的日子才給連結，
  沒有的不給假連結。抽籤結果網址＝正式站 bed_11Detail.aspx，本雛形未建該頁。
*/
function ForestryDayModal({ site, day, onClose, snapshot, catId }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  if (!day) return null;
  const lotUrl = day.sdate && catId
    ? `https://service.skyeyes.tw/hikenationpark/bed_11Detail.aspx?orgCode=${catId}&areaCode=${site.id}&sdate=${day.sdate}`
    : "";
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
              {(day.counts || []).map((c) => (
                <tr key={c.label}>
                  <th scope="row">{c.label}</th>
                  <td>{c.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="camp-daynote">
            本頁為 {snapshot} 擷取之快照，實際數量以線上申請流程查驗結果為準。
          </p>
          {lotUrl ? (
            <p className="camp-daynote">
              當日抽籤結果：
              <a className="th-inline-link" href={lotUrl} target="_blank" rel="noopener noreferrer">
                <i className="fa-solid fa-arrow-up-right-from-square"></i>查詢抽籤結果
              </a>
              <span className="th-legacy-tag">前往現行網站</span>
            </p>
          ) : (
            <p className="camp-daynote">該日正式站未提供抽籤結果連結。</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── 林業署「宿營地」子選（正式站 bed_0）── */
function ForestryCampView() {
  const [draftSite, setDraftSite] = React.useState(FORESTRY_CAMP_SITES[0].id);
  const [siteId, setSiteId] = React.useState(FORESTRY_CAMP_SITES[0].id);
  const [day, setDay] = React.useState(null);

  const site = FORESTRY_CAMP_SITES.find((s) => s.id === siteId) || FORESTRY_CAMP_SITES[0];
  const ym = site.ym || {};
  const submit = (e) => { e.preventDefault(); setSiteId(draftSite); setDay(null); };
  const withData = site.days.filter((d) => (d.counts || []).length).length;

  return (
    <React.Fragment>
      {/*
        正式站現況：四個宿營地 × 9-12 月，每一格都是「查無資料」。
        依 2026-09-07 使用者裁決照實呈現空月曆，並在上方明說，不假造數字。
      */}
      <Callout type="warning">
        正式站的林業及自然保育署宿營地查詢<strong>目前沒有任何可用資料</strong>——
        2026-09-07 實測 {FORESTRY_CAMP_SITES.length} 個宿營地、9 至 12 月，每一天都顯示「查無資料」，
        既無承載量也無當日明細。下方月曆照實呈現該現況。
        <span className="th-todo-link">［待確認］正式站為何長期無資料，需向機關確認；
        待機關上架後重抓快照。</span>
      </Callout>

      <form className="bulletin-card" onSubmit={submit}>
        <div className="bulletin-filter-row">
          <span className="bulletin-filter-label"><i className="fa-solid fa-tent"></i>宿營地</span>
          <select className="th-select camp-select" value={draftSite}
                  onChange={(e) => setDraftSite(e.target.value)} aria-label="宿營地">
            {FORESTRY_CAMP_SITES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button type="submit" className="th-btn th-btn-primary">
            <i className="fa-solid fa-magnifying-glass"></i>查詢
          </button>
        </div>
      </form>

      <div className="bulletin-section-head">
        <h2 className="th-section-title">宿營地每日狀況</h2>
        <span className="bulletin-count">
          {site.name}／共 <strong>{site.days.length}</strong> 天，其中有資料 <strong>{withData}</strong> 天
        </span>
      </div>

      <MonthBar ym={ym} />

      <ForestryCalendar site={site} weekHead={FORESTRY_WEEK_HEAD}
                        primaryLabel="現在申請量" onPick={setDay} />

      {day && (
        <ForestryDayModal site={site} day={day} onClose={() => setDay(null)}
                          snapshot={FORESTRY_SNAPSHOT_DATE} catId="" />
      )}
    </React.Fragment>
  );
}

/*
  ── 林業署「區域申請及抽籤」子選（正式站 bed_11）──
  兩層下拉照正式站保留：區域類別 → 區域名稱。不得壓平成一層
  （2026-09-02 決策，open.html 已有前例：一顆鈕蓋掉三個 GUID 會漏筆）。
*/
function ForestryAreaView() {
  /*
    預設落在第一個查得到月曆的區域——第一類別的第一項「插天山自然保留區」
    在正式站是總項、按查詢不出月曆，拿它當預設會讓人以為頁面壞了。
  */
  const firstArea = FORESTRY_AREA_CATS[0].areas.find((a) => a.hasCalendar) || FORESTRY_AREA_CATS[0].areas[0];
  const [draftCat, setDraftCat] = React.useState(FORESTRY_AREA_CATS[0].id);
  const [draftArea, setDraftArea] = React.useState(firstArea.id);
  const [picked, setPicked] = React.useState({ cat: FORESTRY_AREA_CATS[0].id, area: firstArea.id });
  const [day, setDay] = React.useState(null);

  const draftCatObj = FORESTRY_AREA_CATS.find((c) => c.id === draftCat) || FORESTRY_AREA_CATS[0];
  const cat = FORESTRY_AREA_CATS.find((c) => c.id === picked.cat) || FORESTRY_AREA_CATS[0];
  const area = cat.areas.find((a) => a.id === picked.area) || cat.areas[0];
  const ym = area.ym || {};

  /* 換第一層要跟著換第二層的預設值，否則會留著上一個類別的區域 */
  const pickCat = (id) => {
    const next = FORESTRY_AREA_CATS.find((c) => c.id === id);
    setDraftCat(id);
    setDraftArea(next && next.areas[0] ? next.areas[0].id : "");
  };
  const submit = (e) => { e.preventDefault(); setPicked({ cat: draftCat, area: draftArea }); setDay(null); };

  return (
    <React.Fragment>
      <form className="bulletin-card" onSubmit={submit}>
        <div className="bulletin-filter-row">
          <span className="bulletin-filter-label"><i className="fa-solid fa-layer-group"></i>區域類別</span>
          <select className="th-select camp-select" value={draftCat}
                  onChange={(e) => pickCat(e.target.value)} aria-label="區域類別">
            {FORESTRY_AREA_CATS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <span className="bulletin-filter-label"><i className="fa-solid fa-mountain"></i>區域名稱</span>
          <select className="th-select camp-select" value={draftArea}
                  onChange={(e) => setDraftArea(e.target.value)} aria-label="區域名稱">
            {draftCatObj.areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <button type="submit" className="th-btn th-btn-primary">
            <i className="fa-solid fa-magnifying-glass"></i>查詢
          </button>
        </div>
      </form>

      <div className="bulletin-section-head">
        <h2 className="th-section-title">區域每日申請量</h2>
        <span className="bulletin-count">
          {cat.name}／{area.name}
          {area.hasCalendar && <React.Fragment>／共 <strong>{area.days.length}</strong> 天</React.Fragment>}
        </span>
      </div>

      {area.hasCalendar ? (
        <React.Fragment>
          <MonthBar ym={ym} />
          <SnapshotNote snapshot={FORESTRY_SNAPSHOT_DATE} ym={ym} metric="申請量" />
          <ForestryCalendar site={area} weekHead={FORESTRY_WEEK_HEAD}
                            primaryLabel="現在申請量" onPick={setDay} />
          <div className="camp-legend">
            <span className="camp-legend-hint">
              數字為該日「現在申請量」；有申請量的日期另有「剩餘數量」，
              點日期可看全部計數與抽籤結果連結。
            </span>
          </div>
        </React.Fragment>
      ) : (
        /* 正式站按查詢後不出月曆，重試三次確認過；不編造空月曆冒充有查到 */
        <Callout type="warning">
          正式站對「{area.name}」按查詢後<strong>不會出現月曆</strong>（2026-09-07 實測三次皆然）。
          {area.name === "插天山自然保留區" && (
            <React.Fragment>該項在正式站是總項，實際可查的是其下三條路線
            （福巴越嶺步道／北插天山步道及其支線／其他路線），請於上方「區域名稱」改選。</React.Fragment>
          )}
          <span className="th-todo-link">［待確認］此為停用、無開放申請或其他原因，正式站未說明。</span>
        </Callout>
      )}

      {day && (
        <ForestryDayModal site={area} day={day} onClose={() => setDay(null)}
                          snapshot={FORESTRY_SNAPSHOT_DATE} catId={cat.id} />
      )}
    </React.Fragment>
  );
}

/*
  子選 → 畫面。key 是「機關:類別」，對應正式站各張 bed_* 子頁。
  trail 是麵包屑末節，比照正式站 site_map.aspx 的頁名。
  沒列在這裡的組合就是還沒建，Tab 與 chip 會出待建置標記。
*/
const CAMPSITE_VIEWS = {
  "shei-pa:camp":  { view: SheipaCampView,   trail: "雪霸宿營地查詢" },
  "shei-pa:route": { view: SheipaRouteView,  trail: "雪霸路線登山口查詢" },
  "taroko:hut":    { view: TarokoHutView,    trail: "太魯閣山屋查詢" },
  "taroko:route":  { view: TarokoRouteView,  trail: "太魯閣路線查詢" },
  "forestry:camp": { view: ForestryCampView, trail: "林業及自然保育署宿營地查詢" },
  "forestry:area": { view: ForestryAreaView, trail: "林業及自然保育署區域申請及抽籤查詢" },
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
