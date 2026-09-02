import React from 'react';
import { PHONE_ADMIN } from '../data/projects';

export default function Hero() {
  return (
    <section className="bg-white border-b border-slate-200 py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-6 border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Fast-Track Delivery Option Available</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900">
          Solusi Cepat Tugas <span className="text-sky-600">IT</span>, <span className="text-orange-500">Desain</span>, <span className="text-teal-600">Editing</span> & <span className="text-amber-500">Data</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Tidak perlu pusing mencari-cari contoh karya. Pilih kategori yang kamu butuhkan, cek pratinjau hasil, dan pesan langsung via WhatsApp!
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#katalog"
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md"
          >
            Eksplorasi Katalog Works
          </a>
          <a
            href={`https://wa.me/${PHONE_ADMIN}?text=Halo%20Jokify!%20Aku%20mau%20request%20custom`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm px-6 py-3.5 rounded-xl transition-all"
          >
            Request Custom Project
          </a>
        </div>
      </div>
    </section>
  );
}