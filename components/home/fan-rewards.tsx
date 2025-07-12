import { useEffect, useState } from 'react';
import { Medal, Shirt, Star, Ticket, Trophy, Users } from 'lucide-react';

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
  // Mapping des noms de clubs vers les clés du fichier rewards.json
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

  useEffect(() => {
    console.log('Club name:', clubName);
    console.log('Available rewards:', Object.keys(rewardsData));

    const rewardsKey = getClubRewardsKey(clubName);
    console.log('Looking for rewards with key:', rewardsKey);

    const clubRewards =
      rewardsData[rewardsKey as keyof typeof rewardsData] || [];
    console.log('Found rewards:', clubRewards);

    setRewards(clubRewards);
  }, [clubName]);

  const getProgressToNextReward = (minimumPoints: number) => {
    if (userTokens >= minimumPoints) return 100;
    const previousReward = rewards.find((r) => r.minimumPoints < minimumPoints);
    const basePoints = previousReward ? previousReward.minimumPoints : 0;
    const range = minimumPoints - basePoints;
    const progress = ((userTokens - basePoints) / range) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  if (rewards.length === 0) {
    return (
      <div className="space-y-6 p-4">
        <h2 className="text-2xl font-bold mb-6">Fan Rewards</h2>
        <p className="text-gray-600">No rewards available for this club yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold mb-6">Fan Rewards</h2>
      <div className="grid gap-4">
        {rewards.map((reward, index) => {
          const Icon = getIconForReward(reward.title);
          const progress = getProgressToNextReward(reward.minimumPoints);
          const isUnlocked = userTokens >= reward.minimumPoints;

          return (
            <Card
              key={index}
              className={`p-4 ${isUnlocked ? 'bg-green-50' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-2 rounded-full ${
                    isUnlocked
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{reward.title}</h3>
                    <span
                      className={`text-sm ${
                        isUnlocked ? 'text-green-600' : 'text-gray-600'
                      }`}
                    >
                      {userTokens}/{reward.minimumPoints} points
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {reward.shortDescription}
                  </p>
                  <Progress
                    value={progress}
                    className={`h-2 ${isUnlocked ? 'bg-green-100' : 'bg-gray-100'}`}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
