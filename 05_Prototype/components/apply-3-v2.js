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
