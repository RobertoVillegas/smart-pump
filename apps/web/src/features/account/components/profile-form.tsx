import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileRequestSchema } from "@smart-pump/contracts/users";
import type {
  UpdateProfileRequest,
  UserProfile,
} from "@smart-pump/contracts/users";
import { Button } from "@workspace/ui/components/button";
import { Spinner } from "@workspace/ui/components/spinner";
import { useForm } from "react-hook-form";

import { useUpdateProfile } from "../hooks/use-update-profile";
import { normalizePhoneForInput } from "../lib/format-phone";
import { ProfileField } from "./profile-field";
import { ProfilePhoneField } from "./profile-phone-field";

interface ProfileFormProps {
  onSaved?: () => void;
  user: UserProfile;
}

const getProfileFormValues = (user: UserProfile): UpdateProfileRequest => ({
  address: user.address,
  age: user.age,
  email: user.email,
  eyeColor: user.eyeColor,
  firstName: user.firstName,
  lastName: user.lastName,
  phone: normalizePhoneForInput(user.phone),
});

export const ProfileForm = ({ onSaved, user }: ProfileFormProps) => {
  const updateProfile = useUpdateProfile();
  const form = useForm<UpdateProfileRequest>({
    resolver: zodResolver(updateProfileRequestSchema),
    values: getProfileFormValues(user),
  });

  return (
    <section className="rounded-[2.5rem] bg-card p-8 shadow-[rgba(0,0,0,0.04)_0px_1px_1px_0px,rgba(0,0,0,0.04)_0px_2px_4px_0px] sm:p-10">
      <h2 className="font-heading font-extrabold text-2xl">Personal details</h2>
      <p className="mt-2 text-muted-foreground">
        Keep the profile information shown on your account up to date.
      </p>
      <form
        className="mt-6 grid gap-4 sm:grid-cols-2"
        noValidate
        onSubmit={form.handleSubmit((values) =>
          updateProfile.mutate(values, { onSuccess: onSaved })
        )}
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
          label="Email"
          name="email"
          type="email"
        />
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
        <div className="sm:col-span-2 sm:flex sm:justify-end">
          <Button
            className="w-full sm:w-auto"
            disabled={updateProfile.isPending}
            type="submit"
          >
            {updateProfile.isPending ? <Spinner /> : null}
            Save changes
          </Button>
        </div>
      </form>
    </section>
  );
};
