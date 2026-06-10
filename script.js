/* Yostina Sherif — Portfolio Interactions */

const galleryData = {
  exterior: [
    { src: 'Image1_000.png', caption: 'Main Facade — Golden Hour' },
    { src: 'Image7_000.png', caption: 'Triangular Wood Screen Facade' },
    { src: 'Image8_000.png', caption: 'Courtyard & Elevated Walkway' },
    { src: 'immmm.png', caption: 'Campus Perspective' },
    { src: 'Image3.png', caption: 'Building Overview' },
    { src: 'Image7.png', caption: 'Exterior Detail' },
  ],
  interior: [
    { src: 'Image13_000.png', caption: 'Library — Living Tree Atrium' },
    { src: 'Image14_000.png', caption: 'Classroom — Warm Natural Light' },
  ],
  plans: [
    { src: 'school of restoration master plan.png', caption: 'Master Site Plan' },
    { src: 'First Floor plan.png', caption: 'First Floor Plan' },
    { src: 'second floor.png', caption: 'Second Floor Plan' },
  ],
};

const planImages = {
  master: 'school of restoration master plan.png',
  first: 'First Floor plan.png',
  second: 'second floor.png',
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
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeOutCubic(progress));
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      isScrolling = false;
    }
  }

  requestAnimationFrame(step);
}

function scrollToSection(el) {
  const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
  const top = el.getBoundingClientRect().top + window.scrollY - navHeight + 1;
  smoothScrollTo(top);
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

  revealEls.forEach((el, i) => {
    const parent = el.closest('.hero-content, .intro-layout, .intro-content, .edu-grid, .hero-actions, .tools-showcase, .school-bridge, .work-bridge-inner');
    const siblings = parent ? [...parent.querySelectorAll('.reveal')] : [el];
    const index = siblings.indexOf(el);
    el.style.setProperty('--reveal-delay', `${index * 100}ms`);
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // Hero reveals on load
  const heroReveals = document.querySelectorAll('.hero .reveal');
  heroReveals.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 120);
  });
}

initReveals();

// ========== Aetheria Gallery ==========
const aetheriaMain = document.getElementById('aetheriaMain');
const aetheriaCaption = document.getElementById('aetheriaCaption');
const aetheriaThumbs = document.querySelectorAll('.aetheria-thumbs .thumb');

aetheriaThumbs.forEach(thumb => {
  thumb.addEventListener('click', () => {
    if (thumb.classList.contains('active')) return;
    aetheriaThumbs.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    aetheriaMain.classList.add('is-fading');
    setTimeout(() => {
      aetheriaMain.src = thumb.dataset.src;
      aetheriaMain.alt = thumb.dataset.caption;
      aetheriaCaption.textContent = thumb.dataset.caption;
      aetheriaMain.classList.remove('is-fading');
    }, 400);
  });
});

// ========== Panel crossfade helper ==========
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

// ========== Gallery ==========
const viewBtns = document.querySelectorAll('.view-btn');

function swapGalleryImage(item) {
  galleryMain.classList.add('is-fading');
  setTimeout(() => {
    galleryMain.src = item.src;
    galleryMain.alt = item.caption;
    galleryCaption.textContent = item.caption;
    galleryMain.classList.remove('is-fading');
  }, 400);
}

function buildThumbs(items) {
  galleryThumbs.innerHTML = '';
  items.forEach((item, i) => {
    const thumb = document.createElement('button');
    thumb.className = `thumb${i === 0 ? ' active' : ''}`;
    thumb.innerHTML = `<img src="${item.src}" alt="${item.caption}" loading="lazy" />`;
    thumb.addEventListener('click', () => selectThumb(i, items));
    galleryThumbs.appendChild(thumb);
  });
}

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
    buildThumbs(items);
    return;
  }

  if (!plansSection.classList.contains('is-hidden')) {
    crossfadePanels(plansSection, ankhGallery, () => {
      swapGalleryImage(items[0]);
      buildThumbs(items);
    });
  } else {
    swapGalleryImage(items[0]);
    buildThumbs(items);
  }
}

function selectThumb(index, items) {
  galleryThumbs.querySelectorAll('.thumb').forEach((t, i) => {
    t.classList.toggle('active', i === index);
  });
  swapGalleryImage(items[index]);
}

viewBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.view === currentView) return;
    viewBtns.forEach(b => b.classList.toggle('active', b === btn));
    renderGallery(btn.dataset.view);
  });
});

// ========== Floor Plan Switcher ==========
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

// ========== Init ==========
renderGallery('exterior', true);

// Active nav highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

window.addEventListener('scroll', () => {
  if (isScrolling) return;
  let current = 'hero';
  const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;

  sections.forEach(section => {
    const top = section.offsetTop - navHeight - 20;
    if (window.scrollY >= top) current = section.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}, { passive: true });
