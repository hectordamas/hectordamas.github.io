const yearEl = document.querySelector('#current-year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const navLinks = Array.from(document.querySelectorAll('.topbar nav a[href^="#"]'));
const navTargets = navLinks
  .map((link) => {
    const href = link.getAttribute('href');
    if (!href) {
      return null;
    }
    const section = document.querySelector(href);
    return section ? { link, section } : null;
  })
  .filter(Boolean);

const setCurrentNavLink = (activeLink) => {
  navLinks.forEach((link) => {
    const isCurrent = Boolean(activeLink) && link === activeLink;
    link.classList.toggle('is-current', isCurrent);
    if (isCurrent) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

if (navTargets.length > 0) {
  const updateCurrentSectionByScroll = () => {
    const scrollY = window.scrollY;
    const activationOffset = 140;
    let current = null;

    navTargets.forEach((item) => {
      const sectionTop = item.section.offsetTop;
      if (scrollY + activationOffset >= sectionTop) {
        current = item;
      }
    });

    setCurrentNavLink(current ? current.link : null);
  };

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      setCurrentNavLink(link);
    });
  });

  window.addEventListener('scroll', updateCurrentSectionByScroll, { passive: true });
  window.addEventListener('resize', updateCurrentSectionByScroll);
  updateCurrentSectionByScroll();
}

const chips = Array.from(document.querySelectorAll('.chip'));
const cards = Array.from(document.querySelectorAll('.project-card'));

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;

    chips.forEach((item) => item.classList.remove('is-active'));
    chip.classList.add('is-active');

    cards.forEach((card) => {
      const category = card.dataset.category;
      const visible = filter === 'todos' || filter === category;
      card.hidden = !visible;
    });
  });
});

const certChips = Array.from(document.querySelectorAll('.cert-chip'));
const certCards = Array.from(document.querySelectorAll('.cert-card'));

certChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const filter = chip.dataset.certFilter;

    certChips.forEach((item) => item.classList.remove('is-active'));
    chip.classList.add('is-active');

    certCards.forEach((card) => {
      const category = card.dataset.certGroup;
      const visible = filter === 'todos' || filter === category;
      card.hidden = !visible;
    });
  });
});

const animatedBlocks = document.querySelectorAll('.section, .hero-copy, .hero-photo, .project-card, .contact-card, .columns article, .experience-card');
animatedBlocks.forEach((block) => {
  block.setAttribute('data-animate', '');
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

animatedBlocks.forEach((block) => observer.observe(block));

const counters = Array.from(document.querySelectorAll('.count-value'));

if (counters.length > 0) {
  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const el = entry.target;
        const target = Number(el.dataset.count || 0);
        const duration = 900;
        const startTime = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const value = Math.floor(progress * target);
          el.textContent = String(value);

          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = String(target);
          }
        };

        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    },
    { threshold: 0.35 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

const contactForm = document.querySelector('#contact-form');
const formNote = document.querySelector('#form-note');
const whatsappNumber = '584241930033';

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const nombre = String(formData.get('nombre') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const telefono = String(formData.get('telefono') || '').trim();
    const asunto = String(formData.get('asunto') || '').trim();
    const mensaje = String(formData.get('mensaje') || '').trim();

    if (!nombre || !email || !telefono || !asunto || !mensaje) {
      if (formNote) {
        formNote.textContent = 'Por favor, completa todos los campos antes de continuar.';
      }
      return;
    }

    const text = [
      'Hola Hector, te contacto desde tu portfolio.',
      '',
      `Nombre: ${nombre}`,
      `Correo: ${email}`,
      `Telefono: ${telefono}`,
      `Asunto: ${asunto}`,
      'Mensaje:',
      mensaje,
    ].join('\n');

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');

    if (formNote) {
      formNote.textContent = 'Perfecto, se abrio WhatsApp con tu mensaje listo para enviar.';
    }
  });
}
