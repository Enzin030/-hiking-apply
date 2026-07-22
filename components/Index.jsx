/* 首頁 Index — 資訊與申請並重版型（115 改版）
   視覺：置中頁首＋膠囊跑馬燈＋薄霧漸層背景（design_system --grad-mist）＋左右雙卡片
   僅首頁使用本檔的 HomeHeader；申請頁沿用 Shared.jsx 的 Header。 */

const MARQUEE_ITEMS = [
  { text: "115年4月1日起至4月19日辦理奇萊稜線新山屋吊掛作業，影響入園申請", href: "#" },
  { text: "雪霸國家公園清明連假期間入園申請注意事項", href: "#" },
  { text: "排雲山莊容宿量調整措施延長辦理通知", href: "#" },
  { text: "颱風期間各國家公園入園申請暫停及退費說明", href: "#" },
];

// 登山教育及路線介紹 — 8 項功能入口
const EDU_FUNCTIONS = [
  { key: "weather",  label: "山區氣象",           icon: "fa-cloud-sun",           href: "#" },
  { key: "pac",      label: "PAC 位置",           icon: "fa-briefcase-medical",   href: "#" },
  { key: "peaks",    label: "百岳位置",           icon: "fa-mountain",            href: "#" },
  { key: "law",      label: "法令資訊",           icon: "fa-scale-balanced",      href: "#" },
  { key: "gear",     label: "登山建議裝備清單",   icon: "fa-list-check",          href: "#" },
  { key: "control",  label: "山坡地經常管制區",   icon: "fa-triangle-exclamation", href: "#" },
  { key: "helipad",  label: "救難直升機停機坪",   icon: "fa-helicopter",          href: "#" },
  { key: "accident", label: "生態保護區事故熱點", icon: "fa-location-crosshairs", href: "#" },
];

// 登山線上申請 — 右區服務入口
const APPLY_LINKS = [
  { key: "apply",     label: "登山申請",         icon: "fa-pen-to-square",   href: "apply-1.html" },
  { key: "datequery", label: "申請日期查詢",     icon: "fa-calendar-check",  href: "#" },
  { key: "violation", label: "違規名單",         icon: "fa-user-xmark",      href: "#" },
  { key: "faq",       label: "常見問題",         icon: "fa-circle-question", href: "#" },
  { key: "status",    label: "登山路線開放狀態", icon: "fa-signs-post",      href: "#" },
  { key: "bed",       label: "宿營地及床位查詢", icon: "fa-bed",             href: "forest-camp-1.html" },
  { key: "notice",    label: "登山須知",         icon: "fa-book-open-reader", href: "#" },
  { key: "travel",    label: "旅遊登山資訊",     icon: "fa-compass",         href: "#" },
];

/* ── ① 跑馬燈（膠囊樣式，寬度對齊雙卡片並置中；滑鼠移入／鍵盤聚焦自動暫停，右側「更多」）── */
function MarqueeBar({ items, moreHref = "#" }) {
  return (
    <div className="th-marquee-wrap w-full">
      <div className="th-marquee" role="region" aria-label="重要即時資訊">
        <span className="th-marquee-tag" aria-label="最新資訊"><i className="fa-solid fa-bullhorn" aria-hidden="true"></i></span>
        <div className="th-marquee-viewport">
          <div className="th-marquee-track">
            {/* 前導空白使訊息從後 1/3 進入；兩份內容含相同空白以無縫循環 */}
            <span className="th-marquee-gap" aria-hidden="true"></span>
            {items.map((m, i) => (
              <a key={`a-${i}`} href={m.href}>{m.text}</a>
            ))}
            <span className="th-marquee-gap" aria-hidden="true"></span>
            {items.map((m, i) => (
              <a key={`b-${i}`} href={m.href} aria-hidden="true" tabIndex={-1}>{m.text}</a>
            ))}
          </div>
        </div>
        <a href={moreHref} className="th-marquee-more th-focusable">
          更多 <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </a>
      </div>
    </div>
  );
}

/* ── 首頁專用置中頁首 ── */
function HomeHeader() {
  return (
    <header className="th-home-header relative z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 flex flex-col items-center gap-4">
        {/* 品牌 */}
        <a href="index.html" className="th-focusable flex items-center gap-4">
          <img src="assets/np-logo.png" alt="國家公園署" className="h-32 w-auto" />
          <span className="th-home-wordmark font-serif font-extrabold text-4xl md:text-5xl tracking-wide">
            臺灣<span className="th-accent">登山申請</span>一站式服務網
          </span>
        </a>

        {/* 功能列（沿用主選單樣式、以 | 分隔；登山各項主功能已移至下方雙卡片） */}
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2" aria-label="功能列">
          <a href="#" className="th-focusable font-medium text-[17px] whitespace-nowrap transition hover:opacity-70">網站導覽</a>
          <span className="th-home-sep" aria-hidden="true"></span>
          <a href="#" className="th-focusable font-medium text-[17px] whitespace-nowrap transition hover:opacity-70">警特報</a>
          <span className="th-home-sep" aria-hidden="true"></span>
          <a href="#" className="th-focusable font-medium text-[17px] whitespace-nowrap transition hover:opacity-70">RSS</a>
          <span className="th-home-sep" aria-hidden="true"></span>
          <button type="button" className="th-focusable font-medium text-[17px] whitespace-nowrap inline-flex items-center gap-1.5 transition hover:opacity-70"><i className="ph ph-globe" aria-hidden="true"></i> 語言</button>
          <span className="th-home-sep" aria-hidden="true"></span>
          <button type="button" className="th-focusable font-medium text-[17px] whitespace-nowrap inline-flex items-center gap-1.5 transition hover:opacity-70"><i className="ph-bold ph-magnifying-glass" aria-hidden="true"></i> 搜尋</button>
        </nav>
      </div>
    </header>
  );
}

/* ── 面板標頭（置中標題，深色霧感標頭；參考 code.html）── */
function PanelHead({ id, title, color }) {
  return (
    <div className="py-6 px-6 text-center" style={{ background: color }}>
      <h2 id={id} className="text-white text-3xl font-bold" style={{ fontFamily: "'Noto Serif TC', serif", letterSpacing: "0.15em" }}>{title}</h2>
    </div>
  );
}

/* ── 圓形功能鈕（白底、無標籤；hover 底色＋上浮，參考 code.html）── */
function IconTile({ item, accent, variant }) {
  return (
    <a href={item.href} className={`th-focusable th-tile th-tile-${variant} group flex flex-col items-center text-center gap-3.5`}>
      <span className="th-tile-ic w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl border border-slate-200/70 shadow-sm transition"
        style={{ color: accent }}>
        <i className={`fa-solid ${item.icon}`} aria-hidden="true"></i>
      </span>
      <span className="text-[16px] font-medium text-slate-700 leading-tight tracking-wide">{item.label}</span>
    </a>
  );
}

function IndexApp() {
  return (
    <div className="flex flex-col min-h-screen antialiased">
      {/* Hero：原背景照片，承載頁首／跑馬燈／雙卡片 */}
      <div className="th-home-hero relative flex-grow flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <img src="assets/hero-bg-2.png" alt="" className="w-full h-full object-cover object-center" onError={(e) => { e.target.style.display = "none"; }} />
          {/* 參考 code.html：淡色柔化 overlay + 2px 模糊 */}
          <div className="absolute inset-0 th-hero-overlay backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 flex flex-col flex-grow pt-6">
          <HomeHeader />

          {/* ① 跑馬燈：置於天空區（頁首下方，再往下移） */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <MarqueeBar items={MARQUEE_ITEMS} />
          </div>

          {/* ②③ 左右雙卡片，置中並上移一點 */}
          <main className="flex-grow flex items-center">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -translate-y-2">
              <section aria-label="首頁主要服務">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">

                  {/* ② 左：登山教育及路線介紹 */}
                  <div className="th-home-panel rounded-2xl overflow-hidden flex flex-col" aria-labelledby="edu-title">
                    <PanelHead id="edu-title" title="登山教育及路線介紹" color="#2d4b3e" />
                    <div className="p-10 flex-grow flex items-center">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-12 content-center w-full">
                        {EDU_FUNCTIONS.map((f) => (
                          <IconTile key={f.key} item={f} accent="#587a68" variant="green" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ③ 右：登山線上申請 */}
                  <div className="th-home-panel rounded-2xl overflow-hidden flex flex-col" aria-labelledby="apply-title">
                    <PanelHead id="apply-title" title="登山線上申請" color="#35484d" />
                    <div className="p-10 flex-grow flex items-center">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-12 content-center w-full">
                        {APPLY_LINKS.map((f) => (
                          <IconTile key={f.key} item={f} accent="#35484d" variant="blue" />
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<IndexApp />);
