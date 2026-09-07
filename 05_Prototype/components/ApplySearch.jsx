/*
  申請進度查詢／繳費／異動／取消
  對應舊站：https://hike.taiwan.gov.tw/applySearch.aspx（操作入口）
            https://hike.taiwan.gov.tw/apply_3.aspx（申請進度查詢／許可證下載）
  實抓日期：2026-09-07

  合併成一頁的理由（2026-09-07 使用者裁決）：
  舊站 applySearch.aspx 不是轉導頁，而是「請選擇操作方式」的四選一入口，
  四個按鈕分別連 apply_3（進度查詢）／apply_2（異動及取消）／apply_4（線上繳費）
  ／apply_5（線上退費）。本雛形把入口與進度查詢併為單頁：入口四張卡照舊站呈現，
  「申請進度查詢」就地展開表單與結果區，另三項各有獨立任務卡，未建置前出待建置標記。

  頁面標題以導覽列名稱「申請進度查詢／繳費／異動／取消」為準（2026-09-02 裁決），
  不照抄舊站 apply_3 頁內標題「申請進度查詢/許可證下載」。

  [待確認] 查詢結果區的欄位與狀態值：舊站須輸入真實申請編號與身分證號才會回傳，
           無公開來源可查。本頁結果為示意版面，欄位與狀態值全部待業務確認，
           資料為匿名假資料，不得當成已確認規則。
*/

/* 舊站四個操作入口。built=false 者在本雛形尚未建置，出待建置標記不給假連結。 */
const SEARCH_ACTIONS = [
  {
    id: "progress",
    title: "申請進度查詢",
    icon: "fa-solid fa-magnifying-glass",
    desc: "入園申請僅查詢、下載許可證；林保署山屋可繳費、異動資料。",
    cabins: ["天池山莊", "檜谷山莊／營地", "嘉明湖山屋／營地", "向陽山屋"],
    legacy: "apply_3.aspx",
    built: true,
  },
  {
    id: "modify",
    title: "申請資料異動及取消",
    icon: "fa-solid fa-pen-to-square",
    desc: "入園申請可異動資料。",
    cabins: [],
    legacy: "apply_2.aspx",
    built: false,
  },
  {
    id: "pay",
    title: "國家公園線上繳費",
    icon: "fa-solid fa-credit-card",
    desc: "國家公園山屋列印繳費說明及線上繳費。",
    cabins: ["排雲山莊", "觀高山屋"],
    legacy: "apply_4.aspx",
    built: false,
  },
  {
    id: "refund",
    title: "國家公園線上退費",
    icon: "fa-solid fa-rotate-left",
    desc: "國家公園山屋退費功能。",
    cabins: ["排雲山莊", "觀高山屋"],
    legacy: "apply_5.aspx",
    built: false,
  },
];

/*
  結果區示意資料（匿名假資料，非真實案件）。
  欄位組成與狀態值皆 [待確認]——舊站查詢結果需真實案號才看得到。
*/
const DEMO_RESULTS = [
  {
    serial: "115090300127",
    org: "玉山國家公園",
    route: "玉山主峰線（塔塔加登山口）",
    date: "2026-10-05 ～ 2026-10-06",
    team: "晨曦登山隊",
    leader: "王小明",
    members: 6,
    state: "已核准",
    permit: true,
  },
  {
    serial: "115082900461",
    org: "林業及自然保育署",
    route: "嘉明湖國家步道（向陽登山口）",
    date: "2026-11-12 ～ 2026-11-14",
    team: "山行者隊",
    leader: "陳美芳",
    members: 4,
    state: "審核中",
    permit: false,
  },
];

const STATE_FLAG = {
  已核准: "is-open",
  審核中: "is-proof",
  未通過: "is-closed",
};

function ApplySearchApp() {
  const [serial, setSerial] = React.useState("");
  const [nation, setNation] = React.useState("");
  const [sid, setSid] = React.useState("");
  const [vcode, setVcode] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const formRef = React.useRef(null);

  /* 入口卡的「申請進度查詢」不另開頁，捲到本頁查詢區並聚焦第一個欄位 */
  const gotoForm = () => {
    const el = document.getElementById("progress");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (formRef.current) window.setTimeout(() => formRef.current.focus(), 350);
  };

  const columns = [
    { key: "serial", label: "申請編號" },
    { key: "org", label: "受理機關" },
    { key: "route", label: "申請路線" },
    { key: "date", label: "入園（住宿）日期" },
    {
      key: "team",
      label: "隊伍／領隊",
      render: (r) => (
        <React.Fragment>
          {r.team}
          <br />
          {r.leader}（共 {r.members} 人）
        </React.Fragment>
      ),
    },
    {
      key: "state",
      label: "審核狀態",
      render: (r) => <span className={`th-flag ${STATE_FLAG[r.state] || ""}`}>{r.state}</span>,
    },
    {
      key: "permit",
      label: "許可證",
      render: (r) =>
        r.permit ? (
          <span className="th-todo-link">下載許可證</span>
        ) : (
          <span className="th-table-note">尚未核准，無法下載</span>
        ),
    },
  ];

  return (
    <React.Fragment>
      <Header active="apply" />

      <PageShell
        trail={[APPLY_CRUMB, "申請進度查詢／繳費／異動／取消"]}
        title="申請進度查詢／繳費／異動／取消"
        lead="查詢已送出的登山申請進度、下載入園許可證，或前往異動、繳費、退費。"
        updated="2026-09-07"
        nav={
          <PageNav
            items={[
              { id: "actions", label: "請選擇操作方式" },
              { id: "progress", label: "申請進度查詢" },
              { id: "rules", label: "列印與退費規定" },
            ]}
          />
        }
      >
        <div>
          <h2 className="th-section-title" id="actions">請選擇操作方式</h2>
          {/* items-stretch 覆蓋 .th-notice-grid 的 align-items: start，
              讓四張卡等高、按鈕齊底（各卡說明與山屋數量不同，不等高會參差） */}
          <div className="th-notice-grid items-stretch">
            {SEARCH_ACTIONS.map((a) => (
              /* 卡片骨架與 notice.html 的機關卡同構，但標題降一級為 h3
                 （上方已有 h2「請選擇操作方式」），故不套用 SectionCard。 */
              <section className="th-card flex flex-col" key={a.id}>
                <div className="th-card-head">
                  <i className={a.icon}></i>
                  <h3 className="th-card-title">{a.title}</h3>
                </div>
                <div className="th-card-body flex flex-col gap-3 flex-1">
                  <p className="th-field-hint">{a.desc}</p>
                  {a.cabins.length > 0 && (
                    <div className="th-chip-row">
                      {a.cabins.map((c) => (
                        <span className="th-chip" key={c}>{c}</span>
                      ))}
                    </div>
                  )}
                  {a.built ? (
                    <button type="button" className="th-btn th-btn-primary th-btn-block mt-auto" onClick={gotoForm}>
                      <i className="fa-solid fa-arrow-down"></i>前往查詢
                    </button>
                  ) : (
                    <TodoLink label="待建置" className="th-btn-block justify-center mt-auto" />
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>

        <SectionCard
          id="progress"
          title="申請進度查詢"
          icon="fa-solid fa-magnifying-glass"
          note="舊站標題為「申請進度查詢/許可證下載」"
        >
          <p>
            請輸入您的<strong>登山申請編號</strong>及<strong>身分證號／護照號碼（居留證）</strong>來進行資料查詢。
          </p>

          <div className="flex flex-col gap-4">
          <div className="th-field">
            <label className="th-label" htmlFor="f-serial">
              <span className="req">*</span>（一站式／入園）申請編號
            </label>
            <input
              id="f-serial"
              name="serial"
              ref={formRef}
              type="text"
              className="th-input"
              autoComplete="off"
              placeholder="請輸入登山申請一站式 12 碼申請編號（不是警政署、不是林保署編號）"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
            />
          </div>

          <div className="th-field">
            <label className="th-label" htmlFor="f-sid">
              <span className="req">*</span>身分證號／護照號碼（居留證）
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                id="f-nation"
                name="nation"
                className="th-select basis-full sm:basis-44 grow-0 shrink-0"
                aria-label="國籍"
                value={nation}
                onChange={(e) => setNation(e.target.value)}
              >
                <option value="">請選擇</option>
                <option value="中華民國">中華民國</option>
                <option value="國外">國外</option>
              </select>
              <input
                id="f-sid"
                name="sid"
                type="text"
                className="th-input flex-1"
                autoComplete="off"
                placeholder={nation === "國外" ? "請輸入護照號碼或居留證號碼" : "請輸入身分證字號"}
                value={sid}
                onChange={(e) => setSid(e.target.value)}
              />
            </div>
            <div className="th-field-hint">選「中華民國」填身分證字號，選「國外」填護照號碼或居留證號碼。</div>
          </div>

          <div className="th-field">
            <label className="th-label" htmlFor="f-vcode">
              <span className="req">*</span>請輸入驗證碼
            </label>
            <div className="flex flex-col sm:flex-row gap-2 items-start">
              <input
                id="f-vcode"
                name="vcode"
                type="text"
                className="th-input sm:w-44"
                autoComplete="off"
                placeholder="請輸入驗證碼"
                value={vcode}
                onChange={(e) => setVcode(e.target.value)}
              />
              <span className="th-input th-input-readonly sm:w-32 text-center tracking-[0.3em]">7K4M</span>
              <button type="button" className="th-btn th-btn-ghost" disabled>
                <i className="fa-solid fa-rotate"></i>換一組
              </button>
            </div>
            <div className="th-field-hint">
              雛形不做真實驗證，驗證碼為靜態字樣，「換一組」不會產生新驗證碼。
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
            <p className="th-field-hint">查詢結果僅顯示與輸入身分相符的申請案。</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="th-btn th-btn-secondary"
                onClick={() => {
                  setSerial("");
                  setNation("");
                  setSid("");
                  setVcode("");
                  setSubmitted(false);
                }}
              >
                清除
              </button>
              <button type="button" className="th-btn th-btn-primary" onClick={() => setSubmitted(true)}>
                <i className="fa-solid fa-magnifying-glass"></i>查詢
              </button>
            </div>
          </div>

          {submitted && (
            <React.Fragment>
              <h3 className="th-section-title mt-6">
                查詢結果
                <span className="th-todo-tag">待確認</span>
              </h3>
              <p className="th-table-note">
                以下欄位、狀態值與許可證下載規則皆未取得正式站可公開來源，為示意版面；
                資料為匿名假資料，非真實申請案。
              </p>
              <DataTable columns={columns} rows={DEMO_RESULTS} rowKey="serial" className="th-table--zebra" />
              <Callout>
                林保署山屋（天池、檜谷、嘉明湖／向陽）的案件可於本區進行繳費與資料異動；
                入園申請僅提供查詢與許可證下載。相關操作入口在本雛形尚未建置。
                <span className="th-todo-tag">待確認</span>
                <span className="th-callout-src">
                  操作範圍取自舊站 applySearch.aspx 的按鈕說明文字，實際可用功能待業務確認。
                </span>
              </Callout>
            </React.Fragment>
          )}
          </div>
        </SectionCard>

        <SectionCard id="rules" title="列印與退費規定" icon="fa-solid fa-circle-info">
          <Callout type="warning">
            <strong>國家公園入園許可證</strong>：請領隊於入園日（含）前 5 日內始可列印；
            入園日後，將不提供列印及查詢，如需入園許可證副本，請自行備份。
            <span className="th-callout-src">來源：正式站 apply_3.aspx（2026-09-07 實抓）</span>
          </Callout>

          <Callout>
            登山活動應事先查看天氣預報及掌握成員身體狀況，如入園日前 1 日天氣預報不佳或身體有不適狀況，
            考量不成行請儘速線上取消申請，避免入園當日無法取消。線上取消登山申請請至
            「申請資料異動及取消」（舊站 apply_2.aspx，本雛形尚未建置）。
            <span className="th-callout-src">來源：正式站 apply_3.aspx（2026-09-07 實抓）</span>
          </Callout>

          <h3 className="th-section-title">林保署山屋取消住宿申請之退費規定</h3>
          <p className="th-table-note">適用檜谷山莊、天池山莊、嘉明湖／向陽。</p>
          <DataTable
            columns={[
              { key: "when", label: "取消時間（以起算日計）" },
              { key: "refund", label: "退費比例" },
            ]}
            rows={[
              { when: "起算日前 5 日前取消成功", refund: "全額退還已付金額" },
              { when: "起算日前 4 日取消成功", refund: "退還已付金額百分之五十" },
              { when: "起算日前 3 日內取消，及住宿當日未到", refund: "不退還已付之金額" },
            ]}
            rowKey="when"
            className="th-table--zebra"
          />
          <p className="th-table-note">
            起算日計算標準：單日住宿者，以住宿日為起算日；多日住宿者，以第一天住宿日為起算日。
            來源：正式站 apply_3.aspx（2026-09-07 實抓）。
          </p>
        </SectionCard>
      </PageShell>

      <ExperienceNav />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ApplySearchApp />);
