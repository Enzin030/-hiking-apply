const pptxgen = require("pptxgenjs");
const path = require("path");
// html2pptx is located at the agent skills directory
const html2pptx = require("c:/Users/enzin.GIS/.gemini/antigravity/skills/skills/pptx/scripts/html2pptx.js");

async function createPresentation() {
  console.log("初始化 PPTX 生成程序...");
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "AI Consultant";
  pptx.title = "115 登山一站式改版 - UI/UX 提案";

  const slides = [
    "slide1.html",
    "slide2.html",
    "slide3.html",
    "slide4.html",
    "slide5.html",
  ];

  for (let i = 0; i < slides.length; i++) {
    console.log(`處理第 ${i + 1} 頁簡報: ${slides[i]}...`);
    const slidePath = path.join(__dirname, slides[i]);
    await html2pptx(slidePath, pptx);
  }

  const outputPath = path.join(__dirname, "115_登山一站式_UIUX提案.pptx");
  await pptx.writeFile({ fileName: outputPath });
  console.log(`簡報檔已成功產出並存至：${outputPath}`);
}

createPresentation().catch((err) => {
  console.error("生成簡報時發生錯誤：", err);
  process.exit(1);
});
