/* ============================================================
   Certifications — inline collection panel + fullscreen lightbox
   Vanilla JS · self-contained IIFE · no dependencies.
   Reuses portfolio design tokens (see assets/css/style.css).

   Interaction:
     - Click "View Collection" on a provider card -> the
       collection panel expands inline, directly below the cards.
     - Click a certificate -> fullscreen lightbox preview.
   Supports image certificates (png/jpg) and PDF certificates.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Provider & certificate data ----------
     Single source of truth. `file` points at the real asset.
     Titles match the certificate (file) names. Thumbnails for
     PDFs are generated automatically. No year is displayed. */
  var PROVIDERS = {
    'hid-academy': {
      name: 'HID Academy',
      monogram: 'HA',
      svg: '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><rect x="10" y="16" width="44" height="32" rx="10" fill="none" stroke="currentColor" stroke-width="4" /><rect x="18" y="22" width="18" height="10" rx="3" fill="currentColor" opacity="0.18" /><rect x="34" y="22" width="10" height="10" rx="2" fill="currentColor" opacity="0.28" /><path d="M18 34h12" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.85" /><path d="M18 40h18" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.6" /></svg>',
      certificates: [
        { title: 'FARGO HDP500e Technical Training',
          file: 'assets/images/certificates/HID/FARGO-HDP500e-Technical-Training_page-0001.jpg' },
        { title: 'HID Academy Learning Center Getting Started',
          file: 'assets/images/certificates/HID/HID-Academy-Learning-Center-Getting-Started_page-0001.jpg' },
        { title: 'HID FARGO HDP5000e Video Course',
          file: 'assets/images/certificates/HID/HID-FARGO-HDP5000e-Video-Course_page-0001.jpg' },
        { title: 'HID Partner Certifications Getting Started (For APP Patrners Only)',
          file: 'assets/images/certificates/HID/HID-Partner-Certifications-Getting-Started-(For-APP-Patrners-Only).jpg' },
        { title: 'HID Single Fingerprint Product Overview',
          file: 'assets/images/certificates/HID/HID-Single-Fingerprint-Product-Overview.jpg' },
        { title: 'Webinar Recording HDP500e Basic Troubleshooting',
          file: 'assets/images/certificates/HID/WEBINAR-RECORDING-HDP500e-Basic-Troubleshooting.jpg' }
      ]
    },
    'sololearn': {
      name: 'SoloLearn',
      monogram: 'SL',
      svg: '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><rect x="14" y="12" width="36" height="40" rx="10" fill="none" stroke="currentColor" stroke-width="4" /><path d="M24 20h16" stroke="currentColor" stroke-width="3" stroke-linecap="round" /><path d="M22 28h20" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.8" /><path d="M22 36h12" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.65" /><circle cx="44" cy="40" r="6" fill="currentColor" opacity="0.2" /><path d="M44 36v8M40 40h8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" /></svg>',
      certificates: [
        { title: 'HTML', file: 'assets/images/certificates/Sololearn/html.png' },
        { title: 'CSS', file: 'assets/images/certificates/Sololearn/css.png' },
        { title: 'JavaScript', file: 'assets/images/certificates/Sololearn/javascript.png' },
        { title: 'Python', file: 'assets/images/certificates/Sololearn/python.png' },
        { title: 'SQL', file: 'assets/images/certificates/Sololearn/sql.png' }
      ]
    },
    'cisco': {
      name: 'Cisco',
      monogram: 'CI',
      svg: '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M14 44V28M24 44V32M34 44V24M44 44V30M54 44V36" stroke="currentColor" stroke-width="5" stroke-linecap="round" /><path d="M12 28C22 18 34 12 42 18C50 24 54 30 54 30" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity="0.6" /></svg>',
      certificates: [
        { title: 'Getting Started with Cisco Packet Tracer',
          file: 'assets/images/certificates/Cisco/Getting-Started-with-Cisco-Packet-Tracer-certificate.jpg' }
      ]
    }
  };

  var TRANSITION_MS = 420;

  /* ---------- Helpers ---------- */

  /* Escape text for safe inclusion inside markup. Entities are
     assembled via concatenation so the literal sequences never
     appear in source (avoids entity decoding on write). */
  function escapeXml(s) {
    return String(s)
      .replace(/&/g, '&' + 'amp;')
      .replace(/</g, '&' + 'lt;')
      .replace(/>/g, '&' + 'gt;')
      .replace(/"/g, '&' + 'quot;')
      .replace(/'/g, '&' + '#39;');
  }

  function isPdf(path) {
    return /\.pdf$/i.test(path || '');
  }

  /* Generate a certificate-style SVG thumbnail (data URI) that
     matches the portfolio palette, used for PDFs. */
  /* Generate a certificate-style SVG thumbnail (data URI) that
     matches the portfolio palette, used for PDFs. */
  function placeholderImage(title, provider) {
    var embeddedSvg = provider.svg ? provider.svg.replace('<svg ', '<svg x="176" y="100" width="48" height="48" color="#3b82f6" ') : '';
    var iconElement = embeddedSvg || ('<text x="200" y="132" text-anchor="middle" font-family="Inter,Arial,sans-serif" ' +
      'font-size="19" font-weight="800" fill="#3b82f6">' + escapeXml(provider.monogram) + '</text>');

    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
      '<defs><linearGradient id="cbg" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#111114"/><stop offset="1" stop-color="#09090b"/>' +
      '</linearGradient></defs>' +
      '<rect width="400" height="300" fill="url(#cbg)"/>' +
      '<rect x="16" y="16" width="368" height="268" rx="14" fill="none" ' +
      'stroke="#2563eb" stroke-opacity="0.45" stroke-width="1.5"/>' +
      '<rect x="298" y="24" width="66" height="22" rx="6" ' +
      'fill="rgba(37,99,235,0.22)" stroke="rgba(59,130,246,0.5)" stroke-width="1"/>' +
      '<text x="331" y="39" text-anchor="middle" font-family="Inter,Arial,sans-serif" ' +
      'font-size="11" font-weight="800" fill="#3b82f6">PDF</text>' +
      '<circle cx="200" cy="124" r="34" fill="rgba(37,99,235,0.16)" ' +
      'stroke="rgba(59,130,246,0.45)" stroke-width="1.5"/>' +
      iconElement +
      '<text x="200" y="190" text-anchor="middle" font-family="Inter,Arial,sans-serif" ' +
      'font-size="15" font-weight="700" fill="#fafafa">' + escapeXml(title) + '</text>' +
      '<text x="200" y="214" text-anchor="middle" font-family="Inter,Arial,sans-serif" ' +
      'font-size="10" font-weight="800" letter-spacing="2.5" fill="#a1a1aa">PDF CERTIFICATE</text>' +
      '<line x1="150" y1="228" x2="250" y2="228" stroke="#3b82f6" ' +
      'stroke-opacity="0.5" stroke-width="1.5"/>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(svg);
  }

  /* Thumbnail source: real image for raster certs, generated
     placeholder for PDFs. The lightbox always opens the real file. */
  function certThumb(cert, provider) {
    if (cert.file && !isPdf(cert.file)) return cert.file;
    return placeholderImage(cert.title, provider);
  }

  function plural(n) {
    return n + ' Certificate' + (n === 1 ? '' : 's');
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Build inline collection panel ---------- */
  var providersGrid = document.querySelector('.cert-providers');

  var panel = document.createElement('div');
  panel.className = 'cert-collection';
  panel.id = 'certCollection';
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-label', 'Certificate collection');
  panel.innerHTML =
    '<div class="cert-collection-head">' +
      '<div class="cert-collection-heading">' +
        '<span class="cert-collection-logo" aria-hidden="true"></span>' +
        '<div>' +
          '<h3 class="cert-collection-title"></h3>' +
          '<span class="cert-collection-subtitle"></span>' +
        '</div>' +
      '</div>' +
      '<button type="button" class="cert-collection-close" aria-label="Close collection" data-close-collection>' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      '</button>' +
    '</div>' +
    '<div class="cert-collection-body"><div class="cert-collection-grid"></div></div>';

  if (providersGrid) providersGrid.appendChild(panel);

  var panelGrid = panel.querySelector('.cert-collection-grid');
  var panelLogo = panel.querySelector('.cert-collection-logo');
  var panelTitle = panel.querySelector('.cert-collection-title');
  var panelSubtitle = panel.querySelector('.cert-collection-subtitle');
  var panelCloseBtn = panel.querySelector('.cert-collection-close');

  /* ---------- Build lightbox shell ---------- */
  var lightbox = document.createElement('div');
  lightbox.className = 'cert-lightbox';
  lightbox.id = 'certLightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Certificate preview');
  lightbox.innerHTML =
    '<button type="button" class="cert-lightbox-close" aria-label="Close preview" data-close-lightbox>' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
    '</button>' +
    '<figure class="cert-lightbox-figure">' +
      '<div class="cert-lightbox-media"></div>' +
      '<figcaption class="cert-lightbox-caption"></figcaption>' +
    '</figure>';

  document.body.appendChild(lightbox);

  var lightboxMedia = lightbox.querySelector('.cert-lightbox-media');
  var lightboxCaption = lightbox.querySelector('.cert-lightbox-caption');
  var lightboxCloseBtn = lightbox.querySelector('.cert-lightbox-close');

  /* ---------- State ---------- */
  var activeCard = null;
  var panelTimer = null;
  var lightboxTimer = null;
  var lastFocused = null;

  /* ---------- Collection open / close ---------- */
  function buildCollection(provider) {
    var html = '';
    var arrow = '\u2192';
    provider.certificates.forEach(function (cert, i) {
      var file = cert.file;
      var thumb = certThumb(cert, provider);
      var alt = cert.title + ' certificate';
      var delay = reduceMotion ? 0 : Math.min(i * 0.05, 0.4);
      html +=
        '<article class="cert-card" style="animation-delay:' + delay + 's">' +
          '<button type="button" class="cert-card-thumb" ' +
            'data-cert-src="' + escapeXml(file) + '" data-cert-alt="' + escapeXml(alt) + '" ' +
            'data-cert-title="' + escapeXml(cert.title) + '" ' +
            'aria-label="View ' + escapeXml(cert.title) + ' certificate">' +
            '<img src="' + escapeXml(thumb) + '" alt="' + escapeXml(alt) + '" loading="lazy" width="400" height="300" />' +
          '</button>' +
          '<div class="cert-card-info">' +
            '<h4 class="cert-card-title">' + escapeXml(cert.title) + '</h4>' +
            '<button type="button" class="cert-view-btn" ' +
              'data-cert-src="' + escapeXml(file) + '" data-cert-alt="' + escapeXml(alt) + '" ' +
              'data-cert-title="' + escapeXml(cert.title) + '">' +
              'View <span>' + arrow + '</span>' +
            '</button>' +
          '</div>' +
        '</article>';
    });
    panelGrid.innerHTML = html;
  }

  function openCollection(providerId, ctaBtn) {
    var provider = PROVIDERS[providerId];
    if (!provider) return;

    /* Toggle off if the same provider is already open */
    if (activeCard && activeCard === providerId) {
      closeCollection();
      return;
    }

    /* Clear any pending close so content isn't wiped */
    if (panelTimer) {
      clearTimeout(panelTimer);
      panelTimer = null;
    }

    /* Reset other provider cards' active/cta states */
    document.querySelectorAll('.cert-provider-card.is-active').forEach(function (c) {
      c.classList.remove('is-active');
    });
    document.querySelectorAll('.cert-provider-cta.is-open').forEach(function (b) {
      b.classList.remove('is-open');
    });

    /* Mark this provider active */
    var card = ctaBtn ? ctaBtn.closest('.cert-provider-card') : null;
    if (card) card.classList.add('is-active');
    if (ctaBtn) ctaBtn.classList.add('is-open');

    /* Populate panel */
    panelLogo.className = 'cert-collection-logo cert-provider-logo--' + providerId;
    panelLogo.innerHTML = provider.svg || provider.monogram;
    panelTitle.textContent = provider.name;
    panelSubtitle.textContent = plural(provider.certificates.length) +
      ' \u00b7 ' + provider.name;
    buildCollection(provider);

    panel.classList.add('is-open');
    activeCard = providerId;

    /* Smoothly scroll the panel into view (below the cards) */
    if (!reduceMotion) {
      setTimeout(function () {
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 60);
    }
  }

  function closeCollection() {
    panel.classList.remove('is-open');
    activeCard = null;

    document.querySelectorAll('.cert-provider-card.is-active').forEach(function (c) {
      c.classList.remove('is-active');
    });
    document.querySelectorAll('.cert-provider-cta.is-open').forEach(function (b) {
      b.classList.remove('is-open');
    });

    /* Clear built content after the collapse transition */
    panelTimer = setTimeout(function () {
      if (!panel.classList.contains('is-open')) {
        panelGrid.innerHTML = '';
      }
      panelTimer = null;
    }, TRANSITION_MS);
  }

  /* ---------- Lightbox open / close ---------- */
  function openLightbox(file, alt, title) {
    if (lightboxTimer) {
      clearTimeout(lightboxTimer);
      lightboxTimer = null;
    }

    lastFocused = document.activeElement;

    var pdf = isPdf(file);
    if (pdf) {
      lightboxMedia.innerHTML =
        '<iframe class="cert-lightbox-pdf" src="' + escapeXml(file) + '" ' +
        'title="' + escapeXml(alt) + '" type="application/pdf"></iframe>';
      lightboxCaption.innerHTML =
        '<strong>' + escapeXml(title) + '</strong> ' +
        '<a class="cert-lightbox-link" href="' + escapeXml(file) +
        '" target="_blank" rel="noopener">Open in new tab \u2197</a>';
    } else {
      lightboxMedia.innerHTML =
        '<img class="cert-lightbox-img" src="' + escapeXml(file) + '" alt="' + escapeXml(alt) + '" />';
      lightboxCaption.innerHTML = '<strong>' + escapeXml(title) + '</strong>';
    }

    /* Force reflow so the entry state applies before .is-open,
       guaranteeing the scale/opacity transition plays. */
    void lightboxMedia.offsetWidth;

    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lightboxCloseBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    /* Clear media after the transition so iframes stop loading. */
    lightboxTimer = setTimeout(function () {
      if (!lightbox.classList.contains('is-open')) {
        lightboxMedia.innerHTML = '';
      }
      lightboxTimer = null;
    }, 340);
    /* Return focus to the triggering element if still visible. */
    if (lastFocused && typeof lastFocused.focus === 'function') {
      try { lastFocused.focus(); } catch (e) { /* noop */ }
    }
  }

  /* ---------- Event wiring ---------- */

  /* Provider "View Collection" buttons */
  function initProviderCards() {
    var buttons = document.querySelectorAll('.cert-provider-cta[data-provider]');
    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener('click', function () {
        openCollection(btn.getAttribute('data-provider'), btn);
      });
    });
  }

  /* Collection close button */
  panelCloseBtn.addEventListener('click', closeCollection);

  /* Collection: open lightbox from a certificate card (delegated) */
  panelGrid.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-cert-src]');
    if (!trigger) return;
    openLightbox(
      trigger.getAttribute('data-cert-src'),
      trigger.getAttribute('data-cert-alt'),
      trigger.getAttribute('data-cert-title')
    );
  });

  /* Lightbox: close button + click on backdrop (not the media) */
  lightbox.addEventListener('click', function (e) {
    if (e.target.closest('[data-close-lightbox]') || e.target === lightbox) {
      closeLightbox();
    }
  });

  /* Escape key: lightbox first, then collection */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (lightbox.classList.contains('is-open')) {
      e.preventDefault();
      closeLightbox();
    } else if (panel.classList.contains('is-open')) {
      e.preventDefault();
      closeCollection();
    }
  });

  /* Spotlight hover on provider cards (desktop only) */
  function initProviderSpotlight() {
    var canSpotlight = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canSpotlight) return;

    var cards = document.querySelectorAll('.cert-provider-card');
    Array.prototype.forEach.call(cards, function (card) {
      card.addEventListener('pointermove', function (e) {
        var bounds = card.getBoundingClientRect();
        var x = ((e.clientX - bounds.left) / bounds.width) * 100;
        var y = ((e.clientY - bounds.top) / bounds.height) * 100;
        card.style.setProperty('--spot-x', x + '%');
        card.style.setProperty('--spot-y', y + '%');
      });
    });
  }

  /* ---------- Init ---------- */
  function init() {
    initProviderCards();
    initProviderSpotlight();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
