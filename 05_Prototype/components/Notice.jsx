/*
  登山須知
  內容來源：正式站 https://service.skyeyes.tw/hikenationpark/notice.aspx（逐字）

  連結策略（2026-09-02 決定，分兩階段）：
  階段一（已完成）— 31 項全部指向正式站絕對網址或原有外部網址，恢復可操作性。
  階段二（已完成）— 17 張本地新版詳細須知頁（國家公園 10 頁＋林保署 7 頁）已建立，
                    對應的 href 已改指 notice_<id>.html；內容由 NoticeDetailData.jsx 提供。
                    三份步道通訊點 PDF 仍連正式站（那是檔案，本站不重製）。

  [待確認] 頁首說明第二句與警示區文字（跨機關規定、入山許可證）不是正式站原文，
           為我方新增；取得業務來源前於畫面標「待確認」，不得當成已確認規則。
*/

/* 正式站站台根路徑；階段二換本地頁時逐項移除 */
const OFFICIAL = "https://service.skyeyes.tw/hikenationpark/";

const NOTICE_SECTIONS = [
  {
    id: "np",
    title: "國家公園管理處",
    icon: "fa-solid fa-mountain-sun",
    group: "primary",
    items: [
      { label: "玉山國家公園登山須知", href: "notice_a1.html", kind: "internal" },
      { label: "玉山國家公園申辦規定與須知", href: "notice_a2.html", kind: "internal" },
      { label: "玉山國家公園緊急聯絡資訊", href: "notice_a3.html", kind: "internal" },
      { label: "太魯閣國家公園登山須知", href: "notice_a4.html", kind: "internal" },
      { label: "太魯閣國家公園申辦規定與須知", href: "notice_a5.html", kind: "internal" },
      { label: "太魯閣國家公園緊急聯絡資訊", href: "notice_a6.html", kind: "internal" },
      { label: "雪霸國家公園登山須知", href: "notice_a7.html", kind: "internal" },
      { label: "雪霸國家公園申辦規定與須知", href: "notice_a8.html", kind: "internal" },
      { label: "雪霸國家公園緊急聯絡資訊", href: "notice_a9.html", kind: "internal" },
      { label: "登山糧食計畫裝備檢查", href: "notice_a10.html", kind: "internal" },
      /* 三份 PDF 的檔名為中文，href 沿用正式站原樣的 percent-encoding，不可改寫成未編碼中文。
         2026-09-02 實測三份皆為真 PDF（檔頭 %PDF、Content-Type: application/pdf）；
         太魯閣那份的 PDF 內部 metadata 標題殘留「…彙整表.ods」（由 ODS 匯出），
         瀏覽器分頁會顯示 .ods，但檔案本身是 PDF——標籤維持「（PDF）」，不要改成 ODS。 */
      { label: "太魯閣國家公園步道通訊點彙整表（PDF）", href: OFFICIAL + "files/%E5%A4%AA%E9%AD%AF%E9%96%A3%E5%9C%8B%E5%AE%B6%E5%85%AC%E5%9C%92%E6%AD%A5%E9%81%93%E9%80%9A%E8%A8%8A%E9%BB%9E%E5%BD%99%E6%95%B4%E8%A1%A8.pdf", kind: "file" },
      { label: "玉山國家公園步道通訊點彙整表（PDF）", href: OFFICIAL + "files/%E7%8E%89%E5%B1%B1%E5%9C%8B%E5%AE%B6%E5%85%AC%E5%9C%92%E6%AD%A5%E9%81%93%E9%80%9A%E8%A8%8A%E9%BB%9E%E5%BD%99%E6%95%B4%E8%A1%A8.pdf", kind: "file" },
      { label: "雪霸國家公園步道通訊點彙整表（PDF）", href: OFFICIAL + "files/%E9%9B%AA%E9%9C%B8%E5%9C%8B%E5%AE%B6%E5%85%AC%E5%9C%92%E6%AD%A5%E9%81%93%E9%80%9A%E8%A8%8A%E9%BB%9E%E5%BD%99%E6%95%B4%E8%A1%A8.pdf", kind: "file" },
    ],
  },
  {
    id: "forestry",
    title: "林業及自然保育署",
    icon: "fa-solid fa-tree",
    group: "primary",
    items: [
      { label: "檜谷山莊申請須知", href: "notice_b1.html", kind: "internal" },
      { label: "天池山莊住宿申請須知", href: "notice_b2.html", kind: "internal" },
      { label: "嘉明湖／向陽申請須知", href: "notice_b3.html", kind: "internal" },
      /* 九九山莊在正式站是 notice_b7.aspx，位置排在 b3 與 b4 之間；不要依畫面順序改成 b4 */
      { label: "九九山莊申請須知", href: "notice_b7.html", kind: "internal" },
      { label: "檜谷山莊山屋與營地收費基準", href: "notice_b4.html", kind: "internal" },
      { label: "天池山莊收費及退費基準", href: "notice_b5.html", kind: "internal" },
      { label: "嘉明湖／向陽收費基準", href: "notice_b6.html", kind: "internal" },
      { label: "森林法（第 17-1 條）", href: "https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=M0040001", kind: "external" },
      { label: "申請進入自然保留區許可辦法", href: "https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=M0040036", kind: "external" },
      { label: "林業及自然保育署山區手機可通訊點標示", href: "https://www.forest.gov.tw/0004548/0073591", kind: "external" },
    ],
  },
  {
    id: "police",
    title: "警政署",
    icon: "fa-solid fa-shield-halved",
    group: "secondary",
    items: [
      { label: "國家安全法（第 5 條）", href: "https://law.moj.gov.tw/LawClass/LawAll.aspx?PCode=A0030028", kind: "external" },
    ],
  },
  {
    id: "sports",
    title: "體育署",
    icon: "fa-solid fa-person-running",
    group: "secondary",
    items: [
      { label: "登山活動注意事項", href: "https://edu.law.moe.gov.tw/NewsContent.aspx?id=267927&KW=%E7%99%BB%E5%B1%B1%E6%B4%BB%E5%8B%95%E6%87%89%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A0%85", kind: "external" },
    ],
  },
  {
    id: "local",
    title: "各地方政府",
    icon: "fa-solid fa-landmark",
    group: "secondary",
    items: [
      { label: "南投縣登山活動管理自治條例", href: "https://www.ntfd.gov.tw/index.php?act=article&code=detail&ids=2498", kind: "external" },
      { label: "花蓮縣登山活動管理自治條例", href: "http://glrs.hl.gov.tw/glrsout/NewsContent.aspx?id=1390", kind: "external" },
      { label: "苗栗縣登山活動管理自治條例", href: "http://law.miaoli.gov.tw/glrsnewsout/NewsContent.aspx?id=326", kind: "external" },
      /* 正式站原網址 lawsearch.taichung.gov.tw 整站已失效（含網域根目錄皆 404）；
         改指臺中市政府主管法規共用系統新站的法規內容頁，2026-09-02 實測 200 且標題為
         「臺中市政府主管法規共用系統-法規內容-臺中市登山活動管理自治條例」 */
      { label: "臺中市登山活動管理自治條例", href: "https://law.taichung.gov.tw/glrsnewsout/LawContent.aspx?id=GL003013", kind: "external" },
      { label: "屏東縣登山活動管理自治條例", href: "http://ptlaw.pthg.gov.tw/NewsContent.aspx?id=987", kind: "external" },
      { label: "高雄市山域事故救援管理自治條例", href: "https://outlaw.kcg.gov.tw/LawContent.aspx?id=GL001547&KeyWord=%e9%ab%98%e9%9b%84%e5%b8%82%e5%b1%b1%e5%9f%9f%e4%ba%8b%e6%95%85%e6%95%91%e6%8f%b4%e7%ae%a1%e7%90%86%e8%87%aa%e6%b2%bb%e6%a2%9d%e4%be%8b", kind: "external" },
    ],
  },
];

/* 正式站頁首右上角的紅色按鈕，連到登山教育影片播放清單第 3 支 */
const SAFETY_VIDEO = "https://www.youtube.com/watch?v=HgnaQaKFjNo&list=PL8CdSPNjegIZKIN75OXLB9uk_4eQmgsAm&index=3";

function NoticeApp() {
  const navItems = NOTICE_SECTIONS.map((s) => ({ id: s.id, label: s.title }));
  const primary = NOTICE_SECTIONS.filter((s) => s.group === "primary");
  const secondary = NOTICE_SECTIONS.filter((s) => s.group === "secondary");

  const card = (s) => (
    <SectionCard
      key={s.id}
      id={s.id}
      title={s.title}
      icon={s.icon}
      note={`${s.items.length} 項`}
      flush
    >
      <LinkList items={s.items} numbered />
    </SectionCard>
  );

  return (
    <div>
      <Header active="notice" />

      <PageHero
        trail={["登山須知"]}
        title="登山須知"
        lead="本站整合國家公園署、林業及自然保育署、警政署等機關之登山申辦規定。"
        updated="2026-09-01"
      />

      <div className="th-page has-nav">
        <div className="th-page-main">
          <div className="th-notice-actions">
            <a className="th-video-btn" href={SAFETY_VIDEO} target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-youtube"></i>登山安全影片（HOT）
            </a>
          </div>

          <Callout type="warning">
            各機關申辦規定不同，<strong>同一趟行程若跨越多個管理機關，須分別符合各機關規定</strong>。
            進入山地管制區者另須申請入山許可證。
            <span className="th-todo-tag">待確認</span>
            <span className="th-callout-src">本段非正式站原文，為我方新增，來源待業務確認。</span>
          </Callout>

          <div className="th-notice-grid">{primary.map(card)}</div>
          <div className="th-notice-grid is-secondary">{secondary.map(card)}</div>
        </div>

        <PageNav items={navItems} />
      </div>

      <ExperienceNav />
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<NoticeApp />);
