/* ============================================================
   RouteIntroData.js — 登山路線介紹的頁籤與區塊結構（規格 02_Spec/23_登山路線介紹.md）
   ------------------------------------------------------------
   一般 <script>，以 window.* 匯出，由 information_1.html 於 <body> 底部載入。
   消費端一律在 data() 裡讀（見 information_1.js 檔頭）。

   **這裡只有「結構」，沒有「內容」。**
   規格記載的是各機關有哪些標籤、每個標籤有哪些區塊（路線圖／路線介紹／
   建議行程／對外交通／官網連結），內容本體（富文字 HTML、行程節點、
   交通說明、路線圖圖檔）是舊站的既有素材，尚未取得，因此每個區塊
   在雛形都標 [待確認]，不臆造。

   kind 決定該標籤有哪些區塊：
     full   路線圖＋路線介紹＋建議行程＋對外交通
     oneday 路線圖＋建議行程＋對外交通（無路線介紹）——太魯閣的單攻路線
     trip   路線圖＋建議行程（無路線介紹、無對外交通）——太魯閣的行程路線
     map    只有步道圖／全區圖

   official：該機關的標籤底端是否有「官網連結」按鈕。
   規格明載太魯閣全處皆無，玉山與雪霸皆有（太魯閣步道那一張連圖說都沒有）。
   ============================================================ */

window.ROUTE_INTRO_ORGS = [
  {
    key: "yushan",
    label: "玉山國家公園管理處",
    short: "玉管處",
    official: true,
    officialLabel: "玉山國家公園官網",
    officialUrl: "https://www.ysnp.gov.tw/",
    tabs: [
      { id: "b1", name: "玉山全區圖", kind: "map" },
      { id: "b2", name: "玉山線", kind: "full" },
      { id: "b3", name: "馬博線", kind: "full" },
      { id: "b4", name: "八通關越嶺線", kind: "full" },
      { id: "b5", name: "南二段線", kind: "full" },
      { id: "b6", name: "新康線", kind: "full" },
      { id: "b7", name: "南橫三山／關山線", kind: "full" },
      { id: "b8", name: "玉山步道", kind: "map" },
    ],
  },
  {
    key: "taroko",
    label: "太魯閣國家公園管理處",
    short: "太管處",
    official: false,
    tabs: [
      { id: "c1", name: "奇萊主北峰", kind: "full" },
      { id: "c2", name: "奇萊東稜", kind: "full", attachment: "奇萊東稜路標規劃及施作紀錄表（Word）" },
      { id: "c3", name: "南湖中央尖線（北一段）", kind: "full" },
      { id: "c4", name: "南湖大山線", kind: "full" },
      { id: "c5", name: "北二段", kind: "full" },
      { id: "c6", name: "畢祿縱走羊頭", kind: "full" },
      { id: "c7", name: "清水山", kind: "full" },
      { id: "c8", name: "錐麓古道", kind: "full", attachment: "停車資訊圖", externalLabel: "台灣好行", externalUrl: "https://www.taiwantrip.com.tw/" },
      { id: "c9", name: "奇萊連峰", kind: "full" },
      { id: "c10", name: "畢祿山單攻", kind: "oneday" },
      { id: "c11", name: "羊頭山單攻", kind: "oneday" },
      { id: "c12", name: "北一縱走北二", kind: "trip" },
      { id: "c13", name: "閂山鈴鳴山", kind: "trip" },
      { id: "c14", name: "閂山單攻", kind: "trip" },
      { id: "c15", name: "奇萊南峰", kind: "trip" },
      { id: "c16", name: "太魯閣步道", kind: "map" },
    ],
  },
  {
    key: "sheipa",
    label: "雪霸國家公園管理處",
    short: "雪管處",
    official: true,
    officialLabel: "雪霸國家公園官網",
    officialUrl: "https://www.spnp.gov.tw/",
    tabs: [
      { id: "d1", name: "雪山西稜線", kind: "full" },
      { id: "d2", name: "雪東線", kind: "full" },
      { id: "d3", name: "聖稜線", kind: "full" },
      { id: "d4", name: "武陵四秀", kind: "full" },
      { id: "d5", name: "大霸線", kind: "full" },
      { id: "d6", name: "志佳陽線", kind: "full" },
      { id: "d7", name: "雪劍線（大小劍線）", kind: "full" },
      { id: "d8", name: "大霸北稜線", kind: "full" },
      { id: "d9", name: "雪霸步道", kind: "map" },
    ],
  },
];

/* 各 kind 有哪些區塊。順序即畫面由上而下的順序。 */
window.ROUTE_INTRO_SECTIONS = {
  full: ["map", "intro", "plan", "traffic"],
  oneday: ["map", "plan", "traffic"],
  trip: ["map", "plan"],
  map: ["map"],
};

window.ROUTE_INTRO_SECTION_META = {
  map: { title: "路線圖", icon: "fa-solid fa-map", note: "路線圖圖檔為舊站既有素材，尚未取得。" },
  intro: { title: "路線介紹", icon: "fa-solid fa-circle-info", note: "富文字內容為舊站既有素材，尚未取得。" },
  plan: { title: "建議行程", icon: "fa-solid fa-route", note: "依行程天數標註行進節點與里程；部分路線有多組建議行程。" },
  traffic: { title: "對外交通", icon: "fa-solid fa-car", note: "各登山口自行開車與接駁指引。" },
};

Object.assign(window, {
  ROUTE_INTRO_ORGS,
  ROUTE_INTRO_SECTIONS,
  ROUTE_INTRO_SECTION_META,
});
