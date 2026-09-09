/* ============================================================
   th-data-table — 資料表（原 Shared.jsx 的 DataTable）
   ------------------------------------------------------------
   v4 §5 階段 2 的五支清單沒有列它，但**遷移任何一頁有表格的頁面都需要它**：
   17 頁公告裡有 24 個 table 節點（a3 一頁就 14 個），open.html／campsite.html
   也都靠它。是 32 頁的共同依賴，與 th-page-shell 同級。

   props（與 React 版同名同義）：
     columns   [{ key, label, align, render }]
               render(row) 未給時直接輸出 row[key]
     rows      物件陣列
     rowKey    取列 key 的欄位名，預設 columns[0].key
     tableClass 附加在 table 上的修飾 class
               （React 版叫 className；Vue 的 class 會自動落到根節點，
                同名會打架，故改名。欄寬一律由 CSS 控制，禁 inline style）
     empty     無資料時的字樣，預設「查無資料」
     headRows  需要合併表頭時傳入，每列一組 { label, colSpan, rowSpan, align }。
               未傳則沿用 columns 的單層表頭。**合併表頭的最下層欄數必須與
               columns 對得起來**（tbody 一律由 columns 決定）。

   slots：
     cell（scoped，帶 { row, column, value }）
               需要在格子裡放連結／圖示等元素時用。React 版的 render 可以回
               JSX，但 prop 傳函式再回傳 VNode 在 Vue 裡不自然，所以：
                 - render 回**字串**  → 繼續用 render（公告頁的用法）
                 - 要回**元素**       → 用這個 slot

     data-label 供行動版卡片化以 ::before 顯示欄名，照原樣保留。

   ------------------------------------------------------------
   用了 cell slot 的表格會有次像素差（2026-09-08 實測，applySearch）
   ------------------------------------------------------------
   slot 會在內容前後各插入兩個**空字串文字節點**（Vue 的 fragment anchor，
   零寬）。它們不佔位，但會把儲存格內的文字切成多個 text run，而
   auto table layout 是依內容量測分配欄寬的——量測差 1/64 px，整欄就位移
   0.016px，於是字形邊緣的反鋸齒不同。

   實測 applySearch 送出後：1440px 只有 th-page-shell 那個已知的 43px；
   900px 共 246px、分散在 6 個小區段，最大通道差 50，欄寬差 0.016px，
   顏色與字型屬性逐一相同。**這是比對的偽陽性，不是樣式問題**，
   與 th-page-shell 檔頭記的 `更新日期：` 同一個機制。
   不要為了消掉它去改 DOM 結構。

   外觀沿用 shared.css 既有的 .th-table-wrap／.th-table／.th-table-empty，
   本元件不新增 CSS。
   ============================================================ */
window.thComponents = window.thComponents || {};
window.thComponents["th-data-table"] = {
  props: {
    columns: { type: Array, required: true },
    rows: { type: Array, default: () => [] },
    rowKey: { type: String, default: "" },
    tableClass: { type: String, default: "" },
    empty: { type: String, default: "查無資料" },
    headRows: { type: Array, default: null },
  },

  computed: {
    keyOf() { return this.rowKey || this.columns[0].key; },
    isEmpty() { return !this.rows || this.rows.length === 0; },
  },

  methods: {
    valueOf(row, col) {
      return col.render ? col.render(row) : row[col.key];
    },
    alignClass(x) {
      return x.align ? "is-" + x.align : "";
    },
    // colSpan／rowSpan 為 1 時不輸出屬性，與 React 版一致（避免多餘的 colspan="1"）
    spanOf(h, which) {
      var v = h[which];
      return v > 1 ? v : null;
    },
  },

  template: `
    <div v-if="isEmpty" class="th-table-empty">
      <i class="fa-regular fa-folder-open"></i>{{ empty }}
    </div>
    <div v-else class="th-table-wrap">
      <table :class="['th-table', tableClass]">
        <thead>
          <template v-if="headRows">
            <tr v-for="(hr, ri) in headRows" :key="ri">
              <th v-for="(h, hi) in hr" :key="hi"
                  :colspan="spanOf(h, 'colSpan')"
                  :rowspan="spanOf(h, 'rowSpan')"
                  :class="alignClass(h)">{{ h.label }}</th>
            </tr>
          </template>
          <tr v-else>
            <th v-for="c in columns" :key="c.key" :class="alignClass(c)">{{ c.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r[keyOf]">
            <td v-for="c in columns" :key="c.key" :data-label="c.label" :class="alignClass(c)">
              <slot name="cell" :row="r" :column="c" :value="valueOf(r, c)">{{ valueOf(r, c) }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
};
