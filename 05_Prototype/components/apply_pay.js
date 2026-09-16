/* ============================================================
   apply_pay.js — 排雲山莊線上繳費（規格 02_Spec/06b_線上繳費(排雲).md）
   ------------------------------------------------------------
   舊站 apply_4.aspx。版面在 apply_pay.html，本檔只留資料與方法。

   手續費是「選了哪個管道」才知道的，所以應繳總額走 computed，
   不在 data() 預先算一個會過期的數字。
   ============================================================ */

/* 大宗常數放模組層，不進 data()（進去會被建成 reactive proxy，本頁不會改它） */

const PAY_BASIC = [
  { label: "入園日期", value: "2026-10-18" },
  { label: "繳費狀態", value: "未繳費", flag: "is-closed" },
  { label: "登山申請編號", value: "TW1150918003" },
  { label: "隊伍名稱", value: "曉風登山隊" },
  { label: "領隊", value: "王小明" },
  { label: "隊伍人數（含領隊）", value: "6 人" },
];

/* 兩層表頭：第一層「中華民國人費用」「外國人費用」各 colSpan=3，
   住宿日期／宿營地／單日合計 rowSpan=2 跨到底。leaf 共 9 欄，與 columns 對得起來。 */
const PAY_FEE_HEAD = [
  [
    { label: "住宿日期", rowSpan: 2 },
    { label: "宿營地", rowSpan: 2 },
    { label: "中華民國人費用", colSpan: 3, align: "center" },
    { label: "外國人費用", colSpan: 3, align: "center" },
    { label: "單日合計", rowSpan: 2, align: "right" },
  ],
  [
    { label: "單價", align: "right" },
    { label: "人數", align: "right" },
    { label: "小計", align: "right" },
    { label: "單價", align: "right" },
    { label: "人數", align: "right" },
    { label: "小計", align: "right" },
  ],
];

const PAY_FEE_COLUMNS = [
  { key: "date", label: "住宿日期" },
  { key: "site", label: "宿營地" },
  { key: "twUnit", label: "本國單價", align: "right" },
  { key: "twQty", label: "本國人數", align: "right" },
  { key: "twSub", label: "本國小計", align: "right" },
  { key: "fnUnit", label: "外國單價", align: "right" },
  { key: "fnQty", label: "外國人數", align: "right" },
  { key: "fnSub", label: "外國小計", align: "right" },
  { key: "sum", label: "單日合計", align: "right" },
];

const PAY_FEE_ROWS = [
  { date: "2026-10-18", site: "排雲山莊", twUnit: "480", twQty: "5", twSub: "2,400", fnUnit: "480", fnQty: "1", fnSub: "480", sum: "2,880" },
];

/* 六個繳費管道。fee 是併入應繳總額的系統／銀行端手續費（元）；超商那筆由繳款人自負，不進總額。 */
const PAY_CHANNELS = [
  { id: "bank",   title: "金融機構轉帳",          icon: "fa-solid fa-building-columns", fee: 10, feeText: "含彰化銀行專屬匯款帳號代收手續費 10 元", desc: "取得專屬匯款帳號後至金融機構或網銀轉帳。不接受外幣與跨國匯款。" },
  { id: "post",   title: "郵政匯票",              icon: "fa-solid fa-envelope",        fee: 0,  feeText: "無額外系統手續費", desc: "購買郵政匯票後寄送玉管處。" },
  { id: "cash",   title: "現金",                  icon: "fa-solid fa-money-bill-wave", fee: 0,  feeText: "無額外系統手續費", desc: "親至玉管處櫃檯繳納。" },
  { id: "twpay",  title: "臺灣 PAY（信用卡或金融卡）", icon: "fa-solid fa-mobile-screen", fee: 10, feeText: "含彰化銀行專屬匯款帳號代收手續費 10 元", desc: "以臺灣 PAY 掃碼支付。", todo: "支付頁待建置" },
  { id: "store",  title: "超商繳費",              icon: "fa-solid fa-store",           fee: 0,  feeText: "超商手續費 15 元由繳款人自負", desc: "產生超商繳費單後至超商繳納，繳費後須於期限內上傳蓋章繳費單及熱感應紙收據。", todo: "產生超商繳費單待建置" },
  { id: "card",   title: "信用卡繳費",            icon: "fa-solid fa-credit-card",     fee: 39, feeText: "含信用卡交易手續費 39 元", desc: "線上刷卡，交易手續費併入應繳總額。", todo: "支付頁待建置" },
];

const PAY_TOTAL = 2880;

thPage({
  data() {
    return {
      serial: "",
      team: "",
      submitted: false,
      showExpired: false,
      channel: "",

      navItems: [
        { id: "query", label: "查詢繳費案件" },
        { id: "basic", label: "案件基本資料" },
        { id: "fee", label: "費用明細" },
        { id: "channel", label: "選擇繳費管道" },
        { id: "rules", label: "繳費規定與收據" },
      ],

      basicColumns: [
        { key: "label", label: "項目" },
        { key: "value", label: "內容" },
      ],
      feeColumns: PAY_FEE_COLUMNS,
    };
  },

  computed: {
    applyCrumb() { return window.TH_APPLY_CRUMB; },
    channels() { return PAY_CHANNELS; },
    basicRows() { return PAY_BASIC; },
    feeRows() { return PAY_FEE_ROWS; },
    feeHead() { return PAY_FEE_HEAD; },

    feeTotalText() { return PAY_TOTAL.toLocaleString("zh-TW") + " 元"; },

    /* 未選管道時顯示規費本身，不顯示 0——0 會讓人以為不用繳。 */
    payableText() {
      const picked = PAY_CHANNELS.find((c) => c.id === this.channel);
      if (!picked) return PAY_TOTAL.toLocaleString("zh-TW") + " 元（尚未選擇繳費管道）";
      return (PAY_TOTAL + picked.fee).toLocaleString("zh-TW") + " 元";
    },
  },

  methods: {
    reset() {
      this.serial = "";
      this.team = "";
      this.submitted = false;
      this.channel = "";
    },
  },
});
