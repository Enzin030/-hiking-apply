/* ============================================================
   th-back-to-top — 右下角回到頂端按鈕
   ------------------------------------------------------------
   對照舊站 `#gotop`（緊接在 `#f_search` 快捷選單之後，向上箭頭 ＋「Top」），
   2026-09-21 由正式站 apply_1_2.aspx 原始碼確認樣式與文案。

   位置：快捷選單（.th-quickbtn，bottom:24px）的**正上方**。
   **那個位置永遠保留**——按鈕未出現時只是 visibility:hidden，不從流程移除，
   所以快捷選單不會因為它出現／消失而跳動。

   顯示條件：捲動超過一個視窗高度（scrollY > innerHeight）才淡入。

   捲動監聽用 passive listener，並以 requestAnimationFrame 節流——
   同意書頁有 21 條、頁面很長，未節流時每次捲動都重算會掉影格。
   ============================================================ */
window.thComponents = window.thComponents || {};
window.thComponents["th-back-to-top"] = {
  data() {
    return { shown: false, ticking: false };
  },
  mounted() {
    this.onScroll = () => {
      if (this.ticking) return;
      this.ticking = true;
      requestAnimationFrame(() => {
        this.shown = window.scrollY > window.innerHeight;
        this.ticking = false;
      });
    };
    window.addEventListener("scroll", this.onScroll, { passive: true });
    this.onScroll();
  },
  unmounted() {
    window.removeEventListener("scroll", this.onScroll);
  },
  methods: {
    toTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
  template: `
    <button type="button" class="th-gotop" :class="{ 'is-shown': shown }"
            @click="toTop" :tabindex="shown ? 0 : -1" :aria-hidden="shown ? 'false' : 'true'">
      <i class="fa-solid fa-angle-up" aria-hidden="true"></i>
      <span>Top</span>
    </button>
  `,
};
