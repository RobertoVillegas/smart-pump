import { zodResolver } from "@hookform/resolvers/zod";
import { loginRequestSchema } from "@smart-pump/contracts/auth";
import type { LoginRequest } from "@smart-pump/contracts/auth";
import { Button } from "@workspace/ui/components/button";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { Controller, useForm } from "react-hook-form";

import { ApiError } from "../../../lib/api";
import { useLogin } from "../hooks/use-login";

export const LoginForm = () => {
  const login = useLogin();
  const form = useForm<LoginRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginRequestSchema),
  });
  const errorMessage =
    login.error instanceof ApiError ? login.error.message : "Unable to sign in";

  return (
    <form
      className="grid gap-4"
      onSubmit={form.handleSubmit((values) => login.mutate(values))}
    >
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              autoComplete="email"
              id={field.name}
              type="email"
            />
            {fieldState.invalid ? (
              <FieldError errors={[fieldState.error]} />
            ) : null}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              autoComplete="current-password"
              id={field.name}
              type="password"
            />
            {fieldState.invalid ? (
              <FieldError errors={[fieldState.error]} />
            ) : null}
          </Field>
        )}
      />
      {login.isError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive text-sm">
          {errorMessage}
        </p>
      ) : null}
      <Button disabled={login.isPending} type="submit">
        Sign in
      </Button>
    </form>
  );
};
