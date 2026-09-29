# Jokify portfolio

Portfolio statis dengan katalog Google Sheets, detail karya, dan kontak WhatsApp. Redesign ini menggunakan identitas Jokify dan pola layout/scroll yang terinspirasi Ariyana; bukan salinan aset atau source template Webflow.

## Jalankan lokal

Gunakan Node.js 22 atau lebih baru, lalu dari folder repository:

```sh
npm run dev
```

Buka http://127.0.0.1:4173. Server hanya mendengarkan localhost. Tidak ada langkah build frontend; jangan membuka HTML melalui `file://` atau Live Server biasa karena katalog memerlukan `/api/catalog`.

```sh
npm test
```

Tes menggunakan Node test runner tanpa instalasi dependency tambahan. Folder React lama (`app`, `components`, `data`) bukan entry point website ini dan tidak diubah.

## Titik edit konten

| Bagian                             | Lokasi                                                                                          |
| ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| Hero dan navbar                    | `index.html`, `styles/hero.css`                                                                 |
| Tentang, empat kartu story, proses | Section `#about`, `[data-horizontal-story]`, `#alur` di `index.html`                            |
| Empat karya unggulan               | `#featuredGrid` di `index.html`; judul, deskripsi, gambar, dan `data-category-link`             |
| Layanan dengan media               | `.service-list` di `index.html`                                                                 |
| Panel showcase                     | `[data-expand-panel]` di `index.html`; masih berupa gambar, bukan video                         |
| Social proof                       | `.community` di `index.html`; sekarang mengarah ke Instagram, tanpa testimoni atau angka rekaan |
| Kontak dan footer                  | `#contact` dan `.footer` di `index.html`                                                        |
| Warna, padding, ukuran huruf       | Token `:root` di `styles/site.css`, `styles/hero.css`, `styles/template.css`                    |
| Gerakan scroll                     | `scripts/scroll-effects.mjs` dan `scripts/scroll-math.mjs`                                      |
| Seluruh koleksi katalog            | Google Sheets yang sudah digunakan situs, melalui `lib/catalog.cjs`                             |

Cari komentar `TEMPLATE:` untuk section yang disiapkan agar kontennya bisa diganti. Karya unggulan bersifat editorial/manual; mengubah Google Sheets tidak otomatis mengganti empat kartu unggulan.

### Mode preview katalog

Kolom Google Sheets `previewMode` bersifat opsional. Karya lama otomatis memakai `contain`, sehingga gambar utuh tampil di frame 4:3 tanpa crop. Gunakan nilai berikut hanya saat perlu:

| Nilai | Perilaku |
| --- | --- |
| `contain` | Default; gambar utuh dengan ruang napas di sekelilingnya. |
| `cover` | Memenuhi frame; cocok untuk foto horizontal yang aman dipotong. |
| `portrait` | Gambar utuh dengan lebar lebih ramping di tengah frame; cocok untuk poster atau carousel. |

## Logo dan gambar

`assets/brand/logo-nobg.png` merupakan salinan identik dari `.LOGO/logo-nobg.png` milik Jokify. `assets/web/logo-wordmark.webp` adalah versi lossless dengan ruang transparan luar dipangkas; bentuk dan warna logo tidak digambar ulang. Hero memakai latar krem agar semua warna logo terbaca.

Gambar asli portofolio tetap disimpan. Versi ringan berada di `assets/web`, dengan pemetaan di `manifest.json`. Untuk regenerasi gunakan `node scripts/optimize-assets.cjs` di lingkungan yang menyediakan `sharp`, atau arahkan variabel `SHARP_MODULE` ke modul Sharp yang sudah terpasang. Sharp hanya diperlukan untuk regenerasi gambar, bukan menjalankan website.

## Scroll dan aksesibilitas

- Pada layar minimal 900 × 640, story mengikuti scroll vertikal dengan gerakan horizontal, karya unggulan menumpuk secara sticky, dan panel showcase melebar.
- Layar kecil menggunakan urutan biasa tanpa scroll horizontal bersarang. Filter kategori membungkus ke baris berikutnya.
- Pengaturan perangkat `prefers-reduced-motion` dan tombol **Kurangi animasi** di footer menonaktifkan efek scroll. Pilihan tombol berlaku selama halaman terbuka.
- Navigasi keyboard, skip link, fokus menu, native dialog, label pencarian, serta status loading/error/kosong dipertahankan.

## Data dan batas pengujian

`GET /api/catalog` membaca spreadsheet publik yang sudah ada, mengembalikan `{ projects: [...] }`, dan tidak menerima URL upstream dari pengguna. Respons berhasil: 200; upstream gagal: 502; metode selain GET: 405. Data tidak dieksekusi sebagai JavaScript. Frontend memakai `textContent` dan validasi URL media.

Upload/hapus admin tetap menggunakan kontrak Google Apps Script sebelumnya. `?admin=true` atau tiga klik logo hero hanya menampilkan kontrol admin, bukan otorisasi. Password diverifikasi oleh Apps Script. Jangan menguji upload/hapus menggunakan data produksi tanpa persetujuan pemilik. Operasi tulis admin belum diuji end-to-end dalam redesign ini.

Perubahan disiapkan untuk review lokal. Tidak ada push, merge, atau deployment ke domain produksi. Hosting berikutnya perlu menjalankan handler Node `/api/catalog` (misalnya fungsi Vercel), bukan sekadar menyajikan file statis.

## Verifikasi redesign

- 12 tes Node: parser katalog, mode preview, alias kategori, pencarian, URL media, endpoint read-only, batas progres scroll.
- Browser: layout 320, 768, 1024, 1440px; padding kiri-kanan sama; tanpa overflow horizontal halaman.
- Browser: filter Menu, state kosong dan reset, pagination 9 ke 18 karya, dialog dan pergantian gambar, Escape mengembalikan fokus, menu mobile dengan keyboard, mode minim animasi.
- Referensi visual: https://ariyana-studio.webflow.io/.
- Dasar API gerakan: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame dan https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion.

Verifikasi ini bukan audit WCAG penuh atau pengujian lintas semua browser. Lakukan uji staging dan admin sebelum deployment produksi.
