import { readFile, writeFile, mkdir } from "node:fs/promises";
const files = ["app/page.tsx", "app/about/page.tsx", "app/campaign/page.tsx", "app/lookbook/page.tsx", "app/size-guide/page.tsx", "app/not-found.tsx", "components/CartPage.tsx", "components/ProductExperience.tsx", "components/ProductCard.tsx", "components/SiteHeader.tsx", "components/ShopClient.tsx", "components/Newsletter.tsx"];
const inline = '<UiIcon icon={ArrowUpRight} size="0.84em" className="ui-icon-inline" />';
const changes = [];
for (const file of files) {
  const original = await readFile(file, "utf8");
  await mkdir(`artifacts/icon-review/before/source/${file.slice(0, file.lastIndexOf("/"))}`, { recursive: true });
  await writeFile(`artifacts/icon-review/before/source/${file}`, original);
  let source = original.replace(/<(ArrowRight|ArrowDown|ArrowLeft|Menu|X|Plus|Minus|SlidersHorizontal)\b([^>]*?)\/>/g, '<UiIcon icon={$1}$2/>');
  if (file === "components/SiteHeader.tsx") source = source.replaceAll("<span>↗</span>", '<span><UiIcon icon={ArrowUpRight} size={11} className="ui-icon-inline" /></span>');
  if (file === "components/Newsletter.tsx") source = source.replace('aria-label="Try newsletter demo">↗</button>', 'aria-label="Try newsletter demo"><UiIcon icon={ArrowUpRight} size={27} /></button>');
  if (file === "components/ProductExperience.tsx") {
    source = source.replaceAll("<span>+</span>", '<span><UiIcon icon={Plus} size={11} /></span>');
    source = source.replace('{size ? "ADD TO BAG ↗" : "CHOOSE SIZE ↗"}', `{size ? "ADD TO BAG" : "CHOOSE SIZE"} ${inline}`);
  }
  for (const label of ["RETURN TO BAG", "BACK TO THE COLLECTION", "CLEAR ALL FILTERS", "CLEAR FILTERS", "VIEW {shown.length} PIECES"]) source = source.replace(`${label} ↗`, `<span>${label} ${inline}</span>`);
  source = source.replaceAll("↗", inline);
  if (source.includes("icon={ArrowUpRight}")) {
    if (/import \{([^}]+)\} from "lucide-react";/.test(source)) source = source.replace(/import \{([^}]+)\} from "lucide-react";/, (_, icons) => `import { ${icons.trim()}, ArrowUpRight${file === "components/ShopClient.tsx" ? ", ChevronDown" : ""} } from "lucide-react";`);
    else source = `import { ArrowUpRight } from "lucide-react";\n${source}`;
  }
  const importLine = 'import { UiIcon } from "@/components/UiIcon";\n';
  source = source.startsWith('"use client";') ? source.replace('"use client";', `"use client";\n${importLine}`) : importLine + source;
  if (file === "components/ShopClient.tsx") {
    source = source.replace('<select id={`${prefix}-price-max`}', '<span className="select-control"><select id={`${prefix}-price-max`}');
    source = source.replace('<option value="250">Under $250</option></select>', '<option value="250">Under $250</option></select><UiIcon icon={ChevronDown} size={14} /></span>');
    source = source.replace('<select id="shop-sort"', '<span className="select-control"><select id="shop-sort"');
    source = source.replace('<option value="price-desc">Price: high to low</option></select>', '<option value="price-desc">Price: high to low</option></select><UiIcon icon={ChevronDown} size={14} /></span>');
  }
  await writeFile(file, source);
  changes.push({ file, changed: source !== original });
}
await writeFile("artifacts/icon-review/before/source/globals.css", await readFile("app/globals.css", "utf8"));
await writeFile("artifacts/icon-review/changed-files.json", JSON.stringify(changes, null, 2));
console.log(changes);
