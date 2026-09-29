/* ============================================================
   ConsentData.generated.js — 由 ConsentData.generated.jsx 產生的純資料版本（階段 0）
   ------------------------------------------------------------
   與 .jsx 的唯一差異：top-level `const FOO =` 改為 `window.FOO =`，
   因此本檔是**一般 <script>**，不經 @babel/standalone 轉譯。

   為什麼順序是安全的：body 內的一般 <script src> 依文件順序立即執行，
   而 type="text/babel" 的腳本要等 Babel 於 DOMContentLoaded 後才編譯執行。
   所以本檔一定早於任何 .jsx 消費端跑完，**不要為了「修順序」去搬動 script 標籤**。

   相容性：原本 .jsx 的 top-level `const` 經 Babel 轉為 `var`，本來就是
   window 的屬性（2026-09-07 於瀏覽器實測確認），故改寫前後讀取行為一致。

   資料內容請改上游來源，不要只改這裡——舊 .jsx 仍供尚未遷移的頁面使用，
   兩份必須同步，直到 .jsx 的引用清空後才刪除。
   ============================================================ */

﻿/* Generated from ../../01_Raw_Input/raw/同意書條文.csv and ../../01_Raw_Input/raw/管理機關.csv.
 * Source model: attention + EIP_Core_Organization.
 *
 * 各機關條文的實際來源（溯源慣例，見 02_Spec/README.md）：
 *   玉山（C951CDCD…）：2026-09-21 正式站 apply_1_2.aspx 重建，21 條、預設勾 19（id attention-yu*）
 *   雪霸（E6DD4652…）：2026-09-24 正式站 apply_1_2.aspx 重建，21 條、預設勾 18（id attention-sp*），
 *                      原文存 .scratch/outputs/正式站申請流程盤點/extracts/prod-SHP003-S00-consent-html.json
 *   太魯閣（105E956F…）：2026-09-29 正式站 apply_1_2.aspx 重建，18 條、預設勾 16（id attention-tr*），
 *                      原文存 .scratch/outputs/正式站申請流程盤點/extracts/prod-TAR001-S00-consent-html.json
 */

window.PARK_LIST = [
    {
        "unit":  "taroko",
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "parkName":  "太魯閣國家公園",
        "agencyName":  "太魯閣國家公園管理處",
        "shortName":  "太管處",
        "color":  "var(--park-taroko)",
        "nextPage":  "apply-3.html"
    },
    {
        "unit":  "shei-pa",
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "parkName":  "雪霸國家公園",
        "agencyName":  "雪霸國家公園管理處",
        "shortName":  "雪管處",
        "color":  "var(--park-shei-pa)",
        "nextPage":  "apply-3.html"
    },
    {
        "unit":  "yushan",
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "parkName":  "玉山國家公園",
        "agencyName":  "玉山國家公園管理處",
        "shortName":  "玉管處",
        "color":  "var(--park-yushan)",
        "nextPage":  "apply-3.html"
    }
];

window.PARK_BY_UNIT = Object.fromEntries(PARK_LIST.map(park => [park.unit, park]));
window.PARK_BY_ORG_ID = Object.fromEntries(PARK_LIST.map(park => [park.orgId, park]));

window.ATTENTION_ITEMS = [
    {
        "id":  "attention-tr01",
        "dbId":  9301,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e請注意，領隊及隊員名單如有外籍人士，請提醒攜帶具有GPS功能之通訊器材，手機請打開國際漫遊之通訊及簡訊功能，以利災害應變與聯繫。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  1
    },
    {
        "id":  "attention-tr02",
        "dbId":  9302,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e請山友留意台8線公路交通管制資訊，詳情依公路局太魯閣工務段最新公告為準。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  2
    },
    {
        "id":  "attention-tr03",
        "dbId":  9303,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e確認已於申請前詳閱並明瞭「 \u003ca href=\"https://hike.taiwan.gov.tw/nationpark/manasystem/news/files/news/a9ebddc7-f95e-46c2-b271-e9b44cd0edc2.pdf\" target=\"_blank\"\u003e登山活動應注意事項\u003c/a\u003e」，並轉知全體隊員。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  3
    },
    {
        "id":  "attention-tr04",
        "dbId":  9304,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e確認已於申請前詳閱並明瞭「\u003ca href=\"https://hike.taiwan.gov.tw/notice_a4.aspx\"\u003e 申請及入園注意事項\u003c/a\u003e」，並轉知全體隊員，隊伍所有成員應加強自主健康管理，入園之後如有疑似相關症狀發生，應使用口罩或足可遮掩口鼻物品進入山屋，保護自己也尊重他人。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  4
    },
    {
        "id":  "attention-tr05",
        "dbId":  9305,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e颱風警報發布、森林火災或其他突發事件時，管理處得另行發布緊急措施禁止人員進入，已核發之入園許可證自動廢止(無效)。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  5
    },
    {
        "id":  "attention-tr06",
        "dbId":  9306,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e入園申請前領隊責任同意事項：\u003c/p\u003e\n\n\u003cp\u003e1. 本申請人瞭解所填具之隊員資料與行程計畫等，如明知為不實之事項，而使公務員登載 於職務上所掌之公文書，足以生損害於公眾或他人者，恐涉及刑法之偽造文書罪，依「使登 載不實事項」論處。\u003c/p\u003e\n\n\u003cp\u003e2. 本申請人承諾轉知領隊及隊員有關本案核發之「生態保護區入園許可證」各項承諾規定 與審查建議事項。並請領隊攜帶入園許可證及隊員身分證明文件，供入園查核。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  6
    },
    {
        "id":  "attention-tr07",
        "dbId":  9307,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e生態保護措施承諾：\u003c/p\u003e\n\n\u003cp\u003e1. 將充分瞭解本區生態的脆弱性，並於行前辦理減輕生態衝擊講習。\u003c/p\u003e\n\n\u003cp\u003e2. 將充分瞭解無痕山林準則，行程中隨時注意並提醒隊員山友言行。\u003c/p\u003e\n\n\u003cp\u003e3. 將配合國家公園巡查志工之保育行動，並協助勸導隊員山友言行。\u003c/p\u003e\n\n\u003cp\u003e4. 避免人造物品影響野生物，留置物同意管理處依無主廢棄物處理。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  7
    },
    {
        "id":  "attention-tr08",
        "dbId":  9308,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e3G網路將於113年6月30日關閉，屆時無論上網或是語音，將全面透過4G/5G網路進行，屆時將無法打電話/接電話（含撥打110、119、112緊急電話），手機及SIM卡必須能支援4G語音（VoLTE）並打開手機4G語音（VoLTE）設定，敬請山友及早更新通訊設備因應。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  8
    },
    {
        "id":  "attention-tr09",
        "dbId":  9309,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e登山安全措施承諾：\u003c/p\u003e\n\n\u003cp\u003e1. 將充分瞭解本區之災害與天候資訊，並於行前辦理安全維護講習。\u003c/p\u003e\n\n\u003cp\u003e2. 將充分瞭解所有隊友身心狀況，並於行前自主訓練補強各項技能。\u003c/p\u003e\n\n\u003cp\u003e3. 將充分瞭解原野地緊急應變措施，確實攜帶各項登山裝備與用品。\u003c/p\u003e\n\n\u003cp\u003e4. 攜帶足夠的通訊設備與電池，並定時與山下留守人員及家人聯絡。\u003c/p\u003e\n\n\u003cp\u003e5. 行進中隨時評估氣象與隊員狀況，以安全第一為原則下妥善因應。\u003c/p\u003e\n\n\u003cp\u003e6. 配合國家公園保育志工查核與引導，如有安全疑慮絕不勉強攀登。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  9
    },
    {
        "id":  "attention-tr10",
        "dbId":  9310,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e欲申請「其他路線」：\u003c/p\u003e\n\n\u003cp\u003e線上系統僅受理進入生態保護區之案件，非進入生態保護區，系統亦將退回申辦案件。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  10
    },
    {
        "id":  "attention-tr11",
        "dbId":  9311,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e登山申請時間說明：\u003c/p\u003e\n\n\u003cp\u003e1、奇萊主（北）峰、奇萊連峰、奇萊東稜、奇萊南峰、南湖大山、南湖中央尖、北一縱走北二、北二段、閂山鈴鳴山、閂山單攻、畢祿縱走羊頭、清水山、其它路線：\u003c/p\u003e\n\n\u003cp\u003e（一）預定入園日前5天下午3時至前2個月提出申請，並得申請連日行程。\u003c/p\u003e\n\n\u003cp\u003e（二）.每份申請書為一隊，每隊最多12人；超過者應分別填寫。領隊及隊員均不得重覆。\u003c/p\u003e\n\n\u003cp\u003e（三）預定入園日前5天內申請案件不予受理。連續假期應於放假前5天上班日下午3時前完成申請。\u003c/p\u003e\n\n\u003cp\u003e（四）預定入園日前2個月內提出申請，以申請送件時間為先後排序。\u003c/p\u003e\n\n\u003cp\u003e（五）入園(住)申請案件經登錄系統後，日期及人員不得更換或增加。\u003c/p\u003e\n\n\u003cp\u003e（六）全隊或個別隊員可以取消入園。\u003c/p\u003e\n\n\u003cp\u003e（七）新增人員，應另案提出申請。\u003c/p\u003e\n\n\u003cp\u003e2、羊頭山、畢祿山單攻路線：\u003c/p\u003e\n\n\u003cp\u003e（一）預定入園日前3天下午3時至前2個月提出申請，並得申請連日行程。\u003c/p\u003e\n\n\u003cp\u003e（二）每份申請書為一隊，每隊最多12人；超過者應分別填寫。領隊及隊員均不得重覆。\u003c/p\u003e\n\n\u003cp\u003e（三）預定入園日前3天內申請案件不予受理。翌週一及連續假期應於放假前3天上班日下午3時前完成申請。\u0026nbsp;\u003c/p\u003e\n\n\u003cp\u003e（四）預定入園日前2個月內提出申請，以申請送件時間為先後排序。\u003c/p\u003e\n\n\u003cp\u003e（五）入園(住)申請案件經登錄系統後，日期及人員不得更換或增加。\u003c/p\u003e\n\n\u003cp\u003e（六）全隊或個別隊員可以取消入園。\u003c/p\u003e\n\n\u003cp\u003e（七）新增人員，應另案提出申請。\u003c/p\u003e\n\n\u003cp\u003e3、錐麓古道單日路線：\u003c/p\u003e\n\n\u003cp\u003e（一）預定入園日前1天下午3時前至前2個月前可提出申請。\u0026nbsp;\u003c/p\u003e\n\n\u003cp\u003e（二）錐麓古道每天每一人限制申請一隊12人，每份申請書為一隊，每隊最多12人；超過者應分別填寫。領隊及隊員均不得重覆。\u0026nbsp;\u003c/p\u003e\n\n\u003cp\u003e（三）入園前一日為週二至週五者，應於前1天下午3時前完成申請；為週六至翌週一者，應於週五下午3時前完成申請。\u003c/p\u003e\n\n\u003cp\u003e（四）連續假期，應於放假前1天下午3時前完成申請。\u003c/p\u003e\n\n\u003cp\u003e（五）預定入園日前2個月內提出申請，以申請送件時間為先後排序。\u003c/p\u003e\n\n\u003cp\u003e（六）入園(住)申請案件經登錄系統後，日期及人員不得更換或增加。\u003c/p\u003e\n\n\u003cp\u003e（七）全隊或個別隊員可以取消入園。\u003c/p\u003e\n\n\u003cp\u003e（八）新增人員，應另案提出申請。\u003c/p\u003e\n\n\u003cp\u003e4、屏風避難山屋：\u003c/p\u003e\n\n\u003cp\u003e（一）.預定入住前5天下午3時前至前2個月可提出申請，得申請連2日行程。\u0026nbsp;\u003c/p\u003e\n\n\u003cp\u003e（二）每份申請書為一隊，每隊最多12人；超過者應分別填寫。領隊及隊員均不得重覆。\u0026nbsp;\u0026nbsp;\u003c/p\u003e\n\n\u003cp\u003e（三）預定入住日前5 天內申請案件不予受理。連續假期應於放假前1天下午3時前完成申請。\u0026nbsp;\u003c/p\u003e\n\n\u003cp\u003e（四）預定入住日前2 個月內提出申請案件，以申請送件時間為先後排序。\u0026nbsp;\u003c/p\u003e\n\n\u003cp\u003e（五）入住申請案件經登錄系統後，日期及人員不得更換或增加。\u003c/p\u003e\n\n\u003cp\u003e（六）全隊或個別隊員可以取消入園。\u003c/p\u003e\n\n\u003cp\u003e（七）新增人員，應另案提出申請。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  11
    },
    {
        "id":  "attention-tr12",
        "dbId":  9312,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e「緊急災難處理」\u003c/p\u003e\n\n\u003cp\u003e1.攜帶登山所須個人及團體裝備(雪季期間攜帶雪地攀登裝備)。\u003c/p\u003e\n\n\u003cp\u003e2.攜帶足夠的通訊及定位(GPS)設備，並定時與留守人員及家人聯絡。\u003c/p\u003e\n\n\u003cp\u003e3.充分瞭解園區之災害與天候資訊，並於行前辦理登山安全講習。\u003c/p\u003e\n\n\u003cp\u003e4.充分瞭解所有隊員身心狀況，並於行前自主訓練登山技能。\u003c/p\u003e\n\n\u003cp\u003e5.行進間以安全第一為原則，並配合國家公園現場人員查核及引導。\u003c/p\u003e\n\n\u003cp\u003e6.辦妥相關保險。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  12
    },
    {
        "id":  "attention-tr13",
        "dbId":  9313,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e「環境維護」\u003c/p\u003e\n\n\u003cp\u003e1.遵守進入國家公園生態保護區之相關規定。\u003c/p\u003e\n\n\u003cp\u003e2.充分瞭解無痕山林準則，減輕環境及生態衝擊。\u003c/p\u003e\n\n\u003cp\u003e3.避免影響野生動植物，不留下任何廢棄物及物品。\u003c/p\u003e\n\n\u003cp\u003e4.不離開已開放供使用之步道及區域。\u003c/p\u003e\n\n\u003cp\u003e5.配合國家公園保育巡查及行動，並協助勸導隊員言行舉止。\u003c/p\u003e\n\n\u003cp\u003e6.為考量安全及損壞設施請勿在山屋床位上炊煮。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  13
    },
    {
        "id":  "attention-tr14",
        "dbId":  9314,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e如欲申請【錐麓古道】請觀看\u003ca href=\"https://www.youtube.com/watch?v=mlQmpH1w0Rw\" style=\"line-height: 20.8px;\" target=\"_blank\"\u003e錐麓古道安全宣導影片\u003c/a\u003e\u0026nbsp; 。「\u003ca href=\"https://hike.taiwan.gov.tw/NationPark/manasystem/news/files/news/12e14c98-0cf9-4e3a-b60c-091958932702.docx\" target=\"_blank\"\u003e錐麓古道入園公約\u003c/a\u003e」請於出發前先行下載詳閱，並於入園當日現場繳交。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  14
    },
    {
        "id":  "attention-tr15",
        "dbId":  9315,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e\u003cstrong\u003e\u003cspan style=\"color:#b22222;\"\u003e\u003cspan style=\"background-color:#ebf0d8; font-family:微軟正黑體,Verdana,Arial,Helvetica,sans-serif; font-size:15px\"\u003e確認已於申請前詳閱並明瞭「\u003c/span\u003e\u003c/span\u003e\u003ca href=\"https://hike.taiwan.gov.tw/notice_a4.aspx\" style=\"color: rgb(51, 122, 183); text-transform: none; text-indent: 0px; letter-spacing: normal; font-family: 微軟正黑體, Verdana, Arial, Helvetica, sans-serif; font-size: 15px; font-style: normal; font-weight: normal; text-decoration: none; word-spacing: 0px; white-space: normal; box-sizing: border-box; orphans: 2; widows: 2; background-color: rgb(235, 240, 216); font-variant-ligatures: normal; font-variant-caps: normal; -webkit-text-stroke-width: 0px;\"\u003e\u003cspan style=\"color:#b22222;\"\u003e \u003c/span\u003e\u003c/a\u003e\u003ca href=\"https://hike.taiwan.gov.tw/news_0_1.aspx?id=1855\"\u003e\u003cspan style=\"color:#0000ff;\"\u003e\u003cspan style=\"font-family:微軟正黑體,Verdana,Arial,Helvetica,sans-serif; font-size:14px\"\u003e錐麓古道入園收費須知\u003c/span\u003e\u003c/span\u003e\u003c/a\u003e\u003cspan style=\"color:#b22222;\"\u003e\u003cspan style=\"background-color:#ebf0d8; font-family:微軟正黑體,Verdana,Arial,Helvetica,sans-serif; font-size:15px\"\u003e」，\u003c/span\u003e\u003c/span\u003e\u003cspan style=\"color:#ff0000;\"\u003e現場購票與入園查核時間每日\u003cu\u003e上午7時~上午10時\u003c/u\u003e\u003c/span\u003e\u003cspan style=\"color:#ff0000;\"\u003e止\u003c/span\u003e\u003c/strong\u003e\u003cspan style=\"color:#b22222;\"\u003e\u003cstrong\u003e\u003cspan style=\"background-color:#ebf0d8; font-family:微軟正黑體,Verdana,Arial,Helvetica,sans-serif; font-size:15px\"\u003e，\u003c/span\u003e\u003c/strong\u003e\u003cstrong\u003e\u003cspan style=\"background-color:#ebf0d8; font-family:微軟正黑體,Verdana,Arial,Helvetica,sans-serif; font-size:15px\"\u003e並轉知全體隊員。\u003c/span\u003e\u003c/strong\u003e\u003c/span\u003e\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  15
    },
    {
        "id":  "attention-tr16",
        "dbId":  9316,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e入園申請隊員若具有學生身分或參加學校社團活動，請務必自行通報學校相關單位，作為緊急應變之用。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  16
    },
    {
        "id":  "attention-tr17",
        "dbId":  9317,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e請確認您的隊伍是否符合「\u003ca href=\"https://glrs.nantou.gov.tw/glrsout/LawContent.aspx?id=GL000318\"\u003e南投縣登山活動管理自治條例\u003c/a\u003e」、「\u003ca href=\"https://lawsearch.taichung.gov.tw/GLRSout/LawContent.aspx?id=GL003013\"\u003e臺中市登山活動管理自治條例\u003c/a\u003e」、「\u003ca href=\"https://glrs.hl.gov.tw/glrsout/LawContent.aspx?id=GL000696\"\u003e花蓮縣登山活動管理自治條例\u003c/a\u003e」內載相關規定，以免觸法。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "0",
        "defaultChecked":  false,
        "order":  17
    },
    {
        "id":  "attention-tr18",
        "dbId":  9318,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cspan style=\"color: #cc0000;\"\u003e\u003cb\u003e本人已閱讀並充分瞭解上述注意事項，並會遵守國家公園、警政署各項規定。\u003c/b\u003e\u003c/span\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "0",
        "defaultChecked":  false,
        "order":  18
    },












    {
        "id":  "attention-yu00",
        "dbId":  9100,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e請注意，領隊及隊員名單如有外籍人士，請提醒攜帶具有GPS功能之通訊器材，手機請打開國際漫遊之通訊及簡訊功能，以利災害應變與聯繫。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  0
    },
    {
        "id":  "attention-yu01",
        "dbId":  9101,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e確認已於申請前詳閱「\u003ca href=\"https://hike.taiwan.gov.tw/news_7_1.aspx?ID=1031\" target=\"_blank\"\u003e進入玉山國家公園生態保護區申請案件個人資料運用說明\u003c/a\u003e」，已轉知並取得全體隊員同意使用當事人個人資料辦理入園申請相關事宜。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  1
    },
    {
        "id":  "attention-yu02",
        "dbId":  9102,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e確認已於申請前詳閱並明瞭「\u003ca href=\"https://hike.taiwan.gov.tw/notice_a1.aspx\" target=\"_blank\"\u003e申請及入園注意事項\u003c/a\u003e」及「\u003ca href=\"https://hike.taiwan.gov.tw/notice_a2.aspx\" target=\"_blank\"\u003e申辦規定與須知\u003c/a\u003e」，並轉知全體隊員瞭解並遵守入園相關規定。並提醒若委由他人代辦，亦應檢視是否完成許可程序(如個人資料、行程規劃等均應詳加檢視)，若疏忽未檢視，難謂無過失之責。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  2
    },
    {
        "id":  "attention-yu03",
        "dbId":  9103,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e\u003cstrong\u003e開放路線(一般)之「排雲山莊」、「圓峰山屋/營地」、「庫哈諾辛山屋/營地」\u003c/strong\u003e\u003cstrong\u003e、「瓦拉米山屋/營地」及「玉山線單日往返路線」申請期限：\u003c/strong\u003e\u003cbr\u003e\n\u003cspan style=\"color:#ff0000\"\u003e抽籤前\u003c/span\u003e申請期限：預定入園日前1個月至前2個月間提出申請。\u003cbr\u003e\n\u003cspan style=\"color:#ff0000\"\u003e抽籤後\u003c/span\u003e申請期限：若未超過各宿營地或路線承載量管制員額時，可於預定入園日5天前提出申請，並依入園申請案（須資料完整）到達玉管處並經受理之時間先後進行排序遞補至額滿為止，不受理5日以內之申請。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  3
    },
    {
        "id":  "attention-yu04",
        "dbId":  9104,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e開放路線(一般)於預定住宿日前1個月之下午3時至4時（如遇假日後之上班日，則分別於上午9時至10時、中午12時至1時及下午3時至4時）辦理宿營地公開抽籤作業，並暫停參加抽籤之相關申請案線上入園申請及異動功能。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  4
    },
    {
        "id":  "attention-yu05",
        "dbId":  9105,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e每天07：00至23：00，為系統受理申請案件時間；23：00至隔日07：00雖暫停受理申請案件，但仍可\u003ca href=\"https://hike.taiwan.gov.tw/news_7_1.aspx?ID=2603\" target=\"_blank\"\u003e儲存草稿\u003c/a\u003e。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  5
    },
    {
        "id":  "attention-yu06",
        "dbId":  9106,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e凡入園申請為多日行程者，若其行程中之一日因受理申請承載量已滿或未中籤者，本處將逕予退件。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  6
    },
    {
        "id":  "attention-yu07",
        "dbId":  9107,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e進入山地管制區請依規辦理入山許可證(依國安法規定)。全體隊員已同意本處或代理申請人於核准入園後代為傳送隊伍及全體隊員之相關資料等，向警政署入山申請系統申請入山許可；且明瞭申請後由入山申請系統依程序核發入山許可。若因資料傳送失敗，將會自行申請入山許可。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  7
    },
    {
        "id":  "attention-yu08",
        "dbId":  9108,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e「緊急災難處理」\u003c/p\u003e\n\n\u003col\u003e\n\t\u003cli\u003e攜帶登山所須個人及團體裝備(雪季期間攜帶雪地攀登裝備)。\u003c/li\u003e\n\t\u003cli\u003e攜帶足夠的通訊及定位(GPS)設備，並定時與留守人員及家人聯絡。\u003c/li\u003e\n\t\u003cli\u003e充分瞭解園區之災害與天候資訊，並於行前辦理登山安全講習。\u003c/li\u003e\n\t\u003cli\u003e充分瞭解所有隊員身心狀況，並於行前自主訓練登山技能。\u003c/li\u003e\n\t\u003cli\u003e行進間以安全第一為原則，並配合國家公園現場人員查核及引導。\u003c/li\u003e\n\t\u003cli\u003e辦妥相關保險。\u003c/li\u003e\n\u003c/ol\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  8
    },
    {
        "id":  "attention-yu09",
        "dbId":  9109,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e「環境維護」\u003c/p\u003e\n\n\u003col\u003e\n\t\u003cli\u003e遵守進入國家公園生態保護區之相關規定。\u003c/li\u003e\n\t\u003cli\u003e充分瞭解無痕山林準則，減輕環境及生態衝擊。\u003c/li\u003e\n\t\u003cli\u003e避免影響野生動植物，不留下任何廢棄物及物品。\u003c/li\u003e\n\t\u003cli\u003e不離開已開放供使用之步道及區域。\u003c/li\u003e\n\t\u003cli\u003e配合國家公園保育巡查及行動，並協助勸導隊員言行舉止。\u003c/li\u003e\n\u003c/ol\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  9
    },
    {
        "id":  "attention-yu10",
        "dbId":  9110,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e外籍人士提前申請玉山主峰線住宿「排雲山莊」保留名額說明網址：\u003cbr\u003e\n\u003ca href=\"https://hike.taiwan.gov.tw/news_7_1.aspx?ID=2602\" target=\"_blank\"\u003ehttps://hike.taiwan.gov.tw/news_7_1.aspx?ID=2602\u003c/a\u003e。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  10
    },
    {
        "id":  "attention-yu11",
        "dbId":  9111,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e外國人住宿「排雲山莊」提前申請期限：預定入園日期前35天至前4個月間提出申請，於非假日（週日至週四）每日原則提供24個名額（每10個外國人另搭配2名本國人之比例原則）。請以英、日語版網頁提出申請，提前申請網址及登山路線：\u003c/p\u003e\n\n\u003cp\u003e(一)\u0026nbsp; 英文網頁： https://hike.taiwan.gov.tw/en/web_index.aspx\u003cbr\u003e\nOnline Application \u0026gt;\u0026gt; Apply for Park Permit\u003cbr\u003e\n\u0026gt;\u0026gt; Paiyun Lodge Advanced Application\u003cbr\u003e\n2 Days(Tataka - Yushan Hiking Route -Tataka )(Paiyun Lodge Advanced Application)\u003c/p\u003e\n\n\u003cp\u003e(二)日文網頁：https://hike.taiwan.gov.tw/jp/web_index.aspx\u003cbr\u003e\n入園の申請 \u0026gt;\u0026gt; オンライン入園申請\u003cbr\u003e\n\u0026gt;\u0026gt; 排雲山荘の先行申請\u003cbr\u003e\n2天(塔塔加 - 玉山主峰 - 塔塔加)(排雲山荘の先行申請)\u003c/p\u003e\n\n\u003cp\u003e(三) 若選擇「Standard Application」或「一般申請」恕無法列入外籍保留審查名單，請重新申請。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  11
    },
    {
        "id":  "attention-yu12",
        "dbId":  9112,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e颱風警報發佈、森林火災或其他突發事件時，管理處得另行發佈緊急措施禁止人員進入，已核發之入園許可證，於該期間應予以廢止，並請依規申請退費。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  12
    },
    {
        "id":  "attention-yu13",
        "dbId":  9113,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e雪季管制措施實施期間(依本處公告為準，預估為每年12月中旬至隔年3月間)，仍受理具雪地經驗並備妥雪攀裝備之隊伍申請；但未能符合規定隊伍，已核發之入園許可證，於該期間應予以廢止，並請依規申請退費。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  13
    },
    {
        "id":  "attention-yu14",
        "dbId":  9114,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e請從事登山活動者應主動自行評估自身經驗、裝備、技術能力、體能、天候情況及確認活動所帶來之風險，且應承擔自身安全責任。又因山區步道易受天然環境影響，造成無法預期之災損或阻斷，請登山民眾遇有通行安全疑慮時，切勿強行通過以維自身安全，並歡迎提供相關路況資訊，嘉惠山友。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  14
    },
    {
        "id":  "attention-yu15",
        "dbId":  9115,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e\u003cstrong\u003e請申請人瞭解所填具之隊員資料與行程計畫等，\u003cspan style=\"color:#ff0000;\"\u003e如明知為不實或冒用他人資料填載入園申請之事項，將渉犯刑法第210條偽造文書罪嫌，\u003c/span\u003e或刑法第214條使公務員登載不實罪嫌，本處將依法先予以退件處理，並立即將申請人停權處分，另將涉案相關資料向司法機關依法告發。\u003c/strong\u003e\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  15
    },
    {
        "id":  "attention-yu16",
        "dbId":  9116,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e\u003cspan style=\"color:#ff0000;\"\u003e\u003cstrong\u003e入園期間應攜帶入園許可證及身分證明文件正本俾利查核\u003c/strong\u003e\u003c/span\u003e\u003cstrong\u003e，未攜帶身分證明文件或所攜帶身分證明文件與入園許可證名冊不符者，禁止其入園。已入園者得令其離園。不聽制止或未依前段規定入園者，得依國家公園法第 19條規定處罰。\u0026nbsp;\u003c/strong\u003e\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  16
    },
    {
        "id":  "attention-yu17",
        "dbId":  9117,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e入園申請隊員若具有學生身分或參加學校社團活動，請務必自行通報學校相關單位，作為緊急應變之用。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  17
    },
    {
        "id":  "attention-yu18",
        "dbId":  9118,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e已瞭解地方政府登山活動管理自治條例規定，登山活動範圍涉及地方政府公告之特殊管制山域，需具備基本救命術證書或初級救護技術員等證照及辦理登山綜合保險。\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  18
    },
    {
        "id":  "attention-yu19",
        "dbId":  9119,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e\u003cspan style=\"color:#ff0000;\"\u003e\u003cu\u003e\u003cstrong\u003e如登山隊伍有聘請嚮導或協作，請務必一併申請入園。\u003c/strong\u003e\u003c/u\u003e\u003c/span\u003e\u003c/p\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "0",
        "defaultChecked":  false,
        "order":  19
    },
    {
        "id":  "attention-yu20",
        "dbId":  9120,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cspan style=\"color: #cc0000;\"\u003e\u003cb\u003e本人已閱讀並充分瞭解上述注意事項，並會遵守國家公園、警政署各項規定。\u003c/b\u003e\u003c/span\u003e",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "0",
        "defaultChecked":  false,
        "order":  20
    },


















    {
        "id":  "attention-sp01",
        "dbId":  9201,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "<p>凡欲於本園區內運用遙控無人機拍攝影片之自然人、法人、學校或政府機關（構），請於拍攝日前5個工作天(申請日不算，以上班日計算，不含假日)向本處提出申請。</p>\n\n<p>申請網址：<a href=\"https://eform.spnp.gov.tw/ap/forms/Dro/index.aspx\">https://eform.spnp.gov.tw/ap/forms/Dro/index.aspx</a></p>",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  1
    },
    {
        "id":  "attention-sp02",
        "dbId":  9202,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "<p>於國家公園內違規用火或用火不慎導致林火者，除涉犯「國家公園法」第13、24條及「森林法」第34、53、56條之刑事與行政責任外，尚須負擔民事損害賠償責任。請務必遵守防火規定，共同維護山林安全。</p>",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  2
    },
    {
        "id":  "attention-sp03",
        "dbId":  9203,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "<p>已詳閱國家賠償<a href=\"https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0020004&amp;flno=3\">法規</a>，全員(含留守人)了解本次行程之風險評估及緊急應變計畫和避免非不可抗力因素之迫降而影響到其他山友住宿權益。長程縱走登山行程請務必與留守人員約定通聯地點及時段，以利行程掌握或山域意外事故救援時能快速掌握狀況。</p>",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "0",
        "defaultChecked":  false,
        "order":  3
    },
    {
        "id":  "attention-sp04",
        "dbId":  9204,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "<p>115年中秋假期間入園申請，請詳閱<a href=\"https://hike.taiwan.gov.tw/news_0_1.aspx?id=4964\">115年雪霸國家公園中秋連假期間入園申請注意事項</a></p>",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "0",
        "defaultChecked":  false,
        "order":  4
    },
    {
        "id":  "attention-sp05",
        "dbId":  9205,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "<p>請注意，領隊及隊員名單如有外籍人士，請提醒攜帶具有GPS功能之通訊器材，手機請打開國際漫遊之通訊及簡訊功能，以利災害應變與聯繫。</p>",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  5
    },
    {
        "id":  "attention-sp06",
        "dbId":  9206,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "<p>為維護安全並避免意外，請勿擅自進入三六九山莊施工工區，住宿請依規定申請三六九臨時營地。</p>",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  6
    },
    {
        "id":  "attention-sp07",
        "dbId":  9207,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "<p><span style=\"color:#ff0000;\">申請人應瞭解並填具所有正確的隊員資料與行程計畫。如明知為不實或冒用他人資料填載入園申請之事項，已構成刑法第 210 條偽造文書罪嫌，或構成刑法第 214 條使公務員登載不實罪嫌，如查證屬實，本處將依法先予以退件處理，另配合司法機關調查提供相關申請資料。</span></p>",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  7
    },
    {
        "id":  "attention-sp08",
        "dbId":  9208,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "<p>確認已轉知並取得全體隊員同意使用當事人個人資料辦理入園申請相關事宜。</p>",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  8
    },
    {
        "id":  "attention-sp09",
        "dbId":  9209,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "<p>領隊需為成年人，並能承擔整體登山隊伍安危，請領隊務必轉知每位隊員了解本園<a href=\"https://hike.taiwan.gov.tw/nationpark/manasystem/news/files/news/f82c20f0-f198-4445-a04c-95c5bdd08f86.pdf\">申請進入雪霸國家公園生態保護區許可注意事項</a>，並於登山時遵守國家公園規定及隨時注意自身安全(夜間 請盡量不要登山)，並攜帶 GPS 及可供緊急連絡之通訊設備，以避免意外發生。領隊對於生態保護區之規定，負有督導與保證之責任。<span style=\"color:#0000ff\">領隊未到之隊伍禁止入園。</span></p>",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  9
    },
    {
        "id":  "attention-sp10",
        "dbId":  9210,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "<p>颱風警報發布、森林火災或其他突發事件時，本處得另行發布緊急措施禁止人員進入，已核發之入園許可證自動廢止。</p>",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  10
    },
    {
        "id":  "attention-sp11",
        "dbId":  9211,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "<p>入園日前 5 日至入園日前 2 個月每日 07:00-23:00 提出，申請日期須在可申請日期範圍內才接受申請，逾期恕不受理。例如申請 11/1~11/3 行程，則該行程於 9/1 07:00 起開始受理申請，至 10/27 23:00 止停止受理申請；申請 4/29 行程，最早可申請時間為 2/29，如當年度無 2/29，則與 4/30、5/1 入園之行程相同，最早可於&nbsp;3/1&nbsp;07:00 提出申請。<strong><span style=\"color:#ff0000;\">住宿九九山莊需事先繳費，考量線上金流作業時間，如遇假日或連假請民眾提早申請(扣除假日應於5日前辦理)，無法配合線上繳費者即無法取得入園許可證。</span></strong></p>",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  11
    },
    {
        "id":  "attention-sp12",
        "dbId":  9212,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "<p>全天候可上線填寫資料並「儲存草稿」，所儲存草稿可利用系統資料線上異動-草稿查詢功能帶出上次所儲存資料並修改，在系統開放申請的時間 (7:00-23:00間) 才可送件。草稿可保留30日，但下次透過資料線上異動開啟時，若原先選擇之日期或路線有關閉或名額不足之情形時，系統將清除所有草稿內的資料而需重新填寫相關資料。</p>",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  12
    },
    {
        "id":  "attention-sp13",
        "dbId":  9213,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "<p>&nbsp;「緊急災難處理」</p>\n<p>1.攜帶登山所須個人及團體裝備(雪季期間攜帶雪地攀登裝備)。</p>\n<p>2.攜帶足夠的通訊及定位(GPS)設備，並定時與留守人員及家人聯絡。</p>\n<p>3.充分瞭解園區之災害與天候資訊，並於行前辦理登山安全講習。</p>\n<p>4.充分瞭解所有隊員身心狀況，並於行前自主訓練登山技能。</p>\n<p>5.行進間以安全第一為原則，並配合國家公園現場人員查核及引導。</p>\n<p>6.辦妥相關保險。</p>",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  13
    },
    {
        "id":  "attention-sp14",
        "dbId":  9214,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "<p>\n\t「環境維護」</p>\n<p>\n\t1.遵守進入國家公園生態保護區之相關規定。</p>\n<p>\n\t2.充分瞭解無痕山林準則，減輕環境及生態衝擊。</p>\n<p>\n\t3.避免影響野生動植物，不留下任何廢棄物及物品。</p>\n<p>\n\t4.不離開已開放供使用之步道及區域。</p>\n<p>\n\t5.配合國家公園保育巡查及行動，並協助勸導隊員言行舉止。</p>",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  14
    },
    {
        "id":  "attention-sp15",
        "dbId":  9215,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "<p>山友規劃進行高海拔登山活動時，可先至家庭醫學科或旅遊醫學科，透過正常合法管道，由專業醫師預開高山症處方箋，預防性投藥，減緩高山病症狀。提醒山友須衡量自身健康及體能狀況，切勿勉強登山，以免發生狀況。</p>",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  15
    },
    {
        "id":  "attention-sp16",
        "dbId":  9216,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "<p>欲申請雪山西稜線之隊伍，請於申請前詳閱<a href=\"https://drive.google.com/file/d/1yIp9F8NAZBJ3XKlx-_Dn4GtC0jZglEuA/view?usp=sharing\">230林道注意事項</a>。</p>",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  16
    },
    {
        "id":  "attention-sp17",
        "dbId":  9217,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "<p>園區內禁止使用器具以外之炊煮、燃火行為；於乾燥季節期間，特別提高防火警覺，嚴防森林火災。</p>",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  17
    },
    {
        "id":  "attention-sp18",
        "dbId":  9218,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "<p>進入原住民族傳統領域須知：</p>\n\n<p>1.請充分認知本園區多為泰雅族及賽夏族眾社群之傳統領域。</p>\n\n<p>2.請各登山隊伍友善對待高山協作員，彼此互相尊重，建議各登山隊伍進入本園區時，自主聘請本園區周邊部落之在地原住民族人擔任隨隊嚮導，協助各登山隊伍理解並認知泰雅族及賽夏族千年來與大山共生的態度與智慧，以實踐本園與在地原住民族之夥伴關係。</p>\n\n<p>3.本處期許各登山隊伍進入本園區，如遇在地原住民族人進行傳統文化教育活動時，能以欣賞並尊重的態度駐足參與或對話，給予在地族人努力於文化傳承與保存最大的支持與鼓勵。</p>",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  18
    },
    {
        "id":  "attention-sp19",
        "dbId":  9219,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "<p>入園申請隊員若具有學生身分或參加學校社團活動，請務必自行通報學校相關單位，作為緊急應變之用。</p>",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  19
    },
    {
        "id":  "attention-sp20",
        "dbId":  9220,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "<p>已瞭解地方政府登山活動管理自治條例規定，登山活動範圍涉及地方政府公告之特殊管制山域，需具備基本救命術證書或初級救護技術員等證照及辦理登山綜合保險。</p>",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  20
    },
    {
        "id":  "attention-sp21",
        "dbId":  9221,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "<span style=\"color: #cc0000;\"><b>本人已閱讀並充分瞭解上述注意事項，並會遵守國家公園、警政署各項規定。</b></span>",
        "name_en":  "",
        "name_jp":  "",
        "chk":  "1",
        "selectchk":  "0",
        "defaultChecked":  false,
        "order":  21
    }
];

window.CONSENT_BY_ORG = ATTENTION_ITEMS.reduce((map, item) => {
  if (!map[item.orgId]) map[item.orgId] = [];
  map[item.orgId].push(item);
  return map;
}, {});

Object.assign(window, { PARK_LIST, PARK_BY_UNIT, PARK_BY_ORG_ID, ATTENTION_ITEMS, CONSENT_BY_ORG });
