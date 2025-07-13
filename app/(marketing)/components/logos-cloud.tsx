'use client';

import React from 'react';
import Image from 'next/image';
import Chiliz from '@/public/images/chiliz-logo.png';
import PSG from '@/public/images/psg-logo.png';
import Socios from '@/public/images/socios-logo.png';
import Balancer from 'react-wrap-balancer';

import { cn } from '@/lib/utils';

export function SpotlightLogoCloud() {
  const logos = [
    {
      name: 'Chiliz',
      src: Chiliz
    },
    {
      name: 'Socios',
      src: Socios
    },
    {
      name: 'PSG',
      src: PSG
    }
  ];

  return (
    <div className="relative w-full overflow-hidden py-12 md:py-20">
      <div className="relative z-20 mx-auto mb-4 max-w-4xl text-balance px-4 text-center text-lg font-semibold tracking-tight text-black dark:text-white md:text-3xl">
        <Balancer>
          <h2 className={cn('inline-block ')}>Powered by Club Partners</h2>
        </Balancer>
      </div>
      <p className="mx-auto mb-8 mt-4 max-w-lg px-4 text-center font-sans text-base text-neutral-500 md:mb-10 md:text-lg">
        Join the global network of clubs and fans already competing in the
        ultimate fan loyalty platform
      </p>
      <div className="relative mx-auto grid w-full max-w-3xl grid-cols-2 gap-6 px-4 sm:grid-cols-3 md:grid-cols-3 md:gap-10">
        {logos.map((logo, idx) => (
          <div
            key={logo.src.toString() + idx}
            className="flex items-center justify-center"
          >
            <Image
              src={logo.src}
              alt={logo.name}
              width={300}
              height={300}
              className={cn(
                'w-full max-w-[200px] select-none object-contain',
                logo.name === 'Socios' && 'invert',
                logo.name === 'PSG' && 'max-w-[125px]'
              )}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
