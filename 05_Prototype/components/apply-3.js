/* ============================================================
   apply-3.js — 申請流程步驟三「行程規劃」
   ------------------------------------------------------------
   對應正式站 apply_1_4.aspx 步驟一（行程規劃）。
   2026-09-21 依正式站實走結果重做，取代原本的四步驟版本。
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

// 玉山線節點路網圖
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
    ["玉山主峰", "塔塔加登山口"]
  ]
};

thPage({
  data() {
    const qRoute = getParam("route");
    const qCid = getParam("cid");

    let defaultClimb = "2"; // 當 route=np-2 或 cid=2 時為 2~5天
    if (qRoute === "np-3" || qCid === "3") defaultClimb = "3";
    else if (qRoute === "np-4" || qCid === "4") defaultClimb = "4";
    else if (qRoute === "np-2" || qCid === "2") defaultClimb = "2";

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

      // 2. 路線規劃器狀態（預設帶入 2 天行程）
      graph: YUSHAN_PLANNER_GRAPH,
      planDays: [
        ["排雲登山服務中心", "塔塔加登山口", "排雲山莊"],
        ["排雲山莊", "玉山主峰", "塔塔加登山口", "排雲登山服務中心"]
      ],
      plannerFinished: true,
      plannerMsg: "",

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

      NpaPlacesInfo: "玉山群峰(嘉義縣-阿里山鄉)",
      addedPlaces: [
        { id: 1, optionName: "玉山群峰(嘉義縣-阿里山鄉)", customText: "玉山群峰(嘉義縣-阿里山鄉)" }
      ],

      // 登山路線圖詞庫（主詞庫與子詞庫）
      NpaPaths: "TM00",
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

      NpasubPaths: "TM04",
      npaSubPathsOptions: [
        { value: "", text: "請選擇詞庫" },
        { value: "M15", text: "東郡山彙" },
        { value: "TM01", text: "臺灣百岳全圖" },
        { value: "TM02", text: "百岳賞花圖鑑圖" },
        { value: "TM03", text: "百岳登山須知" },
        { value: "TM04", text: "玉山群峰縱走" },
        { value: "TM05", text: "郡大山．西巒大山單登" },
        { value: "TM06", text: "聖稜 Y 型縱走" },
        { value: "TM07", text: "雪山西．南稜縱走" },
        { value: "TM08", text: "白姑大山單登" },
        { value: "TM09", text: "北一段縱走" },
        { value: "TM10", text: "北二段縱走" },
        { value: "TM11", text: "合歡．奇萊縱走" },
        { value: "TM12", text: "太魯閣山列(奇萊東稜)縱走" },
        { value: "TM13", text: "能高越嶺" },
        { value: "TM14", text: "能高安東軍縱走" },
        { value: "TM15", text: "干卓萬群峰縱走" },
        { value: "TM16", text: "七彩湖．六順山" },
        { value: "TM17", text: "丹大．東郡橫斷縱走" },
        { value: "TM18", text: "馬博拉斯橫斷縱走" },
        { value: "TM19", text: "南二段縱走" },
        { value: "TM20", text: "新康橫斷縱走" },
        { value: "TM21", text: "南一段縱走" },
        { value: "TM22", text: "北大武山登峰" }
      ],

      RouteMap_V: "上河文化台灣百岳導遊圖 - 玉山群峰縱走",
      NpaPlan: "",

      activeNavIndex: 0,
      mapOpen: false,
      mapTabKey: ""
    };
  },

  computed: {
    openRow() {
      const rows = window.OPEN_STATUS_ROWS || [];
      let targetName = "2~5天(塔塔加 - 玉山線 - 塔塔加)";
      if (this.climbline === "3") targetName = "玉山前峰單日往返";
      else if (this.climbline === "4") targetName = "玉山線單日往返";
      return rows.find(r => r.subRoute === targetName || (r.subRoute && r.subRoute.includes(this.routeData.displayName))) || null;
    },

    routeClosures() {
      if (this.openRow && Array.isArray(this.openRow.closures)) {
        return this.openRow.closures;
      }
      return [];
    },

    trailLevel() {
      return {
        level: 4,
        desc: "步道位處偏遠山區，路徑尚稱清晰但部分地形較崎嶇、氣候變化大而有潛在風險，一般行程約3至5天，或約3天以內但有困難地形。",
        who: "體力佳，具備地圖判讀、負重行進、野外維生、風險評估及應變能力者",
        kitRef: "，依行程需求攜帶宿營及相關技術攀登裝備。"
      };
    },

    trailLevelDesc() {
      if (!this.trailLevel) return [];
      if (Array.isArray(this.trailLevel.desc)) return this.trailLevel.desc;
      if (typeof this.trailLevel.desc === "string") return [this.trailLevel.desc];
      return [];
    },

    kitPdfUrl() {
      return window.KIT_PDF || "https://hike.taiwan.gov.tw/upload/files/kit.pdf";
    },

    routeNoteText() {
      return this.openRow ? (this.openRow.note || "") : "";
    },

    routeConditionLinks() {
      return [
        { text: "[登山路線路況]", href: "https://www.ysnp.gov.tw/Trail/7fa5c242-df1a-4a8e-bcab-32dc55b1f7b6?Tab=5" },
        { text: "[園區路況]", href: "https://www.ysnp.gov.tw/Highway/C001300" }
      ];
    },

    routeMapTabs() {
      return [
        {
          key: "yushan",
          label: "玉山線地圖",
          images: [
            {
              src: "images/ys_01玉山_群峰線-中.jpg",
              alt: "玉山群峰線",
              caption: "玉山群主峰地圖"
            }
          ]
        }
      ];
    },

    activeMapTab() {
      if (!this.routeMapTabs.length) return null;
      return this.routeMapTabs.find(t => t.key === this.mapTabKey) || this.routeMapTabs[0];
    },
    npaPlacesOptions() {
      if (this.climbline === "3") {
        return [
          { value: "玉山前峰(嘉義縣-阿里山鄉)", text: "玉山前峰(嘉義縣-阿里山鄉)" },
          { value: "玉山西峰(嘉義縣-阿里山鄉)", text: "玉山西峰(嘉義縣-阿里山鄉)" },
          { value: "達芬尖山(南投縣-信義鄉)", text: "達芬尖山(南投縣-信義鄉)" }
        ];
      }
      if (this.climbline === "4") {
        return [
          { value: "玉山線(嘉義縣-阿里山鄉)", text: "玉山線(嘉義縣-阿里山鄉)" },
          { value: "玉山主峰(嘉義縣-阿里山鄉)", text: "玉山主峰(嘉義縣-阿里山鄉)" },
          { value: "玉山東峰(南投縣-信義鄉)", text: "玉山東峰(南投縣-信義鄉)" },
          { value: "玉山北峰(南投縣-信義鄉)", text: "玉山北峰(南投縣-信義鄉)" }
        ];
      }
      return [
        { value: "玉山群峰(嘉義縣-阿里山鄉)", text: "玉山群峰(嘉義縣-阿里山鄉)" },
        { value: "玉山主峰(嘉義縣-阿里山鄉)", text: "玉山主峰(嘉義縣-阿里山鄉)" },
        { value: "玉山東峰(南投縣-信義鄉)", text: "玉山東峰(南投縣-信義鄉)" },
        { value: "玉山北峰(南投縣-信義鄉)", text: "玉山北峰(南投縣-信義鄉)" },
        { value: "玉山西峰(嘉義縣-阿里山鄉)", text: "玉山西峰(嘉義縣-阿里山鄉)" },
        { value: "玉山南峰(高雄市-桃源區)", text: "玉山南峰(高雄市-桃源區)" }
      ];
    },

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
        displayName: "2~5天(塔塔加 - 玉山線 - 塔塔加)",
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

    // 路線規劃狀態
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
      // 去重並保持乾淨節點清單
      return [...new Set(out)];
    },

    secRouteOk() {
      return !!this.teams_name.trim() && !!this.climblinemain && !!this.climbline && !!this.sumday && !!this.applystart;
    },
    secPlannerOk() {
      const plannerDone = this.isSingleDay || this.plannerFinished;
      const equipDone = !!this.seminar && !!this.gps;
      return plannerDone && equipDone;
    },
    secNpaOk() {
      return !!this.NpaReasons && this.addedPlaces.length > 0 && !!this.NpaPlan.trim();
    },

    completedSectionsCount() {
      let count = 0;
      if (this.secRouteOk) count++;
      if (this.secPlannerOk) count++;
      if (this.secNpaOk) count++;
      return count;
    },

    canSubmit() {
      return this.secRouteOk && this.secPlannerOk && this.secNpaOk;
    }
  },

  watch: {
    climbline: {
      immediate: true,
      handler(val) {
        if (val === "3") {
          this.sumday = "1";
          this.NpaPlacesInfo = "玉山前峰(嘉義縣-阿里山鄉)";
          this.addedPlaces = [{ id: 1, optionName: "玉山前峰(嘉義縣-阿里山鄉)", customText: "玉山前峰(嘉義縣-阿里山鄉)" }];
          this.NpaPlan = "D1:排雲登山服務中心→塔塔加登山口→玉山前峰→塔塔加登山口→排雲登山服務中心。";
          this.plannerFinished = true;
        } else if (val === "4") {
          this.sumday = "1";
          this.NpaPlacesInfo = "玉山線(嘉義縣-阿里山鄉)";
          this.addedPlaces = [{ id: 1, optionName: "玉山線(嘉義縣-阿里山鄉)", customText: "玉山線(嘉義縣-阿里山鄉)" }];
          this.NpaPlan = "D1:排雲登山服務中心→塔塔加登山口→排雲山莊→玉山主峰→塔塔加登山口→排雲登山服務中心。";
          this.plannerFinished = true;
        } else {
          if (this.sumday === "1") this.sumday = "2";
          this.NpaPlacesInfo = "玉山群峰(嘉義縣-阿里山鄉)";
          this.addedPlaces = [{ id: 1, optionName: "玉山群峰(嘉義縣-阿里山鄉)", customText: "玉山群峰(嘉義縣-阿里山鄉)" }];
          this.planDays = [
            ["排雲登山服務中心", "塔塔加登山口", "排雲山莊"],
            ["排雲山莊", "玉山主峰", "塔塔加登山口", "排雲登山服務中心"]
          ];
          this.plannerFinished = true;
          this.syncPlanText();
        }
      }
    },

    sumday() {
      if (!this.isSingleDay) {
        this.resetPlanner();
      }
    },

    NpaPaths() {
      this.updateRouteMap();
    },

    NpasubPaths() {
      this.updateRouteMap();
    }
  },

  methods: {
    scrollToSection(id, index) {
      this.activeNavIndex = index;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },

    // 05a 三種 Badge 判定
    // 綠色: 服務中心 / 登山口起終點 (排雲登山服務中心)
    // 藍色: 宿營地 (排雲山莊、圓峰山屋、圓峰營地)
    // 紅色: 一般途經節點 / 山峰 / 地標 (塔塔加登山口、玉山主峰、孟祿亭等)
    nodeBadgeType(node) {
      if (node === "排雲登山服務中心") return "green";
      if (this.graph.camps.includes(node)) return "blue";
      return "red";
    },

    nodeBadgeIcon(node) {
      const type = this.nodeBadgeType(node);
      if (type === "green") return "fa-solid fa-person-walking";
      if (type === "blue") return "fa-solid fa-bed";
      return "fa-solid fa-location-dot";
    },

    canRemoveNode(dayIdx, nodeIdx) {
      const isCurrentDay = dayIdx === this.planDays.length - 1;
      const dayNodes = this.planDays[dayIdx];
      const isLastNode = nodeIdx === dayNodes.length - 1;
      if (!isCurrentDay || !isLastNode) return false;
      if (dayIdx === 0 && dayNodes.length <= 1) return false;
      return true;
    },

    isCamp(node) {
      return this.graph.camps.includes(node);
    },

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
        if (!this.graph.exits.includes(this.here)) {
          alert("最後一天行程的點必須為登山口");
        }
        this.plannerMsg = "";
        this.plannerFinished = true;
        this.syncPlanText();
        return;
      }
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

    syncPlanText() {
      if (this.isSingleDay) return;
      const lines = this.planDays.map((d, i) => `D${i + 1}:${d.join("→")}。`);
      this.NpaPlan = lines.join("\n");
    },

    // 更新選定路線圖文字
    updateRouteMap() {
      const m = this.npaPathsOptions.find(o => o.value === this.NpaPaths);
      const s = this.npaSubPathsOptions.find(o => o.value === this.NpasubPaths);
      const mText = m && m.value ? m.text : "";
      const sText = s && s.value ? s.text : "";
      if (mText && sText) this.RouteMap_V = `${mText} - ${sText}`;
      else if (mText) this.RouteMap_V = mText;
      else this.RouteMap_V = "";
    },

    addPlace() {
      if (!this.NpaPlacesInfo) return;
      this.addedPlaces.push({
        id: Date.now(),
        optionName: this.NpaPlacesInfo,
        customText: this.NpaPlacesInfo
      });
    },

    removePlace(id) {
      this.addedPlaces = this.addedPlaces.filter(p => p.id !== id);
    },

    goPrev() {
      const q = new URLSearchParams(window.location.search);
      window.location.href = `apply-2.html?${q.toString()}`;
    },

    goNext() {
      if (!this.canSubmit) return;
      const q = new URLSearchParams(window.location.search);
      if (this.applyStart) q.set("applystart", this.applyStart);
      if (this.daysCount) q.set("sumday", this.daysCount);
      window.location.href = `apply-4-v2.html?${q.toString()}`;
    }
  }
});
