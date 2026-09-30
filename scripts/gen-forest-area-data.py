"""由正式站 apply_forest_area_2.aspx 擷取檔產生 05_Prototype/components/ForestAreaData.js
（林保署自然保護區域：區域的進入範圍、進出入口、抵達時間、申請目的、安全聲明與宣達清單）。

來源（.scratch/outputs/正式站申請流程盤點/extracts/，2026-09-29 擷取）：
  prod-FA001-S02-blank.html.json —— 插天山自然保留區 - 北插天山步道及其支線（cid 630／fid 511）
**只有這一個區域實走過**，其他 22 個區域沒有資料，雛形不編造（頁面顯示尚未盤點）。
第 1 步的數值（天數、人數上限、最早天數）取自同日第 1 步擷取與 02_Spec/05e §二。
重跑後依 R1，git diff 應為空。
"""
import html
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
BASE = Path(__file__).resolve().parents[1]
EXT = BASE / ".scratch/outputs/正式站申請流程盤點/extracts"
OUT = BASE / "05_Prototype/components/ForestAreaData.js"
h = json.loads((EXT / "prod-FA001-S02-blank.html.json").read_text(encoding="utf-8"))["html"]


def text(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


seg = h[h.index("1.選擇申請區域"):h.index('id="next"')]

# 申請區域（唯讀）
area_label = text(re.search(r"申請區域\s*</label>(.*?)</div>", seg, re.S).group(1))
area_type, area_name = area_label.split("/", 1)

# 1. 進入範圍：每段 <label>描述</label><input type=checkbox value=段名 id=SubBlockArea_Axx-nnn>
segments = []
for m in re.finditer(r'<input type="checkbox" name="SubBlockArea" value="([^"]+)" id="SubBlockArea_([^"]+)"[^>]*>(.*?)(?=<input|</div>)', seg, re.S):
    value, sid, rest = m.group(1), m.group(2), text(m.group(3))
    desc = rest[len(value):].strip() if rest.startswith(value) else rest
    segments.append({"id": sid, "value": html.unescape(value), "desc": desc})
notes_ph = re.search(r'name="Notes"[^>]*placeholder="([^"]+)"', seg).group(1)


def options(name, idx=0):
    sel = re.findall(rf'<select[^>]*name="{name}"[^>]*>(.*?)</select>', seg, re.S)[idx]
    return [(html.unescape(v), text(t)) for v, t in re.findall(r'<option[^>]*value[s]?="([^"]*)"[^>]*>(.*?)</option>', sel, re.S)]


entr = [{"value": v, "label": t} for v, t in options("SubBlockArea_entr") if v]
exit_ = [{"value": v, "label": t} for v, t in options("SubBlockArea_exit") if v]
times = [t for v, t in options("GateTime") if t]

# 3. 申請目的：data-attach 有值＝須附件
purposes = [{"value": html.unescape(v), "attach": bool(a)} for a, v in
            re.findall(r'<input type="radio" name="rdo-use-reason"[^>]*data-attach="([^"]*)"[^>]*value="([^"]+)"', seg)]

# 4～9：block_title＋說明＋確認（radio 為勾選、text 為唯讀已帶入文字）
blocks = []
for m in re.finditer(r'<div class="block_title">\s*(\d+)\.([^<]+)</div>(.*?)(?=<div class="block_title">|$)', seg, re.S):
    no, title, body = int(m.group(1)), m.group(2).strip(), m.group(3)
    if no < 4:
        continue
    desc = re.search(r'control_label_text">(.*?)</label>', body, re.S)
    inp = re.search(r'<input type="(radio|text)" name="([^"]+)"[^>]*value="([^"]+)"', body)
    blocks.append({"no": no, "title": title, "text": text(desc.group(1)) if desc else "",
                   "name": inp.group(2), "input": inp.group(1), "confirm": html.unescape(inp.group(3))})

area = {
    "code": "c6261e0b", "cId": "630", "fId": "511",
    "type": area_type, "typeCode": "85", "name": area_name,
    "days": [1], "peopleMax": 15, "minDaysAhead": 5, "dateCount": 57,
    "segments": segments, "notesPlaceholder": notes_ph,
    "entrances": entr, "exits": exit_, "times": times,
    "purposes": purposes, "blocks": blocks,
}
print(area_type, area_name, "segments", len(segments), "entr", len(entr), "exit", len(exit_), "times", len(times),
      "purposes", purposes, "blocks", [(b["no"], b["title"], b["input"]) for b in blocks])
js = """/* ============================================================
   ForestAreaData.js — 林保署自然保護區域申請的區域資料（第 1、2 步）
   ------------------------------------------------------------
   **自動產生，不要手改。** 來源：正式站 hike.taiwan.gov.tw `apply_forest_area_2.aspx`
   （2026-09-29 實走擷取，extracts/prod-FA001-S02-blank.html.json）。產生腳本：
   scripts/gen-forest-area-data.py（重產後依 R1，git diff 應為空）。
   **只有北插天山（cid 630）實走過**；其他區域沒有資料，頁面顯示「尚未盤點」，不套用本筆。
   鍵為 cId（路線列表以 tmpc_id 帶入）。typeCode：85 自然保留區／86 自然保護區／87 野生動物保護區。
   由 apply_forest_area_1／2.html 的 <body> 底部載入；頁面腳本只在 data() 裡讀。
   ============================================================ */
window.TH_FOREST_AREAS = """ + json.dumps({"630": area}, ensure_ascii=False, indent=1) + ";\n"
OUT.write_text(js, encoding="utf-8")
print("written", OUT.name, len(js))
