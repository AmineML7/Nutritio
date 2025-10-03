// Librairie pour gérer les données USDA FoodData Central

const USDA_API_KEY = process.env.USDA_API_KEY;
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

// Mapping des IDs de nutriments USDA vers nos noms
export const USDA_NUTRIENT_MAPPING: { [key: string]: string } = {
  // Macronutriments
  '208': 'energie_kcal',      // Energy (kcal)
  '203': 'proteines',         // Protein
  '205': 'glucides',          // Carbohydrate
  '204': 'lipides',           // Total lipid (fat)
  '291': 'fibres',            // Fiber, total dietary
  '269': 'sucres',            // Sugars, total
  '255': 'eau',               // Water
  
  // Vitamines
  '401': 'vitamine_C',        // Vitamin C
  '328': 'vitamine_D',        // Vitamin D (D2 + D3)
  '323': 'vitamine_E',        // Vitamin E (alpha-tocopherol)
  '404': 'vitamine_B1',       // Thiamin
  '405': 'vitamine_B2',       // Riboflavin
  '406': 'vitamine_B3',       // Niacin
  '410': 'vitamine_B5',       // Pantothenic acid
  '415': 'vitamine_B6',       // Vitamin B-6
  '417': 'vitamine_B9',       // Folate, total
  '418': 'vitamine_B12',      // Vitamin B-12
  '320': 'retinol',           // Vitamin A, RAE
  '321': 'beta_carotene',     // Carotene, beta
  '430': 'vitamine_K1',       // Vitamin K (phylloquinone)
  
  // Minéraux
  '301': 'calcium',           // Calcium, Ca
  '312': 'cuivre',            // Copper, Cu
  '303': 'fer',               // Iron, Fe
  '304': 'magnesium',         // Magnesium, Mg
  '315': 'manganese',         // Manganese, Mn
  '305': 'phosphore',         // Phosphorus, P
  '306': 'potassium',         // Potassium, K
  '317': 'selenium',          // Selenium, Se
  '307': 'sodium',            // Sodium, Na
  '309': 'zinc',              // Zinc, Zn
  '314': 'iode',              // Iodine, I (rare dans USDA)
};

export interface USDAFood {
  fdcId: number;
  description: string;
  dataType?: string;
  foodCategory?: {
    id?: number;
    code?: string;
    description?: string;
  } | string;
  foodNutrients: Array<{
    type: string;
    nutrient: {
      id: number;
      number: string;
      name: string;
      rank: number;
      unitName: string;
    };
    amount?: number;
    id?: number;
  }>;
}

export interface USDASearchResult {
  totalHits: number;
  currentPage: number;
  totalPages: number;
  foods: USDAFood[];
}

export async function searchUSDAFoods(query: string, pageSize: number = 20): Promise<USDASearchResult> {
  try {
    const response = await fetch(
      `${USDA_BASE_URL}/foods/search?query=${encodeURIComponent(query)}&pageSize=${pageSize}&api_key=${USDA_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache 1 heure
    );

    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching from USDA:', error);
    throw error;
  }
}

export async function getUSDAFood(fdcId: number): Promise<USDAFood> {
  try {
    const response = await fetch(
      `${USDA_BASE_URL}/food/${fdcId}?api_key=${USDA_API_KEY}`,
      { next: { revalidate: 86400 } } // Cache 24 heures
    );

    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching food from USDA:', error);
    throw error;
  }
}

// Convertir un aliment USDA en format compatible avec notre app
export function convertUSDAToAliment(usdaFood: USDAFood): any {
  // Extraire le groupe correctement
  let groupeName = 'Non catégorisé';
  if (usdaFood.foodCategory) {
    if (typeof usdaFood.foodCategory === 'string') {
      groupeName = usdaFood.foodCategory;
    } else if (usdaFood.foodCategory.description) {
      groupeName = usdaFood.foodCategory.description;
    }
  }

  const aliment: any = {
    code: usdaFood.fdcId,
    nom: usdaFood.description,
    groupe: groupeName,
    sous_groupe: usdaFood.dataType || 'USDA',
  };

  // Mapper les nutriments
  usdaFood.foodNutrients.forEach(foodNutrient => {
    // Vérifier que le nutriment a une valeur
    if (!foodNutrient.amount || !foodNutrient.nutrient) {
      return;
    }

    const nutrientKey = USDA_NUTRIENT_MAPPING[foodNutrient.nutrient.number];
    if (nutrientKey) {
      let value = foodNutrient.amount;
      
      // Convertir les unités si nécessaire
      const unitName = foodNutrient.nutrient.unitName.toUpperCase();
      
      // USDA utilise g pour certains nutriments, nous utilisons mg
      if (unitName === 'G' && !['proteines', 'glucides', 'lipides', 'fibres', 'sucres', 'eau', 'energie_kcal'].includes(nutrientKey)) {
        value = value * 1000; // Convertir g en mg
      }
      
      // USDA utilise µg (UG), nous aussi pour certains - pas de conversion
      
      aliment[nutrientKey] = value;
    }
  });

  return aliment;
}

// Recherche avec traduction automatique (optionnel)
const TRANSLATIONS: { [key: string]: string } = {
  'pomme': 'apple',
  'banane': 'banana',
  'poulet': 'chicken',
  'riz': 'rice',
  'tomate': 'tomato',
  'carotte': 'carrot',
  'boeuf': 'beef',
  'poisson': 'fish',
  'lait': 'milk',
  'fromage': 'cheese',
  'pain': 'bread',
  'oeuf': 'egg',
  'orange': 'orange',
  'fraise': 'strawberry',
  'raisin': 'grape',
  'poire': 'pear',
  'peche': 'peach',
  'ananas': 'pineapple',
  'mangue': 'mango',
  'brocoli': 'broccoli',
  'épinard': 'spinach',
  'chou': 'cabbage',
  'oignon': 'onion',
  'ail': 'garlic',
  'poivre': 'pepper',
  'sel': 'salt',
  'huile': 'oil',
  'beurre': 'butter',
  'yaourt': 'yogurt',
  'chocolat': 'chocolate',
  'café': 'coffee',
  'thé': 'tea',
};

export function translateToEnglish(frenchQuery: string): string {
  const lowerQuery = frenchQuery.toLowerCase();
  
  // Chercher une traduction exacte
  if (TRANSLATIONS[lowerQuery]) {
    return TRANSLATIONS[lowerQuery];
  }
  
  // Chercher une traduction partielle
  for (const [fr, en] of Object.entries(TRANSLATIONS)) {
    if (lowerQuery.includes(fr)) {
      return lowerQuery.replace(fr, en);
    }
  }
  
  // Si pas de traduction, retourner la requête originale
  return frenchQuery;
}

