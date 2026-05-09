import { Link } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import type { PropsWithChildren } from "react";

import { useLogout } from "../features/auth/hooks/use-logout";

type AppShellProps = PropsWithChildren<{
  userName?: string;
}>;

export const AppShell = ({ children, userName }: AppShellProps) => {
  const logout = useLogout();

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link className="flex items-center gap-3" to="/app">
            <img
              alt="SMART Pump"
              className="size-9 rounded-md border bg-white object-contain p-1"
              src="/assets/smart-pump-logo.png"
            />
            <span className="font-heading font-semibold text-lg">
              SMART Pump
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {userName ? (
              <span className="hidden text-muted-foreground text-sm sm:inline">
                {userName}
              </span>
            ) : null}
            <Button
              disabled={logout.isPending}
              onClick={() => logout.mutate()}
              size="sm"
              variant="outline"
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
};
