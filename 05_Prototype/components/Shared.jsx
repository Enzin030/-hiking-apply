/* Shared components used across all pages */

/*
  尚未建置的頁面：不給 `#` 假路徑，改輸出非連結的「待建置」標記
  （樣式見 styles/shared.css 的 .th-todo-link）。
  onDark = 深色底（Footer）用的配色。
*/
function TodoLink({ label, className = "", onDark }) {
  return (
    <span className={`th-todo-link ${onDark ? "on-dark" : ""} ${className}`}>{label}</span>
  );
}

/*
  主導覽項目。url 為 null＝本雛形尚未建置，一律出「待建置」標記，不給 `#` 假連結。
*/
const HEADER_NAV = [
  { key: "bulletin", label: "公布欄", url: "news.html" },
  { key: "apply",    label: "登山申請", url: "apply-1.html" },
  { key: "notice",   label: "登山須知", url: "notice.html" },
  { key: "status",   label: "登山路線開放狀態", url: "open.html" },
  { key: "campsite", label: "宿營地與床位查詢", url: "campsite.html" },
  { key: "info",     label: "旅遊登山資訊", url: null },
];

/* 工具列項目（網站導覽／警特報／RSS） */
const HEADER_UTILITY = [
  { label: "網站導覽", url: null },
  { label: "警特報",   url: "https://www.cwa.gov.tw/V8/C/P/Warning/FIFOWS.html", external: true },
  { label: "RSS",     url: "rss.html" },
];

/* 可選語系定義 */
const LANGUAGES = [
  { key: "zh-TW", label: "繁體中文" },
  { key: "en",    label: "English" },
  { key: "ja",    label: "日本語" },
];

/*
  Header。
  水平導覽只在 xl（≥1280px）以上呈現 —— 六個項目加上三個「待建置」標記後，
  1280 容器內僅容得下一行 16px 文字，再窄就會把站名擠掉。
  xl 以下改用收合選單（含手機，原本手機完全沒有導覽入口）。
*/
function Header({ active }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [langOpen, setLangOpen] = React.useState(false);
  const [currentLang, setCurrentLang] = React.useState("zh-TW");
  const langRef = React.useRef(null);

  // 開啟時鎖背景捲動，Esc 關閉；點擊外部關閉語言下拉
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setLangOpen(false);
      }
    };
    const onClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    if (menuOpen) document.body.classList.add("th-noscroll");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
      document.body.classList.remove("th-noscroll");
    };
  }, [menuOpen]);

  const currentLangObj = LANGUAGES.find(l => l.key === currentLang) || LANGUAGES[0];

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-[0_2px_10px_rgba(0,0,0,0.05)] border-b border-slate-100 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center gap-y-2">
          {/*
            站名是全站識別（wordmark），不是各頁主標題 —— 頁面主標題是 PageShell 的 h1，
            這裡用 <a> 而非帶 onClick 的 div，兼顧鍵盤可聚焦與單一 h1 的語意。
            行動版：拿掉 shrink-0、縮小字級並允許換行，避免撐寬 documentElement。
          */}
          <a href="index.html"
             className="flex items-center min-w-0 shrink lg:shrink-0 hover:opacity-90 transition"
             aria-label="臺灣登山申請一站式服務網 首頁">
            <img src="assets/logo-mark.png" alt="國家公園署" className="h-10 sm:h-14 lg:h-16 w-auto shrink-0 mr-2 sm:mr-3" />
            <span className="font-serif font-extrabold text-base sm:text-xl lg:text-2xl text-slate-800 tracking-wide mt-1 min-w-0 lg:whitespace-nowrap">
              <span className="text-lg sm:text-2xl lg:text-3xl">臺灣<span className="text-[#587a68]">登山申請</span></span>一站式服務網
            </span>
          </a>

          {/* 桌機（≥1280px）：工具列 ＋ 水平主導覽 */}
          <div className="flex-col items-end gap-3 hidden xl:flex">
            <div className="flex items-center gap-3 text-[14px] text-slate-500">
              {HEADER_UTILITY.map(({ label, url, external }) => (
                <React.Fragment key={label}>
                  {url ? (
                    <a href={url}
                       target={external ? "_blank" : undefined}
                       rel={external ? "noopener noreferrer" : undefined}
                       className="hover:text-[#587a68] transition">
                      {label}
                    </a>
                  ) : (
                    <TodoLink label={label} />
                  )}
                  <div className="w-[1px] h-3 bg-slate-300"></div>
                </React.Fragment>
              ))}

              {/* 語言選擇下拉選單 */}
              <div className="th-lang-wrapper" ref={langRef}>
                <button
                  type="button"
                  className="th-lang-btn hover:text-[#587a68] transition"
                  onClick={() => setLangOpen(!langOpen)}
                  aria-expanded={langOpen}
                  aria-haspopup="true"
                >
                  <i className="ph ph-globe text-[14px] relative top-[1px]"></i>
                  <span>{currentLangObj.label}</span>
                  <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${langOpen ? "rotate-180" : ""}`}></i>
                </button>
                {langOpen && (
                  <div className="th-lang-dropdown">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.key}
                        type="button"
                        className={`th-lang-item ${currentLang === lang.key ? "is-active" : ""}`}
                        onClick={() => {
                          setCurrentLang(lang.key);
                          setLangOpen(false);
                        }}
                      >
                        <span>{lang.label}</span>
                        {currentLang === lang.key && <i className="fa-solid fa-check text-xs text-[#587a68]"></i>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-[1px] h-3 bg-slate-300"></div>
              <button className="hover:text-[#587a68] transition flex items-center gap-1.5 ml-1">
                <i className="ph-bold ph-magnifying-glass text-[15px] relative top-[1px]"></i>
              </button>
            </div>

            {/* 導覽字級 16px：六個項目加三個「待建置」標記後，18px 在 1280 容器內塞不下同一行 */}
            <nav className="flex items-center gap-4" aria-label="主要導覽">
              {HEADER_NAV.map(({ key, label, url }) =>
                url ? (
                  <a
                    key={key}
                    href={url}
                    className={`font-medium transition text-[16px] whitespace-nowrap ${
                      active === key
                        ? "text-[#587a68]"
                        : "text-slate-600 hover:text-[#587a68]"
                    }`}
                  >
                    {label}
                  </a>
                ) : (
                  <TodoLink key={key} label={label} className="th-todo-link-nav text-[16px] whitespace-nowrap" />
                )
              )}
            </nav>
          </div>

          {/* xl 以下：收合按鈕 */}
          <button type="button"
                  className="th-menubtn xl:hidden"
                  onClick={() => setMenuOpen(true)}
                  aria-haspopup="dialog" aria-expanded={menuOpen} aria-label="開啟選單">
            <i className="ph-bold ph-list"></i>
            <span>選單</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="th-menumask" onClick={() => setMenuOpen(false)}>
          <div className="th-menupanel" role="dialog" aria-modal="true" aria-label="網站選單"
               onClick={(e) => e.stopPropagation()}>
            <div className="th-menupanel-head">
              <span>選單</span>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="關閉選單">
                <i className="ph-bold ph-x"></i>
              </button>
            </div>

            <nav className="th-menunav" aria-label="主要導覽">
              <ul>
                {HEADER_NAV.map(({ key, label, url }) => (
                  <li key={key}>
                    {url ? (
                      <a href={url} className={active === key ? "is-active" : ""}>
                        {label}<i className="fa-solid fa-angle-right"></i>
                      </a>
                    ) : (
                      <TodoLink label={label} className="th-menunav-todo" />
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="th-menuutil">
              {HEADER_UTILITY.map(({ label, url, external }) =>
                url ? (
                  <a key={label} href={url}
                     target={external ? "_blank" : undefined}
                     rel={external ? "noopener noreferrer" : undefined}>
                    {label}
                  </a>
                ) : (
                  <TodoLink key={label} label={label} />
                )
              )}
              <div className="w-full mt-2 pt-2 border-t border-slate-100">
                <div className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1">
                  <i className="ph ph-globe"></i> 語言 / Language
                </div>
                <div className="th-menu-lang-options">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.key}
                      type="button"
                      className={`th-menu-lang-btn ${currentLang === lang.key ? "is-active" : ""}`}
                      onClick={() => setCurrentLang(lang.key)}
                    >
                      <span>{lang.label}</span>
                      {currentLang === lang.key && <i className="fa-solid fa-check text-xs"></i>}
                    </button>
                  ))}
                </div>
              </div>
              <button type="button" className="mt-2">
                <i className="ph-bold ph-magnifying-glass"></i> 搜尋
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/*
  申請流程共用的麵包屑中間層級。四支流程頁（apply-2／apply-3／forest-camp-1／2）
  都掛在「各項線上申請」底下，指回 apply-1.html。
  一級的「登山申請」在正式站沒有自己的頁面（site_map 只列子項），故維持純文字。
*/
const APPLY_CRUMB = { label: "登山線上申請", href: "apply-1.html" };

/*
  麵包屑。trail 元素可為字串或 { label, href }：
  中間層級沒有 href 時輸出純文字，不給 `#` 假連結。
*/
function Breadcrumb({ trail }) {
  return (
    <div className="th-crumb">
      <a href="index.html" aria-label="首頁"><i className="fa-solid fa-house"></i></a>
      {trail.map((t, i) => {
        const label = typeof t === "string" ? t : t.label;
        const href = typeof t === "string" ? null : t.href;
        return (
          <React.Fragment key={i}>
            <i className="fa-solid fa-angle-right"></i>
            {i === trail.length - 1
              ? <span className="th-crumb-current">{label}</span>
              : href
                ? <a href={href}>{label}</a>
                : <span>{label}</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Stepper({ current }) {
  const steps = [
    { n: 1, title: "選擇路線" },
    { n: 2, title: "閱讀同意書" },
    { n: 3, title: "行程登記" },
    { n: 4, title: "申請完成" },
  ];
  return (
    <div className="th-stepper">
      {steps.map((s, i) => {
        const cls = s.n < current ? "is-done" : s.n === current ? "is-current" : "";
        return (
          <React.Fragment key={s.n}>
            <div className={`th-step ${cls}`}>
              <span className="th-step-num"><span>{s.n}</span></span>
              <div className="th-step-label">
                <span className="lbl-title">{s.title}</span>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={`th-step-line ${s.n < current ? "is-done" : ""}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-[#243447] pt-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-10 mb-10">

          <div className="w-full lg:max-w-[65%] flex flex-col sm:flex-row gap-6">
            <div className="shrink-0">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm">
                <img src="assets/logo-mark.png" alt="Logo" className="h-16 w-auto" />
              </div>
            </div>
            <div className="w-full">
              <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-4 gap-2 pb-[2px]">
                <h3 className="font-serif font-bold text-xl text-white tracking-wide leading-none">
                  臺灣登山申請一站式服務網
                </h3>
                {/*
                  這是抄自正式站的「全站」最後更新日期，與 PageShell 的「本頁」更新日期
                  語意不同，兩者不一致屬正常，勿逕自對齊（2026-09-02 使用者裁決）。
                  [待確認] 實際上線時此值的維護方式（人工填寫或由 CMS 帶出）。
                */}
                <span className="text-slate-400 text-[13px] leading-none mb-1 xl:mb-0">
                  最後更新日期：2026-03-23
                </span>
              </div>
              <p className="text-[13px] leading-relaxed text-slate-400 text-justify">
                本網站乃整合國家公園署之玉山、雪霸、太魯閣國家公園登山申請，林業及自然保育署之天池、嘉明湖、向陽、檜谷山屋營地及自然保護(留)區、野生動物保護區，以及警政署入山申請等服務。本站提供統一之申請入口，後續再由各機關個別審核。如有申請相關問題，歡迎透過聯絡我們向指定機關聯繫，謝謝。
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-16 lg:gap-20 xl:gap-28 shrink-0 mt-4 lg:mt-0 lg:mr-8 xl:mr-16">
            <div>
              <h4 className="text-white font-bold text-[15px] mb-4 pb-2 border-b border-slate-600/50 inline-block w-full sm:w-auto leading-none">
                服務專區
              </h4>
              {/* 常見問答＝公布欄第四個頁籤（帶 ?tab=faq 直接落在該頁籤）；
                  聯絡我們（舊站 contact.aspx）尚未建置，不給 `#` 假連結 */}
              <ul className="space-y-3 text-[14px]">
                <li>
                  <a href="news.html?tab=faq" className="text-slate-400 hover:text-white transition-colors">
                    常見問答
                  </a>
                </li>
                <li><TodoLink label="聯絡我們" onDark /></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-[15px] mb-4 pb-2 border-b border-slate-600/50 inline-block w-full sm:w-auto leading-none">
                政策宣告
              </h4>
              <ul className="space-y-3 text-[14px]">
                <li><TodoLink label="隱私權宣告" onDark /></li>
                <li><TodoLink label="資訊安全政策" onDark /></li>
                <li><TodoLink label="資料開放宣告" onDark /></li>
              </ul>
            </div>
          </div>

        </div>
      </div>
      <div className="bg-[#334155] py-5 border-t border-slate-700/50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4 text-[13px] text-slate-400">
            <div className="font-medium text-slate-300 shrink-0">
              Copyright © 內政部國家公園署 著作權所有
            </div>
            <div className="flex items-center justify-end gap-3 text-right">
              <span>建議使用 Chrome、Edge 或 Safari 瀏覽器</span>
              <span className="hidden sm:inline opacity-30">|</span>
              <span>建議螢幕解析度 1440 x 960 以上</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   內容頁共用元件（樣式見 styles/content.css）
   ============================================================ */

/*
  PageShell — 全站唯一的頁面外殼（2026-09-03 版面統一）。

  在此之前全站有兩套骨架：查詢／申請頁是 `Breadcrumb ＋ main.th-page > .th-page-inner`，
  內容頁是 `PageHead ＋ div.th-page.has-nav > .th-page-main`，而 `.th-page` 在
  shared.css（純區塊）與 content.css（grid ＋ max-width ＋ padding）各有一份互相矛盾的
  定義，靠「哪些頁有沒有載 content.css」才沒撞在一起。本元件把兩套併成一套：

    main.th-page                白底全幅外框（唯一定義，來自 shared.css）
      .th-page-inner            1280 版心置中、左右 32 內距
        .th-page-head           標題／導言／更新日期
        {stepper}               申請流程步驟條，非申請頁不給
        .th-page-body[.has-nav] 內容區；有 nav 時為「主欄 ＋ 232 右側目錄」兩欄
          .th-page-main         主欄（flex column，區塊間距 24）
          {nav}                 PageNav

  參數：
    trail/title/lead/updated  同 PageHead
    stepper                   申請流程的 <Stepper>／<FcStepper>，直接給 element
    nav                       <PageNav>，給了才會變兩欄
    bare                      不要 .th-page-main 的 flex 包裝（版面自帶 grid 的申請頁）
*/
function PageShell({ trail, title, lead, updated, stepper, nav, bare, children }) {
  return (
    <React.Fragment>
      <Breadcrumb trail={trail} />
      <main className="th-page">
        <div className="th-page-inner">
          <div className="th-page-head">
            <h1 className="th-page-title">{title}</h1>
            {lead && <p className="th-page-lead">{lead}</p>}
            {updated && <div className="th-page-meta">更新日期：{updated}</div>}
          </div>
          {stepper}
          <div className={`th-page-body${nav ? " has-nav" : ""}`}>
            {bare ? children : <div className="th-page-main">{children}</div>}
            {nav}
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}

/* 頁內目錄：items = [{ id, label }]，錨點對應 SectionCard 的 id */
function PageNav({ items, title = "本頁內容" }) {
  return (
    <nav className="th-pagenav">
      <p className="th-pagenav-title">{title}</p>
      <ul>
        {items.map((it) => (
          <li key={it.id}><a href={`#${it.id}`}>{it.label}</a></li>
        ))}
      </ul>
    </nav>
  );
}

/* 區塊卡片；flush = 內容自行控制邊距（表格、清單用） */
function SectionCard({ id, title, icon, note, flush, children }) {
  return (
    <section className="th-card" id={id}>
      {title && (
        <div className="th-card-head">
          {icon && <i className={icon}></i>}
          <h2 className="th-card-title">{title}</h2>
          {note && <span className="th-card-note">{note}</span>}
        </div>
      )}
      <div className={`th-card-body ${flush ? "is-flush" : ""}`}>{children}</div>
    </section>
  );
}

/*
  條列連結。item：
    { label, href, kind }
    kind — "internal"（站內頁）／"external"（外部網站）／"file"（附件下載）
           ／"todo"（連結目標未取得，標 [待確認]，不給假路徑）
  numbered = 顯示序號
*/
function LinkList({ items, numbered }) {
  const ICON = {
    internal: "fa-solid fa-angle-right",
    external: "fa-solid fa-arrow-up-right-from-square",
    file: "fa-solid fa-file-pdf",
  };
  return (
    <ul className="th-linklist">
      {items.map((it, i) => {
        const kind = it.kind || (it.href ? "internal" : "todo");
        const isTodo = kind === "todo";
        /* 外部網站與檔案下載（PDF）都另開分頁，避免使用者離開本站 */
        const newTab = kind === "external" || kind === "file";
        const inner = (
          <React.Fragment>
            {numbered && <span className="th-linkrow-num">{i + 1}</span>}
            <span className="th-linkrow-text">{it.label}</span>
            {isTodo
              ? <span className="th-todo-tag">待確認</span>
              : <i className={`th-linkrow-icon ${ICON[kind]}`}></i>}
          </React.Fragment>
        );
        return (
          <li key={it.label}>
            {isTodo ? (
              <div className="th-linkrow is-todo">{inner}</div>
            ) : (
              <a className="th-linkrow" href={it.href}
                 target={newTab ? "_blank" : undefined}
                 rel={newTab ? "noopener noreferrer" : undefined}>
                {inner}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/*
  資料表。
    columns   = [{ key, label, align, render }]
                render(row) 未給時直接輸出 row[key]
    rows      = 物件陣列
    rowKey    = 取列 key 的欄位名，預設 columns[0].key
    className = 附加在 table 上的修飾 class，欄寬一律由 CSS 控制（禁 inline style）
*/
function DataTable({ columns, rows, rowKey, className = "", empty = "查無資料" }) {
  const keyOf = rowKey || columns[0].key;
  if (!rows || rows.length === 0) {
    return (
      <div className="th-table-empty">
        <i className="fa-regular fa-folder-open"></i>{empty}
      </div>
    );
  }
  return (
    <div className="th-table-wrap">
      <table className={`th-table ${className}`}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={c.align ? `is-${c.align}` : ""}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[keyOf]}>
              {columns.map((c) => (
                /* data-label 供行動版卡片化以 ::before 顯示欄名 */
                <td key={c.key} data-label={c.label} className={c.align ? `is-${c.align}` : ""}>
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/*
  編號步驟。step：{ title, body, subs, shot }
    body — 段落文字或 JSX；subs — 子項目陣列；shot — 截圖佔位說明
*/
function StepList({ steps }) {
  return (
    <ol className="th-steplist">
      {steps.map((s, i) => (
        <li className="th-steprow" key={s.title}>
          <span className="th-steprow-num">{i + 1}</span>
          <div className="th-steprow-body">
            <h3 className="th-steprow-title">{s.title}</h3>
            {s.body && <p>{s.body}</p>}
            {s.subs && (
              <ol className="th-substeps">
                {s.subs.map((t, j) => <li key={j}>{t}</li>)}
              </ol>
            )}
            {s.pics && (
              <div className="th-shot-list">
                {s.pics.map((pic) => (
                  <figure className="th-shot" key={pic.src}>
                    <img src={pic.src} alt={pic.alt} loading="lazy" />
                    <figcaption>{pic.alt}</figcaption>
                  </figure>
                ))}
              </div>
            )}
            {s.shot && (
              <div className="th-shot-placeholder">
                <i className="fa-regular fa-image"></i>{s.shot}
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/*
  查詢型頁面共用分頁。
  頁碼採視窗式呈現（目前頁前後各兩頁，首末頁固定，中間以 … 省略）——
  路線開放狀態有 479 筆共 24 頁，把頁碼全部列出會比表格還寬。
  資料不足一頁時不顯示。
*/
function BulletinPager({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const win = new Set([1, totalPages]);
  for (let i = page - 2; i <= page + 2; i++) if (i >= 1 && i <= totalPages) win.add(i);
  const nums = [...win].sort((a, b) => a - b);

  const items = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) items.push({ gap: true, key: `gap-${n}` });
    items.push({ n, key: n });
  });

  return (
    <nav className="bulletin-pager" aria-label="分頁">
      <button type="button" className="bulletin-page-btn" disabled={page === 1} onClick={() => onChange(page - 1)}>
        上一頁
      </button>
      {items.map((it) => it.gap ? (
        <span key={it.key} className="bulletin-page-gap">…</span>
      ) : (
        <button
          key={it.key}
          type="button"
          className={`bulletin-page-btn ${it.n === page ? "is-active" : ""}`}
          aria-current={it.n === page ? "page" : undefined}
          onClick={() => onChange(it.n)}
        >
          {it.n}
        </button>
      ))}
      <button type="button" className="bulletin-page-btn" disabled={page === totalPages} onClick={() => onChange(page + 1)}>
        下一頁
      </button>
    </nav>
  );
}

/* 提示區塊 */
function Callout({ type, icon, children }) {
  return (
    <div className={`th-callout ${type === "warning" ? "is-warning" : ""}`}>
      <i className={icon || (type === "warning" ? "fa-solid fa-triangle-exclamation" : "fa-solid fa-circle-info")}></i>
      <div>{children}</div>
    </div>
  );
}

/*
  依登山經驗建議參考資料。
  舊站是右下角浮動按鈕 `#f_search`（放大鏡 ＋「快捷選單」），點開 Bootstrap modal，
  標題「依據登山經驗建議參考資料」；本雛形沿用同一種呈現方式。
  項目與 href 取自 notice.aspx 的 modal 原始碼，括號內註記舊站對應頁；
  本雛形尚未建置的頁面留 href: null，點擊不導頁。
*/
const EXPERIENCE_GROUPS = [
  {
    icon: "fa-solid fa-book-open",
    title: "學習登山者",
    sub: "獲取登山知識",
    groups: [
      {
        label: "登山安全影片",
        items: [
          { label: "登山安全防護原則", href: "https://www.youtube.com/watch?v=HgnaQaKFjNo", kind: "external" },
          { label: "國家公園步道分級", href: "https://www.youtube.com/watch?v=OrVgsQFbuOs", kind: "external" },
          { label: "登山必要裝備", href: "https://www.youtube.com/watch?v=syBRav_eZAA", kind: "external" },
          { label: "登山留守制度", href: "https://www.youtube.com/watch?v=vvkmAks0fD8", kind: "external" },
          { label: "高山症處理與預防", href: "https://www.youtube.com/watch?v=e4_GSy6vdYI", kind: "external" },
        ],
      },
    ],
    items: [
      { label: "路線及景點介紹", old: "information_place.aspx" },
      { label: "如何申請入山／入園許可證", href: "web_illustrate.html", old: "web_illustrate.aspx" },
    ],
  },
  {
    icon: "fa-solid fa-map-location-dot",
    title: "規劃登山者",
    sub: "查詢登山資料",
    items: [
      { label: "登山路線圖資查詢", old: "web_map2.aspx" },
      { label: "各機關登山申辦須知", href: "notice.html", old: "notice.aspx" },
      { label: "可申請路線查詢", href: "open.html", old: "open.aspx" },
      { label: "單日往返可申請數量", href: "campsite.html", old: "bed_7.aspx" },
      { label: "宿營地及山屋可申請數量", href: "campsite.html", old: "bed_0.aspx" },
    ],
  },
  {
    icon: "fa-solid fa-pen-to-square",
    title: "申請登山者",
    sub: "申請／修改資料",
    items: [
      { label: "線上申請", href: "apply-1.html", old: "apply_1.aspx" },
      { label: "草稿編輯", old: "apply_2_1.aspx" },
      { label: "申請進度查詢", old: "apply_3.aspx" },
      { label: "申請資料異動", old: "apply_2.aspx" },
      { label: "繳費／退費（含退費日期）查詢", old: "apply_4.aspx" },
    ],
  },
  {
    icon: "fa-solid fa-person-hiking",
    title: "前往學習者",
    sub: "必要整備",
    items: [
      { label: "路線開放狀態查詢", href: "open.html", old: "open.aspx" },
      { label: "天候狀況查詢", old: "information_3.aspx" },
      { label: "登山教育影片", href: "https://www.youtube.com/playlist?list=PL8CdSPNjegIZKIN75OXLB9uk_4eQmgsAm", kind: "external" },
    ],
  },
  {
    icon: "fa-solid fa-flag-checkered",
    title: "完成登山者",
    sub: "下山回報",
    items: [{ label: "出園回報", old: "apply_6.aspx" }],
  },
];

function ExperienceNav({ title = "依據登山經驗建議參考資料", label = "快捷選單" }) {
  const [open, setOpen] = React.useState(false);

  // 開啟時鎖背景捲動，Esc 關閉
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("th-noscroll");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("th-noscroll");
    };
  }, [open]);

  const renderItem = (it, i) => {
    const external = it.kind === "external";
    const todo = !it.href;
    return (
      <li key={i}>
        <a href={it.href || "#"}
           className={todo ? "is-todo" : ""}
           target={external ? "_blank" : undefined}
           rel={external ? "noopener noreferrer" : undefined}
           onClick={todo ? (e) => e.preventDefault() : undefined}>
          <i className={external ? "fa-solid fa-arrow-up-right-from-square" : "fa-solid fa-angle-right"}></i>
          {it.label}
        </a>
      </li>
    );
  };

  return (
    <React.Fragment>
      <button type="button" className="th-quickbtn" onClick={() => setOpen(true)}
              aria-haspopup="dialog" aria-expanded={open}>
        <i className="ph-bold ph-squares-four"></i>
        <span>{label}</span>
      </button>

      {open && (
        <div className="th-quickmask" onClick={() => setOpen(false)}>
          <div className="th-quickpanel" role="dialog" aria-modal="true" aria-label={title}
               onClick={(e) => e.stopPropagation()}>
            <div className="th-quickpanel-head">
              <h2>{title}</h2>
              <button type="button" className="th-quickpanel-close" onClick={() => setOpen(false)} aria-label="關閉">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="th-quickpanel-body">
              <div className="th-expnav-grid">
                {EXPERIENCE_GROUPS.map((g) => (
                  <div className="th-expcard" key={g.title}>
                    <div className="th-expcard-head">
                      <span className="th-expcard-icon"><i className={g.icon}></i></span>
                      <div>
                        <div className="th-expcard-title">{g.title}</div>
                        <div className="th-expcard-sub">{g.sub}</div>
                      </div>
                    </div>
                    {g.groups && g.groups.map((sub) => (
                      <div className="th-expcard-group" key={sub.label}>
                        <div className="th-expcard-grouptitle">{sub.label}</div>
                        <ul className="th-expcard-nested">{sub.items.map(renderItem)}</ul>
                      </div>
                    ))}
                    {g.items && <ul>{g.items.map(renderItem)}</ul>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

Object.assign(window, {
  Header, Breadcrumb, APPLY_CRUMB, Stepper, Footer,
  PageShell, PageNav, SectionCard, LinkList, DataTable, StepList, Callout, ExperienceNav,
  BulletinPager,
});
