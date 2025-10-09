'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import GenderSelector from '@/components/GenderSelector';
import SearchBar from '@/components/SearchBar';
import SelectedAliment from '@/components/SelectedAliment';
import AlimentsList from '@/components/AlimentsList';
import NutrientsResults from '@/components/NutrientsResults';
import DailyHistory from '@/components/DailyHistory';
import EvolutionCharts from '@/components/EvolutionCharts';
import { Aliment, AlimentInList, MacroNutrients } from './types';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [gender, setGender] = useState<'Homme' | 'Femme'>('Homme');
  const [selectedAliment, setSelectedAliment] = useState<Aliment | null>(null);
  const [alimentsList, setAlimentsList] = useState<AlimentInList[]>([]);
  const [totals, setTotals] = useState<{
    macros: MacroNutrients;
    micros: { [key: string]: number };
    nutriments_info: { [key: string]: number };
    pourcentages: { [key: string]: number };
  } | null>(null);

  // Fonction pour calculer les totaux (avec useCallback pour éviter les re-renders)
  const calculateTotals = useCallback(async () => {
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
  }, [alimentsList, gender]);

  // Rediriger vers login si non connecté
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Charger automatiquement les aliments du jour actuel depuis l'historique
  useEffect(() => {
    const loadTodayFromHistory = async () => {
      if (!session?.user?.id) return;
      
      try {
        const response = await fetch('/api/history');
        if (response.ok) {
          const history = await response.json();
          const today = new Date().toISOString().split('T')[0];
          const todayEntry = history.find((entry: any) => entry.date === today);
          
          if (todayEntry && todayEntry.aliments.length > 0) {
            setAlimentsList(todayEntry.aliments);
          }
        }
      } catch (error) {
        console.error('Erreur chargement journée actuelle:', error);
      }
    };

    loadTodayFromHistory();
  }, [session?.user?.id]);

  // Calculer les totaux quand la liste change
  useEffect(() => {
    if (alimentsList.length > 0) {
      calculateTotals();
    } else {
      setTotals(null);
    }
  }, [alimentsList, calculateTotals]);

  // Afficher un loader pendant la vérification de la session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/60 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

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

  const handleLoadList = (aliments: AlimentInList[]) => {
    setAlimentsList(aliments);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/60">
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

            <DailyHistory
              currentList={alimentsList}
              onLoadDay={handleLoadList}
            />
          </aside>

          {/* Colonne droite - Résultats */}
          <div className="lg:col-span-8 space-y-6">
            {/* Graphiques d'évolution */}
            <EvolutionCharts />

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
      <footer className="border-t border-emerald-200 mt-16 py-8 bg-gradient-to-b from-white to-emerald-50/60">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500">
          <p>Données nutritionnelles <span className="text-emerald-600 font-medium">CIQUAL 2020</span> — ANSES</p>
        </div>
      </footer>
    </div>
  );
}
