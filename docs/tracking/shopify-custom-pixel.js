// =============================================================================
// WaggleKin checkout tracking: Shopify custom pixel
//
// WHERE: Shopify admin → Settings → Customer events → Add custom pixel → name it "WaggleKin checkout".
//        Paste this whole file into the code box, fill in CONFIG below, Save, then Connect.
// PRIVACY SETTINGS for the pixel:
//        Permission: Required → tick Marketing and Analytics.
//        Data sale: Data collected qualifies as data sale.
//
// Themes can't run code on Shopify's checkout and thank-you pages, so this pixel sends the checkout
// funnel and the purchase to GA4, Google Ads, Meta and TikTok. Storefront events (page views, product
// views, add to cart...) come from the theme (assets/tracking.js), so nothing here is double-counted.
// Use the same IDs as Theme settings → Tracking & analytics. Leave an ID empty to switch it off.
// =============================================================================
const CONFIG = {
  ga4MeasurementId: '', //       'G-XXXXXXXXXX'   Google Analytics → Admin → Data streams → Web
  googleAdsId: '', //            'AW-XXXXXXXXXX'  Google Ads → Goals → Conversions → Settings → Google tag
  googleAdsPurchaseLabel: '', // 'AbCdEfGhIjK'    The part after the slash in send_to 'AW-XXXXXXXXXX/AbCdEfGhIjK'
  //                                              (Google Ads → your "Purchase" conversion → Tag setup → Install the tag yourself)
  metaPixelId: '', //            Leave empty: Meta already runs through the Facebook & Instagram app (would double-count)
  tiktokPixelId: '', //          'CXXXXXXXXXXXXXXXXXXX' TikTok Ads Manager → Tools → Events → Web events
};

// -----------------------------------------------------------------------------
const ids = {
  ga4: String(CONFIG.ga4MeasurementId || '').trim(),
  googleAds: String(CONFIG.googleAdsId || '').trim(),
  googleAdsLabel: String(CONFIG.googleAdsPurchaseLabel || '').trim(),
  meta: String(CONFIG.metaPixelId || '').trim(),
  tiktok: String(CONFIG.tiktokPixelId || '').trim(),
};

const money = (value) => {
  const amount = Number(value && typeof value === 'object' ? value.amount : value);
  return Number.isFinite(amount) ? Math.round(amount * 100) / 100 : 0;
};
const shortId = (id) => String(id || '').split('/').pop(); // works for "123" and "gid://shopify/ProductVariant/123"
const isCheckoutPage = (event) => /\/checkouts?\//.test(event.context?.document?.location?.pathname || '');

function safe(fn) {
  try {
    fn();
  } catch (error) {
    console.warn('[WaggleKin checkout pixel]', error);
  }
}

function loadScript(src) {
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

// ------------------------------------------------------------------ checkout data
function lineItems(checkout) {
  return (checkout.lineItems || []).map((line) => {
    const variant = line.variant || {};
    const product = variant.product || {};
    return {
      id: shortId(variant.id), // Shopify variant ID, same as the theme uses
      name: product.title || line.title || '',
      variant: variant.title && variant.title !== 'Default Title' ? variant.title : '',
      brand: product.vendor || '',
      category: product.type || '',
      price: money(variant.price),
      quantity: line.quantity || 1,
    };
  });
}

// Product revenue after discounts, without shipping and tax: what GA4 and the ad platforms expect as "value".
function revenue(checkout) {
  const value = money(checkout.totalPrice) - money(checkout.shippingLine && checkout.shippingLine.price) - money(checkout.totalTax);
  return value > 0 ? Math.round(value * 100) / 100 : money(checkout.subtotalPrice);
}

function couponCodes(checkout) {
  return (checkout.discountApplications || [])
    .filter((discount) => discount.type === 'DISCOUNT_CODE' && discount.title)
    .map((discount) => discount.title)
    .join(',');
}

function customer(checkout) {
  const address = checkout.billingAddress || checkout.shippingAddress || {};
  const phone = checkout.phone || address.phone || (checkout.shippingAddress && checkout.shippingAddress.phone) || '';
  return {
    email: (checkout.email || '').trim().toLowerCase(),
    phone: phone.replace(/[^\d+]/g, ''),
    firstName: (address.firstName || '').trim(),
    lastName: (address.lastName || '').trim(),
    street: (address.address1 || '').trim(),
    city: (address.city || '').trim(),
    region: (address.provinceCode || address.province || '').trim(),
    zip: (address.zip || '').trim(),
    country: (address.countryCode || '').trim(),
  };
}

function compact(object) {
  Object.keys(object).forEach((key) => {
    if (object[key] === undefined || object[key] === '') delete object[key];
  });
  return object;
}

// ------------------------------------------------------------------ Google (GA4 + Google Ads)
let googleReady = null;

// The pixel runs in a sandbox, so read the storefront's GA cookies and pass them on. That keeps the
// purchase in the same GA4 user and session as the visit that brought the customer in.
async function gaIdentity() {
  const identity = {};
  try {
    const gaCookie = await browser.cookie.get('_ga'); // GA1.1.1234567890.1700000000
    if (gaCookie) identity.client_id = gaCookie.split('.').slice(-2).join('.');
    const sessionCookie = await browser.cookie.get(`_ga_${ids.ga4.replace(/^G-/i, '')}`);
    const match = sessionCookie && (sessionCookie.match(/^GS2\.\d+\.s(\d+)/) || sessionCookie.match(/^GS1\.\d+\.(\d+)/));
    if (match) identity.session_id = match[1];
  } catch (error) {
    // No cookies available: GA4 falls back to its own IDs
  }
  return identity;
}

function google() {
  if (!ids.ga4 && !ids.googleAds) return Promise.resolve(false);
  if (googleReady) return googleReady;
  googleReady = (async () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    gtag('js', new Date());
    if (ids.ga4) gtag('config', ids.ga4, Object.assign({ send_page_view: false }, await gaIdentity()));
    if (ids.googleAds) gtag('config', ids.googleAds, { send_page_view: false, allow_enhanced_conversions: true });
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ids.ga4 || ids.googleAds)}`);
    return true;
  })();
  return googleReady;
}

function pageParams(event) {
  const doc = (event.context && event.context.document) || {};
  return compact({
    page_location: doc.location && doc.location.href,
    page_title: doc.title,
    page_referrer: doc.referrer,
  });
}

function ga4(eventName, params, event) {
  if (!ids.ga4) return;
  google().then(() => safe(() => gtag('event', eventName, Object.assign({ send_to: ids.ga4 }, pageParams(event), params))));
}

function ga4Params(checkout) {
  return compact({
    currency: checkout.currencyCode,
    value: revenue(checkout),
    coupon: couponCodes(checkout),
    items: lineItems(checkout).map((item, index) => compact({
      item_id: item.id,
      item_name: item.name,
      item_variant: item.variant,
      item_brand: item.brand,
      item_category: item.category,
      price: item.price,
      quantity: item.quantity,
      index,
    })),
  });
}

function googleAdsUserData(checkout) {
  const person = customer(checkout);
  return compact({
    email: person.email,
    phone_number: person.phone && person.phone.startsWith('+') ? person.phone : undefined,
    address: person.firstName || person.lastName || person.zip
      ? compact({
        first_name: person.firstName,
        last_name: person.lastName,
        street: person.street,
        city: person.city,
        region: person.region,
        postal_code: person.zip,
        country: person.country,
      })
      : undefined,
  });
}

// ------------------------------------------------------------------ Meta
let metaInitialised = false;
let metaHasEmail = false;

function metaUserData(checkout) {
  const person = customer(checkout);
  const lower = (value) => (value ? value.toLowerCase() : '');
  return compact({
    em: person.email,
    ph: person.phone.replace(/\D/g, ''),
    fn: lower(person.firstName),
    ln: lower(person.lastName),
    ct: lower(person.city).replace(/[^a-z]/g, ''),
    st: lower(person.region),
    zp: person.country === 'US' ? person.zip.slice(0, 5) : lower(person.zip).replace(/\s/g, ''),
    country: lower(person.country),
  });
}

function meta(eventName, params, eventId, checkout) {
  if (!ids.meta) return;
  safe(() => {
    if (!window.fbq) {
      const fbq = function fbq() {
        if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
        else fbq.queue.push(arguments);
      };
      window.fbq = fbq;
      window._fbq = window._fbq || fbq;
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = '2.0';
      fbq.queue = [];
      loadScript('https://connect.facebook.net/en_US/fbevents.js');
    }
    // Advanced matching: the pixel hashes these before sending. Re-initialise once the email is known.
    const userData = metaUserData(checkout);
    if (!metaInitialised || (!metaHasEmail && userData.em)) {
      window.fbq('init', ids.meta, userData);
      metaInitialised = true;
      metaHasEmail = Boolean(userData.em);
    }
    window.fbq('track', eventName, params, { eventID: eventId });
  });
}

function metaParams(checkout) {
  const items = lineItems(checkout);
  return {
    content_ids: items.map((item) => item.id),
    contents: items.map((item) => ({ id: item.id, quantity: item.quantity, item_price: item.price })),
    content_type: 'product',
    num_items: items.reduce((sum, item) => sum + item.quantity, 0),
    value: revenue(checkout),
    currency: checkout.currencyCode,
  };
}

// ------------------------------------------------------------------ TikTok
function tiktok(eventName, params, eventId, checkout) {
  if (!ids.tiktok) return;
  safe(() => {
    if (!window.ttq || typeof window.ttq.load !== 'function') {
      window.TiktokAnalyticsObject = 'ttq';
      const ttq = (window.ttq = window.ttq || []);
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
      ttq.load(ids.tiktok);
    }
    // Advanced matching: the pixel hashes these before sending.
    const person = customer(checkout);
    const identity = compact({ email: person.email, phone_number: person.phone.startsWith('+') ? person.phone : '' });
    if (Object.keys(identity).length) window.ttq.identify(identity);
    window.ttq.track(eventName, params, { event_id: eventId });
  });
}

function tiktokParams(checkout) {
  return {
    content_type: 'product',
    contents: lineItems(checkout).map((item) => compact({
      content_id: item.id,
      content_name: item.name,
      content_category: item.category,
      brand: item.brand,
      price: item.price,
      quantity: item.quantity,
    })),
    value: revenue(checkout),
    currency: checkout.currencyCode,
  };
}

// ------------------------------------------------------------------ events
// Page views on checkout pages only (the theme already records storefront page views).
analytics.subscribe('page_viewed', (event) => {
  if (isCheckoutPage(event)) ga4('page_view', {}, event);
});

analytics.subscribe('checkout_started', (event) => {
  const checkout = event.data.checkout;
  const key = checkout.token || event.id;
  ga4('begin_checkout', ga4Params(checkout), event);
  if (ids.googleAds) {
    google().then(() => safe(() => gtag('event', 'begin_checkout', {
      send_to: ids.googleAds,
      value: revenue(checkout),
      currency: checkout.currencyCode,
      items: lineItems(checkout).map((item) => ({ id: item.id, google_business_vertical: 'retail' })),
    })));
  }
  meta('InitiateCheckout', metaParams(checkout), `checkout_${key}`, checkout);
  tiktok('InitiateCheckout', tiktokParams(checkout), `checkout_${key}`, checkout);
});

analytics.subscribe('checkout_shipping_info_submitted', (event) => {
  ga4('add_shipping_info', ga4Params(event.data.checkout), event);
});

analytics.subscribe('payment_info_submitted', (event) => {
  const checkout = event.data.checkout;
  const key = checkout.token || event.id;
  ga4('add_payment_info', ga4Params(checkout), event);
  meta('AddPaymentInfo', metaParams(checkout), `payment_${key}`, checkout);
  tiktok('AddPaymentInfo', tiktokParams(checkout), `payment_${key}`, checkout);
});

analytics.subscribe('checkout_completed', (event) => {
  const checkout = event.data.checkout;
  const orderId = shortId((checkout.order && checkout.order.id) || checkout.token || event.id);

  ga4('purchase', Object.assign(ga4Params(checkout), compact({
    transaction_id: orderId,
    tax: money(checkout.totalTax),
    shipping: money(checkout.shippingLine && checkout.shippingLine.price),
  })), event);

  if (ids.googleAds) {
    if (!ids.googleAdsLabel) {
      console.warn('[WaggleKin checkout pixel] Google Ads purchase label is empty: purchase conversion not sent.');
    } else {
      google().then(() => safe(() => {
        gtag('set', 'user_data', googleAdsUserData(checkout)); // enhanced conversions (Google hashes it)
        gtag('event', 'conversion', {
          send_to: `${ids.googleAds}/${ids.googleAdsLabel}`,
          value: revenue(checkout),
          currency: checkout.currencyCode,
          transaction_id: orderId,
        });
      }));
    }
  }

  meta('Purchase', metaParams(checkout), `purchase_${orderId}`, checkout);
  tiktok('Purchase', tiktokParams(checkout), `purchase_${orderId}`, checkout);
});
