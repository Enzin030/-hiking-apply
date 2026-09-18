/* ============================================================
   news-detail.js — 最新消息內文詳細頁（對應舊站 news_0_1.aspx）
   支援富文本內容、機關徽章、發布日期、附件下載、回列表頁與友善列印
   ============================================================ */

(function () {
  // 完整新聞預設資料（與 news.js 同步，確保直接開啟本頁時也有完整資料）
  const BACKUP_NEWS = [
    {
      id: "4975",
      date: "2026-09-08",
      org: "玉管處",
      agencyId: "yushan",
      pinned: true,
      title: "公告自115年9月9日起恢復玉山國家公園八通關線、南二段線、秀姑巒線及馬博拉斯橫斷線生態保護區登山路線之入園活動。",
      bodyHtml: `
        <div class="space-y-4 text-slate-800 leading-relaxed text-base">
          <p>依據：國家公園法第19條。</p>
          <div>
            <p class="font-medium">公告事項：</p>
            <p>一、開放登山路線：</p>
            <p class="pl-4">（一）已開放登山路線：玉山主群峰線、南橫三山-庫哈諾辛山/關山線、新康山線及瓦拉米線。</p>
            <p class="pl-4">（二）本次開放登山路線：八通關線、南二段線、秀姑巒線及馬博拉斯橫斷線。</p>
          </div>
          <p>二、其他尚未開放路線，其開放時間、條件及申請方式，屆時另依本處入園網頁公布為主。</p>
          <p>三、山區易有降雨情形，地質不穩，並常有落石、崩塌危險，入園時務請注意路況及自身安全。如遇危險路段，應審慎評估通行安全，切勿強行通過。</p>
          <p>【路況提醒】八通關步道3.1K處日前因土石崩塌、路基沖刷，經緊急搶修處理，雖已恢復可通行，惟該路段路況仍不穩定，行經該路段時務請注意安全！</p>
        </div>
      `,
      content: `依據：國家公園法第19條。
公告事項：
一、開放登山路線：
（一）已開放登山路線：玉山主群峰線、南橫三山-庫哈諾辛山/關山線、新康山線及瓦拉米線。
（二）本次開放登山路線：八通關線、南二段線、秀姑巒線及馬博拉斯橫斷線。
二、其他尚未開放路線，其開放時間、條件及申請方式，屆時另依本處入園網頁公布為主。
三、山區易有降雨情形，地質不穩，並常有落石、崩塌危險，入園時務請注意路況及自身安全。如遇危險路段，應審慎評估通行安全，切勿強行通過。
【路況提醒】八通關步道3.1K處日前因土石崩塌、路基沖刷，經緊急搶修處理，雖已恢復可通行，惟該路段路況仍不穩定，行經該路段時務請注意安全！`,
      files: [
        {
          name: "玉園字第1151008352號公告",
          format: "PDF",
          size: "328 KB",
          href: "https://hike.taiwan.gov.tw/nationpark/manasystem/news/files/news/dbc8ab9c-2cab-4729-a9ab-2728b88bb148.pdf"
        }
      ]
    },
    {
      id: "4973",
      date: "2026-09-07",
      org: "林業保育署",
      agencyId: "forestry",
      pinned: true,
      title: "2026嘉明湖手作步道工作假期來囉～號召熱愛山林及親近自然的您，一同前來參與手作步道活動！",
      bodyHtml: `
        <div class="space-y-3 text-slate-800 leading-relaxed text-base">
          <p>1、錄取名額：18名</p>
          <p>2、報名期間：自即日起至9月18日下午5時，統一採取「網路報名」方式</p>
          <p>3、活動日期：2026 年 10 月 7 日至 10 月 11 日，共 5 天 4 夜</p>
          <p>4、活動地點：嘉明湖國家步道（沒有要去看嘉明湖唷）、射馬干部落</p>
          <p>5、報名網址：<a href="https://forms.gle/74ybBzcqwEybsMFg7" target="_blank" rel="noopener noreferrer" class="text-emerald-700 underline font-medium hover:text-emerald-800 break-all">https://forms.gle/74ybBzcqwEybsMFg7</a></p>
          <p>6、詳情請見活動簡章：<a href="https://drive.google.com/file/d/1imampS6M-gz9tB-jbRv97TntbZaHN9Q2/view?usp=drive_link" target="_blank" rel="noopener noreferrer" class="text-emerald-700 underline font-medium hover:text-emerald-800">點此下載活動簡章（Google 雲端硬碟）</a></p>
        </div>
      `,
      content: `2026嘉明湖手作步道工作假期來囉～號召熱愛山林及親近自然的您，一同前來參與手作步道活動！
1、錄取名額：18名
2、報名期間：自即日起至9月18日下午5時，統一採取「網路報名」方式
３、活動日期：2026 年 10 月 7 日至 10 月 11 日,共 5 天 4 夜
４、活動地點：嘉明湖國家步道（沒有要去看嘉明湖唷）、射馬干部落
5、報名網址： https://forms.gle/74ybBzcqwEybsMFg7
６、詳情請見活動簡章：https://drive.google.com/file/d/1imampS6M-gz9tB-jbRv97TntbZaHN9Q2/view?usp=drive_link`,
      files: [
        {
          name: "2026嘉明湖手作步道工作假期活動簡章",
          format: "PDF",
          size: "1.2 MB",
          href: "https://drive.google.com/file/d/1imampS6M-gz9tB-jbRv97TntbZaHN9Q2/view?usp=drive_link"
        }
      ]
    },
    {
      id: "a1",
      date: "2026-03-09",
      org: "太管處",
      agencyId: "taroko",
      pinned: true,
      title: "公告115年4月1日起至4月19日辦理奇萊稜線新山屋吊掛作業",
      bodyHtml: `
        <div class="news-meta-lead font-semibold text-slate-900 mb-4 pb-3 border-b border-slate-200 leading-relaxed text-base">
          公告115年4月1日起至4月19日辦理奇萊稜線新山屋吊掛作業
        </div>
        <div class="space-y-3 text-slate-700 leading-relaxed">
          <p>一、本處辦理「奇萊稜線新山屋建置工程」，訂於115年4月1日至4月19日進行材料與組件空中吊掛作業。</p>
          <p>二、吊掛作業期間為維護登山山友安全，奇萊稜線山屋及周邊營地暫停開放申請及住宿。</p>
          <p>三、行程行經奇萊主、北峰之隊伍，請密切注意施工通告與現場警戒標示，切勿強行通過吊掛作業區域。</p>
          <p>四、如有相關疑問，請洽太魯閣國家公園管理處遊憩服務科（03-8621100分機601）。</p>
        </div>
      `,
      content: `一、本處辦理「奇萊稜線新山屋建置工程」，訂於115年4月1日至4月19日進行材料與組件空中吊掛作業。
二、吊掛作業期間為維護登山山友安全，奇萊稜線山屋及周邊營地暫停開放申請及住宿。
三、行程行經奇萊主、北峰之隊伍，請密切注意施工通告與現場警戒標示，切勿強行通過吊掛作業區域。
四、如有相關疑問，請洽太魯閣國家公園管理處遊憩服務科（03-8621100分機601）。`,
      files: []
    }
  ];

  function getQueryId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") || "4975";
  }

  function findArticle(id) {
    const list = (window.MOCK_ANNOUNCEMENTS && window.MOCK_ANNOUNCEMENTS.length > 0)
      ? window.MOCK_ANNOUNCEMENTS
      : BACKUP_NEWS;
    let item = list.find(x => String(x.id) === String(id));
    if (!item) {
      item = BACKUP_NEWS.find(x => String(x.id) === String(id)) || BACKUP_NEWS[0];
    }
    return item;
  }

  thPage({
    data() {
      const id = getQueryId();
      const article = findArticle(id);
      return {
        article: article,
        fileIcons: {
          PDF: "fa-regular fa-file-pdf",
          DOC: "fa-regular fa-file-word",
          DOCX: "fa-regular fa-file-word",
          ODT: "fa-regular fa-file-lines",
          ZIP: "fa-regular fa-file-zipper",
          XLS: "fa-regular fa-file-excel",
          XLSX: "fa-regular fa-file-excel",
        }
      };
    },
    computed: {
      trail() {
        return ["公布欄", "最新消息"];
      },
      hasFiles() {
        return this.article && Array.isArray(this.article.files) && this.article.files.length > 0;
      }
    },
    methods: {
      dateSlash(dateStr) {
        return dateStr ? String(dateStr).replace(/-/g, "/") : "";
      }
    }
  });
})();
