import { NextRequest, NextResponse } from 'next/server';
import { calculateNutrients } from '@/lib/data';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code, quantity, gender } = body;

  if (!code || !quantity) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
  }

  const results = calculateNutrients(
    parseInt(code),
    parseFloat(quantity),
    gender || 'Homme'
  );

  if (!results) {
    return NextResponse.json({ error: 'Aliment non trouvé' }, { status: 404 });
  }

  return NextResponse.json(results);
}

