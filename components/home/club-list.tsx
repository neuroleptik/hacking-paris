'use client';

import Image from 'next/image';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Club {
  id: string;
  name: string;
  logo: string;
  totalPoints: number;
}

const clubs: Club[] = [
  {
    id: '1',
    name: 'Paris Saint-Germain',
    logo: '/clubs/psg.png',
    totalPoints: 100
  },
  {
    id: '2',
    name: 'AC Milan',
    logo: '/clubs/ac_milan.png',
    totalPoints: 210
  },
  {
    id: '3',
    name: 'Atletico de Madrid',
    logo: '/clubs/atletico_de_madrid.png',
    totalPoints: 500
  },
  {
    id: '4',
    name: 'Barcelona',
    logo: '/clubs/barcelona.png',
    totalPoints: 100
  },
  {
    id: '5',
    name: 'Manchester City',
    logo: '/clubs/manchester_city.png',
    totalPoints: 155
  },
  {
    id: '6',
    name: 'AS Roma',
    logo: '/clubs/as_roma.png',
    totalPoints: 160
  },
  {
    id: '7',
    name: 'Inter Milan',
    logo: '/clubs/inter_milan.png',
    totalPoints: 170
  },
  {
    id: '8',
    name: 'Napoli',
    logo: '/clubs/napoli.png',
    totalPoints: 180
  },
  {
    id: '9',
    name: 'Arsenal',
    logo: '/clubs/arsenal.png',
    totalPoints: 190
  },
  {
    id: '10',
    name: 'Juventus',
    logo: '/clubs/juventus.png',
    totalPoints: 1050
  },
  {
    id: '11',
    name: 'Tottenham Hotspur',
    logo: '/clubs/tottenham.png',
    totalPoints: 200
  }
];

export function ClubList() {
  return (
    <Card className="w-full p-5 m-5">
      <CardHeader>
        <CardTitle>Clubs Ranking</CardTitle>
        <CardDescription>
          Clubs ranking based on the number of members transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clubs
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map((club) => (
              <Card
                key={club.id}
                className="flex items-center space-x-4 p-4"
              >
                <div className="relative h-8 w-8">
                  <Image
                    src={club.logo}
                    alt={`Logo ${club.name}`}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{club.name}</h3>
                </div>
                <div className="text-sm text-muted-foreground">
                  {club.totalPoints} points
                </div>
              </Card>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
