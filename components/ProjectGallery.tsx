'use client';

import React, { useState } from 'react';
import { portfolioProjects, Project, PHONE_ADMIN } from '../data/projects';

export default function ProjectGallery() {
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const filteredProjects = portfolioProjects.filter((item) => {
    const matchCat = currentCategory === 'all' || item.category === currentCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tools.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section id="katalog" className="scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-bold text-orange-500 tracking-wider uppercase">Interactive Catalog</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Galeri & Contoh Portofolio</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Cari berdasarkan kata kunci atau pilih filter kategori di bawah.</p>
      </div>

      <div className="max-w-xl mx-auto mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Ketik pencarian: Booklet, DFD, C++, SPSS, Video..."
          className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 transition-all shadow-sm"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-4 justify-start sm:justify-center">
        {[
          { id: 'all', label: '⚡ Semua Karya' },
          { id: 'design', label: '🎨 Design & Visuals' },
          { id: 'it', label: '💻 IT & System' },
          { id: 'editing', label: '🎬 Media & Editing' },
          { id: 'data', label: '📊 Data & Academic' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCurrentCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
              currentCategory === cat.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredProjects.map((project) => {
          const waMessage = encodeURIComponent(`Halo Jokify! Aku mau pesan layanan seperti contoh "${project.title}". Boleh bantu detailnya?`);
          const waUrl = `https://wa.me/${PHONE_ADMIN}?text=${waMessage}`;

          return (
            <div key={project.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="relative overflow-hidden aspect-video bg-slate-100 cursor-pointer" onClick={() => setActiveModalProject(project)}>
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {project.featured && (
                    <span className="absolute top-2 right-2 bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-sm">
                      ★ Featured
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border bg-slate-100 text-slate-700">
                      {project.categoryLabel}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">⏱️ {project.estTime}</span>
                  </div>

                  <h3 onClick={() => setActiveModalProject(project)} className="font-bold text-base text-slate-900 group-hover:text-sky-600 transition-colors cursor-pointer line-clamp-2">
                    {project.title}
                  </h3>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {project.tools.map((tool, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">{tool}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 flex items-center gap-2 border-t border-slate-100 mt-2">
                <button onClick={() => setActiveModalProject(project)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition-colors">
                  Detail
                </button>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors text-center">
                  Pesan Jasa
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {activeModalProject && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveModalProject(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 z-10">
              <span className="text-xs font-bold text-slate-500">⏱️ Est. Pengerjaan: {activeModalProject.estTime}</span>
              <button
                onClick={() => setActiveModalProject(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="w-full bg-slate-100 rounded-2xl overflow-hidden mb-6 flex items-center justify-center border border-slate-200">
                <img src={activeModalProject.image} alt={activeModalProject.title} className="max-h-[380px] w-auto object-contain" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">{activeModalProject.title}</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{activeModalProject.desc}</p>

              <div className="mt-4">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider mb-2">Tools Used:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalProject.tools.map((t, idx) => (
                    <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-semibold">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex items-center justify-between">
              <span className="text-xs text-slate-500">Fast delivery ready.</span>
              <a
                href={`https://wa.me/${PHONE_ADMIN}?text=${encodeURIComponent(`Halo Jokify! Aku tertarik pesan jasa seperti contoh "${activeModalProject.title}".`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all"
              >
                Pesan via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}