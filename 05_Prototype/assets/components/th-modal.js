/* ============================================================
   th-modal — 全站標準彈窗外殼
   ------------------------------------------------------------
   涵蓋範圍（v4 §5 階段 2 ＋ §9 要求）：
   - 全站標準 modal 外殼 `.bulletin-modal`（open.html 的 LevelModal／NoteModal、
     news.html 的公告彈窗都是這個外觀）
   - `campsite.html` 的 **DayModal** 與 **ForestryDayModal**（含 Esc 關閉）
     → 兩者的差別只在 body 內容，外殼與關閉行為完全相同，所以**不做成兩支元件**，
       body 交給預設 slot。這正是 Vue slot 比 React 那邊划算的地方：原本
       DayModal／ForestryDayModal 各自重複了一份 overlay＋head＋close 的 markup
       與一份 Esc useEffect，這裡只有一份。

   外觀規格（計畫 §5 階段 2）：遮罩透明度 0.55 ＋ blur、圓角 --r-xl、
   max-height:85vh、head 不加 bg-2 底色與左側色條、h2 用 --fs-lg、
   關閉鈕 --fg-4。以上全部由 assets/css/components.css 的 .bulletin-modal-*
   規則提供，本元件不新增任何 CSS（見 assets/components/_README.md）。

   ------------------------------------------------------------
   關閉方式（三種，與改版前相同）
   ------------------------------------------------------------
   1. 點關閉鈕
   2. 點遮罩（內容區 @click.stop，點內容不會關）
   3. 按 Esc

   Esc 的 listener 只在 modal 開啟期間存在（v-if 掛載時 mounted／關閉時
   unmounted），所以多層 modal 不會互相誤關——這點與 React 版
   `useEffect(..., [onClose])` 的效果相同。

   ------------------------------------------------------------
   焦點管理（2026-09-29 補上，WAI-ARIA APG Dialog (Modal) Pattern）
   ------------------------------------------------------------
   原本元件完全不管焦點：開啟後焦點留在背後的頁面，Tab 會一路走到遮罩底下的連結，
   螢幕報讀器也不知道這是對話框。現在：
   - 容器加 role="dialog"、aria-modal="true"，以標題 h2 為 aria-labelledby
     （用 head slot 自訂標題時，改指向 slot 內第一個 h2／h3，沒 id 就補一個；
       連標題元素都沒有才退回 aria-label＝title 或 meta）
   - 開啟：焦點移到彈窗內第一個可聚焦元素（通常是關閉鈕）。**頁面若在自己的
     $nextTick 已把焦點移進彈窗**（例如首頁試算彈窗聚焦第一個欄位），以頁面為準，不再搶。
   - Tab／Shift+Tab 在彈窗內循環，不會跑到背後的頁面
   - 關閉：焦點還給開啟前所在的元素（還在畫面上才還）。頁面自己另有還焦點邏輯的
     （首頁試算彈窗）照常執行，兩者指向同一個元素，不衝突。

   ------------------------------------------------------------
   用法
   ------------------------------------------------------------
     <th-modal v-if="day" :title="day.sdate" :meta="site.name" @close="day = null">
       …body…
     </th-modal>

   props：
     title      標題（h2）
     meta       標題上方的小字（原 .bulletin-modal-meta，如宿營地名稱）
     closeLabel 關閉鈕的 aria-label，預設「關閉」
     bodyClass  附加在 .bulletin-modal-body 上的修飾 class
                （campsite 用 "p-campsite-daybody"）
   emits：
     close      關閉鈕／遮罩／Esc 都會發同一個事件，由頁面決定怎麼收
   slots：
     預設        body 內容
     head       需要完全自訂標題區時用（給了就不出 title／meta）
     foot       需要頁尾按鈕列時用
   ============================================================ */
window.thComponents = window.thComponents || {};
window.thComponents["th-modal"] = {
  props: {
    title: { type: String, default: "" },
    meta: { type: String, default: "" },
    closeLabel: { type: String, default: "關閉" },
    bodyClass: { type: String, default: "" },
  },

  emits: ["close"],

  data() {
    // 標題 id 流水號（aria-labelledby 用）；計數器掛在元件定義上，不污染全域
    var def = window.thComponents["th-modal"];
    def._seq = (def._seq || 0) + 1;
    return { titleId: "th-modal-title-" + def._seq, headTitleId: null };
  },

  mounted() {
    var self = this;
    this._returnTo = document.activeElement;
    this._onKey = function (e) { if (e.key === "Escape") self.$emit("close"); };
    document.addEventListener("keydown", this._onKey);
    this.$nextTick(function () {
      var box = self.$refs.dialog;
      if (!box) return;
      if (self.$slots.head) {
        var h = box.querySelector(".bulletin-modal-head h2, .bulletin-modal-head h3");
        if (h) { if (!h.id) h.id = self.titleId; self.headTitleId = h.id; }
      }
      if (box.contains(document.activeElement)) return;
      var list = self.focusables();
      (list[0] || box).focus();
    });
  },

  unmounted() {
    document.removeEventListener("keydown", this._onKey);
    var el = this._returnTo;
    if (el && el.focus && document.body.contains(el) && el !== document.body) el.focus();
  },

  methods: {
    focusables() {
      var box = this.$refs.dialog;
      if (!box) return [];
      var sel = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), ' +
                'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
      return Array.prototype.filter.call(box.querySelectorAll(sel), function (el) {
        return el.getAttribute("tabindex") !== "-1" && el.getClientRects().length > 0;
      });
    },

    // Tab 走到最後一個再往下回到第一個，Shift+Tab 反之
    onTrap(e) {
      if (e.key !== "Tab") return;
      var list = this.focusables();
      if (!list.length) { e.preventDefault(); return; }
      var first = list[0], last = list[list.length - 1], cur = document.activeElement;
      if (e.shiftKey && (cur === first || !this.$refs.dialog.contains(cur))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (cur === last || !this.$refs.dialog.contains(cur))) { e.preventDefault(); first.focus(); }
    },
  },

  template: `
    <div class="bulletin-modal-overlay" @click="$emit('close')">
      <div class="bulletin-modal" ref="dialog" role="dialog" aria-modal="true" tabindex="-1"
           :aria-labelledby="$slots.head ? headTitleId : titleId"
           :aria-label="$slots.head && !headTitleId ? (title || meta || null) : null"
           @click.stop @keydown="onTrap">
        <div class="bulletin-modal-head">
          <slot name="head">
            <div>
              <div v-if="meta" class="bulletin-modal-meta">{{ meta }}</div>
              <h2 :id="titleId" class="bulletin-modal-title">{{ title }}</h2>
            </div>
          </slot>
          <button type="button" class="bulletin-modal-close" @click="$emit('close')" :aria-label="closeLabel">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
        <div :class="['bulletin-modal-body', bodyClass]">
          <slot></slot>
        </div>
        <slot name="foot"></slot>
      </div>
    </div>
  `,
};
