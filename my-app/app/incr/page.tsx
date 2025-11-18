'use client';

import { useState } from 'react';

export default function IncrPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-blue-100 p-10 space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-widest text-blue-600 font-semibold">
            Narzędzia warsztatowe
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Panel inkrementacji danych</h1>
          <p className="text-gray-600">
            Szybkie testy interakcji klienta – idealne do demonstracji komponentów typu ClientComponent.
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-500 uppercase tracking-widest">Aktualna wartość</p>
          <p className="text-6xl font-semibold text-blue-700 mt-2">{count}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={() => setCount(prev => prev + 1)}
          >
            +1
          </button>
          <button
            className="bg-blue-100 text-blue-700 py-3 rounded-xl font-semibold hover:bg-blue-200 transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={() => setCount(0)}
          >
            Reset
          </button>
          <button
            className="bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={() => setCount(prev => prev - 1)}
          >
            -1
          </button>
        </div>
      </div>
    </div>
  );
}
