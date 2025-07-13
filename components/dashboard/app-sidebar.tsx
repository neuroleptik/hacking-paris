'use client';

import * as React from 'react';
import Image from 'next/image';
import NiceModal from '@ebay/nice-modal-react';
import { InfoIcon } from 'lucide-react';

import { CreateTokenPoolModal } from '@/components/dashboard/crypto/create-token-pool-modal';
// import { getCHZBalance } from '@/actions/crypto/get-ballance';
import { NavFavorites } from '@/components/dashboard/nav-favorites';
import { NavMain } from '@/components/dashboard/nav-main';
import { NavSupport } from '@/components/dashboard/nav-support';
import { NavUser } from '@/components/dashboard/nav-user';
import { Logo } from '@/components/ui/logo';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { MediaQueries } from '@/constants/media-queries';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useTokens } from '@/lib/providers/tokens-provider';
import { cn } from '@/lib/utils';
import type { FavoriteDto } from '@/types/dtos/favorite-dto';
import type { ProfileDto } from '@/types/dtos/profile-dto';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export type AppSidebarProps = {
  favorites: FavoriteDto[];
  profile: ProfileDto;
  allTokensBalance: {
    balance: string;
    symbol: string;
  }[];
};

export function AppSidebar({
  favorites,
  profile,
  allTokensBalance
}: AppSidebarProps): React.JSX.Element {
  const { tokenPools } = useTokens();
  console.log(tokenPools);
  const sidebar = useSidebar();
  const xlUp = useMediaQuery(MediaQueries.XlUp, { ssr: true, fallback: true });
  const isCollapsed = !sidebar.isMobile && !sidebar.open;
  const showLogo = !isCollapsed || !xlUp;

  React.useEffect(() => {
    sidebar.setOpen(xlUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xlUp]);

  const handleCreatePool = () => {
    NiceModal.show(CreateTokenPoolModal);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div
          className={cn(
            'flex h-10 w-full flex-row items-center justify-between',
            !isCollapsed && 'pl-0.5'
          )}
        >
          {showLogo && <Logo className="transition-[width,height,padding]" />}
          {xlUp && (
            <SidebarTrigger
              icon={isCollapsed ? 'menu' : 'chevronLeft'}
              className="shrink-0 rounded-full text-muted-foreground"
            />
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <ScrollArea
          verticalScrollBar
          /* Overriding the hardcoded { disply:table } to get full flex height */
          className="h-full  [&>[data-radix-scroll-area-viewport]>div]:!flex [&>[data-radix-scroll-area-viewport]>div]:h-full [&>[data-radix-scroll-area-viewport]>div]:flex-col"
        >
          <div className="mb-3 ms-2 mt-2 flex flex-row gap-2">
            Team Fan Token Pool
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <InfoIcon className="hidden size-3 shrink-0 text-muted-foreground sm:inline" />
              </TooltipTrigger>
              <TooltipContent>
                You can create a fan token pool for your team and stack your
                tokens together.
              </TooltipContent>
            </Tooltip>
          </div>
          {tokenPools &&
            tokenPools.length > 0 &&
            tokenPools.map((pool) => (
              <Badge className="text-md mx-1 mb-2 gap-1 bg-green-500/10 text-green-500 text-muted-foreground hover:cursor-default hover:bg-green-500/10 hover:text-green-500">
                {pool.symbol}
              </Badge>
            ))}
          <Button
            className="mx-2 mb-2"
            onClick={handleCreatePool}
          >
            Add Fan Token Pool
          </Button>

          <NavMain />
          <NavFavorites favorites={favorites} />
          <NavSupport
            profile={profile}
            className="mt-auto pb-0"
          />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          profile={profile}
          className="p-0"
        />
      </SidebarFooter>
    </Sidebar>
  );
}
