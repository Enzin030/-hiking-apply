# CONTEXT.md — 臺灣登山申請一站式服務網（115 國家公園入園擴充）

> 此檔案供 AI agent（diagnose、tdd、improve-codebase-architecture 等 skill）讀取。
> 描述專案的領域詞彙、角色定義與業務規則，避免 agent 發明系統未使用的語言。

---

## 系統定位

國家公園入園與登山活動申請的單一入口網站改版。
目前階段：**UI 雛形（Prototype）**，純靜態前端，無後端與資料庫。

---

## 核心領域詞彙、角色定義、關鍵業務規則

**正本在知識庫**，本檔不重複，避免副本漂移：

`D:\OneDrive - 天眼衛星科技股份有限公司\_knowledge\projects\國家公園入園擴充\index.md`

- §核心詞彙 — 國家公園入園擴充／登山一站式／前台各版
- §角色 — `[待訪談]`
- §業務規則 — `[待訪談]`（入園申請、審核與通知流程；前台各版的完成定義與驗收標準）

新確認的業務知識一律 append 到該處，不寫回本檔。

---

## 技術棧摘要（雛形階段）

- React 18 UMD ＋ `@babel/standalone` 瀏覽器端轉譯 JSX，無 build、無 npm
- Tailwind CSS CDN ＋ 各頁 CSS（`styles/`）、`design_system/colors_and_type.css`
- FontAwesome 6、Phosphor Icons；Noto Sans TC / Noto Serif TC
- 頁面即檔案（`05_Prototype/index.html`、`apply-1.html` …），無路由框架

---

## 待確認（`[待訪談]`）

- 前台完整頁面清單。
- 各頁面對應的既有規格或參考版本。
- 使用者角色與權限。
- 驗收範圍與不納入項目。

遇到不確定的業務邏輯，標記 `[待訪談]` 而非猜測，不應自行填補空白。
