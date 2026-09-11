---
RecordType: "schema-field"
Table: "Blacklist"
Seq: 1
資料表: "Blacklist"
序號: 1
鍵值: "PK"
欄位名稱: "sid"
中文名稱: "身份證號/護照號碼"
資料型別: "nvarchar"
長度: "50"
預設值: ""
允許空值: false
備註: ""
外鍵指向: ""
表狀態: "現役"
真源: "[[03_Schema/Blacklist|Blacklist]]"
匯入來源: "01_Raw_Input/現行tableSchema.csv"
---

鍵值／資料型別／長度／預設值／允許空值 來自現行 DB 匯出，重跑產生器會以 CSV 覆寫。
中文名稱／備註／外鍵指向 在 Obsidian 的 Bases 直接改，產生器不會洗掉既有內容。
