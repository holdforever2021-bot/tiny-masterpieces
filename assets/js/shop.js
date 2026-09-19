/* ------------------------------------------------------------------
   shop.js — renders the themed catalogue and wires each design to the cart.

   Every card on the page comes from data/catalogue.js. Adding a design is
   one line of data; there is no markup to touch and no price to repeat.
   ------------------------------------------------------------------ */
(function () {
  'use strict';
  if (typeof DESIGNS === 'undefined') return;

  var $ = function (id) { return document.getElementById(id); };
  var money = function (n) {
    return '$' + (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, '');
  };
  var IMG = 'assets/img/shop/';

  function esc(s) {
    return String(s || '').replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }

  function designCard(d) {
    var priced = d.price > 0;
    return '' +
      '<article class="d-card" data-theme="' + d.theme + '">' +
        '<div class="d-shot"><img src="' + IMG + d.id + '.jpg" alt="' + esc(d.name) +
          '" loading="lazy" width="560"></div>' +
        '<div class="d-body">' +
          '<h4>' + esc(d.name) + '</h4>' +
          (d.note ? '<p class="d-note">' + esc(d.note) + '</p>' : '') +
          '<div class="d-foot">' +
            (priced
              ? '<span class="d-price">' + money(d.price) + '</span>' +
                '<button class="d-add" type="button" data-id="' + d.id + '">Add</button>'
              : '<span class="d-price soft">Free with an order</span>' +
                '<span class="d-ask">just ask</span>') +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderThemes() {
    var host = $('themeShop');
    if (!host) return;
    host.innerHTML = THEMES.map(function (t) {
      var rows = DESIGNS.filter(function (d) { return d.theme === t.id; });
      if (!rows.length) return '';
      return '' +
        '<section class="theme" id="theme-' + t.id + '">' +
          '<div class="theme-head">' +
            '<h3>' + esc(t.name) + '</h3>' +
            '<p>' + esc(t.blurb) + '</p>' +
            '<span class="theme-count">' + rows.length + ' design' + (rows.length > 1 ? 's' : '') + '</span>' +
          '</div>' +
          '<div class="d-grid">' + rows.map(designCard).join('') + '</div>' +
        '</section>';
    }).join('');

    host.addEventListener('click', function (e) {
      var b = e.target.closest('.d-add');
      if (!b || !window.TM) return;
      var d = DESIGNS.filter(function (x) { return x.id === b.dataset.id; })[0];
      if (!d) return;
      window.TM.addDesign(d);
      b.textContent = 'Added';
      setTimeout(function () { b.textContent = 'Add'; }, 1100);
    });
  }

  function renderSets() {
    var host = $('setGrid');
    if (!host) return;
    host.innerHTML = SETS.map(function (s) {
      return '' +
        '<article class="set-card">' +
          '<div class="set-shot"><img src="' + s.img + '" alt="' + esc(s.name) + '" loading="lazy"></div>' +
          '<h4>' + esc(s.name) + '</h4>' +
          '<p class="d-note">' + esc(s.blurb) + '</p>' +
          '<ul class="set-items">' + s.items.map(function (i) {
            return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>' +
          '<div class="d-foot">' +
            '<span class="d-price">' + money(s.price) + '</span>' +
            '<button class="d-add set-add" type="button" data-id="' + s.id + '">Add set</button>' +
          '</div>' +
        '</article>';
    }).join('');

    host.addEventListener('click', function (e) {
      var b = e.target.closest('.set-add');
      if (!b || !window.TM) return;
      var s = SETS.filter(function (x) { return x.id === b.dataset.id; })[0];
      if (!s) return;
      window.TM.addDesign({ id: s.id, name: s.name, price: s.price,
                            t: 'set', note: s.items.join(', ') });
      b.textContent = 'Added';
      setTimeout(function () { b.textContent = 'Add set'; }, 1100);
    });
  }

  /* Filter chips. Purely client-side — the whole catalogue is already on the
     page, so filtering is hiding, not fetching. */
  function renderFilters() {
    var host = $('themeFilters');
    if (!host) return;
    host.innerHTML = '<button class="chip on" data-f="all" type="button">Everything</button>' +
      THEMES.map(function (t) {
        var n = DESIGNS.filter(function (d) { return d.theme === t.id; }).length;
        return n ? '<button class="chip" data-f="' + t.id + '" type="button">' + esc(t.name) + '</button>' : '';
      }).join('');

    host.addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      Array.prototype.forEach.call(host.querySelectorAll('.chip'), function (c) {
        c.classList.toggle('on', c === b);
      });
      var f = b.dataset.f;
      Array.prototype.forEach.call(document.querySelectorAll('.theme'), function (sec) {
        sec.hidden = !(f === 'all' || sec.id === 'theme-' + f);
      });
    });
  }

  function init() { renderFilters(); renderThemes(); renderSets(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
