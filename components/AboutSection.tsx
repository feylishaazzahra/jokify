import React from 'react';

export default function AboutSection() {
  return (
    <section id="about" className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm">
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-xs font-bold text-sky-600 tracking-wider uppercase">About Jokify</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">Turning Ideas into Pixel-Perfect Solutions</h2>
        <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
          Jokify dirancang khusus untuk mempermudah kamu menemukan referensi dan pemesanan eksekusi cepat. Kami berfokus pada kerapihan hasil, kecepatan respon, dan kemudahan alur pemesanan tanpa perantara yang rumit.
        </p>
      </div>
    </section>
  );
}