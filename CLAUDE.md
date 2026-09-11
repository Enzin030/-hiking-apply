# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

**臺灣登山申請一站式服務網（115 國家公園入園擴充）** — UI 雛形 / Prototype。

**現行架構：多頁靜態 HTML ＋ Vue 3 global build ＋ Tailwind CDN，零 build step。**
無後端、無 npm、無打包工具、無測試框架。以本機靜態伺服器直接開啟（必須經 HTTP）。

## 工作原則

1. 計畫與範圍紀律見 `institution\core.md` §3.1、§3.2、§3.5。
2. 不確定的業務規則依 `institution\core.md` §3.4 處理：標 `[待確認]`（**不是** `[待訪談]`），不猜測、不虛構。
3. 禁用 Emoji：所有 mockup、UI 與文件不使用系統內建 Emoji（🏕️、⏳ 等）。Icon 一律用
   FontAwesome（`<i class="fa-solid fa-mountain"></i>`）或 Phosphor Icons。
4. Git commit message 用繁體中文，格式如 `feat: 增加登入頁面`、`docs: 更新 PRD 規格`。
5. 改完 UI 要用瀏覽器實際跑過再回報（程序見 `institution\core.md` §3.3），不以「程式碼看起來對」代替驗證。
   **驗收要檢查哪些項目，依下面「任務模式」該模式的規定**，不是每種任務都一樣。
6. 介面走極簡：強調資訊層級、留白，減少視覺雜訊。

## 任務模式（接到任務先判斷是哪一種）

本專案有三種任務模式，**規則與驗收各不相同**。動手前先確定自己在哪一模式，
不要把別的模式的界線套過來。判斷不出來就問使用者。

### 模式 1　遷移／清理（階段 4 剩餘工作）

- **界線**：與改版前行為相同。
  **看到可以改善也不要改**，記入 `decisions.md` 當候選。**不為統一而動 DOM。**
  （完整敘述見踩坑總表第四節「遷移期的兩條界線」，那兩條**只在本模式適用**。）
- **驗收**：像素、computed、console 三件並行，與改版前完全相同。

### 模式 2　改畫面（有意的變更）

- **模式 1 的兩條界線在這裡不適用。要求什麼就改什麼**，
  不因為「這樣會讓比對出現差異」而縮手——本模式本來就沒有「與改版前相同」這個安全網。
- **安全網改由使用者指定的「不能動什麼」提供。**
  收到改畫面任務時，**若使用者沒有講「不能動什麼」，先問，不要自行假設範圍。**
- **只給了感覺**（太擠、看起來不對）而沒給具體做法時，**先回報打算怎麼改，等確認再動手**。
- **驗收**（五項全做，不必使用者逐次重述）：
  1. **改動範圍外的頁面**——像素與 computed 與改動前完全相同。
     **基準快照必須在編輯前擷取**，動手後才想比對就無從比起。
     **每次擷取前先等掛載完成**：`window.thApp && !document.querySelector('#th-app[v-cloak]')`。
     導覽後立刻截圖會拍到掛載前的畫面（實測首頁拍到 `{{ m.text }}` 等樣板字串），
     基準與改後各拍到不同時點就會產生整批假差異，而假差異與真失敗長得一樣。
     **捲動一律用自動化工具的輸入動作**，背景分頁裡 `window.scrollTo` 不發 scroll 事件。
     細節與實測見踩坑總表第三之三節。
  2. **改動頁本身**——列出實際變動的元素清單，確認變的只有預期那些。
     不要用「元素數 > N」當門檻（理由見下面「開新頁的標準流程」末段）。
  3. console 零 error、零 4xx。
  4. 樣式照「樣式歸屬」四層，**不新增硬編碼 hex、不新增 `!important`**。
  5. 需要新 token 或新元件就**列出並說明理由，不需事前核准**。
     **本條為專案層明示，優先於 `institution\core.md` §3.2「未點名不動」**
     （依 core.md §0，專案層指令檔勝過正本）——但僅限「為完成被點名的改動所必需的
     token／元件」，不含順手改別的東西。

### 模式 3　開新頁

- 從 `template/page.html` 起手，照下面「開新頁的標準流程」六步走，不另立規則。

## 專案知識路由

| 要找什麼 | 去哪 |
|---|---|
| 工作規則正本（語言、執行紀律、驗證程序、資料夾慣例） | `C:\Users\enzin.GIS\.agents\institution\core.md`（session 自動載入，不必重讀） |
| 領域詞彙、角色、業務規則 | `D:\OneDrive - 天眼衛星科技股份有限公司\_knowledge\projects\國家公園入園擴充\index.md`（**正本**） |
| 架構決策紀錄 | 根目錄 `decisions.md`（一行一筆） |
| 規格文件 | `02_Spec/`（尚無定稿） |
| 早期規劃草稿（PRD、實作方針、DB 清單、UI/UX 提案、簡報稿） | `.scratch/docs-舊規劃/`——**不進版控**，僅供回查 |
| 雛形（頁面、元件、樣式、圖檔） | `05_Prototype/` |
| 來源資料、機關提供檔案 | `01_Raw_Input/` |
| 規格書 | `02_Spec/` |
| 資料表結構 | `03_Schema/` |
| 機關端往來文件（公文、報價、申請單） | `..\「楊庚翊」的檔案 - 115國家公園登山\`（OneDrive 共用資料夾，**在 repo 之外**） |

## 關鍵路徑

- 雛形一律放 `05_Prototype/`，repo 根目錄不再放頁面檔
- 入口：`05_Prototype/index.html`；申請流程 `apply-1/2/3.html`；林場露營 `forest-camp-1/2.html`
- **Vue 3 全域建構，無 build**（2026-09-09 階段 3 完成，32/32 頁已遷移）：
  共用元件 `05_Prototype/assets/components/th-*.js`；每頁的狀態與初始化
  `05_Prototype/components/<頁名>.js`（呼叫 `thPage({...})`）；掛載由
  `assets/app-boot.js` 統一負責，**契約六條寫在該檔檔頭，動頁面前先讀**。
- `05_Prototype/components/*.jsx` 是**已停用的舊 React 版**（檔頭皆有 `// DEPRECATED`），
  零 `<script>` 引用，排在階段 4 刪除。**不要從它們起手，也不要修改它們。**
- 樣式見下面「樣式歸屬」一節
- 圖檔：`05_Prototype/assets/`
- 頁面骨架範本：`05_Prototype/template/page.html` ＋ `template/PageName.js`
  （2026-09-10 已改寫為 Vue 版並實測 22 項通過；**新頁一律從這裡起手**）
- 頁面外殼一律用共用元件 `<th-page-shell>`（prop：`trail`／`title`／`lead`／`updated`／`bare`；
  `stepper`／`nav` 是具名 slot），不自刻 `<main class="th-page">`
- codegen 來源資料：`01_Raw_Input/raw/*.csv` → `05_Prototype/components/RouteData.js`、
  `ConsentData.generated.js`（階段 0 已由 `.jsx` 轉為一般 `<script>`，同名 `.jsx` 已停用）
- Axure 原始檔：`01_Raw_Input/登山一站式.rp`
- 交付 Word：`01_Raw_Input/臺灣登山申請一站式服務網.docx`
- 暫存產物：`.scratch/outputs/`

## 技術棧（雛形階段）

無 npm、無 build、無測試框架。Vue 3 全域建構（`vue.global.prod.js`，integrity 釘版）
＋ in-DOM template：頁面版面留在 `.html`，只有共用元件的 template 是 JS 字串。
實際引入的函式庫與字體看 `05_Prototype/assets/includes/head.html`（由 head-loader 載入），
每頁 `<head>` 只靜態保留四行：Tailwind → `tailwind.config.js` → `shared.css` → `index.css`。

**`vue.global.prod.js` 不發任何 warning**：樣板編譯失敗與元件解析失敗在 console 上
完全安靜，只能靠 DOM 元素數或像素比對發現。改元件或樣板後不要只看 console。

## 開新頁的標準流程

1. `template/page.html` → `<頁名>.html`，`template/PageName.js` → `components/<頁名>.js`
2. 改 `<title>`、`data-page-init="components/<頁名>.js"`（**兩處檔名要一致**）
3. 改 `th-header` 的 `active`、`th-page-shell` 的 `trail`／`title`／`lead`／`updated`
4. 內容寫在 `th-page-shell` 內；資料與方法寫在 `components/<頁名>.js` 的 `thPage({...})`
5. 樣式優先沿用既有 class；真的要新增就進 `assets/css/pages.css`，命名 `.p-<頁名>-*`
6. 用瀏覽器實跑：`th-page-shell` 的標題／導言／麵包屑／slot 都在、`th-header` 的
   語言下拉與手機選單可操作、console 與 4xx 乾淨

**掛載成功 ≠ 初始化生效。** `app-boot.js` 沒有 page options 時仍會以空 options 掛載，
畫面會渲染出外殼、資料全空。頁面宣告了 `data-page-init` 卻沒呼叫 `thPage()` 時，
`app-boot.js` 會在 console 明講——看到那句就是這件事。

**驗收不要用「元素數 > N」當門檻**：已知失敗案例（根層 `<template>` 變真元素）
262 個元素只渲染出 78 個，任何合理門檻都會放它過。要檢查**具名的預期輸出**。

## 樣式歸屬

四層 `05_Prototype/assets/css/`，由 `index.css` 以 `@import` 串接，**順序即層級**：

| 層 | 放什麼 |
|---|---|
| `tokens.css` | 設計代幣（顏色、字級、圓角、陰影） |
| `base.css` | 元素層 reset 與基礎排版 |
| `components.css` | 共用元件的樣式，前綴 `.th-*` |
| `pages.css` | 單頁專用，前綴 `.p-<頁名>-*` |

- **命名前綴就是歸屬**：`.th-*` 永遠是共用層，**不因為「目前只有一頁在用」就改名下放**。
- **二次即提升**：頁面專用樣式一旦第二頁要用，就提升到 `components.css` 並改名 `.th-*`，
  不要在兩個 `.p-*` 各留一份。
- **`pages.css` 的界線**是「這一頁的外觀」，不是「這一頁用到的全部樣式」。
  共用元件在這一頁的**微調**可以放，元件本身的長相不行。
- 不要新增 `styles/<頁名>.css`，也不要在頁面寫 `<style>` 或 inline `style`
  （動態綁定的 `:style` 除外）。
- **`styles/shared.css` 正在退場**（階段 4）。過渡期兩者並存。

**`<link>` 順序：`index.css` 必須在 `shared.css` 之後。**
順序相反時 `components.css` 的規則會被 `shared.css` 的同名規則整批蓋掉——
**改了永遠沒效果，而且完全不報錯**（2026-09-07 實測，見 `assets/css/index.css` 檔頭）。

## 遷移踩坑總表

九類靜默失敗、互動頁遷移通則、驗收方法與其盲點、遷移期的兩條界線：
**`D:\OneDrive - 天眼衛星科技股份有限公司\_knowledge\shared\tech\vue3-global-build-遷移踩坑.md`**
——動元件、搬樣式、寫驗收工具前先讀。

其中**第四節「遷移期的兩條界線」只適用任務模式 1**（見上面「任務模式」節）；
其餘各節（九類靜默失敗、驗收盲點）三種模式都適用。

## 三條硬規則（2026-09-09／09-10 由事故與實測訂立）

**R1. 工具的有效性用「輸出是否與現況一致」判定，不用「能不能執行」判定。**

跑得起來、不拋錯，不代表產生器還有效。**判準是：跑完之後 `git diff` 是空的。**
有 diff 就是失效，即使程式本身完全正常。

- `.scratch/outputs/gen-notice-pages.py` 讀 `NoticeDetailData.jsx`，
  以舊 `<div id="root" data-notice=…>` 格式替換頁號 —— 現行頁面是 `#th-app`，
  對現有 `notice_*.html` 替換命中為 **0**。
- 更隱蔽的一種：`gen_index.py` 跑得起來也不拋錯，但輸出是**退化**的 ——
  會把 `index.html` 的 `v-cloak` 與 whitespace 規則註解退回舊狀態（6 插入／9 刪除）。
  只看有沒有拋錯會誤判為有效。

推論：**保留輸入檔不等於產生器仍有效**，所以不為「產生器可能要重跑」延後刪除輸入。

**R2. 路徑層級的 `git checkout` / `git clean` / `git reset --hard` 一律禁止。**

要還原時只能用：

```
git stash push -- <明確檔案>          # 有改動時
git checkout -- <單一檔案>            # 針對單一檔案，不給目錄
```

執行前先 `git status` 確認沒有他人的未提交內容。

**工作樹存在未提交內容時，不進行純刪除作業。** 理由不是「怕動到別的目錄」——
指定明確路徑就不會動到。真正的理由是**回滾成本**：刪除若出了問題要 `git revert`，
工作樹乾淨時那一步是乾淨的；混著未提交內容時，revert 會與那些改動糾纏，
而你正處在「剛發現刪錯了」的狀態下，那是最不該再多一個變數的時刻。

**「這次例外沒關係」就是上次出事的思路。** 2026-09-09 那次事故的當下判斷也是
「計數已經排除那些路徑了，應該沒事」。不確定時停下來問，比事後從副本救回便宜。

依據：2026-09-09 21:08 的事故。當時為了實測產生器，跑了
`git checkout -- 05_Prototype/`，把該目錄下**全部**未提交改動丟掉
（`styles/shared.css` 958→953 條規則、`hiking-site/index.html`、`hiking-site/style.css`）。
計數邏輯有排除那些路徑，**還原指令沒有** —— 排除清單寫在錯的地方。
`shared.css` 靠裁決 5 留下的參考 worktree 副本救回，其餘無副本。

**R3. 文件對工具能力的描述，必須對照實作核對。**

**指定為安全網的工具，使用前先讀原始碼確認能力範圍，並把實際能力寫回文件。**
同型錯誤已三次：

- `gen_index.py` 能執行、不拋錯，但輸出退化（把 `index.html` 的 `v-cloak`
  與 whitespace 註解退回舊狀態）——**能執行 ≠ 正確**
- 清單 §7.4 靠印象寫工具依賴，實際 `audit_copy.py` 一行 `.jsx` 都沒讀——**盤點 ≠ 驗證**
- 清單 §12.5 稱 `cascade_check.py`「比對勝出的宣告」，實作只查共現——**描述 ≠ 實作**

階段 3 有像素比對兜住這種落差；**階段 4 沒有改版前可比對，兜不住。**
**任務模式 2（改畫面）同樣沒有「與改版前相同」可比對**——那正是它改由使用者指定
「不能動什麼」、並要求改動範圍外的頁面須零差異的原因。

## 重要限制

- **不要引入 npm 或打包工具**，本專案刻意維持零 build。
- `01_Raw_Input/raw/*.csv` 是 `05_Prototype/components/RouteData.js`、`ConsentData.generated.js` 的生成來源
  （見兩檔開頭註解），改資料要連帶更新對應 `.js`，不要只改一邊。
  **repo 內目前沒有生成腳本**，產生方式待確認；補上腳本時請放 `scripts/`。
- `01_Raw_Input/` 為原始素材區。機關提供的檔案（`.rp`、`.docx`）**唯讀，不得修改**；
  `01_Raw_Input/raw/*.csv` 是我方維護的 codegen 來源，可更新。
- 分析產物、臨時 HTML、圖檔一律放 `.scratch/outputs/`（junction 到 `D:\scratch-dirs\登山一站式`），
  不在 repo 根目錄新增輸出資料夾。
- 領域詞彙／業務規則的正本在知識庫，`CONTEXT.md` 只留路由——不要在兩處各存一份。
- git dir 在 repo 之外（`D:\git-dirs\登山一站式.git`），`.git` 只是指標檔；
  **不可用「寫暫存檔再 rename」的方式改寫 `.git`**。

---

## 開啟與預覽

任意靜態伺服器皆可，但**必須起在 `05_Prototype/` 底下**。

**必須經 HTTP**：`assets/includes/head-loader.js` 用 `fetch` 取 `assets/includes/head.html`，
直接用 `file://` 開啟會被 CORS 擋住，整頁不會掛載。
