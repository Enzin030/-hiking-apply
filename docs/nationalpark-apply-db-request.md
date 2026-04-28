# Nationalpark 申請改版 DB 資料提供清單

## 必給資料

### 1. 管理機關

```sql
SELECT id, name, shortname, order_no
FROM EIP_Core_Organization
WHERE id IN (
  'C951CDCD-B75A-46B9-8002-8EF952EC95FD',
  'E6DD4652-2D37-4346-8F5D-6E538353E0C2',
  '105E956F-D8DA-49F7-A9B7-3AEFDDA88A12'
)
ORDER BY order_no;
```

### 2. 國家公園同意書

```sql
SELECT id, OrgID, name, name_en, name_jp, chk, selectchk, ord
FROM attention
WHERE OrgID IN (
  'C951CDCD-B75A-46B9-8002-8EF952EC95FD',
  'E6DD4652-2D37-4346-8F5D-6E538353E0C2',
  '105E956F-D8DA-49F7-A9B7-3AEFDDA88A12'
)
  AND chk = '1'
  AND name IS NOT NULL
ORDER BY OrgID, ord;
```

### 3. 主路線

```sql
SELECT f_id, OrgID, name, name_en, name_jp, source_guid, chk, pjtype, ord,
       file01, file02, file03, file04, file05, file06
FROM Fixedclimbmain
WHERE OrgID IN (
  'C951CDCD-B75A-46B9-8002-8EF952EC95FD',
  'E6DD4652-2D37-4346-8F5D-6E538353E0C2',
  '105E956F-D8DA-49F7-A9B7-3AEFDDA88A12'
)
  AND chk IN (1, 2)
ORDER BY OrgID, ord;
```

### 4. 次路線

```sql
SELECT c_id, f_id, OrgID, name, name_en, name_jp, source_guid,
       chk, pjtype, ord, sumdaymin, sumdaymax, isforeign,
       linetype, peopleset, TeamApplyMaxCntSnowlong,
       is_hiking_safety, file01, file04, linetxtch, note, note_en, note_jp
FROM Fixedclimb
WHERE OrgID IN (
  'C951CDCD-B75A-46B9-8002-8EF952EC95FD',
  'E6DD4652-2D37-4346-8F5D-6E538353E0C2',
  '105E956F-D8DA-49F7-A9B7-3AEFDDA88A12'
)
  AND chk IN (1, 2)
  AND pjtype IN (0, 1)
ORDER BY OrgID, f_id, ord;
```

### 5. 關聯申請

```sql
SELECT *
FROM Fixedclimb_relation
WHERE from_c_id IN (
  SELECT c_id
  FROM Fixedclimb
  WHERE OrgID IN (
    'C951CDCD-B75A-46B9-8002-8EF952EC95FD',
    'E6DD4652-2D37-4346-8F5D-6E538353E0C2',
    '105E956F-D8DA-49F7-A9B7-3AEFDDA88A12'
  )
);
```

## 建議加給資料

### 6. 路線節點

```sql
SELECT node_id, OrgID, name, type, chk, pjtype, ord
FROM node
WHERE OrgID IN (
  'C951CDCD-B75A-46B9-8002-8EF952EC95FD',
  'E6DD4652-2D37-4346-8F5D-6E538353E0C2',
  '105E956F-D8DA-49F7-A9B7-3AEFDDA88A12'
)
ORDER BY OrgID, ord;
```

```sql
SELECT *
FROM node_arrive
WHERE c_id IN (
  SELECT c_id
  FROM Fixedclimb
  WHERE OrgID IN (
    'C951CDCD-B75A-46B9-8002-8EF952EC95FD',
    'E6DD4652-2D37-4346-8F5D-6E538353E0C2',
    '105E956F-D8DA-49F7-A9B7-3AEFDDA88A12'
  )
);
```

```sql
SELECT *
FROM node_closedate
WHERE node_id IN (
  SELECT node_id
  FROM node
  WHERE OrgID IN (
    'C951CDCD-B75A-46B9-8002-8EF952EC95FD',
    'E6DD4652-2D37-4346-8F5D-6E538353E0C2',
    '105E956F-D8DA-49F7-A9B7-3AEFDDA88A12'
  )
);
```

### 7. 附件規則

```sql
SELECT *
FROM applylist_files
WHERE c_id IN (
  SELECT c_id
  FROM Fixedclimb
  WHERE OrgID IN (
    'C951CDCD-B75A-46B9-8002-8EF952EC95FD',
    'E6DD4652-2D37-4346-8F5D-6E538353E0C2',
    '105E956F-D8DA-49F7-A9B7-3AEFDDA88A12'
  )
)
ORDER BY c_id, filetype, lang;
```

### 8. 規則設定

```sql
SELECT *
FROM RuleSet
WHERE OrgID IN (
  'C951CDCD-B75A-46B9-8002-8EF952EC95FD',
  'E6DD4652-2D37-4346-8F5D-6E538353E0C2',
  '105E956F-D8DA-49F7-A9B7-3AEFDDA88A12'
);
```

## 交付格式

可接受任一格式：

1. CSV：一張表一個檔案。
2. JSON：一張表一個檔案。
3. SQL dump：只含上述查詢結果。
4. Excel：每張表一個 sheet。

建議檔案命名：

```text
db-export/
  EIP_Core_Organization.csv
  attention.csv
  Fixedclimbmain.csv
  Fixedclimb.csv
  Fixedclimb_relation.csv
  node.csv
  node_arrive.csv
  node_closedate.csv
  applylist_files.csv
  RuleSet.csv
```
