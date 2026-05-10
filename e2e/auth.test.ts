import { expect, test } from "@playwright/test";

import { activeUser, signIn, waitForHydration } from "./helpers";

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
    await page.getByLabel("Email").fill(activeUser.email);
    await page
      .getByRole("textbox", { exact: true, name: "Password" })
      .fill(activeUser.password);
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
    await page
      .getByRole("textbox", { exact: true, name: "Password" })
      .fill(INACTIVE.password);
    await page.getByRole("button", { name: /sign in/iu }).click();

    await expect(
      page
        .getByRole("alert")
        .filter({ hasText: "User account is inactive" })
        .first()
    ).toBeVisible();
    await expect(page).toHaveURL(/\/login/u);
  });

  test("login form validates email before submitting", async ({ page }) => {
    await page.goto("/login");
    await waitForHydration(page);
    await page.getByLabel("Email").fill("not-an-email");
    await page
      .getByRole("textbox", { exact: true, name: "Password" })
      .fill("anything");
    await page.getByRole("button", { name: /sign in/iu }).click();

    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
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

  test("authenticated user is redirected away from public auth pages", async ({
    page,
  }) => {
    await signIn(page);

    await page.goto("/");
    await page.waitForURL("**/app");

    await page.goto("/login");
    await page.waitForURL("**/app");
  });

  test("user can log out", async ({ page }) => {
    await signIn(page);

    await page.getByRole("button", { name: "Open account menu" }).click();
    await page.getByRole("menuitem", { name: /sign out/iu }).click();
    await page.waitForURL("**/login");
  });
});
