import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty";
import { Spinner } from "@workspace/ui/components/spinner";
import { ArrowLeftIcon, OctagonXIcon } from "lucide-react";

import { AppShell } from "../components/app-shell";
import { PasswordForm } from "../features/account/components/password-form";
import { ProfileForm } from "../features/account/components/profile-form";
import { useMe } from "../features/account/hooks/use-me";
import { useSession } from "../features/auth/hooks/use-session";
import { requireAuthenticatedSession } from "../features/auth/lib/require-authenticated-session";

const EditAccountPage = () => {
  const navigate = useNavigate();
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
      <div className="mx-auto mb-10 w-full max-w-4xl">
        <Link className={buttonVariants({ variant: "ghost" })} to="/app">
          <ArrowLeftIcon aria-hidden="true" />
          Account
        </Link>
        <h1 className="mt-6 font-heading font-extrabold text-[clamp(3rem,8vw,5.5rem)] leading-[0.95] tracking-normal">
          Edit details
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          Update the profile details shown on your account.
        </p>
      </div>
      <div className="mx-auto grid w-full max-w-4xl gap-8">
        <ProfileForm
          user={user}
          onSaved={() => {
            navigate({ to: "/app" });
          }}
        />
        <PasswordForm />
      </div>
    </AppShell>
  );
};

export const Route = createFileRoute("/app_/edit")({
  beforeLoad: requireAuthenticatedSession,
  component: EditAccountPage,
  ssr: false,
});
