# Portofolio — Wahyu Pratomo

Dibangun **bertahap**. Saat ini **Tahap 1–7: Beranda + About + Mata Kuliah + Project + Skill + Organisasi + Contact**.

## Status tahap

| Tahap | Bagian | Status |
| --- | --- | --- |
| 1 | **Beranda** (loading petir + nama + header) | ✅ selesai |
| 2 | **About** (foto + profil ringkas) | ✅ selesai |
| 3 | **Mata Kuliah** (roadmap scroll-driven + 11 mata kuliah) | ✅ selesai |
| 4 | **Project** (kartu bertumpuk + galeri foto) | ✅ selesai |
| 5 | **Skill** (dek kartu orbit di tengah + legenda 3 × 3) | ✅ selesai |
| 6 | **Organisasi** (IPB Robotic Club + Himavo Micro IT, galeri foto) | ✅ selesai |
| 7 | **Contact** (email, LinkedIn, telepon) | ✅ selesai |

Versi penuh lama disimpan di `backup-v1-full/`.

## Cara menjalankan

Buka `index.html` langsung di browser (double-click).

## Struktur

```
index.html              Loading, header, Beranda, About, Mata Kuliah, Project, Skill, Organisasi, Contact, lightbox
css/style.css           Tema, layout, animasi loading, about, roadmap mata kuliah, project, skill, organisasi, contact, responsif
js/main.js              Urutan loading, kursor, auto-fit nama,
                        parallax, animasi masuk antar bagian, nav aktif,
                        gambar roadmap mata kuliah (garis + 11 titik),
                        galeri + lightbox,
                        status tumpukan kartu, orbit + sebaran kartu skill,
                        animasi keluar organisasi
assets/wahyu-portrait.jpg  Foto About (1500 × 2666, sudah diputar & dikompres)
assets/projects/<slug>/    Foto tiap project (01.jpg, 02.jpg, ...)\
assets/org/<slug>/         Foto tiap organisasi (01.jpg, 02.jpg, ...)
```

## Urutan masuk website

1. **Loading** — layar penuh menutupi tata letak yang belum siap. Lima petir
   putih menyala **bertahap dari 1 sampai 5** sebagai satu-satunya penunjuk
   proses (tanpa meter maupun teks tambahan).
2. Kelima petir **menyatu jadi satu** petir besar di tengah, lalu berdenyut
   seperti sedang mengisi daya.
3. Petir tunggal itu **melepas sengatan listrik**: kilat memenuhi layar,
   gelombang melingkar menyebar, dan percikan menjalar keluar.
4. Di balik kilatan itu **Beranda** muncul — `WAHYU` dan `PRATOMO` terangkat
   dari balik garis.

Perpindahannya terasa seperti **sambaran listrik**, bukan layar yang tiba-tiba
hilang. Tidak ada elemen loading yang "terbang" ke nama atau logo.

Loader juga menunggu aset penting (font, CSS, event `load`, foto About) dengan
batas tunggu pendek, supaya halaman tidak dibuka setengah jadi — tapi tidak
menggantung kalau jaringan lambat.

Total urutan ±2,5–3 detik (cukup untuk memberi sinyal proses tanpa membuat
pengunjung bosan).

## Isi Beranda

- Header: logo `WAHYU PRATOMO` (dua kata kapital, satu font & warna) di kiri,
  nav `BERANDA · ABOUT · CLASS · PROJECT · SKILL · ORGANIZATION · CONTACT` di kanan.
  Tidak ada label tengah. Tombol "MULAI PROYEK" sudah dihapus.
- Baris meta beranda: `(PORTOFOLIO / ©2026)` · `HARDWARE & ELECTRONICS` ·
  `BOGOR, INDONESIA` — kiri/tengah/kanan presisi (diverifikasi pada 1600px:
  32px / 800px / 1568px).
- Nama besar **WAHYU** (kiri) dan **PRATOMO** (kanan), otomatis mengisi lebar
  layar, dengan animasi masuk + parallax mouse/scroll.
- Deskripsi singkat, `↓ SCROLL, GENTLY`, tombol `LIHAT PROYEK →`.
- Kursor kustom cincin + titik.

> Tab biru vertikal `W. / ELEKTRONIKA` sudah dihapus. Semua bagian sekarang
> memakai padding kiri-kanan `var(--pad)` yang sama, jadi kolom kiri dan kanan
> simetris (tidak lagi tergeser oleh ruang tab).

## Header tiap bagian

Setiap bagian punya pembuka yang **berbeda bentuk** — tidak lagi memakai baris
meta seragam `(BAGIAN / 0X) · … · …`:

| Bagian | Bentuk header | Ciri |
| --- | --- | --- |
| About | `.hd--about` | Judul editorial: nomor `01` kecil berwarna aksen, judul + garis tipis penuh selebar konten, tanggal rata kanan — tanpa bingkai atau label tempelan |
| Mata Kuliah | `.hd--kuliah` | Nomor `02` kecil berwarna aksen + garis tipis, dengan jejak gelombang SVG kecil di kanan sebagai penanda jalur |
| Project | `.hd--project` | Pita dengan nomor `03` besar berongga (`-webkit-text-stroke`), garis aksen biru di bawah, lima tick bar abu-abu bertingkat di kanan |
| Skill | `.hd--skill` | Nomor `04` besar mengapung abu-abu + matriks 3 × 3 kotak kecil (tiga kotak memakai aksen biru halaman) |
| Organisasi | `.hd--org` | Nomor `05` dalam cincin tipis netral + skala tahun `2024 → 2025 → 2026` bertitik |
| Contact | `.hd--contact` | Baris bergaris bawah dengan pil `● Terbuka untuk kolaborasi` — titik hijau berdenyut (`@keyframes ping`) |

Semua varian memakai kerangka `.hd` + `.hd__body` / `.hd__k` / `.hd__s` dan tetap
ikut animasi `.reveal`. Pada `prefers-reduced-motion`, denyut titik Contact
dimatikan.

### Pembuka bagian — tiga tata letak berbeda

Pembuka (judul besar + paragraf) juga tidak seragam. Project dan Mata Kuliah
memakai pola dua kolom (judul kiri, keterangan kanan), sedangkan tiga bagian
sesudahnya dibedakan bentuknya:

| Bagian | Tata letak pembuka |
| --- | --- |
| **Skill** | **Di tengah.** Judul maksimal 21ch di tengah halaman, di bawahnya garis pendek 48px lalu paragraf maksimal 60ch — mengikuti dek kartu yang juga berpusat. |
| **Organisasi** | **Cermin.** Paragraf pendukung pindah ke kiri dengan garis tegak 1px, judul besar rata kanan. Kebalikan dari Project. |
| **Contact** | **Masthead.** Judul selebar halaman (hingga 92px), lalu paragraf + status menjadi satu strip di bawah yang dipisah garis tipis. |

Di ≤900px ketiganya kembali satu kolom dengan urutan alami (judul lalu
keterangan), dan garis tegak Organisasi tetap dipertahankan sebagai penanda.

## Latar — satu warna

Seluruh halaman memakai **satu warna latar** (`--bg: #121110`), seperti versi
awal:

- `body` dan lapisan tetap `body::before` sama-sama memakai `var(--bg)`.
  Lapisan tetap hanya mencegah pita warna saat digulir.
- Semua bagian (`.home`, `.about`, `.kuliah`, `.project`, `.skill`, `.org`,
  `.contact`) dibuat `background: transparent`, jadi tidak ada blok warna berbeda
  per bagian dan tidak ada gradien yang saling mencampur.
- Kontras teks di atas latar tunggal ini: `--fg` 15.2, `--fg-dim` 7.4,
  `--fg-faint` 5.0, `--blue` 8.1 — semuanya lolos ambang keterbacaan.
- Header saat menempel (`is-stuck`) memakai `rgba(16,17,16,0.9)` + blur supaya
  teks bagian di bawahnya tidak tembus.

## Tipografi — satu keluarga huruf

Hanya dipakai **satu keluarga font**, yaitu sans-serif:

- `--sans: "Inter Tight", "Segoe UI", system-ui, sans-serif` untuk seluruh teks.
- `--mono` sengaja diarahkan ke `var(--sans)`; label teknis tetap terasa
  berbeda lewat huruf kapital + tracking lebar, bukan lewat rupa huruf baru.
- Google Fonts hanya memuat Inter Tight (satu keluarga, bobot 400–900).
  JetBrains Mono tidak lagi diunduh.
- `button { font-family: inherit }` supaya tombol tidak jatuh ke font bawaan
  browser (Arial).

Ukuran teks kecil juga dinaikkan agar nyaman dibaca: label/meta 12–12.5px,
isi kartu 12–18.5px (deskripsi project diskalakan sampai 18.5px), keterangan
daftar skill 12–13.5px (sebelumnya banyak yang 8–10px).

## Isi About

- **Header khas About** (`.hd--about`): judul editorial — nomor `01` kecil
  berwarna aksen sebagai penanda, judul `Profil & lintasan`, tanggal rata kanan,
  ditutup satu garis tipis selebar konten. Tidak ada kembali baris meta seragam
  `(ABOUT / 01)`, tidak ada kotak bingkai atau label `Dossier` tempelan.
- Foto portrait di kolom kiri, rasio **4:5** (desktop ±598×747px), `object-fit:
  cover` dengan fokus 58% horizontal / 22% vertikal supaya wajah tidak terpotong.
  Di desktop foto **sticky** sehingga ikut menemani teks saat digulir.
  Foto asli sudah diputar otomatis sesuai EXIF (orientasi 8) lalu dikompres ke
  1500×2666, ±289 KB.
- Kolom kanan: label `(TENTANG SAYA)`, judul besar, paragraf pembuka, dua
  paragraf penjelas, lalu tabel data singkat (nama, pendidikan, IPK, fokus,
  lokasi), dan tautan `LANJUT KE MATA KULIAH ↓`.
- Semua elemen punya animasi masuk **bergilir** saat bagiannya masuk layar
  (`.reveal` + `IntersectionObserver`, delay bertingkat 0–500ms).
- **Animasi masuk About**: bingkai foto muncul lewat *wipe* `clip-path` dari
  atas ke bawah; di dalamnya foto mulai agak besar + blur lalu mengecil dan
  tajam. Garis di samping label `(TENTANG SAYA)` tumbuh di kiri **dan** kanan,
  judul keluar dari blur sambil kerapatan hurufnya mengencang.
- **Animasi keluar About**: sambil digulir menuju Mata Kuliah, foto dan teks naik
  perlahan lalu memudar (`--out` 0 → 1), jadi perpindahan ke bagian berikutnya
  terasa menyatu, bukan potongan mendadak.

## Isi Mata Kuliah

Sebelas mata kuliah disusun sebagai **roadmap zig-zag yang digambar mengikuti
gulir**: satu garis tebal berjalan mendatar ke kanan, berbelok 180° (belokan U),
lalu mendatar ke kiri, berbelok lagi, dan seterusnya. Setiap mata kuliah hanya
ditampilkan sebagai **nama + semester** — tanpa kartu penjelasan.

| No | Mata kuliah | Semester |
| --- | --- | --- |
| 01 | Elektronika | 1 |
| 02 | Rangkaian Logika & Teknik Digital | 2 |
| 03 | Sinyal dan Sistem Kontrol Elektronik | 3 |
| 04 | Teknologi Sensor dan Aktuator | 3 |
| 05 | Sistem PLC | 4 |
| 06 | Teknologi Bengkel dan Elektromekanik | 4 |
| 07 | Perancangan Sistem Digital | 4 |
| 08 | Proyek Sistem IoT | 5 |
| 09 | Teknologi Robotik | 5 |
| 10 | Machine Learning | 5 |
| 11 | Embedded System | 5 |

- Garis punya **dua lapis**: jalur bayangan redup (`.roadmap__path--soft`) yang
  selalu terlihat penuh sebagai panduan, dan jalur aksen biru
  (`.roadmap__path--main`) yang **digambar bertahap** mengikuti gulir lewat
  `stroke-dasharray`/`stroke-dashoffset`.
- **Kepala garis** (`.roadmap__head`, pil kecil bercahaya) menempel di ujung
  garis dan ikut berputar mengikuti arah garis (`getPointAtLength()`).
- Tiap mata kuliah terdiri dari lingkaran bernomor + label **nama** dan
  **semester** (huruf kecil redup). Urutan animasinya: ikon memantul naik, lalu
  judul, lalu semester.
- **Bentuk jalur**: baris mendatar bolak-balik, dan tiap ujung disambung
  `A` (busur 180°) yang radiusnya **tepat setengah jarak baris**. Dengan begitu
  tidak ada sisa garis lurus vertikal di ujung, semua sambungannya singgung
  (tangent), dan tidak ada sudut patah.
- Label diletakkan di **sisi luar belokan**: baris yang bergerak ke kanan →
  label di atas garis, baris yang bergerak ke kiri → label di bawah garis. Jadi
  label tidak pernah menabrak baris berikutnya.
- Lebar label dihitung per baris (`--label-w` = lebar kolom dikurangi napas)
  supaya beberapa label dalam satu baris tidak bertabrakan; tingginya dibatasi
  `--label-h` agar dua label yang berhadapan antar baris tetap berjarak.
- Jumlah kolom per baris: **3** di desktop ≥1280px, **2** di desktop sempit dan
  tablet, **1** di ponsel. Tinggi panggung = **jumlah baris** ×
  `--roadmap-row-h` (`--roadmap-n` diisi JS dengan jumlah baris, bukan jumlah
  mata kuliah) — 40vh desktop, 44vh tablet, 46vh ponsel.
- **Kecepatan gulir diselaraskan dengan titik**: satu sumbu `t` (0..1) dipakai
  bersama oleh `progressRaw()` dan tabel `lengthMap` (`mapLength()`). Semua
  baris dipetakan pada rentang yang sama — dari **baris pertama** sampai
  **baris terakhir** — sehingga `t = 0` tepat ketika baris pertama menyentuh
  dasar layar dan `t = 1` saat baris terakhir menyentuh dasar layar. Garis baca
  ada di **dasar layar** (`READ_LINE = 1.0`), jadi animasi mulai bergerak
  segera setelah baris pertama terlihat (tidak menunggu baris naik ke tengah
  layar). Di dalam satu baris, ujung masuk/keluar diberi `t` berbeda (8%
  jarak baris) sehingga belokan U juga memakan gulir dan garis tidak melompat.
  Nilai `at` tiap baris diambil dari ujung baris yang **diurutkan menurut
  urutan gambar** (bukan urutan x), supaya baris ke kiri tidak memberi `at`
  menurun dan ujung jalur selalu tercapai. Karena satu baris memuat beberapa
  mata kuliah, beberapa titik bisa menyala bersamaan; di ponsel (1 per baris)
  tiap titik menyala tepat satu per satu.
- Menambah/mengganti mata kuliah cukup mengubah satu entri array `steps` di
  `js/main.js` (`title` = nama mata kuliah, `meta` = semester). Jumlah baris,
  belokan, posisi titik, dan tinggi panggung dihitung ulang otomatis — tidak ada
  koordinat manual.
- `prefers-reduced-motion: reduce` → garis langsung penuh dan semua mata kuliah
  tampil tanpa animasi.
- Setelah roadmap selesai, tautan `LANJUT KE PROYEK ↓` membawa ke bagian Project.

## Isi Project

Lima kartu berpanel kertas terang dengan **tab warna di atasnya**, ditumpuk
seperti dek kartu: saat digulir, kartu berikutnya naik menutupi kartu sebelumnya
dan hanya menyisakan **tab berwarnanya** di atas.

| No | Project | Aksen | Gambar |
| --- | --- | --- | --- |
| 01 | SMILE — Smart Soil Monitoring & Automatic Irrigation | `#8ea6ff` | 3 |
| 02 | DREAMPALM — Drone Pertanian Semi-Otonom | `#7fd7a8` | 3 |
| 03 | ANTRAC — Robot Tank Berbasis PLD | `#f2a65a` | 3 |
| 04 | WTP — Water Treatment Plant Control | `#6ec8d8` | 3 |
| 05 | BUGBUSTER — Eco UV Pest Trap | `#e2c96a` | 2 |

- Setiap kartu lebih lebar dari kolom teks halaman (maksimal 1640px, menyisakan
  margin kiri-kanan) dan tingginya mengikuti isi, bukan tinggi layar, sehingga
  tidak memanjang di monitor besar.
- Bilah atas hanya memuat alamat proyek (`~/proyek/...`) dan tahun; titik-titik
  jendela palsu sudah dihapus agar terasa seperti lembar studi kasus.
- Panel kiri berisi kategori, judul, deskripsi, tag, peran, dan tombol
  **BUKA GALERI**. Panel kanan berisi foto dengan bingkai warna aksen dan sudut
  membulat; tinggi foto `clamp(300px, 24vw, 430px)`.
- Teks panel kiri: judul `clamp(36px, 4vw, 72px)`, deskripsi `clamp(15.5px,
  1.02vw, 17px)` dengan lebar baris 48ch, subjudul 15-17.5px, tag 12px, peran 12px.
- Galeri per kartu: tombol **← / →**, penghitung `01 / 03`, titik navigasi, dan
  **swipe** di area gambar.
- Klik gambar atau tombol **BUKA GALERI** membuka **lightbox** layar penuh
  (panah kiri/kanan, `Esc` untuk menutup, swipe, dan scroll halaman terkunci).
- Kartu diberi animasi isi bertingkat saat mulai masuk layar, dan bilah atas
  kartu yang sudah tertutup disembunyikan agar stripnya tetap bersih.
- Kartu yang **sedang tampil tampil paling besar**. Begitu terlewati, kartunya
  mengecil bertahap (sampai ±0.78) dan masuk ke bawah kartu berikutnya, jadi
  strip tab lama terlihat seperti tumpukan kartu yang sudah lewat.
- Di layar kecil, panel gambar pindah ke atas teks dan tumpukan tetap berjalan
  dengan tab yang lebih pendek.

### Mengganti / menambah foto project

1. Siapkan foto, simpan sebagai `assets/projects/<slug>/01.jpg`, `02.jpg`, dst.
   (`<slug>`: `smile`, `dreampalm`, `antrac`, `wtp`, `bugbuster`).
2. Kalau jumlah foto berubah, tambah/hapus satu baris
   `<img class="pcard__shot" ...>` di dalam `div.pcard__slides` pada kartu yang
   bersangkutan, lalu sesuaikan angka `src` dan `alt`.
3. Penghitung `01 / 03`, titik navigasi, dan daftar lightbox **dibuat otomatis**
   oleh `js/main.js` — tidak perlu mengubah JS.
4. Foto ideal berasio **16:10**; galeri memakai `object-fit: cover`, jadi bagian
   tepi bisa terpotong di layar sempit. Ukuran aman ±1600×1000 px.

## Isi Skill

Sembilan **keterampilan** yang diambil persis dari kolom *Keterampilan* di CV
(urutannya dipertahankan) ditampilkan dua kali: sebagai **sembilan kartu** di
tengah panggung, dan sebagai **legenda 3 × 3** di bawahnya.

| No | Keterampilan (sesuai CV) | Warna kartu | Ringkasan |
| --- | --- | --- | --- |
| 01 | Skematik Rangkaian | `#8ea6ff` | Rancang & gambar skematik secara terstruktur |
| 02 | Pemilihan Komponen | `#f2a65a` | Pilih komponen efisien, andal & hemat biaya |
| 03 | Pemrograman Firmware | `#7fd7a8` | Tulis & unggah firmware mikrokontroler via Arduino IDE |
| 04 | Troubleshooting | `#e8a5c8` | Identifikasi, analisis & atasi masalah rangkaian |
| 05 | Menyolder | `#6ec8d8` | Solder presisi, koneksi kuat & sesuai standar |
| 06 | Mendesain PCB | `#e2c96a` | Rancang tata letak sirkuit tercetak dengan DipTrace |
| 07 | Kerjasama Tim | `#e88a8a` | Bekerja efektif dalam tim di setiap proyek |
| 08 | Kepemimpinan | `#9ecb6a` | Koordinasi tim teknis secara terencana & tepat waktu |
| 09 | Komunikasi | `#b79cf0` | Sampaikan ide & informasi jelas, terstruktur, efektif |

- Kartu bergaya kartu arsip: sudut membulat, "crest" melengkung berisi ikon,
  nomor, dan nama keterampilan. Warna aksennya berbeda tiap kartu.
- **Animasi seperti video referensi**: sembilan kartu duduk pada satu **lingkaran
  3D (orbit)** di tengah panggung dan berputar. Sambil digulir, orbit berputar
  satu putaran penuh, lingkaran lalu **mengerut menjadi tumpukan rapi di tengah**,
  baru kemudian kartu-kartu **dibagikan satu per satu** ke grid 3 × 3 dengan
  easing yang melambat. Urutan ini membuat tidak ada kartu yang melayang
  menembus kartu lain.
- **Kecepatan putaran**: profil kecepatannya trapesium halus (mulai dari diam →
  konstan di tengah → berhenti pelan), dan ruang gulirnya panjang
  (`min-height: calc(100svh + 620px)`), jadi satu putaran penuh tidak terasa
  cepat dan kartu benar-benar tenang sebelum mulai menyebar.
- Saat belum digulir, dek juga **berputar pelan sendiri** (gerak *idle*) supaya
  terasa hidup; gerak ini memudar begitu kartu mulai menyebar.
- Di layar lebar, `.deckbox` (panggung dek) **dipin tepat di tengah** selama
  kartu berputar dan menyebar, jadi seluruh animasi terlihat di satu layar.
  Daftar penjelasan ada di bawah panggung, bukan di sampingnya.
- **Legenda di bawah**: sembilan keterangan disusun sebagai grid **3 × 3** dengan
  pembatas 1 px; tiap sel berisi titik warna aksen, nomor, nama, dan deskripsi.
  Di ponsel legenda menjadi 2 kolom.
- **Hover kartu** mengangkat dan memiringkan kartu ke arah kursor; baris legenda
  yang cocok ikut tersorot warna aksennya (dan sebaliknya, hover baris menyorot
  kartunya). Fokus keyboard juga menandai pasangan kartu ↔ baris yang sama.
- Di tablet/ponsel, dek mengalir biasa (tidak dipin); orbit serta sebaran tetap
  berjalan mengikuti gulir.

### Kesejajaran legenda dengan kartu

Legenda sekarang berada di bawah panggung, jadi **tidak** lagi dipaksa sejajar
baris demi baris dengan kartu. Karena itu `.slist__group` dihapus, begitu pula
variabel `--card-h`, `--deck-gap`, `--deck-h`, dan `--deck-offset` yang dulu
dipakai untuk menyamakan tinggi daftar dengan dek. `measureSkill()` kini hanya
menghitung `--pin-top` dan `travel`.

Di dalam kartu, `.scard__foot` dan `.scard__note` tetap diberi tinggi minimum
(`3.1em` / `2.6em`) supaya nama dan catatan di dasar kartu duduk sebaris walau
catatannya satu atau dua baris.

## Isi Organisasi

Dua organisasi yang diambil dari CV, masing-masing berupa kartu kertas terang
dengan panel foto di bawahnya. Headernya **nomor `04` di dalam cincin tipis**
warna netral (bukan cap amber), plus skala tahun `2024 → 2025 → 2026` bertitik.

| No | Organisasi | Peran | Periode | Aksen |
| --- | --- | --- | --- | --- |
| 01 | **IPB Robotic Club** | Anggota Divisi Elektronika VTOL | Jan 2026 – Sekarang | `#8ea6ff` |
| 02 | **Himavo Micro IT** | Anggota — Humas Micro Techno Education | Nov 2024 – Nov 2025 | `#f2a65a` |

- IPB Robotic Club: mengembangkan dan merancang sistem kelistrikan drone yang
  efisien, dengan kinerja optimal dan sesuai standar keselamatan industri.
- Himavo Micro IT: humas program *Micro Techno Education (MTE)* di SMKN 2 Kota
  Bogor — koordinasi komunikasi publik dan hubungan dengan pihak eksternal.
- Tiap kartu punya **galeri foto sendiri**: tombol ← / →, penghitung `01 / 02`,
  titik navigasi, swipe, dan **lightbox** layar penuh saat gambar diklik.
- **Animasi masuk**: kartu muncul bergilir (`data-reveal`, delay 0 / 120 ms).
- **Animasi keluar**: sambil menuju Contact, tiap kartu naik dan memudar
  (`--out` 0 → 1) berdasarkan posisinya sendiri, jadi kartu atas memudar lebih
  dulu daripada kartu bawah — bukan seluruh bagian sekaligus.

### Mengganti / menambah foto organisasi

1. Siapkan foto, simpan sebagai `assets/org/ipb-robotic-club/01.jpg`, `02.jpg`,
   dst. — atau `assets/org/himavo-micro-it/01.jpg`, dst.
2. Kalau jumlah foto berubah, tambah/hapus satu baris `<img class="pcard__shot"
   ...>` di dalam `div.pcard__slides` kartu yang bersangkutan.
3. Penghitung, titik navigasi, dan isi lightbox dibuat otomatis oleh
   `js/main.js`; tidak perlu mengubah JS.
4. Foto ideal berasio **16:10** (±1600×1000 px). Saat ini masih berupa gambar
   placeholder bertuliskan `FOTO 01` / `FOTO 02`.

## Isi Contact

- Header khas Contact: label `KONTAK` dengan garis bawah + aksen biru pendek,
  dan nomor bagian `05` berongga di kanan. Tidak ada lagi baris
  `BOGOR, INDONESIA · WIB` (lokasi sudah ada di footer).
- Judul besar *"Butuh tangan teknis untuk urusan hardware dan otomasi?"*,
  paragraf pembuka, dan status `● MENCARI KESEMPATAN MAGANG · 2026` dengan
  titik hijau berdenyut.
- Empat kanal kontak berupa baris besar yang bisa diklik. Baris pertama
  **Unduh CV** sengaja dibedakan (garis biru kiri + latar biru tipis + ikon
  unduh) supaya langsung terlihat:

  | No | Kanal | Teks tampil | Tautan |
  | --- | --- | --- | --- |
  | 01 | **Unduh CV** | `Wahyu-Pratomo-CV.pdf` | `assets/Wahyu-Pratomo-CV.pdf` (`download`) |
  | 02 | Email | `wahyupratomo221@gmail.com` | `mailto:` |
  | 03 | LinkedIn | `/in/wahyu-pratomo` | `linkedin.com/in/wahyu-pratomo-bb3544325` |
  | 04 | Telepon | `+62 895-2412-8626` | `tel:+6289524128626` |

- Berkas CV disimpan di `assets/Wahyu-Pratomo-CV.pdf`. Untuk menggantinya,
  timpa berkas itu (nama sama) atau ubah `href` pada baris 01.
- Hover/fokus memunculkan garis biru di kiri, menggeser baris, dan memindahkan
  panah `↗` (khusus CV: ikon unduh ⤓). Di ponsel, label kanal dan nilainya
  bertumpuk dua baris.
- Footer kecil `© 2026 Wahyu Pratomo — Bogor, Indonesia` dan tautan
  **Kembali ke atas ↑**.

## Tambahan lintas bagian

- **Header** otomatis berlatar blur setelah halaman digulir (`is-stuck`), dan
  memberi garis bawah biru pada bagian yang sedang aktif (`is-active`).
- Navigasi memakai *smooth scroll* dan sudah memperhitungkan tinggi header
  (`scroll-margin-top`). Ada tujuh item nav; di bawah 900px nav bisa digeser
  mendatar, lalu di ≤470px dibungkus menjadi dua baris yang seimbang — lima item
  di baris pertama, `ORGANIZATION · CONTACT` di baris kedua (`.head__break`).

## Catatan teknis

- Petir memakai `currentColor` (putih sesuai tema), tanpa gradient.
- Petir menyala bergantian lewat `animation-delay` per slot
  (`.loader__slot:nth-child(n)`) — inilah satu-satunya penunjuk progres —
  lalu menyatu ke `.loader__mark` (satu petir besar, tanpa monogram).
- Serah-terima diatur di `js/main.js`: `discharge()` menambahkan `is-shock`,
  yang menjalankan kilat penuh layar (`.loader__flash`), gelombang
  (`.loader__flare` + dua cincin), dan percikan (`.loader__arcs`). Latar
  memudar di tengah kilatan, nama Beranda naik di baliknya.
- Tidak ada lagi animasi "terbang ke logo": `.logo__bolt` dan `is-landed`
  sudah dihapus, jadi logo header hanya teks.
- Layar loading kini **hanya berisi lima petir** — tulisan proses dan meter
  sudah dihapus, jadi grid loader satu baris penuh dan petir berada tepat di
  tengah layar.
- Nama Beranda naik berbarengan dengan kilatan (delay `0.3s`, baris 2
  `0.44s`), jadi tidak ada jeda kosong di antara kedua fase.
- Kartu project memakai `position: sticky` dengan offset `--stick` + `--i ×
  --tabh`, jadi tiap kartu berhenti berurutan dan tab lama tetap terlihat.
- `padding-bottom` `.pstack` hanya disisakan sedikit di layar kecil
  (`clamp(0px, 6svh, 64px)`) karena tinggi kartu kini mengikuti isi; tidak ada
  lagi ruang ekstra berbasis tinggi layar.
- Skala kartu project dihitung dari progres kartu-kartu setelahnya: tiap kartu
  yang sudah lewat menambah kedalaman, lalu `--shrink = 1 − depth × 0.055`
  (maksimal 5 tingkat). Skala diterapkan pada `.pcard__win` dengan
  `transform-origin: top center`, jadi badan kartu mengecil ke tengah
  sementara tab berwarnanya tetap rapi di atas.
- Kartu skill tidak lagi memakai `--p` dan tidak memakai `opacity`. `js/main.js`
  menghitung variabel per kartu setiap frame: `--tx`/`--ty` (geser dari tempat
  duduknya di grid), `--tz` (kedalaman 3D), `--sc` (skala), `--lift` (kartu
  yang sedang dibagikan terangkat), `--rot` (putaran bidang), `--ax`/`--ay`
  (kemiringan 3D), serta `--veil` (0–1, lapisan gelap).
- **Kartu tidak transparan** — itulah yang membuat kartu tampak "menembus".
  Kartu di belakang orbit digelapkan lewat overlay `.scard__face::after`
  (`background: #14120e`, `opacity: calc(var(--veil) × 0.72)`), bukan dengan
  menurunkan `opacity` kartunya. Tepi kartu tetap padat.
- Angka dasar orbit: `baseAng[i] = (i / N) × 2π − π/2`, lalu
  `ox = orbitR × sin(ang)` dan `oy = orbitR × orbitKY × cos(ang)`.
  Radius menyusut saat fase *gather*: `liveR = orbitR × (1 − gatherE × 0.96)`,
  dan tiap kartu diberi geseran `fan` supaya tumpukan terlihat seperti dek
  yang ditumpuk rapi, bukan menumpuk tepat di satu titik.
- `depth = (cos + 1) / 2` menentukan skala (`0.76 + 0.22 × depth`, dikali
  `orbitK` saat mengorbit lalu dinaikkan ke `0.9 + 0.06 × depth` saat menjadi
  tumpukan), kedalaman `--tz`, penggelapan `--veil`, dan `z-index`
  (`6 + depth × 8`; kartu yang sedang terbang memakai `34` agar di atas grid).
- `orbitR` mengikuti lebar kartu, lalu dibatasi jarak **nyata** pusat dek ke tepi
  viewport terdekat dikurangi setengah lebar kartu:
  `orbitR = clamp(min(cw × 2.6, room − halfFit), cw × 0.9, cw × 3.2)`. Dengan
  `room = min(pusatX, lebar layar − pusatX) − 12`, lingkaran bisa lebar seperti
  video referensi tanpa kartu terpotong di tepi layar.
- `orbitKY = clamp(0.74 + (1.7 − orbitR / cw) × 0.48, 0.74, 1.06)` — makin
  sempit dek, lingkaran makin bulat agar kartu atas/bawah tidak berdesakan.
  `orbitK = clamp((orbitR / cw − 0.55) / 1.15, 0.5, 1)` mengecilkan kartu saat
  cincin rapat (mobile), jadi tidak ada kartu yang saling menimpa.
- Di layar ≥ 901px, `.skill__grid` dibuat `min-height: calc(100svh + 620px)` dan
  `.deckbox` memakai `position: sticky` pada `--pin-top`. Progres dibaca dari
  gulir grid: `p = (pinTop − grid.top) / travel`, dengan
  `travel = tinggi grid − tinggi panggung`. `--pin-top` (tengah vertikal
  panggung) dihitung di JS saat resize.
- Fase animasi: `SPIN_END = 0.54` (satu putaran penuh), `GATHER_END = 0.66`
  (lingkaran mengerut jadi tumpukan), lalu kartu dibagikan mulai
  `SPREAD_FIRST = 0.66` dengan jeda `SPREAD_STEP = 0.02` dan durasi
  `SPREAD_WIN = 0.18` per kartu. Easing pelepasan `1 − (1 − t)³`.
- Putaran memakai `trapEase(t, 0.24)` (profil kecepatan trapesium: akselerasi →
  konstan → deselerasi) supaya tidak ada hentakan di awal maupun akhir.
- Gerak *idle*: `idleAng` bertambah `dt × 0.00028` per frame dan dimatikan
  perlahan saat `p` naik (`1 − clamp(p / 0.35, 0, 1)`). Loop-nya dijalankan oleh
  `IntersectionObserver` pada `.deckbox` (threshold 0.05), jadi berhenti saat
  bagian Skill tidak terlihat, dan tidak aktif pada `prefers-reduced-motion`.
- `.deckbox` **tidak boleh** diberi `position: relative`; aturan itu menimpa
  `sticky` karena urutan tulisnya lebih akhir.
- Di layar sempit progres dibaca dari titik tengah panggung:
  `p = (0.72 × tinggi layar − tengah panggung) / (0.3 × tinggi layar)`.
- Lebar dek dibatasi juga oleh tinggi layar — desktop
  `calc((100svh − 210px) × 0.75)`, tablet `calc((100svh − 240px) × 0.78)` —
  jadi pada jendela lebar-tapi-pendek seluruh 3 × 3 tetap muat saat dipin.
- `prefers-reduced-motion`: loading langsung ke akhir, animasi & kursor
  dimatikan, panggung skill tidak dipin dan semua kartu langsung tampil 3 × 3
  (`--tx`/`--ty`/`--tz`/`--lift` = 0, `--sc` = 1, `--veil` = 0).
- Loader menunggu `document.fonts.ready`, event `load`, dan foto About — **bukan**
  foto project (semuanya `loading="lazy"`, jadi event load-nya tidak akan pernah
  datang saat halaman baru dibuka). Batas tunggu 2.2s lalu sisanya maksimal
  1.6s, plus jaring pengaman 2.2s: loader tidak mungkin menggantung.
- Roadmap mata kuliah digambar di `js/main.js` (bagian 8b). SVG memakai
  `viewBox` seukuran panggung (`.roadmap__stage`) dalam **piksel**, jadi tidak ada
  pelar skala: tebal garis dan ukuran kepala garis tetap seperti di CSS.
  (`preserveAspectRatio="none"` beserta `vector-effect` sempat dicoba, tetapi
  `vector-effect` membuat Chrome mengabaikan `preserveAspectRatio`, sehingga garis
  ter-render di kotak 100×100 dan mengecil jadi 0,1px — kombinasi itu dihindari.)
- Jalur dibangun sebagai **zig-zag U**: tiap baris (`r`) menggambar satu segmen
  mendatar (`L`), lalu — kalau bukan baris terakhir — satu busur 180°
  (`A R R 0 0 sweep`) yang langsung menyambung ke baris berikutnya. **Radius
  belokan `R` = tepat setengah jarak baris**, jadi busur itu memenuhi seluruh
  jarak antar baris: tidak ada sisa garis lurus vertikal di ujung yang dulu
  tampak seperti patahan, dan sambungannya selalu singgung (tangent).
  `sweep` = 1 untuk baris ke kanan, 0 untuk baris ke kiri.
- Ujung baris disisakan selebar `max(edge, R)` di tiap sisi panggung, sehingga
  busur U menonjol keluar baris tapi tetap di dalam panggung. `R` juga dibatasi
  `(lebar − 2·edge) / 4` supaya baris mendatar tidak menyusut jadi dua garis
  tegak yang berdempet.
- `R` diberi lantai (`rowGapMin = ruangLabel + node + 24`) agar dua label yang
  saling berhadapan antar baris (label di bawah baris atas + label di atas
  baris bawah) tidak bertabrakan, terutama di ponsel.
- Titik tiap mata kuliah diletakkan di **tengah masing-masing segmen kolom**
  (`xs + seg·(k+0.5)`), bukan dari pecahan panjang busur, jadi tidak pernah
  jatuh di dalam belokan. `x`-nya di-clamp ke `[labelW/2 + 6, W − labelW/2 − 6]`
  supaya label di ujung baris tidak terpotong tepi panggung.
- Untuk tiap titik, nilai `at` (fraksi panjang busur) dicari dengan **sampling
  2000 titik** pada `pathBase.getPointAtLength()` lalu dipilih jarak terdekat
  (helper `atOf(x, y)`). Ini dipakai `render()` untuk menentukan kapan titik
  menyala. Sampling yang sama juga menghasilkan `atStart`/`atEnd` tiap baris
  (fraksi busur di ujung baris `xs`/`xe`), yang dipakai `lengthMap`.
- Penanda (lingkaran bernomor) dipindah ke lapisan sendiri `.roadmap__z` di atas
  garis, supaya tidak tertutup sapuan `stroke-dashoffset`. Karena itu keadaannya
  ditandai dengan kelas `.is-in` **pada elemen ikonnya**, bukan lewat
  `.ritem.is-in .ritem__icon` (ikon sudah bukan anak `.ritem`).
- **Pemetaan gulir ↔ garis** memakai satu sumbu `t` (0..1):
  - `progressRaw()` menghitung posisi garis baca (`READ_LINE = 1.0` → **dasar
    layar**) di koordinat panggung, lalu menormalkannya pada rentang **baris
    pertama → baris terakhir**:
    `t = (readY − rowY[0]) / (rowY[last] − rowY[0])`, di-clamp 0..1. Jadi
    `t = 0` tepat saat baris pertama menyentuh dasar layar dan `t = 1` saat
    baris terakhir menyentuh dasar layar. Satu rumus lurus, tanpa cabang —
    progres tidak pernah melonjak atau mundur.
  - `buildLengthMap()` memakai rumus skala yang **sama** (baris pertama →
    baris terakhir), lalu ujung masuk/keluar tiap baris diberi `t` berbeda
    (8% jarak baris), jadi belokan U di antara baris juga memakan gulir
    (tidak melompat). Ujung baris diurutkan **menurut urutan gambar**
    (`Math.min`/`Math.max` dari `atStart`/`atEnd`), bukan menurut `x` — kalau
    tidak, baris ke kiri (menggambar dari x besar ke x kecil) memberi `at`
    menurun dan ujung jalur (`at = 1`) tidak pernah tercapai, sehingga bar
    berhenti di ±0.82.
  - `mapLength(t)` menginterpolasi tabel itu, jadi garis bergerak saat barisnya
    dibaca dan melambat di belokan. Progresnya dihaluskan dengan interpolasi
    0.16 per frame lewat `requestAnimationFrame`, lalu
    `strokeDashoffset = totalLength × (1 − progress)`.
  - Kalau garis baca dinaikkan (mis. 0.55 = tengah layar), animasi baru mulai
    setelah baris pertama naik jauh ke atas layar — terasa "menunggu". Karena
    itu `READ_LINE` sengaja 1.0.
- **`--roadmap-n` wajib diset SEBELUM `stage.clientHeight` dibaca** di
  `layout()`, karena tinggi panggung = `--roadmap-n × --roadmap-row-h`. Kalau
  diset sesudahnya, `H` akan terbaca dari tinggi lama dan seluruh geometri
  meleset.
- Langkah yang belum tercapai diberi kelas `.is-ahead` (`visibility: hidden`),
  jadi tidak ada judul yang "menggantung" menunggu garis datang.
- Lebar zig-zag diatur variabel CSS `--roadmap-rope` (semua breakpoint = 1,
  artinya selebar panggung). Tinggi satu baris diatur `--roadmap-row-h`
  (desktop 40vh, tablet 44vh, ponsel 46vh). Lebar label per baris dihitung JS
  (`--label-w`) dan tingginya dibatasi `--label-h`.
- Garis digambar ulang pada `resize` (debounce 150ms), perubahan breakpoint
  (`matchMedia`), `ResizeObserver` pada panggung, dan setelah
  `document.fonts.ready` (font mengubah tinggi baris).
- `prefers-reduced-motion`: garis utama langsung penuh (`strokeDashoffset = 0`)
  dan semua mata kuliah langsung tampil tanpa animasi.

## Tahap berikutnya

Ketujuh bagian nav (Beranda, About, Class, Project, Skill, Organization,
Contact) sudah lengkap — termasuk bagian **Mata Kuliah** di antara About dan
Project. Langkah berikutnya tinggal penyempurnaan: mengganti foto placeholder di
`assets/projects/<slug>/` dan `assets/org/<slug>/` dengan foto asli, dan
menambah isi bila ada project atau organisasi baru.

