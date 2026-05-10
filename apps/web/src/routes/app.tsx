import { createFileRoute } from "@tanstack/react-router";
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

import { AppShell } from "../components/app-shell";
import { BalanceCard } from "../features/account/components/balance-card";
import { ProfileCard } from "../features/account/components/profile-card";
import { TransactionsList } from "../features/account/components/transactions-list";
import { useMe } from "../features/account/hooks/use-me";
import { useSession } from "../features/auth/hooks/use-session";
import { requireAuthenticatedSession } from "../features/auth/lib/require-authenticated-session";

const AccountPage = () => {
  const session = useSession();
  const me = useMe(session.data?.authenticated === true);
  const user = me.data?.user;

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
    <AppShell
      user={{ email: user.email, name: `${user.firstName} ${user.lastName}` }}
    >
      <div className="mb-8 text-center">
        <h1 className="mx-auto max-w-3xl text-balance font-heading font-extrabold text-[clamp(2.5rem,5vw,4rem)] leading-[1.02] tracking-normal">
          Your SMART account, at a glance.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          View your profile, check your balance, and keep details current.
        </p>
      </div>
      <div className="grid gap-8">
        <BalanceCard />
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <ProfileCard user={user} />
          <TransactionsList />
        </div>
      </div>
    </AppShell>
  );
};

export const Route = createFileRoute("/app")({
  beforeLoad: requireAuthenticatedSession,
  component: AccountPage,
  ssr: false,
});
