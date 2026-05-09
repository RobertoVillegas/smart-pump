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
import { ProfileField } from "./profile-field";
import { ProfilePhoneField } from "./profile-phone-field";

interface ProfileFormProps {
  user: UserProfile;
}

const getProfileFormValues = (user: UserProfile): UpdateProfileRequest => ({
  address: user.address,
  age: user.age,
  eyeColor: user.eyeColor,
  firstName: user.firstName,
  lastName: user.lastName,
  phone: user.phone,
});

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const updateProfile = useUpdateProfile();
  const form = useForm<UpdateProfileRequest>({
    resolver: zodResolver(updateProfileRequestSchema),
    values: getProfileFormValues(user),
  });

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
