import { createFileRoute } from "@tanstack/react-router";

import { LoginForm } from "../features/auth/components/login-form";

const LoginPage = () => (
  <main className="grid min-h-svh bg-background lg:grid-cols-[0.95fr_1.05fr]">
    <section className="flex items-center px-4 py-10 sm:px-8">
      <div className="mx-auto w-full max-w-md rounded-lg border bg-card p-6">
        <img
          alt="SMART Pump"
          className="mb-8 h-12 w-auto"
          src="/assets/smart-pump-logo.png"
        />
        <h1 className="font-heading font-semibold text-2xl">Sign in</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Use your account email and password.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </section>
    <section className="hidden border-l bg-muted/40 px-10 py-10 lg:flex lg:items-end">
      <div className="max-w-xl">
        <p className="font-heading font-semibold text-3xl">
          Manage account details without exposing sensitive data.
        </p>
        <p className="mt-4 text-muted-foreground">
          Balance checks and profile updates stay scoped to the authenticated
          user session.
        </p>
      </div>
    </section>
  </main>
);

export const Route = createFileRoute("/login")({ component: LoginPage });
