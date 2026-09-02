import React from 'react';
import { skillsData } from '../data/skills';

export default function SkillsSection() {
  return (
    <section id="skills" className="scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold text-teal-600 tracking-wider uppercase">Services & Expertise</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Bidang Keahlian Jokify</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skillsData.map((sk, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all">
            <div className="text-3xl mb-3">{sk.icon}</div>
            <h3 className="font-bold text-lg text-slate-900 mb-3">{sk.title}</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {sk.skills.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}