/* ============================================================
   Site-wide micro-interactions for drchristopherbutler.com
   Brand-aligned, opt-in via classes/attributes:
     [data-reveal]        → fade + rise into view on scroll
     .split-reveal        → words slide up on load (hero headings)
     [data-count]         → number counts up when scrolled into view
     .tilt-card           → gentle 3D tilt toward cursor
   All effects respect prefers-reduced-motion.
   ============================================================ */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Scroll reveal ---- */
  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('reveal-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var delay = en.target.getAttribute('data-reveal-delay');
          if (delay) en.target.style.transitionDelay = delay + 'ms';
          en.target.classList.add('reveal-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- Split reveal headings (wrap each word) ---- */
  function initSplit() {
    var heads = document.querySelectorAll('.split-reveal');
    heads.forEach(function (h) {
      if (h.dataset.splitDone) return;
      h.dataset.splitDone = '1';
      if (reduceMotion) return;
      var words = h.textContent.trim().split(/\s+/);
      h.textContent = '';
      words.forEach(function (w, i) {
        var mask = document.createElement('span');
        mask.className = 'sr-mask';
        var inner = document.createElement('span');
        inner.className = 'sr-word';
        inner.textContent = w;
        inner.style.animationDelay = (i * 0.08) + 's';
        mask.appendChild(inner);
        h.appendChild(mask);
        if (i < words.length - 1) h.appendChild(document.createTextNode(' '));
      });
    });
  }

  /* ---- Animated counters ---- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dur = parseInt(el.getAttribute('data-count-dur') || '1400', 10);
    var prefix = el.getAttribute('data-count-prefix') || '';
    var suffix = el.getAttribute('data-count-suffix') || '';
    if (reduceMotion) { el.textContent = prefix + target.toLocaleString() + suffix; return; }
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.floor(eased * target);
      el.textContent = prefix + val.toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target.toLocaleString() + suffix;
    }
    requestAnimationFrame(tick);
  }
  function initCounters() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(animateCount); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- 3D tilt cards ---- */
  function initTilt() {
    if (reduceMotion || window.matchMedia('(hover: none)').matches) return;
    var cards = document.querySelectorAll('.tilt-card');
    cards.forEach(function (card) {
      var max = 6; // degrees — keep subtle
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(900px) rotateY(' + (px * max) + 'deg) rotateX(' + (-py * max) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  function init() {
    initReveal();
    initSplit();
    initCounters();
    initTilt();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
