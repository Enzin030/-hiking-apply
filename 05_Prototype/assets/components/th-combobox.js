/* ============================================================
   th-combobox — 可輸入關鍵字篩選的下拉（ARIA combobox ＋ listbox）
   ------------------------------------------------------------
   2026-09-24 新增，第一個消費端是首頁「可申請日期試算」的主／次路線。
   與 th-hybrid-select 的分工：hybrid 是原生 <select> 的滑鼠外觀層、不能打字；
   選項多到需要**打字找**的時候用本元件（路線動輒二、三十條）。

   行為（WAI-ARIA APG「Editable Combobox With List Autocomplete」）：
   - 點欄位或按 ↓ 展開；輸入文字即時篩選（包含比對，不分全半形以外的大小寫）
   - ↑↓ 移動目前項（aria-activedescendant，焦點留在 input）、Enter 選取
   - Esc：清單開著就收起並**阻止冒泡**（否則會連外層 th-modal 一起關掉）
   - 失焦或點外部：收起，輸入框還原成目前選取項的文字（打到一半的字不算數）

   面板寬度**跟著最長的選項**（width: max-content），至少與欄位同寬；
   超出視窗時才縮到視窗寬並讓文字折行。因此面板用 position: fixed 由 JS 給座標，
   不受外層（例如彈窗內文的 overflow）裁切。捲動與 resize 直接收起，同 th-hybrid-select。
   外觀沿用 .th-hsel-panel／.th-hsel-item（兩者本就沿用語言下拉的值），不另立一套。

   props：
     modelValue   目前選取的 value（v-model）
     options      [{ value, label }]
     inputId      input 的 id，給外部 <label for> 用
     placeholder  未選取時的提示
     emptyText    篩不到東西時的提示，預設「查無符合的項目」
   emits：
     update:modelValue、change（值確實變了才發）
   ============================================================ */
window.thComponents = window.thComponents || {};
(function () {
  var seq = 0;

  window.thComponents["th-combobox"] = {
    props: {
      modelValue: { type: String, default: "" },
      options: { type: Array, default: function () { return []; } },
      inputId: { type: String, default: "" },
      placeholder: { type: String, default: "" },
      emptyText: { type: String, default: "查無符合的項目" },
    },

    emits: ["update:modelValue", "change"],

    data() {
      seq += 1;
      return {
        uid: "th-combo-" + seq,
        open: false,
        query: "",          // 使用者正在打的字；null 以外的值才會拿來篩選
        typing: false,      // 開啟後有沒有打過字（沒打過就列全部）
        active: -1,
        pos: null,
      };
    },

    computed: {
      listId() { return this.uid + "-list"; },
      selected() {
        var v = this.modelValue;
        return this.options.find(function (o) { return o.value === v; }) || null;
      },
      filtered() {
        if (!this.typing || !this.query.trim()) return this.options;
        var q = this.query.trim().toLowerCase();
        return this.options.filter(function (o) { return o.label.toLowerCase().indexOf(q) >= 0; });
      },
      activeId() { return this.open && this.active >= 0 ? this.uid + "-opt-" + this.active : null; },
    },

    watch: {
      // 外部改值（例如切換主路線後清空）時，輸入框跟著顯示新選取項
      modelValue() { if (!this.open) this.syncText(); },
      options() { if (!this.open) this.syncText(); },
    },

    mounted() {
      var self = this;
      this.syncText();
      this._onOutside = function (e) {
        if (self.open && !self.$el.contains(e.target) && !(self.$refs.panel && self.$refs.panel.contains(e.target))) self.close();
      };
      // 面板自己的捲動不算（清單長時要能捲）
      this._onReset = function (e) {
        if (self.open && !(self.$refs.panel && e && e.target instanceof Node && self.$refs.panel.contains(e.target))) self.close();
      };
      document.addEventListener("mousedown", this._onOutside);
      window.addEventListener("scroll", this._onReset, true);
      window.addEventListener("resize", this._onReset);
    },

    unmounted() {
      document.removeEventListener("mousedown", this._onOutside);
      window.removeEventListener("scroll", this._onReset, true);
      window.removeEventListener("resize", this._onReset);
    },

    methods: {
      syncText() { this.query = this.selected ? this.selected.label : ""; },

      show() {
        if (this.open) return;
        this.open = true;
        this.typing = false;
        var self = this;
        var idx = this.options.indexOf(this.selected);
        this.active = idx;
        this.$nextTick(function () { self.place(); self.scrollActive(); });
      },

      close() {
        this.open = false;
        this.active = -1;
        this.pos = null;
        this.syncText();
      },

      /* 先以欄位左緣、最小寬度＝欄位寬畫出來，量到面板實際寬高後再修正：
         右緣超出視窗就往左推；下方放不下且上方較寬就往上開。 */
      place() {
        var panel = this.$refs.panel, field = this.$refs.input;
        if (!panel || !field) return;
        var f = field.getBoundingClientRect();
        var vw = document.documentElement.clientWidth, vh = window.innerHeight, gap = 6, edge = 8;
        this.pos = { left: Math.round(f.left) + "px", top: Math.round(f.bottom + gap) + "px",
                     minWidth: Math.round(f.width) + "px", maxWidth: (vw - edge * 2) + "px" };
        var self = this;
        this.$nextTick(function () {
          var p = panel.getBoundingClientRect();
          var left = Math.min(f.left, vw - edge - p.width);
          var below = vh - f.bottom - gap - edge, above = f.top - gap - edge;
          var up = p.height > below && above > below;
          var pos = Object.assign({}, self.pos, { left: Math.round(Math.max(edge, left)) + "px" });
          if (up) { delete pos.top; pos.bottom = Math.round(vh - f.top + gap) + "px"; }
          pos.maxHeight = Math.max(120, Math.min(320, up ? above : below)) + "px";
          self.pos = pos;
        });
      },

      scrollActive() {
        var panel = this.$refs.panel;
        if (!panel || this.active < 0) return;
        var el = panel.querySelector("#" + this.uid + "-opt-" + this.active);
        if (el) el.scrollIntoView({ block: "nearest" });
      },

      onInput(e) {
        this.query = e.target.value;
        this.typing = true;
        if (!this.open) { this.open = true; var self = this; this.$nextTick(function () { self.place(); }); }
        this.active = this.filtered.length ? 0 : -1;
        var s = this;
        this.$nextTick(function () { s.place(); });
      },

      move(step) {
        var n = this.filtered.length;
        if (!n) return;
        this.active = this.active < 0 ? (step > 0 ? 0 : n - 1) : (this.active + step + n) % n;
        var self = this;
        this.$nextTick(function () { self.scrollActive(); });
      },

      onKey(e) {
        if (e.key === "ArrowDown") { e.preventDefault(); this.open ? this.move(1) : this.show(); }
        else if (e.key === "ArrowUp") { e.preventDefault(); if (this.open) this.move(-1); }
        else if (e.key === "Enter") {
          if (this.open) { e.preventDefault(); if (this.active >= 0) this.pick(this.filtered[this.active]); }
        }
        else if (e.key === "Escape") {
          if (this.open) { e.preventDefault(); e.stopPropagation(); this.close(); }
        }
        else if (e.key === "Tab") { if (this.open) this.close(); }
      },

      onBlur(e) {
        // 點面板項目時 input 會先失焦；項目用 mousedown.prevent 保住焦點，這裡只處理真正離開
        if (this.$refs.panel && this.$refs.panel.contains(e.relatedTarget)) return;
        if (this.open) this.close();
      },

      pick(o) {
        if (!o) return;
        var changed = o.value !== this.modelValue;
        this.$emit("update:modelValue", o.value);
        this.open = false;
        this.active = -1;
        this.pos = null;
        this.query = o.label;
        if (changed) this.$emit("change", o.value);
      },
    },

    template: `
      <div class="th-combo">
        <input ref="input" :id="inputId || null" type="text" class="th-input th-select th-combo-input"
               role="combobox" aria-autocomplete="list" autocomplete="off"
               :aria-expanded="open ? 'true' : 'false'" :aria-controls="listId"
               :aria-activedescendant="activeId" :placeholder="placeholder"
               :value="query" @input="onInput" @click="show" @keydown="onKey" @blur="onBlur" />
        <ul v-if="open" ref="panel" :id="listId" role="listbox" class="th-hsel-panel th-combo-panel"
            :style="pos || { visibility: 'hidden' }">
          <li v-for="(o, i) in filtered" :key="o.value" :id="uid + '-opt-' + i" role="option"
              :aria-selected="o.value === modelValue ? 'true' : 'false'"
              :class="['th-hsel-item', { 'is-selected': o.value === modelValue, 'is-active': i === active }]"
              @mousedown.prevent="pick(o)" @mousemove="active = i">
            <span>{{ o.label }}</span>
            <i v-if="o.value === modelValue" class="fa-solid fa-check" aria-hidden="true"></i>
          </li>
          <li v-if="!filtered.length" class="th-combo-empty" role="presentation">{{ emptyText }}</li>
        </ul>
      </div>
    `,
  };
})();
