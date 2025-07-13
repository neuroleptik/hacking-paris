'use client';

import Link from 'next/link';
import { Swords } from 'lucide-react';

export const Logo = () => {
  return (
    <Link
      href="/"
      className="relative z-20 flex shrink-0 items-center gap-2 px-2 py-1 text-sm font-normal text-black"
    >
      <Swords className="size-6 text-white" />
      <span className="font-medium text-white">Club War</span>
    </Link>
  );
};
