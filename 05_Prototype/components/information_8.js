/* ============================================================
   information_8.js — 雙語詞彙資料與初始化
   對應規格：02_Spec/29_雙語詞彙.md（舊系統 information_8.aspx）
   ============================================================ */

const BILINGUAL_COLUMNS = [
  { key: "unit", label: "發布單位" },
  { key: "link", label: "網站連結" },
];

const BILINGUAL_ROWS = [
  {
    id: "nps",
    unit: "國家公園署",
    title: "國家公園署-雙語詞彙",
    url: "https://www.nps.gov.tw/ch/sglarticle/bilingualglossary",
  },
  {
    id: "ysnp",
    unit: "玉管處",
    title: "玉管處-雙語詞彙",
    url: "https://www.ysnp.gov.tw/BilingualVocabulary/C008000",
  },
  {
    id: "taroko",
    unit: "太管處",
    title: "太管處-雙語詞彙",
    url: "https://www.taroko.gov.tw/News.aspx?n=5552&sms=10334",
  },
  {
    id: "spnp",
    unit: "雪管處",
    title: "雪管處-雙語詞彙",
    url: "https://www.spnp.gov.tw/cp.aspx?n=14548",
  },
  {
    id: "forest",
    unit: "林業及自然保育署",
    title: "林業及自然保育署-雙語詞彙",
    url: "https://www.forest.gov.tw/bilingual",
  },
];

thPage({
  data() {
    return {
      columns: BILINGUAL_COLUMNS,
      rows: BILINGUAL_ROWS,
    };
  },
});
