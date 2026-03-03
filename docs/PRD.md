# 115 登山一站式改版 - 系統規格書 (PRD)

## 1. 專案概述 (Project Overview)

本專案為「115登山一站式」入口網的全面改版。旨在整合入山、入園等各項登山申請服務，為使用者打造極簡、直覺、且資訊架構清晰的整合型入口網，同時針對後台提供審查一致性的管理介面 (RBAC設計)。

---

## 2. 系統架構簡介 (System Architecture)

- **Frontend (前端)**：使用 React (TypeScript) + Vite 進行建置。採用 Vanilla CSS 搭配 CSS Modules 實現極簡風範，並引入 FontAwesome 提供向量圖示。
- **Backend (後端)**：RESTful API + JWT Token 授權機制。
- **Database (資料庫)**：預計採用關聯式資料庫 (RDBMS) 或現有政府內部資料庫。

---

## 3. UI/UX 操作動線 (User Flow)

介面奉行「極簡美學 (Minimalism)」，透過純白背景與中性色調 (如灰階、深藍)，引導使用者的視覺焦點直接落在「待辦事項」與「資訊」上。

### 3.1 前台動線 (Frontend Web)

1. **Landing Page (首頁)**
   - 全版焦點圖搭配極簡文字 (Mission Statement) 與搜尋框。
   - `fa-solid fa-search` 尋找路線、山脈資訊。
2. **Login / SSO (登入)**
   - 支援一般帳號或政府單一登入 (SSO)。
3. **User Dashboard (會員中心/我的申請)**
   - 狀態卡片區分：[草稿]、[審核中]、[已核准]、[已退件]。
   - 以 Data Grid 顯示申請單，每筆資料帶有動作選項 (`fa-solid fa-pen`, `fa-solid fa-eye`)。
4. **Application Form (一站式申請流程)**
   - 採 Step-by-Step 嚮導模式 (Wizard)：
     - Step 1: 選擇路線 (`fa-solid fa-map-location-dot`)
     - Step 2: 填寫資料 (`fa-solid fa-file-lines`)
     - Step 3: 確認送出 (`fa-solid fa-check`)

### 3.2 後台動線 (Admin Portal)

1. **Review Dashboard (審查儀表板)**
   - 列出待審查案件 (高對比度提示待處理事項)。
2. **Application Detail (案件明細與審查)**
   - 左側資訊檢視，右側審查意見輸入與決行 (Approve / Reject)。

---

## 4. 狀態定義 (State Management Definitions)

為求開發順利，前端元件必須對應以下四種基礎狀態：

1. **Idle / Normal (常態)**
   - 系統靜止狀態，所有資料已就緒。
2. **Loading (載入中)**
   - 操作時顯示 Skeleton Screen 或 Spinner (`fa-solid fa-circle-notch fa-spin`)。
   - 阻擋按鈕重複點擊 (Button Disabled)。
3. **Empty (空資料)**
   - 當 API 回傳為空時，介面顯示圖示與提示文案 (如：`fa-solid fa-box-open`「目前無待處理您的申請資料」)。不可出現任何突兀的反白或空白。
4. **Error (錯誤 / 例外狀態)**
   - 發生網路錯誤或邏輯錯誤時的警示訊息。
   - 使用紅色或橘色基調的 Toast 提示 (`fa-solid fa-circle-exclamation`「資料載入失敗，請稍後再試」)。

---

## 5. 權限角色邏輯 (RBAC - Role-Based Access Control)

| 角色 (Role)                   | 權限說明 (Permissions)                             | 可見視圖 (Visible Views)         |
| :---------------------------- | :------------------------------------------------- | :------------------------------- |
| **Guest** (訪客)              | 僅可瀏覽公開路線與常見問題                         | Landing, Public Info             |
| **User** (一般民眾)           | 可送出申請、查詢自己歷史紀錄、修改個人設定         | User Dashboard, Form Wizard      |
| **Reviewer** (審查委員)       | 檢視分派案件、填寫審查意見、核准/退回操作          | Web/Admin Dashboard (限自己轄區) |
| **System Admin** (系統管理員) | 擁有全系統最高權限，可管理使用者與所有角色配置設定 | Admin Control Panel              |

---

## 6. API 資料結構與通訊協定概念 (API Design Constraints)

- Request Headers 必須帶有 `Authorization: Bearer <token>`
- Response 統一包裹格式如下：

```json
{
  "success": true,
  "code": 200,
  "message": "請求成功",
  "data": { ... }
}
```

- 若發生錯誤，一律回傳 4xx / 5xx HTTP 狀態碼，並於 Response 回應：

```json
{
  "success": false,
  "code": 403,
  "message": "權限不足，無法執行此操作",
  "data": null
}
```
