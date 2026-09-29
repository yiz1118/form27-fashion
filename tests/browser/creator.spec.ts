import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
import { creator, conceptProject } from "../../config/creator";

test("creator contact is accessible, contextual, and responsive", async ({ page }, testInfo) => {
  test.setTimeout(90000);
  const captureDirectory = `artifacts/creator-review/${testInfo.project.name.replaceAll(" ", "-").toLowerCase() || "chrome"}`;
  await mkdir(captureDirectory, { recursive: true });
  for (const width of [375, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const credit = page.getByRole("region", { name: creator.name });
    await expect(credit.getByText(conceptProject.status, { exact: true })).toBeVisible();
    await expect(credit.getByText(creator.title, { exact: true })).toBeVisible();
    await expect(credit.getByText(creator.location, { exact: true })).toBeVisible();
    await expect(credit.getByText(creator.availability, { exact: true })).toBeVisible();
    await expect(credit.getByRole("link", { name: /View Portfolio/ })).toHaveCount(0);
    await credit.scrollIntoViewIfNeeded();
    await credit.screenshot({ path: `${captureDirectory}/creator-${width}-closed.png` });
    const start = credit.locator("summary");
    await start.focus();
    await expect(start).toBeFocused();
    expect(await start.evaluate(element => getComputedStyle(element).outlineStyle)).toBe("solid");
    await page.keyboard.press("Enter");
    await expect(credit.locator("details")).toHaveAttribute("open", "");
    const whatsapp = credit.getByRole("link", { name: /WhatsApp/ });
    const email = credit.getByRole("link", { name: /Email/ });
    const whatsappURL = new URL((await whatsapp.getAttribute("href"))!);
    expect(whatsappURL.origin + whatsappURL.pathname).toBe(creator.whatsappUrl);
    expect(whatsappURL.searchParams.get("text")).toContain(conceptProject.name);
    expect(whatsappURL.searchParams.get("text")).toContain("website/app project");
    const emailURL = new URL((await email.getAttribute("href"))!);
    expect(emailURL.pathname).toBe(creator.email);
    expect(emailURL.searchParams.get("subject")).toBe(`Project Inquiry — ${conceptProject.name}`);
    expect(emailURL.searchParams.get("body")).toContain(conceptProject.name);
    for (const [name, href] of [["LinkedIn", creator.linkedinUrl], ["GitHub", creator.githubUrl]] as const) {
      await expect(credit.getByRole("link", { name: new RegExp(name) })).toHaveAttribute("href", href);
    }
    for (const link of [whatsapp, credit.getByRole("link", { name: /LinkedIn/ }), credit.getByRole("link", { name: /GitHub/ })]) {
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
    for (const control of [start, whatsapp, email, credit.getByRole("link", { name: /LinkedIn/ }), credit.getByRole("link", { name: /GitHub/ })]) {
      expect((await control.boundingBox())?.height).toBeGreaterThanOrEqual(44);
      expect(await control.getAttribute("data-analytics-event")).toMatch(/^creator_/);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    expect(await credit.locator("svg").evaluateAll(elements => elements.every(element => element.getAttribute("aria-hidden") === "true" && getComputedStyle(element).stroke === getComputedStyle(element.parentElement!).color))).toBe(true);
    await credit.screenshot({ path: `${captureDirectory}/creator-${width}-open.png` });
    const audit = await new AxeBuilder({ page }).include(".creator-credit").analyze();
    expect(audit.violations.map(violation => violation.id), `creator accessibility at ${width}px`).toEqual([]);
    await start.focus();
    await page.keyboard.press("Space");
    await expect(credit.locator("details")).not.toHaveAttribute("open", "");
    if (testInfo.project.use.hasTouch) {
      await start.tap();
      await expect(credit.locator("details")).toHaveAttribute("open", "");
      await start.tap();
      await expect(credit.locator("details")).not.toHaveAttribute("open", "");
    }
  }
  for (const route of ["/shop", "/lookbook", "/campaign", "/about", "/cart", "/size-guide", "/products/axis-trouser", "/missing"]) {
    await page.goto(route);
    await expect(page.getByRole("region", { name: creator.name })).toHaveCount(1);
  }
});
