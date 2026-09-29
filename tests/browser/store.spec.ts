import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";

async function loadAllImages(page: import("@playwright/test").Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise(resolve => window.setTimeout(resolve, 40));
    }
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
  });
  await expect.poll(() => page.evaluate(() => [...document.images].filter(image => {
    const bounds = image.getBoundingClientRect();
    return bounds.width > 0 && bounds.height > 0 && bounds.left < window.innerWidth && bounds.right > 0 && (!image.complete || image.naturalWidth === 0);
  }).map(image => image.currentSrc || image.src)), { timeout: 15000, message: "All displayed page images load before visual capture" }).toEqual([]);
  await page.evaluate(async () => {
    await Promise.all([...document.images].filter(image => {
      const bounds = image.getBoundingClientRect();
      return bounds.width > 0 && bounds.height > 0 && bounds.left < window.innerWidth && bounds.right > 0;
    }).map(image => image.decode()));
    window.scrollTo({ top: 0, behavior: "instant" });
  });
}

test("all page types and product routes render with concept disclosure", async ({ page }) => {
  const routes = ["/", "/shop", "/lookbook", "/campaign", "/about", "/cart", "/size-guide", "/products/axis-trouser", "/products/fold-trouser", "/products/line-trouser", "/products/shell-jacket", "/products/frame-jacket", "/products/plane-shirt", "/products/base-tee", "/products/shift-vest"];
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("#main-content"), route).toBeVisible();
    await expect(page.getByText("CONCEPT PROJECT").first()).toBeVisible();
  }
  const missing = await page.goto("/products/not-a-piece");
  expect(missing?.status()).toBe(404);
  await expect(page.getByText("THIS FORM")).toBeVisible();
});

test("browsing, filters, sorting, URL restoration and empty state", async ({ page }) => {
  await page.goto("/shop");
  await expect(page.locator(".product-card")).toHaveCount(8);
  await page.locator(".desktop-filters").getByLabel("Pants").click();
  await expect(page.locator(".product-card")).toHaveCount(3);
  await page.locator(".desktop-filters").getByLabel("Chalk").click();
  await expect(page.locator(".product-card")).toHaveCount(1);
  await expect(page.getByText("Fold Trouser").first()).toBeVisible();
  await page.locator("#desktop-price-max").selectOption("100");
  await expect(page.getByText("NOTHING IN")).toBeVisible();
  const url = page.url();
  await page.reload();
  expect(page.url()).toBe(url);
  await expect(page.getByText("NOTHING IN")).toBeVisible();
  await page.getByRole("button", { name: /CLEAR FILTERS/ }).last().click();
  await expect(page.locator(".product-card")).toHaveCount(8);
  await page.locator("#shop-sort").selectOption("price-asc");
  await expect(page.locator(".product-card h2").first()).toHaveText("Base Tee");
  await page.goBack();
  await expect(page.locator(".product-card h2").first()).toHaveText("Axis Trouser");
  await page.goForward();
  await expect(page.locator(".product-card h2").first()).toHaveText("Base Tee");
  await page.locator("#shop-sort").selectOption("price-desc");
  await expect(page.locator(".product-card h2").first()).toHaveText("Frame Jacket");
});

test("size selection and cart quantities persist; checkout stays a demo", async ({ page }) => {
  await page.goto("/products/axis-trouser");
  await page.locator(".purchase-panel .add-button").click();
  await expect(page.getByText("Select a size to add this piece.")).toBeVisible();
  await expect(page.locator(".size-options button", { hasText: "XS" })).toBeDisabled();
  await page.locator(".size-options button", { hasText: /^M$/ }).click();
  await page.locator(".purchase-panel .add-button").click();
  await expect(page.getByText("Axis Trouser / M added to bag.")).toBeVisible();
  await page.locator(".purchase-panel .add-button").click();
  await expect(page.locator(".header-cart")).toContainText("(2)");
  await page.locator(".size-options button", { hasText: /^L$/ }).click();
  await page.locator(".purchase-panel .add-button").click();
  await expect(page.locator(".header-cart")).toContainText("(3)");
  await page.locator(".header-cart").click();
  await expect(page.locator(".cart-line")).toHaveCount(2);
  await expect(page.locator(".cart-summary strong")).toHaveText("$444");
  await page.reload();
  await expect(page.locator(".cart-line")).toHaveCount(2);
  await page.getByRole("button", { name: "Increase quantity of Axis Trouser size M" }).click();
  await expect(page.locator(".cart-summary strong")).toHaveText("$592");
  await page.getByRole("button", { name: "CHECKOUT DEMO" }).click();
  await expect(page.getByRole("dialog", { name: /A STUDY IN/ })).toContainText("no payment information is collected");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: /A STUDY IN/ })).not.toBeVisible();
  await page.getByRole("button", { name: "Remove Axis Trouser size M" }).click();
  await expect(page.locator(".cart-line")).toHaveCount(1);
  await page.getByRole("button", { name: "Remove Axis Trouser size L" }).click();
  await expect(page.getByText("YOUR BAG IS")).toBeVisible();
});

test("mobile navigation and filters are keyboard operable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: /Shop/ }).click();
  const filter = page.getByRole("button", { name: /FILTERS/ });
  await filter.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Pants").check();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(filter).toBeFocused();
  await expect(page.locator(".product-card")).toHaveCount(3);
});

test("keyboard shopping path, gallery, size guide, and local-only newsletter", async ({ page }) => {
  await page.goto("/shop");
  await page.locator(".product-card-link").first().focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/products\/axis-trouser$/);
  await page.getByRole("button", { name: "Show back view" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".gallery-caption")).toContainText("BACK VIEW");
  await page.locator(".size-options button", { hasText: /^M$/ }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".size-options button", { hasText: /^M$/ })).toHaveAttribute("aria-pressed", "true");
  await page.locator(".purchase-panel .add-button").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".header-cart")).toContainText("(1)");
  await page.locator(".header-cart").focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/cart$/);
  await page.getByRole("button", { name: "Increase quantity of Axis Trouser size M" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".cart-summary strong")).toHaveText("$296");
  await page.getByRole("button", { name: "CHECKOUT DEMO" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: /A STUDY IN/ })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "CHECKOUT DEMO" })).toBeFocused();
  await page.goto("/size-guide");
  await page.getByRole("button", { name: "IN", exact: true }).click();
  await expect(page.locator(".chart-section").first()).toContainText("28.3");
  await page.locator("#newsletter-email").fill("invalid");
  await page.getByRole("button", { name: "Try newsletter demo" }).click();
  await expect(page.locator("#newsletter-email")).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByRole("status")).toHaveText("Enter a valid email address.");
  await page.locator("#newsletter-email").fill("concept@example.com");
  await page.getByRole("button", { name: "Try newsletter demo" }).click();
  await expect(page.getByRole("status")).toHaveText("Concept demo only — no address was saved or subscribed.");
});

test("mobile gallery scroll, reduced motion and sticky purchase state", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/products/axis-trouser");
  const rail = page.locator(".gallery-rail");
  await expect(rail).toHaveCSS("overflow-x", "auto");
  await rail.evaluate(element => element.scrollTo({ left: element.clientWidth, behavior: "instant" }));
  await expect(page.locator(".gallery-caption")).toContainText("BACK VIEW");
  await rail.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".gallery-caption")).toContainText("CONSTRUCTION DETAIL");
  await page.getByRole("button", { name: "Show on model" }).click();
  await expect(page.locator(".gallery-caption")).toContainText("ON MODEL");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  await page.locator(".mobile-buy-bar button").click();
  await expect(page.locator(".size-options button", { hasText: /^S$/ })).toBeFocused();
  await page.locator(".size-options button", { hasText: /^M$/ }).click();
  await expect(page.locator(".mobile-buy-bar")).toContainText("Axis Trouser / M");
  await page.locator(".mobile-buy-bar button").click();
  await expect(page.locator(".header-cart")).toContainText("(1)");
  await page.locator(".header-cart").click();
  await expect(page.locator(".cart-line")).toHaveCount(1);
  await page.getByRole("button", { name: "Increase quantity of Axis Trouser size M" }).click();
  await expect(page.locator(".cart-summary strong")).toHaveText("$296");
  await mkdir("artifacts/responsive", { recursive: true });
  for (const width of [375, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Populated bag at ${width}px`).toBe(true);
    await loadAllImages(page);
    await page.screenshot({ path: `artifacts/responsive/cart-filled-${width}.png`, fullPage: true });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("all internal editorial links resolve and storage can be unavailable", async ({ page, request }) => {
  const links = new Set<string>();
  for (const route of ["/", "/shop", "/lookbook", "/campaign", "/about", "/size-guide"]) {
    await page.goto(route);
    for (const href of await page.locator('a[href^="/"]').evaluateAll(elements => elements.map(element => element.getAttribute("href")!))) links.add(href);
  }
  for (const href of links) expect((await request.get(href)).status(), href).toBe(200);
  await page.goto("/lookbook");
  await page.getByRole("link", { name: "DISCOVER THE COLLECTION" }).click();
  await expect(page).toHaveURL(/\/shop$/);
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException("Unavailable", "SecurityError"); };
    Storage.prototype.setItem = () => { throw new DOMException("Unavailable", "SecurityError"); };
  });
  await page.goto("/products/fold-trouser");
  await page.locator(".size-options button", { hasText: /^M$/ }).click();
  await page.locator(".add-button").click();
  await page.locator(".header-cart").click();
  await expect(page.locator(".cart-line")).toHaveCount(1);
});

test("malformed stored cart recovers without blocking the shop", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("form27-cart-v1", "{bad JSON"));
  await page.goto("/cart");
  await expect(page.getByText("YOUR BAG IS")).toBeVisible();
  await expect(page.locator(".header-cart")).toContainText("(0)");
});

test("core pages have no automated accessibility violations at mobile width", async ({ page }) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/", "/shop", "/products/axis-trouser", "/lookbook", "/campaign", "/about", "/cart", "/size-guide"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const audit = await new AxeBuilder({ page }).analyze();
    expect(audit.violations.map(violation => `${violation.id}: ${violation.nodes.map(node => node.target.join(",")).join(";")}`), route).toEqual([]);
  }
});

test("responsive layouts, screenshots and automated accessibility", async ({ page }) => {
  test.setTimeout(180000);
  await mkdir("artifacts/screenshots", { recursive: true });
  const widths = [375, 390, 430, 768, 1024, 1440];
  const layouts: { route: string; width: number; scrollWidth: number }[] = [];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/shop", "/products/axis-trouser", "/lookbook", "/campaign", "/about", "/cart", "/size-guide"]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.locator("#main-content").waitFor();
      await loadAllImages(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      expect(overflow, `${route} at ${width}px has horizontal overflow`).toBe(false);
      layouts.push({ route, width, scrollWidth: await page.evaluate(() => document.documentElement.scrollWidth) });
      await mkdir("artifacts/responsive", { recursive: true });
      await page.screenshot({ path: `artifacts/responsive/${route === "/" ? "home" : route.replaceAll("/", "-").slice(1)}-${width}.png`, fullPage: true });
    }
  }
  await writeFile("artifacts/responsive/results.json", JSON.stringify(layouts, null, 2));
  for (const [route, name, width] of [["/", "fashion-hero", 1440], ["/shop", "collection", 1440], ["/products/axis-trouser", "product-detail", 1440], ["/lookbook", "lookbook", 1440], ["/shop", "mobile-shop", 390]] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await loadAllImages(page);
    const broken = await page.evaluate(() => [...document.images].filter(image => {
      const bounds = image.getBoundingClientRect();
      return bounds.width > 0 && bounds.height > 0 && bounds.left < window.innerWidth && bounds.right > 0 && (!image.complete || image.naturalWidth === 0);
    }).map(image => image.currentSrc || image.src));
    expect(broken, `broken images on ${route}`).toEqual([]);
    await page.screenshot({ path: `artifacts/screenshots/${name}.png`, fullPage: name !== "fashion-hero" });
  }
  await page.goto("/shop");
  const audit = await new AxeBuilder({ page }).analyze();
  expect(audit.violations.map(violation => `${violation.id}: ${violation.nodes.length} nodes`)).toEqual([]);
});
