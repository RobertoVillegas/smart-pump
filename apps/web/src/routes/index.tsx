import { Link, Navigate, createFileRoute } from "@tanstack/react-router";
import { buttonVariants } from "@workspace/ui/components/button";

import { useSession } from "../features/auth/hooks/use-session";
import { redirectAuthenticatedSession } from "../features/auth/lib/require-authenticated-session";

const App = () => {
  const session = useSession();

  if (session.data?.authenticated) {
    return <Navigate to="/app" />;
  }

  return (
    <div className="min-h-svh bg-background">
      <main className="mx-auto grid min-h-svh max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="min-w-0">
          <img
            alt="SMART Pump"
            className="mb-8 h-14 w-auto"
            src="/assets/smart-pump-logo.png"
          />
          <h1 className="max-w-3xl font-heading font-semibold text-4xl tracking-normal sm:text-5xl">
            Account access for SMART Pump customers
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Sign in to view your account details, check your balance, and update
            your personal information.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className={buttonVariants({})} to="/login">
              Sign in
            </Link>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <div className="grid gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Demo email</p>
              <p className="font-medium">henderson.briggs@geeknet.net</p>
            </div>
            <div>
              <p className="text-muted-foreground">Demo password</p>
              <p className="font-medium">23derd*334</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export const Route = createFileRoute("/")({
  beforeLoad: redirectAuthenticatedSession,
  component: App,
  ssr: false,
});
