/*
  山屋住宿申請流程（forest-camp-1／2）共用的資料與元件。

  原本這些都放在 ForestCamp1.jsx，forest-camp-2.html 為了取 CABIN_DATA 而
  連同整支 ForestCamp1.jsx 一起載入 —— 該檔檔尾自帶
  `ReactDOM.createRoot(...).render(<ForestCamp1App/>)`，於是 #root 被連續
  render 兩次（先第一步、再被第二步覆蓋），console 固定出 createRoot 警告。
  抽成本檔後兩頁各自只載入自己的 App。
*/

// 山屋設定資料（對應 RouteData unit=forestry-camp）
const CABIN_DATA = {
  "jiaming": {
    name: "嘉明湖山屋",
    manager: "臺東林區管理處",
    location: "嘉明湖步道 9.5K，海拔 3,310m",
    image: "assets/route-nanheng.png",
    minDays: 2, maxDays: 4,
    facilities: [
      { id: "hut",  label: "山屋床位", unit: "床", max: 72,  pricePerNight: 200, icon: "ph-bold ph-house" },
      { id: "camp", label: "營地營位", unit: "頂", max: 30,  pricePerNight: 100, icon: "ph-bold ph-tent" },
    ],
    notices: [
      "採線上抽籤制，熱門日期請提早申請。",
      "山屋提供睡袋（另計費），自帶睡袋可享折扣。",
      "入住日前 14 天可申請取消，取消費用依規定收取。",
    ],
  },
  "tianchi": {
    name: "天池山莊",
    manager: "南投林區管理處",
    location: "能高越嶺道西段 22K，海拔 2,860m",
    image: "assets/route-qilai.png",
    minDays: 1, maxDays: 3,
    facilities: [
      { id: "hut",  label: "山屋床位", unit: "床", max: 64,  pricePerNight: 200, icon: "ph-bold ph-house" },
      { id: "camp", label: "營地營位", unit: "頂", max: 20,  pricePerNight: 100, icon: "ph-bold ph-tent" },
    ],
    notices: [
      "採先到先得制，建議至少提前 7 天申請。",
      "山莊提供熱食，需於申請時預約餐食人數。",
    ],
  },
  "guigu": {
    name: "檜谷山莊",
    manager: "屏東林區管理處",
    location: "北大武山登山口 7.5K，海拔 2,230m",
    image: "assets/route-qilai.png",
    minDays: 1, maxDays: 2,
    facilities: [
      { id: "hut",  label: "山屋床位", unit: "床", max: 48,  pricePerNight: 200, icon: "ph-bold ph-house" },
    ],
    notices: [
      "採線上申請制，開放日期前 60 天受理。",
      "山莊無對外供餐，請自備糧食。",
    ],
  },
  "walami": {
    name: "瓦拉米山屋",
    manager: "花蓮林區管理處",
    location: "瓦拉米步道 13.1K，海拔 1,068m",
    image: "assets/route-nanheng.png",
    minDays: 1, maxDays: 2,
    facilities: [
      { id: "hut",  label: "山屋床位", unit: "床", max: 24,  pricePerNight: 200, icon: "ph-bold ph-house" },
      { id: "camp", label: "營地營位", unit: "頂", max: 10,  pricePerNight: 100, icon: "ph-bold ph-tent" },
    ],
    notices: [
      "採線上申請制，開放日期前 30 天受理。",
    ],
  },
};

const FC_STEPS = [
  { n: 1, label: "日期確認" },
  { n: 2, label: "行程計畫" },
  { n: 3, label: "隊伍資料" },
  { n: 4, label: "附件上傳" },
  { n: 5, label: "申請須知" },
  { n: 6, label: "確認送出" },
];

function FcStepper({ current }) {
  return (
    <div className="fc-stepper">
      {FC_STEPS.map((s, i) => {
        const cls = s.n < current ? "is-done" : s.n === current ? "is-current" : "";
        return (
          <React.Fragment key={s.n}>
            <div className={`fc-step ${cls}`}>
              <div className="fc-step-dot">
                {s.n < current
                  ? <i className="fa-solid fa-check"></i>
                  : <span>{s.n}</span>}
              </div>
              <span className="fc-step-label">{s.label}</span>
            </div>
            {i < FC_STEPS.length - 1 && <div className={`fc-step-line ${s.n < current ? "is-done" : ""}`}></div>}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// 簡易月曆日期選擇器
function formatDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDaysToDateValue(dateValue, days) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return formatDateInputValue(date);
}
