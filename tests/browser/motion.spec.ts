import { test, expect, type Page } from "@playwright/test";

async function layout(page: Page) {
  return page.locator("main, main section, main h1, main h2, main blockquote, [data-motion], .site-footer").evaluateAll(elements => elements.map(element => {
    const node = element as HTMLElement;
    return [node.tagName, node.offsetTop, node.offsetLeft, node.offsetWidth, node.offsetHeight];
  }));
}

test("editorial reveals finish once, preserve geometry and release animation effects", async ({ page }, testInfo) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  for (const route of ["/", "/lookbook", "/campaign", "/about"]) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => {
      const state = window as unknown as { motionLayoutShift: number };
      state.motionLayoutShift = 0;
      if (PerformanceObserver.supportedEntryTypes.includes("layout-shift")) {
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
            if (!shift.hadRecentInput) state.motionLayoutShift += shift.value;
          }
        }).observe({ type: "layout-shift" });
      }
    });
    const before = await layout(page);
    const reveals = page.locator("[data-motion]");
    expect(await reveals.count()).toBeGreaterThan(0);
    for (const reveal of await reveals.all()) {
      await reveal.evaluate(element => element.scrollIntoView({ behavior: "instant", block: "center" }));
      await expect(reveal).toHaveAttribute("data-motion-state", "complete");
      expect(await reveal.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
      expect(await reveal.evaluate(element => getComputedStyle(element).clipPath)).toBe("none");
    }
    expect(await layout(page), `${route}: motion must not alter layout dimensions`).toEqual(before);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect(reveals.first()).toHaveAttribute("data-motion-state", "complete");
    expect(await reveals.first().evaluate(element => element.getAnimations().length)).toBe(0);
    expect(await page.evaluate(() => (window as unknown as { motionLayoutShift: number }).motionLayoutShift)).toBe(0);
    await page.screenshot({ path: testInfo.outputPath(`${route === "/" ? "home" : route.slice(1)}-settled.png`), fullPage: true });
  }
  expect(errors).toEqual([]);
});

test("reduced motion works at load and when preference changes during a reveal", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const feature = page.locator('.feature-image[data-motion="crop"]');
  await expect(feature).toHaveAttribute("data-motion-state", "idle");
  await feature.evaluate(element => element.scrollIntoView({ behavior: "instant", block: "center" }));
  await expect(feature).toHaveAttribute("data-motion-state", "revealing");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(feature).toHaveAttribute("data-motion-state", "reduced");
  expect(await feature.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  await page.reload();
  await expect(page.locator('[data-motion-state="reduced"]')).toHaveCount(await page.locator("[data-motion]").count());
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  expect(await page.locator(".menu-dialog-inner").evaluate(element => element.getAnimations().length)).toBe(0);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open navigation" })).toBeFocused();
});

test("editorial content remains visible without JavaScript or IntersectionObserver", async ({ browser, page }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "no-preference" });
  const staticPage = await context.newPage();
  await staticPage.goto("/");
  await expect(staticPage.locator("#hero-title")).toBeVisible();
  await expect(staticPage.locator(".feature-image")).toHaveCSS("clip-path", "none");
  await expect(staticPage.getByRole("link", { name: "SHOP THE COLLECTION" })).toBeVisible();
  await context.close();
  await page.addInitScript(() => { Object.defineProperty(window, "IntersectionObserver", { value: undefined, configurable: true }); });
  await page.goto("/lookbook");
  await expect(page.locator(".lookbook-cover h1")).toBeVisible();
  await expect(page.locator('[data-motion-state="complete"]')).toHaveCount(await page.locator("[data-motion]").count());
  await expect(page.locator(".spread-photo")).toHaveCSS("clip-path", "none");
});

test("responsive motion has no horizontal overflow and keeps contact and shopping accessible", async ({ page }, testInfo) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  for (const width of [375, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/lookbook"]) {
      await page.goto(route);
      await expect(page.locator("h1[data-motion]")).toHaveAttribute("data-motion-state", "complete");
      const photograph = page.locator('[data-motion="image"]').first();
      await photograph.evaluate(element => element.scrollIntoView({ behavior: "instant", block: "center" }));
      await expect(photograph).toHaveAttribute("data-motion-state", "revealing");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${route} ${width}px during image motion`).toBe(true);
      await expect(photograph).toHaveAttribute("data-motion-state", "complete");
      const contact = page.locator(".creator-contact summary");
      await contact.click();
      await expect(page.locator('[data-analytics-event="creator_email"]')).toBeVisible();
      await expect(page.locator('[data-analytics-event="creator_whatsapp"]')).toBeVisible();
      await expect(page.locator('[data-analytics-event="creator_portfolio"]')).toHaveAttribute("href", "https://alson-portfolio-nine.vercel.app/");
      expect(await contact.evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${route} ${width}px with contact open`).toBe(true);
      await page.screenshot({ path: testInfo.outputPath(`${route === "/" ? "home" : "lookbook"}-${width}-contact.png`) });
    }
  }
  expect(errors).toEqual([]);
});

test("menu and hover feedback stay immediate and keyboard navigation keeps native focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  await expect(page.locator(".menu-dialog")).toBeVisible();
  await expect(page.locator(".menu-dialog-inner")).toHaveCSS("animation-name", "menu-enter");
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: /Lookbook/ }).click();
  await expect(page).toHaveURL(/\/lookbook$/);
  await expect(page.locator(".menu-dialog")).not.toBeVisible();
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const shop = page.getByRole("link", { name: "SHOP THE COLLECTION" });
  await shop.focus();
  await expect(shop.locator(".lucide-arrow-right")).not.toHaveCSS("transform", "none");
  await shop.press("Enter");
  await expect(page).toHaveURL(/\/shop$/);
});
