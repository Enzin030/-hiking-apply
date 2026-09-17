/* ============================================================
   tabs.js — 頁籤共用程式（WAI-ARIA Tabs Pattern）
   ------------------------------------------------------------
   HTML 結構：
     <div class="th-tabs" role="tablist" data-tabs>
       <button class="th-tab" role="tab" aria-selected="true"
               aria-controls="panel-a" id="tab-a">標籤A</button>
       ...
     </div>
     <div class="th-tabpanel" role="tabpanel" id="panel-a" aria-labelledby="tab-a">…</div>

   次頁籤（.th-subtabs / .th-subtab）用法完全相同，一樣加 data-tabs。
   支援鍵盤操作：← → Home End（政府網站無障礙 AA 要求）
   ※ 純原生 JS，不依賴 jQuery。
   ============================================================ */

(function () {
  "use strict";

  function selectTab(tablist, tab) {
    var tabs = tablist.querySelectorAll('[role="tab"]');

    Array.prototype.forEach.call(tabs, function (t) {
      var selected = t === tab;
      t.setAttribute("aria-selected", selected ? "true" : "false");
      t.setAttribute("tabindex", selected ? "0" : "-1");

      var panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.hidden = !selected;
    });
  }

  function initTablist(tablist) {
    var tabs = tablist.querySelectorAll('[role="tab"]');
    if (!tabs.length) return;

    // 初始狀態：以 aria-selected="true" 為準，沒有的話取第一個
    var current = tablist.querySelector('[role="tab"][aria-selected="true"]') || tabs[0];
    selectTab(tablist, current);

    tablist.addEventListener("click", function (e) {
      var tab = e.target.closest('[role="tab"]');
      if (!tab || !tablist.contains(tab)) return;
      e.preventDefault();
      selectTab(tablist, tab);
    });

    tablist.addEventListener("keydown", function (e) {
      var list = Array.prototype.slice.call(tabs);
      var idx = list.indexOf(document.activeElement);
      if (idx === -1) return;

      var next = null;
      if (e.key === "ArrowRight") next = list[(idx + 1) % list.length];
      else if (e.key === "ArrowLeft") next = list[(idx - 1 + list.length) % list.length];
      else if (e.key === "Home") next = list[0];
      else if (e.key === "End") next = list[list.length - 1];

      if (next) {
        e.preventDefault();
        next.focus();
        selectTab(tablist, next);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var lists = document.querySelectorAll("[data-tabs]");
    Array.prototype.forEach.call(lists, initTablist);
  });
})();
