'use client';

import { Header } from '../components/layout/Header';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />

      <main className="pt-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-serif text-Color-Dark-500 mb-6">
            Diamonds by CS
          </h1>
          <p className="text-xl text-Color-Gray-500 max-w-2xl mx-auto mb-12">
            Next.js Migration - Phase 3 Complete
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-8 bg-white rounded-sm shadow-sm">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-serif mb-2">Foundation</h3>
              <p className="text-sm text-gray-600">Utils, hooks, contexts</p>
            </div>
            <div className="p-8 bg-white rounded-sm shadow-sm">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-serif mb-2">Components</h3>
              <p className="text-sm text-gray-600">50 components copied</p>
            </div>
            <div className="p-8 bg-white rounded-sm shadow-sm">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-serif mb-2">Layout</h3>
              <p className="text-sm text-gray-600">Header working</p>
            </div>
            <div className="p-8 bg-white rounded-sm shadow-sm border-2 border-Color-Champagne-Gold">
              <div className="text-4xl mb-4">→</div>
              <h3 className="text-xl font-serif mb-2">Pages</h3>
              <p className="text-sm text-gray-600">Next: Routes</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
