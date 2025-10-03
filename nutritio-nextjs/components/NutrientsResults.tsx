'use client';

import { MacroNutrients } from '@/app/types';

interface NutrientsResultsProps {
  macros: MacroNutrients;
  micronutriments: { [key: string]: number };
  nutriments_info?: { [key: string]: number };
  pourcentages: { [key: string]: number };
  alimentsCount: number;
}

const MACRO_CONFIG = {
  energie_kcal: { name: 'Énergie', unit: 'kcal' },
  proteines: { name: 'Protéines', unit: 'g' },
  glucides: { name: 'Glucides', unit: 'g' },
  lipides: { name: 'Lipides', unit: 'g' },
  fibres: { name: 'Fibres', unit: 'g' },
  sucres: { name: 'Sucres', unit: 'g' },
  eau: { name: 'Eau', unit: 'g' }
};

export default function NutrientsResults({
  macros,
  micronutriments,
  nutriments_info,
  pourcentages,
  alimentsCount
}: NutrientsResultsProps) {
  const getBarColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-emerald-600';
    if (percentage >= 70) return 'bg-emerald-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getUnit = (nutrient: string): string => {
    if (
      nutrient.includes('Vitamine D') ||
      nutrient.includes('Vitamine B12') ||
      nutrient.includes('Folates') ||
      nutrient.includes('Iode') ||
      nutrient.includes('Sélénium')
    ) {
      return 'µg';
    }
    return 'mg';
  };

  const formatNutrientValue = (nutrient: string, value: number): { value: string; unit: string } => {
    // Pour Potassium et Sodium, afficher en grammes si >= 1g
    if (nutrient === 'Potassium' || nutrient === 'Sodium') {
      if (value >= 1000) {
        return { value: (value / 1000).toFixed(2), unit: 'g' };
      } else {
        return { value: Math.round(value * 10) / 10 + '', unit: 'mg' };
      }
    }
    
    const unit = getUnit(nutrient);
    return { value: Math.round(value * 10) / 10 + '', unit };
  };

  return (
    <div className="space-y-6">
      {/* Macronutriments */}
      <div className="bg-white border border-gray-100 rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Macronutriments</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(macros).map(([key, value]) => {
            const config = MACRO_CONFIG[key as keyof typeof MACRO_CONFIG];
            if (!config) return null;

            return (
              <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-light text-gray-900">
                  {Math.round(value * 10) / 10}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {config.name}
                </div>
                <div className="text-xs text-gray-400">
                  {config.unit}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Micronutriments */}
      <div className="bg-white border border-gray-100 rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">
          Micronutriments <span className="text-gray-400 font-normal">(% besoins quotidiens)</span>
        </h3>
        <div className="space-y-3">
          {Object.entries(micronutriments)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([nutrient, value]) => {
              const percentage = pourcentages[nutrient] || 0;
              const formatted = formatNutrientValue(nutrient, value);

              return (
                <div key={nutrient} className="group">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-sm text-gray-700">{nutrient}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                      <span className="text-xs text-gray-400">
                        {formatted.value} {formatted.unit}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getBarColor(percentage)} transition-all duration-500 rounded-full`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Nutriments informatifs */}
      {nutriments_info && Object.keys(nutriments_info).length > 0 && (
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Autres nutriments
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(nutriments_info)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([nutrient, value]) => (
                <div key={nutrient} className="flex justify-between items-baseline">
                  <span className="text-xs text-gray-600">{nutrient}</span>
                  <span className="text-xs font-medium text-gray-900">
                    {Math.round(value * 10) / 10} µg
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
