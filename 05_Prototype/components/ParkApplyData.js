/* ============================================================
   ParkApplyData.js — 三管處申請頁（apply-3／4／5）的機關設定
   ------------------------------------------------------------
   2026-10-02 新增。使用者要求三管處申請頁一律以玉山那組元件為準（不各自發揮），
   所以雪霸、太魯閣直接共用玉山的 apply-3／4／5，機關差異集中在這裡表達，
   取代 09-17「太魯閣開新頁」與 10-01 新增 apply_1_3 的做法（decisions.md 2026-10-02）。

   **版型照玉山，欄位照各機關正式站**（02_Spec/05a～05c）：
     玉山  有 GPS、有警政署入山證、講習必填（預設網路線上學習）、欄位有英文副標
     雪霸  無 GPS、無入山證、講習非必填（預設空白）、無英文副標、有無人機空拍公告
     ※ 路線區塊欄位的英文副標（showEn）只有玉山正式站有；雪霸正式站沒有（2026-10-02 實走確認）；
       太魯閣是否有尚未確認，雛形暫不顯示
           路線規劃第一步同為「請選擇起點」；單日往返也由使用者逐點規劃（玉山單日為固定行程）
     太魯閣 無隊名、無講習、無 GPS；有路線承載量查詢與「已詳閱以下說明」必勾（有說明的路線）；
           入山證依路線（南湖要、奇萊北屏風山線不要）；步驟二有承載量狀況、宿營地下拉與剩餘數量、
           附件區為路線行程規劃計劃書（選填）＋1 人時的獨攀證明說明（02_Spec/05c）

   window.thParkApply(key) 回傳該機關設定；key 空白或未知＝玉山（apply-3 原行為，畫面不變）。
   **只在頁面的 data() 裡呼叫**：雪霸設定要讀 Apply13Data.js 與 RouteData.js，
   兩者是 <body> 底部的資料檔，模組層讀會拿到 undefined（踩坑總表第七類）。
   ============================================================ */

window.thParkApply = function (key) {
  /* 玉山：apply-3 原本寫死的內容，保持原樣 */
  var yushan = {
    key: "yushan",
    crumb: "玉山國家公園",
    showEn: true,
    hasGps: true,
    hasNpa: true,
    seminarRequired: true,
    seminarVideo: "https://www.ysnp.gov.tw/Video/C005200",
    notices: [],
    campLink: { href: "https://hike.taiwan.gov.tw/bed_6.aspx", label: "查看宿營地" },
    hasTeamName: true,
    hasSeminar: true,
    /* 步驟二（apply-4） */
    memberConsent: false,     // 隊員區另有委託同意勾選（雪霸 member_keytype）
    stayTel: false,           // 留守人另有「電話」欄
    attachSection: false,     // 「附件上傳資料」區
    queuePref: true,          // 宿營地表「住宿調查」欄
    soloPdf: "",              // 單人獨攀宣導 PDF
    /* 步驟三（apply-5） */
    confirmPlan: true,        // 確認頁列「行程計畫」（逐日行程、講習與設備）
  };
  if (key === "taroko") return taroko();
  if (key !== "shei-pa") return yushan;

  /* 雪霸：正式站 apply_1_3.aspx（2026-09-24、10-01 實走，02_Spec/05b） */
  var seen = window.APPLY13_SUBS_SEEN || {};
  var routes = (window.ROUTE_DATA || []).filter(function (r) { return r.agency === "shei-pa"; });
  var levelOf = function (name) { var m = /\((\d)級\)/.exec(name || ""); return m ? Number(m[1]) : undefined; };
  var subsOf = function (mainId) {
    if (seen[mainId]) return seen[mainId].map(function (s) {
      var r = routes.find(function (x) { return x.cId === s.id; }) || {};
      return { value: s.id, text: s.name, level: s.level, days: s.days || range(r.days, r.dayMax) };
    });
    return routes
      .filter(function (r) { return r.fId === mainId && (r.originalName || "").indexOf("外籍提前") < 0; })
      .map(function (r) { return { value: r.cId, text: r.originalName, level: levelOf(r.originalName), days: range(r.days, r.dayMax) }; });
  };
  function range(lo, hi) {
    var out = [];
    lo = lo || 1; hi = hi || lo;
    for (var n = lo; n <= hi; n++) out.push(n);
    return out;
  }
  return {
    key: "shei-pa",
    crumb: "雪霸國家公園",
    showEn: false,
    hasGps: false,
    hasNpa: false,
    seminarRequired: false,
    seminarVideo: "",
    /* 正式站步驟一路線區的紅字公告（無人機空拍申請），連結為雪管處申請表單 */
    notices: [{ pre: "凡欲於本園區內運用遙控無人機拍攝影片之自然人、法人、學校或政府機關（構）請於拍攝日前5個工作天(申請日不算，以上班日計算，不含假日)向",
                link: { href: "https://eform.spnp.gov.tw/ap/forms/Dro/index.aspx", text: "內政部國家公園署雪霸國家公園管理處" },
                post: "（以下簡稱本處）提出申請" }],
    campLink: { href: "bed_1.html", label: "查看宿營地" },
    mains: (window.APPLY13_MAINS || []).map(function (m) { return { value: m.id, text: m.name }; }),
    subsOf: subsOf,
    graphs: window.APPLY13_PLANNER || {},
    demoDays: { "99": window.APPLY13_DEMO_DAYS || [],
                "97": [["雪山登山口", "七卡山莊", "雪山東峰", "七卡山莊", "雪山登山口"]],
                /* 2026-10-02 正式站與使用者同行實走（prod-SHP098） */
                "98": [["雪山登山口", "雪山東峰", "七卡山莊"], ["七卡山莊", "雪山東峰", "雪山登山口"]] },
    /* 路線地圖（2026-10-02 正式站：主路線「雪山主峰線地圖」為直連圖檔、次路線地圖為頁內展開），
       圖檔下載自正式站；比照玉山「玉山線地圖」按鈕＋modal，兩張以頁籤切換 */
    maps: { main: { "4": "images/sp_雪山主峰線.jpg" }, sub: { "98": "images/sp_七卡雪山東峰.jpg" } },
    /* 步驟一提示（02_Spec/05b 步驟一；2026-10-02 正式站實走確認） */
    ecoNote: true,
    daysHint: "如無適合之天數，請選擇其他路線進行申請",
    noteHint: "若外籍隊員的手機號碼有開啟語音及簡訊國際漫遊功能並在台灣可收到訊號，可於備註欄說明。若無法煩請提供台灣手機號碼，以利第一時間可以掌握登山訊息。",
    defaultMain: "4",
    defaultSub: "99",
    teamsName: "天眼1隊",
    /* 步驟二（正式站 apply_1_3.aspx 步驟二，02_Spec/05b §4） */
    memberConsent: true,
    stayTel: true,
    /* 附件上傳區：正式站本路線顯示「無需上傳資料」；使用者 2026-10-02 裁示無須上傳時整區不出現 */
    attachSection: false,
    queuePref: false,
    /* 宿營地點為下拉（正式站 con_lisText_rooms_N，2026-10-02 實走：選項只有當晚宿營地） */
    queueSelect: true,
    queueExtra: [],
    queueLink: { href: "bed_1.html", label: "雪霸宿營地" },
    soloPdf: "https://hike.taiwan.gov.tw/images/雪霸獨攀登山安全宣導.pdf",
    /* 步驟三：正式站雪霸確認頁不列逐日行程與講習等步驟一欄位（02_Spec/05b §五） */
    confirmPlan: false,
    /* 確認頁隊員表有 E-mail 欄、留守人表沒有國籍（2026-10-02 正式站與使用者同行實走） */
    confirmEmailCol: true,
    confirmStayNation: false,
    hasTeamName: true,
    hasSeminar: true,
    stayTelHint: "※請留臺灣聯絡電話",
    stayMobileHint: "※請留臺灣聯絡電話",
    stayBirthdayRequired: true,
    attachMode: "none",
    soloMode: "callout",
  };

  /* 太魯閣：正式站 apply_1_5.aspx（2026-09-29、10-01 實走，02_Spec/05c）；資料在 Apply15Data.js */
  function taroko() {
    var routes = window.APPLY15_ROUTES || [];
    var notes = window.APPLY15_ROUTE_NOTES || {};
    var remain = window.APPLY15_CAMP_REMAIN || {};
    var all30 = range(1, 30);
    return {
      key: "taroko",
      crumb: "太魯閣國家公園",
      showEn: false,
      hasGps: false,
      hasNpa: true,                 // 依路線：subs[].needsNpa
      npaByRoute: true,
      hasTeamName: false,
      hasSeminar: false,
      seminarRequired: false,
      seminarVideo: "",
      notices: [],
      campLink: { href: "bed_4.html", label: "查看宿營地" },
      capacityLink: { href: "campsite.html?org=taroko&kind=route", label: "路線承載量查詢" },
      ecoNote: true,
      npaSite: "https://nv2.npa.gov.tw/NM107-604Client/nV01A01Q_01_Action.do?mode=query&method=doList",
      mains: routes.map(function (r) { return { value: r.id, text: r.name }; }),
      subsOf: function (mainId) {
        var m = routes.find(function (r) { return r.id === mainId; });
        if (!m) return [];
        /* 正式站次路線尚未取得的主路線：以主路線本身當唯一次路線，讓申請流程可走完 */
        var subs = m.subs.length ? m.subs : [{ id: "m" + m.id, name: m.name }];
        return subs.map(function (x) {
          return { value: x.id, text: x.name, level: x.level, days: x.days || all30, needsNpa: !!x.needsNpa, notes: notes[x.id] || [] };
        });
      },
      graphs: { "667": window.APPLY15_PLANNER || {} },
      /* 南湖大山線示範行程（正式站 2026-09-29 實走） */
      demoDays: { "667": [
        ["思源埡口", "5.1K登山口", "多加屯山登山口", "木杆鞍部", "雲稜山屋"],
        ["雲稜山屋", "審馬陣登山口", "審馬陣山屋"],
        ["審馬陣山屋", "審馬陣登山口", "雲稜山屋", "木杆鞍部", "多加屯山登山口", "5.1K登山口", "思源埡口"],
      ] },
      defaultMain: "16",
      defaultSub: "667",
      /* 入山證預設（正式站 2026-09-29 南湖大山線：頁面載入即帶入） */
      npaDefaults: { "667": { place: "南湖北山(宜蘭縣-大同鄉)", paths: "TM00", subPaths: "M15" } },
      npaPlaces: ["南湖北山(宜蘭縣-大同鄉)"],
      /* 步驟二 */
      memberConsent: true,
      stayTel: true,
      stayTelHint: "格式：(04)123-4567#12345",
      stayBirthdayRequired: false,
      attachSection: true,
      attachMode: "taroko",
      soloMode: "attach",
      soloDoc: "太魯閣國家公園獨攀申請承諾書",
      queuePref: false,
      queueSelect: true,            // 宿營地點下拉：當天終點＋自備搭帳
      queueExtra: ["自備搭帳"],
      queueLink: { href: "bed_4.html", label: "太魯閣山屋" },
      capacity: window.APPLY15_CAPACITY || null,
      capacityRoutes: ["667"],      // 承載量狀況只有南湖大山線實走看過（2026-09-29）
      campNote: function (camp, count) {
        if (camp === "自備搭帳") return "請自備營帳";
        var r = remain[camp];
        if (!r) return "(實際順位以送出後為準)";
        if (r.kind === "tent") {
          var four = Math.floor(count / 4), rest = count % 4, two = 0;
          if (count < 3) { four = 0; two = 1; } else if (rest === 3) { four += 1; } else if (rest) { two = 1; }
          return "本案需求 4人營位數 =" + four + ", 2人營位數 =" + two + ", 剩餘數量 4人營位數 =" + r.remain4 + ", 2人營位數 =" + r.remain2 + ", 實際順位以送出後為準";
        }
        return "剩餘數量：" + r.remain + "，已預約待審：" + r.pending + "，本件需求數量：" + count + "，實際順位以送出後為準";
      },
      soloPdf: "",
      confirmPlan: false,
    };
  }
};
