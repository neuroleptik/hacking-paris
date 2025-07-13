import { GiftIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

import { Club } from './club-list';
import { FanRewards } from './fan-rewards';

interface RewardsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  clubName: string;
  totalStaked: number;
  club: Club;
  personalStakes: {
    address: string;
    totalStaked: string;
  }[];
}

export function RewardsDialog({
  isOpen,
  onClose,
  clubName,
  totalStaked,
  club,
  personalStakes
}: RewardsDialogProps) {
  const userTokens = parseInt(
    personalStakes
      .find((stake) => stake.address.toLowerCase() == club.token.toLowerCase())
      ?.totalStaked.toLocaleString() || '0'
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GiftIcon className="size-5" />
            Fan Rewards - {clubName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Your points
              </span>
              <span className="font-semibold">{userTokens} points</span>
            </div>
            <Progress
              value={(userTokens / totalStaked) * 100}
              className="h-2"
            />
            <p className="mt-2 text-xs text-gray-500">
              {((userTokens / totalStaked) * 100).toFixed(1)}% of total staked
              points
            </p>
          </div>

          <FanRewards
            clubName={clubName}
            userTokens={userTokens}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
