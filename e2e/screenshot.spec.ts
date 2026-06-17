import { test } from "@playwright/test";
import fs from "fs";
import path from "path";

// Ensure the screenshots directory exists
const screenshotsDir = path.join(__dirname, "../public/screenshots");
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const pages = [
  { name: "home", url: "/", seedData: false },
  { name: "about", url: "/about", seedData: false },
  { name: "theengine", url: "/theengine", seedData: false },
  { name: "dashboard", url: "/app", seedData: true },
  { name: "log", url: "/app/log", seedData: true },
  { name: "insights", url: "/app/insights", seedData: true },
  { name: "assistant", url: "/app/assistant", seedData: true },
  { name: "settings", url: "/app/settings", seedData: true },
];

test.describe("Capture Desktop and Mobile Screenshots", () => {
  // Setup standard mock data for the application pages
  const mockState = {
    version: 1,
    state: {
      goal: { dailyTargetKg: 12 },
      activities: [
        {
          id: "act-1",
          factorId: "car_petrol",
          quantity: 35,
          date: new Date().toISOString().split("T")[0],
          note: "Daily drive to office",
        },
        {
          id: "act-2",
          factorId: "meal_beef",
          quantity: 1,
          date: new Date().toISOString().split("T")[0],
          note: "Steak for dinner",
        },
        {
          id: "act-3",
          factorId: "electricity",
          quantity: 12,
          date: new Date().toISOString().split("T")[0],
          note: "Apartment energy consumption",
        },
        {
          id: "act-4",
          factorId: "flight_short",
          quantity: 450,
          date: new Date().toISOString().split("T")[0],
          note: "Weekend getaway flight",
        },
        {
          id: "act-5",
          factorId: "waste_general",
          quantity: 5,
          date: new Date().toISOString().split("T")[0],
          note: "Weekly waste disposal",
        },
      ],
    },
  };

  for (const p of pages) {
    test(`screenshot - ${p.name}`, async ({ browser }) => {
      // 1. Desktop Screenshot (1280x800)
      {
        const context = await browser.newContext({
          viewport: { width: 1280, height: 800 },
          deviceScaleFactor: 2, // Retains high quality/DPI
        });
        const page = await context.newPage();
        
        if (p.seedData) {
          await page.addInitScript((data) => {
            window.localStorage.setItem("carbon-footprint-v1", JSON.stringify(data));
          }, mockState);
        } else {
          await page.addInitScript(() => {
            window.localStorage.clear();
          });
        }

        await page.goto(p.url);
        // Wait for page load and any animations
        await page.waitForTimeout(1500);
        
        const screenshotPath = path.join(screenshotsDir, `${p.name}_desktop.png`);
        await page.screenshot({ path: screenshotPath });
        console.log(`Saved desktop screenshot for ${p.name} at ${screenshotPath}`);
        await context.close();
      }

      // 2. Mobile Screenshot (390x844 - iPhone 12/13/14 size)
      {
        const context = await browser.newContext({
          viewport: { width: 390, height: 844 },
          deviceScaleFactor: 3, // High-quality mobile retina DPI
          isMobile: true,
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
        });
        const page = await context.newPage();

        if (p.seedData) {
          await page.addInitScript((data) => {
            window.localStorage.setItem("carbon-footprint-v1", JSON.stringify(data));
          }, mockState);
        } else {
          await page.addInitScript(() => {
            window.localStorage.clear();
          });
        }

        await page.goto(p.url);
        // Wait for page load and any animations
        await page.waitForTimeout(1500);

        const screenshotPath = path.join(screenshotsDir, `${p.name}_mobile.png`);
        await page.screenshot({ path: screenshotPath });
        console.log(`Saved mobile screenshot for ${p.name} at ${screenshotPath}`);
        await context.close();
      }
    });
  }
});
