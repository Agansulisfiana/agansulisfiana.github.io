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

- Tampilan responsive untuk desktop dan mobile
- Hero section dengan profil singkat dan foto
- Section About, Skills, Certifications, Experience, Projects, Education, dan Contact
- Animasi reveal saat scroll
- Typing effect pada title profesi
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

## Struktur Project

```text
.
|-- index.html
|-- README.md
|-- assets/
|   |-- css/
|   |   |-- certifications.css
|   |   `-- style.css
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
|       |-- certifications.js
|       |-- script.js
|       `-- vendor/
|           |-- three.r134.min.js
|           `-- vanta.net.min.js
|-- pos-kasir/
`-- .gitmodules
```

Keterangan:

- `index.html` adalah halaman utama portfolio.
- `assets/css/style.css` berisi styling utama portfolio.
- `assets/css/certifications.css` berisi styling untuk section sertifikasi dan modal.
- `assets/js/script.js` berisi interaksi, animasi, typing effect, dan scroll behavior.
- `assets/js/certifications.js` berisi logika untuk menampilkan sertifikat menggunakan modal.
- `assets/js/vendor/` berisi library lokal Three.js dan Vanta.js untuk background interaktif.
- `assets/documents/resume-agan-sulisfiana.pdf` digunakan untuk tombol download resume.
- `assets/images/` berisi foto profil, dokumentasi project, dan gambar sertifikat.
- `pos-kasir/` adalah submodule project aplikasi POS kasir.

## Cara Menjalankan di Lokal

Clone repository:

```bash
git clone --recurse-submodules https://github.com/Agansulisfiana/agansulisfiana.github.io.git
```

Masuk ke folder project:

```bash
cd agansulisfiana.github.io
```

Buka file `index.html` langsung di browser, atau jalankan dengan extension seperti Live Server di Visual Studio Code.

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
