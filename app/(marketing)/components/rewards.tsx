'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ACMilanBadge from '@/public/images/acm.png';
import JuventusBadge from '@/public/images/juv.png';
// Import club badges
import PSGBadge from '@/public/images/psg.png';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';

import { cn } from '@/lib/utils';

import { Button } from '../components/button';

type RewardTier = {
  title: string;
  shortDescription: string;
  minimumPoints: number;
  icon: string;
};

type ClubRewards = {
  name: string;
  badge: typeof PSGBadge;
  rewards: RewardTier[];
  primaryColor: string;
  secondaryColor: string;
};

const rewardsData: ClubRewards[] = [
  {
    name: 'Paris Saint-Germain',
    badge: PSGBadge,
    primaryColor: '#1e3a8a',
    secondaryColor: '#dc2626',
    rewards: [
      {
        title: 'PSG Collector Scarf',
        shortDescription: 'Limited edition scarf with printed signatures',
        minimumPoints: 1000,
        icon: '🧣'
      },
      {
        title: 'Customized Home Jersey',
        shortDescription: 'Official jersey with custom printing',
        minimumPoints: 2500,
        icon: '👕'
      },
      {
        title: 'Parc des Princes Tour',
        shortDescription: 'Exclusive guided tour of stadium backstage',
        minimumPoints: 5000,
        icon: '🏟️'
      },
      {
        title: 'Team Photo Session',
        shortDescription: 'Exclusive photo shoot with first team',
        minimumPoints: 10000,
        icon: '📸'
      }
    ]
  },
  {
    name: 'AC Milan',
    badge: ACMilanBadge,
    primaryColor: '#dc2626',
    secondaryColor: '#000000',
    rewards: [
      {
        title: 'Rossoneri Classic Scarf',
        shortDescription: 'Historic pattern San Siro scarf',
        minimumPoints: 1000,
        icon: '🧣'
      },
      {
        title: 'Milan Home Kit Legend Edition',
        shortDescription: 'Jersey with iconic number 3, 6 or 9',
        minimumPoints: 2500,
        icon: '👕'
      },
      {
        title: 'San Siro Legends Tour',
        shortDescription: 'Guided tour with Milan legend in San Siro',
        minimumPoints: 5000,
        icon: '🏟️'
      },
      {
        title: 'Milanello Training Ground Day',
        shortDescription: 'Visit training facility and meet the team',
        minimumPoints: 10000,
        icon: '⚽'
      }
    ]
  },
  {
    name: 'Juventus',
    badge: JuventusBadge,
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    rewards: [
      {
        title: 'Bianconeri Victory Scarf',
        shortDescription: 'Black and white classic design scarf',
        minimumPoints: 1000,
        icon: '🧣'
      },
      {
        title: 'Allianz Stadium Jersey',
        shortDescription: 'Home jersey with special stadium patch',
        minimumPoints: 2500,
        icon: '👕'
      },
      {
        title: 'Turin Football Heritage Tour',
        shortDescription: 'Visit to J-Museum and stadium facilities',
        minimumPoints: 5000,
        icon: '🏟️'
      },
      {
        title: 'Juventus Matchday VIP Experience',
        shortDescription: 'Premium seats and post-match ceremony access',
        minimumPoints: 12000,
        icon: '👑'
      }
    ]
  }
];

export function Rewards() {
  const [currentClubIndex, setCurrentClubIndex] = useState(0);
  const [currentTier, setCurrentTier] = useState(0);
  const [tierProgress, setTierProgress] = useState<{ [key: string]: number }>(
    {}
  );
  const [completedRewards, setCompletedRewards] = useState<{
    [key: string]: boolean;
  }>({});

  const [allTiersCompleted, setAllTiersCompleted] = useState(false);

  // Auto-fill progress bars sequentially
  useEffect(() => {
    const tierKey = `${currentClubIndex}-${currentTier}`;

    // Reset when switching clubs
    if (currentTier === 0) {
      setAllTiersCompleted(false);
    }

    // Skip if this tier is already completed
    if (completedRewards[tierKey]) {
      return;
    }

    let hasTriggeredCompletion = false;

    const progressInterval = setInterval(() => {
      setTierProgress((prev) => {
        const currentProgress = prev[tierKey] || 0;

        // Stop if already at 100% or if tier is completed
        if (currentProgress >= 100 || completedRewards[tierKey]) {
          return prev;
        }

        const newProgress = Math.min(currentProgress + 2, 100);

        // When a tier reaches 100% for the first time
        if (newProgress === 100 && !hasTriggeredCompletion) {
          hasTriggeredCompletion = true;

          // Mark as completed immediately to prevent multiple triggers
          setCompletedRewards((prev) => ({ ...prev, [tierKey]: true }));

          // Move to next tier after 1.2 seconds (reduced from 2s)
          setTimeout(() => {
            if (currentTier < 3) {
              setCurrentTier((prev) => prev + 1);
            } else {
              // All tiers completed for this club
              setAllTiersCompleted(true);
              // Wait 2 seconds before switching to next club (reduced from 3s)
              setTimeout(() => {
                setCurrentClubIndex((prev) => (prev + 1) % rewardsData.length);
                setCurrentTier(0);
                setTierProgress({});
                setCompletedRewards({});
              }, 1000);
            }
          }, 500);
        }

        return { ...prev, [tierKey]: newProgress };
      });
    }, 40); // Update every 40ms for smooth animation (1.33 seconds per tier)

    return () => clearInterval(progressInterval);
  }, [currentClubIndex, currentTier, completedRewards]);

  // Auto-advance to next club (fallback)
  useEffect(() => {
    if (allTiersCompleted) {
      const timeout = setTimeout(() => {
        setCurrentClubIndex(
          (prevIndex) => (prevIndex + 1) % rewardsData.length
        );
        setCurrentTier(0);
        setTierProgress({});
        setCompletedRewards({});

        setAllTiersCompleted(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [allTiersCompleted]);

  const currentClub = rewardsData[currentClubIndex];

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:my-20 md:px-8 md:py-20">
      <div className="relative z-20 mx-auto mb-4 max-w-4xl text-balance text-center text-lg font-semibold tracking-tight text-neutral-300 md:text-3xl">
        <h2
          className={cn(
            'inline-block bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-3xl text-transparent md:text-6xl'
          )}
        >
          Exclusive Rewards
        </h2>
      </div>
      <p className="mx-auto mt-4 max-w-lg text-center text-sm text-neutral-400">
        Stack more tokens to unlock exclusive rewards from your favorite clubs.
        From collector items to VIP experiences, your loyalty pays off.
      </p>

      {/* Club Progress Indicator */}
      <div className="mb-8 mt-12 flex justify-center gap-4">
        {rewardsData.map((club, index) => (
          <div
            key={club.name}
            className={cn(
              'relative rounded-full p-3 transition-all duration-300',
              currentClubIndex === index
                ? 'scale-110 bg-primary/20 ring-2 ring-primary'
                : 'bg-neutral-800 opacity-60'
            )}
          >
            <Image
              src={club.badge}
              alt={club.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            {allTiersCompleted && currentClubIndex === index && (
              <div className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-green-500">
                <span className="text-xs text-white">✓</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Rewards Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentClubIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="relative flex flex-col items-center"
        >
          {/* Club Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-4">
              <h3 className="text-2xl font-bold text-white md:text-4xl">
                {currentClub.name}
              </h3>
            </div>
            <p className="mb-4 text-neutral-400">
              Stack tokens to unlock exclusive {currentClub.name} rewards
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-neutral-500">
                {allTiersCompleted
                  ? 'All rewards unlocked! 🎉'
                  : `Unlocking level ${currentTier + 1} of 4...`}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'size-2 rounded-full transition-all duration-300',
                      i < currentTier
                        ? 'bg-green-500'
                        : i === currentTier
                          ? 'animate-pulse bg-primary'
                          : 'bg-neutral-600'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Rewards Tiers */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {currentClub.rewards.map((reward, index) => {
              const tierKey = `${currentClubIndex}-${index}`;
              const progress = tierProgress[tierKey] || 0;
              const isCompleted = completedRewards[tierKey];
              const isActive = currentTier === index;

              return (
                <motion.div
                  key={reward.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'relative rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 p-6 transition-all duration-300',
                    isActive && 'scale-105 shadow-2xl ring-2 ring-primary/50',
                    isCompleted && 'shadow-green-500/50 ring-2 ring-green-500'
                  )}
                >
                  {/* Glow effect when active */}
                  <div
                    className={cn(
                      'absolute inset-0 rounded-xl transition-opacity duration-300',
                      isActive ? 'opacity-100' : 'opacity-0',
                      isCompleted
                        ? 'bg-gradient-to-br from-green-400/20 to-green-600/20'
                        : 'bg-gradient-to-br from-primary/20 to-secondary/20'
                    )}
                  />

                  {/* Minimum Points Badge */}
                  <div
                    className={cn(
                      'absolute -right-3 -top-3 rounded-full px-3 py-1 text-sm font-bold text-white transition-all duration-300',
                      isCompleted
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : 'bg-gradient-to-r from-primary to-secondary'
                    )}
                  >
                    {isCompleted ? '✓' : reward.minimumPoints.toLocaleString()}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="mb-4 text-center text-4xl">
                      {reward.icon}
                    </div>

                    {/* Fixed height content area */}
                    <div className="flex grow flex-col justify-between">
                      <div>
                        <h4 className="mb-2 flex min-h-12 items-center justify-center text-center text-xl font-bold text-white">
                          {reward.title}
                        </h4>
                        <p className="flex min-h-10 items-center justify-center text-center text-sm text-neutral-400">
                          {reward.shortDescription}
                        </p>
                      </div>

                      {/* Progress section - always at bottom */}
                      <div className="mt-4">
                        {/* Enhanced Progress indicator */}
                        <div className="relative h-3 overflow-hidden rounded-full bg-neutral-700">
                          <motion.div
                            className={cn(
                              'h-3 rounded-full transition-all duration-100',
                              progress < 100
                                ? 'bg-gradient-to-r from-green-400 to-green-600'
                                : 'bg-gradient-to-r from-green-400 to-green-600'
                            )}
                            style={{ width: `${progress}%` }}
                            animate={
                              progress === 100
                                ? {
                                    scale: [1, 1.05, 1],
                                    opacity: [1, 0.8, 1]
                                  }
                                : {}
                            }
                            transition={{ duration: 0.3 }}
                          />

                          {/* Sparkle effect when progressing */}
                          {progress > 0 && progress < 100 && (
                            <div className="absolute left-0 top-0 size-full">
                              <motion.div
                                className="absolute top-1/2 size-1 -translate-y-1/2 rounded-full bg-white"
                                style={{ left: `${progress}%` }}
                                animate={{
                                  scale: [0, 1, 0],
                                  opacity: [0, 1, 0]
                                }}
                                transition={{
                                  duration: 0.5,
                                  repeat: Infinity,
                                  ease: 'easeInOut'
                                }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Progress text */}
                        <div className="mt-2 text-center">
                          <p className="text-xs text-neutral-500">
                            {progress === 100
                              ? 'Reward Unlocked!'
                              : isActive
                                ? `${Math.round(progress)}% - Unlocking...`
                                : progress > 0
                                  ? `${Math.round(progress)}% - Completed`
                                  : `${reward.minimumPoints.toLocaleString()} tokens required`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <Button className="mx-auto mt-20 h-10 w-32 rounded-full text-xs font-medium sm:text-sm md:h-12 md:w-40 md:text-base lg:h-16 lg:w-48">
            Stack Tokens Now
          </Button>
        </motion.div>
      </AnimatePresence>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
    </div>
  );
}
