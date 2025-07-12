import Image from 'next/image';
import { StackIcon } from '@radix-ui/react-icons';
import { MedalIcon, TrophyIcon, ZapIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useTokens } from '@/lib/providers/tokens-provider';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Club } from './club-list';

interface ClubDetailProps {
  club: Club | null;
  ranking: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ClubDetail({
  club,
  ranking,
  isOpen,
  onClose
}: ClubDetailProps) {
  if (!club) return null;

  const { tokens } = useTokens();
  const clubToken = tokens.find((token) => token.symbol === club.symbol);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <div className="relative h-12 w-12">
              <Image
                src={club.logo}
                alt={`Logo ${club.name}`}
                fill
                className="object-contain"
              />
            </div>
            {club.name}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-row justify-between px-2">
            <div>
              <span className="flex items-center gap-2 mb-1">
                <TrophyIcon className="w-4 h-4" />
                <h2 className="font-semibold text-lg">Total points</h2>
              </span>
              <Badge className="text-md font-medium">
                {club.totalPoints} points
              </Badge>
            </div>
            <div>
              <span className="flex items-center gap-2 mb-1">
                <MedalIcon className="w-4 h-4" />
                <h2 className="font-semibold text-lg">Ranking</h2>
              </span>
              <Badge
                className={`text-md font-medium ${
                  ranking === 0
                    ? 'bg-green-500 text-white hover:bg-green-500/80 hover:cursor-default'
                    : 'bg-gray-500 hover:bg-gray-500/80 hover:cursor-default'
                }`}
              >
                {ranking === 0
                  ? '1st'
                  : ranking === 1
                    ? '2nd'
                    : ranking === 2
                      ? '3rd'
                      : `${ranking + 1}th`}
              </Badge>
            </div>
          </div>
          <Badge className="text-sm bg-green-600/10 text-green-600 mt-3 mb-3 hover:bg-green-600/10 hover:text-green-500 hover:cursor-default">
            Help your club win the Club War by stacking tokens for the season
            and earn points and rewards for your club based on the number of
            tokens stacked and the final ranking.
          </Badge>
          <div className="flex flex-row gap-2 justify-between">
            <Input
              type="number"
              placeholder="0"
              max={clubToken?.balance || 0}
              className="w-25 text-lg"
            />
            <Badge className="w-25 justify-end align-middle align-items-center">
              Max : {clubToken?.balance || '0'}
            </Badge>
          </div>
          <Button
            variant="default"
            className="space-y-2 bg-yellow-600 text-white hover:bg-yellow-500/80  gap-1"
          >
            <ZapIcon className="w-4 h-4" />
            Stack tokens
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
