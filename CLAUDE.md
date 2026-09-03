# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

**臺灣登山申請一站式服務網（115 國家公園入園擴充）** — UI 雛形 / Prototype。

純靜態前端，無 build 流程、無後端、無套件管理工具。以本機靜態伺服器直接開啟。

## 工作原則

1. 執行前先說計畫，確認後再動手；只改點名的範圍。
2. 不確定的業務邏輯標 `[待訪談]`，不猜測、不虛構。
3. 禁用 Emoji：所有 mockup、UI 與文件不使用系統內建 Emoji（🏕️、⏳ 等）。Icon 一律用
   FontAwesome（`<i class="fa-solid fa-mountain"></i>`）或 Phosphor Icons。
4. Git commit message 用繁體中文，格式如 `feat: 增加登入頁面`、`docs: 更新 PRD 規格`。
5. 改完 UI 要用瀏覽器實際跑過再回報（程序見 `institution\core.md` §3.3），不以「程式碼看起來對」代替驗證。
6. 介面走極簡：強調資訊層級、留白，減少視覺雜訊。

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
- React 元件（在瀏覽器內以 Babel 轉譯的 JSX）：`05_Prototype/components/`
- 樣式：**只有 `05_Prototype/styles/shared.css` 一支**（`@import` `design_system/colors_and_type.css`）；
  2026-09-03 已把八支分頁 CSS 併回共用檔，**不要再新增 `styles/<頁名>.css`**
- 圖檔：`05_Prototype/assets/`；頁面骨架範本：`05_Prototype/template/page.html` ＋ `template/PageName.jsx`
  （`template/` 底下就這兩支，新頁一律從這裡起手；舊版範本 `1.html` 已於 2026-09-03 移入
  `.scratch/frontend-舊雛形/template-1.html`，脫節已久，不要再撿回來）
- 頁面外殼一律用 `Shared.jsx` 的 `PageShell`（`trail`／`title`／`lead`／`updated`／`stepper`／`nav`／`bare`），不自刻 `<main className="th-page">`
- codegen 來源資料：`01_Raw_Input/raw/*.csv` → `05_Prototype/components/RouteData.jsx`、`ConsentData.generated.jsx`
- Axure 原始檔：`01_Raw_Input/登山一站式.rp`
- 交付 Word：`01_Raw_Input/臺灣登山申請一站式服務網.docx`
- 暫存產物：`.scratch/outputs/`

## 技術棧（雛形階段）

- React 18 UMD ＋ `@babel/standalone`（瀏覽器端即時轉譯 `type="text/babel"` 的 JSX），**無打包工具**
- Tailwind CSS CDN（`cdn.tailwindcss.com`）＋ 全站單一 `styles/shared.css`
- 字體 Noto Sans TC / Noto Serif TC；Icon 用 FontAwesome 6 與 Phosphor Icons
- 無 npm、無 build、無測試框架

## 重要限制

- **不要引入 npm 或打包工具**，本專案刻意維持零 build。
- `01_Raw_Input/raw/*.csv` 是 `05_Prototype/components/RouteData.jsx`、`ConsentData.generated.jsx` 的生成來源
  （見兩檔開頭註解），改資料要連帶更新對應 jsx，不要只改一邊。
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

```bash
# 任意靜態伺服器皆可，起在 05_Prototype 底下：
cd 05_Prototype
npx serve .
python -m http.server 8080
```

Babel standalone 需經 HTTP 載入 `components/*.jsx`，直接用 `file://` 開啟會被 CORS 擋住。
