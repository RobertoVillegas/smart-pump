import Avatar from "boring-avatars";

interface UserAvatarProps {
  name: string;
  size?: number;
}

export const UserAvatar = ({ name, size = 56 }: UserAvatarProps) => (
  <div
    aria-label={name}
    className="shrink-0 overflow-hidden rounded-full"
    role="img"
    style={{ height: size, width: size }}
  >
    <Avatar name={name} size={size} variant="marble" />
  </div>
);
