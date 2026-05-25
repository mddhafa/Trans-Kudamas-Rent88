import { test, expect } from "@playwright/test";

test.describe("Booking Flow", () => {
  test("user dapat memilih mobil dan melakukan pemesanan", async ({
    page,
  }) => {

    await page.goto("http://localhost:3001/armada");

    await expect(
      page.getByRole("heading", { name: "Armada Kami" })
    ).toBeVisible();

    // ambil tombol pertama
    const pilihMobilBtn = page
      .getByRole("link", { name: "Pilih Mobil" })
      .first();

    // pastikan tombol terlihat
    await pilihMobilBtn.scrollIntoViewIfNeeded();

    await expect(pilihMobilBtn).toBeVisible();

    // klik dengan aman
    await pilihMobilBtn.click({
      force: true,
    });

    // pastikan masuk halaman booking
    await expect(
      page.getByRole("heading", {
        name: /Form Pemesanan/i,
      })
    ).toBeVisible();

    // layanan
    await page.selectOption(
      'select[name="Layanan"]',
      "SEWA_HARIAN"
    );

    // tanggal mulai
    await page.fill(
      'input[name="tanggalMulai"]',
      "2026-06-01"
    );

    // tanggal selesai
    await page.fill(
      'input[name="tanggalSelesai"]',
      "2026-06-03"
    );

    // jam
    await page.fill(
      'input[name="jamMulai"]',
      "08:00"
    );

    // lokasi
    await page.fill(
      'input[name="lokasiPenjemputan"]',
      "Bandara Soekarno Hatta"
    );

    // tujuan
    await page.fill(
      'input[name="tujuan"]',
      "Jakarta Selatan"
    );

    // nama
    await page.fill(
      'input[name="nama"]',
      "Muhammad Dhafa"
    );

    // whatsapp
    await page.fill(
      'input[name="noWa"]',
      "081234567890"
    );

    // email
    await page.fill(
      'input[name="email"]',
      "dhafa@example.com"
    );

    // perusahaan
    await page.fill(
      'input[name="perusahaan"]',
      "AGIL RENT"
    );

    // catatan
    await page.fill(
      'textarea[name="catatan"]',
      "Testing otomatis Playwright"
    );

    // submit
    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      page
        .getByRole("button", {
          name: /Pesan Sekarang/i,
        })
        .click(),
    ]);

    await expect(newPage).toHaveURL(/whatsapp|wa\.me/);
  });
});