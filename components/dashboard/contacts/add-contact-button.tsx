'use client';

import * as React from 'react';
import NiceModal from '@ebay/nice-modal-react';

import { AddContactModal } from '@/components/dashboard/contacts/add-contact-modal';
import { Button } from '@/components/ui/button';
import { ProfileDto } from '@/types/dtos/profile-dto';

import { InviteMemberModal } from '../settings/organization/members/invite-member-modal';

export function AddContactButton({
  profile
}: {
  profile: ProfileDto;
}): React.JSX.Element {
  const handleShowInviteMemberModal = (): void => {
    NiceModal.show(InviteMemberModal, { profile });
  };
  return (
    <Button
      type="button"
      variant="default"
      size="default"
      className="whitespace-nowrap"
      onClick={handleShowInviteMemberModal}
    >
      Invite Member
    </Button>
  );
}
