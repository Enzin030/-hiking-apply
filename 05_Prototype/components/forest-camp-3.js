/* ============================================================
   forest-camp-3.js — 山屋住宿申請 步驟 3：隊伍資料
   ------------------------------------------------------------
   2026-09-30 新增。依據正式站 apply_03.aspx（2026-09-29 實走嘉明湖）：
   - 申請人勾「委託同意」後才出現欄位；「未成年者不得擔任申請人」
   - **本案件申請人與領隊須為同一人**：領隊區固定帶入申請人、不可另填
   - 三區欄位相同（th-person-form role="team"），有備註、**沒有留守人**
   - 隊員列：正式站只預先產生 No.1，其餘按「新增隊員」；
     **雛形改為依第 1 步人數預先產生「人數－1」列**——人數在第 1 步已定，
     逐筆新增只會多一個與人數不一致的狀態。屬設計選擇，非正式站行為。

   資料：訂位與人員存在 window.thFcState（th-forest-camp-shared.js），不放網址。
   直接開本頁（未經第 1、2 步）時以示意值補齊，頁面仍可操作。
   ============================================================ */

/* 示意申請人：假名與不合檢查碼的證號（同 Apply15Data.js 的做法） */
const FC3_DEMO_APPLICANT = {
  name: "王小明", tel: "02-1234-5678", country: "台北市", city: "大安區", addr: "示意路 100 號",
  mobile: "0912345678", fax: "", email: "demo.applicant@example.com",
  nation: "中華民國", nationid: "", sid: "A100000000", sex: "男", birthday: "1985-05-20",
  contactname: "陳美玲", contacttel: "0922000111", notes: "",
};

thPage({
  data() {
    const st = window.thFcState.load();
    const route = st.route || "jiaming";
    const headcount = Number(st.headcount) || 2;
    const saved = Array.isArray(st.members) ? st.members : [];
    const members = Array.from({ length: Math.max(0, headcount - 1) }, (_, i) => saved[i] || { nation: "中華民國" });
    return {
      st: st,
      cabin: window.TH_CABIN_DATA[route] || window.TH_CABIN_DATA.jiaming,
      headcount: headcount,
      applyConsent: st.applyConsent !== undefined ? st.applyConsent : true,
      applicant: st.applicant || Object.assign({}, FC3_DEMO_APPLICANT),
      members: members,
      errors: [],
      errorOpen: false,
    };
  },

  computed: {
    applyCrumb() { return window.TH_APPLY_CRUMB; },
    planRows() { return window.thFcPlanRows(this.st, this.cabin, window.thTodayValue()); },
  },

  methods: {
    setMember(i, v) {
      const list = this.members.slice();
      list[i] = v;
      this.members = list;
    },
    persist() {
      window.thFcState.save({ applyConsent: this.applyConsent, applicant: this.applicant, members: this.members });
    },
    check() {
      const e = [];
      if (!this.applyConsent) e.push("請勾選申請人的委託同意");
      if (!this.applicant.name) e.push("申請人姓名為必填");
      if (!this.applicant.sid) e.push("申請人身分證號為必填");
      if (!this.applicant.mobile) e.push("申請人手機為必填");
      this.members.forEach((m, i) => {
        if (!m.name || !m.sid) e.push("No." + (i + 1) + " 隊員的姓名與證號為必填");
      });
      return e;
    },
    next() {
      const e = this.check();
      if (e.length) { this.errors = e; this.errorOpen = true; return; }
      this.persist();
      window.location.href = "forest-camp-4.html";
    },
    prev() {
      this.persist();
      const p = new URLSearchParams({
        route: this.st.route || "jiaming", start: this.st.start || "", nights: this.st.nights || 1, headcount: this.headcount,
      });
      window.location.href = "forest-camp-2.html?" + p;
    },
  },
});
