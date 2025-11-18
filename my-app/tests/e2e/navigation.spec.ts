import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const screenshotDir = path.resolve(__dirname, "../../../screenshots");

// Upewnij się, że katalog screenshots istnieje
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

test.describe("Nawigacja portalu - testy wszystkich tras", () => {
  test.beforeEach(async ({ page }) => {
    // Czekaj na załadowanie strony
    page.setDefaultTimeout(10000);
  });

  test("Strona główna (/) - powinna wyświetlać posty i wykonać screenshot", async ({ page, viewport }) => {
    const deviceType = viewport?.width 
      ? viewport.width < 768 ? "mobile" 
        : viewport.width < 1024 ? "tablet" 
        : "desktop"
      : "desktop";
    
    const deviceName = viewport?.width ? `${deviceType}-${viewport.width}x${viewport.height}` : "desktop";

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    // Sprawdź czy strona się załadowała
    await expect(page.getByText(/ScienceHub/i).first()).toBeVisible({ timeout: 10000 });
    
    // Screenshot strony głównej
    const screenshotPath = path.join(screenshotDir, `home-${deviceName}-${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot zapisany: ${screenshotPath}`);
  });

  test("Strona kontakt (/contact) - powinna wyświetlać informacje kontaktowe", async ({ page, viewport }) => {
    const deviceType = viewport?.width 
      ? viewport.width < 768 ? "mobile" 
        : viewport.width < 1024 ? "tablet" 
        : "desktop"
      : "desktop";
    
    const deviceName = viewport?.width ? `${deviceType}-${viewport.width}x${viewport.height}` : "desktop";

    await page.goto("/contact");
    await page.waitForLoadState("networkidle");
    
    await expect(page.getByRole("heading", { name: /Kontakt ScienceHub/i })).toBeVisible({ timeout: 10000 });
    
    // Screenshot strony kontakt
    const screenshotPath = path.join(screenshotDir, `contact-${deviceName}-${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot zapisany: ${screenshotPath}`);
  });

  test("Strona Gdańsk (/contact/gdansk) - powinna wyświetlać informacje o centrum", async ({ page, viewport }) => {
    const deviceType = viewport?.width 
      ? viewport.width < 768 ? "mobile" 
        : viewport.width < 1024 ? "tablet" 
        : "desktop"
      : "desktop";
    
    const deviceName = viewport?.width ? `${deviceType}-${viewport.width}x${viewport.height}` : "desktop";

    await page.goto("/contact/gdansk");
    await page.waitForLoadState("networkidle");
    
    await expect(page.getByRole("heading", { name: /Centrum Gdańsk/i })).toBeVisible({ timeout: 10000 });
    
    // Screenshot strony Gdańsk
    const screenshotPath = path.join(screenshotDir, `gdansk-${deviceName}-${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot zapisany: ${screenshotPath}`);
  });

  test("Strona mix (/mix) - powinna wyświetlać widok łączony Server + Client", async ({ page, viewport }) => {
    const deviceType = viewport?.width 
      ? viewport.width < 768 ? "mobile" 
        : viewport.width < 1024 ? "tablet" 
        : "desktop"
      : "desktop";
    
    const deviceName = viewport?.width ? `${deviceType}-${viewport.width}x${viewport.height}` : "desktop";

    await page.goto("/mix");
    await page.waitForLoadState("networkidle");
    
    await expect(page.getByRole("heading", { name: /Widok łączony Server \+ Client/i })).toBeVisible({ timeout: 10000 });
    
    // Screenshot strony mix
    const screenshotPath = path.join(screenshotDir, `mix-${deviceName}-${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot zapisany: ${screenshotPath}`);
  });

  test("Strona inkrementacji (/incr) - powinna wyświetlać panel i reagować na kliknięcia", async ({ page, viewport }) => {
    const deviceType = viewport?.width 
      ? viewport.width < 768 ? "mobile" 
        : viewport.width < 1024 ? "tablet" 
        : "desktop"
      : "desktop";
    
    const deviceName = viewport?.width ? `${deviceType}-${viewport.width}x${viewport.height}` : "desktop";

    await page.goto("/incr");
    await page.waitForLoadState("networkidle");
    
    await expect(page.getByText(/Aktualna wartość/i)).toBeVisible({ timeout: 10000 });
    
    // Test interakcji - kliknij przycisk +1
    const incrementButton = page.getByRole("button", { name: "+1" });
    await expect(incrementButton).toBeVisible();
    
    // Sprawdź początkową wartość (powinna być 0)
    const countDisplay = page.locator('p.text-6xl.font-semibold.text-blue-700');
    await expect(countDisplay).toHaveText("0");
    
    await incrementButton.click();
    
    // Sprawdź czy wartość się zmieniła na 1
    await expect(countDisplay).toHaveText("1");
    
    // Screenshot strony inkrementacji
    const screenshotPath = path.join(screenshotDir, `incr-${deviceName}-${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot zapisany: ${screenshotPath}`);
  });

  test("Test responsywności - sprawdzenie menu na urządzeniach mobilnych", async ({ page, viewport }) => {
    if (viewport && viewport.width < 768) {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      
      // Na mobile sprawdzamy czy elementy są widoczne
      const menuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid*="menu"]').first();
      if (await menuButton.count() > 0) {
        await expect(menuButton).toBeVisible();
      }
      
      // Screenshot responsywności
      const deviceName = `mobile-${viewport.width}x${viewport.height}`;
      const screenshotPath = path.join(screenshotDir, `responsive-${deviceName}-${Date.now()}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Screenshot zapisany: ${screenshotPath}`);
    }
  });
});

