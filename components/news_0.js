/* ============================================================
   news_0.js — 最新消息邏輯（對應正式站 news_0.aspx）
   ============================================================ */

const PAGE_SIZE = 10;
const EMPTY_FILTER = { agency: "all", dateRange: "", q: "" };

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

    // 初始化 Flatpickr 日期區間選擇器
    var dateInput = document.getElementById("f-date");
    if (dateInput && typeof flatpickr !== "undefined") {
      var zhFallback = {
        weekdays: {
          shorthand: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"],
          longhand: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
        },
        months: {
          shorthand: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
          longhand: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
        },
        rangeSeparator: " 至 ",
        weekAbbreviation: "週",
        scrollTitle: "滾動切換",
        toggleTitle: "點擊切換 12/24 小時時制"
      };
      var zhLocale = (window.flatpickr && flatpickr.l10ns && (flatpickr.l10ns.zh_tw || flatpickr.l10ns["zh-tw"])) || zhFallback;
      this.fp = flatpickr(dateInput, {
        mode: "range",
        dateFormat: "Y-m-d",
        allowInput: true,
        disableMobile: true,
        locale: Object.assign({}, zhFallback, zhLocale, { rangeSeparator: " 至 " }),
        onChange: function (selectedDates, dateStr) {
          self.draft.dateRange = dateStr;
        }
      });
    }
  },

  unmounted() {
    if (this._onDocClick) {
      document.removeEventListener("click", this._onDocClick);
    }
    if (this.fp) {
      this.fp.destroy();
      this.fp = null;
    }
  },

  computed: {
    allAgencies() { return window.ALL_AGENCIES || []; },

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

      var matchDate = function (item) {
        if (!applied.dateRange) return true;
        var parts = applied.dateRange.split(" 至 ");
        var start = parts[0] ? parts[0].trim() : "";
        var end = parts[1] ? parts[1].trim() : start;
        if (start && item.date < start) return false;
        if (end && item.date > end) return false;
        return true;
      };

      var matchKw = function (item) {
        var kw = applied.q.trim().toLowerCase();
        if (!kw) return true;
        var t = (item.title || "").toLowerCase();
        var c = (item.content || "").toLowerCase();
        return t.indexOf(kw) >= 0 || c.indexOf(kw) >= 0;
      };

      var list = (window.MOCK_ANNOUNCEMENTS || []).filter(function (x) {
        return matchAgency(x) && matchDate(x) && matchKw(x);
      });

      return list.slice().sort(function (a, b) {
        return (b.pinned - a.pinned) || (a.date < b.date ? 1 : -1);
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
      if (this.fp) this.fp.clear();
    },

    dateSlash(d) {
      return d ? d.replace(/-/g, "/") : "";
    },

    openDatePicker() {
      if (this.fp) this.fp.open();
    }
  }
});
