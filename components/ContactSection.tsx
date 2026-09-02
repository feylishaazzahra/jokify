import React from 'react';
import { PHONE_ADMIN } from '../data/projects';

export default function ContactSection() {
  return (
    <section className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl text-center max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Siap Selesaikan Tugas & Proyek Kamu?</h2>
      <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-xl mx-auto">
        Konsultasikan brief atau pertanyaan kamu secara langsung dengan admin Jokify melalui WhatsApp.
      </p>
      <div className="mt-6 flex justify-center">
        <a
          href={`https://wa.me/${PHONE_ADMIN}?text=Halo%20Jokify!%20Aku%20mau%20konsultasi%20pengerjaan`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-sm px-8 py-3.5 rounded-xl transition-all shadow-md"
        >
          💬 Konsultasi via WhatsApp
        </a>
      </div>
    </section>
  );
}