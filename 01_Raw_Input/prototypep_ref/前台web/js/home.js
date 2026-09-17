/* ============================================================
   home.js — 首頁（index.html）專用程式
   ------------------------------------------------------------
   1. 跑馬燈無縫循環：自動複製一份內容（後端只需輸出一份）
   2. 尊重「減少動態效果」系統設定（prefers-reduced-motion）
   ※ 純原生 JS，不依賴 jQuery。
   ============================================================ */

(function () {
  "use strict";

  /* ── 跑馬燈：複製內容以達成無縫循環 ─────────────────────────
     CSS 的 @keyframes th-marquee-scroll 位移 -50%，
     因此軌道內必須有「兩份完全相同」的內容。
     為避免後端重複輸出，這裡於前端自動複製，
     並將複製件設為 aria-hidden 以免螢幕報讀器唸兩次。
     ------------------------------------------------------------ */
  function initMarquee() {
    var tracks = document.querySelectorAll("[data-marquee-track]");

    Array.prototype.forEach.call(tracks, function (track) {
      if (track.dataset.marqueeReady === "1") return;

      // 內容不足時不啟動動畫（例如只有一則公告）
      var items = track.querySelectorAll("a");
      if (!items.length) return;

      var clone = document.createDocumentFragment();
      Array.prototype.forEach.call(track.children, function (node) {
        var copy = node.cloneNode(true);
        copy.setAttribute("aria-hidden", "true");
        if (copy.tagName === "A") copy.setAttribute("tabindex", "-1");
        clone.appendChild(copy);
      });
      track.appendChild(clone);
      track.dataset.marqueeReady = "1";
    });
  }

  /* ── 減少動態效果：停用跑馬燈捲動 ───────────────────────────
     CSS 已有 @media (prefers-reduced-motion: reduce) 的保護，
     此處再確保 JS 不重複產生多餘節點。
     ------------------------------------------------------------ */
  function prefersReducedMotion() {
    return window.matchMedia &&
           window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ── 暫停／播放按鈕（WCAG 2.2.2 暫停、停止、隱藏）──────────
     自動捲動且持續超過 5 秒的內容，必須提供使用者可操作的暫停機制。
     僅靠滑鼠 hover 暫停不符規範（鍵盤與觸控使用者無法操作），
     因此提供實體按鈕，並以 aria-pressed 回報目前狀態。
     ------------------------------------------------------------ */
  function initMarqueePause() {
    var btns = document.querySelectorAll("[data-marquee-pause]");

    Array.prototype.forEach.call(btns, function (btn) {
      var marquee = btn.closest(".th-marquee");
      if (!marquee) return;

      btn.addEventListener("click", function () {
        var paused = marquee.classList.toggle("is-paused");
        btn.setAttribute("aria-pressed", paused ? "true" : "false");
        btn.setAttribute("aria-label", paused ? "播放跑馬燈" : "暫停跑馬燈");
        var icon = btn.querySelector("i");
        if (icon) icon.className = paused ? "fas fa-play" : "fas fa-pause";
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (prefersReducedMotion()) {
      // 系統已設定減少動態效果：不啟動捲動，並將按鈕顯示為「已暫停」
      Array.prototype.forEach.call(
        document.querySelectorAll("[data-marquee-pause]"),
        function (btn) {
          var m = btn.closest(".th-marquee");
          if (m) m.classList.add("is-paused");
          btn.setAttribute("aria-pressed", "true");
          btn.setAttribute("aria-label", "播放跑馬燈");
          var icon = btn.querySelector("i");
          if (icon) icon.className = "fas fa-play";
        }
      );
    } else {
      initMarquee();
    }
    initMarqueePause();
  });
})();
