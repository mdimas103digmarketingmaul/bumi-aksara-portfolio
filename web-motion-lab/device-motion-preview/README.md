# Device Motion Preview Lab

Playground visual untuk belajar motion dengan **satu laptop yang sama**. Ada 42 studi dalam 10 kategori. Fokusnya memahami perubahan bentuk, posisi, sudut pandang, timing, dan compositing; bukan engine 3D.

## Preview

Tidak perlu install dependency atau build. Buka `index.html` langsung di browser desktop modern, atau dari folder ini jalankan:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Kemudian buka **http://127.0.0.1:4173/**. Jika port sudah digunakan, pilih port lain. Server hanya mengekspos folder project ini di komputer lokal.

## Cara belajar

1. Mulai dari Basic transforms, kemudian 3D orientation.
2. Amati tepi kiri/kanan untuk yaw, atas/bawah untuk pitch, dan kemiringan keseluruhan untuk roll.
3. Gunakan speed 0.5× saat mempelajari detail.
4. Pada Easing comparison, klik **Compare again**. Semua card bergerak 120 px, dalam 2.4 detik pada 1×, dengan waktu mulai yang sinkron. Kurva kecil menunjukkan posisi terhadap waktu. Fade setelah gerak hanya untuk reset.
5. Pada Visual polish, matikan/nyalakan **Effect** untuk membandingkan pada object yang sama.
6. Akhiri dengan Combined Motion: rise, yaw, push, float, dan settle dalam 8 detik, dengan layar yang terus scroll.

Pada card sempit, scene easing diperkecil secara seragam agar overshoot tidak keluar frame. Jarak 120 px adalah jarak CSS sebelum skala responsif; perbandingan antar-kurva tetap memakai jarak, durasi, dan skala yang sama.

## Kontrol

| Kontrol | Perilaku |
| --- | --- |
| Play All | Melanjutkan semua studi yang terlihat, termasuk card yang dipause sendiri. Studi selesai dimulai ulang. |
| Pause All | Menghentikan seluruh gerak, termasuk website di layar dan reflection. |
| Replay All | Reset semua studi ke awal; hanya card di viewport yang berjalan. |
| Replay / Pause | Kontrol lokal. Replay melanjutkan playback global jika sebelumnya dipause. Pada easing, kontrol lokal berlaku ke seluruh kelompok agar perbandingan tetap sinkron. |
| Loop | Mengulang selama card terlihat. Kebanyakan studi bergerak balik secara halus (alternate) untuk kembali ke awal. Matikan untuk satu siklus. |
| Speed | 0.5×, 1×, 1.5×; berlaku untuk object, effect, dan screen scrolling. |
| Reduce Motion | Semua preview menjadi pose diam, screen berhenti di hero. Mengikuti preferensi OS saat pertama dibuka dan saat preferensi berubah. Dapat diubah secara eksplisit. |

Card di luar viewport serta tab browser tersembunyi dipause. Kontrol keyboard menggunakan Tab lalu Enter/Space. Terdapat skip link dan label tombol yang menyebut nama studi.

## Daftar motion

| Kategori | Studi |
| --- | --- |
| Basic transforms | Scale Up, Scale Down, Rotate Z, Flip, Slide In, Rise Up |
| 3D orientation | Yaw, Pitch, Roll, Perspective Tilt, Perspective Turn |
| Position & depth | Move X, Move Y, Move Z |
| Camera-like motion | Push In, Pull Back, Pan, Orbit Simulation |
| Ambient motion | Floating, Gentle Drift, Breathing Motion, Micro Rotation |
| Easing | Linear, Ease In, Ease Out, Ease In Out, Overshoot, Bounce, Elastic |
| Anchor & pivot | Center, Bottom, Left |
| Visual polish | No Shadow vs Soft Shadow, Contact Shadow, Motion Blur Simulation, Glow, Reflection, Rim Light, Depth of Field Simulation, Vignette |
| Parallax | Perbedaan kecepatan foreground dan background |
| Combined Motion | Sequence product showcase 8 detik |

## Cheat sheet

| Istilah | Arti sederhana |
| --- | --- |
| **Scale** | Mengubah ukuran object. `scale(1.2)` membuatnya 20% lebih besar. Posisi dalam ruang tidak berubah. |
| **Position** | Letak object. `translate` memindahkan object tanpa mengganti ukuran asli atau orientasinya. |
| **X / Y / Z** | Dalam CSS: X positif ke kanan, Y positif ke bawah, Z positif mendekati viewer. |
| **Pitch** | Rotasi pada sumbu X. Bagian atas dan bawah bergerak mendekat/menjauh. |
| **Yaw** | Rotasi pada sumbu Y. Dengan sudut negatif, tepi kanan mendekati viewer; tepi kiri menjauh. |
| **Roll** | Rotasi pada sumbu Z. Object miring di bidang layar, seperti kepala dimiringkan. |
| **Perspective** | Proyeksi yang membuat bagian dekat terlihat lebih besar. Nilai CSS kecil menghasilkan perbedaan ukuran yang lebih kuat. Project memakai perspective luar 850 px. |
| **Pivot** | Titik tempat object berputar. CSS menyebutnya `transform-origin`. Marker hijau menunjukkan anchor. |
| **Easing** | Cara kecepatan berubah selama gerakan. Jarak dan durasi dapat sama tetapi rasa geraknya berbeda. |
| **Push In** | Kamera mendekati scene. Di sini disimulasikan dengan menggeser seluruh world pada Z. Object dekat dan jauh membesar dengan rasio berbeda. |
| **Pull Back** | Kamera menjauh. Simulasi kebalikan push in, memperlihatkan lebih banyak ruang. |
| **Pan** | Kamera menoleh horizontal. Di sini perkiraan CSS memakai perubahan perspective-origin dan perpindahan scene, bukan kamera dengan geometri fisik. |
| **Orbit** | Kamera mengitari subject sehingga sisi yang terlihat berubah. Demo menggabungkan rotasi object, pergeseran posisi, dan background untuk menyimulasikannya. |
| **Parallax** | Layer dekat bergeser lebih cepat dibanding layer jauh. Selisih gerakan menimbulkan kesan kedalaman. |
| **Motion Blur** | Jejak kabur selama exposure saat object bergerak. Demo memakai CSS blur singkat; tidak menghitung shutter atau arah kecepatan seperti renderer sebenarnya. |
| **Shadow** | Bayangan memberi petunjuk jarak dari permukaan. Soft shadow lebar terasa mengambang; contact shadow tipis dan rapat terasa menempel. |
| **Reflection** | Pantulan pada permukaan. Demo menggunakan duplikat laptop terbalik, opacity rendah, dan mask. Bukan ray tracing. |
| **Depth of Field** | Rentang kedalaman yang terlihat fokus. Demo menjaga laptop tajam dan memburamkan background statis; bukan simulasi lensa fisik. |
| **Glow** | Cahaya lembut di sekitar object, untuk membantu separation. |
| **Rim Light** | Highlight sempit di pinggir object untuk memperjelas siluet. |
| **Vignette** | Penggelapan tepi frame yang ringan agar perhatian lebih terarah ke tengah. |

### Scale vs Move Z vs Push In

- **Scale:** hanya ukuran object berubah, tidak memindahkan Z object.
- **Move Z:** laptop berpindah dalam perspective; background diam. Laptop diberi yaw kecil tetap agar perubahan proyeksi tepinya lebih mudah diamati.
- **Push In:** seluruh scene berpindah relatif ke viewer. Penanda dekat, laptop, dan bingkai jauh memiliki jarak Z berbeda sehingga rasio pembesarannya berbeda.

Pada satu bidang datar yang menghadap lurus ke kamera tanpa referensi lain, scale dan gerak Z dapat tampak identik. Sudut dan referensi kedalaman sengaja ditambahkan agar perbedaannya bisa diamati.

### Yaw vs Perspective Turn vs Orbit

- **Yaw:** rotasi sekitar sumbu Y dengan amplitudo sedang (−25° → +15° → 0°).
- **Perspective Turn:** masih rotasi Y, tetapi gerak dari depan ke −48° lalu kembali memberi penekanan pada sisi object. Ini gaya sequence, bukan sumbu baru.
- **Orbit:** simulasi perpindahan viewpoint mengelilingi subject, memakai beberapa transform sekaligus. Ini bukan kamera 3D sungguhan.

### Kurva easing

Linear punya kecepatan tetap. Ease In mempercepat, Ease Out melambat, Ease In Out melakukan keduanya. Overshoot melewati tujuan sekali sebelum settle. Bounce memantul kembali dari tujuan beberapa kali. Elastic berosilasi melewati tujuan seperti pegas. Ketiga kurva terakhir disampling menjadi keyframes; tidak memerlukan library.

## Struktur

```text
device-motion-preview/
├── index.html
├── css/styles.css
├── js/
│   ├── catalog.js       # Nama, kategori, deskripsi, dan resep studi
│   ├── animations.js    # Keyframes, easing, screen scrolling
│   ├── controls.js      # Playback, viewport, accessibility
│   └── app.js           # Mockup reusable dan render library
├── assets/svg/favicon.svg
├── verify.cjs           # Harness verifikasi development opsional
├── VERIFICATION.md      # Hasil pemeriksaan
└── README.md
```

Laptop dibuat dari HTML/CSS dengan bezel, sisi belakang, hinge, deck keyboard dalam perspective, trackpad, dan aluminium neutral. Website “form & field” adalah konten original lokal; bukan iframe atau screenshot eksternal. Refleksi memakai konten yang sama dan waktu animasi yang sama.

## Catatan teknis

- Tidak ada request ke CDN, font eksternal, analytics, atau website lain. Bisa berjalan offline, termasuk melalui `file://` karena script klasik lokal.
- Sebagian besar animasi memakai transform/opacity. Perspective-origin dan CSS blur adalah pengecualian kecil untuk demonstrasi khusus; bukan pola performa yang disarankan untuk banyak object sekaligus.
- Keyframes dibuat secara lazy saat card pertama kali terlihat. IntersectionObserver menghentikan animasi di luar viewport; Page Visibility menghentikannya saat tab tersembunyi.
- Animasi screen terpisah (12 detik; 8 detik pada Combined), namun semua kontrol berlaku untuk keduanya. Jika Loop dimatikan, screen dapat masih menyelesaikan scroll setelah object berhenti.
- Loop memakai arah bolak-balik agar reset tidak meloncat. Combined memiliki sequence maju 8 detik, lalu 8 detik kembali saat Loop aktif. Orbit kembali ke pose awal dalam 8 detik. Easing memiliki 2.4 detik perjalanan dan 1.6 detik hold/reset.
- Browser target: Chrome, Edge, Safari, Firefox modern dengan Web Animations API, CSS 3D transforms, mask-image, dan container queries.
- Semua effect 2.5D bersifat ilustrasi. Perbandingan dimaksudkan sebagai referensi belajar, bukan hasil rendering physically based.

## Pemeriksaan manual

1. Buka semua 10 kategori; pastikan 42 laptop terlihat dan layar tidak bocor dari bezel.
2. Coba Replay/Pause lokal, Play/Pause/Replay All, ketiga speed, dan Loop mati/hidup.
3. Bandingkan 7 easing setelah Compare again; A/B dan durasi harus sama.
4. Uji delapan checkbox Effect, serta Reduce Motion dan preferensi OS.
5. Coba viewport desktop, tablet, dan ponsel; tidak boleh ada overflow horizontal.
6. Periksa console dan network untuk error/broken asset.

`verify.cjs` dapat dijalankan dengan instalasi Playwright yang sudah tersedia di komputer development. Set `PLAYWRIGHT_PATH` ke modul tersebut dan `BROWSER_PATH` ke Chromium jika diperlukan, kemudian jalankan `node verify.cjs` saat preview server aktif. Script ini bukan dependency aplikasi; membuka preview tidak memerlukan Node atau Playwright. Screenshot dan laporan tes disimpan di `/tmp/device-motion-verification/`. Gunakan `--visual-only` untuk mengambil render saja.
