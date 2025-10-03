'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import GenderSelector from '@/components/GenderSelector';
import SearchBar from '@/components/SearchBar';
import SelectedAliment from '@/components/SelectedAliment';
import AlimentsList from '@/components/AlimentsList';
import NutrientsResults from '@/components/NutrientsResults';
import { Aliment, AlimentInList, MacroNutrients } from './types';

export default function Home() {
  const [gender, setGender] = useState<'Homme' | 'Femme'>('Homme');
  const [selectedAliment, setSelectedAliment] = useState<Aliment | null>(null);
  const [alimentsList, setAlimentsList] = useState<AlimentInList[]>([]);
  const [totals, setTotals] = useState<{
    macros: MacroNutrients;
    micros: { [key: string]: number };
    nutriments_info: { [key: string]: number };
    pourcentages: { [key: string]: number };
  } | null>(null);

  useEffect(() => {
    if (alimentsList.length > 0) {
      calculateTotals();
    } else {
      setTotals(null);
    }
  }, [alimentsList, gender]);

  const handleSelectAliment = (aliment: Aliment) => {
    setSelectedAliment(aliment);
  };

  const handleAddAliment = async (quantity: number) => {
    if (!selectedAliment) return;

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: selectedAliment.code,
          quantity,
          gender
        })
      });

      const results = await response.json();

      const newItem: AlimentInList = {
        id: Date.now(),
        aliment: results.aliment,
        quantity: results.quantity,
        macros: results.macros,
        micronutriments: results.micronutriments,
        nutriments_info: results.nutriments_info
      };

      setAlimentsList([...alimentsList, newItem]);
      setSelectedAliment(null);
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    }
  };

  const handleRemoveAliment = (id: number) => {
    setAlimentsList(alimentsList.filter(item => item.id !== id));
  };

  const handleClearList = () => {
    if (confirm('Voulez-vous vraiment vider votre liste ?')) {
      setAlimentsList([]);
    }
  };

  const calculateTotals = async () => {
    const totalMacros: MacroNutrients = {};
    const totalMicros: { [key: string]: number } = {};
    const totalNutrimentsInfo: { [key: string]: number } = {};

    alimentsList.forEach(item => {
      Object.entries(item.macros).forEach(([key, value]) => {
        totalMacros[key as keyof MacroNutrients] =
          (totalMacros[key as keyof MacroNutrients] || 0) + (value || 0);
      });

      Object.entries(item.micronutriments).forEach(([key, value]) => {
        totalMicros[key] = (totalMicros[key] || 0) + value;
      });

      if (item.nutriments_info) {
        Object.entries(item.nutriments_info).forEach(([key, value]) => {
          totalNutrimentsInfo[key] = (totalNutrimentsInfo[key] || 0) + value;
        });
      }
    });

    try {
      const response = await fetch(`/api/recommandations?gender=${gender}`);
      const recommandations = await response.json();

      const pourcentages: { [key: string]: number } = {};

      recommandations.forEach((reco: any) => {
        const nutrient = reco.nutriment;
        if (totalMicros[nutrient] !== undefined) {
          // Pour Potassium et Sodium, la recommandation est en grammes, il faut convertir en mg
          let recoValue = reco.valeur;
          if (nutrient === 'Potassium' || nutrient === 'Sodium') {
            recoValue = reco.valeur * 1000; // Convertir g → mg
          }
          
          pourcentages[nutrient] = parseFloat(
            ((totalMicros[nutrient] / recoValue) * 100).toFixed(1)
          );
        }
      });

      setTotals({
        macros: totalMacros,
        micros: totalMicros,
        nutriments_info: totalNutrimentsInfo,
        pourcentages
      });
    } catch (error) {
      console.error('Erreur lors du calcul des totaux:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Barre latérale fixe et contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Colonne gauche - Contrôles */}
          <aside className="lg:col-span-4 space-y-6">
            <GenderSelector gender={gender} onGenderChange={setGender} />
            <SearchBar onSelectAliment={handleSelectAliment} />
            
            {selectedAliment && (
              <SelectedAliment
                aliment={selectedAliment}
                onAdd={handleAddAliment}
                onCancel={() => setSelectedAliment(null)}
              />
            )}

            <AlimentsList
              aliments={alimentsList}
              onRemove={handleRemoveAliment}
              onClear={handleClearList}
            />
          </aside>

          {/* Colonne droite - Résultats */}
          <div className="lg:col-span-8 space-y-6">
            {totals && (
              <NutrientsResults
                macros={totals.macros}
                micronutriments={totals.micros}
                nutriments_info={totals.nutriments_info}
                pourcentages={totals.pourcentages}
                alimentsCount={alimentsList.length}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer minimaliste */}
      <footer className="border-t border-gray-100 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-400">
          <p>Données nutritionnelles CIQUAL 2020 — ANSES</p>
        </div>
      </footer>
    </div>
  );
}
