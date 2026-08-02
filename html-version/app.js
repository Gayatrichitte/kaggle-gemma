/* ============================================================
   app.js – Shared utilities for EduMetric HTML version
   ============================================================ */

/* ── Toast ──────────────────────────────────────────────────── */
function showToast(message, duration = 2200) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), duration);
}

/* ── Copy to clipboard ──────────────────────────────────────── */
async function copyToClipboard(text, btn, originalHTML) {
  try { await navigator.clipboard.writeText(text); } catch (_) {}
  btn.innerHTML = '✓ Copied!';
  btn.classList.add('btn-success');
  btn.classList.remove('btn-primary');
  showToast('Copied to clipboard!');
  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.classList.remove('btn-success');
    btn.classList.add('btn-primary');
  }, 2200);
}

/* ── Progress bar helper ────────────────────────────────────── */
function setProgress(barEl, value) {
  barEl.style.width = Math.min(100, Math.max(0, value)) + '%';
}

/* ── Simulate file upload ───────────────────────────────────── */
function simulateUpload(progressBar, pctLabel, onDone) {
  let pct = 0;
  const iv = setInterval(() => {
    pct += Math.random() * 22;
    if (pct >= 100) { pct = 100; clearInterval(iv); onDone(); }
    setProgress(progressBar, pct);
    if (pctLabel) pctLabel.textContent = Math.round(pct) + '%';
  }, 180);
}

/* ── Nav active state ───────────────────────────────────────── */
function markActiveNav() {
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.side-nav a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
}

document.addEventListener('DOMContentLoaded', markActiveNav);
