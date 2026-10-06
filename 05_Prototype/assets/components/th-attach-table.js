/* ============================================================
   th-attach-table — 附件上傳表（項次｜附件名稱｜上傳檔案｜檔案狀態）
   ------------------------------------------------------------
   2026-10-06 新增。使用者裁示三管處與自然保護區域的附件上傳統一：
   - 三管處隊伍資料頁 apply-4（太魯閣「路線行程規劃計劃書」，選填、正式站未寫格式限制）
   - 保護區第 2 步 apply_forest_area_2（依所選申請目的，必填；PDF／JPG／PNG、5MB）
   保護區原本把附件表夾在各個目的選項之間，改為目的清單下方一張表（目的與附件拆開）。

   檔案狀態：已選檔＝勾選圖示「已上傳」＋檔名（字級同格式說明 .th-field-hint）；
   未選檔＝驚嘆圖示「尚未上傳」，一律紅字（選填也是，使用者 2026-10-06 裁示顏色統一）。
   **雛形只記檔名，不讀取、不送出檔案內容。**

   props：
     items       [{ key, name, required, hint, link: { text, href } }]
                 hint＝附件名稱下方的格式說明；link＝名稱後的說明文件連結（另開新視窗）
     modelValue  { [key]: 檔名 }（v-model）
     idPrefix    file input 的 id 前綴（同頁多張表時區分）
     accept      允許的副檔名（逗號分隔，同 <input accept>）；空字串＝不限制、不檢查格式
     maxMb       單檔上限（MB）；0＝不檢查
   選檔時檢查格式與大小，訊息照正式站 js/HSTS/Swal.js（「檔案格式錯誤」「上傳檔案過大」），通過才記檔名。

   外觀沿用 .th-table-wrap／.th-table（同確認頁表格）、.th-btn、.th-field-hint，本元件不新增 CSS。
   ============================================================ */
window.thComponents = window.thComponents || {};
window.thComponents["th-attach-table"] = {
  props: {
    items: { type: Array, default: function () { return []; } },
    modelValue: { type: Object, default: function () { return {}; } },
    idPrefix: { type: String, default: "attach" },
    accept: { type: String, default: "" },
    maxMb: { type: Number, default: 0 },
  },
  emits: ["update:modelValue"],
  methods: {
    fid(i) { return this.idPrefix + "-file-" + (i + 1); },
    fileName(k) { return (this.modelValue || {})[k] || ""; },
    pick(item, ev) {
      var f = ev.target.files && ev.target.files[0];
      ev.target.value = "";
      if (!f) return;
      var exts = this.accept ? this.accept.split(",").map(function (s) { return s.trim().toLowerCase(); }) : [];
      var dot = f.name.lastIndexOf(".");
      var ext = dot >= 0 ? f.name.slice(dot).toLowerCase() : "";
      var msg = "";
      if (exts.length && exts.indexOf(ext) < 0) msg = "檔案格式錯誤";
      else if (this.maxMb && f.size > this.maxMb * 1024 * 1024) msg = "上傳檔案過大";
      if (msg) { window.thAlert(msg); return; }
      var next = Object.assign({}, this.modelValue);
      next[item.key] = f.name;
      this.$emit("update:modelValue", next);
    },
  },
  template: `
    <div class="th-table-wrap border border-slate-200 rounded-md">
      <table class="th-table w-full whitespace-nowrap">
        <thead>
          <tr>
            <th scope="col" class="is-center">項次</th>
            <th scope="col">附件名稱</th>
            <th scope="col" class="is-center">上傳檔案</th>
            <th scope="col">檔案狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(it, i) in items" :key="it.key">
            <td class="is-center">{{ i + 1 }}</td>
            <td>
              <div class="font-medium text-slate-800"><span v-if="it.required" class="req">*</span>{{ it.name }}<template v-if="it.link"> <a class="th-inline-link" :href="it.link.href" target="_blank" rel="noopener noreferrer" :title="it.link.text + '（另開新視窗）'">{{ it.link.text }}<i class="fa-solid fa-arrow-up-right-from-square th-ext-icon" aria-hidden="true"></i></a></template></div>
              <div v-if="it.hint" class="th-field-hint is-accent">{{ it.hint }}</div>
            </td>
            <td class="is-center">
              <input :id="fid(i)" type="file" class="hidden" :accept="accept || null" @change="pick(it, $event)" />
              <label :for="fid(i)" class="th-btn th-btn-secondary th-btn-sm cursor-pointer whitespace-nowrap"><i class="fa-solid fa-upload mr-1" aria-hidden="true"></i>選擇檔案</label>
            </td>
            <td>
              <template v-if="fileName(it.key)">
                <div class="text-emerald-700 font-medium text-sm inline-flex items-center gap-1.5"><i class="fa-solid fa-circle-check" aria-hidden="true"></i>已上傳</div>
                <div class="th-field-hint truncate max-w-[180px]" :title="fileName(it.key)">{{ fileName(it.key) }}</div>
              </template>
              <span v-else class="text-rose-600 font-medium text-sm inline-flex items-center gap-1.5"><i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>尚未上傳</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
};
