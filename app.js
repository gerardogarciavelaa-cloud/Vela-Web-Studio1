/**
 * Vela Web Studio - Enhanced Application Logic & Cybernetic Canvas Animation
 * Founder: Gerardo García | Contact: +502 4466 1266
 */

let catalogData = null;
let i18nData = {};
let currentLang = 'es';
let currentCurrency = 'GTQ';
let isAnnual = false;

/* ==========================================================================
   1. Cybernetic Canvas Particle & Node Network Animation
   ========================================================================== */
function initCyberCanvas() {
  const canvas = document.getElementById('cyberCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(width, 70);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 1.5 + 0.8
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(34, 211, 238, 0.5)';
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.12)';
    ctx.lineWidth = 0.8;

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. Scroll Reveal Observer
   ========================================================================== */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
}

/* ==========================================================================
   3. Core App Initialization & Rendering
   ========================================================================== */
async function initApp() {
  try {
    const [catRes, esRes, enRes] = await Promise.all([
      fetch('data/catalog.json'),
      fetch('i18n/es.json'),
      fetch('i18n/en.json')
    ]);

    catalogData = await catRes.json();
    i18nData['es'] = await esRes.json();
    i18nData['en'] = await enRes.json();

    renderCatalog();
    updateUI();
    setupEventListeners();
    initCyberCanvas();
    initScrollReveal();
    console.log('Vela Web Studio Design Engineering UI initialized.');
  } catch (err) {
    console.error('Error initializing Vela Web Studio:', err);
  }
}

function t(path) {
  const keys = path.split('.');
  let val = i18nData[currentLang];
  for (const k of keys) {
    if (val && val[k] !== undefined) val = val[k];
    else return path;
  }
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

function renderCatalog() {
  if (!catalogData) return;

  // Level A: Fixed Development
  const gridA = document.getElementById('levelAGrid');
  if (gridA) {
    gridA.innerHTML = catalogData.levels.A.items.map(item => `
      <div class="glow-card rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <h4 class="text-lg font-bold text-white mb-2">${item.name}</h4>
          <p class="text-xs text-slate-400 mb-4 leading-relaxed font-light">${item.description}</p>
          ${renderIncludes(item)}
        </div>
        <div>
          <div class="text-2xl font-extrabold text-[#22d3ee] mb-4">${formatPrice(item.priceGTQ, item.priceUSD)}</div>
          <a href="https://wa.me/50244661266?text=Hola%20Vela%20Web%20Studio,%20quiero%20contratar%20el%20plan%20${encodeURIComponent(item.name)}" target="_blank" class="block w-full text-center bg-[#0a0f1a] border border-[#22d3ee]/40 text-[#22d3ee] hover:bg-[#22d3ee] hover:text-[#0a0f1a] font-semibold text-xs py-2.5 rounded-xl transition-all duration-200 active:scale-95 shimmer-btn">
            ${t('services.selectPlan')}
          </a>
        </div>
      </div>
    `).join('');
  }

  // Level B: Recurring SaaS
  const gridB = document.getElementById('levelBGrid');
  if (gridB) {
    gridB.innerHTML = catalogData.levels.B.items.map(item => {
      let price = item.priceGTQ;
      if (isAnnual) price = Math.round(price * 12 * 0.8);
      const priceStr = currentCurrency === 'GTQ' ? `Q${price.toLocaleString()}` : `$${Math.round(price/7.8).toLocaleString()}`;
      const intervalStr = isAnnual ? (currentLang === 'es' ? ' / año' : ' / yr') : (currentLang === 'es' ? ' / mes' : ' / mo');
      return `
        <div class="glow-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h4 class="text-lg font-bold text-white mb-2">${item.name}</h4>
            <p class="text-xs text-slate-400 mb-4 leading-relaxed font-light">${item.description}</p>
            ${renderIncludes(item)}
          </div>
          <div>
            <div class="text-2xl font-extrabold text-[#22d3ee] mb-1">${priceStr}<span class="text-xs text-slate-400 font-normal">${intervalStr}</span></div>
            ${item.setupGTQ ? `<div class="text-xs text-slate-500 mb-4 font-light">+ Q${item.setupGTQ.toLocaleString()} set-up</div>` : '<div class="mb-4"></div>'}
            <a href="https://wa.me/50244661266?text=Hola%20Vela%20Web%20Studio,%20quiero%20el%20SaaS%20${encodeURIComponent(item.name)}" target="_blank" class="block w-full text-center bg-[#0a0f1a] border border-[#22d3ee]/40 text-[#22d3ee] hover:bg-[#22d3ee] hover:text-[#0a0f1a] font-semibold text-xs py-2.5 rounded-xl transition-all duration-200 active:scale-95 shimmer-btn">
              ${t('services.selectPlan')}
            </a>
          </div>
        </div>
      `;
    }).join('');
  }

  // Level C: Engineering & Cybersecurity
  const gridC = document.getElementById('levelCGrid');
  if (gridC) {
    gridC.innerHTML = catalogData.levels.C.items.map(item => `
      <div class="glow-card rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <h4 class="text-lg font-bold text-white mb-2">${item.name}</h4>
          <p class="text-xs text-slate-400 mb-4 leading-relaxed font-light">${item.description}</p>
          ${renderIncludes(item)}
        </div>
        <div>
          <div class="text-2xl font-extrabold text-[#22d3ee] mb-4">${formatPrice(item.priceGTQ, item.priceUSD)}</div>
          <a href="https://wa.me/50244661266?text=Hola%20Vela%20Web%20Studio,%20quiero%20cotizar%20${encodeURIComponent(item.name)}" target="_blank" class="block w-full text-center bg-[#0a0f1a] border border-[#22d3ee]/40 text-[#22d3ee] hover:bg-[#22d3ee] hover:text-[#0a0f1a] font-semibold text-xs py-2.5 rounded-xl transition-all duration-200 active:scale-95 shimmer-btn">
            ${t('services.selectPlan')}
          </a>
        </div>
      </div>
    `).join('');
  }

  updateCalculatorServices();
}

function renderIncludes(item) {
  if (!item.includes || item.includes.length === 0) return '';
  return `
    <div class="mt-2 border-t border-[#1e293b] pt-3">
      <div class="text-[10px] uppercase tracking-wider text-[#22d3ee] font-semibold mb-2">Incluye</div>
      <ul class="space-y-1">
        ${item.includes.map(inc => `
          <li class="text-xs text-slate-300 flex items-center space-x-2">
            <span class="text-[#22d3ee] text-xs">✓</span>
            <span>${inc}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

function updateUI() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translated = t(key);
    if (translated) {
      el.textContent = translated;
    }
  });
  renderCatalog();
}

function updateCalculatorServices() {
  if (!catalogData) return;
  const levelKey = document.getElementById('calcLevel').value;
  const serviceSelect = document.getElementById('calcService');
  if (!serviceSelect) return;

  const items = catalogData.levels[levelKey].items;
  serviceSelect.innerHTML = items.map(item => `
    <option value="${item.id}" data-gtq="${item.priceGTQ}" data-usd="${item.priceUSD || 0}" data-setup="${item.setupGTQ || 0}">${item.name}</option>
  `).join('');

  updateCalculatorTotal();
}

function updateCalculatorTotal() {
  const serviceSelect = document.getElementById('calcService');
  if (!serviceSelect) return;
  const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
  if (!selectedOption) return;

  const gtq = parseFloat(selectedOption.getAttribute('data-gtq')) || 0;
  const usd = parseFloat(selectedOption.getAttribute('data-usd')) || 0;
  const levelKey = document.getElementById('calcLevel').value;

  let total = currentCurrency === 'GTQ' ? gtq : usd;
  if (levelKey === 'B' && isAnnual) {
    total = total * 12 * 0.8;
  }

  const symbol = currentCurrency === 'GTQ' ? 'Q' : '$';
  const totalEl = document.getElementById('calcTotal');
  if (totalEl) totalEl.textContent = `${symbol}${Math.round(total).toLocaleString()}`;

  const intervalEl = document.getElementById('calcInterval');
  if (intervalEl) {
    if (levelKey === 'B') {
      intervalEl.textContent = isAnnual ? (currentLang === 'es' ? 'Anual (-20%)' : 'Annual (-20%)') : (currentLang === 'es' ? 'Mensual' : 'Monthly');
    } else {
      intervalEl.textContent = currentLang === 'es' ? 'Pago Único' : 'One-time';
    }
  }

  const serviceName = selectedOption.textContent;
  const waBtn = document.getElementById('calcWhatsAppBtn');
  if (waBtn) {
    waBtn.href = `https://wa.me/50244661266?text=Hola%20Vela%20Web%20Studio,%20quiero%20cotizar%20el%20servicio:%20${encodeURIComponent(serviceName)}%20(${symbol}${Math.round(total).toLocaleString()})`;
  }
}

function setupEventListeners() {
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      currentLang = e.target.value;
      updateUI();
    });
  }

  const currencySelect = document.getElementById('currencySelect');
  if (currencySelect) {
    currencySelect.addEventListener('change', (e) => {
      currentCurrency = e.target.value;
      renderCatalog();
      updateCalculatorTotal();
    });
  }

  const btnMonthly = document.getElementById('billingMonthly');
  const btnAnnual = document.getElementById('billingAnnual');
  if (btnMonthly && btnAnnual) {
    btnMonthly.addEventListener('click', () => {
      isAnnual = false;
      btnMonthly.className = 'px-4 py-2 text-xs font-bold rounded-lg bg-[#22d3ee] text-[#0a0f1a] transition-all cursor-pointer';
      btnAnnual.className = 'px-4 py-2 text-xs font-bold rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer';
      renderCatalog();
    });

    btnAnnual.addEventListener('click', () => {
      isAnnual = true;
      btnAnnual.className = 'px-4 py-2 text-xs font-bold rounded-lg bg-[#22d3ee] text-[#0a0f1a] transition-all cursor-pointer';
      btnMonthly.className = 'px-4 py-2 text-xs font-bold rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer';
      renderCatalog();
    });
  }

  const calcLevel = document.getElementById('calcLevel');
  if (calcLevel) calcLevel.addEventListener('change', updateCalculatorServices);

  const calcService = document.getElementById('calcService');
  if (calcService) calcService.addEventListener('change', updateCalculatorTotal);

  const simRunBtn = document.getElementById('simRunBtn');
  if (simRunBtn) {
    simRunBtn.addEventListener('click', () => {
      const urlInput = document.getElementById('simUrl');
      const results = document.getElementById('simResults');
      const score = document.getElementById('simScore');
      const rec = document.getElementById('simRec');

      if (!urlInput || !urlInput.value.trim()) {
        alert(currentLang === 'es' ? 'Por favor ingresa una URL válida.' : 'Please enter a valid URL.');
        return;
      }

      if (results) results.classList.remove('hidden');
      if (score) score.textContent = currentLang === 'es' ? '⚠️ Nivel de Exposición Moderado-Alto (Simulado)' : '⚠️ Moderate-High Exposure Level (Simulated)';
      if (rec) rec.textContent = currentLang === 'es'
        ? 'Recomendación: Aplicar Hardening de Servidor (Nivel C) y Pentesting preventivo para blindar endpoints.'
        : 'Recommendation: Apply Server Hardening (Tier C) and preventive Pentesting to shield endpoints.';
    });
  }
}

window.addEventListener('DOMContentLoaded', initApp);
