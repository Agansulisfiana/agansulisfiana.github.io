/* ============================================================
   Agan Sulisfiana — Portfolio interactions
   Vanta background · typing effect · counters · reveal ·
   scroll spy · tilt cards · mobile menu
   ============================================================ */

/* ---------- Vanta animated background ---------- */
if (window.VANTA && window.VANTA.NET) {
  VANTA.NET({
    el: "#vanta-bg",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: 0x3b82f6,
    backgroundColor: 0x09090b,
    points: 12.00,
    maxDistance: 22.00,
    spacing: 18.00
  });
}

/* ---------- Typing effect for hero title ---------- */
const isID = document.documentElement.lang === 'id';
const title = document.getElementById('typing-title');
const roles = isID 
  ? ['IT Support Engineer', 'Teknisi Lapangan', 'Peminat Web Development']
  : ['IT Support Engineer', 'Field Service Engineer', 'Web Development Enthusiast'];
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeRole() {
  const currentRole = roles[roleIndex];

  title.textContent = currentRole.slice(0, charIndex);

  if (!deleting && charIndex < currentRole.length) {
    charIndex += 1;
    setTimeout(typeRole, 75);
    return;
  }

  if (!deleting) {
    deleting = true;
    setTimeout(typeRole, 1200);
    return;
  }

  if (charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeRole, 45);
    return;
  }

  deleting = false;
  roleIndex = (roleIndex + 1) % roles.length;
  setTimeout(typeRole, 250);
}

setTimeout(typeRole, 1150);

/* ---------- Counters + reveal on scroll ---------- */
const revealItems = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('.counter');

function animateCounter(counter) {
  if (counter.dataset.counted === 'true') return;

  counter.dataset.counted = 'true';

  const target = Number(counter.dataset.target || 0);
  const suffix = counter.dataset.suffix || '';
  const duration = 1200;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.round(easedProgress * target);

    counter.textContent = `${currentValue}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  requestAnimationFrame(updateCounter);
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      /* Staggered reveal: assign incremental delay to siblings in a grid */
      const parent = entry.target.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(el => el.classList.contains('reveal'));
        const idx = siblings.indexOf(entry.target);
        if (idx > -1) {
          entry.target.style.setProperty('--reveal-delay', `${idx * 0.06}s`);
        }
      }

      entry.target.classList.add('show');

      entry.target.querySelectorAll('.counter').forEach(animateCounter);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach(item => observer.observe(item));
counters.forEach(counter => {
  const parentReveal = counter.closest('.reveal');

  if (!parentReveal) animateCounter(counter);
});

/* ---------- Back to top + scroll spy ---------- */
const backToTop = document.getElementById('backToTop');

function handleScrollSpy() {
  backToTop.classList.toggle('show', window.scrollY > 500);

  document.querySelectorAll('section[id]').forEach(section => {
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-menu a[href="#${id}"]`);

    if (!link) return;

    const top = section.offsetTop - 130;
    const bottom = top + section.offsetHeight;

    link.classList.toggle('active', window.scrollY >= top && window.scrollY < bottom);
  });
}

window.addEventListener('scroll', handleScrollSpy, { passive: true });
handleScrollSpy();

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- 3D tilt cards & liquid sheen (desktop only) ---------- */
const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canTilt) {
  document.querySelectorAll('.tilt-card, .profile-card').forEach(card => {
    const maxTilt = 4;

    card.addEventListener('pointermove', event => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      card.style.setProperty('--tilt-x', `${-y * maxTilt * 2}deg`);
      card.style.setProperty('--tilt-y', `${x * maxTilt * 2}deg`);
      card.style.setProperty('--sheen-x', `${(x + 0.5) * 100}%`);
      card.style.setProperty('--sheen-y', `${(y + 0.5) * 100}%`);
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
}

/* ---------- Mobile menu toggle ---------- */
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

function closeMenu() {
  navMenu.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', isID ? 'Buka menu' : 'Open menu');
}

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? (isID ? 'Tutup menu' : 'Close menu') : (isID ? 'Buka menu' : 'Open menu'));
  });

  /* Close menu when a link is clicked (mobile) */
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(() => link.blur(), 150);
      if (navMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  });

  /* Close menu when clicking outside */
  document.addEventListener('click', (event) => {
    if (!navMenu.classList.contains('open')) return;
    if (navMenu.contains(event.target) || navToggle.contains(event.target)) return;
    closeMenu();
  });

  /* Close menu on Escape key */
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  /* Reset menu state when resizing to desktop */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 920) {
      closeMenu();
    }
  });
}

/* ---------- E. Scroll progress bar ---------- */
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

/* ---------- C. Liquid Spotlight hover on cards & containers ---------- */
const canSpotlight = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canSpotlight) {
  const spotlightTargets = document.querySelectorAll(
    '.skill-card, .project-card, .certificate-card, .education-card, .stat, .job-card, .profile-card, .contact-list-item, .contact-form-container, .cert-provider-card, .about-card'
  );
  spotlightTargets.forEach(card => {
    card.addEventListener('pointermove', event => {
      const bounds = card.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      card.style.setProperty('--spot-x', `${x}%`);
      card.style.setProperty('--spot-y', `${y}%`);
    });
  });
}

/* ---------- D. Liquid ripple click wave ---------- */
document.querySelectorAll('.btn, .cert-provider-cta, .lang-toggle-btn, .skill-filter-btn').forEach(button => {
  button.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.classList.add('liquid-ripple');
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

/* ---------- Enhanced cursor + magnetic CTA + timeline draw ---------- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktopCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion;

if (desktopCursor) {
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const trail = document.createElement('div');
  trail.className = 'cursor-trail';
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(dot);
  document.body.appendChild(trail);
  document.body.appendChild(glow);

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let trailX = pointerX;
  let trailY = pointerY;

  document.addEventListener('pointermove', event => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    dot.style.opacity = '1';
    glow.style.opacity = '1';
    trail.style.opacity = '1';
  }, { passive: true });

  document.addEventListener('pointerleave', () => {
    dot.style.opacity = '0';
    glow.style.opacity = '0';
    trail.style.opacity = '0';
  }, { passive: true });

  function animateCursor() {
    trailX += (pointerX - trailX) * 0.18;
    trailY += (pointerY - trailY) * 0.18;

    dot.style.transform = `translate(${pointerX}px, ${pointerY}px) translate(-50%, -50%)`;
    trail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;
    glow.style.transform = `translate(${pointerX}px, ${pointerY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }

  requestAnimationFrame(animateCursor);
}

const magneticItems = document.querySelectorAll('.magnetic-item');
magneticItems.forEach(item => {
  item.addEventListener('pointermove', event => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const offsetX = (x / rect.width - 0.5) * 18;
    const offsetY = (y / rect.height - 0.5) * 18;

    item.style.setProperty('--mx', `${offsetX}px`);
    item.style.setProperty('--my', `${offsetY}px`);
  });

  item.addEventListener('pointerleave', () => {
    item.style.setProperty('--mx', '0px');
    item.style.setProperty('--my', '0px');
  });
});

const timeline = document.querySelector('.timeline');
if (timeline) {
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timeline.classList.add('ready');
        timelineObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });

  timelineObserver.observe(timeline);
}

/* ---------- F. Skills Filter Tabs ---------- */
const skillFilterBtns = document.querySelectorAll('.skill-filter-btn');
const skillCards = document.querySelectorAll('.skills-grid .skill-card');

if (skillFilterBtns.length && skillCards.length) {
  skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      skillCards.forEach(card => {
        const categories = card.dataset.category ? card.dataset.category.split(' ') : [];
        const matches = filter === 'all' || categories.includes(filter);

        if (matches) {
          card.classList.remove('is-hidden');
          card.classList.remove('is-filtered');
          void card.offsetWidth;
          card.classList.add('is-filtered');
        } else {
          card.classList.add('is-hidden');
          card.classList.remove('is-filtered');
        }
      });
    });
  });
}

/* ---------- G. Interactive Mini Terminal Simulator ---------- */
const terminalForm = document.getElementById('terminalForm');
const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');
const terminalBody = document.getElementById('terminalBody');
const terminalClearBtn = document.getElementById('terminalClearBtn');
const terminalChips = document.querySelectorAll('.terminal-chip');

if (terminalForm && terminalInput && terminalOutput && terminalBody) {
  const commandHistory = [];
  let historyIndex = -1;
  let isExecuting = false;

  terminalBody.addEventListener('click', () => {
    if (!window.getSelection().toString()) {
      terminalInput.focus();
    }
  });

  if (terminalClearBtn) {
    terminalClearBtn.addEventListener('click', () => {
      terminalOutput.innerHTML = '';
      terminalInput.focus();
    });
  }

  terminalChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.dataset.cmd;
      if (cmd && !isExecuting) {
        terminalInput.value = cmd;
        runCommand(cmd);
      }
    });
  });

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
    }
  });

  terminalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (isExecuting) return;
    const cmd = terminalInput.value.trim();
    if (cmd) {
      commandHistory.push(cmd);
      historyIndex = commandHistory.length;
      runCommand(cmd);
    }
  });

  function appendLine(html, className = 'terminal-line') {
    const div = document.createElement('div');
    div.className = className;
    div.innerHTML = html;
    terminalOutput.appendChild(div);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function runCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    terminalInput.value = '';
    
    appendLine(`<span class="terminal-prompt">agan@itsupport:~$</span> <span>${escapeHtml(rawCmd)}</span>`, 'terminal-command-echo');

    if (cmd === 'clear') {
      terminalOutput.innerHTML = '';
      return;
    }

    isExecuting = true;
    terminalInput.disabled = true;

    if (cmd === 'help') {
      const helpText = isID ? `
<span class="term-bold term-accent">DAFTAR PERINTAH TERSEDIA:</span>
  <span class="term-highlight">ping &lt;host&gt;</span>       Simulasi uji konektivitas jaringan & latency
  <span class="term-highlight">diagnose fargo</span>     Pemeriksaan teknis printer kartu Fargo HDP5000
  <span class="term-highlight">diagnose adm</span>       Pemeriksaan sistem Kiosk ADM Dukcapil Mandiri
  <span class="term-highlight">diagnose bca</span>       Pemeriksaan mesin CS Digital BCA
  <span class="term-highlight">sysinfo</span>            Informasi profil teknis & keahlian Agan
  <span class="term-highlight">status</span>             Cek ketersediaan kerja & kontak langsung
  <span class="term-highlight">skills</span>             Ringkasan spesialisasi IT Support
  <span class="term-highlight">clear</span>              Membersihkan tampilan terminal
      ` : `
<span class="term-bold term-accent">AVAILABLE COMMANDS:</span>
  <span class="term-highlight">ping &lt;host&gt;</span>       Simulate network latency & connectivity test
  <span class="term-highlight">diagnose fargo</span>     Diagnostic check on Fargo HDP5000 Card Printer
  <span class="term-highlight">diagnose adm</span>       Self-test ADM Dukcapil Public Kiosk System
  <span class="term-highlight">diagnose bca</span>       Self-test BCA CS Digital Machine
  <span class="term-highlight">sysinfo</span>            Display engineer profile & system specs
  <span class="term-highlight">status</span>             Check candidate availability & response time
  <span class="term-highlight">skills</span>             Summary of technical proficiencies
  <span class="term-highlight">clear</span>              Clear current terminal screen
      `;
      appendLine(helpText.trim());
      finishExecution();
      return;
    }

    if (cmd.startsWith('ping')) {
      const parts = rawCmd.trim().split(/\s+/);
      const host = parts[1] || '192.168.1.1';
      appendLine(`<span class="term-dim">Pinging ${escapeHtml(host)} with 32 bytes of data:</span>`);

      let count = 0;
      const interval = setInterval(() => {
        count++;
        const time = Math.floor(Math.random() * 4) + 1;
        appendLine(`<span class="term-success">Reply from ${escapeHtml(host)}: bytes=32 time=${time}ms TTL=64</span>`);
        if (count >= 4) {
          clearInterval(interval);
          setTimeout(() => {
            appendLine(`
<span class="term-dim">Ping statistics for ${escapeHtml(host)}:</span>
    Packets: Sent = 4, Received = 4, Lost = 0 (<span class="term-success">0% loss</span>),
Approximate round trip times in milli-seconds:
    Minimum = 1ms, Maximum = 4ms, Average = 2ms
            `.trim());
            finishExecution();
          }, 250);
        }
      }, 350);
      return;
    }

    if (cmd === 'diagnose fargo' || cmd === 'diagnose printer') {
      appendLine(`<span class="term-accent">[INIT] Fargo HDP5000 Card Printer Diagnostic Routine...</span>`);
      const steps = isID ? [
        '[1/4] Memeriksa koneksi USB 2.0 & Ethernet interface... <span class="term-success">[TERHUBUNG]</span>',
        '[2/4] Kalibrasi sensor Smart Card & modul RFID e-KTP... <span class="term-success">[OK]</span>',
        '[3/4] Memeriksa ketegangan pita Ribbon & Thermal Printhead... <span class="term-success">[100% KALIBRASI]</span>',
        '[4/4] Suhu pemanas HDP Film Retransfer: 175°C... <span class="term-success">[OPTIMAL]</span>',
        '<span class="term-bold term-success">HASIL: Perangkat siap untuk pencetakan e-KTP. Tidak ada error (0x0000).</span>'
      ] : [
        '[1/4] Checking USB 2.0 & Ethernet interface communication... <span class="term-success">[CONNECTED]</span>',
        '[2/4] Testing Smart Card & RFID encoder sensor calibration... <span class="term-success">[PASSED]</span>',
        '[3/4] Inspecting YMCK Ribbon tension & Thermal Printhead... <span class="term-success">[CALIBRATED]</span>',
        '[4/4] Retransfer HDP Film Roller Temperature: 175°C... <span class="term-success">[OPTIMAL]</span>',
        '<span class="term-bold term-success">RESULT: Device ready for secure ID issuance. No error flags detected.</span>'
      ];
      runSequentialSteps(steps);
      return;
    }

    if (cmd === 'diagnose adm' || cmd === 'diagnose kiosk') {
      appendLine(`<span class="term-accent">[INIT] Anjungan Dukcapil Mandiri (ADM) Health Inspection...</span>`);
      const steps = isID ? [
        '[1/3] Status sistem OS Windows IoT & Touchscreen Kiosk... <span class="term-success">[RUNNING]</span>',
        '[2/3] Scanner Optik e-KTP & Sensor Pemindai Sidik Jari... <span class="term-success">[ONLINE]</span>',
        '[3/3] Printer Thermal & Mekanisme Dispenser Dokumen... <span class="term-success">[KERTAS SIAP]</span>',
        '<span class="term-bold term-success">HASIL: Kiosk ADM Dukcapil beroperasi 100% normal untuk pelayanan publik.</span>'
      ] : [
        '[1/3] Kiosk Touchscreen Display & Windows IoT Runtime... <span class="term-success">[RUNNING]</span>',
        '[2/3] Biometric Fingerprint Sensor & Optical e-KTP Reader... <span class="term-success">[ONLINE]</span>',
        '[3/3] Thermal Document Dispenser & Paper Feed Mechanism... <span class="term-success">[READY]</span>',
        '<span class="term-bold term-success">RESULT: ADM Dukcapil Kiosk fully operational with zero downtime.</span>'
      ];
      runSequentialSteps(steps);
      return;
    }

    if (cmd === 'diagnose bca') {
      appendLine(`<span class="term-accent">[INIT] BCA CS Digital Kiosk Diagnostics...</span>`);
      const steps = isID ? [
        '[1/3] Penguji Card Dispenser & Magnetic/Chip Reader... <span class="term-success">[NORMAL]</span>',
        '[2/3] Kamera Video Banking & Modul Audio Intercom... <span class="term-success">[AKTIF]</span>',
        '[3/3] Tunnel Enkripsi Jaringan Perbankan... <span class="term-success">[STABIL]</span>',
        '<span class="term-bold term-success">HASIL: CS Digital siap melayani nasabah secara mandiri.</span>'
      ] : [
        '[1/3] ATM/Debit Card Dispenser & Chip Reader Mechanism... <span class="term-success">[NOMINAL]</span>',
        '[2/3] High-definition Video Banking & Audio Intercom... <span class="term-success">[ACTIVE]</span>',
        '[3/3] Banking Network Encryption Tunnel & Handshake... <span class="term-success">[SECURE]</span>',
        '<span class="term-bold term-success">RESULT: CS Digital kiosk ready for customer transactions.</span>'
      ];
      runSequentialSteps(steps);
      return;
    }

    if (cmd === 'sysinfo' || cmd === 'neofetch' || cmd === 'specs') {
      const ascii = `
<span class="term-accent">   ___  ____ ___ _ _  </span>   <span class="term-bold">Agan Sulisfiana</span>
<span class="term-accent">  / _ \\/ __// _ \`/ _ \\ </span>   ---------------------------
<span class="term-accent"> / // / /_ / // / // / </span>   <span class="term-highlight">Role:</span> IT Support & Field Service Engineer
<span class="term-accent"> \\___/\\__/  \\_,_/_//_/ </span>   <span class="term-highlight">Experience:</span> 5+ Years Hands-on Operations
                          <span class="term-highlight">Hardware:</span> Fargo HDP5000, ADM Kiosks, CS Digital
                          <span class="term-highlight">Systems:</span> Windows OS, LAN/WAN, IP Config, Remote
                          <span class="term-highlight">Web:</span> HTML5, CSS3, JavaScript, SQL
                          <span class="term-highlight">Location:</span> Jakarta Selatan, DKI Jakarta
                          <span class="term-highlight">Uptime:</span> 99.9% Problem Solver Mentality
      `;
      appendLine(ascii.trim());
      finishExecution();
      return;
    }

    if (cmd === 'status') {
      const statusText = isID ? `
<span class="term-bold term-success">&#9679; STATUS: TERBUKA UNTUK BEKERJA (AVAILABLE)</span>
  <span class="term-dim">Penempatan:</span> Jakarta & Sekitarnya (On-Site / Remote / Field Service)
  <span class="term-dim">Waktu Mulai:</span> Siap Bergabung Segera
  <span class="term-dim">Kecepatan Respon:</span> &lt; 2 Jam
  <span class="term-dim">Kontak WhatsApp:</span> <a href="https://wa.me/6282299900282" target="_blank" class="term-accent">+62 822-XXXX-XXXX (Klik untuk Chat)</a>
      ` : `
<span class="term-bold term-success">&#9679; STATUS: OPEN TO WORK (AVAILABLE)</span>
  <span class="term-dim">Preference:</span> Full-Time / On-site Jakarta / Field Service & Remote
  <span class="term-dim">Availability:</span> Ready for immediate start
  <span class="term-dim">Response Time:</span> Typically &lt; 2 Hours
  <span class="term-dim">WhatsApp:</span> <a href="https://wa.me/6282299900282" target="_blank" class="term-accent">+62 822-XXXX-XXXX (Click to Chat)</a>
      `;
      appendLine(statusText.trim());
      finishExecution();
      return;
    }

    if (cmd === 'skills') {
      const skillsText = `
<span class="term-bold term-accent">TECHNICAL COMPETENCIES:</span>
- <span class="term-highlight">Hardware:</span> PC/Laptop Repair, Preventive Maintenance, Component Replacement
- <span class="term-highlight">Specialized Devices:</span> Fargo HDP5000, ADM Dukcapil, BCA CS Digital, e-KTP Reader
- <span class="term-highlight">Network:</span> LAN/WLAN Setup, Switch/Router Config, IP Addressing, Troubleshooting
- <span class="term-highlight">Software & OS:</span> Windows 10/11/Server, Microsoft 365, Ticketing Tools
- <span class="term-highlight">Web Tech:</span> HTML5, CSS3, JavaScript Basics, SQL Querying
      `;
      appendLine(skillsText.trim());
      finishExecution();
      return;
    }

    if (cmd === 'contact') {
      appendLine(`
<span class="term-bold term-accent">CONTACT INFORMATION:</span>
- Email: <a href="mailto:agansulisfiana@gmail.com" class="term-accent">agansulisfiana@gmail.com</a>
- WhatsApp: <a href="https://wa.me/6282299900282" target="_blank" class="term-accent">+62 822-XXXX-XXXX (Click to Chat)</a>
- LinkedIn: <a href="https://linkedin.com/in/agan-it-support" target="_blank" class="term-accent">linkedin.com/in/agan-it-support</a>
      `.trim());
      finishExecution();
      return;
    }

    appendLine(isID 
      ? `<span class="term-error">Perintah tidak dikenali: '${escapeHtml(rawCmd)}'. Ketik <span class="term-highlight">'help'</span> untuk bantuan.</span>`
      : `<span class="term-error">Command not recognized: '${escapeHtml(rawCmd)}'. Type <span class="term-highlight">'help'</span> to see available commands.</span>`
    );
    finishExecution();
  }

  function runSequentialSteps(steps) {
    let index = 0;
    const interval = setInterval(() => {
      if (index < steps.length) {
        appendLine(steps[index]);
        index++;
      } else {
        clearInterval(interval);
        finishExecution();
      }
    }, 380);
  }

  function finishExecution() {
    isExecuting = false;
    terminalInput.disabled = false;
    terminalInput.focus();
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
