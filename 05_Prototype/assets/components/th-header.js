/* ============================================================
   th-header — 全站頁首（原 Shared.jsx 的 Header，含兩個互動）
   ------------------------------------------------------------
   互動一：**選單面板**（.th-menubtn／.th-menumask／.th-menupanel）
   互動二：**語言下拉**（.th-lang-wrapper／.th-lang-dropdown）

   水平導覽只在 xl（≥1280px）以上呈現——六個項目加上三個「待建置」標記後，
   1280 容器內僅容得下一行 16px 文字，再窄就會把站名擠掉。
   xl 以下改用收合選單（含手機，原本手機完全沒有導覽入口）。
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
    { key: "news",      label: "最新消息", url: "news.html?tab=news" },
    { key: "violation", label: "違規名單", url: "news.html?tab=violation" },
    { key: "download",  label: "檔案下載", url: "news.html?tab=download" },
    { key: "faq",       label: "常見問答", url: "news.html?tab=faq" },
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
    { key: "info_place",  label: "景點資訊", url: null },
    { key: "info_cwa",    label: "各縣市天氣預報", url: null },
    { key: "info_cwa_np", label: "國家公園天氣資訊", url: null },
    { key: "info_cctv",   label: "即時影像觀看", url: null },
    { key: "info_level",  label: "國家公園步道分級", url: "information_6.html" },
    { key: "info_terms",  label: "雙語詞彙", url: null },
  ] },
];

/* 工具列項目（網站導覽／警特報／RSS） */
window.TH_HEADER_UTILITY = [
  { label: "網站導覽", url: "sitemap.html" },
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
  props: { active: { type: String, default: "" } },

  data() {
    return {
      menuOpen: false,
      langOpen: false,
      navOpen: "",        // 桌機：目前展開子選單的 nav key（滑鼠移入／鍵盤聚焦）
      mobileSubOpen: "",  // 行動版：目前就地展開的 nav key
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
  },

  watch: {
    // 選單開啟時鎖背景捲動
    menuOpen(open) {
      document.body.classList[open ? "add" : "remove"]("th-noscroll");
    },
  },

  mounted() {
    var self = this;
    this._onKey = function (e) {
      if (e.key === "Escape") {
        self.menuOpen = false; self.langOpen = false; self.navOpen = "";
      }
    };
    this._onClickOutside = function (e) {
      if (self.$refs.langWrapper && !self.$refs.langWrapper.contains(e.target)) {
        self.langOpen = false;
      }
      /* 觸控裝置靠點擊展開，就必須靠點擊外部收合——滑鼠裝置有 mouseleave，不需要 */
      if (!self.canHover && self.navOpen && !e.target.closest(".th-navsub")) {
        self.navOpen = "";
      }
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
  },

  unmounted() {
    document.removeEventListener("keydown", this._onKey);
    document.removeEventListener("mousedown", this._onClickOutside);
    if (this._hoverMq) this._hoverMq.removeEventListener("change", this._onHoverMq);
    document.body.classList.remove("th-noscroll");
  },

  methods: {
    pickLang(key, closeDropdown) {
      this.currentLang = key;
      if (closeDropdown) this.langOpen = false;
    },

    /* 桌機子選單：滑鼠移入展開，但鍵盤族沒有 hover，所以同時收 focusin。
       focusout 要確認焦點真的離開整個 wrapper 才關，否則在父項與子項之間
       移動焦點會被自己關掉。 */
    onNavFocusOut(e, key) {
      if (!e.currentTarget.contains(e.relatedTarget) && this.navOpen === key) {
        this.navOpen = "";
      }
    },

    /* 觸控裝置（無 hover）：點父項展開／收合。滑鼠裝置不介入，
       否則已由 mouseenter 開啟的選單會被同一次點擊立刻關掉。 */
    onNavToggle(key) {
      if (this.canHover) return;
      this.navOpen = this.navOpen === key ? "" : key;
    },

    /* 行動版子選單：就地縮排展開，一次只開一個 */
    toggleMobileSub(key) {
      this.mobileSubOpen = this.mobileSubOpen === key ? "" : key;
    },
  },

  template: `
    <header class="w-full bg-white sticky top-0 z-50 th-header-bar border-b border-slate-100 py-3">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap justify-between items-center gap-y-2">

          <!--
            站名是全站識別（wordmark），不是各頁主標題——頁面主標題是 th-page-shell 的 h1。
            用 <a> 而非帶 click 的 div，兼顧鍵盤可聚焦與單一 h1 的語意。
            行動版：拿掉 shrink-0、縮小字級並允許換行，避免撐寬 documentElement。
          -->
          <a href="index.html"
             class="flex items-center min-w-0 shrink lg:shrink-0 hover:opacity-90 transition"
             aria-label="臺灣登山申請一站式服務網 首頁">
            <img src="assets/logo-mark.png" alt="國家公園署" class="h-10 sm:h-14 lg:h-16 w-auto shrink-0 mr-2 sm:mr-3" />
            <span class="font-serif font-extrabold text-base sm:text-xl lg:text-2xl text-slate-800 tracking-wide mt-1 min-w-0 lg:whitespace-nowrap">
              <span class="text-lg sm:text-2xl lg:text-3xl">臺灣<span class="text-[var(--national-700)]">登山申請</span></span>一站式服務網
            </span>
          </a>

          <!-- 桌機（≥1280px）：工具列 ＋ 水平主導覽 -->
          <div class="flex-col items-end gap-3 hidden xl:flex">
            <div class="flex items-center gap-3 text-[length:var(--fs-sm)] text-slate-500">
              <template v-for="u in utility" :key="u.label">
                <a v-if="u.url" :href="u.url"
                   :target="u.external ? '_blank' : null"
                   :rel="u.external ? 'noopener noreferrer' : null"
                   class="hover:text-[var(--national-700)] transition">{{ u.label }}</a>
                <th-todo-link v-else :label="u.label"></th-todo-link>
                <div class="w-px h-3 bg-slate-300"></div>
              </template>

              <!-- 互動二：語言下拉 -->
              <div class="th-lang-wrapper" ref="langWrapper">
                <button type="button" class="th-lang-btn hover:text-[var(--national-700)] transition"
                        @click="langOpen = !langOpen"
                        :aria-expanded="langOpen ? 'true' : 'false'" aria-haspopup="true">
                  <i class="ph ph-globe text-[length:var(--fs-sm)] relative top-px"></i>
                  <span>{{ currentLangObj.label }}</span>
                  <i :class="['fa-solid fa-chevron-down text-[length:var(--fs-3xs)] transition-transform', { 'rotate-180': langOpen }]"></i>
                </button>
                <div v-if="langOpen" class="th-lang-dropdown">
                  <button v-for="lang in languages" :key="lang.key" type="button"
                          :class="['th-lang-item', { 'is-active': currentLang === lang.key }]"
                          @click="pickLang(lang.key, true)">
                    <span>{{ lang.label }}</span>
                    <i v-if="currentLang === lang.key" class="fa-solid fa-check text-xs text-[var(--national-700)]"></i>
                  </button>
                </div>
              </div>

              <div class="w-px h-3 bg-slate-300"></div>
              <!-- 雛形無後端，送出只擋掉預設行為 -->
              <form class="th-hdrsearch" role="search" @submit.prevent>
                <input type="search" name="q" class="th-hdrsearch-input" placeholder="搜尋"
                       aria-label="搜尋站內內容" />
                <button type="submit" class="th-hdrsearch-btn" aria-label="搜尋">
                  <i class="ph-bold ph-magnifying-glass text-[length:var(--fs-md)] relative top-px"></i>
                </button>
              </form>
            </div>

            <nav class="flex items-center gap-6" aria-label="主要導覽">
              <template v-for="n in nav" :key="n.key">
                <!-- 有 children：父項只展開、不可點；滑鼠移入或鍵盤聚焦皆可開 -->
                <div v-if="n.children" class="th-navsub"
                     @mouseenter="canHover && (navOpen = n.key)"
                     @mouseleave="canHover && (navOpen = '')"
                     @focusin="navOpen = n.key" @focusout="onNavFocusOut($event, n.key)">
                  <button type="button" @click="onNavToggle(n.key)"
                          :class="['th-navsub-btn font-medium transition text-[length:var(--fs-nav)] whitespace-nowrap',
                                   active === n.key ? 'text-[var(--national-700)]' : 'text-slate-600 hover:text-[var(--national-700)]']"
                          :aria-expanded="navOpen === n.key ? 'true' : 'false'" aria-haspopup="true">
                    {{ n.label }}
                    <i :class="['fa-solid fa-chevron-down text-[length:var(--fs-3xs)] transition-transform', { 'rotate-180': navOpen === n.key }]"></i>
                  </button>
                  <!-- 外層只負責留出銜接距離（透明），白卡在內層：
                       兩者之間不能有空隙，否則滑鼠往下移會先觸發 mouseleave 把選單關掉 -->
                  <div v-if="navOpen === n.key" class="th-navsub-dropdown">
                    <div class="th-navsub-panel">
                      <template v-for="c in n.children" :key="c.key">
                        <a v-if="c.url" :href="c.url" class="th-navsub-item">{{ c.label }}</a>
                        <th-todo-link v-else :label="c.label" extra-class="th-navsub-item"></th-todo-link>
                      </template>
                    </div>
                  </div>
                </div>
                <a v-else-if="n.url" :href="n.url"
                   :class="['font-medium transition text-[length:var(--fs-nav)] whitespace-nowrap',
                            active === n.key ? 'text-[var(--national-700)]' : 'text-slate-600 hover:text-[var(--national-700)]']">
                  {{ n.label }}
                </a>
                <th-todo-link v-else :label="n.label"
                              extra-class="th-todo-link-nav text-[length:var(--fs-nav)] whitespace-nowrap"></th-todo-link>
              </template>
            </nav>
          </div>

          <!-- xl 以下：收合按鈕（互動一的開啟入口） -->
          <button type="button" class="th-menubtn xl:hidden" @click="menuOpen = true"
                  aria-haspopup="dialog" :aria-expanded="menuOpen ? 'true' : 'false'" aria-label="開啟選單">
            <i class="ph-bold ph-list"></i>
          </button>
        </div>
      </div>

      <!-- 互動一：選單面板 -->
      <div v-if="menuOpen" class="th-menumask" @click="menuOpen = false">
        <div class="th-menupanel" role="dialog" aria-modal="true" aria-label="網站選單" @click.stop>
          <div class="th-menupanel-head">
            <span>選單</span>
            <button type="button" @click="menuOpen = false" aria-label="關閉選單">
              <i class="ph-bold ph-x"></i>
            </button>
          </div>

          <nav class="th-menunav" aria-label="主要導覽">
            <ul>
              <li v-for="n in nav" :key="n.key">
                <!-- 有 children：點父項就地展開，子項縮排列出 -->
                <template v-if="n.children">
                  <button type="button" class="th-menunav-toggle"
                          :class="mobileSubOpen === n.key ? 'is-open' : null"
                          @click="toggleMobileSub(n.key)"
                          :aria-expanded="mobileSubOpen === n.key ? 'true' : 'false'">
                    {{ n.label }}
                    <i :class="['fa-solid fa-chevron-down transition-transform', { 'rotate-180': mobileSubOpen === n.key }]"></i>
                  </button>
                  <div v-if="mobileSubOpen === n.key" class="th-menunav-sub">
                    <template v-for="c in n.children" :key="c.key">
                      <a v-if="c.url" :href="c.url">
                        {{ c.label }}<i class="fa-solid fa-angle-right"></i>
                      </a>
                      <th-todo-link v-else :label="c.label" extra-class="th-menunav-todo"></th-todo-link>
                    </template>
                  </div>
                </template>
                <a v-else-if="n.url" :href="n.url" :class="active === n.key ? 'is-active' : null">
                  {{ n.label }}<i class="fa-solid fa-angle-right"></i>
                </a>
                <th-todo-link v-else :label="n.label" extra-class="th-menunav-todo"></th-todo-link>
              </li>
            </ul>
          </nav>

          <div class="th-menuutil">
            <template v-for="u in utility" :key="u.label">
              <a v-if="u.url" :href="u.url"
                 :target="u.external ? '_blank' : null"
                 :rel="u.external ? 'noopener noreferrer' : null">{{ u.label }}</a>
              <th-todo-link v-else :label="u.label"></th-todo-link>
            </template>
            <div class="w-full mt-2 pt-2 border-t border-slate-100">
              <div class="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1">
                <i class="ph ph-globe"></i> 語言 / Language
              </div>
              <div class="th-menu-lang-options">
                <button v-for="lang in languages" :key="lang.key" type="button"
                        :class="['th-menu-lang-btn', { 'is-active': currentLang === lang.key }]"
                        @click="pickLang(lang.key, false)">
                  <span>{{ lang.label }}</span>
                  <i v-if="currentLang === lang.key" class="fa-solid fa-check text-xs"></i>
                </button>
              </div>
            </div>
            <button type="button" class="mt-2">
              <i class="ph-bold ph-magnifying-glass"></i> 搜尋
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
};
