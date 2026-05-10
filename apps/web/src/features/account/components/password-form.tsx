import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordRequestSchema } from "@smart-pump/contracts/users";
import type { ChangePasswordRequest } from "@smart-pump/contracts/users";
import { Button } from "@workspace/ui/components/button";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { Spinner } from "@workspace/ui/components/spinner";
import { Controller, useForm } from "react-hook-form";

import { ApiError } from "../../../lib/api";
import { useChangePassword } from "../hooks/use-change-password";

export const PasswordForm = () => {
  const changePassword = useChangePassword();
  const form = useForm<ChangePasswordRequest>({
    defaultValues: {
      confirmPassword: "",
      currentPassword: "",
      newPassword: "",
    },
    resolver: zodResolver(changePasswordRequestSchema),
  });

  return (
    <section className="rounded-[2.5rem] bg-card p-8 shadow-[rgba(0,0,0,0.04)_0px_1px_1px_0px,rgba(0,0,0,0.04)_0px_2px_4px_0px] sm:p-10">
      <h2 className="font-heading font-extrabold text-2xl">Password</h2>
      <p className="mt-2 text-muted-foreground">
        Change the password used for this SMART Pump account.
      </p>
      <form
        className="mt-6 grid gap-4 sm:grid-cols-2"
        noValidate
        onSubmit={form.handleSubmit((values) =>
          changePassword.mutate(values, {
            onError: (error) => {
              if (error instanceof ApiError) {
                form.setError("currentPassword", {
                  message: error.message,
                  type: "server",
                });
              }
            },
            onSuccess: () => form.reset(),
          })
        )}
      >
        <Controller
          control={form.control}
          name="currentPassword"
          render={({ field, fieldState }) => (
            <Field className="sm:col-span-2" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Current password</FieldLabel>
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
        <Controller
          control={form.control}
          name="newPassword"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>New password</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="new-password"
                id={field.name}
                type="password"
              />
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Confirm new password</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="new-password"
                id={field.name}
                type="password"
              />
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
        <div className="sm:col-span-2">
          <Button disabled={changePassword.isPending} type="submit">
            {changePassword.isPending ? <Spinner /> : null}
            Update password
          </Button>
        </div>
      </form>
    </section>
  );
};
