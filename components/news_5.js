/* ============================================================
   news_5.js — 違規名單邏輯（對應正式站 news_5.aspx）
   ============================================================ */

const PAGE_SIZE = 10;
const EMPTY_FILTER = { agency: "all", sort: "date_desc", q: "" };

var pNewsAgencyBadge = {
  props: { agencyId: { type: String, required: true }, org: { type: String, required: true } },
  template: `<span>{{ org }}</span>`,
};

thPage({
  components: {
    "p-news-agency-badge": pNewsAgencyBadge,
  },

  data() {
    return {
      draft: Object.assign({}, EMPTY_FILTER),
      applied: Object.assign({}, EMPTY_FILTER),
      agencyOpen: false,
      sortOpen: false,
      page: 1,
      sortOptions: [
        { key: "date_desc", label: "違規或核定日期 新→舊" },
        { key: "date_asc",  label: "違規或核定日期 舊→新" },
      ]
    };
  },

  mounted() {
    var self = this;
    this._onDocClick = function (e) {
      if (self.agencyOpen && self.$refs.agencyCombo && !self.$refs.agencyCombo.contains(e.target)) {
        self.agencyOpen = false;
      }
      if (self.sortOpen && self.$refs.sortCombo && !self.$refs.sortCombo.contains(e.target)) {
        self.sortOpen = false;
      }
    };
    document.addEventListener("click", this._onDocClick);
  },

  unmounted() {
    if (this._onDocClick) {
      document.removeEventListener("click", this._onDocClick);
    }
  },

  computed: {
    allAgencies() { return window.ALL_AGENCIES || []; },

    currentAgencyLabel() {
      var key = this.draft.agency;
      var found = this.allAgencies.find(function (a) { return a.id === key; });
      return found ? found.label : "全部單位";
    },

    currentSortLabel() {
      var key = this.draft.sort;
      var found = this.sortOptions.find(function (s) { return s.key === key; });
      return found ? found.label : "違規或核定日期 新→舊";
    },

    filtered() {
      var applied = this.applied;
      var matchAgency = function (item) {
        return applied.agency === "all" || item.agencyId === applied.agency;
      };

      var matchKw = function (item) {
        var kw = applied.q.trim().toLowerCase();
        if (!kw) return true;
        var n = (item.name || "").toLowerCase();
        var r = (item.reason || "").toLowerCase();
        var c = (item.category || "").toLowerCase();
        return n.indexOf(kw) >= 0 || r.indexOf(kw) >= 0 || c.indexOf(kw) >= 0;
      };

      var list = (window.MOCK_VIOLATIONS || []).filter(function (x) {
        return matchAgency(x) && matchKw(x);
      });

      return list.slice().sort(function (a, b) {
        return applied.sort === "date_asc" ? (a.date > b.date ? 1 : -1) : (a.date < b.date ? 1 : -1);
      });
    },

    totalPages() { return Math.max(1, Math.ceil(this.filtered.length / PAGE_SIZE)); },
    safePage() { return Math.min(this.page, this.totalPages); },
    pageRows() {
      return this.filtered.slice((this.safePage - 1) * PAGE_SIZE, this.safePage * PAGE_SIZE);
    },
  },

  methods: {
    selectAgency(id) {
      this.draft.agency = id;
      this.agencyOpen = false;
    },

    selectSort(key) {
      this.draft.sort = key;
      this.sortOpen = false;
    },

    submitFilter() {
      this.applied = Object.assign({}, this.draft);
      this.page = 1;
    },

    resetFilter() {
      this.draft = Object.assign({}, EMPTY_FILTER);
      this.applied = Object.assign({}, EMPTY_FILTER);
      this.page = 1;
    },
  }
});
