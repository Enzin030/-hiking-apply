/* ============================================================
   apply_03.js — 六步驟家族 步驟 3：隊伍資料（警政署、自然保護區域、山屋共用）
   ------------------------------------------------------------
   2026-09-30 新增（原 forest-camp-3.js）。依據正式站 apply_03.aspx（2026-09-29 實走三類）：
   - 申請人勾「委託同意」後才出現欄位；「未成年者不得擔任申請人」
   - **警政署、山屋：本案件申請人與領隊須為同一人**——領隊區鎖定帶入申請人；
     **自然保護區域沒有此限制**——「同申請人」可取消、另填領隊
   - 三區欄位相同（th-person-form role="team"），有備註、**沒有留守人**
   - 隊員列：正式站只預先產生 No.1，其餘按「新增隊員」；
     **雛形依第 1 步人數預先產生「人數－1」列**（設計選擇，見 decisions.md 2026-09-30）
   - 正式站行程摘要要等路線摘要 API 回應（常逾 40 秒）才出現，雛形直接顯示

   資料：thFcState（th-forest-camp-shared.js）。kind、title、crumb、plan、backUrl
   由各類別第 2 步寫入；直接開本頁時以山屋示意值補齊，頁面仍可操作。
   ============================================================ */

/* 示意申請人：假名與不合檢查碼的證號（同 Apply15Data.js 的做法） */
const A03_DEMO_MEMBERS = [
  { name: "林大同", mobile: "0933000222", nation: "中華民國", nationid: "", sid: "C100000000", sex: "男", birthday: "1990-03-03", email: "demo.member1@example.com" },
  { name: "張雅婷", mobile: "0955000444", nation: "中華民國", nationid: "", sid: "D200000000", sex: "女", birthday: "1993-07-12", email: "demo.member2@example.com" },
];

const A03_DEMO_APPLICANT = {
  name: "王小明", tel: "02-1234-5678", country: "台北市", city: "大安區", addr: "示意路 100 號",
  mobile: "0912345678", fax: "", email: "demo.applicant@example.com",
  nation: "中華民國", nationid: "", sid: "A100000000", sex: "男", birthday: "1985-05-20",
  contactname: "陳美玲", contacttel: "0922000111", notes: "",
};

/* 直接開本頁（沒經第 1、2 步）時的補值：山屋嘉明湖 */
const A03_FALLBACK = {
  kind: "camp", title: "山屋住宿申請", crumb: "嘉明湖山屋", backUrl: "forest-camp-1.html",
  plan: { unit: "國家步道(山屋/營地)", main: "嘉明湖山屋", route: "嘉明湖山屋" }, days: 2, nights: 1, headcount: 2,
};

thPage({
  data() {
    const st = Object.assign({}, A03_FALLBACK, window.thFcState.load());
    const headcount = Number(st.headcount) || 2;
    const saved = Array.isArray(st.members) ? st.members : [];
    /* 必填欄位預設帶入示意隊員（2026-10-02）；有暫存時還原 */
    const members = Array.from({ length: Math.max(0, headcount - 1) }, (_, i) => saved[i] || Object.assign({}, A03_DEMO_MEMBERS[i % A03_DEMO_MEMBERS.length]));
    return {
      st: st,
      headcount: headcount,
      applyConsent: st.applyConsent !== undefined ? st.applyConsent : true,
      applicant: st.applicant || Object.assign({}, A03_DEMO_APPLICANT),
      leaderSame: st.leaderSame !== undefined ? st.leaderSame : true,
      leader: st.leader || { nation: "中華民國" },
      members: members,
      /* 版面狀態（2026-10-05 比照 apply-4）：區塊與隊員卡預設展開 */
      accordionOpen: { apply: true, leader: true, member: true },
      memberClosed: {},
      activeNavIndex: 0,
    };
  },

  computed: {
    applyCrumb() { return window.TH_APPLY_CRUMB; },
    planRows() { return window.thApply6PlanRows(this.st, window.thTodayValue()); },
    /* 正式站 apply_03：警政署、山屋顯示「本案件申請人與領隊須為同一人」，保護區沒有（2026-09-29） */
    leaderLocked() { return this.st.kind !== "area"; },
    plan() { return this.st.plan || {}; },
    /* 摘要卡照片：路線列表同一張（警政署 c_id 157、保護區依區域 c_id、山屋依山屋代碼） */
    summaryImage() {
      const rows = window.ROUTE_DATA || [];
      let r = null;
      if (this.st.kind === "npa") r = rows.find(x => x.cId === "157");
      else if (this.st.kind === "area") r = rows.find(x => x.cId === String(this.st.areaCid));
      else r = rows.find(x => x.id === this.st.route);
      return (r && r.image) || "assets/route-yushan.png";
    },
    endDate() {
      const d = Number(this.st.days) || 0;
      return this.st.start && d ? window.thAddDaysToDateValue(this.st.start, d - 1) : "";
    },
    secApplyOk() { return !!(this.applyConsent && this.applicant.name && this.applicant.sid && this.applicant.mobile); },
    secLeaderOk() { return this.leaderLocked || this.leaderSame || !!(this.leader.name && this.leader.sid); },
    secMemberOk() { return this.members.every(m => m.name && m.sid); },
    sideItems() {
      return [
        { key: "apply", sec: "sec-apply", label: "申請人資料", ok: this.secApplyOk },
        { key: "leader", sec: "sec-leader", label: "領隊資料", ok: this.secLeaderOk },
        { key: "member", sec: "sec-member", label: "隊員資料（如無則免）", ok: this.secMemberOk },
      ];
    },
    completedSectionsCount() { return this.sideItems.filter(it => it.ok).length; },
  },

  methods: {
    toggleSection(k) { this.accordionOpen[k] = !this.accordionOpen[k]; },
    isMemberOpen(i) { return !this.memberClosed[i]; },
    toggleMember(i) { this.memberClosed = Object.assign({}, this.memberClosed, { [i]: !this.memberClosed[i] }); },
    scrollToSection(id, i) {
      this.activeNavIndex = i;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    setMember(i, v) {
      const list = this.members.slice();
      list[i] = v;
      this.members = list;
    },
    persist() {
      window.thFcState.save({
        applyConsent: this.applyConsent, applicant: this.applicant, members: this.members,
        leaderSame: this.leaderLocked || this.leaderSame, leader: this.leader,
      });
    },
    check() {
      const e = [];
      if (!this.applyConsent) e.push("請勾選申請人的委託同意");
      if (!this.applicant.name) e.push("申請人姓名為必填");
      if (!this.applicant.sid) e.push("申請人身分證號為必填");
      if (!this.applicant.mobile) e.push("申請人手機為必填");
      if (!this.leaderLocked && !this.leaderSame && (!this.leader.name || !this.leader.sid)) e.push("領隊的姓名與證號為必填，或勾選「同申請人」");
      this.members.forEach((m, i) => {
        if (!m.name || !m.sid) e.push("No." + (i + 1) + " 隊員的姓名與證號為必填");
      });
      return e;
    },
    next() {
      const e = this.check();
      if (e.length) { window.thAlertList(e); return; }
      this.persist();
      window.location.href = "apply_04.html";
    },
    prev() {
      this.persist();
      window.location.href = this.st.backUrl || "apply-1.html";
    },
  },
});
