import { NextRequest, NextResponse } from 'next/server';
import { calculateNutrients } from '@/lib/data';
import { getUSDAFood, convertUSDAToOurFormat } from '@/lib/usda';
import { loadRecommandations, NUTRIENT_MAPPING, NUTRIENT_INFO_ONLY, NUTRIENT_UNITS } from '@/lib/data';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code, quantity, gender, source } = body;

  if (!code || !quantity) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
  }

  try {
    // Si c'est un aliment USDA
    if (source === 'USDA') {
      const usdaFood = await getUSDAFood(parseInt(code));
      const converted = convertUSDAToOurFormat(usdaFood);
      
      // Calculer les nutriments comme pour CIQUAL
      const recommandations = loadRecommandations();
      const nutriments: { [key: string]: number } = {};
      const nutriments_info: { [key: string]: number } = {};
      const recommandationsMap: { [key: string]: number } = {};
      const pourcentages: { [key: string]: number } = {};
      
      // Nutriments avec recommandations
      for (const [colName, recoName] of Object.entries(NUTRIENT_MAPPING)) {
        const value = converted[colName];
        
        if (value !== null && value !== undefined) {
          const calculatedValue = value * (parseFloat(quantity) / 100);
          
          if (colName === 'potassium' || colName === 'sodium') {
            nutriments[recoName] = Math.round(calculatedValue * 100) / 100;
            const reco = recommandations.find(r => r.Nutriment === recoName);
            if (reco) {
              const recoValueMg = reco[gender as 'Homme' | 'Femme'] * 1000;
              recommandationsMap[recoName] = recoValueMg;
              pourcentages[recoName] = Math.round((calculatedValue / recoValueMg) * 100 * 10) / 10;
            }
          } else {
            nutriments[recoName] = Math.round(calculatedValue * 100) / 100;
            const reco = recommandations.find(r => r.Nutriment === recoName);
            if (reco) {
              recommandationsMap[recoName] = reco[gender as 'Homme' | 'Femme'];
              pourcentages[recoName] = Math.round((calculatedValue / reco[gender as 'Homme' | 'Femme']) * 100 * 10) / 10;
            }
          }
        }
      }
      
      // Nutriments informatifs
      for (const [colName, displayName] of Object.entries(NUTRIENT_INFO_ONLY)) {
        const value = converted[colName];
        if (value !== null && value !== undefined) {
          nutriments_info[displayName] = Math.round(value * (parseFloat(quantity) / 100) * 100) / 100;
        }
      }
      
      // Macronutriments
      const macros: { [key: string]: number } = {};
      for (const macro of ['energie_kcal', 'proteines', 'glucides', 'lipides', 'fibres', 'sucres', 'eau']) {
        const value = converted[macro];
        if (value !== null && value !== undefined) {
          macros[macro] = Math.round(value * (parseFloat(quantity) / 100) * 100) / 100;
        }
      }
      
      return NextResponse.json({
        aliment: {
          code: converted.code,
          nom: converted.nom,
          groupe: converted.groupe,
          source: 'USDA'
        },
        quantity: parseFloat(quantity),
        macros,
        micronutriments: nutriments,
        nutriments_info,
        recommandations: recommandationsMap,
        pourcentages,
        units: NUTRIENT_UNITS
      });
    }
    
    // Sinon, utiliser CIQUAL
    const results = calculateNutrients(
      parseInt(code),
      parseFloat(quantity),
      gender || 'Homme'
    );

    if (!results) {
      return NextResponse.json({ error: 'Aliment non trouvé' }, { status: 404 });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error calculating nutrients:', error);
    return NextResponse.json({ error: 'Erreur lors du calcul' }, { status: 500 });
  }
}

