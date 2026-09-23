/* ============================================================
   apply-5.js — 申請流程步驟五「確認資料」頁面腳本
   ------------------------------------------------------------
   對應 02_Spec/05a 第五節「步驟 5：確認資料（apply_1_4.aspx 步驟三）」
   唯讀彙整呈現行程計畫、隊伍資料、申請人與留守人資料、入山證資料，
   並提供送件驗證碼與送出按鈕。
   ============================================================ */

function getParam(key) {
  return new URLSearchParams(window.location.search).get(key) || "";
}

thPage({
  data() {
    const qTeams = getParam("teams_name");
    const qStart = getParam("applystart") || "2026-10-15";
    const qDays = getParam("sumday") || "2";

    // 嘗試從 sessionStorage 讀取步驟四送出的資料
    let payload = null;
    try {
      const raw = sessionStorage.getItem("th_apply_confirmed_payload");
      if (raw) {
        payload = JSON.parse(raw);
      }
    } catch (e) {
      console.error("無法讀取 sessionStorage 資料", e);
    }

    // 若無 sessionStorage 則 fallback 到預設或 URL
    const summary = (payload && payload.summary) || {
      applystart: qStart,
      applyend: qStart,
      sumday: qDays,
      mainRoute: "玉山線",
      subRoute: qDays === "1" ? "單日往返(塔塔加 - 玉山前峰 - 塔塔加)" : "2~5天(塔塔加 - 玉山線 - 塔塔加)",
      teams_name: qTeams || "天眼1隊",
      climblinemain: "1",
      climbline: qDays === "1" ? "3" : "2"
    };

    const applicant = (payload && payload.applicant) || {
      name: "王小明",
      tel: "02-23456789",
      mobile: "0912345678",
      email: "wang.sample@example.com",
      nation: "中華民國",
      sid: "A123456789",
      sex: "1",
      birthday: "1990-05-15",
      country: "臺北市",
      city: "中正區",
      addr: "公園路1號",
      contactname: "王大同",
      contacttel: "0911000111"
    };

    const leader = (payload && payload.leader) || applicant;
    const members = (payload && payload.members) || [];
    const stay = (payload && payload.stay) || {
      name: "李守護",
      mobile: "0988777666",
      fax: "",
      email: "stay.angel@example.com",
      birthday: "1985-03-25",
      nation: "中華民國",
      sid: "E123456787"
    };

    return {
      summary: summary,
      applicant: applicant,
      leader: leader,
      members: members,
      stay: stay,

      // 警政署入山證預設資訊
      npa: {
        reason: "登山健行",
        places: summary.subRoute.includes("前峰") ? "玉山前峰(嘉義縣-阿里山鄉)" : "玉山群峰(嘉義縣-阿里山鄉)",
        routeMap: "上河文化台灣百岳導遊圖",
        plan: "D1：塔塔加登山口→排雲山莊。\nD2：排雲山莊→玉山主峰→塔塔加登山口。"
      },

      // 送件驗證碼
      captchaInput: "",
      captchaCode: "4N8P",
      isSubmitted: false
    };
  },

  computed: {
    applyCrumb() {
      return "玉山國家公園";
    },

    teamsCount() {
      return 1 + this.members.length;
    },

    // 隊伍資料表格整合（領隊 + 隊員）
    teamRows() {
      const rows = [];
      // 領隊
      rows.push({
        no: 1,
        role: "領隊",
        name: this.leader.name,
        sex: this.leader.sex === "1" ? "男" : this.leader.sex === "2" ? "女" : "男",
        nation: this.leader.nation || "中華民國",
        sid: this.leader.sid,
        birthday: this.leader.birthday,
        tel: `${this.leader.tel || ''} / ${this.leader.mobile || ''}`,
        address: `${this.leader.country || ''}${this.leader.city || ''}${this.leader.addr || ''}`,
        contact: this.leader.contactname,
        contactTel: this.leader.contacttel
      });

      // 隊員
      this.members.forEach((m, idx) => {
        rows.push({
          no: idx + 2,
          role: "隊員",
          name: m.name,
          sex: m.sex === "1" ? "男" : m.sex === "2" ? "女" : "男",
          nation: m.nation || "中華民國",
          sid: m.sid,
          birthday: m.birthday,
          tel: `${m.tel || ''} / ${m.mobile || ''}`,
          address: `${m.country || ''}${m.city || ''}${m.addr || ''}`,
          contact: m.contactname,
          contactTel: m.contacttel
        });
      });

      return rows;
    },

    // 申請人與留守人資料表格
    contactRows() {
      return [
        {
          no: 1,
          role: "申請人",
          name: this.applicant.name,
          sex: this.applicant.sex === "1" ? "男" : this.applicant.sex === "2" ? "女" : "男",
          nation: this.applicant.nation || "中華民國",
          sid: this.applicant.sid,
          birthday: this.applicant.birthday,
          tel: `${this.applicant.tel || ''} / ${this.applicant.mobile || ''}`,
          address: `${this.applicant.country || ''}${this.applicant.city || ''}${this.applicant.addr || ''}`,
          contact: this.applicant.contactname,
          contactTel: this.applicant.contacttel
        },
        {
          no: 2,
          role: "留守人",
          name: this.stay.name,
          sex: "-",
          nation: this.stay.nation || "中華民國",
          sid: this.stay.sid || "-",
          birthday: this.stay.birthday || "-",
          tel: this.stay.mobile || "-",
          address: "-",
          contact: "-",
          contactTel: "-"
        }
      ];
    }
  },

  mounted() {
    this.refreshCaptcha();
  },

  methods: {
    refreshCaptcha() {
      const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
      let code = "";
      for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.captchaCode = code;
      this.captchaInput = "";
    },

    goPrev() {
      const q = new URLSearchParams(window.location.search);
      window.location.href = `apply-4-v2.html?${q.toString()}`;
    },

    saveDraft() {
      alert("草稿已成功儲存！");
    },

    submitApply() {
      if (!this.captchaInput) {
        alert("請輸入驗證碼。");
        return;
      }
      if (this.captchaInput.trim().toUpperCase() !== this.captchaCode) {
        alert("驗證碼輸入錯誤，請重新輸入。");
        this.refreshCaptcha();
        return;
      }
      this.isSubmitted = true;
      alert("【登山申請成功】\n您的申請已成功送出！申請編號為：YUS-" + Date.now().toString().slice(-6) + "\n審核結果將寄發至申請人電子郵件信箱。");
      window.location.href = "applySearch.html";
    }
  }
});
