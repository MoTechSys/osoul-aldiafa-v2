import { defineConfig, devices } from "@playwright/test";

const PORT = 3200;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: BASE_URL,
    locale: "ar-SA",
    trace: "on-first-retry",
  },
  projects: [
    // Mobile-first: 96% of traffic is mobile (plan 05 §7.1).
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"], locale: "ar-SA" },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 13"], locale: "ar-SA" },
    },
    {
      name: "desktop-chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
        locale: "ar-SA",
      },
    },
  ],
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: BASE_URL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
