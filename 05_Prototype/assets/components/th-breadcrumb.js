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
    items() {
      return this.trail.map(function (t, i) {
        return {
          label: typeof t === "string" ? t : t.label,
          href: typeof t === "string" ? null : t.href,
          index: i,
        };
      });
    },
  },
  template: `
    <div class="th-crumb">
      <a href="index.html" aria-label="首頁"><i class="fa-solid fa-house"></i></a>
      <template v-for="(it, i) in items" :key="i">
        <i class="fa-solid fa-angle-right"></i>
        <span v-if="i === items.length - 1" class="th-crumb-current">{{ it.label }}</span>
        <a v-else-if="it.href" :href="it.href">{{ it.label }}</a>
        <span v-else>{{ it.label }}</span>
      </template>
    </div>
  `,
};
