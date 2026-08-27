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

  // 3. Clinic Images Carousel & Interactive Lightbox Gallery
  const clinicTrack = document.getElementById('clinicCarouselTrack');
  const clinicPrevBtn = document.getElementById('clinicPrevBtn');
  const clinicNextBtn = document.getElementById('clinicNextBtn');
  const clinicDotsContainer = document.getElementById('clinicCarouselDots');

  // Lightbox Elements
  const clinicLightbox = document.getElementById('clinicLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxCounter = document.getElementById('lightboxCounter');

  const galleryImages = [
    'images/clinica-1.jpg',
    'images/clinica-2.jpg',
    'images/clinica-3.jpg',
    'images/clinica-4.jpg',
    'images/clinica-5.jpg',
    'images/clinica-6.jpg'
  ];

  let currentLightboxIndex = 0;

  function openLightbox(index) {
    if (!clinicLightbox || !lightboxImg) return;
    currentLightboxIndex = (index + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentLightboxIndex];
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${galleryImages.length}`;
    }
    clinicLightbox.classList.add('active');
    document.body.classList.add('menu-locked');
    stopAutoSlide();
  }

  function closeLightbox() {
    if (!clinicLightbox) return;
    clinicLightbox.classList.remove('active');
    document.body.classList.remove('menu-locked');
    startAutoSlide();
  }

  function nextLightbox() {
    openLightbox(currentLightboxIndex + 1);
  }

  function prevLightbox() {
    openLightbox(currentLightboxIndex - 1);
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', nextLightbox);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', prevLightbox);

  // Attach Lightbox Triggers
  document.querySelectorAll('.gallery-lightbox-trigger').forEach((trigger, idx) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const index = parseInt(trigger.getAttribute('data-index') || idx, 10);
      openLightbox(index);
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const index = parseInt(trigger.getAttribute('data-index') || idx, 10);
        openLightbox(index);
      }
    });
  });

  // Carousel Slider Logic
  let autoSlideTimer = null;

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

  let currentIndex = 0;

  function goToSlide(index) {
    if (!clinicTrack) return;
    const slides = clinicTrack.querySelectorAll('.clinic-slide');
    const totalSlides = slides.length;
    const width = window.innerWidth;
    const visible = width > 991 ? 3 : (width > 767 ? 2 : 1);
    const maxIdx = Math.max(0, totalSlides - visible);

    if (index < 0) {
      currentIndex = maxIdx;
    } else if (index > maxIdx) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    const percentage = (currentIndex * (100 / visible));
    clinicTrack.style.transform = `translateX(-${percentage}%)`;

    if (clinicDotsContainer) {
      const dots = clinicDotsContainer.querySelectorAll('.clinic-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }
  }

  if (clinicTrack) {
    const slides = clinicTrack.querySelectorAll('.clinic-slide');
    const totalSlides = slides.length;
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

    // Touch Swipe on Carousel Track
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

    // Hover Interaction: Pause auto-slide on hover
    clinicTrack.parentElement.addEventListener('mouseenter', stopAutoSlide);
    clinicTrack.parentElement.addEventListener('mouseleave', startAutoSlide);

    window.addEventListener('resize', () => {
      createDots();
      goToSlide(currentIndex);
    });

    createDots();
    goToSlide(0);
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
      if (clinicLightbox && clinicLightbox.classList.contains('active')) closeLightbox();
      if (bookingModal) bookingModal.classList.remove('active');
      if (ebookModal) ebookModal.classList.remove('active');
      if (waChatBox) waChatBox.classList.remove('active');
    } else if (clinicLightbox && clinicLightbox.classList.contains('active')) {
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    }
  });

  // Form Submissions
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = bookingForm.querySelector('input[type="text"]');
      const phoneInput = bookingForm.querySelector('input[type="tel"]');
      const procedureSelect = bookingForm.querySelector('select');

      const name = nameInput ? nameInput.value.trim() : '';
      const userPhone = phoneInput ? phoneInput.value.trim() : '';
      const procedure = procedureSelect && procedureSelect.selectedIndex >= 0
        ? procedureSelect.options[procedureSelect.selectedIndex].text
        : '';

      const message = `Olá! Me chamo *${name}* e gostaria de agendar uma avaliação. Procedimento de interesse: *${procedure}*. Meu telefone: ${userPhone}.`;
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      if (bookingModal) {
        bookingModal.classList.remove('active');
      }
      bookingForm.reset();
    });
  }

  const ebookForm = document.getElementById('ebookForm');
  if (ebookForm) {
    ebookForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = ebookForm.querySelector('input[type="text"]');
      const emailInput = ebookForm.querySelector('input[type="email"]');
      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';

      const ebookTitleEl = document.getElementById('modalEbookTitle');
      const ebookTitle = ebookTitleEl ? ebookTitleEl.textContent.trim() : '';

      const message = `Olá, acabei de me cadastrar para receber o e-book *${ebookTitle}*.`;
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      if (ebookModal) {
        ebookModal.classList.remove('active');
      }
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
