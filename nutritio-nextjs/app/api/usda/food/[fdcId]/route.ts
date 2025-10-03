import { NextRequest, NextResponse } from 'next/server';
import { getUSDAFood, convertUSDAToAliment } from '@/lib/usda';

export async function GET(
  request: NextRequest,
  { params }: { params: { fdcId: string } }
) {
  const fdcId = parseInt(params.fdcId);

  try {
    const usdaFood = await getUSDAFood(fdcId);
    const aliment = convertUSDAToAliment(usdaFood);

    return NextResponse.json(aliment);
  } catch (error) {
    console.error('Error fetching USDA food:', error);
    return NextResponse.json({ error: 'Aliment non trouvé' }, { status: 404 });
  }
}

