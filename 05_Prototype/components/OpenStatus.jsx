/*
  登山路線開放狀態（open.html）
  對應正式站 https://service.skyeyes.tw/hikenationpark/open.aspx

  版型沿用公佈欄那套查詢型骨架（shared.css 的 bulletin-* 篩選卡／表格／分頁），
  後續「宿營地與床位查詢」等查詢頁一併複用；本頁專屬的分組表頭與 11 欄欄寬寫在 styles/open.css；
  狀態膠囊（th-flag）與分頁一併放進 shared.css，供後續查詢頁複用。

  資料：components/OpenStatusData.jsx（正式站實跑查詢轉檔，479 列）
  難度等級說明：components/TrailLevelData.jsx（與 information_6.html 共用）

  與正式站刻意不同之處：
  一、正式站未按查詢前表格顯示「尚無資料」，本頁載入即列出全部路線（分頁呈現）。
  二、正式站路線下拉只有 447 條，另有 25 條（外籍提前變體與部分警政署路線）
      在表格中出現卻選不到；本頁下拉改由 479 列的主路線衍生，每一列都篩得到。
  三、「介紹」對應的路線介紹頁尚未建置，依 2026-09-02 決策標示待建置，不給假連結。
*/

const PAGE_SIZE = 20;

/* 可否申請：正式站 fas fa-check / fas fa-times */
const CAN_APPLY_META = {
  yes: { label: "可申請", icon: "fa-solid fa-circle-check", cls: "is-yes" },
  no:  { label: "不可申請", icon: "fa-solid fa-circle-xmark", cls: "is-no" },
};

/*
  路線現況：正式站圖例列了四種，實際資料目前只出現 open 與 closed 兩種；
  proof 與 snow 保留定義（圖例照樣呈現），待有實例再驗。
*/
const STATUS_META = {
  open:   { label: "本日開放", icon: "fa-regular fa-circle-check", cls: "is-open" },
  closed: { label: "本日關閉", icon: "fa-solid fa-ban", cls: "is-closed" },
  proof:  { label: "依規檢附登山經驗證明", icon: "fa-solid fa-triangle-exclamation", cls: "is-proof" },
  snow:   { label: "雪季", icon: "fa-regular fa-snowflake", cls: "is-snow" },
};

/* orgLabel → bulletin-badge 的既有機關配色 */
const ORG_BADGE = {
  "太管處": "taroko",
  "雪管處": "sheipa",
  "玉管處": "yushan",
  "自然保留區": "forestry",
  "自然保護區": "forestry",
  "野生動物保護區": "forestry",
  "國家步道(山屋/營地)": "forestry",
  "警政署入山": "police",
};

/* 是否須要申請的四個子欄（欄名照正式站表頭，不合併） */
const NEED_COLUMNS = [
  { key: "needParkPermit",     label: "入園證" },
  { key: "needReserve",        label: "林業及自然保育署自然保護留區" },
  { key: "needForestStay",     label: "林業及自然保育署住宿" },
  { key: "needMountainPermit", label: "警政署入山證" },
];

const EMPTY_FILTER = { org: "all", mainRoute: "all", q: "" };

/* ── 圖例 ── */
function Legend() {
  return (
    <div className="open-legend">
      <div className="open-legend-row">
        <span className="open-legend-label">可否申請</span>
        {["yes", "no"].map((k) => (
          <span key={k} className={`th-flag ${CAN_APPLY_META[k].cls}`}>
            <i className={CAN_APPLY_META[k].icon}></i>{CAN_APPLY_META[k].label}
          </span>
        ))}
      </div>
      <div className="open-legend-row">
        <span className="open-legend-label">路線現況</span>
        {["open", "closed", "proof", "snow"].map((k) => (
          <span key={k} className={`th-flag ${STATUS_META[k].cls}`}>
            <i className={STATUS_META[k].icon}></i>{STATUS_META[k].label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── 難度等級彈窗（內容與步道分級頁同一份 TRAIL_LEVELS）── */
function LevelModal({ level, onClose }) {
  const row = TRAIL_LEVELS.find((r) => r.level === level);
  if (!row) return null;
  return (
    <div className="bulletin-modal-overlay" onClick={onClose}>
      <div className="bulletin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bulletin-modal-head">
          <div>
            <div className="bulletin-modal-meta">登山路線難度等級</div>
            <h2 className="bulletin-modal-title">第 {row.level} 級</h2>
          </div>
          <button type="button" className="bulletin-modal-close" onClick={onClose} aria-label="關閉">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="bulletin-modal-body open-modal-def">
          <dl>
            <dt>說明</dt>
            <dd>
              {Array.isArray(row.desc)
                ? <ol className="th-cell-ol">{row.desc.map((d) => <li key={d}>{d}</li>)}</ol>
                : row.desc}
            </dd>
            <dt>適合對象</dt>
            <dd>{row.who}</dd>
            <dt>建議裝備</dt>
            <dd>
              {row.kitRef ? (
                <span>
                  請參考
                  <a className="th-inline-link" href={KIT_PDF} target="_blank" rel="noopener noreferrer">
                    <i className="fa-solid fa-file-pdf"></i>個人及團體裝備檢查表
                  </a>
                  {row.kitRef}
                </span>
              ) : row.kit}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
}

/* ── 備註彈窗 ── */
function NoteModal({ row, onClose }) {
  if (!row) return null;
  return (
    <div className="bulletin-modal-overlay" onClick={onClose}>
      <div className="bulletin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bulletin-modal-head">
          <div>
            <div className="bulletin-modal-meta">登山路線備註</div>
            <h2 className="bulletin-modal-title">{row.name}</h2>
          </div>
          <button type="button" className="bulletin-modal-close" onClick={onClose} aria-label="關閉">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="bulletin-modal-body">
          {row.note}
          {row.closures.length > 0 && (
            <div className="open-closures">
              <p className="open-closures-title">部分關閉日期、原因</p>
              <ul>{row.closures.map((c) => <li key={c}>{c}</li>)}</ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── 主元件 ── */
function OpenStatusApp() {
  const [draft, setDraft] = React.useState(EMPTY_FILTER);
  const [filter, setFilter] = React.useState(EMPTY_FILTER);
  const [page, setPage] = React.useState(1);
  const [levelModal, setLevelModal] = React.useState(null);
  const [noteModal, setNoteModal] = React.useState(null);

  const setField = (patch) => setDraft((d) => Object.assign({}, d, patch));

  /* 主路線下拉隨機關連動（正式站也是選機關後才重整路線下拉） */
  const mainRoutes = React.useMemo(() => {
    const pool = draft.org === "all"
      ? OPEN_STATUS_ROWS
      : OPEN_STATUS_ROWS.filter((r) => r.filterKey === draft.org);
    return [...new Set(pool.map((r) => r.mainRoute))].sort((a, b) => a.localeCompare(b, "zh-Hant"));
  }, [draft.org]);

  const rows = React.useMemo(() => {
    const q = filter.q.trim();
    return OPEN_STATUS_ROWS.filter((r) => {
      if (filter.org !== "all" && r.filterKey !== filter.org) return false;
      if (filter.mainRoute !== "all" && r.mainRoute !== filter.mainRoute) return false;
      if (q && !(r.name.includes(q) || r.mainRoute.includes(q) || r.orgLabel.includes(q) || r.note.includes(q))) return false;
      return true;
    });
  }, [filter]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const submit = (e) => {
    e.preventDefault();
    setFilter(draft);
    setPage(1);
  };
  const reset = () => {
    setDraft(EMPTY_FILTER);
    setFilter(EMPTY_FILTER);
    setPage(1);
  };

  /* 切換機關時，原本選定的主路線可能已不在新清單內 */
  const changeOrg = (org) => setField({ org, mainRoute: "all" });

  React.useEffect(() => {
    if (!levelModal && !noteModal) return;
    const onKey = (e) => { if (e.key === "Escape") { setLevelModal(null); setNoteModal(null); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [levelModal, noteModal]);

  return (
    <div className="bg-white min-h-screen text-slate-800 antialiased">
      <Header active="status" />
      <Breadcrumb trail={["首頁", "登山路線開放狀態"]} />

      <main className="th-page">
        <div className="th-page-inner">
          <h1 className="th-page-title">登山路線開放狀態</h1>

          <form className="bulletin-card" onSubmit={submit}>
            <div className="bulletin-filter-row">
              <span className="bulletin-filter-label">
                <i className="fa-solid fa-building"></i>機關
              </span>
              {OPEN_ORG_BUTTONS.map((o) => (
                <button
                  key={o.key}
                  type="button"
                  className={`bulletin-chip ${draft.org === o.key ? "is-active" : ""}`}
                  aria-pressed={draft.org === o.key}
                  onClick={() => changeOrg(o.key)}
                >
                  {o.label}
                </button>
              ))}
            </div>

            <div className="bulletin-filter-row">
              <span className="bulletin-filter-label">
                <i className="fa-solid fa-route"></i>登山主路線
              </span>
              <select
                className="bulletin-select open-select"
                value={draft.mainRoute}
                onChange={(e) => setField({ mainRoute: e.target.value })}
                aria-label="登山主路線"
              >
                <option value="all">全部路線（{mainRoutes.length} 條主路線）</option>
                {mainRoutes.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="bulletin-filter-row">
              <span className="bulletin-filter-label">
                <i className="fa-solid fa-magnifying-glass"></i>關鍵字查詢
              </span>
              <div className="bulletin-search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  className="bulletin-input"
                  placeholder="請輸入路線名稱、主路線或備註關鍵字"
                  value={draft.q}
                  onChange={(e) => setField({ q: e.target.value })}
                />
              </div>
              <button type="submit" className="bulletin-btn">
                <i className="fa-solid fa-magnifying-glass"></i>查詢
              </button>
              <button type="button" className="bulletin-btn bulletin-btn--ghost" onClick={reset}>
                <i className="fa-solid fa-rotate-left"></i>清除條件
              </button>
            </div>
          </form>

          <div className="bulletin-section-head">
            <h2 className="th-section-title">路線申請對照資訊</h2>
            <span className="bulletin-count">
              共 <strong>{rows.length}</strong> 筆
              {rows.length > 0 && <span>／第 {page} 頁（共 {totalPages} 頁）</span>}
            </span>
          </div>

          <Legend />

          <div className="bulletin-table-wrap open-table-wrap">
            <table className="bulletin-table open-table">
              <thead>
                <tr>
                  <th rowSpan="2" className="col-org">機關</th>
                  <th rowSpan="2" className="col-main">登山主路線</th>
                  <th rowSpan="2" className="col-name2">路線名稱</th>
                  <th rowSpan="2" className="col-can">可否申請</th>
                  <th rowSpan="2" className="col-status">路線現況</th>
                  <th colSpan="4" className="col-needs">是否須要申請</th>
                  <th rowSpan="2" className="col-level">登山路線<br />難度等級</th>
                  <th rowSpan="2" className="col-fn">功能</th>
                </tr>
                <tr>
                  <th className="col-need">入園證</th>
                  <th className="col-need">林業及自然保育署<br />自然保護留區</th>
                  <th className="col-need">林業及自然保育署<br />住宿</th>
                  <th className="col-need">警政署<br />入山證</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length > 0 ? pageRows.map((r, i) => {
                  const can = CAN_APPLY_META[r.canApply];
                  const st = STATUS_META[r.status];
                  return (
                    <tr key={`${r.fId}-${r.cId}-${i}`}>
                      <td className="col-org" data-label="機關">
                        <span className={`bulletin-badge agency-${ORG_BADGE[r.orgLabel] || "nps"}`}>{r.orgLabel}</span>
                      </td>
                      <td className="col-main" data-label="登山主路線">{r.mainRoute}</td>
                      <td className="col-name2" data-label="路線名稱">{r.name}</td>
                      <td className="col-can" data-label="可否申請">
                        {can && <span className={`th-flag ${can.cls}`}><i className={can.icon}></i>{can.label}</span>}
                      </td>
                      <td className="col-status" data-label="路線現況">
                        {st && <span className={`th-flag ${st.cls}`}><i className={st.icon}></i>{st.label}</span>}
                      </td>
                      {NEED_COLUMNS.map((c) => (
                        <td key={c.key} className="col-need" data-label={c.label}>
                          {r[c.key]
                            ? <i className="fa-solid fa-check open-need-yes" aria-label="須申請"></i>
                            : <span className="open-need-no" aria-label="免申請">—</span>}
                        </td>
                      ))}
                      <td className="col-level" data-label="難度等級">
                        {r.level === null ? (
                          <span className="open-need-no">—</span>
                        ) : (
                          <button type="button" className={`open-level-btn th-level lv-${r.level}`} onClick={() => setLevelModal(r.level)}>
                            第 {r.level} 級
                          </button>
                        )}
                      </td>
                      <td className="col-fn" data-label="功能">
                        <div className="open-actions">
                          <a className="open-act is-primary" href="apply-1.html">
                            <i className="fa-solid fa-pen-to-square"></i>申請
                          </a>
                          {r.hasIntro && (
                            /* 路線介紹頁尚未建置，不給假連結 */
                            <span className="open-act th-todo-link">
                              <i className="fa-solid fa-circle-info"></i>介紹
                            </span>
                          )}
                          {r.note && (
                            <button type="button" className="open-act" onClick={() => setNoteModal(r)}>
                              <i className="fa-regular fa-note-sticky"></i>備註
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="11">
                      <div className="bulletin-empty">
                        <i className="fa-solid fa-inbox"></i>查無符合條件的路線，請調整查詢條件。
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <BulletinPager page={page} totalPages={totalPages} onChange={setPage} />

          <Callout>
            表格內容為各機關提供之路線申請對照資訊，實際可申請日期與承載量仍以線上申請流程之查驗結果為準。
          </Callout>
        </div>
      </main>

      <ExperienceNav />
      <Footer />

      {levelModal !== null && <LevelModal level={levelModal} onClose={() => setLevelModal(null)} />}
      {noteModal && <NoteModal row={noteModal} onClose={() => setNoteModal(null)} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<OpenStatusApp />);
