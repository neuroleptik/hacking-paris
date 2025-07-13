import * as React from 'react';
import { type Metadata } from 'next';
import { InfoIcon } from 'lucide-react';

import { AddContactButton } from '@/components/dashboard/contacts/add-contact-button';
import { ContactsDataTable } from '@/components/dashboard/contacts/contacts-data-table';
import { ContactsEmptyState } from '@/components/dashboard/contacts/contacts-empty-state';
import { ContactsFilters } from '@/components/dashboard/contacts/contacts-filters';
import { searchParamsCache } from '@/components/dashboard/contacts/contacts-search-params';
import { InvitationList } from '@/components/dashboard/settings/organization/members/invitation-list';
import { InvitationsCard } from '@/components/dashboard/settings/organization/members/invitations-card';
import { MembersCard } from '@/components/dashboard/settings/organization/members/members-card';
import {
  Page,
  PageActions,
  PageBody,
  PageHeader,
  PagePrimaryBar,
  PageSecondaryBar,
  PageTitle
} from '@/components/ui/page';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { getProfile } from '@/data/account/get-profile';
import { getContactTags } from '@/data/contacts/get-contact-tags';
import { getContacts } from '@/data/contacts/get-contacts';
import { getInvitations } from '@/data/invitations/get-invitations';
import { getMembers } from '@/data/members/get-members';
import { TransitionProvider } from '@/hooks/use-transition-context';
import { createTitle } from '@/lib/utils';
import type { NextPageProps } from '@/types/next-page-props';

import MembersLayout from '../settings/organization/members/layout';

export const metadata: Metadata = {
  title: createTitle('Members')
};

export type MembersLayoutProps = {
  team: React.ReactNode;
  invitations: React.ReactNode;
};

export default async function ContactsPage({
  searchParams
}: NextPageProps): Promise<React.JSX.Element> {
  const parsedSearchParams = await searchParamsCache.parse(searchParams);

  const [{ contacts, filteredCount, totalCount }, tags] = await Promise.all([
    getContacts(parsedSearchParams),
    getContactTags()
  ]);

  const profile = await getProfile();

  const members = await getMembers();

  const invitations = await getInvitations();

  const hasAnyMembers = members.length > 0;

  return (
    <div className="m-5 flex flex-col gap-5 w-2/3 mx-auto mt-10">
      <MembersCard
        members={members}
        profile={profile}
      />
      <InvitationsCard
        invitations={invitations}
        profile={profile}
      />
    </div>
  );
}
