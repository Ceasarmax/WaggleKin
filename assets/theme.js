/* WaggleKin theme — small progressive enhancements */
(function () {
  'use strict';

  const root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';

  // Mobile navigation
  document.querySelectorAll('[data-nav-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nav = btn.closest('.site-header').querySelector('.site-nav');
      const open = nav.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  // Dropdown menus: hover to open on desktop, only one open at a time, close on outside click / Escape
  const dropdowns = Array.from(document.querySelectorAll('[data-nav-dropdown]'));
  const desktop = window.matchMedia('(min-width: 990px)');
  dropdowns.forEach((dd) => {
    dd.addEventListener('toggle', () => {
      if (dd.open) dropdowns.forEach((other) => { if (other !== dd) other.open = false; });
    });
    dd.parentElement.addEventListener('mouseenter', () => { if (desktop.matches) dd.open = true; });
    dd.parentElement.addEventListener('mouseleave', () => { if (desktop.matches) dd.open = false; });
  });
  document.addEventListener('click', (event) => {
    dropdowns.forEach((dd) => { if (dd.open && !dd.contains(event.target)) dd.open = false; });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') dropdowns.forEach((dd) => { dd.open = false; });
  });

  // Search drawer
  document.querySelectorAll('[data-search-toggle]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const drawer = link.closest('.site-header').querySelector('[data-search-drawer]');
      if (!drawer) return;
      event.preventDefault();
      drawer.hidden = !drawer.hidden;
      if (!drawer.hidden) drawer.querySelector('input[type="search"]').focus();
    });
  });

  // Country selector: switch market as soon as a country is picked
  document.querySelectorAll('[data-country-select]').forEach((select) => {
    select.addEventListener('change', () => select.form.submit());
  });

  // Toast
  const toast = document.getElementById('CartToast');
  let toastTimer;
  function showToast(html) {
    if (!toast) return;
    toast.innerHTML = html;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3500);
  }

  function updateCartCount() {
    return fetch(root + 'cart.js', { headers: { Accept: 'application/json' } })
      .then((r) => r.json())
      .then((cart) => {
        document.querySelectorAll('[data-cart-count]').forEach((el) => {
          el.textContent = cart.item_count;
          const pill = el.closest('.cart-pill');
          if (pill) {
            pill.classList.remove('is-bumped');
            void pill.offsetWidth;
            pill.classList.add('is-bumped');
          }
        });
      });
  }

  // AJAX add to cart (falls back to a normal form post on error)
  document.addEventListener('submit', (event) => {
    const form = event.target.closest('.js-add-to-cart');
    if (!form || !window.fetch) return;
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    if (button) button.classList.add('is-loading');

    fetch(root + 'cart/add.js', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form),
    })
      .then((r) => r.json().then((data) => ({ ok: r.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.description || data.message || 'Could not add to cart');
        return updateCartCount().then(() => {
          showToast(`${escapeHtml(data.product_title || 'Item')} added &middot; <a href="${root}cart">View cart</a>`);
        });
      })
      .catch((error) => showToast(escapeHtml(error.message)))
      .finally(() => { if (button) button.classList.remove('is-loading'); });
  });

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // Product page: variant selection
  const productForm = document.querySelector('[data-product-form]');
  const variantsJson = document.querySelector('[data-product-json]');
  if (productForm && variantsJson) {
    const variants = JSON.parse(variantsJson.textContent);
    const idInput = productForm.querySelector('[data-variant-id]');
    const addButton = productForm.querySelector('[data-add-button]');
    const priceEl = document.querySelector('[data-product-price] .price__current');
    const compareEl = document.querySelector('[data-product-price] .price__compare');
    const money = (cents) => {
      const format = (window.Shopify && window.Shopify.currency && window.Shopify.currency.active) || 'USD';
      return new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'currency', currency: format }).format(cents / 100);
    };

    productForm.addEventListener('change', (event) => {
      if (!event.target.matches('[data-option-input]')) return;
      const selected = Array.from(productForm.querySelectorAll('.product-form__option')).map(
        (fieldset) => (fieldset.querySelector('input:checked') || {}).value
      );
      const variant = variants.find((v) => v.options.every((opt, i) => opt === selected[i]));
      if (!variant) {
        addButton.disabled = true;
        addButton.textContent = 'Unavailable';
        return;
      }
      idInput.value = variant.id;
      addButton.disabled = !variant.available;
      addButton.textContent = variant.available ? 'Add to cart' : 'Sold out';
      if (priceEl) priceEl.textContent = money(variant.price);
      if (compareEl) compareEl.textContent = variant.compare_at_price > variant.price ? money(variant.compare_at_price) : '';
      const url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url);
    });
  }

  // Product gallery thumbnails
  document.querySelectorAll('[data-thumb]').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const main = document.querySelector('[data-main-image]');
      if (!main) return;
      main.removeAttribute('srcset');
      main.src = thumb.dataset.thumb;
      document.querySelectorAll('[data-thumb]').forEach((t) => t.classList.toggle('is-active', t === thumb));
    });
  });

  // WaggleKin TV: load the video only when play is pressed
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
