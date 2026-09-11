/* ============================================================
   th-step-list — 編號步驟（原 Shared.jsx 的 StepList）
   ------------------------------------------------------------
   step：{ title, body, subs, pics, shot }
     body — 段落文字；subs — 子項目陣列（ol.th-substeps）
     pics — [{ src, alt }]，出 figure ＋ figcaption，圖片 loading="lazy"
     shot — 截圖佔位說明（還沒有圖時用）

   序號由陣列順序推導（i + 1），不由資料提供——照原樣保留。

   外觀沿用 components.css 的 .th-steplist／.th-steprow／.th-steprow-num／
   .th-steprow-body／.th-steprow-title／.th-substeps／.th-shot-list／.th-shot／
   .th-shot-placeholder，本元件不新增 CSS。

   注意：原 React 版的 body 可以是 JSX；目前四頁零互動頁傳進來的都是字串。
   若日後需要在 body 放連結，用 body slot，不要把 HTML 字串塞進資料
   （會需要 v-html，等於把 XSS 面積打開）。
   ============================================================ */
window.thComponents = window.thComponents || {};
window.thComponents["th-step-list"] = {
  props: { steps: { type: Array, required: true } },
  template: `
    <ol class="th-steplist">
      <li class="th-steprow" v-for="(s, i) in steps" :key="s.title">
        <span class="th-steprow-num">{{ i + 1 }}</span>
        <div class="th-steprow-body">
          <h3 class="th-steprow-title">{{ s.title }}</h3>
          <p v-if="s.body">{{ s.body }}</p>
          <ol v-if="s.subs" class="th-substeps">
            <li v-for="(t, j) in s.subs" :key="j">{{ t }}</li>
          </ol>
          <div v-if="s.pics" class="th-shot-list">
            <figure class="th-shot" v-for="pic in s.pics" :key="pic.src">
              <img :src="pic.src" :alt="pic.alt" loading="lazy" />
              <figcaption>{{ pic.alt }}</figcaption>
            </figure>
          </div>
          <div v-if="s.shot" class="th-shot-placeholder">
            <i class="fa-regular fa-image"></i>{{ s.shot }}
          </div>
        </div>
      </li>
    </ol>
  `,
};
