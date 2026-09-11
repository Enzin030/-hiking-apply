---
RecordType: "schema-field"
Table: "campmanagefees"
Seq: 13
資料表: "campmanagefees"
序號: 13
鍵值: ""
欄位名稱: "status"
中文名稱: "繳費狀態(1：已繳費；0：未繳費)"
資料型別: "int"
長度: ""
預設值: ""
允許空值: true
備註: "實測值域（2026-09-11）：-1／0／1／2，但欄位中文名只定義 1 已繳費／0 未繳費。-1（41 筆）與 2（14 筆）無來源 [待確認]。未繳費合計 246 筆，其中 paytype=4 有 234 筆。"
外鍵指向: ""
表狀態: "現役"
真源: "[[03_Schema/campmanagefees|campmanagefees]]"
匯入來源: "01_Raw_Input/現行tableSchema.csv"
---

鍵值／資料型別／長度／預設值／允許空值 來自現行 DB 匯出，重跑產生器會以 CSV 覆寫。
中文名稱／備註／外鍵指向 在 Obsidian 的 Bases 直接改，產生器不會洗掉既有內容。
