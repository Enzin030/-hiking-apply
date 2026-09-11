/* ============================================================
   index-b.js — 首頁 B 案
   原 05_Prototype/hiking-site/app.js（209 行，命令式 DOM 操作）；
   該目錄已於階段 4 刪除，原始碼見 git 624985e。
   版面已搬到 index-b.html，樣式搬到 assets/css/pages.css 的 .p-indexb-* 區塊。
   ============================================================

   ------------------------------------------------------------
   209 行裡有 99 行由既有共用元件取代，未移植
   ------------------------------------------------------------
   | 來源行數   | 做什麼                    | 取代者 |
   |------------|---------------------------|--------|
   | 132–208    | 語言下拉、行動選單、Escape | th-header（已內建） |
   | 100–122    | 快捷選單開關              | th-quick-nav |
   | 35（openStage） | 階段彈窗             | **來源即死碼**：點階段實際呼叫 openQuickMenu |
   | 130 的 sitemap／search | 兩個彈窗    | 觸發鈕在來源自有頁首上，改用 th-header 後沒有觸發點 |

   ------------------------------------------------------------
   命令式 → 宣告式的逐項對應
   ------------------------------------------------------------
   | 原 app.js                                   | Vue |
   |---------------------------------------------|-----|
   | `document.querySelectorAll('[data-icon]')` 逐一 outerHTML 換成 <i> | 樣板直接 `<i :class="iconOf(name)">` |
   | `innerHTML = items.map(resource).join('')`  | v-for |
   | `let noticeIndex` ＋ 直接改 badge/title 的 textContent | data.noticeIndex ＋ computed.notice |
   | `newsModalOverlay.style.display`             | v-if ＋ th-modal |
   | `openModal/content.innerHTML`                | data.detailLabel ＋ v-if ＋ th-modal |
   | `setInterval(7000)` 自動輪播                  | mounted 起 interval、unmounted 清掉 |

   **自動輪播的暫停條件照搬**：來源是「分頁不在前景、或任一彈窗開著」就跳過。
   來源檢查三個彈窗（news／quick／dialog），這裡對應到 newsOpen／detailLabel／
   th-quick-nav 的開關狀態（透過 ref 讀）。

   **點階段開快捷選單用 template ref**：th-quick-nav 的開關是它自己的內部狀態，
   沒有對外 API。用 ref 直接設它的 open，比替共用元件加一個只有本頁要用的 prop
   乾淨——不動共用元件。
   ============================================================ */

const faIcons = {
  mountain: 'fa-solid fa-mountain',
  map: 'fa-solid fa-map-location-dot',
  edit: 'fa-solid fa-pen-to-square',
  calendar: 'fa-solid fa-calendar-check',
  walk: 'fa-solid fa-person-hiking',
  book: 'fa-solid fa-book-open',
  weather: 'fa-solid fa-cloud-sun',
  pin: 'fa-solid fa-location-dot',
  warning: 'fa-solid fa-triangle-exclamation',
  helicopter: 'fa-solid fa-helicopter',
  tree: 'fa-solid fa-tree',
  scale: 'fa-solid fa-scale-balanced',
  bag: 'fa-solid fa-suitcase-rolling',
  file: 'fa-solid fa-file-lines',
  search: 'fa-solid fa-magnifying-glass',
  sign: 'fa-solid fa-diamond-turn-right',
  bed: 'fa-solid fa-bed',
  help: 'fa-solid fa-circle-question',
  info: 'fa-solid fa-circle-info',
  users: 'fa-solid fa-users-slash',
  compass: 'fa-solid fa-compass',
  megaphone: 'fa-solid fa-bullhorn'
};

const groups={weather:[['山區氣象','weather']],map:[['PAC 位置','pin'],['百岳位置','mountain'],['山坡地經常管制區','warning'],['救難直升機停機坪','helicopter'],['國家公園生態保護區內事故熱點','tree']],knowledge:[['法令資訊','scale'],['登山建議裝備清單','bag'],['登山安全教材','file'],['路線介紹','map']],query:[['申請日期查詢','calendar'],['登山路線開放狀態','sign'],['宿營地及床位查詢','bed']],help:[['登山須知','book'],['常見問題','help']],other:[['違規名單','users'],['旅遊登山資訊','compass']]};

const stages=[{title:'認識登山',subtitle:'獲取登山知識',icon:'mountain',links:['登山安全教材','登山安全防護原則','國家公園步道分級','登山建議裝備清單','登山留守制度']},{title:'規劃行程',subtitle:'選擇路線與地圖',icon:'map',links:['路線介紹','百岳位置','山區氣象','登山路線開放狀態','宿營地與床位查詢']},{title:'辦理申請',subtitle:'申請/修改資料',icon:'edit',links:['開始登山申請','申請日期查詢','登山須知','常見問題']},{title:'行前確認',subtitle:'必要整備',icon:'calendar',links:['山區氣象','登山路線開放狀態','登山建議裝備清單','PAC 位置']},{title:'完成登山',subtitle:'下山回報',icon:'walk',links:['出園回報']}];

const notices = [
  { agencyId: 'nps', org: '國家公園署', date: '2026-03-20', title: '登山前請確認路線開放狀態及最新天候資訊', content: '一、為確保登山安全，請山友於出發前密切關注各國家公園步道開放情形，並準備充足裝備與落實留守人員聯繫機制。\n二、如有受天候影響封閉之步道，請勿強行入山。\n三、行程中如遇天候驟變，應評估隊伍狀況及早撤退。' },
  { agencyId: 'sheipa', org: '雪管處', date: '2026-03-18', title: '115年雪霸國家公園清明連假期間入園申請注意事項', content: '一、115年清明連續假期，雪霸國家公園生態保護區入園申請熱門。\n二、為維護公平性，請獲准隊伍如需異動人員或取消行程，務必於入園前1天15:00前至系統辦理。\n三、山區氣候多變，行前請評估隊員體能狀況及裝備完整性，並確實遵守園區禁止事項。' },
  { agencyId: 'yushan', org: '玉管處', date: '2026-03-15', title: '排雲山莊容宿量調整措施及行前備妥裝備提醒', content: '一、進入高海拔山區請備妥防寒保暖衣物、雨具與定位通訊設備，並落實留守人通報機制。\n二、排雲山莊相關住宿請提早於規定期限內辦理，並於收到核准通知後完成手續。\n三、請各登山隊伍隨時留意本站與玉管處官方最新訊息公告。' }
];

thPage({
  data() {
    return {
      noticeIndex: 0,
      newsOpen: false,
      detailLabel: "",
    };
  },

  computed: {
    // 唯讀常數，不進 data()
    stages() { return stages; },
    groups() { return groups; },
    notice() { return notices[this.noticeIndex]; },

    /* 兩個面板的分組標題與圖示，對應來源 index.html 的 <h3> */
    eduGroups() {
      return [
        { key: "weather", title: "氣象資訊", icon: "weather" },
        { key: "map", title: "地圖探索", icon: "map" },
        { key: "knowledge", title: "知識資訊", icon: "book", extra: "knowledge" },
      ];
    },
    applyGroups() {
      return [
        { key: "query", title: "申請前查詢", icon: "search" },
        { key: "help", title: "申請說明", icon: "file" },
        { key: "other", title: "其他資訊", icon: "info" },
      ];
    },
  },

  methods: {
    iconOf(name) { return faIcons[name] || "fa-solid fa-file-lines"; },

    showNotice(delta) {
      this.noticeIndex = (this.noticeIndex + delta + notices.length) % notices.length;
    },

    /* th-quick-nav 的開關是它自己的內部狀態，用 ref 設，不動共用元件 */
    openQuick() {
      if (this.$refs.quicknav) this.$refs.quicknav.open = true;
    },
    quickOpen() {
      return !!(this.$refs.quicknav && this.$refs.quicknav.open);
    },
  },

  mounted() {
    /* 自動輪播：暫停條件照搬來源——分頁不在前景，或任一彈窗開著 */
    this._timer = window.setInterval(() => {
      if (!document.hidden && !this.newsOpen && !this.detailLabel && !this.quickOpen()) {
        this.showNotice(1);
      }
    }, 7000);
  },

  unmounted() {
    window.clearInterval(this._timer);
  },
});
