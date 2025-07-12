import { NextRequest, NextResponse } from 'next/server';

import { stakeTokens } from '@/actions/crypto/stake-tokens';
import { serializeBigInts } from '@/lib/utils/bigint-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await stakeTokens(body);
    return NextResponse.json(serializeBigInts(result));
  } catch (error) {
    console.error('Erreur lors du staking:', error);
    return NextResponse.json(
      { error: 'Erreur lors du staking' },
      { status: 500 }
    );
  }
}
