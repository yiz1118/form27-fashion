import { defineConfig } from "@playwright/test";
import browsers from "./playwright.icons.config";

export default defineConfig({
  ...browsers,
  testMatch: "creator.spec.ts",
  outputDir: "artifacts/creator-review/test-results",
  reporter: [["list"], ["html", { outputFolder: "artifacts/creator-review/browser-report", open: "never" }]],
});
