/* Page 1: Route Selection */

function Page1App() {
  const [search, setSearch] = React.useState("");
  const [agency, setAgency] = React.useState("all");
  const [days, setDays] = React.useState("all");
  const [diff, setDiff] = React.useState("all");
  const [hotOnly, setHotOnly] = React.useState(false);
  const [openOnly, setOpenOnly] = React.useState(false);
  const [sort, setSort] = React.useState("default");

  const filtered = React.useMemo(() => {
    let r = ROUTE_DATA.slice();
    if (agency !== "all") r = r.filter(x => x.agency === agency);
    if (days !== "all") {
      r = r.filter(x => {
        if (days === "1") return x.days === 1;
        if (days === "2-3") return x.days >= 2 && x.days <= 3;
        if (days === "4+") return x.days >= 4;
        return true;
      });
    }
    if (diff !== "all") r = r.filter(x => x.diff === Number(diff));
    if (hotOnly) r = r.filter(x => x.hot);
    if (openOnly) r = r.filter(x => x.status === "open");
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      r = r.filter(x =>
        x.name.toLowerCase().includes(q) ||
        x.subroute.toLowerCase().includes(q) ||
        x.peak.toLowerCase().includes(q) ||
        x.agencyName.toLowerCase().includes(q)
      );
    }
    if (sort === "diff-asc") r.sort((a,b) => a.diff - b.diff);
    if (sort === "diff-desc") r.sort((a,b) => b.diff - a.diff);
    if (sort === "days-asc") r.sort((a,b) => a.days - b.days);
    return r;
  }, [search, agency, days, diff, hotOnly, openOnly, sort]);

  // group by agency for display
  const grouped = React.useMemo(() => {
    const order = ["yushan", "shei-pa", "taroko", "forestry", "police"];
    const map = {};
    filtered.forEach(r => {
      if (!map[r.agency]) map[r.agency] = [];
      map[r.agency].push(r);
    });
    return order.filter(k => map[k]).map(k => ({
      agency: k,
      name: AGENCIES.find(a => a.id === k).name,
      items: map[k],
    }));
  }, [filtered]);

  const reset = () => {
    setAgency("all"); setDays("all"); setDiff("all");
    setHotOnly(false); setOpenOnly(false); setSearch("");
  };

  const totalActive =
    (agency !== "all" ? 1 : 0) + (days !== "all" ? 1 : 0) +
    (diff !== "all" ? 1 : 0) + (hotOnly ? 1 : 0) + (openOnly ? 1 : 0);

  return (
    <div data-screen-label="01 路線選擇">
      <Header active="apply" />
      <Breadcrumb trail={["登山申請", "登山線上申請"]} />

      <main className="th-page">
        <div className="th-page-inner">
          <h1 className="th-page-title">登山線上申請</h1>
          <Stepper current={1} />

          <h2 className="th-section-title">
            登山路線選擇
            <span className="th-section-title-sub">挑選您要前往的山岳，系統會自動帶入需要的入園與入山許可</span>
          </h2>

          <div className="p1-layout">
            {/* SIDEBAR */}
            <aside className="p1-filters">
              <div className="p1-filter-head">
                <h3><i className="ph-bold ph-funnel"></i>篩選條件 {totalActive > 0 && <span style={{ background: "var(--national-700)", color: "#fff", borderRadius: 9999, padding: "1px 7px", fontSize: 11 }}>{totalActive}</span>}</h3>
                <button className="p1-filter-reset" onClick={reset}>清除全部</button>
              </div>

              <div className="p1-filter-group">
                <div className="p1-filter-label"><i className="ph-bold ph-buildings"></i>管理機關</div>
                <div className="p1-chip-row">
                  {AGENCIES.map(a => (
                    <button key={a.id}
                      className={`p1-chip ${agency === a.id ? "is-active" : ""}`}
                      onClick={() => setAgency(a.id)}>
                      {a.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p1-filter-group">
                <div className="p1-filter-label"><i className="fa-regular fa-calendar"></i>行程天數</div>
                <div className="p1-chip-row">
                  {[
                    { v: "all", l: "全部" },
                    { v: "1", l: "單日" },
                    { v: "2-3", l: "2–3 天" },
                    { v: "4+", l: "4 天以上" },
                  ].map(o => (
                    <button key={o.v}
                      className={`p1-chip ${days === o.v ? "is-active" : ""}`}
                      onClick={() => setDays(o.v)}>{o.l}</button>
                  ))}
                </div>
              </div>

              <div className="p1-filter-group">
                <div className="p1-filter-label"><i className="ph-bold ph-mountains"></i>難度等級</div>
                <div className="p1-difficulty-row">
                  {[1,2,3,4,5,6].map(n => (
                    <button key={n}
                      className={`p1-diff ${diff === String(n) ? "is-active" : ""}`}
                      onClick={() => setDiff(diff === String(n) ? "all" : String(n))}>
                      第{n}級
                    </button>
                  ))}
                </div>
                <div className="p1-diff-legend">
                  <span>易</span><span>難</span>
                </div>
              </div>

              <div className="p1-filter-group">
                <div className="p1-filter-label"><i className="ph-bold ph-sparkle"></i>快速篩選</div>
                <label className="p1-toggle" style={{ marginBottom: 8 }}>
                  <input type="checkbox" checked={hotOnly} onChange={e => setHotOnly(e.target.checked)} />
                  <span className="p1-toggle-track"></span>
                  <span>僅顯示熱門路線</span>
                </label>
                <label className="p1-toggle">
                  <input type="checkbox" checked={openOnly} onChange={e => setOpenOnly(e.target.checked)} />
                  <span className="p1-toggle-track"></span>
                  <span>僅顯示目前開放</span>
                </label>
              </div>
            </aside>

            {/* MAIN */}
            <div>
              <div className="p1-search-bar">
                <div className="p1-search-row">
                  <div className="p1-search-input">
                    <i className="ph-bold ph-magnifying-glass"></i>
                    <input
                      type="text"
                      placeholder="搜尋路線名稱、山名或關鍵字（例：玉山主峰、嘉明湖）"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                  <button className="th-btn th-btn-primary">
                    <i className="ph-bold ph-magnifying-glass"></i>查詢
                  </button>
                </div>
                <div className="p1-search-hint">
                  <span className="lbl">熱門：</span>
                  {["玉山主峰", "嘉明湖", "雪山主東", "奇萊南華", "南湖大山"].map(t => (
                    <span key={t} className="tag" onClick={() => setSearch(t)}>{t}</span>
                  ))}
                </div>
              </div>

              <div className="p1-results-head">
                <div className="p1-results-count">
                  共 <strong>{filtered.length}</strong> 條路線
                  {totalActive > 0 && <span style={{ color: "var(--fg-3)" }}>（已套用 {totalActive} 項篩選）</span>}
                </div>
                <div className="p1-sort">
                  <span>排序：</span>
                  <select value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="default">預設（依管理機關）</option>
                    <option value="diff-asc">難度低→高</option>
                    <option value="diff-desc">難度高→低</option>
                    <option value="days-asc">天數少→多</option>
                  </select>
                </div>
              </div>

              {grouped.length === 0 && (
                <div className="p1-empty">
                  <i className="ph-bold ph-binoculars" style={{ fontSize: 28, color: "var(--slate-300)", marginBottom: 8, display: "block" }}></i>
                  找不到符合條件的路線，請調整篩選條件再試試。
                </div>
              )}

              {grouped.map(g => (
                <div key={g.agency} className="p1-group">
                  <div className="p1-group-head">
                    <div className="p1-group-head-left">
                      <span className={`p1-group-tag tag-${g.agency}`}>
                        <i className={g.agency === "police" ? "ph-bold ph-shield-check" : g.agency === "forestry" ? "ph-bold ph-tree" : "ph-bold ph-mountains"}></i>
                        {g.name}
                      </span>
                      <span className="p1-group-meta">{g.items.length} 條路線 · {AGENCY_DESC[g.agency]}</span>
                    </div>
                  </div>
                  <div className="p1-route-list">
                    {g.items.map(r => <RouteCard key={r.id} r={r} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function RouteCard({ r }) {
  const statusMap = {
    open:    { cls: "s-open",    label: "目前可申請", icon: "fa-solid fa-circle" },
    lottery: { cls: "s-lottery", label: "抽籤期間",   icon: "fa-solid fa-shuffle" },
    closed:  { cls: "s-closed",  label: "暫停申請",   icon: "fa-solid fa-circle-xmark" },
  };
  const s = statusMap[r.status];
  return (
    <article className="p1-route" onClick={() => window.location.href = "apply-2.html"}>
      <div className="p1-route-thumb">
        <img src={r.image} alt="" />
        <span className="p1-route-diff">第 {r.diff} 級</span>
      </div>
      <div className="p1-route-body">
        <h3 className="p1-route-title">
          {r.name}
          {r.hot && <span className="badge-hot"><i className="fa-solid fa-fire"></i>熱門</span>}
          {r.status === "lottery" && <span className="badge-lottery"><i className="fa-solid fa-shuffle"></i>抽籤</span>}
        </h3>
        <div className="p1-route-sub">{r.subroute}</div>
        <div className="p1-route-meta">
          <span><i className="ph-bold ph-mountains"></i>{r.peak}</span>
          <span><i className="fa-regular fa-clock"></i>{r.days === 1 ? "單日往返" : `${r.days}天${r.days - 1}夜`}</span>
        </div>
        <div className="p1-route-foot">
          <span className={`p1-status-pill ${s.cls}`}>
            <i className={s.icon}></i>{s.label}
          </span>
          <span className="p1-route-go">
            進入申請<i className="fa-solid fa-arrow-right"></i>
          </span>
        </div>
      </div>
    </article>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Page1App />);
