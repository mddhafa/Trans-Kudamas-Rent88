import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1366, height: 768 },
];

async function expectNoPageHorizontalScroll(page: any) {
  await page.waitForLoadState("networkidle");

  const result = await page.evaluate(() => {
    const html = document.documentElement;
    const body = document.body;

    return {
      viewportWidth: window.innerWidth,
      htmlScrollWidth: html.scrollWidth,
      htmlClientWidth: html.clientWidth,
      bodyScrollWidth: body.scrollWidth,
      bodyClientWidth: body.clientWidth,
      hasHorizontalScroll:
        html.scrollWidth > html.clientWidth + 1 ||
        body.scrollWidth > body.clientWidth + 1,
    };
  });

  expect(result.hasHorizontalScroll, JSON.stringify(result, null, 2)).toBe(false);
}

test.describe("Black Box - Responsive Testing", () => {
  for (const viewport of viewports) {
    test(`halaman beranda tampil baik pada ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      await page.goto(`${BASE_URL}/`);

      await expect(page.locator("body")).toBeVisible();

      await expectNoPageHorizontalScroll(page);
    });

    test(`halaman armada tampil baik pada ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      await page.goto(`${BASE_URL}/armada`);

      await expect(page.locator("body")).toBeVisible();

      await expectNoPageHorizontalScroll(page);
    });
  }
});