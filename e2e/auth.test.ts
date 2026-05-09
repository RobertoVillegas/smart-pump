import { expect, test } from "@playwright/test";

import { waitForHydration } from "./helpers";

const ACTIVE = {
  email: "henderson.briggs@geeknet.net",
  password: "23derd*334",
};

const INACTIVE = {
  email: "boyd.small@endipine.biz",
  password: "_4rhododfj",
};

test.describe("authentication", () => {
  test("active user can log in and reach the account page", async ({
    page,
  }) => {
    await page.goto("/login");
    await waitForHydration(page);
    await page.getByLabel("Email").fill(ACTIVE.email);
    await page.getByLabel("Password").fill(ACTIVE.password);
    await page.getByRole("button", { name: /sign in/iu }).click();

    await page.waitForURL("**/app");
    await expect(
      page.getByRole("heading", { level: 1, name: "Account" })
    ).toBeVisible();
  });

  test("inactive user is rejected", async ({ page }) => {
    await page.goto("/login");
    await waitForHydration(page);
    await page.getByLabel("Email").fill(INACTIVE.email);
    await page.getByLabel("Password").fill(INACTIVE.password);
    await page.getByRole("button", { name: /sign in/iu }).click();

    await expect(page.getByText(/sign in failed/iu)).toBeVisible();
    await expect(page).toHaveURL(/\/login/u);
  });

  test("unauthenticated user is redirected away from /app", async ({
    page,
  }) => {
    await page.goto("/app");
    await page.waitForURL("**/login");
    await expect(
      page.getByRole("heading", { name: /sign in/iu })
    ).toBeVisible();
  });

  test("user can log out", async ({ page }) => {
    await page.goto("/login");
    await waitForHydration(page);
    await page.getByLabel("Email").fill(ACTIVE.email);
    await page.getByLabel("Password").fill(ACTIVE.password);
    await page.getByRole("button", { name: /sign in/iu }).click();
    await page.waitForURL("**/app");

    await page.getByRole("button", { name: /sign out|log out/iu }).click();
    await page.waitForURL("**/login");
  });
});
