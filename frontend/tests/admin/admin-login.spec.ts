import { test, expect } from "@playwright/test";

test.describe("Admin Login", () => {
  test("admin berhasil login", async ({ page }) => {
    await page.goto("http://localhost:3001/admin/login");

    await page.fill('input[name="email"]', "admin@admin.com");

    await page.fill('input[name="password"]', "password123");

    await page.getByRole("button", {
      name: /Masuk ke dashboard/i,
    }).click();

    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("login gagal jika password salah", async ({ page }) => {
    await page.goto("http://localhost:3001/admin/login");

    await page.fill('input[name="email"]', "admin@admin.com");

    await page.fill('input[name="password"]', "salah");

    await page.getByRole("button", {
      name: /Masuk ke dashboard/i,
    }).click();

    await expect(
      page.getByText(/Login gagal/i)
    ).toBeVisible();
  });

    test("login gagal jika email salah", async ({ page }) => {
    await page.goto("http://localhost:3001/admin/login");

    await page.fill('input[name="email"]', "salah@admin.com");

    await page.fill('input[name="password"]', "password123");

    await page.getByRole("button", {
      name: /Masuk ke dashboard/i,
    }).click();

    await expect(
      page.getByText(/Login gagal/i)
    ).toBeVisible();
  });
});