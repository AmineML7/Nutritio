'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DailyEntry {
  date: string;
  dateDisplay: string;
  aliments: any[];
  totalCalories: number;
}

interface EvolutionChartsProps {
  className?: string;
}

export default function EvolutionCharts({ className = '' }: EvolutionChartsProps) {
  const [history, setHistory] = useState<DailyEntry[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'calories' | 'proteines' | 'vitamines'>('calories');
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('nutritio_daily_history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  // Préparer les données pour les graphiques
  const prepareChartData = () => {
    return history
      .slice(0, 14) // Derniers 14 jours
      .reverse() // Du plus ancien au plus récent
      .map(entry => {
        const date = new Date(entry.date);
        const label = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
        
        // Calculer les totaux
        const proteines = entry.aliments.reduce((sum, item) => 
          sum + (item.macros.proteines || 0), 0
        );
        const glucides = entry.aliments.reduce((sum, item) => 
          sum + (item.macros.glucides || 0), 0
        );
        const lipides = entry.aliments.reduce((sum, item) => 
          sum + (item.macros.lipides || 0), 0
        );

        // Calculer les vitamines moyennes (en %)
        const vitC = entry.aliments.reduce((sum, item) => {
          const micronutriments = item.micronutriments || {};
          return sum + (micronutriments['Vitamine C'] || 0);
        }, 0);

        const vitD = entry.aliments.reduce((sum, item) => {
          const micronutriments = item.micronutriments || {};
          return sum + (micronutriments['Vitamine D'] || 0);
        }, 0);

        return {
          date: label,
          calories: entry.totalCalories,
          proteines: Math.round(proteines * 10) / 10,
          glucides: Math.round(glucides * 10) / 10,
          lipides: Math.round(lipides * 10) / 10,
          vitC: Math.round(vitC * 10) / 10,
          vitD: Math.round(vitD * 10) / 10,
        };
      });
  };

  const chartData = prepareChartData();

  if (history.length < 2) {
    return (
      <div className={`bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-lg p-6 ${className}`}>
        <h2 className="text-sm font-medium text-emerald-900 mb-2">Évolution</h2>
        <p className="text-xs text-gray-500">
          Ajoutez des aliments pendant plusieurs jours pour voir l'évolution
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-lg p-6 hover:border-emerald-300 hover:shadow-sm transition-all ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-medium text-emerald-900">
          Évolution ({history.length} jours)
        </h2>
        <button
          onClick={() => setShowCharts(!showCharts)}
          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
        >
          {showCharts ? 'Masquer' : 'Afficher'}
        </button>
      </div>

      {showCharts && (
        <>
          {/* Sélecteur de métrique */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              onClick={() => setSelectedMetric('calories')}
              className={`py-2 px-3 rounded-md text-xs font-medium transition-all ${
                selectedMetric === 'calories'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Calories
            </button>
            <button
              onClick={() => setSelectedMetric('proteines')}
              className={`py-2 px-3 rounded-md text-xs font-medium transition-all ${
                selectedMetric === 'proteines'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Macros
            </button>
            <button
              onClick={() => setSelectedMetric('vitamines')}
              className={`py-2 px-3 rounded-md text-xs font-medium transition-all ${
                selectedMetric === 'vitamines'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vitamines
            </button>
          </div>

          {/* Graphique Calories */}
          {selectedMetric === 'calories' && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11, fill: '#666' }}
                    stroke="#e0e0e0"
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#666' }}
                    stroke="#e0e0e0"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#059669" 
                    strokeWidth={2}
                    dot={{ fill: '#059669', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Calories (kcal)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Graphique Macronutriments */}
          {selectedMetric === 'proteines' && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11, fill: '#666' }}
                    stroke="#e0e0e0"
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#666' }}
                    stroke="#e0e0e0"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="proteines" fill="#ec4899" name="Protéines (g)" />
                  <Bar dataKey="glucides" fill="#3b82f6" name="Glucides (g)" />
                  <Bar dataKey="lipides" fill="#059669" name="Lipides (g)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Graphique Vitamines */}
          {selectedMetric === 'vitamines' && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11, fill: '#666' }}
                    stroke="#e0e0e0"
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#666' }}
                    stroke="#e0e0e0"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="vitC" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Vitamine C (mg)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="vitD" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    name="Vitamine D (µg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Statistiques résumées */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {Math.round(chartData.reduce((sum, d) => sum + d.calories, 0) / chartData.length)}
              </div>
              <div className="text-xs text-gray-500">Moy. kcal/j</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {Math.round(chartData.reduce((sum, d) => sum + d.proteines, 0) / chartData.length)}
              </div>
              <div className="text-xs text-gray-500">Moy. prot (g)</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {history.length}
              </div>
              <div className="text-xs text-gray-500">Jours suivis</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

