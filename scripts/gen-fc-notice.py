"""由正式站 apply_05.aspx 擷取檔產生 ForestCampNoticeData.js（四間山屋的同意聲明原文）。
來源：.scratch/outputs/正式站申請流程盤點/extracts/prod-FC001-S05.html.json（2026-09-29）"""
import json, re, html, sys
sys.stdout.reconfigure(encoding="utf-8")
BASE = str(__import__("pathlib").Path(__file__).resolve().parents[1])
h = json.load(open(BASE + r"\.scratch\outputs\正式站申請流程盤點\extracts\prod-FC001-S05.html.json", encoding="utf-8"))["html"]
KEYS = {"天池": "tianchi", "檜谷": "guigu", "嘉明湖": "jiaming", "向陽": "xiangyang"}
starts = [m.start() for m in re.finditer(r'<div class="hut-notice">', h)]
out = {}
for k, s in enumerate(starts):
    label = re.findall(r"<!--(.*?)-->", h[max(0, s - 400):s])[-1].strip()
    # 區塊邊界：下一個 hut-notice，或本容器之後的下一個 container-fluid
    nxt = starts[k + 1] if k + 1 < len(starts) else h.find('<div class="container-fluid"', s)
    seg = h[s:nxt]
    paras = []
    for p in re.findall(r"<p[^>]*>(.*?)</p>", seg, re.S):
        t = re.sub(r"\s+", " ", html.unescape(re.sub(r"<br\s*/?>", "\n", p))).strip()
        t = re.sub(r"<[^>]+>", "", t).strip()
        if t.startswith("自然保留區是嚴禁破壞"):
            break      # 最後一間（向陽）之後緊接自然保護區域的同意聲明，不屬山屋
        if t:
            paras.append(t)
    out[KEYS[label]] = {"label": label, "title": paras[0], "paras": paras[1:]}
    print(label, KEYS[label], len(paras), "|", paras[0][:40], "…", paras[-1][:50])

js = """/* ============================================================
   ForestCampNoticeData.js — 山屋申請第 5 步「同意聲明」的注意事項原文
   ------------------------------------------------------------
   **自動產生，不要手改。** 來源：正式站 hike.taiwan.gov.tw `apply_05.aspx`
   （2026-09-29 實走嘉明湖時擷取，extracts/prod-FC001-S05.html.json）。
   正式站該頁同時載入四間山屋的注意事項，只顯示申請中的那一間（其餘 class="sethide"），
   所以四間都有正式站原文。產生腳本：scripts/gen-fc-notice.py
   （重產後依 R1，git diff 應為空）。
   段落只保留文字，原站的粗體、顏色、表格格式未保留。
   由 forest-camp-5.html 的 <body> 底部載入；頁面腳本只在 data() 裡讀。
   ============================================================ */
window.TH_FC_NOTICES = """ + json.dumps(out, ensure_ascii=False, indent=1) + ";\n"
open(BASE + r"\05_Prototype\components\ForestCampNoticeData.js", "w", encoding="utf-8").write(js)
print("written", len(js))
