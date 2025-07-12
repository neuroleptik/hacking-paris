'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { GiftIcon, TrophyIcon } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTotalStaked } from '@/hooks/use-total-staked';
import { useTokens } from '@/lib/providers/tokens-provider';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ClubDetail } from './club-detail';
import { DebugPanel } from './debug-panel';
import { RewardsDialog } from './rewards-dialog';
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
  totalPoints: number;
  symbol: string;
  token: string;
  totalStaked: string;
}

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
  const totalPoints = parseFloat(clubInfo.totalStaked) * 1000; // Conversion pour l'affichage

  return {
    id: index.toString(),
    name: clubInfo.name,
    logo,
    totalPoints: Math.round(totalPoints),
    symbol: clubInfo.symbol,
    token: clubInfo.token,
    totalStaked: clubInfo.totalStaked
  };
}

export function ClubList() {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [selectedRanking, setSelectedRanking] = useState<number>(1);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [stakeModalOpen, setStakeModalOpen] = useState(false);
  const [rewardsModalOpen, setRewardsModalOpen] = useState(false);
  const [selectedClubForStaking, setSelectedClubForStaking] =
    useState<Club | null>(null);
  const [selectedClubForRewards, setSelectedClubForRewards] =
    useState<Club | null>(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/clubs');
        const { data } = await response.json();
        console.log('clubs from API', data);

        if (data?.data?.length > 0) {
          const convertedClubs = data.data.map(
            (clubInfo: ClubInfo, index: number) =>
              convertClubInfoToClub(clubInfo, index)
          );
          console.log('convertedClubs', convertedClubs);
          setClubs(convertedClubs);
        } else {
          console.log('Aucun club trouvé ou données vides');
          setClubs([]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des clubs:', error);
        setClubs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const { tokens, tokenPools } = useTokens();
  const { refresh: refreshTotalStaked } = useTotalStaked();
  console.log('initialTokens', tokens);

  const handleClubClick = (club: Club, index: number) => {
    setSelectedClub(club);
    setSelectedRanking(index);
  };

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
      <Card className="w-full p-5 m-5 w-2/3 mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrophyIcon className="w-6 h-6" /> Clubs Ranking
          </CardTitle>
          <CardDescription>Chargement des clubs...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
      <Card className="w-full p-5 m-5 w-2/3 mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrophyIcon className="w-6 h-6" /> Clubs Ranking
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
                  className="flex items-center space-x-4 p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleClubClick(club, index)}
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
                    <p className="text-sm text-muted-foreground">
                      {club.symbol}
                    </p>
                  </div>
                  <div className="text-md">
                    <div className="font-semibold">
                      {club.totalPoints} points
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {club.totalStaked} staked
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleStakeClick(e, club)}
                    >
                      Staker
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleRewardsClick(e, club)}
                    >
                      <GiftIcon className="w-4 h-4 mr-1" />
                      Rewards
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
        <ClubDetail
          club={selectedClub}
          ranking={selectedRanking}
          isOpen={selectedClub !== null}
          onClose={() => setSelectedClub(null)}
        />
        <StakeModal
          club={selectedClubForStaking}
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
          />
        )}
        <DebugPanel />
      </Card>
    </>
  );
}
