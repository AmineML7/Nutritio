'use client';

interface GenderSelectorProps {
  gender: 'Homme' | 'Femme';
  onGenderChange: (gender: 'Homme' | 'Femme') => void;
}

export default function GenderSelector({ gender, onGenderChange }: GenderSelectorProps) {
  return (
    <div className="bg-white border border-emerald-100/50 rounded-lg p-6 hover:border-emerald-200 transition-colors">
      <h2 className="text-sm font-medium text-emerald-900 mb-4">Profil</h2>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onGenderChange('Homme')}
          className={`py-3 px-4 rounded-md text-sm font-medium transition-all ${
            gender === 'Homme'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          Homme
        </button>
        <button
          onClick={() => onGenderChange('Femme')}
          className={`py-3 px-4 rounded-md text-sm font-medium transition-all ${
            gender === 'Femme'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          Femme
        </button>
      </div>
    </div>
  );
}
