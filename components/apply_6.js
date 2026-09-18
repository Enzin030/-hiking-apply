/* ============================================================
   apply_6.js — 國家公園出園回報（舊站 apply_6.aspx）
   ------------------------------------------------------------
   規格依據：02_Spec/08_國家公園出園回報.md
   依踩坑總表規範，採用 Vue 3 global build (thPage)，
   嚴禁在模組層進行非同步載入，資料結構與狀態均於 data() 內初始化。
   ============================================================ */

thPage({
  data() {
    return {
      // 頁面步驟：1 = 回報查詢頁，2 = 回報資料填寫頁
      currentStep: 1,

      // 查詢欄位
      serial: 'B11509150012',
      nation: '中華民國',
      country: '',
      countryOptions: ['日本', '美國', '香港', '韓國', '新加坡', '馬來西亞', '加拿大', '英國', '澳大利亞', '德國', '法國', '其他'],
      sid: 'A123456789',
      vcode: '7K4M',
      vcodeDisplay: '7K4M',

      // 查詢狀態與檢核提示
      searchError: '',
      isSubmitSuccess: false,

      // 基本資料（唯讀）
      teamInfo: {
        entryDate: '2026/09/15',
        exitDate: '2026/09/17',
        serial: 'B11509150012',
        teamName: '玉山群峰四日縱走隊',
        leaderName: '陳大明',
        memberCount: '4 人'
      },

      // 出園回報明細清單
      members: [
        {
          id: 1,
          role: '領隊',
          name: '陳大明',
          checkinTime: '2026/09/15 08:30',
          entered: true,
          notEntered: false,
          exitDate: '2026-09-17',
          tempEntry: '36.5',
          tempExit: '36.4',
          notes: '全員平安離園',
          isReported: false
        },
        {
          id: 2,
          role: '隊員',
          name: '林小華',
          checkinTime: '2026/09/15 08:30',
          entered: true,
          notEntered: false,
          exitDate: '2026-09-17',
          tempEntry: '36.6',
          tempExit: '36.5',
          notes: '',
          isReported: false
        },
        {
          id: 3,
          role: '隊員',
          name: '張志強',
          checkinTime: '未報到',
          entered: true,
          notEntered: false,
          exitDate: '2026-09-17',
          tempEntry: '36.7',
          tempExit: '36.5',
          notes: '已於登山口補辦報到手續',
          isReported: false
        },
        {
          id: 4,
          role: '隊員',
          name: '王美玲',
          checkinTime: '未報到',
          entered: false,
          notEntered: true,
          exitDate: '',
          tempEntry: '',
          tempExit: '',
          notes: '行前因身體微恙未成行',
          isReported: false
        }
      ]
    };
  },

  computed: {
    todayDateString() {
      var d = new Date();
      var yyyy = d.getFullYear();
      var mm = String(d.getMonth() + 1).padStart(2, '0');
      var dd = String(d.getDate()).padStart(2, '0');
      return yyyy + '-' + mm + '-' + dd;
    },
    pageTrail() {
      if (this.currentStep === 1) {
        return ['登山申請', '國家公園出園回報'];
      }
      return [
        '登山申請',
        { label: '國家公園出園回報', href: 'javascript:;' },
        '回報資料填寫'
      ];
    },
    pageTitle() {
      return this.currentStep === 1
        ? '國家公園出園回報'
        : '回報資料填寫';
    }
  },

  methods: {
    // 臺灣身分證驗證規則（首碼英文、次碼 1 或 2，加權檢查碼模 10）
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

    // 國籍變更處理
    handleNationChange(val) {
      this.nation = val;
      if (val !== '國外') {
        this.country = '';
      }
    },

    // 執行查詢並切換至第二頁（回報資料填寫頁）
    handleSearch() {
      this.searchError = '';
      var s = (this.serial || '').trim();
      var n = this.nation;
      var c = this.country;
      var sid = (this.sid || '').trim();
      var vc = (this.vcode || '').trim();

      if (!s) {
        this.searchError = '請輸入（一站式／入園）申請編號。';
        return;
      }
      if (!n) {
        this.searchError = '請選擇國籍。';
        return;
      }
      if (n === '國外' && !c) {
        this.searchError = '外籍人士請選擇國別。';
        return;
      }
      if (!sid) {
        this.searchError = n === '國外' ? '請輸入護照號碼（居留證）。' : '請輸入身分證號（居留證）。';
        return;
      }

      // 中華民國國籍簡易檢核規則
      if (n === '中華民國' && !/^[A-Za-z][1289]\d{8}$/.test(sid)) {
        this.searchError = '身分證號格式不符，請重新確認輸入。';
        return;
      }

      if (!vc) {
        this.searchError = '請輸入驗證碼。';
        return;
      }

      // 查詢成功，切換至第二頁
      this.currentStep = 2;
      this.isSubmitSuccess = false;

      this.$nextTick(function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },

    // 重新整理驗證碼（比照 mail_1.html）
    refreshVcode() {
      var chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
      var res = "";
      for (var i = 0; i < 4; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.vcodeDisplay = res;
      this.vcode = res;
    },

    // 重設查詢
    handleReset() {
      this.serial = '';
      this.nation = '';
      this.country = '';
      this.sid = '';
      this.vcode = '';
      this.searchError = '';
      this.isSubmitSuccess = false;
      this.refreshVcode();
    },

    // 勾選「有入園」互斥控制
    toggleEntered(member) {
      if (member.entered) {
        member.notEntered = false;
        if (!member.exitDate) {
          member.exitDate = this.todayDateString;
        }
      } else {
        member.exitDate = '';
      }
    },

    // 勾選「未入園」互斥控制
    toggleNotEntered(member) {
      if (member.notEntered) {
        member.entered = false;
        member.exitDate = '';
      }
    },

    // 送出出園回報
    handleConfirmExit() {
      // 驗證有勾選入園者是否已填寫離園日期
      for (var i = 0; i < this.members.length; i++) {
        var m = this.members[i];
        if (m.entered && !m.exitDate) {
          alert('隊員「' + m.name + '」已勾選有入園，請填寫或選擇出園日期！');
          return;
        }
        if (!m.entered && !m.notEntered) {
          alert('隊員「' + m.name + '」請選擇「有入園」或「未入園」！');
          return;
        }
      }

      // 依規格彈出確認視窗
      var confirmed = window.confirm('請確認是否送出出園回報?!');
      if (confirmed) {
        window.alert('出園回報完成!!');
        this.handleReset();
        this.currentStep = 1;
        this.$nextTick(function() {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    },

    // 返回第一頁（查詢頁）
    handleBackToQuery() {
      this.currentStep = 1;
      this.isSubmitSuccess = false;
      this.$nextTick(function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }
});
