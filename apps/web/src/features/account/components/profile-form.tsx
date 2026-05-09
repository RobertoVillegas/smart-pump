import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileRequestSchema } from "@smart-pump/contracts/users";
import type {
  UpdateProfileRequest,
  UserProfile,
} from "@smart-pump/contracts/users";
import { Button } from "@workspace/ui/components/button";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import type { HTMLInputTypeAttribute } from "react";
import { useEffect } from "react";
import type { Control } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";

import { ApiError } from "../../../lib/api";
import { useUpdateProfile } from "../hooks/use-update-profile";

interface ProfileFormProps {
  user: UserProfile;
}

interface ProfileFieldProps {
  className?: string;
  control: Control<UpdateProfileRequest>;
  label: string;
  name: keyof UpdateProfileRequest;
  type?: HTMLInputTypeAttribute;
}

const ProfileField = ({
  className,
  control,
  label,
  name,
  type = "text",
}: ProfileFieldProps) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <Field className={className} data-invalid={fieldState.invalid}>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        <Input
          {...field}
          aria-invalid={fieldState.invalid}
          id={field.name}
          onChange={(event) => {
            const nextValue =
              type === "number"
                ? event.currentTarget.valueAsNumber
                : event.currentTarget.value;

            field.onChange(nextValue);
          }}
          type={type}
          value={field.value ?? ""}
        />
        {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
      </Field>
    )}
  />
);

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const updateProfile = useUpdateProfile();
  const form = useForm<UpdateProfileRequest>({
    defaultValues: {
      address: user.address,
      age: user.age,
      eyeColor: user.eyeColor,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    },
    resolver: zodResolver(updateProfileRequestSchema),
  });
  const errorMessage =
    updateProfile.error instanceof ApiError
      ? updateProfile.error.message
      : "Unable to update profile";

  useEffect(() => {
    form.reset({
      address: user.address,
      age: user.age,
      eyeColor: user.eyeColor,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    });
  }, [form, user]);

  return (
    <section className="rounded-lg border bg-card p-5">
      <h2 className="font-heading font-semibold text-lg">Personal details</h2>
      <form
        className="mt-5 grid gap-4 sm:grid-cols-2"
        onSubmit={form.handleSubmit((values) => updateProfile.mutate(values))}
      >
        <ProfileField
          control={form.control}
          label="First name"
          name="firstName"
        />
        <ProfileField
          control={form.control}
          label="Last name"
          name="lastName"
        />
        <ProfileField control={form.control} label="Phone" name="phone" />
        <ProfileField
          control={form.control}
          label="Age"
          name="age"
          type="number"
        />
        <ProfileField
          control={form.control}
          label="Eye color"
          name="eyeColor"
        />
        <ProfileField
          className="sm:col-span-2"
          control={form.control}
          label="Address"
          name="address"
        />
        {updateProfile.isError ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive text-sm sm:col-span-2">
            {errorMessage}
          </p>
        ) : null}
        {updateProfile.isSuccess ? (
          <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-emerald-700 text-sm sm:col-span-2">
            Profile updated.
          </p>
        ) : null}
        <div className="sm:col-span-2">
          <Button disabled={updateProfile.isPending} type="submit">
            Save changes
          </Button>
        </div>
      </form>
    </section>
  );
};
