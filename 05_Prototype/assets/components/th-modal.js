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
   關閉鈕 --fg-4。以上全部由 styles/shared.css 既有的 .bulletin-modal-*
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
                （campsite 用 "camp-daybody"）
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

  mounted() {
    var self = this;
    this._onKey = function (e) { if (e.key === "Escape") self.$emit("close"); };
    document.addEventListener("keydown", this._onKey);
  },

  unmounted() {
    document.removeEventListener("keydown", this._onKey);
  },

  template: `
    <div class="bulletin-modal-overlay" @click="$emit('close')">
      <div class="bulletin-modal" @click.stop>
        <div class="bulletin-modal-head">
          <slot name="head">
            <div>
              <div v-if="meta" class="bulletin-modal-meta">{{ meta }}</div>
              <h2 class="bulletin-modal-title">{{ title }}</h2>
            </div>
          </slot>
          <button type="button" class="bulletin-modal-close" @click="$emit('close')" :aria-label="closeLabel">
            <i class="fa-solid fa-xmark"></i>
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
