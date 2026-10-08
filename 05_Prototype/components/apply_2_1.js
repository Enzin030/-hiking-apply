/* ============================================================
   apply_2_1.js — 草稿編輯（舊站 apply_2_1：查詢頁、草稿清單）
   ------------------------------------------------------------
   規格依據：02_Spec/07_草稿編輯.md
   本頁只有兩個階段：1＝查詢頁、2＝草稿清單。
   2026-10-08 使用者：草稿編輯的步驟改同線上申請——清單按「編輯」導到國家公園行程規劃頁
   apply-3.html?draft=<編號>（帶機關、隊名、入園日期、天數），之後的隊伍資料、確認資料都走線上申請頁；
   行程規劃頁在草稿模式把按鈕換成草稿的「返回／刪除草稿／儲存草稿／下一步」（見 components/apply-3.js）。
   原本本頁自己做的步驟一～四（行程登記、基本資料、確認、完成）拿掉。
   ?list=1：直接顯示草稿清單（行程規劃頁按「返回」或刪除草稿後回來）；?deleted=<編號>：清單不列該筆（示意刪除）。
   ============================================================ */

/* 草稿的機關 → 線上申請的管理處代碼 */
const A21_PARK = { "雪霸國家公園": "shei-pa", "玉山國家公園": "yushan", "太魯閣國家公園": "taroko" };

/* 草稿清單示意資料 */
const A21_DRAFTS = [
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
  ];

thPage({
  data() {
    const deleted = new URLSearchParams(window.location.search).get("deleted");
    return {
      // 頁面階段：1=查詢頁、2=草稿清單（編輯後的步驟走線上申請頁，見檔頭）
      currentStep: new URLSearchParams(window.location.search).get("list") ? 2 : 1,

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
      draftList: A21_DRAFTS.filter(function (x) { return String(x.id) !== deleted; }),
    };
  },

  computed: {
    pageTrail() {
      if (this.currentStep === 1) return ['登山申請', '草稿編輯'];
      return ['登山申請', { label: '草稿編輯', href: 'apply_2_1.html' }, '草稿清單'];
    },
    pageTitle() { return this.currentStep === 1 ? '草稿編輯' : '草稿清單'; },
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

      window.thAlert(
        '雪霸、玉山、太魯閣申請開放申請時間為 07:00-23:00，請您於 07:00 手動重新整理頁面，輸入驗證碼後執行「確認送出」鈕即可將申請案送出。草稿資訊僅保留 30 日，30 日內未異動資料或送出申請，草稿將被移除。'
      );

      this.currentStep = 2;
      this.$nextTick(function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },

    // 編輯草稿 → 國家公園行程規劃頁（草稿模式，2026-10-08 步驟改同線上申請）
    handleEdit(draft) {
      var park = A21_PARK[draft.agency] || "yushan";
      var q = new URLSearchParams({ unit: park, draft: draft.id, teams_name: draft.teamName,
        applystart: String(draft.entryDate || "").replace(/\//g, "-"), sumday: draft.days });
      if (park !== "yushan") q.set("park", park);
      window.location.href = "apply-3.html?" + q.toString();
    },

    // 刪除草稿
    handleDelete(draft) {
      var self = this;
      window.thConfirm('確定要刪除「' + draft.teamName + '」（' + draft.route + '）此筆草稿紀錄嗎？\n\n刪除後資料將無法復原。').then(function (ok) {
        if (!ok) return;
        var idx = self.draftList.findIndex(function(item) { return item.id === draft.id; });
        if (idx !== -1) {
          self.draftList.splice(idx, 1);
        }
        window.thAlert('草稿紀錄已成功刪除！', 'success');
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
    }
  }
});
