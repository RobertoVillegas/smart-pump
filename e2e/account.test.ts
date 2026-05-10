import { expect, test } from "@playwright/test";

import { activeUser, signIn } from "./helpers";

test.describe("account", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test("shows profile details", async ({ page }) => {
    await expect(page.getByText("Henderson Briggs")).toBeVisible();
    await expect(page.getByText(activeUser.email).last()).toBeVisible();
  });

  test("shows balance by default and lets users hide it", async ({ page }) => {
    await expect(page.getByLabel("$3,585.69")).toBeVisible();

    await page.getByRole("button", { name: "Hide balance" }).click();
    await expect(page.getByText("••••••")).toBeVisible();

    await page.reload();
    await expect(page.getByText("••••••")).toBeVisible();
  });

  test("user can update profile details", async ({ page }) => {
    await page.getByRole("link", { name: /edit details/iu }).click();
    await page.waitForURL("**/app/edit");

    const firstNameField = page.getByLabel("First name");
    const next = `Updated${Math.floor(1000 + Math.random() * 8999)}`;
    await firstNameField.fill(next);
    await page.getByRole("button", { name: /save changes/iu }).click();
    await expect(page.getByText(/profile details updated/iu)).toBeVisible();
    await expect(page.getByText(`${next} Briggs`).last()).toBeVisible();
  });

  test("wrong current password stays on settings and shows a field error", async ({
    page,
  }) => {
    await page.getByRole("link", { name: /edit details/iu }).click();
    await page.waitForURL("**/app/edit");

    await page.getByLabel("Current password").fill("wrong-password");
    await page
      .getByRole("textbox", { exact: true, name: "New password" })
      .fill("new-password");
    await page.getByLabel("Confirm new password").fill("new-password");
    await page.getByRole("button", { name: /update password/iu }).click();

    await expect(
      page
        .getByRole("alert")
        .filter({ hasText: "Current password is incorrect" })
    ).toBeVisible();
    await expect(page).toHaveURL(/\/app\/edit/u);
    await expect(
      page.getByRole("button", { name: "Open account menu" })
    ).toBeVisible();
  });

  test("user can update password and sign in with the new password", async ({
    page,
  }) => {
    const nextPassword = `new-password-${Date.now()}`;

    await page.getByRole("link", { name: /edit details/iu }).click();
    await page.waitForURL("**/app/edit");
    await page.getByLabel("Current password").fill(activeUser.password);
    await page
      .getByRole("textbox", { exact: true, name: "New password" })
      .fill(nextPassword);
    await page.getByLabel("Confirm new password").fill(nextPassword);
    await page.getByRole("button", { name: /update password/iu }).click();
    await expect(page.getByText(/password updated/iu)).toBeVisible();

    await page.getByRole("button", { name: "Open account menu" }).click();
    await page.getByRole("menuitem", { name: /sign out/iu }).click();
    await page.waitForURL("**/login");

    await page.getByLabel("Email").fill(activeUser.email);
    await page
      .getByRole("textbox", { exact: true, name: "Password" })
      .fill(nextPassword);
    await page.getByRole("button", { name: /sign in/iu }).click();
    await page.waitForURL("**/app");
    await expect(
      page.getByRole("heading", { level: 1, name: "Account" })
    ).toBeVisible();

    await page.getByRole("link", { name: /edit details/iu }).click();
    await page.waitForURL("**/app/edit");
    await page.getByLabel("Current password").fill(nextPassword);
    await page
      .getByRole("textbox", { exact: true, name: "New password" })
      .fill(activeUser.password);
    await page.getByLabel("Confirm new password").fill(activeUser.password);
    await page.getByRole("button", { name: /update password/iu }).click();
    await expect(page.getByText(/password updated/iu)).toBeVisible();
  });

  test("protected user 401 sends the session back to login", async ({
    page,
  }) => {
    await page.route("**/users/me", (route) =>
      route.fulfill({
        body: JSON.stringify({
          error: {
            message: "Authentication required",
          },
        }),
        contentType: "application/json",
        status: 401,
      })
    );

    await page.reload();
    await page.waitForURL("**/login");
  });
});
