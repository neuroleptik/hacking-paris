import { NextRequest, NextResponse } from 'next/server';
import { getTotalStakedAllTokens } from '@/actions/crypto/get-total-staked-all-tokens';
import { serializeBigInts } from '@/lib/utils/bigint-utils';

export async function GET(request: NextRequest) {
  try {
    const result = await getTotalStakedAllTokens();
    return NextResponse.json(serializeBigInts(result));
  } catch (error) {
    console.error('Erreur lors de la récupération du total staké:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du total staké' },
      { status: 500 }
    );
  }
}
