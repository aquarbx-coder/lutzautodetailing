// ============================================
// LUTZ AUTO DETAILING — Main JavaScript
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

        // Add click handlers to mobile nav links
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

  // ---------- Sticky Header Shadow ----------
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
    } else {
      header.style.boxShadow = 'none';
    }
  });

  // ---------- FAQ Accordion ----------
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all
        faqItems.forEach(i => i.classList.remove('active'));
        // Open clicked (if it wasn't already open)
        if (!isActive) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        } else {
          question.setAttribute('aria-expanded', 'false');
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
      // Smooth scroll to top of form
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

        // Collect form data
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

        // Show success message
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sent! We\'ll be in touch soon.';
        btn.style.background = '#28a745';
        btn.style.borderColor = '#28a745';
        btn.disabled = true;

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.disabled = false;
          form.reset();
          // Clear selected states
          document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
        }, 4000);

        // -------------------------------------------------------
        // INTEGRATION NOTE:
        // Replace the above with your actual form handler.
        // Options:
        //   1. Formspree (free tier): action="https://formspree.io/f/YOUR_ID"
        //   2. Netlify Forms: add netlify attribute to <form>
        //   3. EmailJS: client-side email sending
        //   4. Your own backend API endpoint
        // -------------------------------------------------------
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

});
