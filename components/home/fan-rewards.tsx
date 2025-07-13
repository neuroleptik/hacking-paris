import { useEffect, useState } from 'react';
import { Lock, Medal, Shirt, Star, Ticket, Trophy, Users } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import rewardsData from '@/data/rewards.json';

interface FanRewardsProps {
  clubName: string;
  userTokens: number;
}

interface Reward {
  title: string;
  shortDescription: string;
  minimumPoints: number;
}

interface ClaimedReward {
  id: string;
  status: 'pending' | 'claimed';
}

const getIconForReward = (title: string) => {
  if (title.toLowerCase().includes('scarf')) return Medal;
  if (
    title.toLowerCase().includes('jersey') ||
    title.toLowerCase().includes('kit')
  )
    return Shirt;
  if (title.toLowerCase().includes('tour')) return Star;
  if (
    title.toLowerCase().includes('photo') ||
    title.toLowerCase().includes('team')
  )
    return Users;
  if (
    title.toLowerCase().includes('vip') ||
    title.toLowerCase().includes('match')
  )
    return Ticket;
  return Trophy;
};

const getClubRewardsKey = (clubName: string): string => {
  const clubMapping: Record<string, string> = {
    'Paris Saint-Germain F.C.': 'Paris Saint-Germain',
    PSG: 'Paris Saint-Germain',
    'AC Milan': 'AC Milan',
    Milan: 'AC Milan',
    'Juventus F.C.': 'Juventus',
    'Juventus FC': 'Juventus',
    Juve: 'Juventus'
  };

  return clubMapping[clubName] || clubName;
};

export const FanRewards = ({ clubName, userTokens }: FanRewardsProps) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [claimedRewards, setClaimedRewards] = useState<ClaimedReward[]>([]);
  const [isClaimingReward, setIsClaimingReward] = useState<string | null>(null);

  useEffect(() => {
    const rewardsKey = getClubRewardsKey(clubName);
    const clubRewards =
      rewardsData[rewardsKey as keyof typeof rewardsData] || [];
    setRewards(clubRewards);

    // Load claimed rewards from localStorage
    // const savedClaimedRewards = localStorage.getItem(
    //   `claimed-rewards-${clubName}`
    // );
    // if (savedClaimedRewards) {
    //   setClaimedRewards(JSON.parse(savedClaimedRewards));
    // }
  }, [clubName]);

  const handleClaimReward = async (reward: Reward) => {
    const rewardId = `${clubName}-${reward.title}`;
    setIsClaimingReward(rewardId);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newClaimedRewards = [
        ...claimedRewards,
        { id: rewardId, status: 'claimed' as const }
      ];
      setClaimedRewards(newClaimedRewards);

      // Save to localStorage
      localStorage.setItem(
        `claimed-rewards-${clubName}`,
        JSON.stringify(newClaimedRewards)
      );

      toast.success(`You've successfully claimed: ${reward.title}`, {
        duration: 3000
      });
    } catch (error) {
      toast.error('Failed to claim reward', {
        description: 'Please try again later',
        duration: 3000
      });
    } finally {
      setIsClaimingReward(null);
    }
  };

  if (rewards.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Reward Tiers</h2>
        <p className="text-gray-600">No rewards available for this club yet.</p>
      </div>
    );
  }

  // Sort rewards by minimum points required
  const sortedRewards = [...rewards].sort(
    (a, b) => a.minimumPoints - b.minimumPoints
  );

  // Find the next tier to unlock
  const nextTier = sortedRewards.find(
    (reward) => reward.minimumPoints > userTokens
  );
  const currentTier = nextTier
    ? sortedRewards[sortedRewards.indexOf(nextTier) - 1]
    : sortedRewards[sortedRewards.length - 1];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Reward Tiers</h2>
        {nextTier && (
          <p className="mt-2 text-sm text-gray-600">
            {nextTier.minimumPoints - userTokens} more points to unlock{' '}
            {nextTier.title}
          </p>
        )}
      </div>

      <div className="relative">
        <div className="absolute left-4 h-full w-0.5 bg-gray-100" />

        <div className="space-y-8">
          {sortedRewards.map((reward, index) => {
            const Icon = getIconForReward(reward.title);
            const isUnlocked = userTokens >= reward.minimumPoints;
            const isNext = nextTier?.minimumPoints === reward.minimumPoints;
            const rewardId = `${clubName}-${reward.title}`;
            const isClaimed = claimedRewards.some((cr) => cr.id === rewardId);
            const isLoading = isClaimingReward === rewardId;

            return (
              <div
                key={index}
                className={`relative pl-12 ${isUnlocked ? '' : 'opacity-75'}`}
              >
                <div
                  className={`absolute left-2 z-10 flex size-5 items-center justify-center rounded-full 
                    ${
                      isUnlocked
                        ? 'bg-green-100 text-green-600'
                        : isNext
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400'
                    }`}
                >
                  <div className="size-2 rounded-full bg-current" />
                </div>

                <Card
                  className={`border-l-4 ${
                    isUnlocked
                      ? 'border-l-green-500'
                      : isNext
                        ? 'border-l-blue-500'
                        : 'border-l-gray-200'
                  } p-4`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`rounded-lg p-2 ${
                        isUnlocked
                          ? 'bg-green-50 text-green-600'
                          : isNext
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      {isUnlocked ? (
                        <Icon className="size-5" />
                      ) : (
                        <Lock className="size-5" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <h3 className="font-medium">{reward.title}</h3>
                        <span
                          className={`text-sm ${
                            isUnlocked
                              ? 'text-green-600'
                              : isNext
                                ? 'text-blue-600'
                                : 'text-gray-500'
                          }`}
                        >
                          {reward.minimumPoints} points required
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {reward.shortDescription}
                      </p>
                      {isUnlocked && (
                        <div className="flex justify-end mt-3">
                          <Button
                            variant={isClaimed ? 'outline' : 'default'}
                            size="sm"
                            disabled={isClaimed || isLoading}
                            onClick={() => handleClaimReward(reward)}
                          >
                            {isLoading
                              ? 'Claiming...'
                              : isClaimed
                                ? 'Claimed'
                                : 'Claim Reward'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
