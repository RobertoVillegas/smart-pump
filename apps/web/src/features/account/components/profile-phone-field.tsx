import type { UpdateProfileRequest } from "@smart-pump/contracts/users";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { PhoneInput } from "@workspace/ui/components/phone-input";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";

interface ProfilePhoneFieldProps {
  control: Control<UpdateProfileRequest>;
}

export const ProfilePhoneField = ({ control }: ProfilePhoneFieldProps) => (
  <Controller
    control={control}
    name="phone"
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
        <PhoneInput
          aria-invalid={fieldState.invalid}
          defaultCountry="US"
          id={field.name}
          initialValueFormat="national"
          onBlur={field.onBlur}
          onChange={(value) => field.onChange(value)}
          value={field.value ? String(field.value) : ""}
        />
        {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
      </Field>
    )}
  />
);
