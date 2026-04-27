/* ForestCamp Step 2: 行程計畫 — 隊名、付款方式、每日床位/營位選擇 */

const PAYMENT_OPTIONS = [
  { id: "credit", label: "信用卡", icon: "ph-bold ph-credit-card",     note: "Visa / Mastercard / JCB，限本人持卡" },
  { id: "atm",    label: "ATM 轉帳", icon: "ph-bold ph-bank",          note: "核准後 3 日內完成匯款" },
  { id: "post",   label: "郵政劃撥", icon: "ph-bold ph-envelope",      note: "劃撥帳號於核准通知中提供" },
];

// 日期字串 +N 天
function addDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

// 顯示格式：2025-07-20 → 7/20（週六）
function fmtDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  return `${d.getMonth() + 1}/${d.getDate()}（週${weekdays[d.getDay()]}）`;
}

// 數量增減小元件
function Stepper2({ value, min, max, onChange }) {
  return (
    <div className="fc-stepper-input" style={{ width: 120 }}>
      <button className="fc-stepper-btn" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>
        <i className="fa-solid fa-minus"></i>
      </button>
      <span className="fc-stepper-val">{value}</span>
      <button className="fc-stepper-btn" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>
        <i className="fa-solid fa-plus"></i>
      </button>
    </div>
  );
}

function ForestCamp2App() {
  const p = new URLSearchParams(window.location.search);
  const routeId   = p.get("route")     || "jiaming";
  const startDate = p.get("start")     || "";
  const nights    = parseInt(p.get("nights") || "2", 10);
  const headcount = parseInt(p.get("headcount") || "4", 10);

  const cabin = CABIN_DATA[routeId] || CABIN_DATA["jiaming"];

  // 每晚的床位/營位選擇：{ [night_index]: { [facilityId]: qty } }
  const initAlloc = React.useMemo(() => {
    const obj = {};
    for (let i = 0; i < nights; i++) {
      obj[i] = {};
      cabin.facilities.forEach(f => { obj[i][f.id] = 0; });
    }
    return obj;
  }, [nights, cabin]);

  const [teamName, setTeamName] = React.useState("");
  const [payment, setPayment] = React.useState("");
  const [alloc, setAlloc] = React.useState(initAlloc);

  const setQty = (night, facilityId, qty) => {
    setAlloc(prev => ({
      ...prev,
      [night]: { ...prev[night], [facilityId]: qty },
    }));
  };

  // 費用小計
  const subtotals = React.useMemo(() => {
    return cabin.facilities.map(f => {
      let total = 0;
      for (let i = 0; i < nights; i++) {
        total += (alloc[i]?.[f.id] || 0) * f.pricePerNight;
      }
      return { ...f, total };
    });
  }, [alloc, nights, cabin]);

  const grandTotal = subtotals.reduce((s, f) => s + f.total, 0);

  // 驗證：每晚至少有 1 個設施選了數量，且 teamName + payment 填寫
  const nightsValid = React.useMemo(() => {
    for (let i = 0; i < nights; i++) {
      const nightTotal = cabin.facilities.reduce((s, f) => s + (alloc[i]?.[f.id] || 0), 0);
      if (nightTotal < 1) return false;
    }
    return true;
  }, [alloc, nights, cabin]);

  const canNext = teamName.trim().length >= 2 && payment !== "" && nightsValid;

  const handleNext = () => {
    const params = new URLSearchParams({
      route: routeId,
      start: startDate,
      nights,
      headcount,
      team: teamName.trim(),
      payment,
      alloc: JSON.stringify(alloc),
      total: grandTotal,
    });
    window.location.href = `apply-3.html?${params}`;
  };

  return (
    <div data-screen-label="FC-02 行程計畫">
      <Header active="apply" />
      <Breadcrumb trail={["登山申請", "登山線上申請", cabin.name, "行程計畫"]} />

      <main className="th-page">
        <div className="th-page-inner">
          <h1 className="th-page-title">山屋住宿申請</h1>
          <FcStepper current={2} />

          <div className="fc-layout">
            {/* ── 左欄：主表單 ── */}
            <div className="fc-main">

              {/* 行程摘要 banner */}
              <div className="fc2-summary-bar">
                <div className="fc2-summary-item">
                  <i className="ph-bold ph-house"></i>
                  <span>{cabin.name}</span>
                </div>
                <div className="fc2-summary-sep"></div>
                <div className="fc2-summary-item">
                  <i className="fa-regular fa-calendar"></i>
                  <span>{fmtDate(startDate)}</span>
                </div>
                <div className="fc2-summary-sep"></div>
                <div className="fc2-summary-item">
                  <i className="ph-bold ph-moon"></i>
                  <span>{nights} 晚</span>
                </div>
                <div className="fc2-summary-sep"></div>
                <div className="fc2-summary-item">
                  <i className="ph-bold ph-users"></i>
                  <span>{headcount} 人</span>
                </div>
              </div>

              {/* 隊伍名稱 */}
              <div className="fc-section">
                <h2 className="fc-section-title">
                  <i className="ph-bold ph-users-three"></i>隊伍基本資料
                </h2>
                <div className="fc-field" style={{ maxWidth: 400 }}>
                  <label className="fc-label">
                    隊伍名稱 <span style={{ color: "var(--danger-fg)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="fc-input"
                    placeholder="例：玉山山難救助訓練隊"
                    maxLength={40}
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                  />
                  <div className="fc-field-hint">2–40 字，供識別申請隊伍使用</div>
                </div>
              </div>

              {/* 每晚住宿配置 */}
              <div className="fc-section">
                <h2 className="fc-section-title">
                  <i className="ph-bold ph-bed"></i>每日住宿床位 / 營位
                </h2>
                <p className="fc2-section-desc">
                  請依每晚需求分別填寫床位與營位數量。各設施每晚至少填入 1 個單位。
                </p>

                {Array.from({ length: nights }, (_, i) => {
                  const dateStr = addDays(startDate, i);
                  const nightTotal = cabin.facilities.reduce((s, f) => s + (alloc[i]?.[f.id] || 0), 0);
                  return (
                    <div key={i} className={`fc2-night-block ${nightTotal > 0 ? "is-filled" : ""}`}>
                      <div className="fc2-night-head">
                        <div className="fc2-night-badge">第 {i + 1} 晚</div>
                        <div className="fc2-night-date">{fmtDate(dateStr)}</div>
                        {nightTotal > 0 && (
                          <div className="fc2-night-ok">
                            <i className="fa-solid fa-check"></i> 已填寫
                          </div>
                        )}
                      </div>
                      <div className="fc2-night-rows">
                        {cabin.facilities.map(f => {
                          const qty = alloc[i]?.[f.id] || 0;
                          return (
                            <div key={f.id} className="fc2-facility-row">
                              <div className="fc2-facility-left">
                                <span className="fc2-facility-icon">
                                  <i className={f.icon}></i>
                                </span>
                                <div>
                                  <div className="fc2-facility-name">{f.label}</div>
                                  <div className="fc2-facility-price">
                                    NT$ {f.pricePerNight} / {f.unit}
                                    {qty > 0 && (
                                      <span className="fc2-facility-subtotal">
                                        = NT$ {qty * f.pricePerNight}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Stepper2
                                value={qty}
                                min={0}
                                max={Math.min(f.max, headcount)}
                                onChange={v => setQty(i, f.id, v)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 付款方式 */}
              <div className="fc-section">
                <h2 className="fc-section-title">
                  <i className="ph-bold ph-credit-card"></i>付款方式
                </h2>
                <div className="fc2-payment-grid">
                  {PAYMENT_OPTIONS.map(opt => (
                    <label key={opt.id} className={`fc2-payment-card ${payment === opt.id ? "is-selected" : ""}`}>
                      <input
                        type="radio"
                        name="payment"
                        value={opt.id}
                        checked={payment === opt.id}
                        onChange={() => setPayment(opt.id)}
                        style={{ display: "none" }}
                      />
                      <div className="fc2-payment-icon">
                        <i className={opt.icon}></i>
                      </div>
                      <div className="fc2-payment-label">{opt.label}</div>
                      <div className="fc2-payment-note">{opt.note}</div>
                      {payment === opt.id && (
                        <div className="fc2-payment-check">
                          <i className="fa-solid fa-check"></i>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ── 右欄：費用小計 ── */}
            <aside className="fc-aside">
              <div className="fc2-cost-card">
                <div className="th-sidebar-head">
                  <i className="ph-bold ph-receipt"></i>
                  <span>費用試算</span>
                </div>
                <div className="fc2-cost-body">
                  {subtotals.map(f => (
                    <div key={f.id} className="fc2-cost-row">
                      <div className="fc2-cost-label">
                        <i className={f.icon}></i>{f.label}
                      </div>
                      <div className="fc2-cost-amount">
                        {f.total > 0
                          ? `NT$ ${f.total.toLocaleString()}`
                          : <span style={{ color: "var(--fg-4)" }}>—</span>}
                      </div>
                    </div>
                  ))}

                  {/* 每晚明細 */}
                  {grandTotal > 0 && (
                    <div className="fc2-cost-detail">
                      {Array.from({ length: nights }, (_, i) => {
                        const dateStr = addDays(startDate, i);
                        const nightCost = cabin.facilities.reduce(
                          (s, f) => s + (alloc[i]?.[f.id] || 0) * f.pricePerNight, 0
                        );
                        return nightCost > 0 ? (
                          <div key={i} className="fc2-cost-detail-row">
                            <span>{fmtDate(dateStr)}</span>
                            <span>NT$ {nightCost.toLocaleString()}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}

                  <div className="fc2-cost-total">
                    <span>預估總費用</span>
                    <span className="fc2-cost-total-num">
                      NT$ {grandTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="fc2-cost-note">
                    實際費用以審核通過後帳單為準。場地費不含膳食。
                  </div>
                </div>
              </div>

              {/* 驗證提示 */}
              {!canNext && (
                <div className="fc2-validation-tips">
                  <div className="fc2-vt-head">
                    <i className="ph-bold ph-list-checks"></i>尚需完成
                  </div>
                  {teamName.trim().length < 2 && (
                    <div className="fc2-vt-item">
                      <i className="fa-solid fa-circle-dot"></i>填寫隊伍名稱
                    </div>
                  )}
                  {!nightsValid && (
                    <div className="fc2-vt-item">
                      <i className="fa-solid fa-circle-dot"></i>每晚至少選 1 個床位或營位
                    </div>
                  )}
                  {payment === "" && (
                    <div className="fc2-vt-item">
                      <i className="fa-solid fa-circle-dot"></i>選擇付款方式
                    </div>
                  )}
                </div>
              )}
            </aside>
          </div>

          {/* 底部操作列 */}
          <div className="fc-footbar">
            <button className="th-btn th-btn-ghost"
              onClick={() => {
                const params = new URLSearchParams({ route: routeId, start: startDate, nights, headcount });
                window.location.href = `forest-camp-1.html?${params}`;
              }}>
              <i className="fa-solid fa-arrow-left"></i>上一步
            </button>
            <button className="th-btn th-btn-primary" disabled={!canNext} onClick={handleNext}>
              下一步：隊伍資料<i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ForestCamp2App />);
