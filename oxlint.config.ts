import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import react from "ultracite/oxlint/react";
import remix from "ultracite/oxlint/remix";
import vitest from "ultracite/oxlint/vitest";

export default defineConfig({
  extends: [core, react, remix, vitest],
  ignorePatterns: [
    // shadcn-vendored components — keep their style as installed
    "packages/ui/src/components/empty.tsx",
    "packages/ui/src/components/skeleton.tsx",
    "packages/ui/src/components/spinner.tsx",
    "packages/ui/src/components/sonner.tsx",
    // playwright e2e — vitest preset rules don't apply
    "e2e/**",
  ],
});
