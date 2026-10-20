# MammaRoti — panduan kerja Claude Code

## Mulai setiap tugas

- Pastikan direktori kerja adalah root repository yang berisi `package.json`.
- Baca permintaan terbaru pengguna, `package.json`, `next.config.ts`, `src/app/page.tsx`, dan file yang relevan dengan tugas.
- Periksa `git status` sebelum mengedit agar perubahan pengguna yang belum di-commit tidak tertimpa.
- Periksa implementasi aktual sebelum menyimpulkan status suatu opsi. Sebagian README dan catatan redesign mungkin lebih lama daripada kode.
- Jika ada `docs/PROJECT_CHECKPOINT.md`, baca sebagai riwayat keputusan, kemudian cocokkan klaimnya dengan kode dan status Git terkini.

## Arsitektur

- Aplikasi memakai Next.js App Router, React, TypeScript, dan aset lokal di `public/`. Periksa `package.json` dan `next.config.ts` untuk versi serta konfigurasi yang berlaku saat ini.
- Halaman utama production: `src/app/page.tsx`, dengan komponen di `src/sections/` dan `src/components/`.
- Data bersama: `src/data/`. Mengubahnya bisa memengaruhi halaman production dan beberapa opsi sekaligus.
- Playground perbandingan desain: `src/app/playground/compositions/redesign/option-N/page.tsx` dan `src/playground/compositions/redesign/option-N/`.
- Aset khusus tiap opsi berada di `public/redesign/option-N/` bila foldernya tersedia.

## Batas pekerjaan

- Jika tugas menyebut Option N, batasi perubahan ke kode dan aset Option N serta route-nya. Jelaskan kebutuhan perubahan di luar itu sebelum mengeditnya.
- Jangan menimpa opsi redesign lain atau halaman production ketika memperbaiki satu opsi.
- Jaga konten, identitas MammaRoti, dan interaksi yang sudah berfungsi, kecuali brief terbaru meminta perubahan.
- Gunakan CSS Module lokal untuk gaya khusus opsi. Periksa tampilan desktop dan mobile, termasuk teks panjang, overflow, tautan, serta state interaktif.
- Ikuti brief terbaru dan kode yang ada jika bertentangan dengan README lama. Jangan menganggap `redesignOptions.ts` mencerminkan status terkini tanpa mengecek route dan foldernya.

## Cara menjalankan dan memeriksa

- `npm run dev` untuk preview lokal. Port default Next.js biasanya 3000; gunakan URL yang benar-benar ditampilkan terminal.
- `npm run build` untuk memeriksa TypeScript, prerender, dan kompatibilitas build sebelum menyerahkan perubahan yang berarti.
- Preview Option N pada `/playground/compositions/redesign/option-N`.
- Setelah perubahan UI, periksa setidaknya desktop dan mobile, serta interaksi yang disentuh. Laporkan bila suatu pemeriksaan tidak dapat dijalankan.
- Jangan mengklaim deploy berhasil hanya karena build lokal berhasil.

## Menyerahkan hasil kepada Maul

- Kerjakan perubahan langsung di repository yang sedang terbuka; ringkas file yang berubah dan hasil pengujian.
- Bila Maul meminta ZIP untuk dipindahkan manual, masukkan **hanya file yang dibuat atau diubah** dengan path relatif terhadap root repository. Jangan sertakan `node_modules`, `.next`, `out`, atau aset lama yang tidak berubah.
- Bila Maul meminta kode untuk copy-paste, berikan isi file pengganti secara lengkap, bukan potongan diff.
- Jangan commit, push, atau deploy kecuali diminta.

## Menutup pekerjaan yang panjang

- Perbarui `docs/PROJECT_CHECKPOINT.md` hanya setelah memeriksa kode dan status Git terkini. Catat tanggal, apa yang selesai, file penting, keputusan, hasil pengujian, risiko nyata, dan langkah berikutnya.
- Bedakan keputusan yang sudah diterapkan dari ide yang masih direncanakan.
