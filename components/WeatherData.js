/* ============================================================
   WeatherData.js — 國家公園天氣資訊資料定義（模擬示範不同天候狀態）
   對應舊站：information_3.aspx / 02_Spec/26_國家公園天氣資訊.md
   ============================================================ */

window.NATIONAL_PARK_WEATHER = [
  {
    parkId: "ysnp",
    parkName: "玉山國家公園",
    spots: [
      {
        name: "水里遊客中心",
        tempText: "21~28",
        rainProb: 10,
        weatherText: "晴時多雲",
        weatherIcon: "fa-solid fa-sun",
        weatherColor: "text-amber-500",
      },
      {
        name: "塔塔加遊客中心",
        tempText: "11~19",
        rainProb: 60,
        weatherText: "午後短暫陣雨",
        weatherIcon: "fa-solid fa-cloud-sun-rain",
        weatherColor: "text-sky-600",
      },
      {
        name: "排雲登山服務中心",
        tempText: "2~11",
        rainProb: 20,
        weatherText: "多雲時晴",
        weatherIcon: "fa-solid fa-cloud-sun",
        weatherColor: "text-amber-500",
      },
      {
        name: "南安遊客中心",
        tempText: "22~30",
        rainProb: 0,
        weatherText: "晴天",
        weatherIcon: "fa-solid fa-sun",
        weatherColor: "text-amber-500",
      },
      {
        name: "梅山遊客中心",
        tempText: "16~24",
        rainProb: 30,
        weatherText: "多雲",
        weatherIcon: "fa-solid fa-cloud",
        weatherColor: "text-slate-500",
      },
    ],
  },
  {
    parkId: "spnp",
    parkName: "雪霸國家公園",
    spots: [
      {
        name: "觀霧遊憩區",
        tempText: "11~16",
        rainProb: 75,
        weatherText: "陰短暫雨",
        weatherIcon: "fa-solid fa-cloud-rain",
        weatherColor: "text-blue-600",
      },
      {
        name: "雪見遊憩區",
        tempText: "14~20",
        rainProb: 20,
        weatherText: "多雲時晴",
        weatherIcon: "fa-solid fa-cloud-sun",
        weatherColor: "text-amber-500",
      },
      {
        name: "武陵遊憩區",
        tempText: "9~21",
        rainProb: 10,
        weatherText: "晴時多雲",
        weatherIcon: "fa-solid fa-sun",
        weatherColor: "text-amber-500",
      },
      {
        name: "汶水遊客中心",
        tempText: "20~27",
        rainProb: 5,
        weatherText: "晴天",
        weatherIcon: "fa-solid fa-sun",
        weatherColor: "text-amber-500",
      },
    ],
  },
  {
    parkId: "trnp",
    parkName: "太魯閣國家公園",
    spots: [
      {
        name: "太魯閣遊客中心",
        tempText: "21~26",
        rainProb: 35,
        weatherText: "陰天",
        weatherIcon: "fa-solid fa-cloud",
        weatherColor: "text-slate-500",
      },
      {
        name: "天祥管理站",
        tempText: "16~23",
        rainProb: 65,
        weatherText: "短暫陣雨",
        weatherIcon: "fa-solid fa-cloud-rain",
        weatherColor: "text-blue-600",
      },
    ],
  },
];
