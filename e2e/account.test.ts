import { expect, test } from "@playwright/test";

import { waitForHydration } from "./helpers";

const ACTIVE = {
  email: "henderson.briggs@geeknet.net",
  password: "23derd*334",
};

test.describe("account", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await waitForHydration(page);
    await page.getByLabel("Email").fill(ACTIVE.email);
    await page.getByLabel("Password").fill(ACTIVE.password);
    await page.getByRole("button", { name: /sign in/iu }).click();
    await page.waitForURL("**/app");
  });

  test("shows profile details", async ({ page }) => {
    await expect(page.getByText("Henderson Briggs")).toBeVisible();
    await expect(page.getByText(ACTIVE.email).first()).toBeVisible();
  });

  test("user can check balance", async ({ page }) => {
    await page.getByRole("button", { name: /check balance/iu }).click();
    await expect(page.getByText(/^\$/u)).toBeVisible();
  });

  test("user can update profile details", async ({ page }) => {
    const phoneField = page.getByLabel("Phone");
    const next = `+1 (555) 000-${Math.floor(1000 + Math.random() * 8999)}`;
    await phoneField.fill(next);
    await page.getByRole("button", { name: /save changes/iu }).click();
    await expect(page.getByText(/profile updated/iu)).toBeVisible();
    await expect(phoneField).toHaveValue(next);
  });
});
