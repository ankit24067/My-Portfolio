// ── Custom Cursor
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
})();
document.addEventListener('mouseleave', () => { dot.style.opacity = 0; ring.style.opacity = 0; });
document.addEventListener('mouseenter', () => { dot.style.opacity = 1; ring.style.opacity = 1; });

// ── Nav
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => { nav.style.boxShadow = window.scrollY > 40 ? '0 4px 30px rgba(0,0,0,.5)' : ''; });

// ── Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

// ── Scroll Reveal
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Counter animation (hero + numbers band)
function animCount(el, target, decimals, suffix) {
  const dur = 1800;
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = (ease * target).toFixed(decimals) + (suffix || '');
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('[data-target]').forEach(el => {
      const t = parseFloat(el.dataset.target);
      const dec = el.dataset.dec ? parseInt(el.dataset.dec) : (t % 1 !== 0 ? 2 : 0);
      animCount(el, t, dec, el.dataset.suf || '');
    });
    counterObs.unobserve(e.target);
  });
}, { threshold: 0.4 });
[document.querySelector('.hero-stats'), document.querySelector('.numbers-inner')]
  .filter(Boolean).forEach(el => counterObs.observe(el));

// ── Card tilt
document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ── Active nav
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  navLinks.forEach(a => { a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--white)' : ''; });
});

// ── Chart.js — Netflix Analysis
window.addEventListener('load', () => {
  const chartDefaults = {
    responsive: true,
    plugins: { legend: { labels: { color: '#94A3B8', font: { family: 'JetBrains Mono', size: 11 } } } },
  };

  // Bar chart
  const barCtx = document.getElementById('chartBar');
  if (barCtx) {
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['2015','2016','2017','2018','2019','2020','2021'],
        datasets: [{
          label: 'Titles Added',
          data: [115, 197, 406, 671, 1073, 956, 742],
          backgroundColor: ['rgba(0,207,255,.55)','rgba(0,207,255,.6)','rgba(0,207,255,.65)','rgba(0,207,255,.7)','rgba(0,207,255,.85)','rgba(0,207,255,.7)','rgba(0,207,255,.65)'],
          borderColor: 'rgba(0,207,255,.9)',
          borderWidth: 1,
          borderRadius: 6,
        }]
      },
      options: {
        ...chartDefaults,
        plugins: { ...chartDefaults.plugins, legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y} titles` }, backgroundColor: '#0F1E33', titleColor: '#00CFFF', bodyColor: '#94A3B8' }
        },
        scales: {
          x: { ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: 11 } }, grid: { color: 'rgba(255,255,255,.04)' } },
          y: { ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: 11 } }, grid: { color: 'rgba(255,255,255,.04)' } }
        }
      }
    });
  }

  // Doughnut chart
  const doCtx = document.getElementById('chartDoughnut');
  if (doCtx) {
    new Chart(doCtx, {
      type: 'doughnut',
      data: {
        labels: ['Movies (69%)', 'TV Shows (31%)'],
        datasets: [{
          data: [69, 31],
          backgroundColor: ['rgba(0,207,255,.75)', 'rgba(139,92,246,.75)'],
          borderColor: ['#00CFFF','#8B5CF6'],
          borderWidth: 2, hoverOffset: 8
        }]
      },
      options: {
        ...chartDefaults,
        cutout: '65%',
        plugins: {
          ...chartDefaults.plugins,
          tooltip: { backgroundColor: '#0F1E33', titleColor: '#00CFFF', bodyColor: '#94A3B8' }
        }
      }
    });
  }

  // ── GitHub Calendar
  if (typeof GitHubCalendar !== 'undefined') {
    try {
      GitHubCalendar('.calendar', 'ankit24067', {
        responsive: true,
        tooltips: true,
        global_stats: false,
      });
    } catch(e) { console.log('GitHub calendar load issue:', e); }
  }
});

// ── Contact form (client-side with EmailJS fallback message)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('formBtnText');
    const success = document.getElementById('formSuccess');
    btn.textContent = 'Sending...';

    // Wire up to Formspree: replace YOUR_ID with your Formspree form ID
    // Sign up free at formspree.io → create form → copy the ID
    const FORMSPREE_ID = 'YOUR_FORMSPREE_ID';

    if (FORMSPREE_ID !== 'YOUR_FORMSPREE_ID') {
      const data = new FormData(contactForm);
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (res.ok) { contactForm.reset(); success.classList.add('show'); btn.textContent = 'Send Message →'; return; }
    }

    // Fallback: open mailto
    const name = contactForm.querySelector('[name=name]').value;
    const email = contactForm.querySelector('[name=email]').value;
    const msg = contactForm.querySelector('[name=message]').value;
    window.location.href = `mailto:ankitpandey2005k@gmail.com?subject=Portfolio message from ${name}&body=${encodeURIComponent(msg + '\n\nFrom: ' + email)}`;
    btn.textContent = 'Send Message →';
    success.classList.add('show');
  });
}
