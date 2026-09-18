/* ============================================================
   information_1.js — 登山路線介紹（Vue 3 global build）
   ------------------------------------------------------------
   規格來源：02_Spec/23_登山路線介紹.md
   資料真源：05_Prototype/components/RouteIntroData.js
   （由正式站 https://hike.taiwan.gov.tw/information_1.aspx 萃取）
   
   【踩坑防範紀錄】：
   1. 依踩坑總表第七類規定，嚴禁在模組層讀取 window.ROUTE_INTRO_DATA，
      一律在 data() 內取用，避免 body 底部腳本與 head 佇列之非同步時序問題。
   2. 大宗常數透過 Object.freeze() 包裹，避免 Vue 3 建立深層 reactive proxy。
   3. 支援 URL Query Params（park, route, id），支援外部連動自動切換。
   ============================================================ */

thPage({
  data() {
    var raw = window.ROUTE_INTRO_DATA || {};
    var urlParams = new URLSearchParams(window.location.search);
    var qPark = urlParams.get('park') || 'yushan';
    var qRoute = urlParams.get('route') || urlParams.get('id') || '';

    var validPark = raw[qPark] ? qPark : 'yushan';
    var parkObj = raw[validPark] || { routes: [] };
    var defaultRouteId = (parkObj.routes && parkObj.routes[0]) ? parkObj.routes[0].id : 'tab_b1';

    // 若有提供指定 route，尋找對應的 park
    if (qRoute) {
      for (var pk in raw) {
        if (raw[pk].routes && raw[pk].routes.some(function(r) { return r.id === qRoute; })) {
          validPark = pk;
          break;
        }
      }
    }

    return {
      parks: Object.freeze(raw),
      activeParkKey: validPark,
      activeRouteId: qRoute || defaultRouteId,
      searchKeyword: ''
    };
  },

  computed: {
    parkList() {
      var pObj = this.parks || {};
      return [pObj.yushan, pObj.taroko, pObj.sheipa].filter(Boolean);
    },
    currentPark() {
      var pObj = this.parks || {};
      return pObj[this.activeParkKey] || { name: '', routes: [] };
    },
    filteredRoutes() {
      var routes = (this.currentPark && this.currentPark.routes) || [];
      var kw = (this.searchKeyword || '').trim().toLowerCase();
      if (!kw) return routes;
      return routes.filter(function(r) {
        return (r.name && r.name.toLowerCase().includes(kw)) ||
               (r.headerTitle && r.headerTitle.toLowerCase().includes(kw)) ||
               (r.intros && r.intros.some(function(i) { return i.toLowerCase().includes(kw); }));
      });
    },
    currentRoute() {
      var routes = (this.currentPark && this.currentPark.routes) || [];
      var targetId = this.activeRouteId;
      var found = routes.find(function(r) { return r.id === targetId; });
      return found || routes[0] || null;
    }
  },

  methods: {
    selectPark(parkId) {
      this.activeParkKey = parkId;
      this.searchKeyword = '';
      var p = this.parks[parkId];
      if (p && p.routes && p.routes.length > 0) {
        this.activeRouteId = p.routes[0].id;
      }
      this.syncUrl();
    },
    selectRoute(routeId) {
      this.activeRouteId = routeId;
      this.syncUrl();
    },
    syncUrl() {
      if (!window.history || !window.history.replaceState) return;
      var url = new URL(window.location.href);
      url.searchParams.set('park', this.activeParkKey);
      url.searchParams.set('route', this.activeRouteId);
      window.history.replaceState({}, '', url.toString());
    },
    formatRouteNodes(routeString) {
      if (!routeString) return [];
      return routeString.split('→').map(function(s) {
        return s.trim();
      }).filter(Boolean);
    },
    getAttachmentLinks(attachments) {
      if (!attachments) return [];
      return attachments.map(function(a) {
        return {
          label: a.title,
          href: a.url,
          kind: a.type === 'link' ? 'external' : 'file'
        };
      });
    },
    formatTrafficTitle(title) {
      if (!title) return '';
      return title.replace(/^對外交通[\-－:：\s]*/, '').trim();
    },
    formatItineraryTitle(title) {
      if (!title) return '';
      var clean = title.replace(/^建議行程\d*[\-－:：\s]*/, '').trim();
      clean = clean.replace(/^【(.*)】$/, '$1').trim();
      return clean;
    }
  },

  mounted() {
    // 確保載入時如果 activeRouteId 不在 filteredRoutes，校正到第一條
    if (this.currentPark && this.currentPark.routes && this.currentPark.routes.length > 0) {
      var targetId = this.activeRouteId;
      var exists = this.currentPark.routes.some(function(r) { return r.id === targetId; });
      if (!exists) {
        this.activeRouteId = this.currentPark.routes[0].id;
      }
    }
  }
});
