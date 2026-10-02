/* ============================================================
   th-swal — 警告／確認對話框（SweetAlert2 的薄包裝）
   ------------------------------------------------------------
   2026-10-02 新增。使用者要求警告類訊息改用 SweetAlert（正式站各申請頁也用 sweet-alert），
   取代各頁的原生 alert()／confirm() 與「請確認以下欄位」錯誤清單 modal。
   SweetAlert2 由 assets/includes/head.html 以 CDN＋integrity 載入（與 Vue、flatpickr 同一套做法）。

   按鈕套用既有 .th-btn（buttonsStyling: false），不另做按鈕樣式；
   彈窗本身的微調在 components.css「th-swal」一節。

   用法：
     window.thAlert("請輸入送件驗證碼");                       // 警告（驚嘆號圖示）
     window.thAlert("草稿已儲存", "success");                  // 成功
     window.thAlertList(["申請目的或項目未選擇", "安全聲明未選擇"]); // 多項錯誤，條列
     window.thConfirm("確定要刪除此筆草稿紀錄嗎？").then(ok => { if (ok) ... });
     window.thSwal({ title, html, showCancelButton: true, ... });  // 自訂內容（2026-10-02 複合申請詢問框）
   SweetAlert2 沒載到時（離線）退回原生 alert／confirm，流程不中斷。
   ============================================================ */
(function () {
  "use strict";

  var BASE = {
    buttonsStyling: false,
    confirmButtonText: "確定",
    cancelButtonText: "取消",
    customClass: {
      popup: "th-swal",
      confirmButton: "th-btn th-btn-primary",
      cancelButton: "th-btn th-btn-ghost",
      actions: "th-swal-actions",
    },
  };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  window.thAlert = function (text, icon) {
    if (!window.Swal) { window.alert(text); return Promise.resolve(); }
    return window.Swal.fire(Object.assign({}, BASE, { icon: icon || "warning", text: String(text) }));
  };

  window.thAlertList = function (items, title) {
    var list = (items || []).filter(Boolean);
    if (!list.length) return Promise.resolve();
    if (!window.Swal) { window.alert(list.join("\n")); return Promise.resolve(); }
    if (list.length === 1) return window.thAlert(list[0]);
    return window.Swal.fire(Object.assign({}, BASE, {
      icon: "warning",
      title: title || "請確認以下欄位",
      html: '<ul class="th-swal-list">' + list.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>",
    }));
  };

  /* 自訂內容的對話框：傳入 SweetAlert2 選項，按鈕與彈窗樣式沿用 BASE。
     回傳 SweetAlert2 的結果物件（isConfirmed／dismiss）；沒載到時回傳 null。 */
  window.thSwal = function (opts) {
    if (!window.Swal) return Promise.resolve(null);
    var o = Object.assign({}, BASE, opts);
    o.customClass = Object.assign({}, BASE.customClass, opts && opts.customClass);
    return window.Swal.fire(o);
  };

  window.thConfirm = function (text) {
    if (!window.Swal) return Promise.resolve(window.confirm(text));
    return window.Swal.fire(Object.assign({}, BASE, {
      icon: "warning", text: String(text), showCancelButton: true, reverseButtons: true,
    })).then(function (r) { return !!r.isConfirmed; });
  };
})();
