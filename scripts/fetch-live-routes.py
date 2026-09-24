"""
fetch-live-routes.py — 擷取正式站「登山線上申請」的路線清單快照

來源：**正式站** https://hike.taiwan.gov.tw/apply_1.aspx（不是測試站 service.skyeyes.tw）
輸出：01_Raw_Input/raw/正式站路線清單.csv（覆寫）

為什麼要 postback：該頁初次載入時「推薦的路線/步道」是空的（顯示「尚無資料」），
清單要由「以分類查詢」按鈕觸發 ASP.NET postback 才會出現。本腳本帶初次載入的
__VIEWSTATE 等欄位，以 hidorgid=0（全部）送出一次 btnselectClick，
解析回傳的每張卡片。

每張卡片可取得的欄位（**正式站畫面上只有這些**，其餘如天數、熱門、縮圖都沒有）：
  c_id、f_id、OrgID、主路線名（hidmainname）、路線名、難度等級、地圖連結、
  關閉訊息（紅字 CloaeMain）、source_guid、chk

另外兩項補充（2026-09-24 加）：
  · 申請天數範圍：**只有太魯閣**。逐條先開同意書 apply_1_2.aspx 建 session，再開
    apply_1_5.aspx（申請第一步）讀下拉。雪霸、玉山送出同意後會被導回 apply_1.aspx
    （2026-09-24 實測，推測還需要前端狀態），靜態請求進不去，不抓；
    那兩處的天數由 sync-route-data.js 改用 次路線.csv 的 sumdaymin／sumdaymax。
    太魯閣的做法：apply_1_5.aspx 讀
    「行程天數」下拉 con_step1_sumday 的「共N天」選項，取最小／最大值
    → sumday_min／sumday_max。這是**可申請的天數範圍**，不是 information_1.aspx
    路線介紹裡的「建議行程」天數，兩者不同（例：奇萊東稜建議 7 天）。
    林保署、警政署不走這一頁，不抓；林保署山屋的天數下拉（apply_forest_camp_1.aspx
    的 TravelDays）靜態 HTML 是空的，由前端 JS 載入，**抓不到就留空**。
  · 暫停申請的路線：正式站列表不列出，但 apply_1.aspx 的 OtherRoute() 裡寫死了
    暫停原因（錐麓古道 c_id 21／132、清水山 35）。以 listed=0 附在最後，
    close_msg 取 JS 內的原文；名稱等欄位正式站沒有，由 sync-route-data.js 沿用既有值。

用法：python scripts/fetch-live-routes.py
接著跑 node scripts/sync-route-data.js 把快照合併進 05_Prototype/components/RouteData.js。
"""
import csv
import datetime
import html
import http.client
import http.cookiejar
import os
import re
import sys
import time
import urllib.parse
import urllib.request

URL = "https://hike.taiwan.gov.tw/apply_1.aspx"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "01_Raw_Input", "raw", "正式站路線清單.csv")

# 正式站「以分類查詢」的機關按鈕 → 雛形的 agency 鍵（按鈕文字即 org_name）
ORG_KEYS = {
    "105e956f-d8da-49f7-a9b7-3aefdda88a12": "taroko",
    "e6dd4652-2d37-4346-8f5d-6e538353e0c2": "shei-pa",
    "c951cdcd-b75a-46b9-8002-8ef952ec95fd": "yushan",
    "8f7c09dc-afeb-4708-a7bb-b20da2a24648": "police",
    "7d0ed03d-e3ff-4482-8254-96f6434f5a85": "forestry-area",   # 自然保留區（同時是按鈕的 OrgID）
    # 以下兩個 OrgID 沒有自己的按鈕，卡片列在「林業及自然保育署自然保護區域」之下
    # （2026-09-24 實測：a86＝自然保護區 5 條、a87＝野生動物保護區 2 條）
    "7d0ed03d-e3ff-4482-8254-96f6434f5a86": "forestry-area",
    "7d0ed03d-e3ff-4482-8254-96f6434f5a87": "forestry-area",
    "84bc7d2b-ad3e-4f39-b568-a96681087f74": "forestry-camp",
}


def fetch():
    jar = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
    opener.addheaders = [("User-Agent", "Mozilla/5.0")]
    first = opener.open(URL, timeout=60).read().decode("utf-8")

    form = {}
    for m in re.finditer(r'<input type="hidden" name="([^"]+)" id="[^"]*" value="([^"]*)"', first):
        form[html.unescape(m.group(1))] = html.unescape(m.group(2))
    form.update({
        "ctl00$con$hidorgid": "0",
        "ctl00$con$txLine": "",
        "ctl00$con$line": "",
        "ctl00$con$btnselectClick": "查詢路線",
    })
    body = urllib.parse.urlencode(form).encode()
    page = opener.open(URL, body, timeout=120).read().decode("utf-8")

    # 機關名稱取自按鈕文字，不寫死
    org_names = {}
    for m in re.finditer(r'onclick="setorg\(\'([^\']+)\'\)">([^<]+)</button>', first):
        org_names[m.group(1).lower()] = html.unescape(m.group(2)).strip()
    return first, page, org_names, opener


def field(part, name):
    m = re.search(r'\$' + name + r'" id="[^"]*"(?: value="([^"]*)")?', part)
    return html.unescape(m.group(1) or "") if m else ""


def parse(page, org_names):
    start = page.find("con_UpdatePanel2")
    end = page.find("web_footer", start)
    block = page[start:end]
    parts = re.split(r'<input type="hidden" name="ctl00\$con\$New_List\$ctl\d+\$chk"', block)[1:]
    rows = []
    for i, part in enumerate(parts, 1):
        chk = re.match(r' id="[^"]*" value="([^"]*)"', part).group(1)
        org = field(part, "hidorg").lower()
        level = re.search(r">第(\d)級<", part)
        names = re.findall(r'<p class="data-trail">\s*(.*?)\s*</p>', part, re.S)
        close = re.search(r'CloaeMain_\d+"[^>]*>(.*?)</span>', part, re.S)
        mapm = re.search(r'id="piclink"[^>]*href="([^"]+)"', part)
        rows.append({
            "ord": i,
            "agency": ORG_KEYS.get(org, ""),
            "org_id": org,
            "org_name": org_names.get(org, ""),
            "f_id": field(part, "hidf_id"),
            "c_id": field(part, "hidc_id"),
            "main_name": field(part, "hidmainname").strip(),
            "name": html.unescape(names[0]).strip() if names else "",
            "level": level.group(1) if level else "",
            "map_url": html.unescape(mapm.group(1)) if mapm else "",
            "close_msg": re.sub(r"<[^>]+>", "", html.unescape(close.group(1))).strip() if close else "",
            "source_guid": field(part, "hidsource_guid"),
            "chk": chk,
        })
    # 沒有自己按鈕的 OrgID（a86／a87），機關名稱取所屬分類按鈕的文字
    by_agency = {ORG_KEYS[k]: v for k, v in org_names.items() if k in ORG_KEYS}
    for r in rows:
        if not r["org_name"]:
            r["org_name"] = by_agency.get(r["agency"], "")
    return rows


def sumday_range(opener, r):
    """申請第一步的「行程天數」下拉 → (最小, 最大)；抓不到回 ("", "")"""
    q = "?unit=" + r["org_id"].upper() + f"&cid={r['c_id']}&fid={r['f_id']}&camp_id=0"
    # 要先開同意書頁 apply_1_2 建立 session，直接開 apply_1_5 下拉是空的（2026-09-24 實測）
    pages = ["https://hike.taiwan.gov.tw/apply_1_2.aspx" + q, "https://hike.taiwan.gov.tw/apply_1_5.aspx" + q]
    # 正式站偶爾逾時（2026-09-24 實測）：重試 3 次，最後一次仍失敗就讓例外拋出，
    # 不吞掉——吞掉會把「沒抓到」寫成空值，看起來像「該路線沒有天數」
    for attempt in range(3):
        try:
            for url in pages:
                s = opener.open(url, timeout=90).read().decode("utf-8", "ignore")
            break
        except (TimeoutError, OSError, http.client.HTTPException) as e:
            if attempt == 2:
                raise RuntimeError(f"c_id {r['c_id']} 申請天數擷取失敗：{e}") from e
            time.sleep(3)
    m = re.search(r'<select[^>]*con_step1_sumday[^>]*>(.*?)</select>', s, re.S)
    days = [int(d) for d in re.findall(r">共(\d+)天<", m.group(1))] if m else []
    return (min(days), max(days)) if days else ("", "")


def closed_routes(first):
    """OtherRoute() 開頭寫死的暫停路線：`if (c_id == "21" || c_id == "132") { … text: "<div>…</div>"`"""
    # 先去掉 // 註解再截：函式開頭有一大段註解掉的舊程式也含 ApplyFixedclimbRelation，
    # 先截再去註解會把範圍截在暫停判斷之前（2026-09-24 實測抓到 0 條）
    i = first.find("function OtherRoute")
    code = "\n".join(l for l in first[i:i + 30000].split("\n") if not l.strip().startswith("//"))
    code = code[:code.find("ApplyFixedclimbRelation")]
    out = []
    for m in re.finditer(r'if \(((?:\s*\|\|\s*)?(?:c_id == "\d+"(?:\s*\|\|\s*)?)+)\)\s*\{.*?text:\s*"<div>(.*?)</div>"', code, re.S):
        for cid in re.findall(r'"(\d+)"', m.group(1)):
            out.append((cid, html.unescape(m.group(2)).strip()))
    return out


def main():
    first, page, org_names, opener = fetch()
    rows = parse(page, org_names)
    if not rows:
        sys.exit("解析不到任何路線卡片：正式站版型可能已改，請先檢查 HTML 再更新本腳本")
    unknown = [r["org_id"] for r in rows if not r["agency"]]
    if unknown:
        sys.exit(f"出現未對應的機關 OrgID：{sorted(set(unknown))}，請補進 ORG_KEYS")
    for r in rows:
        r["listed"] = "1"

    # 暫停路線：都是太魯閣（OtherRoute 的判斷只看 c_id；機關依舊資料，[待確認] 若新增他處）
    taroko = next(r for r in rows if r["agency"] == "taroko")
    listed = {r["c_id"] for r in rows}
    for cid, msg in closed_routes(first):
        if cid in listed:
            continue
        rows.append({**{k: "" for k in rows[0]}, "ord": len(rows) + 1, "agency": "taroko",
                     "org_id": taroko["org_id"], "org_name": taroko["org_name"],
                     "c_id": cid, "close_msg": msg, "listed": "0"})

    for r in rows:
        r["sumday_min"], r["sumday_max"] = "", ""
        if r["agency"] == "taroko" and r["f_id"]:
            r["sumday_min"], r["sumday_max"] = sumday_range(opener, r)
    with open(OUT, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    n = sum(r["listed"] == "1" for r in rows)
    print(f"{datetime.date.today()} 自 {URL} 擷取 {n} 條＋暫停 {len(rows) - n} 條 → {OUT}")
    miss = [r["c_id"] for r in rows if r["agency"] == "taroko" and r["f_id"] and not r["sumday_min"]]
    if miss:
        print("取不到申請天數（留空）：c_id " + "、".join(miss))


if __name__ == "__main__":
    main()
