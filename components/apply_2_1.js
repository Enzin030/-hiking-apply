/* ============================================================
   apply_2_1.js — 草稿編輯全流程（舊站 apply_2_1 / 1_1 ~ 1_4）
   ------------------------------------------------------------
   規格依據：02_Spec/07_草稿編輯.md
   涵蓋全流程 6 個頁面/階段：
     1. 查詢頁 (apply_2_1.aspx 查詢)
     2. 草稿清單頁 (apply_2_1.aspx 清單)
     3. 步驟一：行程登記及登山申請 (apply_1_1.aspx)
     4. 步驟二：基本資料填寫 (apply_1_2.aspx)
     5. 步驟三：確認資料頁 (apply_1_3.aspx)
     6. 步驟四：申請完成頁 (apply_1_4.aspx)
   嚴格遵循 Design Tokens 與系統標準元件，無特定字體縮小或 font-mono 修改。
   ============================================================ */

thPage({
  data() {
    return {
      // 頁面步驟：1=查詢頁, 2=草稿清單, 3=步驟一, 4=步驟二, 5=步驟三, 6=步驟四(完成)
      currentStep: 1,

      // 查詢欄位
      nation: '中華民國',
      sid: 'A123456789',
      email: 'service@skyeyes.tw',
      vcode: '8F2P',
      vcodeDisplay: '8F2P',

      // 錯誤訊息提示
      searchError: '',
      stepError: '',

      // 當前查詢的身分快照
      currentQueryUser: {
        nation: '中華民國',
        sid: 'A123456789',
        email: 'service@skyeyes.tw'
      },

      // 草稿清單假資料
      draftList: [
        {
          id: 1,
          createTime: '2026/09/16 14:20',
          agency: '雪霸國家公園',
          agencyBadge: 'agency-sheipa',
          route: '雪山線（雪山主東峰）',
          mainRoute: '雪山線',
          subRoute: '雪山主東峰',
          entryDate: '2026/10/12',
          exitDate: '2026/10/14',
          teamName: '雪霸秋季登山隊',
          days: 3,
          membersCount: 4
        },
        {
          id: 2,
          createTime: '2026/09/15 09:35',
          agency: '玉山國家公園',
          agencyBadge: 'agency-yushan',
          route: '玉山主峰單日往返',
          mainRoute: '玉山線',
          subRoute: '玉山主峰單日往返',
          entryDate: '2026/10/20',
          exitDate: '2026/10/20',
          teamName: '玉山單攻攻頂小組',
          days: 1,
          membersCount: 2
        },
        {
          id: 3,
          createTime: '2026/09/14 16:50',
          agency: '太魯閣國家公園',
          agencyBadge: 'agency-taroko',
          route: '錐麓古道',
          mainRoute: '錐麓古道',
          subRoute: '錐麓古道全程',
          entryDate: '2026/10/05',
          exitDate: '2026/10/05',
          teamName: '錐麓斷崖探訪團',
          days: 1,
          membersCount: 6
        }
      ],

      // 當前編輯中的草稿物件
      activeDraft: {
        id: 1,
        teamName: '雪霸秋季登山隊',
        agency: '雪霸國家公園',
        mainRoute: '雪山線',
        subRoute: '雪山主東峰',
        days: 3,
        entryDate: '2026-10-12',
        exitDate: '2026-10-14',
        // 登山安全管理 4 勾選
        safetyCheck1: true,
        safetyCheck2: true,
        safetyCheck3: true,
        safetyCheck4: true,
        // 行程規劃節點
        itinerary: [
          { day: 1, date: '2026-10-12', plan: '武陵登山口 → 七卡山莊 → 哭坡 → 雪山東峰 → 三六九營地', arriveTime: '16:30' },
          { day: 2, date: '2026-10-13', plan: '三六九營地 → 黑森林 → 雪山圈谷 → 雪山主峰 → 三六九營地', arriveTime: '17:00' },
          { day: 3, date: '2026-10-14', plan: '三六九營地 → 雪山東峰 → 七卡山莊 → 武陵登山口', arriveTime: '14:00' }
        ],
        // 自主安全管理
        altRoute: '若遇豪大雨或黑森林路徑結冰，原路撤退至七卡山莊留宿後下山',
        firstAidExp: '領隊具備 WFA 野外初級急救證照，隨隊備有急救包及高山症常備用藥',
        lostHours: '4',
        finishHours: '14:00',
        contactNote: '每日抵達預定營地後以衛星通訊設備 inReach 回報留守人員',
        // 申請人資料
        applicant: {
          name: '陳大明',
          nation: '中華民國',
          sid: 'A123456789',
          gender: '男',
          birth: '1985-06-15',
          phone: '0912345678',
          tel: '04-22334455',
          email: 'service@skyeyes.tw',
          city: '臺中市',
          district: '西屯區',
          address: '臺灣大道三段 99 號',
          contactPerson: '陳大衛',
          contactPhone: '0922333444'
        },
        // 領隊資料
        leaderSameAsApplicant: true,
        leader: {
          name: '陳大明',
          nation: '中華民國',
          sid: 'A123456789',
          gender: '男',
          birth: '1985-06-15',
          phone: '0912345678',
          email: 'service@skyeyes.tw',
          contactPerson: '陳大衛',
          contactPhone: '0922333444'
        },
        // 隊員資料
        members: [
          { id: 1, name: '林小華', nation: '中華民國', sid: 'B223456781', gender: '女', birth: '1990-08-20', phone: '0933111222', email: 'lin@example.com', contactPerson: '林大華', contactPhone: '0933999888' },
          { id: 2, name: '張志強', nation: '中華民國', sid: 'C123456782', gender: '男', birth: '1988-11-05', phone: '0955222333', email: 'chang@example.com', contactPerson: '張老爹', contactPhone: '0955888777' },
          { id: 3, name: '王美玲', nation: '中華民國', sid: 'D223456783', gender: '女', birth: '1992-03-12', phone: '0977444555', email: 'wang@example.com', contactPerson: '王媽媽', contactPhone: '0977666555' }
        ],
        // 留守人資料
        stayBehindSameAsApplicant: false,
        stayBehind: {
          name: '李守護',
          phone: '0988777666',
          tel: '04-22119988',
          relation: '朋友兼登山留守人'
        },
        // 附件清單
        attachments: [
          { id: 1, name: '登山安全及自主管理計畫書.pdf', size: '1.2 MB', uploadTime: '2026/09/16 14:15' }
        ]
      },

      // 送件驗證碼（步驟二與步驟三用）
      submitVcode: '3N8R',
      submitVcodeDisplay: '3N8R',

      // 申請完成資料
      finishData: {
        serial: 'B11509170088',
        applyTime: '2026/09/17 15:00',
        teamName: '雪霸秋季登山隊',
        membersCount: '4 人',
        route: '雪霸國家公園 / 雪山線（雪山主東峰）',
        entryDate: '2026/10/12 至 2026/10/14（共 3 天）'
      }
    };
  },

  computed: {
    pageTrail() {
      if (this.currentStep === 1) {
        return ['登山申請', '草稿編輯'];
      }
      if (this.currentStep === 2) {
        return ['登山申請', { label: '草稿編輯', href: 'javascript:;' }, '草稿清單'];
      }
      if (this.currentStep === 3) {
        return ['登山申請', { label: '草稿編輯', href: 'javascript:;' }, '步驟一：行程登記及登山申請'];
      }
      if (this.currentStep === 4) {
        return ['登山申請', { label: '草稿編輯', href: 'javascript:;' }, '步驟二：基本資料填寫'];
      }
      if (this.currentStep === 5) {
        return ['登山申請', { label: '草稿編輯', href: 'javascript:;' }, '步驟三：確認資料頁'];
      }
      return ['登山申請', { label: '草稿編輯', href: 'javascript:;' }, '步驟四：申請完成'];
    },

    pageTitle() {
      if (this.currentStep === 1) return '草稿編輯';
      if (this.currentStep === 2) return '草稿清單';
      if (this.currentStep === 3) return '步驟一：行程登記及登山申請';
      if (this.currentStep === 4) return '步驟二：基本資料填寫';
      if (this.currentStep === 5) return '步驟三：確認資料頁';
      return '步驟四：申請完成';
    }
  },

  methods: {
    // 臺灣身分證驗證規則
    validateTaiwanSid(id) {
      if (!id || id.length !== 10) return false;
      var letters = 'ABCDEFGHJKLMNPQRSTUVXYWZIO';
      var firstChar = id.charAt(0).toUpperCase();
      var letterIndex = letters.indexOf(firstChar);
      if (letterIndex === -1) return false;

      var code = letterIndex + 10;
      var n1 = Math.floor(code / 10);
      var n2 = code % 10;

      var weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];
      var total = n1 * weights[0] + n2 * weights[1];

      for (var i = 1; i < 9; i++) {
        var digit = parseInt(id.charAt(i), 10);
        if (isNaN(digit)) return false;
        total += digit * weights[i + 1];
      }

      var lastDigit = parseInt(id.charAt(9), 10);
      return (total + lastDigit) % 10 === 0;
    },

    // Email 格式驗證
    validateEmail(email) {
      if (!email) return false;
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email.trim());
    },

    // 重新整理查詢驗證碼
    refreshVcode() {
      var chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
      var res = "";
      for (var i = 0; i < 4; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.vcodeDisplay = res;
      this.vcode = res;
    },

    // 重新整理送件驗證碼
    refreshSubmitVcode() {
      var chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
      var res = "";
      for (var i = 0; i < 4; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.submitVcodeDisplay = res;
      this.submitVcode = res;
    },

    // 執行查詢
    handleSearch() {
      this.searchError = '';
      var n = this.nation;
      var sid = (this.sid || '').trim();
      var email = (this.email || '').trim();
      var vc = (this.vcode || '').trim();

      if (!n) {
        this.searchError = '請選擇申請人國籍。';
        return;
      }
      if (!sid) {
        this.searchError = n === '國外' ? '請輸入護照號碼（居留證）。' : '請輸入身分證號（居留證）。';
        return;
      }
      if (n === '中華民國' && !/^[A-Za-z][1289]\d{8}$/.test(sid)) {
        this.searchError = '身分證號格式不符，請重新確認輸入。';
        return;
      }
      if (!email) {
        this.searchError = '請輸入申請人 Email。';
        return;
      }
      if (!this.validateEmail(email)) {
        this.searchError = 'Email 格式不正確，請重新輸入。';
        return;
      }
      if (!vc) {
        this.searchError = '請輸入驗證碼。';
        return;
      }

      this.currentQueryUser = { nation: n, sid: sid, email: email };

      window.alert(
        '雪霸、玉山、太魯閣申請開放申請時間為 07:00-23:00，請您於 07:00 手動重新整理頁面，輸入驗證碼後執行「確認送出」鈕即可將申請案送出。草稿資訊僅保留 30 日，30 日內未異動資料或送出申請，草稿將被移除。'
      );

      this.currentStep = 2;
      this.$nextTick(function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },

    // 編輯草稿 -> 載入並切換至步驟一
    handleEdit(draft) {
      this.activeDraft.id = draft.id;
      this.activeDraft.teamName = draft.teamName;
      this.activeDraft.agency = draft.agency;
      this.activeDraft.mainRoute = draft.mainRoute || draft.route;
      this.activeDraft.subRoute = draft.subRoute || draft.route;
      this.activeDraft.entryDate = draft.entryDate;
      this.activeDraft.exitDate = draft.exitDate || draft.entryDate;
      this.activeDraft.days = draft.days;

      this.currentStep = 3;
      this.stepError = '';
      this.$nextTick(function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },

    // 刪除草稿
    handleDelete(draft) {
      var ok = window.confirm('確定要刪除「' + draft.teamName + '」（' + draft.route + '）此筆草稿紀錄嗎？\n\n刪除後資料將無法復原。');
      if (ok) {
        var idx = this.draftList.findIndex(function(item) { return item.id === draft.id; });
        if (idx !== -1) {
          this.draftList.splice(idx, 1);
        }
        window.alert('草稿紀錄已成功刪除！');
      }
    },

    // 儲存草稿
    handleSaveDraft() {
      window.alert('草稿儲存完成！\n系統已保存您當前的填寫進度。');
    },

    // 步驟一：下一步
    handleStep1Next() {
      this.stepError = '';
      if (!this.activeDraft.teamName) {
        this.stepError = '請輸入隊名。';
        return;
      }
      if (!this.activeDraft.safetyCheck1 || !this.activeDraft.safetyCheck2 ||
          !this.activeDraft.safetyCheck3 || !this.activeDraft.safetyCheck4) {
        this.stepError = '登山安全管理 4 項聲明事項皆須確實閱讀並勾選同意。';
        return;
      }

      this.currentStep = 4;
      this.$nextTick(function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },

    // 步驟二：同申請人連動
    toggleLeaderSameAsApplicant() {
      if (this.activeDraft.leaderSameAsApplicant) {
        var app = this.activeDraft.applicant;
        this.activeDraft.leader.name = app.name;
        this.activeDraft.leader.nation = app.nation;
        this.activeDraft.leader.sid = app.sid;
        this.activeDraft.leader.gender = app.gender;
        this.activeDraft.leader.birth = app.birth;
        this.activeDraft.leader.phone = app.phone;
        this.activeDraft.leader.email = app.email;
        this.activeDraft.leader.contactPerson = app.contactPerson;
        this.activeDraft.leader.contactPhone = app.contactPhone;
      }
    },

    // 步驟二：新增隊員
    handleAddMember() {
      var newId = this.activeDraft.members.length + 1;
      this.activeDraft.members.push({
        id: newId,
        name: '',
        nation: '中華民國',
        sid: '',
        gender: '男',
        birth: '',
        phone: '',
        email: '',
        contactPerson: '',
        contactPhone: ''
      });
    },

    // 步驟二：刪除隊員
    handleRemoveMember(index) {
      if (this.activeDraft.members.length <= 1) {
        window.alert('隊伍至少需包含 1 位隊員！');
        return;
      }
      this.activeDraft.members.splice(index, 1);
    },

    // 步驟二：新增附件
    handleAddAttachment() {
      var name = window.prompt('請輸入上傳附件名稱（例如：家長同意書.pdf、登山計畫書.pdf）：', '行程安全補充說明.pdf');
      if (name) {
        this.activeDraft.attachments.push({
          id: Date.now(),
          name: name,
          size: '850 KB',
          uploadTime: '2026/09/17 15:00'
        });
      }
    },

    // 步驟二：刪除附件
    handleRemoveAttachment(index) {
      this.activeDraft.attachments.splice(index, 1);
    },

    // 步驟二：下一步
    handleStep2Next() {
      this.stepError = '';
      var app = this.activeDraft.applicant;
      if (!app.name || !app.sid || !app.phone || !app.email) {
        this.stepError = '請填寫完整的申請人基本資料（姓名、證號、手機、Email）。';
        return;
      }
      var ldr = this.activeDraft.leader;
      if (!ldr.name || !ldr.sid || !ldr.phone) {
        this.stepError = '請填寫完整的領隊基本資料。';
        return;
      }

      this.currentStep = 5;
      this.$nextTick(function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },

    // 步驟三：確認送出
    handleStep3Submit() {
      this.stepError = '';
      if (!this.submitVcode) {
        this.stepError = '請輸入送件驗證碼。';
        return;
      }

      var ok = window.confirm('請確認申請資料是否均正確無誤，確認送出申請案？！');
      if (ok) {
        // 設定完成資料
        this.finishData = {
          serial: 'B115091700' + Math.floor(10 + Math.random() * 89),
          applyTime: '2026/09/17 15:10',
          teamName: this.activeDraft.teamName,
          membersCount: (this.activeDraft.members.length + 1) + ' 人（含領隊）',
          route: this.activeDraft.agency + ' / ' + this.activeDraft.mainRoute + '（' + this.activeDraft.subRoute + '）',
          entryDate: this.activeDraft.entryDate + ' 至 ' + this.activeDraft.exitDate + '（共 ' + this.activeDraft.days + ' 天）'
        };
        this.currentStep = 6;
        this.$nextTick(function() {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    },

    // 步驟四：列印本頁
    handlePrint() {
      window.print();
    },

    // 返回清單頁
    handleBackToList() {
      this.currentStep = 2;
      this.stepError = '';
      this.$nextTick(function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },

    // 返回草稿資料查詢頁（輸入身分證）
    handleBackToQuery() {
      this.currentStep = 1;
      this.searchError = '';
      this.stepError = '';
      this.$nextTick(function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },

    // 步驟一：刪除當前草稿
    handleDeleteDraftCurrent() {
      if (!confirm('確定要刪除此筆草稿紀錄嗎？刪除後無法復原。')) return;
      var targetId = this.activeDraft.id;
      this.draftList = this.draftList.filter(function(d) {
        return d.id !== targetId;
      });
      alert('草稿已成功刪除！');
      this.handleBackToQuery();
    }
  }
});
