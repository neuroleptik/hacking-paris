import {
  BellIcon,
  CodeIcon,
  CreditCardIcon,
  LockKeyholeIcon,
  SettingsIcon,
  StoreIcon,
  UserIcon,
  UserPlus2Icon,
  UsersIcon,
  Volleyball
} from 'lucide-react';

import { Routes } from '@/constants/routes';
import type { NavItem } from '@/types/nav-item';

export const mainNavItems: NavItem[] = [
  {
    title: 'Clubs',
    href: Routes.Home,
    icon: Volleyball
  },
  {
    title: 'Members',
    href: Routes.Contacts,
    icon: UsersIcon
  },
  {
    title: 'Settings',
    href: Routes.Settings,
    icon: SettingsIcon
  }
];

export const accountNavItems: NavItem[] = [
  {
    title: 'Profile',
    href: Routes.Profile,
    icon: UserIcon
  },
  {
    title: 'Security',
    href: Routes.Security,
    icon: LockKeyholeIcon
  },
  {
    title: 'Notifications',
    href: Routes.Notifications,
    icon: BellIcon
  }
];

export const organizationNavItems: NavItem[] = [
  {
    title: 'Information',
    href: Routes.OrganizationInformation,
    icon: StoreIcon
  },
  {
    title: 'Members',
    href: Routes.Members,
    icon: UserPlus2Icon
  },
  {
    title: 'Billing',
    href: Routes.Billing,
    icon: CreditCardIcon
  },
  {
    title: 'Developers',
    href: Routes.Developers,
    icon: CodeIcon
  }
];
