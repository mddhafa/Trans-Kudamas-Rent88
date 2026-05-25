import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Navbar", () => {
  test("menu desktop dapat berpindah halaman", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    await page.getByRole("link", { name: "Armada" }).first().click();
    await expect(page).toHaveURL(/.*\/armada/);

    await page.getByRole("link", { name: "Tentang Kami" }).first().click();
    await expect(page).toHaveURL(/.*\/tentang/);

    await page.getByRole("link", { name: "Kontak" }).first().click();
    await expect(page).toHaveURL(/.*\/kontak/);
  });

  test("logo kembali ke halaman beranda", async ({ page }) => {
    await page.goto(`${BASE_URL}/armada`);

    await page
      .getByRole("link", { name: /KudaMas Rent 88|AGIL RENT/i })
      .first()
      .click();

    await expect(page).toHaveURL(`${BASE_URL}/`);
  });
});