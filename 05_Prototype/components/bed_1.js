/* ============================================================
   bed_1.js — 雪霸宿營地查詢（對應正式站 bed_1.aspx）
   ------------------------------------------------------------
   資料在 components/Bed1Data.js（正式站快照）。依專案慣例，
   **只在 data() 裡讀 window.BED1_***，不在模組層讀——資料檔是 body 底部的
   一般 script，與本檔沒有保證的先後。

   版面比照 bed_0（2026-09-17 使用者指示），差異見 bed_1.html 檔頭。
   月份列與月曆由共用元件 th-bed-calendar 負責。

   2026-09-18 攤平層級（使用者：「太多層，且東西都藏起來了」）：
   - 格內由二數字改三數字（餘額／待處理／已通過），第三個走 th-bed-calendar 的 sub2Label。
   - 換宿營地**不再重設月份**（原本會跳回快照首月，比較兩地點的同一天要重翻月）。
   - 日期明細由 th-modal 改為月曆下方就地展開，內容一項不減（七項計數＋fs 紅字＋名單連結）。
   零新增：不加衍生欄位、不加新按鈕、不加狀態色。
   ============================================================ */

thPage({
  data() {
    const sites = window.BED1_SITES || [];
    const first = sites.length && sites[0].months.length ? sites[0].months[0] : { y: 2026, m: 1 };
    /* 預設七卡山莊：沿用拆頁前 campsite.html 雪霸宿營地的預設 */
    const def = sites.find((s) => s.name === "七卡山莊") || sites[0];
    return {
      sites,
      labels: window.BED1_LABELS || [],
      /* 頁首說明：**濾掉餘額公式那一條**（2026-09-18 使用者指示）——
         同一條公式已經在當日 modal 的統計卡片下方以「※ 餘額 ＝ …」呈現，
         頁首再出一次是重複。在此過濾而不改 Bed1Data.js，因為那份是正式站
         .alert 的逐字快照，改它會讓來源失真。 */
      notice: (window.BED1_NOTICE || []).filter(
        (li) => !li.some((p) => String(p.t).includes("【餘額】"))
      ),
      siteId: def ? def.id : "",
      /* 當日申請名單彈窗：null＝未開啟 */
      roster: null,
      /* 承載量數據開關（2026-09-18 使用者指示）：關掉只剩宿營地清單，列高更密 */
      showCaps: true,
      /* 表頭搜尋框（2026-09-18 使用者指示，取代原本的「宿營地」欄名） */
      siteQuery: "",
      /* 申請狀態說明的展開狀態（2026-09-18 使用者指示改為按鈕控制，不用 details） */
      showNotes: false,
      /* 彈窗用的申請狀態說明（與 bed_1main 同一份，見 Bed1MainData.js） */
      notes: window.BED1MAIN_NOTES || [],
      year: first.y,
      month: first.m,
      day: null,
    };
  },

  computed: {
    /* 正式站年份下拉是 2026–2030 */
    years() { return [2026, 2027, 2028, 2029, 2030]; },
    site() { return this.sites.find((s) => s.id === this.siteId) || this.sites[0]; },
    /* 表格顯示的宿營地：依搜尋字串過濾。空字串＝全部 34 個。
       只比對名稱，不做模糊比對——宿營地名稱短且固定，過度聰明反而難預期。 */
    shownSites() {
      const q = this.siteQuery.trim();
      if (!q) return this.sites;
      return this.sites.filter((s) => s.name.includes(q));
    },
    monthData() {
      return this.site.months.find((m) => m.y === this.year && m.m === this.month) || null;
    },
    /* 交給 th-bed-calendar：每日 [餘額, 待處理]（數字），無資料為 null。
       2026-09-18 使用者指示月曆格內不顯示「已通過」——它仍在當日面板的七項計數裡，
       只是不佔格內版面（規格 §一 列的是餘額／待處理／已通過三項）。 */
    calDays() {
      const md = this.monthData;
      if (!md) return null;
      const iRemain = this.labels.indexOf("餘額");
      const iWait = this.labels.indexOf("待處理");
      return md.days.map((e) => (e ? [Number(e.v[iRemain]), Number(e.v[iWait])] : null));
    },
    /* 彈窗內的當日申請名單。BED1MAIN 的 key 是 "{node_id}|{yyyy-mm-dd}"。
       覆蓋率僅 7.6%（297／3894），查無資料時 rows 為 null，由樣板顯示空狀態
       並給出正式站連結——不可假裝有資料。 */
    rosterData() {
      if (!this.roster) return null;
      const M = window.BED1MAIN || {};
      const rec = M[this.roster.node + "|" + this.roster.date] || null;
      /* 七項統計：承載量取自本筆名單快照，其餘六項與月曆同源（day.v）——
         與 bed_1main.js 的 stat() 同一套組法，欄位與規格 §二 一致。 */
      const d = this.roster.day;
      const by = (k) => (d ? d.v[this.labels.indexOf(k)] : "");
      /* 統計卡片：與獨立頁 bed_1main 同樣的七項與同樣的呈現（2026-09-18 使用者指示）。
         承載量只在有名單快照時才有值（rec.cap），無快照則以「—」呈現，不猜。
         「外籍提前」不在這七項內——正式站 bed_1main 的統計列就沒有它
         （見 02_Spec/14 §二），它列在下方的申請狀態說明第 7 條。 */
      return {
        stat: [
          { k: "承載量", v: rec ? rec.cap : "" },
          { k: "待處理", v: by("待處理") },
          { k: "補件", v: by("補件") },
          { k: "已通過", v: by("已通過") },
          { k: "待系統排定", v: by("待系統排定") },
          { k: "宿營地不足候補", v: by("宿營地不足候補") },
          { k: "餘額", v: by("餘額") },
        ],
        rows: rec ? rec.rows : null,
        cap: rec ? rec.cap : null,
      };
    },
    /* 外籍提前拆成兩張統計卡（2026-09-18 使用者指示）。
       原始值格式固定為「外國人+本國人」（實測 10 種相異值，除空字串外皆含 +，
       例 9+2）。拆不開時兩格都給「—」，不猜。
       正式站 bed_1main 的統計列沒有這兩項，是 bed_1 月曆側才有的資料（規格 §一）。 */
    foreignStat() {
      const d = this.roster && this.roster.day;
      const raw = d ? d.v[this.labels.indexOf("外籍提前")] : "";
      const parts = String(raw).split("+");
      const ok = parts.length === 2;
      return [
        { k: "外籍提前（外國人）", v: ok ? parts[0] : "" },
        { k: "外籍提前（本國人）", v: ok ? parts[1] : "" },
      ];
    },
  },

  methods: {
    /* 換地點時**保留目前年月**（2026-09-18）：原本會重設回快照首月，
       導致「比較兩個地點的同一天」每次都要重翻月份，是使用者指的「卡」之一。 */
    pickSite(id) {
      this.siteId = id;
      this.day = null;
    },
    /* 正式站狀態字樣 → 既有 .th-flag 修飾 class（與 bed_1main 同一份） */
    statusClass(s) { return (window.BED1MAIN_STATUS || {})[s] || ""; },
    /* 承載量 0 ＝ 該宿營地沒有這一類（山屋無營地位、營地無床位），
       正式站總表該格為空白，故顯示「—」而非 0，避免誤讀成「額滿」。 */
    capText(v) {
      return Number(v) > 0 ? v : "—";
    },
    /* 關閉當日 modal（day 一併清掉，兩者同生命週期） */
    closeRoster() {
      this.roster = null;
      this.day = null;
      this.showNotes = false;
    },
    /* 點日期＝直接開當日 modal（2026-09-18 使用者指示，取代就地攤平卡片）。 */
    pickDay(d) {
      const e = this.monthData && this.monthData.days[d - 1];
      if (!e) return;
      const mm = String(this.month).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      this.day = Object.assign({ date: `${this.year}-${mm}-${dd}` }, e);
      this.roster = { node: this.site.id, date: this.day.s, name: this.site.name, day: this.day };
    },
  },
});
