/* ============================================================
   apply-4-v2.js — 步驟四「人員資料」頁面腳本
   ------------------------------------------------------------
   2026-09-23 依修改清單全量調整：
     1. 規格與功能對齊：
        - 委託同意預設未勾選，勾選後才顯示申請人輸入欄位。
        - 初始資料由空白、領隊 1 人開始，提供示範資料載入按鈕。
        - 補齊送件驗證碼（隨機 4 碼、重新整理、檢核）。
        - 補齊生日、性別、Email、手機格式檢核，完成度與按鈕狀態嚴格一致。
        - 承接 apply-3 之主次路線、隊名、日期與天數，支援返回時保留已填內容。
        - 宿營地資料隨日期、天數連動：單日往返呈現當日承載量（不顯示床位），
          多日顯示宿營地排隊狀況，住宿調查預設「不限」。
        - 下一步通過檢核後將資料存入 sessionStorage 並導向步驟五（apply-5.html）。
        - 補上 localStorage 草稿儲存與進度恢復機制。
        - 人員區塊手風琴收合/展開切換，支援隊員全部展開/收合。
   ============================================================ */

function getParam(key) {
  return new URLSearchParams(window.location.search).get(key) || "";
}

// 臺灣各縣市及代表性行政區資料
const TAIWAN_CITIES = {
  "臺北市": ["中正區", "大同區", "中山區", "松山區", "大安區", "萬華區", "信義區", "士林區", "北投區", "內湖區", "南港區", "文山區"],
  "新北市": ["板橋區", "三重區", "中和區", "永和區", "新莊區", "新店區", "樹林區", "鶯歌區", "三峽區", "淡水區", "汐止區", "瑞芳區", "土城區", "蘆洲區", "五股區", "泰山區", "林口區"],
  "桃園市": ["桃園區", "中壢區", "大溪區", "楊梅區", "蘆竹區", "大園區", "龜山區", "八德區", "龍潭區", "平鎮區", "復興區"],
  "臺中市": ["中區", "東區", "南區", "西區", "北區", "西屯區", "南屯區", "北屯區", "豐原區", "東勢區", "大甲區", "清水區", "沙鹿區", "梧棲區", "后里區", "神岡區", "潭子區", "大雅區", "新社區", "和平區"],
  "臺南市": ["東區", "南區", "北區", "安南區", "安平區", "中西區", "新營區", "永康區", "白河區", "柳營區", "後壁區", "東山區", "麻豆區", "下營區", "六甲區", "官田區", "佳里區"],
  "高雄市": ["新興區", "前金區", "苓雅區", "鹽埕區", "鼓山區", "旗津區", "前鎮區", "三民區", "楠梓區", "小港區", "左營區", "仁武區", "大社區", "岡山區", "路竹區", "阿蓮區", "田寮區", "燕巢區", "橋頭區", "梓官區", "彌陀區", "永安區", "湖內區", "鳳山區", "大寮區", "林園區", "鳥松區", "大樹區", "旗山區", "美濃區", "六龜區", "內門區", "杉林區", "甲仙區", "桃源區", "那瑪夏區", "茂林區", "茄萣區"],
  "基隆市": ["仁愛區", "信義區", "中正區", "中山區", "安樂區", "暖暖區", "七堵區"],
  "新竹市": ["東區", "北區", "香山區"],
  "新竹縣": ["竹北市", "竹東鎮", "新埔鎮", "關西鎮", "湖口鄉", "新豐鄉", "芎林鄉", "橫山鄉", "北埔鄉", "寶山鄉", "峨眉鄉", "尖石鄉", "五峰鄉"],
  "苗栗縣": ["苗栗市", "頭份市", "竹南鎮", "後龍鎮", "通霄鎮", "苑裡鎮", "卓蘭鎮", "造橋鄉", "西湖鄉", "頭屋鄉", "公館鄉", "銅鑼鄉", "三義鄉", "大湖鄉", "獅潭鄉", "三灣鄉", "南庄鄉", "泰安鄉"],
  "彰化縣": ["彰化市", "員林市", "和美鎮", "鹿港鎮", "溪湖鎮", "二林鎮", "田中鎮", "北斗鎮", "花壇鄉", "芬園鄉", "大村鄉", "永靖鄉", "伸港鄉", "線西鄉", "福興鄉", "秀水鄉", "埔心鄉", "埔鹽鄉", "大城鄉", "芳苑鄉", "竹塘鄉", "社頭鄉", "二水鄉", "田尾鄉", "埤頭鄉", "溪州鄉"],
  "南投縣": ["南投市", "埔里鎮", "草屯鎮", "竹山鎮", "集集鎮", "名間鄉", "鹿谷鄉", "中寮鄉", "魚池鄉", "國姓鄉", "水里鄉", "信義鄉", "仁愛鄉"],
  "雲林縣": ["斗六市", "斗南鎮", "虎尾鎮", "西螺鎮", "土庫鎮", "北港鎮", "古坑鄉", "大埤鄉", "莿桐鄉", "林內鄉", "二崙鄉", "崙背鄉", "麥寮鄉", "東勢鄉", "褒忠鄉", "臺西鄉", "元長鄉", "四湖鄉", "口湖鄉", "水林鄉"],
  "嘉義市": ["東區", "西區"],
  "嘉義縣": ["太保市", "朴子市", "布袋鎮", "大林鎮", "民雄鄉", "溪口鄉", "新港鄉", "六腳鄉", "東石鄉", "義竹鄉", "鹿草鄉", "水上鄉", "中埔鄉", "竹崎鄉", "梅山鄉", "番路鄉", "大埔鄉", "阿里山鄉"],
  "屏東縣": ["屏東市", "潮州鎮", "東港鎮", "恆春鎮", "萬丹鄉", "長治鄉", "麟洛鄉", "九如鄉", "里港鄉", "鹽埔鄉", "高樹鄉", "萬巒鄉", "內埔鄉", "竹田鄉", "新埤鄉", "枋寮鄉", "新園鄉", "崁頂鄉", "林邊鄉", "南州鄉", "佳冬鄉", "琉球鄉", "車城鄉", "滿州鄉", "枋山鄉", "三地門鄉", "霧臺鄉", "瑪家鄉", "泰武鄉", "來義鄉", "春日鄉", "獅子鄉", "牡丹鄉"],
  "宜蘭縣": ["宜蘭市", "羅東鎮", "蘇澳鎮", "頭城鎮", "礁溪鄉", "壯圍鄉", "員山鄉", "冬山鄉", "五結鄉", "三星鄉", "大同鄉", "南澳鄉"],
  "花蓮縣": ["花蓮市", "鳳林鎮", "玉里鎮", "新城鄉", "吉安鄉", "壽豐鄉", "光復鄉", "豐濱鄉", "瑞穗鄉", "富里鄉", "秀林鄉", "萬榮鄉", "卓溪鄉"],
  "臺東縣": ["臺東市", "成功鎮", "關山鎮", "卑南鄉", "大武鄉", "太麻里鄉", "東河鄉", "長濱鄉", "鹿野鄉", "池上鄉", "綠島鄉", "延平鄉", "海端鄉", "達仁鄉", "金峰鄉", "蘭嶼鄉"],
  "澎湖縣": ["馬公市", "湖西鄉", "白沙鄉", "西嶼鄉", "望安鄉", "七美鄉"],
  "金門縣": ["金城鎮", "金沙鎮", "金湖鎮", "金寧鄉", "烈嶼鄉", "烏坵鄉"],
  "連江縣": ["南竿鄉", "北竿鄉", "莒光鄉", "東引鄉"],
  "其他(other)": ["其他區域"]
};

// 主路線名稱對照字典
const MAIN_ROUTE_NAMES = {
  "1": "玉山線",
  "2": "南橫三山-庫哈諾辛山/關山線",
  "28": "八通關線",
  "29": "南二段線",
  "30": "秀姑巒線",
  "31": "馬博拉斯橫斷線",
  "27": "新康山線",
  "32": "八通關越嶺線",
  "3": "瓦拉米線",
  "36": "其他路線"
};

// 次路線名稱對照字典
const SUB_ROUTE_NAMES = {
  "2": "2~5天(塔塔加 - 玉山線 - 塔塔加)",
  "3": "單日往返(塔塔加 - 玉山前峰 - 塔塔加)",
  "4": "單日往返(塔塔加 - 玉山西峰 - 塔塔加)"
};

function createPerson(defaultData = {}) {
  return {
    name: defaultData.name || "",
    tel: defaultData.tel || "",
    country: defaultData.country || "",
    city: defaultData.city || "",
    addr: defaultData.addr || "",
    mobile: defaultData.mobile || "",
    fax: defaultData.fax || "",
    email: defaultData.email || "",
    nation: defaultData.nation || "中華民國",
    sid: defaultData.sid || "",
    sex: defaultData.sex || "", // 1: 男, 2: 女
    birthday: defaultData.birthday || "",
    contactname: defaultData.contactname || "",
    contacttel: defaultData.contacttel || ""
  };
}

function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidMobile(mobile) {
  if (!mobile || typeof mobile !== "string") return false;
  const m = mobile.replace(/[-\s]/g, "");
  return /^09\d{8}$/.test(m) || /^\d{9,12}$/.test(m);
}

function isValidDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim());
}

// 計算日期加天數
function addDaysToDate(dateStr, days) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  d.setDate(d.getDate() + Number(days));
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// 檢驗是否年滿 18 歲（法定成年人）
function isAdult(birthdayStr, refDateStr) {
  if (!isValidDate(birthdayStr)) return false;
  const parts = birthdayStr.split("-");
  if (parts.length !== 3) return false;
  const birthYear = Number(parts[0]);
  const birthMonth = Number(parts[1]);
  const birthDay = Number(parts[2]);

  let ref = new Date();
  if (refDateStr && isValidDate(refDateStr)) {
    const rParts = refDateStr.split("-");
    if (rParts.length === 3) {
      ref = new Date(Number(rParts[0]), Number(rParts[1]) - 1, Number(rParts[2]));
    }
  }

  let age = ref.getFullYear() - birthYear;
  const m = (ref.getMonth() + 1) - birthMonth;
  if (m < 0 || (m === 0 && ref.getDate() < birthDay)) {
    age--;
  }
  return age >= 18;
}

// 依行程與天數動態產生宿營地列
function createQueueRows(startDate, sumday, isSingleDay, planDays) {
  if (isSingleDay || String(sumday) === "1") {
    return [
      {
        date: startDate,
        camp: "入山管制點（塔塔加）",
        capacity: 100,
        queueNum: 12,
        reviewNum: 8,
        approvedNum: 45,
        pref: "none",
        isSingle: true
      }
    ];
  }

  const daysCount = Math.max(2, Number(sumday) || 2);
  const nightsCount = daysCount - 1; // 需住宿晚數
  const rows = [];

  for (let i = 0; i < nightsCount; i++) {
    const curDate = addDaysToDate(startDate, i);
    let campName = "排雲山莊";
    let capacity = 136;
    let queueNum = 61;
    let reviewNum = 29;
    let approvedNum = 98;

    if (planDays && Array.isArray(planDays) && planDays[i] && planDays[i].length > 0) {
      const dayNodes = planDays[i];
      const lastNode = dayNodes[dayNodes.length - 1];
      if (lastNode === "圓峰山屋") {
        campName = "圓峰山屋";
        capacity = 15;
        queueNum = 18;
        reviewNum = 6;
        approvedNum = 12;
      } else if (lastNode === "圓峰營地") {
        campName = "圓峰營地";
        capacity = 9;
        queueNum = 10;
        reviewNum = 4;
        approvedNum = 8;
      } else if (lastNode === "排雲山莊") {
        campName = "排雲山莊";
        capacity = 136;
        queueNum = 61;
        reviewNum = 29;
        approvedNum = 98;
      }
    }

    rows.push({
      date: curDate,
      camp: campName,
      capacity: capacity,
      queueNum: queueNum,
      reviewNum: reviewNum,
      approvedNum: approvedNum,
      pref: "none",
      isSingle: false
    });
  }

  return rows;
}

thPage({
  data() {
    const qTeams = getParam("teams_name");
    const qMain = getParam("climblinemain");
    const qClimb = getParam("climbline");
    const qStart = getParam("applystart") || "2026-10-15";
    const qDays = getParam("sumday") || (qClimb === "3" || qClimb === "4" ? "1" : "2");

    const mainName = MAIN_ROUTE_NAMES[qMain] || "玉山線";
    const subName = SUB_ROUTE_NAMES[qClimb] || (qDays === "1" ? "單日往返(塔塔加 - 玉山前峰 - 塔塔加)" : "2~5天(塔塔加 - 玉山線 - 塔塔加)");
    const teamName = qTeams || "天眼1隊";

    // 計算離園日期
    const endStr = addDaysToDate(qStart, Math.max(0, Number(qDays) - 1));
    const isSingleDay = String(qDays) === "1" || subName.includes("單日往返");

    return {
      citiesData: TAIWAN_CITIES,
      activeNavIndex: 0,

      // 手風琴收合與展開狀態（預設全展開，但申請人需先勾同意書才顯示表單欄位）
      accordionOpen: {
        summary: true,
        apply: true,
        leader: true,
        member: true,
        stay: true,
        queue: true
      },

      // 隊員個別折疊狀態
      memberOpenStates: [],
      allMembersExpanded: true,

      // 1. 行程計畫摘要
      summary: {
        applystart: qStart,
        applyend: endStr,
        sumday: String(qDays),
        mainRoute: mainName,
        subRoute: subName,
        teams_name: teamName,
        climblinemain: qMain || "1",
        climbline: qClimb || (isSingleDay ? "3" : "2")
      },

      // 步驟三完整資料備份
      step3Data: null,

      // 2. 申請人資料（直接預先帶入測試資料，預設勾選同意書）
      applyConsent: true,
      applicant: createPerson({
        name: "王小明",
        tel: "02-23456789",
        country: "臺北市",
        city: "中正區",
        addr: "公園路1號",
        mobile: "0912345678",
        fax: "",
        email: "wang.sample@example.com",
        nation: "中華民國",
        sid: "A123456789",
        sex: "1",
        birthday: "1990-05-15",
        contactname: "王大同",
        contacttel: "0911000111"
      }),

      // 3. 領隊資料（預設勾選同申請人）
      leaderSame: true,
      leader: createPerson(),

      // 4. 隊員資料（預先帶入 2 名示範隊員）
      members: [
        createPerson({
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
        }),
        createPerson({
          name: "林美麗",
          tel: "04-22334455",
          country: "臺中市",
          city: "西屯區",
          addr: "臺灣大道三段99號",
          mobile: "0934567890",
          fax: "",
          email: "lin.sample@example.com",
          nation: "中華民國",
          sid: "B223456786",
          sex: "2",
          birthday: "1994-11-10",
          contactname: "林爸爸",
          contacttel: "0933000333"
        })
      ],
      memberOpenStates: [true, true],
      teamMax: 12,
      soloChecked: false, // cbOneMan 單人獨攀切結確認

      // 5. 留守人資料
      staySame: false,
      stay: {
        name: "李守護",
        mobile: "0988777666",
        fax: "",
        email: "stay.angel@example.com",
        birthday: "1985-03-25",
        nation: "中華民國",
        sid: "E123456787"
      },

      // 6. 宿營地預約查詢排隊狀況（與日期、天數動態連動，多日依天數產生逐日列，預設「不限」）
      isSingleDay: isSingleDay,
      queueRows: createQueueRows(qStart, qDays, isSingleDay, null),

      // 送件驗證碼（預先填入測試碼）
      captchaCode: "8F2K",
      captchaInput: "8F2K"
    };
  },

  computed: {
    applyCrumb() {
      return "玉山國家公園";
    },

    // 隊伍總人數（唯讀，領隊 1 人 + 隊員數）
    teamsCount() {
      return 1 + this.members.length;
    },

    // 是否為單人獨攀（1 人時 true，2 人以上 false）
    isSolo() {
      return this.teamsCount === 1;
    },

    // 取得當前作用中的領隊資料
    activeLeader() {
      return this.leaderSame ? this.applicant : this.leader;
    },

    // 取得當前作用中的留守人資料
    activeStay() {
      if (this.staySame) {
        return {
          name: this.applicant.name,
          mobile: this.applicant.mobile,
          fax: this.applicant.fax,
          email: this.applicant.email,
          birthday: this.applicant.birthday,
          nation: this.applicant.nation,
          sid: this.applicant.sid
        };
      }
      return this.stay;
    },

    // 檢驗申請人是否已滿 18 歲（法定成年人）
    isApplicantAdult() {
      if (!this.applicant.birthday) return true;
      return isAdult(this.applicant.birthday, this.summary.applystart);
    },

    // 檢驗領隊是否已滿 18 歲（法定成年人）
    isLeaderAdult() {
      const l = this.activeLeader;
      if (!l.birthday) return true;
      return isAdult(l.birthday, this.summary.applystart);
    },

    // 各區塊完成度驗證（補齊性別、生日、成年18歲、Email、手機格式檢核）
    secSummaryOk() {
      return !!this.summary.applystart && !!this.summary.teams_name;
    },

    secApplyOk() {
      if (!this.applyConsent) return false;
      return this.isPersonValid(this.applicant) && isAdult(this.applicant.birthday, this.summary.applystart);
    },

    secLeaderOk() {
      const leader = this.activeLeader;
      return this.isPersonValid(leader) && isAdult(leader.birthday, this.summary.applystart);
    },

    secMemberOk() {
      if (this.isSolo) {
        return this.soloChecked;
      }
      return (
        this.members.length > 0 &&
        this.members.every(m => this.isPersonValid(m))
      );
    },

    secStayOk() {
      if (this.staySame) {
        return this.secApplyOk;
      }
      const s = this.stay;
      return !!s.name.trim() && isValidMobile(s.mobile);
    },

    secQueueOk() {
      return this.queueRows.length > 0;
    },

    secCaptchaOk() {
      return (
        !!this.captchaInput &&
        this.captchaInput.trim().toUpperCase() === this.captchaCode
      );
    },

    // 側欄完成總數（排除行程計畫，純填寫卡片共 6 項）
    completedSectionsCount() {
      let c = 0;
      if (this.secApplyOk) c++;
      if (this.secLeaderOk) c++;
      if (this.secMemberOk) c++;
      if (this.secStayOk) c++;
      if (this.secQueueOk) c++;
      if (this.secCaptchaOk) c++;
      return c;
    },

    canSubmit() {
      return (
        this.secSummaryOk &&
        this.secApplyOk &&
        this.secLeaderOk &&
        this.secMemberOk &&
        this.secStayOk &&
        this.secQueueOk &&
        this.secCaptchaOk
      );
    }
  },

  mounted() {
    this.initFromStep3();
    this.restorePersonnelFromSession();
  },

  methods: {
    // 檢查人員物件必填與格式
    isPersonValid(p) {
      if (!p) return false;
      return (
        !!p.name && !!p.name.trim() &&
        !!p.tel && !!p.tel.trim() &&
        isValidMobile(p.mobile) &&
        isValidEmail(p.email) &&
        !!p.nation &&
        !!p.sid && !!p.sid.trim() &&
        !!p.sex &&
        isValidDate(p.birthday) &&
        !!p.country &&
        !!p.city &&
        !!p.addr && !!p.addr.trim() &&
        !!p.contactname && !!p.contactname.trim() &&
        !!p.contacttel && !!p.contacttel.trim()
      );
    },

    // 手風琴展開/收合
    toggleSection(secKey) {
      this.accordionOpen[secKey] = !this.accordionOpen[secKey];
    },

    // 全部隊員展開/收合
    toggleAllMembers() {
      this.allMembersExpanded = !this.allMembersExpanded;
      this.memberOpenStates = this.members.map(() => this.allMembersExpanded);
    },

    toggleMember(index) {
      if (this.memberOpenStates[index] === undefined) {
        this.memberOpenStates[index] = true;
      }
      this.memberOpenStates[index] = !this.memberOpenStates[index];
    },

    isMemberOpen(index) {
      return this.memberOpenStates[index] !== false;
    },

    // 重新產生 4 碼驗證碼
    refreshCaptcha() {
      const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
      let code = "";
      for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.captchaCode = code;
      this.captchaInput = "";
    },

    // 縣市變更時連動第一個鄉鎮市區
    onCountryChange(person) {
      const districts = this.citiesData[person.country] || [];
      person.city = districts.length > 0 ? districts[0] : "";
    },

    // 身分證第二碼自動帶入性別（限中華民國）
    onSidInput(person) {
      if (person.nation === "中華民國" && person.sid) {
        const s = person.sid.toUpperCase();
        if (s.length >= 2) {
          const second = s.charAt(1);
          if (["1", "A", "C"].includes(second)) {
            person.sex = "1"; // 男
          } else if (["2", "B", "D"].includes(second)) {
            person.sex = "2"; // 女
          }
        }
      }
    },

    scrollToSection(id, index) {
      this.activeNavIndex = index;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },

    addMember() {
      if (this.teamsCount >= this.teamMax) return;
      this.members.push(createPerson());
      this.memberOpenStates.push(true);
    },

    removeMember(index) {
      this.members.splice(index, 1);
      this.memberOpenStates.splice(index, 1);
    },

    // 示範情境：一鍵載入示範資料
    loadDemoData() {
      this.applyConsent = true;
      this.applicant = createPerson({
        name: "王小明",
        tel: "02-23456789",
        country: "臺北市",
        city: "中正區",
        addr: "公園路1號",
        mobile: "0912345678",
        fax: "",
        email: "wang.sample@example.com",
        nation: "中華民國",
        sid: "A123456789",
        sex: "1",
        birthday: "1990-05-15",
        contactname: "王大同",
        contacttel: "0911000111"
      });

      this.leaderSame = true;
      this.leader = createPerson();

      this.members = [
        createPerson({
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
        }),
        createPerson({
          name: "林美麗",
          tel: "04-22334455",
          country: "臺中市",
          city: "西屯區",
          addr: "臺灣大道三段99號",
          mobile: "0934567890",
          fax: "",
          email: "lin.sample@example.com",
          nation: "中華民國",
          sid: "B223456786",
          sex: "2",
          birthday: "1994-11-10",
          contactname: "林爸爸",
          contacttel: "0933000333"
        })
      ];
      this.memberOpenStates = [true, true];

      this.staySame = false;
      this.stay = {
        name: "李守護",
        mobile: "0988777666",
        fax: "",
        email: "stay.angel@example.com",
        birthday: "1985-03-25",
        nation: "中華民國",
        sid: "E123456787"
      };

      this.captchaInput = this.captchaCode;
      alert("已成功載入示範資料（申請人、領隊、2名隊員、留守人及驗證碼）。");
    },

    // 重設回空白初始狀態
    clearAllData() {
      if (!confirm("確定要重設回空白表單狀態嗎？")) return;
      this.applyConsent = false;
      this.applicant = createPerson();
      this.leaderSame = false;
      this.leader = createPerson();
      this.members = [];
      this.memberOpenStates = [];
      this.soloChecked = false;
      this.staySame = false;
      this.stay = {
        name: "",
        mobile: "",
        fax: "",
        email: "",
        birthday: "",
        nation: "中華民國",
        sid: ""
      };
      this.captchaInput = "";
      this.refreshCaptcha();
    },

    // 檢查是否有儲存的草稿
    checkExistingDraft() {
      try {
        const raw = localStorage.getItem("th_apply4_yushan_draft");
        if (raw) {
          const draft = JSON.parse(raw);
          if (draft && draft.savedAt) {
            this.hasDraftNotice = true;
            this.draftTime = draft.savedAt;
          }
        }
      } catch (e) {
        console.error("讀取草稿失敗", e);
      }
    },

    // 從 sessionStorage 載入步驟三資料並對齊行程與宿營地
    initFromStep3() {
      try {
        const raw = sessionStorage.getItem("th_apply_step3_payload");
        if (raw) {
          const step3 = JSON.parse(raw);
          this.step3Data = step3;
          if (step3.applystart) this.summary.applystart = step3.applystart;
          if (step3.sumday) this.summary.sumday = String(step3.sumday);
          if (step3.teams_name) this.summary.teams_name = step3.teams_name;
          if (step3.climblinemain) this.summary.climblinemain = step3.climblinemain;
          if (step3.climbline) this.summary.climbline = step3.climbline;
          if (step3.mainRouteName) this.summary.mainRoute = step3.mainRouteName;
          if (step3.subRouteName) this.summary.subRoute = step3.subRouteName;
          this.summary.applyend = addDaysToDate(this.summary.applystart, Math.max(0, Number(this.summary.sumday) - 1));
          this.isSingleDay = !!step3.isSingleDay || String(this.summary.sumday) === "1";

          // 動態產生逐日宿營地列
          this.queueRows = createQueueRows(
            this.summary.applystart,
            this.summary.sumday,
            this.isSingleDay,
            step3.planDays
          );
        }
      } catch (e) {
        console.error("載入步驟三資料失敗", e);
      }
    },

    // 暫存人員資料到 session（返回上一步或進入下一步皆自動保留）
    savePersonnelToSession() {
      try {
        const payload = {
          applyConsent: this.applyConsent,
          applicant: this.applicant,
          leaderSame: this.leaderSame,
          leader: this.leader,
          members: this.members,
          soloChecked: this.soloChecked,
          staySame: this.staySame,
          stay: this.stay
        };
        sessionStorage.setItem("th_apply_temp_personnel", JSON.stringify(payload));
      } catch (e) {
        console.error("儲存人員暫存失敗", e);
      }
    },

    // 自動恢復人員資料（4→5→4、4→3→4 完整保留無縫恢復）
    restorePersonnelFromSession() {
      try {
        let raw = sessionStorage.getItem("th_apply_temp_personnel");
        if (!raw) {
          raw = sessionStorage.getItem("th_apply_confirmed_payload");
        }
        if (raw) {
          const data = JSON.parse(raw);
          if (data.applyConsent !== undefined) this.applyConsent = data.applyConsent;
          if (data.applicant && (data.applicant.name || data.applicant.sid)) {
            this.applicant = data.applicant;
          }
          if (data.leaderSame !== undefined) this.leaderSame = data.leaderSame;
          if (data.leader && (data.leader.name || data.leader.sid)) {
            this.leader = data.leader;
          }
          if (Array.isArray(data.members) && data.members.length > 0) {
            this.members = data.members;
            this.memberOpenStates = data.members.map(() => true);
          }
          if (data.soloChecked !== undefined) this.soloChecked = data.soloChecked;
          if (data.staySame !== undefined) this.staySame = data.staySame;
          if (data.stay && (data.stay.name || data.stay.mobile)) {
            this.stay = data.stay;
          }
        }
      } catch (e) {
        console.error("恢復人員暫存失敗", e);
      }
    },

    // 儲存草稿機制（存入 localStorage 並提示可隨時恢復）
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
          step3: this.step3Data,
          applyConsent: this.applyConsent,
          applicant: this.applicant,
          leaderSame: this.leaderSame,
          leader: this.leader,
          members: this.members,
          soloChecked: this.soloChecked,
          staySame: this.staySame,
          stay: this.stay,
          queueRows: this.queueRows
        };

        localStorage.setItem("th_apply4_yushan_draft", JSON.stringify(draftData));
        this.hasDraftNotice = false;
        alert(`草稿已成功儲存（儲存時間：${timeStr}）！\n您可隨時至「草稿編輯」或於本頁恢復填寫進度。`);
      } catch (e) {
        alert("儲存草稿時發生錯誤：" + e.message);
      }
    },

    // 恢復草稿（僅恢復人員資料，絕不覆蓋當前申請的行程日期與宿營地點）
    restoreDraft() {
      try {
        const raw = localStorage.getItem("th_apply4_yushan_draft");
        if (!raw) {
          alert("查無已儲存的草稿資料。");
          return;
        }
        const draft = JSON.parse(raw);

        // 恢復人員資料
        if (draft.applicant) this.applicant = draft.applicant;
        if (draft.applyConsent !== undefined) this.applyConsent = draft.applyConsent;
        if (draft.leaderSame !== undefined) this.leaderSame = draft.leaderSame;
        if (draft.leader) this.leader = draft.leader;
        if (Array.isArray(draft.members)) {
          this.members = draft.members;
          this.memberOpenStates = this.members.map(() => true);
        }
        if (draft.soloChecked !== undefined) this.soloChecked = draft.soloChecked;
        if (draft.staySame !== undefined) this.staySame = draft.staySame;
        if (draft.stay) this.stay = draft.stay;

        // 若草稿中有宿營地偏好設定，保留其偏好選項，但日期與營地維持當前行程
        if (Array.isArray(draft.queueRows) && this.queueRows && this.queueRows.length > 0) {
          this.queueRows.forEach((r, idx) => {
            const match = draft.queueRows.find(d => d.camp === r.camp) || draft.queueRows[idx];
            if (match && match.pref) {
              r.pref = match.pref;
            }
          });
        }

        this.hasDraftNotice = false;
        this.savePersonnelToSession();
        alert(`已成功恢復草稿中的人員資料（儲存時間：${draft.savedAt}）！\n注意：行程日期與宿營地依當前申請行程為準。`);
      } catch (e) {
        alert("恢復草稿失敗：" + e.message);
      }
    },

    dismissDraftNotice() {
      this.hasDraftNotice = false;
    },

    // 上一步（保留已填資料並導回 apply-3）
    goPrev() {
      this.savePersonnelToSession();

      const q = new URLSearchParams(window.location.search);
      if (this.summary.applystart) q.set("applystart", this.summary.applystart);
      if (this.summary.sumday) q.set("sumday", this.summary.sumday);
      if (this.summary.teams_name) q.set("teams_name", this.summary.teams_name);
      if (this.summary.climblinemain) q.set("climblinemain", this.summary.climblinemain);
      if (this.summary.climbline) q.set("climbline", this.summary.climbline);

      window.location.href = `apply-3.html?${q.toString()}`;
    },

    // 下一步：嚴格檢核、儲存資料並進入步驟五「確認資料」
    goNext() {
      // 1. 檢核委託同意與申請人
      if (!this.applyConsent) {
        alert("請確認並勾選「申請人委託代理同意書」。");
        this.scrollToSection("sec-apply", 1);
        return;
      }
      if (!isAdult(this.applicant.birthday, this.summary.applystart)) {
        alert("申請人須年滿 18 歲（法定成年人），請確認出生日期。");
        this.scrollToSection("sec-apply", 1);
        return;
      }
      if (!this.secApplyOk) {
        alert("申請人資料尚未完整填寫或格式有誤，請確認必填欄位、Email 與手機格式。");
        this.scrollToSection("sec-apply", 1);
        return;
      }

      // 2. 檢核領隊
      if (!isAdult(this.activeLeader.birthday, this.summary.applystart)) {
        alert("領隊須年滿 18 歲，請確認領隊出生日期。");
        this.scrollToSection("sec-leader", 2);
        return;
      }
      if (!this.secLeaderOk) {
        alert("領隊資料尚未完整填寫或格式有誤，請確認領隊各欄位、Email 與手機格式。");
        this.scrollToSection("sec-leader", 2);
        return;
      }

      // 3. 檢核隊員與單人獨攀
      if (this.isSolo) {
        if (!this.soloChecked) {
          alert("請勾選單人獨攀注意事項。");
          this.scrollToSection("sec-member", 3);
          return;
        }
      } else {
        if (!this.secMemberOk) {
          alert("隊員資料尚未完整填寫或格式有誤，請確認各隊員資料、Email 與手機格式。");
          this.scrollToSection("sec-member", 3);
          return;
        }
      }

      // 4. 檢核留守人
      if (!this.secStayOk) {
        alert("留守人資料尚未完整填寫，姓名與手機為必填項。");
        this.scrollToSection("sec-stay", 4);
        return;
      }

      // 5. 檢核驗證碼
      if (!this.secCaptchaOk) {
        alert("請輸入正確的送件驗證碼。");
        this.scrollToSection("sec-captcha", 6);
        return;
      }

      // 暫存人員資料
      this.savePersonnelToSession();

      // 儲存至 sessionStorage 供步驟五確認頁（apply-5.html）渲染
      const payload = {
        summary: this.summary,
        step3: this.step3Data,
        applicant: this.applicant,
        leader: this.activeLeader,
        leaderSame: this.leaderSame,
        members: this.members,
        stay: this.activeStay,
        staySame: this.staySame,
        queueRows: this.queueRows,
        teamsCount: this.teamsCount,
        isSolo: this.isSolo
      };
      sessionStorage.setItem("th_apply_confirmed_payload", JSON.stringify(payload));

      const q = new URLSearchParams(window.location.search);
      if (this.summary.applystart) q.set("applystart", this.summary.applystart);
      if (this.summary.sumday) q.set("sumday", this.summary.sumday);
      if (this.summary.teams_name) q.set("teams_name", this.summary.teams_name);
      if (this.summary.climblinemain) q.set("climblinemain", this.summary.climblinemain);
      if (this.summary.climbline) q.set("climbline", this.summary.climbline);

      window.location.href = `apply-5.html?${q.toString()}`;
    }
  }
});
