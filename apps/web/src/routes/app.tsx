import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { AppShell } from "../components/app-shell";
import { BalanceCard } from "../features/account/components/balance-card";
import { ProfileCard } from "../features/account/components/profile-card";
import { ProfileForm } from "../features/account/components/profile-form";
import { useMe } from "../features/account/hooks/use-me";
import { useSession } from "../features/auth/hooks/use-session";

const AccountPage = () => {
  const navigate = useNavigate();
  const session = useSession();
  const me = useMe(session.data?.authenticated === true);
  const user = me.data?.user;

  useEffect(() => {
    if (session.data && !session.data.authenticated) {
      void navigate({ to: "/login" });
    }
  }, [navigate, session.data]);

  if (session.isLoading || me.isLoading) {
    return (
      <div className="grid min-h-svh place-items-center bg-background">
        <p className="text-muted-foreground text-sm">Loading account...</p>
      </div>
    );
  }

  if (!session.data?.authenticated || !user) {
    return null;
  }

  return (
    <AppShell userName={`${user.firstName} ${user.lastName}`}>
      <div className="mb-6">
        <h1 className="font-heading font-semibold text-3xl">Account</h1>
        <p className="mt-2 text-muted-foreground">
          View your profile, check your balance, and keep details current.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="grid content-start gap-6">
          <ProfileCard user={user} />
          <BalanceCard />
        </div>
        <ProfileForm user={user} />
      </div>
    </AppShell>
  );
};

export const Route = createFileRoute("/app")({ component: AccountPage });
