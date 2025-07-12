'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TrophyIcon } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Badge } from '../ui/badge';
import { ClubDetail } from './club-detail';

export interface Club {
  id: string;
  name: string;
  logo: string;
  totalPoints: number;
  symbol: string;
}

const clubs: Club[] = [
  {
    id: '1',
    name: 'Paris Saint-Germain',
    logo: '/clubs/psg.png',
    totalPoints: 100,
    symbol: 'PSG'
  },
  {
    id: '2',
    name: 'AC Milan',
    logo: '/clubs/acm.png',
    totalPoints: 600,
    symbol: 'ACM'
  },
  {
    id: '3',
    name: 'Atletico de Madrid',
    logo: '/clubs/atletico_de_madrid.png',
    totalPoints: 500,
    symbol: 'ATM'
  },
  {
    id: '4',
    name: 'Barcelona',
    logo: '/clubs/barcelona.png',
    totalPoints: 100,
    symbol: 'BAR'
  },
  {
    id: '5',
    name: 'Manchester City',
    logo: '/clubs/manchester_city.png',
    totalPoints: 155,
    symbol: 'MC'
  },
  {
    id: '6',
    name: 'AS Roma',
    logo: '/clubs/as_roma.png',
    totalPoints: 160,
    symbol: 'ASR'
  },
  {
    id: '7',
    name: 'Inter Milan',
    logo: '/clubs/inter_milan.png',
    totalPoints: 170,
    symbol: 'IM'
  },
  {
    id: '8',
    name: 'Napoli',
    logo: '/clubs/napoli.png',
    totalPoints: 180,
    symbol: 'NAP'
  },
  {
    id: '9',
    name: 'Arsenal',
    logo: '/clubs/arsenal.png',
    totalPoints: 190,
    symbol: 'ARS'
  },
  {
    id: '10',
    name: 'Juventus',
    logo: '/clubs/juv.png',
    totalPoints: 1050,
    symbol: 'JUV'
  },
  {
    id: '11',
    name: 'Tottenham Hotspur',
    logo: '/clubs/tottenham.png',
    totalPoints: 200,
    symbol: 'TOT'
  }
];

export function ClubList() {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [selectedRanking, setSelectedRanking] = useState<number>(1);

  return (
    <Card className="w-full p-5 m-5 w-2/3 mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrophyIcon className="w-6 h-6" /> Clubs Ranking
        </CardTitle>
        <CardDescription>
          Clubs ranking based on the number of members transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 ">
          {clubs
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map((club, index) => (
              <Card
                key={club.id}
                className="flex items-center space-x-4 p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => {
                  setSelectedClub(club);
                  setSelectedRanking(index);
                }}
              >
                <div className="flex items-center space-x-4">
                  <Badge
                    className={`${index === 0 ? 'bg-green-500' : 'bg-gray-500'}`}
                  >
                    {index + 1}
                  </Badge>
                  <div className="relative h-8 w-8">
                    <Image
                      src={club.logo}
                      alt={`Logo ${club.name}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="flex-1 pe-5">
                  <h3 className="font-semibold">{club.name}</h3>
                </div>
                <div className="text-md">{club.totalPoints} points</div>
              </Card>
            ))}
        </div>
      </CardContent>
      <ClubDetail
        club={selectedClub}
        ranking={selectedRanking}
        isOpen={selectedClub !== null}
        onClose={() => setSelectedClub(null)}
      />
    </Card>
  );
}
