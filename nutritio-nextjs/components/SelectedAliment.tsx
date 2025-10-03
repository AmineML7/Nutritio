'use client';

import { useState } from 'react';
import { Aliment } from '@/app/types';

interface SelectedAlimentProps {
  aliment: Aliment;
  onAdd: (quantity: number) => void;
  onCancel: () => void;
}

export default function SelectedAliment({ aliment, onAdd, onCancel }: SelectedAlimentProps) {
  const [quantity, setQuantity] = useState(100);

  const handleAdd = () => {
    if (quantity > 0) {
      onAdd(quantity);
    }
  };

  return (
    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-900">{aliment.nom}</h3>
          <p className="text-xs text-gray-500 mt-1">{aliment.groupe}</p>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
          min="1"
          max="10000"
          className="w-24 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
        <span className="text-sm text-gray-600">grammes</span>
      </div>

      <button
        onClick={handleAdd}
        className="w-full bg-emerald-600 text-white py-2.5 px-4 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors"
      >
        Ajouter à ma liste
      </button>
    </div>
  );
}
