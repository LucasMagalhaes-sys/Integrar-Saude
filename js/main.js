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

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('mobile-open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('mobile-open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('mobile-open');
      }
    });
  }

  // 3. Testimonial Dots Navigation
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

  // 4. Modal Dialogs (Booking & E-book Downloads)
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
