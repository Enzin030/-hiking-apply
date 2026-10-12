/* th-plan-nodes — 逐日行程的節點標籤鏈（唯讀）（2026-10-12）
   ------------------------------------------------------------
   原本只在國家公園行程規劃頁 apply-3（可點選、可刪除）與確認頁 apply-5（唯讀）以 .p-apply3-node-badge 呈現；
   申請進度查詢頁 apply_3 也要用（使用者 2026-10-12：行程用申請那種宿營地 badge），依「二次即提升」：
   樣式改名 .th-plan-nodes／.th-node-badge（.is-green／.is-red／.is-blue）／.th-node-arrow 搬到 components.css（宣告不變），
   唯讀的標籤鏈收成本元件，apply-5 與 apply_3 共用；apply-3 的規劃器有點選、刪除互動，只換 class 名稱。

   顏色判定（同原 apply-5 getNodeType／getNodeIcon，以名稱判斷）：
     綠：名稱含「服務中心」（起終點）               fa-person-walking
     藍：名稱含「山莊／山屋／營地」（宿營地）       fa-bed
     紅：其餘（登山口、山峰、一般節點）             fa-location-dot
   （apply-3 規劃器另依路線節點圖判斷，見 components/apply-3.js nodeBadgeType，不在此）

   用法：<th-plan-nodes :nodes="['排雲登山服務中心', '塔塔加登山口', '排雲山莊']"></th-plan-nodes>
   ------------------------------------------------------------ */
(function () {
  "use strict";
  window.thNodeBadgeType = function (node) {
    if (!node) return "red";
    if (node.includes("服務中心")) return "green";
    if (node.includes("山莊") || node.includes("山屋") || node.includes("營地")) return "blue";
    return "red";
  };
  window.thNodeBadgeIcon = function (node) {
    var t = window.thNodeBadgeType(node);
    if (t === "green") return "fa-solid fa-person-walking";
    if (t === "blue") return "fa-solid fa-bed";
    return "fa-solid fa-location-dot";
  };

  window.thComponents = window.thComponents || {};
  window.thComponents["th-plan-nodes"] = {
    props: { nodes: { type: Array, required: true } },
    methods: {
      type: function (n) { return window.thNodeBadgeType(n); },
      icon: function (n) { return window.thNodeBadgeIcon(n); },
    },
    template: `
      <div class="th-plan-nodes">
        <template v-for="(node, nIdx) in nodes" :key="nIdx">
          <span :class="['th-node-badge', 'is-' + type(node)]">
            <i :class="icon(node)" aria-hidden="true"></i>
            <span>{{ node }}</span>
          </span>
          <span v-if="nIdx < nodes.length - 1" class="th-node-arrow" aria-hidden="true">→</span>
        </template>
      </div>
    `,
  };
})();
