'use client';

import { useState } from 'react';

interface DataSourceSelectorProps {
  onSourceChange: (source: 'ciqual' | 'usda') => void;
}

export default function DataSourceSelector({ onSourceChange }: DataSourceSelectorProps) {
  const [source, setSource] = useState<'ciqual' | 'usda'>('usda');

  const handleChange = (newSource: 'ciqual' | 'usda') => {
    setSource(newSource);
    onSourceChange(newSource);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4 mb-6">
      <h3 className="text-xs font-medium text-gray-700 mb-3">Base de données</h3>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleChange('usda')}
          className={`py-2 px-3 rounded-md text-xs font-medium transition-all ${
            source === 'usda'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="font-semibold">USDA</div>
          <div className="text-[10px] opacity-75">300,000+ aliments</div>
        </button>
        <button
          onClick={() => handleChange('ciqual')}
          className={`py-2 px-3 rounded-md text-xs font-medium transition-all ${
            source === 'ciqual'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="font-semibold">CIQUAL</div>
          <div className="text-[10px] opacity-75">3,000 aliments FR</div>
        </button>
      </div>
    </div>
  );
}

