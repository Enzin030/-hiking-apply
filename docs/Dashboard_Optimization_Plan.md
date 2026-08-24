# 儀表板 UI/UX 優化方案 (Dashboard Optimization Plan)

## 1. 原系統痛點分析 (Pain Points)

基於您提供的兩張舊版系統截圖，可以觀察出以下幾點 UI/UX 問題：

1. **視覺層次扁平且陳舊 (Outdated Aesthetics)**：
   - 使用了過時的灰綠色調與淡黃色背景（如左側選單、上方標題區），缺乏現代化系統的專業感與清晰對比度。
   - 大量使用原生 HTML 邊框、按鈕預設樣式，導致畫面看起來厚重。
2. **空間利用率不佳 (Poor Spatial Utilization)**：
   - 右側大面積的「申請統計數」查詢區塊，在未使用前僅是一整片空白背景框，沒有提供任何預設的引導資訊或總覽圖表（如 KPI 卡片）。
3. **資訊架構零散 (Fragmented Information Architecture)**：
   - 左側系統選單（系統管理、入園管理）展開後項目過多，字元密集且無 Icon 輔助，增加尋找功能的認知負擔。
4. **Data Grid 閱讀體驗不佳 (Data Readability Issues)**：
   - 表格直接套用死板的黑色網格線。
   - 全部的屬性與數值階層未妥善區分（例如：數值未明確靠右對齊，導致包含 0 與二位數的數值難以快速掃視與對齊心智模型）。
   - 當資料為 `0` 時與一般數值無異，無法一眼凸顯出「有申請件數」的重點路線。

---

## 2. 優化策略 (Optimization Strategy)

為符合「極簡美學 (Minimalism)」、「禁用 Emoji」及「強調資訊層級 (Data Hierarchy)」的原則，提出以下優化方案：

### 2.1 現代化版面與色彩計畫 (Modern Layout & Color Strategy)

- **色彩重構**：捨棄陳舊的綠/黃底色。全站以**純白 (`#FFFFFF`) / 極淺灰 (`#F8F9FA`)** 為主基調。
- **字體升級**：全線導入無襯線現代字體 (如 `Noto Sans TC`)，由字體的粗細 (Weight) 與灰階 (Grayscale) 來建立主次關係，而非單純改變顏色。

### 2.2 側邊欄重構 (Sidebar Refactoring)

- **視覺降噪**：側邊欄改為深灰底色 (`#1E293B`) 搭配白色反白字體，或極簡白底搭配灰字。
- **圖示輔助**：為每個主分類（系統管理、入園管理）加上對應的 FontAwesome 圖示（例如 `<i class="fa-solid fa-gear"></i>` 與 `<i class="fa-solid fa-tree"></i>`），減輕純文字的壓迫感。

### 2.3 內容區與過濾器 (Content Area & Filter Bar)

- **全局篩選列 (Filter Bar)**：將「單位」與「期間」過濾器移至頂部，移除實體外框，改以淺色底色橫幅或極細的底線 (border-bottom) 作為區隔。
- **引入 KPI 儀表板 (KPI Cards)**：
  在使用者尚未進行具體「查詢」前，預設顯示 4 張關鍵數據卡（如「今日申請隊伍數」、「待處理案件」等），補足舊版大面積空白的缺點，讓管理者一登入就能掌握全局狀況。

### 2.4 數據表格升級 (Data Grid Enhancements)

- **隱形網格**：移除深黑色的直橫線，改採極淺灰色 (`#E2E8F0`) 的橫向分隔線 (Row Border-bottom)，打造清晰、呼吸感強的列表。
- **數值對齊與淡化**：
  - 中文屬性（如路線名稱）靠左對齊。
  - 數值（申請隊伍、核准人數）一律**靠右對齊**。
  - 將數值為 `0` 的格子文字顏色轉為淺灰 (`#94A3B8`)，使大於 0 的有效數據自然在畫面中跳脫出來（Data Hierarchy）。

---

## 3. 靜態雛形實作 (Static Prototype Implementation)

我已在專案中建立了 `frontend/prototype/` 資料夾，內含基於上述規劃的 HTML 與 CSS 檔案。您可以直接以瀏覽器開啟 `frontend/prototype/dashboard.html` 進行體驗。

> 2026-08-24 資料夾重整：`frontend/` 已移出版控，現位於 `.scratch/frontend-舊雛形/`，上述路徑請改讀 `.scratch/frontend-舊雛形/prototype/dashboard.html`。

該雛形包含：

- 極簡風格的左右分欄 (Sidebar & Main Content)
- 頂部的快速篩選列 (Filter Bar) 與管理者資訊 (Header)
- 直覺的 4 欄式營運數據卡片區 (KPI Cards)
- 具備現代感與 Hover 反饋的數據統計列表 (Data Grid)，並實作數值 `0` 的淡化效果。
