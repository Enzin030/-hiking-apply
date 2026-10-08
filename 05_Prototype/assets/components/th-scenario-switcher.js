/* th-scenario-switcher — 申請流程「情境切換」懸浮面板（2026-10-08）
   ------------------------------------------------------------
   使用者 2026-10-08：「我要在一頁裡面可以看到所有情境，幫我加個懸浮面板切換」。
   左下角圓鈕（右下是快捷選單與回到頂端），展開後列出全部申請類別 × 五個步驟，點步驟即前往：
     類別：玉山／雪霸／太魯閣國家公園、警政署入山證、自然保護區域（23 區下拉）、山屋（4 間）
     步驟：閱讀同意書 → 行程規劃 → 隊伍資料 → 確認資料 → 申請完成（四類流程 2026-10-08 起相同）
     複合情境（同日起陸續加入）：山屋＋警政署入山證（camp+npa，可選 4 間山屋）
   掛在申請流程各頁（apply-1～5、apply-2 兩種模式、六步驟行程規劃、apply_03、apply_06），其他頁不掛。

   **第 3 步以後靠「自動前進」，不手寫假資料**：先開該類別的行程規劃頁（帶 new=1，等同新的一張），
   每頁掛載後由本元件按「同意／下一步」直到目標步驟（同意書頁先把未勾的條目勾滿）。
   各頁的必填欄位本來就預帶示意資料（2026-10-02），所以一路的暫存都是真實流程寫出來的，
   與 tools/verify/prefill_chain.mjs 走的是同一條路。目標為「申請完成」時最後按「確認送出／送出申請」，停在成功訊息（四類送出後都只跳 SweetAlert，沒有獨立完成畫面）。
   進度記在 sessionStorage（th_scn_auto）；遇到警告彈窗、找不到按鈕或逾時即停止並清掉，畫面停在該頁。
   面板開合記在 localStorage（th_scn_open，讀寫皆 try/catch）。

   資料：TH_CABIN_DATA（th-forest-camp-shared.js，全站載入）；TH_FOREST_AREAS 不是每頁都有，
   面板打開時才補載 components/ForestAreaData.js。 */
(function () {
  var AUTO_KEY = "th_scn_auto";
  var OPEN_KEY = "th_scn_open";
  var NPA_ORG = "8F7C09DC-AFEB-4708-A7BB-B20DA2A24648";
  var PARKS = ["yushan", "shei-pa", "taroko"];
  var STEP2 = { "apply-3.html": 1, "apply_npa_2.html": 1, "apply_forest_area_2.html": 1, "forest-camp-2.html": 1 };

  function store(kind, key, val) {
    try {
      var s = kind === "local" ? window.localStorage : window.sessionStorage;
      if (val === undefined) { var v = s.getItem(key); return v ? JSON.parse(v) : null; }
      if (val === null) s.removeItem(key); else s.setItem(key, JSON.stringify(val));
    } catch (e) { /* storage 不可用時略過 */ }
    return null;
  }
  function fcState() { return (window.thFcState && window.thFcState.load()) || {}; }
  function pageName() { return (window.location.pathname.split("/").pop() || "").toLowerCase(); }
  function visible(el) { return !!(el && el.offsetParent !== null && !el.disabled); }

  /* 目前頁面對應的情境（類別、區域、山屋、步驟）。步驟 0＝路線列表 */
  function detect() {
    var q = new URLSearchParams(window.location.search);
    var page = pageName();
    var st = fcState();
    var r = { kind: "", area: "", cabin: "", step: 0 };
    if (page === "apply-2.html") {
      r.step = 1;
      r.kind = q.get("kind") || (PARKS.indexOf(q.get("unit")) >= 0 ? q.get("unit") : "yushan");
      if (r.kind === "camp" && q.get("npa") === "1") r.kind = "camp+npa";
      r.area = q.get("tmpc_id") || "";
      r.cabin = q.get("route") || "";
    } else if (page === "apply-3.html" || page === "apply-4.html" || page === "apply-5.html") {
      r.step = { "apply-3.html": 2, "apply-4.html": 3, "apply-5.html": 4 }[page];
      var u = q.get("park") || q.get("unit");
      r.kind = PARKS.indexOf(u) >= 0 ? u : "yushan";
    } else if (page === "apply_npa_2.html") { r.step = 2; r.kind = "npa"; }
    else if (page === "apply_forest_area_2.html") { r.step = 2; r.kind = "area"; r.area = q.get("tmpc_id") || st.areaCid || ""; }
    else if (page === "forest-camp-2.html") { r.step = 2; r.kind = (q.get("npa") === "1" || st.hasNpa) ? "camp+npa" : "camp"; r.cabin = q.get("route") || st.route || ""; }
    else if (page === "apply_03.html" || page === "apply_06.html") {
      r.kind = st.kind || "camp";
      if (r.kind === "camp" && st.hasNpa) r.kind = "camp+npa";
      r.area = st.areaCid || "";
      r.cabin = st.route || "";
      r.step = page === "apply_03.html" ? 3 : 4;   // 申請完成＝確認頁送出後的成功訊息（2026-10-08 起四類相同），沒有獨立畫面
    }
    return r;
  }

  window.thComponents = window.thComponents || {};
  window.thComponents["th-scenario-switcher"] = {
    data() {
      var cur = detect();
      return {
        open: !!store("local", OPEN_KEY),
        cur: cur,
        kind: cur.kind || "yushan",
        area: cur.area || "610",
        cabin: cur.cabin || "jiaming",
        areas: [],
        busy: !!store("session", AUTO_KEY),
      };
    },
    computed: {
      kinds() {
        return [
          { id: "yushan", label: "玉山國家公園" },
          { id: "shei-pa", label: "雪霸國家公園" },
          { id: "taroko", label: "太魯閣國家公園" },
          { id: "npa", label: "警政署入山證" },
          { id: "area", label: "自然保護區域" },
          { id: "camp", label: "山屋" },
        ];
      },
      /* 複合情境：一趟多個子申請（設計稿 §0、§6） */
      combos() {
        return [
          { id: "camp+npa", label: "山屋＋警政署入山證" },
        ];
      },
      needCabin() { return this.kind === "camp" || this.kind === "camp+npa"; },
      steps() {
        return [
          { n: 1, label: "閱讀同意書" },
          { n: 2, label: "行程規劃" },
          { n: 3, label: "隊伍資料" },
          { n: 4, label: "確認資料" },
          { n: 5, label: "申請完成" },
        ];
      },
      cabins() {
        var d = window.TH_CABIN_DATA || {};
        return Object.keys(d).map(function (k) { return { id: k, label: d[k].name }; });
      },
      /* 目前選的情境是不是就是這一頁（步驟鈕標示用） */
      sameScenario() {
        var c = this.cur;
        if (c.kind !== this.kind) return false;
        if (this.kind === "area") return c.area === this.area;
        if (this.needCabin) return c.cabin === this.cabin;
        return true;
      },
    },
    watch: {
      open(v) { store("local", OPEN_KEY, v ? 1 : null); if (v) this.loadAreas(); },
    },
    mounted() {
      if (this.open) this.loadAreas();
      if (this.busy) setTimeout(this.autoStep, 700);
    },
    methods: {
      loadAreas() {
        if (this.areas.length) return;
        var self = this;
        var fill = function () {
          var a = window.TH_FOREST_AREAS || {};
          self.areas = Object.keys(a).map(function (k) { return { id: k, fId: a[k].fId, label: a[k].type + "｜" + a[k].name }; });
        };
        if (window.TH_FOREST_AREAS) { fill(); return; }
        var s = document.createElement("script");
        s.src = "components/ForestAreaData.js";
        s.onload = fill;
        document.body.appendChild(s);
      },
      /* 各類別第 1 步（同意書）與第 2 步（行程規劃）的網址 */
      entryUrl(step) {
        var k = this.kind;
        var area = (window.TH_FOREST_AREAS || {})[this.area] || {};
        if (PARKS.indexOf(k) >= 0) {
          if (step === 1) return "apply-2.html?unit=" + k;
          return "apply-3.html?unit=" + k + (k === "yushan" ? "" : "&park=" + k);
        }
        if (k === "npa") return step === 1 ? "apply-2.html?kind=npa&unit=" + NPA_ORG : "apply_npa_2.html?unit=" + NPA_ORG + "&new=1";
        if (k === "area") {
          var aq = "tmpc_id=" + encodeURIComponent(this.area) + (area.fId ? "&tmpf_id=" + area.fId : "");
          return step === 1 ? "apply-2.html?kind=area&" + aq : "apply_forest_area_2.html?" + aq + "&new=1";
        }
        var npa = k === "camp+npa" ? "&npa=1" : "";
        return step === 1 ? "apply-2.html?kind=camp&route=" + this.cabin + npa : "forest-camp-2.html?route=" + this.cabin + npa + "&new=1";
      },
      go(step) {
        if (this.busy) return;
        try { window.sessionStorage.removeItem("th_fc_apply"); } catch (e) { /* 略過 */ }
        if (step >= 3) store("session", AUTO_KEY, { target: step, n: 0, t: Date.now() });
        else store("session", AUTO_KEY, null);
        window.location.href = this.entryUrl(step);
      },
      stop() { store("session", AUTO_KEY, null); this.busy = false; },
      /* 自動前進一步（每頁掛載後呼叫一次；換頁後由下一頁的本元件接手） */
      autoStep() {
        var a = store("session", AUTO_KEY);
        if (!a) { this.busy = false; return; }
        var cur = detect();
        if (cur.step >= a.target || a.n > 8 || Date.now() - a.t > 60000) { this.stop(); return; }
        /* 同意書頁：把未勾的條目勾滿（國家公園有預設未勾的條目） */
        document.querySelectorAll(".th-consent-item:not(.is-acked) .th-consent-item-lead").forEach(function (el) { el.click(); });
        var self = this;
        setTimeout(function () {
          var btns = Array.prototype.filter.call(document.querySelectorAll("button"), function (b) {
            return visible(b) && /^(同意|下一步|確認送出|送出申請)$/.test(b.textContent.trim());
          });
          var btn = btns[btns.length - 1];
          if (!btn) { self.stop(); return; }
          var submit = /確認送出|送出申請/.test(btn.textContent);
          store("session", AUTO_KEY, { target: a.target, n: a.n + 1, t: Date.now() });
          btn.click();
          /* 送出後同一頁變成完成畫面（或彈出成功訊息）；沒變就再按一次（次數受 n 上限控制，實測 50 次偶發 1 次沒反應） */
          if (submit) {
            setTimeout(function () {
              self.cur = detect();
              if (self.cur.step >= a.target || document.querySelector(".swal2-popup")) self.stop();
              else self.autoStep();
            }, 800);
            return;
          }
          /* 沒換頁（檢核警告）就停下，畫面留在警告 */
          setTimeout(function () { if (document.querySelector(".swal2-popup")) self.stop(); }, 1500);
        }, 150);
      },
    },
    template: `
      <div class="th-scn" :class="{ 'is-open': open }">
        <button v-if="!open" type="button" class="th-scn-fab" @click="open = true" aria-label="開啟情境切換面板">
          <i class="fa-solid fa-sliders" aria-hidden="true"></i><span>情境</span>
        </button>
        <section v-else class="th-scn-panel" aria-label="情境切換">
          <div class="th-scn-head">
            <span class="th-scn-title"><i class="fa-solid fa-sliders" aria-hidden="true"></i>情境切換</span>
            <button type="button" class="th-scn-close" @click="open = false" aria-label="收合情境切換面板"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
          </div>
          <div class="th-scn-body">
            <div class="th-scn-label">申請類別</div>
            <div class="th-chip-row">
              <button v-for="k in kinds" :key="k.id" type="button" class="th-chip" :class="{ 'is-active': kind === k.id }" @click="kind = k.id">{{ k.label }}</button>
            </div>
            <template v-if="kind === 'area'">
              <div class="th-scn-label">區域</div>
              <select class="th-select th-scn-select" v-model="area" aria-label="區域">
                <option v-for="a in areas" :key="a.id" :value="a.id">{{ a.label }}</option>
              </select>
            </template>
            <div class="th-scn-label">複合情境</div>
            <div class="th-chip-row">
              <button v-for="k in combos" :key="k.id" type="button" class="th-chip" :class="{ 'is-active': kind === k.id }" @click="kind = k.id">{{ k.label }}</button>
            </div>
            <template v-if="needCabin">
              <div class="th-scn-label">山屋</div>
              <div class="th-chip-row">
                <button v-for="c in cabins" :key="c.id" type="button" class="th-chip" :class="{ 'is-active': cabin === c.id }" @click="cabin = c.id">{{ c.label }}</button>
              </div>
            </template>
            <div class="th-scn-label">步驟（點選即前往）</div>
            <div class="th-scn-steps">
              <button v-for="s in steps" :key="s.n" type="button" class="th-scn-step"
                      :class="{ 'is-current': sameScenario && cur.step === s.n }" :disabled="busy" @click="go(s.n)">
                <span class="th-scn-step-no">{{ s.n }}</span>{{ s.label }}
              </button>
            </div>
            <p v-if="busy" class="th-scn-busy" role="status">
              <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>自動前進中⋯
              <button type="button" class="th-scn-stop" @click="stop">停止</button>
            </p>
          </div>
        </section>
      </div>
    `,
  };
})();
