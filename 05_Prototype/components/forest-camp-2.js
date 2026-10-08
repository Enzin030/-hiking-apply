/* ============================================================
   forest-camp-2.js — 山屋住宿申請 步驟 2：行程規劃（正式站稱行程計畫）
   原 ForestCamp2.jsx（356 行）。版面已搬回 forest-camp-2.html。
   ============================================================

   ------------------------------------------------------------
   狀態形狀對照（本頁最容易出現語意落差的地方）
   ------------------------------------------------------------
   **alloc：夜次 × 設施的二維數量矩陣**

     形狀   { [夜次索引]: { [設施 id]: 數量 } }
     實例   { "0": { "hut": 2, "camp": 0 },
              "1": { "hut": 2, "camp": 1 } }

     - 夜次索引是 **0-based 整數**，但物件鍵一律是字串（JS 的物件鍵強制轉字串）。
       畫面上的「第 N 晚」是 index + 1，寫進 alloc 的是 index。
     - 設施 id 來自 cabin.facilities[].id（"hut"／"camp"），不是索引。
       檜谷山莊只有 hut 一種，所以內層物件的鍵數會隨山屋不同。
     - **初始化時就把所有夜次 × 所有設施的鍵補成 0**，不留稀疏洞。
       原 React 用 useMemo 產生 initAlloc 再交給 useState；
       useState 只在首次 render 取用初值，之後 initAlloc 就算重算也不會回寫。
       nights／cabin 都只從網址讀一次、頁面生命週期內不變，所以行為等價。
       Vue 這裡在 data() 裡呼叫同一個函式產生初值，同樣只做一次。
     - **Vue 3 的巢狀賦值是響應式的**（Vue 2 才需要 $set）。原 React 的 setQty
       用展開運算子造新物件，Vue 直接 `this.alloc[night][id] = qty`。
       之所以安全，是因為上一條：鍵在初始化時已經存在，不是新增鍵。

   **衍生值全部是 computed／method，不另存狀態**

     | 值            | 來源                                        | 型別 |
     |---------------|---------------------------------------------|------|
     | qtyOf(i, id)  | alloc[i]?.[id] \|\| 0                        | number |
     | nightTotal(i) | 該夜所有設施數量相加                          | number |
     | nightCost(i)  | 該夜 Σ 數量 × pricePerNight                  | number |
     | subtotals     | 每個設施 { ...f, total: Σ 各夜數量 × 單價 }   | array |
     | grandTotal    | Σ subtotals[].total                          | number |
     | nightsValid   | 每一夜的 nightTotal ≥ 1                      | boolean |
     | canNext       | 隊名 trim 長度 ≥ 2 且 payment 非空 且 nightsValid | boolean |

     **「每晚至少 1 項」的判準是「該夜所有設施數量相加 ≥ 1」**，
     不是「每個設施都要 ≥ 1」——畫面上的說明文字寫「各設施每晚至少填入 1 個
     單位」與程式碼不一致，這是原碼既有的文案落差，照搬未改。

   **0 的處理（避免 falsy 陷阱）**

     數量 0 是合法值也是「未填」，兩者同義，所以 `|| 0` 是安全的。
     但判斷一律用 `> 0` 而非真假值，與原碼一致：
     nightTotal(i) > 0（是否已填寫徽章）、f.total > 0（小計顯示破折號）、
     grandTotal > 0（每晚明細是否出現）。

   **轉頁：URLSearchParams 帶 alloc JSON**

     handleNext 組 apply-3.html?route&start&nights&headcount&team&payment&alloc&total
     其中 alloc 是 `JSON.stringify(alloc)`。**Vue 的 reactive proxy 不影響
     JSON.stringify 的輸出**（proxy 會轉發列舉與取值），鍵序仍是插入序 0,1,2…，
     與 React 版逐字相同——已實測比對轉頁後的完整網址。
     total 帶的是數字 grandTotal，不是 toLocaleString() 後的字串。

   ------------------------------------------------------------
   useState / useMemo → Vue 的逐一對應（不批次轉）
   ------------------------------------------------------------
   | 原 React                     | Vue                | 備註 |
   |------------------------------|--------------------|------|
   | useState("")   teamName      | data.teamName      | trim 後長度 ≥ 2 才算填妥 |
   | useState("")   payment       | data.payment       | "" 代表未選 |
   | useState(initAlloc) alloc    | data.alloc         | 二維矩陣，見上 |
   | useMemo initAlloc            | makeInitAlloc()    | 只在 data() 呼叫一次 |
   | useMemo subtotals            | computed.subtotals | |
   | useMemo nightsValid          | computed.nightsValid | |
   | grandTotal（render 時算）     | computed.grandTotal | |
   | canNext（render 時算）        | computed.canNext   | |
   | 區域元件 Stepper2             | options.components 的 p-fc2-stepper | 只有這頁用 |

   ------------------------------------------------------------
   靜態 inline style 已收成 .p-fc2-* class（2026-09-09 裁決）
   ------------------------------------------------------------
   原 JSX 有五處 inline style，值全是固定的，依 §7「禁止 inline style」
   收進 assets/css/pages.css：
     maxWidth:400 → .p-fc2-team-field      color:--danger-fg → .p-fc2-required
     display:none → .p-fc2-payment-radio   color:--fg-4      → .p-fc2-cost-dash
     width:120    → .p-fc2-stepper-input
   **只收靜態的**：forest-camp-1 的可用量長條是依資料算出來的，維持 :style。

   ------------------------------------------------------------
   addDays 照搬，**不可換成 th-date-utils**
   ------------------------------------------------------------
   本頁的 addDays 走 `new Date(dateStr)` ＋ `toISOString().slice(0,10)`，
   是 **UTC 路徑**；th-date-utils 的 thAddDaysToDateValue 是拆 Y/M/D 的
   **本地路徑**。兩者在多數情況下同值，但換掉就是改行為，屬改善不是遷移。
   fmtDate 同理（用 UTC 解析出來的 Date 取本地 getMonth／getDate／getDay）。

   ------------------------------------------------------------
   2026-10-08 日期確認併入行程規劃（使用者裁示）
   ------------------------------------------------------------
   原第 1 步 forest-camp-1 的日期卡（行程天數、出發日期、離開日期）改用共用元件 th-trip-basics，
   與隊名、（天池）停留地點同在「路線與基本資料」卡；其下接原第 1 步的「山屋/營地概況」月表。
   因此**晚數不再只從網址讀一次**：days 進 data()、nights＝days－1 為 computed，
   改天數時 alloc 依晚數增減（保留仍存在的晚上已選數量；新增的晚上沿用前一晚的房型與數量）——
   上面「nights／cabin 都只從網址讀一次」的敘述自此不成立。網址的 start／nights 仍當初值
   （從隊伍資料按上一步回來的 backUrl 會帶）。同意書頁帶 ?new=1 進來＝新的一張申請。
   元件總覽（?showcase=1）也一併在本頁：日期卡與概況表用總覽山屋。

   ------------------------------------------------------------
   複合申請：山屋＋警政署入山證（2026-10-08）
   ------------------------------------------------------------
   ?npa=1（同意書頁轉來，正式站 apply_forest_camp_1?hasNpa=1）或暫存 hasNpa：付款方式之後多一張
   「警政署入山證申請」卡（共用元件 th-npa-permit，同 apply_npa_2）。（原有「①山屋／②入山證」段落標題，同日使用者裁示拿掉）
   入山證是附掛型項目，沿用山屋這段的出發日期與天數（設計稿方案 B：整趟預設），不另選日期。
   入山證預帶示意資料（前往地點、路線圖、計畫書，下一步時檢核同 apply_npa_2），存進暫存 npa／hasNpa；
   第 3～5 步據此顯示警政署委託文字、確認頁入山證區塊。單一山屋申請時完全不出現。
   ============================================================ */

/* 付款方式照正式站 apply_forest_camp_2（2026-09-29 實走）：只有匯款／線上刷卡，畫面註明「訂房後不可更改」。
   原三項（信用卡／ATM 轉帳／郵政劃撥）與說明文字為我方自撰。清單放 th-forest-camp-shared.js（第 6 步也要顯示） */

/* 日期 +N 天（UTC 路徑）與顯示格式、alloc 彙總：2026-10-08 起改用 th-camp-booking.js 的
   thFcAddDaysUTC／thFcFmtNight／thFcAllocTotals（原本寫在本頁的 fc2AddDays／fc2FmtDate 與 computed，算法逐字搬過去） */

/* 逐頁參數：全部從查詢字串讀，與 React 版同一組預設值 */
const FC2_P = new URLSearchParams(window.location.search);
const FC2_ROUTE_ID = FC2_P.get("route") || "jiaming";
/* 元件總覽（見 th-forest-camp-shared.js）：出發日取 7 天後起第一個「當晚平日、隔晚假日」的日子，
   兩晚分別看得到平日／假日費率；第 1 晚已訂、第 2 晚未訂，隊名留空，右欄「尚需完成」也看得到 */
const FC2_SHOWCASE = window.thFcIsShowcase();
function fc2ShowcaseStart() {
  const today = window.thTodayValue();
  for (let n = 7; n < 30; n++) {
    const d0 = window.thAddDaysToDateValue(today, n), d1 = window.thAddDaysToDateValue(today, n + 1);
    if (!window.thIsHolidayApprox(d0) && window.thIsHolidayApprox(d1)) return d0;
  }
  return window.thAddDaysToDateValue(today, 7);
}
const FC2_CABIN = FC2_SHOWCASE ? window.thFcShowcaseCabin()
  : window.TH_CABIN_DATA[FC2_ROUTE_ID] || window.TH_CABIN_DATA["jiaming"];
/* 只取一次：分兩次呼叫會在跨午夜時拿到不同的日期 */
const FC2_TODAY = window.thTodayValue();
/* 可選出發日（原第 1 步）：今日＋5 天起，至約 2 個月後（正式站 apply_forest_camp_1 的 TravelStep01StartDate：
   StartDay＝今日＋5、EndDay＝AddMonths(StartDay−5, 2)；注意事項「一般申請：住宿日前60日至前5日」） */
const FC2_MIN_DATE = window.thAddDaysToDateValue(FC2_TODAY, 5);
const FC2_MAX_DATE = window.thAddDaysToDateValue(FC2_TODAY, 60);
/* 出發日、晚數的初值：網址有就用（從隊伍資料回來），否則照原第 1 步預設——最早可選日、行程天數 3（天池上限 3）。
   直接開本頁時 start 不可為空：addDays("") 產生 Invalid Date、toISOString() 拋 RangeError 會讓整頁白畫面。 */
const FC2_START = FC2_SHOWCASE ? fc2ShowcaseStart() : FC2_P.get("start") || FC2_MIN_DATE;
const FC2_NIGHTS = parseInt(FC2_P.get("nights") || "0", 10) || Math.min(2, FC2_CABIN.maxDays);
/* 第 1 步不再選出發人數（2026-10-07）：headcount 只當示意預帶的每晚數量，人數改在隊伍資料決定 */
const FC2_HEADCOUNT = parseInt(FC2_P.get("headcount") || "4", 10);

/* 複合申請：附掛警政署入山證（見檔頭） */
const FC2_NPA = FC2_P.get("npa") === "1";
/* 入山證示意預帶（必填預帶，使自動前進不被擋）：前往地點名稱取正式站開放狀態頁「警政署入山」的地點原文
   （.scratch/outputs/official_con_line.json；該檔的 value 是開放狀態頁代碼、不是入山證地點代碼，所以代碼為示意 S-*），
   路線圖取上河詞庫中涵蓋該山屋的圖幅，計畫書依山屋天數產生 */
const FC2_NPA_PLACE = {
  jiaming:   { name: "嘉明湖(臺東縣-海端鄉)",   sub: "TM19" },   // 南二段縱走（含向陽、嘉明湖）
  xiangyang: { name: "向陽山(臺東縣-海端鄉)",   sub: "TM19" },
  tianchi:   { name: "能高越嶺(花蓮縣-秀林鄉)", sub: "TM13" },   // 能高越嶺
  guigu:     { name: "檜谷山莊(屏東縣-泰武鄉)", sub: "TM22" },   // 北大武山登峰
};
function fc2NpaDemo(cabin, nights) {
  const m = FC2_NPA_PLACE[FC2_ROUTE_ID] || FC2_NPA_PLACE.jiaming;
  const place = { code: "S-" + FC2_ROUTE_ID, name: m.name, desc: cabin.name + "，" + cabin.location };
  const lines = [];
  for (let i = 0; i <= nights; i++) lines.push("D" + (i + 1) + "：" + (i === 0 ? "登山口→" + cabin.name : i === nights ? cabin.name + "→登山口" : cabin.name + "周邊") + "。");
  return { reason: "登山健行", places: [place], lib: "TM00", sub: m.sub, plan: lines.join("\n") };
}

/* 山屋/營地概況（原第 1 步，2026-10-07 改版）：原型用固定種子模擬每日剩餘數量與申請數，不是隨機——重新整理數字要一樣 */
function fc2Seed(dateStr, fid) { return (dateStr + fid).split("").reduce((a, c) => a + c.charCodeAt(0), 0); }
const FC2_WEEK = ["日", "一", "二", "三", "四", "五", "六"];

/* 二維矩陣的初值：所有夜次 × 所有設施都補 0，不留稀疏洞（理由見檔頭） */
function fc2MakeInitAlloc() {
  const obj = {};
  for (let i = 0; i < FC2_NIGHTS; i++) {
    obj[i] = {};
    FC2_CABIN.facilities.forEach(f => { obj[i][f.id] = 0; });
  }
  return obj;
}

thPage({
  data() {
    window.thFcState.enter();
    /* 從第 3 步按上一步回來時，還原已填的隊名／付款／訂位（同一山屋、同出發日、同晚數才還原） */
    const st = window.thFcState.load();
    const same = st.route === FC2_ROUTE_ID && st.start === FC2_START && Number(st.nights) === FC2_NIGHTS && st.alloc;
    /* 必填欄位預設帶入示意資料（2026-10-02）：隊名、匯款、每晚訂第一種設施（床位＝人數）、天池停留地點 */
    const demoAlloc = fc2MakeInitAlloc();
    const first = FC2_CABIN.facilities[0];
    if (first) Object.keys(demoAlloc).forEach(k => { demoAlloc[k][first.id] = Math.min(FC2_HEADCOUNT, first.max || FC2_HEADCOUNT); });
    const hasNpa = FC2_NPA || !!st.hasNpa;
    const npa = (hasNpa && st.npa) || fc2NpaDemo(FC2_CABIN, FC2_NIGHTS);
    if (FC2_SHOWCASE) {   // 總覽：第 1 晚已訂、其餘未訂；隊名留空
      Object.keys(demoAlloc).forEach(k => { if (k !== "0") FC2_CABIN.facilities.forEach(f => { demoAlloc[k][f.id] = 0; }); });
      return { teamName: "", payment: "remit", alloc: demoAlloc, stayAreas: [FC2_CABIN.stayAreas[1]], inArea: FC2_CABIN.gateAreas[0], outArea: FC2_CABIN.gateAreas[1],
               startDate: FC2_START, days: FC2_NIGHTS + 1, month: FC2_START.slice(0, 7), activeNavIndex: 0,
               hasNpa: hasNpa, npa: npa };
    }
    return {
      teamName: same ? st.team || "" : "天眼1隊",
      payment: same ? st.payment || "" : "remit",
      alloc: same ? st.alloc : demoAlloc,
      /* 天池限定：停留地點（必填多選）、進入／離山地點（選填） */
      stayAreas: same ? st.stayAreas || [] : (FC2_CABIN.stayAreas ? [FC2_CABIN.stayAreas[1]] : []),
      inArea: same ? st.inArea || "" : (FC2_CABIN.gateAreas ? FC2_CABIN.gateAreas[0] : ""),
      outArea: same ? st.outArea || "" : (FC2_CABIN.gateAreas ? FC2_CABIN.gateAreas[1] : ""),
      startDate: FC2_START,
      days: FC2_NIGHTS + 1,   // 行程天數（含下山日）；晚數＝天數－1（computed nights）
      month: FC2_START.slice(0, 7),   // 概況表目前顯示的月份 YYYY-MM
      hasNpa: hasNpa,   // 複合：附掛警政署入山證
      npa: npa,
      activeNavIndex: 0,   // 本頁內容導覽目前項目
    };
  },

  computed: {
    // 唯讀常數，不進 data()
    cabin() { return FC2_CABIN; },
    /* 摘要卡（2026-10-07 改用 th-summary-card）：照片取路線列表同一張（同 apply_03 的 summaryImage），回程日＝出發日＋晚數 */
    summaryImage() {
      const r = (window.ROUTE_DATA || []).find(x => x.id === FC2_ROUTE_ID);
      return (r && r.image) || "assets/route-yushan.png";
    },
    nights() { return this.days - 1; },
    endDate() { return window.thAddDaysToDateValue(this.startDate, this.nights); },
    /* 路線與基本資料（原第 1 步）：行程天數 2 起（含下山日），上限依山屋（天池 3、檜谷 4、嘉明湖／向陽 19） */
    dayOptions() { const out = []; for (let n = this.cabin.minDays + 1; n <= this.cabin.maxDays + 1; n++) out.push(n); return out; },
    dateOptions() {
      const out = [];
      for (let d = FC2_MIN_DATE; d <= FC2_MAX_DATE; d = window.thAddDaysToDateValue(d, 1)) out.push(d);
      return out;
    },
    /* 山屋/營地概況（原第 1 步）：只列可申請的日期（今日＋5～60） */
    monthDates() {
      const [y, m] = this.month.split("-").map(Number);
      const n = new Date(y, m, 0).getDate();
      return Array.from({ length: n }, (_, i) => this.month + "-" + String(i + 1).padStart(2, "0")).filter(d => this.inRange(d));
    },
    monthLabel() { const [y, m] = this.month.split("-"); return y + " 年 " + Number(m) + " 月"; },
    canPrevMonth() { return this.month > FC2_MIN_DATE.slice(0, 7); },
    canNextMonth() { return this.month < FC2_MAX_DATE.slice(0, 7); },
    /* 每晚數量上限（山屋人數上限：檜谷 10、其餘 12） */
    peopleMax() { return this.cabin.peopleMax || 12; },
    /* 本頁內容導覽（2026-10-07）：只列需要填寫的區塊、完成條件同 handleNext 的檢查（費用參考不是填寫項，不列，使用者同日裁示） */
    sideItems() {
      return [
        { key: "basic", sec: "sec-basic", label: "路線與基本資料", ok: !!this.startDate && this.teamName.trim().length >= 2 && this.stayValid },
        { key: "room", sec: "sec-room", label: "山屋及營地申請", ok: this.nightsValid },
        { key: "pay", sec: "sec-pay", label: "付款方式", ok: this.payment !== "" },
      ].concat(this.hasNpa ? [{ key: "npa", sec: "sec-npa", label: "警政署入山證申請", ok: this.npaErrors().length === 0 }] : []);
    },
    completedSectionsCount() { return this.sideItems.filter(it => it.ok).length; },
    /* alloc 彙總（th-camp-booking.js thFcAllocTotals；同 th-camp-rooms 的算法） */
    totals() { return window.thFcAllocTotals(this.cabin, this.alloc, this.startDate, this.nights); },
    /* 交給隊伍資料的預設人數：每晚訂量的最大值（至少 1）；實際人數在隊伍資料增減 */
    headcount() { return this.totals.maxNight; },
    applyCrumb() { return window.TH_APPLY_CRUMB; },
    grandTotal() { return this.totals.grandTotal; },
    nightsValid() { return this.totals.nightsValid; },
    /* 天池「停留地點」必填（正式站未選跳「停留地點未選擇」，2026-09-30）；其他山屋沒有此欄 */
    stayValid() { return !this.cabin.stayAreas || this.stayAreas.length > 0; },
    canNext() {
      return this.teamName.trim().length >= 2 && this.payment !== "" && this.nightsValid && this.stayValid;
    },
  },

  watch: {
    /* 改出發日時概況表切到該月（原第 1 步「選完即查詢」） */
    startDate(v) { if (v) this.month = v.slice(0, 7); },
    /* 改天數時 alloc 依晚數增減：保留仍存在的晚上；新增的晚上沿用前一晚（沒有前一晚則照示意預帶第一種設施） */
    nights(n) {
      const first = this.cabin.facilities[0];
      for (let i = 0; i < n; i++) {
        if (this.alloc[i]) continue;
        const row = {};
        this.cabin.facilities.forEach(f => { row[f.id] = 0; });
        const prev = this.alloc[i - 1];
        if (prev) Object.assign(row, prev);
        else if (first) row[first.id] = Math.min(FC2_HEADCOUNT, first.max || FC2_HEADCOUNT);
        this.alloc[i] = row;
      }
      Object.keys(this.alloc).forEach(k => { if (Number(k) >= n) delete this.alloc[k]; });
    },
  },

  methods: {
    /* 山屋/營地概況（原第 1 步） */
    shiftMonth(d) {
      const [y, m] = this.month.split("-").map(Number);
      const t = new Date(y, m - 1 + d, 1);
      this.month = t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0");
    },
    fmtDay(d) { return d.slice(5).replace("-", "/") + "（" + FC2_WEEK[new Date(d + "T00:00:00").getDay()] + "）"; },
    inRange(d) { return d >= FC2_MIN_DATE && d <= FC2_MAX_DATE; },
    /* 選中區間：出發日～離開日（共「行程天數」天，使用者 2026-10-07） */
    inTrip(d) { return !!this.startDate && d >= this.startDate && d <= this.endDate; },
    remain(f, d) { return Math.max(0, f.max - (fc2Seed(d, f.id) % (f.max + 1))); },
    applied(f, d) { return fc2Seed(d + "a", f.id) % (f.max * 2 + 1); },

    /* 附掛入山證的檢核（同 apply_npa_2 check()） */
    npaErrors() {
      const e = [];
      const n = this.npa;
      if (!n.places.length) e.push("請至少加入一個前往地點");
      if (n.places.some(p => !p.desc)) e.push("前往地點描述未填寫");
      const lib = (window.TH_NPA_LIBS || []).find(l => l.id === n.lib);
      if (!n.lib || (!n.sub && (!lib || lib.subs.length))) e.push("請選擇登山路線圖");
      if (!n.plan) e.push("請填寫登山計畫書");
      return e;
    },
    /* 本頁內容導覽：捲到區塊（欄位則捲到所在 .th-field），同 apply_03 */
    scrollToSection(id, i) {
      this.activeNavIndex = i;
      const el = document.getElementById(id);
      if (el) (el.closest(".th-field") || el).scrollIntoView({ behavior: "smooth", block: "start" });
    },
    /* 2026-09-30：原導向玉山流程的 apply-3.html（行程規劃，非本流程）。改為六步驟家族共用的
       第 3 步 apply_03.html；訂位內容與類別（kind＝camp）存進 thFcState，不再帶長網址 */
    handleNext() {
      /* 未完成項目改在按下一步時提示（原右欄「尚需完成」，2026-10-07 單欄化） */
      const e = [];
      if (this.teamName.trim().length < 2) e.push("請填寫隊伍名稱（2–40 字）");
      if (!this.stayValid) e.push("停留地點未選擇");
      if (!this.nightsValid) e.push("每晚至少選 1 個床位或營位");
      if (this.payment === "") e.push("請選擇付款方式");
      if (this.hasNpa) e.push(...this.npaErrors());
      if (e.length) { window.thAlertList(e); return; }
      const back = new URLSearchParams({ route: FC2_ROUTE_ID, start: this.startDate, nights: this.nights, headcount: this.headcount });
      if (this.hasNpa) back.set("npa", "1");
      window.thFcState.save({
        kind: "camp",
        title: "山屋住宿申請",
        crumb: this.cabin.name,
        backUrl: "forest-camp-2.html?" + back,
        plan: { unit: "國家步道(山屋/營地)", main: this.cabin.name, route: this.cabin.name },
        days: this.nights + 1,
        route: FC2_ROUTE_ID,
        start: this.startDate,
        nights: this.nights,
        headcount: this.headcount,
        team: this.teamName.trim(),
        payment: this.payment,
        alloc: JSON.parse(JSON.stringify(this.alloc)),
        total: this.grandTotal,
        stayAreas: this.stayAreas.slice(), inArea: this.inArea, outArea: this.outArea,
        /* 複合：附掛入山證（單一山屋時清掉，避免殘留） */
        hasNpa: this.hasNpa, npa: this.hasNpa ? JSON.parse(JSON.stringify(this.npa)) : undefined,
      });
      window.location.href = "apply_03.html";
    },

    /* 上一步回第一步「閱讀同意書」（2026-10-08 同意聲明移到第一步、日期確認併入本頁） */
    goBack() {
      const q = new URLSearchParams({ kind: "camp", route: FC2_ROUTE_ID });
      if (this.hasNpa) q.set("npa", "1");
      window.location.href = "apply-2.html?" + q;
    },
  },
});
