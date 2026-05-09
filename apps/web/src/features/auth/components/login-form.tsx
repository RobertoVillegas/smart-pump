import { zodResolver } from "@hookform/resolvers/zod";
import { loginRequestSchema } from "@smart-pump/contracts/auth";
import type { LoginRequest } from "@smart-pump/contracts/auth";
import { Button } from "@workspace/ui/components/button";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { Spinner } from "@workspace/ui/components/spinner";
import { useHydrated } from "@workspace/ui/hooks/use-hydrated";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { ApiError } from "../../../lib/api";
import { useLogin } from "../hooks/use-login";

export const LoginForm = () => {
  const hydrated = useHydrated();
  const login = useLogin();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
      onSubmit={form.handleSubmit((values) => {
        form.clearErrors();
        login.mutate(values, {
          onError: (error) => {
            const message =
              error instanceof ApiError
                ? error.message
                : "Unable to sign in. Please try again.";

            form.setError("email", { message, type: "server" });
            form.setError("password", { message, type: "server" });
          },
        });
      })}
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
            <div className="relative">
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="current-password"
                className="pr-10"
                disabled={isDisabled}
                id={field.name}
                type={isPasswordVisible ? "text" : "password"}
              />
              <Button
                aria-label={
                  isPasswordVisible ? "Hide password" : "Show password"
                }
                className="absolute top-1/2 right-1 size-7 -translate-y-1/2"
                disabled={isDisabled}
                onClick={() => setIsPasswordVisible((value) => !value)}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
              </Button>
            </div>
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
