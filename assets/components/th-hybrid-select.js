/* ============================================================
   th-hybrid-select — 原生 <select> 的滑鼠外觀層（hybrid select）
   ------------------------------------------------------------
   2026-09-16：由 news.html 的試作（.p-news-hsel）提升為共用元件，
   依「二次即提升」——第二、三個消費端是 apply-1 與 apply-3。

   **hybrid 的定義（使用者裁決，不要自行擴充）**
   ------------------------------------------------------------
   原生 <select> 全程留在 DOM、可聚焦、可被輔助技術讀取，是表單值與
   change 的唯一來源。自訂清單只是**滑鼠使用者**的一層外觀：
   `aria-hidden="true"`、項目 `tabindex="-1"`、焦點永遠不進去。
   鍵盤按鍵一律不攔截（不呼叫 preventDefault），按下的當下面板即收起，
   之後完全交還原生。**所以不是所有人都看到自訂清單**，鍵盤族看到的
   是瀏覽器原生的下拉。面板內沒有鍵盤導航是刻意的，不要補。

   用法：把既有的 <select class="th-select"> 包起來就好，markup 其他都不動——
   value 綁定（v-model 或 :value/@change）、options、頁面邏輯一行都不用改。

   **包裝層是 display: contents，不產生任何方塊**：包一層原本會讓
   `.p-apply3-days-select { flex: 1 }`、`.p-apply3-idtype-select { width: 80px }`
   這類掛在 select 上的規則失去作用（flex／grid 項目變成了包裝層），
   實測 apply-3 有三個欄位寬度跑掉。contents 之後 select 仍是原本的 flex／grid 項目，
   頁面既有的尺寸規則一條都不用改。代價是面板不能再用 absolute 對包裝層定位，
   所以改 position: fixed ＋ 由 JS 依 select 的實際位置給座標（捲動與 resize 本來就收起）。

     <th-hybrid-select>
       <select class="th-select" v-model="sort">
         <option value="default">預設</option>
       </select>
     </th-hybrid-select>

   選項是**開啟當下**從真正的 <select> 讀出來的，所以 v-for 產生的動態選項、
   或程式改過的 selectedIndex 都跟得上。

   **自動退回原生**（不套自訂清單）的情形：
     · 視窗 ≤900px（窄版一律原生）
     · 沒有精確指標（觸控裝置）；該次互動的 pointerType 是 touch／pen
     · <select> 有 optgroup、multiple 或 disabled
       —— 分組與多選不在本元件的範圍，硬畫會失去原生的語意
   ============================================================ */
window.thComponents = window.thComponents || {};
window.thComponents["th-hybrid-select"] = {
  data() {
    return {
      open: false,
      up: false,          // 下方空間不足時向上展開
      maxH: 0,            // 上下都塞不下時限制高度並自行捲動
      pos: null,          // 面板的 fixed 座標（依 select 的實際位置算）
      items: [],
      value: "",
    };
  },

  mounted() {
    var self = this;
    this.sel = this.$el.querySelector("select");
    if (!this.sel) return;

    this._onPointer = function (e) { self._pointerType = e.pointerType || "mouse"; };
    this._onMouseDown = function (e) { self.onMouseDown(e); };
    this._onKeyDown = function () { self.close(); };   // 任何按鍵＝改用鍵盤，交還原生
    this._onBlur = function () { self.close(); };
    this._onChange = function () { self.value = self.sel.value; };

    this.sel.addEventListener("pointerdown", this._onPointer);
    this.sel.addEventListener("mousedown", this._onMouseDown);
    this.sel.addEventListener("keydown", this._onKeyDown);
    this.sel.addEventListener("blur", this._onBlur);
    this.sel.addEventListener("change", this._onChange);

    this._onOutside = function (e) {
      if (self.open && !self.$el.contains(e.target)) self.close();
    };
    /* 捲動與 resize 直接收起：面板是絕對定位的，不跟著欄位走，
       留在原地會變成「浮在半空的清單」。 */
    this._onReset = function () { self.close(); };
    document.addEventListener("mousedown", this._onOutside);
    window.addEventListener("scroll", this._onReset, true);
    window.addEventListener("resize", this._onReset);
  },

  unmounted() {
    if (this.sel) {
      this.sel.removeEventListener("pointerdown", this._onPointer);
      this.sel.removeEventListener("mousedown", this._onMouseDown);
      this.sel.removeEventListener("keydown", this._onKeyDown);
      this.sel.removeEventListener("blur", this._onBlur);
      this.sel.removeEventListener("change", this._onChange);
    }
    document.removeEventListener("mousedown", this._onOutside);
    window.removeEventListener("scroll", this._onReset, true);
    window.removeEventListener("resize", this._onReset);
  },

  methods: {
    canUse() {
      if (!this.sel || this.sel.disabled || this.sel.multiple) return false;
      if (this.sel.querySelector("optgroup")) return false;
      return window.matchMedia("(min-width: 901px)").matches &&
             window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    },

    onMouseDown(e) {
      if (e.button !== 0) return;                                  // 只認左鍵
      if (this._pointerType === "touch" || this._pointerType === "pen") return;
      if (!this.canUse()) return;
      /* preventDefault 是為了擋掉瀏覽器自己的彈出清單，否則兩層會疊在一起。
         代價是連聚焦也被擋掉，所以手動補一次——焦點必須留在原生 select 上。 */
      e.preventDefault();
      this.sel.focus();
      this.open ? this.close() : this.openPanel();
    },

    openPanel() {
      var self = this;
      this.items = Array.prototype.map.call(this.sel.options, function (o) {
        return { value: o.value, label: o.text, disabled: o.disabled };
      });
      this.value = this.sel.value;
      this.up = false;
      this.maxH = 0;
      this.pos = null;
      this._panel = null;
      this.open = true;
      this.$nextTick(function () { self.place(); });
    },

    close() {
      this.open = false;
      this.maxH = 0;
      this.pos = null;
    },

    /* 依可用空間決定往下或往上，必須在面板畫出來之後量（要它真正的高度）。
       只在開啟當下決定一次：捲動與 resize 都會直接收起，不需要追。 */
    place() {
      var panel = this.panelEl();
      if (!panel) return;
      var field = this.sel.getBoundingClientRect();
      var need = panel.getBoundingClientRect().height + 6;   // 6 = 面板與欄位的間距
      var below = window.innerHeight - field.bottom;
      var above = field.top;
      var up = need > below && above > below;
      this.up = up;
      /* 選定方向後若仍塞不下就縮高（扣 6px 間距與 8px 視窗邊距），
         面板本身有 overflow-y: auto，縮完會自己出現捲軸——原生也是這樣做。 */
      var room = (up ? above : below) - 14;
      this.maxH = need > room ? Math.max(120, room) : 0;
      /* fixed 座標：寬度跟著欄位，方向由上面決定。
         用 bottom 而不是 top 往上長，縮高之後才不會蓋住欄位。 */
      this.pos = {
        left: Math.round(field.left) + "px",
        width: Math.round(field.width) + "px",
      };
      if (up) this.pos.bottom = Math.round(window.innerHeight - field.top + 6) + "px";
      else this.pos.top = Math.round(field.bottom + 6) + "px";
    },

    panelEl() { return this._panel || (this._panel = this.$el.querySelector(".th-hsel-panel")); },

    /* 選取結果一律寫回原生 select 並派發 change，
       頁面的 v-model 或 @change 因此照常運作，邏輯一行都不用改。 */
    pick(item) {
      if (item.disabled) return;
      this.sel.value = item.value;
      this.sel.dispatchEvent(new Event("change", { bubbles: true }));
      this.value = item.value;
      this.close();
      this.sel.focus();
    },
  },

  template: `
    <div class="th-hsel">
      <slot></slot>
      <!-- aria-hidden：報讀器只讀原生 select，兩者不會重複朗讀。
           項目用 mousedown.prevent 觸發，焦點才不會離開原生 select。 -->
      <div v-if="open" :class="['th-hsel-panel', { 'is-up': up }]"
           :style="[pos || {}, maxH ? { maxHeight: maxH + 'px' } : {}]" aria-hidden="true">
        <button v-for="(o, i) in items" :key="i" type="button" tabindex="-1"
                :class="['th-hsel-item', { 'is-selected': o.value === value, 'is-disabled': o.disabled }]"
                @mousedown.prevent="pick(o)">
          <span>{{ o.label }}</span>
          <i v-if="o.value === value" class="fa-solid fa-check" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  `,
};
