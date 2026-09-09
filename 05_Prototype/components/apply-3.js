/* ============================================================
   apply-3.js — 行程登記及登山申請
   原 Apply3.jsx（401 行）。版面已搬回 apply-3.html。
   ============================================================

   ------------------------------------------------------------
   15 個 useState → data 的逐一對應（不批次轉）
   ------------------------------------------------------------
   | 原 React                                   | Vue              |
   |--------------------------------------------|------------------|
   | unit（預設 routeData?.agencyName）           | data.unit        |
   | route（預設 displayName ?? name）            | data.route       |
   | subroute                                    | data.subroute    |
   | startDate（寫死 2026-05-15）                 | data.startDate   |
   | days（預設 routeData?.days || 2）            | data.days        |
   | hasGps（"yes"／"no"）                        | data.hasGps      |
   | purpose／satPhone／radio／note／planText      | data 同名        |
   | keeperName／keeperPhone／keeperRel            | data 同名        |
   | members（陣列，預設兩列）                      | data.members     |
   共 15 個，其中 members 是唯一的陣列狀態。
   18 個 onChange 全部逐一改成 @input／@change，未批次替換。

   ------------------------------------------------------------
   falsy 判空逐條盤點（v4 通則 6）
   ------------------------------------------------------------
   本頁所有判空處與處置，逐條列出：

   1. `routeData?.diff || 3`（路線縮圖的難度徽章）
      **這是原碼既有的缺陷，照搬未改。** 難度分級有第 0 級（open.html 的
      彈窗已因此改用 `!== null`），diff 為 0 時這裡會顯示「第 3 級」。
      屬「改善不是遷移」，已列入待確認。

   2. `routeData?.days || 2`（預設天數、建議天數徽章）
      days 為 0 會落到預設 2。實務上 0 天的路線不存在，但判準本身仍是
      falsy 而非 `== null`。照搬未改，一併列入待確認。

   3. `Math.max(0, days - 1)`／`Math.max(0, (routeData?.days || 2) - 1)`
      夜數。用 Math.max 夾住下限，days 為 1 時得 0 夜，正確；
      **這裡沒有 falsy 問題**，因為算的是數值不是判空。

   4. `days` 本身：來源是 1–7 的下拉，`Number(e.target.value)`，不會是 0。
      即使是 0，第 3 點的 Math.max 也擋住負數。

   5. `members.length <= 1` / `>= 12`：長度不可能為 0（removeMember 有下限
      保護），用 `<=`／`>=` 比較而非真假值，安全。

   6. `i === 0`（第一列的「領隊」標記）：**用嚴格相等，不是 `!i`**。
      索引 0 是合法值，這裡原碼就寫對了，照搬。

   7. `m.name.trim()` 過濾已填隊員：空字串為 falsy 即「未填」，
      兩者同義，安全。

   8. `!!route`／`!!startDate`／`!!keeperName && !!keeperPhone`／`!!planText`：
      都是字串欄位，空字串即未填，語意一致，安全。

   9. `routeData?.agencyName || "…"`／`displayName || name || "…"`／
      `subroute || "…"`／`peak || "…"`／`image || "…"`：字串預設值，
      空字串會落到預設。與 React 相同。

   10. `isNaN(d)`（endDate 的日期檢查）：`d` 是 Date，isNaN 會先轉數值，
       Invalid Date 得 NaN。照搬。**不可改成 `!d`**——Date 物件永遠 truthy。

   11. `routeData?.status === "lottery"`：嚴格相等，安全。

   ------------------------------------------------------------
   members 的增刪與 :key
   ------------------------------------------------------------
   新增用 `Date.now()` 當 id（原碼如此）。同一毫秒內連按兩次會產生重複
   id，Vue 的 :key 會警告——但原 React 的 key 也一樣重複，行為相同，
   照搬未改，列入待確認。
   updateMember 照原碼用 map 造新陣列（不是就地改），這樣 :key 比對的
   物件識別與 React 一致。

   ------------------------------------------------------------
   送出鈕呼叫 alert()
   ------------------------------------------------------------
   原碼是 `onClick={() => alert("送出申請")}`，照搬。雛形沒有後端，
   這是刻意的佔位行為。
   ============================================================ */

function getParam(key) {
  return new URLSearchParams(window.location.search).get(key) || "";
}

function getRouteFromQuery() {
  const routeId = getParam("route");
  if (!routeId || typeof ROUTE_DATA === "undefined") return null;
  return ROUTE_DATA.find(r => r.id === routeId) || null;
}

function queryUrl(page) {
  const q = new URLSearchParams(window.location.search);
  return `${page}?${q.toString()}`;
}

/* 逐頁參數：載入後不變，放模組層級 */
const A3_ROUTE = getRouteFromQuery();

thPage({
  data() {
    return {
      unit: (A3_ROUTE && A3_ROUTE.agencyName) || "玉山國家公園管理處",
      route: (A3_ROUTE && (A3_ROUTE.displayName || A3_ROUTE.name)) || "玉山主峰線",
      subroute: (A3_ROUTE && A3_ROUTE.subroute) || "塔塔加→排雲山莊→玉山主峰",
      startDate: "2026-05-15",
      days: (A3_ROUTE && A3_ROUTE.days) || 2,
      hasGps: "yes",
      purpose: "",
      satPhone: "",
      radio: "",
      note: "",
      planText: "",
      keeperName: "",
      keeperPhone: "",
      keeperRel: "",
      members: [
        { id: 1, role: "leader", name: "", idType: "id", idNum: "", phone: "", emergency: "" },
        { id: 2, role: "member", name: "", idType: "id", idNum: "", phone: "", emergency: "" },
      ],
    };
  },

  computed: {
    routeData() { return A3_ROUTE; },
    applyCrumb() { return window.TH_APPLY_CRUMB; },

    endDate() {
      const d = new Date(this.startDate);
      // 不可改成 !d：Date 物件永遠 truthy，Invalid Date 要靠 isNaN 抓
      if (isNaN(d)) return "";
      d.setDate(d.getDate() + (this.days - 1));
      return d.toISOString().slice(0, 10);
    },

    filledMembers() { return this.members.filter(m => m.name.trim()).length; },

    checks() {
      return [
        { ok: !!this.route, label: "已選擇登山路線" },
        { ok: !!this.startDate, label: "已選擇入山日期" },
        { ok: this.filledMembers >= 1, label: `已填寫至少 1 位隊員（目前 ${this.filledMembers}）` },
        { ok: !!this.keeperName && !!this.keeperPhone, label: "已填寫留守人聯絡資料" },
        { ok: !!this.planText, label: "已填寫登山計畫書" },
      ];
    },
    allOk() { return this.checks.every(c => c.ok); },
    doneCount() { return this.checks.filter(c => c.ok).length; },
  },

  methods: {
    addMember() {
      if (this.members.length >= 12) return;
      this.members = this.members.concat({
        id: Date.now(), role: "member", name: "", idType: "id",
        idNum: "", phone: "", emergency: "",
      });
    },
    removeMember(id) {
      if (this.members.length <= 1) return;
      this.members = this.members.filter(m => m.id !== id);
    },
    /* 照原碼用 map 造新陣列（不就地改），:key 比對的物件識別與 React 一致 */
    updateMember(id, k, v) {
      this.members = this.members.map(m => m.id === id ? Object.assign({}, m, { [k]: v }) : m);
    },

    goPrev() { window.location.href = queryUrl("apply-2.html"); },
    submit() { alert("送出申請"); },
  },
});
