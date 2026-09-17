# 臺灣登山申請一站式服務網 — 前台 web

由 `首頁-單檔版.html`（React + Babel + Tailwind CDN 原型）轉換而成的**純靜態網站架構**，
外掛（vendor）應用方式與 `後台web` 完全一致，可離線執行、可直接交付工程師接後端。

---

## 一、目錄結構

```
web/
├── index.html            首頁
├── news.html             最新消息（查詢＋表格＋分頁）
├── route.html            登山路線介紹 — 版型示意版（兩層頁籤＋行程／交通表格）
├── information.html      登山路線介紹 — 完整內容版（比照現行網站 information_1.aspx）
├── _template.html        內頁樣板 ← 新增頁面請複製此檔
├── README.md             本文件
├── ACCESSIBILITY.md      無障礙 AA 稽核報告與維護規範
│
├── css/                  專案樣式（載入順序固定，勿調換）
│   ├── tokens.css        ① 設計變數：色彩／字級／圓角／陰影／漸層
│   ├── base.css          ② 重置、元素預設、無障礙輔助類
│   ├── layout.css        ③ 容器與版面工具類（取代 Tailwind）
│   ├── components.css    ④ 全站共用元件
│   └── home.css          ⑤ 首頁專用（僅 index.html 載入）
│
├── js/
│   ├── scripts.js        全站共用程式（flatpickr 初始化、選單、共用工具）
│   ├── home.js           首頁專用（跑馬燈無縫循環）
│   ├── tabs.js           頁籤共用（WAI-ARIA，支援鍵盤 ← → Home End）
│   ├── jquery.min.js     jQuery 3.x
│   └── all.min.js        Font Awesome 5.15.4 Free（JS 版，與後台web 同版本）
│
├── img/
│   ├── favicon.png       國家公園署識別標誌（88×88，同時作為 header／footer logo）
│   ├── hero-bg.jpg       首頁背景照片 ★ 需替換為高解析版本（見第六節）
│   ├── yushan-overview.jpg 玉山國家公園步道全圖（1600×1131，取自現行網站並縮圖）
│   ├── logo.svg          （既有）
│   ├── mark.svg          （既有）
│   ├── famoalogo.png     （既有）
│   └── loginbg.png       （既有）
│
└── vendor/               第三方外掛（與後台web 同版本）
    ├── bootstrap/        Bootstrap 5（css + bundle js）
    ├── bootstrap-icons/  Bootstrap Icons（含 woff/woff2）
    ├── flatpicker/       flatpickr + 繁體中文語系
    └── swiper/           Swiper（輪播，目前首頁未使用，保留供內頁）
```

> 底線開頭的 `_template.html` 代表「非實際頁面」，上線部署時不需要。

---

## 二、與單檔版的差異（轉換對照）

| 項目 | 單檔版原型 | 本架構 |
|------|-----------|--------|
| 框架 | React 18 + Babel standalone（瀏覽器即時編譯） | 純靜態 HTML |
| 樣式 | Tailwind CDN + 內嵌 `<style>` | 本地 CSS 五支檔案 |
| 圖示 | Font Awesome 6 CDN + Phosphor CDN | 本地 `js/all.min.js`（Font Awesome **5.15.4**） |
| 圖片 | base64 內嵌於 HTML | 實體檔案於 `img/` |
| 網路需求 | 必須連外（CDN） | 僅字型連 Google Fonts，其餘全離線 |
| 檔案大小 | 單檔 118 KB | HTML 約 12 KB，資源可被瀏覽器快取 |

### ⚠ 圖示語法一律使用 Font Awesome 5

本地 `js/all.min.js` 是 **Font Awesome 5.15.4**（與 `後台web` 同一份），
**不認得 FA6 的 `fa-solid` / `fa-regular` 寫法**，必須使用 FA5 的 `fas` / `far` / `fab`。
原型中的 FA6 與 Phosphor 圖示已全數換算如下（新增頁面請沿用右欄寫法）：

| 原型（FA6 / Phosphor CDN） | 本架構（FA5 本地） | 用於 |
|---|---|---|
| `fa-solid fa-house` | `fas fa-home` | 麵包屑首頁 |
| `fa-solid fa-magnifying-glass` / `ph-bold ph-magnifying-glass` | `fas fa-search` | 搜尋 |
| `ph ph-globe` | `fas fa-globe` | 語言 |
| `fa-solid fa-scale-balanced` | `fas fa-balance-scale` | 法令資訊 |
| `fa-solid fa-list-check` | `fas fa-tasks` | 登山建議裝備清單 |
| `fa-solid fa-triangle-exclamation` | `fas fa-exclamation-triangle` | 山坡地經常管制區 |
| `fa-solid fa-location-crosshairs` | `fas fa-crosshairs` | 生態保護區事故熱點 |
| `fa-solid fa-pen-to-square` | `fas fa-edit` | 登山申請 |
| `fa-solid fa-user-xmark` | `fas fa-user-times` | 違規名單 |
| `fa-solid fa-circle-question` | `fas fa-question-circle` | 常見問題 |
| `fa-solid fa-signs-post` | `fas fa-map-signs` | 登山路線開放狀態 |
| `fa-solid fa-book-open-reader` | `fas fa-book-reader` | 登山須知 |
| `fa-solid fa-circle-info` | `fas fa-info-circle` | 底部操作列提示 |
| `fa-solid fa-circle-check` | `fas fa-check-circle` | 摘要卡已完成項目 |
| `fa-regular fa-calendar` | `far fa-calendar-alt` | 日期欄位 |

其餘同名圖示（`fa-cloud-sun`、`fa-mountain`、`fa-helicopter`、`fa-bed`、`fa-compass`、
`fa-bullhorn`、`fa-briefcase-medical`、`fa-calendar-check`、`fa-clipboard-list`、
`fa-arrow-right`、`fa-angle-left/right`、`fa-bars`）僅需把 `fa-solid` 改成 `fas`。

**另一個限制**：FA5 的 JS 版是把 `<i>` 替換成 `<svg>`，**不提供 icon 字型**，
因此 CSS 的 `::before` 無法使用 Font Awesome。步驟條「已完成」的勾勾
（`.th-step.is-done .th-step-num::before`）已改用 `bootstrap-icons` 字型的 `\f26e`。
若日後要在 CSS 偽元素放圖示，請一律使用 `bootstrap-icons`。

若團隊決定升級至 Font Awesome 6，請**前後台一起換**，並把上表反向改回 `fa-solid` 寫法。

---

## 三、新增一個頁面

1. 複製 `_template.html`，另存為新檔名（例：`apply-1.html`）
2. 修改 `<title>` 與 `.th-page-title`
3. 在 `.th-nav` 中標示位置：無子選單的項目加 `class="active"`；
   有子選單的項目在 `.th-navitem` 加 `is-active`，並在對應子項加 `aria-current="page"`
4. 修改 `.th-crumb` 麵包屑
5. 不需要的區塊（步驟條 `.th-stepper`／右側摘要卡 `.th-sidebar`／底部操作列 `.th-footbar`）整段刪除
   ※ 三個導盲磚（`#AU`/`#AC`/`#AZ`）屬必要項目，**不可刪除**
6. 若有頁面專屬樣式／程式，新增 `css/<page>.css`、`js/<page>.js` 並於該頁載入

**header 與 footer 為全站共用且採靜態複製**，修改時請同步 `index.html`、`_template.html`
及所有已建立的頁面。改接後端樣板（PHP include／.NET Layout／Razor `_Layout.cshtml`）時，
直接把這兩段搬進母版即可。

---

## 四、設計系統（css/tokens.css）

全站**禁止寫死色碼**，一律引用 CSS 變數。

### 主要色彩

| 變數 | 色值 | 用途 |
|------|------|------|
| `--national-700` | `#587a68` | 品牌主色（國家公園識別綠），主按鈕、連結 hover、強調 |
| `--national-700-hover` | `#456353` | 主按鈕 hover |
| `--btn-blue` | `#3b5f8f` | 次要 CTA |
| `--footer` | `#243447` | 頁尾底色 |
| `--sub-footer` | `#334155` | 頁尾版權帶 |
| `--panel-edu-bg` | `#2d4b3e` | 首頁左面板標頭 |
| `--panel-apply-bg` | `#35484d` | 首頁右面板標頭 |

其餘尚有：`--slate-50 ~ 900`（中性灰階）、`--fg-1~4`（文字層級）、
`--bg-1~3`／`--bg-mist*`（背景與薄霧）、`--success-*`／`--info-*`／`--warning-*`／`--danger-*`（狀態）、
`--park-*`（各管理機關色碼，供公告標籤分色使用）。

### 字體與字級

- 中文無襯線：`--font-sans` → Noto Sans TC（內文、按鈕、選單）
- 中文襯線：`--font-serif` → Noto Serif TC（品牌字樣、面板標題、頁尾標題）
- 字級：`--fs-display 34px` / `--fs-h1 30` / `--fs-h2 26` / `--fs-h3 22` /
  `--fs-lg 19` / `--fs-md 16`（內文）/ `--fs-sm 15` / `--fs-xs 14` / `--fs-xxs 13`

> **字級規範**：全站最小字級為 `--fs-xxs` **13px**，符合「不得小於 12px」的要求。
> CSS 內**不再寫死 px 字級**，一律引用上列變數；日後要整體縮放只需改 `tokens.css` 這 9 個值。

### 版面節奏（2026-09 調整）

內頁上下留白已整體收緊，避免大片空白；主要數值：

| 位置 | 調整後 |
|------|--------|
| 頁首上下內距 | 8px（變數 `--header-pad-y`，主選單作用中底線依此對齊頁首下緣） |
| 麵包屑上下內距 | 10px |
| 頁面標題下距 | 16px |
| 查詢卡內距／下距 | 18px 22px／16px |
| 查詢欄位與按鈕高度 `--field-h` | 44px（同一排對齊） |
| 表格列內距 | 11px（表頭）／12px（資料列） |
| 卡片內距 `.th-card-pad` | 22px 24px |
| 頁籤下距 | 主頁籤 14px／次頁籤 16px |
| 內容區塊 `.th-block` 下距 | 22px |
| 頁面底部留白 | 40px |
| 頁尾上內距／版權帶 | 36px／14px |

### 圓角與陰影

`--r-xs 4` / `--r-sm 6` / `--r-md 8`（輸入框、按鈕）/ `--r-lg 12` / `--r-xl 16`（卡片）/
`--r-2xl 20`（首頁面板）/ `--r-pill`；
表單欄位高度 `--field-h 44px`（查詢卡的輸入框、下拉、按鈕共用，確保同一排完全對齊）；
陰影 `--sh-header` / `--sh-card` / `--sh-sm` / `--sh-md` / `--sh-lg` / `--sh-xl`。

---

## 五、共用元件速查（css/components.css）

所有共用元件一律 `th-` 前綴，避免與 Bootstrap 衝突。

| 元件 | 主要 class | 說明 |
|------|-----------|------|
| 頁首 | `.th-header` > `.th-header-inner` > `.th-brand` ＋ `.th-header-right`（`.th-utility` ＋ `.th-nav`） | 內頁用；目前頁面在 `.th-nav a` 加 `.active` |
| 手機選單鈕 | `.th-nav-toggle[data-nav-toggle]` | 900px 以下顯示，由 `scripts.js` 控制 `.is-nav-open` |
| 全站搜尋 | `.th-utility-search`（`<form>` > `<input type="search">` ＋ `<button type="submit">`） | 位於頁首輔助列，膠囊型輸入框＋綠色搜尋鈕 |
| 導盲磚 | `.th-accesskey`（`-dark` 深色底／`-hero` 照片底） | 無障礙定位點「:::」，每頁三個：`#AU` Alt+U／`#AC` Alt+C／`#AZ` Alt+Z，寫法見 ACCESSIBILITY.md |
| 語言選單 | `.th-lang[data-lang-menu]` > `button[aria-expanded]` ＋ `.th-lang-menu` | 繁體中文／English／日本語；由 `scripts.js` 的 `initLangMenu()` 控制，支援 ↓↑ Home End Esc、點外部關閉 |
| 主選單下拉 | `.th-navitem[data-nav-menu]` > `.th-navbtn[aria-expanded]` ＋ `.th-navmenu` | 由 `scripts.js` 的 `initNavMenus()` 控制；桌機 hover 展開、窄版就地展開；所在區塊在 `.th-navitem` 加 `is-active`，目前頁面在子項加 `aria-current="page"` |
| 麵包屑 | `.th-crumb`、`.th-crumb-current` | |
| 步驟條 | `.th-stepper` > `.th-step`（`.is-done`／`.is-current`）＋ `.th-step-line`（`.is-done`） | `.is-done` 會以 CSS `::before` 顯示勾勾 |
| 區塊標題 | `.th-section-title`、`.th-section-title-sub` | 左側 4px 綠色標線 |
| 按鈕 | `.th-btn` ＋ `.th-btn-primary`／`-secondary`／`-ghost`；尺寸 `.th-btn-lg`／`-sm`／`-block` | |
| 卡片 | `.th-card`、`.th-card-pad` | |
| 頁面容器 | `.th-page` > `.th-page-inner`、`.th-page-title` | |
| 右側摘要卡 | `.th-sidebar`、`-head`、`-body`、`-row`（`.lbl`／`.val`）、`-checklist`（`.is-ok`） | 1100px 以下自動取消 sticky |
| 底部操作列 | `.th-footbar`、`-info`、`-actions` | sticky 於視窗底部 |
| 頁尾 | `.th-footer`、`-top`、`-about`、`-links`、`-band` | |
| 查詢卡 | `.th-search` > Bootstrap `.row.g-3.align-items-end` ＋ 最後一欄 `.col-lg-auto` > `.th-search-actions` | 薄霧綠底；**按鈕與查詢欄位同一排**，高度由 `--field-h` 統一；≤991px 欄位堆疊、按鈕等分滿版 |
| 列表工具列 | `.th-listbar`、`-count`、`-actions`、`-link` | 左筆數、右次要連結（歷史消息／RSS／官網） |
| 資料表格 | `.th-table-wrap` > `.th-table-scroll` > `.th-table` | 欄位輔助類 `.td-title`／`.td-date`／`.td-num`／`.td-center`／`.td-nowrap`；`th.col-narrow` 為窄欄 |
| 空資料 | `.th-table-empty` | 查無資料時取代 table |
| 置頂公告 | `tr.is-pinned` ＋ 標題前的 `.th-pin` | 淺霧綠底列＋紅色「置頂」標記；後端須把置頂項排在最前面 |
| 路線圖 | `.th-figure` > `img` ＋ `figcaption`；未取得圖檔時用 `.th-figure-todo` | information.html 用 |
| 每日行程 | `p.th-block-text.th-itinerary` ＋ `.th-day` | 「第N天」綠色標籤，白字對比 4.77:1 |
| 標籤徽章 | `.th-badge` ＋ `-yushan`／`-sheipa`／`-taroko`／`-forestry`／`-police`／`-npa`／`-open`／`-info`／`-warn` | 發布單位與狀態，色碼取自 `--park-*` |
| 頁籤 | `.th-tabs` > `.th-tab`（第一層）、`.th-subtabs` > `.th-subtab`（第二層）、`.th-tabpanel` | 由 `js/tabs.js` 驅動，tablist 加 `data-tabs` |
| 分頁 | `.th-pager`（`.is-current`／`.is-disabled`／`.th-pager-ellipsis`） | |
| 內容區塊 | `.th-block`、`.th-block-title`、`.th-block-text` | 頁籤面板內的小節（路線介紹／建議行程／對外交通） |
| 重點數據 | `.th-facts` > `.th-fact`（`-label`／`-value`） | 里程、天數、海拔等數據列 |

### 版面工具類（css/layout.css）

Bootstrap 的 `.row`／`.col-*`／`.g-*`／表單元件**可正常使用**；
`layout.css` 只補足 Bootstrap 沒有而版型需要的部分：

- 容器：`.th-container`（1280px）、`.th-container-md`（1152px，首頁用）
- 骨架：`.th-shell`（flex sticky footer，頁尾永遠貼底）
- 格線：`.th-grid-panels`（首頁雙面板，900px 以下轉單欄）、
  `.th-grid-tiles`（功能鈕 4 欄 → 手機 2 欄）、
  `.th-grid-aside`（主內容 + 320px 右欄，1100px 以下轉單欄）
- flex／gap／間距／顯示控制工具類，皆 `th-` 前綴

### 表格的手機版行為

`.th-table` 在 **≤700px** 會自動由表格轉為卡片式堆疊，欄名取自每個 `<td>` 的
`data-label` 屬性，因此**後端輸出每一個 `<td>` 時都必須帶 `data-label`**，例如：

```html
<td data-label="發布日期" class="td-date">2026-09-08</td>
```

標題欄（`.td-title`）在窄版會自動隱藏欄名並放大為卡片主標，不需另外處理。

### 頁籤的 HTML 結構

```html
<div class="th-tabs" role="tablist" data-tabs aria-label="管理機關">
  <button type="button" class="th-tab" role="tab" id="tab-yu"
          aria-controls="panel-yu" aria-selected="true">玉山國家公園管理處</button>
  …
</div>
<div class="th-tabpanel" role="tabpanel" id="panel-yu" aria-labelledby="tab-yu" hidden>…</div>
```

第二層只要把 `.th-tabs`／`.th-tab` 換成 `.th-subtabs`／`.th-subtab`，其餘屬性完全相同；
`js/tabs.js` 會自動接管所有帶 `data-tabs` 的 tablist（含巢狀），不需額外初始化。
預設開啟哪一個頁籤，由 `aria-selected="true"` 決定。

---

## 六、待工程師處理事項

1. **背景照片解析度**
   `img/hero-bg.jpg` 由原型的 base64 解出，實際只有 **512 × 286 px**，
   放大到全螢幕會模糊。請向設計端索取原始高解析檔（建議 2560 × 1440、
   另出 WebP 與手機版裁切圖，以 `<picture>` 依 breakpoint 切換）。

2. **Logo 檔案**
   目前 header／footer 皆使用 `img/favicon.png`（88×88 PNG）。
   若有向量原檔，建議改用 `img/logo.svg` 以取得更佳銳利度。

3. **首頁動態資料串接**
   HTML 中以下註解標示了後端迴圈輸出位置：

   ```html
   <!-- ↓↓↓ 後端迴圈輸出區（最新公告）↓↓↓ -->
   <!-- ↓↓↓ 後端迴圈輸出區（功能入口）↓↓↓ -->
   <!-- ↓↓↓ 後端迴圈輸出區（服務入口）↓↓↓ -->
   ```

   **跑馬燈只需輸出一份 `<a>`**，`js/home.js` 會在前端自動複製第二份
   （並加上 `aria-hidden` 避免螢幕報讀器重複朗讀）以達成無縫循環。

4. **尚未建立的頁面**
   首頁已連結但尚未製作：`apply-1.html`（登山申請）、`forest-camp-1.html`（宿營地及床位查詢）。
   其餘入口目前皆為 `href="#"`，待頁面完成後補上實際路徑。

5. **route.html 與 information.html 的關係**

   兩頁都是「登山路線介紹」，用途不同，請依團隊決定保留其一或並存：

   | | `route.html` | `information.html` |
   |---|---|---|
   | 定位 | **版型示意版** | **完整內容版** |
   | 內容 | 每機關一條示範路線，其餘為精簡面板 | 33 條路線全數比照現行網站 |
   | 路線圖 | 無 | 僅玉山全區圖（其餘為待補提示框） |
   | 行數 | 約 920 行 | 約 1,640 行 |

   `information.html` 的文字內容擷取自現行網站 `hike.taiwan.gov.tw/information_1.aspx`，
   **上線前仍須改由後端輸出**，並請各管理處確認內容是否為最新版本。

6. **information.html 的路線圖**

   依需求只放第一張「玉山全區圖」（`img/yushan-overview.jpg`）。
   原站圖檔為 5457×3859／3.5MB，本版已縮為 **1600×1131／513KB** 以利網頁載入；
   若需更高解析度（或提供點擊放大），請向玉管處索取原始檔。
   其餘 36 處原本有路線圖的位置，已放置 `.th-figure-todo` 虛線提示框並於 HTML 註解
   記錄原始圖檔名（例：`<!-- 原站此處有路線圖：images/ys_01玉山_群峰線-中.jpg -->`），
   取得圖檔後把提示框換成 `.th-figure` 即可。

7. **news.html／route.html 的示意資料**
   兩頁的內容取自現行網站（`hike.taiwan.gov.tw` 的 `news_0.aspx`、`information_1.aspx`）作為版型示意，
   **上線前必須全部改由後端輸出**：

   - `news.html`：資料列在 `<!-- ↓↓↓ 後端迴圈輸出區（最新消息）↓↓↓ -->` 之間；
     筆數與分頁（`.th-listbar-count`、`.th-pager`）需由後端計算。
   - `route.html`：三個管理機關的**路線頁籤名稱已依現行網站完整列出**（玉山 8 條、太魯閣 16 條、雪霸 9 條）。
     每個機關只做了一個「示範路線」的完整面板（玉山群峰線、奇萊主北峰、雪東線），
     其餘路線面板為精簡版並標示「本路線內容由後端帶入」，請比照示範路線的結構補齊。
   - 標示 `.th-placeholder` 的文字（如「（由後端帶入）」）交付時應全數移除。
   - 玉山群峰線的里程、行程與交通內容僅為版型示意，**實際數值請以各管理處提供為準**。

8. **字型來源**
   Noto Sans TC／Noto Serif TC 目前由 Google Fonts 載入。
   若政府機關內網不得連外，請下載字型檔置於 `vendor/fonts/` 並改為 `@font-face` 本地載入。

9. **Swiper**
   已納入 vendor 但首頁未使用，保留供內頁輪播；確定不需要時可自 vendor 移除。

---

## 七、開發規範

- 命名：共用元件與工具類一律 `th-` 前綴；狀態類用 `is-` 前綴（`is-done`、`is-current`、`is-nav-open`）
- CSS 載入順序固定為 **vendor → tokens → base → layout → components → 頁面專用**，勿調換
- 顏色、字級、圓角、陰影一律引用 `tokens.css` 變數，不得寫死
- 頁面專屬樣式／程式請另開檔案，勿寫入 `components.css`、`scripts.js`
- 無障礙：全站已通過 **WCAG 2.1 AA**，詳細規範與檢測結果見 **ACCESSIBILITY.md**。
  修改樣式或新增頁面前請務必先讀該文件，特別是：
  - 顏色一律引用 `tokens.css` 變數，勿自行寫死色碼（會破壞對比）
  - 邊框用 `--border-ui`（非 `--slate-300`），文字最小 `--fs-xxs` 13px
  - 每頁保留 `.th-skip-link`、三個導盲磚（`#AU`/`#AC`/`#AZ`）、唯一 `h1`、標題不跳階
  - 裝飾性圖示加 `aria-hidden="true"`；純圖示按鈕加 `aria-label`
  - 不得寫 `outline: none`；`transition` 不得使用 `all`（會延遲焦點框）
  - 實心按鈕若以 `<a>` 實作，`:hover` 必須連 `color` 一起寫，否則會被
    `tokens.css` 的 `a:hover` 蓋掉而掉色（詳見 ACCESSIBILITY.md）
- 瀏覽器支援：Chrome／Edge／Safari 最新版；建議解析度 1440 × 960 以上
