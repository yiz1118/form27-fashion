import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const phase = process.argv[2] || "after";
const baseURL = process.argv[3] || "http://localhost:3106";
const directory = `artifacts/icon-review/${phase}`;
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const metrics = [];
const routes = ["/", "/shop", "/products/axis-trouser", "/lookbook", "/campaign", "/about", "/cart", "/size-guide"];
for (const width of [375, 390, 430, 768, 1024, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  for (const route of routes) {
    await page.goto(`${baseURL}${route}`);
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (let y = 0; y < document.documentElement.scrollHeight; y += 650) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise(resolve => setTimeout(resolve, 40));
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.waitForFunction(() => [...document.images].every(image => {
      const bounds = image.getBoundingClientRect();
      return !bounds.width || !bounds.height || bounds.left >= innerWidth || bounds.right <= 0 || (image.complete && image.naturalWidth > 0);
    }));
    const layout = await page.evaluate(() => {
      const selectors = "header,.site-header,.concept-strip,main>section,main>div,main h1,main h2,.site-footer,.footer-news,.footer-bottom,.hero-cta,.black-button,.outline-button,.newsletter-row,.newsletter-row button,.mobile-buy-bar,.menu-trigger,.shop-toolbar,#shop-sort,.filter-price select,.product-accordions summary,.gallery-main,.gallery-thumbs,.purchase-panel";
      return [...document.querySelectorAll(selectors)].map(element => {
        const bounds = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return { tag: element.tagName, className: element.className, x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height, font: style.font, color: style.color, background: style.backgroundColor, padding: style.padding, margin: style.margin, border: style.borderWidth };
      });
    });
    metrics.push({ route, width, layout });
    const name = route === "/" ? "home" : route.replaceAll("/", "-").slice(1);
    await page.screenshot({ path: `${directory}/${name}-${width}.png`, fullPage: true });
  }
}
await browser.close();
await writeFile(`${directory}/metrics.json`, JSON.stringify(metrics, null, 2));
if (phase === "after") {
  const before = JSON.parse(await readFile("artifacts/icon-review/before/metrics.json", "utf8"));
  const differences = [];
  for (const [index, current] of metrics.entries()) {
    for (const [elementIndex, currentElement] of current.layout.entries()) {
      const previous = before[index].layout[elementIndex];
      for (const property of ["x", "y", "width", "height", "font", "color", "background", "padding", "margin", "border"]) {
        if (!previous) { differences.push({ route: current.route, width: current.width, element: currentElement.className, property: "added" }); break; }
        const changed = typeof currentElement[property] === "number" ? Math.abs(currentElement[property] - previous[property]) > 0.5 : currentElement[property] !== previous[property];
        if (changed) differences.push({ route: current.route, width: current.width, element: currentElement.className || currentElement.tag, property, before: previous[property], after: currentElement[property] });
      }
    }
  }
  await writeFile("artifacts/icon-review/layout-differences.json", JSON.stringify(differences, null, 2));
  console.log(JSON.stringify({ captures: metrics.length, differences }, null, 2));
} else console.log(`Saved ${metrics.length} baseline screenshots and layout measurements.`);
