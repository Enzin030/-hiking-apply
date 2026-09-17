/* ============================================================
   information_place.js — 景點資訊（規格 02_Spec/24_景點資訊.md）
   ------------------------------------------------------------
   舊站 information_place.aspx（列表）＋ information_node.aspx（檢視）。
   兩者共用查詢區，本頁以 `current` 切換：null＝列表、物件＝檢視。

   **window.* 一律在 data() 裡讀**：PlaceData.js 是 <body> 底部的
   parser-inserted script，本檔由 head-loader 佇列載入，沒有保證的先後
   （踩坑總表第七類）。

   查詢條件與已套用的條件分開（applied）：舊站是 PostBack 才更新清單，
   邊打字邊篩會是不同的行為。
   ============================================================ */

let PLACE_ORGS_D = [];
let PLACE_KINDS_D = [];
let PLACE_LIST_D = [];

thPage({
  data() {
    PLACE_ORGS_D = window.PLACE_ORGS || [];
    PLACE_KINDS_D = window.PLACE_KINDS || [];
    PLACE_LIST_D = window.PLACE_DATA || window.PLACE_LIST || [];

    return {
      draft: { org: "", kind: "", keyword: "" },
      applied: { org: "", kind: "", keyword: "" },

      page: 1,
      pageSize: 10,

      current: null,
      photo: 0,
    };
  },

  computed: {
    orgOptions() { return PLACE_ORGS_D; },
    kindOptions() { return PLACE_KINDS_D; },

    trail() {
      return ["旅遊登山資訊", "景點資訊"];
    },

    results() {
      const a = this.applied;
      return PLACE_LIST_D.filter((p) => {
        if (a.org) {
          const selectedOrg = PLACE_ORGS_D.find((o) => o.value === a.org);
          if (selectedOrg && selectedOrg.label && selectedOrg.label !== "全部") {
            const lbl = selectedOrg.label;
            if (p.orgName !== lbl && !p.orgName.includes(lbl) && !lbl.includes(p.orgName)) {
              return false;
            }
          }
        }
        if (a.kind && p.kind !== a.kind) return false;
        if (a.keyword && p.name.indexOf(a.keyword) === -1) return false;
        return true;
      });
    },

    totalPages() {
      return Math.max(1, Math.ceil(this.results.length / this.pageSize));
    },

    safePage() {
      return Math.min(Math.max(1, this.page), this.totalPages);
    },

    pagedResults() {
      const start = (this.safePage - 1) * this.pageSize;
      return this.results.slice(start, start + this.pageSize);
    },
  },

  mounted() {
    const params = new URLSearchParams(window.location.search);
    const kw = params.get("kw") || params.get("keyword");
    const org = params.get("org");
    const kind = params.get("kind");
    if (kw || org || kind) {
      if (kw) { this.draft.keyword = kw; this.applied.keyword = kw; }
      if (org) { this.draft.org = org; this.applied.org = org; }
      if (kind) { this.draft.kind = kind; this.applied.kind = kind; }
    }

    const targetId = params.get("id");
    if (targetId) {
      const found = PLACE_LIST_D.find((x) => String(x.id) === String(targetId));
      if (found) {
        this.open(found);
      }
    }
  },

  methods: {
    kindName(val) {
      const k = PLACE_KINDS_D.find((x) => x.value === val || x.id === val);
      return k ? (k.label || k.name) : (val === "N" ? "一般" : val === "G" ? "登山口" : val === "H" ? "宿營地" : val);
    },

    kindIcon(val) {
      if (val === "G") return "fa-solid fa-person-hiking";
      if (val === "H") return "fa-solid fa-tent";
      return null;
    },

    kindIconClass(val) {
      if (val === "G") return "p-place-kind-icon--trailhead";
      if (val === "H") return "p-place-kind-icon--camp";
      return "";
    },

    search() {
      this.applied = {
        org: this.draft.org,
        kind: this.draft.kind,
        keyword: this.draft.keyword.trim(),
      };
      this.page = 1;
    },

    reset() {
      this.draft = { org: "", kind: "", keyword: "" };
      this.applied = { org: "", kind: "", keyword: "" };
      this.page = 1;
    },

    open(p) {
      this.current = p;
      this.photo = 0;
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("id", p.id);
        window.history.replaceState(null, "", url.toString());
      } catch (e) {}
    },

    closeModal() {
      this.current = null;
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("id");
        window.history.replaceState(null, "", url.toString());
      } catch (e) {}
    },

    onImgError(e) {
      e.target.style.opacity = '0.3';
    },

    /* 輪播用取餘數繞回，不在兩端停住（原站是 Bootstrap Carousel，行為相同） */
    prevPhoto() {
      const n = this.current.photos.length;
      this.photo = (this.photo - 1 + n) % n;
    },

    nextPhoto() {
      const n = this.current.photos.length;
      this.photo = (this.photo + 1) % n;
    },
  },
});
