/* ============================================================
   NewsData.js — 公布欄（最新消息、違規名單、檔案下載、常見問答）資料檔
   ============================================================ */

window.ALL_AGENCIES = [
  { id: "all",      label: "全部單位", short: "全部" },
  { id: "forestry", label: "林業及自然保育署（林保署）", short: "林保署" },
  { id: "nps",      label: "內政部國家公園署（國家公園署）", short: "國家公園署" },
  { id: "taroko",   label: "太魯閣國家公園管理處（太管處）", short: "太管處" },
  { id: "yushan",   label: "玉山國家公園管理處（玉管處）", short: "玉管處" },
  { id: "sheipa",   label: "雪霸國家公園管理處（雪管處）", short: "雪管處" },
  { id: "police",   label: "警政署入山（警政署）", short: "警政署" },
];

window.MOCK_ANNOUNCEMENTS = [
  /* 2026-09-21 補：apply-3-v2 的關閉公告連到這一則。
     標題為正式站 open.aspx 該路線 closures 的原文；id 沿用正式站
     news_0_1.aspx?id=4800。內文 [待確認]——正式站公告全文未擷取，
     這裡只放可確定的依據與公告事項，不編造細節。 */
  {
    id: "4800", date: "2026-09-15", org: "玉管處", agencyId: "yushan", pinned: false,
    title: "公告自115年9月30日起至10月1日止（為期2天），暫停本園生態保護區「玉山主、群峰線」之入園活動。",
    bodyHtml: `<p>依據：國家公園法第19條。</p>
<p>公告事項：</p>
<p>一、暫停期間：115年9月30日起至10月1日止，為期2天。</p>
<p>二、暫停範圍：本園生態保護區「玉山主、群峰線」。</p>
<p>三、該期間入園申請將不予受理，已核准之入園許可證於暫停期間失其效力。</p>`,
    content: `一、暫停期間：115年9月30日起至10月1日止，為期2天。
二、暫停範圍：本園生態保護區「玉山主、群峰線」。
三、該期間入園申請將不予受理。`,
    files: []
  },
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
    id: "4973", date: "2026-09-07", org: "林保署", agencyId: "forestry", pinned: true,
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
三、行程行經奇萊主、北峰之隊伍，請密切注意施工通告與現場警戒標示，切勿強行通過吊掛作業區域。`
  },
  {
    id: "a2", date: "2026-03-05", org: "雪管處", agencyId: "sheipa", pinned: true,
    title: "115年雪霸國家公園生態保護區雪季期間登山申請規定及注意事項",
    content: `一、雪季服務期自115年1月1日起至3月31日止（視氣候狀況調整）。
二、申請進入雪季管制路段之隊伍，領隊應具備雪地登山經驗，全隊應攜帶完整雪地裝備（冰斧、冰爪、安全頭盔）。
三、雪季期間聖稜線（O型、I型、Y型）暫停一般隊伍申請，僅具備雪地攀登技術之先遣隊伍得提出專案申請。`
  },
  {
    id: "a3", date: "2026-02-28", org: "國家公園署", agencyId: "nps", pinned: false,
    title: "臺灣登山一站式服務網系統維護公告（115/03/15 00:00～04:00）",
    content: `一、為提升系統穩定度與資訊安全防護能力，本網訂於115年3月15日凌晨00:00至04:00進行核心資料庫升級作業。
二、作業期間線上申請、案件查詢、繳費對帳等服務將暫停運作。
三、造成不便敬請見諒，如有緊急入園核准文件需求，請預先下載備份電子憑證。`
  },
  {
    id: "a4", date: "2026-02-20", org: "玉管處", agencyId: "yushan", pinned: false,
    title: "玉山主峰線步道落石崩塌修復完成，恢復全線正常通行",
    content: `一、玉山主峰線步道5.5K處日前因連日降雨造成之邊坡落石坍方，經本處工班搶修及地質安全評估確認無虞，自即日起恢復正常通行。
二、山區天候變化快速，行經裸露邊坡與崩壁路段請快速通過，切勿逗留拍照。`
  },
  {
    id: "a5", date: "2026-02-14", org: "林保署", agencyId: "forestry", pinned: false,
    title: "能高越嶺國家步道西段屯原登山口至天池山莊路況通報",
    content: `一、能高越嶺國家步道西段0.3K及3.8K至4.2K大崩壁路段，經林道工程搶修完成便道。
二、高繞路線維持開放，建議一般健行隊伍優先評估高繞路徑。
三、天池山莊各項住宿與餐飲服務正常提供。`
  },
  {
    id: "a6", date: "2026-02-01", org: "太管處", agencyId: "taroko", pinned: false,
    title: "合歡山地區高山花季交通疏導措施與停車宣導",
    content: `一、合歡山杜鵑花季預計於4月中旬展開，台14甲線將實施高乘載管制與彈性交通疏導。
二、武嶺、合歡山莊及小風口停車場空間有限，請山友多加利用公共運輸接駁車上山。`
  },
  {
    id: "a7", date: "2026-01-28", org: "玉管處", agencyId: "yushan", pinned: false,
    title: "排雲山莊容宿量調整措施延長辦理通知",
    content: `一、為維護排雲山莊周邊供水設施與生態環境負擔，原排雲山莊容宿量調整措施將延長執行至115年6月30日。
二、每日開放申請名額以系統顯示為準，請各登山隊伍預先規劃行程。`
  },
  {
    id: "a8", date: "2026-01-22", org: "林保署", agencyId: "forestry", pinned: false,
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
    content: `一、沙德爾颱風外圍流影響期間，各國家公園山區將有強風豪雨。
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
    id: "a13", date: "2025-12-02", org: "林保署", agencyId: "forestry", pinned: false,
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

window.MOCK_VIOLATIONS = [
  { id: "V01", org: "玉管處", agencyId: "yushan", name: "方*恆", date: "2026/08/26", banStart: "2026/08/26", banEnd: "2027/02/22", category: "半年不予許可入園", reason: "違反《申請進入玉山國家公園生態保護區許可注意事項》第十九點第一項第（一）款第1目規定(112.2.14修訂)" },
  { id: "V02", org: "玉管處", agencyId: "yushan", name: "石*澤", date: "2026/08/23", banStart: "2026/08/23", banEnd: "2027/02/19", category: "半年不予許可入園", reason: "違反《申請進入玉山國家公園生態保護區許可注意事項》第十九點第一項第（一）款第1目規定(112.2.14修訂)" },
  { id: "V03", org: "玉管處", agencyId: "yushan", name: "童*珊", date: "2026/08/19", banStart: "2026/08/19", banEnd: "2027/02/15", category: "半年不予許可入園", reason: "違反《申請進入玉山國家公園生態保護區許可注意事項》第十九點第一項第（一）款第1目規定(112.2.14修訂)" },
  { id: "V04", org: "雪管處", agencyId: "sheipa", name: "卓*睿", date: "2026/08/14", banStart: "2026/08/14", banEnd: "2027/02/10", category: "半年不予許可入園", reason: "核准後未入園且未於入園前1日15:00前辦理取消申請" },
  { id: "V05", org: "雪管處", agencyId: "sheipa", name: "秦*寧", date: "2026/08/07", banStart: "2026/08/07", banEnd: "2027/08/06", category: "一年不予許可入園", reason: "未經許可擅自進入生態保護區，違反國家公園法第19條規定" },
  { id: "V06", org: "太管處", agencyId: "taroko", name: "尤*樺", date: "2026/07/29", banStart: "2026/07/29", banEnd: "2026/10/28", category: "三個月不予許可入園", reason: "未依核准路線行進並擅自變更宿營地點" },
  { id: "V07", org: "太管處", agencyId: "taroko", name: "樊*蓉", date: "2026/07/11", banStart: "2026/07/11", banEnd: "2027/07/10", category: "一年不予許可入園", reason: "冒名頂替及夾帶未核准人員入園" },
  { id: "V08", org: "林保署", agencyId: "forestry", name: "池*昱", date: "2026/06/27", banStart: "2026/06/27", banEnd: "2026/12/26", category: "半年不予許可入園", reason: "已完成山屋床位預訂且未取消而未報到（No-show）" },
  { id: "V09", org: "林保署", agencyId: "forestry", name: "岑*淇", date: "2026/06/14", banStart: "2026/06/14", banEnd: "2026/09/13", category: "三個月不予許可入園", reason: "於山屋內使用明火炊事，違反山屋管理規定" },
  { id: "V10", org: "玉管處", agencyId: "yushan", name: "蒲*謙", date: "2026/06/02", banStart: "2026/06/02", banEnd: "2026/12/01", category: "半年不予許可入園", reason: "違反《申請進入玉山國家公園生態保護區許可注意事項》第十九點第一項第（二）款規定" },
  { id: "V11", org: "雪管處", agencyId: "sheipa", name: "王*明", date: "2026/05/28", banStart: "2026/05/28", banEnd: "2026/11/27", category: "半年不予許可入園", reason: "棄置垃圾於園區內且經勸導不聽" },
  { id: "V12", org: "太管處", agencyId: "taroko", name: "張*婷", date: "2025/11/15", banStart: "2025/11/15", banEnd: "2026/02/14", category: "三個月不予許可入園", reason: "未攜帶核准之入園許可證正本並拒絕出示身分證明" }
];

window.MOCK_DOWNLOADS = [
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
  { id: "d13", org: "林保署", agencyId: "forestry", title: "個人及團體裝備檢查表", files: [{ format: "PDF", href: "#" }, { format: "ODT", href: "#" }] },
  { id: "d14", org: "林保署", agencyId: "forestry", title: "山屋與營地收費退費基準", files: [{ format: "PDF", href: "#" }] },
  { id: "d15", org: "警政署", agencyId: "police",   title: "入山許可證申辦須知（山地經常管制區）", files: [{ format: "PDF", href: "#" }, { format: "ODT", href: "#" }] }
];

window.MOCK_FAQS = [
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
    id: "f4", org: "林保署", agencyId: "forestry", date: "2026/06/03", cat: "04-退費與繳費",
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
    id: "f11", org: "林保署", agencyId: "forestry", date: "2025/12/11", cat: "04-退費與繳費",
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

window.FILE_ICONS = {
  PDF: "fa-regular fa-file-pdf",
  ODT: "fa-regular fa-file-word", DOC: "fa-regular fa-file-word", DOCX: "fa-regular fa-file-word",
  XLSX: "fa-regular fa-file-excel", XLS: "fa-regular fa-file-excel", CSV: "fa-regular fa-file-excel",
  PNG: "fa-regular fa-file-image", JPG: "fa-regular fa-file-image", JPEG: "fa-regular fa-file-image",
};
