/* Route data — extracted from the live site's 80+ routes */

// unit 說明：
//   "yushan" / "shei-pa" / "taroko" → 國家公園同意書 → apply-2.html?unit=<unit>
//   "forestry-camp"                  → 林業山屋申請（待開發）
//   "forestry-area"                  → 林業保護區摘要 → apply-2.html?unit=forestry-area
//   "police"                         → 警政署入山確認 → apply-2.html?unit=police
//   "suspended"                      → 暫停申請，顯示 modal，不跳頁
const NATIONAL_PARK_ORG_IDS = {
  yushan: "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
  "shei-pa": "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
  taroko: "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
};

const ROUTE_LEGACY_KEYS = {
  "yushan-main":   { cId: "mock-c-ys-main",   fId: "mock-f-ys-main",   sourceGuid: "mock-source-ys-main",   campId: "0", requiresNpa: true,  requiresForestCamp: true,  requiresAttachment: true },
  "yushan-prince": { cId: "mock-c-ys-prince", fId: "mock-f-ys-main",   sourceGuid: "mock-source-ys-prince", campId: "0", requiresNpa: true,  requiresForestCamp: false, requiresAttachment: false },
  "yushan-east":   { cId: "mock-c-ys-east",   fId: "mock-f-ys-east",   sourceGuid: "mock-source-ys-east",   campId: "0", requiresNpa: true,  requiresForestCamp: false, requiresAttachment: true },
  "yushan-bata":   { cId: "mock-c-ys-bata",   fId: "mock-f-ys-bata",   sourceGuid: "mock-source-ys-bata",   campId: "0", requiresNpa: true,  requiresForestCamp: false, requiresAttachment: true },
  "nanheng":       { cId: "mock-c-ys-nanheng", fId: "mock-f-ys-nanheng", sourceGuid: "mock-source-ys-nanheng", campId: "mock-camp-jiaming", requiresNpa: true, requiresForestCamp: true, requiresAttachment: true },

  "xueshan-main":  { cId: "mock-c-sp-main",   fId: "mock-f-sp-main",   sourceGuid: "mock-source-sp-main",   campId: "0", requiresNpa: false, requiresForestCamp: false, requiresAttachment: true, requiresSafetyAssessment: true },
  "wuling-4":      { cId: "mock-c-sp-wuling4", fId: "mock-f-sp-wuling", sourceGuid: "mock-source-sp-wuling4", campId: "0", requiresNpa: false, requiresForestCamp: false, requiresAttachment: true, requiresSafetyAssessment: true },
  "shengling":     { cId: "mock-c-sp-shengling", fId: "mock-f-sp-shengling", sourceGuid: "mock-source-sp-shengling", campId: "0", requiresNpa: false, requiresForestCamp: false, requiresAttachment: true, requiresSafetyAssessment: true },
  "dabajian":      { cId: "mock-c-sp-dabajian", fId: "mock-f-sp-dabajian", sourceGuid: "mock-source-sp-dabajian", campId: "0", requiresNpa: false, requiresForestCamp: false, requiresAttachment: true, requiresSafetyAssessment: true },

  "qilai-main":    { cId: "mock-c-tk-qilai-main",  fId: "mock-f-tk-qilai", sourceGuid: "mock-source-tk-qilai-main",  campId: "0", requiresNpa: true, requiresForestCamp: false, requiresAttachment: false },
  "qilai-south":   { cId: "mock-c-tk-qilai-south", fId: "mock-f-tk-qilai", sourceGuid: "mock-source-tk-qilai-south", campId: "0", requiresNpa: true, requiresForestCamp: false, requiresAttachment: false },
  "nanhu":         { cId: "mock-c-tk-nanhu",        fId: "mock-f-tk-nanhu", sourceGuid: "mock-source-tk-nanhu",        campId: "0", requiresNpa: true, requiresForestCamp: false, requiresAttachment: false },
  "zhongyang":     { cId: "mock-c-tk-zhongyang",    fId: "mock-f-tk-zhongyang", sourceGuid: "mock-source-tk-zhongyang", campId: "0", requiresNpa: true, requiresForestCamp: false, requiresAttachment: false },
};

const RAW_ROUTE_DATA = [
  // 玉山國家公園
  { id: "yushan-main",   name: "玉山主峰線",     subroute: "塔塔加→排雲山莊→玉山主峰",   agency: "yushan",   agencyName: "玉山國家公園",    peak: "玉山主峰 3,952m",  days: 2, diff: 3, status: "lottery", hot: true, image: "assets/route-yushan.png",  note: "需抽籤",                unit: "yushan" },
  { id: "yushan-prince", name: "玉山前峰日往返",  subroute: "塔塔加→玉山前峰",            agency: "yushan",   agencyName: "玉山國家公園",    peak: "玉山前峰 3,239m",  days: 1, diff: 3, status: "open",                    image: "assets/route-yushan.png",                                 unit: "yushan" },
  { id: "yushan-east",   name: "玉山東小南線",    subroute: "塔塔加→東峰→小南山",         agency: "yushan",   agencyName: "玉山國家公園",    peak: "玉山東峰 3,869m",  days: 4, diff: 5, status: "open",                    image: "assets/route-yushan.png",                                 unit: "yushan" },
  { id: "yushan-bata",   name: "八通關古道",      subroute: "東埔→八通關→大水窟",         agency: "yushan",   agencyName: "玉山國家公園",    peak: "八通關 2,810m",    days: 5, diff: 4, status: "open",                    image: "assets/route-nanheng.png",                                unit: "yushan" },
  { id: "nanheng",       name: "南橫三山",        subroute: "向陽→嘉明湖→三叉山",         agency: "yushan",   agencyName: "玉山國家公園",    peak: "三叉山 3,496m",    days: 3, diff: 3, status: "open",    hot: true, image: "assets/route-nanheng.png",                                unit: "yushan" },

  // 雪霸國家公園
  { id: "xueshan-main",  name: "雪山主東線",      subroute: "武陵→七卡→雪山主峰",         agency: "shei-pa",  agencyName: "雪霸國家公園",    peak: "雪山主峰 3,886m",  days: 2, diff: 3, status: "lottery", hot: true, image: "assets/route-wuling.png",  note: "需抽籤",                unit: "shei-pa" },
  { id: "wuling-4",      name: "武陵四秀",        subroute: "武陵→桃山→詩崙→品田",        agency: "shei-pa",  agencyName: "雪霸國家公園",    peak: "品田山 3,524m",    days: 3, diff: 4, status: "open",                    image: "assets/route-wuling.png",                                 unit: "shei-pa" },
  { id: "shengling",     name: "聖稜線",          subroute: "雪山→大霸尖山",              agency: "shei-pa",  agencyName: "雪霸國家公園",    peak: "大霸尖山 3,492m",  days: 5, diff: 6, status: "open",                    image: "assets/route-wuling.png",                                 unit: "shei-pa" },
  { id: "dabajian",      name: "大霸群峰",        subroute: "大鹿林道→九九山莊→大霸",     agency: "shei-pa",  agencyName: "雪霸國家公園",    peak: "大霸尖山 3,492m",  days: 3, diff: 4, status: "open",                    image: "assets/route-wuling.png",                                 unit: "shei-pa" },

  // 太魯閣國家公園
  { id: "qilai-main",    name: "奇萊主、北峰線",  subroute: "松雪樓→成功山屋→奇萊主峰",   agency: "taroko",   agencyName: "太魯閣國家公園",  peak: "奇萊主峰 3,560m",  days: 3, diff: 4, status: "open",    hot: true, image: "assets/route-qilai.png",                                  unit: "taroko" },
  { id: "qilai-south",   name: "奇萊南華",        subroute: "屯原→天池山莊→南華山",       agency: "taroko",   agencyName: "太魯閣國家公園",  peak: "南華山 3,184m",    days: 2, diff: 3, status: "open",    hot: true, image: "assets/route-qilai.png",                                  unit: "taroko" },
  { id: "nanhu",         name: "南湖大山",        subroute: "勝光→雲稜→南湖圈谷",         agency: "taroko",   agencyName: "太魯閣國家公園",  peak: "南湖大山 3,742m",  days: 5, diff: 5, status: "open",                    image: "assets/route-qilai.png",                                  unit: "taroko" },
  { id: "zhongyang",     name: "中央尖山",        subroute: "南山村→中央尖溪→中央尖",     agency: "taroko",   agencyName: "太魯閣國家公園",  peak: "中央尖山 3,705m",  days: 5, diff: 6, status: "open",                    image: "assets/route-qilai.png",                                  unit: "taroko" },

  // 林業及自然保育署 — 山屋/營地 (forestry-camp)
  { id: "jiaming",       name: "嘉明湖國家步道",  subroute: "向陽→向陽山屋→嘉明湖",       agency: "forestry", agencyName: "林業及自然保育署", peak: "向陽山 3,603m",    days: 3, diff: 3, status: "open",    hot: true, image: "assets/route-nanheng.png",                                unit: "forestry-camp" },
  { id: "tianchi",       name: "能高越嶺道—天池山莊", subroute: "屯原→天池山莊",          agency: "forestry", agencyName: "林業及自然保育署", peak: "天池山莊 2,860m",  days: 2, diff: 2, status: "open",                    image: "assets/route-qilai.png",                                  unit: "forestry-camp" },
  { id: "guigu",         name: "檜谷山屋（北大武）", subroute: "登山口→檜谷山莊→北大武",  agency: "forestry", agencyName: "林業及自然保育署", peak: "北大武山 3,092m",  days: 2, diff: 3, status: "open",                    image: "assets/route-qilai.png",                                  unit: "forestry-camp" },
  { id: "walami",        name: "瓦拉米步道",      subroute: "南安→瓦拉米山屋",            agency: "forestry", agencyName: "林業及自然保育署", peak: "瓦拉米 1,068m",    days: 2, diff: 2, status: "open",                    image: "assets/route-nanheng.png",                                unit: "forestry-camp" },

  // 警政署入山許可
  { id: "police-yushan",   name: "玉山地區入山許可", subroute: "玉山國家公園範圍",        agency: "police",   agencyName: "警政署",          peak: "—",                days: 1, diff: 2, status: "open",                    image: "assets/route-yushan.png",                                 unit: "police" },
  { id: "police-shei-pa",  name: "雪霸地區入山許可", subroute: "雪霸國家公園範圍",        agency: "police",   agencyName: "警政署",          peak: "—",                days: 1, diff: 2, status: "open",                    image: "assets/route-wuling.png",                                 unit: "police" },
];

const ROUTE_DATA = RAW_ROUTE_DATA.map(route => {
  const orgId = NATIONAL_PARK_ORG_IDS[route.unit] || "";
  const legacy = ROUTE_LEGACY_KEYS[route.id] || {};
  const isNationalPark = Boolean(orgId);
  const isPolice = route.unit === "police";
  const isForestryArea = route.unit === "forestry-area";
  const isForestryCamp = route.unit === "forestry-camp";

  return {
    ...route,
    applyType: isNationalPark
      ? "nationalPark"
      : isForestryCamp
        ? "forestCamp"
        : (isPolice || isForestryArea)
          ? "summary"
          : route.unit,
    orgId,
    cId: legacy.cId || "",
    fId: legacy.fId || "",
    sourceGuid: legacy.sourceGuid || "",
    campId: legacy.campId || "0",
    parkForm: isNationalPark ? route.unit : "",
    requiresNpa: Boolean(legacy.requiresNpa),
    requiresForestCamp: Boolean(legacy.requiresForestCamp),
    requiresAttachment: Boolean(legacy.requiresAttachment),
    requiresSafetyAssessment: Boolean(legacy.requiresSafetyAssessment),
  };
});

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
window.NATIONAL_PARK_ORG_IDS = NATIONAL_PARK_ORG_IDS;
