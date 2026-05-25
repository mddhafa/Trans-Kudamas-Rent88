import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Mobile Navbar", () => {
  test.use({
    viewport: {
      width: 390,
      height: 844,
    },
  });

  test("hamburger menu dapat dibuka dan link dapat diklik", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    const menuButton = page.locator("button").first();

    await menuButton.click();

    const armadaLink = page.getByRole("link", { name: "Armada" }).first();

    await expect(armadaLink).toBeVisible();

    await armadaLink.click();

    await expect(page).toHaveURL(/.*\/armada/);
  });
});