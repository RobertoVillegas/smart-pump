import type { Page } from "@playwright/test";

export const waitForHydration = (page: Page) =>
  page.waitForFunction(() => !(window as unknown as { $_TSR?: unknown }).$_TSR);
