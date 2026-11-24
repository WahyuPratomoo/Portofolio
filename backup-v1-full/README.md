# Portofolio — Wahyu Pratomo

Portofolio interaktif bertema elektronika/hardware, dibuat dari isi CV.
Stack: **HTML + CSS + JavaScript murni** — tanpa build step, tanpa dependensi.

## Cara menjalankan

Buka `index.html` langsung di browser (double-click). Semua aset lokal, hanya font
diambil dari Google Fonts (butuh internet). Jika offline, font otomatis jatuh ke
font sistem sehingga layout tetap jalan.

Ingin lewat server lokal (opsional):

```powershell
cd "C:\Users\Wahyu Pratomo\Documents\Portfolio-Wahyu"
python -m http.server 5500
# lalu buka http://localhost:5500
```

## Struktur

```
index.html        Semua konten & markup section
css/style.css     Tema, layout, animasi, responsif
js/main.js        Boot, kanvas PCB parallax, reveal, akordeon, tilt, salin email
```

## Bagian halaman

1. **Hero** — nama besar otomatis diskalakan selebar layar (seperti referensi),
   kartu ID bergaya PCB yang miring mengikuti kursor, dan garis sirkuit di
   belakang yang bergerak lebih lambat dari scroll (parallax).
2. **Tentang** — deskripsi diri, signal chain, pendidikan, dan statistik singkat.
3. **Proyek** — 5 proyek dalam akordeon: SMILE, Dreampalm, Antrac, Water Treatment
   Plant, Eco BugBuster. Klik judul untuk membuka detail peran & tag komponen.
4. **Keterampilan** — dikelompokkan jadi Hardware & Rangkaian, Firmware & Sistem,
   dan Cara Kerja, plus daftar tools/modul.
5. **Pengalaman** — timeline organisasi & proyek dari CV.
6. **Kontak** — email, WhatsApp, LinkedIn, lokasi, dan tombol salin email.

## Detail interaksi

- **Layar boot** singkat (SKEMATIK / PCB / FIRMWARE) saat halaman dibuka.
- **Kanvas PCB** (`#pcb`): jalur sirkuit + via + node berkedip, parallax
  berbasis scroll, ikut meredup saat masuk area konten agar teks tetap terbaca.
- **Parallax hero**: nama, kartu ID, bio, dan baris navigasi punya kecepatan
  berbeda sehingga terasa berlapis.
- **Reveal on scroll** dengan `IntersectionObserver` dan delay bertingkat.
- **Progress bar** scroll di atas dan penanda header saat halaman digulir.
- **Aksesibilitas**: navigasi keyboard pada akordeon (`aria-expanded`),
  `prefers-reduced-motion` mematikan animasi berat & kanvas.

## Mengubah data

Semua teks ada di `index.html`, jadi cukup edit langsung. Untuk menambah proyek,
duplikasi satu blok `<article class="project">` dan sesuaikan:

- `aria-controls="proj-N"` dan `id="proj-N"` (harus unik),
- `--accent` pada `style` untuk warna aksen proyek,
- nomor `project__no`, judul, subjudul, tahun, deskripsi, list peran, meta, dan tag.

Ganti warna tema di `css/style.css` bagian `:root` (`--acid`, `--cyan`, `--copper`).

## Catatan

- Nomor telepon di CV ditulis `089524128626`; di halaman kontak ditampilkan
  `0895-2412-8626` dan tautan WhatsApp memakai format internasional `62895...`.
- Ganti foto/logo: tambahkan `<img>` di dalam `.id-card` dan sesuaikan CSS-nya.
