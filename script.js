/* Yostina Sherif — Portfolio Interactions */

document.documentElement.classList.add('js-ready');

const ANKH = 'assets/ankh';
const AETHERIA = 'assets/aetheria';

const galleryData = {
  exterior: [
    { src: `${ANKH}/hero-facade.png`, caption: 'Main Facade — Golden Hour' },
    { src: `${ANKH}/exterior-wood-screen.png`, caption: 'Triangular Wood Screen Facade' },
    { src: `${ANKH}/courtyard-walkway.png`, caption: 'Courtyard & Elevated Walkway' },
    { src: `${ANKH}/campus-perspective.png`, caption: 'Campus Perspective' },
    { src: `${ANKH}/building-overview.png`, caption: 'Building Overview' },
    { src: `${ANKH}/exterior-detail.png`, caption: 'Exterior Detail' },
  ],
  interior: [
    { src: `${ANKH}/library-atrium.png`, caption: 'Library — Living Tree Atrium' },
    { src: `${ANKH}/classroom.png`, caption: 'Classroom — Warm Natural Light' },
  ],
  plans: [
    { src: `${ANKH}/plan-master.png`, caption: 'Master Site Plan' },
    { src: `${ANKH}/plan-first-floor.png`, caption: 'First Floor Plan' },
    { src: `${ANKH}/plan-second-floor.png`, caption: 'Second Floor Plan' },
  ],
};

const planImages = {
  master: `${ANKH}/plan-master.png`,
  first: `${ANKH}/plan-first-floor.png`,
  second: `${ANKH}/plan-second-floor.png`,
};

const themeToggle = document.getElementById('themeToggle');
const blueprintToggle = document.getElementById('blueprintToggle');
const galleryMain = document.getElementById('galleryMain');
const galleryCaption = document.getElementById('galleryCaption');
const galleryThumbs = document.getElementById('galleryThumbs');
const ankhGallery = document.getElementById('ankhGallery');
const plansSection = document.getElementById('plansSection');
const planImage = document.getElementById('planImage');
const nav = document.getElementById('nav');
const navBurger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');

let currentView = 'exterior';
let currentPlan = 'master';
let isScrolling = false;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ========== Smooth Scroll ==========
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function smoothScrollTo(targetY, duration = 900) {
  if (prefersReducedMotion) {
    window.scrollTo(0, targetY);
    return;
  }
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();
  isScrolling = true;

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, startY + distance * easeOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
    else isScrolling = false;
  }
  requestAnimationFrame(step);
}

function revealInSection(section) {
  if (!section) return;
  section.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
}

function scrollToSection(el) {
  const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
  revealInSection(el);
  smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - navHeight + 1);
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    scrollToSection(target);
  });
});

if (!prefersReducedMotion) {
  document.documentElement.classList.add('smooth-scroll');
}

// ========== Theme Toggle ==========
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.checked = theme === 'night';
  localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) setTheme(savedTheme);

themeToggle.addEventListener('change', () => {
  setTheme(themeToggle.checked ? 'night' : 'day');
});

// ========== Mobile Menu ==========
navBurger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  navBurger.setAttribute('aria-expanded', open);
  mobileMenu.setAttribute('aria-hidden', !open);
  document.body.style.overflow = open ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    navBurger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ========== Nav Scroll ==========
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 40;
  nav.classList.toggle('scrolled', scrolled);
  document.documentElement.style.setProperty('--nav-height', scrolled ? '60px' : '72px');
}, { passive: true });

// ========== Reveal on Scroll ==========
function initReveals() {
  const revealEls = document.querySelectorAll('.reveal:not(.visible)');

  revealEls.forEach((el) => {
    const parent = el.closest('.hero-content, .intro-layout, .intro-content, .edu-grid, .tools-showcase, .school-bridge, .work-bridge-inner, .project-header, .project-intro, .gallery, .feature-grid, .aetheria-gallery, .aetheria-card, .contact-grid');
    if (parent) {
      const siblings = [...parent.querySelectorAll('.reveal')];
      el.style.setProperty('--reveal-delay', `${siblings.indexOf(el) * 100}ms`);
    }
  });

  const heroReveals = document.querySelectorAll('.hero .reveal');
  heroReveals.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 400 + i * 120);
  });

  const nonHeroReveals = [...document.querySelectorAll('.reveal')].filter((el) => !el.closest('.hero'));

  if (prefersReducedMotion) {
    nonHeroReveals.forEach((el) => el.classList.add('visible'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });

  nonHeroReveals.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      el.classList.add('visible');
    } else {
      revealObserver.observe(el);
    }
  });
}

initReveals();

// ========== Gallery helpers ==========
function swapImage(imgEl, captionEl, item) {
  imgEl.classList.add('is-fading');
  setTimeout(() => {
    imgEl.src = item.src;
    imgEl.alt = item.caption;
    if (captionEl) captionEl.textContent = item.caption;
    imgEl.classList.remove('is-fading');
  }, 400);
}

function buildThumbs(container, items, onSelect) {
  container.innerHTML = '';
  items.forEach((item, i) => {
    const thumb = document.createElement('button');
    thumb.className = `thumb${i === 0 ? ' active' : ''}`;
    thumb.innerHTML = `<img src="${item.src}" alt="${item.caption}" loading="lazy" />`;
    thumb.addEventListener('click', () => onSelect(i, items));
    container.appendChild(thumb);
  });
}

// ========== Aetheria Gallery ==========
const aetheriaGalleryData = [
  { src: `${AETHERIA}/waterfront-perspective.png`, caption: 'Aetheria — Waterfront Perspective' },
  { src: `${AETHERIA}/facade-signage.jpg`, caption: 'Aetheria — Facade Signage' },
  { src: `${AETHERIA}/curved-facade-pool.jpg`, caption: 'Aetheria — Curved Facade & Pool' },
  { src: `${AETHERIA}/front-elevation.jpg`, caption: 'Aetheria — Front Elevation' },
  { src: `${AETHERIA}/building-section.png`, caption: 'Aetheria — Building Section' },
  { src: `${AETHERIA}/master-plan.png`, caption: 'Aetheria — Master Plan' },
  { src: `${AETHERIA}/pool-terrace.jpg`, caption: 'Aetheria — Pool Terrace View' },
];

const aetheriaMain = document.getElementById('aetheriaMain');
const aetheriaCaption = document.getElementById('aetheriaCaption');
const aetheriaThumbs = document.getElementById('aetheriaThumbs');

function initAetheriaGallery() {
  if (!aetheriaThumbs || aetheriaThumbs.dataset.ready) return;
  aetheriaThumbs.dataset.ready = 'true';

  const selectAetheria = (index, items) => {
    aetheriaThumbs.querySelectorAll('.thumb').forEach((t, i) => t.classList.toggle('active', i === index));
    swapImage(aetheriaMain, aetheriaCaption, items[index]);
  };

  if (aetheriaThumbs.querySelector('.thumb')) {
    aetheriaThumbs.querySelectorAll('.thumb').forEach((thumb, i) => {
      thumb.addEventListener('click', () => selectAetheria(i, aetheriaGalleryData));
    });
    return;
  }

  buildThumbs(aetheriaThumbs, aetheriaGalleryData, selectAetheria);
}

// ========== Panel crossfade ==========
function crossfadePanels(hideEl, showEl, onShown) {
  if (hideEl && !hideEl.classList.contains('is-hidden')) {
    hideEl.style.opacity = '0';
    hideEl.style.transform = 'translateY(8px)';
    setTimeout(() => {
      hideEl.classList.add('is-hidden');
      hideEl.style.opacity = '';
      hideEl.style.transform = '';
    }, 400);
  }
  if (showEl) {
    showEl.classList.remove('is-hidden');
    showEl.classList.add('is-entering');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        showEl.classList.remove('is-entering');
        if (onShown) onShown();
      });
    });
  }
}

// ========== Ankh Gallery ==========
const viewBtns = document.querySelectorAll('.view-btn');

function renderGallery(view, initial = false) {
  currentView = view;
  const items = galleryData[view];

  if (view === 'plans') {
    if (initial) {
      ankhGallery.classList.add('is-hidden');
      plansSection.classList.remove('is-hidden');
      updatePlanImage();
      return;
    }
    crossfadePanels(ankhGallery, plansSection, updatePlanImage);
    return;
  }

  if (initial) {
    plansSection.classList.add('is-hidden');
    ankhGallery.classList.remove('is-hidden');
    buildThumbs(galleryThumbs, items, (index, list) => {
      galleryThumbs.querySelectorAll('.thumb').forEach((t, i) => t.classList.toggle('active', i === index));
      swapImage(galleryMain, galleryCaption, list[index]);
    });
    return;
  }

  const showGallery = () => {
    swapImage(galleryMain, galleryCaption, items[0]);
    buildThumbs(galleryThumbs, items, (index, list) => {
      galleryThumbs.querySelectorAll('.thumb').forEach((t, i) => t.classList.toggle('active', i === index));
      swapImage(galleryMain, galleryCaption, list[index]);
    });
  };

  if (!plansSection.classList.contains('is-hidden')) {
    crossfadePanels(plansSection, ankhGallery, showGallery);
  } else {
    showGallery();
  }
}

viewBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.view === currentView) return;
    viewBtns.forEach(b => b.classList.toggle('active', b === btn));
    renderGallery(btn.dataset.view);
  });
});

// ========== Floor Plans ==========
const planTabs = document.querySelectorAll('.plan-tab');
const planViewer = document.querySelector('.plan-viewer');

function updatePlanImage() {
  planImage.style.opacity = '0';
  planImage.style.transform = 'scale(0.99)';
  setTimeout(() => {
    planImage.src = planImages[currentPlan];
    planImage.alt = `${currentPlan} floor plan`;
    planImage.style.opacity = '1';
    planImage.style.transform = 'scale(1)';
  }, 350);
}

planTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    if (tab.dataset.plan === currentPlan) return;
    currentPlan = tab.dataset.plan;
    planTabs.forEach(t => {
      t.classList.toggle('active', t === tab);
      t.setAttribute('aria-selected', t === tab);
    });
    updatePlanImage();
  });
});

blueprintToggle.addEventListener('change', () => {
  planViewer.classList.toggle('blueprint', blueprintToggle.checked);
});

let ankhGalleryReady = false;

function initAnkhGallery() {
  if (ankhGalleryReady) return;
  ankhGalleryReady = true;
  renderGallery('exterior', true);
}

const ankhSection = document.getElementById('ankh');
const aetheriaSection = document.getElementById('aetheria');

initAetheriaGallery();

const galleryLazyObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    if (entry.target === ankhSection) initAnkhGallery();
    galleryLazyObserver.unobserve(entry.target);
  });
}, { rootMargin: '300px 0px' });

if (ankhSection) galleryLazyObserver.observe(ankhSection);

if (window.location.hash) {
  const hashTarget = document.querySelector(window.location.hash);
  if (hashTarget) revealInSection(hashTarget);
}

// ========== Nav active links ==========
const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
const timelineScenes = document.querySelectorAll('.timeline-scene, .hero');

window.addEventListener('scroll', () => {
  if (isScrolling) return;
  let current = 'hero';
  const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;

  timelineScenes.forEach(section => {
    const top = section.offsetTop - navHeight - 20;
    if (window.scrollY >= top) current = section.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}, { passive: true });
