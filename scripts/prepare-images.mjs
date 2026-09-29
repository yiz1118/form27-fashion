import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "assets", "source-sheets");
const destination = path.join(root, "public", "images", "products");
const fourColumns = new Set(["axis-trouser", "fold-trouser", "line-trouser"]);
const names = ["axis-trouser", "fold-trouser", "line-trouser", "shell-jacket", "frame-jacket", "plane-shirt", "base-tee", "shift-vest"];

function panels(name) {
  if (fourColumns.has(name)) return {
    front: { left: 0, top: 0, width: 380, height: 1024 },
    back: { left: 386, top: 0, width: 380, height: 1024 },
    detail: { left: 772, top: 0, width: 376, height: 503 },
    fabric: { left: 772, top: 510, width: 376, height: 514 },
    worn: { left: 1156, top: 0, width: 380, height: 1024 },
  };
  return {
    front: { left: 3, top: 3, width: 488, height: 492 },
    back: { left: 535, top: 3, width: 466, height: 492 },
    detail: { left: 3, top: 520, width: 488, height: 501 },
    fabric: { left: 535, top: 520, width: 466, height: 501 },
    worn: { left: 1050, top: 0, width: 486, height: 1024 },
  };
}

await mkdir(destination, { recursive: true });
for (const name of names) {
  const input = path.join(source, `${name}.png`);
  const metadata = await sharp(input).metadata();
  if (metadata.width !== 1536 || metadata.height !== 1024) throw new Error(`Unexpected sheet dimensions: ${name}`);
  for (const [view, rectangle] of Object.entries(panels(name))) {
    await sharp(input).extract(rectangle).webp({ quality: 88, effort: 6 }).toFile(path.join(destination, `${name}-${view}.webp`));
  }
  console.log(`${name}: five views extracted`);
}
