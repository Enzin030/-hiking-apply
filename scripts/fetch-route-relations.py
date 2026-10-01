"""
fetch-route-relations.py — 擷取正式站「複合申請」的關聯路線

來源：**正式站** https://hike.taiwan.gov.tw/apply_1.aspx 的唯讀查詢
      POST Func=ApplyFixedclimbRelation&Value=<c_id>（路線列表點路線時 OtherRoute() 發出的同一支）。
輸入：01_Raw_Input/raw/正式站路線清單.csv（fetch-live-routes.py 產生）的每個 c_id
輸出：01_Raw_Input/raw/正式站關聯路線.json（覆寫）

回應格式：{ result: { Status, Message, Datas: [{ name, OrgID, c_id, f_id, orgName }] } }
  Message＝「<路線名>的審查單位:<單位>」，詢問框在選項下方以綠字顯示。

**前端還會再過濾一次**（OtherRoute）：起點路線屬三個國家公園管理處（Mount3）時，
剔除 OrgID＝警政署（8F7C09DC…）的關聯——國家公園申請頁已內嵌入山證區塊。
本腳本照存原始回應，並另記過濾後的 shown（詢問框實際會列出的選項）。
Datas 為空＝不跳詢問框，直接進該路線的申請入口。

另產生 05_Prototype/components/RouteRelationData.js（只收 shown 非空的路線），供路線列表 apply-1 的複合申請詢問框使用。
依 R1，只重產 JS 時用 --from-raw（不連正式站），跑完 git diff 必須是空的。

每筆查詢間隔 0.5 秒。只讀，不送出任何申請。
用法：python scripts/fetch-route-relations.py            # 重抓正式站＋產生 JS
      python scripts/fetch-route-relations.py --from-raw # 只由既有 JSON 產生 JS
"""
import csv
import datetime
import json
import os
import sys
import time
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "01_Raw_Input", "raw", "正式站路線清單.csv")
OUT = os.path.join(ROOT, "01_Raw_Input", "raw", "正式站關聯路線.json")
JS = os.path.join(ROOT, "05_Prototype", "components", "RouteRelationData.js")
URL = "https://hike.taiwan.gov.tw/apply_1.aspx"
MOUNT3 = {"105E956F-D8DA-49F7-A9B7-3AEFDDA88A12", "E6DD4652-2D37-4346-8F5D-6E538353E0C2", "C951CDCD-B75A-46B9-8002-8EF952EC95FD"}
NPA = "8F7C09DC-AFEB-4708-A7BB-B20DA2A24648"


def query(cid):
    data = urllib.parse.urlencode({"Func": "ApplyFixedclimbRelation", "Value": cid}).encode()
    req = urllib.request.Request(URL, data=data, headers={
        "User-Agent": "Mozilla/5.0", "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"})
    return json.loads(urllib.request.urlopen(req, timeout=30).read().decode("utf-8"))["result"]


def write_js(out):
    rel = {cid: {"message": v["message"],
                 "options": [{"name": d["name"], "orgId": d["OrgID"].upper(), "cId": str(d["c_id"]),
                              "fId": str(d["f_id"]), "orgName": d["orgName"]} for d in v["shown"]]}
           for cid, v in out["routes"].items() if v["shown"]}
    head = "\n".join([
        "/* ============================================================",
        "   RouteRelationData.js — 複合申請詢問框的關聯路線",
        "   ------------------------------------------------------------",
        "   **由 scripts/fetch-route-relations.py 產生，不要手改。**",
        "   來源：正式站 apply_1.aspx Func=ApplyFixedclimbRelation（" + out["fetched"] + " 擷取），",
        "   原始回應存 01_Raw_Input/raw/正式站關聯路線.json。已套用前端過濾（國家公園路線不列警政署）。",
        "   鍵＝起點路線 c_id；options＝詢問框下拉；message＝選項下方的綠字。",
        "   ============================================================ */",
        "", ""])
    with open(JS, "w", encoding="utf-8", newline="\n") as f:
        f.write(head + "window.TH_ROUTE_RELATIONS = " + json.dumps(rel, ensure_ascii=False, indent=2) + ";\n")
    print("written", JS, len(rel))


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    if "--from-raw" in sys.argv:
        with open(OUT, encoding="utf-8") as f:
            write_js(json.load(f))
        return
    with open(SRC, encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))
    out = {"source": URL + " Func=ApplyFixedclimbRelation", "fetched": datetime.date.today().isoformat(), "routes": {}}
    for r in rows:
        cid, org = r["c_id"], (r.get("OrgID") or r.get("org_id") or "").upper()
        if not cid or cid in out["routes"]:
            continue
        res = query(cid)
        datas = res.get("Datas") or []
        shown = [d for d in datas if not (org in MOUNT3 and d["OrgID"].upper() == NPA)]
        out["routes"][cid] = {"name": r.get("name") or r.get("路線名") or "", "org": org,
                              "message": res.get("Message") or "", "datas": datas, "shown": shown}
        if shown:
            print(cid, out["routes"][cid]["name"], "→", [(d["c_id"], d["name"], d["orgName"]) for d in shown])
        time.sleep(0.5)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    n = sum(1 for v in out["routes"].values() if v["shown"])
    print("routes", len(out["routes"]), "with modal", n, "→", OUT)
    write_js(out)


if __name__ == "__main__":
    main()
