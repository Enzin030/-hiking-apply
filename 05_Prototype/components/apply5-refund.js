/* ============================================================
   apply5-refund.js — 線上申請退費(排雲)（舊站 apply_5.aspx）
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

/* ------------------------------------------------------------
   2026-10-08 依規格截圖（02_Spec/06c「查詢頁／退費資訊」）改內容：說明逐段、退費原因清單、兩個規定連結回原位；
   驗證身份欄位檢核（訊息照規格 06c §查詢頁：「請填寫申請人身分證字號」「手機號碼格式不符」）；
   驗證後「退費申請人資訊」＋「新增退費申請／回查詢頁」＋退費紀錄表（8 欄，狀態值照規格：審核中、補件中、審核完成、已退款）。
   「新增退費申請」「匯款帳戶維護」「退款明細維護」「影本附件」指向的畫面尚未建置（2026-09-16 只做查詢頁），以待建置標示。
   ------------------------------------------------------------ */

/* 退費原因，逐字取自正式站頁面正文（不是 VIEWSTATE 的下拉選項）。
   第 2、3 款是依申請入園日切分的新舊制，**不可合併**；規格截圖為舊版（只有 14 天）。 */
const REASON_ROWS = [
  { no: "一", reason: "因人力不可抗拒之天然災害或本處公告禁止入園，致無法於預定日期前往住宿者。" },
  { no: "二", reason: "於預定入園日前5天取消入園者。", apply: "申請入園日 114 年 12 月 1 日起" },
  { no: "三", reason: "於預定入園日前14天取消入園者。", apply: "申請入園日 114 年 11 月 30 日前" },
  { no: "四", reason: "隊伍或個人特殊狀況者。" },
];

/* 三個外部連結。2026-09-16 逐一實跑：兩支 news_7_1 回 200 text/html，PDF 回 200 application/pdf，皆可用。
   截圖以網址原文顯示前兩個連結。PDF 網址在正式站是 percent-encoding，沿用原樣不解碼。 */
const REF_LINKS = {
  rule: "https://hike.taiwan.gov.tw/news_7_1.aspx?ID=1395",
  meal: "https://hike.taiwan.gov.tw/news_7_1.aspx?ID=1137",
  pdf: "https://hike.taiwan.gov.tw/images/%e9%80%80%e8%b2%bb%e7%94%b3%e8%ab%8b%e6%b5%81%e7%a8%8b%e6%93%8d%e4%bd%9c%e8%aa%aa%e6%98%8e_2026.pdf",
};

/* 驗證通過後的示意資料（匿名假資料）。欄位取自規格 06c 截圖「退費申請人資訊」 */
const DEMO_PERSON = [
  { sid: "A12****789", name: "王小明", phone: "09**-***-123", date: "2026-09-16" },
];

/* 退費申請紀錄示意（匿名假資料）。欄位照截圖：退費申請時間｜(銀行代碼)金融機構名稱 分行｜戶名 存簿帳號｜存摺封面影本｜
   本次申請退費金額｜實退金額＝所有退費總額－銀行手續費（同意貴處逕行扣收銀行手續費30元）｜狀態｜功能 */
const DEMO_HISTORY = [
  { time: "2026-09-16 14:25:14", bankCode: "005", bankName: "土地銀行", branch: "台北分行", holder: "王小明", accountNo: "1**********4",
    amount: 1050, actual: 1020, state: "審核完成" },
];

thPage({
  data() {
    return {
      sid: "",
      mobile: "",
      otp: "",
      otpSent: false,
      verified: false,
      errors: { sid: "", mobile: "" },

      personColumns: [
        { key: "sid", label: "身份證字號" },
        { key: "name", label: "姓名" },
        { key: "phone", label: "聯絡電話" },
        { key: "date", label: "申請日期" },
      ],
      historyColumns: [
        { key: "time", label: "退費申請時間" },
        { key: "bank", label: "(銀行代碼) 金融機構名稱 分行" },
        { key: "account", label: "戶名 存簿帳號" },
        { key: "copy", label: "存摺封面影本" },
        { key: "amount", label: "本次申請退費金額", align: "right" },
        { key: "actual", label: "實退金額", align: "right" },   // 算式與手續費說明在表下附註（表頭不換行，整串放表頭會撐寬表格）
        { key: "state", label: "狀態", align: "center" },
        { key: "fn", label: "功能" },
      ],
    };
  },

  computed: {
    reasonRows() { return REASON_ROWS; },
    refLinks() { return REF_LINKS; },
    demoPerson() { return DEMO_PERSON; },
    demoHistory() { return DEMO_HISTORY; },
    /* window.* 一律在這裡取，不在模組層（載入先後無保證） */
    applyCrumb() { return window.TH_APPLY_CRUMB; },
  },

  methods: {
    /* 雛形不發簡訊，只翻一個旗標讓畫面顯示「已送出」提示。
       不要改成看起來會倒數的樣子——那會讓驗收的人以為 OTP 已接上。 */
    sendOtp() {
      this.otpSent = true;
    },

    /* 確定：欄位檢核（訊息照規格 06c），通過才顯示退費資訊 */
    verify() {
      this.errors.sid = this.sid.trim() ? "" : "請填寫申請人身分證字號";
      this.errors.mobile = /^09\d{8}$/.test(this.mobile.trim()) ? "" : "手機號碼格式不符";
      if (this.errors.sid || this.errors.mobile) return;
      this.verified = true;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    backToQuery() {
      this.verified = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
});
