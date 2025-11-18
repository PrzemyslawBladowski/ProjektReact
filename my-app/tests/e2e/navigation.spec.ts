import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const screenshotDir = path.resolve(__dirname, "../../../screenshots");

test.describe("Nawigacja portalu - testy RWD", () => {
  test("powinna obsługiwać kluczowe trasy i wykonać zrzut ekranu na wszystkich urządzeniach", async ({ page, viewport }) => {
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    // Określenie typu urządzenia na podstawie viewport
    const deviceType = viewport?.width 
      ? viewport.width < 768 ? "mobile" 
        : viewport.width < 1024 ? "tablet" 
        : "desktop"
      : "desktop";
    
    const deviceName = viewport?.width ? `${deviceType}-${viewport.width}x${viewport.height}` : "desktop";

    await page.goto("/");
    await expect(page.getByText("ScienceHub")).toBeVisible();

    const screenshotPath = path.join(screenshotDir, `home-${deviceName}-${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: "Kontakt ScienceHub" })).toBeVisible();

    await page.goto("/contact/gdansk");
    await expect(page.getByRole("heading", { name: /Centrum Gdańsk/i })).toBeVisible();

    await page.goto("/incr");
    await expect(page.getByText(/Aktualna wartość/i)).toBeVisible();

    // Test responsywności - sprawdzenie czy elementy są widoczne na danym urządzeniu
    if (viewport && viewport.width < 768) {
      // Na mobile sprawdzamy czy menu jest dostępne (hamburger menu)
      const menuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid*="menu"]').first();
      if (await menuButton.count() > 0) {
        await expect(menuButton).toBeVisible();
      }
    }
  });
});

