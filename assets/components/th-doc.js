/* ============================================================
   th-doc.js — 須知文件的遞迴渲染器（原 NoticeDetail.jsx 的版面部分）
   ------------------------------------------------------------
   **這支檔案裡有四個元件，是全站唯一的例外，理由如下。**

   assets/components/_README.md 的規則是「一檔一元件」。這裡放四個
   （th-doc-inline／th-doc-paragraph／th-doc-list／th-doc-body）是因為它們是
   **同一個遞迴渲染器依 node 型別拆出來的分支**，彼此互相呼叫（body → list →
   body），單獨拿出任何一支都沒有用途。拆成四個檔只會得到四個不能單獨使用的檔。
   `th-data-table` 相反——它自己就是完整可用的元件，所以獨立一檔。

   ------------------------------------------------------------
   為什麼 17 頁公告的「版面」不能全部搬回 HTML
   ------------------------------------------------------------
   計畫 §5 階段 3 第 1 項是「版面 markup 從 JSX 搬回該頁 .html」。這對大多數頁
   成立，但 17 頁公告不是靜態版面——它們的內容是 `NOTICE_DETAILS[pageId]` 這個
   **遞迴資料結構**（節點型別 p／list／table／h／note，list 裡還能再包 table），
   17 頁共用同一個 renderer，加新頁只加資料、不改版面。

   所以這頁的遷移實際切成兩半：
     - **頁面外殼與區塊版面** → 搬進 notice_a1.html（那才是該頁的版面）
     - **文件內容的遞迴渲染** → 留在共用元件，因為它是 17 頁共用的邏輯，
       搬進任何一頁的 HTML 都會變成另外 16 頁複製一份

   把遞迴 renderer 硬寫成 in-DOM template 會需要 17 份一模一樣的巢狀 v-for，
   那正是 §3 配套規則說的「整頁版面搬進 JS 字串不可攤提」的反面：
   **一支數十行寫一次、17 頁共用，字串編輯的痛可以攤提。**

   全站 node 型別統計（2026-09-07 實測 window.NOTICE_DETAILS）：
     p 200 個、list 29 個、table 24 個、h 6 個、note 1 個。
     notice_a1 用到 p／list／table／note 四種（49／5／1／1），
     只差 `h`，所以第一頁做完就涵蓋了幾乎整個 renderer。
   ============================================================ */

/* 行首若是「1.」「(1)」「（一）」「一、」等條列記號，給懸掛縮排；文字本身不動 */
window.TH_DOC_MARKER = /^(\d+\s*[.、)]|[(（][\d一二三四五六七八九十]+[)）]|[一二三四五六七八九十]+、)/;

window.thComponents = window.thComponents || {};

/* ------------------------------------------------------------
   th-doc-inline — 一行內的文字與連結混排（原 Inline）
   parts 的元素是字串或 { text, href }；連結一律另開分頁。
   ------------------------------------------------------------ */
window.thComponents["th-doc-inline"] = {
  props: { parts: { type: Array, required: true } },
  methods: {
    isText(p) { return typeof p === "string"; },
  },
  template: `
    <template v-for="(p, i) in parts" :key="i">
      <template v-if="isText(p)">{{ p }}</template>
      <a v-else :href="p.href" target="_blank" rel="noopener noreferrer">{{ p.text }}</a>
    </template>
  `,
};

/* ------------------------------------------------------------
   th-doc-paragraph — 段落區塊（原 DetailParagraph）
   node.lines 是「每行一個 parts 陣列」。

   兩個判斷照原樣搬，不改行為：
   1. 段落首行像「領隊更換原則如下：」這種短句（單一字串、≤24 字、結尾冒號）
      且後面還有行 → 當子標題，**僅視覺區隔，不改字**
   2. 行首有條列記號 → 加 .is-item 給懸掛縮排
   ------------------------------------------------------------ */
window.thComponents["th-doc-paragraph"] = {
  props: { node: { type: Object, required: true } },
  computed: {
    head() {
      var lines = this.node.lines;
      if (lines.length < 2) return null;
      var first = lines[0];
      if (first.length !== 1 || typeof first[0] !== "string") return null;
      var text = first[0];
      return (text.length <= 24 && /[：:]$/.test(text)) ? first : null;
    },
    rest() {
      return this.head ? this.node.lines.slice(1) : this.node.lines;
    },
  },
  methods: {
    isItem(ln) {
      var first = typeof ln[0] === "string" ? ln[0] : "";
      return window.TH_DOC_MARKER.test(first);
    },
  },
  template: `
    <div class="th-doc-block">
      <h2 v-if="head" class="th-doc-h"><th-doc-inline :parts="head"></th-doc-inline></h2>
      <p v-for="(ln, i) in rest" :key="i" :class="['th-doc-line', { 'is-item': isItem(ln) }]">
        <th-doc-inline :parts="ln"></th-doc-inline>
      </p>
    </div>
  `,
};

/* ------------------------------------------------------------
   th-doc-table — 表格節點（原 DetailTable）
   把資料層的完整矩陣還原成正式站的合併儲存格外觀：
   正式站用 rowspan／colspan 合併，資料層已展開，node.dup 記著哪些位置是
   「續列／續欄」，那些格子留白。
   ------------------------------------------------------------ */
window.thComponents["th-doc-table"] = {
  props: { node: { type: Object, required: true } },
  computed: {
    // 置中的欄位：等級、里程與 O／X 標記，其餘靠左（照原樣）
    columns() {
      var centered = ["步道等級", "單程里程(往返里程)", "入園證", "入山證"];
      var dup = this.dupSet;
      return this.node.head.map(function (label, i) {
        return {
          key: "c" + i,
          label: label,
          align: centered.indexOf(label) >= 0 ? "center" : undefined,
          render: function (r) {
            return dup.has(r._i + "," + i) ? "" : r["c" + i];
          },
        };
      });
    },
    dupSet() {
      var s = new Set();
      (this.node.dup || []).forEach(function (pair) { s.add(pair[0] + "," + pair[1]); });
      return s;
    },
    rows() {
      return this.node.rows.map(function (r, i) {
        var o = { _k: "r" + i, _i: i };
        r.forEach(function (v, j) { o["c" + j] = v; });
        return o;
      });
    },
  },
  template: `
    <th-data-table :columns="columns" :rows="rows" row-key="_k"
                   table-class="th-table-compact th-table-grouped"></th-data-table>
  `,
};

/* ------------------------------------------------------------
   th-doc-list — 條列節點（原 DetailList）
   node.ordered 決定 ol／ul；每個 item 可帶 extra（巢狀表格）。
   ------------------------------------------------------------ */
window.thComponents["th-doc-list"] = {
  props: { node: { type: Object, required: true } },
  template: `
    <component :is="node.ordered ? 'ol' : 'ul'" class="th-doc-list">
      <li v-for="(it, i) in node.items" :key="i">
        <p v-for="(ln, j) in it.lines" :key="j" class="th-doc-line">
          <th-doc-inline :parts="ln"></th-doc-inline>
        </p>
        <th-doc-table v-for="(n, j) in (it.extra || [])" :key="'t' + j" :node="n"></th-doc-table>
      </li>
    </component>
  `,
};

/* ------------------------------------------------------------
   th-doc-body — 依 node 型別分派（原 DetailBody）
   ------------------------------------------------------------ */
window.thComponents["th-doc-body"] = {
  props: { body: { type: Array, required: true } },
  template: `
    <template v-for="(n, i) in body" :key="i">
      <th-doc-table v-if="n.t === 'table'" :node="n"></th-doc-table>
      <th-doc-list v-else-if="n.t === 'list'" :node="n"></th-doc-list>
      <h2 v-else-if="n.t === 'h'" class="th-doc-h">{{ n.text }}</h2>
      <p v-else-if="n.t === 'note'" class="th-doc-note">{{ n.text }}</p>
      <th-doc-paragraph v-else :node="n"></th-doc-paragraph>
    </template>
  `,
};
