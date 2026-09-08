# 機關原文 vs code 實作 對照表

產出：2026-09-08

## 兩份來源與一個前提

| | 來源 | 性質 |
|---|---|---|
| **原文** | `05_Prototype/components/NoticeDetailData.js`（`notice_a1`–`a10`／`b1`–`b7`，17 頁，檔頭自述「逐字照抄，只重組結構，不改寫文字」） | 機關規則原文 |
| **原文** | `05_Prototype/components/ConsentData.generated.js`（`attention` 表匯出，45 條） | 機關規則原文 |
| **實作** | `\\10.0.0.51\d$\WEB\nationalpark\HikeNationpark`（正式系統，唯讀） | code |

**前提**：原文在本 repo（雛形轉錄），實作在正式系統。兩者不同機器，出處前綴不同——
原文列出處寫 `notice_xx` 或 `attention dbId=nn`；code 列出處一律指正式系統的 `HikeNationpark\`。

## 判定四種

| 判定 | 意思 |
|---|---|
| **一致** | code 有對應實作，且行為與原文相符 |
| **不一致** | code 有實作，但條件、數值或範圍與原文不同 |
| **沒實作** | 全樹搜尋後找不到對應實作（不猜） |
| **值在DB(待查)** | code 有實作骨架，但數值來自資料庫欄位；已註明表名欄名 |

## 先講三件影響全表的事

1. **林業署四座山屋（檜谷／天池／嘉明湖・向陽／九九）的規則，大多不由這套系統執行。**
   一站式只透過 API 轉送（`web.config:104-111`、`:118-121` 的 `jmonline_APIURL`／`kgonline_APIURL`／
   `tconline_APIURL`／`sendTeamsDataUrl`）。`notice_b1`–`b7` 的申請期限、抽籤、繳費、退費、
   停權條文，判定一律是「**沒實作（外部系統）**」——不是漏做，是不歸這套系統管。
   例外是**九九山莊**：`b7` 原文明寫「請至臺灣登山申請一站式服務網申請」，
   而系統確實有 `App_code/JiujiuHutApi_code/`（9 支）在對接。
2. **人數、期限、承載量的數值全部在 DB**，不在 code。這些列判「值在DB(待查)」，是你要連 DB 補的清單。
3. **`notice_a2`／`a5`／`a8`（三家的「申辦規定與須知」）只有法規名稱清單，沒有可抽取的數值**，
   全表未列。`notice_a3`／`a6`／`a9`（緊急聯絡資訊）與 `a10`（糧食裝備）同理。

---

# 一、申請期限

| 規則（原文） | 原文出處 | code 怎麼做 | code 出處 | 判定 |
|---|---|---|---|---|
| 玉山一般路線：預定入園日前 5 天至前 2 個月提出申請 | `notice_a1` 申請期限 | 起日 `DateTime.Now.AddDays(start)`、迄日 `DateTime.Now.AddMonths(end)`，`start`／`end` 讀自 `RuleSet` | `apply_1_4.aspx.cs:4406-4407`、`:8907`（`ParkPeriodDayBef`）、`:8929`（`ParkPeriodMonthBef`） | **值在DB(待查)**　表 `RuleSet`／欄 `ParkPeriodDayBef`、`ParkPeriodMonthBef`（依 `OrgID`） |
| 期限基準點是「入園日」或「出園日」 | 原文未區分 | 由旗標決定：為 0 用入園日；非 0 時起日改 `AddDays(start + 1 - 總天數)`、迄日改 `AddMonths(end).AddDays(1 - 總天數)` | `apply_1_4.aspx.cs:4411-4428`、`apply_1_3.aspx.cs:804-820` | **值在DB(待查)**　表 `RuleSet`／欄 `ParkPeriodDayBefchk`、`ParkPeriodMonthBefchk` |
| 玉山：同一支程式的其他四處「5 天」判斷 | `notice_a1`「不受理 5 日以內之申請」 | **寫死** `DateTime.Today.AddDays(5)`，不讀 DB | `apply_1_4.aspx.cs:1577`、`:1698`、`:6966`、`:7575` | **不一致**（與上一列同條規則，一半資料驅動一半寫死）<br>接手若照原文預期：改了 `RuleSet.ParkPeriodDayBef` 以為全站生效，這四處仍用 5 |
| 玉山抽籤前：預定抽籤時間前至入園日前 2 個月 | `notice_a1` 申請期限 1.；`attention` dbId=7 | 未找到「抽籤前／抽籤後」兩段式期限的分段實作；期限只有 `RuleSet` 的單一組天／月 | — | **沒實作**<br>接手若照原文預期：以為系統會依抽籤狀態切換兩套期限，實際只有一套 |
| 玉山抽籤後：可於入園日 5 天前提出，依受理時間先後排序遞補至額滿 | `notice_a1` 申請期限 2. | 同上 | — | **沒實作** |
| 太魯閣一般路線：入園 5 天 **15:00 前**至 2 個月前；入園前 5 天內不予受理 | `notice_a4` 申請期限 三.（一）（三）；`attention` dbId=14 | `RuleSet` 只有「天」與「月」兩欄，無「截止時刻」欄位 | `tarokoModeCode.cs:222`（`select * from RuleSet where orgid=@orgid`） | **沒實作**（時刻部分）<br>接手若照原文預期：以為 15:00 是系統擋的，實際上系統只認「天」 |
| 太魯閣羊頭山／畢祿山單攻：入園 **3 天** 15:00 前至 2 個月前 | `notice_a4` 申請期限 三.（二）；`attention` dbId=14 | `RuleSet` 以 `orgid` 為鍵，一家一筆，無路線群層級的期限 | `tarokoModeCode.cs:220-222` | **沒實作**<br>接手若照原文預期：以為不同路線群有不同期限，實際上全太魯閣共用同一組天／月 |
| 太魯閣錐麓古道單日：入園前 **1 天** 15:00 前至 2 個月前；**週六至翌週一入園應於週五 15:00 前** | `notice_a4` 申請期限 四.（一）（三）；`attention` dbId=14 | 無星期別條件的實作 | — | **沒實作** |
| 雪霸：入園日前 5 日至前 2 個月，每日 07:00-23:00 提出，所有行程日期皆須在範圍內 | `notice_a7` 申請期限；`attention` dbId=31 | 天／月同玉山走 `RuleSet`；每日時段見「三、系統受理時段」 | `apply_1_3.aspx.cs:804-820` | **值在DB(待查)**　表 `RuleSet`／欄 `ParkPeriodDayBef`、`ParkPeriodMonthBef` |
| 入山許可證：取得入園許可後，可於**入山之日前 3 日至 45 日內**申請 | `notice_a1` 其他 3. | 未找到 3／45 的期間檢查 | — | **沒實作** |

---

# 二、人數與隊伍組成

| 規則（原文） | 原文出處 | code 怎麼做 | code 出處 | 判定 |
|---|---|---|---|---|
| 玉山開放路線（一般）：每隊 **1 至 12 人** | `notice_a1` 申請資格 2. | 依「雪季 × 長程」四種組合取 `TeamApplyMaxCnt*`／`TeamApplyMinCnt*`；先看路線 `peopleset` 是否為 `"1"`，是則用路線值，否則用機關預設 | `apply_1_4.aspx.cs`（`membermax`／`membermin` 20 處） | **值在DB(待查)**　表 `Fixedclimb`（依 `c_id`）與 `RuleSet`（依 `orgid`）／欄 `TeamApplyMaxCntGen`、`TeamApplyMinCntGen` 等 8 欄 |
| 玉山主（西）峰單日往返：每隊 1 至 12 人，**每日 60 人** | `notice_a1` 申請資格 | 每日承載量另由 `YuShanFun` 的單日往返承載量處理（平日／假日分開） | `App_code/YuShanFun.cs:1399`、`:1406`、`:1420`（假日）、`:1429`（平日） | **值在DB(待查)**　承載量來源欄位需連 DB 確認（見 §七） |
| 玉山雪季／雪訓：**每隊以 6 人為限，1 名領隊＋5 名隊員** | `notice_a1` 申請資格 雪季期間入園 3. | 雪季走 `TeamApplyMaxCntSnow`／`Snowlong`，是**同一組上下限欄位**，無「1 領隊＋5 隊員」的比例檢查 | `apply_1_3.aspx.cs:3036-3037`（雪霸同構）、`tarokoModeCode.cs:203-204` | **值在DB(待查)**（上限 6）＋**沒實作**（領隊/隊員比例） |
| 太魯閣：每隊最多不得超過 **12 人**（三種路線群各載明一次） | `notice_a4` 申請期限 三.（二）、（二）、四.（二） | 同上結構，抽成 `climbline_Set()` | `App_code/tarokoModeCode/tarokoModeCode.cs:194-247` | **值在DB(待查)**　表 `Fixedclimb`／`RuleSet` 同上 |
| 太魯閣錐麓古道：**每天每一人限制申請一隊 12 人**，申請人／領隊／隊員不得重複申請 | `notice_a4` 申請期限 四.（二） | 未找到「同日同一人只能出現在一隊」的檢查 | — | **沒實作**<br>接手若照原文預期：以為系統會擋同一人同日重複報名，實際不擋 |
| 玉山：**人員於同一日不得重覆申請** | `notice_a1` 申請資格 | 同上 | — | **沒實作** |
| 雪霸：原文無人數條款 | `notice_a7`、`attention` 雪管處 13 條 | 仍走 `TeamApply*Cnt*` 四組欄位 | `apply_1_3.aspx.cs:3026-3075` | **值在DB(待查)**（原文無對應規則，數值僅存在於 DB） |
| 隊員實填人數須等於宣告人數 | 原文未載 | `(隊員清單筆數 + 1) != 宣告人數` 時報「申請人數與隊員數不符」 | `tarokoapplyControl/step2.ascx.cs:2256-2258` | **一致**（code 有、原文無，屬合理實作） |
| 「長程縱走」的判定 | `notice_a1` 申請資格：以**路線清單**列舉（八通關線、南二段線…） | 太魯閣：只看 `Fixedclimb.linetype == "1"`；雪霸：`linetype == "1"` **或**兩組節點條件命中 | `tarokoModeCode.cs:169-170` vs `apply_1_3.aspx.cs:2537`、`:2658-2661`、`:2691-2693`、`:2713-2716` | **不一致**（兩家判準不同）<br>接手若照原文預期：以為「長程」是固定的路線清單，實際是兩套推導，且同路線在兩家可能判不同 |

---

# 三、系統受理時段與抽籤時段

| 規則（原文） | 原文出處 | code 怎麼做 | code 出處 | 判定 |
|---|---|---|---|---|
| 每天 07:00 至 23:00 受理申請；23:00 至隔日 07:00 暫停受理，**仍可儲存草稿** | `attention` dbId=10（玉管處）、dbId=32（雪管處）；`notice_a4` 其他一. | 只有 API 路徑有這道閘門：`GetTime > 230000 && < 235959` 或 `< 070000 && > 000000` 時回「本系統於每日23：00至隔日07：00暫停受理申請」。**網頁申請流程（`apply_1_3`／`_1_4`／`_1_5`）未找到對應檢查** | `App_code/HSTSModel/WebTravelClass.cs:246-253` | **不一致**<br>接手若照原文預期：以為全站 23:00 後關閉，實際只有 API 關，網頁流程不關 |
| 同上（邊界） | 同上 | 比較用 `>`／`<` 而非 `>=`／`<=`：**恰好 23:00:00、23:59:59、00:00:00、07:00:00 四個時點不成立** | `App_code/HSTSModel/WebTravelClass.cs:246`、`:250` | **不一致**（差一個等號） |
| 玉山：抽籤期間暫停該批申請案的線上申請及異動 | `notice_a1` 抽籤程序 3.；`attention` dbId=22 | 查 `ApplyBanTimeMuti`，以 `(beginHour*100+beginTime) <= 現在 < (endHour*100+endTime)` 判定，並比對 `livedate` 是否落在行程區間 | `apply_1_4.aspx.cs:10982-10996` | **值在DB(待查)**　表 `ApplyBanTimeMuti`／欄 `drawdate`、`beginHour`、`beginTime`、`endHour`、`endTime`、`livedate` |
| 玉山抽籤時間：入園日或住宿日前 1 個月之 **15:00–16:00**（遇假日順延，改上班日 09-10、12-13、15-16 三時段） | `notice_a1` 抽籤程序；`attention` dbId=22 | 時段值來自 `ApplyBanTimeMuti`，非寫死 | 同上 | **值在DB(待查)**　同上表 |

---

# 四、抽籤、遞補與候補

| 規則（原文） | 原文出處 | code 怎麼做 | code 出處 | 判定 |
|---|---|---|---|---|
| 玉山：多日行程其中一日未中籤者，逕予退件 | `notice_a1` 抽籤結果；`attention` dbId=1047 | 抽籤節點以 `hidarrayid` 拆日檢查（多日行程檢查抽籤節點） | `apply_1_4.aspx.cs:10999-11004` | **值在DB(待查)**／需再讀完整分支才能判定行為是否等同「逕予退件」 |
| 玉山：遞補期限至預定入園日前 **5 天** | `notice_a1` 遞補程序 | 未找到獨立的遞補期限檢查；玉山的 5 天寫死處見 §一 | `apply_1_4.aspx.cs:1577` 等 | **沒實作**（遞補專用期限） |
| 玉山：「備取」隊伍優先於「排隊遞補」，順序為備取 1、2、3 | `notice_a1` 遞補程序 | 有「優先遞補順位」概念與名額發放數增減 | `App_code/YuShanFun.cs:1145`（有備取時）、`:1168`、`:1197`、`:1209`、`:1378`、`:1484`、`:1500` | **值在DB(待查)**　順位值寫入紀錄，需連 DB 看欄位 |
| 玉山申請狀態 | 原文以中文描述（中籤／備取／核准…） | 狀態碼：`3,6,7`=排隊預約、`0`=中籤、`1,9,10`=待補件/繳費、`11`=複審完成、`4`=核准入園、`12`=備取、`17`=初審完成 | `App_code/YuShanFun.cs:2190-2382` | **不一致**（命名）：`17` 在同檔 `:2251` 稱「初審完成」、`:2361` 稱「備取」 |
| 抽籤前後的統計依據 | 原文未載 | 抽籤前讀 `applylist.status`；抽籤後讀 `booking.afterstatus`。六格中**只有「排隊預約」對 `afterstatus is null` 做退回** | `YuShanFun.cs:2300`（有退回）vs `:2311`、`:2322`、`:2333`、`:2344`、`:2356`、`:2367`（無） | **不一致**<br>接手若照原文預期：以為各狀態統計加總等於總案件數，實際 `afterstatus` 未回填者會從五格消失 |
| 太魯閣：每天每一登山路線有 **10 隊**候補名額 | `notice_a4` 遞補程序 | 候補為排程程序，篩選條件 `status=7 and project not in (10,1)`；未在 code 中找到「10 隊」上限常數 | `App_code/taroko/taroko_waitinglist.cs:91` | **值在DB(待查)** 或 **沒實作**——需連 DB 確認是否有候補上限欄位 |
| 太魯閣：第一候補須於指定日 **15:00 前**修正人數，否則退件 | `notice_a4` 遞補程序 | 有「第一順位候補通知信」與 `waitingenddate` 下午 3 點前修改資料的訊息文字 | `App_code/taroko/taroko_waitinglist.cs:235-242` | **一致**（訊息層面）；`waitingenddate` 的計算來源未讀完 |
| 太魯閣：候補截止時間依各申請路線規定日期（例：奇萊主北 出發 5 天 15:00 前） | `notice_a4` 遞補程序 | 同上 | 同上 | **值在DB(待查)** |
| 太魯閣：北一段縱走北二段與其南往北路線共同承載量 | `notice_a4` 未載明；`OpenStatus` 備註載「共同承載量」 | **硬編碼** `climblineid == "28" \|\| "109"` → where 條件改 `climblineid in (28,109)` | `App_code/taroko/taroko_waitinglist.cs:76-79` | **不一致**（規則寫死在程式，非資料設定）<br>接手若照原文預期：以為共同承載量可在後台設定，實際新增一組要改 code |
| 太魯閣：屏風山屋路線不做第一候補 | 原文未載 | 註解明載「屏風山屋路線不做第一候補」 | `App_code/taroko/taroko_waitinglist.cs:181`；另見 `App_code/taroko/PingfongCabin.cs` | **不一致**（code 有、原文無） |
| 雪霸：候補／遞補機制 | `notice_a7` 遞補程序 | `App_code/SheipaWebService.cs` 中「候補／遞補／備取／承載量／額滿」關鍵字**零命中** | — | **沒實作**<br>接手若照原文預期：以為三家都有候補，實際只有玉山（抽籤遞補）與太魯閣（排程候補） |

---

# 五、年齡與資格

| 規則（原文） | 原文出處 | code 怎麼做 | code 出處 | 判定 |
|---|---|---|---|---|
| 太魯閣：申請人需為**年滿 18 歲**成年人 | `notice_a4` 申請資格 | 以入園日與生日比較 `birthday.AddYears(18)`，未滿者不得為申請人 | `tarokoapplyControl/step2.ascx.cs:1303`、`:2624`；`.ascx:555`、`:708` | **一致** |
| 太魯閣：領隊需為年滿 18 歲成年人 | `notice_a4` 申請資格 | 同上 | `tarokoapplyControl/step2.ascx:759`、`:902` | **一致** |
| 太魯閣：隊員未滿 18 歲須取得家長同意並上傳同意書 | `notice_a4` 申請資格 | 未滿 18 時顯示 `applylist_files` 中 `filetype=4` 的同意書並開上傳 | `tarokoapplyControl/step2.ascx.cs:1305-1321`、`:1721` | **一致** |
| **70 歲以上須附切結書** | **原文完全未載** | 入園日大於 `birthday.AddYears(70)` 時，顯示 `applylist_files` 中 `filetype=70` 的切結書 | `tarokoapplyControl/step2.ascx.cs:1304`、`:1324-1335` | **不一致**（code 有規則、原文沒有）<br>接手若照原文預期：不會知道有年齡上限相關文件要求 |
| 雪霸：未滿 18 歲不得為申請人／領隊 | `notice_a7` 申請資格「領隊需為成年人」 | `:5696`（申請人）、`:5702`（領隊）為**啟用**；同檔 `:1180`、`:1187` 另有一份**已被註解**；`:5708`（留守人）**被註解** | `apply_1_3.aspx.cs:5686-5708`、`:1170-1193`、`:4469`、`:5003` | **一致**（申請人、領隊）／**沒實作**（留守人年齡） |
| 玉山：未成年隊員須取得家長同意且不能當領隊 | `notice_a1` 申請資格 | 有 18 歲相關判斷 18 處 | `apply_1_4.aspx.cs`（`AddYears(18)`／`未滿18` 共 18 處） | **值在DB(待查)**／需逐行確認——本輪只確認存在，未確認條件與原文完全相符 |
| 生日合理性 | 原文未載 | `DateTime.Now.Year - 生日年 > 100` 時報錯 | `apply_1_3.aspx.cs:6199`、`:6204`、`:6211` | **一致**（code 有、原文無，屬合理防呆） |

---

# 六、違規停權

| 規則（原文） | 原文出處 | code 怎麼做 | code 出處 | 判定 |
|---|---|---|---|---|
| 玉山四級停權：未依規入園**半年**／違反國家公園法第 13 條第 8 款**半年**／違反第 19 條**1 年**／情節重大**3 年** | `notice_a1` 其他 | 停權期間存於 `tb_Blacklist` 的 `Blacklist_sdate`～`Blacklist_edate` 區間，由後台建檔；code 只做區間比對，不計算級距 | `App_code/BlackList.cs:85-139` | **值在DB(待查)**　表 `tb_Blacklist`／欄 `Blacklist_pid`、`Blacklist_OrgID`、`Blacklist_sdate`、`Blacklist_edate`、`Blacklist_IrrType` |
| 玉山：已於入園日 **7 天前**取消或因天候取消者，不受半年停權限制 | `notice_a1` 其他（一）但書 | 未找到「7 天前取消」的例外判斷 | — | **沒實作** |
| 太魯閣違規態樣：未於入園前 1 天 15:00 前取消而未到者，申請人／領隊／未到隊員各記違規 | `notice_a4` 其他 | 記違規由後台建檔（`tb_Blacklist`），前台只查詢 | `App_code/BlackList.cs` | **值在DB(待查)**　同上表 |
| 黑名單比對範圍 | 原文：停權期間內不得申請 | SQL 只比對 `@sdate` 或 `@edate` 是否落在停權區間內；**未涵蓋「停權區間完全落在行程區間之內」**（例：行程 1/1–1/10、停權 1/3–1/5 → 兩個條件皆不成立） | `App_code/BlackList.cs:52-56`、`:104-108`、`:165-179`；對照**被註解的舊版**多一條 `Blacklist_sdate between @sdate and @edate`（`:126`、`:184`） | **不一致**<br>接手若照原文預期：以為停權者一定擋得住，實際上短期停權被長行程包住時會漏擋 |
| 停權是否跨機關 | `notice_b3`／`b7`：停權及於「林保署轄管所有自然步道附屬山屋」 | `Blacklist_IrrType = 'J'` 的那段 union **不限 `Blacklist_OrgID`**（跨機關生效）；其餘類型限機關 | `App_code/BlackList.cs:59-65`、`:110-116` | **值在DB(待查)**　欄 `Blacklist_IrrType` 的代碼意義需向原廠商確認（已知 `'C'` 被排除、`'J'` 跨機關、`'G'` 專用於 `climblineid=150`） |
| 林業署山屋停權級距（喧嘩 3–6 個月／未依名單 1 年／盜用身分 1–3 年／永久停權等） | `notice_b1` 13.、`notice_b2` 7.、`notice_b3` 十六、`notice_b7` 十四 | 由各林區管理處自有系統執行 | — | **沒實作（外部系統）** |

---

# 七、名額與承載量

| 規則（原文） | 原文出處 | code 怎麼做 | code 出處 | 判定 |
|---|---|---|---|---|
| 玉山：承載量依各宿營地點限額管理 | `notice_a1` 申請資格 | 依 `node_id` ＋ `booking_date` 統計各狀態筆數與已排床位／營位數 | `App_code/YuShanFun.cs:2190-2382` | **值在DB(待查)**　表 `booking`／`applylist`／`apply_teams`／`booking_bed_yushan`／`bedlist`（欄 `bedtype`：`1`=床位、其餘=營位） |
| 玉山單日往返：平日／假日不同承載量 | `notice_a1`（每日 60 人） | 平日與假日分開取值 | `App_code/YuShanFun.cs:1420`（假日）、`:1429`（平日） | **值在DB(待查)** |
| 太魯閣：路線與山屋承載量 | `notice_a4` 遞補程序 | 承載量取得抽成獨立檔 | `App_code/taroko/taroko_getbednum.cs`（37,583 bytes，本輪未讀） | **值在DB(待查)** |
| 統計排除條件 `IsNotRecovery` | 原文未載 | 多數統計格加 `isnull(IsNotRecovery,'0') <> '1'`；**抽籤前的 status 17 那格沒有** | `YuShanFun.cs:2257`（無）vs `:2234`、`:2246`（有） | **不一致**（同函式內條件不一） |
| 嘉明湖：向陽山屋 70 床＋嘉明湖山屋 70 床＋營位 6 座，每日共 176 人 | `notice_b3` 十 | 外部系統（`jmonline_APIURL`） | `web.config:104-105` | **沒實作（外部系統）** |
| 九九山莊：床位 150 床，每日共 150 人 | `notice_b7` 八 | 有專屬 API 對接 | `App_code/JiujiuHutApi_code/JiujiuHut _bed68Code.cs`（19,680 bytes，本輪未讀）；`web.config:118-121` | **值在DB(待查)**／需讀該檔確認 |

---

# 八、外籍人士

| 規則（原文） | 原文出處 | code 怎麼做 | code 出處 | 判定 |
|---|---|---|---|---|
| 玉山：外國人住宿排雲山莊提前申請，預定入園日前 **35 天至前 4 個月** | `notice_a1` 外籍人士；`attention` dbId=9 | 外籍提前是**獨立路線**（`Fixedclimb.isforeign=1`），中文站查詢一律 `isforeign=0` 過濾掉，`en/` 站才 `isforeign in (0,1)` | `apply_1.aspx.cs:82`、`:102`；`apply_1_3.aspx.cs:224`（`isforeign=0`）vs `apply_1_3_2.aspx.cs:121`（`in (0,1)`） | **值在DB(待查)**　期限仍走 `RuleSet`，路線區分走 `Fixedclimb.isforeign` |
| 玉山：非假日（週日至週四）每日原則提供 **24 個名額**，每 **10 個外國人搭配 2 名本國人** | `notice_a1` 外籍人士；`attention` dbId=9 | 未找到名額或比例的實作；`foreignerresvedplaces` 欄位存在但一律寫入 `DBNull.Value` | `apply_1_4_1.aspx.cs:2042`、`apply_1_4_2.aspx.cs:988` | **沒實作**<br>接手若照原文預期：以為系統會控管外籍每日保留名額與國籍比例，實際上該欄位永遠是 NULL |
| 太魯閣錐麓古道外籍提前：入園 **35 天前至 4 個月內**，非假日（週一至週四），同一年度僅能申請 1 次 | `notice_a4` 外籍人士 | 有外籍專屬排程檔 `taroko_applydateOpenForeign.cs`、`taroko_roadbookOpenForeign.cs`（本輪未讀） | `App_code/taroko/taroko_applydateOpenForeign.cs`（4,822 bytes） | **值在DB(待查)**／需讀該兩檔 |
| 太魯閣錐麓古道外籍：每天每一人限申請一隊 12 人，國籍均須為外籍 | `notice_a4` 外籍人士（二） | 未找到「同日同一人一隊」與「全隊須為外籍」的檢查 | — | **沒實作** |
| 雪霸：外籍可用英文版網頁，或於證號欄選「國外」並輸入護照號碼 | `notice_a7` 外籍人士 | 證號欄有國籍下拉；`en/` 為獨立站台 | `en/` 目錄（雪霸 `apply_1_3`、`apply_1_31` 皆有） | **一致** |
| 嘉明湖外籍：住宿日前 120 日至前 61 日；4 個外籍以下搭 1 本國籍、5 個以上搭 2 本國籍；每日外籍保留 18 名（本國籍限 4 名） | `notice_b3` 十一 | 外部系統 | `web.config:104-105` | **沒實作（外部系統）** |
| 外籍領隊異動：外籍只能換外籍、本國籍只能換本國籍 | `notice_a1` 人員異動（五）；`notice_a4` 外籍人士（三） | 中文版異動流程對外籍案件 `Response.Redirect` 到 `en/apply_1_31.aspx`／`en/apply_1_41.aspx` | `apply_2_3.aspx.cs:82`、`:97` | **值在DB(待查)**／異動限制的實作在 `apply_2_3` 與 `en/apply_1_31`，本輪未讀 |

---

# 九、費用與退費

| 規則（原文） | 原文出處 | code 怎麼做 | code 出處 | 判定 |
|---|---|---|---|---|
| 玉山排雲山莊使用規費：每人每宿 **480 元** | `notice_a1` 所需費用 | `YuShanFun.cs` 中無 `480` 字樣；金流走 `App_code/FiscApi.cs`（18,650 bytes，本輪未讀） | `App_code/FiscApi.cs`；`apply_4.aspx`（繳費，本輪未讀） | **值在DB(待查)**／需讀 `apply_4` 與 `FiscApi` 才能判定 |
| 玉山：中籤日或通知遞補日後 **3 日內**完成繳費，逾期自動退件 | `notice_a1` 所需費用 | 未在本輪讀過的檔案中找到；`YuShanFun.cs:1833` 有「取得中籤、通知遞補日期的最大日期」 | `App_code/YuShanFun.cs:1833` | **值在DB(待查)**／需讀完 `YuShanFun` 與 `apply_4` |
| 玉山：排雲規費退費得於入園日起 **2 年內**線上申請 | `notice_a1` 所需費用 | `apply_5.aspx`（退費，189,095 bytes，本輪未讀） | `apply_5.aspx.cs` | **值在DB(待查)**／未讀 |
| 檜谷山莊：假日每人每晚 300 元、平日 250 元；營地不分平假日每營地 400 元 | `notice_b4` | 外部系統（`kgonline_APIURL`） | `web.config:107-108` | **沒實作（外部系統）** |
| 天池山莊：通鋪假日 480／非假日 450；小營位 600／500；大營位 800／700 | `notice_b5` 二 | 外部系統（`tconline_APIURL`） | `web.config:110-111` | **沒實作（外部系統）** |
| 嘉明湖／向陽：山屋假日每床 600／平日 400；營地假日 600／平日 500 | `notice_b6` 二、三 | 外部系統（`jmonline_APIURL`） | `web.config:104-105` | **沒實作（外部系統）** |
| 林業署山屋退費：起算日前 5 日前全額／前 4 日 50%／前 3 日內及未到 0% | `notice_b1` 1.、`notice_b3` 十一、`notice_b7` 九 | 外部系統；九九山莊另有 `JiujiuHut _Cancel.cs`、`JiujiuHut _PaymentStatus.cs` | `App_code/JiujiuHutApi_code/`（本輪未讀） | **沒實作（外部系統）**／九九山莊部分**待查** |
| 檜谷山莊：行程前 **30 日**系統自動抽籤，當日約 15:30 公布，中籤起 **5 日內**繳款 | `notice_b1` | 外部系統 | `web.config:107-108` | **沒實作（外部系統）** |

---

# 十、人員異動與取消

| 規則（原文） | 原文出處 | code 怎麼做 | code 出處 | 判定 |
|---|---|---|---|---|
| 玉山：除領隊（嚮導）外禁止更換人員 | `notice_a1` 人員異動 | `apply_2.aspx`（異動取消，61,158 bytes）與 `apply_1_4_lechg1.aspx`（領隊異動）本輪未讀 | `apply_2.aspx.cs`、`apply_1_4_lechg1.aspx.cs` | **值在DB(待查)**／未讀 |
| 玉山領隊異動：應於入園日前 **5 天**提出，以 **1 次**為原則；5 日內須附證明書面申請 | `notice_a1` 人員異動（一）、方式二 | 有 `changeleader` 旗標：`1` 可換、`0` 不能換 | `apply_1_3.aspx.cs:6463`（註解說明） | **值在DB(待查)**　欄位 `changeleader`（表別待確認）；「5 天」與「1 次」未找到實作 |
| 玉山：隊伍僅有 1 人時不能更換領隊 | `notice_a1` 人員異動（三） | 未找到 | — | **沒實作** |
| 太魯閣領隊異動：應於入園前 **3 天（不含假日）**提出，以 1 次為原則；距入園低於 3 天及 1 人獨攀隊伍不接受更換 | `notice_a4` 人員異動（一）（二） | 未找到「不含假日」的工作日計算 | — | **沒實作** |
| 太魯閣：核准後無法前往，應於入園前 **1 日 15:00 前**自行取消 | `notice_a4` 人員異動 二. | 未找到 15:00 的時刻檢查 | — | **沒實作** |
| 雪霸：核准後不提供人員／日期更換，需先取消再重新申請，並於入園 **5 日之前**辦理 | `notice_a7` 人員異動 | 未讀 `apply_2` | `apply_2.aspx.cs` | **值在DB(待查)**／未讀 |
| 雪霸：草稿可保留 **30 日**；日期或路線關閉或名額不足時系統清除草稿 | `attention` dbId=32 | 有草稿機制（`apply_1_3.aspx.cs:5559` 註解提及草稿階段不存上傳檔） | `apply_1_3.aspx.cs:5559` | **值在DB(待查)**／30 日保留期未找到常數 |

---

# 十一、路線開放與封閉

| 規則（原文） | 原文出處 | code 怎麼做 | code 出處 | 判定 |
|---|---|---|---|---|
| 颱風警報、森林火災或突發事件時，管理處得發布緊急措施禁止進入，已核發許可證自動廢止 | `attention` dbId=37（太管）、dbId=21（玉管）、dbId=30（雪管）；`notice_a4` 其他一. | 封閉日排除：雪霸讀 `RuleSet` 的 `spnp_closestart`／`spnp_closeend`／`spnp_returnday`；**玉山與太魯閣走無機關參數版，時間窗寫死且已過期** | `App_code/CheckBlockDay.cs:58-97`、`:98-145`；呼叫端 `apply_1_3.aspx.cs:771`（雪霸）vs `apply_1_4.aspx.cs:4403`（玉山）、`tarokoapplyControl/step22.ascx.cs:1595`（太魯閣） | **不一致**<br>接手若照原文預期：以為三家都能靠設定封園，實際只有雪霸有效 |
| 過年停機期間不可申請 | `web.config:43` 註解「過年停機使用」（**C 類：非原文**） | 時間窗 `202203311500`～`202204050000`；封閉日清單寫死 2025-01-23～02-03；另一處寫死 `202310051500`～`202310110000` | `web.config:44-45`、`CheckBlockDay.cs:22`、`:136-137` | **不一致**（三處來源、全部已過期） |
| 雪季管制期間（預估每年 12 月中旬至隔年 3 月）仍受理具雪地經驗並備妥雪攀裝備之隊伍 | `attention` dbId=1046（玉管） | 雪季判定查 `snowset` 表，比對入園日起 `sumday` 天 | `App_code/tarokoModeCode/tarokoModeCode.cs:177-192`；雪霸 `apply_1_3.aspx.cs:2761` | **值在DB(待查)**　表 `snowset`／欄 `orgid`、`Snow` |
| 雪季須上傳雪攀裝備檢查表 | `notice_a1` 申請資格 雪季（2） | 雪季時顯示 `applylist_files` 中 `filetype=8` 的檔案並開上傳 | `apply_1_3.aspx.cs:2996-3016` | **一致** |
| 路線開放狀態（全部關閉／部分關閉／只限前台／只限後台） | 原文未以此形式描述 | 查詢一律加 `chk in (1,2)` 與 `pjtype in (0,1)`；註解說明 `chk` 0=全部關閉 1=開放 2=部分關閉，`pjtype` 0=全部開放 1=只限前台 2=只限後台 | `apply_1.aspx.cs:224-225`；`tarokoModeCode.cs:157-158`（代碼說明） | **值在DB(待查)**　表 `Fixedclimb`／`Fixedclimbmain`／欄 `chk`、`pjtype` |
| 路線個別封閉日期 | 原文未載 | 另有 `Fixedclimbmain_closedate` 表，以 `sdate`／`edate` 區間排除 | `App_code/tarokoModeCode/tarokoModeCode.cs:140-141` | **值在DB(待查)**　表 `Fixedclimbmain_closedate`／欄 `f_id`、`sdate`、`edate` |
| 錐麓古道、清水山、奇萊南峰封閉公告 | 各機關臨時公告（非 `notice_*` 原文） | **寫死日期字面值**：`< 20260101`（錐麓 `c_id` 132／21、清水山 `c_id` 35）、`< 20241227`（奇萊南峰 `c_id` 25）；**只控制文字，不擋申請** | `apply_1.aspx.cs:303-336`；`en/apply_1.aspx.cs:274-296`；`jp/` 無 | **不一致**<br>接手若照原文預期：以為文字消失代表重新開放，實際上文字與可否申請無關 |

---

# 統計與下一步

共 82 條規則列（程式化統計，一列有兩個判定者取第一個）：

| 判定 | 列數 |
|---|---|
| 一致 | 9 |
| 不一致 | 14 |
| 沒實作 | 26（其中 9 列標「外部系統」，屬正常分工，不算缺失） |
| 值在DB(待查) | 33 |

**「沒實作」中最值得注意的一組**：所有帶「**時刻**」（15:00、23:00 截止）、「**星期別**」
（週六至翌週一、非假日）、「**同一人同日不得重複**」的規則，一條都沒有實作。
`RuleSet` 只有「天」與「月」兩個欄位，結構上就承載不了這些條件。

**「值在DB(待查)」的 33 列**即為下一步的 SQL 清單來源，涉及的表：
`RuleSet`、`Fixedclimb`、`Fixedclimbmain`、`Fixedclimbmain_closedate`、`snowset`、
`attention`、`tb_Blacklist`、`ApplyBanTimeMuti`、`booking`、`applylist`、`apply_teams`、
`booking_bed_yushan`、`bedlist`、`applylist_files`、`EIP_Core_Organization`。

**未讀而影響判定的檔案**（判定寫「待查／未讀」者）：
`apply_2.aspx.cs`（異動取消）、`apply_4.aspx.cs`（繳費）、`apply_5.aspx.cs`（退費）、
`App_code/FiscApi.cs`（金流）、`App_code/taroko/taroko_getbednum.cs`（承載量）、
`App_code/taroko/taroko_applydateOpenForeign.cs`、`App_code/JiujiuHutApi_code/`（九九山莊）、
`App_code/YuShanFun.cs` 未讀完部分。

SQL 清單依指示**尚未產出**，等你確認本表後再產。
