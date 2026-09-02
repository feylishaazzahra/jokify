import React from 'react';
import { experienceData } from '../data/experience';

export default function ExperienceTimeline() {
  return (
    <section id="alur" className="scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold text-sky-600 tracking-wider uppercase">Work Process</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Alur Kerja Sederhana</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {experienceData.map((exp, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative">
            <span className="text-xs font-extrabold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md mb-3 inline-block">
              {exp.year}
            </span>
            <h3 className="font-bold text-base text-slate-900">{exp.title}</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">{exp.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}