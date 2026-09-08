/* ============================================================
   th-table-pager — 查詢型頁面共用分頁（原 Shared.jsx 的 BulletinPager）
   ------------------------------------------------------------
   這是計畫 §5 階段 2 預留的 th-table-pager，本輪（遷移 news 與 open）實作。
   原元件的兩個消費端就是這兩頁，遷移後 .bulletin-pager* 的擁有者變成本元件，
   CSS 已依 §4.2 複製進 components.css。

   頁碼採視窗式呈現（目前頁前後各兩頁，首末頁固定，中間以 … 省略）——
   路線開放狀態有 479 筆共 24 頁，把頁碼全部列出會比表格還寬。
   資料不足一頁時整個元件不顯示（v-if）。

   props：page（目前頁，1 起算）、totalPages
   emits：change(頁碼) —— 對應原本的 onChange
   ============================================================ */
window.thComponents = window.thComponents || {};
window.thComponents["th-table-pager"] = {
  props: {
    page: { type: Number, required: true },
    totalPages: { type: Number, required: true },
  },
  emits: ["change"],
  computed: {
    /* 與原碼同一套算法：首末頁 ＋ 目前頁前後各兩頁，斷開處插入 gap */
    items() {
      var win = {};
      win[1] = true;
      win[this.totalPages] = true;
      for (var i = this.page - 2; i <= this.page + 2; i++) {
        if (i >= 1 && i <= this.totalPages) win[i] = true;
      }
      var nums = Object.keys(win).map(Number).sort(function (a, b) { return a - b; });
      var out = [];
      nums.forEach(function (n, idx) {
        if (idx > 0 && n - nums[idx - 1] > 1) out.push({ gap: true, key: "gap-" + n });
        out.push({ n: n, key: n });
      });
      return out;
    },
  },
  template: `
    <nav v-if="totalPages > 1" class="bulletin-pager" aria-label="分頁">
      <button type="button" class="bulletin-page-btn" :disabled="page === 1"
              @click="$emit('change', page - 1)">上一頁</button>
      <template v-for="it in items" :key="it.key">
        <span v-if="it.gap" class="bulletin-page-gap">…</span>
        <button v-else type="button"
                :class="['bulletin-page-btn', { 'is-active': it.n === page }]"
                :aria-current="it.n === page ? 'page' : null"
                @click="$emit('change', it.n)">{{ it.n }}</button>
      </template>
      <button type="button" class="bulletin-page-btn" :disabled="page === totalPages"
              @click="$emit('change', page + 1)">下一頁</button>
    </nav>
  `,
};
