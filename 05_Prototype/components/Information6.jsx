/*
  國家公園步道分級
  內容來源：舊站 https://service.skyeyes.tw/hikenationpark/information_6.aspx（逐字）
  ——說明／適合對象／建議裝備／表格後兩則註記皆照原文，僅正規化原始碼中
    「檢查表</a> ，依」多出來的半形空白（ASP.NET 控制項渲染產生，非編輯意圖）。
*/

/* OFFICIAL／KIT_PDF／TRAIL_LEVELS 由 components/TrailLevelData.jsx 提供（與 open.html 共用）*/
const OFFICIAL = OFFICIAL_SITE;

const LEVEL_COLUMNS = [
  {
    key: "level",
    label: "難度等級",
    align: "center",
    render: (r) => <span className={`th-level lv-${r.level}`}>第 {r.level} 級</span>,
  },
  {
    key: "desc",
    label: "說明",
    render: (r) =>
      Array.isArray(r.desc)
        ? <ol className="th-cell-ol">{r.desc.map((d) => <li key={d}>{d}</li>)}</ol>
        : r.desc,
  },
  { key: "who", label: "適合對象" },
  {
    key: "kit",
    label: "建議裝備",
    render: (r) =>
      r.kitRef ? (
        <p className="th-kit">
          請參考
          <a className="th-inline-link" href={KIT_PDF} target="_blank" rel="noopener noreferrer">
            <i className="fa-solid fa-file-pdf"></i>個人及團體裝備檢查表
          </a>
          {r.kitRef}
        </p>
      ) : (
        <p className="th-kit">{r.kit}</p>
      ),
  },
];

function Information6App() {
  return (
    <div>
      <Header active="info" />

      <PageHead
        trail={["旅遊登山資訊", "國家公園步道分級"]}
        title="國家公園步道分級"
        updated="2026-09-01"
      />

      <div className="th-page">
        <div className="th-page-main">
          <SectionCard
            id="level-table"
            title="步道難度分級表"
            icon="fa-solid fa-signs-post"
            note="共 7 級"
            flush
          >
            <DataTable columns={LEVEL_COLUMNS} rows={TRAIL_LEVELS} rowKey="level" className="tbl-level" />
            {/* 表格後兩則註記為正式站原文，不可省略 */}
            <ol className="th-table-notes">
              <li>天數係以一般行程安排提供參考，如縮短行程請自行提升體能並評估風險。</li>
              <li>前往高海拔山區步道時，請預作行前準備及行程計畫，注意自身有無高山反應並設定折返點適時撤退。</li>
            </ol>
          </SectionCard>

          <Callout>
            路線開放狀態與可申請路線，請查詢
            <a className="th-inline-link" href="open.html">
              <i className="fa-solid fa-angle-right"></i>登山路線開放狀態
            </a>
            。
          </Callout>
        </div>
      </div>

      <ExperienceNav />
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Information6App />);
