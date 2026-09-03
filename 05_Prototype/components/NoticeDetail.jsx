/*
  詳細須知頁共用 renderer（17 張子頁共用）。
  內容來自 NoticeDetailData.jsx，本檔只負責版面；新增第 2～17 頁時只需加資料，不改本檔。

  掛載方式：頁面在 body 放 <div id="root" data-notice="a1">，由 data-notice 決定要渲染哪一頁。
*/

/* 行首若是「1.」「(1)」「（一）」「一、」等條列記號，給懸掛縮排；文字本身不動 */
const MARKER = /^(\d+\s*[.、)]|[(（][\d一二三四五六七八九十]+[)）]|[一二三四五六七八九十]+、)/;

/* 段落首行像「領隊更換原則如下：」這種短句，且後面還有行，就當子標題（僅視覺區隔，不改字） */
function isSubHeading(lines) {
  if (lines.length < 2) return false;
  const first = lines[0];
  if (first.length !== 1 || typeof first[0] !== "string") return false;
  const text = first[0];
  return text.length <= 24 && /[：:]$/.test(text);
}

function Inline({ parts }) {
  return (
    <React.Fragment>
      {parts.map((p, i) =>
        typeof p === "string" ? (
          <React.Fragment key={i}>{p}</React.Fragment>
        ) : (
          <a key={i} href={p.href} target="_blank" rel="noopener noreferrer">{p.text}</a>
        )
      )}
    </React.Fragment>
  );
}

function DetailParagraph({ node }) {
  const lines = node.lines;
  const head = isSubHeading(lines) ? lines[0] : null;
  const rest = head ? lines.slice(1) : lines;
  return (
    <div className="th-doc-block">
      {head && <h3 className="th-doc-h"><Inline parts={head} /></h3>}
      {rest.map((ln, i) => {
        const first = typeof ln[0] === "string" ? ln[0] : "";
        return (
          <p key={i} className={`th-doc-line ${MARKER.test(first) ? "is-item" : ""}`}>
            <Inline parts={ln} />
          </p>
        );
      })}
    </div>
  );
}

function DetailTable({ node }) {
  /* 置中的欄位：等級、里程與 O／X 標記，其餘靠左 */
  const centered = ["步道等級", "單程里程(往返里程)", "入園證", "入山證"];
  const columns = node.head.map((label, i) => ({
    key: `c${i}`,
    label,
    align: centered.includes(label) ? "center" : undefined,
  }));
  /* 正式站用 rowspan／colspan 合併儲存格；資料層已展開成完整矩陣，
     這裡把「續列／續欄」的位置留白，還原正式站的合併外觀。 */
  const dup = new Set((node.dup || []).map(([r, c]) => `${r},${c}`));
  const rows = node.rows.map((r, i) => {
    const o = { _k: `r${i}`, _i: i };
    r.forEach((v, j) => { o[`c${j}`] = v; });
    return o;
  });
  columns.forEach((col, j) => {
    col.render = (r) => (dup.has(`${r._i},${j}`) ? "" : r[`c${j}`]);
  });
  return (
    <DataTable
      columns={columns}
      rows={rows}
      rowKey="_k"
      className="th-table-compact th-table-grouped"
    />
  );
}

function DetailList({ node }) {
  const Tag = node.ordered ? "ol" : "ul";
  return (
    <Tag className="th-doc-list">
      {node.items.map((it, i) => (
        <li key={i}>
          {it.lines.map((ln, j) => (
            <p key={j} className="th-doc-line"><Inline parts={ln} /></p>
          ))}
          {it.extra && it.extra.map((n, j) => <DetailTable key={`t${j}`} node={n} />)}
        </li>
      ))}
    </Tag>
  );
}

function DetailBody({ body }) {
  return (
    <React.Fragment>
      {body.map((n, i) => {
        if (n.t === "table") return <DetailTable key={i} node={n} />;
        if (n.t === "list") return <DetailList key={i} node={n} />;
        if (n.t === "h") return <h3 key={i} className="th-doc-h">{n.text}</h3>;
        if (n.t === "note") return <p key={i} className="th-doc-note">{n.text}</p>;
        return <DetailParagraph key={i} node={n} />;
      })}
    </React.Fragment>
  );
}

function NoticeDetailApp({ pageId }) {
  const data = NOTICE_DETAILS[pageId];
  const navItems = data.blocks
    .map((b, i) => ({ id: `blk${i + 1}`, label: b.title }))
    .filter((n) => n.label);
  /* 只有一個區塊的頁面（如 notice_a2）不需要頁內目錄 */
  const hasNav = navItems.length > 1;

  return (
    <div>
      <Header active="notice" />

      {/* 正式站未標更新日期，這裡不填，避免捏造 */}
      <PageHead trail={["登山須知", data.title]} title={data.title} />

      <div className={`th-page ${hasNav ? "has-nav" : ""}`}>
        <div className="th-page-main">
          {data.blocks.map((b, i) => (
            <SectionCard key={i} id={`blk${i + 1}`} title={b.title || undefined}>
              <DetailBody body={b.body} />
            </SectionCard>
          ))}

          {/* 對應正式站頁尾的「返回」按鈕 */}
          <div className="th-doc-back">
            <a className="th-linkrow-back" href="notice.html">
              <i className="fa-solid fa-angle-left"></i>返回登山須知
            </a>
          </div>
        </div>

        {hasNav && <PageNav items={navItems} />}
      </div>

      <ExperienceNav />
      <Footer />
    </div>
  );
}

const rootEl = document.getElementById("root");
ReactDOM.createRoot(rootEl).render(<NoticeDetailApp pageId={rootEl.dataset.notice} />);
