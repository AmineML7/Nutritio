import { NextRequest, NextResponse } from 'next/server';
import { getUSDAFood, convertUSDAToAliment } from '@/lib/usda';
import { calculateNutrients } from '@/lib/data';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code, quantity, gender } = body;

  if (!code || !quantity) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
  }

  try {
    // Récupérer l'aliment depuis USDA
    const usdaFood = await getUSDAFood(parseInt(code));
    const aliment = convertUSDAToAliment(usdaFood);
    
    // Utiliser la fonction de calcul existante
    // Créer un objet compatible avec calculateNutrients
    const tempCode = parseInt(code);
    
    // Calculer directement ici au lieu d'utiliser calculateNutrients
    const results = calculateNutrientsFromUSDA(aliment, parseFloat(quantity), gender || 'Homme');

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in USDA calculate:', error);
    return NextResponse.json({ error: 'Erreur lors du calcul' }, { status: 500 });
  }
}

// Fonction de calcul adaptée pour USDA
function calculateNutrientsFromUSDA(aliment: any, quantity: number, gender: 'Homme' | 'Femme') {
  // Importer le module de données local pour les recommandations
  const { loadRecommandations, NUTRIENT_MAPPING, NUTRIENT_INFO_ONLY, NUTRIENT_UNITS } = require('@/lib/data');
  
  const recommandations = loadRecommandations();
  
  const nutriments: { [key: string]: number } = {};
  const nutriments_info: { [key: string]: number } = {};
  const recommandationsMap: { [key: string]: number } = {};
  const pourcentages: { [key: string]: number } = {};

  // Nutriments avec recommandations
  for (const [colName, recoName] of Object.entries(NUTRIENT_MAPPING)) {
    const value = aliment[colName];
    
    if (value !== null && value !== undefined) {
      const calculatedValue = value * (quantity / 100);
      
      if (colName === 'potassium' || colName === 'sodium') {
        nutriments[recoName as string] = Math.round(calculatedValue * 100) / 100;
        const reco = recommandations.find((r: any) => r.Nutriment === recoName);
        if (reco) {
          const recoValueMg = reco[gender] * 1000;
          recommandationsMap[recoName as string] = recoValueMg;
          pourcentages[recoName as string] = Math.round((calculatedValue / recoValueMg) * 100 * 10) / 10;
        }
      } else {
        nutriments[recoName as string] = Math.round(calculatedValue * 100) / 100;
        const reco = recommandations.find((r: any) => r.Nutriment === recoName);
        if (reco) {
          recommandationsMap[recoName as string] = reco[gender];
          pourcentages[recoName as string] = Math.round((calculatedValue / reco[gender]) * 100 * 10) / 10;
        }
      }
    }
  }

  // Nutriments informatifs
  for (const [colName, displayName] of Object.entries(NUTRIENT_INFO_ONLY)) {
    const value = aliment[colName];
    if (value !== null && value !== undefined) {
      nutriments_info[displayName as string] = Math.round(value * (quantity / 100) * 100) / 100;
    }
  }

  // Macronutriments
  const macros: { [key: string]: number } = {};
  for (const macro of ['energie_kcal', 'proteines', 'glucides', 'lipides', 'fibres', 'sucres', 'eau']) {
    const value = aliment[macro];
    if (value !== null && value !== undefined) {
      macros[macro] = Math.round(value * (quantity / 100) * 100) / 100;
    }
  }

  return {
    aliment: {
      code: aliment.code,
      nom: aliment.nom,
      groupe: aliment.groupe
    },
    quantity,
    macros,
    micronutriments: nutriments,
    nutriments_info,
    recommandations: recommandationsMap,
    pourcentages,
    units: NUTRIENT_UNITS
  };
}

