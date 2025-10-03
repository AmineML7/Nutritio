import { NextRequest, NextResponse } from 'next/server';
import { searchAliments } from '@/lib/data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';

  if (query.length < 2) {
    return NextResponse.json([]);
  }

  const results = searchAliments(query);
  
  const alimentsList = results.map(aliment => ({
    code: aliment.code,
    nom: aliment.nom,
    groupe: aliment.groupe,
    sous_groupe: aliment.sous_groupe
  }));

  return NextResponse.json(alimentsList);
}

