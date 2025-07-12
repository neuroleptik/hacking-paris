import * as React from 'react';
import { UsersIcon } from 'lucide-react';

import { AddContactButton } from '@/components/dashboard/contacts/add-contact-button';
import { EmptyState } from '@/components/ui/empty-state';
import { ProfileDto } from '@/types/dtos/profile-dto';

export function ContactsEmptyState({
  profile
}: {
  profile: ProfileDto;
}): React.JSX.Element {
  return (
    <div className="p-6">
      <EmptyState
        icon={
          <div className="flex size-12 items-center justify-center rounded-md border">
            <UsersIcon className="size-6 shrink-0 text-muted-foreground" />
          </div>
        }
        title="No members yet"
        description="Add members to your Team and they will show up here."
      >
        <AddContactButton profile={profile} />
      </EmptyState>
    </div>
  );
}
