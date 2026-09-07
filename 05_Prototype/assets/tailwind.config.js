/* ============================================================
   tailwind.config.js — Tailwind CDN 的設定（原本逐頁寫死在 <head>）
   ------------------------------------------------------------
   內容與改版前各頁 <head> 的 inline 設定完全相同，只是抽成一支共用檔。

   **必須以一般 <script> 靜態寫在頁面 <head>，緊接在 cdn.tailwindcss.com 之後**，
   不可交給 head-loader 動態載入。原因見 assets/includes/head.html 的
   「Tailwind 為何留在頁面」註解——動態插入會讓 Tailwind 的 class 掃描
   與頁面 DOM 產生競態，實測會漏掉部分 utility。
   ============================================================ */

tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans TC", "sans-serif"],
        serif: ["Noto Serif TC", "serif"],
      },
    },
  },
};
