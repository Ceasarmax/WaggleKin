# WaggleKin: Store & Fulfilment Setup

**Last updated:** 11 November 2026. Shopify store `wagglekin.com`; CJdropshipping store "WaggleKin (ifjd6h-u1)".

## Products linked to CJ (orders go to CJ automatically)

| Store product | Status | Price | CJ product / variant | Unit cost | Ships from · method |
|---|---|---|---|---|---|
| [Calming Donut Bed](https://wagglekin.com/products/calming-donut-bed) | Live | €54.99 | [Plush round bed](https://www.cjdropshipping.com/product/plush-round-pet-bed-dog-bed-winter-p-1728234740282560512.html), Light Gray M (60 cm) | $5.97 | China · CJPacket Ordinary, 4–9 d |
| [Whisper-Quiet Water Fountain](https://wagglekin.com/products/whisper-quiet-water-fountain) | Live, **US only** | €39.99 | [2.5 L fountain](https://www.cjdropshipping.com/product/2.5l-pet-water-fountain-automatic-circulating-cat-water-dispenser-with-transparent-water-tank-quiet-drinking-water-bowl-for-cats-and-small-dogs-p-2105148363299155969.html) | $22.20 | US warehouse · SpeedX US to US, free, 3–7 d |
| [3-in-1 Dog Travel Water Bottle](https://wagglekin.com/products/3-in-1-dog-travel-water-bottle) | Live | €21.99 | [3-in-1 bottle](https://www.cjdropshipping.com/product/pet-water-bottle-feeder-bowl-garbage-bag-storage-portable-pet-outdoor-travel-3-in-1-dog-water-bottle-p-FC14FBC6-7138-4878-99F7-289DBFB9D536.html), Green 300 ml | $4.50 | China · CJPacket Ordinary, 4–9 d |
| [Self-Cleaning Slicker Brush](https://wagglekin.com/products/self-cleaning-deshedding-brush) | Live | €19.99 | [Self-cleaning slicker brush](https://www.cjdropshipping.com/product/pet-self-cleaning-slicker-brush-p-AEF754AF-2F7F-424E-897C-2BF7DF141B30.html), Yellow | $3.83 | China · CJPacket Ordinary, 4–9 d |
| [Interactive Feather Wand Set](https://wagglekin.com/products/interactive-feather-wand) | Live | €24.99 | [2 wands + 9 refills](https://www.cjdropshipping.com/product/-p-2083109530272174082.html) | $5.96 | China · CJPacket Ordinary, 4–9 d |
| Slow-Feed Lick Mat (2-pack) | **Hidden (draft)**, waiting for a price decision | €19.99 (was €16.99) | [Silicone lick pad, Blue set](https://www.cjdropshipping.com/product/silicone-dog-lick-pad-pet-slow-food-plate-p-1358351884657758208.html) | $3.16 | China · CJPacket Ordinary, 4–9 d |

**Not stocked (hidden):**
- **Smart Auto Feeder.** The best CJ option ($19.57, 1.15 kg, 2 L timer feeder) only works at **€74.99+**. It also ships **without a power adapter**, carries another brand's logo in its photos, and has no CE/UKCA data.
- **Cooling Gel Mat.** The 55×66 cm gel mat costs $27.80 to ship to the US, so it **loses money at €34.99**. It needs about €64.99. A small 30×40 cm version would work at €34.99, but only suits cats and small dogs.

## How fulfilment is wired (don't undo)

1. **Shipping profile.** The `cjdropshipping` and `Syncee` locations were added to the General shipping profile, so Shopify can ship items stocked there.
2. **CJ-linked products are stocked only at the `cjdropshipping` location**, not the Malta address, so every order is routed to CJ.
3. **CJ only recognises products and variants that existed when the store was first connected (11 Nov, 17:07).** CJ couldn't link products or options created later ("Shop Product/Variant not exists"). That's why each product has one option: the original placeholder listings were reused. To add sizes or colours later, test whether CJ has re-synced, or re-authorise the CJ app.
4. **US-only fountain.** The market catalog **"International (no US-only items)"** covers Canada, UK, Australia and Malta. It contains every product except the fountain and adds new products automatically. An unused catalog publication from setup remains; it's harmless.
5. Duplicate copies made during setup (`calming-donut-bed-duplicate`, `quiet-pet-water-fountain-2-5-l`, `3-in-1-dog-travel-water-bottle-duplicate`) are **archived**. They're safe to delete.

## US-only market and delivery tiers (12 Nov 2026)

- **Markets:** only the **United States** is active. Canada, UK and Australia are switched to draft, and Malta was already draft. Store currency is **USD**.
- **Two delivery tiers, set by product tag:**
  - `ship:us` means CJ US warehouse, 3–7 business days. These products appear in the **Fast US Shipping** collection.
  - `ship:global` means CJ China warehouse, 7–14 business days, at lower prices. These products appear in the **Value Picks** collection.
  - Both collections are automatic and in the main menu.
  - The theme shows a matching delivery badge on product cards and product pages (`snippets/delivery-badge.liquid`). The day ranges can be edited in Theme settings → Shipping.
- **China products are kept separate (12 Nov):** every category collection now has a second rule, "NOT tagged `ship:global`". That covers Dogs, Cats, Beds, Toys, Feeding, Grooming, Travel, Walk, Pack favourites, New arrivals and Bundles. So the main shop shows fast US-shipped products only, and China-shipped products appear only in **Value Picks**. Any new category collection must get the same exclusion rule. For the 200-product launch, US-warehouse items take priority and China items are capped at about 25%.
- **Shipping profiles:** CJ also created "Profile" (CJ location, US: Standard $5.99, free over $49; the free tier was added via the API). CJ now uses it when publishing. "CJdropshipping - US" (US zone only: $5.99, free over $49) is for US-warehouse products published through CJ. China-shipped items use the General profile.
- **Theme branch:** the live theme deploys from GitHub branch `claude/cool-ride-76foiz`. Theme changes on other branches only go live once merged into it.

## Fix: everything showed "sold out" (12 Nov 2026, night)

**Symptom.** The live site showed every product as sold out, and add-to-cart returned "already sold out", even though the admin listed every product as available.

**Cause.** The **United States market had no market-level shipping**: `Market.delivery.shipping` was null, while the draft Malta market had it enabled. Shopify treats products as unbuyable in a market it can't ship to.

**Fix.** Ran `marketUpdate(United States, delivery.shipping.isEnabled = true)`. No market-level rates were added: the delivery-profile rates still apply ($5.99, free from $49).

**Verified on wagglekin.com after the fix:**
- 153 of 153 products can be bought.
- Add-to-cart works.
- A New York address gets "Standard Shipping $5.99".

**Don't undo this.** If a new market is ever activated, check that its shipping is enabled too.

## Catalogue status (12 Nov 2026, evening)

- **153 products live** (all buyable after the sold-out fix above):
  - 76 `ship:us`, in Fast US Shipping (80 in that collection).
  - 77 `ship:global`, in Value Picks (79 in that collection).
- **China share is about 50%, above the ~25% target.** Trim it, or add US stock, before ads start.
- **Apparel: 33 live.** The Apparel collection shows only the 9 US-shipped ones. The other 24 are China-shipped and appear in Value Picks.
- **Christmas items shipping from China** (tagged `season:holiday` + `ship:global`) need an order cut-off of about **30 Nov** to arrive by Christmas. Set them to draft after that date.
- **Rain vest.** Only pink, size L, is linked: CJ lists the other colours and sizes under separate products.
- **Drafts (34) include:**
  - 25 Syncee rope toys.
  - 5 safety holds.
  - The wheelchair and soft crate (CJ rejected them for empty SKUs).
  - The heartbeat plush.
  - The lick mat.

## Pet food and treats (planned, 12 Nov 2026)

The owner approved both **US-made treats and chews** and **full dry/wet food**. Neither comes from CJ: both go through a US pet distributor's Shopify app.
- **First choice: TopDawg.** The owner installs the app, creates the account and imports products as drafts.
- **Fallback: PetDropShipper** ($109/mo, food-focused, but its Shopify app is rated poorly).
- **Never source edible products from China.**

Once the products are imported:
- **Pricing.** Same check against the market (Chewy, Amazon, Walmart), but the brand's minimum advertised price comes first. Expect thin food margins (about 15–25%); treats run about 30–40%.
- **Food shipping.** Food gets its **own weight-based shipping profile**. Large bags must not ride on "free shipping over $49". Import only bags under about 6 lb, plus wet-food multipacks.
- **Tags.** `ship:us`, plus a new `Food & Treats` tag, so food and treats appear in the Fast US Shipping section.
- **Collections.** **Dog Food & Treats** and **Cat Food & Treats** (each excluding `ship:global`), added under Dogs and Cats in the main menu.
- **Copy.** Keep the brand's own label wording; make no health claims.

### TopDawg connection (researched 12 Nov 2026)

- **Connected.** The TopDawg app is installed on Shopify. It created the fulfilment location "TopDawg Fulfillment (UID 17552)", so synced products route orders to TopDawg.
- **No usable API.** TopDawg's API is a Premier-only add-on ($139.99–199.99/mo) on a *separate* "Custom Integration" membership. Support issues the token, and there are no public docs. It isn't worth it for this store.
- **No scraping.** TopDawg's Terms forbid robots and scrapers on its site, so the assistant does not script the TopDawg site or dashboard.
- **How we work with it:**
  1. The owner adds products to the import list in the TopDawg dashboard (or downloads the Favorites CSV for review).
  2. The owner clicks "Add to Store".
  3. The assistant does everything after that in Shopify: pricing against market and MAP, tags, collections, shipping profile and copy.
- **Plan needed.** The free Start-Up plan cannot even add products to the import list, so the Shopify integration needs **Business** ($49.99/mo, or $419.88/yr).
  - The 7-day trial is for Business Monthly only. It needs a card and converts to paid unless you downgrade.
  - Upgrade the **Shopify** integration, not the "Custom Integration" that TopDawg creates at sign-up.
- **Costs per order:** wholesale price + actual carrier shipping (USPS/UPS/FedEx, priced by weight) + an order fee ($1.50 on the annual Business plan; the monthly fee is not published). We pay this even when the customer gets free shipping, so prices must cover it.
- **Shipping and returns:**
  - Ships in about 2 business days; delivery in 2–5.
  - Returns follow each supplier's policy and need an RMA from TopDawg. The retailer pays return costs, and refunds come back as TopDawg credit.
- **MAP:** enforced. A violation gets 7 days to fix, then suspension.
- **Orders:** sync into TopDawg automatically or via "Request Fulfillment" on the Shopify order; TopDawg's docs conflict. Check this on the first order.
- **Range (public catalogue, 12 Nov):**
  - **Treats and chews:** decent. About 600 SKUs, including ChewMax (made in USA), Redbarn, bully sticks, yak and buffalo chews, and Savannah ostrich chews. Many listings are case packs.
  - **Food:** weak. Niche brands only (Canine Caviar, Forza10, Pet Wonder freeze-dried). There are no mainstream brands (Purina, Hill's, Blue Buffalo and so on).
  - **Cat food:** all 16 groups were out of stock.
  - **Lickable cat treats:** none.
- **Verdict:** use TopDawg for **treats and chews**. Full **food** would need a different distributor, or should wait.

### TopDawg import results (12 Nov 2026, night)

- **What arrived.** The owner imported 47 products: 30 from the shortlist, plus 16 Canine Caviar items and 1 flea treatment.
- **Review method.** Each product was checked against the market (Chewy, Amazon, Walmart and brand sites), costed with shipping plus a $1.75 fee, and re-checked by a second reviewer.
- **What passed.** Only **4** clear the 25% margin floor at a competitive price:
  - Woof Nific collagen sticks
  - Woof Nific "bully" sticks (the reviewer suspects these may really be collagen sticks)
  - ChewMax turkey feet, 18-count
  - ChewMax duck feet, 3 lb
- **What failed.** Everything else: TopDawg's wholesale price is about 58% of retail, we pay real shipping plus a fee on every order, and Chewy and brand sites sell at or below TopDawg's suggested retail. Canine Caviar food bags work out at a 4–10% margin; the boxes are 35–50-piece wholesale displays.
- **What TopDawg overwrites.** Its sync **overwrites price and title** edits made in Shopify within minutes, so prices must be set in TopDawg's Import List. **Tags and Draft status stick.**
- **Shipping profile.** TopDawg created its own shipping profile, "Delivery Profile - Free - 17552", with **free shipping worldwide**. It was changed to Standard $5.99 below $49 and free from $49.
- **Owner's decision (12 Nov, night).** Sell at TopDawg's suggested retail (MSRP), which is the price TopDawg syncs into Shopify.
  - **45 in-stock products are live.** The 2 out-of-stock ones stay Draft: Beloved Pets calcium bones and the Artullano cat flea treatment.
  - **Tags.** Each live product is tagged `ship:us`, `topdawg-fulfilled`, `review:pending` and `Dogs` (Dr. Becker's Bites also get `Cats`). Food items get `Food`; everything else gets `Treats & Chews`. ChewMax items get `Made in USA`, the Loving Pets treats get `Training`, and the puppy food gets `Puppy & Kitten`.
  - **Collections.** **Dog Food** (8), **Dog Treats & Chews** (37) and **Cat Treats** (2) are published and in the main menu: Dogs → Food / Treats & Chews, and Cats → Treats.
  - **Per-order profit at MSRP.** Counting the $5.99 the customer pays on orders under $49, almost every variant makes a profit. A single turkey foot ($2.99) breaks even, and the $6.99 ChewMax jerky and the Bully Skinz make about $0.65 an order.
- **To fix in TopDawg's Import List.** TopDawg overwrites these in Shopify, so they must be edited on TopDawg's side:
  - titles with codes such as "SCP" and "LP";
  - the Dr. Becker's text about diabetes and allergies;
  - garbled "??" characters in the Woof Nific descriptions.

## Syncee drafts (not live)

There are 25 Monli / Knotty Pawz rope toys, tagged `KNOT`, imported through the Syncee app.
- **Price.** Syncee priced them at cost +10%, which loses money after shipping. They need repricing with the supplier's real shipping cost and origin.
- **Tags.** Their keyword tags need replacing with tier and category tags before they go live.

## Before launch

- Check every description against the samples (dimensions, materials, the brush's self-cleaning mechanism).
- Decide the lick-mat price (€19.99 suggested) and ask CJ to confirm the set contains 2 mats.
- ~~Switch the store currency to USD.~~ Done. The first table above still shows the original € prices; the live prices are in USD.
- Clear the 5 products tagged `hold:safety-check` (they need the supplier's UL/FCC/battery/button-cell certificates) before publishing them.
- Remove `review:pending` from each product once you have checked it in the admin.
- Syncee and Spocket have no official Claude connector. Import Syncee products via its Shopify app, then set them up here.
