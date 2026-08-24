/* ==========================================================================
   DRA. ANTONIA VALERO - ESTÉTICA AVANÇADA & INTEGRATIVA
   Vanilla JavaScript Application Logic (Includes Floating WhatsApp Widget)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile & Tablet Navigation Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  function closeMobileMenu() {
    if (menuToggle && navLinks) {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('mobile-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-locked');
    }
  }

  function toggleMobileMenu(e) {
    if (e) e.stopPropagation();
    if (menuToggle && navLinks) {
      const isOpen = navLinks.classList.toggle('mobile-open');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('menu-locked', isOpen);
    }
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking any nav link or CTA button inside menu
    document.querySelectorAll('.nav-link, .mobile-nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });

    // Close menu when viewport is resized back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 991) {
        closeMobileMenu();
      }
    });
  }

  // 3. Clinic Images Carousel
  const clinicTrack = document.getElementById('clinicCarouselTrack');
  const clinicPrevBtn = document.getElementById('clinicPrevBtn');
  const clinicNextBtn = document.getElementById('clinicNextBtn');
  const clinicDotsContainer = document.getElementById('clinicCarouselDots');

  if (clinicTrack) {
    const slides = clinicTrack.querySelectorAll('.clinic-slide');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let autoSlideTimer = null;
    let touchStartX = 0;
    let touchEndX = 0;

    function getVisibleSlides() {
      const width = window.innerWidth;
      if (width > 991) return 3;
      if (width > 767) return 2;
      return 1;
    }

    function getMaxIndex() {
      return Math.max(0, totalSlides - getVisibleSlides());
    }

    function createDots() {
      if (!clinicDotsContainer) return;
      clinicDotsContainer.innerHTML = '';
      const maxIdx = getMaxIndex();
      for (let i = 0; i <= maxIdx; i++) {
        const dot = document.createElement('button');
        dot.className = `clinic-dot ${i === currentIndex ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(i);
          resetAutoSlide();
        });
        clinicDotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      if (!clinicDotsContainer) return;
      const dots = clinicDotsContainer.querySelectorAll('.clinic-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }

    function updateCarousel() {
      const visible = getVisibleSlides();
      const maxIdx = getMaxIndex();
      if (currentIndex > maxIdx) {
        currentIndex = maxIdx;
      }
      const percentage = (currentIndex * (100 / visible));
      clinicTrack.style.transform = `translateX(-${percentage}%)`;
      updateDots();
    }

    function goToSlide(index) {
      const maxIdx = getMaxIndex();
      if (index < 0) {
        currentIndex = maxIdx;
      } else if (index > maxIdx) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }
      updateCarousel();
    }

    if (clinicPrevBtn) {
      clinicPrevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        resetAutoSlide();
      });
    }

    if (clinicNextBtn) {
      clinicNextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        resetAutoSlide();
      });
    }

    // Touch Swipe Support
    clinicTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      stopAutoSlide();
    }, { passive: true });

    clinicTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(currentIndex - 1);
        }
      }
      startAutoSlide();
    }, { passive: true });

    // Auto Slide
    function startAutoSlide() {
      stopAutoSlide();
      autoSlideTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 4500);
    }

    function stopAutoSlide() {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    }

    function resetAutoSlide() {
      stopAutoSlide();
      startAutoSlide();
    }

    clinicTrack.parentElement.addEventListener('mouseenter', stopAutoSlide);
    clinicTrack.parentElement.addEventListener('mouseleave', startAutoSlide);

    window.addEventListener('resize', () => {
      createDots();
      updateCarousel();
    });

    // Initialize
    createDots();
    updateCarousel();
    startAutoSlide();
  }

  // 4. Testimonial Dots Navigation
  const dots = document.querySelectorAll('.carousel-dots .dot');
  const testimonials = document.querySelectorAll('.testimonial-card');

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');

      testimonials.forEach((card, idx) => {
        if (idx === index) {
          card.style.borderColor = 'var(--accent-purple)';
          card.style.transform = 'translateY(-4px)';
          card.style.boxShadow = 'var(--shadow-md)';
        } else {
          card.style.borderColor = 'rgba(59, 44, 84, 0.04)';
          card.style.transform = 'translateY(0)';
          card.style.boxShadow = 'none';
        }
      });
    });
  });

  // 5. Modal Dialogs (Booking & E-book Downloads)
  const bookingModal = document.getElementById('bookingModal');
  const ebookModal = document.getElementById('ebookModal');

  document.querySelectorAll('.open-booking-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (bookingModal) bookingModal.classList.add('active');
    });
  });

  document.querySelectorAll('.open-ebook-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const ebookTitle = btn.getAttribute('data-ebook') || 'Alimentos do Coração';
      const targetTitleEl = document.getElementById('modalEbookTitle');
      if (targetTitleEl) targetTitleEl.textContent = ebookTitle;
      if (ebookModal) ebookModal.classList.remove('active');
    });
  });

  document.querySelectorAll('.modal-close, .modal-overlay').forEach(closeEl => {
    closeEl.addEventListener('click', (e) => {
      if (e.target === closeEl || closeEl.classList.contains('modal-close')) {
        if (bookingModal) bookingModal.classList.remove('active');
        if (ebookModal) ebookModal.classList.remove('active');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (bookingModal) bookingModal.classList.remove('active');
      if (ebookModal) ebookModal.classList.remove('active');
      if (waChatBox) waChatBox.classList.remove('active');
    }
  });

  // Form Submissions
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Obrigado! Seu agendamento foi pré-solicitado. Nossa equipe entrará em contato via WhatsApp em poucos minutos para confirmar a data.');
      bookingModal.classList.remove('active');
      bookingForm.reset();
    });
  }

  const ebookForm = document.getElementById('ebookForm');
  if (ebookForm) {
    ebookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Excelente! Enviamos o link do e-book gratuito diretamente para o seu e-mail e WhatsApp.');
      ebookModal.classList.remove('active');
      ebookForm.reset();
    });
  }

  // ==========================================================================
  // 5. FLOATING PERSISTENT WHATSAPP WIDGET LOGIC
  // ==========================================================================
  const waFloatBtn = document.getElementById('waFloatBtn');
  const waChatBox = document.getElementById('waChatBox');
  const waCloseBtn = document.getElementById('waCloseBtn');
  const waBadge = document.getElementById('waBadge');
  const waForm = document.getElementById('waForm');
  const waInput = document.getElementById('waInput');
  const waReplyBtns = document.querySelectorAll('.wa-reply-btn');

  // WhatsApp Phone Number (Dra. Antonia Valero Official)
  const phone = '5511996136647';

  if (waFloatBtn && waChatBox) {
    // Toggle Chat Box
    waFloatBtn.addEventListener('click', () => {
      waChatBox.classList.toggle('active');
      if (waBadge) waBadge.style.display = 'none';
    });

    // Close Chat Box
    if (waCloseBtn) {
      waCloseBtn.addEventListener('click', () => {
        waChatBox.classList.remove('active');
      });
    }

    // Quick Reply Buttons
    waReplyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const msg = btn.getAttribute('data-msg');
        if (msg) {
          sendWhatsAppMessage(msg);
        }
      });
    });

    // Custom Message Form Submit
    if (waForm && waInput) {
      waForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const customText = waInput.value.trim();
        if (customText) {
          sendWhatsAppMessage(customText);
          waInput.value = '';
        }
      });
    }
  }

  function sendWhatsAppMessage(text) {
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    if (waChatBox) waChatBox.classList.remove('active');
  }
});
