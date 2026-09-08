// DEPRECATED 2026-09-08：該頁已遷移為 Vue（news.html ＋ components/news.js），本檔已無任何
// <script> 引用，請勿編輯。實際刪除排在階段 4——階段 3 剩餘頁面
// 仍需對照 Shared.jsx，故舊 JSX 一併保留到階段 3 結束。
/* ============================================================
   公布欄（BulletinApp）
   ------------------------------------------------------------
   四個頁籤：最新消息、違規名單、檔案下載、常見問答。
   四頁共用同一套骨架，比照正式站 hike.taiwan.gov.tw 的
   news_0（最新消息）／news_5（違規名單）／news_6（檔案下載）／news_7（常見問答）：

     頁籤列 → 篩選卡（發布單位＋頁別條件＋查詢／重置）
            → 筆數列 → 表格 → 分頁

   篩選採「草稿 → 按查詢才套用」，與正式站的表單送出行為一致。
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
二、請申請人以原申請帳號登入，於「申請進度查詢／繳費／異動／取消」辦理退費。
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
    a: `您可以點選網站右上角的「申請進度查詢／繳費／異動／取消」，輸入申請時填寫的「申請人身分證字號」與「電子信箱」，系統將發送驗證碼至您的信箱，驗證後即可查詢申請編號並下載入園許可證。`
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

function AgencyBadge({ agencyId, org }) {
  return <span className={`bulletin-badge agency-${agencyId}`}>{org}</span>;
}

/* 統一表格：columns = [{ key, label, cls, render(row) }] */
function BulletinTable({ columns, rows, emptyText }) {
  return (
    <div className="th-table-wrap th-table-card">
      <table className="th-table th-table--zebra">
        <thead>
          <tr>
            {columns.map(c => (
              <th key={c.key} className={c.cls}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? rows.map(row => (
            <tr key={row.id}>
              {columns.map(c => (
                <td key={c.key} className={c.cls} data-label={c.label}>{c.render(row)}</td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length}>
                <div className="th-empty">
                  <i className="fa-solid fa-inbox"></i>
                  {emptyText}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* 分頁元件 BulletinPager 已移到 Shared.jsx，供查詢型頁面共用 */

/* ── 主元件 ── */
function BulletinApp() {
  const getInitialTab = () => {
    const t = new URLSearchParams(window.location.search).get("tab");
    const byKey = TABS.findIndex(x => x.key === t);
    if (byKey >= 0) return byKey;
    const byIndex = parseInt(t, 10);
    return Number.isInteger(byIndex) && byIndex >= 0 && byIndex < TABS.length ? byIndex : 0;
  };

  const [activeTab, setActiveTab] = React.useState(getInitialTab);
  const [draft, setDraft] = React.useState(EMPTY_FILTER);       // 表單上的草稿條件
  const [applied, setApplied] = React.useState(EMPTY_FILTER);   // 按下查詢後實際套用的條件
  const [page, setPage] = React.useState(1);
  const [modalItem, setModalItem] = React.useState(null);

  const tab = TABS[activeTab];
  const setDraftField = (patch) => setDraft(prev => Object.assign({}, prev, patch));

  const changeTab = (index) => {
    setActiveTab(index);
    setDraft(EMPTY_FILTER);
    setApplied(EMPTY_FILTER);
    setPage(1);
    const newUrl = `${window.location.pathname}?tab=${TABS[index].key}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
  };

  const submitFilter = (e) => {
    e.preventDefault();
    setApplied(draft);
    setPage(1);
  };

  const resetFilter = () => {
    setDraft(EMPTY_FILTER);
    setApplied(EMPTY_FILTER);
    setPage(1);
  };

  const matchAgency = (item) => applied.agency === "all" || item.agencyId === applied.agency;
  const matchText = (...fields) => {
    const kw = applied.q.trim().toLowerCase();
    if (!kw) return true;
    return fields.some(f => (f || "").toLowerCase().includes(kw));
  };

  /* 各頁籤的篩選結果 */
  const filtered = React.useMemo(() => {
    if (tab.key === "news") {
      return MOCK_ANNOUNCEMENTS
        .filter(x => matchAgency(x) && matchText(x.title, x.content))
        .filter(x => (!applied.start || x.date >= applied.start) && (!applied.end || x.date <= applied.end))
        .slice()
        .sort((a, b) => (b.pinned - a.pinned) || (a.date < b.date ? 1 : -1));
    }
    if (tab.key === "violation") {
      return MOCK_VIOLATIONS
        .filter(x => matchAgency(x) && matchText(x.name, x.reason, x.category))
        .slice()
        .sort((a, b) => applied.sort === "date_asc"
          ? (a.date > b.date ? 1 : -1)
          : (a.date < b.date ? 1 : -1));
    }
    if (tab.key === "download") {
      return MOCK_DOWNLOADS.filter(x => matchAgency(x) && matchText(x.title));
    }
    return MOCK_FAQS
      .filter(x => matchAgency(x) && matchText(x.q, x.a))
      .filter(x => applied.cat === "all" || x.cat === applied.cat);
  }, [tab.key, applied]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  /* 各頁籤的欄位定義 */
  const columns = React.useMemo(() => {
    if (tab.key === "news") {
      return [
        { key: "org",   label: "發布單位", cls: "col-org",  render: r => <AgencyBadge agencyId={r.agencyId} org={r.org} /> },
        { key: "date",  label: "發布日期", cls: "col-date", render: r => r.date.replace(/-/g, "/") },
        { key: "title", label: "標題", render: r => (
            <React.Fragment>
              <button type="button" className="bulletin-link" onClick={() => setModalItem({
                title: r.title, org: r.org, agencyId: r.agencyId,
                meta: `發布日期：${r.date.replace(/-/g, "/")}`, body: r.content
              })}>{r.title}</button>
              {r.pinned && <span className="bulletin-pin">置頂</span>}
            </React.Fragment>
          )
        },
      ];
    }
    if (tab.key === "violation") {
      return [
        { key: "org",      label: "發布單位",     cls: "col-org",       render: r => <AgencyBadge agencyId={r.agencyId} org={r.org} /> },
        { key: "name",     label: "姓名",         cls: "col-name",      render: r => r.name },
        { key: "date",     label: "違規或核定日期", cls: "col-date",     render: r => r.date },
        { key: "ban",      label: "酌情准駁期間",  cls: "col-daterange", render: r => (
            <React.Fragment>{r.banStart}<br />{r.banEnd}</React.Fragment>
          )
        },
        { key: "category", label: "違規類別", cls: "col-cat", render: r => <span className="bulletin-tag bulletin-tag--warn">{r.category}</span> },
        { key: "reason",   label: "違規原因", render: r => r.reason },
      ];
    }
    if (tab.key === "download") {
      return [
        { key: "org",   label: "發布單位", cls: "col-org", render: r => <AgencyBadge agencyId={r.agencyId} org={r.org} /> },
        { key: "title", label: "檔案名稱", render: r => (
            <React.Fragment>
              <span>{r.title}</span>
              {r.files.map((f, i) => (
                <a key={i} href={f.href} target="_blank" rel="noopener noreferrer"
                   className={`bulletin-file ${f.format.toLowerCase()}`}>
                  <i className={FILE_ICONS[f.format] || "fa-regular fa-file"}></i>{f.format}
                </a>
              ))}
            </React.Fragment>
          )
        },
      ];
    }
    return [
      { key: "org",  label: "發布單位", cls: "col-org",  render: r => <AgencyBadge agencyId={r.agencyId} org={r.org} /> },
      { key: "date", label: "異動日期", cls: "col-date", render: r => r.date },
      { key: "cat",  label: "發布類別", cls: "col-cat",  render: r => <span className="bulletin-tag">{r.cat}</span> },
      { key: "q",    label: "標題", render: r => (
          <button type="button" className="bulletin-link" onClick={() => setModalItem({
            title: r.q, org: r.org, agencyId: r.agencyId,
            meta: `異動日期：${r.date}　｜　發布類別：${r.cat}`, body: r.a
          })}>{r.q}</button>
        )
      },
    ];
  }, [tab.key]);

  return (
    <div className="bg-white min-h-screen text-slate-800 antialiased">
      <Header active="bulletin" />
      <PageShell
        trail={["公布欄", tab.label]}
        title={tab.label}
        bare
      >

        {/* 頁籤列 */}
        <div className="bulletin-tabs">
          <nav className="bulletin-tabs-nav" aria-label="公布欄分頁">
            {TABS.map((t, idx) => (
              <button
                key={t.key}
                type="button"
                className={`bulletin-tab ${activeTab === idx ? "is-active" : ""}`}
                aria-current={activeTab === idx ? "page" : undefined}
                onClick={() => changeTab(idx)}
              >
                <i className={t.icon}></i><span>{t.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* 篩選卡（四頁籤共用外框，第二列依頁籤換條件） */}
        <form className="bulletin-card" onSubmit={submitFilter}>
          <div className="bulletin-filter-row">
            <span className="bulletin-filter-label">
              <i className="fa-solid fa-building"></i>發布單位
            </span>
            {ALL_AGENCIES.map(a => (
              <button
                key={a.id}
                type="button"
                className={`th-chip ${draft.agency === a.id ? "is-active" : ""}`}
                aria-pressed={draft.agency === a.id}
                onClick={() => setDraftField({ agency: a.id })}
              >
                {a.label}
              </button>
            ))}
          </div>

          <div className="bulletin-filter-row">
            <span className="bulletin-filter-label">
              <i className="fa-solid fa-magnifying-glass"></i>
              {tab.key === "download" ? "檔案名稱" : "查詢條件"}
            </span>

            <div className="th-search">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                className="th-input"
                name="keyword"
                placeholder={{
                  news: "請輸入公告標題或內容關鍵字",
                  violation: "請輸入姓名或違規原因關鍵字",
                  download: "請輸入檔案名稱關鍵字",
                  faq: "請輸入問題或解答關鍵字",
                }[tab.key]}
                value={draft.q}
                onChange={e => setDraftField({ q: e.target.value })}
              />
            </div>

            {/* 最新消息：發布日期起訖 */}
            {tab.key === "news" && (
              <React.Fragment>
                <span className="bulletin-filter-label bulletin-filter-label--inline">
                  <i className="fa-regular fa-calendar-days"></i>發布日期
                </span>
                <input type="date" name="startDate" className="th-input th-input--date"
                       value={draft.start} onChange={e => setDraftField({ start: e.target.value })} />
                <span className="bulletin-sep">至</span>
                <input type="date" name="endDate" className="th-input th-input--date"
                       value={draft.end} onChange={e => setDraftField({ end: e.target.value })} />
              </React.Fragment>
            )}

            {/* 違規名單：排序 */}
            {tab.key === "violation" && (
              <React.Fragment>
                <span className="bulletin-filter-label bulletin-filter-label--inline">
                  <i className="fa-solid fa-arrow-down-wide-short"></i>排序
                </span>
                <select name="sort" className="th-select" value={draft.sort}
                        onChange={e => setDraftField({ sort: e.target.value })}>
                  <option value="date_desc">違規或核定日期 新→舊</option>
                  <option value="date_asc">違規或核定日期 舊→新</option>
                </select>
              </React.Fragment>
            )}

            {/* 常見問答：發布類別 */}
            {tab.key === "faq" && (
              <React.Fragment>
                <span className="bulletin-filter-label bulletin-filter-label--inline">
                  <i className="fa-solid fa-tags"></i>發布類別
                </span>
                <select name="category" className="th-select" value={draft.cat}
                        onChange={e => setDraftField({ cat: e.target.value })}>
                  {FAQ_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c === "all" ? "全部類別" : c}</option>
                  ))}
                </select>
              </React.Fragment>
            )}

            <button type="submit" className="th-btn th-btn-primary">
              <i className="fa-solid fa-magnifying-glass"></i>查詢
            </button>
            <button type="button" className="th-btn th-btn-ghost" onClick={resetFilter}>
              <i className="fa-solid fa-rotate-left"></i>重置
            </button>
          </div>
        </form>

        {/* 筆數列（不再放區塊次標——頁面主標已在上方，四頁籤皆同名） */}
        <div className="bulletin-section-head">
          <span className="bulletin-count">
            共 <strong>{filtered.length}</strong> {tab.unit}
            {totalPages > 1 && `　｜　第 ${safePage} / ${totalPages} 頁`}
          </span>
        </div>

        <BulletinTable
          columns={columns}
          rows={pageRows}
          emptyText={`尚無符合條件的${tab.label}資料`}
        />

        <BulletinPager page={safePage} totalPages={totalPages} onChange={setPage} />
      </PageShell>

      {/* 明細彈窗（最新消息全文／常見問答解答） */}
      {modalItem && (
        <div className="bulletin-modal-overlay" onClick={() => setModalItem(null)}>
          <div className="bulletin-modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
            <div className="bulletin-modal-head">
              <div>
                <AgencyBadge agencyId={modalItem.agencyId} org={modalItem.org} />
                <h3 className="bulletin-modal-title">{modalItem.title}</h3>
                <div className="bulletin-modal-meta">{modalItem.meta}</div>
              </div>
              <button type="button" className="bulletin-modal-close" aria-label="關閉" onClick={() => setModalItem(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="bulletin-modal-body">{modalItem.body}</div>
          </div>
        </div>
      )}

      <ExperienceNav />
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<BulletinApp />);
