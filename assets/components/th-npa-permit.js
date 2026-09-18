/* ============================================================
   th-npa-permit — 警政署入山證申請區塊
   ------------------------------------------------------------
   2026-09-17 新增。依據（.scratch/outputs/正式站申請流程盤點/）：
   - F1三家比對.md Q4：玉山 apply_1_4.aspx 與太魯閣 step1.ascx 各有一份，
     五個控制項 ID（NpaReasons／NpaPlacesInfo／NpaPaths／NpasubPaths／NpaPlan）
     一字不差；雪霸沒有。
   - 採集表-測試站.md：警政署入山證獨立流程 apply_npa_2.aspx 也是同一組欄位。
   → 舊站同一區塊至少三份，**提升為共用**。

   **要不要顯示由頁面決定**（依路線是否需要入山證），本元件不判斷。
   舊站是路線層級的條件（南湖大山線要、奇萊主北峰線不要）。

   ------------------------------------------------------------
   欄位（依實走與程式碼）
   ------------------------------------------------------------
   | 欄位 | 舊站 | 本元件 |
   |------|------|--------|
   | 入山事由 | NpaReasons，25 個選項 | 下拉，示意選項 |
   | 前往地點 | Chosen.js 搜尋下拉（477 筆）＋「加入地點」＋每筆「前往地點描述」 | 關鍵字篩選＋下拉＋加入，可移除 |
   | 登山路線圖 | NpaPaths（詞庫 8 項）→ NpasubPaths（圖幅）→ 合成 RouteMap 文字 | 兩層下拉，唯讀顯示合成結果 |
   | 登山計畫書 | NpaPlan，範例說明「約 300 字」 | textarea |

   **前往地點只放示意子集**，不是 477 筆完整清單。
   舊站警政署 F4 的「下一步」會檢查每個地點的描述是否填寫
   （apply_npa_2 的 NpaNext → ChkFormRequired），所以描述欄標為必填。

   ------------------------------------------------------------
   本元件不新增任何 CSS（同 th-captcha），沿用 .th-field 系列與 Tailwind。
   下拉一律包 <th-hybrid-select>（共用元件），與全站下拉外觀一致。
   ------------------------------------------------------------

   用法：
       <th-npa-permit id-prefix="npa" v-model="npa"></th-npa-permit>
       <th-npa-permit id-prefix="c-npa" :model-value="npa" readonly></th-npa-permit>
   ============================================================ */
(function () {
  "use strict";

  /* 以下皆為示意值（見檔頭） */
  var REASONS = ["登山健行", "救濟", "文化", "醫療", "衛生", "學術研究", "其他"];

  /* 登山計畫書填寫範例：舊站太魯閣步驟一的原文（範例用奇萊路線，與所選路線無關） */
  var PLAN_EXAMPLE = [
    "D1：奇萊登山口→奇萊主北岔路口→奇萊北峰→月型池。",
    "D2：月型池→磐石山→磐石山西峰→三叉營地。",
    "D3：三叉營地→太魯閣大山→三叉營地→平安池→廣寒宮。",
    "D4：廣寒宮→立霧主山→三冬路口→帕托魯大山→三叉路口。",
  ];
  var PLACES = [
    { code: "865+10002+10002110+1+0", name: "南湖中央尖山(宜蘭縣-大同鄉)" },
    { code: "S-001", name: "南湖大山(台中市-和平區)" },
    { code: "S-002", name: "中央尖山(花蓮縣-秀林鄉)" },
    { code: "S-003", name: "奇萊主山(花蓮縣-秀林鄉)" },
    { code: "S-004", name: "合歡山(南投縣-仁愛鄉)" },
    { code: "S-005", name: "雪山(台中市-和平區)" },
  ];
  var LIBS = [
    { id: "TM00", name: "上河文化台灣百岳導遊圖",
      subs: [{ id: "M15", name: "東郡山彙" }, { id: "TM01", name: "臺灣百岳全圖" }] },
    { id: "M00", name: "上河文化台灣高山全覽圖",
      subs: [{ id: "M00-1", name: "玉山群峰" }, { id: "M00-2", name: "南湖中央尖" }] },
    { id: "E00", name: "玉山國家登山路線導覽圖", subs: [{ id: "E00-1", name: "玉山主峰線" }] },
    { id: "D00", name: "雪霸國家公園地圖", subs: [{ id: "D00-1", name: "雪山主東線" }] },
  ];

  window.thComponents = window.thComponents || {};
  window.thComponents["th-npa-permit"] = {
    props: {
      modelValue: { type: Object, default: function () { return {}; } },
      readonly: { type: Boolean, default: false },
      idPrefix: { type: String, required: true },
    },
    emits: ["update:modelValue"],
    data() {
      return { reasons: REASONS, libs: LIBS, keyword: "", picked: "", planExample: PLAN_EXAMPLE };
    },
    computed: {
      v() {
        return Object.assign({ reason: "登山健行", places: [], lib: "", sub: "", plan: "" }, this.modelValue);
      },
      filtered() {
        var kw = this.keyword.trim();
        var taken = this.v.places.map(function (p) { return p.code; });
        return PLACES.filter(function (p) {
          return taken.indexOf(p.code) < 0 && (!kw || p.name.indexOf(kw) >= 0);
        });
      },
      subs() {
        var self = this;
        var lib = LIBS.find(function (l) { return l.id === self.v.lib; });
        return lib ? lib.subs : [];
      },
      routeMap() {
        var self = this;
        var lib = LIBS.find(function (l) { return l.id === self.v.lib; });
        var sub = this.subs.find(function (s) { return s.id === self.v.sub; });
        return lib && sub ? lib.name + "-" + sub.name : "";
      },
    },
    methods: {
      fid(k) { return this.idPrefix + "-" + k; },
      emit(patch) { this.$emit("update:modelValue", Object.assign({}, this.v, patch)); },
      addPlace() {
        var self = this;
        var p = PLACES.find(function (x) { return x.code === self.picked; });
        if (!p) return;
        this.emit({ places: this.v.places.concat([{ code: p.code, name: p.name, desc: "" }]) });
        this.picked = "";
      },
      removePlace(i) {
        var list = this.v.places.slice();
        list.splice(i, 1);
        this.emit({ places: list });
      },
      setDesc(i, desc) {
        var list = this.v.places.map(function (p, j) { return j === i ? Object.assign({}, p, { desc: desc }) : p; });
        this.emit({ places: list });
      },
    },
    template: `
      <div class="th-npa-permit">
        <dl v-if="readonly" class="grid grid-cols-1 gap-y-3">
          <div class="th-field"><dt class="th-label">入山事由</dt><dd class="th-input th-input-readonly">{{ v.reason }}</dd></div>
          <div class="th-field"><dt class="th-label">前往地點</dt>
            <dd class="th-input th-input-readonly">
              <template v-if="v.places.length"><div v-for="p in v.places" :key="p.code">{{ p.name }}<template v-if="p.desc">：{{ p.desc }}</template></div></template>
              <template v-else>—</template>
            </dd></div>
          <div class="th-field"><dt class="th-label">登山路線圖</dt><dd class="th-input th-input-readonly">{{ routeMap || '—' }}</dd></div>
          <div class="th-field"><dt class="th-label">登山計畫書</dt><dd class="th-input th-input-readonly whitespace-pre-line">{{ v.plan || '—' }}</dd></div>
        </dl>

        <div v-else class="grid grid-cols-1 gap-y-5">
          <div class="th-field">
            <label class="th-label" :for="fid('reason')">入山事由<span class="th-label-en">Reason for Mountain Entry</span></label>
            <th-hybrid-select><select :id="fid('reason')" class="th-select" :value="v.reason" @change="emit({ reason: $event.target.value })">
              <option v-for="r in reasons" :key="r" :value="r">{{ r }}</option>
            </select></th-hybrid-select>
          </div>

          <div class="th-field">
            <label class="th-label" :for="fid('place')"><span class="req">*</span>前往地點<span class="th-label-en">Destination</span></label>
            <div class="flex flex-col sm:flex-row gap-2">
              <input class="th-input sm:w-40" type="text" placeholder="輸入關鍵字篩選" v-model="keyword" :aria-label="'前往地點關鍵字'" />
              <th-hybrid-select><select :id="fid('place')" class="th-select flex-1" v-model="picked">
                <option value="">請選擇前往地點</option>
                <option v-for="p in filtered" :key="p.code" :value="p.code">{{ p.name }}</option>
              </select></th-hybrid-select>
              <button type="button" class="th-btn th-btn-primary shrink-0" :disabled="!picked" @click="addPlace">加入地點</button>
            </div>
            <ul v-if="v.places.length" class="mt-3 grid gap-2">
              <li v-for="(p, i) in v.places" :key="p.code" class="flex flex-col sm:flex-row sm:items-center gap-2">
                <span class="sm:w-64 shrink-0">{{ p.name }}</span>
                <input class="th-input flex-1" type="text" placeholder="前往地點描述（必填）" :aria-label="p.name + ' 描述'"
                       :value="p.desc" @input="setDesc(i, $event.target.value)" />
                <button type="button" class="th-btn th-btn-ghost th-btn-sm shrink-0" @click="removePlace(i)">
                  <i class="fa-solid fa-trash-can" aria-hidden="true"></i>移除</button>
              </li>
            </ul>
            <span v-else class="th-field-hint">尚未加入地點，至少需加入一處</span>
          </div>

          <div class="th-field">
            <label class="th-label" :for="fid('lib')"><span class="req">*</span>登山路線圖<span class="th-label-en">Route Map</span></label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <th-hybrid-select><select :id="fid('lib')" class="th-select" :value="v.lib" @change="emit({ lib: $event.target.value, sub: '' })">
                <option value="">請選擇詞庫</option>
                <option v-for="l in libs" :key="l.id" :value="l.id">{{ l.name }}</option>
              </select></th-hybrid-select>
              <th-hybrid-select><select class="th-select" :value="v.sub" :disabled="!subs.length" aria-label="圖幅" @change="emit({ sub: $event.target.value })">
                <option value="">請選擇圖幅</option>
                <option v-for="s in subs" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select></th-hybrid-select>
            </div>
            <span class="th-input th-input-readonly mt-2">{{ routeMap || '選擇詞庫與圖幅後自動帶入' }}</span>
          </div>

          <div class="th-field">
            <label class="th-label" :for="fid('plan')"><span class="req">*</span>登山計畫書<span class="th-label-en">Plan</span></label>
            <textarea :id="fid('plan')" class="th-textarea" rows="5" placeholder="D1：登山口→…→宿營地。"
                      :value="v.plan" @input="emit({ plan: $event.target.value })"></textarea>
            <!-- 範例原文取自 2026-09-17 測試站太魯閣步驟一截圖（TAR026_S02_filled） -->
            <div v-if="!readonly" class="th-field-hint">
              <p>【登山計畫書填寫範例】</p>
              <p>※計畫書內容約300字，請參考範例，簡要述明。</p>
              <p v-for="l in planExample" :key="l">{{ l }}</p>
            </div>
          </div>
        </div>
      </div>
    `,
  };
})();
