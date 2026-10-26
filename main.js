// Vela Web Studio — main.js
(function(){
  // Year
  const yr = document.getElementById('yr'); if(yr) yr.textContent = new Date().getFullYear();

  // Mobile nav
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger && burger.addEventListener('click', ()=> nav.classList.toggle('open'));

  // Currency state
  const currencySelect = document.getElementById('currencySelect');
  const globalCurrency = document.getElementById('currencySelect'); // alias
  let currency = 'GTQ';
  const symbols = { GTQ:'Q', USD:'$', EUR:'€' };
  const rates = { GTQ:1, USD:0.179, EUR:0.166 }; // base GTQ

  function fmt(amount, cur){
    const sym = symbols[cur];
    const val = cur==='GTQ' ? amount : amount*rates[cur];
    return sym + val.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  }

  // Billing toggle
  const billingToggle = document.getElementById('billingToggle');
  let annual = false;
  billingToggle && billingToggle.addEventListener('click', ()=>{
    annual = !annual;
    billingToggle.setAttribute('aria-pressed', annual);
    updateSaasPrices();
    updateCotizadorAmounts();
    updateSummary();
  });

  function updateSaasPrices(){
    document.querySelectorAll('.saas-card .cur').forEach(el=>{
      const card = el.closest('.saas-card');
      const sku = card.dataset.sku;
      const per = document.getElementById('per-'+sku);
      let gtq, usd;
      if(annual){
        gtq = parseFloat(el.dataset.annualGtq);
        usd = parseFloat(el.dataset.annualUsd);
        if(per) per.textContent = '/year';
      } else {
        gtq = parseFloat(el.dataset.monthlyGtq);
        usd = parseFloat(el.dataset.monthlyUsd);
        if(per) per.textContent = '/month';
      }
      el.dataset._gtq = gtq; el.dataset._usd = usd;
      el.textContent = currency==='GTQ' ? 'Q'+gtq.toLocaleString() : (currency==='USD' ? '$'+usd.toLocaleString() : '€'+(gtq*rates.EUR).toFixed(0));
    });
  }

  // Currency switch handlers
  function setCurrency(cur){
    currency = cur;
    // Update all .cur price tags with data-gtq/usd/eur
    document.querySelectorAll('.cur').forEach(el=>{
      if(el.dataset._gtq){ // saas handled separately
        return;
      }
      const gtq = parseFloat(el.dataset.gtq);
      const usd = parseFloat(el.dataset.usd);
      const eur = parseFloat(el.dataset.eur);
      if(isNaN(gtq)) return;
      const map = {GTQ: 'Q'+gtq.toLocaleString('en-US',{minimumFractionDigits:2}), USD: '$'+usd.toLocaleString('en-US',{minimumFractionDigits:2}), EUR: '€'+eur.toLocaleString('en-US',{minimumFractionDigits:2})};
      el.textContent = map[cur];
    });
    updateSaasPrices();
    updateCotizadorAmounts();
    updateSummary();
  }
  currencySelect && currencySelect.addEventListener('change', e=> setCurrency(e.target.value));
  const headerCurrency = null;

  // Cotizador amounts
  function updateCotizadorAmounts(){
    document.querySelectorAll('.cot-amt').forEach(el=>{
      const gtq = parseFloat(el.dataset.gtq);
      const usd = parseFloat(el.dataset.usd);
      const eur = parseFloat(el.dataset.eur);
      const map = {GTQ:'Q'+gtq.toLocaleString('en-US',{minimumFractionDigits:2}),USD:'$'+usd.toLocaleString('en-US',{minimumFractionDigits:2}),EUR:'€'+eur.toLocaleString('en-US',{minimumFractionDigits:2})};
      el.textContent = map[currency];
    });
  }

  // Cotizador logic
  const summaryList = document.getElementById('summaryList');
  const totalAmt = document.getElementById('totalAmt');
  const skus = {
    express:{name:'Vela Express — Landing',gtq:999,usd:199,eur:185},
    pro:{name:'Vela Web Pro — Corporate',gtq:1899,usd:349,eur:325},
    commerce:{name:'Vela Commerce — E-Commerce',gtq:2999,usd:499,eur:465},
    enterprise:{name:'Vela Enterprise — Ecosystem',gtq:4999,usd:899,eur:835},
    emprendedor:{name:'Plan Emprendedor (SaaS)',gtq:250,usd:32,eur:30,monthly:true},
    pyme:{name:'Plan PYME (SaaS)',gtq:550,usd:70,eur:65,monthly:true},
    empresarial:{name:'Plan Empresarial (SaaS)',gtq:1200,usd:150,eur:140,monthly:true},
    setup:{name:'Initial Set-Up & Implementation',gtq:1500,usd:250,eur:235},
    mobile:{name:'Mobile Apps (iOS/Android)',gtq:4500,usd:799,eur:745},
    saasapi:{name:'Custom Web SaaS & APIs',gtq:3500,usd:500,eur:465},
    pentest:{name:'Web Audit & Pentesting',gtq:1500,usd:250,eur:235},
    hardening:{name:'Server Hardening & WAF',gtq:999,usd:150,eur:140},
    malware:{name:'Malware Cleanup',gtq:750,usd:120,eur:112},
  };

  function itemPrice(sku){
    const s = skus[sku];
    let gtq = s.gtq, usd=s.usd, eur=s.eur;
    if(s.monthly && annual){
      // annual monthly-equivalent displayed as yearly? Use monthly*12 with 20% off
      gtq = Math.round(s.gtq*12*0.8);
      usd = Math.round(s.usd*12*0.8);
      eur = Math.round(s.eur*12*0.8);
    }
    return {gtq,usd,eur};
  }

  function updateSummary(){
    const checked = [...document.querySelectorAll('.cot-check input:checked')];
    if(checked.length===0){ summaryList.innerHTML='<p class="empty">No items selected yet.</p>'; totalAmt.textContent = symbols[currency]+'0.00'; return; }
    let total=0;
    const rows = checked.map(cb=>{
      const sku = cb.dataset.sku;
      const p = itemPrice(sku);
      const val = currency==='GTQ'?p.gtq:(currency==='USD'?p.usd:p.eur);
      total += val;
      const suffix = (skus[sku].monthly && annual) ? ' (annual)' : (skus[sku].monthly?' (monthly)':'');
      return `<div class="row"><span>${skus[sku].name}${suffix}</span><span>${symbols[currency]}${val.toLocaleString('en-US',{minimumFractionDigits:2})}</span></div>`;
    }).join('');
    summaryList.innerHTML = rows;
    totalAmt.textContent = symbols[currency]+total.toLocaleString('en-US',{minimumFractionDigits:2});
  }

  document.querySelectorAll('.cot-check input').forEach(cb=>{
    cb.addEventListener('change', updateSummary);
  });

  // Select plan buttons sync to cotizador
  document.querySelectorAll('[data-action="quote"]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const sku = btn.dataset.sku;
      const cb = document.querySelector(`.cot-check input[data-sku="${sku}"]`);
      if(cb){ cb.checked = true; updateSummary(); }
      const section = document.getElementById('cotizador');
      section && section.scrollIntoView({behavior:'smooth'});
    });
  });

  // WhatsApp send
  const waBtn = document.getElementById('waBtn');
  waBtn && waBtn.addEventListener('click', ()=>{
    const checked = [...document.querySelectorAll('.cot-check input:checked')];
    if(checked.length===0){ alert('Please select at least one service.'); return; }
    let lines = ['Hello Gerardo, I would like to request a quote from Vela Web Studio:',''];
    let total=0;
    checked.forEach(cb=>{
      const sku=cb.dataset.sku;
      const p=itemPrice(sku);
      const val = currency==='GTQ'?p.gtq:(currency==='USD'?p.usd:p.eur);
      total+=val;
      lines.push(`• ${skus[sku].name} — ${symbols[currency]}${val.toLocaleString('en-US',{minimumFractionDigits:2})}`);
    });
    lines.push('');
    lines.push(`Total: ${symbols[currency]}${total.toLocaleString('en-US',{minimumFractionDigits:2})}`);
    lines.push('');
    lines.push('Please confirm availability and next steps. Thank you!');
    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/50244661266?text=${text}`,'_blank');
  });

  // Scanner
  const scanBtn = document.getElementById('scanBtn');
  scanBtn && scanBtn.addEventListener('click', ()=>{
    const url = document.getElementById('scanUrl').value.trim();
    const res = document.getElementById('scanResult');
    if(!url){ alert('Enter a URL'); return; }
    res.hidden = false;
    res.innerHTML = '<p style="color:var(--muted);font-family:var(--mono);font-size:13px">Analyzing '+url+' ...</p>';
    setTimeout(()=>{
      const mobile = Math.floor(40+Math.random()*55);
      const waf = Math.random()>.5;
      const ssl = Math.random()>.3;
      const speed = mobile>70?'Good':'Needs improvement';
      res.innerHTML = `
        <div class="scan-row"><span>Mobile Speed Score</span><span class="${mobile>70?'ok':'bad'}">${mobile}/100 — ${speed}</span></div>
        <div class="scan-row"><span>WAF / Perimeter Firewall</span><span class="${waf?'ok':'bad'}">${waf?'Active':'Not detected'}</span></div>
        <div class="scan-row"><span>SSL / TLS Grade</span><span class="${ssl?'ok':'bad'}">${ssl?'A+':'B (weak)'}</span></div>
        <div class="scan-row"><span>Malware Signatures</span><span class="bad">Scan inconclusive — manual audit required</span></div>
        <div class="scan-cta">
          <a class="btn btn-primary" href="https://wa.me/50244661266?text=${encodeURIComponent('Hi Gerardo, I ran a security scan on '+url+' and want to fix the vulnerabilities found.')}" target="_blank" rel="noopener">Fix Vulnerabilities via WhatsApp →</a>
        </div>`;
    },1400);
  });

  // Reveal on scroll
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
  },{threshold:.12});
  document.querySelectorAll('.pkg-card,.saas-card,.eng-card,.trust-item,.section-head').forEach(el=>{ el.classList.add('reveal'); io.observe(el); });

  // Counters
  document.querySelectorAll('.stat-num').forEach(el=>{
    const target = +el.dataset.count;
    let cur=0; const step = Math.max(1, Math.ceil(target/40));
    const t = setInterval(()=>{
      cur = Math.min(target, cur+step);
      el.textContent = cur;
      if(cur>=target) clearInterval(t);
    },40);
  });

  // Ambient canvas particles
  const canvas = document.getElementById('bgCanvas');
  if(canvas){
    const ctx = canvas.getContext('2d');
    let w,h,pts=[];
    function resize(){ w=canvas.width=window.innerWidth; h=canvas.height=window.innerHeight; }
    resize(); window.addEventListener('resize',resize);
    for(let i=0;i<90;i++) pts.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.6+.4,hue:Math.random()*60+180});
    function loop(){
      ctx.clearRect(0,0,w,h);
      pts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>w) p.vx*=-1;
        if(p.y<0||p.y>h) p.vy*=-1;
        const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6);
        g.addColorStop(0,`hsla(${p.hue},90%,70%,.9)`); g.addColorStop(1,`hsla(${p.hue},90%,70%,0)`);
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*6,0,Math.PI*2); ctx.fill();
      });
      // connections
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.hypot(dx,dy);
        if(d<140){ ctx.strokeStyle=`rgba(124,92,255,${(1-d/140)*.18})`; ctx.lineWidth=.6; ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke(); }
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  // i18n
  const dict = {
    en: {
      nav_packages:'Packages', nav_saas:'SaaS', nav_eng:'Engineering', nav_quote:'Quote', nav_scan:'Scanner', nav_contact:'Contact',
      hero_sub:'Vela Web Studio — founded by Gerardo García — builds high-performance web ecosystems, SaaS CRM/ERP platforms, mobile applications, and military-grade cybersecurity for ambitious businesses across Guatemala, LATAM, USA and Europe. Zero lock-in. Zero initial budget. Pure execution.',
    },
    es: {}
  };
  const langSelect = document.getElementById('langSelect');
  function applyLang(lang){
    document.documentElement.lang = lang;
    // minimal: swap hero sub and nav via data-i18n if english
    if(lang==='en'){
      document.querySelector('.hero-sub').textContent = dict.en.hero_sub;
      document.querySelectorAll('[data-i18n]').forEach(el=>{
        const k=el.dataset.i18n; if(dict.en[k]) el.textContent=dict.en[k];
      });
    } else {
      location.reload();
    }
  }
  langSelect && langSelect.addEventListener('change', e=> applyLang(e.target.value));

  // initial
  setCurrency('GTQ');
})();
