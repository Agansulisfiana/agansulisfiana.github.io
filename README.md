# Portfolio Agan Sulisfiana

Website portfolio pribadi untuk menampilkan profil, pengalaman kerja, technical skills, project support, dokumentasi aktivitas teknis, resume, dan kontak profesional.

Portfolio ini dibuat sebagai static website berbasis HTML, CSS, dan JavaScript, serta dirancang untuk dipublikasikan melalui GitHub Pages.

## Live Website

Portfolio dapat diakses melalui:

```text
https://agansulisfiana.github.io/
```

## Tentang Portfolio

Portfolio ini berfokus pada pengalaman sebagai IT Support dengan 5+ tahun pengalaman dalam:

- IT support dan helpdesk
- Troubleshooting hardware, software, jaringan, dan printer
- Instalasi dan konfigurasi Windows OS
- Device deployment dan preventive maintenance
- Support perangkat seperti Fargo Card Printer, ADM Dukcapil, Digital Signage, e-KTP Reader, dan BCA CS Digital
- On-site support dan remote user assistance

## Fitur

- **Dua Bahasa (Multi-language)**: Tersedia dalam Bahasa Inggris (`index.html`) dan Bahasa Indonesia (`index-id.html`) dengan transisi halus dan sinkronisasi data sertifikat/proyek.
- Tampilan responsive untuk desktop dan mobile
- Hero section dengan profil singkat dan foto
- Section About, Skills, Certifications, Experience, Projects, Education, dan Contact
- Animasi reveal saat scroll
- Typing effect pada title profesi (disesuaikan dengan bahasa yang aktif)
- Background interaktif menggunakan Three.js dan Vanta.js
- Tombol download resume
- Link kontak langsung ke email, WhatsApp, dan LinkedIn
- Dokumentasi aktivitas teknis dengan gambar project

## Teknologi

- HTML5
- CSS3
- JavaScript
- Three.js
- Vanta.js
- Google Fonts
- Node.js & npm (untuk proses minifikasi & server lokal)

## Struktur Project

```text
.
|-- index.html              # Halaman utama portfolio (Bahasa Inggris)
|-- index-id.html           # Halaman portfolio (Bahasa Indonesia)
|-- README.md               # Dokumentasi project
|-- package.json            # Konfigurasi npm (scripts, dependencies)
|-- assets/
|   |-- css/
|   |   |-- style.css                # Source stylesheet utama
|   |   |-- style.min.css            # Minified stylesheet utama (digunakan oleh HTML)
|   |   |-- certifications.css       # Source stylesheet sertifikasi
|   |   `-- certifications.min.css   # Minified stylesheet sertifikasi (digunakan oleh HTML)
|   |-- documents/
|   |   `-- resume-agan-sulisfiana.pdf
|   |-- images/
|   |   |-- certificates/
|   |   |   |-- Cisco/
|   |   |   |-- HID/
|   |   |   `-- Sololearn/
|   |   |-- profile/
|   |   |   `-- foto-agan.png
|   |   `-- projects/
|   |       |-- adm-deployment.jpg
|   |       |-- digital-signage-installation.jpg
|   |       |-- fargo-hdp5000-maintenance.jpg
|   |       `-- rakornas-dukcapil.jpg
|   `-- js/
|       |-- script.js                # Source JS utama (typing, scroll, dll)
|       |-- script.min.js            # Minified JS utama (digunakan oleh HTML)
|       |-- certifications.js        # Source JS sertifikasi & lightbox
|       |-- certifications.min.js    # Minified JS sertifikasi (digunakan oleh HTML)
|       `-- vendor/
|           |-- three.r134.min.js
|           `-- vanta.net.min.js
|-- pos-kasir/               # Submodule aplikasi POS Kasir
|-- .gitmodules
|
# --- FILE UTILITAS PENGEMBANGAN (Opsional untuk GitHub) ---
|-- server.js               # Server lokal sederhana (Express) untuk peninjauan
|-- translate.js            # Skrip otomatisasi penerjemahan awal ke Bahasa Indonesia
|-- translate-more.js       # Skrip otomatisasi penerjemahan lanjutan
|-- update-css.js           # Skrip pembaruan CSS otomatis
`-- update-html.js          # Skrip pembaruan HTML otomatis
```

Keterangan File & Alur Kerja:

- `index.html` & `index-id.html`: Halaman utama portofolio. Kedua file ini menggunakan versi terkompresi dari CSS dan JS (`.min.css` dan `.min.js`) agar website dapat dimuat dengan sangat cepat dan memiliki performa optimal (skor PageSpeed tinggi).
- **Proses Minifikasi**: Jika Anda melakukan perubahan pada file source CSS/JS di folder `assets/css/` atau `assets/js/`, Anda **harus** menjalankan perintah minifikasi untuk memperbarui file `.min` yang dibaca oleh HTML.
  Perintah untuk melakukan minifikasi otomatis:
  ```bash
  npm run minify
  ```
  Perintah ini menggunakan `clean-css-cli` untuk CSS dan `terser` untuk JavaScript.

- **File Utilitas Pengembangan (`server.js`, `translate.js`, dll)**:
  - `server.js` digunakan untuk menjalankan server lokal di port 3000 selama masa pengembangan.
  - File-file `.js` di luar folder `assets/` (seperti `translate.js`, `update-html.js`, dll) adalah skrip bantu (helper scripts) berbasis Node.js yang kami gunakan untuk mengotomatiskan proses penerjemahan halaman, sinkronisasi struktur, dan pembaruan massal.
  - **Apakah wajib dimasukkan ke GitHub?** **Tidak wajib.** GitHub Pages hanya membutuhkan folder static (`index.html`, `index-id.html`, dan folder `assets/`) untuk menampilkan website Anda secara online. Namun, sangat disarankan untuk tetap memasukannya ke GitHub agar jika di masa depan Anda ingin mengembangkan web ini di komputer lain, Anda memiliki alat bantu yang sama lengkapnya.

## Cara Menjalankan di Lokal

1. **Persiapan**: Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/).
2. **Clone repository**:
   ```bash
   git clone --recurse-submodules https://github.com/Agansulisfiana/agansulisfiana.github.io.git
   ```
3. **Instal Dependencies**:
   Masuk ke folder project dan jalankan instalasi package (untuk minifier dan server lokal):
   ```bash
   cd agansulisfiana.github.io
   npm install
   ```
4. **Jalankan Server Lokal**:
   Untuk meninjau perubahan portofolio dengan server lokal:
   ```bash
   npm start
   ```
   Buka `http://localhost:3000` di browser Anda.

5. **Melakukan Perubahan**:
   - Edit file stylesheet di `assets/css/style.css` atau `assets/css/certifications.css`.
   - Edit file skrip di `assets/js/script.js` atau `assets/js/certifications.js`.
   - Setelah selesai mengedit, jalankan:
     ```bash
     npm run minify
     ```
     untuk mengompilasi dan mengompres file ke versi `.min` agar perubahan dapat langsung terlihat di browser.

Jika repository sudah terlanjur di-clone tanpa submodule, jalankan:

```bash
git submodule update --init --recursive
```

## Project Terkait

Repository ini juga memuat submodule:

```text
pos-kasir -> https://github.com/Agansulisfiana/pos-kasir.git
```

Project tersebut berisi aplikasi POS kasir berbasis web yang dapat dijalankan secara terpisah dari portfolio utama.

## Kontak

- Email: agansulisfiana@gmail.com
- LinkedIn: https://www.linkedin.com/in/agan-it-support
- WhatsApp: https://wa.me/6282299900282

## Lisensi

Copyright (c) 2026 Agan Sulisfiana. All rights reserved.
