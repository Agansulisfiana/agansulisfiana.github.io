/**
 * Shooting Stars & Cosmic Stardust Engine
 * Designed for Agan Sulisfiana's Cyber Dark Portfolio
 * 
 * Features:
 * - High-speed diagonal shooting stars with cyan/blue trailing gradients
 * - Multi-depth twinkling background starfield
 * - Interactive cursor stardust trail with click burst effects
 * - Performance optimized (HiDPI support, rAF pause on hidden tab, zero DOM thrashing)
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

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;

  // Color Palettes matching portfolio
  const PALETTE = {
    white: '255, 255, 255',
    iceBlue: '224, 242, 254',
    cyan: '56, 189, 248',
    blue: '37, 99, 235',
    deepBlue: '30, 58, 138'
  };

  // State
  const backgroundStars = [];
  const shootingStars = [];
  const cursorParticles = [];
  let lastSpawnTime = 0;
  let nextSpawnDelay = 1400;
  let isTabVisible = true;
  let animationFrameId = null;

  // Track mouse
  let mouse = { x: -100, y: -100, isMoving: false };
  let mouseTimer = null;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    initBackgroundStars();
  }

  // --- Background Twinkling Stars ---
  function initBackgroundStars() {
    backgroundStars.length = 0;
    const starCount = Math.floor(Math.min(width, 1920) * 0.08); // Balanced density

    for (let i = 0; i < starCount; i++) {
      backgroundStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.4 ? PALETTE.iceBlue : (Math.random() > 0.5 ? PALETTE.cyan : PALETTE.white)
      });
    }
  }

  // --- Shooting Star Entity ---
  class ShootingStar {
    constructor(customX, customY, customAngle) {
      // Diagonal trajectory: downwards to the left (angle ~ 140deg to 155deg)
      this.angle = customAngle !== undefined ? customAngle : (Math.PI * 0.78 + (Math.random() * 0.15 - 0.07));
      
      // Spawn around top-right quadrant
      if (customX !== undefined && customY !== undefined) {
        this.x = customX;
        this.y = customY;
      } else {
        const fromTop = Math.random() > 0.45;
        if (fromTop) {
          this.x = Math.random() * (width * 0.8) + (width * 0.2);
          this.y = -20;
        } else {
          this.x = width + 20;
          this.y = Math.random() * (height * 0.6);
        }
      }

      this.speed = Math.random() * 10 + 14; // Fast & fluid streak
      this.length = Math.random() * 90 + 130; // 130px - 220px long tail
      this.size = Math.random() * 1.2 + 1.6;
      this.opacity = 1;
      this.life = 0;
      this.maxLife = Math.random() * 35 + 45; // Frames before finish
      this.color = Math.random() > 0.3 ? PALETTE.cyan : PALETTE.iceBlue;
    }

    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.life++;

      // Fade out smoothly towards end of lifetime
      if (this.life > this.maxLife * 0.6) {
        this.opacity = Math.max(0, 1 - (this.life - this.maxLife * 0.6) / (this.maxLife * 0.4));
      }

      return this.life <= this.maxLife && this.x >= -this.length && this.y <= height + this.length;
    }

    draw(context) {
      if (this.opacity <= 0.01) return;

      const tailX = this.x - Math.cos(this.angle) * this.length;
      const tailY = this.y - Math.sin(this.angle) * this.length;

      // Draw shooting star tail with smooth luminous gradient
      const gradient = context.createLinearGradient(tailX, tailY, this.x, this.y);
      gradient.addColorStop(0, `rgba(${PALETTE.blue}, 0)`);
      gradient.addColorStop(0.3, `rgba(${PALETTE.blue}, ${0.25 * this.opacity})`);
      gradient.addColorStop(0.7, `rgba(${this.color}, ${0.75 * this.opacity})`);
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
      context.shadowBlur = 8;
      context.stroke();

      // Glowing head
      context.beginPath();
      context.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
      context.fillStyle = `rgba(${PALETTE.white}, ${this.opacity})`;
      context.shadowColor = `rgba(${PALETTE.cyan}, ${this.opacity})`;
      context.shadowBlur = 12;
      context.fill();

      context.restore();
    }
  }

  // --- Interactive Stardust Particle ---
  class StardustParticle {
    constructor(x, y, vx, vy, color, size, maxLife) {
      this.x = x;
      this.y = y;
      this.vx = vx || (Math.random() - 0.5) * 1.5;
      this.vy = vy || (Math.random() - 0.5) * 1.5;
      this.size = size || (Math.random() * 2 + 1);
      this.color = color || (Math.random() > 0.5 ? PALETTE.cyan : PALETTE.iceBlue);
      this.life = 0;
      this.maxLife = maxLife || Math.floor(Math.random() * 25 + 30);
      this.opacity = 0.9;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.96;
      this.vy *= 0.96;
      this.life++;
      this.opacity = Math.max(0, 1 - this.life / this.maxLife);
      return this.life <= this.maxLife;
    }

    draw(context) {
      if (this.opacity <= 0.01) return;
      context.save();
      context.beginPath();
      context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      context.fillStyle = `rgba(${this.color}, ${this.opacity * 0.75})`;
      context.shadowColor = `rgba(${PALETTE.cyan}, ${this.opacity * 0.6})`;
      context.shadowBlur = 6;
      context.fill();
      context.restore();
    }
  }

  // Handle pointer interactions
  function onPointerMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.isMoving = true;

    clearTimeout(mouseTimer);
    mouseTimer = setTimeout(() => {
      mouse.isMoving = false;
    }, 120);

    // Spawn 1-2 subtle stardust particles on motion (rate capped)
    if (cursorParticles.length < 50 && Math.random() > 0.3) {
      cursorParticles.push(new StardustParticle(
        mouse.x + (Math.random() - 0.5) * 6,
        mouse.y + (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 1.2,
        (Math.random() - 0.5) * 1.2 + 0.3,
        Math.random() > 0.4 ? PALETTE.cyan : PALETTE.iceBlue,
        Math.random() * 1.8 + 1,
        35
      ));
    }
  }

  function onPointerDown(e) {
    // Mini cosmic starburst on click
    const count = 10;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() * 0.4 - 0.2);
      const speed = Math.random() * 2.8 + 1.2;
      cursorParticles.push(new StardustParticle(
        e.clientX,
        e.clientY,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        i % 2 === 0 ? PALETTE.cyan : PALETTE.white,
        Math.random() * 2 + 1.2,
        45
      ));
    }

    // Chance to spawn a special shooting star originating near click
    if (shootingStars.length < 3) {
      const angle = Math.PI * 0.75 + (Math.random() * 0.2 - 0.1);
      shootingStars.push(new ShootingStar(e.clientX, e.clientY, angle));
    }
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });

  // Handle Visibility change to pause rendering when tab is unfocused
  document.addEventListener('visibilitychange', () => {
    isTabVisible = document.visibilityState === 'visible';
    if (isTabVisible && !animationFrameId) {
      lastSpawnTime = performance.now();
      loop(lastSpawnTime);
    }
  });

  // Main Render Loop
  function loop(currentTime) {
    if (!isTabVisible) {
      animationFrameId = null;
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // 1. Render Background Twinkling Stars
    const timeSec = currentTime * 0.001;
    for (let i = 0; i < backgroundStars.length; i++) {
      const s = backgroundStars[i];
      const pulse = Math.sin(timeSec * 2 + s.twinklePhase) * 0.35 + 0.65;
      const currentAlpha = s.alpha * pulse;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color}, ${currentAlpha})`;
      ctx.fill();
    }

    // 2. Spawn Random Shooting Stars at Organic Intervals
    if (currentTime - lastSpawnTime > nextSpawnDelay) {
      if (shootingStars.length < 3) {
        shootingStars.push(new ShootingStar());
      }
      lastSpawnTime = currentTime;
      nextSpawnDelay = Math.random() * 1800 + 1200; // 1.2s - 3.0s interval
    }

    // 3. Update & Draw Active Shooting Stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const star = shootingStars[i];
      const isAlive = star.update();
      if (isAlive) {
        star.draw(ctx);
      } else {
        shootingStars.splice(i, 1);
      }
    }

    // 4. Update & Draw Interactive Cursor Stardust
    for (let i = cursorParticles.length - 1; i >= 0; i--) {
      const p = cursorParticles[i];
      const isAlive = p.update();
      if (isAlive) {
        p.draw(ctx);
      } else {
        cursorParticles.splice(i, 1);
      }
    }

    animationFrameId = requestAnimationFrame(loop);
  }

  // Handle Resize
  window.addEventListener('resize', resize, { passive: true });
  resize();
  lastSpawnTime = performance.now();
  loop(lastSpawnTime);
})();
