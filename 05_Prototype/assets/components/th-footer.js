/* ============================================================
   th-footer — 全站頁尾（原 Shared.jsx 的 Footer）
   ------------------------------------------------------------
   無互動。DOM 與 class 照原樣，含四處 Tailwind 任意值
   （bg-[#243447]／bg-[#334155]／text-[13px] 等）。

   這些任意值違反計畫 §6.5，但**本輪刻意不改**：改成 tokens 會動到外觀
   （需逐一確認 #243447 是否等於 --footer、#334155 是否等於 --sub-footer），
   而階段 2 的驗收條件是外觀不變。v4 §8 已記載「Shared.jsx 那 23 處會在
   階段 2 搬遷時一併處理」——實際盤點後認為那是**階段 3 各頁遷移時**才該做的事，
   因為要同時改 markup 與 CSS 才能驗證，屬 §6.2「與 markup 同一次提交」的範圍。
   列入回報的待確認清單。

   最後更新日期是抄自正式站的「全站」日期，與 th-page-shell 的「本頁」更新日期
   語意不同，兩者不一致屬正常，勿逕自對齊（2026-09-02 使用者裁決）。
   [待確認] 實際上線時此值的維護方式（人工填寫或由 CMS 帶出）。
   ============================================================ */
window.thComponents = window.thComponents || {};
window.thComponents["th-footer"] = {
  data() {
    return {
      siteUpdated: "2026-03-23",
      policyLinks: ["隱私權宣告", "資訊安全政策", "資料開放宣告"],
    };
  },
  template: `
    <footer class="bg-[#243447] pt-12 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row justify-between gap-12 lg:gap-10 mb-10">

          <div class="w-full lg:max-w-[65%] flex flex-col sm:flex-row gap-6">
            <div class="shrink-0">
              <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm">
                <img src="assets/logo-mark.png" alt="Logo" class="h-16 w-auto" />
              </div>
            </div>
            <div class="w-full">
              <div class="flex flex-col xl:flex-row xl:items-end justify-between mb-4 gap-2 pb-[2px]">
                <h3 class="font-serif font-bold text-xl text-white tracking-wide leading-none">
                  臺灣登山申請一站式服務網
                </h3>
                <span class="text-slate-400 text-[13px] leading-none mb-1 xl:mb-0">
                  最後更新日期：{{ siteUpdated }}
                </span>
              </div>
              <p class="text-[13px] leading-relaxed text-slate-400 text-justify">
                本網站乃整合國家公園署之玉山、雪霸、太魯閣國家公園登山申請，林業及自然保育署之天池、嘉明湖、向陽、檜谷山屋營地及自然保護(留)區、野生動物保護區，以及警政署入山申請等服務。本站提供統一之申請入口，後續再由各機關個別審核。如有申請相關問題，歡迎透過聯絡我們向指定機關聯繫，謝謝。
              </p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-16 lg:gap-20 xl:gap-28 shrink-0 mt-4 lg:mt-0 lg:mr-8 xl:mr-16">
            <div>
              <h4 class="text-white font-bold text-[15px] mb-4 pb-2 border-b border-slate-600/50 inline-block w-full sm:w-auto leading-none">
                服務專區
              </h4>
              <!-- 常見問答＝公布欄第四個頁籤（帶 ?tab=faq 直接落在該頁籤）；
                   聯絡我們（舊站 contact.aspx）尚未建置，不給 \`#\` 假連結 -->
              <ul class="space-y-3 text-[14px]">
                <li>
                  <a href="news.html?tab=faq" class="text-slate-400 hover:text-white transition-colors">
                    常見問答
                  </a>
                </li>
                <li><th-todo-link label="聯絡我們" :on-dark="true"></th-todo-link></li>
              </ul>
            </div>
            <div>
              <h4 class="text-white font-bold text-[15px] mb-4 pb-2 border-b border-slate-600/50 inline-block w-full sm:w-auto leading-none">
                政策宣告
              </h4>
              <ul class="space-y-3 text-[14px]">
                <li v-for="p in policyLinks" :key="p">
                  <th-todo-link :label="p" :on-dark="true"></th-todo-link>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
      <div class="bg-[#334155] py-5 border-t border-slate-700/50 w-full">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div class="flex flex-col md:flex-row justify-between items-center w-full gap-4 text-[13px] text-slate-400">
            <div class="font-medium text-slate-300 shrink-0">
              Copyright © 內政部國家公園署 著作權所有
            </div>
            <div class="flex items-center justify-end gap-3 text-right">
              <span>建議使用 Chrome、Edge 或 Safari 瀏覽器</span>
              <span class="hidden sm:inline opacity-30">|</span>
              <span>建議螢幕解析度 1440 x 960 以上</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
};
