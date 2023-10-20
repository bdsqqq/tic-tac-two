import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@haxiom/ui/dropdown-menu';
import { toast } from '@haxiom/ui/use-toast';
import type { ComponentProps, ReactNode } from 'react';
import { NewOrganizationDialog } from './new-organization-dialog';
import { DialogTrigger } from '@haxiom/ui/dialog';

const MOCK_ORGS = [
  {
    id: 'axiomers-auhe',
    name: 'Axiomers',
  },
  {
    id: 'hej-do-jj3l',
    name: 'Hej do',
  },
];

export const MOCK_CURRENT_ORG = MOCK_ORGS[0];

/**
 * Use this a a controlled component or provide a DropdownMenuTrigger as a child to this component.
 */
export const OrgDropdown = ({ children, ...rest }: { children?: ReactNode } & ComponentProps<typeof DropdownMenu>) => {
  return (
    <NewOrganizationDialog>
      <DropdownMenu {...rest}>
        {children}
        <DropdownMenuContent sideOffset={0} align="end" side="bottom">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{MOCK_ORGS.length} Organizations</DropdownMenuLabel>
            {MOCK_ORGS.map((org) => (
              <DropdownMenuCheckboxItem
                checked={MOCK_CURRENT_ORG?.id === org.id}
                key={org.id}
                onClick={() => {
                  toast({
                    title: 'Pretend you switched orgs',
                    description: "If you're seeing this, I didn't get through all my TODOs.",
                  });
                }}
              >
                {org.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <DialogTrigger>Create Organization</DialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </NewOrganizationDialog>
  );
};
