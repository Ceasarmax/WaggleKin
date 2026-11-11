# WaggleKin Shopify theme

A custom Online Store 2.0 theme built from the "Store homepage — light" mockup.
Everything on the homepage is editable in **Online Store → Themes → Customize**.

## Install

Pick one:

- **GitHub (recommended):** Shopify admin → Online Store → Themes → Add theme → **Connect from GitHub** → choose this repo and the branch. Shopify keeps the theme in sync with every push.
- **Zip upload:** Online Store → Themes → Add theme → **Upload zip file** → upload `wagglekin-theme.zip` (zip the theme folders: `assets config layout locales sections snippets templates`).

Preview it first, then **Publish** when you're happy.

## Store setup the homepage expects

The homepage template links to these by handle. Create them (or pick other ones in the theme editor).

| What | Handle(s) |
| --- | --- |
| Collections | `dogs`, `cats`, `beds`, `toys`, `feeding`, `grooming`, `travel`, `walk`, `pack-favourites` (+ optional `bundles`, `new-arrivals`) |
| Pages | `wagglekin-tv` (use the **page.tv** template), `pack-quiz`, `our-story` |
| Menus | `main-menu` (Dogs, Cats, Beds, Toys, Feeding, Grooming, Bundles, WaggleKin TV — the last item is highlighted), `footer-shop`, `footer-help`, `footer-wagglekin` |

Tip: make the collections **automated** on product tags (e.g. `dogs` = tag is `Dogs`, `pack-favourites` = tag is `Pack favourite`).

## Products

- **Pet label** above the title (e.g. "DOGS & CATS") is the product's **Product type**.
- **Badges:** add a tag `badge:Bestseller` or `badge:New`. Products with a compare-at price automatically show "Save X%".
- **No photos yet?** Cards show a brand illustration picked from the product handle (bed, brush, fountain, lick mat, feeder, wand, gel mat, bottle). Override with tags `illo:fountain` and `bg:mint` / `bg:peach` / `bg:yellow` / `bg:pink`. Once you upload product photos, they replace the illustration.

## Markets & country selector

Active Shopify Markets: **United States (USD), Canada (CAD), United Kingdom (GBP), Australia (AUD)**. Malta is set to draft.
The header (desktop), the mobile menu and the footer show a country/currency selector listing the active markets. Switching updates prices and currency.
Turn it off in the theme editor (Header / Footer → "Show country/currency selector").

**Free-shipping threshold per country:** write `[threshold]` in the announcement bar, trust bar or product perks. It's replaced with the visitor's amount from Theme settings → Shipping (`US:$49, CA:C$69, GB:£39, AU:A$75`). Keep it in sync with the rates in Settings → Shipping and delivery.

Each market's checkout needs a shipping zone (Settings → Shipping and delivery). Product availability per market lives in Settings → Markets → (market) → Products.

## Section notes

- **WaggleKin TV:** paste a YouTube or Vimeo URL to make the play button work (the video loads only on click). Choose up to 4 "products in this episode".
- **Bundles:** pick a bundle product on each card and `[PRICE]` in the link text becomes its price.
- **15% off 3+ items:** the theme only advertises this. Create an automatic discount in Shopify admin → Discounts (15% off, minimum quantity 3).
- **Newsletter:** signs people up as customers tagged `newsletter`, with email marketing consent. Send the 10% welcome code from Shopify Email or your email app.

## Before launch

The mockup copy says "$49" and "US, UK, Canada & Australia", while the store currency is EUR (Malta). Update the announcement bar, trust bar and footer text in the theme editor to match your real shipping offer.
