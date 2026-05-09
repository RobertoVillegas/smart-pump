import type { UpdateProfileRequest } from "@smart-pump/contracts/users";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import type { HTMLInputTypeAttribute } from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";

interface ProfileFieldProps {
  className?: string;
  control: Control<UpdateProfileRequest>;
  label: string;
  name: keyof UpdateProfileRequest;
  type?: HTMLInputTypeAttribute;
}

export const ProfileField = ({
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
