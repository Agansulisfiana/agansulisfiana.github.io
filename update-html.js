const fs = require('fs');

function updateHtml(filename, lang) {
  let content = fs.readFileSync(filename, 'utf8');
  
  const navBlockRegex = /<button class="nav-toggle" id="navToggle"[\s\S]*?<\/ul>/;
  
  let menuItems = '';
  let activeEN = lang === 'en' ? 'active' : '';
  let activeID = lang === 'id' ? 'active' : '';

  if (lang === 'en') {
    menuItems = `
      <ul class="nav-menu" id="navMenu">
        <li><a href="#about">About</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#certifications">Certifications</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#education">Education</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
`;
  } else {
    menuItems = `
      <ul class="nav-menu" id="navMenu">
        <li><a href="#about">Tentang</a></li>
        <li><a href="#skills">Keahlian</a></li>
        <li><a href="#certifications">Sertifikasi</a></li>
        <li><a href="#experience">Pengalaman</a></li>
        <li><a href="#projects">Proyek</a></li>
        <li><a href="#education">Pendidikan</a></li>
        <li><a href="#contact">Kontak</a></li>
      </ul>
`;
  }

  const newNavBlock = `
      <div class="nav-right">
        ${menuItems}
        
        <div class="lang-toggle-wrapper">
          <a href="index.html" class="lang-toggle-btn ${activeEN}" aria-label="English">EN</a>
          <a href="index-id.html" class="lang-toggle-btn ${activeID}" aria-label="Indonesian">ID</a>
        </div>

        <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="navMenu">
          <span class="nav-toggle-bar"></span>
          <span class="nav-toggle-bar"></span>
          <span class="nav-toggle-bar"></span>
        </button>
      </div>
  `;

  content = content.replace(navBlockRegex, newNavBlock.trim());
  fs.writeFileSync(filename, content);
}

updateHtml('index.html', 'en');
updateHtml('index-id.html', 'id');
