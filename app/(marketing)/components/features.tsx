'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import ArsenalBadge from '@/public/images/arsenal.png';
import ASRomaBadge from '@/public/images/as_roma.png';
import AthleticoMadridBadge from '@/public/images/atletico_de_madrid.png';
import BarcelonaBadge from '@/public/images/barcelona.png';
import CoinbaseWalletLogo from '@/public/images/coinbase.png';
import InterMilanBadge from '@/public/images/inter_milan.png';
import JuventusBadge from '@/public/images/juv.png';
import KeplrLogo from '@/public/images/keplr.png';
import LeafLogo from '@/public/images/leaf.png';
import ManchesterCityBadge from '@/public/images/manchester_city.png';
import MetaMaskLogo from '@/public/images/metamask.png';
import TottenhamHotspurBadge from '@/public/images/tottenham.png';
import TrustWalletLogo from '@/public/images/trust.png';
import JB from '@/public/marketing/jb.jpeg';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';

import { GlowingEffect } from './ui/glowing-effect';

export function Features() {
  return (
    <div
      id="product"
      className="mx-auto w-full max-w-7xl p-4 md:my-20 md:px-8 md:py-20"
    >
      <div className="relative z-20 mx-auto mb-4 max-w-4xl text-balance text-center text-lg font-semibold tracking-tight text-neutral-300 md:text-3xl">
        <h2
          className={cn(
            'inline-block bg-[radial-gradient(61.17%_178.53%_at_38.83%_-13.54%,#3B3B3B_0%,#888787_12.61%,#FFFFFF_50%,#888787_80%,#3B3B3B_100%)] text-3xl md:text-6xl',
            'bg-clip-text text-transparent'
          )}
        >
          Platform Features
        </h2>
      </div>
      <p className="mx-auto mt-4 max-w-lg text-center text-sm text-neutral-400">
        Discover the tools that power the ultimate fan loyalty platform—from
        token stacking to club rankings and organizational rewards.
      </p>
      <div className="cols-1  mx-auto mt-20 grid max-w-3xl auto-rows-[25rem] gap-4 lg:max-w-none lg:grid-cols-5">
        <Card className="relative flex flex-col justify-between lg:col-span-2">
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/3">
            <LogoOrbit />
          </div>
          <CardContent className="absolute bottom-0 h-40">
            <CardTitle>
              Token Stacking
              <br /> System
            </CardTitle>
            <CardDescription>
              Stack tokens with fellow fans to boost your club&apos;s power and
              climb the global rankings together.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="relative flex flex-col justify-between lg:col-span-3">
          <CardContent className="h-40">
            <CardTitle>Global Club Rankings</CardTitle>
            <CardDescription>
              Compete with clubs worldwide in our dynamic ranking system. Track
              your club&apos;s progress through leagues and tiers.
            </CardDescription>
          </CardContent>
          <div className="relative size-full">
            <ClubRankings />
          </div>
        </Card>
        <Card className="relative flex flex-col justify-between lg:col-span-3">
          <h1
            className={cn(
              'absolute right-0 top-0 inline-block bg-[radial-gradient(61.17%_178.53%_at_38.83%_-13.54%,#3B3B3B_0%,#888787_12.61%,#FFFFFF_50%,#888787_80%,#3B3B3B_100%)] bg-clip-text p-6 text-right text-xl text-transparent md:text-6xl'
            )}
          >
            100K+
            <br />
            Fans
          </h1>
          <CardSkeletonBody>
            <div className="relative top-20 flex h-[300px] w-full flex-col items-start overflow-hidden rounded-lg md:top-10 md:shadow-xl">
              <IconsList />
            </div>
          </CardSkeletonBody>
          <CardContent className="relative mb-4 h-40">
            <CardTitle>
              Growing Fan <br /> Community
            </CardTitle>
            <CardDescription>
              Join thousands of passionate fans already stacking tokens and
              competing for their favorite clubs worldwide.
            </CardDescription>
          </CardContent>
          <div className="absolute bottom-4 right-4 opacity-10 md:opacity-100">
            <PeopleGrid />
          </div>
        </Card>

        <Card className="flex flex-col justify-between lg:col-span-2">
          <CardContent className="h-40">
            <CardTitle>
              Fan <br /> Organizations
            </CardTitle>
            <CardDescription>
              Create or join fan organizations to maximize your impact. Unite
              with other supporters to boost your club&apos;s ranking power.
            </CardDescription>
          </CardContent>
          <CardSkeletonBody>
            <div className="mt-6 size-full rounded-lg p-4 px-10">
              <FanOrganizations />
            </div>
          </CardSkeletonBody>
        </Card>
      </div>
    </div>
  );
}

export const SkeletonTwo = () => {
  return (
    <div className="relative mt-10  flex h-60 flex-col items-center bg-transparent md:h-60" />
  );
};

// Card structure
const CardSkeletonBody = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('relative size-full overflow-hidden', className)}>
      {children}
    </div>
  );
};

const CardContent = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn('p-6', className)}>{children}</div>;
};

const CardTitle = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        'inline-block bg-[radial-gradient(61.17%_178.53%_at_38.83%_-13.54%,#3B3B3B_0%,#888787_12.61%,#FFFFFF_50%,#888787_80%,#3B3B3B_100%)] bg-clip-text text-xl  text-transparent md:text-4xl',
        className
      )}
    >
      {children}
    </h3>
  );
};
const CardDescription = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        'mt-2 max-w-sm font-sans text-sm font-normal tracking-tight text-neutral-400',
        className
      )}
    >
      {children}
    </p>
  );
};

const Card = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      whileHover="animate"
      className={cn(
        'group relative isolate flex flex-col overflow-hidden rounded-2xl bg-neutral-900 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]',
        className
      )}
    >
      <GlowingEffect
        spread={60}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={5}
        blur={10}
      />
      {children}
    </motion.div>
  );
};
const IconsList = () => {
  const commonStyles = useMemo(
    () =>
      'rounded-[13px] w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex-[1_0_0] bg-[linear-gradient(0deg,#333_0%,#333_100%),radial-gradient(297.31%_124.05%_at_91.1%_3.42%,#3B3B3B_0%,#232323_27.05%,#0A0A0A_100%)] flex items-center justify-center',
    []
  );

  const icons = useMemo(
    () => [
      { Icon: MetaMaskLogo, delay: 0 },
      { Icon: TrustWalletLogo, delay: 0.25 },
      { Icon: CoinbaseWalletLogo, delay: 0.5 },
      { Icon: KeplrLogo, delay: 0.75 },
      { Icon: LeafLogo, delay: 1 }
    ],
    []
  );

  const IconComponents = useMemo(
    () =>
      icons.map(({ Icon }, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          transition={{
            duration: 0.6
          }}
          className={commonStyles}
        >
          <Image
            src={Icon}
            alt={Icon.toString()}
            width={32}
            height={32}
            className="size-6 text-neutral-200 dark:text-neutral-200 md:size-10"
          />
        </motion.div>
      )),
    [icons, commonStyles]
  );

  return (
    <div className="inline-flex items-center gap-[6px] rounded-[0px_20px_20px_0px] bg-[linear-gradient(88deg,#161616_0.35%,#292929_98.6%)] p-[6px] shadow-[0px_112px_31px_0px_rgba(0,0,0,0.02),0px_71px_29px_0px_rgba(0,0,0,0.13),0px_40px_24px_0px_rgba(0,0,0,0.45),0px_18px_18px_0px_rgba(0,0,0,0.77),0px_4px_10px_0px_rgba(0,0,0,0.88)] md:gap-[11px] md:p-[9px]">
      {IconComponents}
    </div>
  );
};

type Organization = {
  id: number;
  name: string;
  club: string;
  members: number;
  tokensStacked: number;
  tier: string;
  clubBadge: typeof ArsenalBadge;
};

export const FanOrganizations = () => {
  const organizations: Organization[] = [
    {
      id: 1,
      name: 'United We Stand',
      club: 'Manchester United',
      members: 1247,
      tokensStacked: 156789,
      tier: 'League Diamond',
      clubBadge: ArsenalBadge // Using Arsenal as placeholder
    },
    {
      id: 2,
      name: 'Culé Warriors',
      club: 'Barcelona',
      members: 892,
      tokensStacked: 198456,
      tier: 'League Platinum',
      clubBadge: BarcelonaBadge
    },
    {
      id: 3,
      name: 'Gooner Army',
      club: 'Arsenal',
      members: 634,
      tokensStacked: 87234,
      tier: 'League Gold',
      clubBadge: ArsenalBadge
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1); // Always moving forward in auto mode
      setCurrentIndex((prev) => (prev + 1) % organizations.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [organizations.length]);

  const currentOrg = organizations[currentIndex];

  const swipeVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className="relative mx-auto h-48 w-full overflow-hidden md:h-36">
      <AnimatePresence
        initial={false}
        custom={direction}
      >
        <motion.div
          key={currentOrg.id}
          custom={direction}
          variants={swipeVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0 flex size-full flex-col justify-between rounded-[16px] border border-white/[0.1] bg-[linear-gradient(180deg,#1D1D1D_0%,#131313_100%)] p-4 shadow-[0px_1px_1px_0px_rgba(121,121,121,0.70)_inset]"
        >
          <div className="mb-2 flex items-center gap-3">
            <div className="relative size-8 overflow-hidden rounded-full">
              <Image
                src={currentOrg.clubBadge}
                alt={currentOrg.club}
                width={32}
                height={32}
                className="size-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                {currentOrg.name}
              </h3>
              <p className="text-xs text-neutral-400">
                {currentOrg.club} Organization
              </p>
            </div>
            <div className="ml-auto">
              <span
                className={cn(
                  'rounded-full px-2 py-1 text-xs font-medium',
                  currentOrg.tier === 'League Diamond' &&
                    'bg-blue-500/20 text-blue-400',
                  currentOrg.tier === 'League Platinum' &&
                    'bg-gray-500/20 text-gray-400',
                  currentOrg.tier === 'League Gold' &&
                    'bg-yellow-500/20 text-yellow-400'
                )}
              >
                {currentOrg.tier}
              </span>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-white">
                {currentOrg.members.toLocaleString()}
              </p>
              <p className="text-xs text-neutral-400">Members</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">
                {currentOrg.tokensStacked.toLocaleString()}
              </p>
              <p className="text-xs text-neutral-400">Tokens Stacked</p>
            </div>
          </div>

          <div className="mt-2 flex justify-center">
            <div className="flex gap-1">
              {organizations.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'size-2 rounded-full transition-colors',
                    index === currentIndex ? 'bg-white' : 'bg-neutral-600'
                  )}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export const Highlight = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        'bg-emerald-700/[0.2] px-1 py-0.5 font-bold text-emerald-500',
        className
      )}
    >
      {children}
    </span>
  );
};

const people = [
  { src: '/images/person1.png', alt: 'Person 1' },
  { src: '/images/person2.png', alt: 'Person 2' },
  { src: '/images/person3.png', alt: 'Person 3' },
  { src: '/images/person4.png', alt: 'Person 4' },
  { src: '/images/person5.png', alt: 'Person 5' },
  { src: '/images/person6.png', alt: 'Person 6' }
];

const PeopleGrid = () => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {people.map((person, index) => (
        <motion.div
          key={index}
          className="relative"
          initial={{ y: 20, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            duration: 0.6
          }}
        >
          <Image
            src={person.src}
            alt={person.alt}
            height={70}
            width={70}
            className="rounded-lg"
          />
        </motion.div>
      ))}
    </div>
  );
};

const OrbitingIcons = ({
  centerIcon,
  orbits,
  className
}: {
  centerIcon?: React.ReactNode;
  orbits: Array<{
    icons: React.ReactNode[];
    radius?: number;
    speed?: number;
    rotationDirection?: 'clockwise' | 'anticlockwise';
    revealTime?: number;
    delay?: number;
  }>;
  className?: string;
}) => {
  // Precalculate all orbit data
  const orbitData = React.useMemo(() => {
    return orbits.map((orbit, orbitIndex) => {
      const radius = orbit.radius || 100 + orbitIndex * 80;
      const speed = orbit.speed || 1;
      const revealTime = orbit.revealTime || 0.5;
      const orbitDelay = orbit.delay || 0;
      const iconCount = orbit.icons.length;

      // Calculate angles for each icon
      const angleStep = 360 / iconCount;
      const angles = Array.from({ length: iconCount }, (_, i) => angleStep * i);

      // Precalculate positions and animations for each icon
      const iconData = angles.map((angle) => {
        const randomDelay = -Math.random() * speed;
        const rotationAngle =
          orbit.rotationDirection === 'clockwise'
            ? [angle, angle - 360]
            : [angle, angle + 360];

        return {
          angle,
          randomDelay,
          rotationAngle,
          position: {
            x: radius * Math.cos((angle * Math.PI) / 180),
            y: radius * Math.sin((angle * Math.PI) / 180)
          },
          animation: {
            initial: {
              rotate: angle,
              scale: 0,
              opacity: 0
            },
            animate: {
              rotate: rotationAngle,
              scale: 1,
              opacity: 1
            },
            transition: {
              rotate: {
                duration: speed,
                repeat: Infinity,
                ease: 'linear',
                delay: randomDelay + orbitDelay
              },
              scale: {
                duration: revealTime,
                delay: Math.abs(randomDelay) + orbitDelay
              },
              opacity: {
                duration: revealTime,
                delay: Math.abs(randomDelay) + orbitDelay
              }
            },
            counterRotation: {
              initial: { rotate: -angle },
              animate: {
                rotate:
                  orbit.rotationDirection === 'clockwise'
                    ? [-angle, -angle + 360]
                    : [-angle, -angle - 360]
              },
              transition: {
                duration: speed,
                repeat: Infinity,
                ease: 'linear',
                delay: randomDelay + orbitDelay
              }
            }
          }
        };
      });

      return {
        radius,
        speed,
        revealTime,
        orbitDelay,
        iconData,
        rotationDirection: orbit.rotationDirection
      };
    });
  }, [orbits]);

  return (
    <div className={cn('relative size-[300px]', className)}>
      {centerIcon && (
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          {centerIcon}
        </div>
      )}
      {orbitData.map((orbit, orbitIndex) => (
        <div
          key={orbitIndex}
          className="absolute left-0 top-0 size-full"
          style={{ zIndex: orbits.length - orbitIndex }}
        >
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[343.721px] border border-[#545454] bg-[linear-gradient(189deg,#252525_5.97%,#0E0E0E_92.92%)] shadow-[0px_115px_32px_0px_rgba(0,0,0,0.01),_0px_74px_29px_0px_rgba(0,0,0,0.05),_0px_41px_25px_0px_rgba(0,0,0,0.16),_0px_18px_18px_0px_rgba(0,0,0,0.27),_0px_5px_10px_0px_rgba(0,0,0,0.31),inset_0px_0px_20px_rgba(0,0,0,0.5)]"
            style={{
              width: orbit.radius * 2 + 'px',
              height: orbit.radius * 2 + 'px'
            }}
          />

          {orbit.iconData.map((icon, iconIndex) => (
            <motion.div
              key={iconIndex}
              className="absolute"
              style={{
                width: '40px',
                height: '40px',
                left: `calc(50% - 20px)`,
                top: `calc(50% - 20px)`,
                transformOrigin: 'center center'
              }}
              initial={icon.animation.initial}
              animate={icon.animation.animate}
              transition={icon.animation.transition}
            >
              <div
                style={{
                  position: 'absolute',
                  left: `${orbit.radius}px`,
                  transformOrigin: 'center center'
                }}
              >
                <motion.div
                  initial={icon.animation.counterRotation.initial}
                  animate={icon.animation.counterRotation.animate}
                  transition={icon.animation.counterRotation.transition}
                  className="flex size-10 items-center justify-center rounded-[5px] bg-[#151515] shadow-[0px_23px_7px_0px_rgba(0,0,0,0.01),0px_15px_6px_0px_rgba(0,0,0,0.06),0px_8px_5px_0px_rgba(0,0,0,0.19),0px_4px_4px_0px_rgba(0,0,0,0.32),0px_1px_2px_0px_rgba(0,0,0,0.37)]"
                >
                  {orbits[orbitIndex].icons[iconIndex]}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
};

const LogoOrbit = () => {
  const orbit1Icons = [
    <Image
      key="arsenal"
      src={JB}
      alt="Arsenal"
      width={32}
      height={32}
      className="size-8 rounded-full text-white dark:text-white"
    />,
    <Image
      key="as-roma"
      src={JB}
      alt="AS Roma"
      width={32}
      height={32}
      className="size-8 rounded-full text-white dark:text-white"
    />,
    <Image
      key="athletico-madrid"
      src={JB}
      alt="Athletico Madrid"
      width={32}
      height={32}
      className="size-8 rounded-full text-white dark:text-white"
    />,
    <Image
      key="barcelona"
      src={JB}
      alt="Barcelona"
      width={32}
      height={32}
      className="size-8 rounded-full text-white dark:text-white"
    />
  ];

  const orbit2Icons = [
    <Image
      key="manchester-city"
      src={JB}
      alt="Manchester City"
      width={32}
      height={32}
      className="size-8 rounded-full text-white dark:text-white"
    />,
    <Image
      key="tottenham"
      src={JB}
      alt="Tottenham Hotspur"
      width={32}
      height={32}
      className="size-8 rounded-full text-white dark:text-white"
    />,
    <Image
      key="juventus"
      src={JB}
      alt="Juventus"
      width={32}
      height={32}
      className="size-8 rounded-full text-white dark:text-white"
    />,
    <Image
      key="inter-milan"
      src={JB}
      alt="Inter Milan"
      width={32}
      height={32}
      className="size-8 rounded-full text-white dark:text-white"
    />
  ];

  return (
    <OrbitingIcons
      orbits={[
        {
          icons: orbit1Icons,
          rotationDirection: 'clockwise',
          radius: 80,
          speed: 7
        },
        {
          icons: orbit2Icons,
          rotationDirection: 'anticlockwise',
          radius: 140,
          speed: 15
        }
      ]}
    />
  );
};

type ClubRanking = {
  id: number;
  name: string;
  rank: number;
  previousRank: number;
  points: number;
  trend: 'up' | 'down' | 'same';
  badge: typeof ArsenalBadge;
  league: string;
};

const ClubRankings = () => {
  const initialRankings: ClubRanking[] = [
    {
      id: 1,
      name: 'Barcelona',
      rank: 1,
      previousRank: 1,
      points: 245680,
      trend: 'same',
      badge: BarcelonaBadge,
      league: 'League Gold'
    },
    {
      id: 2,
      name: 'Arsenal',
      rank: 2,
      previousRank: 2,
      points: 231450,
      trend: 'same',
      badge: ArsenalBadge,
      league: 'League Gold'
    },
    {
      id: 3,
      name: 'Juventus',
      rank: 3,
      previousRank: 3,
      points: 198320,
      trend: 'same',
      badge: JuventusBadge,
      league: 'League Gold'
    },
    {
      id: 4,
      name: 'Man City',
      rank: 4,
      previousRank: 4,
      points: 187650,
      trend: 'same',
      badge: ManchesterCityBadge,
      league: 'League Gold'
    }
  ];

  const [rankings, setRankings] = useState(initialRankings);
  const [animatingRanks, setAnimatingRanks] = useState<Set<number>>(new Set());

  const swapRankings = (index1: number, index2: number) => {
    setAnimatingRanks(new Set([rankings[index1].rank, rankings[index2].rank]));

    setRankings((prev) => {
      const newRankings = [...prev];
      const club1 = { ...newRankings[index1] };
      const club2 = { ...newRankings[index2] };

      // Update previous ranks
      club1.previousRank = club1.rank;
      club2.previousRank = club2.rank;

      // Swap ranks and trends
      club1.rank = club2.rank;
      club2.rank = club1.previousRank;

      club1.trend =
        club1.rank < club1.previousRank
          ? 'up'
          : club1.rank > club1.previousRank
            ? 'down'
            : 'same';
      club2.trend =
        club2.rank < club2.previousRank
          ? 'up'
          : club2.rank > club2.previousRank
            ? 'down'
            : 'same';

      // Update points slightly
      club1.points += Math.floor(Math.random() * 1000) - 500;
      club2.points += Math.floor(Math.random() * 1000) - 500;

      newRankings[index1] = club2;
      newRankings[index2] = club1;

      return newRankings.sort((a, b) => a.rank - b.rank);
    });

    setTimeout(() => {
      setAnimatingRanks(new Set());
    }, 800);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly swap two adjacent clubs
      const adjacentPairs = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4]
      ];
      const randomPair =
        adjacentPairs[Math.floor(Math.random() * adjacentPairs.length)];
      swapRankings(randomPair[0], randomPair[1]);
    }, 3000);

    return () => clearInterval(interval);
  }, [rankings]);

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-neutral-400';
  };

  return (
    <div className="relative size-full overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="size-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      {/* Live Rankings Display */}
      <div className="absolute inset-0 flex flex-col justify-center p-4">
        <div className="space-y-2">
          <div className="mb-3 text-center">
            <h3 className="mb-1 text-xs font-semibold text-white/80">
              LIVE RANKINGS
            </h3>
            <div className="mx-auto size-2 animate-pulse rounded-full bg-red-500" />
          </div>

          {rankings.map((club) => (
            <motion.div
              key={club.id}
              layout
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                scale: animatingRanks.has(club.rank) ? [1, 1.05, 1] : 1,
                backgroundColor: animatingRanks.has(club.rank)
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.2)'
              }}
              transition={{
                layout: { duration: 0.8, ease: 'easeInOut' },
                scale: { duration: 0.8, ease: 'easeInOut' },
                backgroundColor: { duration: 0.8, ease: 'easeInOut' }
              }}
              className="flex items-center gap-2 rounded-lg border border-white/5 p-2 backdrop-blur-sm"
            >
              <div className="flex flex-1 items-center gap-2">
                <motion.span
                  animate={{
                    color: animatingRanks.has(club.rank) ? '#fbbf24' : undefined
                  }}
                  className={cn(
                    'w-6 text-center text-sm font-bold',
                    club.rank <= 3 ? 'text-yellow-400' : 'text-white/80'
                  )}
                >
                  #{club.rank}
                </motion.span>

                <div className="relative size-6 overflow-hidden rounded-full">
                  <Image
                    src={club.badge}
                    alt={club.name}
                    width={24}
                    height={24}
                    className="size-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-white">
                    {club.name}
                  </p>
                  <motion.p
                    animate={{
                      color: animatingRanks.has(club.rank)
                        ? '#ffffff'
                        : '#a3a3a3'
                    }}
                    className="text-xs text-neutral-400"
                  >
                    {club.points.toLocaleString()} pts
                  </motion.p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <motion.span
                  animate={{
                    scale: club.trend !== 'same' ? [1, 1.3, 1] : 1
                  }}
                  transition={{ duration: 0.5 }}
                  className={cn('text-xs', getTrendColor(club.trend))}
                >
                  {getTrendIcon(club.trend)}
                </motion.span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-xs font-medium',
                    club.league === 'Champions'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-blue-500/20 text-blue-400'
                  )}
                >
                  {club.league}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
