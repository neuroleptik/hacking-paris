import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

import { stakeTokens } from '@/actions/crypto/stake-tokens';
import { serializeBigInts } from '@/lib/utils/bigint-utils';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 API /api/stake appelée');

    // Récupérer la session
    const session = await auth();
    console.log('Session:', session?.user?.id);

    const body = await request.json();
    console.log('Body reçu:', body);

    // Appeler la Server Action avec le bon contexte
    const result = await stakeTokens({
      ...body,
      ctx: { session }
    });

    console.log('✅ Résultat:', result);
    return NextResponse.json(serializeBigInts(result));
  } catch (error) {
    console.error('❌ Erreur lors du staking:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors du staking' },
      { status: 500 }
    );
  }
}
