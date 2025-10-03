'use client';

import { useState, useEffect, useRef } from 'react';
import { Aliment } from '@/app/types';

interface SearchBarProps {
  onSelectAliment: (aliment: Aliment) => void;
}

export default function SearchBar({ onSelectAliment }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Aliment[]>([]);
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
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data);
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

  const handleSelect = (aliment: Aliment) => {
    onSelectAliment(aliment);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-6">
      <h2 className="text-sm font-medium text-gray-900 mb-4">Rechercher un aliment</h2>
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

        {showResults && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
            {results.map((aliment) => (
              <div
                key={aliment.code}
                onClick={() => handleSelect(aliment)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900">{aliment.nom}</div>
                <div className="text-xs text-gray-500 mt-0.5">{aliment.groupe}</div>
              </div>
            ))}
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
