# WaggleKin: Tracking setup

**Last updated:** 16 November 2026.

The theme has Google Analytics 4, Google Ads, Meta pixel, TikTok pixel and Microsoft Clarity built in. Each one switches on when you paste its ID. Nothing loads while an ID is empty, so the code is safe to publish before the accounts exist.

## What gets tracked

| Event | GA4 | Google Ads | Meta | TikTok | Clarity | Sent by |
|---|---|---|---|---|---|---|
| Page view | `page_view` | remarketing | `PageView` | page | recording | theme |
| Product page | `view_item` | `view_item` | `ViewContent` | `ViewContent` |  | theme |
| Collection page | `view_item_list` | `view_item_list` |  |  |  | theme |
| Search | (built-in site search) | `view_search_results` | `Search` | `Search` |  | theme |
| Add to cart | `add_to_cart` | `add_to_cart` | `AddToCart` | `AddToCart` | `add_to_cart` tag | theme |
| Cart page | `view_cart` |  |  |  |  | theme |
| Newsletter sign-up | `generate_lead` |  | `Lead` | `Lead` | `newsletter_signup` tag | theme |
| Checkout started | `begin_checkout` | `begin_checkout` | `InitiateCheckout` | `InitiateCheckout` |  | custom pixel |
| Shipping chosen | `add_shipping_info` |  |  |  |  | custom pixel |
| Payment entered | `add_payment_info` |  | `AddPaymentInfo` | `AddPaymentInfo` |  | custom pixel |
| **Purchase** | `purchase` | **conversion** (enhanced) | `Purchase` | `Purchase` |  | custom pixel |

Shopify doesn't run theme code on the checkout and thank-you pages. Checkout events therefore come from a **custom pixel**, which you paste once into Shopify admin (step 3).

- **Value:** product revenue after discounts, without shipping or tax. GA4 also gets tax, shipping and the discount code.
- **Customer matching:** on purchase, Meta, TikTok and Google Ads get the customer's email, phone and address so they can match the sale to an ad click. Each platform hashes these before sending. GA4 gets no personal data.
- **Item IDs** are Shopify variant IDs, the same IDs Meta and TikTok use for catalogs synced from Shopify.

## Step 1: Create the accounts and get the IDs

The connected Meta and TikTok ad accounts belong to DanceLife X. Create WaggleKin's own, so audiences and conversions don't mix.

| Platform | Where to create it | ID to copy |
|---|---|---|
| **Google Analytics 4** | analytics.google.com → Admin → Create property "WaggleKin" (US, USD) → Web data stream for `wagglekin.com` | Measurement ID, `G-XXXXXXXXXX` |
| **Google Ads** | ads.google.com → Goals → Conversions → New conversion action → Website → add manually → Category **Purchase**, "Use different values for each conversion", Count **Every**. Then Tag setup → Install the tag yourself | The tag ID `AW-XXXXXXXXXX`, and the **conversion label**: the text after the slash in `send_to: 'AW-XXXXXXXXXX/AbCdEfGh123'` |
| **Meta pixel** | business.facebook.com → a WaggleKin business portfolio → Events Manager → Connect data sources → Web → name it "WaggleKin" | Dataset (pixel) ID: 15–16 digits |
| **TikTok pixel** | ads.tiktok.com (WaggleKin ad account) → Tools → Events → Web events → Set up web events → Manual setup | Pixel ID: starts with `C`, about 20 characters |
| **Microsoft Clarity** | clarity.microsoft.com → New project → `wagglekin.com` | Settings → Overview → Project ID |

Then change two settings:
- **GA4:** Admin → Data streams → your stream → Enhanced measurement → ⚙ → turn off **Page changes based on browser history events**. Picking a product variant changes the URL, and GA4 would count each change as a page view.
- **Google Ads:** Goals → Settings → **Enhanced conversions** → on → method "Google tag". The pixel already sends the hashed customer data it needs.

## Step 2: Paste the IDs into the theme

Online Store → Themes → Customize → ⚙ **Theme settings → Tracking & analytics**. Paste:
GA4 measurement ID, Google Ads tag ID, Meta pixel ID, TikTok pixel ID, Clarity project ID. Save.

The theme ignores a malformed ID (for example an old `UA-` Analytics ID) and logs a warning in the browser console.

## Step 3: Add the checkout pixel

1. Shopify admin → **Settings → Customer events → Add custom pixel** → name it `WaggleKin checkout`.
2. Paste the whole of [`docs/tracking/shopify-custom-pixel.js`](tracking/shopify-custom-pixel.js) into the code box.
3. Fill in `CONFIG` at the top with the **same IDs** as step 2, plus the Google Ads purchase **conversion label**.
4. Customer privacy: **Permission → Required**, tick **Marketing** and **Analytics**. **Data sale → Data collected qualifies as data sale**.
5. **Save**, then **Connect**.

## Step 4: Test

1. Install the **Meta Pixel Helper** and **TikTok Pixel Helper** Chrome extensions, and open **Google Tag Assistant** (tagassistant.google.com) on `wagglekin.com`.
2. Browse a product, add it to the cart, search, and sign up to the newsletter. Check the events in each helper, in GA4 → Admin → DebugView, and in Clarity → Recordings (allow about 30 minutes).
3. Place a test order: use Shopify's test mode (Settings → Payments → test mode / Bogus Gateway) or a 100%-off discount code. The purchase should show in GA4 Realtime, Meta Events Manager → Test events and TikTok Events Manager within minutes. Google Ads → Conversions can take a few hours to switch to "Recording".
4. Cancel or refund the test order afterwards.

## Privacy and consent

- Tags follow the visitor's choices from Shopify's Customer Privacy API: the cookie banner, the "Your privacy choices" page, and Global Privacy Control browser signals.
- **Analytics** permission switches on GA4 and Clarity. **Marketing** plus **sale of data** permission switches on Google Ads, Meta and TikTok.
- In the US, tracking is on unless the visitor opts out. If a visitor opts out, the ad tags stop. If a visitor accepts later, the tags load and catch up on the current page's events.
- Google consent mode v2 signals are sent too.
- If you sell to the EU/UK later, switch on Shopify's cookie banner (Settings → Customer privacy). The tags already respect it.
- Update the privacy policy to name Google Analytics, Google Ads, Meta, TikTok and Microsoft Clarity.

## Don't double-count

Use **one** source per platform. The official Shopify apps (Facebook & Instagram, TikTok, Google & YouTube) also fire these pixels. If you install one, clear that platform's ID in **both** the theme settings and the custom pixel.

The apps are worth switching to for Meta and TikTok once ad spend is meaningful. They add server-side events (Conversions API / Events API) that recover purchases blocked by ad blockers and iOS, and they sync the product catalog for dynamic product ads. For Google Shopping, the Google & YouTube app is also what feeds Merchant Center. Its product IDs (`shopify_US_<product>_<variant>`) differ from the variant IDs the theme sends, so let the app handle Google Ads remarketing too.

## Files

| File | What it does |
|---|---|
| `config/settings_schema.json` | "Tracking & analytics" theme settings |
| `snippets/tracking.liquid`, `snippets/tracking-item.liquid` | Pass the IDs and page data (product, collection, search, cart) to the script |
| `assets/tracking.js` | Loads the tags according to consent and sends storefront events |
| `assets/theme.js` | Dispatches `wagglekin:add-to-cart` after an add to cart succeeds |
| `sections/newsletter.liquid` | Marks a successful sign-up (`data-track-lead`) |
| `docs/tracking/shopify-custom-pixel.js` | Checkout and purchase events: paste into Settings → Customer events |
