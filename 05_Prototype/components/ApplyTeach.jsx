// DEPRECATED 2026-09-08：該頁已遷移為 Vue（apply_teach.html ＋ components/apply-teach.js），本檔已無任何
// <script> 引用，請勿編輯。實際刪除排在階段 4——階段 3 剩餘頁面
// 仍需對照 Shared.jsx，故舊 JSX 一併保留到階段 3 結束。
/*
  線上申請教學
  內容來源：正式站 https://hike.taiwan.gov.tw/apply_teach.aspx
  （2026-09-02 逐字比對正式站原文校正四步驟文案；service.skyeyes.tw 那份內容完全相同）

  操作截圖：依使用者 2026-09-02 指示，直接沿用正式站 hike.taiwan.gov.tw 的四張圖
  （teach_pic_01／02a／02b／05.png，第三步原本就無圖），存於 assets/teach/。
  [待確認] 這些是**舊介面**畫面，新版 UI 定版後應以新介面重拍替換，交付前務必確認。
  進度查詢的入口名稱以正式站**實際主選單**為準：「登山申請」>「申請進度查詢／繳費／異動／取消」。
  正式站教學頁內文另寫成「申請進度查詢／許可證下載」，與自家選單不符（內文過期），不採用。
  （2026-09-02 查證正式站導覽列後確認）
*/

const TEACH_STEPS = [
  {
    title: "確認路線可申請日期",
    body: "在首頁公告右方選擇預計入園的國家公園、登山路線及入園日期，點擊「查詢」按鈕後，系統會自動計算並顯示可申請日期。若非可申請期間，需等待可申請日再提出申請。",
    pics: [{ src: "assets/teach/teach_pic_01.png", alt: "首頁右方「可申請日期試算」區塊：選擇單位、路線與預計入園日期後點擊查詢，系統顯示可申請日期區間" }],
  },
  {
    title: "搜尋路線進入申請頁面",
    body: "搜尋路線以進入申請，目前提供兩種方式：",
    subs: [
      "從首頁「搜尋路線進入申請」輸入關鍵字後，選擇指定申請路線。",
      "從首頁上方功能列點擊「登山申請」>「各項線上申請」，進入登山線上申請畫面，以關鍵字或路線分類查詢後選擇指定路線。",
    ],
    pics: [
      { src: "assets/teach/teach_pic_02a.png", alt: "方法一：首頁「搜尋路線進入申請」輸入關鍵字後，下拉出現符合的路線清單" },
      { src: "assets/teach/teach_pic_02b.png", alt: "方法二：上方功能列「登山申請」展開後選擇「各項線上申請」" },
    ],
  },
  {
    title: "閱讀說明及注意事項後填寫申請資料",
    body: "申請流程包括：",
    subs: [
      "勾選說明及注意事項並點擊「我同意」。",
      "填寫「登山總日數」與「入園日期」，並為每一個登山日設定「路線規劃」。若該路線須同時申請「入山證」，系統會顯示入山申請相關欄位，一併填妥後才能進入下一步。",
      "填寫「登山隊伍」資料（申請人、成員、領隊、留守人）。",
      "若路線規劃包含宿營地點住宿，確認宿營床位剩餘數量。",
      "再次確認申請資料無誤後提交申請。",
    ],
  },
  {
    title: "通知申請結果",
    body: "不論是否通過審核，系統皆會以簡訊及 Email 通知申請結果，因此申請時務必填寫可聯絡到的手機號碼與電子信箱。您也可以透過上方功能列的「登山申請」>「申請進度查詢／繳費／異動／取消」查詢申請結果。",
    pics: [{ src: "assets/teach/teach_pic_05.png", alt: "上方功能列「登山申請」>「申請進度查詢/繳費/異動/取消」，進入後選擇申請進度查詢、申請資料異動及取消、國家公園線上繳費或線上退費" }],
  },
];

function ApplyTeachApp() {
  return (
    <div>
      <Header active="apply" />

      <PageShell
        trail={["登山申請", "線上申請教學"]}
        title="線上申請教學"
        lead="從確認可申請日期到收到申請結果，共四個步驟。首次使用本站申請入園者，建議先閱讀本頁後再開始送件。"
        updated="2026-09-02"
        nav={<PageNav
               items={[
                 { id: "steps", label: "申請流程四步驟" },
                 { id: "next", label: "準備好了嗎" },
               ]}
             />}
      >
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
      </PageShell>

      <ExperienceNav />
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ApplyTeachApp />);
