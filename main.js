/* ==========================================
   CampusSync — Main JavaScript
   ========================================== */

// ── MOBILE NAV ────────────────────────────
function toggleMenu() {
  const m = document.getElementById('mobileMenu');
  m.classList.toggle('open');
}

// ── EVENTS PAGE FILTER ────────────────────
let activeFilter = 'all';

function setFilter(cat, btn) {
  activeFilter = cat;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  applyFilter();
}

function applyFilter() {
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const rows = document.querySelectorAll('.event-row');
  let count = 0;

  rows.forEach(row => {
    const matchCat = activeFilter === 'all' || row.dataset.cat === activeFilter;
    const text = row.textContent.toLowerCase();
    const matchQ = !q || text.includes(q);
    if (matchCat && matchQ) {
      row.classList.remove('hidden');
      count++;
    } else {
      row.classList.add('hidden');
    }
  });

  const noRes = document.getElementById('noResults');
  if (noRes) noRes.style.display = count === 0 ? 'block' : 'none';
}

function filterEvents() { applyFilter(); }

function sortEvents(val) {
  const list = document.getElementById('eventsList');
  if (!list) return;
  const rows = [...list.querySelectorAll('.event-row')];

  if (val === 'name') {
    rows.sort((a, b) => {
      const na = a.querySelector('h3')?.textContent || '';
      const nb = b.querySelector('h3')?.textContent || '';
      return na.localeCompare(nb);
    });
  } else if (val === 'date') {
    // keep current order (already by date)
  } else if (val === 'popular') {
    rows.sort((a, b) => {
      const na = parseInt(a.querySelector('.er-seats')?.textContent || '0');
      const nb = parseInt(b.querySelector('.er-seats')?.textContent || '0');
      return nb - na;
    });
  }

  rows.forEach(r => list.appendChild(r));
}

// ── AUTH TABS ─────────────────────────────
function switchTab(tab, btn) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

  if (btn) btn.classList.add('active');

  const form = document.getElementById(tab === 'signup' ? 'signupForm' : 'loginForm');
  if (form) form.classList.add('active');
}

function handleSignup() {
  const agree = document.getElementById('agreeTerms');
  if (agree && !agree.checked) {
    showToast('Please agree to the Terms of Service to continue.', 'warn');
    return;
  }
  document.getElementById('signupForm').classList.remove('active');
  const success = document.getElementById('successState');
  if (success) success.classList.add('active');
}

function handleLogin() {
  showToast('Login successful! Redirecting to dashboard…', 'success');
  setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
}

function togglePw(id) {
  const inp = document.getElementById(id);
  if (!inp) return;
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

// ── DASHBOARD ─────────────────────────────
function showSection(id, el) {
  document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.snav-item').forEach(s => s.classList.remove('active'));

  const sec = document.getElementById(id);
  if (sec) sec.classList.add('active');
  if (el) el.classList.add('active');
}

function filterMyEvents(status, btn) {
  document.querySelectorAll('.inner-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  const rows = document.querySelectorAll('.my-event-row');
  rows.forEach(row => {
    if (status === 'all' || row.dataset.status === status) {
      row.classList.remove('hidden');
    } else {
      row.classList.add('hidden');
    }
  });
}

function downloadPass() {
  showToast('Digital pass downloaded! Check your downloads folder.', 'success');
}

function downloadCert() {
  showToast('Certificate downloaded successfully!', 'success');
}

// ── EVENT DETAIL ──────────────────────────
function showEdbTab(id, btn) {
  document.querySelectorAll('.edb-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.edb-tab').forEach(t => t.classList.remove('active'));

  const sec = document.getElementById(id);
  if (sec) sec.classList.add('active');
  if (btn) btn.classList.add('active');
}

function showEventRegForm() {
  const modal = document.getElementById('eventRegModal');
  if (modal) modal.classList.add('active');
}

function closeModal(e) {
  if (e.target === e.currentTarget) {
    e.currentTarget.classList.remove('active');
  }
}

function submitEventReg() {
  document.getElementById('modalForm').style.display = 'none';
  document.getElementById('modalSuccess').style.display = 'block';
}

function saveEvent() {
  showToast('Event saved to your bookmarks!', 'success');
}

function copyLink() {
  navigator.clipboard?.writeText(window.location.href).then(() => {
    showToast('Link copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Could not copy link automatically.', 'warn');
  });
}

// ── FAQ ───────────────────────────────────
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const span = btn.querySelector('span');
  const isOpen = answer.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-q span').forEach(s => s.textContent = '+');

  if (!isOpen) {
    answer.classList.add('open');
    span.textContent = '−';
  }
}

// ── CONTACT ───────────────────────────────
function submitContact() {
  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('contactSuccess').style.display = 'block';
}

// ── TOAST ─────────────────────────────────
function showToast(msg, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = msg;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    padding: '14px 20px',
    borderRadius: '10px',
    fontSize: '0.875rem',
    fontWeight: '500',
    background: type === 'success' ? '#10b981' : type === 'warn' ? '#f59e0b' : '#6c63ff',
    color: 'white',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    zIndex: '9999',
    transform: 'translateY(20px)',
    opacity: '0',
    transition: 'all 0.3s ease',
    fontFamily: 'DM Sans, sans-serif',
    maxWidth: '320px',
    lineHeight: '1.4'
  });

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── SCROLL ANIMATIONS ─────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
  const animEls = document.querySelectorAll(
    '.cat-card, .event-card, .event-row, .testi-card, .step, .cert-card, .rec-card'
  );

  animEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
    observer.observe(el);
  });

  // Navbar scroll shadow
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (nav) {
      nav.style.boxShadow = window.scrollY > 20 ? '0 4px 24px rgba(0,0,0,0.4)' : 'none';
    }
  });
});
