/*
 * WaggleKin storefront tracking: Google Analytics 4, Google Ads, Meta pixel, TikTok pixel, Microsoft Clarity.
 *
 * IDs and page data come from snippets/tracking.liquid (Theme settings → Tracking & analytics).
 * Each tag loads only when its ID is set AND the visitor's privacy choices allow it
 * (Shopify Customer Privacy API): Analytics → GA4 and Clarity; Marketing + sale of data → Google Ads, Meta, TikTok.
 *
 * Storefront events: page view, product view, collection view, search, add to cart, cart view, newsletter sign-up.
 * Checkout and purchase are sent by the custom pixel (docs/tracking/shopify-custom-pixel.js), because themes
 * can't run code on Shopify's checkout pages.
 */
(function () {
  'use strict';

  const dataEl = document.getElementById('wk-tracking');
  if (!dataEl) return;
  let page;
  try {
    page = JSON.parse(dataEl.textContent);
  } catch (error) {
    console.warn('[WaggleKin tracking] Could not read tracking data.', error);
    return;
  }

  // ---------------------------------------------------------------- config
  const ID_FORMATS = {
    ga4: /^G-[A-Z0-9]+$/i,
    googleAds: /^AW-\d+$/i,
    meta: /^\d{8,20}$/,
    tiktok: /^[A-Z0-9]{10,30}$/i,
    clarity: /^[a-z0-9]{5,20}$/i,
  };
  const ids = {};
  Object.keys(ID_FORMATS).forEach((key) => {
    const value = String((page.ids || {})[key] || '').trim();
    if (!value) return;
    if (ID_FORMATS[key].test(value)) ids[key] = value;
    else console.warn(`[WaggleKin tracking] Ignoring the ${key} ID "${value}": it doesn't look like a valid ID.`);
  });

  const currency = page.currency || 'USD';
  const toMoney = (cents) => Math.round(Number(cents) || 0) / 100;
  const valueOf = (items) => toMoney(items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0));

  function safe(fn) {
    try {
      fn();
    } catch (error) {
      console.warn('[WaggleKin tracking]', error);
    }
  }

  function loadScript(src) {
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  }

  // ---------------------------------------------------------------- items
  function fromTheme(raw) {
    return {
      id: String(raw.id),
      productId: String(raw.productId || ''),
      name: raw.name || '',
      variant: raw.variant || null,
      brand: raw.brand || '',
      category: raw.category || '',
      sku: raw.sku || '',
      priceCents: Number(raw.priceCents) || 0,
      quantity: Number(raw.quantity) || 1,
    };
  }

  // A line item from the Ajax Cart API (/cart/add.js)
  function fromCartLine(line, quantity) {
    return {
      id: String(line.variant_id || line.id),
      productId: String(line.product_id || ''),
      name: line.product_title || line.title || '',
      variant: line.variant_title || null,
      brand: line.vendor || '',
      category: line.product_type || '',
      sku: line.sku || '',
      priceCents: Number(line.price) || 0,
      quantity: quantity || Number(line.quantity) || 1,
    };
  }

  // ---------------------------------------------------------------- vendors
  // Each vendor: needs ('analytics' | 'marketing'), load(), send(event), consent(granted).
  const vendors = {};
  let gtagLoaded = false;

  function googleConsentState(permissions) {
    const ads = permissions.marketing ? 'granted' : 'denied';
    return {
      analytics_storage: permissions.analytics ? 'granted' : 'denied',
      ad_storage: ads,
      ad_user_data: ads,
      ad_personalization: ads,
    };
  }

  function ensureGtag(firstId, permissions) {
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
      window.gtag = function gtag() {
        window.dataLayer.push(arguments); // gtag.js expects the arguments object, not an array
      };
    }
    if (gtagLoaded) return;
    gtagLoaded = true;
    window.gtag('consent', 'default', googleConsentState(permissions));
    window.gtag('js', new Date());
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(firstId)}`);
  }

  if (ids.ga4) {
    const gaItem = (item, index, listName) => {
      const out = {
        item_id: item.id,
        item_name: item.name,
        item_brand: item.brand || undefined,
        item_category: item.category || undefined,
        item_variant: item.variant || undefined,
        price: toMoney(item.priceCents),
        quantity: item.quantity,
      };
      if (index != null) out.index = index;
      if (listName) out.item_list_name = listName;
      return out;
    };
    vendors.ga4 = {
      needs: 'analytics',
      load(permissions) {
        ensureGtag(ids.ga4, permissions);
        window.gtag('config', ids.ga4, { send_page_view: false });
      },
      consent() {}, // handled by Google consent mode
      send({ name, data }) {
        const event = (eventName, params) => window.gtag('event', eventName, Object.assign({ send_to: ids.ga4 }, params));
        switch (name) {
          case 'page_view':
            return event('page_view', {});
          case 'view_item':
            return event('view_item', { currency, value: valueOf(data.items), items: data.items.map((i) => gaItem(i)) });
          case 'view_item_list':
            return event('view_item_list', {
              item_list_id: data.listId,
              item_list_name: data.listName,
              items: data.items.map((i, index) => gaItem(i, index, data.listName)),
            });
          case 'add_to_cart':
            return event('add_to_cart', { currency, value: valueOf(data.items), items: data.items.map((i) => gaItem(i)) });
          case 'view_cart':
            return event('view_cart', { currency, value: valueOf(data.items), items: data.items.map((i) => gaItem(i)) });
          case 'lead':
            return event('generate_lead', { lead_source: data.source });
          // Site search: GA4's enhanced measurement already records view_search_results from the ?q= parameter.
          default:
            return undefined;
        }
      },
    };
  }

  if (ids.googleAds) {
    // Remarketing events with the item IDs Google Ads uses for dynamic remarketing.
    const adsItems = (items) => items.map((i) => ({ id: i.id, google_business_vertical: 'retail' }));
    vendors.googleAds = {
      needs: 'marketing',
      load(permissions) {
        ensureGtag(ids.googleAds, permissions);
        window.gtag('config', ids.googleAds, { send_page_view: false });
      },
      consent() {}, // handled by Google consent mode
      send({ name, data }) {
        const event = (eventName, params) => window.gtag('event', eventName, Object.assign({ send_to: ids.googleAds }, params));
        switch (name) {
          case 'page_view':
            return event('page_view', {});
          case 'view_item':
            return event('view_item', { currency, value: valueOf(data.items), items: adsItems(data.items) });
          case 'view_item_list':
            return event('view_item_list', { items: adsItems(data.items) });
          case 'search':
            return event('view_search_results', { items: adsItems(data.items) });
          case 'add_to_cart':
            return event('add_to_cart', { currency, value: valueOf(data.items), items: adsItems(data.items) });
          default:
            return undefined;
        }
      },
    };
  }

  if (ids.meta) {
    const metaParams = (items) => ({
      content_ids: items.map((i) => i.id),
      content_type: 'product',
      contents: items.map((i) => ({ id: i.id, quantity: i.quantity })),
      value: valueOf(items),
      currency,
    });
    vendors.meta = {
      needs: 'marketing',
      load() {
        if (!window.fbq) {
          const fbq = function fbq() {
            if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
            else fbq.queue.push(arguments);
          };
          window.fbq = fbq;
          if (!window._fbq) window._fbq = fbq;
          fbq.push = fbq;
          fbq.loaded = true;
          fbq.version = '2.0';
          fbq.queue = [];
          loadScript('https://connect.facebook.net/en_US/fbevents.js');
        }
        window.fbq('init', ids.meta);
      },
      consent(granted) {
        window.fbq('consent', granted ? 'grant' : 'revoke');
      },
      send({ name, data }) {
        const fbq = window.fbq;
        switch (name) {
          case 'page_view':
            return fbq('track', 'PageView');
          case 'view_item':
            return fbq('track', 'ViewContent', Object.assign(metaParams(data.items), {
              content_name: data.items[0].name,
              content_category: data.items[0].category || undefined,
            }));
          case 'search':
            return fbq('track', 'Search', Object.assign(metaParams(data.items.slice(0, 10)), { search_string: data.term }));
          case 'add_to_cart':
            return fbq('track', 'AddToCart', Object.assign(metaParams(data.items), { content_name: data.items[0].name }));
          case 'lead':
            return fbq('track', 'Lead', { content_name: data.source });
          default:
            return undefined;
        }
      },
    };
  }

  if (ids.tiktok) {
    const tiktokParams = (items) => ({
      content_type: 'product',
      contents: items.map((i) => ({
        content_id: i.id,
        content_name: i.name,
        content_category: i.category || undefined,
        brand: i.brand || undefined,
        price: toMoney(i.priceCents),
        quantity: i.quantity,
      })),
      value: valueOf(items),
      currency,
    });
    vendors.tiktok = {
      needs: 'marketing',
      load() {
        const w = window;
        if (!w.ttq || typeof w.ttq.load !== 'function') {
          // TikTok's base code, unminified
          w.TiktokAnalyticsObject = 'ttq';
          const ttq = (w.ttq = w.ttq || []);
          ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group',
            'enableCookie', 'disableCookie', 'holdConsent', 'revokeConsent', 'grantConsent'];
          ttq.setAndDefer = function (target, method) {
            target[method] = function () {
              target.push([method].concat(Array.prototype.slice.call(arguments, 0)));
            };
          };
          ttq.methods.forEach((method) => ttq.setAndDefer(ttq, method));
          ttq.instance = function (id) {
            const instance = ttq._i[id] || [];
            ttq.methods.forEach((method) => ttq.setAndDefer(instance, method));
            return instance;
          };
          ttq.load = function (id, options) {
            const src = 'https://analytics.tiktok.com/i18n/pixel/events.js';
            ttq._i = ttq._i || {};
            ttq._i[id] = [];
            ttq._i[id]._u = src;
            ttq._t = ttq._t || {};
            ttq._t[id] = +new Date();
            ttq._o = ttq._o || {};
            ttq._o[id] = options || {};
            loadScript(`${src}?sdkid=${encodeURIComponent(id)}&lib=ttq`);
          };
        }
        w.ttq.load(ids.tiktok);
      },
      consent(granted) {
        if (granted) window.ttq.grantConsent();
        else window.ttq.revokeConsent();
      },
      send({ name, data }) {
        const ttq = window.ttq;
        switch (name) {
          case 'page_view':
            return ttq.page();
          case 'view_item':
            return ttq.track('ViewContent', tiktokParams(data.items));
          case 'search':
            return ttq.track('Search', Object.assign(tiktokParams(data.items.slice(0, 10)), { query: data.term }));
          case 'add_to_cart':
            return ttq.track('AddToCart', tiktokParams(data.items));
          case 'lead':
            return ttq.track('Lead', { description: data.source });
          default:
            return undefined;
        }
      },
    };
  }

  if (ids.clarity) {
    const clarityConsent = (permissions) => ({
      analytics_Storage: permissions.analytics ? 'granted' : 'denied',
      ad_Storage: permissions.marketing ? 'granted' : 'denied',
    });
    vendors.clarity = {
      needs: 'analytics',
      load(permissions) {
        window.clarity = window.clarity || function clarity() {
          (window.clarity.q = window.clarity.q || []).push(arguments);
        };
        loadScript(`https://www.clarity.ms/tag/${encodeURIComponent(ids.clarity)}`);
        window.clarity('consentv2', clarityConsent(permissions));
        if (page.pageType) window.clarity('set', 'page_type', page.pageType);
      },
      consent(granted, permissions) {
        window.clarity('consentv2', clarityConsent(permissions));
        if (!granted) window.clarity('consent', false);
      },
      send({ name }) {
        // Custom events make sessions filterable in Clarity recordings and heatmaps.
        if (name === 'add_to_cart') window.clarity('event', 'add_to_cart');
        if (name === 'lead') window.clarity('event', 'newsletter_signup');
      },
    };
  }

  if (!Object.keys(vendors).length) return;

  // ---------------------------------------------------------------- event log & consent
  // Events are logged first, then sent to every vendor that is allowed to run. A vendor that becomes
  // allowed later (visitor accepts the cookie banner) is loaded and catches up on this page's events.
  const log = [];
  let permissions = null;

  function track(name, data) {
    log.push({ name, data: data || {} });
    Object.values(vendors).forEach((vendor) => {
      if (!vendor.active) return;
      safe(() => vendor.send(log[log.length - 1]));
      vendor.sent = log.length;
    });
  }

  function applyPermissions(next) {
    const previous = permissions;
    permissions = next;
    if (gtagLoaded && previous) safe(() => window.gtag('consent', 'update', googleConsentState(next)));

    Object.values(vendors).forEach((vendor) => {
      const allowed = Boolean(next[vendor.needs]);
      if (allowed && !vendor.active) {
        if (vendor.loaded) {
          safe(() => vendor.consent(true, next));
        } else {
          safe(() => vendor.load(next));
          vendor.loaded = true;
        }
        vendor.active = true;
        log.slice(vendor.sent || 0).forEach((event) => safe(() => vendor.send(event)));
        vendor.sent = log.length;
      } else if (!allowed && vendor.active) {
        vendor.active = false;
        safe(() => vendor.consent(false, next));
      }
    });
  }

  function readPermissions(privacy) {
    // No Customer Privacy API (shouldn't happen on Shopify): the store sells in the US only,
    // where tracking is opt-out, so tags run.
    if (!privacy) return { analytics: true, marketing: true };
    const allowed = (method) => {
      try {
        return typeof privacy[method] === 'function' ? privacy[method]() !== false : true;
      } catch (error) {
        return true;
      }
    };
    return {
      analytics: allowed('analyticsProcessingAllowed'),
      marketing: allowed('marketingAllowed') && allowed('saleOfDataAllowed'),
    };
  }

  function start() {
    const shopify = window.Shopify;
    if (shopify && typeof shopify.loadFeatures === 'function') {
      shopify.loadFeatures([{ name: 'consent-tracking-api', version: '0.1' }], (error) => {
        if (error) console.warn('[WaggleKin tracking] Customer Privacy API failed to load.', error);
        applyPermissions(readPermissions(error ? null : shopify.customerPrivacy));
      });
    } else {
      applyPermissions(readPermissions(null));
    }
  }

  // Fired by Shopify's cookie banner / privacy page when the visitor changes their choices.
  document.addEventListener('visitorConsentCollected', (event) => {
    const privacy = window.Shopify && window.Shopify.customerPrivacy;
    if (privacy) return applyPermissions(readPermissions(privacy));
    const detail = event.detail || {};
    return applyPermissions({
      analytics: detail.analyticsAllowed !== false,
      marketing: detail.marketingAllowed !== false && detail.saleOfDataAllowed !== false,
    });
  });

  // ---------------------------------------------------------------- page events
  track('page_view');

  if (page.product) {
    track('view_item', { items: [fromTheme(page.product)] });
  }
  if (page.list && page.list.items && page.list.items.length) {
    track('view_item_list', { listId: page.list.id, listName: page.list.name, items: page.list.items.map(fromTheme) });
  }
  if (page.search) {
    track('search', { term: page.search.terms || '', items: (page.search.items || []).map(fromTheme) });
  }
  if (page.cart && page.cart.items && page.cart.items.length) {
    track('view_cart', { items: page.cart.items.map(fromTheme) });
  }

  // Newsletter sign-up (sections/newsletter.liquid marks the success message). Once per session,
  // so refreshing the confirmation page doesn't count again.
  if (document.querySelector('[data-track-lead]')) {
    let alreadyTracked = false;
    try {
      alreadyTracked = sessionStorage.getItem('wk_lead_tracked') === '1';
      sessionStorage.setItem('wk_lead_tracked', '1');
    } catch (error) {
      // storage blocked: track anyway
    }
    if (!alreadyTracked) track('lead', { source: 'newsletter' });
  }

  // Add to cart: dispatched by assets/theme.js after a successful /cart/add.js request.
  document.addEventListener('wagglekin:add-to-cart', (event) => {
    const detail = event.detail || {};
    const response = detail.response || {};
    const lines = Array.isArray(response.items) ? response.items : [response];
    const items = lines.filter((line) => line && (line.variant_id || line.id)).map((line) => fromCartLine(line, lines.length === 1 ? detail.quantity : null));
    if (items.length) track('add_to_cart', { items });
  });

  start();
})();
