'use client';

import { useState, useEffect, useRef } from 'react';
import { Aliment } from '@/app/types';

interface SearchBarProps {
  onSelectAliment: (aliment: Aliment) => void;
}

export default function SearchBar({ onSelectAliment }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Aliment[]>([]);
  const [allResults, setAllResults] = useState<Aliment[]>([]);
  const [displayLimit, setDisplayLimit] = useState(10);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchAliments = async () => {
      if (query.length < 2) {
        setResults([]);
        setAllResults([]);
        setShowResults(false);
        setDisplayLimit(10);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setAllResults(data);
        setResults(data.slice(0, displayLimit));
        setShowResults(true);
      } catch (error) {
        console.error('Erreur de recherche:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchAliments, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Mettre à jour les résultats affichés quand displayLimit change
  useEffect(() => {
    if (allResults.length > 0) {
      setResults(allResults.slice(0, displayLimit));
    }
  }, [displayLimit, allResults]);

  const handleSelect = (aliment: Aliment) => {
    onSelectAliment(aliment);
    setQuery('');
    setShowResults(false);
    setDisplayLimit(10);
  };

  const handleLoadMore = () => {
    setDisplayLimit(prev => prev + 10);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-lg p-6 hover:border-emerald-300 hover:shadow-sm transition-all">
      <h2 className="text-sm font-medium text-emerald-900 mb-4">Rechercher un aliment</h2>
      <div ref={searchRef} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tapez le nom d'un aliment..."
          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-600 border-t-transparent"></div>
          </div>
        )}

        {showResults && allResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
            {/* En-tête avec total */}
            <div className="sticky top-0 bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
              <span className="text-xs font-medium text-gray-700">
                {allResults.length} résultat{allResults.length > 1 ? 's' : ''} trouvé{allResults.length > 1 ? 's' : ''}
              </span>
              {results.length < allResults.length && (
                <span className="text-xs text-gray-500">
                  Affichage {results.length}/{allResults.length}
                </span>
              )}
            </div>

            {/* Liste des résultats */}
            {results.map((aliment) => (
              <div
                key={aliment.code}
                onClick={() => handleSelect(aliment)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900">{aliment.nom}</div>
                <div className="text-xs text-gray-500 mt-0.5">{aliment.groupe}</div>
              </div>
            ))}

            {/* Bouton Voir plus */}
            {results.length < allResults.length && (
              <button
                onClick={handleLoadMore}
                className="w-full px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium text-sm border-t border-emerald-200 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Voir plus ({allResults.length - results.length} restants)
              </button>
            )}
          </div>
        )}

        {showResults && query.length >= 2 && results.length === 0 && !isLoading && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-lg shadow-lg p-4 text-center text-sm text-gray-500">
            Aucun aliment trouvé
          </div>
        )}
      </div>
    </div>
  );
}
