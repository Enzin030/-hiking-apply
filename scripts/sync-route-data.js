/* ============================================================
   sync-route-data.js — 把正式站路線快照合併進 RouteData.js
   ------------------------------------------------------------
   輸入：01_Raw_Input/raw/正式站路線清單.csv（由 scripts/fetch-live-routes.py 產生）
         05_Prototype/components/RouteData.js（現有內容，作為正式站沒有的欄位的來源）
         01_Raw_Input/raw/關聯申請.csv（新路線的 relatedCIds）
   輸出：05_Prototype/components/RouteData.js（覆寫）

   用法：node scripts/sync-route-data.js

   **清單以正式站為準**：路線的有無、順序、名稱、主路線、機關、難度、c_id／f_id、
   地圖連結、關閉訊息、申請天數範圍一律取快照；正式站沒列出的路線會被移除
   （例外：DEMO_CLOSED 的暫停示範路線）。
   **正式站畫面沒有的欄位**（熱門、縮圖、路線節點、備註、各種 requires*）
   沿用 RouteData.js 既有值；新出現的路線沒有既有值，一律留空（null／""／false），
   不拿別條路線的值補——那些欄位的正式來源見 03_Schema/Fixedclimb（[待確認]）。
   **例外是縮圖**：國家公園新路線若有同機關、同主路線的路線有圖就沿用那張示意圖；
   林保署、警政署依 NON_PARK_IMAGES 指定（山屋取正式站首頁照片，其餘為自繪示意插畫）。

   **可重跑**：第二次起每條路線都能以 id 對到自己，輸出應與輸入相同。
   依 CLAUDE.md R1，重跑後 `git diff` 必須是空的，否則就是本腳本失效。
   ============================================================ */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const LIVE_CSV = path.join(ROOT, "01_Raw_Input/raw/正式站路線清單.csv");
const REL_CSV = path.join(ROOT, "01_Raw_Input/raw/關聯申請.csv");
const SUB_CSV = path.join(ROOT, "01_Raw_Input/raw/次路線.csv");
const OUT = path.join(ROOT, "05_Prototype/components/RouteData.js");

/* 林保署山屋沿用既有的語意 id：forest-camp-1／2 以 ?route=<id> 查 TH_CABIN_DATA */
const CAMP_IDS = { "158": "xiangyang", "159": "jiaming", "160": "guigu", "161": "tianchi" };

/* 正式站換了 c_id 的路線（名稱與主路線相同）：第一次合併時由舊 id 承接欄位。
   第二次起新 id 已存在，這張表不會再被用到。 */
const CARRY_FROM = {
  "np-665": "np-22",   // 奇萊主、北峰線（22 → 665）
  "np-666": "np-23",   // 奇萊連峰（23 → 666；舊 np-666 是雪霸自訂路線，正式站已無）
  "np-667": "np-26",   // 南湖大山線（26 → 667，名稱加註承載量異動）
};

/* 暫停樣式的示範路線（使用者 2026-09-24 要求保留以呈現「暫停申請」樣式）。
   正式站列表不列出它們，但 apply_1.aspx 的 OtherRoute() 寫死了暫停原因，快照以
   listed=0 收錄；這裡只取錐麓古道（21）與清水山（35），21 的外籍提前版（132）不放。 */
const DEMO_CLOSED = ["21", "35"];

/* 非國家公園的縮圖（正式站路線卡本身沒有縮圖）：
   · 山屋三張取自正式站首頁 web_index.aspx 的 images/檜谷山莊.jpg、嘉明湖.jpg、能高越嶺.jpg
     （2026-09-24 擷取，250×150）；天池山莊位於能高越嶺道；向陽山屋在嘉明湖國家步道上，
     共用嘉明湖那張，屬示意。
   · 自然保護區域、警政署入山正式站沒有圖，用雛形自繪的示意插畫，一類共用一張（檔內 <desc> 有註明）。 */
const NON_PARK_IMAGES = {
  guigu: "assets/route-guigu.jpg",
  jiaming: "assets/route-jiaming.jpg",
  xiangyang: "assets/route-jiaming.jpg",
  tianchi: "assets/route-nenggao.jpg",
  "forestry-area": "assets/route-forestry-area.svg",
  police: "assets/route-police.svg",
};

/* 「以分類查詢」按鈕的順序（正式站 2026-09-24）；分組列表的順序另見 apply1.js */
const AGENCY_BUTTON_ORDER = ["taroko", "shei-pa", "yushan", "police", "forestry-area", "forestry-camp"];
const AGENCY_ICONS = {
  taroko: "ph-bold ph-mountains",
  "shei-pa": "ph-bold ph-mountains",
  yushan: "ph-bold ph-mountains",
  police: "fa-solid fa-dove",
  "forestry-area": "ph-bold ph-tree",
  "forestry-camp": "ph-bold ph-house-line",
};
const NATIONAL_PARKS = ["taroko", "shei-pa", "yushan"];

function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", q = false;
  text = text.replace(/^﻿/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const head = rows.shift();
  return rows.filter(r => r.length === head.length).map(r => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}

function loadCurrent() {
  const ctx = {};
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(OUT, "utf8"), ctx);
  return ctx;
}

function routeId(live) {
  if (live.agency === "forestry-camp") return CAMP_IDS[live.c_id] || "camp-" + live.c_id;
  if (live.agency === "forestry-area") return "fa-" + live.c_id;
  if (live.agency === "police") return "police-" + live.c_id;
  return "np-" + live.c_id;
}

/* 既有資料的 agency：拆分前林保署只有一個 forestry（實際都是山屋） */
const oldAgency = r => (r.agency === "forestry" ? "forestry-camp" : r.agency);

function main() {
  const live = parseCsv(fs.readFileSync(LIVE_CSV, "utf8"));
  const related = parseCsv(fs.readFileSync(REL_CSV, "utf8"));
  const subByCid = Object.fromEntries(parseCsv(fs.readFileSync(SUB_CSV, "utf8")).map(r => [r.c_id, r]));
  const cur = loadCurrent();
  const byId = Object.fromEntries(cur.ROUTE_DATA.map(r => [r.id, r]));
  const used = new Set();

  const rows = live.filter(l => l.listed !== "0" || DEMO_CLOSED.includes(l.c_id));
  const routes = rows.map(l => {
    const id = routeId(l);
    let old = byId[id] && oldAgency(byId[id]) === l.agency ? byId[id] : null;
    if (!old && CARRY_FROM[id] && byId[CARRY_FROM[id]]) old = byId[CARRY_FROM[id]];
    if (old) used.add(old.id);

    const isPark = NATIONAL_PARKS.includes(l.agency);
    const demo = l.listed === "0";
    const pick = (k, dflt) => (old && old[k] !== undefined ? old[k] : dflt);
    /* 暫停示範路線正式站列表沒有，名稱／主路線／f_id／級數只能沿用既有值 */
    const liveName = l.name || pick("originalName", "");
    const group = l.main_name || l.name || pick("routeGroup", "");
    /* 天數＝申請天數範圍，來源依序：
       1. 正式站申請第一步的「共N天」下拉（目前只有太魯閣抓得到，見 fetch-live-routes.py）
       2. 次路線.csv 的 sumdaymin／sumdaymax（03_Schema：Fixedclimb「總天數(下限／上限)」，
          是同一個欄位，但資料是測試機快照）——雪霸、玉山、暫停示範路線走這條
       3. 都沒有就留空，不沿用舊值：林保署山屋舊有的「3 天 2 夜」等沒有來源
          （使用者 2026-09-24：沒有就不要硬加）
       daysSource 記錄每條用的是哪個來源。 */
    const sub = subByCid[l.c_id];
    const [days, dayMax, daysSource] = l.sumday_min ? [Number(l.sumday_min), Number(l.sumday_max), "live"]
      : isPark && sub && Number(sub.sumdaymin) ? [Number(sub.sumdaymin), Number(sub.sumdaymax), "test-db"]
      : [null, null, ""];
    /* subroute／peak 在舊資料若只是主路線名的複本，跟著正式站的主路線走，
       否則正式站改名後會留下舊名（例：屏風山線掛著「屏風避難山屋申請」） */
    const fromGroup = k => (old && old[k] && old[k] !== old.routeGroup ? old[k] : group);
    return {
      id,
      name: liveName.replace(/^\(\d級\)\s*/, ""),
      displayName: liveName.replace(/^\(\d級\)\s*/, ""),   // 級數已由縮圖徽章呈現，名稱不重複
      originalName: liveName,                               // 正式站原文
      routeGroup: group,
      /* 路線節點只留國家公園的舊值。林保署山屋舊有的「向陽 → 向陽山屋 → 嘉明湖」、
         「向陽山 3,603m」等正式站沒有、也查不到來源，拿掉（使用者 2026-09-24）；
         subroute／peak 一併改回主路線名，否則卡片會退回顯示 subroute 那串節點。 */
      routePath: isPark ? pick("routePath", "") : "",
      subroute: isPark ? fromGroup("subroute") : group,
      agency: l.agency,
      agencyName: l.org_name,
      peak: isPark ? fromGroup("peak") : group,
      days,
      dayMax,
      daysSource,                                         // live＝正式站申請頁；test-db＝次路線.csv；""＝無
      durationLabel: !days ? "" : dayMax === 1 ? "單日往返"
        : `${days}${dayMax && dayMax !== days ? "-" + dayMax : ""} 天`,   // 沿用原本「1-7 天」的寫法（使用者 2026-09-24）
      diff: l.level ? Number(l.level) : demo ? pick("diff", null) : null,
      status: l.close_msg ? "closed" : "open",
      demo,                                               // true＝正式站列表不列、只為示範暫停樣式而保留
      hot: pick("hot", false),
      /* 國家公園沿用既有示意圖；其餘見 NON_PARK_IMAGES（使用者 2026-09-24 要求補圖）。
         林保署山屋舊資料掛的是國家公園的山景照（天池山莊用奇萊的 route-qilai.png），不沿用。 */
      image: isPark ? pick("image", "") : NON_PARK_IMAGES[id] || NON_PARK_IMAGES[l.agency] || "",
      mapUrl: l.map_url,
      note: pick("note", ""),
      unit: l.agency,
      applyType: pick("applyType", isPark ? "nationalPark" : l.agency === "forestry-camp" ? "forestCamp" : "summary"),
      orgId: l.org_id.toUpperCase(),
      cId: l.c_id,
      fId: l.f_id || pick("fId", ""),
      sourceGuid: l.source_guid,
      campId: pick("campId", ""),
      relatedCIds: pick("relatedCIds", related.filter(x => x.from_c_id === l.c_id).map(x => x.To_c_id)),
      parkForm: pick("parkForm", isPark ? l.agency : ""),
      requiresNpa: pick("requiresNpa", false),
      requiresForestCamp: pick("requiresForestCamp", false),
      requiresAttachment: pick("requiresAttachment", false),
      requiresSafetyAssessment: pick("requiresSafetyAssessment", false),
      suspendReason: l.close_msg,
    };
  });

  /* 暫停示範路線排在同機關最後一條之後（快照裡它們附在全表最末） */
  routes.filter(r => r.demo).forEach(r => {
    routes.splice(routes.indexOf(r), 1);
    let at = -1;
    routes.forEach((x, i) => { if (x.agency === r.agency) at = i; });
    routes.splice(at + 1, 0, r);
  });

  /* 縮圖：正式站不提供。既有縮圖本來就是依主路線共用的示意圖（例如奇萊群都是
     route-qilai.png），所以新路線若有同機關、同主路線的路線有圖，就沿用那張；
     非國家公園已由 NON_PARK_IMAGES 指定，這段實際只補國家公園新路線。 */
  routes.forEach(r => {
    if (r.image) return;
    const sib = routes.find(x => x.image && x.agency === r.agency && x.routeGroup === r.routeGroup);
    if (sib) r.image = sib.image;
  });

  const agencies = [{ id: "all", name: "全部", icon: "ph-bold ph-mountains" }].concat(
    AGENCY_BUTTON_ORDER.map(a => ({
      id: a,
      name: (live.find(l => l.agency === a) || {}).org_name || a,
      icon: AGENCY_ICONS[a],
    }))
  );

  const dropped = cur.ROUTE_DATA.filter(r => !used.has(r.id) && !routes.some(n => n.id === r.id));

  const orgIds = cur.NATIONAL_PARK_ORG_IDS;
  const out = `/* ============================================================
   RouteData.js — 登山線上申請（apply-1）的路線清單
   ------------------------------------------------------------
   **由 scripts/sync-route-data.js 產生，不要手改**；要更新就重跑：
     python scripts/fetch-live-routes.py   # 重抓正式站快照
     node scripts/sync-route-data.js       # 合併進本檔

   來源（依欄位分兩路）：
   · 清單本身（有無、順序、名稱、主路線、機關、難度、c_id／f_id、地圖、關閉訊息）
     ＝**正式站** https://hike.taiwan.gov.tw/apply_1.aspx 以「全部」分類 postback 取得，
     快照存在 01_Raw_Input/raw/正式站路線清單.csv。最近一次擷取：2026-09-24。
   · days／dayMax／durationLabel＝**申請天數範圍**（不是 information_1.aspx 的「建議行程」天數）。
     太魯閣取正式站申請第一步 apply_1_5.aspx 的「共N天」下拉（daysSource: live）；
     雪霸、玉山的申請頁靜態請求進不去，改用 次路線.csv 的 sumdaymin／sumdaymax
     （同一個 DB 欄位，但為測試機資料，daysSource: test-db，[待確認]）。
     林保署、警政署、山屋兩處都沒有，留空不補。
   · demo: true 的路線（錐麓古道、清水山）正式站列表不列，只為示範「暫停申請」樣式保留；
     暫停原因是正式站 apply_1.aspx 的 OtherRoute() 內寫死的原文，其餘欄位沿用舊值。
   · 正式站畫面沒有的其他欄位（hot、image、routePath、note、requires*）沿用本檔改版前的值——那些值源自 01_Raw_Input/raw/主路線.csv、
     次路線.csv、關聯申請.csv（**測試機 DB 快照，已與正式站脫節**：少了 c_id 665／667／675、
     林保署與警政署全部 28 條）。新出現的路線這些欄位一律留空，[待確認]
     （縮圖例外：國家公園同主路線共用示意圖；山屋取正式站首頁照片、
     自然保護區域與警政署為自繪示意插畫，見 sync-route-data.js 的 NON_PARK_IMAGES）；
     依 03_Schema 欄位中文名，正式來源應為 Fixedclimb 的 sumdaymin／sumdaymax（總天數上下限）、
     Trailclassification（步道分級）、IsDraw（單日往返抽籤）、chk（開放1／關閉0／部份關閉2）、
     file01（圖片檔名）與 Fixedclimb_closedate；地圖連結對應哪個 file 欄位 [反推]、未核對。
   · hot（熱門）在 03_Schema 找不到對應欄位，為雛形自訂的示意值，[待確認]。

   本檔是一般 <script>（不經 Babel），以 window.FOO 掛全域。
   ============================================================ */

window.NATIONAL_PARK_ORG_IDS = ${JSON.stringify(orgIds, null, 2)};

window.ROUTE_DATA = ${JSON.stringify(routes, null, 4)};

window.AGENCIES = ${JSON.stringify(agencies, null, 2)};
`;
  fs.writeFileSync(OUT, out);
  console.log(`寫出 ${routes.length} 條 → ${path.relative(ROOT, OUT)}`);
  if (dropped.length) console.log("移除（正式站已無）：" + dropped.map(r => `${r.id} ${r.displayName}`).join("、"));
  const fresh = routes.filter(n => !byId[n.id] && !(CARRY_FROM[n.id] && byId[CARRY_FROM[n.id]]));
  if (fresh.length) console.log(`新增 ${fresh.length} 條（無既有欄位可沿用）：` + fresh.map(r => r.id).join("、"));
}

main();
