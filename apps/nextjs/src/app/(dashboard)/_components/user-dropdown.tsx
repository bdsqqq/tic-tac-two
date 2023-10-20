"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@haxiom/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@haxiom/ui/dropdown-menu";
import { User } from "@haxiom/ui/icons";
import { toast } from "@haxiom/ui/use-toast";
import { useTheme } from "next-themes";
import Link from "next/link";

const THEMES = [
  {
    label: "Light",
    value: "light",
  },
  {
    label: "Dark",
    value: "dark",
  },
  {
    label: "System",
    value: "system",
  },
]

export const UserDropdown = ({className}: {className: string}) => {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback className="bg-transparent">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={0} align="end" side="bottom">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          {THEMES.map(({ label, value }) => (
            <DropdownMenuCheckboxItem key={value} checked={value === theme} onClick={() => setTheme(value)}>
            {label}
          </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="settings/profile">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            toast({
              title: "Pretend you're logged out",
              description:
                "I didn't implement auth lol, this is a frontend demo.",
            });
          }}
        >
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};