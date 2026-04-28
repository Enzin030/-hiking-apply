/* 首頁 Index */

const ROUTE_CARDS = [
  { src: "assets/route-yushan.png",  alt: "玉山",    park: "玉山國家公園",    name: "玉山主峰", elev: "3,952m", dur: "2天1夜" },
  { src: "assets/route-wuling.png",  alt: "武陵四秀", park: "雪霸國家公園",    name: "武陵四秀", elev: "3,524m", dur: "3天2夜" },
  { src: "assets/route-qilai.png",   alt: "奇萊",    park: "太魯閣國家公園",  name: "奇萊",    elev: "3,607m", dur: "3天2夜" },
  { src: "assets/route-nanheng.png", alt: "南橫三山", park: "玉山國家公園",    name: "南橫三山", elev: "3,222m", dur: "2天1夜" },
];

const ANNOUNCEMENTS = [
  { date: "2026-03-09", org: "太魯閣國家公園", pinned: true,  title: "公告115年4月1日起至4月19日辦理奇萊稜線新山屋吊掛作業" },
  { date: "2026-03-05", org: "雪霸國家公園",   pinned: true,  title: "115年雪霸國家公園清明連假期間入園申請注意事項" },
  { date: "2026-03-04", org: "林業及自然保育署", pinned: true, title: "【嘉明湖國家步道】在「臺灣登山一站式」申請住宿訂單相關說明" },
  { date: "2026-01-30", org: "玉山國家公園",   pinned: false, title: "排雲山莊容宿量調整措施延長辦理通知" },
];

const FAQS = [
  { q: "外籍人士沒有台灣身分證，該如何申請？", a: "一般路線請於入園日之 5 天至 2 個月前提出申請。若為熱門需抽籤路線（如玉山主峰、雪山主峰），請依各國家公園管理處之抽籤規定時程辦理，建議提早 1-2 個月關注抽籤資訊。外籍人士填寫時請選擇「護照」，並輸入護照號碼。", open: true },
  { q: "申請通過後，如果隊員臨時無法前往可以換人嗎？", a: "系統規定核准後原則上不可任意更換人員，若有特殊情況請依照各國家公園的異動規定辦理，或於規定時間內取消原申請後重新送件。" },
  { q: "申請編號忘記了該怎麼辦？", a: "您可以點擊頁面右上角的「忘記申請編號？」，輸入您申請時填寫的電子郵件或身分證字號，系統將會重新發送申請編號至您的信箱。" },
];

const ORG_TAGS = ["全部", "玉山國家公園", "太魯閣國家公園", "雪霸國家公園", "林業及自然保育署", "警政署"];

function IndexApp() {
  const [clock, setClock] = React.useState("");
  const [activeTag, setActiveTag] = React.useState("全部");

  React.useEffect(() => {
    function tick() {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      setClock(`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
    }
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="text-slate-800 antialiased bg-white">
      <Header active="bulletin" />

      {/* ── Hero ── */}
      <div className="relative pt-6 pb-16 lg:pt-10 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-slate-100">
          <img src="assets/hero-bg.png" alt="背景群山" className="w-full h-full object-cover opacity-80" onError={(e) => { e.target.style.display = "none"; }} />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/30 backdrop-blur-[1px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">

            {/* 左：搜尋 + 路線卡片 */}
            <div className="lg:col-span-8 relative flex flex-col">
              <div className="mb-6 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-md border border-slate-100 flex items-center gap-3">
                <div className="relative flex-grow">
                  <i className="ph-bold ph-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
                  <input type="text" placeholder="請輸入路線名稱" className="w-full pl-12 pr-4 py-3 bg-transparent focus:outline-none text-[15px] text-slate-800 placeholder-slate-400 font-medium" />
                </div>
                <button className="shrink-0 bg-[#587a68] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#456353] transition shadow-md flex items-center justify-center gap-2 text-[15px]">
                  <i className="fa-solid fa-route text-[14px] relative top-[1px]"></i> 查詢路線
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 flex-grow">
                {ROUTE_CARDS.map((r) => (
                  <div key={r.name} className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer h-56 sm:h-auto min-h-[220px] bg-slate-300">
                    <img src={r.src} alt={r.alt} className="absolute inset-0 w-full h-full object-cover transition transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <span className="inline-block bg-[#5F7F68]/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[14px] font-normal mb-2.5 border border-[#5F7F68]/50">{r.park}</span>
                      <h3 className="text-2xl font-medium mb-2 tracking-wide">{r.name}</h3>
                      <div className="flex items-center gap-4 text-[13px] opacity-90 font-medium">
                        <span className="flex items-center gap-1.5"><i className="ph-bold ph-mountains text-white/70"></i> {r.elev}</span>
                        <span className="flex items-center gap-1.5"><i className="fa-solid fa-clock-rotate-left text-white/70"></i> {r.dur}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-2.5 mt-6 mb-2">
                <button className="w-2.5 h-2.5 rounded-full bg-[#F2F2F2] shadow-md cursor-pointer"></button>
                <button className="w-2.5 h-2.5 rounded-full bg-[#F2F2F2]/30 hover:bg-[#5F7F68]/60 transition cursor-pointer"></button>
                <button className="w-2.5 h-2.5 rounded-full bg-[#F2F2F2]/30 hover:bg-[#5F7F68]/60 transition cursor-pointer"></button>
              </div>
            </div>

            {/* 右：快速查詢 */}
            <div className="lg:col-span-4 bg-white backdrop-blur-md rounded-2xl shadow-xl overflow-hidden flex flex-col h-full border border-slate-200">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-5 shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-[#5F7F68]">
                    <i className="ph-fill ph-check-circle text-[18px]"></i>
                    <span className="text-[15px] font-bold tracking-wide">目前可收件</span>
                  </div>
                  <div className="text-red-500 text-[13px] font-medium">* 玉山於辦理抽籤期間則暫停申請</div>
                </div>
                <div className="flex items-center justify-between pt-3">
                  <div className="text-[13px] font-bold text-slate-600">
                    現在時間：<span className="font-medium tracking-tight">{clock}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <form className="space-y-5 flex flex-col h-full">
                  <div className="space-y-4">
                    {[
                      { label: "單位",       opts: ["太魯閣國家公園管理處"] },
                      { label: "路線",       opts: ["奇萊"] },
                      { label: "次路線",     opts: ["奇萊主、北峰線"] },
                    ].map(({ label, opts }) => (
                      <div key={label}>
                        <label className="block text-[13px] font-bold text-slate-600 mb-1.5">{label}</label>
                        <select className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-[14px] text-slate-800 focus:ring-1 focus:ring-slate-400 focus:outline-none shadow-sm transition">
                          {opts.map((o) => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    ))}
                    <div>
                      <label className="block text-[13px] font-bold text-slate-600 mb-1.5">預計入園日期</label>
                      <input type="text" defaultValue="2026-03-09" className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-[14px] text-slate-800 focus:ring-1 focus:ring-slate-400 focus:outline-none shadow-sm" />
                    </div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                    <h4 className="text-emerald-800 text-[13px] font-bold mb-2">可申請期限</h4>
                    <span className="text-[13px] font-bold">2026-01-11 07:00 ~ 2026-03-06 23:00</span>
                  </div>
                  <div className="mt-auto">
                    <button type="button" className="w-full bg-[#587a68] text-white py-3 rounded-lg font-medium hover:bg-[#456353] transition shadow-md flex items-center justify-center gap-2 text-[15px]">
                      <i className="ph-bold ph-magnifying-glass text-[15px] relative top-[1px]"></i> 查詢可申請日期
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── 最新公告 ── */}
      <section className="relative bg-[url('assets/bulletin-bg.png')] bg-cover bg-center py-16 border-t border-slate-100">
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-slate-800 border-l-4 border-[#587a68] pl-4" style={{ fontFamily: "'Noto Serif TC', serif" }}>最新公告</h3>
            <a href="#" className="text-slate-600 hover:text-slate-900 font-bold transition flex items-center gap-2 text-[15px]">查看更多 <i className="fa-solid fa-arrow-right"></i></a>
          </div>
          <div className="flex flex-wrap gap-2.5 mb-8">
            {ORG_TAGS.map((tag) => (
              <button key={tag} onClick={() => setActiveTag(tag)}
                className={`px-5 py-1.5 rounded-full text-[14px] transition border shadow-sm ${activeTag === tag ? "bg-[#587a68] text-white font-bold border-transparent" : "bg-white text-slate-600 font-medium hover:bg-slate-50 border-slate-200"}`}>
                {tag}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <ul className="divide-y divide-slate-100">
              {ANNOUNCEMENTS.filter((a) => activeTag === "全部" || a.org === activeTag).map((item) => (
                <li key={item.title} className="px-5 py-4 hover:bg-slate-50 transition cursor-pointer group flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                  <div className="shrink-0 md:w-[90px]"><span className="text-slate-500 text-[14px] font-medium tracking-wide">{item.date}</span></div>
                  <div className="shrink-0 md:w-[130px]"><span className="bg-green-50 text-green-700 text-[12px] font-medium px-2.5 py-1 rounded border border-green-100/50 inline-block text-center">{item.org}</span></div>
                  <div className="flex-grow flex items-center gap-2 min-w-0">
                    {item.pinned ? <i className="ph-fill ph-push-pin text-red-500 text-[15px] shrink-0 -rotate-45"></i> : <div className="w-[15px] shrink-0"></div>}
                    <h4 className="text-[15px] font-medium text-slate-800 group-hover:text-[#587a68] transition truncate">{item.title}</h4>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 常見問答 ── */}
      <section className="relative bg-[url('assets/qa-bg.png')] bg-cover bg-center py-16">
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-slate-800 border-l-4 border-[#587a68] pl-4" style={{ fontFamily: "'Noto Serif TC', serif" }}>常見問答</h3>
            <a href="#" className="text-slate-600 hover:text-slate-900 font-bold transition flex items-center gap-2 text-[15px]">查看更多 <i className="fa-solid fa-arrow-right"></i></a>
          </div>
          <div className="space-y-4">
            {FAQS.map(({ q, a, open }) => (
              <details key={q} className="bg-white rounded-xl shadow-sm border border-white group overflow-hidden" open={open || undefined}>
                <summary className="font-bold text-[15px] cursor-pointer list-none p-5 flex justify-between items-center text-slate-800 group-open:text-[#587a68] hover:text-[#587a68] transition-colors">
                  {q}
                  <span className="transition-transform duration-300 group-open:rotate-180 text-slate-400 group-open:text-[#587a68]"><i className="fa-solid fa-chevron-down"></i></span>
                </summary>
                <div className="px-5 pb-5 text-[14px] text-slate-600 leading-relaxed border-t border-slate-50 pt-4">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<IndexApp />);
