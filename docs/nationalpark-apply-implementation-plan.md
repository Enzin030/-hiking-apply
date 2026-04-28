# Nationalpark 國家公園申請改版實作方針

## 1. 文件目的

本文件整理舊系統 `nationalpark/HikeNationpark` 的國家公園申請流程，並定義新版 `登山一站式` 目前應如何調整。範圍限定「國家公園入園申請」，不包含林業署自然保護區、林業署山屋營地單獨申請、警政署單獨入山申請。

核心目標：

1. 保留舊系統既有的國家公園業務規則。
2. 將同意書來源、路線資料、三園版型差異資料化。
3. 讓新版 prototype 從「固定玉山假資料」調整為「依 unit / route / parkType 分流」。
4. 明確列出需要補齊的 DB / API 資料，避免前端憑空硬寫。

---

## 2. 舊系統國家公園主流程

### 2.1 使用者旅程

```text
apply_1.aspx
  選擇登山路線
  ↓
OtherRoute(c_id, f_id, org_id, source_guid)
  檢查暫停路線 / 關聯申請 / 管理機關
  ↓
apply_1_2.aspx
  國家公園申請同意書
  ↓ 同意
依 org 導向三套表單：
  雪霸：apply_1_3.aspx
  玉山：apply_1_4.aspx
  太魯閣：apply_1_5.aspx
  ↓
各園 park-specific 表單填寫、檢查、送出
  ↓
apply_ok.aspx
```

### 2.2 三個國家公園 OrgID

| 國家公園 | OrgID | 舊表單入口 |
|---|---|---|
| 玉山國家公園 | `C951CDCD-B75A-46B9-8002-8EF952EC95FD` | `apply_1_4.aspx` |
| 雪霸國家公園 | `E6DD4652-2D37-4346-8F5D-6E538353E0C2` | `apply_1_3.aspx` |
| 太魯閣國家公園 | `105E956F-D8DA-49F7-A9B7-3AEFDDA88A12` | `apply_1_5.aspx` |

### 2.3 入口分流規則

舊系統入口在 `apply_1.aspx` 的 `OtherRoute(c_id, f_id, org_id, source_guid)`。

優先順序：

1. 若 `c_id = 21 / 132`：錐麓古道暫停入園申請。
2. 若 `c_id = 35`：清水山暫停入園申請。
3. 呼叫 `ApplyFixedclimbRelation(c_id)` 查 `Fixedclimb_relation`。
4. 若有關聯路線 / 入山 / 山屋，彈出「是否需要同時申請」。
5. 國家公園路線一律先導向 `apply_1_2.aspx?unit={org_id}&cid={c_id}&fid={f_id}&camp_id={camp_id}`。
6. `apply_1_2.aspx` 同意後，再依管理處導向三套 park-specific 表單。

---

## 3. 同意書來源與新版處理方式

### 3.1 舊系統同意書來源

同意書不是寫死在 `apply_1_2.aspx`。資料來源為 DB `attention` 表。

查詢邏輯：

```sql
SELECT a.*, b.shortname AS orgname
FROM attention a
LEFT JOIN EIP_Core_Organization b ON a.OrgID = b.id
WHERE a.chk = '1'
  AND a.name IS NOT NULL
  AND a.OrgID = @orgid
ORDER BY a.ord ASC
```

欄位意義：

| 欄位 | 用途 |
|---|---|
| `OrgID` | 管理處，決定玉山 / 雪霸 / 太魯閣不同同意書 |
| `name` | 中文同意書內容，可能包含 HTML |
| `name_en` | 英文內容 |
| `name_jp` | 日文內容 |
| `chk` | 是否啟用，`1` 顯示 |
| `selectchk` | 是否預設勾選，`1` 預設勾選，`0` 預設不勾選 |
| `ord` | 顯示排序 |

頁面最後另有一條硬寫總確認：

```text
本人已閱讀並充分瞭解上述注意事項，並會遵守國家公園、警政署各項規定。
```

### 3.2 新版 apply2 實作原則

新版 `apply2` 應對應舊系統 `apply_1_2.aspx`。

建議規則：

1. `apply2` 只做「國家公園同意書」。
2. 條文內容由 `consentItems` 資料驅動，不硬寫 6 組假分類。
3. 保留 `selectchk` 行為：預設勾選項可以一開始已勾，但使用者可取消。
4. 總確認一定不預設勾選。
5. 移除「不同意」按鈕；「上一步」即回路線選擇。
6. 移除「全部展開閱讀並標記」。
7. 可保留閱讀進度，但進度應是輔助，不是主要操作。

### 3.3 新版同意書資料模型

```js
const consentItems = [
  {
    id: "attention-001",
    orgId: "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
    contentHtml: "...",
    defaultChecked: true,
    order: 10,
  },
];
```

---

## 4. 三套國家公園申請版型

### 4.1 版型總覽

| 版型 | 舊頁面 | 特性 | 新版建議 |
|---|---|---|---|
| 共用同意書 | `apply_1_2.aspx` | DB `attention` 來源、依 OrgID 切內容 | `apply-2.html` |
| 雪霸申請 | `apply_1_3.aspx` | 大型 WebForms MultiView，四步驟 | 新版 `Apply3` 加 `park=shei-pa` 模式 |
| 玉山申請 | `apply_1_4.aspx` | 大型 WebForms MultiView，含 NPA / 林業山屋複合區塊 | 新版 `Apply3` 加 `park=yushan` 模式 |
| 太魯閣申請 | `apply_1_5.aspx` + `tarokoapplyControl/*.ascx` | 控制項拆分，含多語系字串 | 新版 `Apply3` 加 `park=taroko` 模式 |

### 4.2 雪霸版型重點

舊頁：`apply_1_3.aspx`

主要區塊：

1. 路線：主路線、次路線、入園日期、隊伍人數。
2. 路線規劃：逐日選節點，最後一天需回登山口，中間住宿日需落在宿營地。
3. 登山安全管理：安全評估、留守計畫、迫降 / 變更路線提醒。
4. 基本資料：申請人、領隊、隊員、留守人。
5. 宿營地預約查詢排隊狀況。
6. 確認送出與驗證碼。

新版最低需要呈現：

- 路線基本資料。
- 入園日期與天數。
- 隊伍人數。
- 申請人 / 領隊 / 隊員 / 留守人。
- 每日行程規劃。
- 安全與留守計畫。
- 送出前摘要。

### 4.3 玉山版型重點

舊頁：`apply_1_4.aspx`

主要區塊：

1. 路線與路線規劃。
2. 警政署入山證申請區塊。
3. 基本資料。
4. 附件上傳：雪季、長程縱走、玉山主西峰、裝備檢查、圓峰山屋、宿營地、登山計畫書、路線圖等。
5. 山屋及營地申請（林業署）複合區塊。
6. 確認送出。

新版最低需要呈現：

- 玉山路線差異標籤：抽籤 / 排雲 / 圓峰 / 南橫 / 是否需附件。
- 警政署入山證提示與資料欄。
- 山屋 / 營地關聯提示。
- 附件需求清單。
- 送出前摘要。

### 4.4 太魯閣版型重點

舊頁：`apply_1_5.aspx`

實作方式：

- 外層為 `MultiView`。
- 內部引用 `tarokoapplyControl/step1.ascx`、`step2.ascx`、`step3.ascx`、`step4.ascx`。
- 多語系內容透過 `tarokoModeCode_langMessCode.Get_lang_Mes(...)` 取得。

主要區塊：

1. 登山主路線 / 次路線。
2. 路線介紹、地圖、建議行程。
3. 路線規劃。
4. 警政署入山證申請。
5. 基本資料、隊員資料。
6. 承載量 / 宿營地排隊。
7. 確認送出。

新版最低需要呈現：

- 主路線 / 次路線兩層選擇。
- 每日路線規劃。
- 入山證區塊。
- 人員資料。
- 送出前摘要。

---

## 5. 新版目前應如何調整

### 5.1 `RouteData.jsx`

目前問題：

- 路線只有簡化的 `unit`，缺少舊系統申請所需 ID。
- `apply2 / apply3` 無法還原 `unit / cid / fid / camp_id` 行為。

建議新增欄位：

```js
{
  id: "yushan-main",
  name: "玉山主峰線",
  unit: "yushan",
  applyType: "nationalPark",
  orgId: "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
  fId: "舊 Fixedclimbmain.f_id",
  cId: "舊 Fixedclimb.c_id",
  sourceGuid: "Fixedclimbmain.source_guid",
  campId: "0",
  parkForm: "yushan",
  requiresNpa: true,
  requiresForestCamp: false,
  status: "open",
}
```

### 5.2 `Apply1.jsx`

目前應調整成明確分流：

```js
if (route.applyType === "nationalPark") {
  window.location.href =
    `apply-2.html?unit=${route.unit}&route=${route.id}&orgId=${route.orgId}&cid=${route.cId}&fid=${route.fId}&camp_id=${route.campId || 0}`;
}
```

需要保留：

- 暫停路線 modal。
- 關聯申請提示 modal。
- 不同申請類型不要全部丟到 `apply2`。

### 5.3 `Apply2.jsx`

目前問題：

- 同意書仍是假資料分類，不是 `attention` 條文。
- 下一步沒有保留 `unit / route / orgId / cid / fid / camp_id`。

建議：

1. 建立 `CONSENT_BY_ORG` 或後續改接 API。
2. 用 `orgId` 取同意書；取不到才 fallback 到 `unit`。
3. 下一步依 `parkForm` 導向 `apply-3.html`，並保留 query。

```js
const nextQuery = new URLSearchParams(window.location.search);
window.location.href = `apply-3.html?${nextQuery.toString()}`;
```

### 5.4 `Apply3.jsx`

目前問題：

- 固定玉山國家公園管理處、玉山主峰線。
- 沒有依 `unit / route` 帶入資料。
- 沒有 park-specific 差異。

建議拆成：

```text
Apply3.jsx
  Apply3App
    NationalParkApplyShell
      RouteSummary
      TripBasics
      RoutePlan
      ApplicantSection
      LeaderSection
      MemberSection
      KeeperSection
      NpaSection            條件顯示
      ForestCampRelation    條件顯示
      AttachmentSection     條件顯示
      SubmitSummary
```

資料驅動條件：

```js
const PARK_FORM_CONFIG = {
  yushan: {
    label: "玉山國家公園",
    minMembers: 1,
    maxMembers: 12,
    showNpaSection: true,
    showForestCampRelation: true,
    showAttachmentSection: true,
  },
  "shei-pa": {
    label: "雪霸國家公園",
    minMembers: 1,
    maxMembers: 12,
    showNpaSection: false,
    showForestCampRelation: false,
    showAttachmentSection: true,
    showSafetyAssessment: true,
  },
  taroko: {
    label: "太魯閣國家公園",
    minMembers: 1,
    maxMembers: 12,
    showNpaSection: true,
    showForestCampRelation: false,
    showAttachmentSection: false,
  },
};
```

---

## 6. 需要你提供的資料

### 6.1 必要資料，沒有就無法完整實作

#### A. 管理機關

資料表：`EIP_Core_Organization`

需要欄位：

- `id`
- `name`
- `shortname`
- `order_no`

用途：

- 判斷玉山 / 雪霸 / 太魯閣。
- 顯示管理處名稱。
- 對應同意書 `attention.OrgID`。

#### B. 同意書

資料表：`attention`

需要欄位：

- `id`
- `OrgID`
- `name`
- `name_en`
- `name_jp`
- `chk`
- `selectchk`
- `ord`

用途：

- 產生新版 `apply2`。
- 還原預設勾選。
- 決定三個管理處同意書內容差異。

建議匯出範圍：

```sql
SELECT id, OrgID, name, name_en, name_jp, chk, selectchk, ord
FROM attention
WHERE OrgID IN (
  'C951CDCD-B75A-46B9-8002-8EF952EC95FD',
  'E6DD4652-2D37-4346-8F5D-6E538353E0C2',
  '105E956F-D8DA-49F7-A9B7-3AEFDDA88A12'
)
ORDER BY OrgID, ord;
```

#### C. 主路線

資料表：`Fixedclimbmain`

需要欄位：

- `f_id`
- `OrgID`
- `name`
- `name_en`
- `name_jp`
- `source_guid`
- `chk`
- `pjtype`
- `ord`
- `file01`
- `file02`
- `file03`
- `file04`
- `file05`
- `file06`

用途：

- 第一層主路線。
- 主路線地圖 / 建議行程附件。
- `source_guid` 用於複合山屋 / 外部流程關聯。

#### D. 次路線

資料表：`Fixedclimb`

需要欄位：

- `c_id`
- `f_id`
- `OrgID`
- `name`
- `name_en`
- `name_jp`
- `source_guid`
- `chk`
- `pjtype`
- `ord`
- `sumdaymin`
- `sumdaymax`
- `isforeign`
- `linetype`
- `peopleset`
- `TeamApplyMaxCntSnowlong`
- `is_hiking_safety`
- `file01`
- `file04`
- `linetxtch`
- `note`
- `note_en`
- `note_jp`

用途：

- 第二層次路線。
- 入園天數限制。
- 隊伍人數限制。
- 路線介紹、地圖、建議行程。
- 是否顯示登山安全評估。

#### E. 關聯申請

資料表：`Fixedclimb_relation`

需要欄位：

- `from_c_id`
- `to_c_id`
- `name`
- `OrgID`
- `c_id`
- `f_id`
- `orgName`

用途：

- 還原「是否需要同時申請以下入山 / 山屋 / 路線」。
- 決定 `camp_id` 是否帶入 `apply_1_2.aspx`。

### 6.2 建議資料，有了才能做完整表單規則

#### F. 路線節點

資料表：

- `node`
- `node_arrive`
- `node_closedate`
- `node_one`
- `node_two`

用途：

- 每日路線規劃。
- 起點 / 終點 / 宿營地限制。
- 關閉節點提示。
- 特殊節點組合規則。

需要欄位：

- `node.node_id`
- `node.OrgID`
- `node.name`
- `node.type`
- `node.chk`
- `node.pjtype`
- `node.ord`
- `node_arrive.c_id`
- `node_arrive.node1`
- `node_arrive.node2`
- `node_closedate.node_id`
- `node_closedate.sdate`
- `node_closedate.edate`

#### G. 附件規則

資料表：`applylist_files`

需要欄位：

- `c_id`
- `filetype`
- `lang`
- `title`
- `content`
- `chk`

用途：

- 判斷雪季、長程縱走、裝備檢查、登山計畫書、路線圖等附件需求。
- 玉山尤其重要。

#### H. 規則設定

資料表：`RuleSet`

需要欄位：

- `OrgID`
- `loadingtype`
- 其他與申請時間、承載量、隊伍限制相關欄位

用途：

- 決定承載量計算方式。
- 決定是否依宿營地承載量檢查。

#### I. 住宿 / 宿營地承載量

資料表依舊系統實際命名補齊，至少需能回答：

- 某路線某日期可申請名額。
- 某路線某日期宿營地 / 山屋剩餘量。
- 是否需抽籤 / 排隊 / 候補。

用途：

- 宿營地預約查詢排隊狀況。
- 玉山 / 雪霸路線名額提示。

---

## 7. 建議交付資料格式

### 7.1 最低可用格式

每張表提供 CSV 或 JSON，檔名如下：

```text
db-export/
  EIP_Core_Organization.csv
  attention.csv
  Fixedclimbmain.csv
  Fixedclimb.csv
  Fixedclimb_relation.csv
  node.csv
  node_arrive.csv
  node_closedate.csv
  applylist_files.csv
  RuleSet.csv
```

### 7.2 如果不能給完整 DB

至少給以下三組：

1. `attention` 三園完整資料。
2. `Fixedclimbmain / Fixedclimb` 三園啟用路線。
3. `Fixedclimb_relation` 啟用關聯資料。

有這三組，就能先把新版做到：

- 正確入口分流。
- 正確同意書內容。
- 正確帶入路線 / 管理處。
- 保留三園表單差異的 UI 架構。

---

## 8. 實作階段規劃

### Phase 1：先修正新版申請主線

目標：

- `apply-1 → apply-2 → apply-3` 不再丟失路線上下文。

任務：

1. `RouteData.jsx` 補 `applyType / orgId / cId / fId / campId / parkForm`。
2. `Apply1.jsx` 導頁帶完整 query。
3. `Apply2.jsx` 下一步保留完整 query。
4. `Apply3.jsx` 依 route 顯示路線資料，不再固定玉山。

### Phase 2：重做 apply2 同意書

目標：

- 對齊舊系統 `attention` 資料模型。

任務：

1. 建立 `ConsentData.jsx` mock。
2. 依 `orgId` 顯示三園同意書。
3. 支援 `defaultChecked`。
4. 保留總確認。
5. 上一步回 `apply-1.html`。

### Phase 3：整理 Apply3 三園差異

目標：

- 同一個新版 shell，但內容由 park config 控制。

任務：

1. 建立 `NationalParkApplyConfig.jsx`。
2. 抽出共通區塊：路線摘要、行程基本資料、人員資料、留守人、每日行程、送出摘要。
3. 條件顯示三園差異：NPA、山屋、附件、登山安全。
4. 不在 Phase 3 做真正送件，只做表單結構與狀態保存。

### Phase 4：接後端 / DB

目標：

- 將 mock data 替換為 API。

建議 API：

```text
GET /api/national-parks
GET /api/national-park-routes?orgId=
GET /api/national-park-consents?orgId=&lang=zh-TW
GET /api/national-park-route-detail?cId=&fId=
GET /api/national-park-route-relations?cId=
GET /api/national-park-attachments?cId=&lang=zh-TW
GET /api/national-park-route-nodes?cId=
```

---

## 9. 目前決策建議

1. `apply2` 不要再維持目前 6 大類假條文；應改為 `attention` 條文列表。
2. `Apply3` 不要做成玉山專用；應做「國家公園申請 shell + 三園 config」。
3. 先不要嘗試一次完整重刻舊系統所有規則；先把上下文、同意書、三園差異框架做對。
4. 如果 DB 資料未提供，前端只能做 mock；mock 欄位必須長得像 DB，而不是自由編造。
5. 關聯申請必須進入資料模型，否則嘉明湖 / 南橫 / 山屋 / 入山混合情境會再次失真。

---

## 10. 立即可執行待辦

1. 請提供 `attention` 三園資料。
2. 請提供 `Fixedclimbmain / Fixedclimb` 三園啟用路線。
3. 請提供 `Fixedclimb_relation` 關聯資料。
4. 前端先建立 `ConsentData.jsx`、`NationalParkApplyConfig.jsx`。
5. 改 `Apply1 / Apply2 / Apply3` query 傳遞。
6. 再依 DB 實際欄位補路線規劃、附件、入山證、山屋關聯。

