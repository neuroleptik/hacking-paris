'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';

const LogoIcon = () => (
  <div
    className={cn(
      'size-8 rounded-full border border-neutral-400 bg-black',
      'inline-flex items-center justify-center border-solid', // Changed to flex for alignment
      '[border-image-source:linear-gradient(180deg,#1F1F1F_0%,#858585_100%),linear-gradient(180deg,#1F1F1F_0%,#858585_100%)]',
      '[background:linear-gradient(0deg,#151515,#151515),linear-gradient(180deg,rgba(21,21,21,0)_66.3%,rgba(255,255,255,0.5)_100%),linear-gradient(183.22deg,rgba(255,255,255,0.5)_2.62%,rgba(21,21,21,0)_52.03%)]',
      'shadow-[inset_0px_6px_8px_0px_#FAFAFA40,inset_0px_-6px_8px_0px_#FAFAFA40,0px_0px_0px_0px_#FAFAFA40,0px_0px_0px_0px_#FAFAFA40]',
      'text-white'
    )}
  />
);

export const Logo = () => {
  return (
    <Link
      href="/"
      className="relative z-20 flex shrink-0 items-center gap-2 px-2 py-1 text-sm font-normal text-black"
    >
      <LogoIcon />

      <span className="font-medium text-white">War Club</span>
    </Link>
  );
};
