const fs = require('fs');
let content = fs.readFileSync('index-id.html', 'utf8');

content = content.replace(/Photo of Agan Sulisfiana/g, "Foto Agan Sulisfiana");
content = content.replace(/IT Support \& Helpdesk/g, "Dukungan TI & Helpdesk");
content = content.replace(/Networking fundamentals and IT infrastructure\./g, "Dasar-dasar jaringan dan infrastruktur TI.");
content = content.replace(/Hardware and device management\./g, "Perangkat keras dan manajemen perangkat.");
content = content.replace(/Identity and secure issuance solutions\./g, "Solusi penerbitan identitas yang aman.");
content = content.replace(/Certifications/g, "Sertifikasi");
content = content.replace(/5 Certificates/g, "5 Sertifikat");
content = content.replace(/2 Certificates/g, "2 Sertifikat");
content = content.replace(/1 Certificate/g, "1 Sertifikat");
content = content.replace(/6 Certificates/g, "6 Sertifikat");

// Education
content = content.replace(/Formal education and academic background\./g, "Pendidikan formal dan latar belakang akademik.");
content = content.replace(/Universitas Nasional/g, "Universitas Nasional (UNAS)");
content = content.replace(/Graduated in/g, "Lulus pada tahun");

// Projects & Activities
content = content.replace(/Selected IT projects and technical deployment activities\./g, "Proyek IT terpilih dan aktivitas pemasangan teknis.");

// Contact
content = content.replace(/Feel free to reach out for collaborations, IT support needs, or just a friendly hello\./g, "Jangan ragu untuk menghubungi saya untuk kolaborasi, kebutuhan IT Support, atau sekadar menyapa.");

fs.writeFileSync('index-id.html', content);
