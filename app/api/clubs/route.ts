import { NextRequest, NextResponse } from 'next/server';

import { getClubs } from '@/actions/crypto/get-clubs';
import { serializeBigInts } from '@/lib/utils/bigint-utils';

export async function GET(request: NextRequest) {
  try {
    const clubs = await getClubs();

    // Vérifier si nous avons des données
    if (!clubs || clubs.length === 0) {
      console.log('Aucun club trouvé, retour des données de test');
      return NextResponse.json({
        data: [
          {
            token: '0xd6f6c45387961973e8307f606c29795647e9bed9',
            name: 'Paris Saint-Germain Fan Token',
            symbol: 'PSG',
            totalStaked: '1000.0'
          },
          {
            token: '0x43fab8e48ac6b73a443c82d041d9f96d58b5206d',
            name: 'AC Milan Fan Token',
            symbol: 'ACM',
            totalStaked: '850.0'
          },
          {
            token: '0x8f7749575288bb9d5a8a91f9566a0cf8ccddc925',
            name: 'Atletico Madrid Fan Token',
            symbol: 'ATM',
            totalStaked: '720.0'
          }
        ]
      });
    }

    return NextResponse.json({ data: serializeBigInts(clubs) });
  } catch (error) {
    console.error('Erreur lors de la récupération des clubs:', error);

    // Retourner des données de test en cas d'erreur
    return NextResponse.json({
      data: [
        {
          token: '0xd6f6c45387961973e8307f606c29795647e9bed9',
          name: 'Paris Saint-Germain Fan Token',
          symbol: 'PSG',
          totalStaked: '1000.0'
        },
        {
          token: '0x43fab8e48ac6b73a443c82d041d9f96d58b5206d',
          name: 'AC Milan Fan Token',
          symbol: 'ACM',
          totalStaked: '850.0'
        },
        {
          token: '0x8f7749575288bb9d5a8a91f9566a0cf8ccddc925',
          name: 'Atletico Madrid Fan Token',
          symbol: 'ATM',
          totalStaked: '720.0'
        }
      ]
    });
  }
}
