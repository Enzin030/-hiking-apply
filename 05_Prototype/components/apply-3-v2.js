/* ============================================================
   apply-3-v2.js — 步驟三「行程規劃」風格提案頁腳本
   ------------------------------------------------------------
   2026-09-21 建立。對應正式站 apply_1_4.aspx 步驟一（行程規劃）。
   獨立於現行 apply-3.js，不改動既有腳本。

   資料與狀態規範：
     - 在 data() 內存取 window.*，不在模組層存取。
     - 包含 18 個正式站控制項狀態管理。
     - 單日往返（玉山前峰、玉山線單日）自動帶入完整行程；
       多日往返（2~5天）支援逐點手選、宿營地檢查、終點登山口檢查。
   ============================================================ */

function getParam(key) {
  return new URLSearchParams(window.location.search).get(key) || "";
}

// 產生入園日期清單（56 項，排除關閉日 09-30 與 10-01）
function generateDateOptions() {
  const list = [];
  const start = new Date(2026, 8, 26); // 2026-09-26
  const closed = ["2026-09-30", "2026-10-01"];
  for (let i = 0; i < 58; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${day}`;
    if (!closed.includes(dateStr)) {
      list.push(dateStr);
    }
  }
  return list;
}

/* 公告事由 → 最新消息 id 的對照。正式站每則 closures 都連到 news_0_1.aspx?id=N，
   但 open.aspx 擷取時只留下事由文字，id 沒帶進來。
   這裡只登記已經查到 id 的那一則（2026-09-21 自正式站取得），
   其餘 [待確認]，查無對照就連到公告列表頁，不編造 id。 */
const CLOSURE_NEWS_IDS = {
  "公告自115年9月30日起至10月1日止（為期2天），暫停本園生態保護區「玉山主、群峰線」之入園活動。": "4800",
};

/* 由公告事由文字反推關閉日期區間。
   正式站文字格式：「公告自115年9月30日起至10月1日止（為期2天），…」
   民國年 +1911；迄日若省略年月則沿用起日的年（跨月時月份會另外寫出）。
   解析不出來就回傳空字串，讓樣板只顯示事由不顯示日期——不猜。 */
function parseClosureDateRange(text) {
  const m = String(text).match(/自(\d{2,3})年(\d{1,2})月(\d{1,2})日起至(?:(\d{2,3})年)?(?:(\d{1,2})月)?(\d{1,2})日止/);
  if (!m) return "";
  const pad = v => String(v).padStart(2, "0");
  const y1 = Number(m[1]) + 1911;
  const y2 = m[4] ? Number(m[4]) + 1911 : y1;
  const mo2 = m[5] ? m[5] : m[2];
  return `${y1}/${pad(m[2])}/${pad(m[3])}-${y2}/${pad(mo2)}/${pad(m[6])}`;
}

/* 次路線專屬路線圖。正式站 apply_1_4.aspx 的 con_imgMap 逐次路線給圖，
   目前只取回 2~5 天那張（2026-09-21 自正式站下載）；
   其餘次路線的圖 [待確認]，沒有就只顯示主路線全線圖，不拿別張頂替。 */
const SUBROUTE_MAPS = {
  "2": {
    src: "images/ys_玉山線_2-5天路線圖.png",
    alt: "2~5天(塔塔加 - 玉山線 - 塔塔加) 路線圖",
    caption: "2~5天(塔塔加 - 玉山線 - 塔塔加)",
  },
};

// 玉山線 2~5 天路線節點圖
const YUSHAN_PLANNER_GRAPH = {
  start: "排雲登山服務中心",
  exits: ["排雲登山服務中心"],
  camps: ["排雲山莊", "圓峰山屋", "圓峰營地"],
  edges: [
    ["排雲登山服務中心", "塔塔加登山口"],
    ["塔塔加登山口", "孟祿亭"],
    ["塔塔加登山口", "排雲山莊"],
    ["孟祿亭", "玉山前峰"],
    ["孟祿亭", "白木林涼亭"],
    ["白木林涼亭", "大峭壁"],
    ["大峭壁", "排雲山莊"],
    ["排雲山莊", "玉山主峰"],
    ["排雲山莊", "玉山西峰"],
    ["排雲山莊", "圓峰山屋"],
    ["圓峰山屋", "圓峰營地"],
    ["玉山主峰", "玉山東峰"],
    ["玉山主峰", "玉山北峰"],
    ["玉山主峰", "塔塔加登山口"],
    ["排雲山莊", "塔塔加登山口"]
  ]
};

thPage({
  data() {
    const qRoute = getParam("route");
    const qCid = getParam("cid");

    let defaultClimb = "3"; // 預設：玉山前峰單日往返
    if (qRoute === "np-2" || qCid === "2") defaultClimb = "2";
    else if (qRoute === "np-4" || qCid === "4") defaultClimb = "4";
    else if (qRoute === "np-3" || qCid === "3") defaultClimb = "3";

    return {
      // 0. 路線圖彈窗
      mapOpen: false,
      mapTabKey: "sub",

      // 1. 基本路線控制項
      teams_name: "天眼1隊",
      climblinemain: "1", // 1: 玉山線
      climbline: defaultClimb,
      sumday: defaultClimb === "2" ? "2" : "1",
      applystart: "2026-10-15",
      dateOptions: generateDateOptions(),

      mainRoutes: [
        { value: "1", text: "玉山線" },
        { value: "2", text: "南橫三山-庫哈諾辛山/關山線" },
        { value: "28", text: "八通關線" },
        { value: "29", text: "南二段線" },
        { value: "30", text: "秀姑巒線" },
        { value: "31", text: "馬博拉斯橫斷線" },
        { value: "27", text: "新康山線" },
        { value: "32", text: "八通關越嶺線" },
        { value: "3", text: "瓦拉米線" },
        { value: "36", text: "其他路線" }
      ],

      // 2. 路線規劃器狀態
      graph: YUSHAN_PLANNER_GRAPH,
      planDays: [["排雲登山服務中心"]],
      plannerFinished: false,
      plannerMsg: "",
      showStopDateModal: false,

      // 3. 行前講習與設備
      seminar: "1", // 1: 網路線上學習, 0: 團體自行辦理講習
      gps: "1",     // 1: 是, 0: 否
      satellitephone: "",
      frequency: "",
      note_user: "",

      // 4. 警政署入山證申請
      NpaReasons: "1", // 1: 登山健行
      npaReasonsOptions: [
        { value: "", text: "請選擇入山事由" },
        { value: "1", text: "登山健行" },
        { value: "10", text: "救濟" },
        { value: "11", text: "文化" },
        { value: "12", text: "醫療" },
        { value: "13", text: "衛生" },
        { value: "14", text: "其他" },
        { value: "15", text: "原住民" },
        { value: "16", text: "設籍於管制區" },
        { value: "17", text: "土地位於管制區" },
        { value: "18", text: "廠場位於管制區" },
        { value: "19", text: "因公務需要" },
        { value: "2", text: "學術研究" },
        { value: "20", text: "司法人員因公" },
        { value: "21", text: "治安人員因公" },
        { value: "22", text: "軍法人員因公" },
        { value: "23", text: "選監工作人員" },
        { value: "24", text: "侯選人員" },
        { value: "25", text: "不可抗力或緊急情事" },
        { value: "3", text: "錄製節目" },
        { value: "4", text: "氣象遙測" },
        { value: "5", text: "賽鴿訓練" },
        { value: "6", text: "訪友" },
        { value: "7", text: "攝影" },
        { value: "8", text: "賞鳥" },
        { value: "9", text: "傳教" }
      ],

      NpaPlacesInfo: "",
      addedPlaces: [],

      NpaPaths: "E00",
      npaPathsOptions: [
        { value: "", text: "請選擇詞庫" },
        { value: "TM00", text: "上河文化台灣百岳導遊圖" },
        { value: "M00", text: "上河文化台灣高山全覽圖" },
        { value: "E00", text: "玉山國家登山路線導覽圖" },
        { value: "D00", text: "雪霸國家公園地圖" },
        { value: "C00", text: "經建三版地形圖地圖產生器" },
        { value: "B00", text: "台灣地理人文全覽圖南島" },
        { value: "A00", text: "台灣地理人文全覽圖北島" }
      ],
      NpasubPaths: "",
      RouteMap_V: "玉山國家登山路線導覽圖",
      NpaPlan: "",

      // 側欄導覽啟用項目
      activeNavIndex: 0
    };
  },

  computed: {
    // 依次路線取得建議天數與資訊
    isSingleDay() {
      return this.climbline === "3" || this.climbline === "4";
    },

    subRoutes() {
      return [
        { value: "3", text: "玉山前峰單日往返", days: [1] },
        { value: "4", text: "玉山線單日往返", days: [1] },
        { value: "2", text: "2~5天(塔塔加 - 玉山線 - 塔塔加)", days: [2, 3, 4, 5] }
      ];
    },

    sumdayOptions() {
      if (this.isSingleDay) {
        return [{ value: "1", text: "共1天" }];
      }
      return [
        { value: "2", text: "共2天" },
        { value: "3", text: "共3天" },
        { value: "4", text: "共4天" },
        { value: "5", text: "共5天" }
      ];
    },

    /* 正式站的路線資訊表：難度等級來自 open.aspx 的該路線 level，
       說明／適合對象／建議裝備則是「按等級查表」——同一等級所有路線共用同一段文字
       （來源 TrailLevelData.js，即正式站 linelevel.aspx 彈窗那組）。
       原本雛形把第 3 級的文字寫死又標成「第 5 級」，換路線也不會變。 */
    // 裝備檢查表 PDF：TrailLevelData 已備好絕對網址，不在樣板寫死
    kitPdfUrl() {
      return window.KIT_PDF || "";
    },

    openRow() {
      const rows = window.OPEN_STATUS_ROWS || [];
      // applyId 全站不唯一（489 列只有 439 個相異值，各管處各自編號），
      // 必須連同管處一起比對，否則會撈到別處的同號路線
      return rows.find(r => r.filterKey === "yushan" && r.applyId === this.climbline) || null;
    },

    trailLevel() {
      const row = this.openRow;
      if (!row || row.level == null) return null;
      const levels = window.TRAIL_LEVELS || [];
      return levels.find(l => l.level === row.level) || null;
    },

    // 第 6 級的 desc 是陣列（兩個分項），其餘為字串，統一成陣列讓樣板一種寫法
    trailLevelDesc() {
      const lv = this.trailLevel;
      if (!lv) return [];
      return Array.isArray(lv.desc) ? lv.desc : [lv.desc];
    },

    /* 正式站「備註」欄有兩段：裝備檢查表下載，以及該路線自己的說明文字。
       後者存在 OPEN_STATUS_ROWS 的 note，句尾的 [登山路線路況][園區路況]
       是兩個連結被擷取時壓成純文字的殘留，這裡切開還原成連結。 */
    routeNoteText() {
      const raw = (this.openRow && this.openRow.note) || "";
      return raw.replace(/\s*\[登山路線路況\]\s*\[園區路況\]\s*$/, "").trim();
    },

    /* 路線圖：正式站在「登山主路線／次路線」旁有一顆「<主路線>地圖」按鈕，
       點開顯示該次路線的路線圖。這裡給兩組圖並以 tab 切換——
         1. 本次路線圖：正式站 con_imgMap 的那張（已下載到 images/）
         2. 主路線全線圖：沿用登山路線介紹（information_1）的 ROUTE_INTRO_DATA，
            以 openRow.mainRoute 對該管處的路線名稱，可能有多張（中西／中東）
       單日往返在正式站也有自己的建議路線圖，故同樣走這組 tab，不分開處理。 */
    /* 詞庫是兩層：主詞庫（NpaPaths）選定後，正式站以 postback 帶回子詞庫
       （NpasubPaths）的選項。子詞庫清單未擷取到 [待確認]，
       這裡只還原兩層結構與連動關係，不編造選項內容。 */
    npaSubPathsOptions() {
      if (!this.NpaPaths) return [];
      return [{ value: "", text: "請選擇子詞庫" }];
    },

    routeMapTabs() {
      const tabs = [];
      const sub = SUBROUTE_MAPS[this.climbline];
      if (sub) {
        tabs.push({ key: "sub", label: "本路線路線圖", images: [sub] });
      }
      const data = window.ROUTE_INTRO_DATA || {};
      const org = data[(this.openRow && this.openRow.filterKey) || "yushan"];
      const main = (this.openRow && this.openRow.mainRoute) || "";
      const hit = org && org.routes ? org.routes.find(r => r.name === main) : null;
      if (hit && hit.images && hit.images.length) {
        tabs.push({ key: "main", label: main + "全線圖", images: hit.images });
      }
      return tabs;
    },

    activeMapTab() {
      const tabs = this.routeMapTabs;
      if (!tabs.length) return null;
      return tabs.find(t => t.key === this.mapTabKey) || tabs[0];
    },

    // 玉管處兩個路況連結，正式站在備註欄末尾固定出現
    routeConditionLinks() {
      if (!this.openRow) return [];
      return [
        { text: "登山路線路況", href: "https://www.ysnp.gov.tw/Trail/7fa5c242-df1a-4a8e-bcab-32dc55b1f7b6?Tab=5" },
        { text: "園區路況", href: "https://www.ysnp.gov.tw/Highway/C001300" }
      ];
    },

    /* 本路線的公告關閉事由。正式站呈現為「關閉日期：<起>-<迄>」紅字一行，
       下一行「原因：」接一個連到公告內文的連結。
       OPEN_STATUS_ROWS 的 closures 只存事由文字，日期與公告 id 沒有被擷取進來，
       所以日期由事由文字裡的民國日期反推。
       公告連結：正式站此例為 news_0_1.aspx?id=4800，雛形已在 NewsData 建同 id
       的公告，故直接連過去；其餘公告的 id [待確認]，查無對照時連公告列表頁。 */
    routeClosures() {
      const list = (this.openRow && this.openRow.closures) || [];
      return list.map(text => {
        const id = CLOSURE_NEWS_IDS[text];
        return {
          text,
          dateRange: parseClosureDateRange(text),
          href: id ? `news_0_1.html?id=${id}` : "news_0.html"
        };
      });
    },

    routeData() {
      const routes = window.ROUTE_DATA || [];
      if (this.climbline === "3") {
        return routes.find(r => r.id === "np-3") || {
          displayName: "玉山前峰單日往返",
          routePath: "塔塔加 - 玉山前峰 - 塔塔加",
          routeGroup: "玉山線",
          peak: "玉山前峰",
          days: 1,
          diff: 3,
          durationLabel: "單日往返"
        };
      }
      if (this.climbline === "4") {
        return routes.find(r => r.id === "np-4") || {
          displayName: "玉山線單日往返",
          routePath: "塔塔加 - 玉山線 - 塔塔加",
          routeGroup: "玉山線",
          peak: "玉山主峰",
          days: 1,
          diff: 4,
          durationLabel: "單日往返"
        };
      }
      return routes.find(r => r.id === "np-2") || {
        displayName: "玉山線 2~5天",
        routePath: "塔塔加 - 玉山線 - 塔塔加",
        routeGroup: "玉山線",
        peak: "玉山群峰",
        days: Number(this.sumday),
        diff: 4,
        durationLabel: `${this.sumday} 天 ${Number(this.sumday) - 1} 夜`
      };
    },

    applyCrumb() {
      return "玉山國家公園";
    },

    // 依入園日與天數計算離園日期
    endDate() {
      if (!this.applystart) return "";
      const parts = this.applystart.split("-");
      if (parts.length !== 3) return "";
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      const daysToAdd = Math.max(0, Number(this.sumday) - 1);
      d.setDate(d.getDate() + daysToAdd);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    },

    // 路線規劃器計算
    dayIndex() {
      return this.planDays.length - 1;
    },
    today() {
      return this.planDays[this.dayIndex] || ["排雲登山服務中心"];
    },
    here() {
      return this.today[this.today.length - 1] || "排雲登山服務中心";
    },
    isLastDay() {
      return this.dayIndex === Number(this.sumday) - 1;
    },
    options() {
      const here = this.here;
      const out = [];
      this.graph.edges.forEach(e => {
        if (e[0] === here) out.push(e[1]);
        else if (e[1] === here) out.push(e[0]);
      });
      return out;
    },

    // 4 個主要區塊的填寫完成狀態
    secRouteOk() {
      return !!this.teams_name.trim() && !!this.climblinemain && !!this.climbline && !!this.sumday && !!this.applystart;
    },
    secPlannerOk() {
      return this.isSingleDay || this.plannerFinished;
    },
    secEquipmentOk() {
      return !!this.seminar && !!this.gps;
    },
    secNpaOk() {
      return !!this.NpaReasons && this.addedPlaces.length > 0 && !!this.NpaPlan.trim();
    },

    completedSectionsCount() {
      let count = 0;
      if (this.secRouteOk) count++;
      if (this.secPlannerOk) count++;
      if (this.secEquipmentOk) count++;
      if (this.secNpaOk) count++;
      return count;
    },

    canSubmit() {
      return this.secRouteOk && this.secPlannerOk && this.secEquipmentOk && this.secNpaOk;
    }
  },

  watch: {
    climbline: {
      immediate: true,
      handler(val) {
        if (val === "3") {
          this.sumday = "1";
          this.addedPlaces = [{ id: 1, text: "玉山前峰(嘉義縣-阿里山鄉)" }];
          this.NpaPlacesInfo = "玉山前峰(嘉義縣-阿里山鄉)";
          this.NpaPlan = "D1:排雲登山服務中心→塔塔加登山口→玉山前峰→塔塔加登山口→排雲登山服務中心。";
          this.plannerFinished = true;
        } else if (val === "4") {
          this.sumday = "1";
          this.addedPlaces = [{ id: 1, text: "玉山線(嘉義縣-阿里山鄉)" }];
          this.NpaPlacesInfo = "玉山線(嘉義縣-阿里山鄉)";
          this.NpaPlan = "D1:排雲登山服務中心→塔塔加登山口→排雲山莊→玉山主峰→塔塔加登山口→排雲登山服務中心。";
          this.plannerFinished = true;
        } else {
          if (this.sumday === "1") this.sumday = "2";
          this.addedPlaces = [{ id: 1, text: "玉山群峰(嘉義縣-阿里山鄉)" }];
          this.NpaPlacesInfo = "玉山群峰(嘉義縣-阿里山鄉)";
          this.resetPlanner();
        }
      }
    },

    sumday() {
      if (!this.isSingleDay) {
        this.resetPlanner();
      }
    },

    NpaPaths(val) {
      const match = this.npaPathsOptions.find(o => o.value === val);
      this.RouteMap_V = match ? match.text : "";
      this.NpasubPaths = "";
    }
  },

  methods: {
    // 捲動至對應區塊
    scrollToSection(id, index) {
      this.activeNavIndex = index;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },

    isCamp(node) {
      return this.graph.camps.includes(node);
    },

    isPeak(node) {
      return node.includes("峰") || node.includes("山");
    },

    // 路線規劃動作
    pickNode(n) {
      this.plannerMsg = "";
      const copy = this.planDays.map(d => [...d]);
      copy[this.dayIndex].push(n);
      this.planDays = copy;
      this.syncPlanText();
    },

    backNode() {
      this.plannerMsg = "";
      const copy = this.planDays.map(d => [...d]);
      if (copy[this.dayIndex].length > 1) {
        copy[this.dayIndex].pop();
      } else if (this.dayIndex > 0) {
        copy.pop();
      }
      this.planDays = copy;
      this.plannerFinished = false;
      this.syncPlanText();
    },

    resetPlanner() {
      this.plannerMsg = "";
      this.planDays = [[this.graph.start]];
      this.plannerFinished = false;
      this.syncPlanText();
    },

    finishDay() {
      if (this.today.length < 2) {
        this.plannerMsg = "請先選擇今日行經的地點";
        return;
      }
      if (this.isLastDay) {
        // 正式站實測規則：最後一天終點若不是起點登山口（排雲登山服務中心），跳警示
        if (!this.graph.exits.includes(this.here)) {
          this.plannerMsg = "最後一天行程的點必須為登山口";
          alert("最後一天行程的點必須為登山口");
          return;
        }
        this.plannerMsg = "";
        this.plannerFinished = true;
        this.syncPlanText();
        return;
      }
      // 非最後一天：必須結束在宿營地
      if (!this.isCamp(this.here)) {
        this.plannerMsg = "只有宿營地才能完成今日路線";
        alert("只有宿營地才能完成今日路線");
        return;
      }
      this.plannerMsg = "";
      const copy = this.planDays.map(d => [...d]);
      copy.push([this.here]);
      this.planDays = copy;
      this.syncPlanText();
    },

    // 同步路線規劃至登山計畫書文字
    syncPlanText() {
      if (this.isSingleDay) return;
      const lines = this.planDays.map((d, i) => `D${i + 1}:${d.join("→")}。`);
      this.NpaPlan = lines.join("\n");
    },

    // 警政署地點管理
    addPlace() {
      if (!this.NpaPlacesInfo) return;
      const exists = this.addedPlaces.some(p => p.text === this.NpaPlacesInfo);
      if (!exists) {
        this.addedPlaces.push({
          id: Date.now(),
          text: this.NpaPlacesInfo
        });
      }
    },

    removePlace(id) {
      this.addedPlaces = this.addedPlaces.filter(p => p.id !== id);
    },

    // 流程跳轉
    goPrev() {
      const q = new URLSearchParams(window.location.search);
      window.location.href = `apply-2.html?${q.toString()}`;
    },

    goNext() {
      if (!this.canSubmit) return;
      alert("行程規劃完成，下一步前往人員資料填寫。");
    }
  }
});
