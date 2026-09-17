/* ============================================================
   th-header — 全站頁首（原 Shared.jsx 的 Header，含兩個互動）
   ------------------------------------------------------------
   互動一：**窄版就地展開的導覽**（.th-menubtn 切換 .th-header.is-nav-open）
   互動二：**語言下拉**（.th-lang-wrapper／.th-lang-dropdown）
   互動三：**主選單下拉**（.th-navsub／.th-navsub-dropdown）

   2026-09-14（批次 1）依設計師前台web 改寫互動一與三：
   - 窄版由「右側滑入抽屜（role=dialog／遮罩／鎖捲動）」改為**頁首往下就地展開**，
     子選單就地手風琴。抽屜宣告 aria-modal 卻沒有 focus trap，是名不副實的
     AA 缺陷；改成非 modal 之後那個問題不存在，不是修好、是不需要了。
   - 下拉改 Disclosure Pattern 的完整鍵盤行為：↓ 開啟並聚焦第一項、↑↓ 循環、
     Home／End 跳首尾、Esc 關閉並把焦點還給按鈕、Tab 移出自動關閉。
   - 桌機滑鼠移入展開、移出延遲 220ms 收合（WCAG 1.4.13「可停留」）。
     **不再以 focusin 自動展開**——那會把子項全部插進 Tab 序列
     （宿營地一項就多 11 站），與設計檔的鍵盤模型不同。
   - 補 aria-controls／aria-current、語系項目的 lang 屬性、外連的「另開新視窗」報讀文字。

   水平導覽在 ≥901px 呈現（2026-09-14 由 1280 下修，與設計檔同斷點）。
   901–1280 之間主導覽會**換行**成兩到三列、頁首因此變高，與設計檔行為相同
   （實測設計檔 1100 時頁首 110px、901 時 136px，兩者皆無水平溢位）。
   導覽字級（--fs-nav = 16px）不可改大：18px 在 1280 容器內塞不下同一行。

   ------------------------------------------------------------
   2026-09-07 階段 3.0：Tailwind 任意值已全部改為 tokens（18 處）
   ------------------------------------------------------------
     text-[#587a68]                       → text-[var(--national-700)]
     shadow-[0_2px_10px_rgba(0,0,0,0.05)] → .th-header-bar（components.css）
       ↑ **不可寫成 shadow-[var(--sh-header)]**：Tailwind 無法解析 shadow
         任意值內的 var()，會靜默產生 box-shadow: none。詳見 components.css
     text-[14px]／[15px]                  → text-[length:var(--fs-sm)]／(--fs-md)
     text-[16px]                          → text-[length:var(--fs-nav)]   ← 新增 token
     text-[10px]                          → text-[length:var(--fs-3xs)]   ← 新增 token
     w-[1px]／top-[1px]                   → w-px／top-px（Tailwind 內建，非任意值）

   兩個新增 token 的理由見 assets/css/tokens.css：既有字級階梯沒有 16px 與
   10px，而階段 3.0 的驗收是**視覺不變**，不能就近取 15px 或 18px。

   **字級一定要加 `length:` 型別提示**：Tailwind 無法從 `var()` 判斷那是顏色
   還是長度，寫 `text-[var(--fs-nav)]` 會被當成顏色而產生錯誤的 CSS。

   ------------------------------------------------------------
   全域副作用（併存期的重要限制）
   ------------------------------------------------------------
   本元件在 document 層綁 keydown（Esc 關閉）與 mousedown（點擊外部關閉語言
   下拉），並在選單開啟時對 body 加 .th-noscroll 鎖背景捲動。

   **同一頁不得同時存在 React 版 Header 與本元件**——會雙重綁定 document
   事件、兩邊互搶 body.th-noscroll。這是 app-boot.js 掛載契約「一頁一容器、
   全有全無」的由來（見 assets/app-boot.js 檔頭）。

   React 版用 useEffect(..., [menuOpen]) 每次開關都重綁；這裡改為 mounted
   綁一次、unmounted 解除，noscroll 另以 watch 處理——行為相同，但少了
   反覆增刪 listener。
   ============================================================ */

/* 主導覽項目。url 為 null＝本雛形尚未建置，一律出「待建置」標記，不給 `#` 假連結。

   children 存在＝該項只是子選單的展開觸發，**父項本身不可點**（因此不吃 url）：
   桌機滑鼠移入展開，行動版點一下就地縮排展開。子項的 url 走 news.html?tab=<key>，
   由 components/news.js 的 getInitialTab() 讀 ?tab= 決定初始頁籤，news.html 不必改。 */
window.TH_HEADER_NAV = [
  { key: "bulletin", label: "公布欄", children: [
    { key: "news",      label: "最新消息", url: "news_0.html" },
    { key: "violation", label: "違規名單", url: "news_5.html" },
    { key: "download",  label: "檔案下載", url: "news_6.html" },
    { key: "faq",       label: "常見問答", url: "news_7.html" },
  ] },
  { key: "apply", label: "登山申請", children: [
    { key: "apply_online", label: "各項線上申請", url: "apply-1.html" },
    { key: "apply_search", label: "申請進度查詢/繳費/異動/取消", url: "applySearch.html" },
    { key: "apply_draft",  label: "草稿編輯", url: null },
    { key: "apply_report", label: "國家公園出園回報", url: null },
  ] },
  { key: "notice", label: "登山須知", url: "notice.html" },
  { key: "status", label: "登山路線開放狀態", url: "open.html" },
  { key: "campsite", label: "宿營地與床位查詢", children: [
    { key: "forestry_camp",  label: "林業及自然保育署宿營地查詢", url: "campsite.html?org=forestry&kind=camp" },
    { key: "taroko_hut",     label: "太魯閣山屋查詢", url: "campsite.html?org=taroko&kind=hut" },
    { key: "taroko_route",   label: "太魯閣路線查詢", url: "campsite.html?org=taroko&kind=route" },
    { key: "sheipa_camp",    label: "雪霸宿營地查詢", url: "campsite.html?org=shei-pa&kind=camp" },
    { key: "sheipa_route",   label: "雪霸路線查詢", url: "campsite.html?org=shei-pa&kind=route" },
    { key: "yushan_camp",    label: "玉山宿營地查詢", url: "campsite.html?org=yushan&kind=camp" },
    { key: "yushan_oneday",  label: "玉山單日往返路線查詢", url: "campsite.html?org=yushan&kind=oneday" },
    { key: "yushan_lot",     label: "玉山抽籤結果查詢", url: "campsite.html?org=yushan&kind=lot" },
    { key: "yushan_lotdate", label: "玉山抽籤日期查詢", url: "campsite.html?org=yushan&kind=lotdate" },
    { key: "yushan_refund",  label: "玉山可申請退費日期查詢", url: "campsite.html?org=yushan&kind=refund" },
    { key: "forestry_area",  label: "林業及自然保育署區域申請及抽籤查詢", url: "campsite.html?org=forestry&kind=area" },
  ] },
  { key: "info", label: "旅遊登山資訊", children: [
    { key: "map2",        label: "登山路線圖資查詢", url: null },
    { key: "info_route",  label: "登山路線介紹", url: null },
    { key: "info_place",  label: "景點資訊", url: "information_place.html" },
    { key: "info_cwa",    label: "各縣市天氣預報", url: "information_2.html" },
    { key: "info_cwa_np", label: "國家公園天氣資訊", url: "information_3.html" },
    { key: "info_cctv",   label: "即時影像觀看", url: "information_4.html" },
    { key: "info_level",  label: "國家公園步道分級", url: "information_6.html" },
    { key: "info_terms",  label: "雙語詞彙", url: "information_8.html" },
  ] },
];

/* 工具列項目（網站導覽／本站使用說明／警特報／RSS） */
window.TH_HEADER_UTILITY = [
  { label: "網站導覽", url: "sitemap.html" },
  { label: "本站使用說明", url: "web_illustrate.html" },
  { label: "警特報",   url: "https://www.cwa.gov.tw/V8/C/P/Warning/FIFOWS.html", external: true },
  { label: "RSS",     url: "rss.html" },
];

/* 可選語系定義 */
window.TH_LANGUAGES = [
  { key: "zh-TW", label: "繁體中文" },
  { key: "en",    label: "English" },
  { key: "ja",    label: "日本語" },
];

window.thComponents = window.thComponents || {};
window.thComponents["th-header"] = {
  props: {
    active: { type: String, default: "" },
    /* skipLink：頁面自己已有「跳至主要內容」時關掉本元件這一條。
       2026-09-14 使用者裁決：index-b.html 自有 skip link 指向 #services，
       而該頁沒有 th-page-shell、也就沒有 #main，本元件的 skip link 在那裡
       是死連結（按了焦點會掉到頁首或消失，AA 檢測會抓）。 */
    skipLink: { type: Boolean, default: true },
  },

  data() {
    return {
      menuOpen: false,    // 窄版：頁首往下就地展開
      langOpen: false,
      navOpen: "",        // 目前展開的主選單 key（桌機下拉與窄版手風琴共用）
      canHover: true,     // 裝置是否支援 hover（觸控裝置為 false，改用點擊展開）
      currentLang: "zh-TW",
      nav: window.TH_HEADER_NAV,
      utility: window.TH_HEADER_UTILITY,
      languages: window.TH_LANGUAGES,
    };
  },

  computed: {
    currentLangObj() {
      var self = this;
      return this.languages.find(function (l) { return l.key === self.currentLang; }) || this.languages[0];
    },

    /* 目前網址的「檔名＋查詢字串」，用來標記子選單的 aria-current="page" */
    here() {
      return {
        file: window.location.pathname.split("/").pop() || "index.html",
        query: window.location.search.replace(/^\?/, ""),
      };
    },

    /* 目前這一頁對應的子選單項目 key（全站唯一一個） */
    currentChildKey() {
      var here = this.here, exact = null, sameFile = null;
      this.nav.forEach(function (group) {
        (group.children || []).forEach(function (c) {
          if (!c.url) return;
          var parts = c.url.split("?");
          if (parts[0] !== here.file) return;
          if ((parts[1] || "") === here.query) { if (!exact) exact = c.key; }
          if (!sameFile) sameFile = c.key;
        });
      });
      return exact || sameFile;
    },
  },

  mounted() {
    var self = this;

    this._onKey = function (e) {
      if (e.key !== "Escape") return;
      /* 按鈕與選單上的 keydown 已經處理過的 Esc 不再處理一次：
         那些處理器都呼叫了 preventDefault，沒擋掉的話這裡會接著往外關一層
         （實測窄版按 Esc 收子選單，會連整個展開的導覽一起關掉）。 */
      if (e.defaultPrevented) return;
      /* 由內而外關，每一層都把焦點還給觸發它的按鈕 */
      if (self.langOpen) { self.closeLang(true); return; }
      if (self.navOpen) { self.closeNav(true); return; }
      if (self.menuOpen) { self.closeMenu(true); }
    };

    this._onClickOutside = function (e) {
      if (self.langOpen && self.$refs.langWrapper && !self.$refs.langWrapper.contains(e.target)) {
        self.closeLang(false);
      }
      if (self.navOpen && !e.target.closest(".th-navsub")) self.closeNav(false);
    };

    document.addEventListener("keydown", this._onKey);
    document.addEventListener("mousedown", this._onClickOutside);

    /* 觸控裝置沒有 hover：`(hover: hover)` 為 false 時改用點擊展開。
       用 matchMedia 而非 UA 判斷，混合裝置（觸控筆電、外接滑鼠的平板）
       接上或拔掉指標裝置時會即時切換，change 事件收得到。 */
    this._hoverMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    this.canHover = this._hoverMq.matches;
    this._onHoverMq = function (e) { self.canHover = e.matches; self.navOpen = ""; };
    this._hoverMq.addEventListener("change", this._onHoverMq);

    /* 窄版斷點與 CSS 的 900px 同一個值：跨過斷點時把展開狀態清乾淨，
       否則桌機留下的 navOpen 會在窄版變成一個已展開的手風琴。 */
    this._narrowMq = window.matchMedia("(max-width: 900px)");
    this._onNarrowMq = function () { self.navOpen = ""; self.menuOpen = false; };
    this._narrowMq.addEventListener("change", this._onNarrowMq);
  },

  unmounted() {
    document.removeEventListener("keydown", this._onKey);
    document.removeEventListener("mousedown", this._onClickOutside);
    if (this._hoverMq) this._hoverMq.removeEventListener("change", this._onHoverMq);
    if (this._narrowMq) this._narrowMq.removeEventListener("change", this._onNarrowMq);
    clearTimeout(this._navTimer);
  },

  methods: {
    isNarrow() { return this._narrowMq ? this._narrowMq.matches : false; },

    /* ── 互動一：窄版就地展開 ──────────────────────────────── */
    toggleMenu() { this.menuOpen ? this.closeMenu(false) : (this.menuOpen = true); },

    closeMenu(focusBtn) {
      this.menuOpen = false;
      this.navOpen = "";
      if (focusBtn && this.$refs.menuBtn) this.$refs.menuBtn.focus();
    },

    /* ── 互動三：主選單下拉 ────────────────────────────────── */
    navMenuId(key) { return "th-navmenu-" + key; },
    navBtnId(key) { return "th-navbtn-" + key; },

    navLinks(key) {
      var menu = this.$el.querySelector("#" + this.navMenuId(key));
      return menu ? Array.prototype.slice.call(menu.querySelectorAll("a[href]")) : [];
    },

    openNav(key, focusFirst) {
      this.navOpen = key;
      var self = this;
      this.$nextTick(function () {
        self.positionNav(key);
        if (focusFirst) {
          var links = self.navLinks(key);
          if (links.length) links[0].focus();
        }
      });
    },

    closeNav(focusBtn) {
      var key = this.navOpen;
      if (!key) return;
      this.navOpen = "";
      if (focusBtn) {
        var btn = this.$el.querySelector("#" + this.navBtnId(key));
        if (btn) btn.focus();
      }
    },

    /* 子選單超出視窗右緣時改為右對齊（設計檔的 .is-right） */
    positionNav(key) {
      if (this.isNarrow()) return;
      var menu = this.$el.querySelector("#" + this.navMenuId(key));
      if (!menu) return;
      menu.classList.remove("is-right");
      if (menu.getBoundingClientRect().right > window.innerWidth - 8) menu.classList.add("is-right");
    },

    onNavClick(key, e) {
      /* 桌機滑鼠已因 hover 展開時，再點標題不該把它關掉（常見誤操作）。
         e.detail === 0 代表是鍵盤 Enter／Space 觸發的 click，仍照常切換。 */
      var byMouse = e && e.detail > 0;
      if (byMouse && this.canHover && !this.isNarrow() && this.navOpen === key) return;
      this.navOpen === key ? this.closeNav(false) : this.openNav(key, false);
    },

    onNavBtnKey(e, key) {
      if (e.key === "ArrowDown") { e.preventDefault(); this.openNav(key, true); }
      else if (e.key === "Escape" && this.navOpen === key) { e.preventDefault(); this.closeNav(true); }
    },

    onNavMenuKey(e, key) {
      var list = this.navLinks(key);
      if (!list.length) return;
      var idx = list.indexOf(document.activeElement);
      if (e.key === "Escape") { e.preventDefault(); this.closeNav(true); }
      else if (e.key === "ArrowDown") { e.preventDefault(); list[(idx + 1) % list.length].focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); list[(idx - 1 + list.length) % list.length].focus(); }
      else if (e.key === "Home") { e.preventDefault(); list[0].focus(); }
      else if (e.key === "End") { e.preventDefault(); list[list.length - 1].focus(); }
    },

    /* 焦點離開整個項目才關（父項與子項之間移動不算離開） */
    onNavFocusOut(e, key) {
      if (this.navOpen === key && !e.currentTarget.contains(e.relatedTarget)) this.navOpen = "";
    },

    /* 桌機 hover：移入開啟、移出延遲 220ms 才收合，游標才來得及移進選單
       （WCAG 1.4.13「可停留」）。**不收 focusin**：Tab 不應自動展開子選單，
       否則子項會全部插進 Tab 序列（宿營地一項就多 11 站）。 */
    onNavEnter(key) {
      if (!this.canHover || this.isNarrow()) return;
      clearTimeout(this._navTimer);
      this.openNav(key, false);
    },

    onNavLeave() {
      if (!this.canHover || this.isNarrow()) return;
      var self = this;
      clearTimeout(this._navTimer);
      this._navTimer = setTimeout(function () { self.navOpen = ""; }, 220);
    },

    /* 子項是不是目前這一頁（設計檔以 aria-current="page" 標記）。
       規則：檔名＋查詢字串完全相同者優先；網址沒帶查詢字串時（例如直接開
       news.html，頁面自己會落在第一個頁籤），退而標記同檔名的第一個子項。
       用 computed 一次算完，避免同檔名的多個頁籤同時被標記。 */
    isCurrentChild(child) {
      return !!child.key && child.key === this.currentChildKey;
    },

    /* ── 互動二：語言下拉 ──────────────────────────────────── */
    langItems() {
      var menu = this.$refs.langMenu;
      return menu ? Array.prototype.slice.call(menu.querySelectorAll("button")) : [];
    },

    openLang(focusFirst) {
      this.langOpen = true;
      var self = this;
      this.$nextTick(function () {
        if (focusFirst) {
          var list = self.langItems();
          if (list.length) list[0].focus();
        }
      });
    },

    closeLang(focusBtn) {
      this.langOpen = false;
      if (focusBtn && this.$refs.langBtn) this.$refs.langBtn.focus();
    },

    onLangBtnKey(e) {
      if (e.key === "ArrowDown") { e.preventDefault(); this.openLang(true); }
      else if (e.key === "Escape" && this.langOpen) { e.preventDefault(); this.closeLang(true); }
    },

    onLangMenuKey(e) {
      var list = this.langItems();
      if (!list.length) return;
      var idx = list.indexOf(document.activeElement);
      if (e.key === "Escape") { e.preventDefault(); this.closeLang(true); }
      else if (e.key === "ArrowDown") { e.preventDefault(); list[(idx + 1) % list.length].focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); list[(idx - 1 + list.length) % list.length].focus(); }
      else if (e.key === "Home") { e.preventDefault(); list[0].focus(); }
      else if (e.key === "End") { e.preventDefault(); list[list.length - 1].focus(); }
    },

    onLangFocusOut(e) {
      if (this.langOpen && this.$refs.langWrapper && !this.$refs.langWrapper.contains(e.relatedTarget)) {
        this.langOpen = false;
      }
    },

    pickLang(key) {
      this.currentLang = key;
      this.closeLang(true);
    },
  },

  template: `
    <header class="th-header th-header-bar" :class="{ 'is-nav-open': menuOpen }">
      <!-- 無障礙骨架（2026-09-14）：Tab 前兩站固定為「跳至主要內容 → 上方導盲磚」。
           放在 header 內而非 header 前，是為了不讓本元件變成多根節點；
           header 是 sticky，已是兩者的定位基準。#main 由 th-page-shell 提供。 -->
      <a v-if="skipLink" class="th-skip-link" href="#main">跳至主要內容</a>
      <a class="th-accesskey" id="AU" href="#AU" accesskey="U"
         title="快速鍵 Alt+U：上方選單連結區" aria-label="上方選單連結區（快速鍵 Alt+U）"><span aria-hidden="true">:::</span></a>

      <div class="th-header-inner">

        <!--
          站名是全站識別（wordmark），不是各頁主標題——頁面主標題是 th-page-shell 的 h1。
          用 <a> 而非帶 click 的 div，兼顧鍵盤可聚焦與單一 h1 的語意。
        -->
        <a href="index.html" class="th-brand" aria-label="臺灣登山申請一站式服務網 首頁">
          <img src="assets/logo-mark.png" alt="國家公園署" class="th-logo" />
          <span class="th-wordmark"><span class="th-wordmark-lead">臺灣<span class="th-accent">登山申請</span></span>一站式服務網</span>
        </a>

        <!-- 窄版（≤900px）：就地展開／收合，不是抽屜，所以沒有 aria-haspopup="dialog" -->
        <button type="button" class="th-menubtn" ref="menuBtn"
                :aria-expanded="menuOpen ? 'true' : 'false'" aria-controls="th-header-nav"
                :aria-label="menuOpen ? '收合選單' : '展開選單'" @click="toggleMenu">
          <i class="fa-solid fa-bars" aria-hidden="true"></i>
        </button>

        <div class="th-header-right" id="th-header-nav">

          <div class="th-utility">
            <template v-for="u in utility" :key="u.label">
              <a v-if="u.url" :href="u.url"
                 :target="u.external ? '_blank' : null"
                 :rel="u.external ? 'noopener noreferrer' : null"
                 class="th-utility-link">{{ u.label }}<span v-if="u.external" class="th-sr-only">（另開新視窗）</span></a>
              <th-todo-link v-else :label="u.label"></th-todo-link>
              <span class="th-divider" aria-hidden="true"></span>
            </template>

            <!-- 互動二：語言下拉 -->
            <div class="th-lang-wrapper" ref="langWrapper" @focusout="onLangFocusOut">
              <button type="button" class="th-lang-btn" ref="langBtn" id="th-lang-btn"
                      @click="langOpen ? closeLang(false) : openLang(false)"
                      @keydown="onLangBtnKey"
                      :aria-expanded="langOpen ? 'true' : 'false'" aria-haspopup="true"
                      aria-controls="th-lang-list">
                <i class="fa-solid fa-globe" aria-hidden="true"></i>
                <!-- 顯示「語言」而非目前語系：目前語系由選單內的勾號與
                     aria-current 表達（設計檔的作法），按鈕本身維持固定寬度。 -->
                <span>語言</span>
                <span class="th-sr-only">（目前：{{ currentLangObj.label }}）</span>
                <i :class="['fa-solid fa-angle-down th-caret', { 'rotate-180': langOpen }]" aria-hidden="true"></i>
              </button>
              <div v-if="langOpen" class="th-lang-dropdown" id="th-lang-list" ref="langMenu"
                   aria-labelledby="th-lang-btn" @keydown="onLangMenuKey">
                <!-- 每個語系項目都要帶 lang（WCAG 3.1.2）：少了它，報讀器會用中文語音
                     硬唸「English」「日本語」。目前語系另加 aria-current。 -->
                <button v-for="lang in languages" :key="lang.key" type="button"
                        :lang="lang.key === 'zh-TW' ? 'zh-Hant-TW' : lang.key"
                        :class="['th-lang-item', { 'is-active': currentLang === lang.key }]"
                        :aria-current="currentLang === lang.key ? 'true' : null"
                        @click="pickLang(lang.key)">
                  <span>{{ lang.label }}</span>
                  <i v-if="currentLang === lang.key" class="fa-solid fa-check th-lang-tick" aria-hidden="true"></i>
                </button>
              </div>
            </div>

            <span class="th-divider" aria-hidden="true"></span>
            <!-- 雛形無後端，送出只擋掉預設行為 -->
            <form class="th-hdrsearch" role="search" @submit.prevent>
              <input type="search" name="q" class="th-hdrsearch-input" placeholder="搜尋"
                     aria-label="搜尋站內內容" />
              <button type="submit" class="th-hdrsearch-btn" aria-label="搜尋">
                <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
              </button>
            </form>
          </div>

          <nav class="th-nav" aria-label="主要導覽">
            <template v-for="n in nav" :key="n.key">
              <!-- 有 children：父項只負責展開，不可點 -->
              <div v-if="n.children" class="th-navsub" :class="{ 'is-active': active === n.key }"
                   @mouseenter="onNavEnter(n.key)" @mouseleave="onNavLeave()"
                   @focusout="onNavFocusOut($event, n.key)">
                <button type="button" class="th-navsub-btn" :id="navBtnId(n.key)"
                        :class="active === n.key ? 'is-current' : null"
                        @click="onNavClick(n.key, $event)" @keydown="onNavBtnKey($event, n.key)"
                        :aria-expanded="navOpen === n.key ? 'true' : 'false'" aria-haspopup="true"
                        :aria-controls="navMenuId(n.key)">
                  {{ n.label }}
                  <i :class="['fa-solid fa-angle-down th-caret', { 'rotate-180': navOpen === n.key }]" aria-hidden="true"></i>
                </button>
                <div v-if="navOpen === n.key" class="th-navsub-dropdown" :id="navMenuId(n.key)"
                     :aria-labelledby="navBtnId(n.key)" @keydown="onNavMenuKey($event, n.key)">
                  <div class="th-navsub-panel">
                    <template v-for="c in n.children" :key="c.key">
                      <a v-if="c.url" :href="c.url" class="th-navsub-item"
                         :aria-current="isCurrentChild(c) ? 'page' : null">{{ c.label }}</a>
                      <th-todo-link v-else :label="c.label" extra-class="th-navsub-item"></th-todo-link>
                    </template>
                  </div>
                </div>
              </div>
              <a v-else-if="n.url" :href="n.url" class="th-navlink"
                 :class="active === n.key ? 'is-current' : null"
                 :aria-current="active === n.key ? 'page' : null">{{ n.label }}</a>
              <th-todo-link v-else :label="n.label" extra-class="th-todo-link-nav th-navlink"></th-todo-link>
            </template>
          </nav>

        </div>
      </div>
    </header>
  `,
};
