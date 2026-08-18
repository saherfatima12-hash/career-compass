const sharp = require("sharp");
const path = require("path");

const images = [
  {
    input: "finance.png",
    output: "finance.webp",
  },
  {
    input: "engineer.png",
    output: "engineer.webp",
  },
];

const imagesFolder = path.join(__dirname, "public", "images");

async function convertImages() {
  for (const image of images) {
    const inputPath = path.join(imagesFolder, image.input);
    const outputPath = path.join(imagesFolder, image.output);

    try {
      await sharp(inputPath)
        .resize({
          width: 300,
          height: 300,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({
          quality: 80,
        })
        .toFile(outputPath);

      const fs = require("fs");
      const stats = fs.statSync(outputPath);
      const sizeKB = (stats.size / 1024).toFixed(2);

      console.log(
        `✅ ${image.input} → ${image.output} | ${sizeKB} KB`
      );
    } catch (error) {
      console.error(`❌ Failed: ${image.input}`);
      console.error(error.message);
    }
  }
}

convertImages();