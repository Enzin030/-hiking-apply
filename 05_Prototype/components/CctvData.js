/* ============================================================
   CctvData.js — 即時影像觀看（information_4）的景點資料
   ------------------------------------------------------------
   內容來源：正式站 https://hike.taiwan.gov.tw/information_4.aspx（2026-09-14 逐字擷取）
   ——攝影機架設地點、景點介紹（中英文）、資料來源皆照原文，僅正規化連續空白。

   舊站 DOM 有 8 個頁籤，其中武陵、水里、塔塔加、梅山四個以 `display:none`
   隱藏，前台實際只呈現 4 個景點（見 02_Spec/27 內部註記），本檔只收那 4 個。

   location — 正式站原字串（機關-地點），逐字照搬不切分

   type — "youtube"：YouTube 直播 iframe 嵌入（觀霧、雪見）
          "mjpg"   ：網路攝影機 MJPEG 串流，以 <img> 直連（南安、排雲）
                     2026-09-14 實測兩個位址皆回 200、
                     Content-Type: multipart/x-mixed-replace，可直接顯示。
   ============================================================ */

window.CCTV_SPOTS = [
  {
    key: "guanwu",
    label: "觀霧遊客中心",
    type: "youtube",
    src: "https://www.youtube.com/embed/Isp6RQiuxNo?si=xp07Dij0WYwoNlt3",
    location: "雪霸國家公園-觀霧遊客中心(觀霧山椒魚生態中心)",
    intro: [
      "觀霧遊憩區位於海拔2,000公尺的高山，除了是觀賞雲霧變化的最佳地點外，霧林帶的生態特色，同時蘊含有多樣珍貴稀有的動植物，像是檜木、台灣檫樹、棣慕華鳳仙花、寬尾鳳蝶等，還有近幾年才發現命名的冰河時期孑遺物種-觀霧山椒魚。",
      "屬於兩棲類的觀霧山椒魚，需要生活在潮濕近水域的地區，目前僅在台灣中北部山區零星發現。自1996年第一次在觀霧發現後，雪霸國家公園即針對觀霧山椒魚的生態進行調查及棲地復育工作，並且在2012年4月21日成立國內第一座以山椒魚為主題的生態中心。",
      "遊客中心還備有出版品展售要紀念戳章及簡易餐飲區，生態中心設有主題展示區、山椒魚生態意象廣場、生態影像區及環境教育園區，結合雲霧步道，將觀霧山椒魚的型態、生活史、分布狀況、面臨的危機以及國家公園進行棲地復育工作現況完整呈現，提供民眾瞭解觀霧山椒魚生態以及感受全球氣候變遷影響的環境教育場所。",
      "The 2,000-meter-high Guanwu Recreation Area is shrouded in the cloud and mists all the year round. Here is typical medium-and high-altitude mountain climate in northern Taiwan, with an annual mean temperature of 15˚C. Here is also the home of many rare and valuable species, like the Broad-tailed Swallowtail Butterfly, Guanwu Salamander, Taiwan Sassafras, Taiwan Red Cypress, and Devol’s Balsamine. There are 4 main trails in this area, including the Yunwu Trail (Yulun Trail), Kuaishan Big Trees Trail, Guanwu Waterfall Trail and Jhenshan Trail.Visitors can take the National Highway No.3, exit by Zhulin Intersection, take the Hsinchu County Highway No.122 at Dongfong Road of Chudong Township, drive forward to Qingquan of Wufeng Township, take the Dalu Forest Road at Tuchang, and drive straight to Guanwu. Also, by taking the National Highway No.1, exiting at Hsinchu Gongdaowu exit, then taking the Provincial highway 68 (east-west Expressway) you can reach Zhudong quickly, then change to county highway 122.Moreover, Dalu Forest Road, about 3-4 meters wide, is only suitable for medium sized buses and smaller vehicles. Because Hsinchu Bus only drives to Qingquan, visitors are suggested to drive their own cars. Those without vehicles can rent a taxi or ask the travel agency to rent a van.",
    ],
    source: "資料來源：影像由雪霸國家公園管理處授權提供。",
  },
  {
    key: "xuejian",
    label: "雪見遊客中心",
    type: "youtube",
    src: "https://www.youtube.com/embed/2KDE860OW_A",
    location: "雪霸國家公園-雪見遊客中心廣場",
    intro: [
      "雪見遊憩區海拔高度約在600到2600公尺之間，雨量豐沛、雲霧飄渺。",
      "園區內雪見遊客中心，設有展示區及視聽室，每日定時播放雪霸國家公園自然生態影片。",
      "園區的北坑溪古道，是眺望聖稜線（大霸尖山到雪山之間的稜線）的絕佳路段。",
      "每年冬季可見雪山稜線的皚皚白雪，「雪見」因而得名。園區內的林間步道為兩條主要木棧步道及一獨立人車分道木棧道所組成，全長約920公尺，提供遊客體驗雪見地區中海拔闊葉林帶的森林景觀，適合一般遊客健行。",
      "請遊客注意進入雪見地區需辦理入山證。",
      "Lying in the west of the Shei-Pa National Park, the Xuejian Recreation Area conserves a very complete natural environment with plentiful, multiple animal and plant resources due to its remoteness that only few local aborigines and managers entered in the past. Simaxian Forest Road is the only access to this area. It is suggested to enter here from two directions: 1. Start from the Shei-Pa National Park’s Wenshui Visitor Center in Miaoli County, take Provincial Highway No.3 via Dahu, transfer to Miaoli Highway No.61 via Erbensong, and drive northward to arrive. 2. Start from Taichung Highway No.47 at Zhuolan Township of Miaoli County, transfer to Miaoli Highway No.61 via Shilin Dam to Erbensong, and drive northward to arrive.",
    ],
    source: "資料來源：影像由雪霸國家公園管理處授權提供。",
  },
  {
    key: "nanan",
    label: "南安遊客中心",
    type: "mjpg",
    src: "https://nan-an.ysnp.gov.tw/mjpg/video.mjpg",
    location: "玉山國家公園-南安遊客中心",
    intro: [
      "南安遊客中心位於花蓮縣卓溪鄉卓清村，中心設有視聽室及展示室，除提供室內導覽解說服務外，亦提供戶外隨隊解說服務。中心外有一片30餘公頃稻米種植區，俗稱玉山下的第一畝田，稻穗於收成時呈顯金黃稻浪，美不勝收。中心至瓦拉米步道登山口距離約6公里車程，登山口至佳心段步道約4.5公里，該步道內山風瀑布、吊橋，以及中低海拔闊葉林相等壯麗景色，遠近馳名，適合全家郊遊踏青。",
    ],
    source: "資料來源：影像由玉山國家公園管理處授權提供。",
  },
  {
    key: "paiyun",
    label: "排雲登山服務中心",
    type: "mjpg",
    src: "https://ysp.ysnp.gov.tw/mjpg/video.mjpg?timestamp=1526875565697",
    location: "玉山國家公園-排雲登山服務中心",
    intro: [
      "排雲登山服務中心主要服務對象為玉山群峰線登山山友，山友攀登該路線須事先辦理登山申請，出發前請備齊相關證件及裝備，並完成報到作業後開始登山行程，以避免因未申請自行上山，發生山域意外事故。",
      "排雲登山服務中心設有視聽室，洽服務台後即可觀賞「玉山行」及玉山相關宣導影片；互動展示區內介紹登山活動之環境保育、行前準備、安全及醫學等知識；另設有玉山冥想VR室，提供玉山主峰線步道的沿途環景VR影像，讓遊客體驗步道沿途風光。",
    ],
    source: "資料來源：影像由玉山國家公園管理處授權提供。",
  },
];
