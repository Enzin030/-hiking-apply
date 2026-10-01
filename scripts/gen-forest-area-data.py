"""由正式站 apply_forest_area_1／2.aspx 擷取檔產生 05_Prototype/components/ForestAreaData.js
（林保署自然保護區域：第 1 步的天數／人數／可申請日期，第 2 步的進入範圍、進出入口、抵達時間、
申請目的、安全聲明與宣達清單）。

來源（.scratch/outputs/正式站申請流程盤點/extracts/）：
  630 北插天山（85 自然保留區）     prod-FA001-S02-blank（2026-09-29）；第 1 步擷取時未選天數，數值依 02_Spec/05e §二
  632 鴛鴦湖（85 自然保留區）       prod-FA003-S01／S02（2026-09-30）
  623 十八羅漢山（86 自然保護區）   prod-FA004-S01／S02（2026-09-30）
  628 玉里（87 野生動物保護區）     prod-FA005-S01／S02（2026-09-30）
其他區域沒有資料，雛形不編造（頁面顯示尚未盤點）。重跑後依 R1，git diff 應為空。
"""
import datetime as dt
import html
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
BASE = Path(__file__).resolve().parents[1]
EXT = BASE / ".scratch/outputs/正式站申請流程盤點/extracts"
OUT = BASE / "05_Prototype/components/ForestAreaData.js"

# cId: (fId, typeCode, 第 2 步擷取, 第 1 步擷取或固定值)
AREAS = {
    "630": ("511", "85", "prod-FA001-S02-blank", {"days": [1], "peopleMax": 15, "minDaysAhead": 5, "dateCount": 57}),
    "632": ("513", "85", "prod-FA003-S02", "prod-FA003-S01"),
    "623": ("504", "86", "prod-FA004-S02", "prod-FA004-S01"),
    "628": ("509", "87", "prod-FA005-S02", "prod-FA005-S01"),
}


def load(name):
    return json.loads((EXT / f"{name}.html.json").read_text(encoding="utf-8"))


def text(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


def step1(name):
    """第 1 步：天數、人數上限、可選出發日（最早距擷取日幾天、共幾個）"""
    d = load(name)
    h = d["html"]

    def opts(sid):
        m = re.search(rf'<select[^>]*id="{sid}"[^>]*>(.*?)</select>', h, re.S)
        return [v for v in re.findall(r'<option[^>]*value="([^"]*)"', m.group(1)) if v]
    dates = opts("TravelStartDate")
    cap = dt.date.fromisoformat(d["date"])
    return {"days": [int(x) for x in opts("TravelDays")], "peopleMax": len(opts("TravelPeoples")),
            "minDaysAhead": (dt.date.fromisoformat(dates[0]) - cap).days, "dateCount": len(dates)}


def step2(name):
    h = load(name)["html"]
    seg = h[h.index("1.選擇申請區域"):h.index('id="next"')]
    area_type, area_name = text(re.search(r"申請區域\s*</label>(.*?)</div>", seg, re.S).group(1)).split("/", 1)
    segments = []
    for m in re.finditer(r'<input type="checkbox" name="SubBlockArea" value="([^"]+)" id="SubBlockArea_([^"]+)"[^>]*>(.*?)(?=<input|</div>)', seg, re.S):
        value, sid, rest = html.unescape(m.group(1)), m.group(2), text(m.group(3))
        desc = rest[len(value):].strip() if rest.startswith(value) else rest
        segments.append({"id": sid, "value": value, "desc": desc})
    notes = re.search(r'name="Notes"[^>]*placeholder="([^"]+)"', seg)

    def options(nm):
        sel = re.findall(rf'<select[^>]*name="{nm}"[^>]*>(.*?)</select>', seg, re.S)[0]
        return [(html.unescape(v), text(t)) for v, t in re.findall(r'<option[^>]*value[s]?="([^"]*)"[^>]*>(.*?)</option>', sel, re.S)]
    # 申請目的：data-attach＝須附件數（空字串＝不須附件）。多數區域為單選 radio，鴛鴦湖為複選 checkbox
    found = re.findall(r'<input type="(radio|checkbox)" name="rdo-use-reason"[^>]*data-attach="([^"]*)"[^>]*value="([^"]+)"', seg)
    purposes = [{"value": html.unescape(v), "attach": int(a) if a else 0} for _, a, v in found]
    purpose_input = found[0][0] if found else "radio"
    blocks = []
    for m in re.finditer(r'<div class="block_title">\s*(\d+)\.([^<]+)</div>(.*?)(?=<div class="block_title">|$)', seg, re.S):
        no, title, body = int(m.group(1)), m.group(2).strip(), m.group(3)
        if no < 4:
            continue
        desc = re.search(r'control_label_text">(.*?)</label>', body, re.S)
        inp = re.search(r'<input type="(radio|text)" name="([^"]+)"[^>]*value="([^"]+)"', body)
        blocks.append({"no": no, "title": title, "text": text(desc.group(1)) if desc else "",
                       "name": inp.group(2), "input": inp.group(1), "confirm": html.unescape(inp.group(3))})
    return {"type": area_type, "name": area_name, "segments": segments,
            "notesPlaceholder": notes.group(1) if notes else "",
            "entrances": [{"value": v, "label": t} for v, t in options("SubBlockArea_entr") if v],
            "exits": [{"value": v, "label": t} for v, t in options("SubBlockArea_exit") if v],
            "times": [t for v, t in options("GateTime") if t],
            "purposes": purposes, "purposeInput": purpose_input, "blocks": blocks}


data = {}
for cid, (fid, tcode, s2, s1) in AREAS.items():
    a = {"cId": cid, "fId": fid, "typeCode": tcode}
    a.update(step2(s2))
    a.update(s1 if isinstance(s1, dict) else step1(s1))
    data[cid] = a
    print(cid, a["type"], a["name"], "| 天數", a["days"], "人數", a["peopleMax"], "最早 +", a["minDaysAhead"], "共", a["dateCount"],
          "| 範圍", len(a["segments"]), "時間", f'{a["times"][0]}～{a["times"][-1]}', "| 目的", [(p["value"][:8], p["attach"]) for p in a["purposes"]],
          "| 區塊", [b["title"] for b in a["blocks"]])

js = """/* ============================================================
   ForestAreaData.js — 林保署自然保護區域申請的區域資料（第 1、2 步）
   ------------------------------------------------------------
   **自動產生，不要手改。** 來源：正式站 hike.taiwan.gov.tw `apply_forest_area_1／2.aspx`
   實走擷取（北插天山 2026-09-29；鴛鴦湖、十八羅漢山、玉里 2026-09-30）。產生腳本：
   scripts/gen-forest-area-data.py（重產後依 R1，git diff 應為空）。
   **只有這四個區域實走過**；其他區域沒有資料，頁面顯示「尚未盤點」，不套用任何一筆。
   鍵為 cId（路線列表以 tmpc_id 帶入）。typeCode：85 自然保留區／86 自然保護區／87 野生動物保護區。
   purposes[].attach：須附件數（0＝不須）；purposeInput：radio 單選／checkbox 複選。鴛鴦湖為複選且所有目的都須附件。
   由 apply_forest_area_1／2.html 的 <body> 底部載入；頁面腳本只在 data() 裡讀。
   ============================================================ */
window.TH_FOREST_AREAS = """ + json.dumps(data, ensure_ascii=False, indent=1) + ";\n"
OUT.write_text(js, encoding="utf-8")
print("written", OUT.name, len(js))
