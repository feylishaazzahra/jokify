import React from 'react';
import { PHONE_ADMIN } from '../data/projects';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <div className="font-extrabold text-2xl tracking-tight text-slate-900 flex items-center">
            <span>JO</span>
            <span className="text-amber-500 relative flex items-center justify-center">O</span>
            <span>Ki</span>
            <span className="text-sky-600">F</span>
            <span className="text-teal-600">Y</span>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
            Portfolio & Catalog
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <a href="#about" className="hover:text-slate-900 transition-colors">Tentang</a>
          <a href="#skills" className="hover:text-slate-900 transition-colors">Layanan</a>
          <a href="#katalog" className="hover:text-slate-900 transition-colors">Katalog</a>
          <a href="#alur" className="hover:text-slate-900 transition-colors">Alur Kerja</a>
        </nav>

        <a
          href={`https://wa.me/${PHONE_ADMIN}?text=Halo%20Jokify!%20Aku%20mau%20konsultasi%20tugas/proyek`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2"
        >
          <span>💬 Chat Admin WA</span>
        </a>
      </div>
    </header>
  );
}