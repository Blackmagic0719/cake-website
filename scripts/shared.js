/* ═══════════════════════════════════════
   BAKEIT — SHARED UTILITIES
   ═══════════════════════════════════════ */

// ── TOAST NOTIFICATIONS ──
function showToast(msg, type = 'default', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', warning: '⚠️', default: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]||icons.default}</span><span>${msg}</span>`;
  toast.onclick = () => removeToast(toast);
  container.appendChild(toast);
  setTimeout(() => removeToast(toast), duration);
}
function removeToast(el) {
  el.style.animation = 'toastOut 0.3s forwards';
  setTimeout(() => el.remove(), 300);
}

// ── AUTH HELPERS ──
function getUser() { return JSON.parse(localStorage.getItem('user')); }
function requireAuth() {
  const user = getUser();
  if (!user) { window.location.href = 'login.html'; return null; }
  return user;
}
function requireAdmin() {
  const user = requireAuth();
  if (user && user.email !== 'admin@gmail.com') {
    window.location.href = 'index.html';
    return null;
  }
  return user;
}
function logout() { localStorage.removeItem('user'); window.location.href = 'login.html'; }

// ── CART HELPERS ──
function getCart() { return JSON.parse(localStorage.getItem('cart')) || []; }
function saveCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); }
function getCartCount() { return getCart().reduce((sum, i) => sum + i.qty, 0); }

// ── ORDER HELPERS ──
function getOrders() { return JSON.parse(localStorage.getItem('orders')) || []; }
function saveOrders(orders) { localStorage.setItem('orders', JSON.stringify(orders)); }

// ── NOTIFICATION HELPERS ──
function getNotifications() { return JSON.parse(localStorage.getItem('notifications')) || []; }
function addNotification(msg, type = 'info') {
  const n = getNotifications();
  n.unshift({ msg, type, time: new Date().toISOString(), read: false });
  localStorage.setItem('notifications', JSON.stringify(n.slice(0, 50)));
}
function getUnreadCount() { return getNotifications().filter(n => !n.read).length; }

// ── SCROLL ANIMATIONS ──
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-up').forEach((el, i) => {
    if (!el.dataset.delay) el.dataset.delay = i * 80;
    observer.observe(el);
  });
}

// ── NAVBAR SCROLL EFFECT ──
function initNavScroll(navId = 'navbar') {
  const nav = document.getElementById(navId);
  if (!nav) return;
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20), { passive: true });
}

// ── FORMAT CURRENCY ──
function formatRs(amount) {
  return 'Rs.' + Number(amount).toLocaleString('en-LK');
}

// ── FORMAT DATE ──
function formatDate(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}
function formatDateTime(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  return d.toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
}

// ── ORDER STATUS ──
const STATUS_CONFIG = {
  'Pending':    { cls: 'badge-pending',    icon: '🕐', label: 'Pending' },
  'Price Set':  { cls: 'badge-price-set',  icon: '💰', label: 'Price Set' },
  'Delivering': { cls: 'badge-delivering', icon: '🚚', label: 'Out for Delivery' },
  'Delivered':  { cls: 'badge-delivered',  icon: '✅', label: 'Delivered' },
  'Cancelled':  { cls: 'badge-cancelled',  icon: '❌', label: 'Cancelled' },
};
function statusBadge(status) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Pending'];
  return `<span class="badge ${cfg.cls}">${cfg.icon} ${cfg.label}</span>`;
}

// ── RENDER NAV AUTH AREA ──
function renderAuthArea(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const user = getUser();
  if (!user) {
    el.innerHTML = `
      <button class="btn-ghost btn-sm" onclick="location.href='login.html'">Login</button>
      <button class="btn-primary btn-sm" onclick="location.href='signup.html'">Sign Up</button>`;
  } else {
    const cartBadge = `<span style="position:absolute;top:-4px;right:-4px;background:var(--rose);color:white;font-size:10px;font-weight:700;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;" id="navCartBadge">${getCartCount()||''}</span>`;
    let html = '';
    if (user.email !== 'admin@gmail.com') {
      html += `<div style="position:relative;cursor:pointer;" onclick="location.href='product.html'" title="Cart">
        <div class="nav-icon"><svg viewBox="0 0 24 24" width="17" height="17" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="opacity:.65"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div>
        ${getCartCount() > 0 ? cartBadge : ''}
      </div>`;
      html += `<div class="nav-icon" onclick="location.href='myorders.html'" title="My Orders"><img src="images/user.png" style="width:18px;height:18px;border-radius:50%;object-fit:cover;"></div>`;
    }
    if (user.email === 'admin@gmail.com') {
      html += `<button class="btn-primary btn-sm" onclick="location.href='admin.html'">⚙️ Admin</button>`;
    }
    html += `<button class="btn-ghost btn-sm" onclick="logout()">Logout</button>`;
    el.innerHTML = html;
  }
}
