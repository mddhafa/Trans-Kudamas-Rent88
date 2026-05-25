import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Admin Catalog Feature", () => {

  // =========================
  // HALAMAN KATALOG
  // =========================

  test("halaman katalog tampil", async ({ page }) => {
    await page.goto("http://localhost:3001/admin/catalog");

    await expect(
      page.getByRole("heading", {
        name: "Kelola Katalog Mobil",
      })
    ).toBeVisible();
  });

  test("daftar mobil berhasil dimuat", async ({ page }) => {
    await page.goto("http://localhost:3001/admin/catalog");

    await expect(
      page.locator("h3").first()
    ).toBeVisible();
  });

  test("tombol tambah mobil dapat dibuka", async ({ page }) => {
    await page.goto("http://localhost:3001/admin/catalog");

    await page.getByRole("link", {
      name: "Tambah Mobil",
    }).click();

    await expect(page).toHaveURL(
      /.*\/admin\/catalog\/tambah/
    );
  });

  test("tombol detail mobil dapat dibuka", async ({ page }) => {
    await page.goto("http://localhost:3001/admin/catalog");

    await page.getByRole("link", {
      name: "Detail",
    }).first().click();

    await expect(page).toHaveURL(
      /.*\/admin\/catalog\/\d+/
    );
  });

  // =========================
  // DETAIL MOBIL
  // =========================

  test("halaman detail mobil tampil", async ({ page }) => {
    await page.goto("http://localhost:3001/admin/catalog/12");

    await expect(
      page.getByRole("heading", {
        name: "Detail Mobil",
      })
    ).toBeVisible();
  });

  test("validasi nama kosong berjalan", async ({ page }) => {
    await page.goto("http://localhost:3001/admin/catalog/12");

    const namaInput = page.locator("input").nth(1);

    await namaInput.fill("");

    await page.getByRole("button", {
      name: "Simpan Perubahan",
    }).click();

    await expect(
      page.getByText("Nama wajib diisi")
    ).toBeVisible();
  });

  test("edit mobil berhasil", async ({ page }) => {
    await page.goto("http://localhost:3001/admin/catalog/12");

    const namaInput = page.locator("input").nth(1);

    await namaInput.fill("Mobil Testing Playwright");

    await page.getByRole("button", {
      name: "Simpan Perubahan",
    }).click();

    await expect(
      page.getByText(/Perubahan tersimpan|Menyimpan/i)
    ).toBeVisible();
  });

  // =========================
  // TAMBAH MOBIL
  // =========================

  test("halaman tambah mobil tampil", async ({ page }) => {
    await page.goto(
      "http://localhost:3001/admin/catalog/tambah"
    );

    await expect(
      page.getByRole("heading", {
        name: /Tambah Mobil/i,
      })
    ).toBeVisible();
  });

  test("tambah mobil berhasil", async ({ page }) => {
    await page.goto(
      "http://localhost:3001/admin/catalog/tambah"
    );

    await page
      .locator('input[name="nama"]')
      .fill("Mobil Baru Testing");

    await page
      .locator('textarea[name="deskripsi"]')
      .fill("Deskripsi mobil testing");

    await page
      .locator("select")
      .selectOption("Minibus");

    const filePath = path.join(
      process.cwd(),
      "tests/assets/test-image.jpg"
    );

    await page
      .locator('input[type="file"]')
      .setInputFiles(filePath);

    await page.getByRole("button", {
      name: /Tambah|Simpan/i,
    }).click();

    await expect(
      page.getByText(/berhasil|ditambahkan|tersimpan/i)
    ).toBeVisible();
  });

  // =========================
  // RESPONSIVE TEST
  // =========================

  test("responsive mobile katalog berjalan baik", async ({ page }) => {
    await page.setViewportSize({
      width: 390,
      height: 844,
    });

    await page.goto("http://localhost:3001/admin/catalog");

    await expect(
      page.getByRole("heading", {
        name: "Kelola Katalog Mobil",
      })
    ).toBeVisible();

    const overflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        window.innerWidth
      );
    });

    expect(overflow).toBe(false);
  });

});