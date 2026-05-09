import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { cn } from "@workspace/ui/lib/utils";
import Avatar from "boring-avatars";
import {
  BadgeCheckIcon,
  ChevronsUpDownIcon,
  LogOutIcon,
  PencilIcon,
} from "lucide-react";

interface NavUserProps {
  email: string;
  isSigningOut?: boolean;
  name: string;
  onSignOut: () => void;
}

const UserMark = ({ name, size = 32 }: { name: string; size?: number }) => (
  <span
    aria-hidden="true"
    className="shrink-0 overflow-hidden rounded-full"
    style={{ height: size, width: size }}
  >
    <Avatar name={name} size={size} variant="marble" />
  </span>
);

export const NavUser = ({
  email,
  isSigningOut = false,
  name,
  onSignOut,
}: NavUserProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger
      aria-label="Open account menu"
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "h-auto min-w-0 justify-start gap-2 px-2 py-1.5"
      )}
      disabled={isSigningOut}
    >
      <UserMark name={name} />
      <span className="hidden min-w-0 text-left leading-tight sm:grid">
        <span className="truncate font-medium text-sm">{name}</span>
        <span className="truncate text-muted-foreground text-xs">{email}</span>
      </span>
      <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-64">
      <DropdownMenuGroup>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5">
            <UserMark name={name} />
            <div className="min-w-0 leading-tight">
              <p className="truncate font-medium text-sm">{name}</p>
              <p className="truncate text-muted-foreground text-xs">{email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem closeOnClick={false}>
          <Link className="flex flex-1 items-center gap-2" to="/app">
            <BadgeCheckIcon aria-hidden="true" />
            Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem closeOnClick={false}>
          <Link className="flex flex-1 items-center gap-2" to="/app/edit">
            <PencilIcon aria-hidden="true" />
            Edit details
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        disabled={isSigningOut}
        onClick={onSignOut}
        variant="destructive"
      >
        <LogOutIcon aria-hidden="true" />
        Sign out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
