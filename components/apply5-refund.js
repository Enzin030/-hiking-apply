/* ============================================================
   apply5-refund.js — 線上申請退費（玉山國家公園）（舊站 apply_5.aspx）
   ------------------------------------------------------------
   對應頁面 `apply_5.html`。版面在該檔的 in-DOM template。

   ------------------------------------------------------------
   驗證欄位與舊站的對應（2026-09-16 curl 實抓原始 HTML）
   ------------------------------------------------------------
   | 舊站控制項              | 本頁 data | 備註 |
   |-------------------------|-----------|------|
   | ctl00$con$aplysid       | sid       | 退費申請人身分證字號（舊站有全形轉半形處理） |
   | ctl00$con$aplymobile    | mobile    | 手機號碼 |
   | ctl00$con$btnCheck      | sendOtp() | 寄送驗證密碼（簡訊 OTP） |
   | ctl00$con$vcode         | otp       | 驗證密碼，type="password" |
   | ctl00$con$btnok         | verified  | 確定 |

   **規格 06c 的內部註記與實際 HTML 不符**：規格寫 `af_sid`／`af_mobile`／
   `af_chkpassword`／`btnSendPwd`／`btnLogin`，實抓是上表那組。以實抓為準。

   ------------------------------------------------------------
   退費原因：規格缺漏，正式站有 14 個選項
   ------------------------------------------------------------
   規格 06c 只列三類籠統敘述。apply_5.aspx 的 VIEWSTATE 解碼後可見完整下拉：
   請選擇／颱風期間／登山步道中斷期間／雪季加強服務措施期間／〔一項部分解碼〕／
   其他天然災害侵襲期間／預定入園日前14天取消入園／特殊狀況-步道結冰／特殊狀況-因公／
   特殊狀況-因病或受傷／特殊狀況-其他／其他(不統計)／特殊狀況-肺炎疫情／特殊狀況-公共安全。
   另有 80 家金融機構清單（BK_ID / NAME）。
   **這兩份清單屬「退款明細維護」與「新增退款帳戶」頁，不在本輪的查詢頁範圍**，
   故未寫進本檔；完整解碼結果見 `.scratch/outputs/applySearch-正式站實抓-20260916.md`。
   ============================================================ */

/* 退費原因四款，逐字取自正式站頁面正文（不是 VIEWSTATE 的下拉選項）。
   第 2、3 款是依申請入園日切分的新舊制，**不可合併**。 */
const REASON_ROWS = [
  { no: "一", reason: "因人力不可抗拒之天然災害或本處公告禁止入園，致無法於預定日期前往住宿者。", apply: "不限入園日" },
  { no: "二", reason: "於預定入園日前 5 天取消入園者。", apply: "申請入園日 114 年 12 月 1 日起" },
  { no: "三", reason: "於預定入園日前 14 天取消入園者。", apply: "申請入園日 114 年 11 月 30 日前" },
  { no: "四", reason: "隊伍或個人特殊狀況者。", apply: "個案認定" },
];

/* 三個外部連結。2026-09-16 逐一實跑：兩支 news_7_1 回 200 text/html，
   PDF 回 200 application/pdf（約 389 KB），皆可用，故不改 TodoLink。
   PDF 網址在正式站是 percent-encoding，沿用原樣不解碼。 */
const REF_LINKS = [
  {
    label: "申請退還「排雲山莊」、「觀高山屋」使用規費相關規定",
    href: "https://hike.taiwan.gov.tw/news_7_1.aspx?ID=1395",
    kind: "external",
  },
  {
    label: "排雲山莊供餐及睡袋租賃等服務（委外經營，退費請逕洽該公司）",
    href: "https://hike.taiwan.gov.tw/news_7_1.aspx?ID=1137",
    kind: "external",
  },
  {
    label: "退費申請流程操作說明（PDF）",
    href: "https://hike.taiwan.gov.tw/images/%e9%80%80%e8%b2%bb%e7%94%b3%e8%ab%8b%e6%b5%81%e7%a8%8b%e6%93%8d%e4%bd%9c%e8%aa%aa%e6%98%8e_2026.pdf",
    kind: "file",
  },
];

/* 驗證通過後的示意資料（匿名假資料）。欄位取自規格 06c「退費申請人資訊」段。 */
const DEMO_PERSON = [
  { sid: "A12****789", name: "王小明", phone: "09**-***-123", date: "2026-09-16" },
];

/* 驗證通過後的兩個動作，取自規格 06c 的控制項按鈕。 */
const RESULT_ACTIONS = [
  {
    id: "new",
    title: "新增退費申請",
    icon: "fa-solid fa-plus",
    desc: "填寫退款帳戶（金融機構、分行、戶名、存簿帳號）並上傳存摺封面影本。",
  },
  {
    id: "detail",
    title: "退款明細維護",
    icon: "fa-solid fa-list-check",
    desc: "選擇退費原因與收據編號，勾選符合退費資格的隊員，確認本次申請退費金額。",
  },
];

thPage({
  data() {
    return {
      sid: "",
      mobile: "",
      otp: "",
      otpSent: false,
      verified: false,

      navItems: [
        { id: "before", label: "申請前必須先完成的事" },
        { id: "rules", label: "退費規定" },
        { id: "verify", label: "驗證身份" },
      ],

      reasonColumns: [
        { key: "no", label: "款次" },
        { key: "reason", label: "退費原因" },
        { key: "apply", label: "適用範圍" },
      ],

      personColumns: [
        { key: "sid", label: "身分證字號" },
        { key: "name", label: "姓名" },
        { key: "phone", label: "聯絡電話" },
        { key: "date", label: "申請日期" },
      ],
    };
  },

  computed: {
    reasonRows() { return REASON_ROWS; },
    refLinks() { return REF_LINKS; },
    demoPerson() { return DEMO_PERSON; },
    resultActions() { return RESULT_ACTIONS; },
    /* window.* 一律在這裡取，不在模組層（載入先後無保證） */
    applyCrumb() { return window.TH_APPLY_CRUMB; },
  },

  methods: {
    /* 雛形不發簡訊，只翻一個旗標讓畫面顯示「已送出」提示。
       不要改成看起來會倒數的樣子——那會讓驗收的人以為 OTP 已接上。 */
    sendOtp() {
      this.otpSent = true;
    },

    reset() {
      this.sid = "";
      this.mobile = "";
      this.otp = "";
      this.otpSent = false;
      this.verified = false;
    },
  },
});
