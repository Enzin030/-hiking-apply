/* Page 1: Route Selection */

// unit → 下一步目的地
const buildApplyQuery = route => {
  const q = new URLSearchParams();
  q.set("unit", route.unit || "");
  q.set("route", route.id || "");
  if (route.orgId) q.set("orgId", route.orgId);
  if (route.cId) q.set("cid", route.cId);
  if (route.fId) q.set("fid", route.fId);
  if (route.sourceGuid) q.set("source_guid", route.sourceGuid);
  if (route.campId) q.set("camp_id", route.campId);
  if (route.parkForm) q.set("park", route.parkForm);
  return q.toString();
};

const UNIT_NEXT = {
  "yushan":         r => `apply-2.html?${buildApplyQuery(r)}`,
  "shei-pa":        r => `apply-2.html?${buildApplyQuery(r)}`,
  "taroko":         r => `apply-2.html?${buildApplyQuery(r)}`,
  "forestry-camp":  null,   // 待開發：顯示提示
  "forestry-area":  r => `apply-2.html?${buildApplyQuery(r)}`,
  "police":         r => `apply-2.html?${buildApplyQuery(r)}`,
  "suspended":      null,   // 顯示暫停 modal
};

function SuspendedModal({ route, onClose }) {
  if (!route) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(15,23,42,0.55)", display: "flex",
      alignItems: "center", justifyContent: "center", padding: "16px",
    }} onClick={onClose}>
      <div style={{
        background: "var(--bg-1)", borderRadius: "var(--r-xl)",
        padding: "32px", maxWidth: 440, width: "100%",
        boxShadow: "var(--sh-xl)",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{
            width: 40, height: 40, borderRadius: "var(--r-md)",
            background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <i className="fa-solid fa-circle-xmark" style={{ color: "#dc2626", fontSize: 20 }}></i>
          </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "var(--fs-md)", color: "var(--fg-1)" }}>
              此路線暫停申請
            </div>
            <div style={{ fontSize: "var(--fs-sm)", color: "var(--fg-3)" }}>{route.name}</div>
          </div>
        </div>
        <p style={{ fontSize: "var(--fs-sm)", color: "var(--fg-2)", lineHeight: "var(--lh-loose)", marginBottom: 20 }}>
          {route.suspendReason || "此路線目前暫停開放申請，請關注管理處公告以掌握最新開放訊息。"}
        </p>
        <button
          onClick={onClose}
          style={{
            width: "100%", padding: "10px 0",
            background: "var(--national-700)", color: "#fff",
            border: "none", borderRadius: "var(--r-md)",
            fontWeight: 700, fontSize: "var(--fs-sm)", cursor: "pointer",
          }}>
          我知道了
        </button>
      </div>
    </div>
  );
}


function Page1App() {
  const [search, setSearch] = React.useState("");
  const [agency, setAgency] = React.useState("all");
  const [days, setDays] = React.useState("all");
  const [diff, setDiff] = React.useState("all");
  const [hotOnly, setHotOnly] = React.useState(false);
  const [openOnly, setOpenOnly] = React.useState(false);
  const [sort, setSort] = React.useState("default");
  const [suspendedRoute, setSuspendedRoute] = React.useState(null);

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
      <SuspendedModal route={suspendedRoute} onClose={() => setSuspendedRoute(null)} />
      <Header active="apply" />
      <Breadcrumb trail={["登山申請", "登山線上申請"]} />

      <main className="th-page">
        <div className="th-page-inner">
          <h1 className="th-page-title">登山線上申請</h1>
          <Stepper current={1} />

          <h2 className="th-section-title">
            登山路線選擇
            <span className="th-section-title-sub"></span>
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
                    {g.items.map(r => (
                      <RouteCard key={r.id} r={r}
                        onSuspended={() => setSuspendedRoute(r)}
                      />
                    ))}
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

function RouteCard({ r, onSuspended }) {
  const statusMap = {
    open:    { cls: "s-open",    label: "目前可申請", icon: "fa-solid fa-circle" },
    lottery: { cls: "s-lottery", label: "抽籤期間",   icon: "fa-solid fa-shuffle" },
    closed:  { cls: "s-closed",  label: "暫停申請",   icon: "fa-solid fa-circle-xmark" },
  };
  const s = statusMap[r.status] || statusMap.open;

  const handleClick = () => {
    const unit = r.unit || "yushan";
    if (r.status === "closed" || unit === "suspended") {
      onSuspended && onSuspended();
      return;
    }
    if (unit === "forestry-camp") {
      window.location.href = `forest-camp-1.html?route=${r.id}`;
      return;
    }
    const nextFn = UNIT_NEXT[unit];
    if (nextFn) window.location.href = nextFn(r);
  };

  const isSuspended = r.status === "closed" || r.unit === "suspended";
  const goLabel = isSuspended ? "查看原因" : "進入申請";
  const goIcon  = isSuspended ? "fa-solid fa-info-circle" : "fa-solid fa-arrow-right";
  const title = r.displayName || r.name;
  const routePath = r.routePath || r.subroute;
  const duration = r.durationLabel || (r.days === 1 ? "單日往返" : `${r.days}天${r.days - 1}夜`);

  return (
    <article className={`p1-route ${isSuspended ? "is-suspended" : ""}`} onClick={handleClick}>
      <div className="p1-route-thumb">
        <img src={r.image} alt="" />
        <span className="p1-route-diff">第 {r.diff} 級</span>
      </div>
      <div className="p1-route-body">
        <div className="p1-route-title-row">
          <h3 className="p1-route-title">{title}</h3>
          <div className="p1-route-badges">
            {r.hot && <span className="badge-hot"><i className="fa-solid fa-fire"></i>熱門</span>}
            {r.status === "lottery" && <span className="badge-lottery"><i className="fa-solid fa-shuffle"></i>抽籤</span>}
            {isSuspended && <span className="badge-closed"><i className="fa-solid fa-circle-xmark"></i>暫停</span>}
          </div>
        </div>
        <div className="p1-route-sub">{routePath}</div>
        <div className="p1-route-meta">
          <span><i className="ph-bold ph-map-trifold"></i>{r.routeGroup || r.peak}</span>
          <span><i className="fa-regular fa-clock"></i>{duration}</span>
        </div>
        <div className="p1-route-foot">
          <span className={`p1-status-pill ${s.cls}`}>
            <i className={s.icon}></i>{s.label}
          </span>
          <span className={`p1-route-go ${isSuspended ? "go-muted" : ""}`}>
            {goLabel}<i className={goIcon}></i>
          </span>
        </div>
      </div>
    </article>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Page1App />);
