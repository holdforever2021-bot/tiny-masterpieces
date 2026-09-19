/* ------------------------------------------------------------------
   lightbox.js — click any product to see it large.

   Delegated from the document, so it covers every tile the shop renders
   without needing to re-bind when a filter changes. Arrow keys and the
   on-screen chevrons step through whatever is currently visible, which
   means filtering to one theme also narrows the lightbox to that theme.
   ------------------------------------------------------------------ */
(function () {
  'use strict';

  var box, img, cap, items = [], idx = 0, lastFocus = null;

  function visibleTiles() {
    // Only tiles the visitor can actually see — a hidden theme is not in the set.
    return Array.prototype.filter.call(
      document.querySelectorAll('.d-shot img, .set-shot img, .about-figure img'),
      function (el) { return el.offsetParent !== null; });
  }

  function labelFor(el) {
    var card = el.closest('.d-card, .set-card, .about-figure');
    if (!card) return el.alt || '';
    var h = card.querySelector('h4, figcaption');
    var price = card.querySelector('.d-price');
    return (h ? h.textContent.trim() : el.alt || '') +
           (price && !/per \$/.test(price.textContent) ? ' — ' + price.textContent.trim() : '');
  }

  function show(i) {
    if (!items.length) return;
    idx = (i + items.length) % items.length;
    var el = items[idx];
    img.src = el.currentSrc || el.src;
    img.alt = el.alt || '';
    cap.textContent = labelFor(el);
    var many = items.length > 1;
    box.querySelector('.lb-prev').hidden = !many;
    box.querySelector('.lb-next').hidden = !many;
  }

  function open(el) {
    items = visibleTiles();
    var i = items.indexOf(el);
    if (i < 0) { items = [el]; i = 0; }
    lastFocus = document.activeElement;
    box.hidden = false; box.classList.add('open');
    document.body.style.overflow = 'hidden';
    show(i);
    box.querySelector('.lb-close').focus();
  }

  function close() {
    box.hidden = true;  box.classList.remove('open');
    img.src = '';
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  function init() {
    box = document.getElementById('lightbox');
    if (!box) return;
    img = document.getElementById('lbImg');
    cap = document.getElementById('lbCap');

    document.addEventListener('click', function (e) {
      var t = e.target.closest('.d-shot img, .set-shot img, .about-figure img');
      if (t) { e.preventDefault(); open(t); return; }
      if (e.target.closest('.lb-close')) return close();
      if (e.target.closest('.lb-prev')) return show(idx - 1);
      if (e.target.closest('.lb-next')) return show(idx + 1);
      // clicking the backdrop closes; clicking the image itself does not
      if (box.classList.contains('open') && e.target === box) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });

    /* Product shots become buttons in spirit — they are clickable, so say so
       to a screen reader and give them a pointer cursor. */
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest('.d-shot img, .set-shot img');
      if (t && !t.dataset.zoomable) {
        t.dataset.zoomable = '1';
        t.setAttribute('role', 'button');
        t.setAttribute('tabindex', '0');
        t.title = 'Click to enlarge';
      }
    });

    document.addEventListener('keypress', function (e) {
      var t = e.target.closest('.d-shot img, .set-shot img');
      if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(t); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
