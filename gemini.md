# 115 登山一站式改版 - AI 開發與版控規範

## 1. 核心設計原則

- **極簡美學 (Minimalism)**：介面設計強調資訊層級 (Data Hierarchy)，大量留白，減少視覺雜訊。
- **禁用表情符號 (No Emojis)**：所有 Mockup、UI 畫面及文件中，絕對禁止使用蘋果或系統內建之 Emoji (例：🏕️、⏳)。
- **專業圖示庫 (Professional Icons)**：所有 Icon 唯一採用 **FontAwesome** (如 `<i class="fa-solid fa-mountain"></i>`) 或 **Bootstrap Icons**。
- **開發者友善 (Developer-Friendly)**：明確標示狀態字串、實作 API 規格描述與 RBAC。

## 2. 版本控制原則

- **繁體中文提交 (ZH-TW)**：Git Commit Message 必須使用繁體中文，格式如 `feat: 增加登入頁面` 或 `docs: 更新 PRD 規格`。
- **每次更新必送版控**：只要完成系統檔案異動，即需由 AI 或開發者執行 `git add .` 與 `git commit -m "..."`。

## 3. 開發紀錄

| 日期       | 版本   | 變更描述                              |
| ---------- | ------ | ------------------------------------- |
| 2026-03-03 | v0.1.0 | 專案初始化，建立 PRD 規格書與基礎規劃 |
