import * as React from 'react';
import { type Metadata } from 'next';
import Link from 'next/link';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { InfoIcon } from 'lucide-react';

import { getClubs } from '@/actions/crypto/get-clubs';
import { HomeFilters } from '@/components/dashboard/home/home-filters';
import { HomeSpinner } from '@/components/dashboard/home/home-spinner';
import { ClubList } from '@/components/home/club-list';
import { XIcon } from '@/components/ui/brand-icons';
import { buttonVariants } from '@/components/ui/button';
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
import { TransitionProvider } from '@/hooks/use-transition-context';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Home')
};

export type HomeLayoutProps = {
  leadGeneration: React.ReactNode;
  mostVisitedContacts: React.ReactNode;
  leastVisitedContacts: React.ReactNode;
};

export default async function HomeLayout({
  leadGeneration,
  mostVisitedContacts,
  leastVisitedContacts
}: HomeLayoutProps): Promise<React.JSX.Element> {
  return (
    <TransitionProvider>
      <Page>
        <PageHeader>
          <PagePrimaryBar>
            <div className="flex flex-row items-center gap-1">
              <PageTitle>Clubs Ranking</PageTitle>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <InfoIcon className="hidden size-3 shrink-0 text-muted-foreground sm:inline" />
                </TooltipTrigger>
                <TooltipContent>
                  Clubs ranking based on the number of members transactions
                </TooltipContent>
              </Tooltip>
            </div>
          </PagePrimaryBar>
          {/* <PageSecondaryBar><HomeFilters /></PageSecondaryBar> */}
        </PageHeader>
        <PageBody>
          <ClubList />
          <HomeSpinner />
        </PageBody>
      </Page>
    </TransitionProvider>
  );
}
