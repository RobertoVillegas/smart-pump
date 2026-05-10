import type { Page } from "@playwright/test";

export const activeUser = {
  email: "henderson.briggs@geeknet.net",
  password: "23derd*334",
} as const;

export const waitForHydration = (page: Page) =>
  page.waitForFunction(() => !(window as unknown as { $_TSR?: unknown }).$_TSR);

export const signIn = async (page: Page) => {
  await page.goto("/login");
  await waitForHydration(page);
  await page.getByLabel("Email").fill(activeUser.email);
  await page
    .getByRole("textbox", { exact: true, name: "Password" })
    .fill(activeUser.password);
  await page.getByRole("button", { name: /sign in/iu }).click();
  await page.waitForURL("**/app");
};
