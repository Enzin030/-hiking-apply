#!/usr/bin/env node
/**
 * 由 01_Raw_Input/現行tableSchema.csv 產生 03_Schema/（一表一份 md ＋ _fields/ 一欄位一筆記）。
 * 做法參照 115 嘉市災管 03_Schema，但**不做 PascalCase 轉換**——本專案的表名與欄位名
 * （AI_ID、CRTDATE、apply_log、___filesSizeCount）就是現行 DB 的真實識別字，
 * 轉過的名字在 DB 裡不存在，所以一律逐字保留，也不產 TableSnake／FieldSnake。
 *
 * 合併式產生（非重建）：
 *   - CSV 是「DB 事實」的真源：鍵值／資料型別／長度／預設值／允許空值／Seq 一律以 CSV 覆寫，
 *     與既有值不同時列進差異報告。
 *   - 人工欄位（中文名稱／備註／外鍵指向）既有值非空就保留，不被 CSV 洗掉。
 *   - 表文件的正文（用途說明、內部註記）只要檔案已存在就整段保留，只更新 frontmatter。
 *   - 絕不刪除既有檔案；CSV 已無對應的欄位筆記只列入報告，由人工判斷。
 *
 * 用法：
 *   node scripts/gen-schema-from-csv.js            產生／更新
 *   node scripts/gen-schema-from-csv.js --dry-run  只報告不寫檔
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CSV = path.join(ROOT, '01_Raw_Input', '現行tableSchema.csv');
// 表中文名的來源。欄位那份匯出檔沒有表層級的名稱，這份補上（142/272 有值，
// 其餘是 NULL 或整筆未收錄）。缺這個檔不算錯，只是表中文名全部留白。
const DESC_CSV = path.join(ROOT, '01_Raw_Input', '現行表描述.csv');
const SCHEMA_DIR = path.join(ROOT, '03_Schema');
const FIELD_DIR = path.join(SCHEMA_DIR, '_fields');
// 疑似備份的表另放一層，讓目錄視圖與檔案總管都清爽。欄位筆記仍然全部放在 _fields/
// 平鋪（Bases 靠屬性過濾，不靠資料夾），靠欄位筆記的「表狀態」把它們濾掉。
const BACKUP_DIR = path.join(SCHEMA_DIR, '_backup');
const BACKUP_STATUS = '疑似備份';
const TODAY = '2026-09-11';
const dryRun = process.argv.includes('--dry-run');

/* ---------- RFC4180 解析（欄位值內含逗號，split(',') 會切壞） ---------- */
function parseCSV(str) {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (q) {
      if (c === '"') { if (str[i + 1] === '"') { f += '"'; i++; } else q = false; }
      else f += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\r' || c === '\n') {
      if (c === '\r' && str[i + 1] === '\n') i++;
      row.push(f); f = ''; rows.push(row); row = [];
    } else f += c;
  }
  if (f !== '' || row.length) { row.push(f); rows.push(row); }
  return rows;
}

/* ---------- 表的狀態分類（純命名推測，非確認結果） ---------- */
const RULES = [
  [/^aspnet_|^vw_aspnet_|^sysdiagrams$/, '系統框架', 'ASP.NET／SQL Server 內建表'],
  // 三底線前綴是人手打的（通常為了排在清單最上面，或標記「這是臨時的」），
  // 不是任何框架的內建表——2026-09-11 原本誤併進「系統框架」那條規則。
  [/^___/, '疑似暫存', '名稱以三底線起首，屬人工命名的臨時／統計表慣例'],
  [/^vw_|_view$|_view_other$/, '檢視', '名稱為 vw_ 前綴或 _view 結尾'],
  [/_bak$|_bak_|\d{6,8}[A-Za-z]?(tmp)?$|_Y\d{9}$|_(19|20)\d{2}(_(19|20)\d{2})?$|_hislog$/,
    '疑似備份', '名稱含 _bak、日期數字或年份區間'],
  [/tmp|temp$/i, '疑似暫存', '名稱含 tmp／Temp'],
];
// 描述檔優先於命名推測。2026-09-11 教訓：`_bak` 字尾規則誤判了 6 張表，其中 4 張是機關
// 自己標明的**草稿表**（applylist_bak「入園申請資料表草稿」等），是現役功能在用的，
// 不是備份。機關寫過正式業務描述的表，命名長什麼樣都不該被推測規則判死。
function classify(t, desc) {
  const d = (desc || '').trim();
  if (d && /草稿/.test(d)) return { 狀態: '草稿表', 依據: '描述檔標明為草稿' };
  for (const rule of RULES) {
    if (!rule[0].test(t)) continue;
    if (d && (rule[1] === '疑似備份' || rule[1] === '疑似暫存')) {
      return { 狀態: '現役', 依據: '命名像' + rule[1].slice(2) + '，但描述檔有正式業務描述「' + d + '」' };
    }
    return { 狀態: rule[1], 依據: rule[2] };
  }
  return { 狀態: '現役', 依據: '未命中備份／暫存／系統表命名特徵' };
}

/* ---------- YAML 值 ---------- */
const y = (v) => JSON.stringify(String(v == null ? '' : v));

/* ---------- 讀既有檔的 frontmatter 與正文 ---------- */
function readNote(p) {
  if (!fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw };
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const mm = line.match(/^([^\s:][^:]*):\s*(.*)$/);
    if (!mm) continue;
    let v = mm[2].trim();
    if (v.startsWith('"')) { try { v = JSON.parse(v); } catch (e) { v = v.replace(/^"|"$/g, ''); } }
    fm[mm[1].trim()] = v;
  }
  return { fm, body: m[2] };
}

/* ---------- 主流程 ---------- */
const rows = parseCSV(fs.readFileSync(CSV, 'utf8'));
const header = rows[0];
const EXPECT = ['PK', '表格名稱', '欄位名稱', '中文名稱', '資料型別', '長度', '預設值', '允許空值'];
if (header.join(',') !== EXPECT.join(',')) {
  console.error('CSV 表頭與預期不符，中止：' + header.join(','));
  process.exit(1);
}
const dataRows = rows.slice(1).filter(r => r.join('') !== '');
const badCols = dataRows.filter(r => r.length !== 8);
if (badCols.length) { console.error('欄數異常 ' + badCols.length + ' 列，中止'); process.exit(1); }

/* --- 表中文名（另一份匯出檔） --- */
const descMap = new Map();
let descLoaded = false;
if (fs.existsSync(DESC_CSV)) {
  const drows = parseCSV(fs.readFileSync(DESC_CSV, 'utf8'));
  if (drows[0] && drows[0][0] === '表格名稱' && drows[0][1] === '表格描述') {
    drows.slice(1).forEach(function (r) {
      if (!r[0] || r[0].trim() === '') return;
      const v = (r[1] || '').trim();
      // 匯出時空值寫成字串 "NULL"，不是空字串——照字面收會讓 272 張表有一堆叫 NULL 的中文名。
      descMap.set(r[0].trim(), v === 'NULL' ? '' : v);
    });
    descLoaded = true;
  } else console.error('警告：' + path.basename(DESC_CSV) + ' 表頭不符預期，略過表中文名');
}

const tables = new Map();
for (const r of dataRows) {
  const c = r.map(x => x.trim());
  const table = c[1];
  if (!tables.has(table)) tables.set(table, []);
  tables.get(table).push({
    pk: c[0], field: c[2], zh: c[3], type: c[4], len: c[5], def: c[6], nullable: c[7] === 'V',
  });
}

if (!dryRun) {
  fs.mkdirSync(FIELD_DIR, { recursive: true });
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const diffs = [], newFiles = [], strays = [], keptHuman = new Set();
let fieldCount = 0;

for (const entry of tables) {
  const table = entry[0], fields = entry[1];
  const cls = classify(table, descMap.get(table));
  const isBackup = cls.狀態 === BACKUP_STATUS;
  // 合併後的值要回饋給表文件的統計——直接數 CSV 的 f.zh 會讓「中文名待補」永遠停在
  // 初始值：人工在 Bases 填了幾百個中文名，重跑後那個數字仍照 CSV 算，看起來毫無進展。
  const merged = [];

  /* --- 欄位筆記 --- */
  fields.forEach(function (f, i) {
    fieldCount++;
    const seq = i + 1;
    const p = path.join(FIELD_DIR, table + '__' + f.field + '.md');
    const old = readNote(p);
    const defVal = f.def ? '`' + f.def + '`' : '';

    let zh = f.zh;
    if (old && old.fm['中文名稱'] && old.fm['中文名稱'] !== f.zh) {
      zh = old.fm['中文名稱'];
      keptHuman.add(table + '.' + f.field);
      if (f.zh) diffs.push(table + '.' + f.field + ' 中文名稱：保留既有「' + zh + '」，CSV 為「' + f.zh + '」');
    }
    const remark = (old && old.fm['備註']) || '';
    const fk = (old && old.fm['外鍵指向']) || '';
    if (old) {
      [['資料型別', f.type], ['長度', f.len], ['預設值', defVal], ['鍵值', f.pk]].forEach(function (kv) {
        const prev = old.fm[kv[0]];
        if (prev !== undefined && prev !== kv[1]) {
          diffs.push(table + '.' + f.field + ' ' + kv[0] + '：既有「' + prev + '」→ CSV「' + kv[1] + '」（以 CSV 為準）');
        }
      });
    } else newFiles.push(p);
    merged.push({ zh: zh, fk: fk });

    const out = '---\n'
      + 'RecordType: "schema-field"\n'
      + 'Table: ' + y(table) + '\n'
      + 'Seq: ' + seq + '\n'
      + '資料表: ' + y(table) + '\n'
      + '序號: ' + seq + '\n'
      + '鍵值: ' + y(f.pk) + '\n'
      + '欄位名稱: ' + y(f.field) + '\n'
      + '中文名稱: ' + y(zh) + '\n'
      + '資料型別: ' + y(f.type) + '\n'
      + '長度: ' + y(f.len) + '\n'
      + '預設值: ' + y(defVal) + '\n'
      + '允許空值: ' + f.nullable + '\n'
      + '備註: ' + y(remark) + '\n'
      + '外鍵指向: ' + y(fk) + '\n'
      + '表狀態: ' + y(cls.狀態) + '\n'
      + '真源: "[[03_Schema/' + (isBackup ? '_backup/' : '') + table + '|' + table + ']]"\n'
      + '匯入來源: "01_Raw_Input/現行tableSchema.csv"\n'
      + '---\n\n'
      + '鍵值／資料型別／長度／預設值／允許空值 來自現行 DB 匯出，重跑產生器會以 CSV 覆寫。\n'
      + '中文名稱／備註／外鍵指向 在 Obsidian 的 Bases 直接改，產生器不會洗掉既有內容。\n';
    if (!dryRun) fs.writeFileSync(p, out, 'utf8');
  });

  /* --- 表文件 --- */
  const tp = path.join(isBackup ? BACKUP_DIR : SCHEMA_DIR, table + '.md');
  // 分類規則改動後表可能換邊，舊位置的檔案要一併認得，否則會在新位置重建一份空殼、
  // 把人工寫的正文留在舊檔裡孤零零地爛掉。
  const strayPath = path.join(isBackup ? SCHEMA_DIR : BACKUP_DIR, table + '.md');
  const oldT = readNote(tp) || readNote(strayPath);
  if (!readNote(tp) && oldT) strays.push(strayPath + ' → ' + tp);
  const zhFromCsv = descMap.get(table) || '';
  let zhTable = zhFromCsv;
  const prevZhTable = oldT && oldT.fm['資料表中文名'];
  if (prevZhTable && prevZhTable !== zhFromCsv) {
    zhTable = prevZhTable;
    if (zhFromCsv) diffs.push(table + ' 資料表中文名：保留既有「' + prevZhTable + '」，描述檔為「' + zhFromCsv + '」');
  }
  const pkCount = fields.filter(f => f.pk).length;
  const zhMissing = merged.filter(m => !m.zh).length;
  const fkCount = merged.filter(m => m.fk).length;
  const fm = '---\n'
    + 'cssclasses:\n  - schema-doc\n'
    + 'RecordType: "schema-doc"\n'
    + 'Table: ' + y(table) + '\n'
    + '資料表中文名: ' + y(zhTable) + '\n'
    + '欄位數: ' + fields.length + '\n'
    + '主鍵欄數: ' + pkCount + '\n'
    + '外鍵數: ' + fkCount + '\n'
    + '狀態: ' + y(cls.狀態) + '\n'
    + '狀態依據: ' + y(cls.依據) + '\n'
    + '狀態來源: "命名推測"\n'
    + '描述檔收錄: ' + (descLoaded ? descMap.has(table) : false) + '\n'
    + '中文名待補: ' + zhMissing + '\n'
    + '---\n';

  const h1 = '# ' + table + (zhTable ? '【' + zhTable + '】' : '');
  let out;
  if (oldT) {
    // 正文整段保留，只有 H1 在「還是產生器原樣」時才跟著中文名更新——人工改過標題就不動。
    const body = oldT.body.replace(/^\n+/, '')
      .replace(/^# .+$/m, function (m) {
        return new RegExp('^# ' + table.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(【.*】)?$').test(m) ? h1 : m;
      });
    out = fm + '\n' + body;
  } else {
    newFiles.push(tp);
    const warn = cls.狀態 === '現役' ? ''
      : '\n> 分類為「' + cls.狀態 + '」是**依命名推測**（' + cls.依據 + '），未經機關確認，\n'
      + '> 不得據以刪表或停用。\n';
    out = fm + '\n'
      + h1 + '\n\n'
      + '[待確認] 資料表用途與業務規則尚未訪談確認；本檔目前只承載現行 DB 的結構事實。\n'
      + warn + '\n'
      + '## 欄位\n\n'
      + '![[00_目錄.base#單表結構]]\n\n'
      + '## 內部註記\n\n'
      + '- ' + TODAY + ' 由 `scripts/gen-schema-from-csv.js` 自 `01_Raw_Input/現行tableSchema.csv` 產生。\n';
  }
  if (!dryRun) fs.writeFileSync(tp, out, 'utf8');
}

/* --- 孤兒欄位筆記（CSV 已無對應，只報告不刪） --- */
const expected = new Set();
for (const e of tables) e[1].forEach(f => expected.add(e[0] + '__' + f.field + '.md'));
const orphans = fs.existsSync(FIELD_DIR)
  ? fs.readdirSync(FIELD_DIR).filter(n => n.endsWith('.md') && !expected.has(n)) : [];

/* --- 報告 --- */
const stat = {};
for (const e of tables) { const c = classify(e[0], descMap.get(e[0])).狀態; stat[c] = (stat[c] || 0) + 1; }
console.log((dryRun ? '[dry-run] ' : '') + '表 ' + tables.size + '／欄位 ' + fieldCount);
console.log('狀態分布：' + Object.keys(stat).map(k => k + ' ' + stat[k]).join('、'));
console.log('新建檔 ' + newFiles.length + '、保留人工值 ' + keptHuman.size + ' 欄');
if (descLoaded) {
  const hit = [...tables.keys()].filter(t => descMap.get(t)).length;
  const nolist = [...tables.keys()].filter(t => !descMap.has(t));
  console.log('表中文名：' + hit + '/' + tables.size + ' 有值（描述檔未收錄 ' + nolist.length + ' 張、收錄但為 NULL ' + (tables.size - hit - nolist.length) + ' 張）');
} else console.log('表中文名：未載入描述檔，全部留白');
if (strays.length) {
  console.log('\n分類改變、表文件已換位置 ' + strays.length + ' 份（正文已搬過去，舊檔未刪，請人工移除）：');
  strays.forEach(s => console.log('  ' + s));
}
if (diffs.length) {
  console.log('\n差異 ' + diffs.length + ' 筆：');
  diffs.slice(0, 40).forEach(d => console.log('  ' + d));
  // 主控台只印前 40 筆，但換新的匯出檔時差異可能好幾百筆，而那份清單就是「這次改了什麼」，
  // 截斷等於看不到，所以完整清單一律落檔。
  const outDir = path.join(ROOT, '.scratch', 'outputs');
  try {
    fs.mkdirSync(outDir, { recursive: true });
    const rp = path.join(outDir, 'schema-diff-' + TODAY + '.md');
    fs.writeFileSync(rp, '# schema 差異報告 ' + TODAY + '\n\n共 ' + diffs.length + ' 筆\n\n'
      + diffs.map(d => '- ' + d).join('\n') + '\n', 'utf8');
    console.log('\n完整差異已寫入 ' + rp);
  } catch (e) {
    console.log('\n（完整差異落檔失敗：' + e.message + '）');
  }
}
if (orphans.length) {
  console.log('\n孤兒欄位筆記 ' + orphans.length + ' 份（未刪除，請人工確認）：');
  orphans.slice(0, 20).forEach(o => console.log('  ' + o));
}
