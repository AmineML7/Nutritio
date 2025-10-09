'use client';

import { useState, useEffect } from 'react';
import { AlimentInList } from '@/app/types';

interface DailyEntry {
  id: string;
  date: string;
  dateDisplay: string;
  aliments: AlimentInList[];
  totalCalories: number;
}

interface DailyHistoryProps {
  currentList: AlimentInList[];
  onLoadDay: (aliments: AlimentInList[]) => void;
}

export default function DailyHistory({ currentList, onLoadDay }: DailyHistoryProps) {
  const [history, setHistory] = useState<DailyEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Charger l'historique depuis la base de données
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/history');
        if (response.ok) {
          const data = await response.json();
          // Transformer les données pour correspondre au format DailyEntry
          const formatted = data.map((entry: any) => ({
            id: entry.date,
            date: entry.date,
            dateDisplay: new Date(entry.date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            aliments: entry.aliments,
            totalCalories: Math.round(entry.totalCalories)
          }));
          setHistory(formatted);
        }
      } catch (error) {
        console.error('Erreur chargement historique:', error);
      }
    };
    fetchHistory();
  }, []);

  // Sauvegarder automatiquement la liste actuelle chaque fois qu'elle change
  useEffect(() => {
    const saveHistory = async () => {
      if (currentList.length === 0) return;

      const today = new Date();
      const dateKey = today.toISOString().split('T')[0];
      const totalCalories = currentList.reduce((sum, item) => 
        sum + (item.macros.energie_kcal || 0), 0
      );

      try {
        const response = await fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: dateKey,
            aliments: currentList,
            totalCalories
          })
        });

        if (response.ok) {
          // Rafraîchir l'historique
          const historyResponse = await fetch('/api/history');
          if (historyResponse.ok) {
            const data = await historyResponse.json();
            const formatted = data.map((entry: any) => ({
              id: entry.date,
              date: entry.date,
              dateDisplay: new Date(entry.date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              aliments: entry.aliments,
              totalCalories: Math.round(entry.totalCalories)
            }));
            setHistory(formatted);
          }
        }
      } catch (error) {
        console.error('Erreur sauvegarde historique:', error);
      }
    };

    saveHistory();
  }, [currentList]);

  const loadDay = (entry: DailyEntry) => {
    onLoadDay(entry.aliments);
    setShowHistory(false);
  };

  const deleteDay = async (dateKey: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette journée ?')) {
      try {
        await fetch(`/api/history?date=${dateKey}`, { method: 'DELETE' });
        setHistory(prev => prev.filter(entry => entry.date !== dateKey));
      } catch (error) {
        console.error('Erreur suppression entrée:', error);
      }
    }
  };

  const clearHistory = async () => {
    if (confirm('Voulez-vous vraiment supprimer tout l\'historique ?')) {
      try {
        // Supprimer toutes les entrées
        await Promise.all(
          history.map(entry => 
            fetch(`/api/history?date=${entry.date}`, { method: 'DELETE' })
          )
        );
        setHistory([]);
      } catch (error) {
        console.error('Erreur suppression historique:', error);
      }
    }
  };

  // Aujourd'hui
  const today = new Date().toISOString().split('T')[0];
  const todayEntry = history.find(e => e.date === today);

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-lg p-6 hover:border-emerald-300 hover:shadow-sm transition-all relative z-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-medium text-emerald-900">
          Historique <span className="text-emerald-600/60">({history.length} jours)</span>
        </h2>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-xs text-gray-500 hover:text-red-600 transition-colors"
            title="Effacer tout l'historique"
          >
            Effacer
          </button>
        )}
      </div>

      {/* Indicateur du jour actuel */}
      {todayEntry && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3 mb-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-emerald-900">Aujourd'hui</span>
          </div>
          <p className="text-xs text-gray-600">
            {todayEntry.aliments.length} aliment{todayEntry.aliments.length > 1 ? 's' : ''}
            {' · '}
            {todayEntry.totalCalories} kcal
          </p>
        </div>
      )}

      {/* Bouton pour afficher/masquer l'historique */}
      {history.length > 0 && (
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full py-2.5 px-4 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {showHistory ? 'Masquer l\'historique' : 'Voir l\'historique'}
        </button>
      )}

      {/* Liste de l'historique */}
      {showHistory && (
        <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
          {history.map((entry, index) => {
            const isToday = entry.date === today;
            const isYesterday = entry.date === new Date(Date.now() - 86400000).toISOString().split('T')[0];
            
            let dateLabel = entry.dateDisplay;
            if (isToday) dateLabel = "Aujourd'hui";
            else if (isYesterday) dateLabel = "Hier";
            else {
              // Afficher seulement la date courte
              const d = new Date(entry.date);
              dateLabel = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
            }

            return (
              <div
                key={entry.id}
                className={`border rounded-md p-3 transition-all group ${
                  isToday 
                    ? 'bg-emerald-50 border-emerald-300' 
                    : 'bg-gray-50 border-gray-200 hover:bg-emerald-50 hover:border-emerald-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {isToday && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>}
                      <h4 className="text-sm font-medium text-gray-900">{dateLabel}</h4>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {entry.aliments.length} aliment{entry.aliments.length > 1 ? 's' : ''}
                      {' · '}
                      {entry.totalCalories} kcal
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {!isToday && (
                      <button
                        onClick={() => loadDay(entry)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded transition-colors"
                        title="Charger cette journée"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => deleteDay(entry.date)}
                      className="p-1.5 text-red-500 hover:bg-red-100 rounded transition-colors"
                      title="Supprimer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-400 line-clamp-1">
                  {entry.aliments.slice(0, 2).map(a => a.aliment.nom).join(', ')}
                  {entry.aliments.length > 2 && ` + ${entry.aliments.length - 2} autre${entry.aliments.length - 2 > 1 ? 's' : ''}`}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {history.length === 0 && (
        <p className="text-xs text-gray-400 text-center mt-4">
          Aucun historique pour le moment
        </p>
      )}
    </div>
  );
}

