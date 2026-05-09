import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty";
import { Spinner } from "@workspace/ui/components/spinner";
import { OctagonXIcon } from "lucide-react";
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
        <Spinner
          aria-label="Loading account"
          className="size-6 text-muted-foreground"
        />
      </div>
    );
  }

  if (me.isError) {
    return (
      <div className="grid min-h-svh place-items-center bg-background p-4">
        <Empty className="max-w-md border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <OctagonXIcon className="text-destructive" />
            </EmptyMedia>
            <EmptyTitle>Couldn't load your account</EmptyTitle>
            <EmptyDescription>
              Something went wrong while fetching your details. Please try
              again.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => me.refetch()}>Retry</Button>
          </EmptyContent>
        </Empty>
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
