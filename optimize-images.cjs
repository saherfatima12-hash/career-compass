const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const imageDir = path.join(process.cwd(), "public", "images");

// Target dimensions based on PageSpeed displayed sizes.
// We keep some extra resolution so images remain sharp on high-DPI screens.
const images = [
  {
    input: "technology.webp",
    output: "technology-final.webp",
    width: 280,
    height: 280,
  },
  {
    input: "design.webp",
    output: "design-final.webp",
    width: 420,
    height: 280,
  },
  {
    input: "bussiness.webp",
    output: "bussiness-final.webp",
    width: 280,
    height: 280,
  },
  {
    input: "meical.webp",
    output: "meical-final.webp",
    width: 280,
    height: 280,
  },
  {
    input: "engineer.webp",
    output: "engineer-final.webp",
    width: 280,
    height: 280,
  },
  {
    input: "finance.webp",
    output: "finance-final.webp",
    width: 280,
    height: 280,
  },
  {
    input: "assesment.png",
    output: "assesment-final.webp",
    width: 284,
    height: 284,
  },
  {
    input: "guidance.webp",
    output: "guidance-final.webp",
    width: 284,
    height: 208,
  },
  {
    input: "roadmap.png",
    output: "roadmap-final.webp",
    width: 332,
    height: 204,
  },
  {
    input: "logo.png",
    output: "logo-final.webp",
    width: 92,
    height: 92,
  },
];

async function optimizeImage(item) {
  const inputPath = path.join(imageDir, item.input);
  const outputPath = path.join(imageDir, item.output);

  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️ Skipped: ${item.input} not found`);
    return;
  }

  try {
    const before = fs.statSync(inputPath).size;

    await sharp(inputPath)
      .resize(item.width, item.height, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 88,
        effort: 6,
        smartSubsample: true,
      })
      .toFile(outputPath);

    const after = fs.statSync(outputPath).size;

    const saved = ((1 - after / before) * 100).toFixed(1);

    console.log(`\n✅ ${item.input} → ${item.output}`);
    console.log(
      `   ${(before / 1024).toFixed(2)} KB → ${(after / 1024).toFixed(2)} KB`
    );
    console.log(`   Saved ${saved}%`);
  } catch (error) {
    console.log(`\n❌ Error: ${item.input}`);
    console.log(error.message);
  }
}

async function main() {
  console.log("🚀 Starting image optimization...\n");

  for (const image of images) {
    await optimizeImage(image);
  }

  console.log("\n🎉 Optimization complete!");
  console.log("⚠️ Old images were NOT deleted or overwritten.");
}

main();