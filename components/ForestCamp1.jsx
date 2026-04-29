/* ForestCamp Step 1: 日期確認 & 床位/營位查詢 */

// 山屋設定資料（對應 RouteData unit=forestry-camp）
const CABIN_DATA = {
  "jiaming": {
    name: "嘉明湖山屋",
    manager: "臺東林區管理處",
    location: "嘉明湖步道 9.5K，海拔 3,310m",
    image: "assets/route-nanheng.png",
    minDays: 2, maxDays: 4,
    facilities: [
      { id: "hut",  label: "山屋床位", unit: "床", max: 72,  pricePerNight: 200, icon: "ph-bold ph-house" },
      { id: "camp", label: "營地營位", unit: "頂", max: 30,  pricePerNight: 100, icon: "ph-bold ph-tent" },
    ],
    notices: [
      "採線上抽籤制，熱門日期請提早申請。",
      "山屋提供睡袋（另計費），自帶睡袋可享折扣。",
      "入住日前 14 天可申請取消，取消費用依規定收取。",
    ],
  },
  "tianchi": {
    name: "天池山莊",
    manager: "南投林區管理處",
    location: "能高越嶺道西段 22K，海拔 2,860m",
    image: "assets/route-qilai.png",
    minDays: 1, maxDays: 3,
    facilities: [
      { id: "hut",  label: "山屋床位", unit: "床", max: 64,  pricePerNight: 200, icon: "ph-bold ph-house" },
      { id: "camp", label: "營地營位", unit: "頂", max: 20,  pricePerNight: 100, icon: "ph-bold ph-tent" },
    ],
    notices: [
      "採先到先得制，建議至少提前 7 天申請。",
      "山莊提供熱食，需於申請時預約餐食人數。",
    ],
  },
  "guigu": {
    name: "檜谷山莊",
    manager: "屏東林區管理處",
    location: "北大武山登山口 7.5K，海拔 2,230m",
    image: "assets/route-qilai.png",
    minDays: 1, maxDays: 2,
    facilities: [
      { id: "hut",  label: "山屋床位", unit: "床", max: 48,  pricePerNight: 200, icon: "ph-bold ph-house" },
    ],
    notices: [
      "採線上申請制，開放日期前 60 天受理。",
      "山莊無對外供餐，請自備糧食。",
    ],
  },
  "walami": {
    name: "瓦拉米山屋",
    manager: "花蓮林區管理處",
    location: "瓦拉米步道 13.1K，海拔 1,068m",
    image: "assets/route-nanheng.png",
    minDays: 1, maxDays: 2,
    facilities: [
      { id: "hut",  label: "山屋床位", unit: "床", max: 24,  pricePerNight: 200, icon: "ph-bold ph-house" },
      { id: "camp", label: "營地營位", unit: "頂", max: 10,  pricePerNight: 100, icon: "ph-bold ph-tent" },
    ],
    notices: [
      "採線上申請制，開放日期前 30 天受理。",
    ],
  },
};

const FC_STEPS = [
  { n: 1, label: "日期確認" },
  { n: 2, label: "行程計畫" },
  { n: 3, label: "隊伍資料" },
  { n: 4, label: "附件上傳" },
  { n: 5, label: "申請須知" },
  { n: 6, label: "確認送出" },
];

function FcStepper({ current }) {
  return (
    <div className="fc-stepper">
      {FC_STEPS.map((s, i) => {
        const cls = s.n < current ? "is-done" : s.n === current ? "is-current" : "";
        return (
          <React.Fragment key={s.n}>
            <div className={`fc-step ${cls}`}>
              <div className="fc-step-dot">
                {s.n < current
                  ? <i className="fa-solid fa-check"></i>
                  : <span>{s.n}</span>}
              </div>
              <span className="fc-step-label">{s.label}</span>
            </div>
            {i < FC_STEPS.length - 1 && <div className={`fc-step-line ${s.n < current ? "is-done" : ""}`}></div>}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// 簡易月曆日期選擇器
function formatDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDaysToDateValue(dateValue, days) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return formatDateInputValue(date);
}

function DatePicker({ value, onChange, label, min }) {
  const today = new Date();
  const minDate = min || formatDateInputValue(today);
  return (
    <div className="fc-field">
      <label className="fc-label">{label}</label>
      <input
        type="date"
        className="fc-input"
        value={value}
        min={minDate}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

// 床位/營位可用狀態列（模擬資料）
function AvailabilityBar({ facility, date, nights }) {
  if (!date || !nights) return null;

  // 模擬每日可用數（原型用隨機種子固定數值）
  const seed = (date + facility.id).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const available = Math.max(0, facility.max - (seed % (facility.max + 1)));
  const pct = Math.round((available / facility.max) * 100);
  const status = pct > 50 ? "avail" : pct > 20 ? "tight" : pct > 0 ? "scarce" : "full";
  const statusLabel = { avail: "充足", tight: "尚有名額", scarce: "名額有限", full: "已額滿" }[status];
  const statusColor = { avail: "var(--success-fg)", tight: "var(--warning-fg)", scarce: "#dc2626", full: "var(--fg-4)" }[status];

  return (
    <div className="fc-avail-row">
      <div className="fc-avail-head">
        <span className="fc-avail-icon"><i className={facility.icon}></i></span>
        <span className="fc-avail-name">{facility.label}</span>
        <span className="fc-avail-status" style={{ color: statusColor }}>{statusLabel}</span>
        <span className="fc-avail-count">{available} / {facility.max} {facility.unit}可預訂</span>
      </div>
      <div className="fc-avail-bar-wrap">
        <div className="fc-avail-bar" style={{
          width: `${pct}%`,
          background: status === "avail" ? "var(--success-fg)"
            : status === "tight" ? "var(--warning-fg)"
            : status === "scarce" ? "#dc2626"
            : "var(--slate-300)",
        }}></div>
      </div>
      <div className="fc-avail-meta">
        <span>每{facility.unit} NT$ {facility.pricePerNight} / 晚</span>
        <span>{nights} 晚 × {facility.max} {facility.unit} 上限</span>
      </div>
    </div>
  );
}

function ForestCamp1App() {
  const routeId = new URLSearchParams(window.location.search).get("route") || "jiaming";
  const cabin = CABIN_DATA[routeId] || CABIN_DATA["jiaming"];

  const today = new Date();
  const todayStr = formatDateInputValue(today);

  const [startDate, setStartDate] = React.useState(todayStr);
  const [nights, setNights] = React.useState(cabin.minDays);
  const [headcount, setHeadcount] = React.useState(4);
  const [queried, setQueried] = React.useState(false);

  // 結束日（顯示用）
  const endDate = React.useMemo(() => {
    if (!startDate) return "";
    return addDaysToDateValue(startDate, nights);
  }, [startDate, nights]);

  const canQuery = !!startDate && headcount >= 1;

  const handleQuery = () => {
    if (canQuery) setQueried(true);
  };

  const handleNext = () => {
    const params = new URLSearchParams({
      route: routeId,
      start: startDate,
      nights,
      headcount,
    });
    window.location.href = `forest-camp-2.html?${params}`;
  };

  return (
    <div data-screen-label="FC-01 日期確認">
      <Header active="apply" />
      <Breadcrumb trail={["登山申請", "登山線上申請", cabin.name, "日期確認"]} />

      <main className="th-page">
        <div className="th-page-inner">
          <h1 className="th-page-title">山屋住宿申請</h1>
          <FcStepper current={1} />

          <div className="fc-layout">
            {/* 左欄：查詢表單 */}
            <div className="fc-main">

              {/* 山屋資訊卡 */}
              <div className="fc-cabin-card">
                <div className="fc-cabin-thumb">
                  <img src={cabin.image} alt={cabin.name} />
                </div>
                <div className="fc-cabin-info">
                  <div className="fc-cabin-name">{cabin.name}</div>
                  <div className="fc-cabin-meta">
                    <span><i className="ph-bold ph-buildings"></i>{cabin.manager}</span>
                    <span><i className="ph-bold ph-map-pin"></i>{cabin.location}</span>
                  </div>
                  <div className="fc-cabin-tags">
                    {cabin.facilities.map(f => (
                      <span key={f.id} className="fc-tag">
                        <i className={f.icon}></i>{f.label}（上限 {f.max} {f.unit}）
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 查詢表單 */}
              <div className="fc-section">
                <h2 className="fc-section-title">
                  <i className="fa-regular fa-calendar"></i>選擇行程日期與人數
                </h2>

                <div className="fc-form-grid">
                  <DatePicker
                    label="出發日期"
                    value={startDate}
                    min={todayStr}
                    onChange={v => { setStartDate(v); setQueried(false); }}
                  />

                  <div className="fc-field">
                    <label className="fc-label">住宿晚數</label>
                    <div className="fc-stepper-input">
                      <button
                        className="fc-stepper-btn"
                        onClick={() => { setNights(n => Math.max(cabin.minDays, n - 1)); setQueried(false); }}
                        disabled={nights <= cabin.minDays}>
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <span className="fc-stepper-val">{nights} 晚</span>
                      <button
                        className="fc-stepper-btn"
                        onClick={() => { setNights(n => Math.min(cabin.maxDays, n + 1)); setQueried(false); }}
                        disabled={nights >= cabin.maxDays}>
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                    <div className="fc-field-hint">可選 {cabin.minDays}～{cabin.maxDays} 晚</div>
                  </div>

                  <div className="fc-field">
                    <label className="fc-label">申請人數</label>
                    <div className="fc-stepper-input">
                      <button
                        className="fc-stepper-btn"
                        onClick={() => { setHeadcount(n => Math.max(1, n - 1)); setQueried(false); }}
                        disabled={headcount <= 1}>
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <span className="fc-stepper-val">{headcount} 人</span>
                      <button
                        className="fc-stepper-btn"
                        onClick={() => { setHeadcount(n => Math.min(20, n + 1)); setQueried(false); }}
                        disabled={headcount >= 20}>
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                    <div className="fc-field-hint">最多 20 人</div>
                  </div>

                  {endDate && (
                    <div className="fc-field">
                      <label className="fc-label">預計回程日</label>
                      <div className="fc-input fc-input-readonly">{endDate}</div>
                    </div>
                  )}
                </div>

                <button
                  className={`th-btn th-btn-secondary fc-query-btn ${!canQuery ? "" : ""}`}
                  disabled={!canQuery}
                  onClick={handleQuery}>
                  <i className="ph-bold ph-magnifying-glass"></i>
                  查詢床位 / 營位狀況
                </button>
              </div>

              {/* 查詢結果 */}
              {queried && (
                <div className="fc-section fc-avail-section">
                  <h2 className="fc-section-title">
                    <i className="ph-bold ph-calendar-check"></i>
                    {startDate} 出發，共 {nights} 晚 · {headcount} 人
                  </h2>

                  {cabin.facilities.map(f => (
                    <AvailabilityBar
                      key={f.id}
                      facility={f}
                      date={startDate}
                      nights={nights}
                    />
                  ))}

                  <div className="fc-avail-note">
                    <i className="ph-bold ph-info"></i>
                    以上為即時查詢結果，實際名額以申請後為準。床位/營位數量將於下一步選擇。
                  </div>
                </div>
              )}
            </div>

            {/* 右欄：山屋須知摘要 */}
            <aside className="fc-aside">
              <div className="fc-notice-card">
                <div className="th-sidebar-head">
                  <i className="ph-bold ph-info"></i>
                  <span>申請前注意事項</span>
                </div>
                <ul className="fc-notice-list">
                  {cabin.notices.map((n, i) => (
                    <li key={i}>
                      <i className="fa-solid fa-circle-dot"></i>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="fc-price-card">
                <div className="th-sidebar-head">
                  <i className="ph-bold ph-currency-circle-dollar"></i>
                  <span>費用參考</span>
                </div>
                {cabin.facilities.map(f => (
                  <div key={f.id} className="fc-price-row">
                    <span>{f.label}</span>
                    <span>NT$ {f.pricePerNight} / {f.unit} / 晚</span>
                  </div>
                ))}
                <div className="fc-price-note">實際費用於確認送出時顯示</div>
              </div>
            </aside>
          </div>

          {/* 底部操作列 */}
          <div className="fc-footbar">
            <button className="th-btn th-btn-ghost" onClick={() => window.location.href = "apply-1.html"}>
              <i className="fa-solid fa-arrow-left"></i>上一步
            </button>
            <button
              className="th-btn th-btn-primary"
              disabled={!queried}
              onClick={handleNext}>
              下一步：行程計畫<i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ForestCamp1App />);
