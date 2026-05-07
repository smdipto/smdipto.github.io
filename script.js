// ── Navbar scroll effect ──
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20));

// ── Mobile menu ──
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navMenu.classList.toggle('open');
});
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('open');
  });
});

// ── Scroll-triggered fade-in ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── Publication filter ──
const filterBtns = document.querySelectorAll('.pub-filter-btn');
const pubItems = document.querySelectorAll('.pub-item');
const pubCount = document.getElementById('pubCount');

function updateCount() {
  const visible = document.querySelectorAll('.pub-item:not(.hidden)').length;
  pubCount.textContent = `Showing ${visible} of ${pubItems.length} publications`;
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    pubItems.forEach(item => {
      if (filter === 'all' || item.dataset.type === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
    updateCount();
  });
});
updateCount();

// ── Gallery filter ──
const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

galleryFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    galleryFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.event === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ── Lightbox ──
let currentLightbox = 0;
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxEvent = document.getElementById('lightboxEvent');

function getVisibleItems() {
  return [...document.querySelectorAll('.gallery-item:not(.hidden)')];
}

function openLightbox(index) {
  const items = getVisibleItems();
  if (index < 0 || index >= items.length) return;
  currentLightbox = index;
  const item = items[index];
  const img = item.querySelector('img');
  const title = item.querySelector('.gallery-overlay h4');
  const event = item.querySelector('.gallery-overlay span');

  if (img) {
    lightboxImg.src = img.src;
    lightboxImg.style.display = 'block';
  } else {
    lightboxImg.style.display = 'none';
  }
  lightboxTitle.textContent = title ? title.textContent : '';
  lightboxEvent.textContent = event ? event.textContent : '';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function navLightbox(dir) {
  const items = getVisibleItems();
  currentLightbox = (currentLightbox + dir + items.length) % items.length;
  openLightbox(currentLightbox);
}

// Close on backdrop click
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navLightbox(-1);
  if (e.key === 'ArrowRight') navLightbox(1);
});
