import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.config";

export default defineConfig({
  ...base,
  testMatch: "icons.spec.ts",
  outputDir: "artifacts/icon-review/test-results",
  use: { baseURL: "http://127.0.0.1:3107", browserName: "chromium", trace: "retain-on-failure" },
  webServer: { command: "npm run start -- -p 3107", url: "http://127.0.0.1:3107", reuseExistingServer: false, timeout: 60000, env: { NEXT_TELEMETRY_DISABLED: "1" } },
  reporter: [["list"], ["html", { outputFolder: "artifacts/icon-review/browser-report", open: "never" }]],
  projects: [
    { name: "Windows Chrome", use: { channel: "chrome", viewport: { width: 1440, height: 900 } } },
    { name: "Windows Edge", use: { channel: "msedge", viewport: { width: 1440, height: 900 } } },
    { name: "Windows WebKit", use: { browserName: "webkit", viewport: { width: 1440, height: 900 } } },
    { name: "Android Chrome emulation", use: { ...devices["Pixel 7"], channel: "chrome" } },
    { name: "iPhone WebKit emulation", use: { ...devices["iPhone 13"], browserName: "webkit" } },
  ],
});
