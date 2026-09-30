"""由正式站 apply_05.aspx 擷取檔產生 05_Prototype/components/Apply6NoticeData.js
（六步驟家族第 5 步「同意聲明」：警政署、林保署自然保護區域三種類型）。

來源（.scratch/outputs/正式站申請流程盤點/extracts/，2026-09-29 擷取）：
  prod-FA002-S05-clean.html.json —— 正式站該頁同時載入警政署、山屋、保護區三塊，
  依申請類別只顯示一塊（其餘 class="sethide"），所以一份擷取就有全部原文。
重跑後依 R1，git diff 應為空。山屋的注意事項另由 gen-fc-notice.py 產生。
"""
import html
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
BASE = Path(__file__).resolve().parents[1]
SRC = BASE / ".scratch/outputs/正式站申請流程盤點/extracts/prod-FA002-S05-clean.html.json"
OUT = BASE / "05_Prototype/components/Apply6NoticeData.js"
h = json.loads(SRC.read_text(encoding="utf-8"))["html"]


def block(start_marker, end_marker):
    i = h.index(start_marker)
    j = h.find(end_marker, i + len(start_marker))
    return h[i:j if j > 0 else len(h)]


def lines(seg):
    t = re.sub(r"(?s)<script.*?</script>|<style.*?</style>", "", seg)
    t = re.sub(r"<br\s*/?>|</p>|</div>|</li>|</h\d>|</tr>|</td>", "\n", t)
    t = html.unescape(re.sub(r"<[^>]+>", "", t))
    out = [re.sub(r"\s+", " ", x).strip() for x in t.split("\n")]
    # 區塊從標籤中間切開，頭尾會留下半截標籤（name="Forest85">、<div class="sethide"），濾掉
    return [x for x in out if x and "<" not in x and not re.match(r'^(name|class|id)="', x)]


def merge_numbered(ls):
    """正式站用表格排「1」「內文」兩格，拆行後編號自成一行，併回下一行"""
    out = []
    for x in ls:
        if out and re.fullmatch(r"\d{1,2}|\([一二三四五六七八九十]+\)|（[一二三四五六七八九十]+）", out[-1]):
            out[-1] = out[-1] + " " + x
        else:
            out.append(x)
    return out


# ---- 警政署 ----
npa = block('name="TravelStep02Npa"', 'name="TravelStep02CampRoom"')
modal = npa[npa.index('<div class="modal-body">'):npa.index('<div class="modal-footer">')]
panel = npa[npa.index('class="panel-title"'):]
privacy = re.search(r'<a href="([^"]+)"[^>]*>\s*隱私權保護政策\s*</a>', panel)
body = [x for x in lines(panel) if x not in ("隱私權保護政策及作業使用說明", "隱私權保護政策", "作業使用說明", "請確認已勾選同意聲明", "同意上述聲明", "上一步", "下一步")]
body = [x for x in body if not x.startswith('class="')]
NPA = {
    "title": "警政署",
    "panelTitle": "隱私權保護政策及作業使用說明",
    "privacyUrl": html.unescape(privacy.group(1)) if privacy else "",
    "manual": merge_numbered([x for x in lines(modal) if x != "×"]),
    "body": body,
    "agree": "同意上述聲明",
}

# ---- 自然保護區域：Forest85／86／87 對應機關代碼 7D0ED03D-…-96F6434F5A85／86／87 ----
fa = block('name="TravelStep02ForestAreaFrom"', 'ForestCheckAction"')
AREA = {}
for code in ("85", "86", "87"):
    s = re.search(rf'(?:name|id)="Forest{code}"', fa).start()
    nxt = [m.start() for c in ("85", "86", "87") for m in [re.search(rf'(?:name|id)="Forest{c}"', fa[s + 10:])] if m]
    nxt = [s + 10 + x for x in nxt]
    nxt = [x for x in nxt if x > s]
    seg = fa[s:min(nxt) if nxt else len(fa)]
    ls = lines(seg)
    AREA[code] = {"lines": ls}
AREA_AGREE = "以上說明，本人業已完全明瞭，並同意確實遵守相關規定。"
TYPE = {"85": "自然保留區", "86": "自然保護區", "87": "野生動物保護區"}
for code, v in AREA.items():
    v["title"] = TYPE[code]
    print(code, TYPE[code], len(v["lines"]), "|", v["lines"][0][:40], "…", v["lines"][-1][:40])
print("npa manual", len(NPA["manual"]), "body", NPA["body"], "privacy", NPA["privacyUrl"][:60])

data = {"npa": NPA, "area": AREA, "areaAgree": AREA_AGREE}
js = """/* ============================================================
   Apply6NoticeData.js — 六步驟家族第 5 步「同意聲明」原文（警政署、林保署自然保護區域）
   ------------------------------------------------------------
   **自動產生，不要手改。** 來源：正式站 hike.taiwan.gov.tw `apply_05.aspx`
   （2026-09-29 擷取，extracts/prod-FA002-S05-clean.html.json）。產生腳本：
   scripts/gen-apply6-notice.py（重產後依 R1，git diff 應為空）。
   area 的鍵是機關代碼尾碼：85 自然保留區、86 自然保護區、87 野生動物保護區
   （7D0ED03D-E3FF-4482-8254-96F6434F5A85／86／87）。山屋另見 ForestCampNoticeData.js。
   段落只保留文字，原站粗體、顏色、表格格式未保留。
   由 apply_05.html 的 <body> 底部載入；頁面腳本只在 data() 裡讀。
   ============================================================ */
window.TH_APPLY6_NOTICES = """ + json.dumps(data, ensure_ascii=False, indent=1) + ";\n"
OUT.write_text(js, encoding="utf-8")
print("written", OUT.name, len(js))
