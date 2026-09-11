---
RecordType: "schema-field"
Table: "tb_roadbook"
Seq: 7
資料表: "tb_roadbook"
序號: 7
鍵值: ""
欄位名稱: "roadbook_chk"
中文名稱: "審核狀態(0未審核1審核通過2取消3退件4抽籤)"
資料型別: "int"
長度: ""
預設值: "`((0))`"
允許空值: true
備註: ""
外鍵指向: ""
表狀態: "現役"
真源: "[[03_Schema/tb_roadbook|tb_roadbook]]"
匯入來源: "01_Raw_Input/現行tableSchema.csv"
---

鍵值／資料型別／長度／預設值／允許空值 來自現行 DB 匯出，重跑產生器會以 CSV 覆寫。
中文名稱／備註／外鍵指向 在 Obsidian 的 Bases 直接改，產生器不會洗掉既有內容。
