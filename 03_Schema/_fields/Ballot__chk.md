---
RecordType: "schema-field"
Table: "Ballot"
Seq: 9
資料表: "Ballot"
序號: 9
鍵值: ""
欄位名稱: "chk"
中文名稱: "發布(0不發布1發布)"
資料型別: "int"
長度: ""
預設值: ""
允許空值: true
備註: "int，0 不發布／1 發布。apply_4.aspx.cs:188 以 (chk=1, sdate=住宿日, node_id) 判斷該宿營地該日的抽籤結果是否已公告——未公告則需抽籤的宿營地不可繳費。(2026-09-11)"
外鍵指向: ""
表狀態: "現役"
真源: "[[03_Schema/Ballot|Ballot]]"
匯入來源: "01_Raw_Input/現行tableSchema.csv"
---

鍵值／資料型別／長度／預設值／允許空值 來自現行 DB 匯出，重跑產生器會以 CSV 覆寫。
中文名稱／備註／外鍵指向 在 Obsidian 的 Bases 直接改，產生器不會洗掉既有內容。
