/* ============================================================
   open.js — 登山路線開放狀態的資料、狀態與初始化（原 OpenStatus.jsx，387 行）
   版面已搬回 open.html。
   ============================================================

   ------------------------------------------------------------
   useState / useMemo / useEffect → Vue 的逐一對應
   ------------------------------------------------------------
   | 原 React                            | Vue                    | 備註 |
   |-------------------------------------|------------------------|------|
   | useState(EMPTY_FILTER) draft        | data.draft             | 表單草稿 |
   | useState(EMPTY_FILTER) filter       | data.filter            | 按查詢才套用 |
   | useState(1)            page         | data.page              | |
   | useState(null)         levelModal   | data.levelModal        | 存難度數字，**0 是有效值** |
   | useState(null)         noteModal    | data.noteModal         | 存整列資料 |
   | useMemo mainRoutes [draft.org]      | computed.mainRoutes    | 主路線下拉隨機關連動 |
   | useMemo rows       [filter]         | computed.rows          | |
   | useEffect Esc 監聽 [levelModal, noteModal] | **改由 th-modal 自己處理** | 見下 |
   | setField(patch)                     | methods.setField       | Object.assign 淺合併 |
   | submit(e)                           | methods.submit         | @submit.prevent |
   | reset()                             | methods.reset          | |
   | changeOrg(org)                      | methods.changeOrg      | 換機關時主路線回 all |
   | 區域元件 Legend                      | 直接寫在 open.html     | 純版面，無狀態 |
   | 區域元件 LevelModal／NoteModal       | **改用共用的 th-modal** | 見下 |
   | 共用元件 BulletinPager               | th-table-pager         | |

   ------------------------------------------------------------
   兩個 modal 改用共用的 th-modal（本輪第一次真的用上它）
   ------------------------------------------------------------
   這兩支的 DOM 與 th-modal **完全同構**：
     .bulletin-modal-overlay > .bulletin-modal > .bulletin-modal-head
       > div > (.bulletin-modal-meta + h2.bulletin-modal-title)
       + button.bulletin-modal-close > i
     > .bulletin-modal-body[+ 修飾 class]
   而且兩支都沒有 role="dialog"／aria-modal（news 那支有，所以 news 不能用），
   所以換成 th-modal 不會改變 DOM。

   Esc 關閉：原本是頁面層的 useEffect，只在有 modal 開啟時掛監聽；
   th-modal 是 mounted 掛、unmounted 解除，而 modal 用 v-if 控制，
   兩者「監聽只在 modal 開啟期間存在」的語意相同，故不再自己寫 useEffect 的翻譯。

   ------------------------------------------------------------
   levelModal 的判空要用 !== null，不能用真假值
   ------------------------------------------------------------
   難度等級有第 0 級（TrailLevelData 是 0～6 級），`v-if="levelModal"` 會讓
   第 0 級點不開。原 React 寫的是 `levelModal !== null &&`，照搬。
   ============================================================ */

const PAGE_SIZE = 20;

/* 可否申請：正式站 fas fa-check / fas fa-times */
const CAN_APPLY_META = {
  yes: { label: "可申請", icon: "fa-solid fa-circle-check", cls: "is-yes" },
  no:  { label: "不可申請", icon: "fa-solid fa-circle-xmark", cls: "is-no" },
};

/*
  路線現況：正式站圖例列了四種，實際資料目前只出現 open 與 closed 兩種；
  proof 與 snow 保留定義（圖例照樣呈現），待有實例再驗。
*/
const STATUS_META = {
  open:   { label: "本日開放", icon: "fa-regular fa-circle-check", cls: "is-open" },
  closed: { label: "本日關閉", icon: "fa-solid fa-ban", cls: "is-closed" },
  proof:  { label: "依規檢附登山經驗證明", icon: "fa-solid fa-triangle-exclamation", cls: "is-proof" },
  snow:   { label: "雪季", icon: "fa-regular fa-snowflake", cls: "is-snow" },
};

/* orgLabel → bulletin-badge 的既有機關配色 */
const ORG_BADGE = {
  "太管處": "taroko",
  "雪管處": "sheipa",
  "玉管處": "yushan",
  "自然保留區": "forestry",
  "自然保護區": "forestry",
  "野生動物保護區": "forestry",
  "國家步道(山屋/營地)": "forestry",
  "警政署入山": "police",
};

/* 是否須要申請的四個子欄（欄名照正式站表頭，不合併） */
const NEED_COLUMNS = [
  { key: "needParkPermit",     label: "入園證" },
  { key: "needReserve",        label: "林業及自然保育署自然保護留區" },
  { key: "needForestStay",     label: "林業及自然保育署住宿" },
  { key: "needMountainPermit", label: "警政署入山證" },
];

const EMPTY_FILTER = { org: "all", mainRoute: "all", q: "" };

/* ── 圖例 ── */

thPage({
  data() {
    return {
      draft: Object.assign({}, EMPTY_FILTER),
      filter: Object.assign({}, EMPTY_FILTER),
      page: 1,
      levelModal: null,
      noteModal: null,
    };
  },

  computed: {
    orgButtons() { return OPEN_ORG_BUTTONS; },
    needColumns() { return NEED_COLUMNS; },
    canApplyMeta() { return CAN_APPLY_META; },
    statusMeta() { return STATUS_META; },
    orgBadge() { return ORG_BADGE; },
    kitPdf() { return KIT_PDF; },

    /* 主路線下拉隨機關連動（正式站也是選機關後才重整路線下拉） */
    mainRoutes() {
      var org = this.draft.org;
      var pool = org === "all"
        ? OPEN_STATUS_ROWS
        : OPEN_STATUS_ROWS.filter(function (r) { return r.filterKey === org; });
      var seen = {};
      var out = [];
      pool.forEach(function (r) {
        if (!seen[r.mainRoute]) { seen[r.mainRoute] = true; out.push(r.mainRoute); }
      });
      return out.sort(function (a, b) { return a.localeCompare(b, "zh-Hant"); });
    },

    /*
      主路線下拉的 <optgroup> 分組（2026-09-10，模式 2）
      ------------------------------------------------------------
      432 條主路線攤成一張平的清單，捲起來找不到東西。改用原生 <optgroup>
      依每列的 filterKey 分組。

      **這是新增的 computed，mainRoutes 與 changeOrg 一行都沒動。**
      mainRoutes 仍負責「全部路線（N 條）」那個計數，兩者取的是同一個 pool。

      組的順序照 OPEN_ORG_BUTTONS，與上面那排機關頁籤一致——
      不用 Object.keys 的偶然順序。

      **只有選「全部」時才有多組**；選了特定機關時 pool 已被篩成單一 filterKey，
      這時 optgroup 只會有一組、標題與已選的頁籤重複，所以那種情況維持平的清單
      （樣板用 groups.length > 1 判斷）。

      注意「其他路線」同時出現在 shei-pa 與 yushan 兩組（資料就是這樣），
      所以分組後的總數 433 比去重後的 432 多一條。這是刻意保留的：
      兩組各自列出自己的「其他路線」才對得上該機關的資料，
      而 value 相同，選哪一個結果都一樣。
    */
    mainRouteGroups() {
      var org = this.draft.org;
      var pool = org === "all"
        ? OPEN_STATUS_ROWS
        : OPEN_STATUS_ROWS.filter(function (r) { return r.filterKey === org; });
      var byKey = {};
      pool.forEach(function (r) {
        (byKey[r.filterKey] || (byKey[r.filterKey] = {}))[r.mainRoute] = true;
      });
      var out = [];
      OPEN_ORG_BUTTONS.forEach(function (b) {
        if (b.key === "all" || !byKey[b.key]) return;
        out.push({
          key: b.key,
          label: b.label,
          routes: Object.keys(byKey[b.key])
            .sort(function (a, c) { return a.localeCompare(c, "zh-Hant"); }),
        });
      });
      return out;
    },

    rows() {
      var f = this.filter;
      var q = f.q.trim();
      return OPEN_STATUS_ROWS.filter(function (r) {
        if (f.org !== "all" && r.filterKey !== f.org) return false;
        if (f.mainRoute !== "all" && r.mainRoute !== f.mainRoute) return false;
        if (q && !(r.name.indexOf(q) >= 0 || r.mainRoute.indexOf(q) >= 0 ||
                   r.orgLabel.indexOf(q) >= 0 || r.note.indexOf(q) >= 0)) return false;
        return true;
      });
    },

    totalPages() { return Math.max(1, Math.ceil(this.rows.length / PAGE_SIZE)); },
    pageRows() { return this.rows.slice((this.page - 1) * PAGE_SIZE, this.page * PAGE_SIZE); },

    /* 難度彈窗要顯示的那一列（levelModal 存的是等級數字） */
    levelRow() {
      var lv = this.levelModal;
      if (lv === null) return null;
      return TRAIL_LEVELS.find(function (r) { return r.level === lv; }) || null;
    },
  },

  methods: {
    setField(patch) { this.draft = Object.assign({}, this.draft, patch); },
    submit() {
      this.filter = Object.assign({}, this.draft);
      this.page = 1;
    },
    reset() {
      this.draft = Object.assign({}, EMPTY_FILTER);
      this.filter = Object.assign({}, EMPTY_FILTER);
      this.page = 1;
    },
    /* 切換機關時，原本選定的主路線可能已不在新清單內 */
    changeOrg(org) { this.setField({ org: org, mainRoute: "all" }); },
    isArray(v) { return Array.isArray(v); },
  },
});
