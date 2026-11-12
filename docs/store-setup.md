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

## Before launch

- Check every description against the samples (dimensions, materials, the brush's self-cleaning mechanism).
- Decide the lick-mat price (€19.99 suggested) and ask CJ to confirm the set contains 2 mats.
- Switch the store currency to USD if the US LLC goes ahead, and re-enter prices.
- Syncee and Spocket have no official Claude connector. Import Syncee products via its Shopify app, then set them up here.
