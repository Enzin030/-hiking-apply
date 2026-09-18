/* ============================================================
   PlaceData.js — 景點資訊資料檔（完全比照舊站 hike.taiwan.gov.tw 正式站 146 筆資料）
   ============================================================ */

window.PLACE_ORGS = [
  {
    "value": "",
    "label": "全部"
  },
  {
    "value": "105e956f-d8da-49f7-a9b7-3aefdda88a12",
    "label": "太魯閣國家公園管理處 (太管處)"
  },
  {
    "value": "c951cdcd-b75a-46b9-8002-8ef952ec95fd",
    "label": "玉山國家公園管理處 (玉管處)"
  },
  {
    "value": "e6dd4652-2d37-4346-8f5d-6e538353e0c2",
    "label": "雪霸國家公園管理處 (雪管處)"
  },
  {
    "value": "84bc7d2b-ad3e-4f39-b568-a96681087f74",
    "label": "國家步道(山屋/營地)"
  },
  {
    "value": "8f7c09dc-afeb-4708-a7bb-b20da2a24648",
    "label": "警政署入山"
  },
  {
    "value": "7d0ed03d-e3ff-4482-8254-96f6434f5a85",
    "label": "自然保留區"
  },
  {
    "value": "7d0ed03d-e3ff-4482-8254-96f6434f5a86",
    "label": "自然保護區"
  },
  {
    "value": "7d0ed03d-e3ff-4482-8254-96f6434f5a87",
    "label": "野生動物保護區"
  }
];

window.PLACE_KINDS = [
  { value: "", label: "請選擇" },
  { value: "N", label: "一般" },
  { value: "G", label: "登山口" },
  { value: "H", label: "宿營地" }
];

window.PLACE_DATA = [
  {
    "id": 675,
    "name": "三六九臨時營地",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [
      {
        "title": "三六九臨時營地",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/Mcb315b73-c965-479e-b948-f90eb87006cf.jpg"
      }
    ],
    "intro": "<p>三六九臨時營地設置2個1噸的儲水桶。<BR>設置木棧板計有30個，當中規劃24個供山友使用，其餘6個為公務性質及志工使用，請山友依照入園許可證所分配之營位號碼使用。<BR>木棧板尺寸為210*210公分，適合2人帳篷使用。此營地空曠無自然遮蔽掩體，請山友務必正確搭設帳棚及拉綁營繩，避免帳篷損壞或內帳漏水。<BR><BR>設有一處簡易廁所，有2個隔間，廁所為糞坑式廁所且無水。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 3,
    "name": "排雲山莊",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [
      {
        "title": "排雲山莊-環維課提供",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/Mc58f29be-da27-4984-ac60-6560fbfccf04.jpg"
      },
      {
        "title": "排雲山莊-江秀真攝",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/5b259242-2cd9-4e3c-a164-680934e98100.jpg"
      }
    ],
    "intro": "<p>◎海拔高度：3402m。 <BR>◎位於登玉山步道8.5公里處，距玉山主峰2.4 公里，係攀登玉山途中提供住宿的山屋。 <BR>◎型式：兩層樓鋼骨結構。 <BR>◎排雲山莊使用規費︰每人每宿新臺幣480元整，依據《<a href=\" https://hike.taiwan.gov.tw/news_7_1.aspx?ID=1145 \" target=\"_blank\">玉山國家公園管理處排雲山莊使用規費收費標準</a>》辦理。<BR>◎<a href=\"https://hike.taiwan.gov.tw/news_7_1.aspx?ID=2629\" target=\"_blank\">排雲山莊使用注意事項</a>。<BR>◎請向山莊管理人員出示入園許可證報到，並依許可床位號碼住宿，入住時間為當日14時後，退住時間為每日10時前。<BR>◎排雲山莊，提供之服務設施有： <BR>1.以太陽能供電為主，發電機發電為輔，每日下午6至8時供電。 <BR>2.排雲山莊因供電有限，為山莊照明及安全考量，請勿自行拔除緊急照明及其他設備電源進行手機充電，如有充電需要，請自備行動電源，或至充電區充電，並請珍惜資源節約使用。<BR>3.山莊設置有公廁。 <BR>4.供水平時無虞，冬季則因水源短缺或管線結冰有缺水情形。<BR>5.高山蓄水及燃料運送不易，請節約能源及用水。於排雲山莊1樓限量提供民眾飲用水，於供餐時段(上午7時至13時、下午16時至晚上19時、冬季凌晨2時至3時30分、夏季凌晨1時至3時等)提供熱飲用水。民眾如有飲用之外的熱水需求，如刷牙、擦臉、簡易清潔、保暖等，可自備炊具瓦斯於屋外水塔取水後，至戶外自助煮水區加熱使用。<BR>6.備有PAC。<BR>◎本山莊及基地周圍30公尺內，基於公共安全，個人及團體不得有燃火、升火烤肉及搭設營帳等大肆炊事之行為，僅能以簡易安全器具於戶外煮水區燒開水、沖泡即食品、泡茶、咖啡等。並請遵守無痕山林準則，勿遺留垃圾食物於山區，共同維護山林生態系健全及環境清潔 。<BR>◎排雲山莊附近並無指定露營區，依《國家公園法》第13條第8款規定禁止搭設營帳。<BR>◎排雲山莊往玉山主峰部份碎石坡路段，時有落石風險。排雲山莊備有安全頭盔提供借用，經過易落石路段，建議戴上頭盔，請速通過勿逗留，以策安全。<BR>◎<a href=\"https://hike.taiwan.gov.tw/news_7_1.aspx?ID=2567\" target=\"_blank\">玉山國家公園「排雲山莊」住宿申請</a> <BR>◎TWD97經緯：東經120°56’58.83，北緯23°27’59.77 <BR>◎TWD97TM2：X座標244859，Y座標2595954 <BR>◎收訊衛星：6顆</p><p>水源 : 有、</p><p>訊號 : GSM、Handheld Transceiver、衛星、</p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 3,
    "hasQueue": true
  },
  {
    "id": 4,
    "name": "圓峰山屋/營地",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [
      {
        "title": "圓峰山屋/營地",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/8af35be2-6d44-4e96-97da-9cfbad5c40b0.jpg"
      }
    ],
    "intro": "<p>◎海拔高度：3694M。 <BR>◎位於玉山山塊南稜上，為登玉山後五峰之前進基地，營地平坦，水源位於東向坡面。 <BR>◎型式：木構造。 <BR>◎設施狀況：太陽能供電、雨水集水設施、簡易生態廁所、PAC。<BR>◎住宿山屋者，請自備住宿裝備，不提供棉被，民眾需自備睡袋。 <BR>◎營地宿營需自備營帳、睡墊及睡袋。 <BR>◎登玉山群峰高級登山路線宿營點，不適合初次登山者；攀登者須具備較佳之登山體能。<BR>◎為兼顧3 日（含）以上住宿「圓峰山屋/營地」長程登山隊伍之登山權益及公平性，業經核准入園隊伍，如擬變更或縮短行程者，請自行取消原申請案，另提新申請案，並依規排隊候補。  <BR>◎TWD97經緯：東經120°57’17.41，北緯23°27’24.38 <BR>◎TWD97TM2：X座標245386，Y座標2594865 <BR>◎收訊衛星：8顆</p><p>水源 : 有、</p><p>訊號 : GSM、Handheld Transceiver、衛星、</p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 4,
    "hasQueue": true
  },
  {
    "id": 10,
    "name": "七卡山莊",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [
      {
        "title": "七卡山莊",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/Mb0bf0079-c3fb-4e7b-8278-8e40b543a462.jpg"
      },
      {
        "title": "七卡山莊",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/24ca8545-60ff-4bbb-9202-1a32af31adae.jpg"
      }
    ],
    "intro": "<p>海拔:2510M。<BR>穩定水源及太陽能照明。<BR>有沖水式廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備。<BR>經緯度座標:東經121.286072，北緯24.383429。<BR>TWD97座標: X 279018 / Y 2697527。<BR>通訊品質:尚可。</p><p>水源 : 有、</p><p>訊號 : GSM、Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 221,
    "name": "荖濃溪營地",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [],
    "intro": "<p>◎海拔高度：3370m。 <BR>◎位於八通關玉山線，玉山北峰南面山麓處，緊鄰溪溝，可眺望玉山東峰，原為日本人所建的新高駐在所原址，營地平坦，水源位於溪溝處。 <BR>◎營地宿營需自備營帳、睡墊及睡袋。<BR>◎玉山北鞍下八通關步道約3.2公里處（過荖濃斷崖）崩塌，請謹慎評估及小心通行。<BR></p><p></p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 221,
    "hasQueue": true
  },
  {
    "id": 386,
    "name": "七卡營地",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔:2510M。<BR>穩定水源。<BR>有沖水式廁所。<BR>宿營者請自備過夜及睡眠裝備。<BR>經緯度座標:東經121.286072，北緯24.383429。<BR>TWD97座標: X 279018 / Y 2697527。<BR>通訊品質:尚可。<BR></p><p>水源 : 有、</p><p>訊號 : GSM、Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 222,
    "name": "樂樂山屋",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [
      {
        "title": "樂樂山屋-陳貞妤攝",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/91bc09be-69ed-4342-8951-a4995cd2fdf2.jpg"
      },
      {
        "title": "樂樂山屋-郭純棻攝",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/06af1dd7-6d4a-4ac8-87ec-d156b80f9002.jpg"
      }
    ],
    "intro": "<p>◎海拔高度：1670m。 <BR>◎型式：位於距東埔步道口約5.5公里處，為一簡易木造山屋。 <BR>◎住宿山屋者，請自備住宿裝備，不提供棉被，民眾需自備睡袋。 <BR>◎水源需自雲龍瀑布取水。 <BR>◎TWD97經緯：東經120°57’29.05，北緯23°32’45.57 <BR>◎TWD97TM2：X座標245719，Y座標2604745 <BR>◎收訊衛星：5顆</p><p></p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 222,
    "hasQueue": true
  },
  {
    "id": 13,
    "name": "三六九山莊",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [
      {
        "title": "三六九山莊",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/4a8baa43-cb77-49fe-b5c4-c6e283792189.jpg"
      }
    ],
    "intro": "<p><font color='red'>本處為興建三六九山莊，於112年5月20日起停止三六九山莊之申請。</font><BR><BR>海拔:3150M。<BR>冬季水源較不穩定，有簡易太陽能照明。<BR>有乾式生態廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備。<BR>經緯度座標:東經121.254574，北緯24.392298。<BR>TWD97座標: X 275821 / Y 2698503。<BR>通訊品質:尚可~不穩定。<BR>為登頂雪山主峰主要之住宿山莊。<BR>請民眾依入園證之核准床位號碼入住使用。</p><p>水源 : 有、</p><p>訊號 : GSM、Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 727,
    "name": "觀高山屋",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [
      {
        "title": "觀高山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/M500da752-e930-4fcf-9ce2-5e704b8c8947.jpg"
      }
    ],
    "intro": "<p>◎海拔高度：2,575m。<BR>◎位於八通關越嶺線步道14.6公里處。<BR>◎型式：鋼骨結構。<BR>◎觀高山屋使用規費︰每人每宿平日新臺幣800元整、假日新臺幣1200元整。<BR>◎<a href=\"https://hike.taiwan.gov.tw/news_7_1.aspx?ID=2821\" target=\"_blank\">觀高山屋使用注意事項</a>。<BR>◎請向山屋管理人員出示入園許可證報到，並依許可床位號碼住宿，不得佔用他人床位；入住時間為當日15：00後，退住時間為每日10：00前。<BR>◎觀高山屋設施：公廁、PAC。<BR>◎請遵守無痕山林準則，勿遺留垃圾、廚餘、果皮、食物於山區，共同維護山林生態系健全及環境清潔。<BR>◎觀高山屋未設置營地，依《國家公園法》第13條第8款規定禁止搭設營帳。<BR>◎TWD97TM2：X座標250007，Y座標2600029</p><p>水源 : 有、</p><p>訊號 : GSM、Handheld Transceiver、</p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 727,
    "hasQueue": true
  },
  {
    "id": 223,
    "name": "巴奈伊克營地",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [],
    "intro": "<p>◎海拔高度：2820m。<BR>◎位於巴柰伊克山腰避風，有一簡易鐵皮山屋較為破舊(非本處設施不另予整修)。<BR>◎水源：位於山屋旁山溝處。<BR>◎營地宿營需自備營帳、睡墊及睡袋。<BR>◎TWD97經緯：東經121°01'00\"，北緯23°29'17\"<BR>◎TWD97TM2：X座標251693，Y座標259819</p><p></p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 223,
    "hasQueue": true
  },
  {
    "id": 224,
    "name": "中央金礦山屋",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [
      {
        "title": "中央金礦山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/ac2ef03e-76c8-42c2-ab11-611054c92f7a.jpg"
      }
    ],
    "intro": "<p>◎海拔高度：2823m。 <BR>◎型式：鋼骨結構，內分上下二層。 <BR>◎住宿山屋者，請自備住宿裝備，不提供棉被，民眾需自備睡袋。 <BR>◎設施狀況：太陽能光電、雨水集水設施、簡易廁所、PAC。 <BR>◎TWD97經緯：東經121°01’38.76，北緯23°29’11.35 <BR>◎TWD97TM2：X座標252802，Y座標2598155 <BR>◎收訊衛星：6顆 <BR>◎ 依據《進入玉山國家公園生態保護區開放(須具長程縱走登山經驗)登山路線申請說明》，開放(須具長程縱走登山經驗)登山路線每日最多核准人數以20人為原則。</p><p></p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 224,
    "hasQueue": true
  },
  {
    "id": 225,
    "name": "白洋金礦山屋/營地",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [
      {
        "title": "白洋金礦山屋/營地",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/561547fa-b2aa-42e5-be94-c90b3dc321f0.jpg"
      }
    ],
    "intro": "<p>◎海拔高度：3380m。 <BR>◎型式：鋼骨結構。 <BR>◎住宿山屋者，請自備住宿裝備，不提供棉被，民眾需自備睡袋。 <BR>◎營地宿營需自備營帳、睡墊及睡袋。 <BR>◎設施狀況：太陽能供電、雨水集水設施、簡易廁所、PAC。 <BR>◎TWD97經緯：東經121°2’50.52，北緯23°29’16.63 <BR>◎TWD97TM2：X座標254838，Y座標2598318 <BR>◎收訊衛星：6顆 <BR>◎依據《進入玉山國家公園生態保護區開放(須具長程縱走登山經驗)登山路線申請說明》，開放(須具長程縱走登山經驗)登山路線每日最多核准人數以20人為原則。</p><p></p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 225,
    "hasQueue": true
  },
  {
    "id": 226,
    "name": "杜鵑營地",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [
      {
        "title": "杜鵑營地",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/7aaca0ea-d5eb-45f0-9d8f-83d41b7381f9.jpg"
      }
    ],
    "intro": "<p>◎海拔高度：3150m。 <BR>◎八通關越道之中途站，基地平整，避風良好，尚遺留坋土牆等舊址遺跡。 <BR>◎水源：位於東側小溝約5分鐘步程，同時在東向另有一絹絲瀑布水質極佳。 <BR>◎營地宿營需自備營帳、睡墊及睡袋。  <BR>◎TWD97經緯：東經121°01’38.64，北緯23°28’28.11 <BR>◎TWD97TM2：X座標252799，Y座標2596825 <BR>◎收訊衛星：6顆 <BR>◎依據《進入玉山國家公園生態保護區開放(須具長程縱走登山經驗)登山路線申請說明》，開放(須具長程縱走登山經驗)登山路線每日最多核准人數以20人為原則。<BR>◎杜鵑營地、南營地及該路段暫不開放。杜鵑營地因110年5月16日受火災影響，後續將進行自然復育與生態監測工作，故該區域路段在監測計畫執行期間暫停受理申請及通行，期減少人為干擾。</p><p></p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 226,
    "hasQueue": true
  },
  {
    "id": 17,
    "name": "翠池山屋",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [
      {
        "title": "翠池山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/64c290ae-4792-4b3d-bf48-a066a5f7abe8.jpg"
      }
    ],
    "intro": "<p>海拔:3510M。<BR>有翠池水源可使用，冬季水源較不穩定，有簡易太陽能照明。<BR>有坑洞式廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備。<BR>經緯度座標:東經121.222801，北緯24.385388。<BR>TWD97座標:X 272566 / Y 2697722。<BR>通訊品質:不穩定。<BR>請民眾依入園證之核准床位號碼入住使用。<BR>翠池為全台最高海拔湖泊，請共同保護翠池景觀及水源。</p><p>水源 : 有、</p><p>訊號 : Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 227,
    "name": "南營地",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [
      {
        "title": "南營地",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/b551487d-9028-43e9-a8fd-c2ed721989aa.jpg"
      }
    ],
    "intro": "<p>◎海拔: 3213m。<BR>◎營地宿營需自備營帳、睡墊及睡袋。 <BR>◎TWD97經緯：東經121°02’27.55，北緯23°27’48.86 <BR>◎TWD97TM2：X座標254187，Y座標2595618 <BR>◎收訊衛星：10顆<BR>◎依據《進入玉山國家公園生態保護區開放(須具長程縱走登山經驗)登山路線申請說明》，開放(須具長程縱走登山經驗)登山路線每日最多核准人數以20人為原則。<BR>◎杜鵑營地、南營地及該路段暫不開放。杜鵑營地因110年5月16日受火災影響，後續將進行自然復育與生態監測工作，故該區域路段在監測計畫執行期間暫停受理申請及通行，期減少人為干擾。</p><p></p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 227,
    "hasQueue": true
  },
  {
    "id": 387,
    "name": "翠池營地",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔:3510M。<BR>有翠池水源可使用，冬季水源較不穩定。<BR>有坑洞式廁所。<BR>宿營者請自備過夜及睡眠裝備。<BR>經緯度座標:東經121.222801，北緯24.385388。<BR>TWD97座標:X 272566 / Y 2697722。<BR>通訊品質:不穩定。<BR>翠池為全台最高海拔湖泊，請共同保護翠池景觀及水源。<BR></p><p>水源 : 有、</p><p>訊號 : Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 228,
    "name": "大水窟山屋",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [
      {
        "title": "大水窟山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/5deba6e9-adbe-40e0-9bd4-df2ed46f11ae.jpg"
      }
    ],
    "intro": "<p>◎海拔高度：3227m。 <BR>◎型式：位於大水窟山與南大水窟山之凹鞍，大水窟為一高山湖泊，玉管處在此水池旁興建一座太陽能照明及簡易廁所之鋼骨結構山屋。 <BR>◎住宿山屋者，請自備住宿裝備，不提供棉被，民眾需自備睡袋。 <BR>◎設施狀況：太陽能供電、雨水集水設施、簡易廁所、PAC。 <BR>◎TWD97經緯：東經121°03’22.58，北緯23°27’33.47 <BR>◎TWD97TM2：X座標255749，Y座標2595145 <BR>◎收訊衛星：8顆 <BR>◎依據《進入玉山國家公園生態保護區開放(須具長程縱走登山經驗)登山路線申請說明》，開放(須具長程縱走登山經驗)登山路線每日最多核准人數以20人為原則。</p><p></p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 228,
    "hasQueue": true
  },
  {
    "id": 229,
    "name": "塔芬谷山屋",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [
      {
        "title": "塔芬谷山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/cc715089-17e5-4a85-b2d2-4d0a1f1be738.jpg"
      }
    ],
    "intro": "<p>◎海拔高度：2605m。 <BR>◎型式：鋼骨結構。 <BR>◎住宿山屋者，請自備住宿裝備，不提供棉被，民眾需自備睡袋。<BR>◎設施狀況：太陽能供電、雨水集水設施、簡易廁所、PAC。<BR>◎水源位在營地南面山壁。<BR>◎TWD97經緯：東經121°01’36.28，北緯23°25’10.46  <BR>◎TWD97TM2：X座標252733，Y座標2590745<BR>◎收訊衛星：5顆<BR>◎依據《進入玉山國家公園生態保護區開放(須具長程縱走登山經驗)登山路線申請說明》，開放(須具長程縱走登山經驗)登山路線每日最多核准人數以20人為原則。</p><p></p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 229,
    "hasQueue": true
  },
  {
    "id": 230,
    "name": "轆轆谷山屋",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [
      {
        "title": "轆轆谷山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/5eebe998-27d7-47af-924b-56f111fc77db.jpg"
      }
    ],
    "intro": "<p>◎海拔高度：2991m。位於轆轆山南側下方。 <BR>◎型式：鋼骨結構。 <BR>◎住宿山屋者，請自備住宿裝備，不提供棉被，民眾需自備睡袋。 <BR>◎設施狀況：太陽能供電、雨水集水設施、簡易廁所、PAC。 <BR>◎谷地有一小水池，但水量少常乾沽，宿營時可沿西南山溝找水。 <BR>◎TWD97經緯：東經121°00’23.42，北緯23°23’9.56 <BR>◎TWD97TM2：X座標250665，Y座標2587026 <BR>◎收訊衛星：6顆 <BR>◎依據《進入玉山國家公園生態保護區開放(須具長程縱走登山經驗)登山路線申請說明》，開放(須具長程縱走登山經驗)登山路線每日最多核准人數以20人為原則。</p><p></p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 230,
    "hasQueue": true
  },
  {
    "id": 231,
    "name": "雲峰下三叉營地",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [],
    "intro": "<p>◎海拔:2920m。<BR>◎營地宿營需自備營帳、睡墊及睡袋。<BR>◎水源:營地之東側森林內。<BR>◎依據《進入玉山國家公園生態保護區開放(須具長程縱走登山經驗)登山路線申請說明》，開放(須具長程縱走登山經驗)登山路線每日最多核准人數以20人為原則。</p><p></p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 231,
    "hasQueue": true
  },
  {
    "id": 232,
    "name": "拉庫音溪山屋",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [
      {
        "title": "拉庫音溪底山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/d6cb7cfa-3f13-4552-a674-d3cd001bca72.jpg"
      }
    ],
    "intro": "<p>◎海拔高度：2690m。 <BR>◎型式：鋼骨結構。 <BR>◎住宿山屋者，請自備住宿裝備，不提供棉被，民眾需自備睡袋。 <BR>◎設施狀況：太陽能供電、雨水集水設施、簡易廁所、PAC。 <BR>◎水源取自拉庫音溪水量大且清澈。 <BR>◎TWD97經緯：東經121°01’32.59，北緯23°19’41.89 <BR>◎TWD97TM2：X座標252630，Y座標2580638 <BR>◎收訊衛星：6顆<BR>◎依據《進入玉山國家公園生態保護區開放(須具長程縱走登山經驗)登山路線申請說明》，開放(須具長程縱走登山經驗)登山路線每日最多核准人數以20人為原則。</p><p></p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 232,
    "hasQueue": true
  },
  {
    "id": 233,
    "name": "馬博山屋",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [
      {
        "title": "馬博前山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/d7ee1c21-27c5-4995-8c4d-e6eca4e38771.jpg"
      }
    ],
    "intro": "<p>◎海拔:3580m。 <BR>◎設有太陽能照明、簡易廁所、PAC。 <BR>◎水源缺乏最好自白洋金礦背水。 <BR>◎本山屋因地處稜脊處，展望好但較為寒冷。 <BR>◎住宿山屋者，請自備住宿裝備，不提供棉被，民眾需自備睡袋。 <BR>◎TWD97經緯：東經121°4’25.99，北緯23°31’5.98 <BR>◎TWD97TM2：X座標257545，Y座標2601683 <BR>◎收訊衛星：7顆 <BR>◎依據《進入玉山國家公園生態保護區開放(須具長程縱走登山經驗)登山路線申請說明》，開放(須具長程縱走登山經驗)登山路線每日最多核准人數以20人為原則。 </p><p></p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 233,
    "hasQueue": true
  },
  {
    "id": 234,
    "name": "馬利加南山屋",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [
      {
        "title": "馬利加南東峰前山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/95cd3462-f09c-46d9-ac70-38320fa6d0c7.jpg"
      }
    ],
    "intro": "<p>◎海拔:3260m，位於馬利加南東峰西側，為ㄧ凹谷地形避風。<BR>◎設有太陽能照明、簡易廁所、PAC。<BR>◎水源位於營地北面山溝處，但並不穩定。<BR>◎住宿山屋者，請自備住宿裝備，不提供棉被，民眾需自備睡袋。<BR>◎TWD97經緯：東經121°7’55.14，北緯23°30’55.86  <BR>◎TWD97TM2：X座標263478，Y座標2601376<BR>◎收訊衛星：7顆<BR>◎依據《進入玉山國家公園生態保護區開放(須具長程縱走登山經驗)登山路線申請說明》，開放(須具長程縱走登山經驗)登山路線每日最多核准人數以20人為原則。</p><p></p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 234,
    "hasQueue": true
  },
  {
    "id": 235,
    "name": "馬布谷山屋",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [
      {
        "title": "馬布谷山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/c5282660-706c-43f3-b439-d7136cee47ff.jpg"
      }
    ],
    "intro": "<p>◎海拔:3050m，為馬西山及布干山間之鞍部。 <BR>◎設有太陽能照明、簡易廁所、PAC。 <BR>◎住宿山屋者，請自備住宿裝備，不提供棉被，民眾需自備睡袋。 <BR>◎水源位於營地西側林內山溝處，但水源並不穩定。 <BR>◎TWD97經緯：東經121°9’40.11，北緯23°28’52.36 <BR>◎TWD97TM2：X座標266460，Y座標2597580 <BR>◎收訊衛星：6顆 <BR>◎依據《進入玉山國家公園生態保護區開放(須具長程縱走登山經驗)登山路線申請說明》，開放(須具長程縱走登山經驗)登山路線每日最多核准人數以20人為原則。</p><p></p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 235,
    "hasQueue": true
  },
  {
    "id": 6,
    "name": "佳心營地",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [
      {
        "title": "佳心營地",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/e5876fdd-07d0-4cff-ba88-76ae9f76e9b1.jpg"
      }
    ],
    "intro": "<p>◎營地宿營需自備營帳、睡墊及睡袋。 <BR>◎非生態保護區內。 <BR>◎設施說明：雨水集水、廁所、涼亭及野餐桌椅。<BR>◎TWD97經緯：東經121°12’46.87，北緯23°20’44.47 <BR>◎TWD97TM2：X座標271781，Y座標2582579 <BR>◎收訊衛星：5顆</p><p></p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 6,
    "hasQueue": true
  },
  {
    "id": 7,
    "name": "瓦拉米山屋/營地",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [
      {
        "title": "瓦拉米山屋(邱宇中拍攝)",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/197cd8eb-e74a-4b71-8f0b-22a7a7ba9ab2.jpg"
      },
      {
        "title": "瓦拉米山屋(吳和融拍攝)",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/db8864f6-3654-48ab-a913-5a6fb04f3ce0.jpg"
      }
    ],
    "intro": "<p>◎海拔高度：1070m。 <BR>◎型式：位於蕨駐在所附近，距山風步道口約14公里，玉管處在此興建一座山屋，山屋規模除有太陽能照明外，另有野餐桌椅及公廁等設施。 <BR>◎設施狀況：太陽能供電、雨水集水設施、簡易廁所 <BR>◎住宿山屋者，請自備住宿裝備，不提供棉被，民眾需自備睡袋。 <BR>◎營地宿營需自備營帳、睡墊及睡袋。 <BR>◎TWD97經緯：東經121°11’10.75，北緯23°21’13.59 <BR>◎TWD97TM2：X座標269050，Y座標2583471 <BR>◎收訊衛星：5顆</p><p>水源 : 有、</p><p>訊號 : Handheld Transceiver、衛星、</p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 7,
    "hasQueue": true
  },
  {
    "id": 215,
    "name": "抱崖山屋/營地",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [
      {
        "title": "抱崖山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/a980e72c-0dc0-4da4-b89b-328579c872b7.jpg"
      }
    ],
    "intro": "<p>◎海拔高度：1676m。 <BR>◎型式：位於抱崖駐在所附近，為大分至瓦拉米之中途休息住宿站，玉管處在此興建一座山屋，山屋規模除有太陽能照明外，並規劃有研究工作室、儲藏室、野餐桌椅及公廁等設施，兼具生態保育調查研究站之功能。 <BR>◎住宿山屋者，請自備住宿裝備，不提供棉被，民眾需自備睡袋。 <BR>◎營地宿營需自備營帳、睡墊及睡袋。 <BR>◎TWD97經緯：東經121°08’23.01，北緯23°20’6.09 <BR>◎TWD97TM2：X座標264288，Y座標2581389 <BR>◎收訊衛星：6顆 <BR>◎宿營地承載量為16個山屋名額及4個營地名額，惟有條件登山路線日最多核准人數20人為原則。 </p><p>水源 : 有、</p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 215,
    "hasQueue": true
  },
  {
    "id": 236,
    "name": "多美麗營地",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [],
    "intro": "<p>◎海拔高度：1810m。<BR>◎為十三里警察駐在所舊址，人字石砌遺址優美，動植物資源豐富。<BR>◎營地宿營需自備營帳、睡墊及睡袋。<BR>◎水源缺乏。<BR>◎TWD97經緯：東經121°07’44，北緯23°21’55<BR>◎TWD97TM2：X座標263157，Y座標2584676</p><p>水源 : 無、</p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 236,
    "hasQueue": true
  },
  {
    "id": 237,
    "name": "大分山屋",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [
      {
        "title": "大分山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/3b3c1448-3bc0-4fc0-b6f7-b1ee8ade6807.jpg"
      }
    ],
    "intro": "<p>◎海拔高度：1320m。 <BR>◎型式：其基地規模及完整度在越道上可說是最佳之處，尚遺留駁坎、平台、石階、儲水槽、彈藥庫等遺跡，玉管處在此興建一座山屋，山屋規模除有太陽能照明外，並規劃有研究工作室、儲藏室、野餐桌椅及公廁等設施，兼具生態保育調查研究站之功能。 <BR>◎住宿山屋者，請自備住宿裝備，不提供棉被，民眾需自備睡袋。 <BR>◎TWD97經緯：東經121°05’51.97，北緯23°22’29.21 <BR>◎TWD97TM2：X座標259995，Y座標2585788 </p><p></p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 237,
    "hasQueue": true
  },
  {
    "id": 238,
    "name": "托馬斯營地",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [],
    "intro": "<p>◎海拔高度：2000m。 <BR>◎型式：位於距大水窟9.3公里處，其基地規模及完整度較佳，尚遺留駁坎、平台、炭窯、儲水槽等遺跡，植被破壞尚未嚴重，但茅草較長。 <BR>◎營地宿營需自備營帳、睡墊及睡袋。<BR>◎依據《進入玉山國家公園生態保護區開放(須具長程縱走登山經驗)登山路線申請說明》，開放(須具長程縱走登山經驗)登山路線每日最多核准人數以20人為原則。</p><p></p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 238,
    "hasQueue": true
  },
  {
    "id": 239,
    "name": "庫哈諾辛山屋/營地",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [
      {
        "title": "庫哈諾辛山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/e0b85a48-a960-4756-a413-00d015fed3f3.jpg"
      }
    ],
    "intro": "<p>◎海拔高度：3026m <BR>◎型式：鋼骨結構 <BR>◎設施狀況：太能供電，雨水集水設施，簡易廁所，PAC。 <BR>◎住宿山屋者，請自備住宿裝備，不提供棉被，民眾需自備睡袋。 <BR>◎營地宿營需自備營帳、睡墊及睡袋。 <BR>◎須自進涇橋登山口攜水。 <BR>◎TWD97經緯：東經120°54’36.41，北緯23°15’19.06 <BR>◎TWD97TM2：X座標240812，Y座標2572556 <BR>◎收訊衛星：6顆 </p><p></p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 239,
    "hasQueue": true
  },
  {
    "id": 240,
    "name": "連理山前(桃源)營地",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [],
    "intro": "<p>◎海拔:2745m。 <BR>◎活水源位於營地北稜脊的溪溝源頭，是一處斜板岩滲水處，水源穩定，來回約25分鐘。 <BR>◎營地宿營需自備營帳、睡墊及睡袋。<BR></p><p></p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 240,
    "hasQueue": true
  },
  {
    "id": 241,
    "name": "新仙山前營地",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [
      {
        "title": "新仙山營地--黃金進--邱創椿攝",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/46d99616-e292-4565-8de5-953099d82cca.jpg"
      }
    ],
    "intro": "<p>◎海拔:2960m。 <BR>◎營地宿營需自備營帳、睡墊及睡袋。 <BR>◎水源缺乏，窪地水源不穩常乾沽。</p><p></p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 241,
    "hasQueue": true
  },
  {
    "id": 58,
    "name": "桃山山屋",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [
      {
        "title": "桃山山屋 (保育志工黃建中、盧素珍提供)",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/b26e3330-d553-43a6-8f7d-8be64527e7ec.jpg"
      }
    ],
    "intro": "<p>海拔:3275M。<BR>有收集雨水之儲水設備，枯水期不穩定，有簡易太陽能照明。<BR>有坑洞式廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備。<BR>經緯度座標:東經121.302476，北緯24.433048。<BR>TWD97座標: X 280670 / Y 2703026。<BR>通訊品質:尚可~不穩定。<BR>請民眾依入園證之核准床位號碼入住使用。</p><p>水源 : 有、</p><p>訊號 : GSM、Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 409,
    "name": "桃山營地",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔:3275M。<BR>有收集雨水之儲水設備，枯水期不穩定。<BR>有坑洞式廁所。<BR>宿營者請自備過夜及睡眠裝備。<BR>經緯度座標:東經121.302476，北緯24.433048。<BR>TWD97座標: X 280670 / Y 2703026。<BR>通訊品質:尚可~不穩定。<BR><BR></p><p>水源 : 有、</p><p>訊號 : GSM、Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 1,
    "name": "塔塔加登山口",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [
      {
        "title": "塔塔加登山口-曹靖玟攝",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/4f3d2cec-184a-4311-9612-8bf348ad31a4.jpg"
      }
    ],
    "intro": "<p>玉山登山口位於溪林道2.8公里處，海拔2,610公尺，跨越臺灣西南兩區分水嶺上的鞍部，北邊溪澗為沙里仙溪上源，於東埔匯入陳有蘭溪；南邊山谷為楠梓仙溪，在旗山以南匯入高屏溪，垂直向下俯視，前1公里可見貼於玉山步道山壁蜿蜒而下的楠梓林道，通往楠梓仙溪溪畔的「楠溪保育研究站」，為園區內楠梓仙溪河谷生態秘境，之後溪流持續往南延伸，連接梅蘭林道，直到海拔高度約1,730 公尺的梅蘭鞍部。民國98 年莫拉克颱風引致的「88 水災」在12.3 公里處造成嚴重崩塌，林道於此中斷。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 63,
    "name": "新達山屋",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [
      {
        "title": "新達池 (保育志工黃建中、盧素珍提供)",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/c2b63dfc-eed1-4448-9291-5224edc4c17c.jpg"
      },
      {
        "title": "新達山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/bb93dfa9-9332-4d6b-82e2-db362f53e1e1.jpg"
      }
    ],
    "intro": "<p>海拔:3175M。<BR>有收集雨水之儲水設備，枯水期不穩定，有簡易太陽能照明。<BR>有坑洞式廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備。<BR>經緯度座標:東經121.278751，北緯24.429789。<BR>TWD97座標: X 278265 / Y 2702660。<BR>通訊品質:不穩定。<BR>請民眾依入園證之核准床位號碼入住使用。</p><p>水源 : 有、</p><p>訊號 : GSM、Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 411,
    "name": "新達營地",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔:3175M。<BR>有收集雨水之儲水設備，枯水期不穩定。<BR>有坑洞式廁所。<BR>宿營者請自備過夜及睡眠裝備。<BR>經緯度座標:東經121.278751，北緯24.429789。<BR>TWD97座標: X 278265 / Y 2702660。<BR>通訊品質:不穩定。<BR></p><p>水源 : 有、</p><p>訊號 : GSM、Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 282,
    "name": "進涇橋登山口",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>橋跨於荖濃溪上游之野溪，民國60年1月完工，為紀念開路期間殉職的段長「蘇進涇」而命名，民國98年毁於莫拉克颱風。目前公路改以「便道」通行，沿溪旁步道仍為關山、庫哈諾辛山登山口。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 214,
    "name": "東埔登山口",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>東埔登山口位於東埔村1鄰，入口處立有牌樓式小型解說牌，可得知八通關越嶺線的路線、里程歷史背景等相關資訊。海拔約1,100公尺，鄰近東埔溫泉風景區，位處沙里仙溪與陳有蘭溪分水嶺。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 283,
    "name": "嘉明湖國家步道(園區外)",
    "org": "other",
    "orgName": "玉管處",
    "kind": "G",
    "photos": [],
    "intro": "<p><a href='https://jmlnt.forest.gov.tw/introduction/'target=\"_blank\">嘉明湖國家步道介紹(https://jmlnt.forest.gov.tw/introduction/)</a><BR>向陽登山口海拔約2,370公尺，位於南橫公路向陽地區，目前林業署已開發為向陽林遊樂區，登山口位於遊客中心後方。<BR>經度：120.9925 <BR>緯度：23.29388889<BR>(向陽登山口至三叉路口間非本處所轄)</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 8,
    "name": "山風登山口",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>為八通關越嶺步道之東段登山口，附近有山風瀑布、山風吊橋及溪流、棧道等景觀。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 210,
    "name": "玉山主峰",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [
      {
        "title": "玉山上的小精靈(從北峰看玉山)-陳芳宜攝(2009 攝影展金牌獎)",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/5b2bf2f0-4c76-4014-90b3-3a03bcfed459.jpg"
      },
      {
        "title": "玉山主峰雪景-謝新添攝",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/d086cd47-ecdf-4a7d-80dd-4094ea26a5b1.jpg"
      },
      {
        "title": "玉山主峰-李麗真攝(入選獎)",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/4b8b6646-2a60-476f-bcaa-d01a4d869f90.jpg"
      },
      {
        "title": "玉山主峰-林文和攝",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/8994aa34-bee6-466f-b35e-2f2e7f9d5866.jpg"
      }
    ],
    "intro": "<p>◎海拔高度：3952M<BR>◎位置：南投縣信義鄉、高雄市桃源區、嘉義縣阿里山鄉<BR>◎經緯度座標：東經120°56’56\"，北緯23°28’18\" <BR>◎TWD97TM2：X座標245634，Y座標2596329 <BR>◎三角點基石：一等三角點<BR>◎東北亞第一高峰。南北為峭壁，西為絕壑陡溝，東坡盡為滾礫石堆，地形險惡。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 216,
    "name": "玉山東峰",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [
      {
        "title": "玉山北峰山腰眺主東峰-許釗滂",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/fa6d8436-7e81-49b8-a09d-2672994147a3.jpg"
      },
      {
        "title": "遠眺玉山主東峰冬景-莊明景",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/3a8a2145-239f-471f-a92d-d8ea63d1cc27.jpg"
      }
    ],
    "intro": "<p>◎海拔高度：3869M\t<BR>◎位置：南投縣信義鄉、高雄市桃源區<BR>◎經緯度座標：東經120°57’27\"，北緯23°28’21\"<BR>◎TWD97TM2：X座標246442，Y座標2596412<BR>◎台灣十峻之一。外型因欣賞角度不同，既像僧又似堡壘。三面斷崖，形勢陡峭崢嶸，岩壁上寸草不生。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 212,
    "name": "玉山北峰",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [
      {
        "title": "玉山北峰-莊明景",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/2e5c105c-2b0c-4945-829b-39f65bc1b05e.jpg"
      }
    ],
    "intro": "<p>◎海拔高度：3858M\t<BR>◎位置：南投縣信義鄉<BR>◎經緯度座標：東經120°57’06\"，北緯23°29’21\" <BR>◎TWD97TM2：X坐標245860，Y坐標2598276<BR>◎山形呈東緩西峭的瘦狹狀山稜，北壁有崖崩，下臨陳有蘭溪。北峰之北另有北北峰。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 412,
    "name": "馬達拉溪登山口宿營地",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔:1750M。<BR>有穩定水源。<BR>有沖水式廁所。<BR>宿營者請自備過夜及睡眠裝備。<BR>經緯度座標:東經121.192257，北緯 24.484094。<BR>TWD97座標: X 269487 / Y 2708650。<BR>通訊品質: 尚可~不穩定。<BR></p><p>水源 : 活水、</p><p>訊號 : Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 217,
    "name": "玉山南峰",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：3844M\t<BR>位置： 高雄市桃源區<BR>◎經緯度座標：東經120°57’02\"，北緯23°26’54\"<BR>◎台灣十峻之一，但目前仍未確定三叉峰或閉鎖曲線峰何者為玉山南峰。其間相距五百公尺，幾乎無落差。三叉峰為一段狀如鋸齒尖刃的稜背。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 68,
    "name": "九九山莊",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [
      {
        "title": "九九山莊",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/3340fb6d-9b9e-4aeb-98e0-4f1114ed81e8.jpg"
      },
      {
        "title": "九九山莊-成功堡",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/4d161d59-4725-4c94-a831-8df1670f463a.jpg"
      },
      {
        "title": "九九山莊-龍門",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/2c60e960-7377-4093-a59b-fd0bacc3f367.jpg"
      }
    ],
    "intro": "<p>配合林保署新竹分署新竹分署辦理「九九山莊建物及設施整體改善工程」，調整九九山莊入園申請及住宿容宿量，詳情請參閱<a href='https://hike.taiwan.gov.tw/news_0_1.aspx?id=4765'>最新消息</a>。<BR><BR>九九山莊常見問答請參考：<a href='https://99online.forest.gov.tw/basic/?node=10011'>九九山莊常見問答</a><BR>住宿每人每晚清潔費用為新台幣200元整，目前已採線上繳費，詳請請參考<a href='https://99online.forest.gov.tw/'>九九山莊</a>網站，或電話詢問請撥：(03)522-4163分機245<BR>本處所核發入園證上床位序號係流水號，有關住宿安排由林業保育署新竹分署九九山莊現場管理員安排。<BR>海拔:2699M。<BR>穩定水源及太陽能照明。<BR>有沖水式廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備或向協作團體租借。<BR>經緯度座標:東經121.208353，北緯24.468835。<BR>TWD97座標: X 271120 / Y 2706972。<BR>通訊品質:需往西方前行約100公尺透空處，訊號品質佳。<BR><BR></p><p>水源 : 有、</p><p>訊號 : GSM、Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 246,
    "name": "南玉山",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：3383M\t<BR>◎位置：高雄市桃源區<BR>◎經緯度座標：東經120°55’00\"，北緯23°25’52\"<BR>◎山勢三面緩坡，南側有陡坡。山北鞍部東側有天然泉水自土穴外流。屬標準之單面山，傾斜坡上盡是玉山矢竹。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 247,
    "name": "東小南山",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：3744M\t<BR>◎位置：高雄市桃源區<BR>◎經緯度座標：東經120°57’19\"，北緯23°26’27\"<BR>◎山勢平凡，起伏不大，只見稜嶺而無明顯山頭。展望中央山脈視線最佳。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 248,
    "name": "鹿山",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：2981M\t<BR>◎位置：高雄市桃源區<BR>◎經緯度座標：東經120°58’50\"，北緯23°27’09\"<BR>◎玉山南峰東伸支稜尾端小山頭，位置偏遠孤立，三面臨溪。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 304,
    "name": "中霸山屋",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔:3295M。<BR>有收集雨水之儲水設備，不穩定。<BR>沒有廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備。<BR>經緯度座標:東經121.251286，北緯24.464724。<BR>TWD97座標: X 275473 / Y 2706524。<BR>通訊品質:尚可~不穩定。</p><p>水源 : 無、</p><p>訊號 : 無、</p>",
    "hasQueue": false
  },
  {
    "id": 211,
    "name": "玉山西峰",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：3518M\t<BR>◎位置：南投縣信義鄉，嘉義縣阿里山鄉<BR>◎東西向山脊，山頂為冷杉林所遮蔽。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 5,
    "name": "玉山前峰",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [
      {
        "title": "玉山前峰",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/8a8d0970-678d-4b08-b3f8-ad00692acbf3.jpg"
      },
      {
        "title": "玉山前峰登山口-何昌穎攝",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/bf0fdba0-fc00-43df-97d9-278a614f9b36.jpg"
      }
    ],
    "intro": "<p>◎海拔高度：3239M\t<BR>◎位置：南投縣信義鄉、嘉義縣阿里山鄉<BR>◎經緯度座標：東經120°54’34\"，北緯23°28’38\" <BR>◎玉山前峰海拔3,239 公尺，為百岳之一，外型瘦狹，登山口位於玉山步道2.7公里處，登山口距峰頂雖僅0.8 公里，但坡度甚陡，坡陡頂瘦，峰頂腹地不大，滿生箭竹，山形起伏不明顯，山南有巨大崩崖，南側山坡有完整白木林景觀。由此可眺望阿里山山脈及鹿林山一帶。最後登頂前300 公尺左右，須穿越大小石塊所堆疊的陡升區域，單程步行約1.5-2 小時登頂，山頂可眺望玉山主峰及西峰。<BR></p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 72,
    "name": "大霸尖山",
    "org": "other",
    "orgName": "雪管處",
    "kind": "N",
    "photos": [
      {
        "title": "中霸坪望大小霸尖山",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/9028c666-5adc-4fd5-9ec1-258502977fc9.jpg"
      },
      {
        "title": "大霸尖山",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/bf11f11b-d29d-45cd-a4bd-cfb9dabbdddc.jpg"
      }
    ],
    "intro": "<p>大霸尖山頂禁止攀登。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 250,
    "name": "馬西山",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：3443M<BR>◎位置：花蓮縣卓溪鄉<BR>◎經緯度座標：東經121°09’57\"，北緯23°29’08\"<BR>◎為中央山脈玉里山支脈上重要主峰。山頂平緩寬闊。馬嘎次托溪在馬西山與布干山之間形成平坦的「馬布谷」高原盆地。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 251,
    "name": "喀西帕南山",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：3264M\t<BR>◎位置：花蓮縣卓溪鄉<BR>◎經緯度座標：東經121°11’14\"，北緯23°28’14\" <BR>山頂全為短箭竹草坡，遠望為美麗大草原。南麓之平坦谷地呈南北狹長狀又稱「太平谷」或「喀西帕南盆地」。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 252,
    "name": "馬利加南山",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：3546M\t<BR>◎位置：南投縣信義鄉、花蓮縣卓溪鄉<BR>◎經緯度座標：東經121°06’33\"，北緯23°31’24\"<BR>◎山容高聳雄偉，基底呈三角形。與馬博拉斯山相連之稜背則危崖嶙峋。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 253,
    "name": "馬博拉斯山",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：3785M\t<BR>◎位置：南投縣信義鄉、花蓮縣卓溪鄉<BR>◎經緯度座標：東經121°03’33\"，北緯23°31’20\" <BR>◎又名烏拉孟山，台灣十峻之一。屬殘丘狀山峰，中央山脈在此作直角轉向，分出玉里山支稜、駒盆山支稜及黃當擴山支稜。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 254,
    "name": "駒盆山",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：3109M\t<BR>◎位置：南投縣信義鄉<BR>◎經緯度座標：東經121°01’57\"，北緯23°32’39\"<BR>◎為馬博拉斯山西北向陡降數百公尺之箭竹肩狀峰。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 255,
    "name": "秀姑巒山",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：3825M\t<BR>◎位置：南投縣信義鄉、花蓮縣卓溪鄉<BR>◎經緯度座標：東經121°02’58\"，北緯23°29’55\"<BR>◎中央山脈最高峰，峰頂呈三座矩形之小地壘狀。山麓秀姑坪滿佈圓柏、箭竹、白木林及高山杜鵑，景色獨特。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 256,
    "name": "八通關山",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：3335M<BR>◎位置：南投縣信義鄉<BR>◎經緯度座標：東經121°00’05\"，北緯23°29’31\"<BR>◎玉山山脈與中央山脈連接點。由雙峰組成，尖銳峰頂上展望極佳。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 257,
    "name": "大水窟山",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：3642M<BR>◎位置：南投縣信義鄉、花蓮縣卓溪鄉<BR>◎經緯度座標：東經121°01’50\"，北緯23°28’32\"<BR>◎圓緩山頂，上面箭竹如茵，屬最高準平原面。山名之由來為其側有「大水窟」高山湖泊。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 258,
    "name": "達芬尖山",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：3135M<BR>◎位置：南投縣信義鄉、花蓮縣卓溪鄉、高雄市桃源區<BR>◎經緯度座標：東經121°00’18\"，北緯23°26’04\"<BR>◎山頂尖銳，但高度並不大，因附近均無高峰，且起伏平緩，故地形相對突出。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 259,
    "name": "塔芬山",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：3070M<BR>◎位置：花蓮縣卓溪鄉、高雄市桃源區<BR>◎經緯度座標：東經121°01’07\"，北緯23°24’28\"<BR>◎山勢各面坡度均勻，自北眺望狀如金字塔，山南緩斜草坡上有高山湖泊二座，又名「塔芬池」。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 260,
    "name": "轆轆山",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：3267M<BR>◎位置：高雄市桃源區<BR>◎經緯度座標：東經120°59’24\"，北緯23°23’35\"<BR>◎偏於中央山脈主脊西側，由雙峰組成，南為陡崖深谷，北為原始密林。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 261,
    "name": "雲峰",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：3564M<BR>◎位置：高雄市桃源區<BR>◎經緯度座標：東經120°58’03\"，北緯23°21’19\"<BR>◎橫屏狀山容，南北側陡降深谷。附近有老年期平緩地形。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 262,
    "name": "南雙頭山",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：3288M<BR>◎位置：高雄市桃源區、花蓮縣卓溪鄉<BR>◎經緯度座標：東經121°00’09\"，北緯23°20’52\"<BR>◎三峰並峙，其中二峰高度相同。中央山脈於此曲折劇烈。稜脊東側有水池。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 264,
    "name": "新康山",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：3331M<BR>◎位置：花蓮縣卓溪鄉<BR>◎經緯度座標：東經121°07’10\"，北緯23°19’06\"<BR>◎台灣十峻之一。台灣東側最高峰，山勢高聳突兀，宛若天際碉堡。附近稜脈分叉轉折劇烈。<BR></p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 268,
    "name": "庫哈諾辛山",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：3115M<BR>◎位置：高雄市桃源區<BR>◎經緯度座標：東經120°55’59\"，北緯23°15’13\"<BR>◎關山北伸西折支稜上之殘丘狀山峰。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 269,
    "name": "關山",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：3668M<BR>◎位置：高雄市桃源區、台東縣海端鄉<BR>◎經緯度座標：東經120°54’13\"，北緯23°13’47\"<BR>◎台灣十峻之一。有「南台首嶽」之稱，金字塔狀山峰，僅南北二側淺箭竹坡可供攀頂。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 270,
    "name": "玉山小南山",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：3582M</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 433,
    "name": "連理山西峰",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：3161M</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 444,
    "name": "華巴諾山",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎海拔高度：1924M</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 389,
    "name": "賽良久營地",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔:2700M。<BR>沒有穩定水源。<BR>沒有廁所。<BR>宿營者請自配帳篷及相關宿營裝備。<BR>經緯度座標:東經121.260874，北緯24.349616。<BR>TWD97座標: X 276469 / Y 2693777。<BR>通訊品質:不穩定~無。</p><p>水源 : 無、</p><p>訊號 : GSM、Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 671,
    "name": "瓢簞山屋",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔:3135M。<BR>沒有穩定水源。<BR>坑洞式廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備。<BR>經緯度座標:東經121.25488，北緯24.35571。<BR>TWD97二度分帶座標: X 275860 , Y 2694442。<BR>可通訊電信商:中華電信、台灣大哥大(7.5K)。<BR></p><p>水源 : 有、</p><p>訊號 : GSM、Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 672,
    "name": "瓢簞營地",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔:3135M。<BR>沒有穩定水源。<BR>坑洞式廁所。<BR>宿營者請自配帳篷及相關宿營裝備。<BR>經緯度座標:東經121.254742，北緯24.355767。<BR>TWD97座標: X 275846 , Y 2694448。<BR>可通訊電信商:中華電信、台灣大哥大(7.5K)。<BR></p><p>水源 : 有、</p><p>訊號 : GSM、Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 391,
    "name": "雪山山莊舊址營地",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔:3335M。<BR>需下切溪谷找水源，來回約50分鐘。<BR>沒有廁所。<BR>請自配帳篷及相關宿營裝備。<BR>經緯度座標:東經121.237291，北緯24.376272。<BR>TWD97座標: X 274071 / Y 2696725。<BR>通訊品質:無訊號。<BR></p><p>水源 : 無、</p><p>訊號 : Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 670,
    "name": "油婆蘭山屋",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔:3270M。<BR>油婆蘭池水源，水質不佳，需過濾煮沸。<BR>坑洞式廁所。<BR>經緯度座標:東經121.20623，北緯24.32371。<BR>TWD97二度分帶座標: X 270929 , Y 2690889。<BR>可通訊電信商：中華電信(油婆蘭三叉路口)。</p><p>水源 : 有、</p><p>訊號 : GSM、Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 673,
    "name": "油婆蘭營地",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔：3270M。<BR>水源：油婆蘭池，水質不佳，需過濾煮沸。<BR>坑洞式廁所。<BR>宿營者請自配帳篷及相關宿營裝備。<BR>經緯度座標:東經121.20623，北緯24.32371。<BR>TWD97二度分帶座標: X 270929 , Y 2690889。<BR>可通訊電信商：中華電信(油婆蘭三叉路口)。</p><p>水源 : 有、</p><p>訊號 : GSM、Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 359,
    "name": "孟祿亭",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>由塔塔加登山口到步道1.7公里的「孟祿亭」，海拔約2,838 公尺，附近有處大崩塌地，民國41 年秋天，任職美國共同安全總署中國分署稅務顧問孟祿先生，於登玉山途中在此滑落墜崖不幸喪生，孟祿亭即為紀念其對臺灣貢獻而建。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 393,
    "name": "完美谷營地",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔:3320M。<BR>沒有水源。<BR>沒有廁所。<BR>宿營者請自配帳篷及相關宿營裝備。<BR>經緯度座標:東經121.208571，北緯24.366263。<BR>TWD97座標: X 271160 / Y 2695611。<BR>通訊品質:不穩定~無。<BR></p><p>水源 : 無、</p><p>訊號 : Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 2,
    "name": "玉山前峰登山口",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [
      {
        "title": "玉山前峰登山口-何昌穎攝",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/0bc810a9-5511-4011-ab1c-f16d8b292225.jpg"
      }
    ],
    "intro": "<p>玉山前峰海拔3,239 公尺，為百岳之一，登山口位於玉山步道2.7公里處，登山口距峰頂雖僅0.8 公里，但坡度甚陡，最後登頂前300 公尺左右，須穿越大小石塊所堆疊的陡升區域，單程步行約1.5-2 小時登頂，山頂可眺望玉山主峰及西峰。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 360,
    "name": "白木林",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>由塔塔加登山口到步道5公里的「白木林觀景臺」上已可仰見雄偉的主峰，並可看見夾雜在箭竹林中，沿著之字型步道參差林立的白木林，因此處曾發生森林火災，目前殘存鐵杉及冷杉樹幹白化後所形成的「白木林景觀」，讓登山旅人感受昔日森林火災對山林所造成的傷害。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 405,
    "name": "大峭壁",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>由塔塔加登山口到步道6.7公里的「大峭壁」，步道由巨大的岩壁下通過，屬板岩夾變質砂岩構成的岩層，大峭壁上尚存生痕化石痕跡，可證臺灣為歐亞大陸板塊及菲律賓板塊相互擠壓而自海中隆起。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 406,
    "name": "玉山主峰碎石坡",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>穿出玉山圓柏夾雜著玉山小蘗的「之」字形步道，進入以板岩變質砂岩構成的碎石坡地帶，碎石坡因處於造山帶強烈擠壓形成褶皺構造，復在天寒地凍，日夜溫差甚大下，益加速其風化，草木不易生長。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 407,
    "name": "玉山風口",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>玉山主峰碎石坡之上即為「風口」，因冬季3,000 公尺以上高空氣流均<BR>來自西南，玉山冬季最強勁西南風，多沿玉山主峰與西峰間的楠梓仙溪上方縱谷順勢北上，吹過玉山「風口」，令人舉步維艱，風口通道除架有鋼構護網防範落石外，沿途均掛置鐵鍊以供雪季時攀扶使用，惟登山者仍需步步為營確保本身安全，切勿逞能大意。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 376,
    "name": "瓦拉米",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [
      {
        "title": "瓦拉米山屋(邱宇中拍攝)",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/b4c5458d-1826-4734-b307-e0edfa335d49.jpg"
      },
      {
        "title": "瓦拉米山屋(吳和融拍攝)",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/937b8d01-06b5-4460-9da1-bea6d9b1a5a8.jpg"
      }
    ],
    "intro": "<p>瓦拉米，海拔1,068 公尺，布農語Maravi 其意為「一起來」、「跟著來」。日語音譯為Walabi ，日本人以語音轉為與「蕨」同音，故現今地名採日語音譯而作「瓦拉米」，顯示此地原有許多蕨類植物生長，為亞熱帶雨林典型的指標性植物。周邊生物多樣性豐富，早期為布農族所利用的民俗植物甚多，如臺灣胡桃、山黃麻、臺灣二葉松、臺灣櫸、山枇杷、羅氏鹽膚木、魚藤、月桃等。<BR><BR>過去為日治時期警察駐在所，人員配置約15 人，西元1920 年6月29 日設置，西元1944 年撤廢。駐在所內設有酒保（警察及眷屬的專屬雜貨店），客間（招待所）、蕃童教育所、療養所等。瓦拉米部落屬喀西帕南社，居民以巒社為主。駐在所前方是塔洛木溪谷與海拔3,000 公尺的高峰喀西帕南山等景觀，下方是落差900 公尺的拉庫拉庫溪谷。<BR><BR>此地距步道口13.6 公里，約需一日行程，現有瓦拉米太陽能山屋一座，可提供24 人住宿，並設有24 人營位之露營地。<BR><BR>瓦拉米步道往返<BR>瓦拉米步道往返：步道入口－山風－佳心－黃麻－瓦拉米。（單程13.6 公里，往返全程27.2 公里。）<BR>◎山風登山口至東段步道7K里程處尚未進入本處生態保護區，為一般健行步道，不需辦理入園申請。東段步道7K里程處至瓦拉米需提前向玉山國家公園管理處申請入園許可。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 421,
    "name": "佳心",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>瓦拉米步道全長約14K，自『步道口－佳心』段約4.9K，屬特別景觀區；『佳心－瓦拉米』段約9.1K，步道7K後屬生態保護區。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 348,
    "name": "父子斷崖",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>父子斷崖舊稱「父不知子斷崖」，據傳有父子兩人行經此處，因路況險惡，無暇互相照應，因此才有「父不知子」的說法。斷崖距離登山口約有2 公里，由於本路段上方皆為峭壁，主要為變質黑色板岩夾雜砂岩所構成，是風化頁岩的大崩壁，因此常落石不斷驚險萬分。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 273,
    "name": "雲龍瀑布",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [
      {
        "title": "雲龍瀑布",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/8337107e-2edb-4de8-9e81-b97f58cfb8c0.jpg"
      }
    ],
    "intro": "<p>◎懸谷瀑步 名聞遐耳<BR>雲龍瀑布是八通關古道上最壯觀的瀑布，海拔約1,640 公尺，距東埔登山口約4.5公里處，位於陳有蘭溪支流樂樂溪上游，瀑布懸於步道旁岩壁上，為典型的懸谷瀑布，水量豐沛，終年不竭。為上中下三層的懸谷式瀑布，上層落差約30 公尺，中層落差約70 公尺，下層落差約40公尺，瀑布水量充盈甚為壯觀。由東埔一鄰入口進入至雲龍瀑布全長有4.3公里，來回至少8.6公里，海拔由1200M上至1600M左右，主要上坡路段是前段1.3公里的產業農路，之後古道路段大致平緩好行！<BR><BR>惟八通關古道雲龍路段，因該山徑原本就是多處屬岩層破碎地帶，有多處不時崩落碎石、岩屑、土方等地段，因為當地地質環境特殊，尚無法短期整治，提醒前往的遊客務必量力而行，注意安全！<BR><BR><BR>◎TWD97：X座標245222，Y座標2605746</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 272,
    "name": "觀高坪",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎觀高坪海拔約2,580公尺，位於八通關山至郡大山稜線低凹之鞍部，可眺望玉山主峰、東峰、郡大溪、陳有蘭及金門峒斷崖。<BR>◎TWD97：X座標249959，Y座標2599935</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 271,
    "name": "八通關",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>◎八通關海拔約2,800公尺，位於八通關古道上重要據點，附有清兵舊營址，有大片高山箭竹草原，為野生動物之原始生育地，亦為荖濃溪與陳有蘭溪之分水嶺，極富地形景觀之研究價值。<BR>◎TWD97：X座標249566，Y座標2598394</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 394,
    "name": "17K營地",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔:2495M。<BR>水源為沿途溪澗水。<BR>沒有廁所。<BR>宿營者請自配帳篷及相關宿營裝備。<BR>經緯度座標:。<BR>TWD97座標: X 256455 / Y 2692129。<BR>通訊品質:不穩定~無。<BR></p><p>水源 : 無、</p><p>訊號 : Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 395,
    "name": "26K營地",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔:2460M。<BR>水源為沿途溪澗水。<BR>沒有廁所。<BR>宿營者請自配帳篷及相關宿營裝備。<BR>經緯度座標: 121.081469，24.348346。<BR>TWD97座標: X 259095 / Y 2693398。<BR>通訊品質:不穩定~無。<BR></p><p>水源 : 無、</p><p>訊號 : Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 396,
    "name": "28K營地",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔:2415M。<BR>水源為沿途溪澗水。<BR>沒有廁所。<BR>宿營者請自配帳篷及相關宿營裝備。<BR>經緯度座標: 121.0893851，24.3367394。<BR>TWD97座標: X 259069 / Y 2692319。<BR>通訊品質:不穩定~無<BR></p><p>水源 : 有、</p><p>訊號 : Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 400,
    "name": "匹匹達山東鞍營地",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔:3410M。<BR>無水源。<BR>沒有廁所。<BR>宿營者請自配帳篷及相關宿營裝備。<BR>經緯度座標: 121.116128，24.329083。<BR>TWD97座標: X 261784  / Y 2691483。<BR>通訊品質:尚可~不穩定<BR></p><p>水源 : 無、</p><p>訊號 : 無、</p>",
    "hasQueue": false
  },
  {
    "id": 401,
    "name": "奇峻山營地",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔:3250M。<BR>無水源。<BR>沒有廁所。<BR>宿營者請自配帳篷及相關宿營裝備。<BR>經緯度座標: 121.132976，24.351327。<BR>TWD97座標: X 263492 / Y 2693948。<BR>通訊品質:不穩定~無。<BR></p><p>水源 : 無、</p><p>訊號 : 無、</p>",
    "hasQueue": false
  },
  {
    "id": 397,
    "name": "弓水營地",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔:2945M。<BR>有溪澗水源。<BR>沒有廁所。<BR>宿營者請自配帳篷及相關宿營裝備。<BR>經緯度座標: 121.158141，24.354730。<BR>TWD97座標: X 266045 / Y 2694327。<BR>通訊品質:不穩定~無。<BR></p><p>水源 : 有、</p><p>訊號 : Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 398,
    "name": "大南山西鞍營地",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔:3090M。<BR>有溪澗水源。<BR>沒有廁所。<BR>宿營者請自配帳篷及相關宿營裝備。<BR>經緯度座標: 121.163420，24.360821。<BR>TWD97座標: X 266580 / Y 2695003。<BR>通訊品質:尚可~不穩定。<BR></p><p>水源 : 有、</p><p>訊號 : Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 399,
    "name": "火石山下營地",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔:2975M。<BR>有溪澗水源。<BR>沒有廁所。<BR>宿營者請自配帳篷及相關宿營裝備。<BR>經緯度座標: 121.183799，24.380067。<BR>TWD97座標: X 268644 / Y 2697137。<BR>通訊品質:尚可~不穩定。<BR></p><p>水源 : 活水、</p><p>訊號 : Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 402,
    "name": "塔塔加遊客中心",
    "org": "other",
    "orgName": "玉管處",
    "kind": "N",
    "photos": [],
    "intro": "<p>塔塔加遊客中心入口前豎立著一根非常醒目的檜木杵，周邊搭建一方小平臺，平臺上可仰望玉山，平臺右方小徑可通往東埔大草原步道。遊客中心正前方廣場面對的是麟趾山翠綠的山稜，首先讓遊客視覺感受大山的震撼，進入遊客中心內配合多媒體、精美圖示、大幅海報及解說員等多元導覽解說，將玉山國家公園美景納於胸臆之中，讓遊客享受一趟意義非凡的國家公園生態之旅。<BR><BR>塔塔加名稱的由來<BR>塔塔加，舊稱「哆哆咖」，來自鄒族語稱「Tataka」音譯，意指架高的平台，係玉山山脈與阿里山山脈間如馬鞍狀的坳地，布農語稱「Ka-sia-sia-han」水鹿行走不小心打滑的意思，表示此區域鹿群多且地形潮濕。現為台21 線與台18 線交會點，也是兩條公路的最高點。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 655,
    "name": "南安遊客中心",
    "org": "other",
    "orgName": "玉管處",
    "kind": "G",
    "photos": [],
    "intro": "<p>「<a href=\"https://www.ysnp.gov.tw/TouristCenter/615b7d3b-6beb-43b9-9356-5044d18c57ae\" target=\"_blank\">南安遊客中心</a>」位於花蓮縣卓溪鄉卓清村，座落於拉庫拉庫溪河階臺地，距花蓮縣玉里鎮約10公里15分鐘車程，為玉山國家公園東部園區重要之據點。設有展示室、多媒體簡報、公廁、停車場等設施，提供遊客解說遊憩服務；登山隊伍於攀登瓦拉米步道或八通關越嶺道自東段起登前，需先至此入園報到。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 656,
    "name": "梅山遊客中心",
    "org": "other",
    "orgName": "玉管處",
    "kind": "G",
    "photos": [],
    "intro": "<p>梅山遊客中心位於高雄市桃源區台20線南橫公路進入玉山國家公園門戶，除提供遊客解說服務外，並設有布農文化展示中心以介紹原住民布農族文化；登山隊伍於攀登庫哈諾辛山或關山步道前，需先至此入園報到。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 356,
    "name": "排雲登山服務中心",
    "org": "other",
    "orgName": "玉管處",
    "kind": "G",
    "photos": [
      {
        "title": "排雲登山服務中心-何昌穎攝",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/M9588597b-fbf0-4b54-b64c-7bd12f0b2da9.jpg"
      }
    ],
    "intro": "<p>「<a href=\"https://www.ysnp.gov.tw/TouristCenter/c7d09dbf-4611-40ff-9ad8-6c108eae472d\" target=\"_blank\">排雲登山服務中心</a>」位於楠溪林道約300 公尺處，是前往玉山登峰必經的前哨站，也是入園管理服務中心。登山前遊客須先向毗鄰服務中心的警察小隊申辦入山許可證，再由<a href=\" https://hike.taiwan.gov.tw/news_7_1.aspx?ID=2686 \" target=\"_blank\">排雲登山服務中心進行入園查核手續</a>，並在此觀賞登山安全與國家公園相關規範的影片，提醒叮嚀登山人員於行程中應注意之安全事項，以期順利完成登山活動。</p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 85,
    "name": "雪北山屋",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [
      {
        "title": "雪北山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/30644454-5565-4541-845c-0e00d9d424f3.jpg"
      }
    ],
    "intro": "<p>海拔:3595M。<BR>有收集雨水之儲水設備，枯水期不穩定，有簡易太陽能照明。<BR>有坑洞式廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備。<BR>經緯度座標:東經121.242809，北緯24.411513。<BR>TWD97座標: X 274624/ Y 2700629。<BR>通訊品質:不穩定~無。<BR>請民眾依入園證之核准床位號碼入住使用。</p><p>水源 : 無、</p><p>訊號 : Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 83,
    "name": "素密達山屋",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [
      {
        "title": "素密達山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/9590d6d6-78c0-4363-992f-461cb146b7ff.jpg"
      }
    ],
    "intro": "<p>海拔:3485M。<BR>有收集雨水之儲水設備，枯水期不穩定，有簡易太陽能照明。<BR>有坑洞式廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備。<BR>經緯度座標:東經121.250721，北緯24.423256。<BR>TWD97座標: X 275424 / Y 2701931。<BR>通訊品質:不穩定~無。<BR>請民眾依入園證之核准床位號碼入住使用。</p><p>水源 : 無、</p><p>訊號 : Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 79,
    "name": "霸南山屋",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [
      {
        "title": "霸南山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/3ca68e49-1599-46c1-9bcd-ba17b463230d.jpg"
      }
    ],
    "intro": "<p>海拔:3105M。<BR>有收集雨水之儲水設備，枯水期不穩定，有簡易太陽能照明。<BR>有坑洞式廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備。<BR>經緯度座標:東經121.260944，北緯24.450776。<BR>TWD97座標: X 276455 / Y 2704981。<BR>通訊品質:不穩定~無。<BR>請民眾依入園證之核准床位號碼入住使用。</p><p>水源 : 無、</p><p></p>",
    "hasQueue": false
  },
  {
    "id": 413,
    "name": "馬洋山前營地",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔:2830M。<BR>有水源。<BR>無廁所。<BR>宿營者請自備過夜及睡眠裝備。<BR>經緯度座標:東經121.265210，北緯24.478020。<BR>TWD97座標: X 276882  / Y 2707988。<BR>通訊品質:不穩定~無。<BR></p><p>水源 : 無、</p><p>訊號 : Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 414,
    "name": "馬洋池營地",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>海拔:2795M。<BR>無水源。<BR>無廁所。<BR>宿營者請自備過夜及睡眠裝備。<BR>經緯度座標:東經121.266903，北緯24.487362。<BR>TWD97座標: X 277881  / Y 2708820。<BR>通訊品質:不穩定~無。<BR></p><p>水源 : 有、</p><p>訊號 : Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 382,
    "name": "雪山圈谷營地",
    "org": "other",
    "orgName": "雪管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>*開放期間：115年1月1日至3月31日<BR>一、位置： 雪山圈谷<BR>(一)【 經緯度座標值北緯24度23分14.05秒，東經121度14分13.61秒】<BR>(二)海拔 :3,640公尺。<BR>(三)里程牌示約為10K處，雪季路標的55號處。<BR>(四)每次開放30人紮營。<BR>二、開放紮營標準(未達條件時，請雪訓隊伍取消或變更原雪訓計畫)：<BR>(一)雪山圈谷雪尺達30公分以上開放。<BR>(二)所有參訓人員應將垃圾及排遺帶下山。<BR>(三)每日至多30人為限含一般訓練隊及專案保留隊。<BR><BR></p><p>水源 : 無、</p><p>訊號 : 無、</p>",
    "hasQueue": false
  },
  {
    "id": 124,
    "name": "黑水塘山屋",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [
      {
        "title": "黑水塘山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/Md6c507fc-0f74-4b83-9906-a808beae322e.jpg"
      }
    ],
    "intro": "<p>黑水塘山屋<BR><BR>冬季水源較不穩定及有照明設備。<BR>有坑洞式廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備。<BR>聯絡通訊品質:穩定。<BR>水源:有(集水桶、看天池水源)。<BR></p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 125,
    "name": "成功山屋",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [
      {
        "title": "成功山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/M55e90cc9-572c-47d8-90a8-18456ae8bed2.jpg"
      }
    ],
    "intro": "<p>成功山屋<BR><BR>冬季水源較不穩定及有照明設備。<BR>有坑洞式廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備。<BR>聯絡通訊品質:不穩。<BR>水源:有(乾溪溝活水源)。<BR><BR></p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 126,
    "name": "成功二號堡",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [
      {
        "title": "成功二號堡",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/M0dbf55dc-4766-4a8c-9636-e9a0a4a49fe5.jpg"
      }
    ],
    "intro": "<p>成功二號堡<BR><BR>冬季水源較不穩定。<BR>有坑洞式廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備。<BR>聯絡通訊品質:不穩。<BR>水源:有(乾溪溝活水源)。<BR><BR></p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 127,
    "name": "奇萊山屋(宿)",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [
      {
        "title": "奇萊山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/M042f0860-1826-4a2d-b34a-85376a325206.jpg"
      }
    ],
    "intro": "<p>奇萊山屋<BR><BR>冬季水源較不穩定及有照明設備。<BR>有坑洞式廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備。<BR>聯絡通訊品質:不穩。<BR>水源:有(需下切溪谷找活水源)。<BR><BR></p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 129,
    "name": "月形池",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p></p><p>水源 : 有、</p><p></p>",
    "hasQueue": false
  },
  {
    "id": 130,
    "name": "磐石中峰營地",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p></p><p>水源 : 無、</p><p></p>",
    "hasQueue": false
  },
  {
    "id": 131,
    "name": "鐵線斷崖前營地",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p></p><p>水源 : 無、</p><p></p>",
    "hasQueue": false
  },
  {
    "id": 132,
    "name": "白石營地",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p></p><p>水源 : 無、</p><p></p>",
    "hasQueue": false
  },
  {
    "id": 134,
    "name": "平安池營地",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p></p><p>水源 : 有、</p><p></p>",
    "hasQueue": false
  },
  {
    "id": 137,
    "name": "三岔路營地(帕托魯山登山口)",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p></p><p>水源 : 活水、</p><p></p>",
    "hasQueue": false
  },
  {
    "id": 138,
    "name": "研海林道12K工寮",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p></p><p>水源 : 無、</p><p></p>",
    "hasQueue": false
  },
  {
    "id": 144,
    "name": "磐石西峰下黑水塘營地",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p></p><p>水源 : 無、</p><p></p>",
    "hasQueue": false
  },
  {
    "id": 149,
    "name": "雲稜山屋",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [
      {
        "title": "雲稜山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/Mc5d793c6-be1f-4faa-8e14-d32073db03f7.jpg"
      }
    ],
    "intro": "<p>雲稜山屋<BR><BR>冬季水源較不穩定及有照明設備。<BR>有坑洞式廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備。<BR>聯絡通訊品質:不穩。<BR>水源:有(需下切溪谷找活水源)。<BR></p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 151,
    "name": "審馬陣山屋",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [
      {
        "title": "審馬陣山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/M00c1f67f-eccd-4668-b4d7-b0c5dcb18318.jpg"
      }
    ],
    "intro": "<p>審馬陣山屋<BR><BR>冬季水源較不穩定及有照明設備。<BR>有蹲式廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備。<BR>聯絡通訊品質:不穩。<BR>水源:有(集水桶、看天池水源)。<BR><BR></p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 152,
    "name": "南湖山屋",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [
      {
        "title": "南湖山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/Me389e793-5912-45b2-a5a4-5ed588ee2981.jpg"
      }
    ],
    "intro": "<p>南湖山屋<BR><BR>冬季水源較不穩定及有照明設備。<BR>有坑洞式廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備。<BR>聯絡通訊品質:不穩。<BR>水源:有(有溪澗活水源)。<BR><BR></p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 165,
    "name": "舊香菇寮",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p></p><p>水源 : 活水、</p><p></p>",
    "hasQueue": false
  },
  {
    "id": 166,
    "name": "南湖溪木屋",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [
      {
        "title": "南湖溪木屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/M9ed353aa-fcf3-467e-be38-35fe5474e125.jpg"
      }
    ],
    "intro": "<p></p><p>水源 : 活水、</p><p></p>",
    "hasQueue": false
  },
  {
    "id": 170,
    "name": "中央尖山西峰鞍部營地",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p></p><p>水源 : 無、</p><p></p>",
    "hasQueue": false
  },
  {
    "id": 173,
    "name": "甘薯南峰營地",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p></p><p>水源 : 無、</p><p></p>",
    "hasQueue": false
  },
  {
    "id": 175,
    "name": "耳無溪營地",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p></p><p>水源 : 活水、</p><p></p>",
    "hasQueue": false
  },
  {
    "id": 188,
    "name": "無明西峰",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p></p><p>水源 : 無、</p><p></p>",
    "hasQueue": false
  },
  {
    "id": 194,
    "name": "畢錄山登山口營地",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p></p><p>水源 : 活水、</p><p></p>",
    "hasQueue": false
  },
  {
    "id": 198,
    "name": "鋸山東峰前營地",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p></p><p>水源 : 無、</p><p></p>",
    "hasQueue": false
  },
  {
    "id": 207,
    "name": "最後水源營地",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p></p><p>水源 : 活水、</p><p></p>",
    "hasQueue": false
  },
  {
    "id": 287,
    "name": "驚嘆號水池",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p></p><p>水源 : 有、</p><p></p>",
    "hasQueue": false
  },
  {
    "id": 302,
    "name": "畢祿山主稜岔路口營地",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p></p><p>水源 : 無、</p><p></p>",
    "hasQueue": false
  },
  {
    "id": 459,
    "name": "布新營地(園區外)",
    "org": "other",
    "orgName": "玉管處",
    "kind": "H",
    "hasCampsiteQueue": true,
    "photos": [],
    "intro": "<p>布新營地位於國家公園範圍外</p><p></p><p></p>",
    "queueUrl": "campsite.html?org=yushan&kind=camp",
    "queueNodeId": 459,
    "hasQueue": true
  },
  {
    "id": 626,
    "name": "鋸東避難小屋",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [
      {
        "title": "鋸東避難小屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/Mc24f3828-8e4d-4ebb-bfca-fbd57cbe8a68.jpeg"
      }
    ],
    "intro": "<p>鋸東避難小屋<BR><BR>冬季水源較不穩定及有照明設備。<BR>有乾式生態廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備。<BR>聯絡通訊品質:不穩。<BR>水源:有(集水桶)。<BR><BR></p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 627,
    "name": "屏風避難山屋",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [
      {
        "title": "屏風避難山屋",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/M5ff6a454-ea36-4d12-836d-dfd4f858e081.jpeg"
      }
    ],
    "intro": "<p>屏風避難山屋<BR><BR>冬季水源較不穩定及有照明設備。<BR>有乾式生態廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備。<BR>聯絡通訊品質:不穩定。<BR>水源:有(集水桶)。<BR><BR></p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 666,
    "name": "雲稜營地",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [
      {
        "title": "雲稜營地",
        "url": "https://hike.taiwan.gov.tw/nationpark/manasystem/node/files/node/Mcac20c56-70b4-4cf7-9d90-7295541e453a.jpg"
      }
    ],
    "intro": "<p>雲稜營地<BR><BR>冬季水源較不穩定。<BR>有坑洞式廁所。<BR>住宿營地者，請自備過夜帳棚及睡眠裝備。<BR>聯絡通訊品質:不穩。<BR>水源:有(需下切溪谷找活水源)。<BR><BR></p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 667,
    "name": "南湖營地",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>南湖營地<BR><BR>冬季水源較不穩定<BR>有坑洞式廁所。<BR>住宿營地者，請自備過夜帳棚及睡眠裝備。<BR>聯絡通訊品質:不穩。<BR>水源:有(有溪澗活水源)<BR><BR></p><p></p><p></p>",
    "hasQueue": false
  },
  {
    "id": 691,
    "name": "磐石中峰避難小屋",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>磐石中峰避難小屋<BR><BR>冬季水源較不穩定及沒有照明設備。<BR>有乾式生態廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備。<BR>聯絡通訊品質:不穩。<BR>水源:有(集水桶)。<BR></p><p>水源 : 有、</p><p>訊號 : Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 692,
    "name": "三叉營地避難小屋",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>三叉營地避難小屋<BR><BR>冬季水源較不穩定及沒有照明設備。<BR>有乾式生態廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備。<BR>聯絡通訊品質:不穩。<BR>水源:有(集水桶)。<BR></p><p></p><p>訊號 : Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 693,
    "name": "大理石營地避難小屋",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p>大理石營地避難小屋<BR><BR>冬季水源較不穩定及沒有照明設備。<BR>有乾式生態廁所。<BR>住宿山屋者，請自備過夜及睡眠裝備。<BR>聯絡通訊品質:不穩。<BR>水源:有(集水桶)。<BR></p><p></p><p>訊號 : Handheld Transceiver、衛星、</p>",
    "hasQueue": false
  },
  {
    "id": 697,
    "name": "天空營地",
    "org": "other",
    "orgName": "太管處",
    "kind": "H",
    "photos": [],
    "intro": "<p></p><p>水源 : 無、</p><p>訊號 : GSM、Handheld Transceiver、</p>",
    "hasQueue": false
  }
];

window.PLACE_LIST = window.PLACE_DATA;
