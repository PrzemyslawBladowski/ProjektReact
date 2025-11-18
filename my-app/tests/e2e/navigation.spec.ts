import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const screenshotDir = path.resolve(__dirname, "../../../screenshots");

test.describe("Nawigacja portalu", () => {
  test("powinna obsługiwać kluczowe trasy i wykonać zrzut ekranu", async ({ page }) => {
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    await page.goto("/");
    await expect(page.getByText("ScienceHub")).toBeVisible();

    const screenshotPath = path.join(screenshotDir, `home-${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: "Kontakt ScienceHub" })).toBeVisible();

    await page.goto("/contact/gdansk");
    await expect(page.getByRole("heading", { name: /Centrum Gdańsk/i })).toBeVisible();

    await page.goto("/incr");
    await expect(page.getByText(/Aktualna wartość/i)).toBeVisible();
  });
});

