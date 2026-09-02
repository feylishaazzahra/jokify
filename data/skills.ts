export interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
}

export const skillsData: SkillCategory[] = [
  {
    title: 'Design & Visuals',
    icon: '🎨',
    skills: ['UI/UX (Figma)', 'IG Feeds & Carousel', 'Booklet & E-Book', 'Banner & Poster', 'Logo & Brand Identity'],
  },
  {
    title: 'IT & Software Solutions',
    icon: '💻',
    skills: ['Web Development', 'Tugas Koding (C, Web)', 'Database & SQL', 'Diagram DFD & Flowchart', 'Riset UI/UX'],
  },
  {
    title: 'Media & Editing',
    icon: '🎬',
    skills: ['Video Shorts / TikTok / Reels', 'CapCut & Premiere Pro', 'Foto Retouching', 'PPT Presentation'],
  },
  {
    title: 'Data & Academic Support',
    icon: '📊',
    skills: ['Formatting Dokumen Word/PDF', 'Olah Data SPSS', 'Microsoft Excel & Spreadsheet', 'Tugas Non-IT'],
  },
];