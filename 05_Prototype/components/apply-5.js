/* ============================================================
   apply-5.js — 申請流程步驟五「確認資料」頁面腳本
   ------------------------------------------------------------
   對應 02_Spec/05a 第五節「步驟 5：確認資料（apply_1_4.aspx 步驟三）」
   唯讀彙整呈現行程計畫、隊伍資料、申請人與留守人資料、入山證資料，
   並提供真實草稿儲存、送件驗證碼與送出按鈕。
   ============================================================ */

function getParam(key) {
  return new URLSearchParams(window.location.search).get(key) || "";
}

function prefText(p) {
  if (p === "bed") return "床位";
  if (p === "camp") return "營地";
  return "不限";
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

    const step3 = (payload && payload.step3) || {
      planDays: qDays === "1"
        ? [["排雲登山服務中心", "塔塔加登山口", "孟祿亭", "玉山前峰", "塔塔加登山口", "排雲登山服務中心"]]
        : [
            ["排雲登山服務中心", "塔塔加登山口", "排雲山莊"],
            ["排雲山莊", "玉山主峰", "塔塔加登山口", "排雲登山服務中心"]
          ],
      seminar: "網路線上學習",
      equipment: {
        gps: "有",
        satellitephone: "無",
        frequency: "無",
        note_user: "無"
      },
      npa: {
        reason: "登山健行",
        places: summary.subRoute && summary.subRoute.includes("前峰") ? "玉山前峰(嘉義縣-阿里山鄉)" : "玉山群峰(嘉義縣-阿里山鄉)",
        routeMap: "上河文化台灣百岳導遊圖",
        plan: "D1:排雲登山服務中心→塔塔加登山口→排雲山莊。\nD2:排雲山莊→玉山主峰→塔塔加登山口→排雲登山服務中心。"
      }
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

    const queueRows = (payload && Array.isArray(payload.queueRows) && payload.queueRows.length > 0)
      ? payload.queueRows
      : [
          {
            date: summary.applystart,
            camp: "排雲山莊",
            capacity: 136,
            queueNum: 61,
            reviewNum: 29,
            approvedNum: 98,
            pref: "none",
            isSingle: false
          }
        ];

    return {
      summary: summary,
      step3: step3,
      applicant: applicant,
      leader: leader,
      members: members,
      stay: stay,
      queueRows: queueRows,

      // 警政署入山證資訊
      npa: step3.npa || {
        reason: "登山健行",
        places: "玉山群峰(嘉義縣-阿里山鄉)",
        routeMap: "上河文化台灣百岳導遊圖",
        plan: "D1:排雲登山服務中心→塔塔加登山口→排雲山莊。\nD2:排雲山莊→玉山主峰→塔塔加登山口→排雲登山服務中心。"
      },

      // 送件驗證碼
      captchaInput: "4N8P",
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

    // 格式化逐日行程清單
    formattedPlanDays() {
      if (!this.step3 || !this.step3.planDays || !Array.isArray(this.step3.planDays)) {
        return [];
      }
      return this.step3.planDays.map((nodes, idx) => ({
        day: idx + 1,
        text: Array.isArray(nodes) ? nodes.join(" → ") : String(nodes)
      }));
    },

    // 宿營地清單檢視
    campRows() {
      if (!this.queueRows || !Array.isArray(this.queueRows)) return [];
      return this.queueRows.map(r => ({
        date: r.date,
        camp: r.camp,
        prefLabel: r.isSingle ? "當日往返（無須床位）" : `需求偏好：${prefText(r.pref)}`
      }));
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

  methods: {
    refreshCaptcha() {
      const captcha = this.$refs.captchaField;
      if (captcha && typeof captcha.refresh === "function") {
        captcha.refresh();
      }
    },

    goPrev() {
      const q = new URLSearchParams(window.location.search);
      if (this.summary.applystart) q.set("applystart", this.summary.applystart);
      if (this.summary.sumday) q.set("sumday", this.summary.sumday);
      if (this.summary.teams_name) q.set("teams_name", this.summary.teams_name);
      if (this.summary.climblinemain) q.set("climblinemain", this.summary.climblinemain);
      if (this.summary.climbline) q.set("climbline", this.summary.climbline);
      window.location.href = `apply-4.html?${q.toString()}`;
    },

    // 真實儲存草稿機制（寫入 localStorage）
    saveDraft() {
      try {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, "0");
        const d = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const timeStr = `${y}-${m}-${d} ${hh}:${mm}`;

        const draftData = {
          savedAt: timeStr,
          summary: this.summary,
          step3: this.step3,
          applyConsent: true,
          applicant: this.applicant,
          leaderSame: this.leader.sid === this.applicant.sid,
          leader: this.leader,
          members: this.members,
          soloChecked: this.teamsCount === 1,
          staySame: this.stay.name === this.applicant.name,
          stay: this.stay,
          queueRows: this.queueRows
        };

        localStorage.setItem("th_apply4_yushan_draft", JSON.stringify(draftData));
        alert(`草稿已成功儲存（儲存時間：${timeStr}）！\n您可隨時至「草稿編輯」或於申請流程中恢復填寫進度。`);
      } catch (e) {
        alert("儲存草稿時發生錯誤：" + e.message);
      }
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
