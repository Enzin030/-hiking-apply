# assets/components/ — Vue 共用元件（階段 2）

一檔一元件。每支檔案只做一件事：把元件定義掛進 `window.thComponents`，
由 `assets/app-boot.js` 在 `createApp` 後一次全域註冊。

```js
window.thComponents = window.thComponents || {};
window.thComponents["th-xxx"] = { props: {...}, template: `...` };
```

## 為什麼元件的 template 寫成 JS 字串，頁面版面卻不行

計畫 §3 配套規則：**頁面版面留在 `.html`（in-DOM template）**，
只有**共用元件**的 template 寫成 JS 字串。一支數十行寫一次、32 頁共用，
字串編輯的痛可攤提；整頁版面搬進 JS 字串則不可攤提。

## 樣式歸屬

**階段 2 沒有新增任何 CSS，`components.css` 仍為空，這是刻意的。**

這些元件沿用 `styles/shared.css` 既有的 class（`.th-header`、`.th-menupanel`、
`.bulletin-modal`…）。依計畫 §4.2「共用資源以最後一個消費端為退場條件」，
那些規則要等**最後一個消費端遷移完成**才能從 `shared.css` 移走，
所以現在**不複製、不搬動**。實際複製進 `components.css` 的時機是各頁執行階段 3
遷移時（§5 階段 3 第 5 項）。

元件若需要**全新的**外觀（既有 class 提供不了的），才寫進 `components.css`，
不得寫在元件檔內或頁面裡。

## 已完成

| 檔案 | 對應原 React | 互動 |
|---|---|---|
| `th-todo-link.js` | `TodoLink` | 無 |
| `th-breadcrumb.js` | `Breadcrumb` | 無 |
| `th-stepper.js` | `Stepper` | 無 |
| `th-page-nav.js` | `PageNav` | 無 |
| `th-page-shell.js` | `PageShell` | 無 |
| `th-header.js` | `Header` | **選單面板開關、語言下拉切換** |
| `th-footer.js` | `Footer` | 無 |
| `th-quick-nav.js` | `ExperienceNav` | **右下角快捷選單開關** |
| `th-modal.js` | `bulletin-modal` 外殼、`DayModal`、`ForestryDayModal` | Esc 關閉、遮罩點擊關閉 |
| `th-forest-camp-shared.js` | `ForestCampShared.jsx` | 無（`th-fc-stepper` ＋ `CABIN_DATA` ＋ `FC_STEPS`） |
| `th-date-picker.js` | `ForestCamp1.jsx` 的 DatePicker | 原生 `input[type=date]` 薄包裝 |
| `th-calendar-grid.js` | `BedCalendar` ＋ `ForestryCalendar` | `@pick`；格內容由 scoped slot 決定 |
| `th-data-table.js` | `DataTable` | 無 |
| `th-doc.js` | `NoticeDetail.jsx` 的版面部分 | 無（**唯一一檔多元件**，見下） |
| `th-date-utils.js` | `ForestCampShared.jsx` 的日期工具 | 無 |

## 「一檔一元件」的唯一例外：th-doc.js

該檔有四個元件（`th-doc-inline`／`th-doc-paragraph`／`th-doc-list`／`th-doc-body`），
因為它們是**同一個遞迴渲染器依 node 型別拆出來的分支**，彼此互相呼叫
（body → list → body），單獨拿出任何一支都沒有用途。拆成四個檔只會得到四個
不能單獨使用的檔。`th-doc-table` 也在裡面，因為它只服務這個渲染器；
`th-data-table` 相反——它自己就是完整可用的元件，所以獨立一檔。

## 未實作（計畫預留）

`th-table-pager.js`、`th-form-field.js`（未來卡控與錯誤訊息的統一出口）。
