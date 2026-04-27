/* Shared components used across all pages */

function Header({ active }) {
  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-[0_2px_10px_rgba(0,0,0,0.05)] border-b border-slate-100 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center shrink-0 cursor-pointer hover:opacity-90 transition" onClick={() => window.location.href = "index.html"}>
            <img src="assets/logo.png" alt="Logo" className="h-16 w-auto mr-3" />
            <h1 className="font-serif font-extrabold text-2xl text-slate-800 tracking-wide mt-1">
              <span className="text-3xl">臺灣<span className="text-[#587a68]">登山申請</span></span>一站式服務網
            </h1>
          </div>

          <div className="flex-col items-end gap-3 hidden lg:flex">
            <div className="flex items-center gap-3 text-[14px] text-slate-500">
              <a href="#" className="hover:text-[#587a68] transition">網站導覽</a>
              <div className="w-[1px] h-3 bg-slate-300"></div>
              <a href="#" className="hover:text-[#587a68] transition">警特報</a>
              <div className="w-[1px] h-3 bg-slate-300"></div>
              <a href="#" className="hover:text-[#587a68] transition">RSS</a>
              <div className="w-[1px] h-3 bg-slate-300"></div>
              <button className="hover:text-[#587a68] transition flex items-center gap-1.5">
                <i className="ph ph-globe text-[14px] relative top-[1px]"></i> 語言
              </button>
              <div className="w-[1px] h-3 bg-slate-300"></div>
              <button className="hover:text-[#587a68] transition flex items-center gap-1.5 ml-1">
                <i className="ph-bold ph-magnifying-glass text-[15px] relative top-[1px]"></i>
              </button>
            </div>

            <nav className="flex items-center gap-6">
              {[
                { key: "bulletin", label: "公佈欄", url: "index.html" },
                { key: "apply",    label: "登山申請", url: "apply-1.html" },
                { key: "notice",   label: "登山須知", url: "#" },
                { key: "status",   label: "登山路線開放狀態", url: "#" },
                { key: "campsite", label: "宿營地與床位查詢", url: "#" },
                { key: "info",     label: "旅遊登山資訊", url: "#" },
              ].map(({ key, label, url }) => (
                <a
                  key={key}
                  href={url}
                  className={`font-medium transition text-[18px] whitespace-nowrap ${
                    active === key
                      ? "text-[#587a68]"
                      : "text-slate-600 hover:text-[#587a68]"
                  }`}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

function Breadcrumb({ trail }) {
  return (
    <div className="th-crumb">
      <a href="#"><i className="fa-solid fa-house"></i></a>
      {trail.map((t, i) => (
        <React.Fragment key={i}>
          <i className="fa-solid fa-angle-right"></i>
          {i === trail.length - 1
            ? <span className="th-crumb-current">{t}</span>
            : <a href="#">{t}</a>}
        </React.Fragment>
      ))}
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
                <img src="assets/logo.png" alt="Logo" className="h-16 w-auto" />
              </div>
            </div>
            <div className="w-full">
              <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-4 gap-2 pb-[2px]">
                <h3 className="font-serif font-bold text-xl text-white tracking-wide leading-none">
                  臺灣登山申請一站式服務網
                </h3>
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
              <ul className="space-y-3 text-[14px]">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">常見問答</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">聯絡我們</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-[15px] mb-4 pb-2 border-b border-slate-600/50 inline-block w-full sm:w-auto leading-none">
                政策宣告
              </h4>
              <ul className="space-y-3 text-[14px]">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">隱私權宣告</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">資訊安全政策</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">資料開放宣告</a></li>
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

Object.assign(window, { Header, Breadcrumb, Stepper, Footer });
