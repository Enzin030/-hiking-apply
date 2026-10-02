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
  /* 登山路線圖詞庫與圖幅：2026-10-02 正式站 apply_npa_2 逐一切換擷取（Func=NpaPaths）。
     上河兩個詞庫有圖幅；其餘五個切換後沒有圖幅選項，登山路線圖只取詞庫名稱。 */
  var LIBS = [
    { id: "TM00", name: "上河文化台灣百岳導遊圖", subs: [
        { id: "M15", name: "東郡山彙" },
        { id: "TM01", name: "臺灣百岳全圖" },
        { id: "TM02", name: "百岳賞花圖鑑圖" },
        { id: "TM03", name: "百岳登山須知" },
        { id: "TM04", name: "玉山群峰縱走" },
        { id: "TM05", name: "郡大山．西巒大山單登" },
        { id: "TM06", name: "聖稜 Y 型縱走" },
        { id: "TM07", name: "雪山西．南稜縱走" },
        { id: "TM08", name: "白姑大山單登" },
        { id: "TM09", name: "北一段縱走" },
        { id: "TM10", name: "北二段縱走" },
        { id: "TM11", name: "合歡．奇萊縱走" },
        { id: "TM12", name: "太魯閣山列(奇萊東稜)縱走" },
        { id: "TM13", name: "能高越嶺" },
        { id: "TM14", name: "能高安東軍縱走" },
        { id: "TM15", name: "干卓萬群峰縱走" },
        { id: "TM16", name: "七彩湖．六順山" },
        { id: "TM17", name: "丹大．東郡橫斷縱走" },
        { id: "TM18", name: "馬博拉斯橫斷縱走" },
        { id: "TM19", name: "南二段縱走" },
        { id: "TM20", name: "新康橫斷縱走" },
        { id: "TM21", name: "南一段縱走" },
        { id: "TM22", name: "北大武山登峰" }
      ] },
    { id: "M00", name: "上河文化台灣高山全覽圖", subs: [
        { id: "M01", name: "玉山群峰" },
        { id: "M02", name: "西巒大山．郡大山" },
        { id: "M03", name: "北宜屋脊．松蘿湖．阿玉山" },
        { id: "M04", name: "北桃．桃竹屋脊．司馬庫司" },
        { id: "M05", name: "雪山聖稜線" },
        { id: "M06", name: "雪山西．南稜" },
        { id: "M07", name: "白姑大山．合歡山" },
        { id: "M08", name: "太平山．翠峰湖．加羅湖" },
        { id: "M09", name: "北一．北二段" },
        { id: "M10", name: "二子山．清水山" },
        { id: "M11", name: "合歡．奇萊．太魯閣山列" },
        { id: "M12", name: "能高群峰" },
        { id: "M13", name: "干卓萬山群" },
        { id: "M14", name: "南三主稜 (丹大山列)" },
        { id: "M16", name: "馬博拉斯橫貫" },
        { id: "M17", name: "南二段" },
        { id: "M18", name: "新康山列" },
        { id: "M19", name: "南一段" },
        { id: "M20", name: "中央山脈主脊陷落區" },
        { id: "M21", name: "卑南東稜．美奈田主山" },
        { id: "M22", name: "雙鬼湖" },
        { id: "M23", name: "大武地壘" },
        { id: "M24", name: "中央山脈大武南主脊" },
        { id: "M25", name: "台灣百岳全圖" }
      ] },
    { id: "E00", name: "玉山國家登山路線導覽圖", subs: [] },
    { id: "D00", name: "雪霸國家公園地圖", subs: [] },
    { id: "C00", name: "經建三版地形圖地圖產生器", subs: [] },
    { id: "B00", name: "台灣地理人文全覽圖南島", subs: [] },
    { id: "A00", name: "台灣地理人文全覽圖北島", subs: [] }
  ];
  window.TH_NPA_LIBS = LIBS;

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
        if (lib && sub) return lib.name + "-" + sub.name;
        return lib && !lib.subs.length ? lib.name : "";   // 無圖幅的詞庫只取詞庫名稱
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
      <div class="th-npa-permit th-npa">
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

        <!-- 填寫模式：比照玉山行程規劃頁的「警政署入山證申請」卡片（2026-10-02 使用者要求）。
             兩欄格線；前往地點下拉＋加入地點按鈕相連；地點清單、登山路線圖雙下拉、計畫書範例框（共用 .th-npa-*）。 -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          <div class="th-field">
            <label class="th-label" :for="fid('reason')"><span>入山事由</span><span class="th-label-en">Reason for Mountain Entry</span></label>
            <th-hybrid-select><select :id="fid('reason')" class="th-select" :value="v.reason" @change="emit({ reason: $event.target.value })">
              <option v-for="r in reasons" :key="r" :value="r">{{ r }}</option>
            </select></th-hybrid-select>
          </div>

          <div class="th-field">
            <label class="th-label" :for="fid('place')"><span><span class="req">*</span>前往地點</span><span class="th-label-en">Destination</span></label>
            <div class="th-npa-input-group">
              <th-hybrid-select class="th-npa-joined-hybrid"><select :id="fid('place')" class="th-select" v-model="picked">
                <option value="">請選擇前往地點</option>
                <option v-for="p in filtered" :key="p.code" :value="p.code">{{ p.name }}</option>
              </select></th-hybrid-select>
              <button type="button" class="th-btn th-btn-secondary th-btn-sm th-npa-joined-btn" :disabled="!picked" @click="addPlace">加入地點</button>
            </div>
            <span v-if="!v.places.length" class="th-field-hint">尚未加入地點，至少需加入一處</span>
          </div>

          <div v-if="v.places.length" class="th-field sm:col-span-2">
            <ul class="th-npa-places">
              <li v-for="(p, i) in v.places" :key="p.code" class="th-npa-place-row">
                <i class="fa-solid fa-location-dot text-red-500 flex-shrink-0" aria-hidden="true"></i>
                <span class="th-npa-place-name">{{ p.name }}</span>
                <input class="th-input th-npa-place-input" type="text" placeholder="前往地點描述（必填）" :aria-label="p.name + ' 描述'"
                       :value="p.desc" @input="setDesc(i, $event.target.value)" />
                <button type="button" class="th-npa-place-del" title="刪除地點" @click="removePlace(i)">
                  <i class="fa-solid fa-trash-can mr-1" aria-hidden="true"></i>刪除</button>
              </li>
            </ul>
          </div>

          <div class="th-field sm:col-span-2">
            <label class="th-label" :for="fid('lib')"><span><span class="req">*</span>登山路線圖</span><span class="th-label-en">Route Map</span></label>
            <div class="th-npa-vocab-row">
              <th-hybrid-select><select :id="fid('lib')" class="th-select" :value="v.lib" @change="emit({ lib: $event.target.value, sub: '' })">
                <option value="">請選擇詞庫</option>
                <option v-for="l in libs" :key="l.id" :value="l.id">{{ l.name }}</option>
              </select></th-hybrid-select>
              <th-hybrid-select><select class="th-select" :value="v.sub" :disabled="!subs.length" aria-label="圖幅" @change="emit({ sub: $event.target.value })">
                <option value="">請選擇圖幅</option>
                <option v-for="s in subs" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select></th-hybrid-select>
            </div>
            <div class="mt-2">
              <input type="text" class="th-input th-input-readonly" :value="routeMap" placeholder="選擇詞庫與圖幅後自動帶入" readonly aria-label="登山路線圖" />
            </div>
          </div>

          <div class="th-field sm:col-span-2">
            <label class="th-label" :for="fid('plan')"><span><span class="req">*</span>登山計畫書</span><span class="th-label-en">Plan</span></label>
            <textarea :id="fid('plan')" class="th-textarea" rows="5" placeholder="D1：奇萊登山口→奇萊主北岔路口→奇萊北峰→月型池。"
                      :value="v.plan" @input="emit({ plan: $event.target.value })"></textarea>
            <!-- 範例原文取自 2026-09-17 測試站太魯閣步驟一截圖（TAR026_S02_filled），與玉山卡片相同 -->
            <div class="th-npa-plan-example">
              <p class="th-npa-plan-example-title">【登山計畫書填寫範例】</p>
              <p>※計畫書內容約300字，請參考範例，簡要述明。</p>
              <p v-for="l in planExample" :key="l">{{ l }}</p>
            </div>
          </div>
        </div>
      </div>
    `,
  };
})();
