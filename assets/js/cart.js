/* ------------------------------------------------------------------
   cart.js — shop rendering, cart, and checkout.

   No framework, no bundler, no npm. Prices come from data/site-config.js
   and are never written here; this file does maths and DOM only.

   Nothing is charged on this site. Checkout collects an order and hands
   it off (mailto today), so the payment decision stays open. `submitOrder`
   is the single seam — swap it for Formspree, a Worker, or Stripe later
   and nothing else changes.
   ------------------------------------------------------------------ */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var money = function (n) {
    return '$' + (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, '');
  };

  var cart = [];          // [{pid, name, option, unit, qty}]
  var LS = 'tm_cart_v1';

  // ---------------------------------------------------------------- data
  function product(pid) {
    for (var i = 0; i < STOCK.length; i++) { if (STOCK[i].id === pid) return STOCK[i]; }
    return null;
  }

  /* Bundle pricing is per PRODUCT, not per line: three bracelets are three
     bracelets whether or not they are the same colour. So the discount is
     computed across every line of that product, then shared back out. */
  function lineTotals() {
    var byProduct = {}, i, it;
    for (i = 0; i < cart.length; i++) {
      it = cart[i];
      (byProduct[it.pid] = byProduct[it.pid] || []).push(it);
    }
    var totals = {};
    for (var pid in byProduct) {
      var p = product(pid), rows = byProduct[pid];
      var qty = 0, list = 0;
      for (i = 0; i < rows.length; i++) { qty += rows[i].qty; list += rows[i].unit * rows[i].qty; }

      var charged = list;
      if (p && p.bundle && qty > 0) {
        // Tier price assumes the cheapest option; anything dearer keeps its
        // premium, so "with charm" is never silently sold at Classic price.
        var base = Math.min.apply(null, p.options.map(function (o) { return o.price; }));
        var left = qty, t = 0;
        p.bundle.forEach(function (b) { while (left >= b[0]) { t += b[1]; left -= b[0]; } });
        var premium = 0;
        for (i = 0; i < rows.length; i++) { premium += (rows[i].unit - base) * rows[i].qty; }
        charged = Math.min(list, t + premium);
      }
      for (i = 0; i < rows.length; i++) {
        var share = list > 0 ? (rows[i].unit * rows[i].qty) / list : 0;
        totals[key(rows[i])] = charged * share;
      }
    }
    return totals;
  }

  function key(it) { return it.pid + '|' + it.option; }

  function subtotal() {
    var t = lineTotals(), sum = 0;
    for (var k in t) { sum += t[k]; }
    return sum;
  }

  function count() {
    var n = 0;
    for (var i = 0; i < cart.length; i++) { n += cart[i].qty; }
    return n;
  }

  function savings() {
    var list = 0;
    for (var i = 0; i < cart.length; i++) { list += cart[i].unit * cart[i].qty; }
    return Math.max(0, list - subtotal());
  }

  // ---------------------------------------------------------------- state
  function save() {
    try { localStorage.setItem(LS, JSON.stringify(cart)); } catch (e) {}
  }
  function load() {
    try {
      var raw = localStorage.getItem(LS);
      cart = raw ? (JSON.parse(raw) || []) : [];
      // Drop anything whose product or option no longer exists, so an old
      // basket cannot resurrect a discontinued price.
      cart = cart.filter(function (it) {
        var p = product(it.pid);
        return p && p.options.some(function (o) { return o.label === it.option; });
      });
    } catch (e) { cart = []; }
  }

  function add(pid, option, qty) {
    var p = product(pid); if (!p) return;
    var opt = null;
    for (var i = 0; i < p.options.length; i++) {
      if (p.options[i].label === option) { opt = p.options[i]; }
    }
    if (!opt) return;
    qty = Math.max(1, parseInt(qty, 10) || 1);
    for (i = 0; i < cart.length; i++) {
      if (cart[i].pid === pid && cart[i].option === option) {
        cart[i].qty = Math.min(999, cart[i].qty + qty);
        return done(p.name + ' ×' + qty + ' added');
      }
    }
    cart.push({ pid: pid, name: p.name, option: option, unit: opt.price, qty: qty });
    done(p.name + ' ×' + qty + ' added');
  }

  function setQty(i, n) {
    n = parseInt(n, 10);
    if (!n || n < 1) { cart.splice(i, 1); } else { cart[i].qty = Math.min(999, n); }
    done();
  }

  function done(msg) { save(); renderCart(); renderBadge(); if (msg) toast(msg); }

  // ---------------------------------------------------------------- shop
  /* Only bracelets live outside the design catalogue now — they have tiered
     pricing rather than a per-design price, so they get their own block. */
  function renderShop() {
    var sel = $('opt-bracelet'); if (!sel) return;
    var p = product('bracelet'); if (!p) return;
    sel.innerHTML = p.options.map(function (o) {
      return '<option value="' + o.label + '">' + o.label + ' — ' + money(o.price) + '</option>';
    }).join('');
    document.querySelector('.brac-buy .btn-add').addEventListener('click', function () {
      add('bracelet', sel.value, $('qty-bracelet').value);
    });
    return;
  }
  function renderShopOld() {
    var host = $('shopGrid'); if (!host) return;
    host.innerHTML = '';
    STOCK.forEach(function (p) {
      var art = document.createElement('article');
      art.className = 'card';
      var opts = p.options.map(function (o, i) {
        return '<option value="' + o.label + '">' + o.label + ' — ' + money(o.price) + '</option>';
      }).join('');
      var thumb = p.img
        ? '<div class="thumb"><img src="' + p.img + '" alt="' + p.name + '"></div>'
        : '<div class="thumb" style="display:grid;place-items:center;min-height:130px">' +
          '<span style="font-family:Mali,cursive;font-size:2.4rem;color:var(--purple)">' +
          money(p.options[0].price) + '</span></div>';
      var bundleNote = p.bundle
        ? '<p class="note"><strong>Bundle:</strong> ' + p.bundle.map(function (b) {
            return b[0] + ' for ' + money(b[1]);
          }).join(' · ') + '</p>'
        : '';
      art.innerHTML =
        '<span class="badge b-now">In stock</span>' + thumb +
        '<h3>' + p.name + '</h3><div class="swatch ' + p.swatch + '"></div>' +
        '<ul class="prices">' + p.options.map(function (o) {
          return '<li><span>' + o.label + '</span><span class="dots"></span>' +
                 '<span class="amt">' + money(o.price) + '</span></li>';
        }).join('') + '</ul>' +
        bundleNote +
        '<p class="note">' + p.note + '</p>' +
        '<div class="buy">' +
          '<label class="sr-only" for="opt-' + p.id + '">Option for ' + p.name + '</label>' +
          '<select id="opt-' + p.id + '">' + opts + '</select>' +
          '<label class="sr-only" for="qty-' + p.id + '">Quantity of ' + p.name + '</label>' +
          '<input id="qty-' + p.id + '" type="number" min="1" max="999" value="1" inputmode="numeric">' +
          '<button class="btn-add" type="button" data-pid="' + p.id + '">Add to cart</button>' +
        '</div>';
      host.appendChild(art);
    });
    host.addEventListener('click', function (e) {
      var b = e.target.closest('.btn-add'); if (!b) return;
      var pid = b.dataset.pid;
      add(pid, $('opt-' + pid).value, $('qty-' + pid).value);
    });
  }

  // ---------------------------------------------------------------- cart UI
  function renderBadge() {
    var b = $('cartCount'); if (!b) return;
    var n = count();
    b.textContent = n;
    b.hidden = n === 0;
    var btn = $('cartBtn');
    if (btn) { btn.setAttribute('aria-label', n ? 'Cart, ' + n + ' items' : 'Cart, empty'); }
  }

  function renderCart() {
    var ul = $('cartLines'); if (!ul) return;
    ul.innerHTML = '';
    var totals = lineTotals();

    if (!cart.length) {
      ul.innerHTML = '<li class="empty">Your cart is empty. Add something from Order now.</li>';
    }

    cart.forEach(function (it, i) {
      var li = document.createElement('li');
      li.className = 'cart-line';
      li.innerHTML =
        '<div class="cl-main"><strong>' + it.name + '</strong>' +
          '<span class="cl-opt">' + it.option + ' · ' + money(it.unit) + ' each</span></div>' +
        '<div class="cl-qty">' +
          '<button type="button" class="q" data-act="dec" data-i="' + i + '" aria-label="One fewer">−</button>' +
          '<input type="number" min="0" max="999" value="' + it.qty + '" data-i="' + i + '" aria-label="Quantity">' +
          '<button type="button" class="q" data-act="inc" data-i="' + i + '" aria-label="One more">+</button>' +
        '</div>' +
        '<div class="cl-amt">' + money(totals[key(it)] || 0) + '</div>' +
        '<button type="button" class="cl-x" data-act="rm" data-i="' + i + '" aria-label="Remove ' + it.name + '">×</button>';
      ul.appendChild(li);
    });

    var sv = savings();
    $('cartSaved').hidden = sv < 0.005;
    $('cartSaved').textContent = 'Bundle saving −' + money(sv);
    $('cartTotal').textContent = money(subtotal());
    $('toCheckout').disabled = cart.length === 0;
  }

  function wireCart() {
    var ul = $('cartLines');
    ul.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return;
      var i = +b.dataset.i;
      if (b.dataset.act === 'inc') setQty(i, cart[i].qty + 1);
      if (b.dataset.act === 'dec') setQty(i, cart[i].qty - 1);
      if (b.dataset.act === 'rm') { cart.splice(i, 1); done(); }
    });
    ul.addEventListener('change', function (e) {
      if (e.target.matches('input[type=number]')) setQty(+e.target.dataset.i, e.target.value);
    });
  }

  // ---------------------------------------------------------------- drawer
  var lastFocus = null;
  function openDrawer() {
    lastFocus = document.activeElement;
    $('drawer').classList.add('open');
    $('scrim').hidden = false;
    document.body.style.overflow = 'hidden';
    $('closeCart').focus();
  }
  function closeDrawer() {
    $('drawer').classList.remove('open');
    $('scrim').hidden = true;
    document.body.style.overflow = '';
    showPanel('cart');
    if (lastFocus) lastFocus.focus();
  }

  function showPanel(which) {
    $('panelCart').hidden = which !== 'cart';
    $('panelCheckout').hidden = which !== 'checkout';
    $('panelDone').hidden = which !== 'done';
    $('drawerTitle').textContent =
      which === 'cart' ? 'Your cart' : which === 'checkout' ? 'Checkout' : 'Order sent';
  }

  // ---------------------------------------------------------------- checkout
  function orderRef() {
    // Human-readable and short enough to read down a phone.
    var d = new Date();
    var n = (d.getMonth() + 1) * 1000000 + d.getDate() * 10000 +
            d.getHours() * 100 + d.getMinutes();
    return 'TM-' + n.toString(36).toUpperCase();
  }

  function orderText(ref, f) {
    var totals = lineTotals(), lines = cart.map(function (it) {
      return '  ' + it.qty + ' × ' + it.name + ' (' + it.option + ') — ' +
             money(totals[key(it)] || 0);
    }).join('\n');
    var sv = savings();
    return 'Order ' + ref + '\n\n' + lines +
      (sv > 0.005 ? '\n\n  Bundle saving: −' + money(sv) : '') +
      '\n  TOTAL: ' + money(subtotal()) +
      '\n\nName: ' + f.name +
      '\nEmail: ' + f.email +
      (f.phone ? '\nPhone: ' + f.phone : '') +
      '\nHow: ' + f.fulfil +
      (f.addr ? '\nAddress: ' + f.addr : '') +
      '\nPayment preference: ' + f.pay +
      (f.notes ? '\n\nNotes:\n' + f.notes : '') +
      '\n\nNothing has been charged. ' + BRAND + ' will confirm the order first, then ' +
      'send payment details for Venmo or Zelle.';
  }

  /* THE SEAM. Everything above is host-agnostic. Replace this one function
     to post to Formspree, a Worker or a real backend. Returns true if the
     handoff was started. */
  function submitOrder(ref, body) {
    window.location.href = 'mailto:' + MAIL +
      '?subject=' + encodeURIComponent('Order ' + ref + ' — ' + BRAND) +
      '&body=' + encodeURIComponent(body);
    return true;
  }

  function renderCheckout() {
    var sel = $('coFulfil');
    if (!sel.options.length) {
      FULFILMENT.forEach(function (f) {
        var o = document.createElement('option'); o.value = o.textContent = f; sel.appendChild(o);
      });
      PAY_METHODS.forEach(function (m) {
        var o = document.createElement('option'); o.value = o.textContent = m; $('coPay').appendChild(o);
      });
      /* Shown but disabled: the gap reads as a roadmap rather than an omission,
         and nobody picks an option that cannot be honoured yet. */
      if (typeof PAY_SOON === 'string') {
        var soon = document.createElement('option');
        soon.textContent = PAY_SOON + ' — coming soon';
        soon.disabled = true;
        $('coPay').appendChild(soon);
      }
    }
    $('coTotal').textContent = money(subtotal());
    $('coCount').textContent = count() + (count() === 1 ? ' item' : ' items');
  }

  function wireCheckout() {
    // Address is only meaningful for delivery or shipping — hide it otherwise
    // rather than asking for a home address that is not needed.
    $('coFulfil').addEventListener('change', function () {
      var needs = /deliver|ship/i.test(this.value);
      $('coAddrWrap').hidden = !needs;
      $('coAddr').required = needs;
    });

    $('checkoutForm').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!cart.length) return;
      var f = {
        name: $('coName').value.trim(),
        email: $('coEmail').value.trim(),
        phone: $('coPhone').value.trim(),
        fulfil: $('coFulfil').value,
        addr: $('coAddrWrap').hidden ? '' : $('coAddr').value.trim(),
        pay: $('coPay').value,
        notes: $('coNotes').value.trim()
      };
      var ref = orderRef();
      var body = orderText(ref, f);
      if (submitOrder(ref, body)) {
        $('doneRef').textContent = ref;
        $('doneSummary').textContent = count() + ' items · ' + money(subtotal());
        try { $('copyBody').value = body; } catch (er) {}
        showPanel('done');
        cart = []; done();
      }
    });

    $('copyOrder').addEventListener('click', function () {
      var ta = $('copyBody');
      ta.hidden = false; ta.select();
      try { document.execCommand('copy'); toast('Order copied'); } catch (er) {}
    });
  }

  // ---------------------------------------------------------------- toast
  var toastTimer = null;
  function toast(msg) {
    var t = $('toast'); if (!t) return;
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2200);
  }

  // ---------------------------------------------------------------- boot
  function init() {
    if (typeof STOCK === 'undefined') return;
    load();
    renderShop();
    wireCart();
    wireCheckout();
    renderCart();
    renderBadge();

    $('cartBtn').addEventListener('click', openDrawer);
    $('closeCart').addEventListener('click', closeDrawer);
    $('scrim').addEventListener('click', closeDrawer);
    $('toCheckout').addEventListener('click', function () {
      renderCheckout(); showPanel('checkout'); $('coName').focus();
    });
    $('backToCart').addEventListener('click', function () { showPanel('cart'); });
    $('doneClose').addEventListener('click', closeDrawer);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && $('drawer').classList.contains('open')) closeDrawer();
    });

    // Brand name everywhere it is marked, so it is changed in one place.
    Array.prototype.forEach.call(document.querySelectorAll('[data-brand]'), function (el) {
      el.textContent = BRAND;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

  /* A named design is a cart line in its own right — "Bookmark · Just One More
     Chapter" rather than a generic "Bookmark". That is what makes the order email
     actionable without a phone call. */
  function addDesign(d) {
    var label = d.t === 'set' ? 'Set' :
                d.t === 'card' ? 'Greeting card' :
                d.t === 'bookmark' ? 'Bookmark' : 'Item';
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].pid === d.id) { cart[i].qty = Math.min(999, cart[i].qty + 1);
        return done(d.name + ' added'); }
    }
    cart.push({ pid: d.id, name: label, option: d.name, unit: d.price, qty: 1 });
    done(d.name + ' added');
  }

  window.TM = { add: add, addDesign: addDesign, open: openDrawer, count: count, subtotal: subtotal,
                _cart: function () { return cart; }, _lineTotals: lineTotals };
})();
