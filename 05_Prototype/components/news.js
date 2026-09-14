/* ============================================================
   news.js — 公布欄的資料、頁面區域元件與初始化（原 News.jsx，616 行）
   版面已搬回 news.html。
   ============================================================

   ------------------------------------------------------------
   useState / useMemo → Vue 的逐一對應
   ------------------------------------------------------------
   | 原 React                                  | Vue                  | 備註 |
   |-------------------------------------------|----------------------|------|
   | useState(getInitialTab) activeTab         | data.activeTab       | 由網址 ?tab= 決定初值 |
   | useState(EMPTY_FILTER)   draft            | data.draft           | 表單上的草稿條件 |
   | useState(EMPTY_FILTER)   applied          | data.applied         | 按下查詢才套用 |
   | useState(1)              page             | data.page            | |
   | useState(null)           modalItem        | data.modalItem       | null＝不開彈窗 |
   | useMemo filtered  [tab.key, applied]      | computed.filtered    | |
   | useMemo columns   [tab.key]               | computed.columns     | 只留 key/label/cls，render 改走 slot |
   | setDraftField(patch)                      | methods.setDraftField | Object.assign 淺合併，照原樣 |
   | changeTab(index)                          | methods.changeTab    | 含 history.pushState，見下 |
   | submitFilter(e)                           | methods.submitFilter | @submit.prevent |
   | resetFilter()                             | methods.resetFilter  | |
   | 區域元件 AgencyBadge                       | p-news-agency-badge  | |
   | 區域元件 BulletinTable                     | p-news-table         | 欄位有 cls、空列用 colSpan |
   | 共用元件 BulletinPager                     | th-table-pager       | 已移植進 assets/components/ |

   ------------------------------------------------------------
   history.pushState 的處理（重點：**刻意不加 popstate 監聽**）
   ------------------------------------------------------------
   React 版的作法：
     - 初始化時 getInitialTab() 讀一次 ?tab=（接受 key 或索引數字）
     - changeTab() 用 window.history.pushState({path:newUrl}, "", newUrl) 換網址
     - **沒有任何 popstate 監聽器**

   所以 React 版的實際行為是：按瀏覽器上一頁，**網址會變但畫面不會跟著回去**
   （只有重新整理才會依網址重建頁籤）。這是既有行為，不是我要修的 bug。

   Vue 版完全照搬同一套：初值讀網址、changeTab 呼叫同樣的 pushState、
   **不加 popstate**。加了會讓上一頁行為與 React 版不同，屬於「改善」而非「遷移」，
   本階段的驗收是行為相同，所以不做。
   若日後要讓上一頁真的切回頁籤，那是獨立的需求，應另開一張卡。
   ------------------------------------------------------------
   ============================================================ */

/* ── 發布單位（國家公園署與附屬管理機關）── */
const ALL_AGENCIES = [
  { id: "all",      label: "全部" },
  { id: "nps",      label: "國家公園署" },
  { id: "yushan",   label: "玉管處" },
  { id: "taroko",   label: "太管處" },
  { id: "sheipa",   label: "雪管處" },
  { id: "forestry", label: "林業保育署" },
  { id: "police",   label: "警政署" },
];

/* ── 假資料：最新消息 ── */
const MOCK_ANNOUNCEMENTS = [
  {
    id: "4975", date: "2026-09-08", org: "玉管處", agencyId: "yushan", pinned: true,
    title: "公告自115年9月9日起恢復玉山國家公園八通關線、南二段線、秀姑巒線及馬博拉斯橫斷線生態保護區登山路線之入園活動。",
    bodyHtml: `<p>依據：國家公園法第19條。</p>
<p>公告事項：</p>
<p>一、開放登山路線：</p>
<p style="padding-left: 1.5rem">（一）已開放登山路線：玉山主群峰線、南橫三山-庫哈諾辛山/關山線、新康山線及瓦拉米線。</p>
<p style="padding-left: 1.5rem">（二）本次開放登山路線：八通關線、南二段線、秀姑巒線及馬博拉斯橫斷線。</p>
<p>二、其他尚未開放路線，其開放時間、條件及申請方式，屆時另依本處入園網頁公布為主。</p>
<p>三、山區易有降雨情形，地質不穩，並常有落石、崩塌危險，入園時務請注意路況及自身安全。如遇危險路段，應審慎評估通行安全，切勿強行通過。</p>
<p>【路況提醒】八通關步道3.1K處日前因土石崩塌、路基沖刷，經緊急搶修處理，雖已恢復可通行，惟該路段路況仍不穩定，行經該路段時務請注意安全！</p>`,
    content: `一、開放登山路線：八通關線、南二段線、秀姑巒線及馬博拉斯橫斷線。
二、其他尚未開放路線，其開放時間另依本處入園網頁公布為主。
三、山區易有降雨及落石危險，行經八通關步道3.1K處請特別注意安全。`,
    files: [
      { name: "玉園字第1151008352號公告", format: "PDF", size: "328 KB", href: "https://hike.taiwan.gov.tw/nationpark/manasystem/news/files/news/dbc8ab9c-2cab-4729-a9ab-2728b88bb148.pdf" }
    ]
  },
  {
    id: "4973", date: "2026-09-07", org: "林業保育署", agencyId: "forestry", pinned: true,
    title: "2026嘉明湖手作步道工作假期來囉～號召熱愛山林及親近自然的您，一同前來參與手作步道活動！",
    bodyHtml: `<p class="lead font-medium text-slate-800 mb-4">2026嘉明湖手作步道工作假期來囉～號召熱愛山林及親近自然的您，一同前來參與手作步道活動！</p>
<ul class="space-y-2 mb-4">
  <li><strong>1、錄取名額：</strong>18名</li>
  <li><strong>2、報名期間：</strong>自即日起至9月18日下午5時，統一採取「網路報名」方式</li>
  <li><strong>3、活動日期：</strong>2026 年 10 月 7 日至 10 月 11 日，共 5 天 4 夜</li>
  <li><strong>4、活動地點：</strong>嘉明湖國家步道（沒有要去看嘉明湖唷）、射馬干部落</li>
  <li><strong>5、報名網址：</strong><a href="https://forms.gle/74ybBzcqwEybsMFg7" target="_blank" rel="noopener noreferrer" class="text-emerald-700 underline font-medium hover:text-emerald-800">https://forms.gle/74ybBzcqwEybsMFg7</a></li>
  <li><strong>6、活動簡章：</strong><a href="https://drive.google.com/file/d/1imampS6M-gz9tB-jbRv97TntbZaHN9Q2/view?usp=drive_link" target="_blank" rel="noopener noreferrer" class="text-emerald-700 underline font-medium hover:text-emerald-800">點此下載活動簡章（Google Drive）</a></li>
</ul>`,
    content: `2026嘉明湖手作步道工作假期來囉～號召熱愛山林及親近自然的您，一同前來參與手作步道活動！
1、錄取名額：18名
2、報名期間：即日起至9月18日17:00止
3、活動日期：2026年10月7日至10月11日（5天4夜）`,
    files: [
      { name: "2026嘉明湖手作步道工作假期簡章", format: "PDF", size: "1.2 MB", href: "https://drive.google.com/file/d/1imampS6M-gz9tB-jbRv97TntbZaHN9Q2/view?usp=drive_link" }
    ]
  },
  {
    id: "a1", date: "2026-03-09", org: "太管處", agencyId: "taroko", pinned: true,
    title: "公告115年4月1日起至4月19日辦理奇萊稜線新山屋吊掛作業",
    content: `一、本處辦理「奇萊稜線新山屋建置工程」，訂於115年4月1日至4月19日進行材料與組件空中吊掛作業。
二、吊掛作業期間為維護登山山友安全，奇萊稜線山屋及周邊營地暫停開放申請及住宿。
三、行程行經奇萊主、北峰之隊伍，請密切注意施工通告與現場警戒標示，切勿強行通過吊掛作業區域。
四、如有相關疑問，請洽太魯閣國家公園管理處遊憩服務科（03-8621100分機601）。`
  },
  {
    id: "a2", date: "2026-03-05", org: "雪管處", agencyId: "sheipa", pinned: true,
    title: "115年雪霸國家公園清明連假期間入園申請注意事項",
    content: `一、115年清明連續假期（4月3日至4月6日），雪霸國家公園生態保護區入園申請熱門。
二、為維護公平性，請獲准隊伍如需異動人員或取消行程，務必於入園前1天15:00前至系統辦理。
三、山區氣候多變，行前請評估隊員體能狀況及裝備完整性，並確實遵守園區禁止事項。`
  },
  {
    id: "a3", date: "2026-03-04", org: "林業保育署", agencyId: "forestry", pinned: true,
    title: "【嘉明湖國家步道】在「臺灣登山一站式」申請住宿訂單相關說明",
    content: `一、嘉明湖國家步道山屋床位及營地申請已完整整合至「臺灣登山申請一站式服務網」。
二、申請人於送出申請後，請於系統指定期限內完成繳費作業，逾期視同放棄資格。
三、退費申請請依《林業及自然保育署山屋與營地收費退費基準》線上申辦。`
  },
  {
    id: "a4", date: "2026-02-26", org: "國家公園署", agencyId: "nps", pinned: true,
    title: "「臺灣登山申請一站式服務網」系統維護作業公告（115年3月15日）",
    content: `一、為提升系統效能，本網訂於115年3月15日00:00至06:00進行例行系統維護。
二、維護期間暫停所有線上申請、繳費與許可證下載服務，造成不便敬請見諒。
三、抽籤結果公布時間不受本次維護影響，仍依原公告時程辦理。`
  },
  {
    id: "a5", date: "2026-02-18", org: "雪管處", agencyId: "sheipa", pinned: false,
    title: "雪霸國家公園雪季期間入園裝備自主檢查表修訂公告",
    content: `一、配合115年雪季管理措施，本處修訂「雪季期間入園裝備自主檢查表」。
二、申請雪季期間入園之隊伍，須於送件時一併上傳填妥之檢查表。
三、表單可於本網「公布欄／檔案下載」取得。`
  },
  {
    id: "a6", date: "2026-02-10", org: "太管處", agencyId: "taroko", pinned: false,
    title: "公告本處屏風避難山屋周邊區域進行松材線蟲防治作業",
    content: `一、本處委外辦理松材線蟲防治作業，作業區域包含屏風避難山屋及其周邊林區。
二、作業期間該區域暫停開放並禁止進入，請登山隊伍另擇路線。
三、實際開放日期將另行公告。`
  },
  {
    id: "a7", date: "2026-01-30", org: "玉管處", agencyId: "yushan", pinned: false,
    title: "排雲山莊容宿量調整措施延長辦理通知",
    content: `一、為維護排雲山莊周邊供水設施與生態環境負擔，原排雲山莊容宿量調整措施將延長執行至115年6月30日。
二、每日開放申請名額以系統顯示為準，請各登山隊伍預先規劃行程。`
  },
  {
    id: "a8", date: "2026-01-22", org: "林業保育署", agencyId: "forestry", pinned: false,
    title: "【天池山莊】115年全國登山日推廣計畫活動報名開始",
    content: `一、本署辦理115年全國登山日推廣計畫，開放天池山莊住宿名額供活動參加者申請。
二、報名期間自115年2月1日起至2月28日止，採線上報名。
三、活動細節請詳閱簡章。`
  },
  {
    id: "a9", date: "2026-01-15", org: "警政署", agencyId: "police", pinned: false,
    title: "關於進入山地經常管制區線上申辦注意事項與憑證驗證說明",
    content: `一、民眾申請山地管制區入山許可，可於本一站式服務網一併勾選送件。
二、經核准後系統將自動生成入山許可證電子憑證（含 QR Code），登山時請下載存於手機或印出隨身攜帶。`
  },
  {
    id: "a10", date: "2026-01-08", org: "國家公園署", agencyId: "nps", pinned: false,
    title: "沙德爾颱風接近又逢大潮，國家公園署提醒山海遊憩提高警覺",
    content: `一、沙德爾颱風外圍環流影響期間，各國家公園山區將有強風豪雨。
二、已核准之入園申請如遇園區預警性封閉，系統將自動取消並全額退還已繳費用。
三、請山友密切注意中央氣象署發布之各項警特報。`
  },
  {
    id: "a11", date: "2025-12-28", org: "玉管處", agencyId: "yushan", pinned: false,
    title: "公告自115年1月1日起恢復玉山國家公園南橫三山入園活動",
    content: `一、南橫三山（庫哈諾辛山、關山嶺山、塔關山）路線災損修復完成。
二、自115年1月1日起恢復開放入園申請。
三、部分路段仍有落石風險，請隊伍自行評估並攜帶足夠安全裝備。`
  },
  {
    id: "a12", date: "2025-12-15", org: "雪管處", agencyId: "sheipa", pinned: false,
    title: "九九山莊水源中斷（115年8月21～27日），請民眾於馬達拉溪登山口自備所需用水",
    content: `一、九九山莊供水管線因豪雨受損，維修期間將暫停供水。
二、請已核准隊伍於馬達拉溪登山口自行取水或攜帶足量飲用水。
三、修復完成後另行公告。`
  },
  {
    id: "a13", date: "2025-12-02", org: "林業保育署", agencyId: "forestry", pinned: false,
    title: "【檜谷山莊】如從登山一站式網提出申請，需在登山一站式網登入退費",
    content: `一、檜谷山莊住宿申請已整合至本網，退費作業一併由本網受理。
二、請申請人以原申請帳號登入，於「申請進度查詢/繳費/異動/取消」辦理退費。
三、透過其他管道申請者，仍請洽原受理單位。`
  },
  {
    id: "a14", date: "2025-11-20", org: "警政署", agencyId: "police", pinned: false,
    title: "山域事故通報與緊急聯絡管道宣導",
    content: `一、山域發生事故時請優先撥打119或112報案。
二、報案時請提供隊伍申請編號、GPS座標與傷病狀況，以利救援單位判斷。
三、本網申請資料將於救援時提供予搜救單位使用。`
  }
];
window.MOCK_ANNOUNCEMENTS = MOCK_ANNOUNCEMENTS;

/* ── 假資料：違規名單 ──
   欄位比照正式站 news_5（單位／姓名／違規或核定日期／酌情准駁期間／違規類別／違規原因），
   但姓名與日期全為虛構，不對應正式站名單上的任何一列（違規原因引用的法規條號為公開法規，非個資）。*/
const MOCK_VIOLATIONS = [
  { id: "V01", org: "玉管處", agencyId: "yushan", name: "方*恆", date: "2026/08/26", banStart: "2026/08/26", banEnd: "2027/02/22", category: "半年不予許可入園", reason: "違反《申請進入玉山國家公園生態保護區許可注意事項》第十九點第一項第（一）款第1目規定(112.2.14修訂)" },
  { id: "V02", org: "玉管處", agencyId: "yushan", name: "石*澤", date: "2026/08/23", banStart: "2026/08/23", banEnd: "2027/02/19", category: "半年不予許可入園", reason: "違反《申請進入玉山國家公園生態保護區許可注意事項》第十九點第一項第（一）款第1目規定(112.2.14修訂)" },
  { id: "V03", org: "玉管處", agencyId: "yushan", name: "童*珊", date: "2026/08/19", banStart: "2026/08/19", banEnd: "2027/02/15", category: "半年不予許可入園", reason: "違反《申請進入玉山國家公園生態保護區許可注意事項》第十九點第一項第（一）款第1目規定(112.2.14修訂)" },
  { id: "V04", org: "雪管處", agencyId: "sheipa", name: "卓*睿", date: "2026/08/14", banStart: "2026/08/14", banEnd: "2027/02/10", category: "半年不予許可入園", reason: "核准後未入園且未於入園前1日15:00前辦理取消申請" },
  { id: "V05", org: "雪管處", agencyId: "sheipa", name: "秦*寧", date: "2026/08/07", banStart: "2026/08/07", banEnd: "2027/08/06", category: "一年不予許可入園", reason: "未經許可擅自進入生態保護區，違反國家公園法第19條規定" },
  { id: "V06", org: "太管處", agencyId: "taroko", name: "尤*樺", date: "2026/07/29", banStart: "2026/07/29", banEnd: "2026/10/28", category: "三個月不予許可入園", reason: "未依核准路線行進並擅自變更宿營地點" },
  { id: "V07", org: "太管處", agencyId: "taroko", name: "樊*蓉", date: "2026/07/11", banStart: "2026/07/11", banEnd: "2027/07/10", category: "一年不予許可入園", reason: "冒名頂替及夾帶未核准人員入園" },
  { id: "V08", org: "林業保育署", agencyId: "forestry", name: "池*昱", date: "2026/06/27", banStart: "2026/06/27", banEnd: "2026/12/26", category: "半年不予許可入園", reason: "已完成山屋床位預訂且未取消而未報到（No-show）" },
  { id: "V09", org: "林業保育署", agencyId: "forestry", name: "岑*淇", date: "2026/06/14", banStart: "2026/06/14", banEnd: "2026/09/13", category: "三個月不予許可入園", reason: "於山屋內使用明火炊事，違反山屋管理規定" },
  { id: "V10", org: "玉管處", agencyId: "yushan", name: "蒲*謙", date: "2026/06/02", banStart: "2026/06/02", banEnd: "2026/12/01", category: "半年不予許可入園", reason: "違反《申請進入玉山國家公園生態保護區許可注意事項》第十九點第一項第（二）款規定" },
  { id: "V11", org: "雪管處", agencyId: "sheipa", name: "王*明", date: "2026/05/28", banStart: "2026/05/28", banEnd: "2026/11/27", category: "半年不予許可入園", reason: "棄置垃圾於園區內且經勸導不聽" },
  { id: "V12", org: "太管處", agencyId: "taroko", name: "張*婷", date: "2025/11/15", banStart: "2025/11/15", banEnd: "2026/02/14", category: "三個月不予許可入園", reason: "未攜帶核准之入園許可證正本並拒絕出示身分證明" }
];

/* ── 假資料：檔案下載（比照正式站 news_6 的列表與多格式下載）── */
const MOCK_DOWNLOADS = [
  { id: "d1",  org: "雪管處", agencyId: "sheipa",   title: "115年雪季期間生態保護區入園申請說明", files: [{ format: "PDF", href: "#" }] },
  { id: "d2",  org: "玉管處", agencyId: "yushan",   title: "入山入園申請書", files: [{ format: "PDF", href: "#" }, { format: "ODT", href: "#" }] },
  { id: "d3",  org: "玉管處", agencyId: "yushan",   title: "玉山登山指南(英文)", files: [{ format: "PDF", href: "#" }] },
  { id: "d4",  org: "玉管處", agencyId: "yushan",   title: "排雲山莊外籍提前申請說明(英文)", files: [{ format: "PDF", href: "#" }] },
  { id: "d5",  org: "玉管處", agencyId: "yushan",   title: "未成年家長同意書範本", files: [{ format: "PDF", href: "#" }, { format: "ODT", href: "#" }] },
  { id: "d6",  org: "玉管處", agencyId: "yushan",   title: "登山隊伍領隊異動申請書", files: [{ format: "PDF", href: "#" }, { format: "ODT", href: "#" }, { format: "XLSX", href: "#" }] },
  { id: "d7",  org: "玉管處", agencyId: "yushan",   title: "雪季期間入園申請說明(含自我檢查表及聲明書)", files: [{ format: "PDF", href: "#" }, { format: "JPG", href: "#" }] },
  { id: "d8",  org: "玉管處", agencyId: "yushan",   title: "圓峰宿營地申請注意事項及聲明書", files: [{ format: "PDF", href: "#" }, { format: "PNG", href: "#" }] },
  { id: "d9",  org: "玉管處", agencyId: "yushan",   title: "退還預繳使用規費申請書(含委託書，住宿日114年12月1日起適用)", files: [{ format: "ODT", href: "#" }, { format: "PDF", href: "#" }] },
  { id: "d10", org: "玉管處", agencyId: "yushan",   title: "玉山國家公園生態保護區登山計畫書範例說明", files: [{ format: "PDF", href: "#" }, { format: "ODT", href: "#" }] },
  { id: "d11", org: "太管處", agencyId: "taroko",   title: "太魯閣國家公園步道通訊點彙整表", files: [{ format: "PDF", href: "#" }, { format: "PNG", href: "#" }] },
  { id: "d12", org: "太管處", agencyId: "taroko",   title: "申請進入太魯閣國家公園生態保護區許可注意事項", files: [{ format: "PDF", href: "#" }] },
  { id: "d13", org: "林業保育署", agencyId: "forestry", title: "個人及團體裝備檢查表", files: [{ format: "PDF", href: "#" }, { format: "ODT", href: "#" }] },
  { id: "d14", org: "林業保育署", agencyId: "forestry", title: "山屋與營地收費退費基準", files: [{ format: "PDF", href: "#" }] },
  { id: "d15", org: "警政署", agencyId: "police",   title: "入山許可證申辦須知（山地經常管制區）", files: [{ format: "PDF", href: "#" }, { format: "ODT", href: "#" }] }
];

/* ── 假資料：常見問答（欄位比照正式站 news_7：發布單位／異動日期／發布類別／標題）── */
const MOCK_FAQS = [
  {
    id: "f1", org: "玉管處", agencyId: "yushan", date: "2026/05/19", cat: "01-入園申請規定",
    q: "外籍人士沒有臺灣身分證，該如何進行線上申請？",
    a: `外籍人士申請時，請於身分證字號欄位選擇「護照」或「居留證」，並輸入有效的護照號碼。

一般路線請於入園前 5 天至 2 個月提出申請；若為熱門抽籤路線（如玉山主峰、雪山主峰），請配合各園區之外籍人士提前預約配額時程辦理。`
  },
  {
    id: "f2", org: "國家公園署", agencyId: "nps", date: "2026/05/06", cat: "02-人員更換與異動",
    q: "申請通過核准後，如果隊員臨時無法前往可以更換人員嗎？",
    a: `依規定，入園許可核准後原則上不可任意更換人員（僅領隊因故無法前往時得推派原隊員遞補為領隊）。

若有隊員無法前往，請於入園前1日15:00前至系統辦理「取消申請」或「扣除未去隊員」，切勿隨意挾帶未核准人員入山。`
  },
  {
    id: "f3", org: "國家公園署", agencyId: "nps", date: "2026/06/16", cat: "C03-入園申請進度",
    q: "忘記申請編號或許可證下載連結該怎麼辦？",
    a: `您可以點選網站右上角的「申請進度查詢/繳費/異動/取消」，輸入申請時填寫的「申請人身分證字號」與「電子信箱」，系統將發送驗證碼至您的信箱，驗證後即可查詢申請編號並下載入園許可證。`
  },
  {
    id: "f4", org: "林業保育署", agencyId: "forestry", date: "2026/06/03", cat: "04-退費與繳費",
    q: "如果因為天候因素（如中央氣象署發布颱風警報）園區封閉，退費流程為何？",
    a: `若遇不可抗力因素（如颱風警報、豪雨特報或天然災害園區預警性封閉），系統將自動取消該期間之許可證。

若有預訂付費山屋（如天池山莊、檜谷山莊、嘉明湖山屋），系統將全額退還已繳費用，申請人毋須負擔手續費。`
  },
  {
    id: "f5", org: "警政署", agencyId: "police", date: "2026/03/18", cat: "05-許可證與入山證",
    q: "申請進入山地管制區，還需要另外跑警局申請入山許可證嗎？",
    a: `本一站式服務網已整合內政部警政署系統。在填寫入園申請表時，勾選「一併申辦入山許可」並完成資料填寫，審核通過後系統將自動完成入山許可申辦，免去重複至警政署網站或現場臨櫃申請之繁瑣程序。`
  },
  {
    id: "f6", org: "玉管處", agencyId: "yushan", date: "2026/08/12", cat: "01-入園申請規定",
    q: "如何申請住宿玉山國家公園之「排雲山莊」？",
    a: `排雲山莊床位採線上抽籤方式辦理，請於入園日前 2 個月起至前 1 個月止提出申請，逾期不受理。

抽籤結果公布後，中籤者須於指定期限內完成繳費，未繳費者視同放棄。`
  },
  {
    id: "f7", org: "玉管處", agencyId: "yushan", date: "2026/06/16", cat: "01-入園申請規定",
    q: "沒有中籤，要怎麼排隊候補？",
    a: `抽籤未中籤者將自動列入候補序位，無須另行申請。

如有中籤隊伍放棄或未於期限內繳費，系統將依候補序位遞補並以電子郵件通知，請留意信箱。`
  },
  {
    id: "f8", org: "太管處", agencyId: "taroko", date: "2026/04/08", cat: "C15-系統使用問題",
    q: "如何操作「路線規劃」？",
    a: `於「登山申請」選擇欲前往之國家公園與路線後，系統會依所選路線自動帶出可用之山屋與營地。

逐日點選住宿點即可完成行程規劃，系統會同步檢核每日行進距離與床位可用量。`
  },
  {
    id: "f9", org: "太管處", agencyId: "taroko", date: "2026/02/24", cat: "C15-系統使用問題",
    q: "什麼是承載管制？山屋是否有做床位分配？",
    a: `承載管制係指依生態承載量對每日入園人數設定上限，各路線上限不同，以系統顯示之可申請名額為準。

山屋床位由系統於核准後統一分配，不接受指定床位。`
  },
  {
    id: "f10", org: "雪管處", agencyId: "sheipa", date: "2026/01/20", cat: "01-入園申請規定",
    q: "雪季期間申請入園有哪些額外規定？",
    a: `雪季期間（各園區公告期間不同）申請入園，須額外檢附「雪季期間裝備自我檢查表」與「入園者聲明書」。

隊伍須攜帶冰斧、冰爪、頭盔等雪地裝備，並於申請時載明。`
  },
  {
    id: "f11", org: "林業保育署", agencyId: "forestry", date: "2025/12/11", cat: "04-退費與繳費",
    q: "山屋住宿費用可以線上繳納嗎？有哪些方式？",
    a: `可以。核准後系統將產生繳費單，支援信用卡、網路 ATM 與超商代碼繳費三種方式。

繳費期限依核准通知所載為準，逾期系統將自動取消該筆申請。`
  },
  {
    id: "f12", org: "國家公園署", agencyId: "nps", date: "2025/11/05", cat: "C03-入園申請進度",
    q: "出園後需要回報嗎？沒有回報會有什麼影響？",
    a: `國家公園入園隊伍須於出園後至「國家公園出園回報」完成回報。

未於期限內回報者，系統將發出提醒通知；累計未回報達一定次數，將影響後續申請權益。`
  }
];

/* FAQ 發布類別選項（由資料推導，避免兩處各維護一份） */
const FAQ_CATEGORIES = ["all"].concat(
  MOCK_FAQS.map(f => f.cat).filter((c, i, arr) => arr.indexOf(c) === i).sort()
);

/* ── 頁籤定義 ── */
const TABS = [
  { key: "news",      label: "最新消息", icon: "fa-solid fa-bullhorn",         unit: "則" },
  { key: "violation", label: "違規名單", icon: "fa-solid fa-user-xmark",       unit: "筆" },
  { key: "download",  label: "檔案下載", icon: "fa-solid fa-file-arrow-down",  unit: "份" },
  { key: "faq",       label: "常見問答", icon: "fa-solid fa-circle-question",  unit: "則" },
];

const PAGE_SIZE = 10;

/* 篩選條件初始值（四個頁籤共用同一個結構，各頁籤只用得到其中幾個欄位） */
const EMPTY_FILTER = { agency: "all", q: "", start: "", end: "", sort: "date_desc", cat: "all" };

/* 檔案格式對應的 icon */
const FILE_ICONS = {
  PDF: "fa-regular fa-file-pdf",
  ODT: "fa-regular fa-file-word", DOC: "fa-regular fa-file-word", DOCX: "fa-regular fa-file-word",
  XLSX: "fa-regular fa-file-excel", XLS: "fa-regular fa-file-excel", CSV: "fa-regular fa-file-excel",
  PNG: "fa-regular fa-file-image", JPG: "fa-regular fa-file-image", JPEG: "fa-regular fa-file-image",
};

/* ── 共用小元件 ── */

/* 區域元件：發布單位徽章（原 AgencyBadge） */
var pNewsAgencyBadge = {
  props: { agencyId: { type: String, required: true }, org: { type: String, required: true } },
  template: `<span :class="'bulletin-badge agency-' + agencyId">{{ org }}</span>`,
};

/* 區域元件：統一表格（原 BulletinTable）
   與共用的 th-data-table 不同之處，所以沒有沿用：
   - 每欄有自己的 cls（col-org／col-date／col-cat…），th-data-table 沒有這個概念
   - 無資料時是一列 colSpan 橫跨全表並放 .th-empty，th-data-table 是整塊取代表格
   格內容由 cell scoped slot 決定，模板寫在 news.html。 */
var pNewsTable = {
  props: {
    columns: { type: Array, required: true },
    rows: { type: Array, required: true },
    emptyText: { type: String, required: true },
    /* 表格說明，只朗讀不顯示（WCAG 1.3.1） */
    caption: { type: String, required: true },
  },
  template: `
    <div class="th-table-wrap th-table-card">
      <table class="th-table th-table--zebra">
        <caption>{{ caption }}</caption>
        <thead>
          <tr>
            <th v-for="c in columns" :key="c.key" scope="col" :class="c.cls">{{ c.label }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="rows.length > 0">
            <tr v-for="row in rows" :key="row.id" :class="{ 'is-pinned': row.pinned }">
              <td v-for="c in columns" :key="c.key" :class="c.cls" :data-label="c.label">
                <slot name="cell" :row="row" :column="c"></slot>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td :colspan="columns.length">
              <div class="th-empty">
                <i class="fa-solid fa-inbox" aria-hidden="true"></i>{{ emptyText }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
};

/* 由網址 ?tab= 決定初始頁籤。接受 key（news／violation／download／faq）
   或索引數字，與原 getInitialTab 逐字相同。 */
function newsInitialTab() {
  var t = new URLSearchParams(window.location.search).get("tab");
  var byKey = TABS.findIndex(function (x) { return x.key === t; });
  if (byKey >= 0) return byKey;
  var byIndex = parseInt(t, 10);
  return Number.isInteger(byIndex) && byIndex >= 0 && byIndex < TABS.length ? byIndex : 0;
}

thPage({
  components: {
    "p-news-agency-badge": pNewsAgencyBadge,
    "p-news-table": pNewsTable,
  },

  data() {
    return {
      activeTab: newsInitialTab(),
      draft: Object.assign({}, EMPTY_FILTER),
      applied: Object.assign({}, EMPTY_FILTER),
      page: 1,
      modalItem: null,
    };
  },

  computed: {
    tabs() { return TABS; },
    allAgencies() { return ALL_AGENCIES; },
    faqCategories() { return FAQ_CATEGORIES; },
    fileIcons() { return FILE_ICONS; },
    tab() { return TABS[this.activeTab]; },

    searchPlaceholder() {
      return {
        news: "請輸入公告標題或內容關鍵字",
        violation: "請輸入姓名或違規原因關鍵字",
        download: "請輸入檔案名稱關鍵字",
        faq: "請輸入問題或解答關鍵字",
      }[this.tab.key];
    },

    /* 原 useMemo filtered，四個頁籤各自的過濾與排序邏輯逐字照搬 */
    filtered() {
      var applied = this.applied;
      var matchAgency = function (item) {
        return applied.agency === "all" || item.agencyId === applied.agency;
      };
      var matchText = function () {
        var kw = applied.q.trim().toLowerCase();
        if (!kw) return true;
        var fields = Array.prototype.slice.call(arguments);
        return fields.some(function (f) { return (f || "").toLowerCase().indexOf(kw) >= 0; });
      };

      if (this.tab.key === "news") {
        return MOCK_ANNOUNCEMENTS
          .filter(function (x) { return matchAgency(x) && matchText(x.title, x.content); })
          .filter(function (x) {
            return (!applied.start || x.date >= applied.start) && (!applied.end || x.date <= applied.end);
          })
          .slice()   // slice 不可省：下一行 sort 會就地排序（§通則）
          .sort(function (a, b) { return (b.pinned - a.pinned) || (a.date < b.date ? 1 : -1); });
      }
      if (this.tab.key === "violation") {
        return MOCK_VIOLATIONS
          .filter(function (x) { return matchAgency(x) && matchText(x.name, x.reason, x.category); })
          .slice()
          .sort(function (a, b) {
            return applied.sort === "date_asc" ? (a.date > b.date ? 1 : -1) : (a.date < b.date ? 1 : -1);
          });
      }
      if (this.tab.key === "download") {
        return MOCK_DOWNLOADS.filter(function (x) { return matchAgency(x) && matchText(x.title); });
      }
      return MOCK_FAQS
        .filter(function (x) { return matchAgency(x) && matchText(x.q, x.a); })
        .filter(function (x) { return applied.cat === "all" || x.cat === applied.cat; });
    },

    totalPages() { return Math.max(1, Math.ceil(this.filtered.length / PAGE_SIZE)); },
    safePage() { return Math.min(this.page, this.totalPages); },
    pageRows() {
      return this.filtered.slice((this.safePage - 1) * PAGE_SIZE, this.safePage * PAGE_SIZE);
    },

    /* 原 useMemo columns：只留 key／label／cls，格內容改由 news.html 的 slot 決定 */
    columns() {
      if (this.tab.key === "news") {
        return [
          { key: "org", label: "發布單位", cls: "col-org" },
          { key: "date", label: "發布日期", cls: "col-date" },
          { key: "title", label: "標題" },
        ];
      }
      if (this.tab.key === "violation") {
        return [
          { key: "org", label: "發布單位", cls: "col-org" },
          { key: "name", label: "姓名", cls: "col-name" },
          { key: "date", label: "違規或核定日期", cls: "col-date" },
          { key: "ban", label: "酌情准駁期間", cls: "col-daterange" },
          { key: "category", label: "違規類別", cls: "col-cat" },
          { key: "reason", label: "違規原因" },
        ];
      }
      if (this.tab.key === "download") {
        return [
          { key: "org", label: "發布單位", cls: "col-org" },
          { key: "title", label: "檔案名稱" },
        ];
      }
      return [
        { key: "org", label: "發布單位", cls: "col-org" },
        { key: "date", label: "異動日期", cls: "col-date" },
        { key: "cat", label: "發布類別", cls: "col-cat" },
        { key: "q", label: "標題" },
      ];
    },
  },

  methods: {
    setDraftField(patch) {
      this.draft = Object.assign({}, this.draft, patch);
    },

    /* 切頁籤：清空篩選與頁碼，並用 pushState 換網址。
       **不加 popstate 監聽**，與 React 版一致（見檔頭說明）。 */
    changeTab(index) {
      this.activeTab = index;
      this.draft = Object.assign({}, EMPTY_FILTER);
      this.applied = Object.assign({}, EMPTY_FILTER);
      this.page = 1;
      var newUrl = window.location.pathname + "?tab=" + TABS[index].key;
      window.history.pushState({ path: newUrl }, "", newUrl);
    },

    submitFilter() {
      this.applied = Object.assign({}, this.draft);
      this.page = 1;
    },

    resetFilter() {
      this.draft = Object.assign({}, EMPTY_FILTER);
      this.applied = Object.assign({}, EMPTY_FILTER);
      this.page = 1;
    },

    openModal(item) { this.modalItem = item; },

    dateSlash(d) { return d.replace(/-/g, "/"); },
  },
});
