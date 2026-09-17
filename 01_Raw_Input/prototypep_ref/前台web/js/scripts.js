/* ============================================================
   scripts.js — 前台全站共用程式
   ------------------------------------------------------------
   相依：jquery.min.js、flatpickr.js、zh-tw.js、bootstrap.bundle.min.js
   ※ 僅放「每一頁都會用到」的共用行為；
     單一頁面專屬邏輯請另開 js/<page>.js。
   ============================================================ */

/* ── 日期選擇器 flatpickr ───────────────────────────────────────
   用法：在 input 上加下列 class 即自動套用
     .js-date     → 日期        2026-03-23
     .js-datetime → 日期＋時間  2026-03-23 14:30
     .js-range    → 日期區間    2026-03-23 至 2026-03-25
     .js-time     → 僅時間      14:30
     .js-ym       → 年月        2026年03月（需另載 monthSelect plugin）
   動態插入的欄位請再呼叫一次 initFlatpickr(容器)
   ------------------------------------------------------------ */
function initFlatpickr(context) {
    const $context = context ? $(context) : $(document);

    const base = {
        locale: "zh_tw",
        allowInput: true,
        disableMobile: true
    };

    $context.find(".js-date").each(function () {
        if (this._flatpickr) return;

        flatpickr(this, {
            ...base,
            dateFormat: "Y-m-d"
        });
    });

    $context.find(".js-datetime").each(function () {
        if (this._flatpickr) return;

        flatpickr(this, {
            ...base,
            enableTime: true,
            time_24hr: true,
            dateFormat: "Y-m-d H:i"
        });
    });

    $context.find(".js-range").each(function () {
        if (this._flatpickr) return;

        flatpickr(this, {
            ...base,
            mode: "range",
            dateFormat: "Y-m-d",
            locale: {
                ...flatpickr.l10ns.zh_tw,
                rangeSeparator: " 至 "
            }
        });
    });

    $context.find(".js-time").each(function () {
        if (this._flatpickr) return;

        flatpickr(this, {
            ...base,
            enableTime: true,
            noCalendar: true,
            time_24hr: true,
            dateFormat: "H:i"
        });
    });

    $context.find(".js-ym").each(function () {
        if (this._flatpickr) return;

        flatpickr(this, {
            ...base,
            altInput: true,
            plugins: [
                new monthSelectPlugin({
                    shorthand: false,
                    dateFormat: "Y-m",
                    altFormat: "Y年m月"
                })
            ]
        });
    });
}

/* ── 手機版主選單開合 ───────────────────────────────────────────
   HTML：<button class="th-nav-toggle" data-nav-toggle> 搭配 .th-header
   ------------------------------------------------------------ */
function initNavToggle() {
    var btn = document.querySelector("[data-nav-toggle]");
    var header = document.querySelector(".th-header");
    if (!btn || !header) return;

    btn.addEventListener("click", function () {
        var opened = header.classList.toggle("is-nav-open");
        btn.setAttribute("aria-expanded", opened ? "true" : "false");
    });
}

/* ── 語言選單（Disclosure Pattern）────────────────────────────
   HTML：
     <div class="th-lang" data-lang-menu>
       <button aria-expanded="false" aria-controls="lang-list">語言</button>
       <ul class="th-lang-menu" id="lang-list" hidden>…</ul>
     </div>
   無障礙行為：
     Enter/Space 或點擊 → 開合，同步更新 aria-expanded
     ↓ ↑            → 在語系項目間移動（於按鈕上按 ↓ 直接開啟並聚焦第一項）
     Esc            → 關閉並把焦點還給按鈕
     Tab 移出／點擊外部 → 自動關閉
   ------------------------------------------------------------ */
function initLangMenu() {
    var wraps = document.querySelectorAll("[data-lang-menu]");

    Array.prototype.forEach.call(wraps, function (wrap) {
        var btn = wrap.querySelector("button");
        var menu = wrap.querySelector(".th-lang-menu");
        if (!btn || !menu) return;

        var items = menu.querySelectorAll("a");

        function open(focusFirst) {
            menu.hidden = false;
            btn.setAttribute("aria-expanded", "true");
            if (focusFirst && items.length) items[0].focus();
        }
        function close(focusBtn) {
            menu.hidden = true;
            btn.setAttribute("aria-expanded", "false");
            if (focusBtn) btn.focus();
        }
        function isOpen() { return !menu.hidden; }

        btn.addEventListener("click", function (e) {
            e.preventDefault();
            isOpen() ? close(false) : open(false);
        });

        btn.addEventListener("keydown", function (e) {
            if (e.key === "ArrowDown") { e.preventDefault(); open(true); }
            else if (e.key === "Escape" && isOpen()) { e.preventDefault(); close(true); }
        });

        menu.addEventListener("keydown", function (e) {
            var list = Array.prototype.slice.call(items);
            var idx = list.indexOf(document.activeElement);

            if (e.key === "Escape") { e.preventDefault(); close(true); }
            else if (e.key === "ArrowDown") { e.preventDefault(); list[(idx + 1) % list.length].focus(); }
            else if (e.key === "ArrowUp") { e.preventDefault(); list[(idx - 1 + list.length) % list.length].focus(); }
            else if (e.key === "Home") { e.preventDefault(); list[0].focus(); }
            else if (e.key === "End") { e.preventDefault(); list[list.length - 1].focus(); }
        });

        // 焦點移出整個元件即關閉（Tab 走出去時）
        wrap.addEventListener("focusout", function (e) {
            if (!wrap.contains(e.relatedTarget)) close(false);
        });

        // 點擊元件外部即關閉
        document.addEventListener("click", function (e) {
            if (isOpen() && !wrap.contains(e.target)) close(false);
        });
    });
}

/* ── 主選單下拉（Disclosure Pattern）──────────────────────────
   HTML：
     <div class="th-navitem" data-nav-menu>
       <button class="th-navbtn" aria-expanded="false" aria-controls="…">公布欄</button>
       <ul class="th-navmenu" id="…" hidden>…</ul>
     </div>
   無障礙行為：
     點擊／Enter／Space → 開合，同步更新 aria-expanded
     ↓                  → 開啟並聚焦第一項；選單內 ↑↓ 循環、Home/End 跳首尾
     Esc                → 關閉並把焦點還給按鈕
     Tab 移出／點擊外部  → 自動關閉；同時只會有一個選單展開
     桌機滑鼠移入即展開，移出後延遲收合（游標可移入選單 → 符合 WCAG 1.4.13）
   ------------------------------------------------------------ */
function initNavMenus() {
    var items = document.querySelectorAll("[data-nav-menu]");
    if (!items.length) return;

    var HOVER_WIDTH = 901;           // 與 CSS 的窄版斷點一致
    var all = [];

    Array.prototype.forEach.call(items, function (wrap) {
        var btn = wrap.querySelector(".th-navbtn");
        var menu = wrap.querySelector(".th-navmenu");
        if (!btn || !menu) return;

        var links = menu.querySelectorAll("a");
        var timer = null;
        var api = { wrap: wrap, close: close };
        all.push(api);

        function canHover() {
            return window.matchMedia("(min-width: " + HOVER_WIDTH + "px)").matches &&
                   window.matchMedia("(hover: hover)").matches;
        }

        function open(focusFirst) {
            all.forEach(function (o) { if (o !== api) o.close(false); });
            menu.hidden = false;
            btn.setAttribute("aria-expanded", "true");
            // 超出視窗右緣時改為右對齊
            menu.classList.remove("is-right");
            if (menu.getBoundingClientRect().right > window.innerWidth - 8) {
                menu.classList.add("is-right");
            }
            if (focusFirst && links.length) links[0].focus();
        }
        function close(focusBtn) {
            menu.hidden = true;
            btn.setAttribute("aria-expanded", "false");
            if (focusBtn) btn.focus();
        }
        function isOpen() { return !menu.hidden; }

        btn.addEventListener("click", function (e) {
            e.preventDefault();
            // 桌機滑鼠已因 hover 展開時，點標題不應把它關掉（常見的誤操作）
            // e.detail === 0 代表是鍵盤 Enter/Space 觸發的 click，仍照常切換
            var byMouse = e.detail > 0;
            if (byMouse && canHover() && wrap.matches(":hover")) { open(false); return; }
            isOpen() ? close(false) : open(false);
        });

        btn.addEventListener("keydown", function (e) {
            if (e.key === "ArrowDown") { e.preventDefault(); open(true); }
            else if (e.key === "Escape" && isOpen()) { e.preventDefault(); close(true); }
        });

        menu.addEventListener("keydown", function (e) {
            var list = Array.prototype.slice.call(links);
            var idx = list.indexOf(document.activeElement);
            if (e.key === "Escape") { e.preventDefault(); close(true); }
            else if (e.key === "ArrowDown") { e.preventDefault(); list[(idx + 1) % list.length].focus(); }
            else if (e.key === "ArrowUp") { e.preventDefault(); list[(idx - 1 + list.length) % list.length].focus(); }
            else if (e.key === "Home") { e.preventDefault(); list[0].focus(); }
            else if (e.key === "End") { e.preventDefault(); list[list.length - 1].focus(); }
        });

        // 焦點移出整個項目即關閉
        wrap.addEventListener("focusout", function (e) {
            if (!wrap.contains(e.relatedTarget)) close(false);
        });

        // 桌機 hover：移入開啟、移出延遲關閉（游標可移進選單）
        wrap.addEventListener("mouseenter", function () {
            if (!canHover()) return;
            clearTimeout(timer);
            open(false);
        });
        wrap.addEventListener("mouseleave", function () {
            if (!canHover()) return;
            clearTimeout(timer);
            timer = setTimeout(function () { close(false); }, 220);
        });
    });

    // 點擊選單外部關閉全部
    document.addEventListener("click", function (e) {
        all.forEach(function (o) {
            if (!o.wrap.contains(e.target)) o.close(false);
        });
    });
    // Esc 關閉全部（焦點不在選單內時）
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") all.forEach(function (o) { o.close(false); });
    });
}

/* ── 檔案選擇提示 ──────────────────────────────────────────────
   HTML：<label><input type="file" onchange="updateFileName(this)"></label>
         <span class="file-hint">未選擇任何檔案</span>
   ------------------------------------------------------------ */
function updateFileName(input) {
    var hint = input.closest("label").nextElementSibling;
    if (!hint) return;
    hint.textContent = input.files.length ? input.files[0].name : "未選擇任何檔案";
}

/* ── 確認對話框（Bootstrap Modal）────────────────────────────────
   HTML：頁面需存在 id="confirmModal" 的 modal
   ------------------------------------------------------------ */
function openConfirm(modalId) {
    var el = document.getElementById(modalId || "confirmModal");
    if (!el) return;
    new bootstrap.Modal(el).show();
}

/* ── 回到頁首 ────────────────────────────────────────────────── */
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ── 初始化 ──────────────────────────────────────────────────── */
$(function () {
    initFlatpickr();
    initNavToggle();
    initLangMenu();
    initNavMenus();
});
