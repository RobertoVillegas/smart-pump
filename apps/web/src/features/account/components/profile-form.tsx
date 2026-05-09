import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileRequestSchema } from "@smart-pump/contracts/users";
import type {
  UpdateProfileRequest,
  UserProfile,
} from "@smart-pump/contracts/users";
import { Button } from "@workspace/ui/components/button";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { Spinner } from "@workspace/ui/components/spinner";
import type { HTMLInputTypeAttribute } from "react";
import { useEffect } from "react";
import type { Control } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";

import "react-phone-number-input/style.css";

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

const ProfilePhoneField = ({
  control,
}: {
  control: Control<UpdateProfileRequest>;
}) => (
  <Controller
    control={control}
    name="phone"
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
        <PhoneInput
          aria-invalid={fieldState.invalid}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-2.5 shadow-xs transition-[color,box-shadow] has-[:focus-visible]:border-ring has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50 has-[input[aria-invalid=true]]:border-destructive has-[input[aria-invalid=true]]:ring-3 has-[input[aria-invalid=true]]:ring-destructive/20 dark:bg-input/30 dark:has-[input[aria-invalid=true]]:border-destructive/50 dark:has-[input[aria-invalid=true]]:ring-destructive/40 [&_.PhoneInputCountry]:mr-2 [&_.PhoneInputCountrySelect]:focus:outline-none [&_.PhoneInputInput]:min-w-0 [&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:text-base [&_.PhoneInputInput]:outline-none md:[&_.PhoneInputInput]:text-sm"
          defaultCountry="US"
          id={field.name}
          international
          onChange={(value) => field.onChange(value ?? "")}
          value={field.value ? String(field.value) : ""}
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
        <ProfilePhoneField control={form.control} />
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
        <div className="sm:col-span-2">
          <Button disabled={updateProfile.isPending} type="submit">
            {updateProfile.isPending ? <Spinner /> : null}
            Save changes
          </Button>
        </div>
      </form>
    </section>
  );
};
