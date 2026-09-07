/**
 * Neon Cursor Integration using threejs-toys
 * Powered by WebGL fluid curve simulation
 */

async function initNeonCursor() {
  // Check user motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Find or create container element
  let neonEl = document.getElementById('neon-cursor-bg') || document.getElementById('app');
  if (!neonEl) {
    neonEl = document.createElement('div');
    neonEl.id = 'neon-cursor-bg';
    neonEl.setAttribute('aria-hidden', 'true');
    document.body.prepend(neonEl);
  }

  // Load neonCursor module (prefer custom-tuned local vendor module, CDN fallback)
  let neonCursor;
  try {
    const mod = await import('./vendor/threejs-toys.module.local.min.js');
    neonCursor = mod.neonCursor;
  } catch (localErr) {
    try {
      const fallback = await import('https://unpkg.com/threejs-toys@0.0.8/build/threejs-toys.module.cdn.min.js');
      neonCursor = fallback.neonCursor;
    } catch (cdnErr) {
      console.warn('Neon cursor library could not be loaded:', localErr, cdnErr);
      return;
    }
  }

  if (typeof neonCursor !== 'function') return;

  try {
    neonCursor({
      el: neonEl,
      shaderPoints: 12,
      curvePoints: 60,
      curveLerp: 0.65,
      radius1: 1.2,
      radius2: 12,
      velocityTreshold: 8,
      sleepRadiusX: 10,
      sleepRadiusY: 10,
      sleepTimeCoefX: 0.001,
      sleepTimeCoefY: 0.001
    });

    document.body.classList.add('has-neon-cursor');

    // Forward pointer events to neonEl so it tracks cursor accurately throughout the whole page
    const forwardPointer = (e) => {
      if (e.target === neonEl) return;
      try {
        const pe = new PointerEvent(e.type, {
          clientX: e.clientX,
          clientY: e.clientY,
          screenX: e.screenX,
          screenY: e.screenY,
          pointerId: e.pointerId || 1,
          pointerType: e.pointerType || 'mouse',
          isPrimary: e.isPrimary !== undefined ? e.isPrimary : true,
          bubbles: false,
          cancelable: false
        });
        neonEl.dispatchEvent(pe);
      } catch (_) {
        try {
          const me = new MouseEvent(e.type, {
            clientX: e.clientX,
            clientY: e.clientY,
            bubbles: false
          });
          neonEl.dispatchEvent(me);
        } catch (_) {}
      }
    };

    window.addEventListener('pointermove', forwardPointer, { passive: true });
    window.addEventListener('pointerdown', forwardPointer, { passive: true });
    window.addEventListener('pointerup', forwardPointer, { passive: true });
    window.addEventListener('pointercancel', forwardPointer, { passive: true });
  } catch (err) {
    console.warn('Failed to start neonCursor:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNeonCursor);
} else {
  initNeonCursor();
}
