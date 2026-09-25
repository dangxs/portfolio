const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const currentYear = document.querySelector('#current-year');
const themeToggle = document.querySelector('.theme-toggle');
const typedText = document.querySelector('.typed-text');
const scrollProgress = document.querySelector('.scroll-progress');
const revealElements = document.querySelectorAll('.reveal');
const sections = document.querySelectorAll('main section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
const phrases = [
  'PHP, Joomla e sistemas web.',
  'JavaScript, HTML, CSS e interfaces responsivas.',
  'MySQL e banco de dados.',
  'projetos corporativos e manutenção.'
];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const backToTop = document.querySelector('.back-to-top');

let phraseIndex = 0;
let letterIndex = 0;
let isDeleting = false;

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;

  if (themeToggle) {
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Ativar tema claro' : 'Ativar tema escuro');
  }
}

setTheme(initialTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.dataset.theme;
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

    localStorage.setItem('theme', nextTheme);
    setTheme(nextTheme);
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      navLinks.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function typeLoop() {
  if (!typedText) {
    return;
  }

  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    letterIndex -= 1;
  } else {
    letterIndex += 1;
  }

  typedText.textContent = currentPhrase.slice(0, letterIndex);

  if (!isDeleting && letterIndex === currentPhrase.length) {
    isDeleting = true;
    setTimeout(typeLoop, 1200);
    return;
  }

  if (isDeleting && letterIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }

  setTimeout(typeLoop, isDeleting ? 45 : 85);
}

if (prefersReducedMotion) {
  if (typedText) {
    typedText.textContent = phrases[0];
  }
} else {
  typeLoop();
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.18 });

revealElements.forEach((element) => revealObserver.observe(element));

function updateScrollProgress() {
  if (!scrollProgress) {
    return;
  }

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
}

function updateActiveNav() {
  let currentSection = sections[0];
  const isNearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;

  if (isNearBottom) {
    currentSection = sections[sections.length - 1];
  }

  if (!isNearBottom) {
    sections.forEach((section) => {
      if (section.offsetTop - 120 <= window.scrollY) {
        currentSection = section;
      }
    });
  }

  navItems.forEach((item) => {
    item.classList.toggle('is-active', item.getAttribute('href') === `#${currentSection.id}`);
  });
}

function updateBackToTop() {
  if (!backToTop) {
    return;
  }

  backToTop.classList.toggle('is-visible', window.scrollY > 480);
}

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

window.addEventListener('scroll', () => {
  updateScrollProgress();
  updateActiveNav();
  updateBackToTop();
});

updateScrollProgress();
updateActiveNav();
updateBackToTop();
