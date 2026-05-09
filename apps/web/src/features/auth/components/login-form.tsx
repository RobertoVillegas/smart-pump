import { zodResolver } from "@hookform/resolvers/zod";
import { loginRequestSchema } from "@smart-pump/contracts/auth";
import type { LoginRequest } from "@smart-pump/contracts/auth";
import { Button } from "@workspace/ui/components/button";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { Spinner } from "@workspace/ui/components/spinner";
import { useHydrated } from "@workspace/ui/hooks/use-hydrated";
import { Controller, useForm } from "react-hook-form";

import { useLogin } from "../hooks/use-login";

export const LoginForm = () => {
  const hydrated = useHydrated();
  const login = useLogin();
  const isDisabled = !hydrated || login.isPending;
  const form = useForm<LoginRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginRequestSchema),
  });

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
              disabled={isDisabled}
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
              disabled={isDisabled}
              id={field.name}
              type="password"
            />
            {fieldState.invalid ? (
              <FieldError errors={[fieldState.error]} />
            ) : null}
          </Field>
        )}
      />
      <Button disabled={isDisabled} type="submit">
        {login.isPending ? <Spinner /> : null}
        Sign in
      </Button>
    </form>
  );
};
