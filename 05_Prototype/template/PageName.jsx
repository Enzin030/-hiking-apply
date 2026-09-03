/*
  頁面元件範本（2026-09-03 版面統一後）。

  全站頁面外殼一律用 Shared.jsx 的 <PageShell>，不要自己刻
  `<main className="th-page">` 或 `<PageHead>`——後者已移除。

  PageShell 參數：
    trail    麵包屑陣列，元素可為字串或 { label, href }；首頁圖示由元件自動補
    title    h1 主標題
    lead     標題下方導言（選用）
    updated  更新日期（選用）
    stepper  申請流程步驟條，如 <Stepper current={1} />（選用）
    nav      右側頁內目錄 <PageNav items={[...]} />，給了才會變兩欄（選用）
    bare     版面自帶 grid／自訂排版時給，跳過 .th-page-main 的 flex 包裝

  共用元件：SectionCard / LinkList / DataTable / StepList / Callout /
           ExperienceNav / BulletinPager
  共用 class：.th-field .th-label .th-input .th-select .th-textarea
             .th-chip .th-table（.th-table--zebra）.th-empty .th-btn
*/

function PageNameApp() {
  return (
    <React.Fragment>
      <Header active="info" />

      <PageShell
        trail={["上層分類", "本頁標題"]}
        title="本頁標題"
        lead="一句話說明本頁提供什麼。"
        updated="2026-09-03"
        nav={<PageNav items={[{ id: "sec1", label: "第一節" }]} />}
      >
        <SectionCard id="sec1" title="第一節" icon="fa-solid fa-circle-info">
          <p>內容。</p>
        </SectionCard>
      </PageShell>

      <ExperienceNav />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<PageNameApp />);
