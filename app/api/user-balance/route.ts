import { NextRequest, NextResponse } from 'next/server';

import { getUserBalance } from '@/actions/crypto/get-user-balance';
import { serializeBigInts } from '@/lib/utils/bigint-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await getUserBalance(body);
    return NextResponse.json(serializeBigInts(result));
  } catch (error) {
    console.error('Erreur lors de la récupération du solde:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du solde' },
      { status: 500 }
    );
  }
}
