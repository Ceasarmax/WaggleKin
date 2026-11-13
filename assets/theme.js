/* WaggleKin theme — progressive enhancements (no dependencies) */
(function () {
  'use strict';

  const T = window.theme || {};
  const routes = Object.assign({ root: '/', cart: '/cart', cartAdd: '/cart/add', cartChange: '/cart/change', recommendations: '/recommendations/products', predictiveSearch: '/search/suggest' }, T.routes || {});
  const strings = Object.assign({ addToCart: 'Add to cart', soldOut: 'Sold out', unavailable: 'Unavailable', added: 'Added to cart', viewCart: 'View cart', cartError: 'Something went wrong. Please try again.', savePercent: 'Save [percent]%' }, T.strings || {});

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function money(cents) {
    const currency = (window.Shopify && window.Shopify.currency && window.Shopify.currency.active) || 'USD';
    try {
      return new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency }).format(cents / 100);
    } catch (e) {
      return '$' + (cents / 100).toFixed(2);
    }
  }
  function parseHTML(html) {
    return new DOMParser().parseFromString(html, 'text/html');
  }
  // Parse a fetch response as JSON without surfacing raw parser errors (e.g. HTML error pages)
  function readJSON(r) {
    return r.text().then((text) => {
      let data = {};
      try { data = JSON.parse(text); } catch (e) { data = {}; }
      return { ok: r.ok, data };
    });
  }

  /* ---------------------------------------------------------------- Navigation */
  const navToggle = document.querySelector('[data-nav-toggle]');
  const siteNav = navToggle && navToggle.closest('.site-header').querySelector('.site-nav');
  function setNav(open) {
    if (!siteNav) return;
    siteNav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('has-nav-open', open);
    // size the menu from where it actually starts (below announcement bar + header) so the last link is reachable
    siteNav.style.maxHeight = open ? Math.max(240, window.innerHeight - siteNav.getBoundingClientRect().top) + 'px' : '';
  }
  if (navToggle && siteNav) navToggle.addEventListener('click', () => setNav(!siteNav.classList.contains('is-open')));

  const dropdowns = Array.from(document.querySelectorAll('[data-nav-dropdown]'));
  const desktop = window.matchMedia('(min-width: 990px)');
  dropdowns.forEach((dd) => {
    dd.addEventListener('toggle', () => {
      if (dd.open) dropdowns.forEach((other) => { if (other !== dd) other.open = false; });
    });
    dd.parentElement.addEventListener('mouseenter', () => { if (desktop.matches) { dd.open = true; dd.dataset.hoverOpened = '1'; } });
    dd.parentElement.addEventListener('mouseleave', () => { if (desktop.matches) { dd.open = false; delete dd.dataset.hoverOpened; } });
    const summary = dd.querySelector('summary');
    if (summary) {
      summary.addEventListener('click', (event) => {
        // hover already opened it: a click shouldn't snap it shut
        if (desktop.matches && dd.open && dd.dataset.hoverOpened) { event.preventDefault(); delete dd.dataset.hoverOpened; }
      });
    }
  });
  document.addEventListener('click', (event) => {
    dropdowns.forEach((dd) => { if (dd.open && !dd.contains(event.target)) dd.open = false; });
    if (siteNav && siteNav.classList.contains('is-open') && !siteNav.contains(event.target) && !navToggle.contains(event.target)) setNav(false);
  });

  document.querySelectorAll('[data-search-toggle]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const drawer = link.closest('.site-header').querySelector('[data-search-drawer]');
      if (!drawer) return;
      event.preventDefault();
      drawer.hidden = !drawer.hidden;
      link.setAttribute('aria-expanded', String(!drawer.hidden));
      if (!drawer.hidden) drawer.querySelector('input[type="search"]').focus();
    });
  });

  // Search as you type (Shopify Predictive Search API, rendered by sections/predictive-search.liquid)
  document.querySelectorAll('[data-predictive-form]').forEach((form) => {
    const input = form.querySelector('[data-predictive-input]');
    const target = form.parentElement.querySelector('[data-predictive-target]');
    if (!input || !target || !routes.predictiveSearch) return;
    let timer;
    let controller;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      const q = input.value.trim();
      if (q.length < 2) { if (controller) controller.abort(); target.innerHTML = ''; return; }
      timer = setTimeout(() => {
        if (controller) controller.abort();
        controller = window.AbortController ? new AbortController() : null;
        const url = `${routes.predictiveSearch}?q=${encodeURIComponent(q)}&section_id=predictive-search&resources[type]=product,collection,query&resources[limit]=6&resources[limit_scope]=each&resources[options][unavailable_products]=last`;
        fetch(url, controller ? { signal: controller.signal } : {})
          .then((r) => r.text())
          .then((html) => {
            if (input.value.trim() !== q) return; // the shopper has typed something else since
            const results = parseHTML(html).querySelector('[data-predictive-results]');
            target.innerHTML = results ? results.outerHTML : '';
          })
          .catch(() => {});
      }, 250);
    });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        const first = target.querySelector('[data-predictive-item]');
        if (first) { event.preventDefault(); first.focus(); }
      }
    });
    target.addEventListener('keydown', (event) => {
      const items = Array.from(target.querySelectorAll('[data-predictive-item]'));
      const i = items.indexOf(document.activeElement);
      if (i === -1) return;
      if (event.key === 'ArrowDown' && items[i + 1]) { event.preventDefault(); items[i + 1].focus(); }
      if (event.key === 'ArrowUp') { event.preventDefault(); (items[i - 1] || input).focus(); }
    });
  });

  document.querySelectorAll('[data-country-select]').forEach((select) => {
    select.addEventListener('change', () => select.form.submit());
  });

  /* ---------------------------------------------------------------- Collection filters & sort */
  document.querySelectorAll('[data-sort-select]').forEach((select) => {
    select.addEventListener('change', () => {
      const url = new URL(window.location.href);
      url.searchParams.set('sort_by', select.value);
      url.searchParams.delete('page');
      window.location.href = url.toString();
    });
  });
  document.querySelectorAll('[data-facets-form]').forEach((form) => {
    // checkboxes apply instantly; the price fields use the Apply button
    form.addEventListener('change', (event) => {
      if (event.target.matches('[data-facet-input]')) form.requestSubmit ? form.requestSubmit() : form.submit();
    });
    form.addEventListener('submit', () => {
      // drop empty price inputs so the URL stays clean
      form.querySelectorAll('input[type="number"]').forEach((input) => { if (input.value === '') input.disabled = true; });
    });
  });

  /* ---------------------------------------------------------------- Toast */
  const toast = document.getElementById('CartToast');
  let toastTimer;
  function showToast(html) {
    if (!toast) return;
    toast.innerHTML = html;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 4000);
  }

  /* ---------------------------------------------------------------- Cart drawer */
  const DRAWER_SECTION = 'cart-drawer';
  let lastFocus = null;

  function getDrawer() { return document.querySelector('[data-cart-drawer]'); }

  function setCartCount(count) {
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      el.textContent = count;
      const pill = el.closest('.cart-pill');
      if (pill) {
        pill.classList.remove('is-bumped');
        void pill.offsetWidth;
        pill.classList.add('is-bumped');
      }
    });
  }

  function renderDrawer(html) {
    const drawer = getDrawer();
    if (!drawer || !html) return;
    const fresh = parseHTML(html).querySelector('[data-cart-drawer]');
    if (!fresh) return;
    const wasOpen = drawer.classList.contains('is-open');
    const oldPanel = drawer.querySelector('[data-cart-panel]');
    const scrollTop = oldPanel ? oldPanel.scrollTop : 0;
    const active = document.activeElement;
    const focusKey = active && drawer.contains(active) && active.closest('.drawer-item') ? active.closest('.drawer-item').dataset.key : null;
    const focusLabel = active && drawer.contains(active) ? active.getAttribute('aria-label') || active.textContent.trim() : null;
    const focusWasInside = active && drawer.contains(active);
    drawer.innerHTML = fresh.innerHTML;
    const panel = drawer.querySelector('[data-cart-panel]');
    if (panel) panel.scrollTop = scrollTop;
    if (wasOpen) {
      drawer.classList.add('is-open');
      loadUpsells(drawer);
      if (focusWasInside) {
        let target = null;
        if (focusKey) {
          const row = drawer.querySelector(`.drawer-item[data-key="${CSS.escape(focusKey)}"]`);
          if (row) target = Array.from(row.querySelectorAll('button')).find((b) => (b.getAttribute('aria-label') || b.textContent.trim()) === focusLabel) || row.querySelector('button');
        }
        (target || panel || drawer).focus();
      }
    }
  }

  function openDrawer() {
    const drawer = getDrawer();
    if (!drawer) return false;
    if (!drawer.classList.contains('is-open')) lastFocus = document.activeElement;
    drawer.classList.add('is-open');
    document.documentElement.classList.add('has-drawer');
    const panel = drawer.querySelector('[data-cart-panel]');
    if (panel) setTimeout(() => panel.focus(), 50);
    loadUpsells(drawer);
    return true;
  }

  function closeDrawer() {
    const drawer = getDrawer();
    if (!drawer || !drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    document.documentElement.classList.remove('has-drawer');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-cart-close]')) {
      event.preventDefault();
      closeDrawer();
      return;
    }
    const pill = event.target.closest('.cart-pill');
    if (pill && getDrawer() && T.cartType === 'drawer' && !document.body.classList.contains('template-cart') && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      openDrawer();
      return;
    }
    const change = event.target.closest('[data-line-change]');
    if (change) {
      event.preventDefault();
      changeLine(change.dataset.lineChange, parseInt(change.dataset.quantity, 10), change);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      dropdowns.forEach((dd) => { dd.open = false; });
      closeDrawer();
      if (siteNav && siteNav.classList.contains('is-open')) { setNav(false); navToggle.focus(); }
      document.querySelectorAll('[data-search-drawer]').forEach((d) => {
        if (!d.hidden) {
          d.hidden = true;
          const toggle = document.querySelector('[data-search-toggle]');
          if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
        }
      });
    }
    // keep keyboard focus inside the open drawer
    if (event.key === 'Tab') {
      const drawer = getDrawer();
      if (!drawer || !drawer.classList.contains('is-open')) return;
      const focusable = Array.from(drawer.querySelectorAll('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])')).filter((el) => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (focusable.indexOf(document.activeElement) === -1) { event.preventDefault(); (event.shiftKey ? last : first).focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  // Quantity changes are sent by line key (stable) and one at a time, so fast taps can't hit the wrong item
  let cartBusy = false;
  function changeLine(key, quantity, trigger) {
    if (cartBusy) return;
    const drawer = getDrawer();
    const item = trigger && trigger.closest('.drawer-item');
    cartBusy = true;
    if (drawer) drawer.classList.add('is-busy');
    if (item) item.classList.add('is-updating');
    fetch(routes.cartChange + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: key, quantity: Math.max(0, quantity), sections: [DRAWER_SECTION] }),
    })
      .then(readJSON)
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.description || data.message || strings.cartError);
        setCartCount(data.item_count);
        refreshFreeShipLine(data.total_price);
        if (data.sections) renderDrawer(data.sections[DRAWER_SECTION]);
      })
      .catch((error) => {
        if (item) item.classList.remove('is-updating');
        showToast(escapeHtml(error.message || strings.cartError));
      })
      .finally(() => {
        cartBusy = false;
        const d = getDrawer();
        if (d) d.classList.remove('is-busy');
      });
  }

  // Product page "Add $X more for free shipping" line follows the cart
  function refreshFreeShipLine(totalCents) {
    const line = document.querySelector('[data-free-ship-line]');
    const threshold = T.freeShippingThreshold || 0;
    if (!line || !threshold || typeof totalCents !== 'number') return;
    const remaining = threshold - totalCents;
    if (remaining > 0) line.innerHTML = (strings.freeShipRemaining || '').replace('[amount]', escapeHtml(money(remaining)));
    else line.textContent = strings.freeShipUnlocked || '';
  }

  // AJAX add to cart → open the drawer (falls back to the toast, then to a normal form post)
  document.addEventListener('submit', (event) => {
    const form = event.target.closest('.js-add-to-cart');
    if (!form || !window.fetch || !window.FormData) return;
    event.preventDefault();
    if (form.dataset.busy) return;
    form.dataset.busy = '1';
    const submitter = event.submitter || form.querySelector('[type="submit"]');
    const buttons = [submitter].concat(Array.from(document.querySelectorAll('[data-sticky-button]'))).filter(Boolean);
    buttons.forEach((b) => b.classList.add('is-loading'));

    // Send items[] as JSON: unlike a bare "id" field, Shopify checks stock for items[] and refuses sold-out variants
    const fd = new FormData(form);
    const line = { id: parseInt(fd.get('id'), 10), quantity: Math.max(1, parseInt(fd.get('quantity') || '1', 10) || 1) };
    const properties = {};
    fd.forEach((value, name) => {
      const m = name.match(/^properties\[(.+)\]$/);
      if (m && value !== '') properties[m[1]] = value;
    });
    if (Object.keys(properties).length) line.properties = properties;
    if (fd.get('selling_plan')) line.selling_plan = fd.get('selling_plan');
    const useDrawer = T.cartType === 'drawer' && !!getDrawer();
    const payload = { items: [line] };
    if (useDrawer) payload.sections = DRAWER_SECTION;

    fetch(routes.cartAdd + '.js', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) })
      .then(readJSON)
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.description || data.message || strings.cartError);
        if (document.body.classList.contains('template-cart')) {
          window.location.reload();
          return null;
        }
        const added = (data.items && data.items[0]) || {};
        if (useDrawer && data.sections) {
          renderDrawer(data.sections[DRAWER_SECTION]);
          openDrawer();
        } else {
          showToast(`${escapeHtml(added.product_title || strings.added)} &middot; <a href="${routes.cart}">${escapeHtml(strings.viewCart)}</a>`);
        }
        // refresh the header count + product-page shipping line (a failure here doesn't undo the add)
        return fetch(routes.cart + '.js', { headers: { Accept: 'application/json' } })
          .then(readJSON)
          .then(({ ok: cartOk, data: cart }) => {
            if (!cartOk) return;
            setCartCount(cart.item_count);
            refreshFreeShipLine(cart.total_price);
          })
          .catch(() => {});
      })
      .catch((error) => showToast(escapeHtml(error.message || strings.cartError)))
      .finally(() => {
        delete form.dataset.busy;
        buttons.forEach((b) => b.classList.remove('is-loading'));
      });
  });

  /* ---------------------------------------------------------------- Recommendations */
  const recSection = document.querySelector('[data-recommendations]');
  function recUrl(productId, intent, limit, sectionId) {
    return `${routes.recommendations}?section_id=${encodeURIComponent(sectionId)}&product_id=${encodeURIComponent(productId)}&limit=${limit}&intent=${intent}`;
  }

  if (recSection && recSection.dataset.productId) {
    const sectionId = recSection.dataset.sectionId;
    const productId = recSection.dataset.productId;
    const limit = recSection.dataset.limit || 4;
    const body = recSection.querySelector('[data-recommendations-body]');

    // "You may also like": optionally swap the same-category picks for Shopify's related picks
    if (recSection.dataset.useShopify === 'true') fetch(recUrl(productId, 'related', limit, sectionId))
      .then((r) => r.text())
      .then((html) => {
        const related = parseHTML(html).querySelector('[data-recommendations-related]');
        // Keep China-shipped "Value Picks" out of recommendations for US-shipped products
        if (related && recSection.dataset.ship === 'us') {
          related.querySelectorAll('.product-card').forEach((card) => { if (card.querySelector('.delivery-badge--global')) card.remove(); });
        }
        if (related && body && related.querySelectorAll('.product-card').length >= 2) {
          body.innerHTML = related.innerHTML;
        }
        if (body && !body.querySelector('.product-card')) recSection.hidden = true;
      })
      .catch(() => { if (body && !body.querySelector('.product-card')) recSection.hidden = true; });

    // "Pairs well with" on the product page (complementary products from Search & Discovery)
    const complementary = document.querySelector('[data-complementary]');
    if (complementary) {
      fetch(recUrl(productId, 'complementary', 3, sectionId))
        .then((r) => r.text())
        .then((html) => {
          const block = parseHTML(html).querySelector('[data-recommendations-complementary]');
          if (block && block.querySelector('.mini-product')) {
            complementary.innerHTML = block.innerHTML;
            complementary.hidden = false;
          }
        })
        .catch(() => {});
    }
  }

  // "Complete your order" in the cart drawer / cart page
  function loadUpsells(scope) {
    (scope || document).querySelectorAll('[data-cart-upsell]').forEach((box) => {
      const productId = box.dataset.productId;
      if (!productId || box.dataset.loadedFor === productId) return;
      box.dataset.loadedFor = productId;
      fetch(recUrl(productId, 'complementary', 8, 'cart-upsell'))
        .then((r) => r.text())
        .then((html) => {
          const upsell = parseHTML(html).querySelector('[data-upsell-body]');
          if (upsell && upsell.querySelector('.mini-product')) {
            box.innerHTML = upsell.innerHTML;
            box.hidden = false;
          }
        })
        .catch(() => {});
    });
  }
  // Cart page: load "Complete your order" straight away (the drawer loads its own when opened)
  document.querySelectorAll('.cart-upsell--page').forEach((box) => loadUpsells(box.parentElement));

  /* ---------------------------------------------------------------- Product page */
  const productForm = document.querySelector('[data-product-form]');
  const variantsJson = document.querySelector('[data-product-json]');

  // Gallery: show one image at a time on desktop, swipe on mobile; thumbnails + variant images
  const slidesWrap = document.querySelector('[data-gallery-slides]');
  const thumbs = Array.from(document.querySelectorAll('[data-thumb]'));
  const counter = document.querySelector('[data-gallery-index]');
  const mobile = window.matchMedia('(max-width: 989px)');

  function preloadMedia(mediaId) {
    if (!slidesWrap || !mediaId) return null;
    const target = Array.from(slidesWrap.children).find((s) => s.dataset.mediaId === String(mediaId));
    const img = target && target.querySelector('img');
    if (img && img.loading === 'lazy') img.loading = 'eager';
    return img;
  }

  let mediaToken = 0;
  function showMedia(mediaId, opts) {
    if (!slidesWrap || !mediaId) return;
    const token = (opts && opts.token) || ++mediaToken;
    if (token !== mediaToken) return; // a newer choice has been made since
    const slides = Array.from(slidesWrap.children);
    const target = slides.find((s) => s.dataset.mediaId === String(mediaId));
    if (!target) return;
    // Keep the current photo on screen until the new one has loaded (no blank flash on desktop)
    const img = preloadMedia(mediaId);
    if (img && !img.complete && !mobile.matches && !(opts && opts.loaded)) {
      let done = false;
      const finish = () => { if (!done) { done = true; showMedia(mediaId, Object.assign({}, opts, { loaded: true, token })); } };
      img.addEventListener('load', finish, { once: true });
      img.addEventListener('error', finish, { once: true });
      setTimeout(finish, 1500);
      return;
    }
    slides.forEach((s) => s.classList.toggle('is-active', s === target));
    thumbs.forEach((t) => {
      const on = t.dataset.mediaId === String(mediaId);
      t.classList.toggle('is-active', on);
      if (on) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
    });
    if (counter) counter.textContent = String(slides.indexOf(target) + 1);
    if (mobile.matches) {
      slidesWrap.scrollTo({ left: target.offsetLeft - slidesWrap.offsetLeft, behavior: opts && opts.instant ? 'auto' : 'smooth' });
    }
  }

  thumbs.forEach((thumb) => thumb.addEventListener('click', () => showMedia(thumb.dataset.mediaId)));

  if (slidesWrap) {
    let scrollTimer;
    slidesWrap.addEventListener('scroll', () => {
      if (!mobile.matches) return;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        mediaToken += 1; // a swipe cancels any pending variant photo swap
        const slides = Array.from(slidesWrap.children);
        const index = Math.round(slidesWrap.scrollLeft / slidesWrap.clientWidth);
        const slide = slides[Math.max(0, Math.min(index, slides.length - 1))];
        if (!slide) return;
        slides.forEach((s) => s.classList.toggle('is-active', s === slide));
        thumbs.forEach((t) => t.classList.toggle('is-active', t.dataset.mediaId === slide.dataset.mediaId));
        if (counter) counter.textContent = String(index + 1);
      }, 80);
    }, { passive: true });
    const active = slidesWrap.querySelector('.is-active');
    if (active && mobile.matches) showMedia(active.dataset.mediaId, { instant: true });
  }

  if (productForm && variantsJson) {
    const variants = JSON.parse(variantsJson.textContent);
    const idInput = productForm.querySelector('[data-variant-id]');
    const addButton = productForm.querySelector('[data-add-button]');
    const priceWrap = document.querySelector('[data-product-price]');
    const saveEl = document.querySelector('[data-price-save]');
    const fieldsets = Array.from(productForm.querySelectorAll('.product-form__option'));
    const stickyPrice = document.querySelector('[data-sticky-price]');
    const stickyVariant = document.querySelector('[data-sticky-variant]');
    const stickyButton = document.querySelector('[data-sticky-button]');

    const selectedOptions = () => fieldsets.map((fs) => (fs.querySelector('input:checked') || {}).value);

    function markAvailability() {
      const selected = selectedOptions();
      fieldsets.forEach((fs, position) => {
        fs.querySelectorAll('[data-option-input]').forEach((input) => {
          const candidate = selected.slice();
          candidate[position] = input.value;
          const match = variants.find((v) => v.options.every((opt, i) => opt === candidate[i]));
          const label = input.closest('.pill');
          if (label) {
            label.classList.toggle('is-unavailable', !match || !match.available);
            label.classList.toggle('is-missing', !match);
          }
        });
        const value = fs.querySelector('[data-selected-value]');
        if (value) value.textContent = selected[position] || '';
      });
    }

    function setButtons(variant) {
      const available = !!(variant && variant.available);
      const label = !variant ? strings.unavailable : (available ? strings.addToCart : strings.soldOut);
      [addButton, stickyButton].forEach((b) => {
        if (!b) return;
        b.disabled = !available;
        b.textContent = label;
      });
      // no delivery promise for something that can't be bought
      document.querySelectorAll('[data-delivery-estimate]').forEach((el) => {
        el.dataset.soldOut = String(!available);
        el.hidden = !available || !el.querySelector('[data-delivery-range]').textContent;
      });
      document.querySelectorAll('[data-ship-note]').forEach((el) => {
        el.textContent = available ? el.dataset.noteIn : el.dataset.noteOut;
      });
    }

    function updatePrice(variant) {
      if (!priceWrap || !variant) return;
      const current = priceWrap.querySelector('.price__current');
      const compare = priceWrap.querySelector('.price__compare');
      const price = priceWrap.querySelector('.price');
      if (current) current.textContent = money(variant.price);
      const onSale = variant.compare_at_price && variant.compare_at_price > variant.price;
      if (compare) { compare.textContent = onSale ? money(variant.compare_at_price) : ''; compare.hidden = !onSale; }
      else if (onSale && price) {
        const s = document.createElement('s');
        s.className = 'price__compare';
        s.textContent = money(variant.compare_at_price);
        price.appendChild(s);
      }
      if (price) price.classList.toggle('price--sale', !!onSale);
      if (saveEl) {
        if (onSale) {
          const pct = Math.round(((variant.compare_at_price - variant.price) * 100) / variant.compare_at_price);
          saveEl.textContent = (strings.savePercent || 'Save [percent]%').replace('[percent]', pct);
          saveEl.hidden = false;
        } else {
          saveEl.hidden = true;
        }
      }
      if (stickyPrice) stickyPrice.textContent = money(variant.price);
      if (stickyVariant) stickyVariant.textContent = variant.title;
    }

    // When the exact combination doesn't exist (or is sold out), jump to the closest real variant
    // that keeps the value the shopper just picked, preferring in-stock ones.
    function closestVariant(position, value, selected) {
      const candidates = variants.filter((v) => v.options[position] === value);
      if (!candidates.length) return null;
      const score = (v) => {
        let s = v.available ? 1000 : 0;
        v.options.forEach((opt, i) => { if (i !== position && opt === selected[i]) s += 10 * (v.options.length - i); });
        return s;
      };
      return candidates.sort((a, b) => score(b) - score(a))[0];
    }

    productForm.addEventListener('change', (event) => {
      if (!event.target.matches('[data-option-input]')) return;
      const fieldset = event.target.closest('[data-option-position]');
      const position = fieldset ? parseInt(fieldset.dataset.optionPosition, 10) : 0;
      let selected = selectedOptions();
      let variant = variants.find((v) => v.options.every((opt, i) => opt === selected[i]));
      if (!variant) {
        const better = closestVariant(position, event.target.value, selected);
        if (better) {
          variant = better;
          fieldsets.forEach((fs, i) => {
            const input = Array.from(fs.querySelectorAll('[data-option-input]')).find((x) => x.value === variant.options[i]);
            if (input) input.checked = true;
          });
          selected = variant.options.slice();
        }
      }
      markAvailability();
      setButtons(variant);
      productForm.classList.toggle('product-form--unavailable', !variant || !variant.available);
      if (!variant) return;
      idInput.value = variant.id;
      updatePrice(variant);
      if (variant.featured_media && variant.featured_media.id) showMedia(variant.featured_media.id);
      const url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url);
    });

    markAvailability();

    // Start loading a variant's photo as soon as the shopper points at / touches its option
    const warm = (event) => {
      const input = event.target.closest('.pill') && event.target.closest('.pill').querySelector('[data-option-input]');
      if (!input) return;
      const fs = input.closest('[data-option-position]');
      const pos = fs ? parseInt(fs.dataset.optionPosition, 10) : 0;
      const candidate = selectedOptions();
      candidate[pos] = input.value;
      const v = variants.find((x) => x.options.every((opt, i) => opt === candidate[i])) || variants.find((x) => x.options[pos] === input.value);
      if (v && v.featured_media) preloadMedia(v.featured_media.id);
    };
    productForm.addEventListener('pointerover', warm, { passive: true });
    productForm.addEventListener('touchstart', warm, { passive: true });
  }

  // Zoom: open the current photo full-size (button, or click/tap on the photo); arrows step through photos
  const lightbox = document.querySelector('[data-lightbox]');
  if (lightbox && slidesWrap && typeof lightbox.showModal === 'function') {
    const lbImg = lightbox.querySelector('[data-lightbox-img]');
    let lbIndex = 0;
    const slidesList = () => Array.from(slidesWrap.children).filter((s) => s.dataset.zoomSrc);
    const showLb = (i) => {
      const slides = slidesList();
      if (!slides.length) return;
      lbIndex = (i + slides.length) % slides.length;
      const img = slides[lbIndex].querySelector('img');
      lbImg.src = slides[lbIndex].dataset.zoomSrc;
      lbImg.alt = img ? img.alt : '';
    };
    const openLb = () => {
      const slides = slidesList();
      const active = slidesWrap.querySelector('.is-active') || slides[0];
      showLb(Math.max(0, slides.indexOf(active)));
      lightbox.showModal();
    };
    document.querySelectorAll('[data-zoom-open]').forEach((b) => b.addEventListener('click', openLb));
    slidesWrap.addEventListener('click', (event) => { if (event.target.closest('.product-gallery__slide')) openLb(); });
    lightbox.querySelectorAll('[data-lightbox-step]').forEach((b) => b.addEventListener('click', () => showLb(lbIndex + parseInt(b.dataset.lightboxStep, 10))));
    lightbox.querySelector('[data-lightbox-close]').addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
    lightbox.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') showLb(lbIndex + 1);
      if (event.key === 'ArrowLeft') showLb(lbIndex - 1);
    });
  }

  // Quantity steppers
  document.querySelectorAll('[data-qty]').forEach((wrap) => {
    const input = wrap.querySelector('input');
    wrap.querySelectorAll('[data-qty-step]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = Math.max(parseInt(input.min || '1', 10), (parseInt(input.value, 10) || 1) + parseInt(btn.dataset.qtyStep, 10));
        input.value = next;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  });

  // Sticky add-to-cart bar: shows once the main button scrolls out of view
  const sticky = document.querySelector('[data-sticky-atc]');
  const mainAdd = productForm && productForm.querySelector('[data-add-button]');
  if (sticky && mainAdd && 'IntersectionObserver' in window) {
    const footer = document.querySelector('.site-footer');
    let mainVisible = true;
    let footerVisible = false;
    const sync = () => {
      const show = !mainVisible && !footerVisible;
      sticky.hidden = !show;
      sticky.setAttribute('aria-hidden', String(!show));
      const btn = sticky.querySelector('[data-sticky-button]');
      if (btn) btn.tabIndex = show ? 0 : -1;
      document.documentElement.classList.toggle('has-sticky-atc', show && !desktop.matches);
    };
    new IntersectionObserver((entries) => { const e = entries[entries.length - 1]; mainVisible = e.isIntersecting || e.boundingClientRect.top > 0; sync(); }).observe(mainAdd);
    if (footer) new IntersectionObserver((entries) => { footerVisible = entries[entries.length - 1].isIntersecting; sync(); }).observe(footer);
  }

  // Delivery estimate: "Order today, estimated delivery Tue, Nov 18 – Fri, Nov 21" (business days, skips weekends)
  document.querySelectorAll('[data-delivery-estimate]').forEach((el) => {
    const min = parseInt(el.dataset.minDays, 10);
    const max = parseInt(el.dataset.maxDays, 10);
    if (!min || !max) return;
    const handling = 2; // warehouse processing time (padded so the estimate has a reasonable basis)
    // US carrier holidays (no deliveries): New Year, Memorial Day, July 4, Labor Day, Thanksgiving, Christmas
    const nthWeekday = (y, m, weekday, n) => { const d = new Date(y, m, 1); const offset = (weekday - d.getDay() + 7) % 7; return new Date(y, m, 1 + offset + (n - 1) * 7); };
    const lastWeekday = (y, m, weekday) => { const d = new Date(y, m + 1, 0); return new Date(y, m, d.getDate() - ((d.getDay() - weekday + 7) % 7)); };
    const isHoliday = (d) => {
      const y = d.getFullYear();
      const same = (x) => x.getMonth() === d.getMonth() && x.getDate() === d.getDate();
      return [new Date(y, 0, 1), lastWeekday(y, 4, 1), new Date(y, 6, 4), nthWeekday(y, 8, 1, 1), nthWeekday(y, 10, 4, 4), new Date(y, 11, 25)].some(same);
    };
    const addBusinessDays = (date, days) => {
      const d = new Date(date);
      let added = 0;
      while (added < days) {
        d.setDate(d.getDate() + 1);
        const day = d.getDay();
        if (day !== 0 && day !== 6 && !isHoliday(d)) added += 1;
      }
      return d;
    };
    const fmt = new Intl.DateTimeFormat(document.documentElement.lang || 'en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const now = new Date();
    const from = addBusinessDays(now, min + handling);
    const to = addBusinessDays(now, max + handling);
    const range = el.querySelector('[data-delivery-range]');
    if (range) range.textContent = `${fmt.format(from)} – ${fmt.format(to)}`;
    el.hidden = el.dataset.soldOut === 'true';
  });

  /* ---------------------------------------------------------------- WaggleKin TV */
  document.querySelectorAll('[data-video-player]').forEach((player) => {
    const play = player.querySelector('[data-video-play]');
    const template = player.querySelector('[data-video-template]');
    if (!play || !template) return;
    play.addEventListener('click', () => {
      player.appendChild(template.content.cloneNode(true));
      play.remove();
      const poster = player.querySelector('.tv__poster');
      if (poster) poster.remove();
    });
  });
})();
