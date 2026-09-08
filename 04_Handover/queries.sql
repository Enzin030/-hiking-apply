/* =============================================================================
   queries.sql — 補齊 rules-vs-code.md 中「值在DB(待查)」列的數值
   產出：2026-09-08
   修訂一：型別/欄名風險修正、執行順序調整
   修訂二：純數值查詢併成單一彙總長表

   ★ 請用具 db_datareader 權限的唯讀帳號執行。★

   -----------------------------------------------------------------------------
   ★ 進度（2026-09-08 10:02）★
   -----------------------------------------------------------------------------
     P1–P6  **全部跑完**，結果已回填到本檔。前置探測到此結束。
     S1     可跑（14 分支）
     S2     可跑（8 分支，含依 P6 新增的 node 承載量與費用彙總）
     明細 10 張  A2、A3、A4、A5、A12、A13、A16、B3、B7、B4

   執行順序：**S1 → S2 → 明細 10 條**（共 12 張表待跑，前置探測已完成）

   -----------------------------------------------------------------------------
   P6 結果（2026-09-08 10:02）—— node 有三組平假日承載量，全部是活的
   -----------------------------------------------------------------------------
   以 HikeNationpark **產品路徑** 316 支 .cs（含 App_code／ucControl／
   tarokoapplyControl，排除 en/、jp/、manasystem/）做邊界比對的引用統計：

     generalnum / holidaynum      209 / 205 次（39 / 38 檔）── 主力
     generalnumt / holidaynumt    117 / 123 次（26 / 28 檔）── 次要
     generalnnum / holidaynnum      5 /   5 次（  3 /  3 檔）
                                  ↳ 僅 apply_1_3(雪霸)、bed_10、bed_10main
                                    → 名稱看似打錯字，實為**雪霸專用的第三組**

   三組都有被讀，**沒有一組是廢欄**；哪一組在哪個情境生效，code 中的判斷邏輯
   本輪尚未讀到，屬 [缺口]。逐宿營地的實際值見明細 A16。

   費用（回答對照表第 61 列，原判「未讀 apply_4／FiscApi，無欄名」）：
     node.localmoney（本國籍）93 次、node.fmoney（外籍）93 次
       ↳ 消費端 apply_3.aspx.cs／apply_4.aspx.cs → **費用來源是 node 表，非寫死**
     pmoney／hlocalmoney／hfmoney／hpmoney ── 產品路徑零引用

   產品路徑零引用的其餘 node 欄位（可能僅後台使用或已廢，本檔不撈）：
     AllowCount、AllowHCount、TentCount、TentHCount、holdnum、
     BedExpense、TentExpense、Mark_Open、AssignNumber

   ★ B4 的「⚠ 待前置結果確認」已依 P4 結果解除，可直接執行。

   -----------------------------------------------------------------------------
   P5 結果（2026-09-08 09:57）—— 七張表全部存在，無分支需放棄
   -----------------------------------------------------------------------------
     ApplyBanTimeMuti          ✓ 存在，drawdate/beginHour/beginTime/endHour/endTime/
                                 livedate 全部符合 A7 的用法
     bedlist.bedtype           ✓ int（A10 可跑）
     SnowSet.Snow              ✓ datetime（A6 可跑）
     Trailclassification.LV    ✓ 但為 **nvarchar(50)**，不是數字
                                 → A15 原本 CAST AS nvarchar(20) 會截斷，已放寬為 nvarchar(50)
     Fixedclimbmain_closedate  ✓ sdate/edate 為 date；**另有 note/note_en/note_jp**
                                 → A5 已補撈 note（封閉原因）
     booking_bed_yushan        ✓ 存在（y_id/b_id/bed_id/bedtype/m_id/CR_DATE）
     Fixedclimbmain            ✓ 無 ParkPeriod* 欄位（期限只在 RuleSet 與 Fixedclimb 兩層）

   -----------------------------------------------------------------------------
   S1 彙總長表的欄位結構（五欄，全部 nvarchar，型別一致）
   -----------------------------------------------------------------------------
     補對照表列 ─ 這列補 rules-vs-code.md 的第幾列
     查詢       ─ 原編號與名稱（A1／B2…），對得回本檔註解
     分組       ─ 機關或分組鍵
     指標       ─ 指標名稱（分佈型查詢把「桶」寫進指標名，例：status=4 筆數）
     值         ─ 數值或日期，一律 CAST 成字串

   採「**一個指標一列**」的攤平方式，全檔一致，不與「欄位名: 值」字串混用。
   ORDER BY 只出現在整條 UNION ALL 的最後，排序鍵為 補對照表列, 查詢, 分組, 指標
   （前三個是交辦指定的鍵，第四個只是讓同組指標輸出順序穩定）。

   -----------------------------------------------------------------------------
   安全限制
   -----------------------------------------------------------------------------
   本檔只有 SELECT。無 INSERT／UPDATE／DELETE／MERGE／TRUNCATE／DROP／ALTER／
   CREATE／GRANT／EXEC，也未呼叫任何預存程序。每一條敘述都以 SELECT 開頭。

   -----------------------------------------------------------------------------
   修訂一處理的四個型別/欄名風險（保留紀錄）
   -----------------------------------------------------------------------------
   1. orgid 一律當鍵 join，不做字串 CAST 比對；需辨識機關時用
      EIP_Core_Organization.name 判斷。（原本的 LOWER(CAST(orgid AS nvarchar(50)))
      在 orgid 為 uniqueidentifier 時永遠不成立，會把「雪管處 code 會讀」
      誤判成三家都不讀，剛好把最關鍵的結論反過來。）
   2. booking ↔ applylist 的 join 鍵 bk.a_Id = al.a_id 取自 YuShanFun.cs:2232
      查詢字串原文（非反推），仍以 P1／P4 覆核，該條標「⚠ 待前置結果確認」。
   3. chk／pjtype／selectchk／isforeign／peopleset／linetype／bedtype／changeleader
      一律 CAST 成 nvarchar 再比，型別無關——不論該欄是 int 或 varchar 都成立。
   4. attention 相關查詢統一 join o.name（shortname 只當顯示欄，不作分組鍵）。
   另：黑名單區間分組的指標名已明確標示為「非實際漏擋數」。

   -----------------------------------------------------------------------------
   過濾說明
   -----------------------------------------------------------------------------
   交辦要求「剔除外部系統那 9 列」。實際核對後：對照表裡標「外部系統」的 9 列，
   判定欄寫的是「沒實作（外部系統）」，不在「值在DB(待查)」這一類，本來就不會產 SQL。
   「值在DB(待查)」共 35 列，剔除 1 列外部系統（第 53 列九九山莊 150 床，值在
   林保署系統，本機 DB 無此值）。剩 34 列中 15 列因欄名無法定位而未產 SQL
   （見檔尾「無法定位」清單）。實際產出 SQL 的是 19 列。

   -----------------------------------------------------------------------------
   機關 GUID 對照（來源：apply_1.aspx.cs:149-192、apply_1_2.aspx.cs:185）
   -----------------------------------------------------------------------------
     玉管處    C951CDCD-B75A-46B9-8002-8EF952EC95FD
     雪管處    E6DD4652-2D37-4346-8F5D-6E538353E0C2
     太管處    105E956F-D8DA-49F7-A9B7-3AEFDDA88A12
     警政署    8F7C09DC-AFEB-4708-A7BB-B20DA2A24648
     林保署山屋 84BC7D2B-AD3E-4F39-B568-A96681087F74
     林保署保護區 7D0ED03D-E3FF-4482-8254-96F6434F5A85 / ...A86 / ...A87
   ============================================================================= */


/* =============================================================================
   P 組：前置探測（最先執行，只讀 INFORMATION_SCHEMA）— 4 張表
   ============================================================================= */

-- P1【先跑這條】確認 orgid 與 chk 等關鍵欄位的真實型別，決定後面的 join 與比對怎麼寫
-- 表名/欄名來源：apply_1.aspx.cs:222（org.id=f.OrgID）、:224（fm.chk／f.chk／pjtype）、
--   apply_1_2.aspx.cs:62（a.chk／a.orgid）、YuShanFun.cs:2232（bk.a_Id=al.a_id）、:2300（afterstatus）
SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE COLUMN_NAME IN ('orgid','OrgID','chk','pjtype','a_Id','a_id','afterstatus','status',
                      'selectchk','isforeign','peopleset','linetype','ord','id')
ORDER BY TABLE_NAME, COLUMN_NAME;


-- P2 定位第 51 列（IsNotRecovery 屬於哪張表）：
--   YuShanFun.cs 的統計 SQL 用 isnull(IsNotRecovery,'0') <> '1'，但未加表別名，
--   查詢同時 join 了 booking／applylist／apply_teams，無法從 code 判斷歸屬。
-- 表名/欄名來源：YuShanFun.cs:2234、:2246（isnull(IsNotRecovery,'0')）
SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE COLUMN_NAME = 'IsNotRecovery'
ORDER BY TABLE_NAME;


-- P3 定位第 12、49、50 列（承載量欄位）：承載量取得散在 YuShanFun.cs:1399-1429
--   與 App_code/taroko/taroko_getbednum.cs（本輪未讀），欄名無法從已讀片段確定。
-- 表名/欄名來源：YuShanFun.cs:1399（intLoadCnt 為區域變數，非欄名——故本條為探測而非取值）
SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE (COLUMN_NAME LIKE '%load%' OR COLUMN_NAME LIKE '%capacity%'
       OR COLUMN_NAME LIKE '%limit%' OR COLUMN_NAME LIKE '%holiday%'
       OR COLUMN_NAME LIKE '%bednum%' OR COLUMN_NAME LIKE '%wait%')
ORDER BY TABLE_NAME, COLUMN_NAME;


-- P4 定位第 29、31 列（太魯閣候補上限與候補截止），並提供 S1／明細所需的完整欄位清單
--   （含 booking，供覆核 B4 的 join 鍵）
-- 表名/欄名來源：taroko_waitinglist.cs:89、YuShanFun.cs:2231-2233
SELECT TABLE_NAME, ORDINAL_POSITION, COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME IN ('applylist','RuleSet','Fixedclimb','booking','apply_teams',
                     'tb_Blacklist','attention','EIP_Core_Organization','bedlist',
                     'ApplyBanTimeMuti','snowset','Fixedclimbmain','Fixedclimbmain_closedate')
ORDER BY TABLE_NAME, ORDINAL_POSITION;


-- P5【2026-09-08 09:45 新增】補確認 P1–P4 未涵蓋、但 S1／明細會用到的表與欄位。
--   2026-09-08 09:45 收到的 P4 輸出只回了 8 張表（apply_teams／applylist／attention／
--   booking／EIP_Core_Organization／Fixedclimb／RuleSet／tb_Blacklist），
--   缺 bedlist／ApplyBanTimeMuti／SnowSet／Fixedclimbmain／Fixedclimbmain_closedate。
--   其中 bedlist、SnowSet、Fixedclimbmain 由 P1／P3 間接證實存在；
--   **ApplyBanTimeMuti 在四份輸出中完全未出現，存在與否未確認**。
--   下列欄位同樣尚未被任何一條探測涵蓋：bedlist.bedtype、Trailclassification.LV、
--   SnowSet.Snow、booking_bed_yushan.*、Fixedclimbmain_closedate.sdate/edate。
--   ★ 跑完 P5：沒回來的表／欄位，對應的 S1 分支或明細條目就不要跑。
SELECT t.TABLE_NAME, t.TABLE_TYPE, c.ORDINAL_POSITION, c.COLUMN_NAME,
       c.DATA_TYPE, c.CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.TABLES t
LEFT JOIN INFORMATION_SCHEMA.COLUMNS c
       ON c.TABLE_SCHEMA = t.TABLE_SCHEMA AND c.TABLE_NAME = t.TABLE_NAME
WHERE t.TABLE_NAME IN ('bedlist','ApplyBanTimeMuti','SnowSet','Fixedclimbmain',
                       'Fixedclimbmain_closedate','booking_bed_yushan','Trailclassification')
ORDER BY t.TABLE_NAME, c.ORDINAL_POSITION;


-- P6【2026-09-08 09:57 新增】node（宿營地）與承載量相關表的完整欄位清單。
--   理由：第 12、49、50 列（平日／假日承載量）是目前最大的「無法定位」缺口，
--   而 P3 顯示 node 同時有 **holidaynum、holidaynnum、holidaynumt 三個相似欄位**
--   （名稱只差一兩個字母，其中 holidaynnum 疑似打錯字），無法從欄名判斷哪個生效。
--   node 至今未被任何一條探測完整列出，且玉山的承載量統計正是以 node_id + booking_date
--   為鍵（YuShanFun.cs:2230-2234），因此必須先看它的完整欄位。
-- 表名/欄名來源：YuShanFun.cs:2230-2234（booking.node_id）、
--   tarokoapplyControl/step2.ascx.cs:728（node.roomtype）、apply_1.aspx.cs:211（node.name）
SELECT TABLE_NAME, ORDINAL_POSITION, COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME IN ('node','node_closedate','Nonfixedclimb','booking_bed','booking_numclose')
ORDER BY TABLE_NAME, ORDINAL_POSITION;


/* =============================================================================
   ★ 停在這裡。核對 P 組（含 P5、P6）結果後再往下跑。★
   -----------------------------------------------------------------------------
   2026-09-08 09:45 已收到 P1–P4 結果，據此完成的修正：

   ● 已確認、無須再改
     - EIP_Core_Organization.id = uniqueidentifier
     - applylist / attention / Fixedclimb / Fixedclimbmain / RuleSet 的 OrgID
       皆為 uniqueidentifier → 一律 join，不做字串比對（維持原設計）
     - chk / pjtype / selectchk / isforeign / peopleset / linetype / ord 皆為 int
       → 原本的 CAST AS nvarchar 比字串仍然成立，不需改動
     - booking.a_id (int) 與 applylist.a_id (int) 皆存在且型別相符
       → **B4 的 join 鍵確認無誤，⚠ 待確認標記已解除**
     - RuleSet 的 8 個 TeamApplyXxxCnt 系列與 ParkPeriodDayBef、ParkPeriodMonthBef、
       ParkPeriodDayBefchk、ParkPeriodMonthBefchk 皆存在
       （此處刻意不用星號縮寫：星號緊接在斜線後會組成區塊註解符號，見檔尾「已知地雷」）
     - applylist 的 backNum / getNum / changeleader 皆存在（int）

   ● 必須修正（否則會出錯或誤判）
     1. tb_Blacklist.Blacklist_OrgID 是 **nvarchar(100)**，不是 uniqueidentifier。
        直接 join uniqueidentifier 會觸發隱式轉換，**只要有任一筆不是合法 GUID
        字串（空字串、機關名、簡碼），整條查詢會拋轉換錯誤**。
        → A8 改為**把 GUID 那一側轉成字串**：CAST(o.id AS nvarchar(50)) 比對
          去除大括號與前後空白後的 Blacklist_OrgID。這個方向永遠不會拋錯。
        （同批 nvarchar 型 OrgID 的表還有 tb_stopTaroko、taroko_notwaitinglist、
          tb_TarkoAppLog，代表本系統確實混用兩種存法。）
     2. applylist.foreignerresvedplaces 與 activitiesresvedplaces 是 **varchar(1)**，
        是旗標不是名額數字。B7 的判讀說明已更正。
     3. attention.name 是 **ntext** → 原本已 CAST AS nvarchar(max) 再 LEFT()，成立。

   ● 2026-09-08 10:33 環境限制（實跑後才知道，重要）
     執行 S1 時回報「錯誤 195：'TRY_CONVERT' 不是可辨識的內建函數名稱」。
     **TRY_CONVERT 需要資料庫相容性層級 ≥ 110（SQL Server 2012）**，本資料庫低於該層級。
     連帶的語法錯誤（錯誤 102，接近 ')'）是同一個問題的連鎖反應，不是括號寫錯——
     已逐分支機械檢查過 S1 的 14 個分支與 S2 的 8 個分支，括號淨值皆為 0、欄位數皆為 5。

     → 本檔已全面避開需要相容性層級 110 以上的語法。**日後增修時同樣不可使用**：
       TRY_CONVERT、TRY_CAST、TRY_PARSE、IIF、CONCAT、FORMAT、
       OFFSET/FETCH、序列（SEQUENCE）、WITH RESULT SETS。
       目前使用的都是 2005/2008 就有的：CAST、CONVERT、ISNULL、CASE、
       CROSS APPLY、VALUES 資料表建構式、LEFT/RIGHT/LTRIM/RTRIM/REPLACE、
       COUNT/SUM/MIN/MAX、DATEDIFF。
     → 若要確認實際層級，可另跑（唯讀）：
       SELECT name, compatibility_level FROM sys.databases WHERE database_id = DB_ID();
       備註：正式程式碼 BlackList.cs:53 用了 FORMAT()（2012+ 引擎才有），
       代表**引擎版本較新但資料庫相容性層級被固定在較舊的設定**，兩者不衝突。

   ● P 組意外撈出的新欄位 → 見下方 S2（原判「沒實作／無法定位」的列可能要改判）
   ============================================================================= */


/* =============================================================================
   S1：彙總長表（一條，取代原本的 A1、A6、A7、A8、A9、A10、A11、A14、A15、
        B1、B2、B5、B6、B8 共 14 條）
   ============================================================================= */

-- S1 彙總長表
-- 表名/欄名來源：各分支的原始出處寫在該分支的行內註解
SELECT 補對照表列, 查詢, 分組, 指標, 值 FROM (

    -- A1 補對照表第 1,2,9,11,13,14,17 列：三家申請期限（天／月）、期限基準點旗標、
    --    機關層級人數上下限。來源：apply_1_3.aspx.cs:745-748、apply_1_4.aspx.cs:8907、:8929、
    --    apply_1_3.aspx.cs:3056-3072、CheckBlockDay.cs:65
    SELECT
        CAST(N'第1,2,9,11,13,14,17列' AS nvarchar(60))            AS 補對照表列,
        CAST(N'A1 RuleSet 期限與人數'  AS nvarchar(60))            AS 查詢,
        CAST(ISNULL(o.name, N'(查無機關)') AS nvarchar(100))       AS 分組,
        CAST(v.k AS nvarchar(100))                                 AS 指標,
        CAST(v.x AS nvarchar(200))                                 AS 值
    FROM RuleSet r
    LEFT JOIN EIP_Core_Organization o ON o.id = r.orgid
    CROSS APPLY (VALUES
        (N'01 入園前N天',            CAST(r.ParkPeriodDayBef        AS nvarchar(200))),
        (N'02 天數基準0入園1出園',   CAST(r.ParkPeriodDayBefchk     AS nvarchar(200))),
        (N'03 入園前N月',            CAST(r.ParkPeriodMonthBef      AS nvarchar(200))),
        (N'04 月份基準0入園1出園',   CAST(r.ParkPeriodMonthBefchk   AS nvarchar(200))),
        (N'05 非雪季一般_下限',      CAST(r.TeamApplyMinCntGen      AS nvarchar(200))),
        (N'06 非雪季一般_上限',      CAST(r.TeamApplyMaxCntGen      AS nvarchar(200))),
        (N'07 非雪季長程_下限',      CAST(r.TeamApplyMinCntGenlong  AS nvarchar(200))),
        (N'08 非雪季長程_上限',      CAST(r.TeamApplyMaxCntGenlong  AS nvarchar(200))),
        (N'09 雪季一般_下限',        CAST(r.TeamApplyMinCntSnow     AS nvarchar(200))),
        (N'10 雪季一般_上限',        CAST(r.TeamApplyMaxCntSnow     AS nvarchar(200))),
        (N'11 雪季長程_下限',        CAST(r.TeamApplyMinCntSnowlong AS nvarchar(200))),
        (N'12 雪季長程_上限',        CAST(r.TeamApplyMaxCntSnowlong AS nvarchar(200)))
    ) v(k, x)

    UNION ALL

    -- A6 補對照表第 78 列：雪季日期設定（改為彙總；原始日期清單可能上百列，不逐筆併入）
    --    來源：tarokoModeCode.cs:180（select * from snowset where orgid=@orgid）、:188（欄 Snow）
    SELECT
        CAST(N'第78列' AS nvarchar(60)),
        CAST(N'A6 snowset 雪季設定' AS nvarchar(60)),
        CAST(ISNULL(o.name, N'(查無機關)') AS nvarchar(100)),
        CAST(v.k AS nvarchar(100)),
        CAST(v.x AS nvarchar(200))
    FROM (
        SELECT s.orgid, COUNT(*) AS 天數, MIN(s.Snow) AS 最早, MAX(s.Snow) AS 最晚
        FROM snowset s
        GROUP BY s.orgid
    ) g
    LEFT JOIN EIP_Core_Organization o ON o.id = g.orgid
    CROSS APPLY (VALUES
        (N'01 雪季日期筆數', CAST(g.天數 AS nvarchar(200))),
        (N'02 最早雪季日',   CONVERT(nvarchar(200), g.最早, 23)),
        (N'03 最晚雪季日',   CONVERT(nvarchar(200), g.最晚, 23))
    ) v(k, x)

    UNION ALL

    -- A7 補對照表第 22、23 列：抽籤期間暫停申請的時段設定（改為依「時段」彙總；
    --    原始每個抽籤日一列可能上百列）。來源：apply_1_4.aspx.cs:10989
    SELECT
        CAST(N'第22,23列' AS nvarchar(60)),
        CAST(N'A7 ApplyBanTimeMuti 抽籤時段' AS nvarchar(60)),
        CAST(N'時段 '
             + RIGHT('0' + CAST(t.beginHour AS nvarchar(10)), 2) + ':'
             + RIGHT('0' + CAST(t.beginTime AS nvarchar(10)), 2) + '-'
             + RIGHT('0' + CAST(t.endHour   AS nvarchar(10)), 2) + ':'
             + RIGHT('0' + CAST(t.endTime   AS nvarchar(10)), 2) AS nvarchar(100)),
        CAST(v.k AS nvarchar(100)),
        CAST(v.x AS nvarchar(200))
    FROM (
        SELECT beginHour, beginTime, endHour, endTime,
               COUNT(*) AS 抽籤日數, MIN(drawdate) AS 最早, MAX(drawdate) AS 最晚
        FROM ApplyBanTimeMuti
        GROUP BY beginHour, beginTime, endHour, endTime
    ) t
    CROSS APPLY (VALUES
        (N'01 套用抽籤日數', CAST(t.抽籤日數 AS nvarchar(200))),
        (N'02 最早抽籤日',   CONVERT(nvarchar(200), t.最早, 23)),
        (N'03 最晚抽籤日',   CONVERT(nvarchar(200), t.最晚, 23))
    ) v(k, x)

    UNION ALL

    -- A8 補對照表第 42、44、46 列：違規停權名單彙總（不輸出身分證號）
    --    ★ 2026-09-08 修正之一：P4 顯示 tb_Blacklist.Blacklist_OrgID 是 nvarchar(100)，
    --      而 EIP_Core_Organization.id 是 uniqueidentifier。直接 join 會觸發隱式轉換
    --      （nvarchar → uniqueidentifier），任一筆非 GUID 字串就會讓整條查詢拋錯。
    --    ★ 2026-09-08 10:33 修正之二：原本改用 TRY_CONVERT，**但本資料庫不支援**
    --      （錯誤 195：'TRY_CONVERT' 不是可辨識的內建函數名稱；該函式需要
    --      資料庫相容性層級 ≥ 110）。改為**把 GUID 那一側轉成字串**——
    --      CAST(uniqueidentifier AS nvarchar) 永遠成功，不可能拋錯，方向相反即可避開問題。
    --      另用 REPLACE 去掉可能存在的大括號、LTRIM/RTRIM 去空白，提高比對命中率；
    --      比對本身在預設定序下不分大小寫。原始字串保留在分組鍵，非 GUID 值會直接現形。
    --    來源：BlackList.cs:50-67、:102-118
    SELECT
        CAST(N'第42,44,46列' AS nvarchar(60)),
        CAST(N'A8 tb_Blacklist 停權彙總' AS nvarchar(60)),
        CAST(ISNULL(o.name, N'(對不到機關)')
             + N' [OrgID原始值=' + ISNULL(g.OrgIDRaw, N'(NULL)') + N']'
             + N' / IrrType=' + ISNULL(g.IrrType, N'(NULL)') AS nvarchar(100)),
        CAST(v.k AS nvarchar(100)),
        CAST(v.x AS nvarchar(200))
    FROM (
        SELECT b.Blacklist_OrgID AS OrgIDRaw,
               LTRIM(RTRIM(REPLACE(REPLACE(b.Blacklist_OrgID, '{', ''), '}', ''))) AS OrgIDKey,
               b.Blacklist_IrrType AS IrrType,
               COUNT(*) AS 筆數,
               MIN(b.Blacklist_sdate) AS 最早起, MAX(b.Blacklist_edate) AS 最晚迄,
               MIN(DATEDIFF(DAY, b.Blacklist_sdate, b.Blacklist_edate)) AS 最短天,
               MAX(DATEDIFF(DAY, b.Blacklist_sdate, b.Blacklist_edate)) AS 最長天,
               MIN(b.Blacklist_point) AS 點數最小, MAX(b.Blacklist_point) AS 點數最大
        FROM tb_Blacklist b
        WHERE b.Blacklist_sdate IS NOT NULL
        GROUP BY b.Blacklist_OrgID,
                 LTRIM(RTRIM(REPLACE(REPLACE(b.Blacklist_OrgID, '{', ''), '}', ''))),
                 b.Blacklist_IrrType
    ) g
    LEFT JOIN EIP_Core_Organization o
           ON CAST(o.id AS nvarchar(50)) = g.OrgIDKey
    CROSS APPLY (VALUES
        (N'01 停權筆數',     CAST(g.筆數 AS nvarchar(200))),
        (N'02 最早停權起日', CONVERT(nvarchar(200), g.最早起, 23)),
        (N'03 最晚停權迄日', CONVERT(nvarchar(200), g.最晚迄, 23)),
        (N'04 最短停權天數', CAST(g.最短天 AS nvarchar(200))),
        (N'05 最長停權天數', CAST(g.最長天 AS nvarchar(200))),
        -- Blacklist_point 為 P4 新發現的欄位（違規點數），順帶撈範圍
        (N'06 違規點數最小', CAST(g.點數最小 AS nvarchar(200))),
        (N'07 違規點數最大', CAST(g.點數最大 AS nvarchar(200)))
    ) v(k, x)

    UNION ALL

    -- A9 補對照表第 26 列：核發名額與優先遞補順位分佈
    --    來源：apply_1_4_2.aspx.cs:984-985（applylist.getNum／backNum）、YuShanFun.cs:1500
    SELECT
        CAST(N'第26列' AS nvarchar(60)),
        CAST(N'A9 applylist 名額與遞補順位' AS nvarchar(60)),
        CAST(ISNULL(o.name, N'(查無機關)') AS nvarchar(100)),
        CAST(N'status=' + ISNULL(CAST(g.status AS nvarchar(20)), N'(NULL)')
             + N' backNum=' + ISNULL(CAST(g.backNum AS nvarchar(20)), N'(NULL)')
             + N' 筆數' AS nvarchar(100)),
        CAST(g.筆數 AS nvarchar(200))
    FROM (
        SELECT a.OrgID, a.status, a.backNum, COUNT(*) AS 筆數
        FROM applylist a
        GROUP BY a.OrgID, a.status, a.backNum
    ) g
    LEFT JOIN EIP_Core_Organization o ON o.id = g.OrgID

    UNION ALL

    -- A10 補對照表第 48 列：床位／營位型別代碼（bedtype=1 為床位，其餘為營位）
    --     來源：YuShanFun.cs:2263-2280
    SELECT
        CAST(N'第48列' AS nvarchar(60)),
        CAST(N'A10 bedlist 床位型別' AS nvarchar(60)),
        CAST(N'(全部)' AS nvarchar(100)),
        CAST(N'bedtype=' + ISNULL(CAST(bl.bedtype AS nvarchar(20)), N'(NULL)')
             + N' 床位筆數' AS nvarchar(100)),
        CAST(COUNT(*) AS nvarchar(200))
    FROM bedlist bl
    GROUP BY CAST(bl.bedtype AS nvarchar(20))

    UNION ALL

    -- A11 補對照表第 70 列：領隊可否更換為外籍的旗標分佈（1 可換／0 不可換）
    --     來源：apply_1_3_1select.aspx.cs:53-55（FROM applylist a）、apply_1_3.aspx.cs:6463
    SELECT
        CAST(N'第70列' AS nvarchar(60)),
        CAST(N'A11 applylist 領隊可否換外籍' AS nvarchar(60)),
        CAST(ISNULL(o.name, N'(查無機關)') AS nvarchar(100)),
        CAST(N'changeleader=' + ISNULL(g.cl, N'(NULL)') + N' 筆數' AS nvarchar(100)),
        CAST(g.筆數 AS nvarchar(200))
    FROM (
        SELECT a.OrgID, CAST(a.changeleader AS nvarchar(20)) AS cl, COUNT(*) AS 筆數
        FROM applylist a
        GROUP BY a.OrgID, CAST(a.changeleader AS nvarchar(20))
    ) g
    LEFT JOIN EIP_Core_Organization o ON o.id = g.OrgID

    UNION ALL

    -- A14 補對照表第 8 列：各機關同意書「總條數 vs 預設已勾選條數」
    --     來源：apply_1_2.aspx.cs:62（where a.chk='1' ... order by a.ord asc）、:70（selectchk）
    SELECT
        CAST(N'第8列' AS nvarchar(60)),
        CAST(N'A14 attention 同意書彙總' AS nvarchar(60)),
        CAST(ISNULL(o.name, N'(查無機關)') AS nvarchar(100)),
        CAST(v.k AS nvarchar(100)),
        CAST(v.x AS nvarchar(200))
    FROM (
        SELECT a.orgid,
               COUNT(*) AS 顯示中,
               SUM(CASE WHEN CAST(a.selectchk AS nvarchar(10)) = '1' THEN 1 ELSE 0 END) AS 預設勾
        FROM attention a
        WHERE CAST(a.chk AS nvarchar(10)) = '1' AND a.name IS NOT NULL
        GROUP BY a.orgid
    ) g
    LEFT JOIN EIP_Core_Organization o ON o.id = g.orgid
    CROSS APPLY (VALUES
        (N'01 顯示中條數',       CAST(g.顯示中 AS nvarchar(200))),
        (N'02 預設已勾選',       CAST(g.預設勾 AS nvarchar(200))),
        (N'03 使用者須自行勾選', CAST(g.顯示中 - g.預設勾 AS nvarchar(200)))
    ) v(k, x)

    UNION ALL

    -- A15 補對照表第 80 列（輔助）：路線難度等級對照
    --     來源：apply_1.aspx.cs:219-220（Trailclassification 的 id／LV）
    --     ★ 2026-09-08 09:57 依 P5 修正：Trailclassification.LV 是 nvarchar(50)（不是數字），
    --       原本 CAST AS nvarchar(20) 會截斷，已放寬為 nvarchar(50)。
    SELECT
        CAST(N'第80列' AS nvarchar(60)),
        CAST(N'A15 Trailclassification 難度' AS nvarchar(60)),
        CAST(N'LV=' + ISNULL(CAST(t.LV AS nvarchar(50)), N'(NULL)')
             + N' (id=' + ISNULL(CAST(t.id AS nvarchar(40)), N'(NULL)') + N')' AS nvarchar(100)),
        CAST(N'套用路線數' AS nvarchar(100)),
        CAST(COUNT(f.c_id) AS nvarchar(200))
    FROM Trailclassification t
    LEFT JOIN Fixedclimb f ON f.Trailclassification = t.id
    GROUP BY t.id, t.LV

    UNION ALL

    -- B1【並排比對】補對照表第 82 列：封園日規則。CheckBlockDay.cs:61 只對雪管處走
    --    RuleSet 的 spnp_* 三欄，玉管處與太管處走寫死且已過期的時間窗。
    --    若玉管處／太管處其實有值，代表「資料有、code 不讀」。
    --    ※ 用機關名稱判斷，不用 CAST orgid 成字串比 GUID（見檔頭修訂一第 1 點）。
    --    來源：CheckBlockDay.cs:61、:65、:71
    SELECT
        CAST(N'第82列' AS nvarchar(60)),
        CAST(N'B1 RuleSet 封園日(並排)' AS nvarchar(60)),
        CAST(ISNULL(o.name, N'(查無機關)') AS nvarchar(100)),
        CAST(v.k AS nvarchar(100)),
        CAST(v.x AS nvarchar(200))
    FROM RuleSet r
    LEFT JOIN EIP_Core_Organization o ON o.id = r.orgid
    CROSS APPLY (VALUES
        (N'01 code是否讀取',
            CASE WHEN o.name LIKE N'%雪霸%' THEN N'code 會讀 RuleSet'
                 ELSE N'code 不讀(走寫死且已過期的時間窗)' END),
        (N'02 封園起', CONVERT(nvarchar(200), r.spnp_closestart, 120)),
        (N'03 封園迄', CONVERT(nvarchar(200), r.spnp_closeend,   120)),
        (N'04 回復日', CONVERT(nvarchar(200), r.spnp_returnday,  120))
    ) v(k, x)

    UNION ALL

    -- B2【並排比對】補對照表第 79 列：apply_1.aspx.cs:151-152 玉管處 ord 範圍。
    --    選「全部」時 ord between 0 and 9999，選「玉管處」時 between 100 and 1000。
    --    來源：apply_1.aspx.cs:144-145、:151-152、:224-227
    SELECT
        CAST(N'第79列' AS nvarchar(60)),
        CAST(N'B2 Fixedclimbmain ord範圍(並排)' AS nvarchar(60)),
        CAST(ISNULL(o.name, N'(查無機關)') AS nvarchar(100)),
        CAST(v.k AS nvarchar(100)),
        CAST(v.x AS nvarchar(200))
    FROM (
        SELECT fm.OrgID,
               SUM(CASE WHEN fm.ord BETWEEN 0 AND 9999 THEN 1 ELSE 0 END)   AS 全部可見,
               SUM(CASE WHEN fm.ord BETWEEN 100 AND 1000 THEN 1 ELSE 0 END) AS 玉管處可見,
               SUM(CASE WHEN fm.ord BETWEEN 0 AND 9999
                         AND NOT (fm.ord BETWEEN 100 AND 1000) THEN 1 ELSE 0 END) AS 只在全部
        FROM Fixedclimbmain fm
        WHERE CAST(fm.chk    AS nvarchar(10)) IN ('1','2')
          AND CAST(fm.pjtype AS nvarchar(10)) IN ('0','1')
        GROUP BY fm.OrgID
    ) g
    LEFT JOIN EIP_Core_Organization o ON o.id = g.OrgID
    CROSS APPLY (VALUES
        (N'01 全部篩選可見',   CAST(g.全部可見   AS nvarchar(200))),
        (N'02 玉管處篩選可見', CAST(g.玉管處可見 AS nvarchar(200))),
        (N'03 只在全部看得到', CAST(g.只在全部   AS nvarchar(200)))
    ) v(k, x)
    WHERE o.name LIKE N'%玉山%'

    UNION ALL

    -- B5【並排比對】補對照表第 25 列：status 17 在 YuShanFun.cs:2251 稱「初審完成」、
    --    :2361 稱「備取」。撈各狀態碼實際筆數，看分佈支持哪種說法。
    --    來源：YuShanFun.cs:2230-2370（applylist.status）
    SELECT
        CAST(N'第25列' AS nvarchar(60)),
        CAST(N'B5 applylist status分佈(並排)' AS nvarchar(60)),
        CAST(ISNULL(o.name, N'(查無機關)') AS nvarchar(100)),
        CAST(N'status=' + ISNULL(CAST(g.status AS nvarchar(20)), N'(NULL)')
             + N' 筆數' AS nvarchar(100)),
        CAST(g.筆數 AS nvarchar(200))
    FROM (
        SELECT a.OrgID, a.status, COUNT(*) AS 筆數
        FROM applylist a
        GROUP BY a.OrgID, a.status
    ) g
    LEFT JOIN EIP_Core_Organization o ON o.id = g.OrgID

    UNION ALL

    -- B6【並排比對】補對照表第 45 列：黑名單區間比對的涵蓋缺口。
    --    BlackList.cs:52-56 只檢查行程起日或迄日落在停權區間內，未涵蓋
    --    「停權區間完全被行程包住」。停權區間越短越容易被長行程整段包住。
    --    ★ 指標名已寫明「非實際漏擋數」：這是「停權區間屬易漏擋長度」的筆數，
    --      實際漏擋要拿 applylist 的 apply_date／apply_outdate 逐筆比對，不在本批。
    --      回填對照表時請勿寫成「X 筆漏擋」。
    --    來源：BlackList.cs:50-67
    SELECT
        CAST(N'第45列' AS nvarchar(60)),
        CAST(N'B6 tb_Blacklist 區間長度(並排)' AS nvarchar(60)),
        CAST(N'IrrType=' + ISNULL(CAST(g.IrrType AS nvarchar(20)), N'(NULL)') AS nvarchar(100)),
        CAST(g.桶 + N' 之停權筆數(非實際漏擋數)' AS nvarchar(100)),
        CAST(g.筆數 AS nvarchar(200))
    FROM (
        SELECT b.Blacklist_IrrType AS IrrType,
               CASE
                 WHEN DATEDIFF(DAY, b.Blacklist_sdate, b.Blacklist_edate) <= 3  THEN N'01 3天(含)以內'
                 WHEN DATEDIFF(DAY, b.Blacklist_sdate, b.Blacklist_edate) <= 7  THEN N'02 4-7天'
                 WHEN DATEDIFF(DAY, b.Blacklist_sdate, b.Blacklist_edate) <= 30 THEN N'03 8-30天'
                 ELSE N'04 30天以上'
               END AS 桶,
               COUNT(*) AS 筆數
        FROM tb_Blacklist b
        WHERE b.Blacklist_sdate IS NOT NULL AND b.Blacklist_edate IS NOT NULL
        GROUP BY b.Blacklist_IrrType,
               CASE
                 WHEN DATEDIFF(DAY, b.Blacklist_sdate, b.Blacklist_edate) <= 3  THEN N'01 3天(含)以內'
                 WHEN DATEDIFF(DAY, b.Blacklist_sdate, b.Blacklist_edate) <= 7  THEN N'02 4-7天'
                 WHEN DATEDIFF(DAY, b.Blacklist_sdate, b.Blacklist_edate) <= 30 THEN N'03 8-30天'
                 ELSE N'04 30天以上'
               END
    ) g

    UNION ALL

    -- B8【並排比對】補對照表第 20 列：機關名稱字串分派。apply_1.aspx.cs:380-404 用 GUID，
    --    apply_1_2.aspx.cs:171-190 改用 name 的 IndexOf。名稱不含關鍵字就會被彈回。
    --    來源：apply_1_2.aspx.cs:96、:171、apply_1.aspx.cs:117
    SELECT
        CAST(N'第20列' AS nvarchar(60)),
        CAST(N'B8 機關名稱分派(並排)' AS nvarchar(60)),
        CAST(ISNULL(o.name, N'(NULL)') AS nvarchar(100)),
        CAST(v.k AS nvarchar(100)),
        CAST(v.x AS nvarchar(200))
    FROM EIP_Core_Organization o
    CROSS APPLY (VALUES
        (N'01 機關id',   CAST(o.id AS nvarchar(200))),
        (N'02 簡稱',     CAST(ISNULL(o.shortname, N'(NULL)') AS nvarchar(200))),
        (N'03 apply_1_2分派結果',
            CAST(CASE
              WHEN o.name LIKE N'%雪霸%'   THEN N'命中→apply_1_3'
              WHEN o.name LIKE N'%玉山%'   THEN N'命中→apply_1_4'
              WHEN o.name LIKE N'%太魯閣%' THEN N'命中→apply_1_5'
              ELSE N'未命中→彈回 apply_1.aspx'
            END AS nvarchar(200)))
    ) v(k, x)

) S1
ORDER BY 補對照表列, 查詢, 分組, 指標;


/* =============================================================================
   S2：P 組新發現的規則欄位（2026-09-08 09:45 新增，一條長表）
   -----------------------------------------------------------------------------
   P4 的完整欄位清單撈出一批欄位，對應到我在 rules-vs-code.md 判「沒實作」或
   「無法定位」的列。**這代表系統做的比我原本判斷的多**，那幾列的判定在你回填後
   很可能要從「沒實作」改成「值在DB」。

   本表與 S1 同樣是五欄結構，可以直接接在 S1 後面貼。

   涵蓋的對照表列與新發現欄位：
     第 4、5 列   玉山抽籤前／抽籤後兩段期限
                  → RuleSet.ParkPeriodDayBef1／ParkPeriodMonthBef1／*1chk（第二組期限）
     第 25 列     太魯閣三種路線群不同期限
                  → Fixedclimb.ParkPeriodDayBef／MonthBef／*chk（**路線層級**期限）
                    我原本判「沒實作」的理由是「RuleSet 以機關為鍵，無路線層級期限」——該理由不成立。
     第 12、49 列 平日／假日承載量
                  → Fixedclimb.holidaynum（假日）／generalnum（平日）
     第 29、31 列 太魯閣候補名額與截止
                  → RuleSet.AlternateBedDays／bakroomnum／bakCampnum／everyday
     第 69,70,74  取消與異動天數
                  → RuleSet.cancelday／changeday；applylist.changeleadercount（異動次數）
     第 56 列     外籍每年僅能申請 1 次
                  → applylist.ForeignManyTime
     （新）       行程天數上下限 → Fixedclimb.sumdaymin／sumdaymax
     （新）       是否抽籤 → Fixedclimb.IsDraw；許可證可列印天數 → Fixedclimb.printdays
   ============================================================================= */

-- S2 P 組新發現欄位彙總
SELECT 補對照表列, 查詢, 分組, 指標, 值 FROM (

    -- S2-a 第 4、5 列：RuleSet 的「第二組期限」與其餘規則參數
    --      欄名來源：P4（RuleSet 第 15、16、21、22、17、27、28、29、30、31 欄）
    SELECT
        CAST(N'第4,5,29,31,69,70,74列' AS nvarchar(60)) AS 補對照表列,
        CAST(N'S2a RuleSet 其餘規則參數'  AS nvarchar(60)) AS 查詢,
        CAST(ISNULL(o.name, N'(查無機關)') AS nvarchar(100)) AS 分組,
        CAST(v.k AS nvarchar(100)) AS 指標,
        CAST(v.x AS nvarchar(200)) AS 值
    FROM RuleSet r
    LEFT JOIN EIP_Core_Organization o ON o.id = r.OrgID
    CROSS APPLY (VALUES
        (N'01 第二組_入園前N天',       CAST(r.ParkPeriodDayBef1       AS nvarchar(200))),
        (N'02 第二組_天數基準',        CAST(r.ParkPeriodDayBef1chk    AS nvarchar(200))),
        (N'03 第二組_入園前N月',       CAST(r.ParkPeriodMonthBef1     AS nvarchar(200))),
        (N'04 第二組_月份基準',        CAST(r.ParkPeriodMonthBef1chk  AS nvarchar(200))),
        (N'05 候補床位天數AlternateBedDays', CAST(r.AlternateBedDays  AS nvarchar(200))),
        (N'06 保留床位數bakroomnum',   CAST(r.bakroomnum              AS nvarchar(200))),
        (N'07 保留營位數bakCampnum',   CAST(r.bakCampnum              AS nvarchar(200))),
        (N'08 取消天數cancelday',      CAST(r.cancelday               AS nvarchar(200))),
        (N'09 異動天數changeday',      CAST(r.changeday               AS nvarchar(200))),
        (N'10 everyday',               CAST(r.everyday                AS nvarchar(200))),
        (N'11 承載量型態loadingtype',  CAST(r.loadingtype             AS nvarchar(200))),
        (N'12 床位優先BedPriority',    CAST(r.BedPriority             AS nvarchar(200))),
        (N'13 人數檢查teamscountchk',  CAST(r.teamscountchk           AS nvarchar(200))),
        (N'14 ParkWay',                CAST(r.ParkWay                 AS nvarchar(200)))
    ) v(k, x)

    UNION ALL

    -- S2-b 第 25 列：**路線層級**的申請期限（我原判「沒實作」的理由不成立）
    --      只列出有設定值的路線，避免整表輸出。
    --      欄名來源：P4（Fixedclimb 第 33-36 欄）
    SELECT
        CAST(N'第25列' AS nvarchar(60)),
        CAST(N'S2b Fixedclimb 路線層級期限' AS nvarchar(60)),
        CAST(ISNULL(o.name, N'(查無機關)') + N' / c_id=' + CAST(f.c_id AS nvarchar(20))
             + N' ' + LEFT(ISNULL(f.name, N''), 24) AS nvarchar(100)),
        CAST(v.k AS nvarchar(100)),
        CAST(v.x AS nvarchar(200))
    FROM Fixedclimb f
    LEFT JOIN EIP_Core_Organization o ON o.id = f.OrgID
    CROSS APPLY (VALUES
        (N'01 路線_入園前N天',  CAST(f.ParkPeriodDayBef       AS nvarchar(200))),
        (N'02 路線_天數基準',   CAST(f.ParkPeriodDayBefchk    AS nvarchar(200))),
        (N'03 路線_入園前N月',  CAST(f.ParkPeriodMonthBef     AS nvarchar(200))),
        (N'04 路線_月份基準',   CAST(f.ParkPeriodMonthBefchk  AS nvarchar(200)))
    ) v(k, x)
    WHERE f.ParkPeriodDayBef IS NOT NULL OR f.ParkPeriodMonthBef IS NOT NULL

    UNION ALL

    -- S2-c 第 12、49 列：平日／假日承載量（Fixedclimb 層級），以及天數上下限、抽籤旗標
    --      只列出有設定值的路線。
    --      欄名來源：P4（Fixedclimb 第 7 holidaynum、8 generalnum、10 sumdaymax、
    --      11 sumdaymin、52 IsDraw、51 printdays、37 issnow、15 teamscountchk）
    SELECT
        CAST(N'第12,49列' AS nvarchar(60)),
        CAST(N'S2c Fixedclimb 承載量與天數' AS nvarchar(60)),
        CAST(ISNULL(o.name, N'(查無機關)') + N' / c_id=' + CAST(f.c_id AS nvarchar(20))
             + N' ' + LEFT(ISNULL(f.name, N''), 24) AS nvarchar(100)),
        CAST(v.k AS nvarchar(100)),
        CAST(v.x AS nvarchar(200))
    FROM Fixedclimb f
    LEFT JOIN EIP_Core_Organization o ON o.id = f.OrgID
    CROSS APPLY (VALUES
        (N'01 假日承載量holidaynum', CAST(f.holidaynum   AS nvarchar(200))),
        (N'02 平日承載量generalnum', CAST(f.generalnum   AS nvarchar(200))),
        (N'03 天數下限sumdaymin',    CAST(f.sumdaymin    AS nvarchar(200))),
        (N'04 天數上限sumdaymax',    CAST(f.sumdaymax    AS nvarchar(200))),
        (N'05 是否抽籤IsDraw',       CAST(f.IsDraw       AS nvarchar(200))),
        (N'06 許可證可印天數printdays', CAST(f.printdays AS nvarchar(200))),
        (N'07 是否雪季路線issnow',   CAST(f.issnow       AS nvarchar(200))),
        (N'08 人數檢查teamscountchk', CAST(f.teamscountchk AS nvarchar(200)))
    ) v(k, x)
    WHERE f.holidaynum IS NOT NULL OR f.generalnum IS NOT NULL
       OR f.sumdaymin  IS NOT NULL OR f.sumdaymax  IS NOT NULL

    UNION ALL

    -- S2-d 第 70 列：領隊異動次數分佈（原文「以 1 次為原則」）
    --      欄名來源：P4（applylist 第 149 changeleadercount、200 changeleadeMode、132 leaderchg）
    SELECT
        CAST(N'第70列' AS nvarchar(60)),
        CAST(N'S2d applylist 領隊異動次數' AS nvarchar(60)),
        CAST(ISNULL(o.name, N'(查無機關)') AS nvarchar(100)),
        CAST(N'changeleadercount=' + ISNULL(CAST(g.cnt AS nvarchar(20)), N'(NULL)')
             + N' 筆數' AS nvarchar(100)),
        CAST(g.筆數 AS nvarchar(200))
    FROM (
        SELECT a.OrgID, a.changeleadercount AS cnt, COUNT(*) AS 筆數
        FROM applylist a
        GROUP BY a.OrgID, a.changeleadercount
    ) g
    LEFT JOIN EIP_Core_Organization o ON o.id = g.OrgID

    UNION ALL

    -- S2-e 第 56 列：外籍是否已用過提前申請（原文「每年度同一外籍人士僅得提前申請 1 次」）
    --      欄名來源：P4（applylist 第 150 ForeignManyTime）
    SELECT
        CAST(N'第56列' AS nvarchar(60)),
        CAST(N'S2e applylist 外籍提前次數旗標' AS nvarchar(60)),
        CAST(ISNULL(o.name, N'(查無機關)') AS nvarchar(100)),
        CAST(N'ForeignManyTime=' + ISNULL(g.fmt, N'(NULL)') + N' 筆數' AS nvarchar(100)),
        CAST(g.筆數 AS nvarchar(200))
    FROM (
        SELECT a.OrgID, a.ForeignManyTime AS fmt, COUNT(*) AS 筆數
        FROM applylist a
        GROUP BY a.OrgID, a.ForeignManyTime
    ) g
    LEFT JOIN EIP_Core_Organization o ON o.id = g.OrgID

    UNION ALL

    -- S2-f 第 31 列：候補通知日與候補截止日是否真的有被寫入
    --      欄名來源：P4（applylist 第 117 waitnoticedate、124 waitingenddate）
    SELECT
        CAST(N'第31列' AS nvarchar(60)),
        CAST(N'S2f applylist 候補日期欄位' AS nvarchar(60)),
        CAST(ISNULL(o.name, N'(查無機關)') AS nvarchar(100)),
        CAST(v.k AS nvarchar(100)),
        CAST(v.x AS nvarchar(200))
    FROM (
        SELECT a.OrgID,
               COUNT(*) AS 總筆數,
               SUM(CASE WHEN a.waitnoticedate  IS NOT NULL THEN 1 ELSE 0 END) AS 有通知日,
               SUM(CASE WHEN a.waitingenddate  IS NOT NULL THEN 1 ELSE 0 END) AS 有截止日,
               MIN(a.waitingenddate) AS 最早截止, MAX(a.waitingenddate) AS 最晚截止
        FROM applylist a
        GROUP BY a.OrgID
    ) g
    LEFT JOIN EIP_Core_Organization o ON o.id = g.OrgID
    CROSS APPLY (VALUES
        (N'01 總筆數',           CAST(g.總筆數 AS nvarchar(200))),
        (N'02 有候補通知日筆數', CAST(g.有通知日 AS nvarchar(200))),
        (N'03 有候補截止日筆數', CAST(g.有截止日 AS nvarchar(200))),
        (N'04 最早候補截止',     CONVERT(nvarchar(200), g.最早截止, 120)),
        (N'05 最晚候補截止',     CONVERT(nvarchar(200), g.最晚截止, 120))
    ) v(k, x)

    UNION ALL

    -- S2-g 第 12、49 列：**床位層級**的平日／假日承載量（2026-09-08 09:57 依 P5 新增）
    --      P5 顯示 bedlist 有 general(平日)／holiday(假日)／enable(啟用)／bedtype，
    --      也就是平假日承載量在本系統至少有三個層級：
    --        路線層級 Fixedclimb.generalnum／holidaynum（見 S2-c）
    --        宿營地層級 node.holidaynum 等（見 P6，欄位尚待確認）
    --        床位層級 bedlist.general／holiday（本分支）
    --      三個層級誰優先、是否互相覆寫，code 中尚未讀到判斷邏輯，屬 [缺口]。
    --      欄名來源：P5（bedlist 第 3 bedtype、6 general、7 holiday、5 enable）
    SELECT
        CAST(N'第12,49列' AS nvarchar(60)),
        CAST(N'S2g bedlist 床位層級承載量' AS nvarchar(60)),
        CAST(N'bedtype=' + ISNULL(CAST(g.bedtype AS nvarchar(20)), N'(NULL)')
             + N' / enable=' + ISNULL(CAST(g.enable AS nvarchar(20)), N'(NULL)') AS nvarchar(100)),
        CAST(v.k AS nvarchar(100)),
        CAST(v.x AS nvarchar(200))
    FROM (
        SELECT bl.bedtype, bl.enable,
               COUNT(*) AS 床位筆數,
               MIN(bl.general) AS 平日最小, MAX(bl.general) AS 平日最大,
               MIN(bl.holiday) AS 假日最小, MAX(bl.holiday) AS 假日最大,
               COUNT(DISTINCT bl.node_id) AS 涵蓋宿營地數
        FROM bedlist bl
        GROUP BY bl.bedtype, bl.enable
    ) g
    CROSS APPLY (VALUES
        (N'01 床位筆數',     CAST(g.床位筆數 AS nvarchar(200))),
        (N'02 涵蓋宿營地數', CAST(g.涵蓋宿營地數 AS nvarchar(200))),
        (N'03 平日承載量最小', CAST(g.平日最小 AS nvarchar(200))),
        (N'04 平日承載量最大', CAST(g.平日最大 AS nvarchar(200))),
        (N'05 假日承載量最小', CAST(g.假日最小 AS nvarchar(200))),
        (N'06 假日承載量最大', CAST(g.假日最大 AS nvarchar(200)))
    ) v(k, x)

    UNION ALL

    -- S2-h 第 12、49、50 列（2026-09-08 10:02 依 P6 新增）：
    --      node（宿營地）層級的承載量。P6 顯示 node 有 **三組平假日配對**：
    --        generalnum / holidaynum      ← 產品路徑引用 209 / 205 次（39 / 38 檔）主力
    --        generalnumt / holidaynumt    ← 引用 117 / 123 次（26 / 28 檔）次要
    --        generalnnum / holidaynnum    ← 引用 5 / 5 次，**僅 apply_1_3(雪霸)、
    --                                        bed_10、bed_10main 三檔** → 疑為雪霸專用
    --      三組都是活的（非廢欄）。本分支統計「各組有幾個 node 設了值、範圍多少」，
    --      用來判斷各組實際涵蓋範圍；逐 node 的值見明細 A16。
    --      欄名來源：P6（node 第 11-14、72-73 欄）；引用數為 2026-09-08 對
    --      HikeNationpark 產品路徑 316 支 .cs 的邊界比對統計。
    SELECT
        CAST(N'第12,49,50列' AS nvarchar(60)),
        CAST(N'S2h node 三組承載量涵蓋範圍' AS nvarchar(60)),
        CAST(ISNULL(o.name, N'(查無機關)') AS nvarchar(100)),
        CAST(v.k AS nvarchar(100)),
        CAST(v.x AS nvarchar(200))
    FROM (
        SELECT n.OrgID,
               COUNT(*) AS 宿營地數,
               SUM(CASE WHEN n.generalnum  IS NOT NULL THEN 1 ELSE 0 END) AS 有generalnum,
               SUM(CASE WHEN n.generalnumt IS NOT NULL THEN 1 ELSE 0 END) AS 有generalnumt,
               SUM(CASE WHEN n.generalnnum IS NOT NULL THEN 1 ELSE 0 END) AS 有generalnnum,
               MIN(n.generalnum) AS 平日min, MAX(n.generalnum) AS 平日max,
               MIN(n.holidaynum) AS 假日min, MAX(n.holidaynum) AS 假日max,
               SUM(CASE WHEN n.localmoney IS NOT NULL THEN 1 ELSE 0 END) AS 有本國費用,
               MIN(n.localmoney) AS 本國費用min, MAX(n.localmoney) AS 本國費用max,
               MIN(n.fmoney)     AS 外籍費用min, MAX(n.fmoney)     AS 外籍費用max
        FROM node n
        GROUP BY n.OrgID
    ) g
    LEFT JOIN EIP_Core_Organization o ON o.id = g.OrgID
    CROSS APPLY (VALUES
        (N'01 宿營地總數',              CAST(g.宿營地數    AS nvarchar(200))),
        (N'02 有設generalnum的數量',    CAST(g.有generalnum  AS nvarchar(200))),
        (N'03 有設generalnumt的數量',   CAST(g.有generalnumt AS nvarchar(200))),
        (N'04 有設generalnnum的數量',   CAST(g.有generalnnum AS nvarchar(200))),
        (N'05 平日承載量範圍最小',      CAST(g.平日min AS nvarchar(200))),
        (N'06 平日承載量範圍最大',      CAST(g.平日max AS nvarchar(200))),
        (N'07 假日承載量範圍最小',      CAST(g.假日min AS nvarchar(200))),
        (N'08 假日承載量範圍最大',      CAST(g.假日max AS nvarchar(200))),
        (N'09 有設本國費用的數量',      CAST(g.有本國費用 AS nvarchar(200))),
        (N'10 本國費用範圍最小',        CAST(g.本國費用min AS nvarchar(200))),
        (N'11 本國費用範圍最大',        CAST(g.本國費用max AS nvarchar(200))),
        (N'12 外籍費用範圍最小',        CAST(g.外籍費用min AS nvarchar(200))),
        (N'13 外籍費用範圍最大',        CAST(g.外籍費用max AS nvarchar(200)))
    ) v(k, x)

) S2
ORDER BY 補對照表列, 查詢, 分組, 指標;


/* =============================================================================
   獨立明細表 —— 本質是長清單，不併入 S1／S2。共 9 張。
   ============================================================================= */

-- A2【明細】補對照表第 11、13、14、17 列（同時涵蓋第 80、54 列）：
--   全部路線的人數上下限與旗標。一路線一列，數量多，故不併入 S1。
-- 表名/欄名來源：tarokoModeCode.cs:164-215、apply_1_3.aspx.cs:224、apply_1.aspx.cs:218-228
SELECT
    o.name                        AS 機關,
    f.OrgID,
    f.c_id,
    f.f_id,
    f.name                        AS 路線名稱,
    CAST(f.peopleset AS nvarchar(10))  AS 是否用路線自訂人數_1是,
    CAST(f.linetype  AS nvarchar(10))  AS 是否長程縱走_1是,
    CAST(f.isforeign AS nvarchar(10))  AS 是否外籍提前路線_1是,
    CAST(f.chk       AS nvarchar(10))  AS 狀態_0全關1開放2部分關,
    CAST(f.pjtype    AS nvarchar(10))  AS 開放模式_0全部1只限前台2只限後台,
    f.ord,
    f.TeamApplyMinCntGen,      f.TeamApplyMaxCntGen,
    f.TeamApplyMinCntGenlong,  f.TeamApplyMaxCntGenlong,
    f.TeamApplyMinCntSnow,     f.TeamApplyMaxCntSnow,
    f.TeamApplyMinCntSnowlong, f.TeamApplyMaxCntSnowlong
FROM Fixedclimb f
LEFT JOIN EIP_Core_Organization o ON o.id = f.OrgID
ORDER BY o.name, f.f_id, f.ord;


-- A3【明細】補對照表第 11、14 列：只看「有自訂人數」的路線，
--   一眼看出哪些路線覆寫了機關預設。
-- 表名/欄名來源：tarokoModeCode.cs:168（peopleset）、:194-215
SELECT
    o.name AS 機關, f.c_id, f.name AS 路線名稱,
    CAST(f.linetype AS nvarchar(10)) AS 長程,
    f.TeamApplyMinCntGen AS 一般下限, f.TeamApplyMaxCntGen AS 一般上限,
    f.TeamApplyMinCntSnow AS 雪季下限, f.TeamApplyMaxCntSnow AS 雪季上限
FROM Fixedclimb f
LEFT JOIN EIP_Core_Organization o ON o.id = f.OrgID
WHERE CAST(f.peopleset AS nvarchar(10)) = '1'
ORDER BY o.name, f.c_id;


-- A4【明細】補對照表第 80 列：主路線的開放狀態與排序值。一主路線一列，不併入 S1。
-- 表名/欄名來源：apply_1.aspx.cs:81-83、:218-228
SELECT
    o.name AS 機關, fm.OrgID, fm.f_id, fm.name AS 主路線名稱,
    CAST(fm.chk    AS nvarchar(10)) AS 狀態_0全關1開放2部分關,
    CAST(fm.pjtype AS nvarchar(10)) AS 開放模式,
    fm.ord,
    fm.source_guid
FROM Fixedclimbmain fm
LEFT JOIN EIP_Core_Organization o ON o.id = fm.OrgID
ORDER BY o.name, fm.ord;


-- A5【明細】補對照表第 81 列：主路線的個別封閉日期區間。一封閉區間一列，不併入 S1。
--   ★ 2026-09-08 09:57 依 P5 補上 note 欄（封閉原因）——P5 顯示
--     Fixedclimbmain_closedate 有 note／note_en／note_jp 三個 nvarchar(1000)。
--     封閉「原因」是判斷「這是臨時災損還是常態管制」的關鍵，原本漏撈。
-- 表名/欄名來源：tarokoModeCode.cs:140-141；欄位型別見 P5
SELECT
    o.name AS 機關, cd.f_id, fm.name AS 主路線名稱,
    cd.sdate AS 封閉起, cd.edate AS 封閉迄,
    cd.note  AS 封閉原因
FROM Fixedclimbmain_closedate cd
LEFT JOIN Fixedclimbmain fm ON fm.f_id = cd.f_id
LEFT JOIN EIP_Core_Organization o ON o.id = fm.OrgID
ORDER BY o.name, cd.sdate;


-- A12【明細】補對照表第 54 列：外籍提前申請的專屬路線清單
--   （外籍是獨立 c_id，不是身分別欄位）。需要路線名稱，故維持明細。
-- 表名/欄名來源：apply_1.aspx.cs:82、:102（isforeign=0 過濾）、apply_1_3_2.aspx.cs:121
SELECT
    o.name AS 機關, f.c_id, f.f_id, f.name AS 路線名稱,
    CAST(f.isforeign AS nvarchar(10)) AS isforeign,
    CAST(f.chk       AS nvarchar(10)) AS chk,
    CAST(f.pjtype    AS nvarchar(10)) AS pjtype,
    f.ord
FROM Fixedclimb f
LEFT JOIN EIP_Core_Organization o ON o.id = f.OrgID
WHERE CAST(f.isforeign AS nvarchar(10)) <> '0'
ORDER BY o.name, f.ord;


-- A13【明細】補對照表第 8 列：三家的同意書條文逐條，含「是否顯示」與「是否預設勾選」。
-- 表名/欄名來源：apply_1_2.aspx.cs:62、:70
SELECT
    o.name       AS 機關,
    o.shortname  AS 簡稱,
    a.orgid,
    a.ord,
    CAST(a.chk       AS nvarchar(10)) AS 是否顯示,
    CAST(a.selectchk AS nvarchar(10)) AS 是否預設勾選,
    LEFT(CAST(a.name AS nvarchar(max)), 60) AS 條文前60字
FROM attention a
LEFT JOIN EIP_Core_Organization o ON o.id = a.orgid
WHERE a.name IS NOT NULL
ORDER BY o.name, a.ord;


-- B3【明細】補對照表第 79 列：列出 S1 中 B2「只在『全部』看得到」的玉山主路線是哪幾條。
-- 表名/欄名來源：apply_1.aspx.cs:144-145、:151-152、:224-227
SELECT
    o.name AS 機關, fm.f_id, fm.name AS 主路線名稱, fm.ord,
    CAST(fm.chk AS nvarchar(10)) AS chk, CAST(fm.pjtype AS nvarchar(10)) AS pjtype
FROM Fixedclimbmain fm
LEFT JOIN EIP_Core_Organization o ON o.id = fm.OrgID
WHERE o.name LIKE N'%玉山%'
  AND CAST(fm.chk    AS nvarchar(10)) IN ('1','2')
  AND CAST(fm.pjtype AS nvarchar(10)) IN ('0','1')
  AND NOT (fm.ord BETWEEN 100 AND 1000)
ORDER BY fm.ord;


-- B7【明細】補對照表第 55 列：外籍保留名額欄位的實際分佈。
--   ★ 2026-09-08 修正判讀：P4 顯示 foreignerresvedplaces 與 activitiesresvedplaces
--     都是 **varchar(1)**，是**旗標不是名額數字**。我先前推測它可能存保留名額數量，是錯的。
--     因此本查詢改為列出實際出現過的字元值與各自筆數，而不是只數「有沒有值」。
--   apply_1_4_2.aspx.cs:988 與 apply_1_4_1.aspx.cs:2042 在**取消／異動路徑**
--   把它寫成 NULL（非「一律」——其他路徑是否寫值未確認）。
-- 表名/欄名來源：apply_1_4_2.aspx.cs:988-989、:998；型別見 P4（applylist 114、115）
SELECT
    o.name AS 機關,
    ISNULL(a.foreignerresvedplaces,  N'(NULL)') AS 外籍保留旗標值,
    ISNULL(a.activitiesresvedplaces, N'(NULL)') AS 活動保留旗標值,
    COUNT(*) AS 筆數
FROM applylist a
LEFT JOIN EIP_Core_Organization o ON o.id = a.OrgID
GROUP BY o.name,
         ISNULL(a.foreignerresvedplaces,  N'(NULL)'),
         ISNULL(a.activitiesresvedplaces, N'(NULL)')
ORDER BY o.name, 2, 3;


-- A16【明細】第 12、49、50、61 列（2026-09-08 10:02 依 P6 新增）：
--   **這條同時回答承載量與費用兩個缺口。**
--   逐宿營地列出三組平假日承載量與本國／外籍費用。
--   ★ 第 61 列（排雲山莊使用規費每人每宿 480 元）先前判「未讀 apply_4／FiscApi，無欄名」，
--     P6 ＋ code 引用統計證實費用來源是 **node.localmoney（本國籍）與 node.fmoney（外籍）**，
--     兩者各被 apply_3.aspx.cs／apply_4.aspx.cs 引用 93 次；
--     而 pmoney／hlocalmoney／hfmoney／hpmoney 在產品路徑**零引用**。
--   ★ 產品路徑零引用的 node 欄位（可能僅後台 manasystem 使用或已廢）：
--     AllowCount、AllowHCount、TentCount、TentHCount、holdnum、
--     BedExpense、TentExpense、pmoney、hlocalmoney、hfmoney、hpmoney、
--     Mark_Open、AssignNumber。本查詢不撈這些。
-- 表名/欄名來源：P6（node 欄位清單）；引用數為對 HikeNationpark 產品路徑
--   316 支 .cs 的邊界比對統計（2026-09-08）；消費端見 YuShanFun.cs:2230-2234（booking.node_id）
SELECT
    o.name AS 機關,
    n.node_id, n.name AS 宿營地名稱,
    n.type, n.roomtype AS 房型_0床1營地, n.roompeople AS 每房人數,
    n.generalnum  AS 平日承載量,  n.holidaynum  AS 假日承載量,
    n.generalnumt AS 平日承載量t, n.holidaynumt AS 假日承載量t,
    n.generalnnum AS 平日承載量nn, n.holidaynnum AS 假日承載量nn,
    n.localmoney AS 本國費用, n.fmoney AS 外籍費用,
    n.vipnum, n.bakteams AS 保留隊伍數, n.share_room AS 併房,
    n.special_camp AS 特殊營地, n.IsDraw AS 是否抽籤,
    n.altitude AS 海拔, n.chk AS 狀態, n.pjtype AS 開放模式
FROM node n
LEFT JOIN EIP_Core_Organization o ON o.id = n.OrgID
ORDER BY o.name, n.ord, n.node_id;


-- B4【明細】★ 2026-09-08 09:45：join 鍵已由 P4 確認 —— booking.a_id (int) 與
--   applylist.a_id (int) 皆存在且型別相符，原「⚠ 待前置結果確認」標記解除，可直接執行。
--   （join 鍵取自 YuShanFun.cs:2232 查詢字串原文「from booking as bk left outer join
--     applylist as al on bk.a_Id = al.a_id」；欄名實際大小寫為 a_id，
--     SQL Server 預設定序不分大小寫，兩種寫法等價。本條仍維持獨立不併入 S1，
--     因為它是「情形 × 狀態碼」的二維分佈，併入後與其他分支的分組語意不一致。）
--   補對照表第 27、28 列（抽籤後統計）：YuShanFun.cs:2300 的「排隊預約」格有
--   afterstatus IS NULL 的退回，其餘五格（:2311/:2322/:2333/:2344/:2356/:2367）沒有。
--   本查詢撈 afterstatus 為 NULL 的筆數。
--   ★ 2026-09-08 13:51 判定更正：本條原註解寫「這些案件會從那五格統計中消失」，**是誤讀**。
--   afterstatus 為 NULL 屬正常口徑（NULL = 尚無抽籤後狀態 = 排隊預約），
--   且抽籤後統計只在 ballot 已有 publictime 的 node+date 上被呼叫
--   （apply_1_4.aspx.cs:10460-10481）。本查詢是無條件全表計數，
--   含不抽籤宿營地、未公告日期、三家機關與全部歷年資料，
--   **回傳的 NULL 筆數不可解讀為「從統計消失的案件數」**。判定過程見 rules-vs-code.md 四、段。
-- 表名/欄名來源：YuShanFun.cs:2231-2233（FROM／JOIN 原文）、:2300、:2311（afterstatus）
SELECT
    CASE WHEN bk.afterstatus IS NULL THEN N'afterstatus 為 NULL' ELSE N'afterstatus 有值' END AS 情形,
    al.status AS 原始status,
    COUNT(*)  AS 筆數
FROM booking bk
LEFT JOIN applylist al ON bk.a_Id = al.a_id
GROUP BY CASE WHEN bk.afterstatus IS NULL THEN N'afterstatus 為 NULL' ELSE N'afterstatus 有值' END,
         al.status
ORDER BY 1, al.status;


/* =============================================================================
   無法定位清單 —— 判定為「值在DB(待查)」但本檔未產 SQL 的列
   -----------------------------------------------------------------------------
   共 15 列（另加已剔除的第 53 列，合計 16 條）。原因分兩種：
   (a) 對應實作所在的檔案本輪未讀，(b) code 中找不到欄名。
   依交辦「抽不到就不要產」，一律不猜欄位。

   ★ 2026-09-08 10:02 更新：以下四列已由 P6 解決，**不再是無法定位**，
     對應查詢為明細 A16 與彙總 S2-h：
       第 12 列 玉山單日往返每日 60 人   → node.generalnum／holidaynum（三組配對）
       第 49 列 玉山平日／假日承載量     → 同上
       第 50 列 太魯閣路線與山屋承載量   → 同上（另 taroko_getbednum.cs 仍未讀）
       第 61 列 排雲山莊規費 480 元      → node.localmoney（本國）／node.fmoney（外籍）
     原「無法定位」由 16 列降為 12 列。以下為仍未定位者：

   第 12 列  （已解決，見上）
   第 24 列  玉山多日行程一日未中籤即退件 → apply_1_4.aspx.cs:10999 之後分支未讀完。
   第 29 列  太魯閣每路線每日 10 隊候補   → taroko_waitinglist.cs:89 只 select *。P4 先確認。
   第 31 列  太魯閣候補截止時間依路線規定 → 同上，且涉及「時刻」，RuleSet 無對應欄位。
   第 40 列  玉山未成年隊員家長同意       → 屬流程檢查非設定值，未逐行確認。
   第 49 列  玉山單日平日／假日承載量     → 同第 12 列。
   第 50 列  太魯閣路線與山屋承載量       → taroko_getbednum.cs（37,583 bytes）未讀。
   第 53 列  九九山莊 150 床              ★已剔除（外部系統，值不在本機 DB）
   第 56 列  太魯閣錐麓外籍提前 35天/4個月 → taroko_applydateOpenForeign.cs 未讀。
   第 60 列  外籍領隊異動的國籍限制       → apply_2_3.aspx.cs 與 en/apply_1_31.aspx.cs 未讀。
   第 61 列  排雲山莊規費 480 元/人/宿    → apply_4.aspx.cs 與 FiscApi.cs 未讀，無欄名。
   第 62 列  中籤/通知遞補後 3 日內繳費   → 同上。
   第 63 列  排雲規費退費 2 年內          → apply_5.aspx.cs（189,095 bytes）未讀。
   第 69 列  玉山除領隊外禁止更換人員     → apply_2.aspx.cs（61,158 bytes）未讀。
   第 74 列  雪霸核准後不提供更換         → 同上。
   第 75 列  雪霸草稿保留 30 日           → apply_1_3.aspx.cs:5559 有註解，30 日來源未找到。

   要補齊這 12 列，需要的不是更多 SQL，而是先把上列 8 支檔案讀完。
   ============================================================================= */


/* =============================================================================
   已知地雷 —— 編輯本檔時務必避開（2026-09-08 10:20 實際踩過一次）
   -----------------------------------------------------------------------------
   ★ 註解裡不要寫出「斜線緊接星號」。

   踩到的實例：本檔曾有一行寫成
       ParkPeriodDayBef/MonthBef/(星號)chk
   其中「MonthBef/」的斜線與後面的星號組成了區塊註解的開頭符號。
   **SQL Server 的區塊註解支援巢狀**，於是那個意外的開頭在註解內部又開了一層，
   接下來的結尾符號只關掉內層，外層一路開著 —— **該行之後的整份 SQL 全部被當成註解**，
   在編輯器裡整片變灰，執行時什麼都不會跑，而且不會報錯。

   避免方式：
     - 欄位群組不要用星號縮寫，直接列出全名
       （寫 ParkPeriodDayBefchk、ParkPeriodMonthBefchk，不要寫 ...Bef/(星號)chk）
     - 必須表達「多個欄位」時，用全形斜線／或改用「等」「系列」
     - 不要為了排版把斜線與星號放在一起

   ★ 自動檢查工具的盲點（同日發現）
   用「非貪婪正規式移除 /(星號) ... (星號)/」來剝註解的檢查腳本，**驗不出這個問題**：
   它會把意外的開頭與下一個結尾配成一對就繼續往下，看起來一切正常。
   要驗必須用「逐字元計數巢狀深度」的方式，確認最終深度回到 0。
   ============================================================================= */
