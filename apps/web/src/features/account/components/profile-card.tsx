import type { UserProfile } from "@smart-pump/contracts/users";
import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { PencilIcon } from "lucide-react";

import { formatPhoneForDisplay } from "../lib/format-phone";
import { UserAvatar } from "./user-avatar";

interface ProfileCardProps {
  user: UserProfile;
}

export const ProfileCard = ({ user }: ProfileCardProps) => {
  const fullName = `${user.firstName} ${user.lastName}`;
  const rows = [
    ["Email", user.email],
    ["Company", user.company],
    ["Phone", formatPhoneForDisplay(user.phone)],
    ["Address", user.address],
    ["Age", String(user.age)],
    ["Eye color", user.eyeColor],
  ] as const;

  return (
    <section className="rounded-lg border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <UserAvatar name={fullName} />
          <div className="min-w-0">
            <h2 className="font-heading font-semibold text-xl">{fullName}</h2>
            <p className="text-muted-foreground text-sm">
              {user.isActive ? "Active account" : "Inactive account"}
            </p>
          </div>
        </div>
        <Link
          aria-label="Edit details"
          className={cn(buttonVariants({ size: "icon", variant: "outline" }))}
          to="/app/edit"
        >
          <PencilIcon aria-hidden="true" />
        </Link>
      </div>
      <dl className="mt-5 grid gap-3 text-sm">
        {rows.map(([label, value]) => (
          <div className="grid gap-1" key={label}>
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="break-words font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
