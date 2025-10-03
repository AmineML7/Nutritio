'use client';

import { AlimentInList } from '@/app/types';

interface AlimentsListProps {
  aliments: AlimentInList[];
  onRemove: (id: number) => void;
  onClear: () => void;
}

export default function AlimentsList({ aliments, onRemove, onClear }: AlimentsListProps) {
  if (aliments.length === 0) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-lg p-6 hover:border-emerald-300 hover:shadow-sm transition-all">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-medium text-emerald-900">
          Ma liste <span className="text-emerald-600/60">({aliments.length})</span>
        </h2>
        <button
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-red-600 transition-colors"
        >
          Vider
        </button>
      </div>

      <div className="space-y-2">
        {aliments.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-emerald-50 hover:border-emerald-100 border border-transparent transition-all group"
          >
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-gray-900">{item.aliment.nom}</span>
                <span className="text-xs text-gray-500">{item.quantity}g</span>
              </div>
              <div className="flex gap-3 mt-1 text-xs text-gray-500">
                <span>{Math.round(item.macros.energie_kcal || 0)} kcal</span>
                <span>P: {Math.round((item.macros.proteines || 0) * 10) / 10}g</span>
                <span>G: {Math.round((item.macros.glucides || 0) * 10) / 10}g</span>
                <span>L: {Math.round((item.macros.lipides || 0) * 10) / 10}g</span>
              </div>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all ml-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
