/* Page 3: Trip Registration */

function Page3App() {
  const [unit, setUnit] = React.useState("玉山國家公園管理處");
  const [route, setRoute] = React.useState("玉山主峰線");
  const [subroute, setSubroute] = React.useState("塔塔加→排雲山莊→玉山主峰");
  const [startDate, setStartDate] = React.useState("2026-05-15");
  const [days, setDays] = React.useState(2);
  const [hasGps, setHasGps] = React.useState("yes");
  const [purpose, setPurpose] = React.useState("");
  const [satPhone, setSatPhone] = React.useState("");
  const [radio, setRadio] = React.useState("");
  const [note, setNote] = React.useState("");
  const [planText, setPlanText] = React.useState("");
  const [keeperName, setKeeperName] = React.useState("");
  const [keeperPhone, setKeeperPhone] = React.useState("");
  const [keeperRel, setKeeperRel] = React.useState("");

  const [members, setMembers] = React.useState([
    { id: 1, role: "leader", name: "", idType: "id", idNum: "", phone: "", emergency: "" },
    { id: 2, role: "member", name: "", idType: "id", idNum: "", phone: "", emergency: "" },
  ]);

  const addMember = () => {
    if (members.length >= 12) return;
    setMembers([...members, { id: Date.now(), role: "member", name: "", idType: "id", idNum: "", phone: "", emergency: "" }]);
  };
  const removeMember = (id) => {
    if (members.length <= 1) return;
    setMembers(members.filter(m => m.id !== id));
  };
  const updateMember = (id, k, v) => {
    setMembers(members.map(m => m.id === id ? { ...m, [k]: v } : m));
  };

  const endDate = React.useMemo(() => {
    const d = new Date(startDate);
    if (isNaN(d)) return "";
    d.setDate(d.getDate() + (days - 1));
    return d.toISOString().slice(0, 10);
  }, [startDate, days]);

  const filledMembers = members.filter(m => m.name.trim()).length;
  const checks = [
    { ok: !!route, label: "已選擇登山路線" },
    { ok: !!startDate, label: "已選擇入山日期" },
    { ok: filledMembers >= 1, label: `已填寫至少 1 位隊員（目前 ${filledMembers}）` },
    { ok: !!keeperName && !!keeperPhone, label: "已填寫留守人聯絡資料" },
    { ok: !!planText, label: "已填寫登山計畫書" },
  ];
  const allOk = checks.every(c => c.ok);

  return (
    <div data-screen-label="03 行程登記">
      <Header active="apply" />
      <Breadcrumb trail={["登山申請", "登山線上申請", "行程登記及登山申請"]} />

      <main className="th-page">
        <div className="th-page-inner">
          <h1 className="th-page-title">行程登記及登山申請</h1>
          <Stepper current={3} />

          <div className="p3-layout">
            <div>
              {/* ROUTE PREVIEW */}
              <div className="p3-route-card">
                <div className="p3-route-head">
                  <div className="p3-route-thumb">
                    <img src="assets/route-yushan.png" alt="" />
                    <span className="p3-route-thumb-tag">第 3 級</span>
                  </div>
                  <div className="p3-route-info">
                    <h3>{route}</h3>
                    <div className="p3-route-info-sub">{subroute}</div>
                    <div className="p3-route-tags">
                      <span className="p3-route-tag"><i className="ph-bold ph-buildings"></i>{unit}</span>
                      <span className="p3-route-tag"><i className="ph-bold ph-mountains"></i>玉山主峰 3,952m</span>
                      <span className="p3-route-tag"><i className="fa-regular fa-clock"></i>建議 2 天 1 夜</span>
                      <span className="p3-route-tag tag-warn"><i className="fa-solid fa-shuffle"></i>抽籤路線</span>
                    </div>
                  </div>
                  <button className="p3-route-change">
                    <i className="fa-solid fa-pen"></i> 變更
                  </button>
                </div>
                <div className="p3-route-warn">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <div>
                    <strong>請注意：</strong>本系統公開時段為每日 23:00 至次日 07:00 暫停受理申請。
                    本路線需參加抽籤，每月 5 日抽籤、5 日開放結果查詢，詳見<a href="#" style={{ color: "#92400e", textDecoration: "underline", marginLeft: 4 }}>抽籤規則說明</a>。
                  </div>
                </div>
              </div>

              {/* SECTION 1: BASIC */}
              <section className="p3-section">
                <div className="p3-section-head">
                  <span className="p3-section-num">1</span>
                  <div className="p3-section-titles">
                    <h3 className="p3-section-title">行程基本資料 <span className="p3-section-title-en">Trip Basics</span></h3>
                    <p className="p3-section-sub">請確認入山日期與整體行程天數</p>
                  </div>
                </div>
                <div className="p3-section-body">
                  <div className="p3-grid">
                    <div className="p3-field p3-grid-full">
                      <label className="p3-field-label"><span className="req">*</span>入山日期 <span className="p3-field-label-en">Entry Date</span></label>
                      <div className="p3-date-row">
                        <input type="date" className="p3-input p3-date-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
                        <i className="p3-date-arrow fa-solid fa-arrow-right"></i>
                        <select className="p3-select" style={{ flex: 1 }} value={days} onChange={e => setDays(Number(e.target.value))}>
                          {[1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{n} 天</option>)}
                        </select>
                      </div>
                      <div className="p3-date-result">
                        <span>入山 <strong>{startDate}</strong></span>
                        <span>下山 <strong>{endDate}</strong></span>
                        <span>共 <strong>{days} 天 {Math.max(0, days-1)} 夜</strong></span>
                      </div>
                    </div>
                    <div className="p3-field">
                      <label className="p3-field-label"><span className="req">*</span>申請目的 <span className="p3-field-label-en">Purpose</span></label>
                      <select className="p3-select" value={purpose} onChange={e => setPurpose(e.target.value)}>
                        <option value="">請選擇申請目的</option>
                        <option value="hiking">登山活動</option>
                        <option value="research">學術研究</option>
                        <option value="news">新聞採訪</option>
                        <option value="other">其他（請於備註欄說明）</option>
                      </select>
                    </div>
                    <div className="p3-field">
                      <label className="p3-field-label">細部路線圖（選填） <span className="p3-field-label-en">Route Map</span></label>
                      <div className="p3-input-group">
                        <i className="icon fa-solid fa-paperclip"></i>
                        <input type="text" className="p3-input" placeholder="可另上傳 GPX 軌跡檔" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 2: MEMBERS */}
              <section className="p3-section">
                <div className="p3-section-head">
                  <span className="p3-section-num">2</span>
                  <div className="p3-section-titles">
                    <h3 className="p3-section-title">隊員名單 <span className="p3-section-title-en">Team Members</span></h3>
                    <p className="p3-section-sub">玉山國家公園隊員人數：2–12 人。第 1 位為領隊。</p>
                  </div>
                </div>
                <div className="p3-section-body">
                  <div className="p3-members">
                    <div className="p3-members-head">
                      <span></span>
                      <span>姓名</span>
                      <span>身分證／護照號碼</span>
                      <span>聯絡電話</span>
                      <span>緊急聯絡人</span>
                      <span>身分</span>
                      <span></span>
                    </div>
                    {members.map((m, i) => (
                      <div key={m.id} className="p3-members-row">
                        <span className="row-num">{i + 1}{i === 0 && <span className="leader-tag">領隊</span>}</span>
                        <input type="text" className="p3-input" placeholder="姓名"
                          value={m.name} onChange={e => updateMember(m.id, "name", e.target.value)} />
                        <div style={{ display: "flex", gap: 4 }}>
                          <select className="p3-select" style={{ width: 80, flexShrink: 0 }}
                            value={m.idType} onChange={e => updateMember(m.id, "idType", e.target.value)}>
                            <option value="id">身分證</option>
                            <option value="passport">護照</option>
                          </select>
                          <input type="text" className="p3-input" placeholder={m.idType === "id" ? "A123456789" : "Passport No."}
                            value={m.idNum} onChange={e => updateMember(m.id, "idNum", e.target.value)} />
                        </div>
                        <input type="tel" className="p3-input" placeholder="09xx-xxx-xxx"
                          value={m.phone} onChange={e => updateMember(m.id, "phone", e.target.value)} />
                        <input type="tel" className="p3-input" placeholder="緊急聯絡電話"
                          value={m.emergency} onChange={e => updateMember(m.id, "emergency", e.target.value)} />
                        <select className="p3-select"
                          value={m.role} onChange={e => updateMember(m.id, "role", e.target.value)}>
                          <option value="leader">領隊</option>
                          <option value="member">隊員</option>
                          <option value="guide">嚮導</option>
                        </select>
                        <button className="row-del" onClick={() => removeMember(m.id)} disabled={members.length <= 1}>
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="p3-members-foot">
                    <span>目前 <strong>{members.length}</strong> 人 · 此路線限 2–12 人</span>
                    <button className="p3-add-member" onClick={addMember} disabled={members.length >= 12}>
                      <i className="fa-solid fa-plus"></i> 新增隊員
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 3: ROUTE PLAN */}
              <section className="p3-section">
                <div className="p3-section-head">
                  <span className="p3-section-num">3</span>
                  <div className="p3-section-titles">
                    <h3 className="p3-section-title">路線規劃（操作說明） <span className="p3-section-title-en">Route Plan</span></h3>
                    <p className="p3-section-sub">通訊裝置、登山技能與機關備註</p>
                  </div>
                </div>
                <div className="p3-section-body">
                  <div className="p3-grid">
                    <div className="p3-field">
                      <label className="p3-field-label"><span className="req">*</span>登山相關經歷 <span className="p3-field-label-en">Hiking Experience</span></label>
                      <select className="p3-select">
                        <option>初次參加登山活動</option>
                        <option>曾參加過 1–3 次</option>
                        <option>曾參加過 4–10 次</option>
                        <option>專業／資深登山者</option>
                      </select>
                    </div>
                    <div className="p3-field">
                      <label className="p3-field-label"><span className="req">*</span>是否攜帶 GPS 等通訊裝置 <span className="p3-field-label-en">GPS Device</span></label>
                      <div className="p3-radio-row">
                        <label className={`p3-radio ${hasGps === "yes" ? "is-active" : ""}`}>
                          <input type="radio" checked={hasGps === "yes"} onChange={() => setHasGps("yes")} />是，會攜帶
                        </label>
                        <label className={`p3-radio ${hasGps === "no" ? "is-active" : ""}`}>
                          <input type="radio" checked={hasGps === "no"} onChange={() => setHasGps("no")} />否
                        </label>
                      </div>
                    </div>
                    <div className="p3-field">
                      <label className="p3-field-label">衛星電話 <span className="p3-field-label-en">Satellite Phone</span></label>
                      <input type="text" className="p3-input" placeholder="請輸入電話號碼" value={satPhone} onChange={e => setSatPhone(e.target.value)} />
                    </div>
                    <div className="p3-field">
                      <label className="p3-field-label">無線電頻率 <span className="p3-field-label-en">Radio Frequency</span></label>
                      <input type="text" className="p3-input" placeholder="例：145.500 MHz" value={radio} onChange={e => setRadio(e.target.value)} />
                    </div>
                    <div className="p3-field p3-grid-full">
                      <label className="p3-field-label">機關備註 <span className="p3-field-label-en">Note</span></label>
                      <textarea className="p3-textarea" placeholder="若有特殊需求請於此處說明" value={note} onChange={e => setNote(e.target.value)}></textarea>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 4: KEEPER */}
              <section className="p3-section">
                <div className="p3-section-head">
                  <span className="p3-section-num">4</span>
                  <div className="p3-section-titles">
                    <h3 className="p3-section-title">留守人資訊 <span className="p3-section-title-en">Keeper Contact</span></h3>
                    <p className="p3-section-sub">指定一位行程外人員作為留守聯絡窗口</p>
                  </div>
                </div>
                <div className="p3-section-body">
                  <div className="p3-grid p3-grid-3">
                    <div className="p3-field">
                      <label className="p3-field-label"><span className="req">*</span>留守人姓名</label>
                      <input type="text" className="p3-input" placeholder="姓名" value={keeperName} onChange={e => setKeeperName(e.target.value)} />
                    </div>
                    <div className="p3-field">
                      <label className="p3-field-label"><span className="req">*</span>聯絡電話</label>
                      <input type="tel" className="p3-input" placeholder="09xx-xxx-xxx" value={keeperPhone} onChange={e => setKeeperPhone(e.target.value)} />
                    </div>
                    <div className="p3-field">
                      <label className="p3-field-label">關係</label>
                      <select className="p3-select" value={keeperRel} onChange={e => setKeeperRel(e.target.value)}>
                        <option value="">請選擇</option>
                        <option>家人</option><option>朋友</option><option>同事</option><option>其他</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 5: POLICE */}
              <section className="p3-section">
                <div className="p3-section-head">
                  <span className="p3-section-num">5</span>
                  <div className="p3-section-titles">
                    <h3 className="p3-section-title">警政署入山證申請 <span className="p3-section-title-en">Police Mountain Permit</span></h3>
                    <p className="p3-section-sub">本路線進入山地管制區，需同時申請入山許可</p>
                  </div>
                </div>
                <div className="p3-section-body">
                  <div className="p3-police-note">
                    <i className="fa-solid fa-circle-info"></i>
                    <div><strong>提示：</strong>本路線位於山地管制區內，系統會自動將以下資料送交警政署辦理入山申請。請確認登山計畫書內容已包含每日預定行程與住宿點。</div>
                  </div>
                  <div className="p3-grid">
                    <div className="p3-field">
                      <label className="p3-field-label"><span className="req">*</span>入山事由</label>
                      <select className="p3-select"><option>登山活動</option><option>學術研究</option><option>其他</option></select>
                    </div>
                    <div className="p3-field">
                      <label className="p3-field-label"><span className="req">*</span>預定地點 <span className="p3-field-label-en">Destination</span></label>
                      <input type="text" className="p3-input" defaultValue="玉山國家公園 排雲山莊" />
                    </div>
                    <div className="p3-field p3-grid-full">
                      <label className="p3-field-label"><span className="req">*</span>登山計畫書 <span className="p3-field-label-en">Plan</span></label>
                      <textarea className="p3-textarea" style={{ minHeight: 140 }}
                        placeholder={"請依每日行程詳細填寫，例如：\nD1：塔塔加登山口→排雲山莊（宿）\nD2：排雲山莊→玉山主峰→塔塔加登山口"}
                        value={planText} onChange={e => setPlanText(e.target.value)}></textarea>
                      <div className="p3-field-help">每日行程需註明 500 字以內。範例：D1：塔塔加→排雲山莊（宿）；D2：排雲山莊→主峰→下山。</div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="th-footbar">
                <div className="th-footbar-info">
                  <i className="fa-solid fa-floppy-disk"></i>
                  系統會自動暫存您填寫的內容，可關閉再回來繼續編輯
                </div>
                <div className="th-footbar-actions">
                  <button className="th-btn th-btn-ghost" onClick={() => window.location.href = "apply-2.html"}>
                    <i className="fa-solid fa-arrow-left"></i>上一步
                  </button>
                  <button className="th-btn th-btn-ghost">儲存草稿</button>
                  <button className="th-btn th-btn-primary" disabled={!allOk}
                    onClick={() => alert("送出申請")}>
                    送出申請<i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* SUMMARY SIDEBAR */}
            <aside className="th-sidebar">
              <div className="th-sidebar-head">
                <i className="ph-bold ph-clipboard-text"></i>申請摘要
              </div>
              <div className="th-sidebar-body">
                <div className="th-sidebar-row">
                  <span className="lbl">管理機關</span>
                  <span className="val">{unit}</span>
                </div>
                <div className="th-sidebar-row">
                  <span className="lbl">路線</span>
                  <span className="val">{route}</span>
                </div>
                <div className="th-sidebar-row">
                  <span className="lbl">入山日期</span>
                  <span className="val"><strong>{startDate}</strong></span>
                </div>
                <div className="th-sidebar-row">
                  <span className="lbl">天數</span>
                  <span className="val"><strong>{days} 天 {Math.max(0,days-1)} 夜</strong></span>
                </div>
                <div className="th-sidebar-row">
                  <span className="lbl">隊員人數</span>
                  <span className="val"><strong>{members.length} / 12 人</strong></span>
                </div>
                <div className="th-sidebar-row">
                  <span className="lbl">許可項目</span>
                  <span className="val">入園許可 + 入山許可</span>
                </div>

                <ul className="th-sidebar-checklist">
                  {checks.map((c, i) => (
                    <li key={i} className={c.ok ? "is-ok" : ""}>
                      <i className={c.ok ? "fa-solid fa-circle-check" : "fa-regular fa-circle"}></i>
                      {c.label}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Page3App />);
