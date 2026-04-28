/* Generated from raw/同意書條文.csv and raw/管理機關.csv.
 * Source model: attention + EIP_Core_Organization.
 */

const PARK_LIST = [
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

const PARK_BY_UNIT = Object.fromEntries(PARK_LIST.map(park => [park.unit, park]));
const PARK_BY_ORG_ID = Object.fromEntries(PARK_LIST.map(park => [park.orgId, park]));

const ATTENTION_ITEMS = [
    {
        "id":  "attention-36",
        "dbId":  36,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e確認已於申請前詳閱並明瞭「\u003ca href=\"https://hike.taiwan.gov.tw/notice_a4.aspx\"\u003e 申請及入園注意事項\u003c/a\u003e」，並轉知全體隊員。\u003c/p\u003e\r\n\r\n\u003cp style=\"margin-left:24.0pt;\"\u003e1.隊伍成員如為中央流行疫情指揮中心公告之「居家隔離、居家檢疫及自主健康管理等符合通報定義」之人員(詳見:\u003ca href=\"https://www.cdc.gov.tw/\" target=\"_blank\"\u003ehttps://www.cdc.gov.tw\u003c/a\u003e)，應取消或暫緩申請入園。\u0026nbsp;\u003c/p\u003e\r\n\r\n\u003cp style=\"margin-left:24.0pt;\"\u003e2.隊伍所有成員應加強自主健康管理，入園之後如有疑似相關症狀發生，應使用口罩或足可遮掩口鼻物品進入山屋，保護自己也尊重他人。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eA confirmation of thorough acknowledgement and understanding of \u0026quot;\u003ca href=\"https://npm.nps.gov.tw/en/notice_1.aspx?tabs=2\"\u003eImportant Notices for Park Entry\u003c/a\u003e\u0026quot; prior to submitting your application.\u003c/p\u003e \u003cp\u003eAll visitors need to pay close attention to their health condition. To protect oneself and respect others, if anyone starts to have signs of cold or flu, this person must wear a mask or other object that can cover the nose and mouth while inside the cabin.\u003cbr /\u003e \u0026nbsp;\u003c/p\u003e",
        "name_jp":  "\u003cp\u003eチームリーダーは、次の関連事項を明確に通知しました：\u003c/p\u003e\r\n\r\n\u003cp\u003e1.チームのメンバーが、中央感染症指揮センター（https://www.cdc.gov.twを参照）によって発表された「感染確認」場合、入園を自主にキャンセルする必要があります。\u003c/p\u003e\r\n\r\n\u003cp\u003e2.チーム全員が自主健康管理を強化する必要があり、入園あと、風邪の疑いがある場合は、マスクまた鼻と口を覆って、山屋に入り、自分も相手を守ります。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "0",
        "defaultChecked":  false,
        "order":  0
    },
    {
        "id":  "attention-24",
        "dbId":  24,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e入園申請前領隊責任同意事項：\u003c/p\u003e\r\n\r\n\u003cp\u003e1. 本申請人瞭解所填具之隊員資料與行程計畫等，如明知為不實之事項，而使公務員登載 於職務上所掌之公文書，足以生損害於公眾或他人者，恐涉及刑法之偽造文書罪，依「使登 載不實事項」論處。\u003c/p\u003e\r\n\r\n\u003cp\u003e2. 本申請人承諾轉知領隊及隊員有關本案核發之「生態保護區入園許可證」各項承諾規定 與審查建議事項。並請領隊攜帶入園許可證及隊員身分證明文件，供入園查核。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eResponsibilities of the Team Leader as pertaining to the Park Ecological Protection Areas Entry Permit:\u003c/p\u003e\r\n\r\n\u003col\u003e\r\n\t\u003cli\u003eThe applicant fully confirms the personal data and is aware of the travel plans of all team members. Untrue information within the application, which is considered an official document and cause damage to the public or others, that causes damage to the team or others will be punished under criminal law of forgery according to \u0026quot;the publication of false matters\u0026quot;.\u003c/li\u003e\r\n\t\u003cli\u003eThe applicant will convey to the team leader and team members the requirements and commitments addressed in the \u0026quot;Park Ecological Protection Areas Entry Permit\u0026quot;. The team leader must carry the permits and team members\u0026rsquo; identity documents for inspection.\u003c/li\u003e\r\n\u003c/ol\u003e\r\n",
        "name_jp":  "\u003cp\u003e入園申請前領隊責任同意事項： 一、本申請人瞭解所填具之隊員資料與行程計畫等，如明知為不實之事項，而使公務員登載 於職務上所掌之公文書，足以生損害於公眾或他人者，恐涉及刑法之偽造文書罪，依「使登 載不實事項」論處。 二、本申請人承諾轉知領隊及隊員有關本案核發之「生態保護區入園許可證」各項承諾規定 與審查建議事項。並請領隊攜帶入園許可證及隊員身分證明文件，供入園查核。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  1
    },
    {
        "id":  "attention-37",
        "dbId":  37,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e颱風警報發布、森林火災或其他突發事件時，管理處得另行發布緊急措施禁止人員進入，已核發之入園許可證自動廢止(無效)。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eWhen Typhoon Warnings have been issued, or in the instance of bushfires or other emergency situations, the National Park Headquarters will announce contingency plans to restrict access to some or all areas of the Park. Permits granted access during this period will be deemed void (ineffective).\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e颱風警報發布、森林火災或其他突發事件時，管理處得另行發布緊急措施禁止人員進入，已核發之入園本許可證視同作廢，並請儘速申請退費。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  1
    },
    {
        "id":  "attention-25",
        "dbId":  25,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e生態保護措施承諾：\u003c/p\u003e\r\n\r\n\u003cp\u003e1. 將充分瞭解本區生態的脆弱性，並於行前辦理減輕生態衝擊講習。\u003c/p\u003e\r\n\r\n\u003cp\u003e2. 將充分瞭解無痕山林準則，行程中隨時注意並提醒隊員山友言行。\u003c/p\u003e\r\n\r\n\u003cp\u003e3. 將配合國家公園巡查志工之保育行動，並協助勸導隊員山友言行。\u003c/p\u003e\r\n\r\n\u003cp\u003e4. 避免人造物品影響野生物，留置物同意管理處依無主廢棄物處理。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eTeam commitment to ecological protection:\u003c/p\u003e\r\n\r\n\u003col\u003e\r\n\t\u003cli\u003eTeam members will fully recognize the ecological vulnerability of the surrounding area, and will attend a workshop on reducing one\u0026rsquo;s ecological footprint before departing.\u003c/li\u003e\r\n\t\u003cli\u003eTeam members will fully understand the Leave No Trace Principles, and together with their team members, will actively enforce these guidelines during their trip.\u003c/li\u003e\r\n\t\u003cli\u003eIf required, team members will cooperate with the National Parks Volunteers in areas of conservation action, and hold themselves and team members to upstanding behavior in this regard.\u003c/li\u003e\r\n\t\u003cli\u003eTeam members will avoid using items that can potentially impact wildlife and their habitat, and appropriately dispose or attend to rubbish in accordance with the guidelines set by the Taroko National Park Headquarters.\u003c/li\u003e\r\n\u003c/ol\u003e\r\n",
        "name_jp":  "\u003cp\u003e生態保護措施承諾： 1.將充分瞭解本區生態的脆弱性，並於行前辦理減輕生態衝擊講習。 2.將充分瞭解無痕山林準則，行程中隨時注意並提醒隊員山友言行。 3.將配合國家公園巡查志工之保育行動，並協助勸導隊員山友言行。 4.避免人造物品影響野生物，留置物同意管理處依無主廢棄物處理。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  2
    },
    {
        "id":  "attention-26",
        "dbId":  26,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e登山安全措施承諾：\u003c/p\u003e\r\n\r\n\u003cp\u003e1. 將充分瞭解本區之災害與天候資訊，並於行前辦理安全維護講習。\u003c/p\u003e\r\n\r\n\u003cp\u003e2. 將充分瞭解所有隊友身心狀況，並於行前自主訓練補強各項技能。\u003c/p\u003e\r\n\r\n\u003cp\u003e3. 將充分瞭解原野地緊急應變措施，確實攜帶各項登山裝備與用品。\u003c/p\u003e\r\n\r\n\u003cp\u003e4. 攜帶足夠的通訊設備與電池，並定時與山下留守人員及家人聯絡。\u003c/p\u003e\r\n\r\n\u003cp\u003e5. 行進中隨時評估氣象與隊員狀況，以安全第一為原則下妥善因應。\u003c/p\u003e\r\n\r\n\u003cp\u003e6. 配合國家公園保育志工查核與引導，如有安全疑慮絕不勉強攀登。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eTeam commitment to safety hiking:\u003c/p\u003e\r\n\r\n\u003col\u003e\r\n\t\u003cli\u003eTeam members must fully recognize and understand the various disaster risks within and weather forecast pertaining to the Park area, and attend the safety maintenance workshops before the hiking trip, if required.\u003c/li\u003e\r\n\t\u003cli\u003eThe team leader must be fully informed of the physical and mental conditions of all team members, and undertake any necessary physical conditioning and essential mountaineering skills before embarking on the trip. \u0026nbsp;\u003c/li\u003e\r\n\t\u003cli\u003eThe team leader must be aware and be familiar with contingency plans during the entire trip. The team is responsible for bringing the necessary mountaineering equipment and supplies.\u003c/li\u003e\r\n\t\u003cli\u003eThe team must carry communications equipment and sufficient batteries, and keep in touch with the rear personnel and respective families on a regular basis.\u003c/li\u003e\r\n\t\u003cli\u003eThe team leader must be cognizant of the weather and be vigilant in monitoring the condition of team members at all times during the trip, and must adhere to the \u0026ldquo;Safety First\u0026rdquo; principles while on the trip.\u003c/li\u003e\r\n\t\u003cli\u003eAll team members must comply the National Parks Conservation Volunteers if subject to inspection and/or instruction, and never pursue hiking if faced with security and safety concerns.\u003c/li\u003e\r\n\u003c/ol\u003e\r\n",
        "name_jp":  "\u003cp\u003e登山安全措施承諾： 1.將充分瞭解本區之災害與天候資訊，並於行前辦理安全維護講習。 2.將充分瞭解所有隊友身心狀況，並於行前自主訓練補強各項技能。 3.將充分瞭解原野地緊急應變措施，確實攜帶各項登山裝備與用品。 4.攜帶足夠的通訊設備與電池，並定時與山下留守人員及家人聯絡。 5.行進中隨時評估氣象與隊員狀況，以安全第一為原則下妥善因應。 6.配合國家公園保育志工查核與引導，如有安全疑慮絕不勉強攀登。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  3
    },
    {
        "id":  "attention-1048",
        "dbId":  1048,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e欲申請「其他路線」：\u003c/p\u003e\r\n\r\n\u003cp\u003e線上系統僅受理進入生態保護區之案件，非進入生態保護區，系統亦將退回申辦案件。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eWhen applying for non-traditional routes (designated as \u0026quot;Other\u0026quot;):\u003c/p\u003e\r\n\r\n\u003cp\u003eThe online system will only accept applications for routes within the Ecological Protected Area. Applications with routes that at any point stray outside the Ecological Protected Area will be rejected.\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e欲申請「其他路線」，線上系統僅受理進入生態保護區之案件，非進入生態保護區，系統亦將退回申辦案件。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  4
    },
    {
        "id":  "attention-14",
        "dbId":  14,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e登山申請時間說明：\u003c/p\u003e\r\n\r\n\u003cp\u003e1、奇萊主（北）峰、奇萊連峰、奇萊東稜、奇萊南峰、南湖大山、南湖中央尖、北一縱走北二、北二段、閂山鈴鳴山、閂山單攻、畢祿縱走羊頭、清水山、其它路線：\u003c/p\u003e\r\n\r\n\u003cp\u003e（一）入園5天15:00前至2個月前可提出申請。\u003c/p\u003e\r\n\r\n\u003cp\u003e（二）每份申請書為一隊，每隊最多不得超過12人，若超過上述人數，請分別填寫，領隊及隊員均不得重覆。\u003c/p\u003e\r\n\r\n\u003cp\u003e（三）入園前5天內申請案件不予受理。(連續假期應於放假前1天15：00前完成申請）\u003c/p\u003e\r\n\r\n\u003cp\u003e（四）入園前2個月內提出申請案件以線上申請時間為先後排序。\u003c/p\u003e\r\n\r\n\u003cp\u003e（五）入園申請案件審核通過後，日期、人員(含領隊、隊員、留守)不得更換或增加，可以取消入園（全隊或個別隊員取消），新增人員應另案提出申請。\u003c/p\u003e\r\n\r\n\u003cp\u003e2、羊頭山、畢祿山單攻路線：\u003c/p\u003e\r\n\r\n\u003cp\u003e（一）入園3天15:00前至2個月前可提出申請。\u003c/p\u003e\r\n\r\n\u003cp\u003e（二）每份申請書為一隊，每隊最多不得超過12人，若超過上述人數，請分別填寫，領隊及隊員均不得重覆。\u003c/p\u003e\r\n\r\n\u003cp\u003e（三）入園前3天內申請案件不予受理。(翌週一及連續假期應於放假前1天15：00前完成申請）\u003c/p\u003e\r\n\r\n\u003cp\u003e（四）入園前2個月內提出申請案件以線上申請時間為先後排序。\u003c/p\u003e\r\n\r\n\u003cp\u003e（五）入園申請案件審核通過後，日期、人員(含領隊、隊員、留守)不得更換或增加，可以取消入園（全隊或個別隊員取消），新增人員應另案提出申請。\u003c/p\u003e\r\n\r\n\u003cp\u003e3、錐麓古道單日路線：\u003c/p\u003e\r\n\r\n\u003cp\u003e（一）入園1天15：00前至2個月前可提出申請。\u003c/p\u003e\r\n\r\n\u003cp\u003e（二）錐麓古道每天每一人限制申請一隊12人，申請人、領隊及隊員不得重複申請。\u003c/p\u003e\r\n\r\n\u003cp\u003e（三）錐麓古道受理申請時間為入園前1天15：00前至2個月前，週二至週五入園應於前1天15：00前完成申請，週六至翌週一入園應於週五15：00前完成申請（連續假期應於放假前1天15：00前完成申請），2個月內之申請案件不在此限。\u003c/p\u003e\r\n\r\n\u003cp\u003e（四）入園前2個月內提出申請案件以線上申請時間為先後排序。\u003c/p\u003e\r\n\r\n\u003cp\u003e（五）入園申請案件審核通過後，日期、人員(含領隊、隊員、留守)不得更換或增加，可以取消入園（全隊或個別隊員取消），新增人員應另案提出申請。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eSubmission window and times regarding National Park Entry Permits:\u003c/p\u003e\r\n\r\n\u003col\u003e\r\n\t\u003cli\u003eThe application system is open for submissions every day between 7:00 am and 11:00 pm. The system will be closed between 11:00 pm to 7:00 am the next morning for routine maintenance. Quotas regarding the daily maximum number of persons are applied on some routes.\u003c/li\u003e\r\n\t\u003cli\u003eFor Qilai (Qilai Main Peak and Qilai North Peak, Mt. Qilai Range, Qilai East Ridge, Qilai South Peak), Nanhu (Mt. Nanhu, Mt. Nanhu \u0026ndash; Mt. Zhongyangjian/North Section 1 of Central Mt. Range), North Section 1.~2. North of Central Mt. Range, North Section 2 of Central Mt. Range/Guimenguan Cliff, Mt. Shuan \u0026ndash; Mt. Lingming, Mt. Shuan Single Day Ascent, Mt. Bilu \u0026ndash; Mt. Yangtou, Mt. Qingshui, and non-traditional (\u0026ldquo;Other\u0026rdquo;) routes:\r\n\t\u003col style=\"list-style-type:upper-alpha;\"\u003e\r\n\t\t\u003cli\u003eApplication window open 5-30 days before date of intended entry\u0026nbsp;(closing at\u0026nbsp;3 pm, 5 days before the date of intended entry).\u003c/li\u003e\r\n\t\t\u003cli\u003eOne application is representative of one team. A team can consist of a maximum of 12 people; separate (new) application(s) should be completed if the number of team members exceeds 12. An applicant can only be a team member or a team leader a maximum of once a day (e.g. one cannot be a member of a team and the leader of another team on the same day).\u003c/li\u003e\r\n\t\t\u003cli\u003eApplications submitted less than 5 days before the date of intended entry will not be accepted.\u003c/li\u003e\r\n\t\t\u003cli\u003eApplications successfully submitted within 30 days before the date of intended entry will be arranged in the order of submission time.\u003c/li\u003e\r\n\t\t\u003cli\u003eOnce an application is approved, the date of entry and the names of members (including the team leader, team members, and the emergency coordinator) cannot be changed. Parties may cancel their application in whole or in part (either for an individual or for the entire party). Additional (separate) applications should be submitted if additional members wish to participate.\u003c/li\u003e\r\n\t\u003c/ol\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003eFor Mt. Yangtou Single Day Ascent, Mt. Bilu Single Day Ascent routes:\r\n\t\u003col style=\"list-style-type:upper-alpha;\"\u003e\r\n\t\t\u003cli\u003eApplication window open 3-30 days before entry (closing at\u0026nbsp;3 pm, 3 days before the date of intended entry).\u003c/li\u003e\r\n\t\t\u003cli\u003eOne application is representative of one team. A team can consist of a maximum of 12 people; separate (new) application(s) should be completed if the number of team members exceeds 12. An applicant can only be a team member or a team leader a maximum of once a day (e.g. one cannot be a member of a team and the leader of another team on the same day).\u003c/li\u003e\r\n\t\t\u003cli\u003eApplications submitted less than 3 days before the date of intended entry will not be accepted.\u003c/li\u003e\r\n\t\t\u003cli\u003eApplications successfully submitted within 30 days before the date of intended entry will be arranged in the order of submission time.\u003c/li\u003e\r\n\t\t\u003cli\u003eOnce an application is approved, the date of entry and the names of members (including the team leader, team members, and the emergency coordinator) cannot be changed. Parties may cancel their application in whole or in part (either for an individual or for the entire party). Additional (separate) applications should be submitted if additional members wish to participate.\u003c/li\u003e\r\n\t\u003c/ol\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003eFor Zhuilu Old Road:\r\n\t\u003col style=\"list-style-type:upper-alpha;\"\u003e\r\n\t\t\u003cli\u003eApplications will open 1 \u0026ndash; 30 days before entry. The application window will close at 3 pm on the previous working day.\u003c/li\u003e\r\n\t\t\u003cli\u003eOne application is representative of one team. A team can consist of a maximum of 12 people; separate (new) application(s) should be completed if the number of team members exceeds 12. An applicant can only be a team member or a team leader a maximum of once a day (e.g. one cannot be a member of a team and the leader of another team on the same day).\u003c/li\u003e\r\n\t\t\u003cli\u003eThe latest submission time for Zhuilu Old Road is 3 pm the previous day if the date of intended entry falls between Tuesday and Friday, and before 3 pm on Friday for entry between Saturday and Monday. If there is a public holiday before the date of intended entry, the latest submission time is 3 pm on the last working day. Otherwise, applications submitted in advance of these date restrictions will not be subjected to these regulations.\u003c/li\u003e\r\n\t\t\u003cli\u003eApplications successfully submitted within 30 days before the date of intended entry will be arranged in the order of submission time.\u003c/li\u003e\r\n\t\t\u003cli\u003eOnce an application is approved, the date of entry and the names of members (including the team leader, team members, and the emergency coordinator) cannot be changed. Parties may cancel their application in whole or in part (either for an individual or for the entire party). Additional (separate) applications should be submitted if additional members wish to participate.\u003c/li\u003e\r\n\t\u003c/ol\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003e\r\n\t\u003cp\u003eAdvance Application for Zhuilu Old Road (Foreigners Only):\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\u003c/ol\u003e\r\n\r\n\u003cul\u003e\r\n\t\u003cli\u003e\r\n\t\u003cp\u003eApplication window open 4 months to 35 days before date of intended entry; weekdays only (Monday to Thursday, excluding public holidays).\u0026nbsp;The application window closes at\u0026nbsp;3 pm, 35 days before the date of intended entry.\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003e\r\n\t\u003cp\u003eAll team members must possess foreign nationality; please upload the photo page of your valid passport or a resident ID card as proof.\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003e\r\n\t\u003cp\u003eOnce an application has been approved, the date of entry and the names of all team members (including the leader, team members, and the emergency coordinator) cannot be altered, and additional team members cannot be added to the same application. Cancellation (for an individual or for the entire party, excluding the team leader) can be accepted. Separate applications should be submitted if additional members wish to hike on the same date of intended entry.\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003e\r\n\t\u003cp\u003eThere will be no standby measures (i.e. waitlist) for foreign visitor applications to Zhuilu Old Road. All applicants regardless of nationality are welcome to apply through the standard application window (1 \u0026ndash; 30 days before date of intended entry) if the quota for foreign visitors has already been reached.\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\u003c/ul\u003e\r\n",
        "name_jp":  "\u003cp style=\"margin-left:49.6pt;\"\u003e●奇萊主（北）峰、奇萊連峰、奇萊東稜、奇萊南峰、南湖大山、南湖中央尖、北一縱走北二、北二段、閂山鈴鳴山、閂山單攻、畢祿縱走羊頭、清水山、其它路線：入園予定日前2個月から5日の15：00以前。\u003c/p\u003e\r\n\r\n\u003cp style=\"margin-left:49.6pt;\"\u003e●羊頭山、畢祿山單攻路線：入園予定日2個月から3日の15：00以前。\u003c/p\u003e\r\n\r\n\u003cp style=\"margin-left:49.6pt;\"\u003e●錐麓古道日帰りルート：入園予定日2個月から１日の15：00以前\u003c/p\u003e\r\n\r\n\u003cp style=\"margin-left:49.6pt;\"\u003e●錐麓古道日帰りルート外国人先行申請：入園予定日前4か月から35日、入園予定日は月曜日から木曜日（祝祭日を除く）に限る\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  5
    },
    {
        "id":  "attention-38",
        "dbId":  38,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e「緊急災難處理」\u003c/p\u003e\r\n\r\n\u003cp\u003e1.攜帶登山所須個人及團體裝備(雪季期間攜帶雪地攀登裝備)。\u003c/p\u003e\r\n\r\n\u003cp\u003e2.攜帶足夠的通訊及定位(GPS)設備，並定時與留守人員及家人聯絡。\u003c/p\u003e\r\n\r\n\u003cp\u003e3.充分瞭解園區之災害與天候資訊，並於行前辦理登山安全講習。\u003c/p\u003e\r\n\r\n\u003cp\u003e4.充分瞭解所有隊員身心狀況，並於行前自主訓練登山技能。\u003c/p\u003e\r\n\r\n\u003cp\u003e5.行進間以安全第一為原則，並配合國家公園現場人員查核及引導。\u003c/p\u003e\r\n\r\n\u003cp\u003e6.辦妥相關保險。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003e[Emergency Planning]\u003c/p\u003e\r\n\r\n\u003col\u003e\r\n\t\u003cli\u003ePlease ensure and bring adequate personal and group mountain equipment with you on your hike (including snow/ice climbing equipment during snow season).\u003c/li\u003e\r\n\t\u003cli\u003ePlease bring working communication and GPS devices with you on your hike, and regularly notify family members and/or your emergency contact persons of your itinerary and current position.\u003c/li\u003e\r\n\t\u003cli\u003eTeam members must be cognizant of the weather and must fully recognize and understand the various disaster risks within the Park area, and attend the safety maintenance workshops before the hiking trip, if required.\u003c/li\u003e\r\n\t\u003cli\u003eThe team leader must be fully informed of the physical and mental conditions of all team members, and undertake any necessary physical conditioning and essential mountaineering skills before embarking on the trip. \u0026nbsp;\u003c/li\u003e\r\n\t\u003cli\u003eTeam members must adhere to the \u0026ldquo;Safety First\u0026rdquo; principles while on the trip. All team members must comply the National Parks Conservation Volunteers if subject to inspection and/or instruction, and adhere to their guidance if needed.\u003c/li\u003e\r\n\t\u003cli\u003ePlease consider appropriate insurance for your team to ensure adequate coverage in the face of an emergency.\u003c/li\u003e\r\n\u003c/ol\u003e\r\n",
        "name_jp":  "\u003cp\u003e「緊急災難處理」\u003c/p\u003e\r\n\r\n\u003cp\u003e1.攜帶登山所須個人及團體裝備(雪季期間攜帶雪地攀登裝備)。\u003c/p\u003e\r\n\r\n\u003cp\u003e2.攜帶足夠的通訊及定位(GPS)設備，並定時與留守人員及家人聯絡。\u003c/p\u003e\r\n\r\n\u003cp\u003e3.充分瞭解園區之災害與天候資訊，並於行前辦理登山安全講習。\u003c/p\u003e\r\n\r\n\u003cp\u003e4.充分瞭解所有隊員身心狀況，並於行前自主訓練登山技能。\u003c/p\u003e\r\n\r\n\u003cp\u003e5.行進間以安全第一為原則，並配合國家公園現場人員查核及引導。\u003c/p\u003e\r\n\r\n\u003cp\u003e6.辦妥相關保險。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  95
    },
    {
        "id":  "attention-39",
        "dbId":  39,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e「環境維護」\u003c/p\u003e\r\n\r\n\u003cp\u003e1.遵守進入國家公園生態保護區之相關規定。\u003c/p\u003e\r\n\r\n\u003cp\u003e2.充分瞭解無痕山林準則，減輕環境及生態衝擊。\u003c/p\u003e\r\n\r\n\u003cp\u003e3.避免影響野生動植物，不留下任何廢棄物及物品。\u003c/p\u003e\r\n\r\n\u003cp\u003e4.不離開已開放供使用之步道及區域。\u003c/p\u003e\r\n\r\n\u003cp\u003e5.配合國家公園保育巡查及行動，並協助勸導隊員言行舉止。\u003c/p\u003e\r\n\r\n\u003cp\u003e6.為考量安全及損壞設施請勿在山屋床位上炊煮。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003e[Environmental Protection]\u003c/p\u003e\r\n\r\n\u003col\u003e\r\n\t\u003cli\u003eAll team members must obey the relevant regulations when entering the Ecological Protection Area of Taroko National Park.\u003c/li\u003e\r\n\t\u003cli\u003eTeam members will fully understand the Leave No Trace Principles, and strive to keep their ecological footprint to a minimum.\u003c/li\u003e\r\n\t\u003cli\u003eTeam members will keep contact with wildlife to a minimum, and will not dispose of any rubbish on the trails.\u003c/li\u003e\r\n\t\u003cli\u003eTeam members must not leave the trailpath.\u003c/li\u003e\r\n\t\u003cli\u003eIf required, team members will cooperate with the National Parks Volunteers in areas of conservation action, and hold themselves and team members to upstanding behavior in this regard.\u003c/li\u003e\r\n\t\u003cli\u003eFor your own safety, it is forbidden to cook on beds inside cabins\u003c/li\u003e\r\n\u003c/ol\u003e\r\n",
        "name_jp":  "\u003cp\u003e「環境維護」\u003c/p\u003e\r\n\r\n\u003cp\u003e1.遵守進入國家公園生態保護區之相關規定。\u003c/p\u003e\r\n\r\n\u003cp\u003e2.充分瞭解無痕山林準則，減輕環境及生態衝擊。\u003c/p\u003e\r\n\r\n\u003cp\u003e3.避免影響野生動植物，不留下任何廢棄物及物品。\u003c/p\u003e\r\n\r\n\u003cp\u003e4.不離開已開放供使用之步道及區域。\u003c/p\u003e\r\n\r\n\u003cp\u003e5.配合國家公園保育巡查及行動，並協助勸導隊員言行舉止。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  96
    },
    {
        "id":  "attention-1029",
        "dbId":  1029,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e如欲申請【錐麓古道】請觀看\u003ca href=\"https://www.youtube.com/watch?v=mlQmpH1w0Rw\" style=\"line-height: 20.8px;\" target=\"_blank\"\u003e錐麓古道安全宣導影片\u003c/a\u003e\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003ePlease watch the \u0026quot;\u003ca href=\"https://www.youtube.com/watch?v=mlQmpH1w0Rw\"\u003eZhuilu Old Road Safety Announcement Video\u003c/a\u003e\u0026quot; if you wish to apply for admission to Zhuilu Old Road.\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e如欲申請【錐麓古道】請觀看\u003ca href=\"https://www.youtube.com/watch?v=mlQmpH1w0Rw\" style=\"line-height: 20.8px;\" target=\"_blank\"\u003e錐麓古道安全宣導影片\u003c/a\u003e\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  97
    },
    {
        "id":  "attention-1036",
        "dbId":  1036,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e\u003cstrong\u003e\u003cspan style=\"color:#b22222;\"\u003e\u003cspan style=\"background-color:#ebf0d8; font-family:微軟正黑體,Verdana,Arial,Helvetica,sans-serif; font-size:15px\"\u003e確認已於申請前詳閱並明瞭「\u003c/span\u003e\u003c/span\u003e\u003ca href=\"https://hike.taiwan.gov.tw/notice_a4.aspx\" style=\"color: rgb(51, 122, 183); text-transform: none; text-indent: 0px; letter-spacing: normal; font-family: 微軟正黑體, Verdana, Arial, Helvetica, sans-serif; font-size: 15px; font-style: normal; font-weight: normal; text-decoration: none; word-spacing: 0px; white-space: normal; box-sizing: border-box; orphans: 2; widows: 2; background-color: rgb(235, 240, 216); font-variant-ligatures: normal; font-variant-caps: normal; -webkit-text-stroke-width: 0px;\"\u003e\u003cspan style=\"color:#b22222;\"\u003e \u003c/span\u003e\u003c/a\u003e\u003ca href=\"https://hike.taiwan.gov.tw/news_0_1.aspx?id=1855\"\u003e\u003cspan style=\"color:#0000ff;\"\u003e\u003cspan style=\"font-family:微軟正黑體,Verdana,Arial,Helvetica,sans-serif; font-size:14px\"\u003e錐麓古道入園收費須知\u003c/span\u003e\u003c/span\u003e\u003c/a\u003e\u003cspan style=\"color:#b22222;\"\u003e\u003cspan style=\"background-color:#ebf0d8; font-family:微軟正黑體,Verdana,Arial,Helvetica,sans-serif; font-size:15px\"\u003e」，\u003c/span\u003e\u003c/span\u003e\u003cspan style=\"color:#ff0000;\"\u003e現場購票與入園查核時間每日\u003c/span\u003e\u003ca href=\"https://hike.taiwan.gov.tw/news_0_1.aspx?id=3106\"\u003e\u003cspan style=\"color:#0000ff;\"\u003e\u003cu\u003e上午7時~上午10時\u003c/u\u003e\u003c/span\u003e\u003c/a\u003e\u003cspan style=\"color:#ff0000;\"\u003e止\u003c/span\u003e\u003c/strong\u003e\u003cspan style=\"color:#b22222;\"\u003e\u003cstrong\u003e\u003cspan style=\"background-color:#ebf0d8; font-family:微軟正黑體,Verdana,Arial,Helvetica,sans-serif; font-size:15px\"\u003e，\u003c/span\u003e\u003c/strong\u003e\u003cstrong\u003e\u003cspan style=\"background-color:#ebf0d8; font-family:微軟正黑體,Verdana,Arial,Helvetica,sans-serif; font-size:15px\"\u003e並轉知全體隊員。\u003c/span\u003e\u003c/strong\u003e\u003c/span\u003e\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003e\u003cspan style=\"color:#b22222;\"\u003eI have read and acknowledge the \u0026quot;\u003c/span\u003e\u003ca href=\"https://hike.taiwan.gov.tw/en/news_0_1.aspx?id=1855\"\u003e\u003cspan style=\"color:#0000ff;\"\u003eAdmission Fees pertaining to Zhuilu Old Road\u003c/span\u003e\u003c/a\u003e\u003cspan style=\"color:#b22222;\"\u003e\u0026quot; prior to applying.\u003c/span\u003e\u003cspan style=\"color:#ff0000;\"\u003e \u003cstrong\u003e\u003cspan style=\"font-size:12px;\"\u003eI understand that we must enter Zhuilu Old Road between\u003c/span\u003e\u003c/strong\u003e\u003c/span\u003e\u003cspan style=\"color:#b22222;\"\u003e\u003cstrong\u003e\u003cspan style=\"font-size:12px;\"\u003e \u003c/span\u003e\u003c/strong\u003e\u003c/span\u003e\u003ca href=\"http://npm.cpami.gov.tw/en/news_1main.aspx?id=1855\"\u003e\u003cspan style=\"color:#0000ff;\"\u003e\u003cstrong\u003e\u003cspan style=\"font-size:12px;\"\u003e\u003cu\u003e7 AM and 10 AM\u003c/u\u003e\u003c/span\u003e\u003c/strong\u003e\u003c/span\u003e\u003c/a\u003e\u003cspan style=\"color:#b22222;\"\u003e\u003cstrong\u003e\u003cspan style=\"font-size:12px;\"\u003e.\u003c/span\u003e\u0026nbsp;\u003c/strong\u003eI will convey this information to all team members.\u003c/span\u003e\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e\u003cstrong\u003e\u003cspan style=\"color:#b22222;\"\u003e\u003cspan style=\"background-color:#ebf0d8; font-family:微軟正黑體,Verdana,Arial,Helvetica,sans-serif; font-size:15px\"\u003e確認已於申請前詳閱並明瞭「\u003c/span\u003e\u003c/span\u003e\u003ca href=\"https://hike.taiwan.gov.tw/en/notice_a4.aspx\" style=\"color: rgb(51, 122, 183); text-transform: none; text-indent: 0px; letter-spacing: normal; font-family: 微軟正黑體, Verdana, Arial, Helvetica, sans-serif; font-size: 15px; font-style: normal; font-weight: normal; text-decoration: none; word-spacing: 0px; white-space: normal; box-sizing: border-box; orphans: 2; widows: 2; background-color: rgb(235, 240, 216); font-variant-ligatures: normal; font-variant-caps: normal; -webkit-text-stroke-width: 0px;\"\u003e\u003cspan style=\"color:#0000ff;\"\u003e \u003c/span\u003e\u003c/a\u003e\u003ca href=\"https://npm.cpami.gov.tw/news_1main.aspx?id=1855\"\u003e\u003cspan style=\"color:#0000ff;\"\u003e\u003cspan style=\"font-family:微軟正黑體,Verdana,Arial,Helvetica,sans-serif; font-size:14px\"\u003e錐麓古道入園收費須知\u003c/span\u003e\u003c/span\u003e\u003c/a\u003e\u003cspan style=\"color:#b22222;\"\u003e\u003cspan style=\"background-color:#ebf0d8; font-family:微軟正黑體,Verdana,Arial,Helvetica,sans-serif; font-size:15px\"\u003e」，\u003c/span\u003e\u003c/span\u003e\u003cspan style=\"color:#ff0000;\"\u003e現場購票與入園查核時間每日\u003c/span\u003e\u003ca href=\"https://npm.cpami.gov.tw/news_1main.aspx?id=3106\"\u003e\u003cspan style=\"color:#0000ff;\"\u003e\u003cu\u003e上午7時~上午10時\u003c/u\u003e\u003c/span\u003e\u003c/a\u003e\u003cspan style=\"color:#ff0000;\"\u003e止\u003c/span\u003e\u003c/strong\u003e\u003cspan style=\"color:#b22222;\"\u003e\u003cstrong\u003e\u003cspan style=\"background-color:#ebf0d8; font-family:微軟正黑體,Verdana,Arial,Helvetica,sans-serif; font-size:15px\"\u003e，並轉知全體隊員。\u003c/span\u003e\u003c/strong\u003e\u003c/span\u003e\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "0",
        "defaultChecked":  false,
        "order":  99
    },
    {
        "id":  "attention-1056",
        "dbId":  1056,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e\u003cspan style=\"color:#ff0000;\"\u003e1.隊伍所有成員於入園前一日皆「非」中央疫情指揮中心所公告居家隔離、居家檢疫及自主健康管理之人員。\u003c/span\u003e\u003cspan style=\"color:#ff0000;\"\u003e(詳見:\u003c/span\u003e\u003cspan style=\"color:#0000ff;\"\u003ehttps://www.cdc.gov.tw\u003c/span\u003e)。\u003c/p\u003e\r\n\r\n\u003cp\u003e\u003cspan style=\"color:#ff0000;\"\u003e2.隊伍所有成員入園前若有發燒、呼吸道不適或嚴重咳嗽者等症狀，即自行取消入園，且領隊已明確告知相關權利義務。\u003c/span\u003e\u003c/p\u003e\r\n\r\n\u003cp\u003e\u003cspan style=\"color:#ff0000;\"\u003e3.隊伍所有成員應加強自主健康管理，進入山屋應使用口罩或足可遮掩口鼻物品，保護自己也尊重他人。入園之後如有疑似相關症狀發生，請盡快下山。\u003c/span\u003e\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003e\u003cspan style=\"color:#b22222;\"\u003e1. None of the group members meets the reporting criteria specified by the Central Epidemic Command Center. (\u003c/span\u003e\u003ca href=\"https://www.cdc.gov.tw/En\"\u003e\u003cspan style=\"color:#b22222;\"\u003ehttps://www.cdc.gov.tw/En\u003c/span\u003e\u003c/a\u003e\u003cspan style=\"color:#b22222;\"\u003e)\u003c/span\u003e\u003c/p\u003e\r\n\r\n\u003cp\u003e\u003cspan style=\"color:#b22222;\"\u003e2. Anyone member who shows symptoms such as fever, shortness of breath, or serious cough before entering the park is required to cancel the individual application.\u003c/span\u003e\u003c/p\u003e\r\n\r\n\u003cp\u003e\u003cspan style=\"color:#b22222;\"\u003e3. All visitors need to pay close attention to the health condition. To protect oneself and respect others, if anyone starts to have signs of cold or flu, this person must wear a mask or other object that can cover the nose and month while inside the cabin.\u003c/span\u003e\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e1. None of the group members comes from Level 1 or Level 2 areas listed by the Central Epidemic Command Center nor travels to China within 14 days.\u003c/p\u003e\r\n\r\n\u003cp\u003e2. Anyone who with symptoms such as fever, shortness of breath, or serious cough is required to cancel the individual application.\u003c/p\u003e\r\n\r\n\u003cp\u003e3. All visitors need to pay close attention to the health condition. If one starts to show the sign of cold or flu, this person must wear a mask or other object that can cover the nose and month while inside the cabin.\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "0",
        "defaultChecked":  false,
        "order":  100
    },
    {
        "id":  "attention-1057",
        "dbId":  1057,
        "orgId":  "105E956F-D8DA-49F7-A9B7-3AEFDDA88A12",
        "name":  "\u003cp\u003e入園申請隊員若具有學生身分或參加學校社團活動，請務必自行通報學校相關單位，作為緊急應變之用。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eIf the applicants for admission have student status or participate in school club activities, you must report to the relevant school unit for emergency response.\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e入学志願者が学生の地位を持っているか、学校のクラブ活動に参加している場合、彼らは緊急対応のために関連する学校単位に報告しなければなりません。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "0",
        "defaultChecked":  false,
        "order":  102
    },
    {
        "id":  "attention-1055",
        "dbId":  1055,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e\u003cspan style=\"color:#ff0000;\"\u003e領隊已明確告知以下相關事項：\u003c/span\u003e\u003cbr /\u003e\r\n\u003cspan style=\"color: rgb(255, 0, 0);\"\u003e1.屬於指揮中心公告之居家隔離、自主健康管理或未符合外出條件之自主防疫人員(詳見:https://www.cdc.gov.tw)，應取消或暫緩申請入園。\u0026nbsp;\u003c/span\u003e\u003cbr /\u003e\r\n\u003cspan style=\"color: rgb(255, 0, 0);\"\u003e2.隊伍所有成員應加強自主健康管理，入園之後如有疑似相關症狀發生，應使用口罩或足可遮掩口鼻物品進入山屋，保護自己也尊重他人。\u003c/span\u003e\u003c/p\u003e\r\n",
        "name_en":  "\u003cp style=\"margin-left:18.0pt;\"\u003e\u003cspan style=\"color:#ff0000;\"\u003eThe group leader has informed all group members that:\u003cbr /\u003e\r\n1. Any member who meets the reporting criteria specified by the Central Epidemic Command Center (\u003c/span\u003e\u003ca href=\"https://www.cdc.gov.tw/En\"\u003e\u003cspan style=\"color:#ff0000;\"\u003ehttps://www.cdc.gov.tw/En\u003c/span\u003e\u003c/a\u003e\u003cspan style=\"color:#ff0000;\"\u003e) must cancel the individual application.\u003cbr /\u003e\r\n2.\u0026nbsp;All visitors need to pay close attention to the health condition. To protect oneself and respect others, if anyone starts to have signs of cold or flu, this person must wear a mask or other object that can cover the nose and month while inside the cabin.\u003c/span\u003e\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e\u003cspan style=\"color:#ff0000;\"\u003eチームリーダーは、次の関連事項を明確に通知しました：\u003c/span\u003e\u003c/p\u003e\r\n\r\n\u003cp\u003e\u003cspan style=\"color:#ff0000;\"\u003e1.チームのメンバーが、中央感染症指揮センター（\u003c/span\u003e\u003ca href=\"https://www.cdc.gov.tw\" target=\"_blank\"\u003e\u003cspan style=\"color:#ff0000;\"\u003ehttps://www.cdc.gov.tw\u003c/span\u003e\u003c/a\u003e\u003cspan style=\"color:#ff0000;\"\u003eを参照）によって発表された「感染確認」場合、入園を自主にキャンセルする必要があります。\u003c/span\u003e\u003c/p\u003e\r\n\r\n\u003cp\u003e\u003cspan style=\"color:#ff0000;\"\u003e2.チーム全員が自主健康管理を強化する必要があり、入園あと、風邪の疑いがある場合は、マスクまた鼻と口を覆って、山屋に入り、自分も相手を守ります。\u003c/span\u003e\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "0",
        "defaultChecked":  false,
        "order":  0
    },
    {
        "id":  "attention-19",
        "dbId":  19,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e確認已於申請前詳閱「\u003ca href=\"http://npm.cpami.gov.tw/news_4main.aspx?ID=1031\" target=\"_blank\"\u003e進入玉山國家公園生態保護區申請案件個人資料運用說明\u003c/a\u003e」，已轉知並取得全體隊員同意使用當事人個人資料辦理入園申請相關事宜。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eI have read and understood the \u0026ldquo;\u003ca href=\"http://npm.cpami.gov.tw/en/news_4main.aspx?ID=1031\" target=\"_blank\"\u003ePersonal Data Gathering and Usage Instruction.\u003c/a\u003e\u0026rdquo; Application agent need to gather all members\u0026#39; necessary personal data under their permission.\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e「\u003ca href=\"http://npm.cpami.gov.tw/jp/news_4main.aspx?ID=1031\" target=\"_blank\"\u003e玉山国立公園生態保護区入園申請の際の個人情報運用についての説明\u003c/a\u003e」チーム全メンバーに伝達し、且つ各個人情報を使って入園申請をすることに同意を得ている。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "0",
        "defaultChecked":  false,
        "order":  1
    },
    {
        "id":  "attention-20",
        "dbId":  20,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e確認已於申請前詳閱並明瞭「\u003ca href=\"https://npm.cpami.gov.tw/notice_1.aspx\" target=\"_blank\"\u003e申請及入園注意事項\u003c/a\u003e」及「\u003ca href=\"https://npm.cpami.gov.tw/notice_2.aspx\" target=\"_blank\"\u003e申辦規定與須知\u003c/a\u003e」，並轉知全體隊員瞭解並遵守入園相關規定。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eI have read and understood the \u0026ldquo;\u003ca href=\"https://npm.cpami.gov.tw/en/notice_1.aspx\" target=\"_blank\"\u003eApplication and Admission Notice\u003c/a\u003e\u0026quot;\u0026nbsp; \u0026amp; \u0026quot;\u0026nbsp;\u003ca href=\"http://Application Regulations and Notices\"\u003eApplication Regulations and Notices\u003c/a\u003e\u0026quot;and informed all team members the regulations of our park.\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e「\u003ca href=\"https://npm.cpami.gov.tw/jp/notice_1.aspx\" target=\"_blank\"\u003e申請及び入園の注意事項\u003c/a\u003e」、「\u003ca href=\"https://npm.cpami.gov.tw/JP/notice_2.aspx\" target=\"_blank\"\u003e申辦規定與須知\u003c/a\u003e」を熟読し、チーム全メンバーに伝達した。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  2
    },
    {
        "id":  "attention-1061",
        "dbId":  1061,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e已詳閱並明瞭「\u003ca href=\"https://npm.cpami.gov.tw/news_4main.aspx?ID=2707\" target=\"_blank\"\u003e登山健行活動防疫自主檢核表\u003c/a\u003e」。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eI have read and understood the「\u003ca href=\"https://npm.cpami.gov.tw/news_4main.aspx?ID=2707\" target=\"_blank\"\u003e登山健行活動防疫自主檢核表\u003c/a\u003e」。\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e「\u003ca href=\"https://npm.cpami.gov.tw/news_4main.aspx?ID=2707\" target=\"_blank\"\u003e登山健行活動防疫自主檢核表\u003c/a\u003e」を熟読し、チーム全メンバーに伝達した。。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  3
    },
    {
        "id":  "attention-7",
        "dbId":  7,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e\u003cstrong\u003e開放路線(一般)之「排雲山莊」、「圓峰山屋/營地」、「庫哈諾辛山屋/營地」\u003c/strong\u003e\u003cstrong\u003e、「瓦拉米山屋/營地」及「玉山線單日往返路線」申請期限：\u003c/strong\u003e\u003cbr /\u003e\r\n\u003cspan style=\"color:#ff0000\"\u003e抽籤前\u003c/span\u003e申請期限：預定入園日前1個月至前2個月間提出申請。\u003cbr /\u003e\r\n\u003cspan style=\"color:#ff0000\"\u003e抽籤後\u003c/span\u003e申請期限：若未超過各宿營地或路線承載量管制員額時，可於預定入園日5天前提出申請，並依入園申請案（須資料完整）到達玉管處並經受理之時間先後進行排序遞補至額滿為止，不受理5日以內之申請。\u003cbr /\u003e\r\n\u003ca href=\"https://npm.cpami.gov.tw/news_4main.aspx?ID=2567\" target=\"_blank\"\u003e申請「排雲山莊」懶人包\u003c/a\u003e\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003e\u003cstrong\u003eApplication deadline for Paiyun Lodge, Yuanfong Cabin/Campground,\u0026nbsp;\u003ca id=\"ContentPlaceHolder1_Repeater_List_name_24\"\u003e\u003cspan style=\"color:#000000;\"\u003eKuhanuosin Cabin / Campground,\u003c/span\u003e\u003c/a\u003e\u003cstrong\u003e \u003c/strong\u003eWalami Cabin/Campground and Yushan Trails Day Hike:\u003c/strong\u003e\u003c/p\u003e\r\n\r\n\u003col\u003e\r\n\t\u003cli\u003eApplications must be submitted at least 1 month prior to the proposed entry date in order to qualify for the lottery draw.\u003c/li\u003e\r\n\t\u003cli\u003eLate applications may be submitted, however they must be submitted at least 5 days before the proposed entry date and will only allow teams to join the standby list. Only those that have completed all required information will be put on the standby list and fill in any vacancies according to chronological order of their last modification.\u003c/li\u003e\r\n\u003c/ol\u003e\r\n\r\n\u003cp\u003e\u003ca href=\"https://npm.cpami.gov.tw/en/news_4main.aspx?ID=2567\" target=\"_blank\"\u003eA brief introduction of how to apply for Paiyun Lodge\u003c/a\u003e\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e\u003cstrong\u003e「排雲山莊」、「圓峰ロッジ/キャンプ場」、「\u003ca id=\"ContentPlaceHolder1_Repeater_List_name_24\"\u003e\u003cspan style=\"color:#000000;\"\u003e庫哈諾辛ロッジ/キャンプ場\u003c/span\u003e\u003c/a\u003e」、\u003c/strong\u003e\u003cstrong\u003e「瓦拉米ロッジ/キャンプ場」、「玉山ルート日帰り」\u003c/strong\u003e\u003cbr /\u003e\r\n宿営地抽選前の申請期限：入園予定日の２ヶ月前から１ヶ月前の午後３時までの期間内に申請してください。\u003cbr /\u003e\r\n宿営地抽選後の申請期限：各宿営地が制限人数に満たない場合は入園予定日5日以上前に申請を提出し、入園申請書（不備のない資料）が当管理所に届くと、受理の先着順にもよりますが、申請が認められる場合があります。入園予定日までの期間が5日以下での申請は認められません。\u003cbr /\u003e\r\n\u003ca href=\"https://npm.cpami.gov.tw/jp/news_4main.aspx?ID=2567\" target=\"_blank\"\u003e玉山国立公園排雲山莊宿泊申請\u003c/a\u003e\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  4
    },
    {
        "id":  "attention-22",
        "dbId":  22,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e開放路線(一般)於預定住宿日前1個月之下午3時至4時（如遇假日後之上班日，則分別於上午9時至10時、中午12時至1時及下午3時至4時）辦理宿營地公開抽籤作業，並暫停參加抽籤之相關申請案線上入園申請及異動功能。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eThe lottery draw is conducted 1 month prior to the lodging date, between 15:00 to 16:00 (postponed to the following workdays at 9:00-10:00, 12:00-13:00, and 15:00-16:00 respectively when encountering weekends/holidays). During this time, any submission or modification of applications related to the lottery will not be allowed.\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e抽選は宿泊日の1ヶ月前、15：00〜16：00（9：00〜10：00,12：00〜13：00、15：00〜16： ：00、週末/祝日に遭遇したとき）。 この期間中、抽選に関連する申請の提出または変更は許可されません。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  5
    },
    {
        "id":  "attention-10",
        "dbId":  10,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e每天07：00至23：00，為系統受理申請案件時間；23：00至隔日07：00暫停受理申請案件，仍可\u003ca href=\"https://npm.cpami.gov.tw/news_4main.aspx?ID=2603\" target=\"_blank\"\u003e儲存草稿\u003c/a\u003e。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eApplications can be submitted between 7:00 and 23:00 daily; applications cannot be submitted between 23:00 to 7:00 the following day, due to system maintenance (but drafts can still be saves).\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e毎日07：00から23：00の間は申請書受付の時間です；23：00から翌日07：00の間はメインテナンスの時間とし、申請の受付はいたしません。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  7
    },
    {
        "id":  "attention-1047",
        "dbId":  1047,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e凡入園申請為多日行程者，若其行程中之一日因受理申請承載量已滿或未中籤者，本處將逕予退件。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eIf you plan to stay in the park for more than one night, we will cancel your application when you do not get the slots for one of the nights, either because the lodge/campsite is full or because the group does not obtain slot(s) from the lottery.\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003eIf you plan to stay in the park for more than one night, we will cancel your application when you do not get the slots for one of the nights, either because the lodge/campsite is full or because the group does not obtain slot(s) from the lottery.\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  8
    },
    {
        "id":  "attention-15",
        "dbId":  15,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e進入山地管制區請依規辦理入山許可證(依國安法規定)。全體隊員已同意本處或代理申請人於核准入園後代為由「臺灣國家公園入園入山線上申請服務網」傳送隊伍及全體隊員之相關資料等，向警政署入山申請系統申請入山許可；且明瞭申請後由入山申請系統依程序核發入山許可。若因資料傳送失敗，將會自行申請入山許可。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eWhen entering the restricted mountain area, Mountain Entry Permit (issued by the National Police Agency) is required (according to the National Security Law.) After hiking team successfully applied for the Park Entry Permit, the team representative applicant is authorized to use the personal information of the whole team to apply for the Mountain Entry Permit at this website (Online Application for Entry Permit Website). The team also understood the process of issuing Mountain Entry Permit. If the Mountain Entry permit data this website sent fails, the team has to apply by themselves.\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e山岳管制区に入るには規則に従って入山許可証の手続きをしてください（国家安全法規定による）。入園許可が下りた後、代理申請人が代表で、「台湾国立公園入山ネット申請サービス」に登山隊メンバー全員の関連資料などをメールで送信し、警政署入山申請系統に対して入山許可の申請を行なうということに登山隊メンバー全員がすでに同意しています；申請がなされた事が確認できましたら、入山申請系統では順次入山許可の承認過程に入っていきます。メールによる資料送付に問題が生じた場合は入山許可の申請は自らで行なってください。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  9
    },
    {
        "id":  "attention-40",
        "dbId":  40,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e「緊急災難處理」\u003c/p\u003e\r\n\r\n\u003col\u003e\r\n\t\u003cli\u003e攜帶登山所須個人及團體裝備(雪季期間攜帶雪地攀登裝備)。\u003c/li\u003e\r\n\t\u003cli\u003e攜帶足夠的通訊及定位(GPS)設備，並定時與留守人員及家人聯絡。\u003c/li\u003e\r\n\t\u003cli\u003e充分瞭解園區之災害與天候資訊，並於行前辦理登山安全講習。\u003c/li\u003e\r\n\t\u003cli\u003e充分瞭解所有隊員身心狀況，並於行前自主訓練登山技能。\u003c/li\u003e\r\n\t\u003cli\u003e行進間以安全第一為原則，並配合國家公園現場人員查核及引導。\u003c/li\u003e\r\n\t\u003cli\u003e辦妥相關保險。\u003c/li\u003e\r\n\u003c/ol\u003e\r\n",
        "name_en":  "\u003cp\u003e[Emergency Plan]\u003c/p\u003e\r\n\r\n\u003col\u003e\r\n\t\u003cli\u003e\r\n\t\u003cp\u003eBring personal and group mountain equipment (snow climbing equipment for snow season)\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003e\r\n\t\u003cp\u003eBring communication gadgets and GPS and update the hiking schedule regularly with family member or emergency contact person.\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003e\r\n\t\u003cp\u003eBe aware of the natural disaster and weather information in the park. Hiking Safety and Environmental Education Guide is required to be read before your entry.\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003e\r\n\t\u003cp\u003eFully understand your members\u0026rsquo; health condition. \u0026nbsp;Self-training of mountain skills is required before your entry.\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003e\r\n\t\u003cp\u003eSafety first is the principle of your hiking. Please cooperate with the park rangers when checking the permit and follow their guidance if needed.\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003e\r\n\t\u003cp\u003eBe sure to buy insurance.\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\u003c/ol\u003e\r\n",
        "name_jp":  "\u003cp\u003e「緊急災害処理」\u003c/p\u003e\r\n\r\n\u003cp\u003e1.個人及び登山隊としての装備（冬季降雪期間に携帯する岩壁登攀装備）の携帯。\u003c/p\u003e\r\n\r\n\u003cp\u003e2.充分な通信やGPSの手段、留守番をしている関係者や家族との定期連絡。\u003c/p\u003e\r\n\r\n\u003cp\u003e3.園内の災害や天候に関する充分な知識、登山前の安全講習。\u003c/p\u003e\r\n\r\n\u003cp\u003e4.登山隊のメンバー全員の健康状態、精神状態の充分な把握、登山前の登山技術訓練の実施。\u003c/p\u003e\r\n\r\n\u003cp\u003e5.登山中は安全第一の原則を心がけ、国立公園の現場スタッフの検査や指導に従う。\u003c/p\u003e\r\n\r\n\u003cp\u003e6.保険への加入。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  31
    },
    {
        "id":  "attention-41",
        "dbId":  41,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e「環境維護」\u003c/p\u003e\r\n\r\n\u003col\u003e\r\n\t\u003cli\u003e遵守進入國家公園生態保護區之相關規定。\u003c/li\u003e\r\n\t\u003cli\u003e充分瞭解無痕山林準則，減輕環境及生態衝擊。\u003c/li\u003e\r\n\t\u003cli\u003e避免影響野生動植物，不留下任何廢棄物及物品。\u003c/li\u003e\r\n\t\u003cli\u003e不離開已開放供使用之步道及區域。\u003c/li\u003e\r\n\t\u003cli\u003e配合國家公園保育巡查及行動，並協助勸導隊員言行舉止。\u003c/li\u003e\r\n\u003c/ol\u003e\r\n",
        "name_en":  "\u003cp\u003e[Environmental Maintenance]\u003c/p\u003e\r\n\r\n\u003col\u003e\r\n\t\u003cli\u003e\r\n\t\u003cp\u003eAll members will obey the regulations of Yushan National Park.\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003e\r\n\t\u003cp\u003eFully understand Leave No Trace guidelines and maintain minimum impact to the environment.\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003e\r\n\t\u003cp\u003eDo not interrupt plants and wildlife and leave no rubbish.\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003e\r\n\t\u003cp\u003eKeep your steps only on trails.\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003e\r\n\t\u003cp\u003e\u0026nbsp;Coordinate with the national parks patrol volunteers\u0026rsquo; conservation action, and help persuade members or climbers on their behaviors.\u0026nbsp;\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\u003c/ol\u003e\r\n",
        "name_jp":  "\u003cp\u003e「環境保護」\u003c/p\u003e\r\n\r\n\u003cp\u003e1.国立公園生態保護区のあらゆる規定を厳守し、入園する。\u003c/p\u003e\r\n\r\n\u003cp\u003e2.山林を汚さない、傷つけないという鉄則を充分理解し、環境や生態への刺激を避ける。\u003c/p\u003e\r\n\r\n\u003cp\u003e3.野生の動植物への影響を避ける為、ごみや物を残さない。\u003c/p\u003e\r\n\r\n\u003cp\u003e4.使用できるものとして開放している歩道や区域から外れない。\u003c/p\u003e\r\n\r\n\u003cp\u003e5.国立公園内の保護巡回や活動に協力し、森林パトロール員の指導に従う。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  32
    },
    {
        "id":  "attention-17",
        "dbId":  17,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e外籍人士提前申請玉山主峰線住宿「排雲山莊」保留名額說明網址：\u003cbr /\u003e\r\n107年01月01日起之申請案：\u003ca href=\"https://npm.cpami.gov.tw/news_4main.aspx?ID=2602\" target=\"_blank\"\u003ehttps://npm.cpami.gov.tw/news_4main.aspx?ID=2602\u003c/a\u003e。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003e\u003ca href=\"http://npm.cpami.gov.tw/en/news_4main.aspx?ID=1397\" id=\"ContentPlaceHolder1_New_List_hlTitle_0\" style=\"box-sizing: border-box; color: rgb(17, 17, 17); text-decoration: none; font-family: Georgia, \u0027Times New Roman\u0027, Times, serif; font-size: 13.5px; line-height: 19.2857px; text-align: center;\" title=\"How do foreign visitors apply for quoted spaces at Paiyun Lodge when hiking the Yushan Main Peak Route?\"\u003eHow do foreign visitors apply for quoted spaces at Paiyun Lodge when hiking the Yushan Main Peak Route?\u003c/a\u003e\u0026nbsp;\u0026nbsp;\u0026nbsp;Please visit:\u0026nbsp;\u003ca href=\"https://npm.cpami.gov.tw/en/news_4main.aspx?ID=2602\" target=\"_blank\"\u003ehttps://npm.cpami.gov.tw/en/news_4main.aspx?ID=2602\u003c/a\u003e\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e外国籍の方の玉山主峰ルート「排雲山荘」での宿泊に於ける先行申請\u0026nbsp;\u0026nbsp;\u0026nbsp; 、予約説明に関するホームページ：\u003ca href=\"https://npm.cpami.gov.tw/jp/news_4main.aspx?ID=2602\" target=\"_blank\"\u003ehttps://npm.cpami.gov.tw/jp/news_4main.aspx?ID=2602\u003c/a\u003e。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  70
    },
    {
        "id":  "attention-9",
        "dbId":  9,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e外國人住宿「排雲山莊」提前申請期限：預定入園日期前35天至前4個月間提出申請，於非假日（週日至週四）每日原則提供24個名額（每10個外國人另搭配2名本國人之比例原則）。請以英、日語版網頁提出申請，提前申請網址及登山路線：\u003c/p\u003e\r\n\r\n\u003cp\u003e(一)\u0026nbsp; 英文網頁： https://npm.cpami.gov.tw/en/index.aspx\u003cbr /\u003e\r\nOnline Application \u0026gt;\u0026gt; Apply for Park Permit\u003cbr /\u003e\r\n\u0026gt;\u0026gt; Paiyun Lodge Advanced Application\u003cbr /\u003e\r\n2 Days(Tataka - Yushan Hiking Route -Tataka )(Paiyun Lodge Advanced Application)\u003c/p\u003e\r\n\r\n\u003cp\u003e(二)日文網頁：https://npm.cpami.gov.tw/jp/index.aspx\u003cbr /\u003e\r\n入園の申請 \u0026gt;\u0026gt; オンライン入園申請\u003cbr /\u003e\r\n\u0026gt;\u0026gt; 排雲山荘の先行申請\u003cbr /\u003e\r\n2天(塔塔加 - 玉山主峰 - 塔塔加)(排雲山荘の先行申請)\u003c/p\u003e\r\n\r\n\u003cp\u003e(三) 若選擇「Standard Application」或「一般申請」恕無法列入外籍保留審查名單，請重新申請。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eTo assist foreign visitors in confirming traveling details more timely when hiking the Yushan Main Peak Route, 24 spaces are reserved at Paiyun Lodge on non-weekend days (Sunday \u0026ndash; Thursday) for foreign visitors.\u003c/p\u003e\r\n\r\n\u003cp\u003eApplication Dates: 35 days \u0026ndash; 4 months before the entry date\u003c/p\u003e\r\n\r\n\u003cp\u003eForeign Advanced Application Links and Eligible Route: Yushan Main Peak 2-day Route only\u003c/p\u003e\r\n\r\n\u003cp\u003eEnglish:\u0026nbsp;\u003ca href=\"https://npm.cpami.gov.tw/en/index.aspx\"\u003ehttps://npm.cpami.gov.tw/en/index.aspx\u003c/a\u003e\u003cbr /\u003e\r\nOnline Application \u0026gt;\u0026gt; Apply for Park Permit\u003cbr /\u003e\r\n\u0026gt;\u0026gt; Paiyun Lodge Advanced Application\u003cbr /\u003e\r\nJapanese:\u0026nbsp;\u003ca href=\"https://npm.cpami.gov.tw/jp/index.aspx\"\u003ehttps://npm.cpami.gov.tw/jp/index.aspx\u003c/a\u003e\u003cbr /\u003e\r\n入園の申請 \u0026gt;\u0026gt; オンライン入園申請\u003cbr /\u003e\r\n\u0026gt;\u0026gt; 排雲山荘の先行申請\u003c/p\u003e\r\n\r\n\u003cp\u003eIf you choose the \u0026ldquo;Standard Application/一般申請\u0026rdquo; your application will not be included in the waiting list of the spaces reserved exclusively for foreign visitors.\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e外国の方の為に玉山主峰の行程を迅速に確認し、休日を除く毎日（日曜日から木曜日）、１日につき24名分の外国籍の方の為の定員を設け、予約できるようにしています。入園予定日より４ヶ月から３５日前までの期間に申請してください。\u003c/p\u003e\r\n\r\n\u003cp\u003e先行申請ホームページと先行申請登山ルート：玉山主峰ルートの2日間の行程。\u003c/p\u003e\r\n\r\n\u003cp\u003e\u0026nbsp;(一) 英語のホームページ：\u003ca href=\"https://npm.cpami.gov.tw/en/index.aspx\"\u003ehttps://npm.cpami.gov.tw/en/index.aspx\u003c/a\u003e\u003cbr /\u003e\r\nOnline Application \u0026gt;\u0026gt; Apply for Park Permit\u003cbr /\u003e\r\n\u0026gt;\u0026gt; Paiyun Lodge Advanced Application\u003c/p\u003e\r\n\r\n\u003cp\u003e\u0026nbsp;(二) 日本語のホームページ：\u003ca href=\"https://npm.cpami.gov.tw/jp/index.aspx\"\u003ehttps://npm.cpami.gov.tw/jp/index.aspx\u003c/a\u003e\u003cbr /\u003e\r\n入園の申請 \u0026gt;\u0026gt; オンライン入園申請\u003cbr /\u003e\r\n\u0026gt;\u0026gt; 排雲山荘の先行申請\u003c/p\u003e\r\n\r\n\u003cp\u003e(三) 「Standard Application /一般申請」を選択すると、外国人観光客専用のスペースの待機リストには含まれません。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  71
    },
    {
        "id":  "attention-21",
        "dbId":  21,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e颱風警報發佈、森林火災或其他突發事件時，管理處得另行發佈緊急措施禁止人員進入，已核發之入園許可證，於該期間應予以廢止，並請依規申請退費。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eWhen typhoon warning, forest fires or other emergency events are issued, our headquarters shall promulgate the prohibition of entering the park, and the issued park entry permit will be invalid. Refund for Paiyun Lodge is possible.\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e台風警報の発令、森林火災やその他の突発事件の場合は　管理所は緊急措置として、入園禁止を発令します。お手持ちの入園許可証は取り消されます。排雲山荘の宿泊費は払い戻されるので申請してください。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  81
    },
    {
        "id":  "attention-1046",
        "dbId":  1046,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e雪季管制措施實施期間(依本處公告為準，預估為每年12月中旬至隔年3月間)，仍受理具雪地經驗並備妥雪攀裝備之隊伍申請；但未能符合規定隊伍，已核發之入園許可證，於該期間應予以廢止，並請依規申請退費。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eWhen Yushan National Park issued a snow control (usually take place in December, January, February and March), visitors need to be equipped with ice axes, crampons, and helmets (and familiar with using them), all visitors are required to have experience of snow climbing (a photo is accepted as proof). If not, the permit is invalid.\u0026nbsp;\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003eWhen Yushan National Park issued a snow control (usually take place in December, January, February and March), visitors need to be equipped with ice axes, crampons, and helmets (and familiar with using them), all visitors are required to have experience of snow climbing (a photo is accepted as proof). If not, the permit is invalid.\u0026nbsp;\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  82
    },
    {
        "id":  "attention-1033",
        "dbId":  1033,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e請從事登山活動者應主動自行評估自身經驗、裝備、技術能力、體能、天候情況及確認活動所帶來之風險，且應承擔自身安全責任。又因山區步道易受天然環境影響，造成無法預期之災損或阻斷，請登山民眾遇有通行安全疑慮時，切勿強行通過以維自身安全，並歡迎提供相關路況資訊，嘉惠山友。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eHikers are expected to actively evaluate the experience, equipment, capability, physical fitness and weather condition, be aware of all potential risks from this activity, and be responsible for your own safety. Trails in the mountains are prone to be affected by the environment, causing unexpected damage or blockage. For your own safety, it is not suggested to attempt to pass certain sections of the trail when you have safety concerns. It will be appreciated to provide the trail condition updates, which will benefit other hikers as well.\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e登山活動の参加者は自らの経験、装備、技術能力、体力、天気条件と活動のリスクを確認し、自分自身の行動に責任を持つことです。登山道は自然環境のため、予期できない破壊や交通遮断する場合もありますので、安全面の懸念がある際に、無理に渡らないでください。また道路状況の情報は他の登山者に役に立つので、ご提供お願い申し上げます。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  83
    },
    {
        "id":  "attention-27",
        "dbId":  27,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e\u003cstrong\u003e請申請人瞭解所填具之隊員資料與行程計畫等，\u003cspan style=\"color:#ff0000;\"\u003e如明知為不實或冒用他人資料填載入園申請之事項，將渉犯刑法第210條偽造文書罪嫌，\u003c/span\u003e或刑法第214條使公務員登載不實罪嫌，本處將依法先予以退件處理，並立即將申請人停權處分，另將涉案相關資料向司法機關依法告發。\u003c/strong\u003e\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003e\u003cstrong\u003eThe applicant shall be aware of the truthfulness of their team members\u0026rsquo; information and the itinerary plan. In case that they fill in the data for the Park entry application under the circumstance where they already knew the information was misrepresented or have fraudulently used the name of others, they shall be suspected of committing forgery under Article 210 of the Criminal Code or the crime of making a civil servant conduct untrue recordkeeping under Article 214 of the Criminal Code. If the offense is proved true, the Park will reject the application according to law in the first instance, followed by suspending the applicant\u0026rsquo;s rights and reporting such criminal conduct to the juridical competent authorities by providing relevant information.\u003c/strong\u003e\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e\u003cstrong\u003e申請者は記入する隊員の情報と登山計画などを理解していなければならず、入園申請事項に虚偽の内容や他人の情報を不正使用して記入した場合、刑法第210条の文書偽造の罪、または刑法第214条の公務員に虚偽を記載させた罪に問われ、調査によって事実であることが証明された場合、本園は法に基づいて申請を取り消し、直ちに申請者に権利停止の処分を与えます。また、関連資料を司法機関に提出して当該犯罪行為を告発します。\u003c/strong\u003e\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  90
    },
    {
        "id":  "attention-1060",
        "dbId":  1060,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e\u003cspan style=\"color:#ff0000;\"\u003e\u003cstrong\u003e入園期間應攜帶入園許可證及身分證明文件正本俾利查核\u003c/strong\u003e\u003c/span\u003e\u003cstrong\u003e，未攜帶身分證明文件或所攜帶身分證明文件與入園許可證名冊不符者，禁止其入園。已入園者得令其離園。不聽制止或未依前段規定入園者，得依國家公園法第 19條規定處罰。\u0026nbsp;\u003c/strong\u003e\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003e\u0026nbsp;It\u0026rsquo;s required to bring the park permit and valid ID for verification during the hike. Visitors who don\u0026rsquo;t have a valid ID or whose ID is not identical with the one registered on the park permit cannot enter the park. If the visitor has entered the park, we reserve the right to ask the visitor to leave the park. Those who refuse to follow the rules or refuse to leave the park violate the 19th article of National Park Law and may be subject to penalty.\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u0026nbsp;\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e入園期間應攜帶入園許可證及身分證明文件正本俾利查核，未攜帶身分證明文件或所攜帶身分證明文件與入園許可證名冊不符者，禁止其入園。已入園者得令其離園。不聽制止或未依前段規定入園者，得依國家公園法第 19條規定處罰。\u0026nbsp;\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "0",
        "defaultChecked":  false,
        "order":  91
    },
    {
        "id":  "attention-1058",
        "dbId":  1058,
        "orgId":  "C951CDCD-B75A-46B9-8002-8EF952EC95FD",
        "name":  "\u003cp\u003e入園申請隊員若具有學生身分或參加學校社團活動，請務必自行通報學校相關單位，作為緊急應變之用。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eIf the applicants for admission have student status or participate in school club activities, you must report to the relevant school unit for emergency response.\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e入学志願者が学生の地位を持っているか、学校のクラブ活動に参加している場合、彼らは緊急対応のために関連する学校単位に報告しなければなりません。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "0",
        "defaultChecked":  false,
        "order":  100
    },
    {
        "id":  "attention-1062",
        "dbId":  1062,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "\u003cp\u003e領隊已明確告知以下相關事項：\u003c/p\u003e\r\n\r\n\u003cp\u003e1.屬於指揮中心公告之居家隔離、自主健康管理或未符合外出條件之自主防疫人員(詳見:https://www.cdc.gov.tw)，應取消或暫緩申請入園。\u0026nbsp;\u003cbr /\u003e\r\n2.隊伍所有成員應加強自主健康管理，入園之後如有疑似相關症狀發生，應使用口罩或足可遮掩口鼻物品進入山屋，保護自己也尊重他人。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eThe group leader has informed all group members that:\u003c/p\u003e\r\n\r\n\u003cp\u003e1. Any member who meets the reporting criteria specified by the Central Epidemic Command Center (https://www.cdc.gov.tw/En) must cancel the individual application.\u003cbr /\u003e\r\n2. All visitors need to pay close attention to the health condition. To protect oneself and respect others, if anyone starts to have signs of cold or flu, this person must wear a mask or other object that can cover the nose and month while inside the cabin.\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003eチームリーダーは、次の関連事項を明確に通知しました：\u003c/p\u003e\r\n\r\n\u003cp\u003e1.チームのメンバーが、中央感染症指揮センター（https://www.cdc.gov.twを参照）によって発表された「感染確認」場合、入園を自主にキャンセルする必要があります。\u003c/p\u003e\r\n\r\n\u003cp\u003e2. チーム全員が自主健康管理を強化する必要があり、入園あと、風邪の疑いがある場合は、マスクまた鼻と口を覆って、山屋に入り、自分も相手を守ります。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "0",
        "defaultChecked":  false,
        "order":  0
    },
    {
        "id":  "attention-28",
        "dbId":  28,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "\u003cp\u003e確認已轉知並取得全體隊員同意使用當事人個人資料辦理入園申請相關事宜。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eApplication agent need to gather all members\u0026#39; necessary personal data under their permission.\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e「\u003ca href=\"http://npm.cpami.gov.tw/jp/news_4main.aspx?ID=1545\" target=\"_blank\"\u003e雪霸国立公園生態保護区の申請に於ける個人情報の運用についての説明\u003c/a\u003e」チーム全メンバーに伝達し、且つ各個人情報を使って入園申請をすることに同意を得ている。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  1
    },
    {
        "id":  "attention-1028",
        "dbId":  1028,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "\u003cp\u003e\u003cspan style=\"color:#ff0000;\"\u003e申請人應瞭解並填具所有正確的隊員資料與行程計畫。如明知為不實或冒用他人資料填載入園申請之事項，已構成刑法第 210 條偽造文書罪嫌，或構成刑法第 214 條使公務員登載不實罪嫌，如查證屬實，本處將依法先予以退件處理，另配合司法機關調查提供相關申請資料。\u003c/span\u003e\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003e\u003cspan style=\"color:#ff0000;\"\u003eThe applicant is to be fully aware of, and shall fill in, all particulars of the members and route plan correctly. Intentionally filling in incorrect particulars or maliciously using another person\u0026rsquo;s particulars when applying for park entry is an offence of forgery as stipulated in Article 210 of the Criminal Code or violation of Article 214 of the same Code by causing a public official to make a false entry in a public document. If verified to be true, the Park Administration shall reject the application according to the law, and cooperate with the judicial investigation by providing the relevant application information.\u003c/span\u003e\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e\u003cspan style=\"color:#ff0000\"\u003e申請者は記入する隊員の情報と登山計画などを理解していなければならず、入園申請事項に虚偽の内容や他人の情報を不正使用して記入した場合、刑法第210条の文書偽造の罪、または刑法第214条の公務員に虚偽を記載させた罪に問われ、調査によって事実であることが証明された場合、本園は法に基づいて申請を取り消し、直ちに申請者に権利停止の処分を与えます。また、関連資料を司法機関に提出して当該犯罪行為を告発します。\u003c/span\u003e\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "0",
        "defaultChecked":  false,
        "order":  1
    },
    {
        "id":  "attention-29",
        "dbId":  29,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "\u003cp\u003e領隊需為成年人，並能承擔整體登山隊伍安危，請領隊務必轉知每位隊員了解本園\u003ca href=\"https://npm.cpami.gov.tw/news_3.aspx?unit=e6dd4652-2d37-4346-8f5d-6e538353e0c2\"\u003e生態保護區申辦入園注意事項\u003c/a\u003e，並於登山時遵守國家公園規定及隨時注意自身安全(夜間 請盡量不要登山)，並攜帶 GPS 及可供緊急連絡之通訊設備，以避免意外發生。領隊對於生態保護區之規定，負有督導與保證之責任。\u003cspan style=\"color:#0000ff\"\u003e領隊未到之隊伍禁止入園。\u003c/span\u003e\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eTeam leaders shall be adults aged 18 or above, and capable of maintaining the climbing team\u0026rsquo;s safety. They must make every team member aware of the precautions regarding entering and exiting the ecological protection area, as well as the importance of abiding by the National Park\u0026rsquo;s regulations and taking heed of their own safety (try to avoid climbing at night). Also, GPS and emergency communications equipment shall be carried during mountain climbing to avoid accidents. Team leaders are responsible for supervising their team members and guaranteeing the safety of the team members according to the ecological protection area\u0026rsquo;s regulations.\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e領隊需為成年人，並能承擔整體登山隊伍安危，請領隊務必轉知每位隊員了解入出生態保護區注意事項，並於登山時遵守國家公園規定及隨時注意自身安全(夜間 請盡量不要登山)，並攜帶 GPS 及可供緊急連絡之通訊設備，以避免意外發生。領隊對於生態保護區之規定，負有督導與保證之責任。\u003cspan style=\"color:#0000ff\"\u003e領隊未到之隊伍禁止入園。\u003c/span\u003e\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  2
    },
    {
        "id":  "attention-30",
        "dbId":  30,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "\u003cp\u003e颱風警報發布、森林火災或其他突發事件時，本處得另行發布緊急措施禁止人員進入，已核發之入園許可證自動廢止。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eWhen typhoon warning, forest fires or other emergency events are issued, our headquarters shall promulgate the prohibition of entering the park, and the issued park entry permit will be invalid.\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e台風警報の発令、森林火災やその他の突発事件の場合は　管理所は緊急措置として、入園禁止を発令します。お手持ちの入園許可証は取り消されます。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  3
    },
    {
        "id":  "attention-31",
        "dbId":  31,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "\u003cp\u003e入園日前 5 日至入園日前 2 個月每日 07:00-23:00 提出，申請日期須在可申請日期範圍內才接受申請，逾期恕不受理。例如申請 11/1~11/3 行程，則該行程於 9/1 07:00 起開始受理申請，至 10/27 23:00 止停止受理申請；申請 4/29 行程，最早可申請時間為 2/29，如當年度無 2/29，則與 4/30、5/1 入園之行程相同，最早可於\u0026nbsp;3/1\u0026nbsp;07:00 提出申請。\u003cstrong\u003e\u003cspan style=\"color:#ff0000;\"\u003e住宿九九山莊需事先繳費，考量線上金流作業時間，如遇假日或連假請民眾提早申請(扣除假日應於5日前辦理)，無法配合線上繳費者即無法取得入園許可證。\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eApplications shall be submitted from 07:00 to 23:00 within 5 days to two months prior to the Park entry. All of the itinerary dates applied for shall fall within the period of time calculated from the application date. Late applications will not be accepted.\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e入園の5日前から2カ月以内の毎日07:00～23:00に申請を提出できます。申請するすべての日程がこの範圍内である場合のみ申請可能となります。期間を過ぎている場合、申請は受け付けられません。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  4
    },
    {
        "id":  "attention-32",
        "dbId":  32,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "\u003cp\u003e全天候可上線填寫資料並「儲存草稿」，所儲存草稿可利用系統資料線上異動-草稿查詢功能帶出上次所儲存資料並修改，在系統開放申請的時間 (7:00-23:00間) 才可送件。草稿可保留30日，但下次透過資料線上異動開啟時，若原先選擇之日期或路線有關閉或名額不足之情形時，系統將清除所有草稿內的資料而需重新填寫相關資料。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eDrafts can be reserved for seven days. Data changes can be made through the online system, in which draft data saved from the previous session can be retrieved from the data online change \u0026ndash; \u0026ldquo;Edit your Drafts\u0026rdquo; function on the system for revision, and the changes shall be submitted during times (between 7:00 \u0026ndash; 23:00) when the system is open for applications.\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e下書きは7日間保存可能。オンライン情報変更-下書き検索機能で前回保存した下書きの情報の表示と修正が可能。申請が開放されている時間(7:00-23:00)のみ提出可能。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  5
    },
    {
        "id":  "attention-34",
        "dbId":  34,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "\u003cp\u003e 「緊急災難處理」\u003c/p\u003e\r\n\u003cp\u003e1.攜帶登山所須個人及團體裝備(雪季期間攜帶雪地攀登裝備)。\u003c/p\u003e\r\n\u003cp\u003e2.攜帶足夠的通訊及定位(GPS)設備，並定時與留守人員及家人聯絡。\u003c/p\u003e\r\n\u003cp\u003e3.充分瞭解園區之災害與天候資訊，並於行前辦理登山安全講習。\u003c/p\u003e\r\n\u003cp\u003e4.充分瞭解所有隊員身心狀況，並於行前自主訓練登山技能。\u003c/p\u003e\r\n\u003cp\u003e5.行進間以安全第一為原則，並配合國家公園現場人員查核及引導。\u003c/p\u003e\r\n\u003cp\u003e6.辦妥相關保險。\u003c/p\u003e",
        "name_en":  "\u003cp\u003e\r\n\t[Emergency Plan]\u003c/p\u003e\r\n\u003col\u003e\r\n\t\u003cli\u003e\r\n\t\t\u003cp\u003e\r\n\t\t\tBring personal and group mountain equipment (snow climbing equipment for snow season)\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003e\r\n\t\t\u003cp\u003e\r\n\t\t\tBring communication gadgets and GPS and update the hiking schedule regularly with family member or emergency contact person.\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003e\r\n\t\t\u003cp\u003e\r\n\t\t\tBe aware of the natural disaster and weather information in the park. Hiking Safety and Environmental Education Guide is required to be read before your entry.\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003e\r\n\t\t\u003cp\u003e\r\n\t\t\tFully understand your members\u0026rsquo; health condition. \u0026nbsp;Self-training of mountain skills is required before your entry.\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003e\r\n\t\t\u003cp\u003e\r\n\t\t\tSafety first is the principle of your hiking. Please cooperate with the park rangers when checking the permit and follow their guidance if needed.\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003e\r\n\t\t\u003cp\u003e\r\n\t\t\tBe sure to buy insurance.\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\u003c/ol\u003e\r\n",
        "name_jp":  "「緊急災難處理」\r\n1.攜帶登山所須個人及團體裝備(雪季期間攜帶雪地攀登裝備)。\r\n2.攜帶足夠的通訊及定位(GPS)設備，並定時與留守人員及家人聯絡。\r\n3.充分瞭解園區之災害與天候資訊，並於行前辦理登山安全講習。\r\n4.充分瞭解所有隊員身心狀況，並於行前自主訓練登山技能。\r\n5.行進間以安全第一為原則，並配合國家公園現場人員查核及引導。\r\n6.辦妥相關保險。",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  7
    },
    {
        "id":  "attention-35",
        "dbId":  35,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "\u003cp\u003e\r\n\t「環境維護」\u003c/p\u003e\r\n\u003cp\u003e\r\n\t1.遵守進入國家公園生態保護區之相關規定。\u003c/p\u003e\r\n\u003cp\u003e\r\n\t2.充分瞭解無痕山林準則，減輕環境及生態衝擊。\u003c/p\u003e\r\n\u003cp\u003e\r\n\t3.避免影響野生動植物，不留下任何廢棄物及物品。\u003c/p\u003e\r\n\u003cp\u003e\r\n\t4.不離開已開放供使用之步道及區域。\u003c/p\u003e\r\n\u003cp\u003e\r\n\t5.配合國家公園保育巡查及行動，並協助勸導隊員言行舉止。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003e\r\n\t[Environmental Maintenance]\u003c/p\u003e\r\n\u003col\u003e\r\n\t\u003cli\u003e\r\n\t\t\u003cp\u003e\r\n\t\t\tAll members will obey the regulations of Shei-Pa National Park.\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003e\r\n\t\t\u003cp\u003e\r\n\t\t\tFully understand Leave No Trace guidelines and maintain minimum impact to the environment.\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003e\r\n\t\t\u003cp\u003e\r\n\t\t\tDo not interrupt plants and wildlife and leave no rubbish.\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003e\r\n\t\t\u003cp\u003e\r\n\t\t\tKeep your steps only on trails.\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\t\u003cli\u003e\r\n\t\t\u003cp\u003e\r\n\t\t\t\u0026nbsp;Coordinate with the national parks patrol volunteers\u0026rsquo; conservation action, and help persuade members or climbers on their behaviors.\u0026nbsp;\u003c/p\u003e\r\n\t\u003c/li\u003e\r\n\u003c/ol\u003e\r\n",
        "name_jp":  "\u003cp\u003e\r\n\t「環境維護」 1.遵守進入國家公園生態保護區之相關規定。 2.充分瞭解無痕山林準則，減輕環境及生態衝擊。 3.避免影響野生動植物，不留下任何廢棄物及物品。 4.不離開已開放供使用之步道及區域。 5.配合國家公園保育巡查及行動，並協助勸導隊員言行舉止。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  8
    },
    {
        "id":  "attention-1043",
        "dbId":  1043,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "\u003cp\u003e山友規劃進行高海拔登山活動時，可先至家庭醫學科或旅遊醫學科，透過正常合法管道，由專業醫師預開高山症處方箋，預防性投藥，減緩高山病症狀。提醒山友須衡量自身健康及體能狀況，切勿勉強登山，以免發生狀況。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eBefore attempting any climb in the high-altitude area in Taiwan, it is recommened that hikers contact your family doctor for the preventative medications of\u0026nbsp;altitude sickness.\u0026nbsp;\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e\u003cspan style=\"color:#0000ff\"\u003eBefore attempting any climb in the high-altitude area in Taiwan, it is recommened that hikers contact your family doctor for the preventative medications of\u0026nbsp;altitude sickness.\u0026nbsp;\u003c/span\u003e\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "1",
        "defaultChecked":  true,
        "order":  9
    },
    {
        "id":  "attention-1053",
        "dbId":  1053,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "\u003cp\u003e進入原住民族傳統領域須知：\u003c/p\u003e\r\n\r\n\u003cp\u003e1.請充分認知本園區多為泰雅族及賽夏族眾社群之傳統領域。\u003c/p\u003e\r\n\r\n\u003cp\u003e2.請各登山隊伍友善對待高山協作員，彼此互相尊重，建議各登山隊伍進入本園區時，自主聘請本園區周邊部落之在地原住民族人擔任隨隊嚮導，協助各登山隊伍理解並認知泰雅族及賽夏族千年來與大山共生的態度與智慧，以實踐本園與在地原住民族之夥伴關係。\u003c/p\u003e\r\n\r\n\u003cp\u003e3.本處期許各登山隊伍進入本園區，如遇在地原住民族人進行傳統文化教育活動時，能以欣賞並尊重的態度駐足參與或對話，給予在地族人努力於文化傳承與保存最大的支持與鼓勵。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eEntering the traditional field of indigenous peoples should face the traditional culture with respect.\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e\u0026nbsp;\u003c/p\u003e\r\n\r\n\u003cp\u003eEntering the traditional field of indigenous peoples should face the traditional culture with respect.\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "0",
        "defaultChecked":  false,
        "order":  9
    },
    {
        "id":  "attention-1051",
        "dbId":  1051,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "\u003cp\u003e欲申請雪山西稜線之隊伍，請於申請前詳閱\u003ca href=\"https://drive.google.com/file/d/1yIp9F8NAZBJ3XKlx-_Dn4GtC0jZglEuA/view?usp=sharing\"\u003e230林道注意事項\u003c/a\u003e。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eTo apply for the team of the West Xue Trail, please read \u003ca href=\"https://drive.google.com/file/d/1yIp9F8NAZBJ3XKlx-_Dn4GtC0jZglEuA/view?usp=sharing\"\u003ethe notes on 230 Forest Road\u003c/a\u003e before applying.\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003eTo apply for the team of the West Xue Trail, please read \u003ca href=\"https://drive.google.com/file/d/1yIp9F8NAZBJ3XKlx-_Dn4GtC0jZglEuA/view?usp=sharing\"\u003ethe notes on 230 Forest Road\u003c/a\u003e before applying.\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "0",
        "defaultChecked":  false,
        "order":  10
    },
    {
        "id":  "attention-1059",
        "dbId":  1059,
        "orgId":  "E6DD4652-2D37-4346-8F5D-6E538353E0C2",
        "name":  "\u003cp\u003e入園申請隊員若具有學生身分或參加學校社團活動，請務必自行通報學校相關單位，作為緊急應變之用。\u003c/p\u003e\r\n",
        "name_en":  "\u003cp\u003eIf the applicants for admission have student status or participate in school club activities, you must report to the relevant school unit for emergency response.\u003c/p\u003e\r\n",
        "name_jp":  "\u003cp\u003e入学志願者が学生の地位を持っているか、学校のクラブ活動に参加している場合、彼らは緊急対応のために関連する学校単位に報告しなければなりません。\u003c/p\u003e\r\n",
        "chk":  "1",
        "selectchk":  "0",
        "defaultChecked":  false,
        "order":  15
    }
];

const CONSENT_BY_ORG = ATTENTION_ITEMS.reduce((map, item) => {
  if (!map[item.orgId]) map[item.orgId] = [];
  map[item.orgId].push(item);
  return map;
}, {});

Object.assign(window, { PARK_LIST, PARK_BY_UNIT, PARK_BY_ORG_ID, ATTENTION_ITEMS, CONSENT_BY_ORG });
