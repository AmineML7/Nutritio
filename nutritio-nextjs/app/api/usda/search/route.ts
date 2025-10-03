import { NextRequest, NextResponse } from 'next/server';
import { searchUSDAFoods, convertUSDAToAliment, translateToEnglish } from '@/lib/usda';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';

  if (query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    // Traduire la requête si elle est en français
    const englishQuery = translateToEnglish(query);
    
    // Rechercher dans USDA
    const result = await searchUSDAFoods(englishQuery, 20);
    
    // Convertir au format de notre app
    const alimentsList = result.foods.map(food => ({
      code: food.fdcId,
      nom: food.description,
      groupe: food.foodCategory || 'Non catégorisé',
      sous_groupe: food.dataType || '',
    }));

    return NextResponse.json(alimentsList);
  } catch (error) {
    console.error('Error in USDA search:', error);
    return NextResponse.json({ error: 'Erreur lors de la recherche' }, { status: 500 });
  }
}

