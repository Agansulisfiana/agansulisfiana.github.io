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
        color: 0x38bdf8,
        backgroundColor: 0x090913,
        points: 12.00,
        maxDistance: 22.00,
        spacing: 18.00
      });
    }

    const title = document.getElementById('typing-title');
    const role = 'IT Support Engineer';
    let charIndex = 0;

    function typeRole() {
      title.textContent = role.slice(0, charIndex);

      if (charIndex <= role.length) {
        charIndex += 1;
        setTimeout(typeRole, 75);
      }
    }

    setTimeout(typeRole, 1150);

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

    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 500);

      document.querySelectorAll('section[id]').forEach(section => {
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-menu a[href="#${id}"]`);

        if (!link) return;

        const top = section.offsetTop - 130;
        const bottom = top + section.offsetHeight;

        link.classList.toggle('active', window.scrollY >= top && window.scrollY < bottom);
      });
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
