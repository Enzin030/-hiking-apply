/* ============================================================
   news_7.js — 常見問答邏輯（對應正式站 news_7.aspx）
   ============================================================ */

const PAGE_SIZE = 10;
const EMPTY_FILTER = { agency: "all", cat: "all", q: "" };

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
      catOpen: false,
      page: 1,
      modalItem: null,
    };
  },

  mounted() {
    var self = this;
    this._onDocClick = function (e) {
      if (self.agencyOpen && self.$refs.agencyCombo && !self.$refs.agencyCombo.contains(e.target)) {
        self.agencyOpen = false;
      }
      if (self.catOpen && self.$refs.catCombo && !self.$refs.catCombo.contains(e.target)) {
        self.catOpen = false;
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

    faqCategories() {
      var faqs = window.MOCK_FAQS || [];
      var cats = faqs.map(function (f) { return f.cat; })
                     .filter(function (c, i, arr) { return arr.indexOf(c) === i; })
                     .sort();
      return ["all"].concat(cats);
    },

    currentAgencyLabel() {
      var key = this.draft.agency;
      var found = this.allAgencies.find(function (a) { return a.id === key; });
      return found ? found.label : "全部單位";
    },

    currentCatLabel() {
      var key = this.draft.cat;
      return key === "all" ? "全部類別" : key;
    },

    filtered() {
      var applied = this.applied;
      var matchAgency = function (item) {
        return applied.agency === "all" || item.agencyId === applied.agency;
      };

      var matchCat = function (item) {
        return applied.cat === "all" || item.cat === applied.cat;
      };

      var matchKw = function (item) {
        var kw = applied.q.trim().toLowerCase();
        if (!kw) return true;
        var q = (item.q || "").toLowerCase();
        var a = (item.a || "").toLowerCase();
        return q.indexOf(kw) >= 0 || a.indexOf(kw) >= 0;
      };

      return (window.MOCK_FAQS || []).filter(function (x) {
        return matchAgency(x) && matchCat(x) && matchKw(x);
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

    selectCat(cat) {
      this.draft.cat = cat;
      this.catOpen = false;
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

    openModal(item) {
      this.modalItem = {
        title: item.q,
        org: item.org,
        agencyId: item.agencyId,
        date: item.date,
        cat: item.cat,
        body: item.a
      };
    }
  }
});
