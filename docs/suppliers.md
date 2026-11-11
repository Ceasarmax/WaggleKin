# WaggleKin — Dropshipping Supplier Research

**Prepared:** 11 November 2026 · **Store:** WaggleKin (Shopify, Malta-registered, EUR base) · **Markets:** US, CA, UK, AU, MT/EU
**Scope:** Research only. Nothing was signed up for, contacted or purchased.

> **How to read this.** Most pricing and delivery figures come from third-party reviews published in 2025–2026, not from the vendors' own price pages. Where a figure could not be checked against a current primary source it is marked **(unverified)**. Wholesale costs are **indicative ranges** built from factory and wholesale listings plus reviewer test orders. Before you list any product, confirm the live price, the warehouse stock and the shipping quote in each supplier's dashboard.

---

## 1. Executive summary and recommendation

**Recommended stack: CJdropshipping (primary, about 80–90% of orders) plus Syncee (backup for local suppliers in UK, AU and CA).**

| | Why |
|---|---|
| **CJdropshipping** (free; optional $15.99–$59.99/mo tiers) | One app covers four US warehouses (CA, NJ, TX, IN), a UK warehouse, EU warehouses (DE, FR, ES, IT, CEE) and partnered AU warehouses. It stocks all 8 product types or close equivalents, includes QC on every plan, and offers custom packaging (inserts and boxes stored at the shipping warehouse). Free registration, no per-order platform fee. |
| **Syncee** ($0–$99.99/mo, 0% transaction fee) | A marketplace whose suppliers are mainly in the US, CA, UK, EU and AU. Use it to fill CJ's gaps: **Canada** (CJ has no confirmed Canadian warehouse), and AU or UK SKUs that CJ doesn't hold locally. This matters most for electronics that need certified local plugs. |

**Routing orders by country:**
1. **Start here: buy stock into CJ's local warehouses.** CJ routes each order to the nearest warehouse that holds stock ([CJ blog, Nov 2025](https://cjdropshipping.com/blogs/cj-news/CJ-s-Global-Warehouses); [CJ Shopify guide](https://cjdropshipping.com/blogs/cj-news/CJdropshipping-for-Shopify-Stores-Guide)). If a product is listed in more than one warehouse, CJ's own guide says to assign the fulfilment source by customer base: US customers to the US warehouse, EU to the EU warehouse, and so on. I could not find documentation of a per-country "warehouse priority" setting in the CJ Shopify app. **Verify this in the app before launch (unverified).**
2. **Electrical items (fountain, feeder): one SKU per plug region.** Create a variant or product per region (US/CA Type A, UK Type G, AU Type I, EU Type C/F). Use **Shopify Markets** product availability to show each market only its own SKU, and map each SKU to the right supplier or warehouse in CJ or Syncee. The supplier choice is then made by the SKU, not by a rule the app would have to support.
3. **Canada:** at launch, fulfil from CJ's US warehouses (about 5–10 days). Shipping DDP keeps duties off the customer. If CA volume grows, add a Canadian pet supplier through Syncee or directly (see §3.2).
4. **No CJ stock in a region:** fall back to CJ China via CJPacket (7–17 days). Show honest delivery estimates for that market.

**Why not the others as primary:** Spocket and Zendrop are US/EU-centric and cost more ($39.99–$299.99 and $49–$79/mo). BigBuy is EU-only in practice (EU 1–3 days; US/AU not offered or slow). DSers/AliExpress is cheap and has EU "Local+" stock (UK, DE, ES), but I could not confirm per-country supplier routing (§2.3). AutoDS is an automation layer, not a warehouse network.

---

## 2. Platform comparison

### 2.1 Local-warehouse coverage by region

| Platform | US | CA | UK | AU | EU | Notes / sources |
|---|---|---|---|---|---|---|
| **CJdropshipping** | ✅ 4 warehouses (CA, NJ, TX, IN). 2–7 days; one reviewer measured 3–8 days for 500 g from US stock (Oct 2026) | ⚠️ CJ's supplier page lists Canada as "live", but no warehouse location found **(unverified)**. Plan on serving CA from the US | ✅ 1 warehouse; days not published (expect 2–5) **(unverified)** | ⚠️ "Partnered" warehouses, 2–7 business days; narrower catalogue, pet range "inconsistent" | ✅ DE (Frankfurt), FR, ES, IT, CEE | [CJ warehouses blog](https://cjdropshipping.com/blogs/cj-news/CJ-s-Global-Warehouses), [Easync review Oct 2026](https://easync.io/articles/cj-dropshipping-review/), [CJ supplier page](https://suppliers.cjdropshipping.cn/), [Shoplazza AU guide Jun 2026](https://www.shoplazza.com/blog/cjdropshipping-features-for-australian-stores), [Bettamax CA guide](https://bettamax.com/best-dropshipping-suppliers-in-canada/) |
| **Syncee** | ✅ supplier-dependent | ✅ supplier-dependent | ✅ | ✅ | ✅ | Suppliers are mainly US/CA/UK/EU/AU; delivery and returns vary by supplier ([Syncee pricing](https://syncee.com/pricing/)) |
| **Spocket** | ✅ | ✅ (some) | ✅ (some) | ✅ (some) | ✅ | US delivery about 5–12 business days door to door in reviewer tests; older "2–5 day" claims are stale ([Ecommerce Paradise, Oct 2026](https://ecommerceparadise.com/spocket-review-2026-the-best-us-and-eu-dropshipping-platform-for-fast-shipping-stores/)) |
| **Zendrop** | ✅ US warehouse (avg 8.5 days reported) | ❌ ships from US/CN | ❌ | ❌ | ❌ | [Branvas comparison](https://branvas.com/blogs/news/zendrop-vs-autods), [Zendrop pet](https://www.zendrop.com/pet-supplies/) |
| **DSers / AliExpress Choice** | ⚠️ some US-stock listings, 3–8 days | ❌ | ✅ Local+ (UK) | ❌ | ✅ Local+ (DE, ES); Choice about 7–10 days ES/FR | [Cross-Border Magazine](https://cross-border-magazine.com/aliexpress-launches-local/), [FashionUnited Jun 2025](https://fashionunited.com/news/business/aliexpress-strengthens-european-presence-with-local-warehouses/2025061666593), [AliDrop Choice guide](https://www.alidrop.co/blogs/what-is-aliexpress-choice) |
| **BigBuy** | ❌ (ships from Spain, slow and costly) | ❌ | ⚠️ 2–5 days from ES | ❌ | ✅ 1–3 days, dispatch in 24–48 h | [BigBuy shipping](https://www.bigbuy.eu/en/shipment-and-delivery.html), [Copyfy review](https://www.copyfy.io/en/blog/bigbuy-review), [Dodropshipping pricing](https://dodropshipping.com/bigbuy-pricing-plans/) |
| **AutoDS** | Automation layer over AliExpress/CJ/US marketplaces and its own sourcing; no own regional network for these markets | | | | | [AutoDS cost comparison](https://www.autods.com/blog/subscription-costs-comparison-autods-cjdropshipping-zendrop/) |
| **Doba / Wholesale2B / TopDawg / inQ Boutique** | ✅ US suppliers (TopDawg is pet-strong) | ⚠️ Wholesale2B and inQ Boutique have some CA suppliers | ❌ | ❌ | ❌ | [Doba pet suppliers 2026](https://www.doba.com/blog/find-products-and-suppliers/niche-products/best-pet-dropshipping-suppliers-for-2026-39578), [TopDawg Shopify app](https://apps.shopify.com/topdawg), [SaleHoo CA list](https://www.salehoo.com/learn/canadian-dropship-suppliers) |
| **Faire** | Wholesale only (MOQ, ships to you, not to customers). Useful for branded US stock, e.g. PetAmi calming donut bed at $23.99 wholesale, MOQ 5 | | | | | [Faire listing](https://www.faire.com/product/p_z82npqq7ds) |

### 2.2 Pet-specific local suppliers (backup or second source)

> **Superseded:** the verified, country-by-country list is in [`suppliers-by-country.md`](suppliers-by-country.md). The rows below are kept for history, with corrections.

| Region | Supplier | Notes |
|---|---|---|
| UK | **Avasam** (marketplace, about 100+ UK suppliers, Shopify app; free plan, paid from about £24.99/mo + VAT) | 2–5 business days UK/EU **(unverified)**; mixed reviews ([Embedany review 2026](https://embedany.com/blog/avasam-review-uk-dropshipping/), [Shopify app](https://apps.shopify.com/avasam)) |
| UK | **Go Dropship** | All stock in a UK warehouse, free UK mainland delivery, no MOQ ([pet category](https://www.godropship.co.uk/pet-supplies-c241)) |
| UK | ~~Pet Supply UK~~, ~~Petplanet~~ | **Re-checked Nov 2026: drop both.** Pet Supply UK has no findable official site. Petplanet is a retailer that went into administration, with no dropship programme. See [`suppliers-by-country.md`](suppliers-by-country.md) |
| AU | **Southern Pet Supplies** (formerly Agline) | Australian pet distributor in Adelaide; no signup or handling fees. **Requires an Australian ABN.** Details in [`suppliers-by-country.md`](suppliers-by-country.md) |
| AU | **Dropshipzone**, **Ozdingo** | Local delivery 1–7 days; Dropshipzone has a Shopify app. **Wefulfil re-checked: it ships from China, not Australian stock.** Details in [`suppliers-by-country.md`](suppliers-by-country.md) |
| CA | ~~Leading High-Quality Pet Products~~ | **Re-checked Nov 2026: drop.** This is SaleHoo's anonymised listing for Pet Science Ltd (Brampton), which excludes online-only stores. See [`suppliers-by-country.md`](suppliers-by-country.md) for what works in Canada |
| CA | ~~inQ Boutique~~ | **Re-checked Nov 2026:** its Doba listings ship from the **US only**, so treat it as a US supplier |
| US | **TopDawg** | US pet-strong marketplace; free tier to view wholesale prices; paid tiers about $35–$200/mo **(conflicting figures)**; fees billed outside Shopify ([Shopify app](https://apps.shopify.com/topdawg), [Embedany review](https://embedany.com/blog/topdawg-review-us-dropshipping)) |

### 2.3 Shopify integration, pricing, fees, branding, samples

| Platform | Shopify app / automation | Route by customer country? | Subscription (2026) | Fees | Branding / packaging | Samples |
|---|---|---|---|---|---|---|
| **CJdropshipping** | Yes. Paid orders sync automatically; you choose shipping and pay per order (batch payment possible); inventory and tracking sync | Nearest stocked warehouse is picked automatically; manual per-product fulfilment source. No documented per-country rule setting **(verify)** | Free; Plus $15.99, Prime $19.99, Advanced $59.99/mo | No platform fee. You pay product + shipping. Storage for own stock: US free for 60 days, then $0.63/CBM/day. Fulfilment of own stock $0.50/order (≤1 kg). Minimum to stock an overseas warehouse: 10 per variant / 100 total | Custom packaging: boxes, inserts, stickers. Reported cost about $0.30 (sticker) to $2+ (rigid box), MOQ about 1–100 depending on item **(unverified)** | Order a normal order to yourself; no formal sample programme documented |
| **Syncee** | Yes. Order and tracking sync, pay supplier per order (card/PayPal) | One supplier per product. Use separate SKUs per Market | Free; Basic $39.99 (100 products); Pro $59.99 (250); Business $99.99 (10k); 3-day trial ([pricing](https://syncee.com/pricing/)) | 0% transaction fee | Depends on supplier | Depends on supplier; many allow sample orders |
| **Spocket** | Yes. Auto order pass-through, stock and price sync | No | Starter $39.99 (25 products), Pro $59.99, Empire $99.99, Unicorn $299.99/mo; annual from $24/mo | 0% transaction fee | Branded invoice (packing slip) | Sample orders available |
| **Zendrop** | Yes. Auto fulfilment on paid plans | No | Free (no orders); Pro $49/mo; Plus $79/mo ([checkthat](https://checkthat.ai/brands/zendrop/pricing)) | Product + shipping | Custom branding on paid tiers | Yes |
| **DSers** | Yes (official AliExpress partner); Basic/Standard/Advanced/BOGO/Bundle mapping | Advanced mapping "organises shipping from different suppliers", but I found no confirmation of per-destination-country supplier selection **(unverified)** ([DSers mapping PR](https://itdigest.com/hardware-and-networks/iot/dsers-releases-upgraded-mapping-functionality-to-streamline-dropshipping-for-sellers/)) | Free tier; paid tiers available ([app](https://apps.shopify.com/DSers)) | AliExpress price | Limited | Buy one on AliExpress |
| **BigBuy** | Shopify connector (included in Ecommerce Pack) | EU only | About €89–€120/mo + about €89 registration ([Dodropshipping](https://dodropshipping.com/bigbuy-pricing-plans/)) **(figures conflict)** | Shipping from €5 (EU) | White-label shipping | Yes |
| **AutoDS** | Yes. Full automation across many suppliers | Supplier-level | From about $26.90–$39.90/mo **(conflicting)** | Varies | Via its sourcing service | Yes |

---

## 3. Product sourcing: the 8 SKUs

### 3.1 Indicative costs and margins

Costs are in **USD per unit** to the end customer, before tax, payment fees (about 3%) and ads. "Product" is the typical dropship price on CJ/AliExpress-type listings for a mid-quality version. "Ship" is the local-warehouse or CJPacket cost to the customer. **All ranges are estimates (unverified for live prices).** They are built from factory and wholesale listings and reviewer test orders cited in the right-hand column.

| # | Product | Retail | Product cost | Ship cost | Est. gross margin* | Where to source / evidence |
|---|---|---|---|---|---|---|
| 1 | Calming donut bed (60–70 cm) | 54.99 | $8–16 (vacuum-compressed) | $8–15 (bulky, 1–1.5 kg volumetric) | **≈ $30 (55%)** | CJ / AliExpress "fluffy calming donut bed" (US, EU, UK stock common). Branded US alternative: PetAmi on Faire, $23.99 wholesale, MOQ 5 ([Faire](https://www.faire.com/product/p_z82npqq7ds)). Retail benchmark $39–75 ([HyperSKU, Oct 2026](https://www.hypersku.com/blog/pet-dropshipping-products-2026/)) |
| 2 | Self-cleaning slicker brush | 19.99 | $2–5 | $2–5 | **≈ $13 (65%)** | Factory price $1.29 at MOQ 100 ([keansilicone](https://m.keansilicone.com/Houseware/)); widely stocked on CJ / Syncee |
| 3 | Quiet water fountain + filter (2–2.5 L) | 39.99 | $8–15 | $5–10 | **≈ $21 (53%)** | Wholesale 2.5 L at $10 ([Petwant](https://petwant.com/collections/pet-water-fountain)). **Choose USB-powered (5 V)** to simplify plug compliance. Sell replacement filters as a repeat-purchase add-on |
| 4 | Slow-feed lick mat (2-pack) | 16.99 | $2–4 per pack | $2–5 | **≈ $10.5 (62%)** | Factory price $1.42/mat at MOQ 100 ([keansilicone](https://m.keansilicone.com/Houseware/)). CJ blog puts lick mats at "a couple of dollars" ([CJ blog](https://cjdropshipping.com/blogs/dropshipping-niches/most-popular-pet-dropshipping-products-in-us)); TopDawg lick-mat category ([TopDawg](https://topdawg.com/dropshipping-products/category/Lick%20Mats)) |
| 5 | Smart / automatic feeder | 69.99 | Timer model $15–25; Wi-Fi/app $25–41 | $10–18 (2–3 kg) | Timer **≈ $36 (52%)**; Wi-Fi **≈ $24 (35%)** | Petwant wholesale: 3 L Wi-Fi $24.99, 3.5 L $37.99, 4.5 L $40.99 ([Petwant feeders](https://petwant.com/collections/pet-feeders)). **Highest compliance burden; see §4** |
| 6 | Interactive feather wand (with refills) | 24.99 | $1.5–4 | $2–4 | **≈ $19 (75%)** | Generic CJ/AliExpress teaser wands. At $24.99, bundle with 5–10 refill feathers or a telescopic/bell wand to justify the price |
| 7 | Pressure-activated cooling gel mat (M/L) | 34.99 | $5–12 | $5–12 (gel is heavy) | **≈ $18 (51%)** | US wholesale MSRP $18.99 ([Petfairs](https://us.petfairs.com/product/xl-non-slip-breathable-cooling-mat-for-pets/)). Seasonal: stock AU in Nov–Feb, US/UK/EU in May–Aug |
| 8 | 2-in-1 dog travel water bottle (water + food) | 21.99 | $3–6 (US suppliers $4–11) | $2–5 | **≈ $13.5 (61%)** | Factory price $2.82 at MOQ 100 ([keansilicone](https://m.keansilicone.com/Houseware/)); US supplier range per [Spocket blog](https://www.spocket.co/blogs/dog-accessories-dropshipping-guide-best-products-and-suppliers) |

\*Margin = retail − product − shipping, at the midpoint, before payment fees, ads, returns and tax.

**Important price adjustments:**
- **VAT/GST-inclusive markets.** If UK (20% VAT), EU/Malta (18% MT VAT, or the destination rate under OSS) and AU (10% GST) retail prices are shown tax-inclusive, net revenue falls to ÷1.20 / ÷1.18 / ÷1.10. Example: the €54.99 bed nets €46.60 in Malta. Price UK/EU/AU retail about 10–20% higher than US, or accept thinner margins.
- **US tariffs.** Duty-free de minimis ended on 29 Aug 2025. China-origin goods now pay duty on entry, whether they arrive as parcels or as bulk stock into a US warehouse ([Avalara](https://www.avalara.com/us/en/blog/de-minimis-exemption-changes-coming.html); [Easync](https://easync.io/articles/cj-dropshipping-review/)). CJ US-warehouse prices already include this, so expect them to be 10–30% above China prices. Tariff rates changed repeatedly in 2025–26, so **verify the live rate**.
- **Bulky or heavy SKUs (bed, feeder, cooling mat) carry the most shipping risk.** Always check volumetric weight in the CJ shipping calculator before you set prices.

### 3.2 Sourcing difficulty by region

| Product | US | CA | UK | AU | EU |
|---|---|---|---|---|---|
| 1 Calming bed | Easy (CJ US, Faire) | From US warehouse | Easy (CJ UK, Avasam) | Medium (CJ AU stock varies; Dropshipzone, Southern Pet) | Easy (CJ DE, BigBuy, AliExpress Local+) |
| 2 Slicker brush | Easy | From US | Easy | Easy–Medium | Easy |
| 3 Fountain ⚡ | Easy (FCC/UL adapter) | From US. Needs cUL/CSA adapter | **Medium**: needs UK plug (BS 1363) or USB-only | **Hard**: needs RCM/EESS-registered adapter via an AU responsible supplier | Medium: EU plug, CE (LVD/EMC/RoHS) |
| 4 Lick mat | Easy | From US | Easy | Easy | Easy |
| 5 Smart feeder ⚡📶 | Medium (FCC Part 15 ID for Wi-Fi) | Medium (ISED ID + cUL/CSA) | **Hard** (UKCA/CE + RED for Wi-Fi, UK plug) | **Hard** (RCM, EESS registration; ACMA for radio) | Medium–Hard (CE RED) |
| 6 Feather wand | Easy | From US | Easy | Easy | Easy |
| 7 Cooling mat | Easy | From US | Easy | Easy (seasonal) | Easy |
| 8 Travel bottle | Easy | From US | Easy | Easy | Easy |

---

## 4. Compliance notes (high level; get professional advice)

### 4.1 Product safety and electrical certification

| Region | Non-electrical pet goods | Fountain / feeder (mains or adapter powered) | Wi-Fi feeder (radio) |
|---|---|---|---|
| **EU / Malta** | **GPSR** (since 13 Dec 2024): product needs an **EU-based responsible person** (you as a Malta business can be that person). Listings must show manufacturer/RP details, ID and warnings; you need a risk assessment ([Taylor Wessing 2025](https://www.taylorwessing.com/de/interface/2025/esg-and-products/understanding-the-updated-product-safety-regime); [Commission GPSR guidelines, Nov 2025](https://www.mondaq.com/ireland/product-liability-safety/1723902/european-commission-publishes-guidelines-on-general-product-safety-regulation)) | **CE**: LVD (if mains), EMC, RoHS; WEEE registration in each country you sell into; EU plug (Type C/F); Declaration of Conformity from the supplier | **CE under RED** (Radio Equipment Directive, with cybersecurity requirements applying since Aug 2025) |
| **UK (GB)** | GPSR does not apply in GB. GB General Product Safety Regs apply instead; UK importer/address needed on the product | **UKCA or CE** (CE recognised indefinitely in GB for most product regimes: [Osborne Clarke](https://osborneclarke.com/insights/uk-government-heralds-indefinite-ce-marking-recognition-gb-market); [Eurofins](https://www.eurofins.com/electrical-and-electronics/news/uk-government-announces-indefinite-extension-of-ce-marking-recognition-for-18-categories-of-goods/)). **Plugs must meet BS 1363** (Plugs & Sockets Regs 1994). Non-compliant adapters are actively removed and destroyed at the border ([OPSS report](https://gov.uk/product-safety-alerts-reports-recalls/product-safety-report-keagar-pack-of-2-uk-plug-adapters-sold-via-amazon-and-ebay-2405-0088)). UK WEEE obligations | UKCA/CE (Radio Equipment Regs) + PSTI Act 2024 security rules for connectable products (no default passwords, etc.) |
| **US** | CPSC general safety; Prop 65 warnings for California | Adapter **UL/ETL listed** (expected by retailers and insurers, and a strong liability shield) | **FCC Part 15** authorisation (FCC ID on device) |
| **Canada** | Canada Consumer Product Safety Act; **bilingual EN/FR labelling** | **CSA or cUL/cETL** certification for mains-powered equipment and adapters | **ISED** certification (IC ID) |
| **Australia** | ACCC product safety; mandatory standards don't usually cover these items | **RCM** mark; in-scope electrical equipment (incl. many power supplies) must be registered on **EESS** by an **Australian responsible supplier**, so the local importer/warehouse partner must hold this. AU plug Type I | RCM / ACMA radiocommunications compliance |

General knowledge only for US/CA/AU certification (no fresh 2026 primary source found). Confirm with [FCC](https://www.fcc.gov/oet/ea), [ISED](https://ised-isde.canada.ca/site/certification-engineering-bureau/en), [ERAC/EESS](https://www.erac.gov.au/) and [ACMA](https://www.acma.gov.au/).

**Practical rule:** for fountains and feeders, **only list SKUs where the supplier can provide the test report or certificate for the destination market** (FCC/UL, cUL/CSA, UKCA/CE + BS 1363, RCM/EESS). Prefer **USB-powered** designs, and ship each region a plug and adapter certified for that region (or no adapter, stated clearly). Wi-Fi feeders carry the heaviest load. Consider a **timer-only feeder** for UK/AU at launch.

### 4.2 Tax: VAT, GST, IOSS and duties for a Malta-based seller

| Destination | Shipped from local warehouse | Shipped from China / outside region | Key thresholds |
|---|---|---|---|
| **Malta / EU** | Intra-EU distance sales: charge destination-country VAT via **OSS** once EU-wide B2C cross-border sales exceed €10k (Malta 18% below that). **Watch out:** if goods ship from a warehouse inside the customer's own country (e.g. CJ Germany to a German customer), that is a **domestic supply in that country** and may require **local VAT registration** there. This depends on how the dropship chain transaction is structured, so confirm with an adviser | **IOSS** for consignments ≤ €150 (VAT charged at checkout). **Since 1 July 2026 a €3 customs duty per item/tariff line** applies to low-value parcels that used to be duty-free, and a handling fee is due from Nov 2026 ([Avalara](https://www.avalara.com/us/en/blog/eu-end-150-customs-duty-exemption-2026.html); [MHA](https://www.mha.co.uk/insights/customs-update-3-duty-on-low-value-e-commerce-imports)) | €10k OSS; €150 IOSS |
| **UK** | Goods located in the UK at sale, sold by a non-UK business: **UK VAT registration from the first sale, no threshold** ([Zmartly](https://zmartly.co.uk/news-insights/shopify-vat-registration-stock-location); [Commenda](https://www.commenda.io/uk/vat-registration-for-foreign-companies)) | Consignments ≤ £135: seller charges UK VAT at the point of sale (registration needed). Above £135, import VAT and duty at the border. UK reviewing the £135 relief (consultation closed Mar 2026) ([iCustoms](https://www.icustoms.ai/blogs/de-minimis-changes-2026-us-eu-uk/)) | **Register for UK VAT before launch** |
| **Australia** | GST registration once Australian-connected turnover ≥ **A$75,000**/yr | Low-value imported goods (≤ A$1,000 per item): same A$75k registration test; once registered, charge 10% GST at checkout ([William Buck](https://www.williambuck.com/gst-on-low-value-goods-for-non-resident-businesses/); [business.gov.au](https://business.gov.au/finance/tax/international-tax)) | A$75k |
| **Canada** | Goods in a Canadian warehouse: **normal GST/HST registration** (not the simplified regime) once taxable supplies exceed **C$30k** over 4 quarters; non-residents may need to post security ([Quaderno](https://quaderno.io/guides/canada-gst-hst-guide/); [Avalara](https://www.avalara.com/us/en/blog/canada-requires-non-resident-vendors-and-marketplaces-to-collect-gst-as-of-july-1.html)) | From US/China: import GST/HST and duty at the border. **Ship DDP** so customers don't get surprise courier fees | C$30k |
| **US** | Marketplace-style **state sales-tax economic nexus** (typically $100k sales or 200 transactions per state) once US volume grows | De minimis ended 29 Aug 2025. All imports dutiable; postal shipments use ad-valorem duty from 28 Feb 2026 ([Avalara](https://www.avalara.com/us/en/blog/de-minimis-exemption-changes-coming.html)). **Prefer US-warehouse stock** (duty cleared in bulk) | State-by-state |

Also: Malta corporate registration, EORI number (needed for EU imports), and income-tax treatment are outside this scope. **Talk to a Malta VAT adviser before launch**, especially about UK VAT registration, OSS/IOSS, and whether EU-warehouse dropship sales trigger local VAT registrations.

---

## 5. Launch checklist (research-derived; no actions taken)

1. Create free CJ and Syncee accounts. Shortlist 2–3 listings per SKU with **US + UK + EU stock**, plus AU where available.
2. **Order samples** of every SKU to Malta, and ideally one test order per market to a friend's address, to measure real delivery times. Reviewers advise this explicitly.
3. For the fountain and feeder, **request certificates** for each destination (FCC/UL, cUL, UKCA/CE + BS 1363, RCM/EESS) before listing in that market. Delist any region where the supplier can't provide them.
4. Build Shopify **Markets** (US, CA, UK, AU, EU). Use per-market catalogues so plug-specific SKUs only appear in the right market. Set market-specific prices (tax-inclusive for UK/EU/AU).
5. In CJ, set the fulfilment warehouse per product/market (US, UK, DE, AU). For Canada, use the US warehouse for now. Confirm whether the app can auto-pay and auto-select shipping, or whether orders must be paid in a daily batch.
6. Optional, once volume is known: move best sellers into **CJ private inventory** (minimum 10 per variant / 100 total per warehouse) and add **custom packaging** (branded mailer + insert card).
7. Register for **UK VAT** and **IOSS/OSS** before the first UK/EU sale. Monitor the AU (A$75k) and CA (C$30k) thresholds.

---

## 6. Items flagged as not verified as current (Nov 2026)

- CJ **Canada** warehouse existence and location; CJ **UK/AU** delivery-day figures; whether the CJ Shopify app has a per-country warehouse-priority setting.
- CJ custom-packaging prices and MOQs; CJ sample policy.
- DSers per-destination-country supplier mapping.
- BigBuy and AutoDS pricing (third-party figures conflict or are missing). Avasam, TopDawg and Dropshipzone pricing is now confirmed in `suppliers-by-country.md`.
- All per-product wholesale and shipping costs in §3.1. They are estimates from factory listings, wholesale sites and reviewer examples, not live CJ quotes, because supplier dashboards require login.
- US/CA/AU electrical-certification details (§4.1) are from general regulatory knowledge, not 2026 primary sources.
- Current US tariff rates on China-origin pet goods.
