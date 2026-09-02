/*
  線上申請教學
  內容來源：舊站 https://service.skyeyes.tw/hikenationpark/apply_teach.aspx
  （2026-09-02 逐字比對舊站原文校正四步驟文案）

  [待確認] 舊站各步驟附操作截圖（teach_pic_01／02a／02b／04.png），新版 UI 已改版，
  不得沿用舊站畫面，截圖待雛形定版後重拍（目前以佔位區塊呈現）。
  [待確認] 「申請進度查詢／許可證下載」為舊站主選單項目名稱；新版把該功能拆為
  「申請進度查詢」「申請資料異動」「繳費／退費查詢」三項（見 Shared.jsx ExperienceNav），
  正式選單名稱待確認，此處先沿用舊站名稱以免指到不存在的入口。
*/

const TEACH_STEPS = [
  {
    title: "確認路線可申請日期",
    body: "在首頁公告右方選擇預計入園的國家公園、登山路線及入園日期，點擊「查詢」按鈕後，系統會自動計算並顯示可申請日期。若非可申請期間，需等待可申請日再提出申請。",
    shot: "操作截圖待補：首頁可申請日期試算區（新版介面，定版後重拍）",
  },
  {
    title: "搜尋路線進入申請頁面",
    body: "提供兩種搜尋方式：",
    subs: [
      "從首頁「搜尋路線進入申請」輸入關鍵字選擇路線。",
      "點擊「登山申請」>「各項線上申請」，以關鍵字或分類查詢路線。",
    ],
    shot: "操作截圖待補：首頁路線搜尋、各項線上申請頁（新版介面，定版後重拍）",
  },
  {
    title: "閱讀說明及注意事項後填寫申請資料",
    body: "申請流程包括：",
    subs: [
      "勾選說明及注意事項並點擊「我同意」。",
      "填寫「登山總日數」與「入園日期」，設定各日「路線規劃」（若需入山證則同時填寫相關欄位）。",
      "填寫「登山隊伍」資料（申請人、成員、領隊、留守人）。",
      "若路線規劃包含宿營地點住宿，確認宿營床位剩餘數量。",
      "確認申請資料後提交。",
    ],
  },
  {
    title: "通知申請結果",
    body: "不論是否通過審核，系統皆會以簡訊及 Email 通知申請結果，因此申請時務必填寫可聯絡到的手機號碼與電子信箱。您也可以透過上方功能列的「登山申請」>「申請進度查詢／許可證下載」查詢申請結果。",
    shot: "操作截圖待補：申請進度查詢頁（新版介面，定版後重拍）",
  },
];

function ApplyTeachApp() {
  return (
    <div>
      <Header active="apply" />

      <PageHero
        trail={["登山申請", "線上申請教學"]}
        title="線上申請教學"
        lead="從確認可申請日期到收到申請結果，共四個步驟。首次使用本站申請入園者，建議先閱讀本頁後再開始送件。"
        updated="2026-09-02"
      />

      <div className="th-page has-nav">
        <div className="th-page-main">
          <SectionCard id="steps" title="申請流程四步驟" icon="fa-solid fa-list-ol">
            <StepList steps={TEACH_STEPS} />
          </SectionCard>

          <SectionCard id="next" title="準備好了嗎" icon="fa-solid fa-flag" flush>
            <LinkList
              items={[
                { label: "開始線上申請", href: "apply-1.html" },
                { label: "先看各機關登山須知", href: "notice.html" },
                { label: "查看國家公園步道分級", href: "information_6.html" },
                { label: "本站使用說明", href: "web_illustrate.html" },
              ]}
            />
          </SectionCard>
        </div>

        <PageNav
          items={[
            { id: "steps", label: "申請流程四步驟" },
            { id: "next", label: "準備好了嗎" },
          ]}
        />
      </div>

      <ExperienceNav />
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ApplyTeachApp />);
