/* ============================================================
   CountyWeatherData.js — 各縣市天氣預報資料定義（模擬示範不同天候狀態）
   對應舊站：information_2.aspx / 02_Spec/25_各縣市天氣預報.md
   ============================================================ */

window.COUNTY_WEATHER = [
  {
    regionId: "north",
    regionName: "北部",
    counties: [
      { name: "基隆市", tempText: "19~23", rainProb: 70, weatherText: "陰短暫雨", weatherIcon: "fa-solid fa-cloud-rain", weatherColor: "text-blue-600" },
      { name: "臺北市", tempText: "20~25", rainProb: 60, weatherText: "陰時多雲短暫雨", weatherIcon: "fa-solid fa-cloud-rain", weatherColor: "text-blue-600" },
      { name: "新北市", tempText: "20~26", rainProb: 60, weatherText: "陰短暫雨", weatherIcon: "fa-solid fa-cloud-rain", weatherColor: "text-blue-600" },
      { name: "桃園市", tempText: "21~27", rainProb: 40, weatherText: "多雲時陰", weatherIcon: "fa-solid fa-cloud", weatherColor: "text-slate-500" },
      { name: "新竹市", tempText: "21~28", rainProb: 20, weatherText: "多雲時晴", weatherIcon: "fa-solid fa-cloud-sun", weatherColor: "text-amber-500" },
      { name: "新竹縣", tempText: "20~27", rainProb: 20, weatherText: "多雲時晴", weatherIcon: "fa-solid fa-cloud-sun", weatherColor: "text-amber-500" },
      { name: "苗栗縣", tempText: "21~28", rainProb: 15, weatherText: "晴時多雲", weatherIcon: "fa-solid fa-sun", weatherColor: "text-amber-500" },
    ],
  },
  {
    regionId: "central",
    regionName: "中部",
    counties: [
      { name: "臺中市", tempText: "22~30", rainProb: 10, weatherText: "晴天", weatherIcon: "fa-solid fa-sun", weatherColor: "text-amber-500" },
      { name: "彰化縣", tempText: "22~29", rainProb: 10, weatherText: "晴時多雲", weatherIcon: "fa-solid fa-sun", weatherColor: "text-amber-500" },
      { name: "南投縣", tempText: "20~28", rainProb: 30, weatherText: "多雲午後局部陣雨", weatherIcon: "fa-solid fa-cloud-sun-rain", weatherColor: "text-sky-600" },
      { name: "雲林縣", tempText: "22~30", rainProb: 10, weatherText: "晴天", weatherIcon: "fa-solid fa-sun", weatherColor: "text-amber-500" },
      { name: "嘉義市", tempText: "22~30", rainProb: 10, weatherText: "晴時多雲", weatherIcon: "fa-solid fa-sun", weatherColor: "text-amber-500" },
      { name: "嘉義縣", tempText: "22~30", rainProb: 10, weatherText: "晴天", weatherIcon: "fa-solid fa-sun", weatherColor: "text-amber-500" },
    ],
  },
  {
    regionId: "south",
    regionName: "南部",
    counties: [
      { name: "臺南市", tempText: "23~31", rainProb: 5, weatherText: "晴天", weatherIcon: "fa-solid fa-sun", weatherColor: "text-amber-500" },
      { name: "高雄市", tempText: "24~31", rainProb: 10, weatherText: "晴時多雲", weatherIcon: "fa-solid fa-sun", weatherColor: "text-amber-500" },
      { name: "屏東縣", tempText: "23~31", rainProb: 20, weatherText: "多雲時晴", weatherIcon: "fa-solid fa-cloud-sun", weatherColor: "text-amber-500" },
    ],
  },
  {
    regionId: "east",
    regionName: "東部",
    counties: [
      { name: "宜蘭縣", tempText: "19~24", rainProb: 75, weatherText: "陰有雨", weatherIcon: "fa-solid fa-cloud-showers-heavy", weatherColor: "text-blue-600" },
      { name: "花蓮縣", tempText: "21~26", rainProb: 50, weatherText: "陰短暫陣雨", weatherIcon: "fa-solid fa-cloud-rain", weatherColor: "text-blue-600" },
      { name: "臺東縣", tempText: "22~28", rainProb: 30, weatherText: "多雲短暫陣雨", weatherIcon: "fa-solid fa-cloud-sun-rain", weatherColor: "text-sky-600" },
    ],
  },
  {
    regionId: "islands",
    regionName: "外島",
    counties: [
      { name: "澎湖縣", tempText: "23~28", rainProb: 10, weatherText: "晴時多雲", weatherIcon: "fa-solid fa-sun", weatherColor: "text-amber-500" },
      { name: "金門縣", tempText: "20~26", rainProb: 20, weatherText: "多雲時晴", weatherIcon: "fa-solid fa-cloud-sun", weatherColor: "text-amber-500" },
      { name: "連江縣", tempText: "16~21", rainProb: 45, weatherText: "陰天", weatherIcon: "fa-solid fa-cloud", weatherColor: "text-slate-500" },
    ],
  },
];
