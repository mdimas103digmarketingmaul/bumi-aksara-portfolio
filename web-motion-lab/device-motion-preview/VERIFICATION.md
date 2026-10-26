# Verification

Diperiksa pada 24 Oktober 2026 menggunakan Chromium headless 148 lokal dengan profil terisolasi, melalui `http://127.0.0.1:4173/`.

- 42 studi dalam 10 kategori berhasil dirender.
- Replay dan Pause diperiksa pada seluruh 42 card.
- Play All, Pause All, Replay All, Loop, serta speed 0.5× / 1× / 1.5× diperiksa.
- Pause menghentikan object, screen, dan reflection; animasi di luar viewport tidak berjalan.
- Mode sekali jalan tetap selesai ketika kontrol card lain digunakan.
- Ketujuh easing menggunakan clock bersama, perjalanan CSS 120 px, dan durasi gerak 2.4 detik.
- Delapan toggle visual polish menghasilkan perubahan pixel di area preview.
- Push In memiliki rasio proyeksi yang berbeda antara laptop dan background; scene tidak menjadi flat scaling.
- Website mini benar-benar bergerak dan dibatasi overflow layar.
- Reduce Motion serta perubahan preferensi OS menghentikan animasi.
- Layout diuji pada lebar 320, 390, 768, 1024, dan 1440 px; tidak ada overflow horizontal halaman.
- Render desktop dan mobile ditinjau, termasuk yaw, pitch, pivot, reflection, dan combined sequence.
- Tidak ada console error, request gagal, atau asset HTTP 4xx/5xx.

Pengujian otomatis ada di `verify.cjs`. Chromium sudah diuji langsung; Safari dan Firefox belum diuji pada sesi ini. Efek camera, motion blur, reflection, rim light, dan depth of field tetap merupakan ilustrasi CSS/2.5D, bukan rendering fisik.
