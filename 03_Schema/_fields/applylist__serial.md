---
RecordType: "schema-field"
Table: "applylist"
Seq: 2
資料表: "applylist"
序號: 2
鍵值: ""
欄位名稱: "serial"
中文名稱: "隊伍識別碼"
資料型別: "nvarchar"
長度: "50"
預設值: ""
允許空值: true
備註: "實測 2026-09-11：1,506,465／1,506,468 筆有值（99.9998%）。出園回報頁 apply_6.aspx 的「(一站式/入園)申請編號」填的就是本欄——該標籤是給使用者的說法，DB 端只有這一欄在用。無唯一約束。"
外鍵指向: ""
表狀態: "現役"
真源: "[[03_Schema/applylist|applylist]]"
匯入來源: "01_Raw_Input/現行tableSchema.csv"
---

鍵值／資料型別／長度／預設值／允許空值 來自現行 DB 匯出，重跑產生器會以 CSV 覆寫。
中文名稱／備註／外鍵指向 在 Obsidian 的 Bases 直接改，產生器不會洗掉既有內容。
