/* ============================================================
   ParkApplyData.js — 三管處申請頁（apply-3／4／5）的機關設定
   ------------------------------------------------------------
   2026-10-02 新增。使用者要求三管處申請頁一律以玉山那組元件為準（不各自發揮），
   所以雪霸、太魯閣直接共用玉山的 apply-3／4／5，機關差異集中在這裡表達，
   取代 09-17「太魯閣開新頁」與 10-01 新增 apply_1_3 的做法（decisions.md 2026-10-02）。

   **版型照玉山，欄位照各機關正式站**（02_Spec/05a～05c）：
     玉山  有 GPS、有警政署入山證、講習必填（預設網路線上學習）、欄位有英文副標
     雪霸  無 GPS、無入山證、講習非必填（預設空白）、無英文副標、有無人機空拍公告
           路線規劃第一步同為「請選擇起點」；單日往返也由使用者逐點規劃（玉山單日為固定行程）

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
    /* 步驟二（apply-4） */
    memberConsent: false,     // 隊員區另有委託同意勾選（雪霸 member_keytype）
    stayTel: false,           // 留守人另有「電話」欄
    attachSection: false,     // 「附件上傳資料」區
    queuePref: true,          // 宿營地表「住宿調查」欄
    soloPdf: "",              // 單人獨攀宣導 PDF
    /* 步驟三（apply-5） */
    confirmPlan: true,        // 確認頁列「行程計畫」（逐日行程、講習與設備）
  };
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
                "97": [["雪山登山口", "七卡山莊", "雪山東峰", "七卡山莊", "雪山登山口"]] },
    defaultMain: "4",
    defaultSub: "99",
    teamsName: "天眼1隊",
    /* 步驟二（正式站 apply_1_3.aspx 步驟二，02_Spec/05b §4） */
    memberConsent: true,
    stayTel: true,
    attachSection: true,
    queuePref: false,
    queueLink: { href: "bed_1.html", label: "雪霸宿營地" },
    soloPdf: "https://hike.taiwan.gov.tw/images/雪霸獨攀登山安全宣導.pdf",
    /* 步驟三：正式站雪霸確認頁不列逐日行程與講習等步驟一欄位（02_Spec/05b §五） */
    confirmPlan: false,
  };
};
