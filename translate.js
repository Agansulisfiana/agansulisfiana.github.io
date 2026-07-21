const fs = require('fs');
let content = fs.readFileSync('index-id.html', 'utf8');

// Header / Meta
content = content.replace(/IT Support professional with 5\+ years experience in hardware, software, network troubleshooting, printer support, and field technical operations\./g, 
"Profesional IT Support dengan pengalaman 5+ tahun dalam perbaikan perangkat keras, perangkat lunak, jaringan, printer, serta operasi teknis lapangan.");

// Hero
content = content.replace(/IT Support professional with hands-on experience in computer, hardware, software,\s*network, and printer troubleshooting, device deployment, preventive maintenance,\s*and on-site or remote user support\./g,
"Profesional IT Support dengan pengalaman langsung dalam pemecahan masalah komputer, perangkat keras, perangkat lunak, jaringan, dan printer, penerapan perangkat, pemeliharaan preventif, serta dukungan pengguna di lokasi maupun jarak jauh.");

// About Section
content = content.replace(/I am a dedicated IT Support professional with over 5 years of hands-on experience bridging the gap between complex technology and end-users\. I specialize in rapid troubleshooting, seamless device deployment, and maintaining critical infrastructure\./g,
"Saya adalah seorang profesional IT Support yang berdedikasi dengan pengalaman lebih dari 5 tahun dalam menjembatani kesenjangan antara teknologi yang kompleks dan pengguna akhir. Saya mengkhususkan diri pada pemecahan masalah yang cepat, penerapan perangkat, dan pemeliharaan infrastruktur penting.");

content = content.replace(/My expertise spans across enterprise hardware, network configuration, and specialized public service systems—including ADM Dukcapil, Fargo Card Printers, and BCA CS Digital kiosks\. Whether providing remote assistance or executing massive on-site deployments, my goal is always to minimize downtime and ensure technology works flawlessly for the people who rely on it\./g,
"Keahlian saya mencakup perangkat keras perusahaan, konfigurasi jaringan, dan sistem layanan publik khusus—termasuk ADM Dukcapil, Printer Kartu Fargo, dan kios BCA CS Digital. Baik saat memberikan bantuan jarak jauh maupun melaksanakan pemasangan besar di lokasi, tujuan saya selalu meminimalkan waktu henti (downtime) dan memastikan teknologi bekerja secara sempurna bagi yang menggunakannya.");

content = content.replace(/Profile/g, "Profil");
content = content.replace(/Years in IT Support/g, "Tahun Pengalaman IT Support");
content = content.replace(/Specialized Systems/g, "Sistem Khusus");
content = content.replace(/Projects Deployed/g, "Proyek Diterapkan");

// Skills
content = content.replace(/Expertise/g, "Keahlian");
content = content.replace(/PC Assembly &amp; Maintenance/g, "Perakitan &amp; Pemeliharaan PC");
content = content.replace(/Network Setup \(LAN, Wi-Fi\)/g, "Pengaturan Jaringan (LAN, Wi-Fi)");
content = content.replace(/CCTV Installation/g, "Instalasi CCTV");
content = content.replace(/General Troubleshooting/g, "Pemecahan Masalah Umum");
content = content.replace(/Fargo Printer Maintenance/g, "Pemeliharaan Printer Fargo");
content = content.replace(/Evolis Printer Support/g, "Dukungan Printer Evolis");
content = content.replace(/General Office Printers/g, "Printer Kantor Umum");
content = content.replace(/Digital Signage/g, "Papan Reklame Digital");
content = content.replace(/Windows Administration/g, "Administrasi Windows");
content = content.replace(/Software Installation/g, "Instalasi Perangkat Lunak");
content = content.replace(/Basic HTML, CSS, JS/g, "HTML, CSS, JS Dasar");
content = content.replace(/Remote Support Tools/g, "Alat Dukungan Jarak Jauh");
content = content.replace(/Problem Solving/g, "Pemecahan Masalah");
content = content.replace(/Team Collaboration/g, "Kolaborasi Tim");
content = content.replace(/Time Management/g, "Manajemen Waktu");
content = content.replace(/Communication Skills/g, "Keterampilan Komunikasi");

// Experience
content = content.replace(/Supported deployment and operational readiness of ADM \(Anjungan Dukcapil Mandiri\) systems across multiple locations\./g, "Mendukung penerapan dan kesiapan operasional sistem ADM (Anjungan Dukcapil Mandiri) di berbagai lokasi.");
content = content.replace(/Performed on-site troubleshooting and maintenance for Fargo HDP5000 card printers, ensuring operational continuity\./g, "Melakukan pemecahan masalah di lokasi dan pemeliharaan printer kartu Fargo HDP5000, memastikan kelangsungan operasional.");
content = content.replace(/Installed, configured, and maintained Papan Reklame Digital and e-KTP Reader systems for public service operations\./g, "Menginstal, mengonfigurasi, dan memelihara sistem Papan Reklame Digital dan Pembaca e-KTP untuk operasi pelayanan publik.");
content = content.replace(/Conducted preventive maintenance, calibration, and technical inspections to minimize device downtime\./g, "Melakukan pemeliharaan preventif, kalibrasi, dan inspeksi teknis untuk meminimalkan waktu henti perangkat.");
content = content.replace(/Delivered technical support for hardware, software, network infrastructure, and enterprise operational devices\./g, "Memberikan dukungan teknis untuk perangkat keras, perangkat lunak, infrastruktur jaringan, dan perangkat operasional perusahaan.");
content = content.replace(/Provided on-site and remote assistance for users, operational teams, and project deployments\./g, "Memberikan bantuan secara langsung maupun jarak jauh untuk pengguna, tim operasional, dan implementasi proyek.");
content = content.replace(/Managed food preparation and cooking processes in line with restaurant standards\./g, "Mengelola proses penyiapan dan memasak makanan sesuai dengan standar restoran.");
content = content.replace(/Maintained food quality, consistency, hygiene, and presentation standards\./g, "Menjaga kualitas, konsistensi, kebersihan, dan standar penyajian makanan.");
content = content.replace(/Supported inventory monitoring and ingredient preparation for daily operations\./g, "Mendukung pemantauan inventaris dan penyiapan bahan baku untuk operasional harian.");
content = content.replace(/Supervised daily operations and maintained service quality standards\./g, "Mengawasi operasional harian dan menjaga standar kualitas pelayanan.");
content = content.replace(/Managed staff scheduling, team responsibility coordination, and operational reporting\./g, "Mengelola penjadwalan staf, koordinasi tanggung jawab tim, dan pelaporan operasional.");

// Other fixes
content = content.replace(/South Jakarta, DKI Jakarta/g, "Jakarta Selatan, DKI Jakarta");
content = content.replace(/Continuous Learning/g, "Pembelajaran Berkelanjutan");
content = content.replace(/IT Networking \&amp; Cybersecurity Courses/g, "Kursus Jaringan IT \&amp; Keamanan Siber");
content = content.replace(/Programming and web development courses\./g, "Kursus pemrograman dan pengembangan web.");

fs.writeFileSync('index-id.html', content);
