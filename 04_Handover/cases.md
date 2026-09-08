# cases — 情境問答清單

標的：`\\10.0.0.51\d$\WEB\nationalpark\HikeNationpark`（唯讀）　產出：2026-09-08
搭配閱讀：同目錄 `divergences.md`（分歧清單）、`mental-model.md`（先讀這份）

**出處慣例**：`檔名:行號`，行號指該檔實際行。未加目錄前綴者位於 `HikeNationpark\`。
**`[缺口]`**：答案落在資料庫、或需要向機關／原廠商確認，本次唯讀未連線 DB。

---

# 主題 A　入口與繞道（被咬機率最高）

### Q1. 有人把 `apply_1_49.aspx` 這個網址直接貼到瀏覽器，會發生什麼？

- **答**：進入一份與玉山正式申請表幾乎相同的表單，而且**沒有任何入口檢查**。
  `apply_1_49.aspx.cs` 全檔沒有 `Request.UrlReferrer`、沒有 `Response.Redirect`，
  `Page_Load` 直接開始組表單。它的驗證密度與 `apply_1_4.aspx.cs` 完全一致
  （`CheckBlockDay` 各 2 處、`BlackList` 各 1 處、`membermax`/`membermin` 各 10 處、
  `ParkPeriodDayBef` 各 20 處、`dbAdapter.` 各 258 處），總行數 10,641 vs 10,629。
- **出處**：`apply_1_49.aspx.cs`（590,167 bytes，檔頭 `:20` 自述
  `//apply_1_49.aspx?a_id=&sid=&nation=&tmpf_id=29&tmpc_id=89&fc_id=158 山屋申請測試`）；
  對照 `apply_1_4.aspx.cs:105-116`。全樹 grep 無任何頁面 redirect 或連結到 `apply_1_49`。
- **你可能會以為**：沒有連結的頁面就進不去。IIS 服務目錄下每一個 `.aspx`，
  沒有 URL 授權設定就等於公開端點——`web.config` 未見任何 `<location>` 限制申請頁。

### Q2. 那正式的 `apply_1_4.aspx`（玉山申請表）有沒有擋？

- **答**：有，但只擋 `Referer` 標頭。`Request.UrlReferrer` 若為 null → 導回 `apply_1.aspx`；
  若不為 null 且字串不含 `apply_1_2.aspx` 或 `apply_2_3.aspx` → 也導回。
  換言之：**只要送出一個帶有 `Referer: .../apply_1_2.aspx` 的請求就能直接進表單**，
  跳過同意書頁。Referer 是用戶端可自由設定的標頭。
- **出處**：`apply_1_4.aspx.cs:105-116`。同型寫法見 `apply_1_3.aspx.cs:44-48`（雪霸）、
  `apply_1_3_1.aspx.cs:67-69`、`apply_1_3_2.aspx.cs:50-52`、`apply_1_3_3.aspx.cs:46-48`、
  `apply_1_3_4.aspx.cs:47-49`、`apply_1_3_6.aspx.cs:66-68`、`apply_1_3_7.aspx.cs:74-76`、
  `apply_1_4_1.aspx.cs:110-112`、`apply_1_4_2.aspx.cs:61-63`。
- **你可能會以為**：這是登入或 Session 檢查。它不是；整個申請流程沒有登入。

### Q3. 使用者的瀏覽器把 Referer 關掉（隱私設定、或從 HTTPS 連到 HTTP），會怎樣？

- **答**：`Request.UrlReferrer == null` → **一律被導回 `apply_1.aspx`**，
  正常填完同意書的人反而進不去申請表，且畫面不會說明原因。
- **出處**：`apply_1_4.aspx.cs:114-116`、`apply_1_3.aspx.cs:44` 之 else 分支。
- **你可能會以為**：這道檢查只擋壞人。它對「不送 Referer 的正常使用者」與對「攻擊者」的效果相反——擋住前者、放過後者。

### Q4. 同一個人用大寫網址進來，例如 Referer 是 `.../APPLY_1_2.ASPX`，雪霸和玉山的結果一樣嗎？

- **答**：**不一樣**。雪霸先 `.ToLower()` 再比對，會通過；玉山沒有 `.ToLower()`，
  區分大小寫，會被導回 `apply_1.aspx`。
- **出處**：`apply_1_3.aspx.cs:46`（`Request.UrlReferrer.ToString().ToLower().IndexOf(...)`）
  vs `apply_1_4.aspx.cs:107`（`Request.UrlReferrer.ToString().IndexOf(...)`）。
- **你可能會以為**：兩家的入口檢查是同一段共用程式碼。它們是各自複製的。

### Q5. 有人上傳附件時 Referer 是空的，會怎樣？

- **答**：`apply_1_3files.aspx.cs:28` 直接呼叫 `Request.UrlReferrer.ToString()`，
  **沒有 null 檢查** → `NullReferenceException`，頁面出錯。
- **出處**：`apply_1_3files.aspx.cs:28`。
- **你可能會以為**：同一個專案裡對 Referer 的處理方式一致。同一支流程裡，
  申請表有 null 檢查、附件頁沒有。

### Q6. `apply_1_3_1.aspx` 那道 Referer 檢查，允許哪些來源？

- **答**：程式碼寫的是
  `IndexOf("apply_2.aspx") != -1 || IndexOf("apply_2.aspx") != -1 || IndexOf("apply_1_3_1select.aspx") != -1 || IndexOf("apply_1_3_4select.aspx") != -1`
  ——**第一個條件寫了兩次**，同一個字串。實際允許三個來源，不是四個。
- **出處**：`apply_1_3_1.aspx.cs:69`。同樣的重複出現在
  `apply_1_3_2.aspx.cs:52`、`apply_1_3_3.aspx.cs:48`、`apply_1_3_4.aspx.cs:49`、
  `apply_1_3_6.aspx.cs:68`、`apply_1_3_7.aspx.cs:76`、`apply_1_4_1.aspx.cs:112`、
  `apply_1_4_2.aspx.cs:63`，至少 8 處。
- **你可能會以為**：本來要允許的第二個來源被漏掉了，於是某條合法路徑其實走不通。
  **原本打算允許哪一頁 `[缺口]`**——要問原廠商。

### Q7. 使用者在同意書頁一條都不勾，直接送出，擋不擋？

- **答**：**不擋**。前端 `Check_true()` 會逐一檢查 `input[name='chk[]']`，
  但它掛在 `OnClientClick`；伺服器端的 `btnagree_Click` **從頭到尾沒有讀 `Request.Form["chk[]"]`**，
  只查機關名稱、清空 Session、然後 redirect 到申請表。停用 JavaScript 或直接 POST 即可通過。
- **出處**：`apply_1_2.aspx:60`（`OnClientClick="return Check_true();"`）、
  `apply_1_2.aspx:17-25`（`Check_true`）、`apply_1_2.aspx.cs:141-197`（`btnagree_Click` 全文）。
- **你可能會以為**：同意紀錄有存檔。`btnagree_Click` 沒有寫入任何資料表——
  系統無法證明使用者同意過哪幾條。

### Q8. 同意書頁一載入，有幾條是已經勾好的？

- **答**：`attention` 表中 `selectchk == "1"` 的條文，渲染時直接帶 `checked='checked'`。
  **哪幾條、佔多少比例 `[缺口]`**（在 DB）。顯示與否由另一個欄位 `chk='1'` 決定。
- **出處**：`apply_1_2.aspx.cs:62`（`where a.chk='1' AND (a.name IS NOT NULL) and a.orgid=@orgid order by a.ord asc`）、
  `:70-77`（`selectchk == "1"` → `checked='checked'`）。
- **你可能會以為**：`chk` 和 `selectchk` 是同一件事。`chk` 管顯示，`selectchk` 管預設勾選；
  **兩者的業務語意需向原廠商確認**。

---

# 主題 B　機關分派（一個決定、兩把鑰匙）

### Q9. 機關在 `EIP_Core_Organization` 被改名成「內政部國家公園署雪霸國家公園管理處」，申請流程還走得通嗎？

- **答**：走得通。分派用的是 `strOrg.IndexOf("雪霸") != -1`，改名後仍含「雪霸」兩字。
- **出處**：`apply_1_2.aspx.cs:171-190`。

### Q10. 那如果被改成不含那兩個字的名稱（例如改用英文全銜或代號）？

- **答**：三個 `IndexOf` 全部落空 → 走 `else Response.Redirect("apply_1.aspx")`
  （`apply_1_2.aspx.cs:190`），使用者按下「同意」後被**無聲彈回第一頁**，畫面不出任何訊息。
- **出處**：`apply_1_2.aspx.cs:173-190`。
- **你可能會以為**：路由是用 GUID 做的。**上一頁 `apply_1.aspx` 確實是用 GUID**
  （`apply_1.aspx.cs:380-404`），下一頁換成中文字串比對。同一個決定兩把鑰匙。

### Q11. 新增一個國家公園管理處，會發生什麼？

- **答**：`apply_1.aspx` 的機關按鈕是從 `EIP_Core_Organization` 動態產生的
  （`apply_1.aspx.cs:116-130`），新機關會出現；但 `apply_1_2.aspx.cs:173-190` 的三個
  `IndexOf` 沒有它 → 按「同意」後彈回第一頁。**新增機關必須改 code。**
- **出處**：`apply_1.aspx.cs:116-130`、`apply_1_2.aspx.cs:173-190`。

### Q12. 使用者在路線清單按「全部」和按「玉管處」，看到的玉山路線一樣多嗎？

- **答**：**不一定**。「全部」用 `fm.ord between 0 and 9999`；選玉管處時改成
  `between 100 and 1000`。`fm.ord` 落在 0–99 或 1001–9999 的玉山主路線，
  在「玉管處」篩選下看不到，在「全部」下看得到。**實際有幾條 `[缺口]`**（在 DB `Fixedclimbmain.ord`）。
- **出處**：`apply_1.aspx.cs:144-145`（全部）、`:151-152`（玉管處）、`:158-199`（其餘機關皆 0–9999）、`:227`（`and fm.ord between @ord1 and @ord2`）。
- **你可能會以為**：篩選只是加一個 where 條件。這裡篩選同時換掉了排序範圍。

### Q13. 有一條路線的 `c_id` 是 62，使用者搜尋得到嗎？

- **答**：搜尋不到。主查詢寫死 `where 1=1 and f.c_id <> 62`，無註解說明原因。
- **出處**：`apply_1.aspx.cs:223`。
- **你可能會以為**：這是資料狀態（`chk`／`pjtype`）造成的。它是寫死在 SQL 裡的單一 id 排除。

### Q14. 林業署自然保護區域有三個 GUID，使用者按得到哪幾個？

- **答**：畫面只產生**一顆**按鈕（`7D0ED03D-...-96F6434F5A85`），
  但按下去的查詢會把三個 GUID 都納入（`in (@orgid1,@orgid2,@orgid3)`）。
  另外兩個機關（…5A86／…5A87）沒有自己的入口。
- **出處**：`apply_1.aspx.cs:18`（三個 GUID 的陣列）、`:128`（單一按鈕）、`:185-192`（查詢納入三個）。

---

# 主題 C　日期與封園（規則已停止運作）

### Q15. 管理處公告過年期間封園，改了設定，使用者還選得到那些日期嗎？

- **答**：**要看是哪一家**。
  - 雪霸：改 `RuleSet` 的 `spnp_closestart`／`spnp_closeend`／`spnp_returnday`
    → 入園日下拉會正確排除（`apply_1_3.aspx.cs:771` 呼叫 `IsClose_Days(park)`）。
  - 玉山、太魯閣：**改任何設定都沒有用**。它們呼叫的是無 org 參數版
    `IsClose_Days()`，該版讀 `web.config` 的 `Close_Day_st`／`Close_Day_ed`。
- **出處**：`App_code/CheckBlockDay.cs:19-55`（無 org 版）、`:98-145`（org 版）；
  呼叫端 `apply_1_3.aspx.cs:771`、`:7708`（雪霸，org 版）；
  `apply_1_4.aspx.cs:4403`（玉山，無 org 版）；
  `tarokoapplyControl/step22.ascx.cs:1595`、`:3546`（太魯閣，無 org 版）。

### Q16. 那 `web.config` 裡的封園窗現在是什麼值？

- **答**：`Close_Day_st = 202203311500`、`Close_Day_ed = 202204050000`——**2022 年 4 月**。
  判斷式是 `now >= st && now < ed`，今天（2026）第二個條件為 false，
  **整段封園排除恆不執行**。註解寫「過年停機使用」，是每年手動改一次的設計，沒有人改。
- **出處**：`web.config:43-45`、`CheckBlockDay.cs:30`、`:42-43`、`:197-198`。

### Q17. 那 `CheckBlockDay.cs` 裡寫死的那串日期呢？

- **答**：`Close_DaysBind()` 回傳 `2025-01-23`…`2025-02-03`（12 天，農曆年）。
  它是**清單**，不是窗；要先通過上面那個 2022 年的窗才會被用到，所以永遠取不到。
  `:21` 還留著更早的 2023 年版本註解。
- **出處**：`CheckBlockDay.cs:19-24`。

### Q18. 非雪霸機關呼叫 `IsClose_Days(orgid)` 時，用的是哪個時間窗？

- **答**：`:136-137` **寫死的** `202310051500`／`202310110000`（2023 年 10 月），
  而不是 `web.config`。而相鄰的 `IsClose_DayYN(applydate, orgid)` 的非雪霸分支
  （`:197-198`）用的又是 `web.config`。**同一支檔案、相鄰兩個方法、同一個判斷、兩個來源。**
  且 `Close_DaysBind(orgid)` 對非雪霸一律回空字串（`:58-96`），所以即使窗成立清單也是空的。
- **出處**：`CheckBlockDay.cs:136-137`、`:197-198`、`:58-96`。

### Q19. 雪霸使用者從下拉選了合法日期後送出，伺服器會再確認一次那天沒被封閉嗎？

- **答**：會呼叫檢查，但**那個檢查是空轉的**。送出時呼叫的是單參數版
  `CheckBlockDay.IsClose_DayYN(applystart.SelectedValue)`，該版走已過期的 `web.config` 窗
  → 恆回 `false`（不封閉）。真正有效的排除只發生在**產生下拉清單**時。
- **出處**：`apply_1_3.aspx.cs:5605`（送出檢查，單參數版）vs `:771`（產生清單，org 版）；
  `CheckBlockDay.cs:38-55`（單參數版實作）。
- **你可能會以為**：既然清單排除得正確，後端就有守住。清單是畫面產物；
  直接 POST 一個被封閉的 `applystart` 值不會被伺服器擋下。

### Q20. 錐麓古道現在還顯示「持續封閉並暫停入園申請」嗎？

- **答**：**不顯示了**。那段文字的條件是 `DateTime.Now.ToString("yyyyMMdd") < 20260101`，
  2026-01-01 起自動消失。清水山同條件；奇萊南峰是 `< 20241227`，更早就消失。
- **出處**：`apply_1.aspx.cs:303-314`（錐麓 `c_id` 132／21）、`:315-325`（清水山 `c_id` 35）、
  `:326-336`（奇萊南峰 `c_id` 25）。英文版另有一份：`en/apply_1.aspx.cs:274`、`:285`、`:296`。
- **你可能會以為**：文字消失代表路線重新開放了。**那段程式只控制文字，不控制申請**——
  `New_List_ItemCommand`（`apply_1.aspx.cs:370-404`）不看 `c_id`，任何路線都照樣進入申請流程。
  路線到底開不開，取決於 DB 的 `Fixedclimb.chk` 與 `pjtype`（`:224-225`）。

### Q21. 日文版的使用者看得到那三段封閉公告嗎？

- **答**：**看不到**。`jp/` 底下沒有對應的 `apply_1.aspx.cs` 封閉文字（全樹 grep 無命中），
  而 `en/` 有。三種語言的公告內容不一致。
- **出處**：`apply_1.aspx.cs:303-336`、`en/apply_1.aspx.cs:274-296`；`jp/` 無對應。

### Q22. 「入園日前 5 天至 2 個月」這條規則，改哪裡？

- **答**：`RuleSet` 的 `ParkPeriodDayBef`（天）與 `ParkPeriodMonthBef`（月），
  另有 `ParkPeriodDayBefchk`／`ParkPeriodMonthBefchk` 兩個旗標決定基準是**入園日**還是**出園日**
  （旗標為 0 用入園日；非 0 時起日改為 `AddDays(start + 1 - 總天數)`、迄日改為 `AddMonths(end).AddDays(1 - 總天數)`）。
  **數值 `[缺口]`。**
- **出處**：`apply_1_4.aspx.cs:4406-4428`（玉山）、`apply_1_3.aspx.cs:804-820`（雪霸，同邏輯另寫一份）、
  `apply_1_4.aspx.cs:8907`、`:8929`（`dbAdapter.tablesubject("RuleSet", "OrgID", unitpark, "ParkPeriodDayBef")`）。

### Q23. 改了 `RuleSet.ParkPeriodDayBef`，玉山的所有「5 天」判斷都會跟著變嗎？

- **答**：**不會**。同一支 `apply_1_4.aspx.cs` 裡另有四處**寫死的** `DateTime.Today.AddDays(5)`，
  不讀 DB。DB 改成別的天數時，這四處仍然用 5。
- **出處**：`apply_1_4.aspx.cs:1577`、`:1698`、`:6966`、`:7575`。
- **你可能會以為**：規則已經資料驅動了。它是**一半資料驅動、一半寫死**，而且在同一個檔案裡。

### Q24. 太魯閣的「錐麓古道週六至翌週一入園應於週五 15:00 前完成申請」這條，程式在哪裡實作？

- **答**：**[缺口]**。`RuleSet` 只有「天」與「月」兩個欄位，承載不了「截止時刻」與「星期別」。
  本輪未在 code 中找到對應實作。這條規則出自機關原文
  `notice_a4.aspx`（太魯閣登山須知，逐字靜態文字）。
  **要問機關或原廠商：這條是系統擋、人工審、還是根本沒擋。**
- **出處**：規則來源 `notice_a4.aspx`；欄位 `RuleSet.ParkPeriodDayBef`／`ParkPeriodMonthBef`
  （`apply_1_4.aspx.cs:8907`、`:8929`）。

### Q25. 太魯閣三種路線群的截止天數不同（一般 5 天、羊頭山與畢祿山單攻 3 天、錐麓古道 1 天），程式怎麼分？

- **答**：**[缺口]**。`RuleSet` 是**依機關**（`orgid`）一筆，不是依路線群。
  路線層級的期限欄位本輪未找到。可能在 `Fixedclimb` 有對應欄位（該表已知有
  `peopleset`／`linetype`／`TeamApply*Cnt*` 等路線層級規則欄位），**需查 DB schema 確認**。
- **出處**：規則來源 `notice_a4.aspx`；`RuleSet` 的查詢一律以 `orgid` 為鍵
  （`CheckBlockDay.cs:65`、`tarokoModeCode.cs:222`、`apply_1_3.aspx.cs:3056`）。

---

# 主題 D　人數（三家三套判準）

### Q26. 一支 6 人隊伍申請雪霸某條路線，系統用什麼決定上下限？

- **答**：先讀該路線 `Fixedclimb.peopleset`。等於 `"1"` → 用該路線自訂的
  `TeamApplyMaxCnt*`／`TeamApplyMinCnt*`；否則退回 `RuleSet` 該機關的同名欄位。
  再依「雪季 × 長程」四種組合挑其中一組：`Gen`／`Genlong`／`Snow`／`Snowlong`。
  **數值 `[缺口]`。**
- **出處**：`apply_1_3.aspx.cs:3026-3075`。

### Q27. 同一條路線在太魯閣，判準一樣嗎？

- **答**：形狀一樣（`peopleset` → `Fixedclimb` 或 `RuleSet`，四種組合），
  但**實作是另一份**，抽成 `tarokoModeCode.climbline_Set()`；雪霸則是直接內嵌在頁面裡。
- **出處**：`App_code/tarokoModeCode/tarokoModeCode.cs:152-254` vs `apply_1_3.aspx.cs:3026-3075`。

### Q28. 那「長程縱走」的判定，兩家一樣嗎？

- **答**：**不一樣**。
  - 太魯閣：**只看** `Fixedclimb.linetype == "1"`。
  - 雪霸：`linetype == "1"` **或**兩組節點條件（`hardsum` / `hardsum2` 命中全部節點）任一成立。
  因此存在這種路線：在雪霸被判為「長程」而取 `Genlong`／`Snowlong` 的人數上限，
  在太魯閣同樣資料只會取 `Gen`／`Snow`。
- **出處**：`tarokoModeCode.cs:169-170`（`islong`）vs `apply_1_3.aspx.cs:2537`（`ishard = "N"` 初值）、
  `:2658-2661`、`:2691-2693`、`:2713-2716`（三個賦值點）。
- **你可能會以為**：「長程縱走」是資料上的一個旗標。它在一家是旗標，在另一家是旗標加推導。

### Q29. 一支隊伍申請 35 天的行程，太魯閣的雪季判定會怎樣？

- **答**：`tarokoModeCode.cs:159` 宣告 `string[] snowarray = new string[31]`，
  `:172-175` 的迴圈是 `for (q = 0; q < sumday; q++)` 直接寫入 `snowarray[q]`
  → **`sumday > 31` 會拋 `IndexOutOfRangeException`**，頁面錯誤。
- **出處**：`tarokoModeCode.cs:159`、`:172-175`。
- **你可能會以為**：長天數只是效能問題。這裡是硬上限 31，且沒有防呆與訊息。
  **實際上 `sumday` 能不能大於 31 `[缺口]`**——取決於路線的天數設定（DB）。

### Q30. 程式註解說太魯閣「申請上限 14 人，下限 2 人」，機關須知說「每隊最多不得超過 12 人」，哪個對？

- **答**：**兩個都不是程式在執行的值**。程式把上下限**全部從 DB 取**
  （`Fixedclimb` 或 `RuleSet` 的 `TeamApply*Cnt*`），那行註解沒有對應的常數。
  機關須知 `notice_a4.aspx` 在三種路線群下各寫一次「每隊最多不得超過 12 人」，
  那是規則來源；註解的 14 是**某個人當時的理解**，不是事實。
- **出處**：註解 `tarokoapplyControl/step2.ascx.cs:1555`；實作 `:1556`
  （`tarokoModeCode.climbline_Set(...)`）；規則來源 `notice_a4.aspx`。
- **你可能會以為**：程式碼裡的中文註解是規格。在這棵樹裡註解是第三類證據，不可引用為規則。

### Q31. 玉山的人數上下限走同一套嗎？

- **答**：`apply_1_4.aspx.cs` 有 `membermax`／`membermin` 共 20 處
  （雪霸 `apply_1_3.aspx.cs` 有 41 處），是**第三份實作**。
  **玉山的判準細節本輪未逐行確認 `[缺口]`。**
- **出處**：`apply_1_4.aspx.cs`（`membermax`/`membermin` 20 處）。

### Q32. 隊伍實際填的人數和宣告的人數不符，太魯閣會擋嗎？

- **答**：會。`(隊員清單筆數 + 1) != 宣告人數` 時加一則錯誤訊息「申請人數與隊員數不符」
  （+1 是領隊）。另有下限與上限兩道比對。
- **出處**：`tarokoapplyControl/step2.ascx.cs:2256-2258`（人數不符）、
  `:2448`（`< Sp2_teams_countMin`）、`:2453`（`> Sp2_teams_countMax`）。
  上限也控制「新增隊員」按鈕的顯示：`:1120`、`:1253`。

---

# 主題 E　名額、抽籤與候補（三家機制完全不同）

### Q33. 玉山、雪霸、太魯閣的名額額滿處理，是同一套嗎？

- **答**：**完全不是**。
  - **玉山**：抽籤 → 中籤／備取／遞補，狀態碼驅動（見 Q34）。實作在 `App_code/YuShanFun.cs`（88,896 bytes）。
  - **太魯閣**：候補清單，**排程程序**（非即時），獨立子系統六支檔
    （`taroko_waitingBooking.cs` 51,527／`taroko_waitinglist.cs` 22,868／`taroko_waitinglist2.cs`／
    `taroko_waitinglist_2017.cs`／`taroko_waitinglistAllcode.cs`／`taroko_waitingNotCloseDay.cs`），
    另有 `taroko_Increase_in_admission.cs`（增額錄取）。
  - **雪霸**：`App_code/SheipaWebService.cs`（32,920 bytes）中
    「候補／遞補／備取／承載量／額滿」**零命中**。
- **出處**：`App_code/` 檔案清單；關鍵字掃描結果。
- **你可能會以為**：一站式服務網把三家的名額規則整合了。它把**入口**整合了，規則沒有。

### Q34. 玉山一筆申請案的狀態有哪些？

- **答**（由統計查詢反推）：
  `3,6,7` = 排隊預約／`0` = 中籤／`1,9,10` = 待補件或繳費／`11` = 複審完成／
  `4` = 核准入園／`12` = 備取／`17` = 初審完成。
- **出處**：`App_code/YuShanFun.cs:2190-2283`（`getStatisticsBeforeDraw`）、
  `:2285-2382`（`getStatisticsAfterDraw`）的 `#region` 標題與 `status in (...)` 條件。
- **你可能會以為**：`17` 有唯一名稱。同一支檔案裡 `:2251` 稱它「初審完成」、
  `:2361` 稱它「備取」。**兩個名字指同一個碼，語意需向原廠商確認 `[缺口]`。**

### Q35. 抽籤前和抽籤後的統計，讀的是同一個欄位嗎？

- **答**：**不是**。抽籤前讀 `applylist.status`；抽籤後讀 `booking.afterstatus`。
- **出處**：`YuShanFun.cs:2234` 等（前，`status in (4)`）vs `:2311` 等（後，`afterstatus in (0)`）。

### Q36. 一筆抽籤後 `afterstatus` 還沒寫入（null）的案件，會出現在哪些統計格？

- **答**：**只會出現在「排隊預約」那一格**。該格的條件多了一段 null 退回：
  `afterstatus in (6,3,7) or (afterstatus is null and al.status in (6,3,7))`。
  其餘五格（中籤 0／待補件 1,9,10／複審完成 11／核准入園 4／備取 12／備取 17）
  **只比對 `afterstatus`，沒有 null 退回** → 這筆案件從那些統計中消失。
- **出處**：`YuShanFun.cs:2300`（有 null 退回）vs `:2311`、`:2322`、`:2333`、`:2344`、`:2356`、`:2367`（皆無）。
- **你可能會以為**：統計數字加總等於總案件數。抽籤後只要有 `afterstatus` 未回填的案件，就不會相等。

### Q37. `IsNotRecovery` 這個排除條件，每一格都套嗎？

- **答**：**不是**。抽籤前的「初審完成（status = 17）」那一格**沒有**
  `isnull(IsNotRecovery,'0') <> '1'`，同函式其他每一格都有。
- **出處**：`YuShanFun.cs:2257`（無）vs `:2234`、`:2246` 等（有）。
- **你可能會以為**：這是刻意的業務差異。**是否為漏寫 `[缺口]`**——需向原廠商確認。

### Q38. 太魯閣的隊伍變成候補後，多久會被處理？

- **答**：由**排程**處理，不是即時。程式的日誌訊息前綴是「太管排程」。
  觸發條件是「當天可用的承載量 < 隊伍數量」，且註解說明要「給今天日期 + 2 天」。
  成為第一順位候補後會發 Email 與簡訊，要求在指定日期的**下午 3 點前**修改資料。
- **出處**：`App_code/taroko/taroko_waitinglist.cs:14`（類別註解「太管候補程序」）、
  `:61-65`、`:91`（`and status=7 and project not in (10,1)`）、`:138`（狀態轉換日誌）、
  `:235-242`（第一候補通知信與 15:00 期限）、`:261-265`（簡訊）。
- **你可能會以為**：候補是使用者一送出就即時判定的。它是批次的，中間有時間差。

### Q39. `status = 7` 在玉山和太魯閣是同一個意思嗎？

- **答**：兩邊查的都是 `applylist.status`，但歸類不同：玉山把 `3,6,7` 合稱「排隊預約」，
  太魯閣把 `7` 當作「候補」的篩選條件。**是否為同一語意 `[缺口]`**——
  兩家後續處理程序完全不同（一個進抽籤遞補、一個進排程候補）。
- **出處**：`YuShanFun.cs:2300`（`in (6,3,7)` → 排隊預約）、
  `taroko_waitinglist.cs:91`（`status=7` → 候補）。

### Q40. 北一段縱走北二段和它的南往北路線，承載量是分開算還是合併算？

- **答**：**合併算**，而且是寫死在程式裡的路線 id。
  `climblineid == "28" || climblineid == "109"` 時，候補查詢的 where 條件改為
  `climblineid in (28,109)`。
- **出處**：`App_code/taroko/taroko_waitinglist.cs:76-79`。
- **你可能會以為**：共同承載量是資料設定。這一組是硬編碼的例外；
  **是否還有其他共同承載量的組合、以及它們是否有被實作 `[缺口]`。**

### Q41. 屏風山屋路線會有第一候補嗎？

- **答**：**不會**。程式註解寫「屏風山屋路線不做第一候補，其他路線山屋必須每天都有山屋才能待初審，不做第一候補」。
- **出處**：`App_code/taroko/taroko_waitinglist.cs:181`。
  相關實作另見 `App_code/taroko/PingfongCabin.cs`（5,431 bytes）。

### Q42. 太魯閣候補程序裡還有沒有寫死的日期？

- **答**：有。`taroko_waitinglist.cs:159` 有 `apply_date >= 20191001` 的比較，
  無註解說明。今日已恆為 true，等於該分支永遠成立。
- **出處**：`App_code/taroko/taroko_waitinglist.cs:159`。

---

# 主題 F　語系（三份獨立複本）

### Q43. 日文使用者可以申請雪霸或太魯閣嗎？

- **答**：**不行**。`jp/` 目錄只有玉山系列（`apply_1_4*`、`apply_1_41*`），
  沒有 `apply_1_3`（雪霸）、`apply_1_5`（太魯閣）、`apply_forest_area_*`、
  `apply_forest_camp_*`、`apply_npa_*`。
- **出處**：`jp/` 目錄檔案清單（41 支 `.cs`，全部屬玉山流程與查詢／公告頁）。
- **你可能會以為**：語系是介面層的事。`en/` 與 `jp/` 是整套 code 的獨立複本，功能覆蓋範圍不同。

### Q44. 修一個雪霸申請表的 bug，要改幾個檔案？

- **答**：至少 **3 份**：`apply_1_3.aspx.cs`（520,474 bytes）、
  `en/apply_1_3.aspx.cs`（499,514）、`en/apply_1_31.aspx.cs`（502,672，外籍提前）。
  另有 `apply_1_3_1`／`_3_2`／`_3_3`／`_3_6`／`_3_7` 五支衍生頁，各自也有 `en/` 版。
  **哪些是現役、哪些已停用 `[缺口]`。**
- **出處**：檔案清單與大小；`en/apply_1_1.aspx.cs:57`、`en/apply_1_3_0.aspx.cs:45`（外籍入口 → `apply_1_31`）。

### Q45. 玉山呢？

- **答**：至少 **6 份**變體：`apply_1_4.aspx.cs`(589,611)／`en/apply_1_4`(593,230)／
  `jp/apply_1_4`(590,950)／`apply_1_49`(590,167)／`en/apply_1_41`(523,153)／`jp/apply_1_41`(514,550)，
  另有 `apply_1_4_1`／`_4_11`／`_4_2`／`_4_21`／`_4_6`／`_4_7` 各語系版本。
- **出處**：檔案清單與大小。

### Q46. 一位外籍使用者要異動已核准的案件，會發生什麼？

- **答**：中文版的異動頁會把他 `Response.Redirect` 到 **`en/` 目錄**下的表單
  （`en/apply_1_31.aspx` 或 `en/apply_1_41.aspx`）——**跨語系目錄跳轉，介面語言被強制切換成英文**。
- **出處**：`apply_2_3.aspx.cs:82`、`:97`。

### Q47. 英文版的「上午／下午」下拉，顯示的是英文嗎？

- **答**：**不是**。`en/ucControl/ucDatePickerCETW.ascx:5-8` 的兩個 `ListItem`，
  Text 與 Value 都是中文「上午」「下午」。code-behind 以 `ddlNoon.SelectedValue == "下午"`
  比對（`:35`），因此**邏輯是正確的**，只是英文使用者看到中文選項。
- **出處**：`en/ucControl/ucDatePickerCETW.ascx:5-8`、`en/ucControl/ucDatePickerCETW.ascx.cs:35`。

### Q48. `ucControl` 有幾份？改一個日期選擇器要改幾個地方？

- **答**：**兩份目錄、八支檔**（根目錄 `ucControl/` 與 `en/ucControl/`，各含
  `ucDatePicker`／`ucDatePicker2`／`ucDatePickerCETW`／`ucDatePickerForeign`）。
  更麻煩的是同一個 `jp/` 目錄裡兩種引用路徑並存：
  `jp/apply_6.aspx:4` 引用 `../en/ucControl/`，`jp/bed_3.aspx:4` 引用 `../ucControl/`。
- **出處**：目錄掃描；`jp/apply_6.aspx:4`、`jp/bed_3.aspx:4`。

### Q49. `ucDatePicker` 和 `ucDatePicker2` 差在哪？

- **答**：兩檔各 625 行，**只差 2 行**：class 名稱，以及 `:352` 一個有
  `Common_fun.De_EnCode(txtDate.Text.Substring(0,10))`、一個直接 `txtDate.Text.Substring(0,10)`。
  命名沒有任何線索說明差別。**應該用哪一個 `[缺口]`。**
- **出處**：逐行比對 `ucControl\ucDatePicker.ascx.cs` 與 `ucControl\ucDatePicker2.ascx.cs`。

### Q50. 根目錄與 `en/` 的 `ucDatePickerCETW` 有漂移嗎？

- **答**：**沒有實質漂移**。去除縮排後 571 行僅 20 行差異，其中有意義的只有
  jQuery datepicker 的月份與星期名稱（中文 vs 英文）。是正常的在地化分支。
  （這題保留在清單裡，是因為它是唯一一組「看起來會漂移但實際沒有」的複本，
  可以省下接手者重複查證的時間。）
- **出處**：去縮排後逐行比對。

---

# 主題 G　設定與部署

### Q51. 這台機器上，玉山申請表呼叫的 masterapi 位址是什麼？

- **答**：`http://localhost:804/masterapi/masterapi.ashx`。正式位址被註解掉在上一行。
- **出處**：`web.config:76-78`；讀取端 `apply_1_4.aspx.cs:80`、`apply_1_49.aspx.cs:71`、
  `apply_forest_camp_1.aspx.cs:17`、`apply_forest_camp_2.aspx.cs:13`、`bed_0.aspx.cs:18`。
- **你可能會以為**：這台是正式機的完整副本。**這份 `web.config` 究竟對應哪個環境 `[缺口]`**——
  見下一題。

### Q52. `pdftype` 是什麼值，有什麼後果？

- **答**：`pdftype = "1"`，同行註解說明「1本機，2 59主機，3正式機」。
  後果之一：`apply_1_4.aspx.cs:4434` 的 `if (AppSettings["pdftype"] == "3")` 不成立，
  該分支內「玉山線 2 天路線自 2018-01-01 才可申請」的日期閘門（`:4436-4443`）
  與 `dtend < dtstart` 時把 `countday` 設為 `-1` 的保護（`:4447-4450`）**都被跳過**，
  改走 `else` 的 `Math.Abs(...)`——`Math.Abs` 會把「迄日早於起日」的負值變成正值，
  於是仍會產生一串入園日選項。
- **出處**：`web.config:14-15`、`apply_1_4.aspx.cs:4434-4455`。
- **你可能會以為**：`pdftype` 只影響 PDF 產生方式（名稱如此）。它同時被拿來當
  **環境旗標**，控制與 PDF 無關的日期邏輯。

### Q53. 讀取 `WSUrls` 的那幾支頁面，如果 key 被移除會怎樣？

- **答**：`WebConfigurationManager.AppSettings["WSUrls"].ToString()` 是**欄位初始化式**，
  key 不存在時 `null.ToString()` → `NullReferenceException`，且發生在建構期，
  整頁無法載入、`try/catch` 攔不到。
- **出處**：`apply_1_4.aspx.cs:80`、`apply_1_49.aspx.cs:71`、`apply_forest_camp_1.aspx.cs:17`、
  `apply_forest_camp_2.aspx.cs:13`、`bed_0.aspx.cs:18`。

### Q54. `web.config` 裡有 key 被寫了兩次嗎？

- **答**：有。`isusedproxy`／`proxyserver`／`UseSSL`／`SetHttpXForwardedFor` 各出現兩次
  （`:47-50` 與 `:70-73`），且**沒有先 `<remove>`**——同檔其他重複 key（`BaseUrls`、
  `HostFolder`、`LogPath`、`HeaderStr`、`WebKey`、`APPKey`、`FilesSize`、`ErrorNums`）
  都有 `<remove>`。`HikeNationpark` 內未見讀取這四個 key，
  **實際影響與 `appSettings` 對無 `<remove>` 重複 key 的行為 `[缺口]`**（需實測）。
- **出處**：`web.config:47-50`、`:70-73`，對照 `:51-52`、`:55-56` 等有 `<remove>` 的寫法。

### Q55. 線上出錯時，使用者會看到什麼？

- **答**：完整的 ASP.NET 例外堆疊。`customErrors mode="Off"` 且 `debug="true"`。
- **出處**：`web.config:135-136`。
  同檔另有明文憑證：簡訊帳密 `:17-19`、金流帳密 `:38-39`。
  （屬部署風險，非規則分歧，列此供接手者知悉。）

---

# 主題 H　其他已確認的行為

### Q56. 從山屋流程進來的申請案，`camp_id` 參數沒帶，會怎樣？

- **答**：`if (Request.QueryString["camp_id"] != "0")` 在參數不存在時，
  `null != "0"` 為 **true** → `Session["NeedFromForestCamp"]` 被設成 **`null`**，
  而不是 else 分支的 `"0"`。下游若對它 `.ToString()` 會 NRE。
  **下游消費端本輪未追 `[缺口]`。**
- **出處**：`apply_1_2.aspx.cs:36-42`。

### Q57. 林業署山屋分支帶給下一頁的 `unit` 參數，和其他分支一樣嗎？

- **答**：**不一樣**。林業署山屋用 `hidsource_guid` 的值，其餘分支用 `hidorg`。
  同一個 query string 參數名帶不同來源的值。
- **出處**：`apply_1.aspx.cs:396-398`（`hidsource_guid`）vs `:382`、`:386`、`:390`、`:402`（`hidorg`）。

### Q58. 使用者選了一條路線，系統會提示它與其他機關路線的關聯嗎？

- **答**：會。`ApplyFixedclimbRelation` 由前端以 `Func=ApplyFixedclimbRelation` POST 觸發，
  查 `Fixedclimb_relation` 取關聯路線，並回傳訊息「<路線名>的審查單位:<機關簡稱>」。
  查詢明確排除警政署（`b.OrgID <> '8F7C09DC-...'`）。
- **出處**：`apply_1.aspx.cs:65-70`（分派）、`:407-450`（實作）、`:418`、`:430`（排除警政署）。

### Q59. 警政署入山許可的申請，走哪一頁？

- **答**：`apply_1.aspx` 的分派把警政署落到 `else` → `apply_1_2.aspx`
  （原本導向 `apply_npa_1.aspx` 的那行被註解在 `:403`）；
  但 `apply_1_2.aspx` 的同意分派又有一條專屬分支，把警政署 GUID 導到 `apply_npa_1.aspx`。
  **兩頁的處理方式不一致，最終仍到 `apply_npa_1`。**
- **出處**：`apply_1.aspx.cs:400-404`（含被註解的 `:403`）、`apply_1_2.aspx.cs:185-189`。

### Q60. 違規名單（黑名單）在哪裡檢查？

- **答**：`App_code/BlackList.cs`（8,995 bytes）。玉山申請表引用 1 處
  （`apply_1_4.aspx.cs`），`apply_1_49.aspx.cs` 也是 1 處。
  **檢查的實際條件與停權期間 `[缺口]`**——本輪未讀該檔。
  機關原文 `notice_a1.aspx`（玉山）載明四級停權：半年／半年／1 年／3 年。
- **出處**：`App_code/BlackList.cs`；引用計數見 `apply_1_4.aspx.cs`／`apply_1_49.aspx.cs`。

---

# 我在哪裡收斂的

再往下出題，答案會全部落在同一句「`[缺口]`，在資料庫」或「本輪未讀該檔」，
不再產生新知識。具體的收斂點：

1. **數值型問題已飽和**。凡問「幾人／幾天／幾隊」，答案都指向
   `RuleSet`／`Fixedclimb`／`snowset` 的欄位，而非 code。再出十題也只是換欄位名。
2. **結構型問題已覆蓋四種樣態**：入口繞道（A）、鍵不一致（B）、規則過期（C）、
   三家各自實作（D／E）、複本漂移（F）、環境旗標誤用（G）。第七種樣態沒有再出現。
3. **未讀區塊會產生新樣態，但不是新知識**。`apply_2`（異動取消）、`apply_3`（進度查詢）、
   `apply_4`／`apply_5`（繳費退費）、`bed_*` 11 支、`NationPark/`（19,233 檔後台）
   都還沒讀；它們幾乎肯定各有一套自己的實作，但那是**同一個結論的更多實例**，
   不會改變接手者的心智模型。

**因此下一步的價值不在多出題，在兩件事**：
（a）連 DB 把 `[缺口]` 的數值補上；
（b）向機關與原廠商確認 `mental-model.md` 末尾的待問清單。

---

# 本份未涵蓋（與 `divergences.md` 一致）

`apply_2`／`apply_3`／`apply_4`／`apply_5`／`apply_6`、`bed_0`…`bed_11`、
`apply_forest_area_*`／`apply_forest_camp_*`／`apply_npa_*`、
`App_code` 未讀者（`Paramdata.cs` 69KB、`YuShanFun.cs` 未讀完、`SheipaWebService.cs`、
`BlackList.cs`、`FiscApi.cs` 金流、`forest.gov.tw/WebServiceforest.cs`、
`JiujiuHutApi_code/`、`masterApiCode/`）、`NationPark/`（後台，19,233 檔）。
