import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.config";

export default defineConfig({
  ...base,
  testMatch: "motion.spec.ts",
  outputDir: "test-results/motion",
  reporter: [["list"], ["html", { outputFolder: "test-results/motion-report", open: "never" }]],
  use: { baseURL: "http://127.0.0.1:3108", trace: "retain-on-failure" },
  webServer: { command: "npm run start -- -p 3108", url: "http://127.0.0.1:3108", reuseExistingServer: false, timeout: 60000, env: { NEXT_TELEMETRY_DISABLED: "1" } },
  projects: [
    { name: "Desktop Chrome", use: { browserName: "chromium", channel: "chrome", viewport: { width: 1440, height: 900 } } },
    { name: "Desktop WebKit", use: { browserName: "webkit", viewport: { width: 1440, height: 900 } } },
    { name: "Android Chrome", use: { ...devices["Pixel 7"], browserName: "chromium", channel: "chrome" } },
    { name: "iPhone WebKit", use: { ...devices["iPhone 13"], browserName: "webkit" } },
  ],
});
