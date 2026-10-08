/* th-camp-booking.js — 林保署山屋訂位的共用元件（2026-10-08）
   ------------------------------------------------------------
   原本只在山屋行程規劃頁（forest-camp-2）與山屋確認頁（apply_06）各寫一份；複合申請（國家公園路線＋山屋，
   設計稿 M05）要在國家公園行程規劃頁 apply-3、確認頁 apply-5 用同一套，依「二次即提升」收成元件。
   markup 與算法逐字照搬（forest-camp-2 像素零差異）：
     th-qty-stepper         數量增減（原 forest-camp-2 頁內元件 p-fc2-stepper）
     th-camp-fee            費用參考表（單價：平日／假日）
     th-camp-rooms          逐晚床位表＋預估總費用（原 forest-camp-2「山屋及營地申請」卡內）
     th-camp-payment        付款方式卡片（原 forest-camp-2「付款方式」卡內）
     th-camp-booking-detail 確認頁的申請單明細＋費用明細＋總金額＋付款方式（原 apply_06）
   卡片外框（th-card、標題、id）留在頁面，元件只負責卡片內容；多個根節點（fragment），DOM 與原頁相同。

   **alloc 直接改傳進來的物件**（th-camp-rooms）：alloc＝{ [夜次]: { [設施 id]: 數量 } }，
   由頁面以 reactive data 持有並傳入，元件就地增減數量（Vue 3 巢狀賦值為響應式），與原頁行為相同。
   頁面需要的總額、每晚是否有訂、交給隊伍資料的預設人數，改用 window.thFcAllocTotals() 同一支算法。

   日期算法照原頁：行程規劃（th-camp-rooms）走 thFcAddDaysUTC（UTC 路徑，原 fc2AddDays，檔頭禁止換成
   th-date-utils）；確認頁（th-camp-booking-detail）走 thAddDaysToDateValue（本地路徑，原 apply_06）。 */
(function () {
  "use strict";

  /* 日期字串 +N 天（UTC 路徑；原 forest-camp-2 的 fc2AddDays，不可換成 th-date-utils） */
  window.thFcAddDaysUTC = function (dateStr, n) {
    var d = new Date(dateStr);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };
  /* 顯示格式：2025-07-20 → 7/20（週六）（原 fc2FmtDate） */
  window.thFcFmtNight = function (dateStr) {
    if (!dateStr) return "";
    var d = new Date(dateStr);
    var weekdays = ["日", "一", "二", "三", "四", "五", "六"];
    return (d.getMonth() + 1) + "/" + d.getDate() + "（週" + weekdays[d.getDay()] + "）";
  };
  /* alloc 的彙總：每晚數量、每晚是否至少 1、各設施小計、總額、最大每晚數量（原 forest-camp-2 的 computed） */
  window.thFcAllocTotals = function (cabin, alloc, start, nights) {
    var qty = function (i, id) { var n = alloc[i]; return (n && n[id]) || 0; };
    var night = function (i) { return window.thFcAddDaysUTC(start, i); };
    var nightTotals = [];
    for (var i = 0; i < nights; i++) nightTotals.push(cabin.facilities.reduce(function (s, f) { return s + qty(i, f.id); }, 0));
    var subtotals = cabin.facilities.map(function (f) {
      var total = 0, q = 0;
      for (var i = 0; i < nights; i++) { total += qty(i, f.id) * window.thFcPriceOf(f, night(i)); q += qty(i, f.id); }
      return Object.assign({}, f, { total: total, qty: q });
    });
    return {
      nightTotals: nightTotals,
      subtotals: subtotals,
      grandTotal: subtotals.reduce(function (s, f) { return s + f.total; }, 0),
      nightsValid: nightTotals.every(function (t) { return t >= 1; }),
      maxNight: Math.max.apply(null, [1].concat(nightTotals)),
    };
  };
  /* 新的 alloc：每晚每設施補 0，第一種設施預帶 qty（必填預帶） */
  window.thFcAllocInit = function (cabin, nights, qty) {
    var obj = {};
    for (var i = 0; i < nights; i++) {
      obj[i] = {};
      cabin.facilities.forEach(function (f) { obj[i][f.id] = 0; });
      var first = cabin.facilities[0];
      if (first && qty) obj[i][first.id] = Math.min(qty, first.max || qty);
    }
    return obj;
  };
  /* 確認頁申請單明細的欄位（原 apply_06 FC6_BOOKING_COLUMNS） */
  window.TH_FC_BOOKING_COLUMNS = [
    { key: "date", label: "日期" },
    { key: "room", label: "床位/營位" },
    { key: "price", label: "住宿費用", align: "right" },
    { key: "qty", label: "申請單位數", align: "center" },
  ];

  window.thComponents = window.thComponents || {};

  /* 數量增減（原 forest-camp-2 p-fc2-stepper；.th-qty-stepper-input 原 .p-fc2-stepper-input） */
  window.thComponents["th-qty-stepper"] = {
    props: {
      value: { type: Number, required: true },
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
    },
    emits: ["change"],
    template: `
      <div class="fc-stepper-input th-qty-stepper-input">
        <button class="fc-stepper-btn" @click="$emit('change', Math.max(min, value - 1))" :disabled="value <= min">
          <i class="fa-solid fa-minus" aria-hidden="true"></i>
        </button>
        <span class="fc-stepper-val">{{ value }}</span>
        <button class="fc-stepper-btn" @click="$emit('change', Math.min(max, value + 1))" :disabled="value >= max">
          <i class="fa-solid fa-plus" aria-hidden="true"></i>
        </button>
      </div>
    `,
  };

  /* 費用參考：只列單價（使用者 2026-10-07：費用拆成「參考」在上、「計算」在逐晚選擇之下）；表格樣式同確認頁 */
  window.thComponents["th-camp-fee"] = {
    props: { cabin: { type: Object, required: true } },
    template: `
      <div class="th-table-wrap border border-slate-200 rounded-md">
        <table class="th-table w-full whitespace-nowrap">
          <thead>
            <tr>
              <th scope="col">床位／營位</th>
              <th scope="col" class="is-center">平日</th>
              <th scope="col" class="is-center">假日</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="f in cabin.facilities" :key="f.id">
              <td>{{ f.label }}</td>
              <td class="is-center">NT$ {{ f.price.weekday }} / 晚</td>
              <td class="is-center">NT$ {{ f.price.holiday }} / 晚</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  };

  /* 逐晚床位表（使用者 2026-10-07）：每晚一列「晚次｜日期｜山屋／營地（下拉）｜床位數量（±）｜單價｜小計」，
     每晚只能選一種房型（同正式站 CampRoom）；表格下方「預估總費用」靠右 */
  window.thComponents["th-camp-rooms"] = {
    props: {
      cabin: { type: Object, required: true },
      start: { type: String, required: true },
      nights: { type: Number, required: true },
      alloc: { type: Object, required: true },
      peopleMax: { type: Number, default: 12 },
    },
    data() { return { room: {} }; },   // 第 i 晚下拉選的房型（尚未填數量時記住選擇）
    computed: {
      nightIndexes() { return Array.from({ length: this.nights }, function (_, i) { return i; }); },
      grandTotal() { return window.thFcAllocTotals(this.cabin, this.alloc, this.start, this.nights).grandTotal; },
    },
    methods: {
      fmtDate: function (d) { return window.thFcFmtNight(d); },
      nightDate(i) { return window.thFcAddDaysUTC(this.start, i); },
      qtyOf(i, id) { var n = this.alloc[i]; return (n && n[id]) || 0; },
      setQty(i, id, q) { this.alloc[i][id] = q; },
      nightTotal(i) { var self = this; return this.cabin.facilities.reduce(function (s, f) { return s + self.qtyOf(i, f.id); }, 0); },
      /* 第 i 晚選定的床位／營位：有數量的那種；都沒有時取使用者選的，預設第一種 */
      roomOf(i) {
        var self = this;
        var used = this.cabin.facilities.find(function (f) { return self.qtyOf(i, f.id) > 0; });
        return used ? used.id : (this.room[i] || (this.cabin.facilities[0] || {}).id);
      },
      /* 換房型：數量帶到新房型、舊房型歸零（一晚只能一種，同正式站 CampRoom 單一下拉） */
      setRoom(i, fid) {
        var self = this;
        var qty = this.nightTotal(i);
        this.cabin.facilities.forEach(function (f) { self.alloc[i][f.id] = 0; });
        if (qty) this.alloc[i][fid] = Math.min(qty, (this.cabin.facilities.find(function (f) { return f.id === fid; }) || {}).max || qty, this.peopleMax);
        var r = Object.assign({}, this.room); r[i] = fid; this.room = r;
      },
      isHoliday(i) { return window.thIsHolidayApprox(this.nightDate(i)); },
      /* 二價（2026-09-16）：單價按**當夜日期**取，所有金額走這支 */
      priceOf(f, i) { return window.thFcPriceOf(f, this.nightDate(i)); },
    },
    template: `
      <div class="th-table-wrap border border-slate-200 rounded-md">
        <table class="th-table w-full whitespace-nowrap">
          <thead>
            <tr>
              <th scope="col" class="is-center">晚次</th>
              <th scope="col">日期</th>
              <th scope="col">山屋／營地</th>
              <th scope="col" class="is-center">床位數量</th>
              <th scope="col" class="is-right">單價</th>
              <th scope="col" class="is-right">小計</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in nightIndexes" :key="i">
              <td class="is-center">第 {{ i + 1 }} 晚</td>
              <td>{{ fmtDate(nightDate(i)) }}</td>
              <template v-for="f in cabin.facilities.filter(x => x.id === roomOf(i))" :key="f.id">
                <td class="min-w-[220px]">
                  <th-hybrid-select><select class="th-select w-full" :value="f.id" @change="setRoom(i, $event.target.value)" :aria-label="'第 ' + (i + 1) + ' 晚山屋或營地'">
                    <option v-for="o in cabin.facilities" :key="o.id" :value="o.id">{{ o.label }}</option>
                  </select></th-hybrid-select>
                </td>
                <td>
                  <div class="flex justify-center">
                    <th-qty-stepper :value="qtyOf(i, f.id)" :min="0" :max="Math.min(f.max, peopleMax)" @change="setQty(i, f.id, $event)"></th-qty-stepper>
                  </div>
                </td>
                <td class="is-right">NT$ {{ priceOf(f, i).toLocaleString() }} / {{ f.unit }}<span v-if="isHoliday(i)" class="th-holiday-tag">假日</span></td>
                <td class="is-right font-bold text-national-800">{{ qtyOf(i, f.id) > 0 ? 'NT$ ' + (qtyOf(i, f.id) * priceOf(f, i)).toLocaleString() : '—' }}</td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-end mt-4">
        <div class="inline-flex items-baseline gap-4">
          <span class="font-semibold text-slate-800">預估總費用</span>
          <span class="text-xl font-bold text-national-800">NT$ {{ grandTotal.toLocaleString() }}</span>
        </div>
      </div>
    `,
  };

  /* 付款方式（照正式站只有匯款／線上刷卡，訂房後不可更改）：v-model 為 TH_FC_PAYMENTS 的 id，"" 為未選 */
  window.thComponents["th-camp-payment"] = {
    props: { modelValue: { type: String, default: "" }, name: { type: String, default: "payment" } },
    emits: ["update:modelValue"],
    computed: { options() { return window.TH_FC_PAYMENTS; } },
    template: `
      <div class="th-pay-grid">
        <label v-for="opt in options" :key="opt.id"
               :class="['th-pay-card', { 'is-selected': modelValue === opt.id }]">
          <input type="radio" :name="name" :value="opt.id"
                 :checked="modelValue === opt.id"
                 @change="$emit('update:modelValue', opt.id)"
                 class="th-pay-radio" />
          <div class="th-pay-icon">
            <i :class="opt.icon" aria-hidden="true"></i>
          </div>
          <div class="th-pay-label">{{ opt.label }}</div>
          <div v-if="modelValue === opt.id" class="th-pay-check">
            <i class="fa-solid fa-check" aria-hidden="true"></i>
          </div>
        </label>
      </div>
    `,
  };

  /* 確認頁：申請單明細＋費用明細＋總金額＋付款方式（原 apply_06「山屋及營地申請單明細」卡內） */
  window.thComponents["th-camp-booking-detail"] = {
    props: {
      cabin: { type: Object, required: true },
      start: { type: String, default: "" },
      nights: { type: Number, default: 0 },
      alloc: { type: Object, default: function () { return {}; } },
      payment: { type: String, default: "" },
    },
    computed: {
      columns() { return window.TH_FC_BOOKING_COLUMNS; },
      nightDates() { var self = this; return Array.from({ length: this.nights }, function (_, i) { return window.thAddDaysToDateValue(self.start, i); }); },
      rows() {
        var self = this, rows = [];
        this.nightDates.forEach(function (d, i) {
          self.cabin.facilities.forEach(function (f) {
            var q = (self.alloc[i] && self.alloc[i][f.id]) || 0;
            if (q > 0) rows.push({ key: i + f.id, date: d, room: f.label, price: window.thFcPriceOf(f, d), qty: q });
          });
        });
        return rows;
      },
      nightCosts() {
        var self = this;
        return this.nightDates.map(function (d) {
          return { date: d, cost: self.rows.filter(function (r) { return r.date === d; }).reduce(function (s, r) { return s + r.price * r.qty; }, 0) };
        });
      },
      total() { return this.nightCosts.reduce(function (s, n) { return s + n.cost; }, 0); },
      paymentLabel() { var self = this; var p = window.TH_FC_PAYMENTS.find(function (x) { return x.id === self.payment; }); return p ? p.label : "—"; },
    },
    template: `
      <th-data-table class="border border-slate-200 rounded-md" table-class="w-full whitespace-nowrap" :columns="columns" :rows="rows" row-key="key" caption="山屋及營地申請單明細" empty="尚未選擇床位或營位"></th-data-table>
      <dl class="grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-x-4 gap-y-2">
        <dt class="th-label">費用明細</dt>
        <dd><span v-for="n in nightCosts" :key="n.date" class="mr-3">【{{ n.date }}】{{ n.cost.toLocaleString() }}元</span></dd>
        <dt class="th-label">總金額</dt>
        <dd><strong>本申請單總金額為：NT\${{ total.toLocaleString() }}元</strong></dd>
        <dt class="th-label">付款方式</dt>
        <dd>{{ paymentLabel }}</dd>
      </dl>
    `,
  };
})();
