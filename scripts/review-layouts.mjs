import { mkdir, readdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const pages = ["home", "shop", "products-axis-trouser", "lookbook", "campaign", "about", "cart", "size-guide"];
await mkdir("artifacts/visual-review", { recursive: true });
for (const width of [375, 390, 430, 768, 1024, 1440]) {
  const cellHeight = Math.ceil(900 * 360 / width) + 32;
  const layers = [];
  for (const [index, name] of pages.entries()) {
    const input = `artifacts/responsive/${name}-${width}.png`;
    const label = Buffer.from(`<svg width="360" height="30"><rect width="360" height="30" fill="#d7f247"/><text x="10" y="20" font-family="Arial" font-size="14">${name} / ${width}px</text></svg>`);
    const view = await sharp(input).extract({ left: 0, top: 0, width, height: 900 }).resize({ width: 360 }).toBuffer();
    layers.push({ input: label, left: (index % 4) * 370, top: Math.floor(index / 4) * cellHeight });
    layers.push({ input: view, left: (index % 4) * 370, top: Math.floor(index / 4) * cellHeight + 30 });
  }
  await sharp({ create: { width: 1470, height: cellHeight * 2, channels: 3, background: "#c8c8c1" } }).composite(layers).png().toFile(`artifacts/visual-review/viewport-${width}.png`);
}
const assets = [];
for (const file of await readdir("public/images/products")) {
  const metadata = await sharp(`public/images/products/${file}`).metadata();
  await sharp(`public/images/products/${file}`).raw().toBuffer();
  assets.push({ file, width: metadata.width, height: metadata.height, format: metadata.format });
}
await writeFile("artifacts/visual-review/product-assets.json", JSON.stringify(assets, null, 2));
console.log(`Prepared six viewport review sheets and decoded ${assets.length} product assets.`);
