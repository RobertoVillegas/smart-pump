import type { UserProfile } from "@smart-pump/contracts/users";

interface ProfileCardProps {
  user: UserProfile;
}

export const ProfileCard = ({ user }: ProfileCardProps) => {
  const rows = [
    ["Email", user.email],
    ["Company", user.company],
    ["Phone", user.phone],
    ["Address", user.address],
    ["Age", String(user.age)],
    ["Eye color", user.eyeColor],
  ] as const;

  return (
    <section className="rounded-lg border bg-card p-5">
      <div className="flex items-start gap-4">
        <img
          alt={`${user.firstName} ${user.lastName}`}
          className="size-14 rounded-md border bg-muted object-cover"
          src={user.picture}
        />
        <div className="min-w-0">
          <h2 className="font-heading font-semibold text-xl">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-muted-foreground text-sm">
            {user.isActive ? "Active account" : "Inactive account"}
          </p>
        </div>
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
