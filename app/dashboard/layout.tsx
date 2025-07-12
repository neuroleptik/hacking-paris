import * as React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getAllTokensBalance } from '@/actions/crypto/get-ballance';
import { getTokenPools } from '@/actions/crypto/get-token-pools';
import { SidebarRenderer } from '@/components/dashboard/sidebar-renderer';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Routes } from '@/constants/routes';
import { getProfile } from '@/data/account/get-profile';
import { getFavorites } from '@/data/favorites/get-favorites';
import { dedupedAuth } from '@/lib/auth';
import { getLoginRedirect } from '@/lib/auth/redirect';
import { checkSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { TokensProvider } from '@/lib/providers/tokens-provider';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Dashboard')
};

export default async function DashboardLayout({
  children
}: React.PropsWithChildren): Promise<React.JSX.Element> {
  const session = await dedupedAuth();
  if (!checkSession(session)) {
    return redirect(getLoginRedirect());
  }

  const userFromDb = await prisma.user.findFirst({
    where: { id: session.user.id },
    select: {
      completedOnboarding: true,
      organization: {
        select: {
          completedOnboarding: true
        }
      }
    }
  });
  if (
    !userFromDb!.completedOnboarding ||
    !userFromDb!.organization!.completedOnboarding
  ) {
    // return redirect(Routes.Onboarding);
  }

  const [favorites, profile, tokensResponse, tokenPoolsResponse] =
    await Promise.all([
      getFavorites(),
      getProfile(),
      getAllTokensBalance(),
      getTokenPools()
    ]);

  const tokens =
    tokensResponse?.data?.map((token) => ({
      balance: String(token.balance),
      symbol: token.symbol
    })) || [];

  return (
    <div className="flex h-screen overflow-hidden">
      <TokensProvider
        initialTokens={tokens}
        initialTokenPools={tokenPoolsResponse?.data || []}
      >
        <SidebarProvider>
          <SidebarRenderer
            favorites={favorites}
            profile={profile}
            allTokensBalance={tokens}
          />
          {/* Set max-width so full-width tables can overflow horizontally correctly */}
          <SidebarInset
            id="skip"
            className="size-full lg:[transition:max-width_0.2s_linear] lg:peer-data-[state=collapsed]:max-w-[calc(100vw-var(--sidebar-width-icon))] lg:peer-data-[state=expanded]:max-w-[calc(100vw-var(--sidebar-width))]"
          >
            {children}
          </SidebarInset>
        </SidebarProvider>
      </TokensProvider>
    </div>
  );
}
