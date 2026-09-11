# divergences — 現行系統中同一條規則的互相不一致之處

標的：`\\10.0.0.51\d$\WEB\nationalpark`（唯讀）　產出：2026-09-07
主應用：`HikeNationpark`（ASP.NET WebForms，.NET 4.8）
規模：全樹 34,301 檔／3,837 支 `.cs`／2,360 支 `.aspx`；`HikeNationpark` 佔 14,903 檔

---

## 第一句話

**這套 code 裡沒有一套「申請規則」可以讀。**
規則被拆成四種載體，彼此不一致，而且沒有任何一處是完整的：

1. **資料庫**（`RuleSet`、`Fixedclimb`、`snowset` 等）——人數上下限、申請期限的**數值**在這裡，看不到。
2. **三份互相獨立的實作**——雪霸／玉山／太魯閣各寫各的，連「長程縱走」怎麼判定都不同。
3. **寫死在 `.cs` 裡的日期字面值**——到期即靜默失效，沒有任何機制會提醒。
4. **機關原文**（`notice_a*.aspx`／`notice_b*.aspx` 的靜態文字、`attention` 資料表）——這是唯一
   完整的規則來源，但它不是程式，程式沒有照著做。

接手的人要做的不是「修規則」，是**從零把卡控實作出來**；而手邊唯一可信的規則來源是機關原文。

## 證據等級（依 2026-09-07 使用者裁決修訂）

| 類別 | 回答什麼問題 | 在這棵樹裡是 |
|---|---|---|
| **A. `.cs` 邏輯** | 系統實際會做什麼（唯一事實） | 所有 code-behind 與 `App_code/` |
| **B. 機關原文／DB 匯出** | 規則實際是什麼（唯一事實） | `notice_a1..a10.aspx`／`notice_b1..b7.aspx` 的靜態文字、`attention` 資料表 |
| **C. 某個人當時的理解** | 都不是 | `.cs` 裡的中文註解、寫死的日期字面值與提示文字 |

A 與 B 都是事實，只是回答不同問題；**C 不是事實**。本文凡引用 C 類一律標明。

## 唯讀限制造成的系統性缺口

規則的**數值**幾乎都在資料庫，本次未連線（唯讀分析，連線需另行授權）。
凡數值落在 DB 的，本文寫**表名與欄位名**，不寫值，並標 `[缺口]`。
已確認會用到的表：`RuleSet`、`Fixedclimb`、`Fixedclimbmain`、`Fixedclimb_relation`、
`Fixedclimbmain_closedate`、`snowset`、`attention`、`EIP_Core_Organization`、
`Trailclassification`、`node`／`node_arrive`／`node_relation`、`applylist_files`。
連線字串在 `Configs\ConnectionString.config`（本次未讀其內容）。

---

# 申請流程骨幹（後面所有出處的座標）

```
apply_1.aspx            路線選擇（依 GUID 分派）
   └─ apply_1_2.aspx    同意書（依「機關名稱字串」分派）  ← 兩頁用不同的鍵做同一個決定
        ├─ 雪霸   → apply_1_3.aspx   (520KB code-behind)
        ├─ 玉山   → apply_1_4.aspx   (589KB)
        ├─ 太魯閣 → apply_1_5.aspx   (35KB) + tarokoapplyControl/step1..4 (~1.1MB)
        └─ 警政署 → apply_npa_1.aspx
   ├─ 林業署保護區 → apply_forest_area_1.aspx
   └─ 林業署山屋   → apply_forest_camp_1.aspx
```

三家專屬實作：玉山 `App_code/YuShanFun.cs`(89KB)、雪霸 `App_code/SheipaWebService.cs`(33KB)
＋ `RuleSet` 資料表、太魯閣 `App_code/tarokoModeCode/tarokoModeCode.cs` ＋ `tarokoapplyControl/`。

**`en/` 與 `jp/` 不是語系資源，是整套 code 的獨立複本**，各自有 `apply_1_3/1_4/1_5`、
`bed_*`、`ucControl/`。`jp/` 只有玉山（沒有 `apply_1_3`／`apply_1_5`／`apply_forest_*`／`apply_npa_*`）。

---

# 最容易踩的 3 組（完整展開）

## D-1　「封園日不可申請」一條規則，六個實作、三個過期的時間窗、雪霸自己前後不一致

### 一支檔案裡的四個 overload

`App_code/CheckBlockDay.cs`（213 行）提供三對多載，各自從不同來源取「封園期間」：

| 方法 | 時間窗來源 | 封閉日清單來源 |
|---|---|---|
| `Close_DaysBind()` `:19-24` | — | **寫死** `2025-01-23`…`2025-02-03`（`:22`，農曆年）。`:21` 還留著更早的 2023 版註解 |
| `IsClose_Days()` `:26-36` | `web.config` 的 `Close_Day_st`／`Close_Day_ed` | 上者 |
| `IsClose_DayYN(applydate)` `:38-55` | 同上 | 上者 |
| `Close_DaysBind(orgid)` `:58-97` | — | **雪霸專屬**：查 `RuleSet` 的 `spnp_closestart`／`spnp_closeend`／`spnp_returnday`，由 `returnday` 逐日展開到 `closeend`。**非雪霸一律回空字串** |
| `IsClose_Days(orgid)` `:98-145` | 雪霸讀 `RuleSet`；**非雪霸走 `:136-137` 寫死的 `202310051500`／`202310110000`** | 上者 |
| `IsClose_DayYN(applydate, orgid)` `:147-211` | 雪霸讀 `RuleSet`；**非雪霸走 `web.config`**（`:197-198`） | 上者 |

注意 `IsClose_Days(orgid)` 與 `IsClose_DayYN(applydate, orgid)` 是**相鄰的兩個方法、同一個判斷**，
非雪霸分支卻一個讀寫死常數、一個讀 `web.config`。

### 三個時間窗，全部已過期

- `web.config:44-45`：`Close_Day_st = 202203311500`、`Close_Day_ed = 202204050000`（**2022 年 4 月**）
- `CheckBlockDay.cs:136-137`：`202310051500`／`202310110000`（**2023 年 10 月**）
- `CheckBlockDay.cs:22`：封閉日清單本身是 **2025 年 1–2 月**

以今日 2026-09-07 判斷：三個窗的 `now >= st && now < ed` 皆為 false
→ **除雪霸走 DB 的那條路徑外，所有封園日排除與檢查都恆回空／false。**

### 誰呼叫哪一個（這才是會被咬的地方）

| 流程 | 產生入園日下拉時（排除封園日） | 送出時再檢查 |
|---|---|---|
| **雪霸** `apply_1_3` | `IsClose_Days(park)` `:771`、`:7708` ← **走 DB `RuleSet`** | `IsClose_DayYN(applystart)` `:5605` ← **單參數版，走已過期的 `web.config`** |
| **玉山** `apply_1_4` | `IsClose_Days()` `:4403` ← 無 org 版 | `IsClose_DayYN(applystart)` `:392` ← 同上 |
| **太魯閣** | `IsClose_Days()` `step22.ascx.cs:1595`、`:3546` ← 無 org 版 | `IsClose_DayYN(...)` `step3.ascx.cs:1730` ← 同上 |
| API | `GetTravelStep.cs:309` 用無 org 版、`:357` 用 org 版、`:442` 又用無 org 版 | `GetApplyCase.cs:140` 單參數版 |

**雪霸的「產生清單」與「送出檢查」用的是兩個不同的資料來源**：清單依 DB 正確排除，
送出檢查卻走 2022 年就過期的 `web.config` 窗 → 恆回 false。
擋得住只因為下拉選單裡沒有那些日期——那是**畫面上的清單**，不是伺服器端的檢查。

### 哪邊實際生效

生效的只有「雪霸的下拉清單排除」。其餘全部是空轉。

### 什麼情境會踩到

- 機關公告過年封園，改了 `RuleSet`：只有雪霸會反映，玉山與太魯閣不會。
- 任何繞過下拉清單的送出（直接 POST `applystart` 值）在三家都不會被擋。
- SA 讀 `CheckBlockDay.cs` 會以為系統有封園日卡控；實際上它已經停止運作三年。

### 推測成因（推測）

`web.config` 那組 key 的註解寫「過年停機使用」（`web.config:43`），是**每年手動改一次**的設計。
沒有人改，就過期了。雪霸後來被搬到 `RuleSet` 走資料驅動，但只搬了一半——
`IsClose_DayYN` 的雪霸分支雖然寫了，呼叫端 `apply_1_3.aspx.cs:5605` 仍呼叫單參數版。

### 建議處置（重要）

`CheckBlockDay.cs` 與 `web.config:43-45` 必須標註「已失效」，否則接手的人會把它當成現行卡控。

---

## D-2　同意書：前端擋、後端完全不擋

### 兩邊各自的條件與出處

- **前端**：`apply_1_2.aspx:60`
  `<asp:Button ID="btnagree" ... OnClientClick="return Check_true();" OnClick="btnagree_Click" />`
  `Check_true()`（`apply_1_2.aspx:17-25`）逐一檢查 `input[name='chk[]']` 是否全部勾選。
- **後端**：`apply_1_2.aspx.cs:141-197` 的 `btnagree_Click`
  **從頭到尾沒有讀取 `Request.Form["chk[]"]`**。它只查 `EIP_Core_Organization`
  取機關名稱，清空一串 Session，然後 `Response.Redirect` 到對應的申請表。

### 哪邊實際生效

只有前端生效。停用 JavaScript、或直接 POST `__EVENTTARGET=btnagree`，同意書一條都不勾也會進入申請表。

### 連帶：預設已勾選

`apply_1_2.aspx.cs:70-77`：`attention` 表的 `selectchk == "1"` 的條文，
渲染時直接帶 `checked='checked'`。所以連前端那道檢查，多數條文也是一開始就通過的。
（這是**設計決定**不是 bug，但同意條文預設勾選的法律效力需要機關確認——見 mental-model 待問人清單。）

### 連帶：條文順序與篩選

查詢是 `where a.chk='1' AND (a.name IS NOT NULL) and a.orgid=@orgid order by a.ord asc`
（`apply_1_2.aspx.cs:62`）。`chk` 與 `selectchk` 是兩個不同欄位，
`chk='1'` 決定**要不要顯示**，`selectchk='1'` 決定**是否預設勾選**。兩者語意差別需向原廠商確認。

### 什麼情境會踩到

把「逐條同意」寫成一道法律上有效的關卡。實際上它沒有任何伺服器端紀錄——
`btnagree_Click` 也沒有把「使用者同意了哪幾條」寫進任何資料表。

### 這是一個「類」，不是一個 bug

`0 === 0` 型的 fail-open（空集合／未設定值讓閘門通過）在這棵樹裡值得整批掃。
本輪只確認了 `apply_1_2` 這一處，**尚未完成全樹掃描**，列為未覆蓋。

---

## D-3　同一條規則，三家各自實作，連判準都不同

### （一）機關分派：`apply_1` 用 GUID，`apply_1_2` 用機關名稱字串

- `apply_1.aspx.cs:380-404`：以 `hidorg` 的 **GUID** 比對決定去 `apply_1_2` / `apply_forest_area_1` / `apply_forest_camp_1`。
- `apply_1_2.aspx.cs:171-190`：以 `EIP_Core_Organization.name` 的**中文字串**分派——
  `strOrg.IndexOf("雪霸") != -1` → `apply_1_3`；`IndexOf("玉山")` → `apply_1_4`；
  `IndexOf("太魯閣")` → `apply_1_5`；否則 `Response.Redirect("apply_1.aspx")`（打回起點）。

**同一個路由決定，前後兩頁用了兩把不同的鑰匙。** 機關名稱在 DB 改名（例如加上上級機關前綴、
或改用全銜）只要不含那兩個字，使用者會在按下「同意」後被無聲彈回第一頁。

### （二）人數上下限：三家各寫一份，「長程縱走」的定義不同

規則形狀三家一致——`Fixedclimb.peopleset == "1"` 用該路線自訂值，否則退回 `RuleSet` 的機關預設；
兩者都依「雪季 × 長程」四種組合取
`TeamApplyMaxCntGen` / `Genlong` / `Snow` / `Snowlong`（與對應的 `MinCnt`）。
**數值全在 DB，`[缺口]`。**

但實作與判準不同：

| | 太魯閣 | 雪霸 | 玉山 |
|---|---|---|---|
| 位置 | `App_code/tarokoModeCode/tarokoModeCode.cs:152-254` `climbline_Set()`（抽成共用函式） | `apply_1_3.aspx.cs:3026-3075`（**直接內嵌在頁面**） | `apply_1_4.aspx.cs`（`membermax`/`membermin` 共 20 處，另一份實作） |
| 「長程縱走」判準 | **只看** `Fixedclimb.linetype == "1"`（`:169-170`） | `ishard`：`linetype == "1"` **或** 兩組節點條件 `hardsum`／`hardsum2` 命中（`:2537`、`:2658-2716`） | 未逐行確認 |
| 雪季判準 | 查 `snowset` 表，比對入園日起 `sumday` 天（`:177-192`） | `issnow`（同表，實作分離） | 未逐行確認 |

也就是說：**同一條路線、同一組 DB 欄位，在雪霸會被判成「長程」而在太魯閣不會**，
於是取到不同的人數上限。

**邊界**：`tarokoModeCode.cs:159` `string[] snowarray = new string[31]`，
迴圈 `for (q = 0; q < sumday; q++)`（`:172-175`）——`sumday > 31` 會 `IndexOutOfRangeException`。

**C 類（某人的理解）**：`step2.ascx.cs:1555` 的註解寫「申請上限 14 人，下限 2 人」；
機關原文 `notice_a4.aspx`（太魯閣登山須知）在三種路線群下各寫一次
「每隊最多不得超過 12 人」。註解與機關原文不符，且註解描述的是一個**程式並不執行**的常數
（值全部來自 DB）。

### （三）申請期限：資料驅動，但玉山同檔另有寫死的 5 天

- 資料驅動：`RuleSet.ParkPeriodDayBef`（入園日前 N 天）、`RuleSet.ParkPeriodMonthBef`（前 N 月），
  另有 `ParkPeriodDayBefchk`／`ParkPeriodMonthBefchk` 兩個旗標決定基準點是**入園日**還是**出園日**
  ——`apply_1_4.aspx.cs:4411-4428`、`apply_1_3.aspx.cs:804-820`（兩份各寫一次，邏輯相同）。
  數值 `[缺口]`。
- 同一支 `apply_1_4.aspx.cs` 裡另有**寫死的 5 天**：`:1577`、`:1698`、`:6966`、`:7575`
  皆為 `DateTime.Today.AddDays(5)`。與 `ParkPeriodDayBef` 是否一致無法從 code 判定——
  只要 DB 改了那個欄位而沒改這四行，兩者就會分歧。

### （四）機關原文的規則比任何一份實作都細，且沒有實作對應

`notice_a4.aspx`（太魯閣）把申請期限分成三種路線群，各有不同截止時刻：
一般路線「入園 5 天 15:00 前」、羊頭山與畢祿山單攻「3 天 15:00 前」、
錐麓古道單日「前 1 天 15:00 前，週六至翌週一入園應於週五 15:00 前」，
另有「錐麓古道每天每一人限制申請一隊 12 人」。
`notice_a1.aspx`（玉山）分抽籤前後兩段，另有外籍提前申請的名額與國籍搭配比例。
`notice_a7.aspx`（雪霸）給了完整的日期換算範例與 2/29 的特例處理。

**`RuleSet` 的兩個欄位（天／月）承載不了這些規則**——沒有「截止時刻」、沒有「星期別」、
沒有「每人每日一隊」的欄位。這些規則要嘛在別處，要嘛沒有實作。這是全案最大的 `[缺口]`。

---

# 其餘分歧（清單）

## 寫死日期字面值，到期靜默失效

| # | 位置 | 內容 | 今日（2026-09-07）狀態 |
|---|---|---|---|
| D-4 | `apply_1.aspx.cs:306`、`:317` | 錐麓古道（`c_id` 132／21）、清水山（`c_id` 35）的「持續封閉並暫停入園申請」公告文字，條件 `< 20260101` | **已失效，文字不再顯示** |
| D-5 | `apply_1.aspx.cs:328` | 奇萊南峰（`c_id` 25）封閉公告，條件 `< 20241227` | **已失效** |
| D-6 | `apply_1_2.aspx.cs:123` | 雪霸專屬彈窗，條件 `<= 20220405` | **已失效** |
| D-7 | `en/apply_1.aspx.cs:274`、`:285`、`:296` | 與 D-4/D-5 同樣三段，英文版各寫一次 | 同樣失效 |
| D-8 | `jp/apply_1_2.aspx.cs:106` | 與 D-6 同 | 同樣失效 |

**D-4／D-5 只是顯示文字，不擋申請**：`apply_1.aspx.cs:370-404` 的 `New_List_ItemCommand`
不看 `c_id`，照樣 `Response.Redirect` 進申請流程。
**日文版沒有這三段封閉公告**（`jp/` 無對應 `apply_1.aspx.cs` 命中）。

## 同一份 code 的多份複本

| # | 分歧 | 出處 |
|---|---|---|
| D-9 | **玉山申請表在樹裡至少 6 份變體**：zh `apply_1_4.aspx.cs`(589,611)／en `apply_1_4`(593,230)／jp `apply_1_4`(590,950)／zh `apply_1_49`(590,167)／en `apply_1_41`(523,153)／jp `apply_1_41`(514,550)，另有 `apply_1_4_1`／`_4_11`／`_4_2`／`_4_21`／`_4_6`／`_4_7`。改一條玉山規則要改幾份，無法從 code 判定。 |
| D-10 | **雪霸申請表**：zh `apply_1_3`(520,474)／en `apply_1_3`(499,514)／en `apply_1_31`(502,672)，另有 `apply_1_3_1`／`_3_2`／`_3_3`／`_3_6`／`_3_7`。 |
| D-11 | **`apply_1_49.aspx`（590KB）沒有任何 inbound redirect**（全樹 grep 無呼叫端），但 `.aspx` 存在即可被 IIS 直接請求。它自己的檔頭 `:20` 寫著 `//apply_1_49.aspx?a_id=&sid=&nation=&tmpf_id=29&tmpc_id=89&fc_id=158 山屋申請測試`。**是可直接送達的孤兒頁，且與正式玉山表單只差 556 bytes**。這是任務所指「主流程擋得住、某個入口繞過去」的最強候選，**未驗證其驗證邏輯是否與 `apply_1_4` 一致**。 |
| D-12 | **`ucControl` 有兩份**（根目錄與 `en/`），各含 4 支日期選擇器，共 8 份。`jp/apply_6.aspx:4` 引用 `../en/ucControl/`，而 `jp/bed_3.aspx:4` 引用 `../ucControl/`——**同一個 jp 目錄內兩種路徑指向兩份不同的元件**。 |
| D-13 | `ucDatePicker.ascx.cs` 與 `ucDatePicker2.ascx.cs` 共 625 行，**只差 2 行**：class 名稱，以及 `:352` 一個有 `Common_fun.De_EnCode(...)`、一個沒有。命名沒有任何線索說明差別。 |

## 設定與部署

| # | 分歧 | 出處 |
|---|---|---|
| D-14 | `web.config:78` 的 `WSUrls` 指向 **`http://localhost:804/masterapi/masterapi.ashx`**，正式位址被註解在 `:77`。讀取它的有 `apply_1_4.aspx.cs:80`、`apply_1_49.aspx.cs:71`、`apply_forest_camp_1/2`、`bed_0.aspx.cs:18`（皆 `.ToString()`，若 key 不存在會 NRE）。 |
| D-15 | `web.config:15` `pdftype = "1"`，註解 `:14` 寫「1本機，2 59主機，3正式機」。這使 `apply_1_4.aspx.cs:4434` 的 `pdftype == "3"` 分支不成立——玉山線 2 天路線那段 2018 年的日期閘門在此部署上被跳過。 |
| D-16 | `web.config` 的 `isusedproxy`／`proxyserver`／`UseSSL`／`SetHttpXForwardedFor` 各出現兩次（`:47-50` 與 `:70-73`）且**沒有 `<remove>`**，與同檔其他 key 的寫法不同。`appSettings` 對重複 key 的行為需實測確認；`HikeNationpark` 內未見讀取這四個 key，影響範圍待查。 |
| D-17 | `web.config:135-136` `customErrors mode="Off"` ＋ `debug="true"`；`:17-19`、`:38-39` 有明文帳密。屬部署風險，非規則分歧，列此備查。 |

## 資料查詢

| # | 分歧 | 出處 |
|---|---|---|
| D-18 | `apply_1.aspx.cs:151-152`：選「玉管處」時查詢範圍是 `fm.ord between 100 and 1000`；選其他機關或「全部」時是 `0 and 9999`（`:144-145`、`:158-199`）。**同一批玉山路線，在「全部」與「玉管處」兩種篩選下數量可能不同。** |
| D-19 | `apply_1.aspx.cs:223`：主查詢寫死 `and f.c_id <> 62`，無註解說明排除原因。 |
| D-20 | `apply_1.aspx.cs:18` 的 `forest_area` 陣列有三個 GUID（…5A85／5A86／5A87），查詢時三個都納入（`:185-192`），但畫面上只產生一顆按鈕（…5A85，`:128`）。另外兩個機關沒有入口。 |
| D-21 | `apply_1.aspx.cs:396-398`：林業署山屋分支用 `hidsource_guid` 當 `unit` 參數，其餘分支用 `hidorg`。同一個參數名帶不同來源的值。 |
| D-22 | `apply_1_2.aspx.cs:36-42`：`if (Request.QueryString["camp_id"] != "0")` — 參數不存在時 `null != "0"` 為 **true**，於是 `Session["NeedFromForestCamp"]` 被設成 `null` 而非 `"0"`。下游若 `.ToString()` 會 NRE。**未追下游消費端，列為待驗證。** |

## 在地化

| # | 分歧 | 出處 |
|---|---|---|
| D-23 | `en/ucControl/ucDatePickerCETW.ascx:5-8`：英文版的上午／下午下拉，Text 與 Value **都是中文**。code-behind `:35` 以 `ddlNoon.SelectedValue == "下午"` 比對，因此邏輯正確，但英文使用者看到中文選項。 |
| D-24 | `jp/` 缺 `apply_1_3`（雪霸）、`apply_1_5`（太魯閣）、`apply_forest_*`、`apply_npa_*`。**日文介面只能申請玉山。** |
| D-25 | `apply_2_3.aspx.cs:82`、`:97`：中文版的異動流程會把外籍案件 `Response.Redirect` 到 `en/apply_1_31.aspx`／`en/apply_1_41.aspx`——**跨語系目錄跳轉**，使用者語言在此被強制切換。 |

---

# 已查證、**不是**分歧

- `ucControl\ucDatePickerCETW.ascx.cs` vs `en\ucControl\ucDatePickerCETW.ascx.cs`：去縮排後 571 行僅 20 行差異，**其中有意義的只有 jQuery datepicker 的月份／星期名稱**（中文 vs 英文）。是正常的在地化分支，不是漂移。
- `apply_1_2.aspx.cs:62` 的同意書查詢**有** `order by a.ord asc`，條文順序是資料驅動的。

---

# 本輪未覆蓋（下一步從這裡開始）

1. **`0 === 0` 型 fail-open 的全樹掃描**——D-2 只確認了一處。
2. **`apply_1_49.aspx` 與 `apply_1_4.aspx` 的實質差異**（各 590KB）——D-11 的孤兒頁是否缺少驗證。
3. **玉山 `apply_1_4` 的人數與長程判準**——D-3（二）表格中玉山那一欄。
4. `apply_forest_area_*`／`apply_forest_camp_*`／`apply_npa_*` 三條非國家公園流程完全未讀。
5. `apply_2`（異動取消）／`apply_3`（進度查詢）／`apply_4`（繳費）／`apply_5`（退費）未讀。
6. `bed_*`（承載量與床位）11 支未讀——名額與候補規則在這裡。
7. `App_code/` 未讀者：`Paramdata.cs`(69KB)、`YuShanFun.cs`(89KB)、`SheipaWebService.cs`(33KB)、
   `BlackList.cs`（違規停權）、`CampBed.cs`、`Fixedclimb*.cs`、`FiscApi.cs`（金流）。
8. `NationPark/`（19,233 檔，後台管理系統）完全未讀。
   **2026-09-11 更新**：已有功能與畫面層級的替代資料（106 年後台操作手冊），
   見 `2026-09-11-106年操作手冊可用內容.md`。不替代讀 code。

---

# 106 年手冊 vs 現況：這些是變更史，不是分歧（2026-09-11 新增）

來源 `01_Raw_Input/10604_系統操作手冊(前台／後台).pdf`（版本 10604001＝106 年 4 月）。
**證據位階：當前截圖／DB 實測 ＞ 106 年手冊。** 以下每一列都是「106 年是 X、現況是 Y」，
**不是要把 Y 改回 X**；列在這裡是因為 code 裡很可能還留著 X 時期的殘留，
讀到那些殘留時才不會誤判為現行邏輯。

| # | 項目 | 106 年（手冊） | 現況（當前截圖／`02_Spec`） | 對接手的意義 |
|---|---|---|---|---|
| H-1 | 線上繳費管道 | **4 種**：現金／郵政匯票／金融機構轉帳（離線，列印繳費說明單）＋**E 政府電子付費平臺**（線上，僅信用卡與 Web ATM；Web ATM 需晶片卡＋自備讀卡機、Combo 不適用、行動版不支援）。前台 印 175-180 | **6 種**：金融機構轉帳／郵政匯票／現金／臺灣PAY／超商繳費／信用卡。手續費 10／15／39 元。`02_Spec/線上繳費(排雲).md` | **線上金流對接對象換過**。`App_code/FiscApi.cs`（未讀）與繳費頁裡若出現 E 政府平臺的欄位或回拋處理，那是舊時期殘留，不是現行管道 |
| H-2 | 繳費流程的回拋 | 平臺**無論成功或失敗都回拋交易結果**給本系統，系統顯示於畫面。前台 印 179 | `02_Spec` 未記回拋機制 | 現行是否仍有回拋、寫進哪張表，讀 `apply_4` 時要留意（`campmanagefees` 之外可能另有交易紀錄） |
| H-3 | 草稿保留天數 | **7 日**，7 日後系統自動刪除。前台 印 153 | **30 日**（提示視窗原文）。`02_Spec/草稿編輯.md` | 7→30 是歷史變更。後台「規則設定」**沒有**這個欄位，所以它不在 `RuleSet`，寫在哪仍待查 |
| H-4 | 案件狀態的命名 | **後台審核進度九種**：待抽籤／待處理／補件／書件通過／**宿營地不足後補**／**路線承載量不足後補**／已通過／退件／取消。後台 印 53、60、66 | 前台 `getStatusTitle` 的碼名：中籤／排隊預約／核准入園／初審完成…（`hike_api_code.cs:603-650`） | **同一批案件有兩套命名**。前台把 `3`／`6`／`7` 三碼都叫「排隊預約」，後台卻分得出兩種後補——對照關係待確認（見 `mental-model.md` 第 22 題），**不要把前台碼名當成機關的用語** |
| H-5 | 後台網址 | `http://npm.cpami.gov.tw/NationPark`（**http**、營建署網域）。後台 印 12 | 未查 | 引用後台位址前先確認，勿照抄 |

## 已查證不是分歧（同上來源）

- **三處承載量邏輯不同不是 code 寫歪**：後台「規則設定」的「承載量計算方式」本來就是每個機關各自設
  「依路線」（太管處，次要條件才看宿營地）或「依宿營地」（雪管處，不限路線承載量）。後台 印 28。
- **離線繳費的三張說明單兩個觀測點仍是同一組**（現金／郵政匯票／金融機構轉帳）：
  `01_Raw_Input/操作畫面截圖/` 的三張玉管處說明單與手冊圖 189-191 對應一致。
- **費用明細的呈現一致**：「依住宿日期按日條列」兩個觀測點相同。前台 印 173。

---

# 附註

`04_Handover/附錄-雛形與正式系統落差_參考用.md` 是先前針對 `05_Prototype/`（UI 雛形）做的同型分析。
**那不是本任務的交付物**，標的不同；保留是因為「雛形怎麼寫」與「正式系統怎麼做」的落差
本身對改版有參考價值。引用時務必先確認講的是哪一套。
