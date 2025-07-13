import { GiftIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

import { FanRewards } from './fan-rewards';

interface RewardsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  clubName: string;
  totalStaked: number;
}

export function RewardsDialog({
  isOpen,
  onClose,
  clubName,
  totalStaked
}: RewardsDialogProps) {
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

        <div className="py-4">
          <FanRewards
            clubName={clubName}
            userTokens={totalStaked}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
