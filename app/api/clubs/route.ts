import { NextRequest, NextResponse } from 'next/server';
import { getClubs } from '@/actions/crypto/get-clubs';

export async function GET(request: NextRequest) {
  try {
    const clubs = await getClubs();
    return NextResponse.json(clubs);
  } catch (error) {
    console.error('Erreur lors de la récupération des clubs:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des clubs' },
      { status: 500 }
    );
  }
}
