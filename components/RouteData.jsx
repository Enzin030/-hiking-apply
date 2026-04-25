/* Route data — extracted from the live site's 80+ routes */

const ROUTE_DATA = [
  // 玉山國家公園
  { id: "yushan-main", name: "玉山主峰線", subroute: "塔塔加→排雲山莊→玉山主峰", agency: "yushan", agencyName: "玉山國家公園", peak: "玉山主峰 3,952m", days: 2, diff: 3, status: "lottery", hot: true, image: "assets/route-yushan.png", note: "需抽籤" },
  { id: "yushan-prince", name: "玉山前峰日往返", subroute: "塔塔加→玉山前峰", agency: "yushan", agencyName: "玉山國家公園", peak: "玉山前峰 3,239m", days: 1, diff: 3, status: "open", image: "assets/route-yushan.png" },
  { id: "yushan-east", name: "玉山東小南線", subroute: "塔塔加→東峰→小南山", agency: "yushan", agencyName: "玉山國家公園", peak: "玉山東峰 3,869m", days: 4, diff: 5, status: "open", image: "assets/route-yushan.png" },
  { id: "yushan-bata", name: "八通關古道", subroute: "東埔→八通關→大水窟", agency: "yushan", agencyName: "玉山國家公園", peak: "八通關 2,810m", days: 5, diff: 4, status: "open", image: "assets/route-nanheng.png" },
  { id: "nanheng", name: "南橫三山", subroute: "向陽→嘉明湖→三叉山", agency: "yushan", agencyName: "玉山國家公園", peak: "三叉山 3,496m", days: 3, diff: 3, status: "open", hot: true, image: "assets/route-nanheng.png" },

  // 雪霸國家公園
  { id: "xueshan-main", name: "雪山主東線", subroute: "武陵→七卡→雪山主峰", agency: "shei-pa", agencyName: "雪霸國家公園", peak: "雪山主峰 3,886m", days: 2, diff: 3, status: "lottery", hot: true, image: "assets/route-wuling.png", note: "需抽籤" },
  { id: "wuling-4", name: "武陵四秀", subroute: "武陵→桃山→詩崙→品田", agency: "shei-pa", agencyName: "雪霸國家公園", peak: "品田山 3,524m", days: 3, diff: 4, status: "open", image: "assets/route-wuling.png" },
  { id: "shengling", name: "聖稜線", subroute: "雪山→大霸尖山", agency: "shei-pa", agencyName: "雪霸國家公園", peak: "大霸尖山 3,492m", days: 5, diff: 6, status: "open", image: "assets/route-wuling.png" },
  { id: "dabajian", name: "大霸群峰", subroute: "大鹿林道→九九山莊→大霸", agency: "shei-pa", agencyName: "雪霸國家公園", peak: "大霸尖山 3,492m", days: 3, diff: 4, status: "open", image: "assets/route-wuling.png" },

  // 太魯閣國家公園
  { id: "qilai-main", name: "奇萊主、北峰線", subroute: "松雪樓→成功山屋→奇萊主峰", agency: "taroko", agencyName: "太魯閣國家公園", peak: "奇萊主峰 3,560m", days: 3, diff: 4, status: "open", hot: true, image: "assets/route-qilai.png" },
  { id: "qilai-south", name: "奇萊南華", subroute: "屯原→天池山莊→南華山", agency: "taroko", agencyName: "太魯閣國家公園", peak: "南華山 3,184m", days: 2, diff: 3, status: "open", hot: true, image: "assets/route-qilai.png" },
  { id: "nanhu", name: "南湖大山", subroute: "勝光→雲稜→南湖圈谷", agency: "taroko", agencyName: "太魯閣國家公園", peak: "南湖大山 3,742m", days: 5, diff: 5, status: "open", image: "assets/route-qilai.png" },
  { id: "zhongyang", name: "中央尖山", subroute: "南山村→中央尖溪→中央尖", agency: "taroko", agencyName: "太魯閣國家公園", peak: "中央尖山 3,705m", days: 5, diff: 6, status: "open", image: "assets/route-qilai.png" },

  // 林業及自然保育署
  { id: "jiaming", name: "嘉明湖國家步道", subroute: "向陽→向陽山屋→嘉明湖", agency: "forestry", agencyName: "林業及自然保育署", peak: "向陽山 3,603m", days: 3, diff: 3, status: "open", hot: true, image: "assets/route-nanheng.png" },
  { id: "tianchi", name: "能高越嶺道—天池山莊", subroute: "屯原→天池山莊", agency: "forestry", agencyName: "林業及自然保育署", peak: "天池山莊 2,860m", days: 2, diff: 2, status: "open", image: "assets/route-qilai.png" },
  { id: "guigu", name: "檜谷山屋（北大武）", subroute: "登山口→檜谷山莊→北大武", agency: "forestry", agencyName: "林業及自然保育署", peak: "北大武山 3,092m", days: 2, diff: 3, status: "open", image: "assets/route-qilai.png" },
  { id: "walami", name: "瓦拉米步道", subroute: "南安→瓦拉米山屋", agency: "forestry", agencyName: "林業及自然保育署", peak: "瓦拉米 1,068m", days: 2, diff: 2, status: "open", image: "assets/route-nanheng.png" },

  // 警政署
  { id: "police-yushan", name: "玉山地區入山許可", subroute: "玉山國家公園範圍", agency: "police", agencyName: "警政署", peak: "—", days: 1, diff: 2, status: "open", image: "assets/route-yushan.png" },
  { id: "police-shei-pa", name: "雪霸地區入山許可", subroute: "雪霸國家公園範圍", agency: "police", agencyName: "警政署", peak: "—", days: 1, diff: 2, status: "open", image: "assets/route-wuling.png" },
];

const AGENCIES = [
  { id: "all", name: "全部", icon: "ph-bold ph-mountains" },
  { id: "yushan", name: "玉山國家公園", icon: "ph-bold ph-mountains" },
  { id: "shei-pa", name: "雪霸國家公園", icon: "ph-bold ph-mountains" },
  { id: "taroko", name: "太魯閣國家公園", icon: "ph-bold ph-mountains" },
  { id: "forestry", name: "林業及自然保育署", icon: "ph-bold ph-tree" },
  { id: "police", name: "警政署 入山許可", icon: "ph-bold ph-shield-check" },
];

const AGENCY_DESC = {
  yushan: "玉山國家公園管理處核發入園證，主峰路線需參加抽籤。",
  "shei-pa": "雪霸國家公園管理處核發入園證，雪山主東線旺季抽籤。",
  taroko: "太魯閣國家公園管理處核發入園證。",
  forestry: "林業及自然保育署管轄之保護區與山屋（嘉明湖、天池等）。",
  police: "進入山地管制區或國家公園範圍另需警政署入山許可。",
};

window.ROUTE_DATA = ROUTE_DATA;
window.AGENCIES = AGENCIES;
window.AGENCY_DESC = AGENCY_DESC;
