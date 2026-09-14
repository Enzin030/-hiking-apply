/* th-breadcrumb — 麵包屑（原 Shared.jsx 的 Breadcrumb）
   trail 元素可為字串或 { label, href }：中間層級沒有 href 時輸出純文字，
   不給 `#` 假連結。最後一層一律是 .th-crumb-current。

   申請流程共用的中間層級（原 APPLY_CRUMB）：
     window.TH_APPLY_CRUMB = { label: "登山線上申請", href: "apply-1.html" }
   四支流程頁（apply-2／apply-3／forest-camp-1／2）都掛在它底下。
   一級的「登山申請」在正式站沒有自己的頁面，故維持純文字。 */
window.TH_APPLY_CRUMB = { label: "登山線上申請", href: "apply-1.html" };

window.thComponents = window.thComponents || {};
window.thComponents["th-breadcrumb"] = {
  props: { trail: { type: Array, default: () => [] } },
  computed: {
    /* 區塊名稱 → 該區塊的落點頁。取自 th-header 的主選單資料：
       有 url 的一級項目用自己的 url，只有子選單的用第一個有 url 的子項。
       2026-09-14（批次 2）依設計檔讓中間層級可點；**查不到就維持純文字**，
       不給 `#` 假連結（設計檔的中間層級是 href="#"，那是死連結，不照抄）。 */
    sectionHrefs() {
      var map = {};
      (window.TH_HEADER_NAV || []).forEach(function (n) {
        if (n.url) { map[n.label] = n.url; return; }
        var first = (n.children || []).find(function (c) { return !!c.url; });
        if (first) map[n.label] = first.url;
      });
      return map;
    },

    items() {
      var map = this.sectionHrefs;
      return this.trail.map(function (t, i) {
        var label = typeof t === "string" ? t : t.label;
        var href = typeof t === "string" ? null : t.href;
        return { label: label, href: href || map[label] || null, index: i };
      });
    },
  },
  template: `
    <div class="th-crumb">
      <a href="index.html" aria-label="首頁"><i class="fa-solid fa-house" aria-hidden="true"></i></a>
      <template v-for="(it, i) in items" :key="i">
        <i class="fa-solid fa-angle-right" aria-hidden="true"></i>
        <span v-if="i === items.length - 1" class="th-crumb-current">{{ it.label }}</span>
        <a v-else-if="it.href" :href="it.href">{{ it.label }}</a>
        <span v-else>{{ it.label }}</span>
      </template>
    </div>
  `,
};
