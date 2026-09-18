/* ============================================================
   th-footer — 全站頁尾（原 Shared.jsx 的 Footer）
   ------------------------------------------------------------
   無互動。DOM 與 class 照原樣，唯一的例外是標題階層：
   2026-09-14（批次 1）h3／h4 改為 h2／h3，消除 h1 → h3 跳階（WCAG 1.3.1，
   設計檔 ACCESSIBILITY.md 同樣的修正）。class 沒動，外觀不變。

   2026-09-07 階段 3.0：原本寫死的 Tailwind 任意值已全部改為 tokens（13 處）。
   對照表（值逐一相同，非近似）：
     bg-[#243447]  → bg-[var(--footer)]
     bg-[#334155]  → bg-[var(--sub-footer)]
     text-[13px]   → text-[length:var(--fs-xs)]
     text-[14px]   → text-[length:var(--fs-sm)]
     text-[15px]   → text-[length:var(--fs-md)]
     pb-[2px]      → pb-0.5（Tailwind 內建級距，本身不是任意值）

   **字級一定要加 `length:` 型別提示**：Tailwind 無法從 `var()` 判斷那是顏色
   還是長度，寫 `text-[var(--fs-xs)]` 會被當成顏色而產生錯誤的 CSS。

   `lg:max-w-[65%]` 保留：那是版面比例而非設計數值，§6.6 的掃描條件
   （`[#` 或 `[NNpx`）也不涵蓋它。

   最後更新日期是抄自正式站的「全站」日期，與 th-page-shell 的「本頁」更新日期
   語意不同，兩者不一致屬正常，勿逕自對齊（2026-09-02 使用者裁決）。
   [待確認] 實際上線時此值的維護方式（人工填寫或由 CMS 帶出）。

   最後更新日期是抄自正式站的「全站」日期，與 th-page-shell 的「本頁」更新日期
   語意不同，兩者不一致屬正常，勿逕自對齊（2026-09-02 使用者裁決）。
   [待確認] 實際上線時此值的維護方式（人工填寫或由 CMS 帶出）。
   ============================================================ */
window.thComponents = window.thComponents || {};
window.thComponents["th-footer"] = {
  data() {
    return {
      siteUpdated: "2026-03-23",
      policyLinks: [
        { label: "隱私權宣告", url: "privacy.html" },
        { label: "資訊安全政策", url: "security.html" },
        { label: "資料開放宣告", url: "opendata.html" },
      ],
    };
  },
  template: `
    <footer class="bg-[var(--footer)] pt-12 mt-auto relative">
      <!-- 導盲磚：下方選單連結區（2026-09-14 無障礙骨架）。relative 是它的定位基準 -->
      <a class="th-accesskey th-accesskey-dark" id="AZ" href="#AZ" accesskey="Z"
         title="快速鍵 Alt+Z：下方選單連結區" aria-label="下方選單連結區（快速鍵 Alt+Z）"><span aria-hidden="true">:::</span></a>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row justify-between gap-12 lg:gap-10 mb-10">

          <div class="w-full lg:max-w-[65%] flex flex-col sm:flex-row gap-6">
            <div class="shrink-0">
              <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm">
                <img src="assets/logo-mark.png" alt="Logo" class="h-16 w-auto" />
              </div>
            </div>
            <div class="w-full">
              <div class="flex flex-col xl:flex-row xl:items-end justify-between mb-4 gap-2 pb-0.5">
                <h2 class="font-serif font-bold text-xl text-white tracking-wide leading-none">
                  臺灣登山申請一站式服務網
                </h2>
                <span class="text-slate-400 text-[length:var(--fs-xs)] leading-none mb-1 xl:mb-0">
                  最後更新日期：{{ siteUpdated }}
                </span>
              </div>
              <p class="text-[length:var(--fs-xs)] leading-relaxed text-slate-400 text-justify">
                本網站乃整合國家公園署之玉山、雪霸、太魯閣國家公園登山申請，林業及自然保育署之天池、嘉明湖、向陽、檜谷山屋營地及自然保護(留)區、野生動物保護區，以及警政署入山申請等服務。本站提供統一之申請入口，後續再由各機關個別審核。如有申請相關問題，歡迎透過聯絡我們向指定機關聯繫，謝謝。
              </p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-16 lg:gap-20 xl:gap-28 shrink-0 mt-4 lg:mt-0 lg:mr-8 xl:mr-16">
            <div>
              <h3 class="text-white font-bold text-[length:var(--fs-md)] mb-4 pb-2 border-b border-slate-600/50 inline-block w-full sm:w-auto leading-none">
                服務專區
              </h3>
              <!-- 常見問答＝公布欄第四個頁籤（帶 ?tab=faq 直接落在該頁籤）；
                   聯絡我們（對應舊站 mail.aspx、mail_1.aspx）連往 mail.html -->
              <ul class="space-y-3 text-[length:var(--fs-sm)]">
                <li>
                  <a href="news_7.html" class="th-footer-link text-slate-400 hover:text-white transition-colors">
                    常見問答
                  </a>
                </li>
                <li>
                  <a href="mail.html" class="th-footer-link text-slate-400 hover:text-white transition-colors">
                    聯絡我們
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 class="text-white font-bold text-[length:var(--fs-md)] mb-4 pb-2 border-b border-slate-600/50 inline-block w-full sm:w-auto leading-none">
                政策宣告
              </h3>
              <ul class="space-y-3 text-[length:var(--fs-sm)]">
                <li v-for="p in policyLinks" :key="p.label">
                  <a v-if="p.url" :href="p.url" class="th-footer-link text-slate-400 hover:text-white transition-colors">
                    {{ p.label }}
                  </a>
                  <th-todo-link v-else :label="p.label" :on-dark="true"></th-todo-link>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
      <div class="bg-[var(--sub-footer)] py-5 border-t border-slate-700/50 w-full">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div class="flex flex-col md:flex-row justify-between items-center w-full gap-4 text-[length:var(--fs-xs)] text-slate-300">
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
