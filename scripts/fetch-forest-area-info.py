"""
fetch-forest-area-info.py — 擷取正式站林保署自然保護區域的區域設定（含申請目的的 crossday 旗標）

來源：**正式站** https://hike.taiwan.gov.tw/apply_forest_area_1.aspx 第 1 步載入時的同一組唯讀查詢：
  1. GET  apply_forest_area_1.aspx?unit=<OrgID>&tmpc_id=<c_id>&tmpf_id=<f_id>（取 session cookie）
  2. POST Func=FormActionKey                                  → ActionKey
  3. POST Func=RouteInfo&Val=<f_id>&ActionKey=…               → Datas[0].area_code（頁面存為 SecondaryGuid）
  4. POST Func=FormForestAreaList&Val=<area_code>&ActionKey=… → Datas.meta（area／forms／start／statement）
輸入：01_Raw_Input/raw/正式站路線清單.csv 中 agency＝forestry-area 的列
輸出：01_Raw_Input/raw/正式站保護區設定.json（覆寫）

為什麼要這份：正式站第 1 步天數下拉在前端寫死只有 1（TravelStep01Days 的 for i<2），
第 2 步 ForestAreaNext() 對天數 > 1 一律 ShowSwal(-68)；但區域設定的 form_json 裡，
每個申請目的的 conf 帶有 crossday（可跨日）旗標——工程師 2026-10-06 說明林保署自己的系統可多天、依目的而定。

每個區域間隔 0.5 秒。只讀，不送出任何申請。
用法：python scripts/fetch-forest-area-info.py
"""
import csv
import datetime
import http.cookiejar
import json
import os
import sys
import time
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "01_Raw_Input", "raw", "正式站路線清單.csv")
OUT = os.path.join(ROOT, "01_Raw_Input", "raw", "正式站保護區設定.json")
PAGE = "https://hike.taiwan.gov.tw/apply_forest_area_1.aspx"
HEAD = {"User-Agent": "Mozilla/5.0", "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    with open(SRC, encoding="utf-8-sig") as f:
        rows = [r for r in csv.DictReader(f) if r["agency"] == "forestry-area"]
    out = {"source": PAGE + " Func=RouteInfo／FormForestAreaList", "fetched": datetime.date.today().isoformat(), "areas": {}}
    for r in rows:
        cid, fid, org = r["c_id"], r["f_id"], r["org_id"]
        opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
        url = PAGE + "?" + urllib.parse.urlencode({"unit": org, "tmpc_id": cid, "tmpf_id": fid})
        opener.open(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=30).read()

        def post(form):
            req = urllib.request.Request(PAGE, data=urllib.parse.urlencode(form).encode(), headers=dict(HEAD, Referer=url))
            return json.loads(opener.open(req, timeout=30).read().decode("utf-8"))["result"]

        key = post({"Func": "FormActionKey"})["Datas"]
        info = post({"Func": "RouteInfo", "Val": fid, "ActionKey": key})
        code = info["Datas"][0]["area_code"]
        lst = post({"Func": "FormForestAreaList", "Val": code, "ActionKey": key})
        out["areas"][cid] = {"f_id": fid, "name": r["name"], "area_code": code, "routeInfo": info["Datas"][0],
                             "meta": (lst.get("Datas") or {}).get("meta"), "status": lst.get("Status"), "message": lst.get("Message")}
        print(cid, code, r["name"], "ok" if lst.get("Status") else lst.get("Message"))
        time.sleep(0.5)
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print("written", OUT, len(out["areas"]))


if __name__ == "__main__":
    main()
