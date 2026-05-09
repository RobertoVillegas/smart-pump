import Avatar from "boring-avatars";

const avatarColors = [
  "#5b1d99",
  "#0074b4",
  "#00b34c",
  "#ffd41f",
  "#fc6e3d",
] as const;

interface UserAvatarProps {
  name: string;
  size?: number;
}

export const UserAvatar = ({ name, size = 56 }: UserAvatarProps) => (
  <div
    aria-label={name}
    className="shrink-0 overflow-hidden rounded-md border bg-muted"
    role="img"
    style={{ height: size, width: size }}
  >
    <Avatar
      colors={[...avatarColors]}
      name={name}
      size={size}
      square
      variant="marble"
    />
  </div>
);
