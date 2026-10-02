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

/* 性別：優先用已填值（"1"/"2" 或 "男"/"女"），沒有就依身分證第二碼推算（1 男、2 女）。
   正式站證號失焦後由伺服器依第二碼覆寫性別，2026-09-24 男女雙向實測確認。
   原本未填時一律顯示「男」，等於把沒填當成男性。 */
function sexText(sex, sid) {
  if (sex === "1" || sex === "男") return "男";
  if (sex === "2" || sex === "女") return "女";
  const d = /^[A-Z][12]/i.test(sid || "") ? sid[1] : "";
  return d === "1" ? "男" : d === "2" ? "女" : "";
}

function prefText(p) {
  if (p === "bed") return "床位";
  if (p === "camp") return "營地";
  return "不限";
}

thPage({
  data() {
    /* 2026-10-02：三管處共用本頁，park 參數取機關設定（components/ParkApplyData.js）；沒有 park＝玉山 */
    const park = window.thParkApply(getParam("park"));
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
      applyend: "",
      sumday: qDays,
      mainRoute: "玉山線",
      subRoute: qDays === "1" ? "單日往返(塔塔加 - 玉山前峰 - 塔塔加)" : "2~5天(塔塔加 - 玉山線 - 塔塔加)",
      teams_name: qTeams || "天眼1隊",
      climblinemain: "1",
      climbline: qDays === "1" ? "3" : "2"
    };

    // 離園日一律由「入園日＋天數−1」推算，不沿用傳入值。
    // 原本後備資料寫成 applyend: qStart，兩天行程會顯示「10-15 至 10-15（共 2 天）」（2026-09-24 修）
    if (summary.applystart && summary.sumday) {
      summary.applyend = window.thAddDaysToDateValue(summary.applystart, Math.max(0, Number(summary.sumday) - 1));
    }

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
    const members = (payload && payload.members && payload.members.length > 0)
      ? payload.members
      : [
          {
            name: "陳小華",
            tel: "02-27891234",
            country: "臺北市",
            city: "大安區",
            addr: "信義路三段100號",
            mobile: "0923456789",
            fax: "",
            email: "chen.sample@example.com",
            nation: "中華民國",
            sid: "B123456788",
            sex: "1",
            birthday: "1992-08-20",
            contactname: "陳媽媽",
            contacttel: "0922000222"
          },
          {
            name: "林美麗",
            tel: "04-22334455",
            country: "臺中市",
            city: "西屯區",
            addr: "臺灣大道三段99號",
            mobile: "0934567890",
            fax: "",
            email: "lin.sample@example.com",
            nation: "中華民國",
            sid: "F234567891",
            sex: "2",
            birthday: "1995-11-10",
            contactname: "林爸爸",
            contacttel: "0933000333"
          }
        ];
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
      park: park,
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
      isSubmitted: false,

      // 本頁內容導覽項目（供 th-page-nav 元件使用）
      navItems: [
        { id: "sec-summary", label: "行程計畫" },
        { id: "sec-team", label: "隊伍資料" },
        { id: "sec-contacts", label: "申請人與留守人" },
        { id: "sec-npa", label: "入山證申請資訊" },
        { id: "sec-captcha", label: "送件驗證碼" }
      ]
    };
  },

  computed: {
    applyCrumb() {
      return this.park.crumb;
    },
    /* 摘要卡的路線照片與難度：玉山沿用原值；其他機關取路線清單（RouteData）該次路線 */
    summaryRoute() {
      if (this.park.key === "yushan") return null;
      return (window.ROUTE_DATA || []).find(r => r.cId === this.summary.climbline) || {};
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

    // 逐日行程節點結構（供 apply-3 badge 樣式渲染）
    planDaysNodes() {
      if (!this.step3 || !this.step3.planDays || !Array.isArray(this.step3.planDays)) {
        return [];
      }
      return this.step3.planDays.map(item => {
        if (Array.isArray(item)) return item;
        if (typeof item === "string") return item.split("→").map(s => s.trim());
        return [];
      });
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
        sex: sexText(this.leader.sex, this.leader.sid),
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
          sex: sexText(m.sex, m.sid),
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
    /* 申請人與留守人分開呈現（2026-09-24 裁示）：兩者欄位不同，
       合成一張 11 欄表時留守人列有 4 欄固定空白；原表也漏了 Email、傳真。
       各自只列自己有的欄位，欄位集比照正式站確認頁（雪霸）。 */
    applicantFields() {
      const a = this.applicant;
      return [
        { label: "姓名", value: a.name },
        { label: "性別", value: sexText(a.sex, a.sid) },
        { label: "國籍", value: a.nation || "中華民國" },
        { label: "身分證號／護照號碼", value: a.sid },
        { label: "生日", value: a.birthday },
        { label: "電話", value: a.tel },
        { label: "手機", value: a.mobile },
        { label: "傳真", value: a.fax },
        { label: "Email", value: a.email },
        { label: "聯絡地址", value: `${a.country || ""}${a.city || ""}${a.addr || ""}`, wide: true },
        { label: "緊急聯絡人", value: a.contactname },
        { label: "緊急聯絡電話", value: a.contacttel }
      ];
    },
    // 留守人沒有性別、地址、緊急聯絡人（正式站兩家皆同）；電話只有雪霸有，有值才列
    stayFields() {
      const s = this.stay;
      const rows = [{ label: "姓名", value: s.name }];
      if (s.tel) rows.push({ label: "電話", value: s.tel });
      rows.push(
        { label: "手機", value: s.mobile },
        { label: "傳真", value: s.fax },
        { label: "Email", value: s.email },
        { label: "國籍", value: s.nation || "中華民國" },
        { label: "身分證號／護照號碼", value: s.sid },
        { label: "生日", value: s.birthday }
      );
      return rows;
    }
  },

  methods: {
    getNodeType(node) {
      if (!node) return "red";
      if (node.includes("服務中心")) return "green";
      if (node.includes("山莊") || node.includes("山屋") || node.includes("營地")) return "blue";
      return "red";
    },
    getNodeIcon(node) {
      if (!node) return "fa-solid fa-location-dot";
      if (node.includes("服務中心")) return "fa-solid fa-person-walking";
      if (node.includes("山莊") || node.includes("山屋") || node.includes("營地")) return "fa-solid fa-bed";
      return "fa-solid fa-location-dot";
    },
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
