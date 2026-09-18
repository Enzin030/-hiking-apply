/* ============================================================
   apply4-pay.js — 列印繳費說明單/線上繳費（玉山國家公園）（舊站 apply_4.aspx）
   ------------------------------------------------------------
   對應頁面 `apply_4.html`。版面在該檔的 in-DOM template，本檔只放資料與行為。

   ------------------------------------------------------------
   查詢欄位與舊站的對應（2026-09-16 curl 實抓原始 HTML）
   ------------------------------------------------------------
   | 舊站控制項              | 本頁 data | 備註 |
   |-------------------------|-----------|------|
   | ctl00$con$serial        | serial    | (一站式/入園)申請編號 |
   | ctl00$con$teams_name    | teamName  | 隊伍名稱 |
   | ctl00$con$vcode         | vcode     | 驗證碼，走 th-captcha |

   **第二個查詢鍵是隊名不是身分證號**，與 apply_2／apply_3 不同：繳費對整案不對個人。

   ------------------------------------------------------------
   為什麼沒有山屋選擇器
   ------------------------------------------------------------
   applySearch 的「國家公園線上繳費」卡片寫著排雲山莊與觀高山屋兩處，看起來該有選擇器，
   但正式站 apply_4.aspx 的查詢頁**沒有**任何山屋欄位；VIEWSTATE 內註冊了
   `ctl00$con$lisCamp`，表示宿營地清單是查詢通過後才出現的。
   另有 apply_4t.aspx（標題 (排雲)）與本頁同欄位。兩支頁面與兩處宿營地的對應關係
   查無公開來源，因此雛形不做分流 UI，改在「適用範圍」區塊標 [待確認]。
   ============================================================ */

/* 適用宿營地。取自 applySearch.aspx 該卡片的說明文字（2026-09-16 實抓）。 */
const CAMPS = ["排雲山莊", "觀高山屋"];

/* 繳費基本資料示意（匿名假資料）。欄位取自規格 06b「基本資料展示」段。 */
const DEMO_BASE = [
  {
    serial: "115090300127",
    dateIn: "2026-10-05",
    team: "晨曦登山隊",
    leader: "王小明",
    members: 6,
    payState: "未繳費",
  },
];

/* 費用明細示意。欄位結構與單價取自規格圖 `02_Spec/assets/線上繳費(排雲)-繳費頁.png`：
   中華民國人與外國人**各自一組**（單價／人數／小計），再加單日合計。
   實際畫面上兩組單價同為 480 元，不是只有本國人有價。
   宿營地是這張表的**資料欄**，不是使用者要選的東西——這也是本頁沒有山屋選擇器的佐證。 */
const DEMO_FEES = [
  {
    date: "2026-10-05",
    camp: "排雲山莊",
    priceLocal: "480", peopleLocal: "5", subLocal: "2,400",
    priceForeign: "480", peopleForeign: "1", subForeign: "480",
    dayTotal: "2,880",
  },
];

/* 總計。示意資料只有一列，仍以常數寫死避免在 template 內算術。 */
const FEE_TOTAL = "2,880";

/* 六種繳費管道。文字與手續費金額取自規格 06b，並與規格圖逐項核對過
   （方式一與方式四各含彰銀代收手續費 10 元、方式五超商 15 元由繳款人自負、
   方式六信用卡交易手續費 39 元；方式二郵政匯票與方式三現金無系統手續費）。 */
const PAY_METHODS = [
  { no: "方式一", name: "金融機構轉帳", fee: "內含彰化銀行專屬匯款帳號代收手續費 10 元" },
  { no: "方式二", name: "郵政匯票", fee: "無系統手續費" },
  { no: "方式三", name: "現金", fee: "無系統手續費" },
  { no: "方式四", name: "臺灣PAY（信用卡或金融卡）", fee: "內含彰化銀行專屬匯款帳號代收手續費 10 元" },
  { no: "方式五", name: "超商繳費", fee: "超商代收手續費 15 元由繳款人自負；須於期限內上傳蓋章繳費單與熱感應紙收據" },
  { no: "方式六", name: "信用卡繳費", fee: "內含信用卡交易手續費 39 元" },
];

/* 查詢通過後的兩個動作。舊站把「線上繳費」與「列印繳費說明單」放在同一頁，
   任務卡要求兩個入口都要有，故並列兩張卡。實際付款流程不實作進雛形。 */
const RESULT_ACTIONS = [
  {
    id: "pay",
    title: "線上繳費",
    icon: "fa-solid fa-credit-card",
    desc: "選擇繳費管道並完成付款。共六種管道，各自的手續費不同，詳見規格 06b。",
  },
  {
    id: "print",
    title: "列印繳費說明單",
    icon: "fa-solid fa-print",
    desc: "依選定管道出具繳費說明單（現金、郵政匯票、金融機構轉帳三種格式），供臨櫃或匯款時備查。",
  },
];

/* 相關功能。無 href 者由 th-link-list 自動標為待建置，不給 `#` 假路徑。 */
const RELATED_LINKS = [
  { label: "線上申請退費（玉山國家公園）", href: "apply_5.html", kind: "internal" },
  { label: "玉山可申請退費日期查詢（舊站 bed_9.aspx）" },
  { label: "超商繳款單列印（舊站 apply_4_store.aspx）" },
];

thPage({
  data() {
    return {
      serial: "",
      teamName: "",
      vcode: "",
      submitted: false,

      navItems: [
        { id: "scope", label: "適用範圍" },
        { id: "query", label: "查詢繳費資料" },
        { id: "links", label: "相關功能" },
      ],

      baseColumns: [
        { key: "serial", label: "登山申請編號" },
        { key: "dateIn", label: "入園日期" },
        { key: "team", label: "隊伍名稱" },
        { key: "leader", label: "領隊" },
        { key: "members", label: "隊伍人數（含領隊）" },
        { key: "payState", label: "繳費狀態" },
      ],

      /* 規格圖的表頭是兩層（中華民國人費用／外國人費用各跨三欄），
         th-data-table 只支援單層表頭，故把群組名寫進各欄 label，不改元件。 */
      feeColumns: [
        { key: "date", label: "住宿日期" },
        { key: "camp", label: "宿營地" },
        { key: "priceLocal", label: "本國人單價（元）" },
        { key: "peopleLocal", label: "本國人人數" },
        { key: "subLocal", label: "本國人小計（元）" },
        { key: "priceForeign", label: "外國人單價（元）" },
        { key: "peopleForeign", label: "外國人人數" },
        { key: "subForeign", label: "外國人小計（元）" },
        { key: "dayTotal", label: "單日合計（元）" },
      ],

      methodColumns: [
        { key: "no", label: "選項" },
        { key: "name", label: "繳費管道" },
        { key: "fee", label: "手續費與注意事項" },
      ],
    };
  },

  computed: {
    camps() { return CAMPS; },
    demoBase() { return DEMO_BASE; },
    demoFees() { return DEMO_FEES; },
    feeTotal() { return FEE_TOTAL; },
    payMethods() { return PAY_METHODS; },
    resultActions() { return RESULT_ACTIONS; },
    relatedLinks() { return RELATED_LINKS; },
    /* window.* 一律在這裡取，不在模組層（載入先後無保證） */
    applyCrumb() { return window.TH_APPLY_CRUMB; },
  },

  methods: {
    reset() {
      this.serial = "";
      this.teamName = "";
      this.vcode = "";
      this.submitted = false;
    },
  },
});
