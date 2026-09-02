/*
  國家公園步道分級
  內容來源：舊站 https://service.skyeyes.tw/hikenationpark/information_6.aspx（逐字）
  ——說明／適合對象／建議裝備／表格後兩則註記皆照原文，僅正規化原始碼中
    「檢查表</a> ，依」多出來的半形空白（ASP.NET 控制項渲染產生，非編輯意圖）。
*/

const OFFICIAL = "https://service.skyeyes.tw/hikenationpark/";
/* 個人及團體裝備檢查表 PDF：本地尚未取得檔案，暫連正式站絕對網址 */
const KIT_PDF = OFFICIAL + "images/%E5%80%8B%E4%BA%BA%E5%8F%8A%E5%9C%98%E9%AB%94%E8%A3%9D%E5%82%99%E6%AA%A2%E6%9F%A5%E8%A1%A8.pdf";

/*
  kit    — 建議裝備為純文字時的原文（第 0～2 級）
  kitRef — 建議裝備含「個人及團體裝備檢查表」連結時，連結之後的原文（第 3～6 級）
  desc   — 字串；第 6 級為兩個分項，故用陣列
*/
const TRAIL_LEVELS = [
  {
    level: 0,
    desc: "步道平整，設施良好，坡度平緩且可供輪椅及嬰幼兒車通行。",
    who: "全齡人口，輪椅使用者及嬰幼兒車均可容易使用。",
    kit: "飲水、備用糧、雨具、手機。",
  },
  {
    level: 1,
    desc: "步道設施良好並提供解說資源，坡度平緩，一般行程約半天至1天以內。",
    who: "步行民眾。",
    kit: "飲水、備用糧、雨具、手機。",
  },
  {
    level: 2,
    desc: "步道設施良好但坡度稍有起伏，或氣候變化較大而有潛在風險，一般行程約1天內可完成。",
    who: "體力稍佳者。",
    kit: "飲水、備用糧、雨具、手機、禦寒衣物、背包。",
  },
  {
    level: 3,
    desc: "步道位處較偏遠山區，路徑尚稱清晰但部分坡度升降較大、氣候變化大而有潛在風險，一般行程約1至3天。",
    who: "體力佳，具備初步地圖判讀、負重行進、風險評估及應變能力者。",
    kitRef: "，依行程需求攜帶宿營或緊急宿營裝備。",
  },
  {
    level: 4,
    desc: "步道位處偏遠山區，路徑尚稱清晰但部分地形較崎嶇、氣候變化大而有潛在風險，一般行程約3至5天，或約3天以內但有困難地形。",
    who: "體力佳，具備地圖判讀、負重行進、野外維生、風險評估及應變能力者。",
    kitRef: "，依行程需求攜帶宿營及相關技術攀登裝備。",
  },
  {
    level: 5,
    desc: "步道位處偏遠山區，路徑較為原始，地形、氣候變化大而有較高潛在風險，一般行程約3至5天或以上，須有渡過困難地形準備。",
    who: "體力極佳，具備地圖判讀、負重行進、野外維生、風險評估及應變能力者。",
    kitRef: "，依行程需求攜帶宿營及相關技術攀登裝備。",
  },
  {
    level: 6,
    desc: [
      "積雪（冰）之第3至5級步道。",
      "非屬既定路線，無明確路基或路徑之原始山徑、古道遺跡、探勘或技術攀登等特殊路線。",
    ],
    who: "具備雪地行進或相關技術攀登能力者。",
    kitRef: "，依行程需求攜帶宿營及相關技術攀登裝備。",
  },
];

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

      <PageHero
        trail={["旅遊登山資訊", "國家公園步道分級"]}
        title="國家公園步道分級"
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

          {/* 新版「登山路線開放狀態」頁尚未建置，暫連現行網站 */}
          <Callout>
            路線開放狀態與可申請路線，請查詢
            <a className="th-inline-link" href={OFFICIAL + "open.aspx"} target="_blank" rel="noopener noreferrer">
              <i className="fa-solid fa-arrow-up-right-from-square"></i>登山路線開放狀態
            </a>
            <span className="th-legacy-tag">前往現行網站</span>。
          </Callout>
        </div>
      </div>

      <ExperienceNav />
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Information6App />);
