// ============================================
// LUTZ AUTO DETAILING — Main JavaScript
// Premium interactions & animations
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Mobile Navigation ----------
  const hamburger = document.getElementById('hamburger');
  const header = document.querySelector('.header');
  let mobileNav = document.querySelector('.mobile-nav');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (!mobileNav) {
        mobileNav = document.createElement('div');
        mobileNav.className = 'mobile-nav';
        const nav = document.querySelector('.nav');
        const actions = document.querySelector('.header__actions');
        if (nav) mobileNav.appendChild(nav.cloneNode(true));
        if (actions) mobileNav.appendChild(actions.cloneNode(true));
        header.after(mobileNav);

        mobileNav.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            hamburger.classList.remove('active');
          });
        });
      }

      mobileNav.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }

  // ---------- Header Scroll Effect ----------
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  });

  // ---------- Scroll Reveal Animations ----------
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------- Animated Counters ----------
  const counters = document.querySelectorAll('[data-count]');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        counter.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  // Trigger counters when hero stats are visible
  const statsSection = document.querySelector('.hero__stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }

  // ---------- FAQ Accordion ----------
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => {
          i.classList.remove('active');
          i.querySelector('.faq__question')?.setAttribute('aria-expanded', 'false');
        });
        if (!isActive) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // ---------- Package Selection (Booking Page) ----------
  const packageOptions = document.querySelectorAll('.package-option');
  packageOptions.forEach(option => {
    option.addEventListener('click', () => {
      packageOptions.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      const radio = option.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Pre-select package from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const preselectedPackage = urlParams.get('package');
  if (preselectedPackage) {
    const target = document.querySelector(`.package-option[data-value="${preselectedPackage}"]`);
    if (target) {
      target.click();
      setTimeout(() => {
        document.querySelector('.booking-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  // ---------- Vehicle Type Selection ----------
  const vehicleOptions = document.querySelectorAll('.vehicle-option');
  vehicleOptions.forEach(option => {
    option.addEventListener('click', () => {
      vehicleOptions.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      const radio = option.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // ---------- Set Min Date to Today ----------
  const dateInput = document.getElementById('preferredDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // ---------- Form Submissions ----------
  const forms = ['bookingForm', 'quoteForm', 'contactForm'];
  forms.forEach(formId => {
    const form = document.getElementById(formId);
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
          if (data[key]) {
            if (Array.isArray(data[key])) {
              data[key].push(value);
            } else {
              data[key] = [data[key], value];
            }
          } else {
            data[key] = value;
          }
        });

        console.log(`${formId} submitted:`, data);

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sent! We\'ll be in touch soon.';
        btn.style.background = '#10b981';
        btn.style.borderColor = '#10b981';
        btn.disabled = true;

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.disabled = false;
          form.reset();
          document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
        }, 4000);
      });
    }
  });

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ---------- Parallax on Floating Orbs ----------
  const orbs = document.querySelectorAll('.hero__floating-orb');
  if (orbs.length > 0 && window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 15;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });
  }

});
