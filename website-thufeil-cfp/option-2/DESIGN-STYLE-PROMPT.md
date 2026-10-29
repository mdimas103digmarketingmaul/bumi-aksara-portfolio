# Design Style: "Bold Editorial — Kinetic Type"

Panduan gaya + template prompt, diturunkan dari website **Thufeil option-2**. Pakai dokumen ini saat membuat
brief website lain supaya hasilnya punya rasa yang sama: tipografi besar yang percaya diri, warna sedikit tapi
tegas, dan motion yang halus mengikuti scroll.

---

## 1. Nama gaya

Tidak ada satu nama baku untuk gaya ini. Gabungan istilah yang paling tepat:

- **Bold Editorial / Big Type:** judul raksasa, kondensed, huruf kapital, seperti sampul majalah atau poster.
- **Kinetic Typography:** teks yang bergerak: muncul per kata, per huruf, menyala saat dibaca.
- **Scroll-driven motion** (gaya situs pemenang Awwwards): smooth scroll, parallax, section yang saling menimpa.

Sebut saja di brief: **"Bold Editorial dengan Kinetic Typography dan scroll-driven motion"**.

Yang **bukan** gaya ini: template SaaS generik (gradient ungu, ikon di kotak, kartu seragam), neo-brutalism
(border tebal, bayangan offset), dan glassmorphism.

---

## 2. DNA desain (prinsip)

1. **Identitas dari orangnya, bukan dari template.** Warna dan tipografi diambil dari aset klien sendiri: baju,
   logo, gaya konten Instagram.
2. **Dua warna utama + satu netral.** Satu gelap (dasar), satu aksen terang (energi), satu krem/terang (bacaan
   panjang). Tidak ada warna keempat.
3. **Tipografi adalah ilustrasinya.** Nama dan judul dibuat raksasa. Foto berdiri di depan tipografi, bukan di
   dalam kotak.
4. **Foto tidak "ditempel".** Foto potong (cut-out/PNG) yang memudar ke latar dengan mask gradient, tanpa bingkai.
5. **Section seperti lembaran.** Setiap section punya warna latar sendiri dan bertumpuk dengan sudut membulat
   (overlap `-radius`), bergantian: gelap → terang → gelap → aksen.
6. **Motion melayani bacaan.** Animasi menuntun mata, tidak menahan pengunjung. Section panjang selalu bisa
   dilewati: carousel, bukan pin.
7. **Hierarki jelas di setiap blok teks.** Kalimat pembuka tebal, lalu paragraf lebih lembut. Highlight hanya
   pada 1–2 frasa kunci.

---

## 3. Design tokens (contoh dari option-2)

### Warna (peran → nilai)

| Peran | Token | Option-2 | Dipakai untuk |
| --- | --- | --- | --- |
| Dasar gelap | `--night` | `#080c1a` | Hero, kredensial, testimoni, footer |
| Gelap sekunder | `--navy` | `#182042` | Variasi kartu, glow |
| Aksen | `--sun` | `#f7c21b` | CTA, label, highlight stabilo, section penutup |
| Terang | `--cream` | `#f3efe6` | Section bacaan (Tentang, Keahlian, Insight) |
| Teks gelap | `--ink` | `#0a0e1c` | Teks di atas krem/aksen |
| Teks lembut | `--fog` / `--ink-soft` | 64% / 68% opacity | Paragraf sekunder |

Tambahan: lapisan **film grain** tipis (SVG noise, opacity ~0.07, `mix-blend-mode: overlay`) supaya bidang warna
datar tidak terasa plastik.

### Tipografi

| Peran | Font (option-2) | Aturan |
| --- | --- | --- |
| Display | **Archivo Variable**, `font-stretch: 62%`, weight 820 | UPPERCASE, `line-height: 0.86`, untuk nama, judul section, angka |
| Sub-display | Archivo, `font-stretch: 70–88%`, weight 600–780 | Judul kartu, kalimat profil, lead-in |
| Body | **Geist Variable** | 16px, `line-height: 1.6`, `text-wrap: pretty` |
| Label | Body, 12px, weight 550, `letter-spacing: .14em`, UPPERCASE | Dengan titik bulat di depannya |

Skala ukuran (fluid `clamp`):

- giant ≈ lebar konten / 2.95
- xl `clamp(3.4rem, …, 10.5rem)`
- lg `clamp(2.6rem, …, 6.25rem)`
- lead `clamp(1.06rem, …, 1.3rem)`

Alternatif font kondensed yang serasi: Anton, Bebas Neue, Oswald, Big Shoulders Display, Barlow Condensed.

### Ruang & bentuk

- Gutter `clamp(1.125rem, …, 3rem)`, konten maksimal `90rem`, jarak section `clamp(5.5rem, …, 11rem)`.
- Radius besar section `clamp(1.5rem, …, 2.5rem)`, radius kartu `1.125rem`, tombol pill `999px`.
- Tombol: pill tinggi 56px. Isian warna naik dari bawah saat hover. Label "roll" (teks naik, salinannya masuk dari
  bawah). Lingkaran panah di kanan yang berputar −45° saat hover.

---

## 4. Resep section

| Section | Pola |
| --- | --- |
| **Preloader** (opsional) | Kata-kata berganti cepat ("Gaji. Cicilan. Investasi. Zakat. **Kamu.**"), counter 0–100, lalu tirai naik. Hanya di kunjungan pertama per sesi |
| **Hero** | Nama raksasa selebar konten di belakang foto cut-out. Lockup kecil berwarna aksen di bawah nama. Kalimat pengantar: baris pertama tebal, sisanya lembut. 2 CTA. Indikator scroll. Ukuran nama mengecil di layar pendek supaya CTA tetap punya ruang |
| **Tentang** | Section terang menimpa hero. Satu kalimat profil besar yang menyala per kata saat di-scroll, frasa kunci diberi stabilo. Angka pencapaian (counter). Paragraf filosofi + quote kecil |
| **Kredensial** | Kartu sertifikat 3D: tegak dari posisi miring saat di-scroll, tilt + kilau mengikuti kursor, buka lightbox. Daftar sertifikasi lain dengan kode besar |
| **Layanan/Keahlian** | Judul sticky di kiri, grid kartu kecil 2 kolom di kanan. Semua terbaca sekaligus, kartu jadi gelap saat hover |
| **Testimoni** | Carousel bingkai ponsel (screenshot asli), putar otomatis + tombol jeda/putar + panah. Klik membuka lightbox |
| **Konten/Insight** | Carousel kartu 4:5 seperti feed Instagram, tombol "Buka Instagram", petunjuk "Geser untuk lihat lainnya", panah |
| **CTA penutup** | Section warna aksen, judul raksasa muncul per huruf ("Yuk, ngobrol."), 3 langkah bernomor, panel booking gelap |
| **Footer** | Nama lengkap ukuran kecil + peran, ikon sosial di kanan, garis, lalu 4 kolom (Hubungi + lokasi, Jelajahi, Layanan, Terdaftar di + logo). Baris bawah: © tahun + "Kembali ke atas ↑". Muncul dari balik section terakhir |

---

## 5. Sistem motion

| Efek | Detail |
| --- | --- |
| Smooth scroll | Lenis (`lerp: 0.09`) digerakkan oleh ticker GSAP |
| Reveal judul | Kata naik dari mask (`yPercent 110 → 0`, `expo.out`, stagger 0.06) |
| Reveal blok | Fade + naik 2rem, batch dengan stagger |
| Scrub kata | Opacity kata 0.14 → 1 mengikuti scroll |
| Stabilo | Garis bawah kuning tergambar kiri → kanan saat terlihat |
| Counter | Angka menghitung naik sekali, format lokal (`id-ID`) |
| Parallax hero | Nama naik, foto turun + mengecil, konten meredup; foto/nama mengikuti kursor |
| Kartu 3D | `rotateX/rotateZ` → 0 saat scroll, tilt pointer + kilau radial |
| Carousel | Scroller native + snap, tombol, progress bar, autoplay yang tertahan saat hover di kartu dan berhenti saat swipe |
| Tombol | Magnetic (mengikuti kursor sedikit), hanya di perangkat dengan mouse |
| Footer reveal | Footer `position: sticky; bottom: 0` di bawah `main` (z-index lebih tinggi) |

**Aturan wajib:**

- `prefers-reduced-motion` → tanpa preloader, smooth scroll, maupun animasi. Konten tampil statis.
- Tanpa JS → semua konten tetap terlihat. Pasang timer pengaman yang membuka konten jika bundle gagal dimuat.
- Jangan pin section panjang. Pengunjung harus bisa melewati testimoni/galeri tanpa menonton semuanya.
- Autoplay wajib punya tombol jeda/putar yang tetap berfungsi saat kursor ada di atasnya.

---

## 6. Pelajaran UX dari revisi (hindari dari awal)

- **Hero:** blok nama dan blok teks/CTA disusun dalam alur (flex column), bukan dua elemen absolute, supaya
  jaraknya tidak bisa bertabrakan. Beri jarak bawah CTA = radius overlap section berikutnya + 3–5rem.
- **Foto di HP:** gantung foto tepat di bawah nama (anchor ke atas), jangan ke dasar layar, supaya tidak ada ruang
  kosong di atas kepala. Bayangan gelap hanya di belakang teks, jangan menutupi wajah.
- **Angka besar hanya untuk pencapaian** (5+ tahun, 100+ klien). Misi/harapan ditulis sebagai kalimat.
- **Satu paragraf = satu hierarki:** kalimat pembuka tebal + paragraf lembut + maksimal 2 highlight.
- **Kartu layanan kecil dan langsung terbaca.** Jangan pakai kartu sticky setinggi layar yang memaksa scroll satu
  per satu.
- **CTA di HP mengikuti alur baca:** taruh setelah daftar layanan, bukan di antara judul dan kartu.
- **Judul jelas untuk orang awam:** "Sertifikasi Keuangan" lebih jelas daripada judul yang terlalu "copywriting".
- **Footer bersih:** tanpa disclaimer panjang, tanpa "Hak cipta dilindungi". Panah "Kembali ke atas" menghadap ke
  atas.
- **Astro:** jangan memutus baris tepat sebelum atau sesudah elemen inline (`<span>`, `<mark>`) di dalam paragraf.
  Spasinya bisa hilang ("olehkebiasaan").

---

## 7. Aturan konten

- Jangan mengarang fakta: angka, penghargaan, klien, testimoni, media. Pakai hanya yang ada di brief/aset/sumber
  resmi. Jika sumber bertentangan, tanyakan atau jangan tampilkan.
- Testimoni memakai screenshot asli dengan alt text deskriptif, bukan kutipan buatan.
- Tidak ada booking palsu. Cal.com/WhatsApp lewat file config (`enabled`, `url`, `number`). Selama belum aktif,
  tampilkan kanal alternatif yang nyata dan tombol nonaktif yang jujur.
- Tidak ada janji hasil (khusus profesi keuangan, kesehatan, hukum).

---

## 8. Stack teknis

Astro + TypeScript (statis), GSAP + ScrollTrigger, Lenis, `astro:assets` + sharp (WebP responsif), Fontsource
variable fonts. Satu file `src/config/site.ts` untuk link/kontak/booking, dan `src/data/content.ts` untuk konten.

---

## 9. Template prompt

Salin, isi bagian `[…]`, hapus yang tidak perlu.

```markdown
Buatkan website personal branding untuk **[NAMA LENGKAP], [GELAR/SERTIFIKASI] | [PERAN SINGKAT]**.

## Lokasi project
Buat sebagai subfolder baru `[nama-folder]` di root repository `[nama-repo]`. Jangan memodifikasi,
memindahkan, atau menghapus project/folder lain. Jangan mengubah file original di `[path aset]`;
salin aset ke dalam project.

## Gaya desain
Gunakan gaya **"Bold Editorial dengan Kinetic Typography dan scroll-driven motion"** seperti yang
dijelaskan di `DESIGN-STYLE-PROMPT.md` (lampirkan/rujuk file ini). Ringkasnya:
- Identitas warna diambil dari klien: dasar gelap `[HEX / "ambil dari foto/logo"]`, aksen `[HEX]`,
  terang `[HEX, default krem #f3efe6]`. Hanya tiga warna ini + turunan opacity.
- Display font kondensed tebal UPPERCASE (`[Archivo 62% / Anton / Bebas Neue]`), body `[Geist / Inter]`.
- Hero: nama raksasa selebar konten di belakang foto cut-out yang memudar ke latar.
- Section bergantian warna dan saling menimpa dengan sudut membulat.
- Film grain tipis, tanpa ikon dekoratif, tanpa gradient generik.
- Bukan template SaaS dan bukan "AI slop".

## Motion
Lenis smooth scroll, reveal judul per kata, scrub kata di paragraf profil, counter angka, stabilo
pada frasa kunci, parallax hero + kursor, kartu kredensial 3D, carousel dengan autoplay + tombol
jeda/putar, tombol magnetic, footer reveal. Hormati `prefers-reduced-motion` dan tetap berfungsi
tanpa JS. Jangan pin section panjang; semua section bisa dilewati.

## Struktur halaman
1. Preloader singkat: kata-kata `[KATA 1. KATA 2. KATA 3. … KATA PENUTUP.]` (opsional)
2. Hero: label `[PERAN]`, nama `[NAMA PANGGILAN]` raksasa + lockup `[SISA NAMA, GELAR]`,
   pengantar: baris tebal `[KALIMAT PEMBUKA]` + `[KALIMAT PENJELAS]`, CTA `[CTA UTAMA]` + `[CTA KEDUA]`
3. Tentang: kalimat profil `[BIO 1 KALIMAT]`, highlight `[FRASA KUNCI]`, angka `[ANGKA + LABEL]`,
   misi sebagai kalimat `[MISI]`, paragraf filosofi `[…]`, quote kecil `[QUOTE]`
4. Kredensial: judul `[JUDUL JELAS, mis. "Sertifikasi Keuangan"]`, sertifikat utama `[NAMA, PENERBIT,
   NOMOR, BERLAKU]` + daftar `[KODE — NAMA]`
5. Layanan: judul sticky `[JUDUL]` + `[N]` kartu kecil (nomor, judul, pertanyaan klien, penjelasan):
   `[DAFTAR LAYANAN]`. Di HP, CTA ditaruh setelah kartu terakhir.
6. Testimoni: carousel `[JUMLAH]` screenshot asli dari `[path]`, klik → lightbox
7. Konten: carousel `[JUMLAH]` postingan `[platform + handle]` + tombol "Buka [platform]"
8. CTA penutup: `[JUDUL PENUTUP]`, `[3 LANGKAH]`, panel booking
9. Footer: nama lengkap kecil + peran, ikon `[SOSIAL + URL]`, kolom Hubungi (`[LOKASI]`, kanal),
   Jelajahi, `[Layanan]`, Terdaftar di (`[LOGO + URL]`), © tahun, "Kembali ke atas ↑"

## Aset
- Foto profil (cut-out PNG, idealnya ≥ 1600px lebar): `[path]`
- Sertifikat: `[path]` · Logo: `[path]` · Testimoni: `[path]` · Postingan: `[path]`

## Kontak & booking
- Instagram `[URL]`, Threads `[URL]`, lainnya `[…]`
- Booking: `[Cal.com URL / "belum aktif, siapkan config"]`
- WhatsApp: `[nomor / "belum ada, tampilkan nonaktif, jangan pakai nomor dummy"]`

## Aturan konten
Jangan mengarang fakta, angka, klien, testimoni, penghargaan, atau liputan media. Fakta hanya dari:
`[sumber resmi / brief ini]`. Tidak ada janji hasil. Bahasa: `[Indonesia santai / formal]`.

## Teknis & QA
Astro + TypeScript, GSAP + ScrollTrigger, Lenis, astro:assets. Responsif 375–1440px tanpa scroll
horizontal. Cek di browser (desktop, tablet, HP), `astro check` 0 error, build sukses, tanpa error
console. Tulis README berisi lokasi config, aset, dan langkah mengaktifkan booking.
```

---

## 10. Checklist QA

- [ ] Nama raksasa pas selebar konten; CTA hero punya ruang di laptop pendek (≈ 1440×800)
- [ ] Foto hero di HP tepat di bawah nama, wajah tidak tertutup bayangan
- [ ] Tidak ada scroll horizontal di 375 / 390 / 430 / 768 / 1440
- [ ] Semua section bisa dilewati; carousel punya panah, swipe, dan tombol jeda/putar yang berfungsi
- [ ] Spasi di sekitar teks yang di-highlight tidak hilang
- [ ] Reduced motion: semua konten tampil statis
- [ ] Lightbox: ESC, panah kiri/kanan, fokus kembali ke pemicu
- [ ] Tidak ada fakta karangan; booking/WhatsApp hanya aktif lewat config
