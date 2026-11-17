# WaggleKin: Conversion (CRO) Audit, Strategy & Changes

**Date:** 13 November 2026.

**How the audit was done:**
- A full walkthrough of wagglekin.com on desktop and iPhone: home, menu, collections, search, product pages, cart and Shopify checkout. No order was placed.
- A line-by-line review of the theme code.
- Research into how Chewy, Amazon, Petco, PetSmart, BARK, Wild One, Fable, Allbirds, Glossier and Warby Parker convert, checked against Baymard Institute and Nielsen Norman Group UX research.
- A check of what Shopify Basic allows.

## 1. What was hurting conversion

| Problem found | Impact | Status |
|---|---|---|
| Choosing a colour or size never changed the photo. Links to a specific variant, as used by Google Shopping and ads, also opened on the wrong photo. | Shoppers can't see what they're buying, which leads to wrong orders and returns | **Fixed** |
| The whole site showed "sold out", and add-to-cart failed: the US market had no shipping enabled | No one could buy anything | **Fixed 12 Nov** |
| "Add to cart" on product cards silently added the first size or colour | Wrong-size orders on 121 products | **Fixed**: cards now show "Choose options" |
| No related or suggested products anywhere; add-to-cart only showed a 3.5-second toast | Every visit was a dead end, with no basket building | **Fixed**: related products, cart drawer, cart upsells |
| The homepage promised "15% off 3+ items" and "10% off for joining", but **no discounts exist** | Broken promises damage trust and invite complaints | **Copy made truthful** (decision needed, see §5) |
| The **Shipping, Returns and Terms policy pages returned 404**, and the Contact page was blank | Destroys trust, and Google Merchant Center and Meta Shops require these policies | Contact page **fixed**; **policies need you** (see §5) |
| Gambling spam ("casino", "starbet") sat inside 2 TopDawg dog-food descriptions | Google spam and Merchant Center risk | **Both products hidden**; TopDawg must fix the text |
| A cart under $49 mixing CJ and TopDawg items is charged $11.98 in shipping, not $5.99 | A surprise cost at checkout, the #1 reason for cart abandonment (Baymard) | Explained in the cart; upsells no longer create mixed carts (see §5) |
| "Bestseller" badges and "our best sellers" copy, but the store has no sales yet | False social proof | **Removed** |
| The Dogs collection opened with a wall of dog-food bags and $191–$355 wholesale display boxes | A poor first impression on the most-visited page | **Re-ordered** (curated order on 6 collections) |
| No filters, no product count, no search suggestions; a dead-end "no results" page | Hard to find things | **Fixed** |
| On mobile, the first screen was all image and thumbnails, with no sticky buy button and no zoom | Lower mobile add-to-cart rate | **Fixed** |
| No structured data; og:image used http | Weaker Google listings and social previews | **Fixed** |

## 2. What the big stores do, and what we adopted

| Pattern (who does it) | Evidence | WaggleKin now |
|---|---|---|
| Variant photo follows the colour you pick (Amazon, Chewy, Allbirds) | Baymard: shoppers rely on product images to judge a product, so showing the chosen variant is a basic expectation | Photo swaps instantly (no blank flash), the option label shows your choice, impossible or sold-out combinations are crossed out, and the page jumps to the nearest real variant |
| Arrival **date**, not "x days" (Amazon, Chewy) | Baymard: delivery dates beat speed ranges | "Order today, estimated delivery Thu, Nov 19 – Wed, Nov 25" (business days, skips weekends) |
| Free-shipping threshold and progress (Chewy and PetSmart at $49, Allbirds, Glossier) | Unexpected costs are the #1 abandonment reason (Baymard ~48%) | Product page states "$5.99 otherwise" or "Add $X more"; the cart shows a progress bar |
| Slide-out cart with add-ons (Allbirds, Gymshark, Chewy's "added to cart" panel) | Keeps shoppers on the page and lifts order value | Cart drawer: qty +/−, remove, 3 relevant add-ons that fit the gap to $49, Checkout |
| "You may also like" + "Pairs well with" (Amazon, Chewy) | Recommendations are a known driver of order value | Same category, same pet, same shipping speed; "Pairs well with" switches on once you set pairings (see §5) |
| Sticky add-to-cart on mobile (Gymshark, Glossier) | More reachable buy button on long pages | Appears after the main button scrolls away, showing the chosen variant and price |
| Image zoom and swipe gallery (all of them) | Shoppers judge product quality from photos | Swipe on mobile with a counter; tap or click to zoom with arrows |
| Search as you type (Amazon, Chewy, Petco) | Search users convert better; dead ends lose them | Products with photo and price after 2 letters, plus categories; "Popular with the pack" on no results |
| Filters with counts (all pet retailers) | Big grids need narrowing | Availability and price now; pet, size and colour once set up in Search & Discovery |
| Plain guarantee + trust near the buy button (BARK, Wild One) | A new brand must earn trust | 30-day returns, secure checkout and payment icons beside the button; Shipping and Returns accordions |
| Honest social proof only (everyone) | Fake reviews or badges backfire and are illegal under the FTC 2024 rule | No fake reviews or badges; reviews to come from real buyers (see §5) |

## 3. Theme changes (all tested on a preview theme, desktop + iPhone)

**Product page:**
- breadcrumbs;
- variant photo switching with preloading;
- crossed-out unavailable options and auto-selection of the nearest real variant;
- single-value options hidden ("Color: Dry");
- quantity stepper;
- "Buy with Shop Pay" hidden when the choice is unavailable;
- delivery date estimate and a shipping-cost line;
- payment icons;
- Description, Shipping & delivery, and Returns & guarantee accordions;
- "Pairs well with" slot;
- sticky add-to-cart on mobile;
- zoom lightbox;
- Product and BreadcrumbList structured data;
- app-block slot for future review apps.

**"You may also like" section:**
- **Picks:** same category, same pet, same shipping speed; no food on non-food pages; no wholesale boxes.
- **Setting:** switches to Shopify's automatic picks once the store has sales history.

**Cart drawer:**
- opens on every add-to-cart;
- free-shipping progress bar;
- a note when items ship from 2 warehouses;
- delivery badge per line;
- qty +/− and remove without page reloads;
- "Complete your order" add-ons: same pet, same warehouse, priced to close the gap to $49, never food;
- Checkout button.

**Cart page:** the same progress bar and upsells, delivery badges, and a trust line with payment icons.

**Collections:**
- breadcrumbs and product count;
- filters with active-filter chips and Clear all;
- sorting that keeps the filters;
- square images showing the whole product on white;
- first row of images loads immediately.

**Search:** search as you type in the header; product-only results page with a count; popular picks when nothing matches.

**Contact page:** a real form with name, email, order number, dog/cat and message.

**Homepage copy:** every claim is true today ("Free US shipping on orders over $49", US-only, no phantom discounts or quiz, no placeholders).

**Fixes:**
- broken mobile menu on small phones;
- desktop dropdown snapping shut;
- supplier hash codes used as image alt text;
- screen-reader price labels;
- og:image over https.

## 4. Store changes made through the Admin API

- **Curated order** on Dogs, Cats, Fast US Shipping, Walk, Toys and Beds:
  - First: everyday best sellers, then US-shipped products with several photos.
  - Pushed down: food bags. At the very bottom: wholesale display boxes.
  - New arrivals is sorted newest first.
- **Hidden:** 2 TopDawg dog foods with injected gambling spam (Grain Free Puppy, Free Spirit).
- **Removed:** the `badge:Bestseller` tag from 2 products.
- **Shipping profile tidy-up:**
  - The 5 original products moved into the CJ profile, so CJ-only carts pay one $5.99.
  - Mixed CJ + TopDawg carts still pay per warehouse under $49. That's a Shopify Basic limitation (see §5).

## 5. What needs you (in priority order)

1. **Write the store policies** (Settings → Policies): Refund, Shipping, Terms of service, Contact information. Footer links currently lead to a 404. Draft text is in §7; check it and paste it in, or tell Claude to publish it.
2. **Decide on offers**, then Claude can create them in Shopify and restore the copy:
   - **Welcome offer:** "Free shipping on your first order" costs less than 10% off on orders under $49, or 10% off if margins allow.
   - **Multi-buy:** 15% off 3+ items is risky on TopDawg items priced at MSRP (thin margins). A safer version is 10% off 3+ items, US-shipped CJ products only.
3. **Install Shopify Search & Discovery** (free, by Shopify):
   - add "complementary" pairings for your top 20–30 products (harness → leash, poop bags; litter box → mat, scoop; fountain → filters, mat). "Pairs well with" and the cart add-ons then use them automatically;
   - add filters for Pet, Size and Colour;
   - add search synonyms (kitty→cat, pup→dog, lead→leash).
4. **Reviews:** install Judge.me (free plan) for post-purchase review requests. Never import or seed reviews.
5. **Fix the TopDawg copy in TopDawg's Import List** (Shopify edits get overwritten):
   - remove the spam in the 2 hidden foods, then unhide them;
   - tidy titles such as "SCP …" and "LP …";
   - delete the diabetes and allergy claim on Dr. Becker's Bites.
6. **Mixed-warehouse shipping:**
   - **Option A (current):** keep as is. The cart explains it, and upsells don't create mixed carts.
   - **Option B:** make TopDawg shipping free on orders over about $20. This removes the double charge but costs margin on small TopDawg-only orders.
7. **Brand the checkout** (Settings → Checkout → Customize: logo, colours; allowed on Basic) and set the homepage SEO title and description (Online Store → Preferences).
8. **Holiday:**
   - Christmas items shipped from China need an order cut-off of about **30 Nov**;
   - consider a "Order by Dec 15 for Christmas delivery" line for US-warehouse items.
9. **WaggleKin TV:** the homepage shows "Episode 1 · Coming soon" with no video. Add the first episode, or hide the section until it exists.

## 6. How to measure (Shopify Analytics, Basic plan)

- **Before / after funnel:** sessions → add to cart → reached checkout → purchased, filtered to human traffic. Note the baseline on deploy day.
- **Reports to watch:** "Product recommendation conversions", "Searches with no results", "Sessions by landing page".
- **A/B testing:** with little traffic, A/B tests can't reach significance yet. Ship evidence-backed defaults first, then test (for example $49 vs $39 threshold, welcome offer A vs B) once there are about 1,000 sessions a week.

## 7. Draft policies (check before publishing)

**Shipping policy (draft):**
- We ship to US addresses only.
- Shipping is **free on orders of $49 or more**; otherwise it's $5.99 per shipment.
- Items marked "Fast US shipping" ship from our US warehouse and usually arrive in **3–7 business days**.
- Items marked "Value pick" ship from our international warehouse and usually arrive in **7–14 business days**.
- Some orders ship from more than one warehouse and arrive in separate parcels, each with its own tracking number. On orders under $49, shipping is charged per parcel.
- Orders are processed within 1–2 business days.
- You'll receive tracking by email as soon as your order ships.

**Refund policy (draft):**
- You have **30 days from delivery** to request a return or refund. Email us with your order number.
- Items must be unused and in original packaging, except faulty or damaged items, which we always replace or refund.
- *[Decide: who pays return shipping, and whether low-cost items are refunded without a return.]*
- Refunds go back to your original payment method within 5–10 business days of approval.
- For hygiene reasons, opened food, treats and grooming consumables can't be returned unless faulty.

**Contact information (draft):**
- WaggleKin
- Email: *[support email]*
- We reply within 1 business day, Monday–Friday.
- *[Business address of the US LLC]*
