---
RecordType: "schema-field"
Table: "campmanagefees"
Seq: 6
資料表: "campmanagefees"
序號: 6
鍵值: ""
欄位名稱: "paytype"
中文名稱: "收費方式(郵政匯票：1；金融機構轉帳：2；現金（新臺幣）：3；4：線上繳費)"
資料型別: "nvarchar"
長度: "2"
預設值: ""
允許空值: true
備註: "實測值域（2026-09-11）：1~8，但欄位中文名只定義了 1~4（郵政匯票／金融機構轉帳／現金／線上繳費），5・6・7・8 無來源 [待確認]。筆數：2→24,395、4→15,221、5→990、1→705、6→580、7→326、3→201、8→2。"
外鍵指向: ""
表狀態: "現役"
真源: "[[03_Schema/campmanagefees|campmanagefees]]"
匯入來源: "01_Raw_Input/現行tableSchema.csv"
---

鍵值／資料型別／長度／預設值／允許空值 來自現行 DB 匯出，重跑產生器會以 CSV 覆寫。
中文名稱／備註／外鍵指向 在 Obsidian 的 Bases 直接改，產生器不會洗掉既有內容。
