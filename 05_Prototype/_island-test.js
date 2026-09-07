/* 階段 1 驗收頁的初始化腳本（由 head-loader 的 data-page-init 載入，排在最後一支）。
   只登記 root options，實際 createApp／註冊／mount 由 assets/app-boot.js 負責。 */

// 示範共用元件的登記方式（階段 2 的每支元件檔都這樣寫）
window.thComponents = window.thComponents || {};
window.thComponents["th-demo-badge"] = {
  props: { label: { type: String, required: true } },
  template: '<span class="inline-block mt-3 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs">{{ label }}</span>',
};

thPage({
  data() {
    return { title: "掛載成功", count: 0 };
  },
});
