import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-8">
      <div className="max-w-7xl mx-auto px-4 text-center sm:flex sm:items-center sm:justify-between text-xs text-slate-500">
        <div className="font-extrabold text-lg tracking-tight text-slate-900 mb-2 sm:mb-0">
          JO<span className="text-amber-500">O</span>Ki<span className="text-sky-600">F</span><span className="text-teal-600">Y</span>
        </div>
        <p>© 2026 Jokify — Turning Ideas into Pixel-Perfect Solutions.</p>
      </div>
    </footer>
  );
}