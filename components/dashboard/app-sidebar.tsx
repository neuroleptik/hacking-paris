'use client';

import * as React from 'react';
import Image from 'next/image';

import { getCHZBalance } from '@/actions/crypto/get-ballance';
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
import { cn } from '@/lib/utils';
import type { FavoriteDto } from '@/types/dtos/favorite-dto';
import type { ProfileDto } from '@/types/dtos/profile-dto';

import { Badge } from '../ui/badge';

export type AppSidebarProps = {
  favorites: FavoriteDto[];
  profile: ProfileDto;
  chzBalance: string;
};

export function AppSidebar({
  favorites,
  profile,
  chzBalance
}: AppSidebarProps): React.JSX.Element {
  const sidebar = useSidebar();
  const xlUp = useMediaQuery(MediaQueries.XlUp, { ssr: true, fallback: true });
  const isCollapsed = !sidebar.isMobile && !sidebar.open;
  const showLogo = !isCollapsed || !xlUp;

  React.useEffect(() => {
    sidebar.setOpen(xlUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xlUp]);
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div
          className={cn(
            'flex h-10 w-full flex-row items-center justify-between',
            !isCollapsed && 'pl-0.5'
          )}
        >
          {showLogo && (
            <Logo className="truncate transition-[width,height,padding]" />
          )}
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
          className="h-full [&>[data-radix-scroll-area-viewport]>div]:!flex [&>[data-radix-scroll-area-viewport]>div]:h-full [&>[data-radix-scroll-area-viewport]>div]:flex-col"
        >
          <Badge className="text-md text-muted-foreground mx-1 bg-green-500/10 text-green-500 hover:bg-green-500/10 hover:text-green-500 hover:cursor-default gap-1">
            <Image
              src="/chiliz.png"
              alt="CHZ"
              width={20}
              height={20}
              className="ml-1"
            />
            <span className="text-primary ml-1">{chzBalance}</span> CHZ
          </Badge>
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
