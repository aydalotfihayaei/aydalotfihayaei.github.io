(() => {
  'use strict';

  const root = document.documentElement;
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-site-nav]');
  const backToTop = document.querySelector('[data-back-to-top]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileQuery = window.matchMedia('(max-width: 820px)');
  const searchModal = document.querySelector('[data-search-modal]');
  const searchOpen = document.querySelector('[data-search-open]');
  const searchCloseButtons = [...document.querySelectorAll('[data-search-close]')];
  const searchInput = document.querySelector('[data-search-input]');
  const searchResults = document.querySelector('[data-search-results]');
  let searchReturnFocus = null;

  const searchIndex = [
    { title: 'Home', url: '/', terms: 'Ayda Lotfi Hayaei integrated photonics photonic sensors computational design PhD' },
    { title: 'Research', url: '/research/', terms: 'research interests photonic crystals waveguides sensors spectroscopy inverse design ML MEMS fabrication aware' },
    { title: 'Projects', url: '/projects/', terms: 'projects computational photonics reproducible open source Lumerical Python' },
    { title: 'SOI Add-Drop Microring Resonator', url: '/projects/soi-microring/', terms: 'SOI silicon microring resonator R 10 um gap 200 nm FSR Q extinction Lumerical varFDTD MODE Python' },
    { title: 'Publications', url: '/publications/', terms: 'publication Optical Quantum Electronics polymer photonic crystal pressure sensor DOI 10.1007 s11082 024 06337 3' },
    { title: 'CV', url: '/cv/', terms: 'curriculum vitae education Electrical Engineering Micro and Nano Electronic Devices Optics Laser Engineering Optoelectronics skills certifications' },
    { title: 'Contact', url: '/contact/', terms: 'email ORCID Google Scholar GitHub contact academic profiles' }
  ];

  function getTheme() {
    return root.dataset.theme === 'dark' ? 'dark' : 'light';
  }

  function setTheme(theme, persist = true) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    if (persist) {
      try { localStorage.setItem('ayda-theme', theme); } catch (_) {}
    }
    if (themeToggle) {
      const next = theme === 'dark' ? 'light' : 'dark';
      themeToggle.setAttribute('aria-label', `Switch to ${next} theme`);
      themeToggle.setAttribute('title', `Switch to ${next} theme`);
    }
  }

  setTheme(getTheme(), false);

  function renderSearchResults(query = '') {
    if (!searchResults) return;
    const normalized = query.trim().toLowerCase();
    const words = normalized.split(/\s+/).filter(Boolean);
    const matches = searchIndex.filter((item) => {
      if (!words.length) return true;
      const haystack = `${item.title} ${item.terms}`.toLowerCase();
      return words.every((word) => haystack.includes(word));
    });
    searchResults.textContent = '';
    if (!matches.length) {
      const empty = document.createElement('p');
      empty.className = 'site-search__empty';
      empty.textContent = 'No matching page or topic found.';
      searchResults.append(empty);
      return;
    }
    matches.slice(0, 7).forEach((item) => {
      const link = document.createElement('a');
      link.className = 'site-search__result';
      link.href = item.url;
      const strong = document.createElement('strong');
      strong.textContent = item.title;
      const description = document.createElement('span');
      description.textContent = item.terms;
      link.append(strong, description);
      searchResults.append(link);
    });
  }

  function openSearch() {
    if (!searchModal) return;
    searchReturnFocus = document.activeElement;
    searchModal.hidden = false;
    document.body.classList.add('search-open');
    renderSearchResults('');
    requestAnimationFrame(() => searchInput?.focus());
  }

  function closeSearch() {
    if (!searchModal || searchModal.hidden) return;
    searchModal.hidden = true;
    document.body.classList.remove('search-open');
    searchInput && (searchInput.value = '');
    if (searchReturnFocus && typeof searchReturnFocus.focus === 'function') searchReturnFocus.focus();
  }

  searchOpen?.addEventListener('click', openSearch);
  searchCloseButtons.forEach((button) => button.addEventListener('click', closeSearch));
  searchInput?.addEventListener('input', (event) => renderSearchResults(event.target.value));

  themeToggle?.addEventListener('click', () => {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });

  function closeNav({ returnFocus = false } = {}) {
    if (!nav || !navToggle) return;
    nav.dataset.open = 'false';
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
    document.body.classList.remove('nav-open');
    if (returnFocus) navToggle.focus();
  }

  function openNav() {
    if (!nav || !navToggle) return;
    nav.dataset.open = 'true';
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close navigation');
    document.body.classList.add('nav-open');
  }

  navToggle?.addEventListener('click', () => {
    navToggle.getAttribute('aria-expanded') === 'true' ? closeNav() : openNav();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (searchModal && !searchModal.hidden) {
      closeSearch();
      return;
    }
    if (navToggle?.getAttribute('aria-expanded') === 'true') {
      closeNav({ returnFocus: true });
    }
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileQuery.matches) closeNav();
    });
  });

  mobileQuery.addEventListener?.('change', (event) => {
    if (!event.matches) closeNav();
  });

  function updateBackToTop() {
    if (!backToTop) return;
    const show = window.scrollY > Math.max(320, Math.min(520, window.innerHeight * 0.55));
    backToTop.classList.toggle('is-visible', show);
    backToTop.setAttribute('aria-hidden', show ? 'false' : 'true');
    backToTop.tabIndex = show ? 0 : -1;
  }

  updateBackToTop();
  window.addEventListener('scroll', updateBackToTop, { passive: true });

  if (!reduceMotion.matches && 'IntersectionObserver' in window) {
    const items = [...document.querySelectorAll('[data-reveal]')];
    items.forEach((item) => item.classList.add('reveal-ready'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach((item) => observer.observe(item));
  } else {
    document.querySelectorAll('[data-reveal]').forEach((item) => item.classList.add('is-revealed'));
  }
})();
