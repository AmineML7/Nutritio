// Librairie pour gérer les données nutritionnelles
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface Aliment {
  code: number;
  nom: string;
  groupe: string;
  sous_groupe: string;
  energie_kcal?: number;
  proteines?: number;
  glucides?: number;
  lipides?: number;
  fibres?: number;
  sucres?: number;
  eau?: number;
  [key: string]: any;
}

export interface Recommandation {
  Nutriment: string;
  Unité: string;
  Homme: number;
  Femme: number;
}

// Mapping des nutriments
export const NUTRIENT_MAPPING: { [key: string]: string } = {
  vitamine_C: 'Vitamine C',
  vitamine_D: 'Vitamine D',
  vitamine_E: 'Vitamine E',
  vitamine_B1: 'Vitamine B1',
  vitamine_B2: 'Vitamine B2',
  vitamine_B3: 'Vitamine B3',
  vitamine_B5: 'Vitamine B5',
  vitamine_B6: 'Vitamine B6',
  vitamine_B9: 'Folates',
  vitamine_B12: 'Vitamine B12',
  calcium: 'Calcium',
  cuivre: 'Cuivre',
  fer: 'Fer',
  iode: 'Iode',
  magnesium: 'Magnésium',
  manganese: 'Manganèse',
  phosphore: 'Phosphore',
  potassium: 'Potassium',
  selenium: 'Sélénium',
  sodium: 'Sodium',
  zinc: 'Zinc'
};

export const NUTRIENT_INFO_ONLY: { [key: string]: string } = {
  retinol: 'Rétinol (Vitamine A)',
  beta_carotene: 'Bêta-Carotène',
  vitamine_K1: 'Vitamine K1',
  vitamine_K2: 'Vitamine K2'
};

export const NUTRIENT_UNITS: { [key: string]: string } = {
  retinol: 'µg',
  beta_carotene: 'µg',
  vitamine_D: 'µg',
  vitamine_K1: 'µg',
  vitamine_K2: 'µg',
  vitamine_B9: 'µg',
  vitamine_B12: 'µg',
  iode: 'µg',
  selenium: 'µg',
  vitamine_E: 'mg',
  vitamine_C: 'mg',
  vitamine_B1: 'mg',
  vitamine_B2: 'mg',
  vitamine_B3: 'mg',
  vitamine_B5: 'mg',
  vitamine_B6: 'mg',
  calcium: 'mg',
  cuivre: 'mg',
  fer: 'mg',
  magnesium: 'mg',
  manganese: 'mg',
  phosphore: 'mg',
  potassium: 'mg',
  sodium: 'mg',
  zinc: 'mg'
};

// Cache pour éviter de recharger les fichiers à chaque requête
let alimentsCache: Aliment[] | null = null;
let recommandationsCache: Recommandation[] | null = null;

export function loadAliments(): Aliment[] {
  if (alimentsCache) return alimentsCache;

  const csvPath = path.join(process.cwd(), 'public', 'data', 'aliments.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  
  alimentsCache = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    cast: (value, context) => {
      if (context.column === 'code') return parseInt(value);
      if (value === '' || value === 'NA') return null;
      const num = parseFloat(value);
      return isNaN(num) ? value : num;
    }
  });

  return alimentsCache;
}

export function loadRecommandations(): Recommandation[] {
  if (recommandationsCache) return recommandationsCache;

  const csvPath = path.join(process.cwd(), 'public', 'data', 'recommandations.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  
  recommandationsCache = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    cast: (value, context) => {
      if (context.column === 'Homme' || context.column === 'Femme') {
        return parseFloat(value);
      }
      return value;
    }
  });

  return recommandationsCache;
}

export function searchAliments(query: string): Aliment[] {
  const aliments = loadAliments();
  const lowerQuery = query.toLowerCase();
  
  return aliments
    .filter(aliment => aliment.nom.toLowerCase().includes(lowerQuery))
    .slice(0, 20);
}

export function getAliment(code: number): Aliment | undefined {
  const aliments = loadAliments();
  return aliments.find(aliment => aliment.code === code);
}

export function calculateNutrients(code: number, quantity: number, gender: 'Homme' | 'Femme') {
  const aliment = getAliment(code);
  if (!aliment) return null;

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
        nutriments[recoName] = Math.round(calculatedValue * 100) / 100;
        const reco = recommandations.find(r => r.Nutriment === recoName);
        if (reco) {
          const recoValueMg = reco[gender] * 1000;
          recommandationsMap[recoName] = recoValueMg;
          pourcentages[recoName] = Math.round((calculatedValue / recoValueMg) * 100 * 10) / 10;
        }
      } else {
        nutriments[recoName] = Math.round(calculatedValue * 100) / 100;
        const reco = recommandations.find(r => r.Nutriment === recoName);
        if (reco) {
          recommandationsMap[recoName] = reco[gender];
          pourcentages[recoName] = Math.round((calculatedValue / reco[gender]) * 100 * 10) / 10;
        }
      }
    }
  }

  // Nutriments informatifs
  for (const [colName, displayName] of Object.entries(NUTRIENT_INFO_ONLY)) {
    const value = aliment[colName];
    if (value !== null && value !== undefined) {
      nutriments_info[displayName] = Math.round(value * (quantity / 100) * 100) / 100;
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

