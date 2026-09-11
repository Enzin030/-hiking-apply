---
RecordType: "schema-field"
Table: "applyrefund"
Seq: 4
資料表: "applyrefund"
序號: 4
鍵值: ""
欄位名稱: "af_chkpassword"
中文名稱: "驗證密碼"
資料型別: "nvarchar"
長度: "20"
預設值: ""
允許空值: true
備註: "實測 2026-09-11：3,050 筆退費帳號全部都有值，且為明碼。apply_5.aspx（線上申請退費(排雲)）的第三個輸入欄就是本欄。"
外鍵指向: ""
表狀態: "現役"
真源: "[[03_Schema/applyrefund|applyrefund]]"
匯入來源: "01_Raw_Input/現行tableSchema.csv"
---

鍵值／資料型別／長度／預設值／允許空值 來自現行 DB 匯出，重跑產生器會以 CSV 覆寫。
中文名稱／備註／外鍵指向 在 Obsidian 的 Bases 直接改，產生器不會洗掉既有內容。
