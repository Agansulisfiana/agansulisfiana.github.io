/**
 * Shooting Star & Cosmic Stardust Engine
 * Inspired by CodePen "Shooting Star" (forked by Agansulisfiana from Ko.Yelie)
 * "Your mouse (or finger) will be a shooting star"
 * 
 * Styled specifically to match the cyber dark portfolio theme:
 * - Electric Cyan (#38bdf8), Royal Blue (#2563eb), Ice Blue (#e0f2fe), Pure White (#ffffff)
 * - The mouse/touch cursor acts as an active shooting star with a glowing head flare,
 *   luminous comet tail ribbon, and trailing stardust sparks.
 * - Periodic background meteors streak across the dark cosmos.
 * - Pointer-events: none, strictly fixed positioning, zero layout displacement.
 */

(function initShootingStars() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Find or create canvas
  let canvas = document.getElementById('shooting-stars-bg');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'shooting-stars-bg';
    canvas.setAttribute('aria-hidden', 'true');
    const vantaEl = document.getElementById('vanta-bg');
    if (vantaEl && vantaEl.parentNode) {
      vantaEl.parentNode.insertBefore(canvas, vantaEl.nextSibling);
    } else {
      document.body.prepend(canvas);
    }
  }

  // Enforce rigid fixed positioning so it never displaces any DOM elements
  canvas.style.cssText = 'position:fixed!important;top:0!important;left:0!important;width:100vw!important;height:100vh!important;pointer-events:none!important;z-index:1!important;mix-blend-mode:screen!important;display:block!important;margin:0!important;padding:0!important;overflow:hidden!important;';

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;

  // Portfolio Cyan-Blue Color Palette
  const PALETTE = {
    white: '255, 255, 255',
    iceBlue: '224, 242, 254',
    cyan: '56, 189, 248',
    blue: '37, 99, 235',
    deepBlue: '30, 58, 138'
  };

  // State
  const backgroundStars = [];
  const meteors = [];
  const stardustParticles = [];
  const mouseTrail = [];
  const maxTrailPoints = 22;

  let lastSpawnTime = 0;
  let nextMeteorDelay = 2200;
  let isTabVisible = true;
  let animationFrameId = null;

  // Mouse & Touch Tracking
  const mouse = {
    x: -500,
    y: -500,
    prevX: -500,
    prevY: -500,
    speed: 0,
    lastActive: 0,
    isHovering: false
  };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    initBackgroundStars();
  }

  // --- Background Twinkling Constellation Stars ---
  function initBackgroundStars() {
    backgroundStars.length = 0;
    const count = Math.floor(Math.min(width, 1920) * 0.07);

    for (let i = 0; i < count; i++) {
      backgroundStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.4 + 0.5,
        baseAlpha: Math.random() * 0.6 + 0.25,
        twinkleSpeed: Math.random() * 0.02 + 0.008,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.5 ? PALETTE.iceBlue : (Math.random() > 0.5 ? PALETTE.cyan : PALETTE.white)
      });
    }
  }

  // --- Background Ambient Meteor (Shooting Star) ---
  class Meteor {
    constructor(startX, startY, customAngle) {
      this.angle = customAngle !== undefined ? customAngle : (Math.PI * 0.76 + (Math.random() * 0.16 - 0.08));

      if (startX !== undefined && startY !== undefined) {
        this.x = startX;
        this.y = startY;
      } else {
        const fromTop = Math.random() > 0.4;
        if (fromTop) {
          this.x = Math.random() * (width * 0.85) + (width * 0.15);
          this.y = -30;
        } else {
          this.x = width + 30;
          this.y = Math.random() * (height * 0.65);
        }
      }

      this.speed = Math.random() * 9 + 14;
      this.length = Math.random() * 90 + 130;
      this.size = Math.random() * 1.2 + 1.8;
      this.opacity = 1;
      this.life = 0;
      this.maxLife = Math.random() * 32 + 42;
      this.color = Math.random() > 0.4 ? PALETTE.cyan : PALETTE.iceBlue;
    }

    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.life++;

      if (this.life > this.maxLife * 0.65) {
        this.opacity = Math.max(0, 1 - (this.life - this.maxLife * 0.65) / (this.maxLife * 0.35));
      }

      // Occasionally drop stardust along meteor trajectory
      if (Math.random() > 0.6 && stardustParticles.length < 80) {
        stardustParticles.push(new Stardust(
          this.x + (Math.random() - 0.5) * 4,
          this.y + (Math.random() - 0.5) * 4,
          -Math.cos(this.angle) * 1.5 + (Math.random() - 0.5),
          -Math.sin(this.angle) * 1.5 + (Math.random() - 0.5),
          PALETTE.cyan,
          Math.random() * 1.6 + 0.8,
          24
        ));
      }

      return this.life <= this.maxLife && this.x >= -this.length && this.y <= height + this.length;
    }

    draw(context) {
      if (this.opacity <= 0.01) return;

      const tailX = this.x - Math.cos(this.angle) * this.length;
      const tailY = this.y - Math.sin(this.angle) * this.length;

      const gradient = context.createLinearGradient(tailX, tailY, this.x, this.y);
      gradient.addColorStop(0, `rgba(${PALETTE.blue}, 0)`);
      gradient.addColorStop(0.35, `rgba(${PALETTE.blue}, ${0.3 * this.opacity})`);
      gradient.addColorStop(0.75, `rgba(${this.color}, ${0.8 * this.opacity})`);
      gradient.addColorStop(0.95, `rgba(${PALETTE.iceBlue}, ${0.95 * this.opacity})`);
      gradient.addColorStop(1, `rgba(${PALETTE.white}, ${this.opacity})`);

      context.save();
      context.beginPath();
      context.moveTo(tailX, tailY);
      context.lineTo(this.x, this.y);
      context.strokeStyle = gradient;
      context.lineWidth = this.size;
      context.lineCap = 'round';
      context.shadowColor = `rgba(${PALETTE.cyan}, ${0.8 * this.opacity})`;
      context.shadowBlur = 10;
      context.stroke();

      // Glowing meteor head
      context.beginPath();
      context.arc(this.x, this.y, this.size * 1.6, 0, Math.PI * 2);
      context.fillStyle = `rgba(${PALETTE.white}, ${this.opacity})`;
      context.shadowColor = `rgba(${PALETTE.cyan}, ${this.opacity})`;
      context.shadowBlur = 14;
      context.fill();
      context.restore();
    }
  }

  // --- Stardust Spark Particles ---
  class Stardust {
    constructor(x, y, vx, vy, color, size, maxLife) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.color = color || (Math.random() > 0.5 ? PALETTE.cyan : PALETTE.white);
      this.size = size || (Math.random() * 2 + 1);
      this.life = 0;
      this.maxLife = maxLife || Math.floor(Math.random() * 24 + 28);
      this.opacity = 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.94;
      this.vy *= 0.94;
      this.life++;
      this.opacity = Math.max(0, 1 - (this.life / this.maxLife));
      return this.life <= this.maxLife;
    }

    draw(context) {
      if (this.opacity <= 0.01) return;
      context.save();
      context.beginPath();
      context.arc(this.x, this.y, this.size * this.opacity, 0, Math.PI * 2);
      context.fillStyle = `rgba(${this.color}, ${this.opacity * 0.85})`;
      context.shadowColor = `rgba(${PALETTE.cyan}, ${this.opacity * 0.7})`;
      context.shadowBlur = 6;
      context.fill();
      context.restore();
    }
  }

  // Helper: Draw 4-point Diamond Star Glint (Shooting Star Core)
  function drawStarGlint(context, cx, cy, spikes, outerRadius, innerRadius, color, alpha) {
    context.save();
    context.beginPath();
    let rot = Math.PI / 2 * 3;
    let step = Math.PI / spikes;

    context.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      let x = cx + Math.cos(rot) * outerRadius;
      let y = cy + Math.sin(rot) * outerRadius;
      context.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      context.lineTo(x, y);
      rot += step;
    }
    context.lineTo(cx, cy - outerRadius);
    context.closePath();
    context.fillStyle = `rgba(${color}, ${alpha})`;
    context.shadowColor = `rgba(${PALETTE.cyan}, ${alpha})`;
    context.shadowBlur = 12;
    context.fill();
    context.restore();
  }

  // --- Pointer Move: Update Cursor as a Shooting Star ---
  function onPointerMove(e) {
    const x = e.clientX;
    const y = e.clientY;
    const now = performance.now();

    if (mouse.x > -100) {
      const dx = x - mouse.prevX;
      const dy = y - mouse.prevY;
      mouse.speed = Math.min(Math.sqrt(dx * dx + dy * dy), 40);
    }

    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
    mouse.x = x;
    mouse.y = y;
    mouse.lastActive = now;
    mouse.isHovering = true;

    // Add to comet ribbon history
    mouseTrail.unshift({
      x: x,
      y: y,
      time: now,
      speed: mouse.speed
    });

    if (mouseTrail.length > maxTrailPoints) {
      mouseTrail.pop();
    }

    // Spawn trailing stardust sparks based on motion speed
    if (mouse.speed > 1.8 && stardustParticles.length < 90) {
      const sparkCount = mouse.speed > 12 ? 2 : 1;
      for (let s = 0; s < sparkCount; s++) {
        stardustParticles.push(new Stardust(
          x + (Math.random() - 0.5) * 6,
          y + (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 1.5 - (x - mouse.prevX) * 0.12,
          (Math.random() - 0.5) * 1.5 - (y - mouse.prevY) * 0.12,
          Math.random() > 0.4 ? PALETTE.cyan : PALETTE.iceBlue,
          Math.random() * 2 + 1,
          32
        ));
      }
    }
  }

  function onPointerLeave() {
    mouse.isHovering = false;
  }

  // Click / Tap: Mini Starburst Explosion
  function onPointerDown(e) {
    const count = 14;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() * 0.4 - 0.2);
      const spd = Math.random() * 3.5 + 1.5;
      stardustParticles.push(new Stardust(
        e.clientX,
        e.clientY,
        Math.cos(angle) * spd,
        Math.sin(angle) * spd,
        i % 2 === 0 ? PALETTE.cyan : PALETTE.white,
        Math.random() * 2.4 + 1.2,
        42
      ));
    }

    // Occasional shooting star fired on click
    if (meteors.length < 3) {
      const angle = Math.PI * 0.75 + (Math.random() * 0.2 - 0.1);
      meteors.push(new Meteor(e.clientX, e.clientY, angle));
    }
  }

  // --- Render Mouse Shooting Star Ribbon Trail ---
  function renderCursorShootingStar(context, now) {
    // Prune stale trail points older than 260ms
    while (mouseTrail.length > 0 && now - mouseTrail[mouseTrail.length - 1].time > 260) {
      mouseTrail.pop();
    }

    if (mouseTrail.length > 1) {
      for (let i = 0; i < mouseTrail.length - 1; i++) {
        const p1 = mouseTrail[i];
        const p2 = mouseTrail[i + 1];

        const progress = i / (mouseTrail.length - 1);
        const age = (now - p1.time) / 260;
        const alpha = Math.max(0, (1 - age) * (1 - progress * 0.7));

        if (alpha <= 0.01) continue;

        const lineWidth = Math.max(0.6, (1 - progress) * 4.5);

        context.save();
        context.beginPath();
        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
        context.strokeStyle = i === 0
          ? `rgba(${PALETTE.white}, ${alpha})`
          : (progress < 0.45 ? `rgba(${PALETTE.cyan}, ${alpha * 0.85})` : `rgba(${PALETTE.blue}, ${alpha * 0.5})`);
        context.lineWidth = lineWidth;
        context.lineCap = 'round';
        context.shadowColor = `rgba(${PALETTE.cyan}, ${alpha * 0.8})`;
        context.shadowBlur = 8;
        context.stroke();
        context.restore();
      }
    }

    // Draw Glowing Star Head at cursor position if cursor is on screen
    if (mouse.isHovering && mouse.x > 0 && mouse.y > 0) {
      const timeSec = now * 0.003;
      const pulse = Math.sin(timeSec * 4) * 0.15 + 0.85;

      // Outer radial glow
      const radial = context.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 22);
      radial.addColorStop(0, `rgba(${PALETTE.cyan}, 0.55)`);
      radial.addColorStop(0.4, `rgba(${PALETTE.blue}, 0.25)`);
      radial.addColorStop(1, `rgba(${PALETTE.deepBlue}, 0)`);

      context.save();
      context.beginPath();
      context.arc(mouse.x, mouse.y, 22, 0, Math.PI * 2);
      context.fillStyle = radial;
      context.fill();

      // 4-point Diamond Star Flare (Twinkling Shooting Star Head)
      drawStarGlint(context, mouse.x, mouse.y, 4, 7 * pulse, 2.2 * pulse, PALETTE.white, 0.95);
      context.restore();
    }
  }

  // --- Main Animation Loop ---
  function loop(currentTime) {
    if (!isTabVisible) {
      animationFrameId = null;
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // 1. Background Twinkling Constellation Stars
    const timeSec = currentTime * 0.001;
    for (let i = 0; i < backgroundStars.length; i++) {
      const s = backgroundStars[i];
      const pulse = Math.sin(timeSec * 2.5 + s.phase) * 0.35 + 0.65;
      const alpha = s.baseAlpha * pulse;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color}, ${alpha})`;
      ctx.fill();
    }

    // 2. Periodic Ambient Meteors
    if (currentTime - lastSpawnTime > nextMeteorDelay) {
      if (meteors.length < 3) {
        meteors.push(new Meteor());
      }
      lastSpawnTime = currentTime;
      nextMeteorDelay = Math.random() * 2200 + 1600; // Natural 1.6s - 3.8s spacing
    }

    // 3. Draw Ambient Meteors
    for (let i = meteors.length - 1; i >= 0; i--) {
      const meteor = meteors[i];
      if (meteor.update()) {
        meteor.draw(ctx);
      } else {
        meteors.splice(i, 1);
      }
    }

    // 4. Cursor Shooting Star (Ribbon + Star Head)
    renderCursorShootingStar(ctx, currentTime);

    // 5. Active Stardust Sparks
    for (let i = stardustParticles.length - 1; i >= 0; i--) {
      const spark = stardustParticles[i];
      if (spark.update()) {
        spark.draw(ctx);
      } else {
        stardustParticles.splice(i, 1);
      }
    }

    animationFrameId = requestAnimationFrame(loop);
  }

  // Event Listeners
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave, { passive: true });
  window.addEventListener('resize', resize, { passive: true });

  document.addEventListener('visibilitychange', () => {
    isTabVisible = document.visibilityState === 'visible';
    if (isTabVisible && !animationFrameId) {
      lastSpawnTime = performance.now();
      loop(lastSpawnTime);
    }
  });

  // Init
  resize();
  lastSpawnTime = performance.now();
  loop(lastSpawnTime);
})();
