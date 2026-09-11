---
RecordType: "schema-field"
Table: "applylist"
Seq: 134
資料表: "applylist"
序號: 134
鍵值: ""
欄位名稱: "actin"
中文名稱: "入園"
資料型別: "int"
長度: ""
預設值: ""
允許空值: true
備註: "實測值域（2026-09-11）：NULL／0／1。1 = 已入園（10,099 筆）、0 僅 8 筆。注意有 14,433 筆 actout=2 但本欄為 NULL，故入園註記不是出園回報的前提。"
外鍵指向: ""
表狀態: "現役"
真源: "[[03_Schema/applylist|applylist]]"
匯入來源: "01_Raw_Input/現行tableSchema.csv"
---

鍵值／資料型別／長度／預設值／允許空值 來自現行 DB 匯出，重跑產生器會以 CSV 覆寫。
中文名稱／備註／外鍵指向 在 Obsidian 的 Bases 直接改，產生器不會洗掉既有內容。
