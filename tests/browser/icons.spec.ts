import { test, expect } from "@playwright/test";

test("action icons use monochrome SVGs instead of font glyphs", async ({ page }, testInfo) => {
  test.setTimeout(90000);
  await page.goto("/");
  const newsletter = page.getByRole("button", { name: "Try newsletter demo" });
  await expect(newsletter.locator("svg")).toBeVisible();
  await expect(newsletter.locator("svg")).toHaveAttribute("aria-hidden", "true");
  if (!testInfo.project.use.hasTouch) {
    const heroAction = page.getByRole("link", { name: "SHOP THE COLLECTION" });
    const defaultBackground = await heroAction.evaluate(element => getComputedStyle(element).backgroundColor);
    await heroAction.hover();
    await expect(heroAction).not.toHaveCSS("background-color", defaultBackground);
    expect(await heroAction.locator("svg").evaluate(element => getComputedStyle(element).stroke)).toBe(await heroAction.evaluate(element => getComputedStyle(element).color));
  }
  await page.setViewportSize({ width: 390, height: 844 });
  const menuButton = page.getByRole("button", { name: "Open navigation" });
  const menuTarget = await menuButton.boundingBox();
  expect(menuTarget?.width).toBeGreaterThanOrEqual(44);
  expect(menuTarget?.height).toBeGreaterThanOrEqual(44);
  if (testInfo.project.use.hasTouch) await menuButton.tap();
  else await menuButton.click();
  const navigation = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(navigation.locator("svg")).toHaveCount(5);
  if (testInfo.project.use.hasTouch) await page.getByRole("button", { name: "Close navigation" }).tap();
  else await page.keyboard.press("Escape");
  for (const width of [375, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/shop", "/products/axis-trouser", "/lookbook", "/campaign", "/about", "/cart", "/size-guide", "/missing"]) {
    await page.goto(route);
    const iconGlyphs = await page.locator("a,button,summary").evaluateAll(elements => elements.filter(element => /[\u2197\u2192\u27a1\u2190\u2b05\u2193\u2b07\u2191\u2212\u00d7\u2715\u2716\u2630\u2637\u22ef\u2713\u2714\u2605\u2665\u2661\u2304\u2303\ufe0e\ufe0f]/u.test(element.textContent || "")).map(element => element.textContent));
    expect(iconGlyphs, route).toEqual([]);
    const invalid = await page.locator("a svg,button svg,summary svg").evaluateAll(elements => elements.filter(element => element.getAttribute("aria-hidden") !== "true" || getComputedStyle(element).stroke !== getComputedStyle(element.parentElement!).color || element.getAttribute("fill") !== "none").map(element => element.outerHTML));
    expect(invalid, route).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${route} at ${width}px`).toBe(true);
    }
  }
});
