"""由正式站 apply_forest_area_1／2.aspx 擷取檔產生 05_Prototype/components/ForestAreaData.js
（林保署自然保護區域：第 1 步的天數／人數／可申請日期，第 2 步的進入範圍、進出入口、抵達時間、
申請目的、安全聲明與宣達清單）。

來源（.scratch/outputs/正式站申請流程盤點/extracts/）：
  630 北插天山（85 自然保留區）     prod-FA001-S02-blank（2026-09-29）；第 1 步擷取時未選天數，數值依 02_Spec/05e §二
  632 鴛鴦湖（85 自然保留區）       prod-FA003-S01／S02（2026-09-30）
  623 十八羅漢山（86 自然保護區）   prod-FA004-S01／S02（2026-09-30）
  628 玉里（87 野生動物保護區）     prod-FA005-S01／S02（2026-09-30）
  其餘 19 區                         prod-FA006～FA024-S01／S02（2026-10-01，walk_fa --stop-at 2）
正式站路線清單上的 23 區全部收錄。第 2 步有兩種版面：有預設進入範圍（SubBlockArea 勾選＋入口出口下拉），
或沒有（gateText：進入範圍只有文字欄、入口出口為必填文字欄）。重跑後依 R1，git diff 應為空。
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
# 2026-10-01 其餘 19 區（cId, fId, typeCode, 擷取編號）
for _cid, _fid, _t, _no in [
    ("609", "490", "85", 6), ("610", "491", "85", 7), ("611", "492", "85", 8), ("612", "493", "85", 9),
    ("613", "494", "85", 10), ("614", "495", "85", 11), ("615", "496", "85", 12), ("616", "497", "85", 13),
    ("617", "498", "85", 14), ("618", "499", "85", 15), ("619", "500", "85", 16), ("620", "501", "85", 17),
    ("629", "510", "85", 18), ("631", "512", "85", 19), ("622", "503", "86", 20), ("624", "505", "86", 21),
    ("625", "506", "86", 22), ("626", "507", "86", 23), ("627", "508", "87", 24),
]:
    AREAS[_cid] = (_fid, _t, f"prod-FA{_no:03d}-S02", f"prod-FA{_no:03d}-S01")


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
        sel = re.findall(rf'<select[^>]*name="{nm}"[^>]*>(.*?)</select>', seg, re.S)
        if not sel:   # 自由輸入版面沒有入口／出口下拉
            return []
        return [(html.unescape(v), text(t)) for v, t in re.findall(r'<option[^>]*value[s]?="([^"]*)"[^>]*>(.*?)</option>', sel[0], re.S)]
    # 申請目的：data-attach＝須附件數（空字串＝不須附件）；data-limit＝人數下限（申請人數小於此值不得勾選）。
    # 多數區域為單選 radio，鴛鴦湖為複選 checkbox。選項後的紅字 <span class="text-red"> 是附件說明，
    # 內含「下載範本」連結時另存 template（轉為正式站絕對網址）
    found = re.findall(r'<input type="(radio|checkbox)" name="rdo-use-reason"[^>]*?data-limit="([^"]*)"[^>]*?data-attach="([^"]*)"'
                       r'[^>]*?value="([^"]+)"[^>]*>\s*(?:<span class="text-red">(.*?)</span>)?', seg, re.S)
    purposes = []
    for _, lim, a, v, note in found:
        tpl = re.search(r'<a href="([^"]+)"[^>]*>(.*?)</a>', note or "", re.S)
        p = {"value": html.unescape(v), "attach": int(a) if a else 0, "limit": int(lim) if lim else 0,
             "note": text((note or "")[:tpl.start()] if tpl else (note or ""))}
        if tpl:   # 連結在說明中間：note＝連結前、noteAfter＝連結後
            p["template"] = {"label": text(tpl.group(2)), "href": "https://hike.taiwan.gov.tw/" + tpl.group(1)}
            p["noteAfter"] = text(note[tpl.end():])
        purposes.append(p)
    purpose_input = found[0][0] if found else "radio"
    blocks = []
    for m in re.finditer(r'<div class="block_title">\s*(\d+)\.([^<]+)</div>(.*?)(?=<div class="block_title">|$)', seg, re.S):
        no, title, body = int(m.group(1)), m.group(2).strip(), m.group(3)
        if no < 4:
            continue
        # 說明可能不只一段（例：出雲山「行程計畫」有說明＋填寫範例兩段），以換行接起
        desc = [text(d) for d in re.findall(r'control_label_text">(.*?)</label>', body, re.S)]
        # 三種欄位：radio＝勾選確認；text＝唯讀已帶入文字；textarea＝空白待填（例：行程計畫，2026-10-01 出雲山、翡翠水庫）
        inp = re.search(r'<input type="(radio|text|textarea)" name="([^"]+)"[^>]*value="([^"]*)"', body)
        blocks.append({"no": no, "title": title, "text": "\n".join(d for d in desc if d),
                       "name": inp.group(2), "input": inp.group(1), "confirm": html.unescape(inp.group(3))})
    return {"type": area_type, "name": area_name, "segments": segments,
            "notesPlaceholder": notes.group(1) if notes else "",
            "entrances": [{"value": v, "label": t} for v, t in options("SubBlockArea_entr") if v],
            "exits": [{"value": v, "label": t} for v, t in options("SubBlockArea_exit") if v],
            "times": [t for v, t in options("GateTime") if t],
            # 第二種版面（區域沒有 sub_block）：進入範圍只有 Notes 文字欄，入口／出口為必填文字欄 GateText
            "gateText": 'name="GateText"' in seg,
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
   實走擷取（北插天山 2026-09-29；鴛鴦湖、十八羅漢山、玉里 2026-09-30；其餘 19 區 2026-10-01）。產生腳本：
   scripts/gen-forest-area-data.py（重產後依 R1，git diff 應為空）。
   正式站路線清單上的 23 區全部收錄；gateText＝沒有預設進入範圍，入口／出口為自由輸入。
   鍵為 cId（路線列表以 tmpc_id 帶入）。typeCode：85 自然保留區／86 自然保護區／87 野生動物保護區。
   purposes[].attach：須附件數（0＝不須）；purposeInput：radio 單選／checkbox 複選。鴛鴦湖為複選且所有目的都須附件。
   由 apply_forest_area_1／2.html 的 <body> 底部載入；頁面腳本只在 data() 裡讀。
   ============================================================ */
window.TH_FOREST_AREAS = """ + json.dumps(data, ensure_ascii=False, indent=1) + ";\n"
OUT.write_text(js, encoding="utf-8")
print("written", OUT.name, len(js))
