/* ============================================================
   th-person-form — 登山申請的人員資料（申請人／領隊／隊員／留守人）
   ------------------------------------------------------------
   2026-09-17 新增。依據：舊站太魯閣 `tarokoapplyControl/step2.ascx` 的欄位
   （測試機 \\10.0.0.51，直接 grep 控制項 ID 取得），以及 2026-09-18 玉山實走。

   **為什麼提升為共用**：太魯閣的申請人與領隊欄位一字不差，同一組欄位在申請表內
   就重複兩次；玉山實走的領隊欄位與太魯閣的 14 欄相同（只差學生欄）。
   改版做成一支元件、以 role 決定欄位組合。
   （2026-09-18 更正：原寫「雪霸 apply_1_3 又一份、至少重複六次」並引用 F1三家比對.md 3-A——
   雪霸部分來自漏抓的 cmp_f1.py v1，3-A 已作廢。2026-09-18 17:20 以 v3 工具讀雪霸標記補驗：
   四個角色的基本欄位 ID 與太魯閣一字不差，所以三家都有同一組重複。）

   **為什麼不照抄太魯閣的切法**：舊站十支 .ascx 各自攤開同一組約 57 個
   Sp1_*／Sp2_* 屬性，父頁逐一賦值、再用 FindControl 穿透內部。本元件只收
   一個 modelValue 物件，欄位狀態不外流（見 太魯閣控制項盤點.md §2）。

   ------------------------------------------------------------
   role 與欄位（逐一對照 step2.ascx 的控制項 ID，不是推定）
   ------------------------------------------------------------
   | role   | 欄位數 | 與 apply 的差異 |
   |--------|--------|-----------------|
   | apply  | 15     | —（18 歲提示由頁面顯示，見 ROLES.apply 註解） |
   | leader | 16     | 多「是否為學生」 |
   | member | 15     | 少「傳真」、多「是否為學生」 |
   | stay   | 9      | 只有姓名／電話／手機／傳真／email／國籍／國別／證號／生日 |

   「國別」只在國籍選「國外」時出現，所以畫面上的欄位數會少一個。
   隊員區的「委託同意」勾選框（member_keytype）屬於區塊層級，不在本元件內。

   ------------------------------------------------------------
   第二個維度：欄位組合依機關不同（2026-09-18，規格待定）
   ------------------------------------------------------------
   上表是**太魯閣**的欄位。2026-09-18 測試站實走玉山發現同一角色的欄位組合不同：
     · 玉山領隊、隊員**沒有「是否為學生」**（太魯閣有）
     · 玉山留守人**沒有「電話」**（太魯閣有）
     · 隊員三家都以「新增隊員」逐筆加入、人數唯讀
       （2026-09-18 讀程式碼更正：原寫「太魯閣依隊伍人數自動產生」證據不足且不成立；
        見 .scratch/outputs/正式站申請流程盤點/推定被推翻清單.md #1）
       ——這是外層「隊伍」容器的行為，不屬於本元件
   雪霸 2026-09-18 已由程式碼補齊：與太魯閣相同、僅無學生欄。三家對照見
   .scratch/outputs/正式站申請流程盤點/人員欄位三家對照.md。

   暫定方向：維持一支，加 `agency` 參數，欄位清單改由 ROLES[agency][role] 設定表決定。
   ~~雪霸補齊前不改行為~~ → 雪霸已補齊，**沒有結構性差異**（只有欄位有無），維持一支的方向成立。
   三家差異：學生欄只有太魯閣有；留守人電話只有玉山沒有。
   目前本元件只實作太魯閣的組合；改成 ROLES[agency][role] 待元件切法定案後再做。

   ------------------------------------------------------------
   readonly
   ------------------------------------------------------------
   確認頁用同一支元件加 readonly，**不另做唯讀版**。舊站 step1／step1_view
   是兩支 2,000 行級的重複檔案，改一處要改兩處，這裡不重蹈。

   ------------------------------------------------------------
   本元件不新增任何 CSS
   ------------------------------------------------------------
   沿用 components.css 的 .th-field／.th-label／.th-input／.th-select／
   .th-field-hint 與 Tailwind utility（同 th-captcha 的做法）。
   下拉一律包 <th-hybrid-select>（共用元件），與全站下拉外觀一致。

   ------------------------------------------------------------
   用法
   ------------------------------------------------------------
       <th-person-form role="apply" id-prefix="apply" v-model="applicant"></th-person-form>
       <th-person-form role="stay"  id-prefix="stay"  v-model="stay"></th-person-form>
       <th-person-form role="apply" id-prefix="c-apply" :model-value="applicant" readonly></th-person-form>

   id-prefix 逐處要不同：同一頁常同時出現申請人與領隊，id 重複會讓
   <label for> 指到錯的輸入框。

   ------------------------------------------------------------
   縣市／鄉鎮選項是示意值
   ------------------------------------------------------------
   舊站由 ddl*_country → ddl*_city 兩層 postback 連動，資料來自後端。
   這裡只放幾個縣市當示意，**不是完整清單**。
   ============================================================ */
(function () {
  "use strict";

  /* 欄位定義。key 對應舊站 ID 去掉角色前綴後的名稱 */
  var F = {
    name:        { label: "姓名",           type: "text",  req: true },
    tel:         { label: "電話",           type: "text",  req: true },
    country:     { label: "縣市",           type: "country", req: true },
    city:        { label: "鄉鎮市區",       type: "city",  req: true },
    addr:        { label: "地址",           type: "text",  req: true, wide: true },
    mobile:      { label: "手機",           type: "text",  req: true, hint: "格式：0912345678" },
    fax:         { label: "傳真",           type: "text",  req: false },
    email:       { label: "電子郵件",       type: "email", req: true },
    nation:      { label: "國籍",           type: "nation", req: true },
    nationid:    { label: "國別",           type: "nationid", req: true, onlyForeign: true },
    sid:         { label: "身分證號",       type: "sid",   req: true },
    sex:         { label: "性別",           type: "sex",   req: true },
    birthday:    { label: "生日",           type: "date",  req: true, hint: "格式：1980-01-01" },
    contactname: { label: "緊急聯絡人",     type: "text",  req: true },
    contacttel:  { label: "緊急聯絡人電話", type: "text",  req: true },
    student:     { label: "是否為學生",     type: "student", req: false,
                   hint: "入園時須出示學生證，否則將依規定收費" },
  };

  var ROLES = {
    /* 申請人的 18 歲提示由頁面放在委託同意勾選之前（舊站位置與原文「未滿18歲者不得擔任申請人」，2026-09-17 截圖） */
    apply:  { title: "申請人", note: "",
              keys: ["name", "tel", "country", "city", "addr", "mobile", "fax", "email",
                     "nation", "nationid", "sid", "sex", "birthday", "contactname", "contacttel"] },
    leader: { title: "領隊", note: "領隊須為年滿18歲之成年人",
              keys: ["name", "tel", "country", "city", "addr", "mobile", "fax", "email",
                     "nation", "nationid", "sid", "sex", "birthday", "contactname", "contacttel",
                     "student"] },
    member: { title: "隊員", note: "",
              keys: ["name", "tel", "country", "city", "addr", "mobile", "email",
                     "nation", "nationid", "sid", "sex", "birthday", "contactname", "contacttel",
                     "student"] },
    stay:   { title: "留守人", note: "",
              keys: ["name", "tel", "mobile", "fax", "email", "nation", "nationid", "sid", "birthday"] },
  };

  /* 示意值，非完整清單（見檔頭） */
  var CITY = {
    "台北市": ["松山區", "信義區", "大安區"],
    "新北市": ["板橋區", "新店區", "三重區"],
    "宜蘭縣": ["宜蘭市", "羅東鎮", "大同鄉"],
    "花蓮縣": ["花蓮市", "新城鄉", "秀林鄉"],
  };
  var NATIONS = ["日本", "美國", "馬來西亞", "其他"];

  window.thComponents = window.thComponents || {};
  window.thComponents["th-person-form"] = {
    props: {
      role: { type: String, required: true },
      modelValue: { type: Object, default: function () { return {}; } },
      readonly: { type: Boolean, default: false },
      idPrefix: { type: String, required: true },
    },
    emits: ["update:modelValue"],
    computed: {
      conf() { return ROLES[this.role] || ROLES.apply; },
      foreign() { return this.modelValue.nation === "國外"; },
      fields() {
        var self = this;
        return this.conf.keys
          .filter(function (k) { return !F[k].onlyForeign || self.foreign; })
          .map(function (k) {
            var f = Object.assign({ key: k }, F[k]);
            if (k === "sid" && self.foreign) f = Object.assign({}, f, { label: "護照號碼（居留證）" });
            return f;
          });
      },
      cities() { return CITY[this.modelValue.country] || []; },
    },
    data() {
      return { countries: Object.keys(CITY), nations: NATIONS };
    },
    methods: {
      fid(k) { return this.idPrefix + "-" + k; },
      set(k, v) {
        var next = Object.assign({}, this.modelValue);
        next[k] = v;
        if (k === "country") next.city = "";          // 換縣市時清空鄉鎮，同舊站 postback 行為
        if (k === "nation" && v !== "國外") next.nationid = "";
        this.$emit("update:modelValue", next);
      },
      shown(f) {
        var v = this.modelValue[f.key];
        if (f.type === "student") return v ? "是" : "否";
        if (v === undefined || v === null || v === "") return "—";
        return v;
      },
    },
    template: `
      <div class="th-person-form" :data-role="role">
        <p v-if="conf.note && !readonly" class="th-field-hint mb-3">{{ conf.note }}</p>

        <dl v-if="readonly" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
          <div v-for="f in fields" :key="f.key" :class="['th-field', { 'sm:col-span-2 lg:col-span-3': f.wide }]">
            <dt class="th-label">{{ f.label }}</dt>
            <dd class="th-input th-input-readonly">{{ shown(f) }}</dd>
          </div>
        </dl>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          <div v-for="f in fields" :key="f.key" :class="['th-field', { 'sm:col-span-2 lg:col-span-3': f.wide }]">
            <label v-if="f.type !== 'student'" class="th-label" :for="fid(f.key)"><span v-if="f.req" class="req">*</span>{{ f.label }}</label>

            <th-hybrid-select v-if="f.type === 'country'"><select :id="fid(f.key)" class="th-select"
                    :value="modelValue.country || ''" @change="set('country', $event.target.value)">
              <option value="">請選擇縣市</option>
              <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
            </select></th-hybrid-select>

            <th-hybrid-select v-else-if="f.type === 'city'"><select :id="fid(f.key)" class="th-select" :disabled="!cities.length"
                    :value="modelValue.city || ''" @change="set('city', $event.target.value)">
              <option value="">請選擇</option>
              <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
            </select></th-hybrid-select>

            <th-hybrid-select v-else-if="f.type === 'nation'"><select :id="fid(f.key)" class="th-select"
                    :value="modelValue.nation || '中華民國'" @change="set('nation', $event.target.value)">
              <option value="中華民國">中華民國</option>
              <option value="國外">國外</option>
            </select></th-hybrid-select>

            <th-hybrid-select v-else-if="f.type === 'nationid'"><select :id="fid(f.key)" class="th-select"
                    :value="modelValue.nationid || ''" @change="set('nationid', $event.target.value)">
              <option value="">請選擇國別</option>
              <option v-for="n in nations" :key="n" :value="n">{{ n }}</option>
            </select></th-hybrid-select>

            <th-hybrid-select v-else-if="f.type === 'sex'"><select :id="fid(f.key)" class="th-select"
                    :value="modelValue.sex || ''" @change="set('sex', $event.target.value)">
              <option value="">請選擇</option>
              <option value="男">男</option>
              <option value="女">女</option>
            </select></th-hybrid-select>

            <label v-else-if="f.type === 'student'" class="flex items-center gap-2 th-label">
              <input type="checkbox" :id="fid(f.key)" :checked="!!modelValue.student"
                     @change="set('student', $event.target.checked)" />{{ f.label }}</label>

            <input v-else :id="fid(f.key)" class="th-input" :type="f.type === 'email' ? 'email' : (f.type === 'date' ? 'date' : 'text')"
                   :placeholder="'請輸入' + f.label" :value="modelValue[f.key] || ''"
                   @input="set(f.key, $event.target.value)" />

            <span v-if="f.hint" class="th-field-hint">{{ f.hint }}</span>
          </div>
        </div>
      </div>
    `,
  };
})();
