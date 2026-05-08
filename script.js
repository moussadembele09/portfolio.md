/* =============================================
   SCRIPT.JS — Dembele Moussa · Aura Digital
   ============================================= */
(function () {
  'use strict';

  // ── Custom Cursor ──
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(cursor);
  document.body.appendChild(ring);

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });
  // Lagging ring
  function tickRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tickRing);
  }
  tickRing();

  // ── Hero zoom on load ──
  window.addEventListener('load', () => {
    document.querySelector('.hero').classList.add('loaded');
  });

  // ── Navbar condense on scroll ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('condensed', window.scrollY > 80);
  }, { passive: true });

  // ── Mobile nav ──
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );

  // ── Magnetic Buttons ──
  const magneticEls = document.querySelectorAll('.hero-scroll, .btn-about, .nav-links a');
  magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      el.style.transition = 'none';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = `translate(0px, 0px)`;
      el.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
    });
  });

  // ── Fade-up on scroll ──
  const fadeEls = document.querySelectorAll('.fade-up');
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  fadeEls.forEach(el => fadeObs.observe(el));

  // ── Photo Stack — Badge de comptage ──
  document.querySelectorAll('.photo-stack').forEach(stack => {
    const count = stack.querySelectorAll('.eg-item').length;
    stack.setAttribute('data-count', count + ' photo' + (count > 1 ? 's' : '') + ' — Cliquer pour explorer');
  });

  // ── Lightbox (navigation par projet) ──
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lbImg');
  const lbTitle  = document.getElementById('lbTitle');
  const lbSub    = document.getElementById('lbSub');
  const lbClose  = document.getElementById('lbClose');
  const lbPrev   = document.getElementById('lbPrev');
  const lbNext   = document.getElementById('lbNext');

  let stackItems  = [];
  let currentIdx  = 0;

  function showLbItem() {
    const item = stackItems[currentIdx];
    const img  = item.querySelector('img');
    lbImg.src           = img.src;
    lbTitle.textContent = item.dataset.title || '';
    lbSub.textContent   = item.dataset.sub   || '';
  }

  function openLb(stack, index) {
    stackItems = [...stack.querySelectorAll('.eg-item')];
    currentIdx = index;
    showLbItem();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLb() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Chaque photo de la pile ouvre la lightbox en partant de cette photo
  document.querySelectorAll('.photo-stack').forEach(stack => {
    stack.querySelectorAll('.eg-item').forEach((item, i) => {
      item.addEventListener('click', () => openLb(stack, i));
    });
  });

  lbClose.addEventListener('click', closeLb);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });

  lbPrev.addEventListener('click', e => {
    e.stopPropagation();
    currentIdx = (currentIdx - 1 + stackItems.length) % stackItems.length;
    showLbItem();
  });
  lbNext.addEventListener('click', e => {
    e.stopPropagation();
    currentIdx = (currentIdx + 1) % stackItems.length;
    showLbItem();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') lbPrev.click();
    if (e.key === 'ArrowRight') lbNext.click();
  });

  // ── Parallax on hero ──
  const heroBg = document.querySelector('.hero-img');
  window.addEventListener('scroll', () => {
    if (!heroBg) return;
    const y = window.scrollY;
    heroBg.style.transform = `scale(1.04) translateY(${y * 0.25}px)`;
  }, { passive: true });

  // ── Instagram strip — subtle hover scale via JS ──
  // (handled by CSS, nothing extra needed)

})();
