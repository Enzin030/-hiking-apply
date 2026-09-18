/* ============================================================
   mail_1.js — 信件內容填寫資料與互動邏輯
   對應規格：02_Spec/34_聯絡我們.md 二、信件內容填寫頁（舊站 mail_1.aspx）
   ============================================================ */

const ORG_OPTIONS = [
  { value: "", label: "請選擇" },
  { value: "taroko", label: "太魯閣國家公園管理處" },
  { value: "spnp", label: "雪霸國家公園管理處" },
  { value: "ysnp", label: "玉山國家公園管理處" },
  { value: "reserve", label: "自然保留區" },
  { value: "protected", label: "自然保護區" },
  { value: "wildlife", label: "野生動物保護區" },
  { value: "trail", label: "國家步道(山屋/營地)" },
  { value: "npa", label: "警政署入山許可證" },
  { value: "system", label: "系統問題反映" },
];

const YSNP_CATEGORIES = [
  "領隊異動", "進度查詢", "排雲繳／退費", "其他", "玉山E學苑學習問題",
  "感謝回應", "外籍遊客", "第二次以上來信", "入園系統問題", "系統使用問題",
  "入園資料異動", "入園申請補件", "遞補回覆", "取消入園(一經取消無法恢復)",
  "違規陳述意見", "入園措施建議", "一站式網申請建議", "入園補報到"
];

const RESERVE_OPTIONS = [
  "插天山自然保留區", "鴛鴦湖自然保留區", "苗栗三義火炎山自然保留區",
  "淡水河紅樹林自然保留區", "坪林台灣油杉自然保留區", "烏石鼻海岸自然保留區",
  "南澳闊葉樹林自然保留區", "臺灣一葉蘭自然保留區", "九九峰自然保留區",
  "挖子尾自然保留區", "澎湖玄武岩自然保留區", "哈盆自然保留區",
  "墾丁高座產礁森林自然保留區", "出風鼻海岸自然保留區", "阿里山臺灣一葉蘭自然保留區",
  "大武山自然保留區", "大武事業區臺灣穗花杉自然保留區"
];

const PROTECTED_OPTIONS = [
  "雪霸自然保護區", "甲仙四德化石自然保護區", "十八羅漢山自然保護區",
  "大武臺灣油杉自然保護區", "關山臺灣海棗自然保護區", "海岸山脈臺灣蘇鐵自然保護區"
];

const WILDLIFE_OPTIONS = [
  "翡翠水庫食蛇龜野生動物保護區", "玉里野生動物保護區"
];

const TRAIL_CABIN_OPTIONS = [
  { value: "", label: "請選擇" },
  { value: "tianchi", label: "天池山莊" },
  { value: "kuaigu", label: "檜谷山莊" },
  { value: "jiaming", label: "嘉明湖/向陽山屋" },
];

thPage({
  data() {
    return {
      orgOptions: ORG_OPTIONS,
      ysnpCategories: YSNP_CATEGORIES,
      reserveOptions: RESERVE_OPTIONS,
      protectedOptions: PROTECTED_OPTIONS,
      wildlifeOptions: WILDLIFE_OPTIONS,
      trailCabinOptions: TRAIL_CABIN_OPTIONS,
      form: {
        org: "",
        serial: "",
        selectedCategories: [],
        subArea: "",
        cabin: "",
        email: "",
        name: "",
        tel: "",
        title: "",
        content: "",
        vcode: "",
        files: ["", "", ""],
      },
      vcodeDisplay: "2V2LD",
      submitted: false,
      submitSuccess: false,
      errors: {},
    };
  },
  computed: {
    hasSubMenu() {
      return ["reserve", "protected", "wildlife", "trail", "spnp", "ysnp"].includes(this.form.org);
    },
  },
  methods: {
    onOrgChange() {
      this.form.serial = "";
      this.form.selectedCategories = [];
      this.form.subArea = "";
      this.form.cabin = "";
      delete this.errors.org;
      delete this.errors.cabin;
    },
    refreshVcode() {
      const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
      let res = "";
      for (let i = 0; i < 5; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.vcodeDisplay = res;
    },
    validate() {
      const errs = {};
      if (!this.form.org) {
        errs.org = "請選擇管理單位";
      }
      if (this.form.org === "trail" && !this.form.cabin) {
        errs.cabin = "請選擇山屋";
      }
      if (!this.form.email) {
        errs.email = "請填寫寄件人電子信箱/Email";
      } else if (!/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.form.email)) {
        errs.email = "電子郵件格式錯誤";
      }
      if (!this.form.name) {
        errs.name = "請填寫姓名";
      }
      if (!this.form.tel) {
        errs.tel = "請填寫電話";
      }
      if (!this.form.title) {
        errs.title = "請填寫標題";
      }
      if (!this.form.content) {
        errs.content = "請填寫內容";
      }
      if (!this.form.vcode) {
        errs.vcode = "請輸入驗證碼";
      } else if (this.form.vcode.toUpperCase() !== this.vcodeDisplay.toUpperCase()) {
        errs.vcode = "驗證碼不符，請重新輸入";
      }
      this.errors = errs;
      return Object.keys(errs).length === 0;
    },
    onSubmit() {
      this.submitted = true;
      if (this.validate()) {
        this.submitSuccess = true;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    resetForm() {
      this.form = {
        org: "",
        serial: "",
        selectedCategories: [],
        subArea: "",
        cabin: "",
        email: "",
        name: "",
        tel: "",
        title: "",
        content: "",
        vcode: "",
        files: ["", "", ""],
      };
      this.errors = {};
      this.submitted = false;
      this.submitSuccess = false;
      this.refreshVcode();
      for (let i = 0; i < 3; i++) {
        const input = document.getElementById("f-file-" + i);
        if (input) input.value = "";
      }
    },
    onFileChange(idx, event) {
      const file = event.target.files && event.target.files[0];
      if (file) {
        this.form.files[idx] = file.name;
      }
    },
    removeFile(idx) {
      this.form.files[idx] = "";
      const input = document.getElementById("f-file-" + idx);
      if (input) input.value = "";
    },
    triggerFileInput(idx) {
      const input = document.getElementById("f-file-" + idx);
      if (input) input.click();
    },
  },
});
