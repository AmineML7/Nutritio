import { NextRequest, NextResponse } from 'next/server';
import { loadRecommandations } from '@/lib/data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gender = (searchParams.get('gender') || 'Homme') as 'Homme' | 'Femme';

  const recommandations = loadRecommandations();
  
  const recoList = recommandations.map(reco => ({
    nutriment: reco.Nutriment,
    unite: reco.Unité,
    valeur: reco[gender]
  }));

  return NextResponse.json(recoList);
}

