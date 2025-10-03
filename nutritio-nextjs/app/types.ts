export interface Aliment {
  code: number;
  nom: string;
  groupe: string;
  sous_groupe?: string;
}

export interface AlimentData extends Aliment {
  [key: string]: any;
}

export interface MacroNutrients {
  energie_kcal?: number;
  proteines?: number;
  glucides?: number;
  lipides?: number;
  fibres?: number;
  sucres?: number;
  eau?: number;
}

export interface AlimentInList {
  id: number;
  aliment: Aliment;
  quantity: number;
  macros: MacroNutrients;
  micronutriments: { [key: string]: number };
  nutriments_info?: { [key: string]: number };
}

export interface NutrientResults {
  aliment: Aliment;
  quantity: number;
  macros: MacroNutrients;
  micronutriments: { [key: string]: number };
  nutriments_info: { [key: string]: number };
  recommandations: { [key: string]: number };
  pourcentages: { [key: string]: number };
  units: { [key: string]: string };
}

