'use client';

import React, { useEffect, useState } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';

import { cn } from '@/lib/utils';

import { IconGift } from '../icons/gift';
import { Button } from './button';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

export enum planType {
  basic = 'basic',
  lifetime = 'lifetime',
  yearly = 'yearly'
}

export type Plan = {
  id: string;
  name: string;
  shortDescription: string;
  badge?: string;
  price: number;
  originalPrice?: number;
  period: string;
  features: {
    text: string;
    included: boolean;
  }[];
  buttonText: string;
  subText?: string | React.ReactNode;
  onClick: () => void;
};

const plans: Array<Plan> = [
  {
    id: planType.basic,
    name: 'Fan',
    shortDescription: 'Start Your Journey',
    badge: '',
    price: 0,
    period: 'free',
    features: [
      { text: 'Stack tokens for your club', included: true },
      { text: 'Join fan organizations', included: true },
      { text: 'View club rankings', included: true },
      { text: 'Advanced analytics', included: false },
      { text: 'Premium rewards', included: false }
    ],
    buttonText: 'Join as Fan',
    subText: 'Start supporting your club today!',
    onClick: () => {
      console.log('Get Fan');
    }
  },
  {
    id: planType.lifetime,
    name: 'Champion ✦',
    shortDescription: 'Ultimate Fan Experience',
    badge: 'MOST POPULAR',
    price: 99,
    originalPrice: 199,
    period: 'lifetime',
    features: [
      { text: 'All Fan features included', included: true },
      { text: 'Advanced stacking analytics', included: true },
      { text: 'Priority in organizations', included: true },
      { text: 'Exclusive club rewards', included: true },
      { text: 'Early access to new features', included: true }
    ],
    buttonText: 'Become Champion',
    subText: (
      <div className="flex items-center justify-center gap-1">
        <IconGift />
        50% off for early supporters!
      </div>
    ),
    onClick: () => {
      console.log('Get Champion');
    }
  },
  {
    id: planType.yearly,
    name: 'Legend ✦',
    shortDescription: 'Elite Fan Status',
    price: 49,
    originalPrice: 99,
    period: 'yearly',
    features: [
      { text: 'All Champion features', included: true },
      { text: 'VIP organization access', included: true },
      { text: 'Exclusive club partnerships', included: true },
      { text: 'Premium token bonuses', included: true },
      { text: 'Direct club communication', included: true }
    ],
    buttonText: 'Join Legends',
    subText: 'For the ultimate club supporters',
    onClick: () => {
      console.log('Get Legend');
    }
  }
];

// Mobile Card Component
const MobileCard = ({ plan }: { plan: Plan }) => {
  return (
    <div className="mb-4 last:mb-0">
      <div className="rounded-xl bg-neutral-900 p-4">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-white">{plan.name}</h3>
            <p className="text-sm text-neutral-400">{plan.shortDescription}</p>
          </div>
          <div className="text-right">
            {plan.originalPrice && (
              <div className="text-xs text-neutral-500 line-through">
                ${plan.originalPrice}
              </div>
            )}
            <div className="text-xl font-bold text-white">${plan.price}</div>
            <div className="text-xs text-neutral-400">{plan.period}</div>
          </div>
        </div>

        <div className="mb-4 space-y-2">
          {plan.features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2"
            >
              {feature.included ? (
                <IconCheck className="size-4 text-neutral-400" />
              ) : (
                <IconX className="size-4 text-neutral-600" />
              )}
              <span
                className={cn(
                  'text-xs',
                  feature.included ? 'text-neutral-300' : 'text-neutral-500'
                )}
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        <Button
          onClick={plan.onClick}
          className={cn(
            'w-full rounded-lg py-2 text-sm',
            plan.id === planType.basic
              ? 'bg-gradient-to-b from-neutral-700 to-neutral-800'
              : '!bg-[linear-gradient(180deg,#B6B6B6_0%,#313131_100%)]'
          )}
        >
          {plan.buttonText}
        </Button>

        {plan.subText && (
          <p className="mt-2 text-center text-xs text-neutral-500">
            {plan.subText}
          </p>
        )}
      </div>
    </div>
  );
};

// Desktop Card Component
const DesktopCard = ({ plan }: { plan: Plan }) => {
  return (
    <div
      className={cn(
        'rounded-3xl bg-neutral-900 p-8 ring-1 ring-neutral-700',
        plan.badge && 'ring-1 ring-neutral-700'
      )}
    >
      {plan.badge && (
        <div className="-mt-12 mb-6 text-center">
          <span className="rounded-[128px] bg-gradient-to-b from-[#393939] via-[#141414] to-[#303030] px-4 py-1 text-sm text-white shadow-[0px_2px_6.4px_0px_rgba(0,0,0,0.60)]">
            {plan.badge}
          </span>
        </div>
      )}
      <div className="flex h-full flex-col">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center rounded-[10px] border border-[rgba(62,62,64,0.77)] bg-[rgba(255,255,255,0)] p-2 font-bold">
            <h3 className="text-sm text-white">{plan.name}</h3>
          </div>
          <div>
            <p className="text-md my-4 text-neutral-400">
              {plan.shortDescription}
            </p>
          </div>
          <div className="mt-4">
            {plan.originalPrice && (
              <span className="mr-2 text-neutral-500 line-through">
                ${plan.originalPrice}
              </span>
            )}
            <span className="text-5xl font-bold text-white">${plan.price}</span>
            <span className="ml-2 text-neutral-400">{plan.period}</span>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          {plan.features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3"
            >
              {feature.included ? (
                <IconCheck className="size-5 text-neutral-400" />
              ) : (
                <IconX className="size-5 text-neutral-600" />
              )}
              <span
                className={cn(
                  'text-sm',
                  feature.included ? 'text-neutral-300' : 'text-neutral-500'
                )}
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <Button
            onClick={plan.onClick}
            className={cn(
              'w-full rounded-xl py-3',
              plan.id === planType.basic
                ? 'bg-gradient-to-b from-neutral-700 to-neutral-800 hover:from-neutral-600 hover:to-neutral-700'
                : '!bg-[linear-gradient(180deg,#B6B6B6_0%,#313131_100%)] hover:shadow-[0_4px_12px_0px_rgba(0,0,0,0.4)]'
            )}
          >
            {plan.buttonText}
          </Button>
          {plan.subText && (
            <div className="mt-4 text-center text-sm text-neutral-500">
              {plan.subText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export function PricingList() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <div className="w-full p-4">
        <div className="mx-auto max-w-md">
          {plans.map((tier) => (
            <MobileCard
              plan={tier}
              key={tier.id}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
        {plans.map((tier) => (
          <DesktopCard
            plan={tier}
            key={tier.id}
          />
        ))}
      </div>
    </div>
  );
}

export function Pricing() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div
      id="pricing"
      className="relative isolate w-full overflow-hidden px-4 py-16 pt-10 md:py-40 md:pt-60 lg:px-4"
    >
      {!isMobile && (
        <div className="mt-[600px] pt-32 md:pt-48">
          <BackgroundShape />
        </div>
      )}
      <div
        className={cn(
          'z-20',
          isMobile ? 'relative mt-0 flex flex-col' : 'absolute inset-0 mt-80'
        )}
      >
        <div
          className={cn(
            'relative z-50 mx-auto mb-4',
            isMobile ? 'w-full' : 'max-w-4xl text-center'
          )}
        >
          <h2
            className={cn(
              'inline-block bg-[radial-gradient(61.17%_178.53%_at_38.83%_-13.54%,#3B3B3B_0%,#888787_12.61%,#FFFFFF_50%,#888787_80%,#3B3B3B_100%)] text-3xl md:text-6xl ',
              'bg-clip-text text-transparent'
            )}
          >
            Choose Your Plan
          </h2>
        </div>
        <p
          className={cn(
            'mt-4 px-4 text-sm text-neutral-400',
            isMobile ? 'w-full' : 'mx-auto max-w-lg text-center'
          )}
        >
          Choose your level of commitment and unlock exclusive features to
          support your club like never before.
        </p>
        <div className="mx-auto mt-12 md:mt-20">
          <PricingList />
        </div>
      </div>
      {!isMobile && (
        <div
          className="absolute inset-0 rounded-[20px]"
          style={{
            background:
              'linear-gradient(179.87deg, rgba(0, 0, 0, 0) 0.11%, rgba(0, 0, 0, 0.8) 69.48%, #000000 92.79%)'
          }}
        />
      )}
    </div>
  );
}

function BackgroundShape() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const size = isMobile ? 600 : 1400;
  const innerSize = isMobile ? 400 : 1000;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(255,255,255,0.1)]"
        style={{
          width: size,
          height: size,
          clipPath: 'circle(50% at 50% 50%)',
          background: `
            radial-gradient(
              circle at center,
              rgba(40, 40, 40, 0.8) 0%,
              rgba(20, 20, 20, 0.6) 30%,
              rgba(0, 0, 0, 0.4) 70%
            )
          `
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: isMobile ? '20px 40px' : '60px 120px'
          }}
        />
      </div>
      <div
        className="z-2 absolute left-1/2 top-1/2 -translate-x-1/2 
          -translate-y-1/2 rounded-full border 
          border-[rgba(255,255,255,0.1)] bg-black
          shadow-[0_0_200px_80px_rgba(255,255,255,0.1)]"
        style={{
          width: innerSize,
          height: innerSize
        }}
      />
    </div>
  );
}
