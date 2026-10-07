/* ============================================================
   apply-3.js — 申請流程步驟三「行程規劃」
   ------------------------------------------------------------
   對應正式站 apply_1_4.aspx 步驟一（行程規劃）。
   2026-09-21 依正式站實走結果重做，取代原本的四步驟版本。

   2026-10-02：三管處共用本頁（使用者要求一律以玉山元件為準）。網址 park 參數取
   window.thParkApply(park) 的機關設定（components/ParkApplyData.js）；沒有 park＝玉山，
   玉山的程式路徑與畫面維持原樣。雪霸（park=shei-pa）對應正式站 apply_1_3.aspx 步驟一。
   ============================================================ */

function getParam(key) {
  return new URLSearchParams(window.location.search).get(key) || "";
}

// 產生入園日期清單：今日＋5 天起、跨 57 天，排除關閉日。
// 正式站 2026-09-21 擷取（prod-YUS001-S01）：09-26～11-21，排除 09-30、10-01（頁面標示「關閉日期：2026/09/30-2026/10/01」）。
// 原本寫死從 2026-09-26 起算，過了那天清單就含過去日期（2026-10-01 發現）。
// 關閉日是依公告的特定日期，此處只是那次觀察的示意〔待確認：關閉日來源〕。
function generateDateOptions() {
  const list = [];
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5);
  const closed = ["2026-09-30", "2026-10-01"];
  for (let i = 0; i < 57; i++) {
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

/* 非玉山機關沒有節點資料的路線：以玉山三種 badge 的意思組成通用節點圖
   （綠＝登山口〔起終點〕、藍＝宿營地〔可過夜〕、紅＝途經點），規則同正式站：
   每晚的終點須為宿營地、最後一天須回到登山口。 */
const GENERIC_PLANNER_GRAPH = {
  start: "登山口",
  starts: ["登山口"],
  exits: ["登山口"],
  camps: ["宿營地"],
  edges: [
    ["登山口", "途經點"],
    ["途經點", "宿營地"]
  ]
};

/* 依節點圖與天數排出合法行程（必填欄位預設有值，換天數也不會清空）：
   第 1 天走到最近的宿營地；中間各天由宿營地往返相鄰點；最後一天回登山口。
   單日則走到最遠可達點再折返登山口。排不出來回傳 null（交給使用者手動規劃）。 */
function autoPlan(graph, days) {
  if (!graph || !graph.start) return null;
  const adj = {};
  graph.edges.forEach(e => {
    (adj[e[0]] = adj[e[0]] || []).push(e[1]);
    (adj[e[1]] = adj[e[1]] || []).push(e[0]);
  });
  // 由 from 出發、找第一個符合 ok 的點（不含 from 本身）的最短路徑
  const path = (from, ok) => {
    const prev = { [from]: null };
    const queue = [from];
    while (queue.length) {
      const cur = queue.shift();
      if (cur !== from && ok(cur)) {
        const out = [];
        for (let n = cur; n !== null; n = prev[n]) out.unshift(n);
        return out;
      }
      (adj[cur] || []).forEach(n => { if (!(n in prev)) { prev[n] = cur; queue.push(n); } });
    }
    return null;
  };
  const isCamp = n => graph.camps.includes(n);
  const isExit = n => graph.exits.includes(n);
  const n = Number(days) || 1;
  if (n === 1) {
    // 單日不過夜：走到最遠的途經點（不選宿營地與登山口），沒有途經點才退而取最遠點
    const seen = [graph.start];
    for (let i = 0; i < seen.length; i++) (adj[seen[i]] || []).forEach(x => { if (!seen.includes(x)) seen.push(x); });
    const plain = seen.filter(x => !isCamp(x) && !isExit(x));
    const far = plain.length ? plain[plain.length - 1] : seen[seen.length - 1];
    if (far === graph.start) return null;
    const go = path(graph.start, x => x === far);
    const back = isExit(far) ? [far] : path(far, isExit);
    return go && back ? [go.concat(back.slice(1))] : null;
  }
  const first = path(graph.start, isCamp);
  if (!first) return null;
  const plan = [first];
  let camp = first[first.length - 1];
  for (let d = 1; d < n - 1; d++) {
    const near = adj[camp] || [];
    const via = near.find(x => !isCamp(x) && !isExit(x)) || near[0];
    plan.push([camp, via, camp]);
  }
  const last = path(camp, isExit);
  if (!last) return null;
  plan.push(last);
  return plan;
}

/* 非玉山機關的入園日期：今日＋5 天起連續 57 個（雪霸 2026-10-01 正式站實測，無排除日） */
function parkDateOptions() {
  const out = [];
  const t = new Date();
  for (let i = 0; i < 57; i++) {
    const d = new Date(t.getFullYear(), t.getMonth(), t.getDate() + 5 + i);
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
  }
  return out;
}

thPage({
  data() {
    const qRoute = getParam("route");
    const qCid = getParam("cid");
    const qTeamsName = getParam("teams_name");
    const qMainRoute = getParam("climblinemain");
    const qClimb = getParam("climbline");
    const qStart = getParam("applystart");
    const qSumday = getParam("sumday");
    const park = window.thParkApply(getParam("park"));
    const dateOptions = park.key === "yushan" ? generateDateOptions() : parkDateOptions();
    // 示意入園日 10-15；已不在可選範圍（過了 10 月中）就改取清單第 10 個
    const demoStart = dateOptions.includes("2026-10-15") ? "2026-10-15" : dateOptions[9];

    let defaultClimb = qClimb || "2"; // 當 route=np-2 或 cid=2 時為 2~5天
    if (!qClimb) {
      if (qRoute === "np-3" || qCid === "3") defaultClimb = "3";
      else if (qRoute === "np-4" || qCid === "4") defaultClimb = "4";
      else if (qRoute === "np-2" || qCid === "2") defaultClimb = "2";
    }

    /* 雪霸等非玉山機關：主／次路線取網址 fid／cid，預設帶入示範路線與完整行程（必填欄位預設有值） */
    /* 玉山：玉山線（主路線 1）以外的 9 條主路線比照其他機關依資料處理（Apply14Data.js，2026-10-06） */
    const ysCid = park.key === "yushan" ? (getParam("cid") || qClimb) : null;
    const ysOwner = ysCid ? park.mains.find(m => park.subsOf(m.value).some(x => x.value === ysCid)) : null;
    const ysOther = park.key === "yushan" && ((!!ysOwner && ysOwner.value !== "1") || (!!qMainRoute && qMainRoute !== "1"));
    let other = null;
    if (park.key !== "yushan" || ysOther) {
      const qFid = getParam("fid") || (park.key === "yushan" ? qMainRoute : null), qSub = getParam("cid") || (park.key === "yushan" ? qClimb : null);
      // 開放狀態頁（open.aspx 照抄）的 fId 等於 cId，不是主路線代碼：對不上時改以次路線反查所屬主路線
      const owner = qSub ? park.mains.find(m => park.subsOf(m.value).some(x => x.value === qSub)) : null;
      const main = park.mains.some(m => m.value === qFid) ? qFid : (owner ? owner.value : park.defaultMain);
      const subs = park.subsOf(main);
      const sub = subs.find(x => x.value === qSub) || subs.find(x => x.value === park.defaultSub) || subs[0] || {};
      const demo = park.demoDays[sub.value];
      // 入山證預設：該路線有實走值就用，否則沿用該機關第一筆（必填欄位預設有值）
      const npaAll = park.npaDefaults || {};
      const npaDef = npaAll[sub.value] || npaAll[Object.keys(npaAll)[0]];
      // 沒有實走行程的路線：可選天數有 2 天就預設 2 天（使用者 2026-10-02），否則取最少天數
      const days = demo ? demo.length : ((sub.days || [1]).includes(2) ? 2 : (sub.days || [1])[0]);
      const plan = demo ? demo.map(d => d.slice()) : autoPlan(park.graphs[sub.value] || GENERIC_PLANNER_GRAPH, days);
      const okDates = sub.closedRange ? dateOptions.filter(d => d < sub.closedRange[0] || d > sub.closedRange[1]) : dateOptions;
      other = {
        start: okDates[2] || okDates[0] || "",
        npaDef: npaDef,
        main: main, sub: sub.value || "",
        sumday: String(days),
        planDays: plan || [[]],
        finished: !!plan,
      };
    }

    return {
      park: park,
      // 正式站提示句旁的「目前系統時間為：hh:mm」（三管處與警政署皆有，2026-10-02 補）
      nowTime: new Date().toTimeString().slice(0, 5),
      noteChecked: true,   // 太魯閣「已詳閱以下說明，並同意相關注意事項」（預設帶入勾選）
      // 卡片展開/收合開關狀態
      accordionOpen: {
        route: true,
        planner: true,
        safety: true,
        npa: true
      },
      allAccordionExpanded: true,

      // 1. 基本路線控制項
      teams_name: qTeamsName || "天眼1隊",
      climblinemain: other ? other.main : (qMainRoute || "1"), // 1: 玉山線
      climbline: other ? other.sub : defaultClimb,
      sumday: other ? other.sumday : (qSumday || (defaultClimb === "2" ? "2" : "1")),
      applystart: other ? other.start : (qStart || demoStart),
      dateOptions: dateOptions,

      mainRoutes: other ? park.mains : [
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
      planDays: other ? other.planDays : [
        ["排雲登山服務中心", "塔塔加登山口", "排雲山莊"],
        ["排雲山莊", "玉山主峰", "塔塔加登山口", "排雲登山服務中心"]
      ],
      plannerFinished: other ? other.finished : true,
      textRows: [],   // 文字行程（太魯閣「其他」）：[{ route, room }]，由 buildTextRows 依天數產生
      plannerMsg: "",

      // 3. 行前講習與設備（雪霸講習非必填、正式站預設空白；無 GPS 欄位）
      seminar: other && !park.seminarRequired ? "" : "1", // 1: 網路線上學習, 0: 團體自行辦理講習（玉山必填，其他路線也預帶）
      gps: other && !park.hasGps ? "" : "1",     // 1: 是, 0: 否
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

      NpaPlacesInfo: other && other.npaDef ? other.npaDef.place : "玉山群峰(嘉義縣-阿里山鄉)",
      addedPlaces: other && other.npaDef ? [{ id: 1, optionName: other.npaDef.place, customText: other.npaDef.place }] : [
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

      NpasubPaths: other && other.npaDef ? other.npaDef.subPaths : "TM04",
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

      RouteMap_V: other && other.npaDef ? "" : "上河文化台灣百岳導遊圖 - 玉山群峰縱走",
      NpaPlan: "",

      activeNavIndex: 0,
      mapOpen: false,
      campClosureOpen: false,   // 宿營地部份關閉日期彈窗
      /* 登山安全管理（th-hiking-safety）；必填預帶示意值（2026-10-02 通則），到達時間由 fillSafetyTimes 依規劃結果補 */
      safety: {
        checks: { assess: true, contact: true, change: true, law: true }, selfNote: "", times: {},
        emergencyRoute: "13:00 未到雪山主峰，則往雪山登山口撤退",
        safetyAssessment: "隊員攜帶急救包與保暖衣物；有人受傷時由領隊評估就近撤退並通報留守人",
        lostHours: "4", lastDayHours: "5", stayNote: "",
      },
      mapTabKey: ""
    };
  },

  computed: {
    isYushan() { return this.park.key === "yushan"; },
    /* 玉山線以外的玉山路線（2026-10-06 正式站逐條讀取後改依資料）；generic＝走資料流程（非玉山或玉山其他路線） */
    ysOther() { return this.isYushan && this.climblinemain !== "1"; },
    /* 文字行程（太魯閣主路線「其他」55／661／662，正式站每天一列文字輸入） */
    textPlan() { return !!(this.subObj && this.subObj.textPlan); },
    textCamps() { return (this.subObj && this.subObj.campOptions) || []; },
    generic() { return !this.isYushan || this.ysOther; },
    /* 路線規劃節點圖：玉山固定一張；其他機關依次路線（無資料的次路線為空圖） */
    graph() {
      if (this.isYushan && !this.ysOther) return YUSHAN_PLANNER_GRAPH;
      return this.park.graphs[this.climbline] || GENERIC_PLANNER_GRAPH;
    },
    /* 本頁區塊數（側欄「本頁內容」分母）：無入山證的機關少一塊 */
    sectionCount() { return 2 + (this.safetyOn ? 1 : 0) + (this.npaOn ? 1 : 0); },
    /* 登山安全管理：管理處設定了 ParkApplyData.hikingSafety 才出現（雪霸全部次路線，is_hiking_safety 見該檔） */
    safetyOn() { return !this.textPlan && !!this.park.hikingSafety; },
    safetyDays() { return this.planDays.filter(d => d.length).map((d, i) => ({ date: this.dayDate(i), nodes: d })); },
    secSafetyOk() { return !this.safetyOn || window.thHikingSafetyErrors(this.safety, this.safetyDays).length === 0; },
    subObj() { return this.subRoutes.find(r => r.value === this.climbline) || null; },
    /* 入山證區塊：玉山固定有、雪霸沒有、太魯閣依路線（needsNpa） */
    npaOn() {
      if (!this.park.hasNpa) return false;
      if (!this.park.npaByRoute) return true;
      return !!(this.subObj && this.subObj.needsNpa);
    },
    /* 太魯閣：有路線說明或需入山證的路線才有「已詳閱以下說明」必勾 */
    routeNotes() { return (this.subObj && this.subObj.notes) || []; },
    /* 承載量連結：機關固定（太魯閣）或依次路線（雪霸單日往返路線「單日往返路線承載量及餘額」，2026-10-05） */
    capacityLinkNow() {
      if (this.park.capacityLink) return this.park.capacityLink;
      const href = this.subObj && this.subObj.capacityNews;
      return href ? { href: href, label: "單日往返路線承載量及餘額" } : null;
    },
    hasNoteCheck() { return this.park.key === "taroko" && (this.routeNotes.length > 0 || this.npaOn); },

    openRow() {
      const rows = window.OPEN_STATUS_ROWS || [];
      if (this.generic) return rows.find(r => r.cId === this.climbline) || null;
      let targetName = "2~5天(塔塔加 - 玉山線 - 塔塔加)";
      if (this.climbline === "3") targetName = "玉山前峰單日往返";
      else if (this.climbline === "4") targetName = "玉山線單日往返";
      return rows.find(r => r.subRoute === targetName || (r.subRoute && r.subRoute.includes(this.routeData.displayName))) || null;
    },

    /* 可選入園日：其他機關排除該路線的關閉期間（太魯閣奇萊北屏風山線 2026-10-02 實走只剩 12-01、12-02） */
    shownDates() {
      const r = this.generic && this.subObj && this.subObj.closedRange;
      return r ? this.dateOptions.filter(d => d < r[0] || d > r[1]) : this.dateOptions;
    },

    routeClosures() {
      if (this.generic) {
        // open.aspx 的公告為純文字；關閉日期取自申請頁（次路線資料 closed）
        const list = ((this.openRow && this.openRow.closures) || []).map(c => typeof c === "string" ? { text: c } : c);
        const closed = this.subObj && this.subObj.closed;
        if (closed) {
          if (list.length) list[0] = Object.assign({ dateRange: closed }, list[0]);
          else list.push({ dateRange: closed });
        }
        return list;
      }
      if (this.openRow && Array.isArray(this.openRow.closures)) {
        return this.openRow.closures;
      }
      return [];
    },

    trailLevel() {
      if (this.generic || this.climbline !== "2") {
        const sub = this.subRoutes.find(r => r.value === this.climbline);
        const lv = sub ? sub.level : undefined;
        if (lv === undefined || lv === null) return null;
        return (window.TRAIL_LEVELS || []).find(l => l.level === lv) || null;
      }
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
      /* 雪霸、太魯閣：正式站步驟一難度表的「備註」列只有「歡迎下載」，不帶開放狀態頁的路線備註
         （2026-10-05 逐條讀取雪霸 29 條、太魯閣 19 條次路線皆同） */
      if (this.park.key === "shei-pa" || this.park.key === "taroko") return "";
      /* 玉山：用正式站申請頁難度表的備註（Apply14Data.js remark，2026-10-06 逐條讀取），沒有資料才退回開放狀態頁 */
      if (this.isYushan) {
        const s = Object.values(window.APPLY14_SUBS || {}).flat().find(x => x.id === this.climbline);
        if (s && typeof s.remark === "string") return s.remark;
      }
      return this.openRow ? (this.openRow.note || "") : "";
    },

    routeConditionLinks() {
      if (!this.isYushan) return [];
      return [
        { text: "[登山路線路況]", href: "https://www.ysnp.gov.tw/Trail/7fa5c242-df1a-4a8e-bcab-32dc55b1f7b6?Tab=5" },
        { text: "[園區路況]", href: "https://www.ysnp.gov.tw/Highway/C001300" }
      ];
    },

    /* 地圖按鈕與 modal 標題：玉山照原本（開放狀態表的主路線名＋地圖）；其他機關取主路線名 */
    /* 宿營地部份關閉日期：目前次路線的資料（ParkApplyData.campClosures）；標題照正式站「主路線＋次路線＋宿營地部份關閉日期」 */
    campClosures() { return ((this.park.campClosures || {})[this.climbline]) || []; },
    campClosureTitle() {
      const m = this.mainRoutes.find(r => r.value === this.climblinemain);
      return (m ? m.text : "") + (this.subObj ? this.subObj.text : "") + "宿營地部份關閉日期";
    },
    mapTitle() {
      if (this.isYushan && !this.ysOther) return (this.openRow ? this.openRow.mainRoute : "玉山線") + "地圖";
      const m = this.mainRoutes.find(r => r.value === this.climblinemain);
      return (m ? m.text : "") + "地圖";
    },

    routeMapTabs() {
      if (this.generic) {
        /* 其他機關：次路線地圖（正式站為頁內展開）與主路線地圖（正式站為直連圖檔）同放一個 modal，以頁籤切換 */
        const maps = this.park.maps || {};
        const tabs = [];
        const sub = this.subObj, main = this.mainRoutes.find(r => r.value === this.climblinemain);
        const subSrc = (maps.sub || {})[this.climbline], mainSrc = (maps.main || {})[this.climblinemain];
        if (sub && subSrc) tabs.push({ key: "sub", label: sub.text.trim() + "地圖", images: [{ src: subSrc, alt: sub.text.trim(), caption: sub.text.trim() + "地圖" }] });
        if (main && mainSrc) tabs.push({ key: "main", label: main.text + "地圖", images: [{ src: mainSrc, alt: main.text, caption: main.text + "地圖" }] });
        return tabs;
      }
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
      if (!this.isYushan) return (this.park.npaPlaces || []).map(p => ({ value: p, text: p }));
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

    /* 玉山單日往返為固定行程；其他機關的單日路線也由使用者逐點規劃（雪霸 2026-10-01 實走） */
    isSingleDay() {
      return this.isYushan && (this.climbline === "3" || this.climbline === "4");
    },

    subRoutes() {
      if (this.generic) return this.park.subsOf(this.climblinemain);
      /* 玉山線：難度依正式站（2026-10-06 逐條讀取：前峰、單日往返第 3 級，2~5 天第 4 級） */
      return [
        { value: "3", text: "玉山前峰單日往返", days: [1], level: 3 },
        { value: "4", text: "玉山線單日往返", days: [1], level: 3 },
        { value: "2", text: "2~5天(塔塔加 - 玉山線 - 塔塔加)", days: [2, 3, 4, 5], level: 4 }
      ];
    },

    sumdayOptions() {
      if (this.generic) {
        const sub = this.subRoutes.find(r => r.value === this.climbline);
        return ((sub && sub.days) || [1]).map(n => ({ value: String(n), text: `共${n}天` }));
      }
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
      return this.park.crumb;
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
      return this.planDays[this.dayIndex] || [];
    },
    // 目前所在節點；第 1 天還沒選起點時為空字串
    here() {
      return this.today[this.today.length - 1] || "";
    },
    isLastDay() {
      return this.dayIndex === Number(this.sumday) - 1;
    },
    options() {
      const here = this.here;
      // 正式站第一步是「請選擇起點：」，只給起點一個選項，由使用者自己點（玉山、雪霸實走皆同）
      // 起點有多個時全部列出（太魯閣奇萊北屏風山線：奇萊登山口、屏風山登山口）
      if (!here) return this.graph.starts && this.graph.starts.length ? this.graph.starts.slice() : (this.graph.start ? [this.graph.start] : []);
      const out = [];
      this.graph.edges.forEach(e => {
        if (e[0] === here) out.push(e[1]);
        else if (e[1] === here) out.push(e[0]);
      });
      // 去重並保持乾淨節點清單
      return [...new Set(out)];
    },

    secRouteOk() {
      const team = !this.park.hasTeamName || !!this.teams_name.trim();
      const note = !this.hasNoteCheck || this.noteChecked;
      return team && note && !!this.climblinemain && !!this.climbline && !!this.sumday && !!this.applystart;
    },
    secPlannerOk() {
      const plannerDone = this.isSingleDay || this.plannerFinished;
      const equipDone = (!this.park.seminarRequired || !!this.seminar) && (!this.park.hasGps || !!this.gps);
      return plannerDone && equipDone;
    },
    secNpaOk() {
      if (!this.npaOn) return true;
      return !!this.NpaReasons && this.addedPlaces.length > 0 && !!this.NpaPlan.trim();
    },

    completedSectionsCount() {
      let count = 0;
      if (this.secRouteOk) count++;
      if (this.secPlannerOk) count++;
      if (this.safetyOn && this.secSafetyOk) count++;
      if (this.npaOn && this.secNpaOk) count++;
      return count;
    },

    canSubmit() {
      return this.secRouteOk && this.secPlannerOk && this.secSafetyOk && this.secNpaOk;
    }
  },

  watch: {
    /* 登山安全管理：規劃結果或路線變動時補上到達時間的預帶值 */
    planDays: { deep: true, handler() { this.fillSafetyTimes(); } },
    safetyOn: { immediate: true, handler() { this.fillSafetyTimes(); } },
    climbline: {
      immediate: true,
      handler(val, old) {
        if (this.generic) {
          // 初始化時保留 data() 帶入的示範行程；之後換次路線才重設天數與規劃
          if (old === undefined) { if (this.textPlan) this.buildTextRows(); this.updateRouteMap(); this.syncPlanText(); return; }
          const opts = this.sumdayOptions;
          const demo = this.park.demoDays[val];
          this.sumday = demo ? String(demo.length) : (opts.some(o => o.value === "2") ? "2" : (opts.length ? opts[0].value : "1"));
          const plan = demo ? demo.map(d => d.slice()) : autoPlan(this.graph, this.sumday);
          this.planDays = plan || [[]];
          this.plannerFinished = !!plan;
          if (this.textPlan) this.buildTextRows();
          this.syncPlanText();
          if (!this.shownDates.includes(this.applystart)) this.applystart = this.shownDates[2] || this.shownDates[0] || "";
          return;
        }
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

    textRows: {
      deep: true,
      handler() { this.syncTextPlan(); }
    },

    climblinemain() {
      /* 玉山：切回玉山線時回到 2~5 天（頁內固定行程）；其他主路線取第一條次路線 */
      if (this.isYushan && !this.ysOther) { if (this.climbline !== "2") this.climbline = "2"; return; }
      const first = this.subRoutes[0];
      this.climbline = first ? first.value : "";
    },

    sumday(val, old) {
      if (this.textPlan) { this.buildTextRows(); return; }
      // 其他機關：換次路線時天數會跟著重設，規劃由 climbline 處理，這裡不再清掉
      if (this.generic && this.planDays.length === Number(val) && this.plannerFinished) return;
      // 其他機關：換天數時依新天數重排一份合法行程，不清空（必填欄位預設有值）
      if (this.generic) {
        const demo = this.park.demoDays[this.climbline];
        const plan = demo && demo.length === Number(val) ? demo.map(d => d.slice()) : autoPlan(this.graph, val);
        this.plannerMsg = "";
        this.planDays = plan || [[]];
        this.plannerFinished = !!plan;
        this.syncPlanText();
        return;
      }
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
    /* 說明段落：太魯閣是字串，雪霸是「文字或 {text, href} 連結」組成的陣列（Apply13Data.js） */
    noteParts(n) { return Array.isArray(n) ? n : [n]; },
    /* 文字行程：依天數產生各列，預帶示範值（ParkApplyData textDemo；必填欄位預設有值） */
    buildTextRows() {
      const n = Number(this.sumday) || 1;
      const demo = (this.park.textDemo || {})[this.climbline] || { go: "", back: "", single: "", stay: "", camp: "" };
      const camp = this.textCamps.length ? demo.camp : "";
      this.textRows = n === 1 ? [{ route: demo.single, room: "" }]
        : Array.from({ length: n }, (_, i) => i === 0 ? { route: demo.go, room: camp }
          : i === n - 1 ? { route: demo.back, room: "" } : { route: demo.stay, room: camp });
      // 初始化時 textRows 的 watcher 可能還沒掛上（建立在 climbline 的 immediate watcher 裡），直接同步一次
      this.syncTextPlan();
    },
    /* 文字行程 → planDays（[路線, 宿營地]）與完成狀態；送出資料與人員資料頁的宿營地表都讀 planDays */
    syncTextPlan() {
      if (!this.textPlan) return;
      const rows = this.textRows;
      this.planDays = rows.map(r => r.room ? [r.route, r.room] : [r.route]);
      const camps = this.textCamps.length;
      this.plannerFinished = rows.length > 0 && rows.every((r, i) => r.route.trim() && (!camps || i === rows.length - 1 || r.room));
      this.syncPlanText();
    },
    dayDate(i) { return this.applystart && window.thAddDaysToDateValue ? window.thAddDaysToDateValue(this.applystart, i) : ""; },
    /* 登山安全管理的到達時間預帶示意值：每天 05:00 起每個節點加 2 小時（最晚 23:00），已填的不動 */
    fillSafetyTimes() {
      if (!this.safetyOn) return;
      const t = Object.assign({}, this.safety.times);
      this.safetyDays.forEach((d, di) => d.nodes.forEach((n, ni) => {
        const k = di + "-" + ni;
        if (!t[k]) t[k] = String(Math.min(5 + ni * 2, 23)).padStart(2, "0") + ":00";
      }));
      this.safety = Object.assign({}, this.safety, { times: t });
    },
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
      if (node === "排雲登山服務中心" || this.graph.exits.includes(node)) return "green";
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
      // 第 1 天的起點也可以退掉，回到「請選擇起點」；第 2 天起的首點是前一晚宿營地，不可單獨移除
      if (dayIdx > 0 && dayNodes.length <= 1) return false;
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
      // 第 1 天可退到空白（重新選起點）；第 2 天起至少保留前一晚宿營地
      const keep = this.dayIndex === 0 ? 0 : 1;
      if (copy[this.dayIndex].length > keep) {
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
      // 從空白開始，第一步由使用者點選起點（對應正式站「請選擇起點：」）
      this.planDays = [[]];
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
          window.thAlert("最後一天行程的點必須為登山口");
        }
        this.plannerMsg = "";
        this.plannerFinished = true;
        this.syncPlanText();
        return;
      }
      if (!this.isCamp(this.here)) {
        this.plannerMsg = "只有宿營地才能完成今日路線";
        window.thAlert("只有宿營地才能完成今日路線");
        return;
      }
      this.plannerMsg = "";
      const copy = this.planDays.map(d => [...d]);
      copy.push([this.here]);
      this.planDays = copy;
      this.syncPlanText();
    },

    syncPlanText() {
      if (this.isSingleDay || !this.npaOn) return;
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

    // 卡片手風琴展開/收合開關
    toggleSection(secKey) {
      this.accordionOpen[secKey] = !this.accordionOpen[secKey];
      const { route, planner, npa } = this.accordionOpen;
      this.allAccordionExpanded = route && planner && npa;
    },

    toggleAllSections() {
      this.allAccordionExpanded = !this.allAccordionExpanded;
      this.accordionOpen.route = this.allAccordionExpanded;
      this.accordionOpen.planner = this.allAccordionExpanded;
      this.accordionOpen.npa = this.allAccordionExpanded;
    },

    goPrev() {
      const q = new URLSearchParams(window.location.search);
      window.location.href = `apply-2.html?${q.toString()}`;
    },

    goNext() {
      if (!this.canSubmit) return;

      // 取得路線名稱
      const mObj = this.mainRoutes.find(r => r.value === this.climblinemain);
      const sObj = this.subRoutes.find(r => r.value === this.climbline);
      const mainRouteName = mObj ? mObj.text : (this.isYushan ? "玉山線" : "");
      const subRouteName = sObj ? sObj.text : (this.isSingleDay ? "玉山前峰單日往返" : "2~5天(塔塔加 - 玉山線 - 塔塔加)");

      // 取得逐日行程節點
      let planDaysData = [];
      if (this.isSingleDay) {
        if (this.climbline === "3") {
          planDaysData = [["排雲登山服務中心", "塔塔加登山口", "孟祿亭", "玉山前峰", "塔塔加登山口", "排雲登山服務中心"]];
        } else {
          planDaysData = [["排雲登山服務中心", "塔塔加登山口", "排雲山莊", "玉山主峰", "排雲山莊", "塔塔加登山口", "排雲登山服務中心"]];
        }
      } else {
        planDaysData = this.planDays && this.planDays.length > 0 ? this.planDays : [
          ["排雲登山服務中心", "塔塔加登山口", "排雲山莊"],
          ["排雲山莊", "玉山主峰", "塔塔加登山口", "排雲登山服務中心"]
        ];
      }

      // 入山證事由文字
      const rObj = this.npaReasonsOptions.find(o => o.value === this.NpaReasons);
      const npaReasonText = rObj ? rObj.text : "登山健行";
      const npaPlacesText = this.addedPlaces.length > 0
        ? this.addedPlaces.map(p => p.customText || p.optionName).join("、")
        : (this.NpaPlacesInfo || "玉山群峰(嘉義縣-阿里山鄉)");

      const step3Payload = {
        park: this.park.key,
        npaOn: this.npaOn,
        applystart: this.applystart,
        sumday: this.sumday,
        teams_name: this.teams_name,
        climblinemain: this.climblinemain,
        climbline: this.climbline,
        mainRouteName: mainRouteName,
        subRouteName: subRouteName,
        isSingleDay: this.isSingleDay,
        textPlan: this.textPlan,
        planDays: planDaysData,
        seminar: this.seminar === "1" ? "網路線上學習" : "團體自行辦理講習",
        equipment: {
          gps: this.gps === "1" ? "有" : "無",
          satellitephone: this.satellitephone ? this.satellitephone : "無",
          frequency: this.frequency ? this.frequency : "無",
          note_user: this.note_user ? this.note_user : "無"
        },
        npa: {
          reason: npaReasonText,
          places: npaPlacesText,
          routeMap: this.RouteMap_V || "上河文化台灣百岳導遊圖",
          plan: this.NpaPlan || (this.isSingleDay ? "單日往返固定行程。" : planDaysData.map((d, i) => `D${i + 1}:${d.join("→")}。`).join("\n"))
        }
      };

      try {
        sessionStorage.setItem("th_apply_step3_payload", JSON.stringify(step3Payload));
      } catch (e) {
        console.error("儲存步驟三資料至 sessionStorage 失敗", e);
      }

      const q = new URLSearchParams(window.location.search);
      if (this.applystart) q.set("applystart", this.applystart);
      if (this.sumday) q.set("sumday", this.sumday);
      if (this.teams_name) q.set("teams_name", this.teams_name);
      if (this.climblinemain) q.set("climblinemain", this.climblinemain);
      if (this.climbline) q.set("climbline", this.climbline);
      window.location.href = `apply-4.html?${q.toString()}`;
    }
  }
});
