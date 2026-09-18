/* ============================================================
   news_6.js — 檔案下載邏輯（對應正式站 news_6.aspx）
   ============================================================ */

const PAGE_SIZE = 10;
const EMPTY_FILTER = { agency: "all", q: "" };

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
      page: 1,
    };
  },

  mounted() {
    var self = this;
    this._onDocClick = function (e) {
      if (self.agencyOpen && self.$refs.agencyCombo && !self.$refs.agencyCombo.contains(e.target)) {
        self.agencyOpen = false;
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
    fileIcons() { return window.FILE_ICONS || {}; },

    currentAgencyLabel() {
      var key = this.draft.agency;
      var found = this.allAgencies.find(function (a) { return a.id === key; });
      return found ? found.label : "全部單位";
    },

    filtered() {
      var applied = this.applied;
      var matchAgency = function (item) {
        return applied.agency === "all" || item.agencyId === applied.agency;
      };

      var matchKw = function (item) {
        var kw = applied.q.trim().toLowerCase();
        if (!kw) return true;
        var t = (item.title || "").toLowerCase();
        return t.indexOf(kw) >= 0;
      };

      return (window.MOCK_DOWNLOADS || []).filter(function (x) {
        return matchAgency(x) && matchKw(x);
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
