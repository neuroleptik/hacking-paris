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
            <div className="relative size-12">
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
              <span className="mb-1 flex items-center gap-2">
                <TrophyIcon className="size-4" />
                <h2 className="text-lg font-semibold">Total points</h2>
              </span>
              <Badge className="text-md font-medium">
                {club.totalPoints} points
              </Badge>
            </div>
            <div>
              <span className="mb-1 flex items-center gap-2">
                <MedalIcon className="size-4" />
                <h2 className="text-lg font-semibold">Ranking</h2>
              </span>
              <Badge
                className={`text-md font-medium ${
                  ranking === 0
                    ? 'bg-green-500 text-white hover:cursor-default hover:bg-green-500/80'
                    : 'bg-gray-500 hover:cursor-default hover:bg-gray-500/80'
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
          <div className="flex flex-row justify-between px-2">
            <div>
              <span className="mb-1 flex items-center gap-2">
                <StackIcon className="size-4" />
                <h2 className="text-lg font-semibold">Total staked</h2>
              </span>
              <Badge className="text-md font-medium">
                {club.totalStaked} tokens
              </Badge>
            </div>
            <div>
              <span className="mb-1 flex items-center gap-2">
                <h2 className="text-lg font-semibold">Symbol</h2>
              </span>
              <Badge className="text-md font-medium">{club.symbol}</Badge>
            </div>
          </div>
          <Badge className="my-3 bg-green-600/10 text-sm text-green-600 hover:cursor-default hover:bg-green-600/10 hover:text-green-500">
            Help your club win the Club War by staking tokens for the season and
            earn points and rewards for your club based on the number of tokens
            staked and the final ranking.
          </Badge>
          <div className="flex flex-row justify-between gap-2">
            <Input
              type="number"
              placeholder="0"
              max={clubToken?.balance || 0}
              className="w-25 text-lg"
            />
            <Badge className="w-25 align-items-center justify-end align-middle">
              Max : {clubToken?.balance || '0'}
            </Badge>
          </div>
          <Button
            variant="default"
            className="gap-1 bg-yellow-600 text-white hover:bg-yellow-500/80"
          >
            <ZapIcon className="size-4" />
            Stake tokens
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
