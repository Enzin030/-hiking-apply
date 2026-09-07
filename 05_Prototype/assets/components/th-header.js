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

/* 主導覽項目。url 為 null＝本雛形尚未建置，一律出「待建置」標記，不給 `#` 假連結。 */
window.TH_HEADER_NAV = [
  { key: "bulletin", label: "公布欄", url: "news.html" },
  { key: "apply",    label: "登山申請", url: "apply-1.html" },
  { key: "notice",   label: "登山須知", url: "notice.html" },
  { key: "status",   label: "登山路線開放狀態", url: "open.html" },
  { key: "campsite", label: "宿營地與床位查詢", url: "campsite.html" },
  { key: "info",     label: "旅遊登山資訊", url: null },
];

/* 工具列項目（網站導覽／警特報／RSS） */
window.TH_HEADER_UTILITY = [
  { label: "網站導覽", url: null },
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
      if (e.key === "Escape") { self.menuOpen = false; self.langOpen = false; }
    };
    this._onClickOutside = function (e) {
      if (self.$refs.langWrapper && !self.$refs.langWrapper.contains(e.target)) {
        self.langOpen = false;
      }
    };
    document.addEventListener("keydown", this._onKey);
    document.addEventListener("mousedown", this._onClickOutside);
  },

  unmounted() {
    document.removeEventListener("keydown", this._onKey);
    document.removeEventListener("mousedown", this._onClickOutside);
    document.body.classList.remove("th-noscroll");
  },

  methods: {
    pickLang(key, closeDropdown) {
      this.currentLang = key;
      if (closeDropdown) this.langOpen = false;
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
              <button class="hover:text-[var(--national-700)] transition flex items-center gap-1.5 ml-1">
                <i class="ph-bold ph-magnifying-glass text-[length:var(--fs-md)] relative top-px"></i>
              </button>
            </div>

            <nav class="flex items-center gap-4" aria-label="主要導覽">
              <template v-for="n in nav" :key="n.key">
                <a v-if="n.url" :href="n.url"
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
            <span>選單</span>
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
                <a v-if="n.url" :href="n.url" :class="active === n.key ? 'is-active' : null">
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
