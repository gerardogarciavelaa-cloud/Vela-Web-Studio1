(() => {
  'use strict';
  const d = document;
  const html = d.documentElement;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const safe = (fn) => { try { fn(); } catch (e) { console.warn('[vela]', e); } };

  if (!hasGSAP) html.classList.remove('js');
  else {
    gsap.registerPlugin(ScrollTrigger);
    if (window.SplitText) gsap.registerPlugin(SplitText);
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  const M = { ease:'expo.out', easeIO:'expo.inOut', pop:'back.out(1.7)', dur:.9, stagger:.09, dist:32, lerp:.095 };

  // Lenis
  let lenis = null;
  if (hasGSAP && !RM && window.Lenis && M.lerp) {
    lenis = new Lenis({ lerp: M.lerp, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // i18n
  let catalogData = null;
  let i18nData = {};
  let currentLang = 'es';
  let currentCurrency = 'GTQ';
  let isAnnual = false;

  async function initApp() {
    // Load from inline JSON (works on file://) or fetch
    try {
      const inlineCat = document.getElementById('catalog-json');
      const inlineEs = document.getElementById('i18n-es');
      const inlineEn = document.getElementById('i18n-en');
      if (inlineCat) catalogData = JSON.parse(inlineCat.textContent);
      if (inlineEs) i18nData['es'] = JSON.parse(inlineEs.textContent);
      if (inlineEn) i18nData['en'] = JSON.parse(inlineEn.textContent);
    } catch (e) { console.warn('inline parse', e); }
    try {
      const [catRes, esRes, enRes] = await Promise.all([
        fetch('data/catalog.json'),
        fetch('i18n/es.json'),
        fetch('i18n/en.json')
      ]);
      if (catRes.ok) catalogData = await catRes.json();
      if (esRes.ok) i18nData['es'] = await esRes.json();
      if (enRes.ok) i18nData['en'] = await enRes.json();
    } catch (e) { /* file:// or offline: keep inline */ }
    renderCatalog();
    updateUI();
    setupEventListeners();
    console.log('Vela initialized');
  }

  function t(path) {
    const keys = path.split('.');
    let val = i18nData[currentLang];
    for (const k of keys) { if (val && val[k] !== undefined) val = val[k]; else return path; }
    return val;
  }

  function formatPrice(gtq, usd, isMonthly = false) {
    if (currentCurrency === 'GTQ') {
      let price = gtq;
      if (isAnnual && isMonthly) price = Math.round(price * 12 * 0.8);
      return `Q${price.toLocaleString()}` + (isMonthly ? (isAnnual ? ' / año' : ' / mes') : '');
    } else {
      if (usd === null) return 'Contact';
      let price = usd;
      if (isAnnual && isMonthly) price = Math.round(price * 12 * 0.8);
      return `$${price.toLocaleString()}` + (isMonthly ? (isAnnual ? ' / yr' : ' / mo') : '');
    }
  }

  function renderIncludes(item) {
    if (!item.includes || !item.includes.length) return '';
    return `<div class="inc"><div class="inc__label">Incluye</div><ul>${item.includes.map(i=>`<li><span class="inc__check">✓</span>${i}</li>`).join('')}</ul></div>`;
  }

  function renderCatalog() {
    if (!catalogData) return;
    const gridA = $('#levelAGrid');
    if (gridA) gridA.innerHTML = catalogData.levels.A.items.map(item => `
      <div class="card">
        <h4>${item.name}</h4>
        <p>${item.description}</p>
        ${renderIncludes(item)}
        <div class="card__price">${formatPrice(item.priceGTQ, item.priceUSD)}</div>
        <a href="https://wa.me/50244661266?text=Hola%20Vela%20Web%20Studio,%20quiero%20contratar%20el%20plan%20${encodeURIComponent(item.name)}" target="_blank" rel="noopener" class="btn btn--ghost btn--sm btn--block">${t('services.selectPlan')}</a>
      </div>`).join('');
    const gridB = $('#levelBGrid');
    if (gridB) gridB.innerHTML = catalogData.levels.B.items.map(item => {
      let price = item.priceGTQ;
      if (isAnnual) price = Math.round(price * 12 * 0.8);
      const priceStr = currentCurrency === 'GTQ' ? `Q${price.toLocaleString()}` : `$${Math.round(price/7.8).toLocaleString()}`;
      const intervalStr = isAnnual ? (currentLang === 'es' ? ' / año' : ' / yr') : (currentLang === 'es' ? ' / mes' : ' / mo');
      return `<div class="card">
        <h4>${item.name}</h4>
        <p>${item.description}</p>
        ${renderIncludes(item)}
        <div class="card__price">${priceStr}<span class="card__interval">${intervalStr}</span></div>
        ${item.setupGTQ ? `<div class="card__setup">+ Q${item.setupGTQ.toLocaleString()} set-up</div>` : ''}
        <a href="https://wa.me/50244661266?text=Hola%20Vela%20Web%20Studio,%20quiero%20el%20SaaS%20${encodeURIComponent(item.name)}" target="_blank" rel="noopener" class="btn btn--ghost btn--sm btn--block">${t('services.selectPlan')}</a>
      </div>`;
    }).join('');
    const gridC = $('#levelCGrid');
    if (gridC) gridC.innerHTML = catalogData.levels.C.items.map(item => `
      <div class="card">
        <h4>${item.name}</h4>
        <p>${item.description}</p>
        ${renderIncludes(item)}
        <div class="card__price">${formatPrice(item.priceGTQ, item.priceUSD)}</div>
        <a href="https://wa.me/50244661266?text=Hola%20Vela%20Web%20Studio,%20quiero%20cotizar%20${encodeURIComponent(item.name)}" target="_blank" rel="noopener" class="btn btn--ghost btn--sm btn--block">${t('services.selectPlan')}</a>
      </div>`).join('');
    updateCalculatorServices();
  }

  function updateUI() {
    $$('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translated = t(key);
      if (translated && typeof translated === 'string') el.textContent = translated;
    });
    renderCatalog();
  }

  function updateCalculatorServices() {
    if (!catalogData) return;
    const levelKey = $('#calcLevel').value;
    const serviceSelect = $('#calcService');
    if (!serviceSelect) return;
    const items = catalogData.levels[levelKey].items;
    serviceSelect.innerHTML = items.map(item => `<option value="${item.id}" data-gtq="${item.priceGTQ}" data-usd="${item.priceUSD || 0}" data-setup="${item.setupGTQ || 0}">${item.name}</option>`).join('');
    updateCalculatorTotal();
  }

  function updateCalculatorTotal() {
    const serviceSelect = $('#calcService');
    if (!serviceSelect) return;
    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
    if (!selectedOption) return;
    const gtq = parseFloat(selectedOption.getAttribute('data-gtq')) || 0;
    const usd = parseFloat(selectedOption.getAttribute('data-usd')) || 0;
    const levelKey = $('#calcLevel').value;
    let total = currentCurrency === 'GTQ' ? gtq : usd;
    if (levelKey === 'B' && isAnnual) total = total * 12 * 0.8;
    const symbol = currentCurrency === 'GTQ' ? 'Q' : '$';
    const totalEl = $('#calcTotal');
    if (totalEl) totalEl.textContent = `${symbol}${Math.round(total).toLocaleString()}`;
    const intervalEl = $('#calcInterval');
    if (intervalEl) {
      if (levelKey === 'B') intervalEl.textContent = isAnnual ? (currentLang === 'es' ? 'Anual (-20%)' : 'Annual (-20%)') : (currentLang === 'es' ? 'Mensual' : 'Monthly');
      else intervalEl.textContent = currentLang === 'es' ? 'Pago Único' : 'One-time';
    }
    const serviceName = selectedOption.textContent;
    const waBtn = $('#calcWhatsAppBtn');
    if (waBtn) waBtn.href = `https://wa.me/50244661266?text=Hola%20Vela%20Web%20Studio,%20quiero%20cotizar%20el%20servicio:%20${encodeURIComponent(serviceName)}%20(${symbol}${Math.round(total).toLocaleString()})`;
  }

  function setupEventListeners() {
    const langSelect = $('#langSelect');
    if (langSelect) langSelect.addEventListener('change', (e) => { currentLang = e.target.value; updateUI(); });
    const currencySelect = $('#currencySelect');
    if (currencySelect) currencySelect.addEventListener('change', (e) => { currentCurrency = e.target.value; renderCatalog(); updateCalculatorTotal(); });
    const btnMonthly = $('#billingMonthly');
    const btnAnnual = $('#billingAnnual');
    if (btnMonthly && btnAnnual) {
      btnMonthly.addEventListener('click', () => { isAnnual = false; btnMonthly.classList.add('is-active'); btnAnnual.classList.remove('is-active'); renderCatalog(); });
      btnAnnual.addEventListener('click', () => { isAnnual = true; btnAnnual.classList.add('is-active'); btnMonthly.classList.remove('is-active'); renderCatalog(); });
    }
    const calcLevel = $('#calcLevel');
    if (calcLevel) calcLevel.addEventListener('change', updateCalculatorServices);
    const calcService = $('#calcService');
    if (calcService) calcService.addEventListener('change', updateCalculatorTotal);
    const simRunBtn = $('#simRunBtn');
    if (simRunBtn) simRunBtn.addEventListener('click', () => {
      const urlInput = $('#simUrl');
      const results = $('#simResults');
      const score = $('#simScore');
      const rec = $('#simRec');
      if (!urlInput || !urlInput.value.trim()) { alert(currentLang === 'es' ? 'Por favor ingresa una URL válida.' : 'Please enter a valid URL.'); return; }
      if (results) results.classList.remove('hidden');
      if (score) score.textContent = currentLang === 'es' ? '⚠️ Nivel de Exposición Moderado-Alto (Simulado)' : '⚠️ Moderate-High Exposure Level (Simulated)';
      if (rec) rec.textContent = currentLang === 'es' ? 'Recomendación: Aplicar Hardening de Servidor (Nivel C) y Pentesting preventivo.' : 'Recommendation: Apply Server Hardening (Tier C) and preventive Pentesting.';
    });
    // anchor scroll
    d.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute('href');
      const el = hash.length > 1 && d.getElementById(hash.slice(1));
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: -10, duration: 1.2 });
      else el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Preloader + firma
  function firmaIsoIn(root) {
    const tl = gsap.timeline();
    const iso = $$('.pl-iso', root);
    const letter = $$('.pl-letter', root);
    tl.from(iso, { scale: 0, rotate: -18, transformOrigin: '50% 100%', duration: M.dur, ease: M.pop })
      .from(letter, { yPercent: 120, rotate: 6, duration: M.dur, stagger: .07, ease: M.pop }, '-=.4');
    return tl;
  }
  function cortinaSube(root) {
    return gsap.timeline()
      .to($('.preloader__panel--a', root), { yPercent: -100, duration: .9, ease: M.easeIO })
      .to($('.preloader__panel--b', root), { yPercent: -100, duration: .9, ease: M.easeIO }, .12);
  }

  function preloader(done) {
    const pl = $('.preloader');
    let started = false;
    const start = () => { if (started) return; started = true; if (pl) pl.style.pointerEvents = 'none'; done(); };
    const cleanup = () => { if (pl) pl.remove(); lenis && lenis.start(); try { sessionStorage.setItem('pl-visto','1'); } catch(e){} };
    if (!pl) { start(); return; }
    let seen = null; try { seen = sessionStorage.getItem('pl-visto'); } catch(e){}
    const count = $('.js-count', pl);
    const bar = $('.preloader__bar span', pl);
    const prog = { v: 0 };
    const HOLD = 1.7;
    lenis && lenis.stop();
    window.scrollTo(0,0);
    const ready = Promise.race([ d.fonts ? d.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 2600)) ]);
    const tl = gsap.timeline({ paused: true, onComplete: cleanup });
    const entrada = firmaIsoIn(pl);
    tl.add(entrada, 0);
    if (count || bar) tl.to(prog, { v: 100, duration: HOLD, ease: 'power2.inOut', onUpdate: () => { if (count) count.textContent = Math.round(prog.v); if (bar) bar.style.transform = `scaleX(${prog.v/100})`; } }, 0);
    tl.addLabel('salida', Math.max(entrada.duration() + 0.4, HOLD));
    tl.add(firmaIsoIn(pl).reverse(), 'salida');
    const extras = $$('.preloader__bar, .preloader__meta', pl);
    if (extras.length) tl.to(extras, { opacity: 0, y: -10, duration: .35 }, 'salida');
    tl.add(cortinaSube(pl), 'salida+=0.2');
    tl.add(start, 'salida+=0.55');
    if (seen) tl.timeScale(2);
    ready.then(() => tl.play());
    pl.addEventListener('click', () => tl.timeScale(4).play(), { once: true });
    setTimeout(() => { if (pl.isConnected) { tl.kill(); cleanup(); start(); } }, 8000);
  }

  function heroIntro() {
    gsap.set('.hero__line-in', { yPercent: 112, y: 0 });
    const camino = trazarCamino();
    gsap.timeline({ defaults: { ease: M.ease } })
      .to('.hero__line-in', { yPercent: 0, duration: M.dur * 1.3, stagger: M.stagger * 1.3 }, 0)
      .from('.hero__media', { yPercent: 22, scale: 1.08, duration: M.dur * 1.45 }, 0)
      .from('.hero__meta > *, .hero__subtitle, .hero__actions > *, .hero__stats > *', { y: M.dist * .75, opacity: 0, duration: M.dur, stagger: M.stagger }, .2)
      .from('.hero__badge', { scale: 0, duration: M.dur * 1.3, ease: M.pop }, .35)
      .from('.site-header', { y: -40, opacity: 0, duration: M.dur }, .3)
      .add(dibujarCamino(camino), '-=.3');
  }

  function trazarCamino() {
    const svg = $('.hero .camino');
    const desde = $('[data-camino-desde]') || $('.hero__media');
    const hasta = $('[data-camino-hasta]') || $('.hero__actions a:first-child');
    if (!svg || !desde || !hasta) return null;
    const h = svg.getBoundingClientRect();
    const a = desde.getBoundingClientRect();
    const b = hasta.getBoundingClientRect();
    const x1 = a.left + a.width * .5 - h.left, y1 = a.bottom - h.top;
    const x2 = b.left + b.width * .5 - h.left, y2 = b.top - h.top;
    const ym = (y1 + y2) / 2;
    svg.setAttribute('viewBox', `0 0 ${h.width} ${h.height}`);
    const path = $('path', svg);
    path.setAttribute('d', `M${x1},${y1} C${x1},${ym} ${x2},${ym} ${x2},${y2}`);
    return path;
  }
  function dibujarCamino(path) {
    if (!path) return gsap.timeline();
    const L = path.getTotalLength();
    return gsap.timeline().fromTo(path, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: M.dur * 1.4, ease: M.ease });
  }

  function splitReveals() {
    gsap.set('[data-reveal]', { y: M.dist, opacity: 0 });
    safe(() => {
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 90%', once: true,
        onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: M.dur, ease: M.ease, stagger: Math.min(M.stagger, .6 / batch.length), overwrite: true }),
      });
    });
    // trazos que se dibujan
    $$('[data-draw]').forEach((svg) => {
      const lines = $$('path, line, polyline, circle, ellipse, rect', svg);
      lines.forEach((p) => { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
      const scrub = svg.hasAttribute('data-draw-scrub');
      gsap.to(lines, {
        strokeDashoffset: 0, duration: M.dur * 1.4, stagger: M.stagger, ease: scrub ? 'none' : M.ease,
        scrollTrigger: scrub ? { trigger: svg, start: 'top 85%', end: 'bottom 40%', scrub: true } : { trigger: svg, start: 'top 88%', once: true },
      });
    });
  }

  // Boot
  window.addEventListener('DOMContentLoaded', () => {
    initApp();
    if (!hasGSAP) return;
    safe(() => {
      if (RM) { const pl = $('.preloader'); pl && pl.remove(); return; }
      preloader(() => { safe(heroIntro); safe(splitReveals); ScrollTrigger.refresh(); });
      window.addEventListener('load', () => ScrollTrigger.refresh());
    });
  });
})();
