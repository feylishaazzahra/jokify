export interface Project {
  id: string;
  title: string;
  category: 'design' | 'it' | 'editing' | 'data';
  categoryLabel: string;
  image: string; // Ubah path/URL foto kamu di sini
  tools: string[];
  estTime: string;
  desc: string;
  featured?: boolean;
}

export const portfolioProjects: Project[] = [
  {
    id: '1',
    title: 'Booklet Layout Event 12 Halaman',
    category: 'design',
    categoryLabel: 'Design & Visuals',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    tools: ['Figma', 'InDesign', 'PDF Clean Layout'],
    estTime: '1-2 Hari',
    desc: 'Desain tata letak modul/booklet seminar rapi, hirarki tipografi jernih, dan sesuai skema warna acara.',
    featured: true,
  },
  {
    id: '2',
    title: 'Diagram DFD Level 0 & Level 1 System Clinic',
    category: 'it',
    categoryLabel: 'IT & System',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    tools: ['Draw.io', 'Visio', 'MariaDB / SQL'],
    estTime: '1 Hari',
    desc: 'Perancangan alur data terstruktur lengkap dengan entitas luar, pemrosesan data, dan spesifikasi tabel database.',
    featured: true,
  },
  {
    id: '3',
    title: 'Editing Short Video Reels / TikTok Event',
    category: 'editing',
    categoryLabel: 'Media & Editing',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
    tools: ['CapCut Pro', 'Premiere Pro'],
    estTime: '1 Hari',
    desc: 'Editing video durasi singkat dengan transisi dinamis, penambahan subtitle otomatis, dan sinkronisasi audio.',
    featured: false,
  },
  {
    id: '4',
    title: 'Olah Data SPSS Uji Regresi & Validitas',
    category: 'data',
    categoryLabel: 'Data & Academic',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    tools: ['SPSS', 'Excel', 'Data Interpretation'],
    estTime: '1-2 Hari',
    desc: 'Pengolahan data kuesioner lengkap dengan grafik pembacaan, interpretasi hasil validitas dan reliabilitas.',
    featured: false,
  },
];

export const PHONE_ADMIN = '6281234567890'; // Ganti nomor WA kamu