'use client';

export default function Header() {
  return (
    <header className="border-b border-emerald-200 bg-gradient-to-r from-emerald-50/50 via-white to-emerald-50/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-wide text-gray-900">
              Nutritio
            </h1>
            <p className="text-sm text-emerald-600 mt-1 font-medium">
              Suivi des micronutriments
            </p>
          </div>
          
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}
