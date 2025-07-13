'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { GiftIcon, LockIcon, TrophyIcon } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useTotalStaked } from '@/hooks/use-total-staked';
import { useTokens } from '@/lib/providers/tokens-provider';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DebugPanel } from './debug-panel';
import { RewardsDialog } from './rewards-dialog';
import { SeasonTimer } from './season-timer';
import { StakeModal } from './stake-modal';
import { TokensComponent } from './tokens-component';

// Interface pour les données retournées par l'API
export interface ClubInfo {
  token: string;
  name: string;
  symbol: string;
  totalStaked: string;
}

// Interface pour l'affichage avec les données enrichies
export interface Club {
  id: string;
  name: string;
  logo: string;
  symbol: string;
  token: string;
  totalStaked: string;
}

const mockClubs: Club[] = [
  {
    id: '1',
    name: 'Atletico de Madrid',
    logo: '/clubs/atletico_de_madrid.png',
    symbol: 'ATM',
    token: 'ATM',
    totalStaked: '500'
  },
  {
    id: '2',
    name: 'Barcelona',
    logo: '/clubs/barcelona.png',
    symbol: 'BAR',
    token: 'BAR',
    totalStaked: '100'
  },
  {
    id: '3',
    name: 'Manchester City',
    logo: '/clubs/manchester_city.png',
    symbol: 'MC',
    token: 'MC',
    totalStaked: '155'
  },
  {
    id: '4',
    name: 'AS Roma',
    logo: '/clubs/as_roma.png',
    symbol: 'ASR',
    token: 'ASR',
    totalStaked: '160'
  },
  {
    id: '5',
    name: 'Inter Milan',
    logo: '/clubs/inter_milan.png',
    symbol: 'IM',
    token: 'IM',
    totalStaked: '170'
  },
  {
    id: '6',
    name: 'Napoli',
    logo: '/clubs/napoli.png',
    symbol: 'NAP',
    token: 'NAP',
    totalStaked: '180'
  },
  {
    id: '7',
    name: 'Arsenal',
    logo: '/clubs/arsenal.png',
    symbol: 'ARS',
    token: 'ARS',
    totalStaked: '190'
  },
  {
    id: '8',
    name: 'Tottenham Hotspur',
    logo: '/clubs/tottenham.png',
    symbol: 'TOT',
    token: 'TOT',
    totalStaked: '200'
  }
];

// Mapping des symboles vers les logos
const symbolToLogo: Record<string, string> = {
  PSG: '/clubs/psg.png',
  ACM: '/clubs/acm.png',
  ATM: '/clubs/atletico_de_madrid.png',
  BAR: '/clubs/barcelona.png',
  CITY: '/clubs/manchester_city.png',
  ASR: '/clubs/as_roma.png',
  IM: '/clubs/inter_milan.png',
  NAP: '/clubs/napoli.png',
  ARS: '/clubs/arsenal.png',
  JUV: '/clubs/juv.png',
  TOT: '/clubs/tottenham.png'
};

// Fonction pour convertir les données de l'API en format d'affichage
function convertClubInfoToClub(clubInfo: ClubInfo, index: number): Club {
  const logo = symbolToLogo[clubInfo.symbol] || '/clubs/default.png';

  return {
    id: index.toString(),
    name: clubInfo.name,
    logo,
    symbol: clubInfo.symbol,
    token: clubInfo.token,
    totalStaked: Math.trunc(Number(clubInfo.totalStaked)).toString()
  };
}

export function ClubList() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [stakeModalOpen, setStakeModalOpen] = useState(false);
  const [rewardsModalOpen, setRewardsModalOpen] = useState(false);
  const [selectedClubForStaking, setSelectedClubForStaking] =
    useState<Club | null>(null);
  const [selectedClubForRewards, setSelectedClubForRewards] =
    useState<Club | null>(null);

  const { personalStakes } = useTokens();

  console.log('personalStakes from club list', personalStakes);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/clubs');
        const { data } = await response.json();
        console.log('clubs from API', data);

        let apiClubs: Club[] = [];
        if (data?.data?.length > 0) {
          apiClubs = data.data.map((clubInfo: ClubInfo, index: number) =>
            convertClubInfoToClub(clubInfo, index)
          );
          console.log('convertedClubs', apiClubs);
        } else {
          console.log("Aucun club trouvé dans l'API");
        }

        // Adjust mock clubs IDs to avoid conflicts with API clubs
        const adjustedMockClubs = mockClubs.map((club) => ({
          ...club
        }));

        const allClubs = [...apiClubs, ...adjustedMockClubs];
        console.log('Combined clubs (API + Mock):', allClubs);
        setClubs(allClubs);
      } catch (error) {
        console.error('Erreur lors de la récupération des clubs:', error);
        console.log('Utilisation des données mock uniquement');
        setClubs(mockClubs);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const { tokens, tokenPools } = useTokens();
  const { refresh: refreshTotalStaked } = useTotalStaked();

  console.log('initialTokens', tokens);

  const handleStakeClick = (e: React.MouseEvent, club: Club) => {
    e.stopPropagation();
    setSelectedClubForStaking(club);
    setStakeModalOpen(true);
  };

  const handleRewardsClick = (e: React.MouseEvent, club: Club) => {
    e.stopPropagation();
    setSelectedClubForRewards(club);
    setRewardsModalOpen(true);
  };

  if (loading) {
    return (
      <Card className="m-5 mx-auto w-2/3 p-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrophyIcon className="size-6" /> Clubs Ranking
          </CardTitle>
          <CardDescription>Chargement des clubs...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="size-8 animate-spin rounded-full border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {tokens && (
        <TokensComponent
          allTokensBalance={tokens}
          stakedTokensBalance={tokenPools}
          onRefresh={refreshTotalStaked}
        />
      )}
      <SeasonTimer />

      <Card className="m-5 mx-auto w-2/3 p-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrophyIcon className="size-6" /> Clubs Ranking
          </CardTitle>
          <CardDescription>
            Clubs ranking based on total staked tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clubs.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">Aucun club disponible</p>
            </div>
          ) : (
            <div className="space-y-4">
              {clubs.map((club, index) => (
                <Card
                  key={club.symbol}
                  className="flex items-center space-x-4 p-4 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Badge
                      className={`${index === 0 ? 'bg-green-500' : 'bg-gray-500'}`}
                    >
                      {index + 1}
                    </Badge>
                    <div className="relative size-8">
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
                    <p className="text-sm text-muted-foreground">
                      {club.symbol}
                    </p>
                  </div>
                  <div className="text-md me-4 pe-3">
                    <div className="font-semibold">
                      {club.totalStaked.toLocaleString()} total staked
                    </div>
                    <Badge className="text-sm text-muted-foreground bg-orange-500/20 text-orange-500 mt-2 cursor-default">
                      <LockIcon className="size-4 mr-1" />
                      {personalStakes
                        .find(
                          (stake) =>
                            stake.address.toLowerCase() ==
                            club.token.toLowerCase()
                        )
                        ?.totalStaked.toLocaleString() || '0'}{' '}
                      staked by you
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleStakeClick(e, club)}
                    >
                      Stake
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleRewardsClick(e, club)}
                    >
                      <GiftIcon className="mr-1 size-4" />
                      Rewards
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>

        <StakeModal
          club={selectedClubForStaking}
          personalStakes={personalStakes}
          isOpen={stakeModalOpen}
          onClose={() => {
            setStakeModalOpen(false);
            setSelectedClubForStaking(null);
          }}
          onStakeSuccess={() => {
            refreshTotalStaked();
          }}
        />
        {selectedClubForRewards && (
          <RewardsDialog
            isOpen={rewardsModalOpen}
            onClose={() => {
              setRewardsModalOpen(false);
              setSelectedClubForRewards(null);
            }}
            clubName={selectedClubForRewards.name}
            totalStaked={Number(selectedClubForRewards.totalStaked)}
            club={selectedClubForRewards}
            personalStakes={personalStakes}
          />
        )}
        <DebugPanel />
      </Card>
    </>
  );
}
