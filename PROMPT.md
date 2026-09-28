# Phase-wise Build Prompt — 000093.com

> You can paste each phase into an AI coding assistant, one after another, to rebuild or extend this website. Each phase builds on the previous one. The current repository already implements Phases 1–7; Phases 8–10 are the growth roadmap.

---

## PHASE 0 — Global rules (prepend to every phase)
```
You are building 000093.com — "China's Numbers, Decoded": an English-first, bilingual-ready
utility + education website about Chinese securities codes, lucky numbers, China's markets
and number culture (九三 / 3 September).
Hard constraints:
- 100% static (HTML/CSS/vanilla JS). Must deploy free on GitHub Pages. No server, no DB, no build step
  required at runtime (Jekyll layouts are built natively by GitHub Pages).
- Mobile-first and responsive (360px → 1440px+), no horizontal scroll, WCAG AA contrast, keyboard accessible,
  prefers-reduced-motion respected, light/dark mode, EN/中文 UI toggle.
- Every page shows a top bar: "Contact, if you are interested in this website/domain name/Sponsorship/
  Advertisement/Partnership" linking to https://web.works/contact.
- All forms and email links route to ONE private inbox. The address must NEVER appear in HTML/JS source as
  plain text: store it obfuscated (XOR'd char codes, reversed) and decode only at click/submit time.
  Submit forms via AJAX to a form-relay (FormSubmit) with a mailto fallback.
- No trademark/copyright use of "000093": no logos, names or claims of any fund, listed company, exchange
  or organisation. Use numbers descriptively and include a Trademark & Copyright disclosure page.
- Not investment advice: disclaimers on tools, footer and legal page.
- Monetization-ready: AdSense slots (house ads until configured), YouTube hub, lead gen, donations,
  sponsorship, contests, careers. All config in /assets/js/config.js.
```

## PHASE 1 — Foundation & design system
```
Create a Jekyll-on-GitHub-Pages structure (built natively by Pages, zero Actions): _layouts/default.html
(shared head, top interest bar, header, footer), _config.yml, pages as *.html with YAML front matter
(title, description, root, tools, article), sitemap.xml generated with Liquid, /assets/css/style.css,
/assets/js/{config,main,tools}.js, /assets/img, and preview.py for local preview without Ruby.
Design tokens on :root with dark-mode overrides: China red #c8102e, gold #d9a521, ink #0e1320, jade #0f8a6c.
Fonts: Inter (UI), JetBrains Mono (numbers, tabular), Noto Serif SC (汉字).
Components: sticky blurred header with nav + language/theme toggles + gold "Support" button + burger menu;
hero with digit tiles; cards, tags, stats, tables (scrollable), tabs, details/FAQ, CTA bands, forms
(2-col rows, honeypot, status line), multi-step form with progress dots, radio "option cards", countdown,
progress bar, ad-slot, cookie banner, back-to-top, mobile sticky CTA, reveal-on-scroll.
SEO: unique title/description, canonical, Open Graph/Twitter, WebSite+SearchAction JSON-LD, FAQPage JSON-LD
where relevant, robots.txt, sitemap.xml, manifest, SVG favicon, 404 page (add a 1200×630 OG image later).
```

## PHASE 2 — Core tools (the traffic engines)
```
1) Securities-Code Decoder (decoder.html): input 4–6 digits → result card with exchange, board, currency,
   daily limit, investor threshold, Stock Connect note, explainer, "verify on exchange" link, share link,
   lucky-reading cross-link, and research-brief CTA. Rules: 60x SSE Main, 688/689 STAR, 900 SSE B,
   000–004 SZSE Main (000 shared with index & fund codes), 300–302 ChiNext, 200 SZSE B, 399 SZSE index,
   920/43/83–89 BSE, 51/52/53/56/58 SSE ETF, 50 SSE fund, 15/16 SZSE ETF/LOF, 11 & 12 bonds, 204/131 repo;
   HK 5-digit: Main Board, GEM 08xxx, ETF ranges, warrants, CBBCs, RMB counters. Reads ?q= and updates URL.
   Add a prefix cheat-sheet table and an FAQ with schema.
2) Lucky Number Analyzer (lucky-numbers.html): modes Any/Phone/Plate/Date/Domain. Score 0–100 plus
   Wealth/Longevity/Harmony/Memorability bars, digit cells with 汉字+pinyin (幺 for 1 in phone mode),
   pattern detection (168, 518, 520, 1314, 888, 666, 999, 250, 14, 74, 44, 93, 0000, runs, ABAB), mode tips
   (zodiac year for dates; NN/CHIP analysis for domains), and an entertainment disclaimer.
3) 8-question Number Quiz with shuffled answers, instant feedback, score, and a contest CTA.
4) Home hero universal search: 4–6 digits → decoder, otherwise → analyzer; trending chips.
```

## PHASE 3 — Content & SEO hub
```
Pages: markets.html (tabbed: exchanges, trading rules, access routes, glossary + TradingView ticker widget),
culture.html (九三 Victory Day, numerology of 0/9/3, six-digit code culture, numbers online, sources,
sticky TOC), insights/index.html + articles: how-to-read-chinese-stock-codes, stock-connect-explained,
star-market-vs-chinext, lucky-numbers-in-chinese-business, numeric-domains-china. Each article: breadcrumb,
read time, in-article ad after paragraph 2–3, sticky sidebar CTA + ad, internal links to tools.
```

## PHASE 4 — Lead generation (highest $/visitor)
```
services.html: 3-step form (1: service option cards + email, 2: name/company/country/phone-WhatsApp-WeChat/
budget/timeline, 3: goal/source/consent) with a progress bar, trust badges ("Free first call · No spam ·
Private"), ?service= preselect, How-it-works, service cards and FAQ. A sidebar "Email our team" (hidden
address) and a lead magnet ("China Codes Cheat-Sheet" email capture). Every tool result and article links
into services with the matching ?service= value. Mobile sticky CTA. Track the generate_lead event.
```

## PHASE 5 — Monetization surfaces
```
- AdSense: .ad-slot[data-slot=leaderboard|inArticle|sidebar|footer]. If config.adsenseClient is set and
  consent is not "no", inject the adsbygoogle script and <ins> units; otherwise rotate house ads (media kit,
  consult, support, contest). Keep ads out of tool inputs/results. Provide an ads.txt template.
- partner.html: ad products (display, tool sponsorship, newsletter, YouTube, contest sponsor, affiliates,
  site/domain acquisition), media-kit form, ad standards, direct web.works/contact CTA.
- videos.html: config-driven YouTube grid (click-to-load youtube-nocookie facades); topic cards that
  open YouTube searches until channel videos exist; subscribe button; video sponsorship CTA.
- GA4 (optional, consent-gated) with custom events: tool_decode, tool_lucky, quiz_done, video_play, generate_lead.
```

## PHASE 6 — Community: donations, contests, careers
```
support.html: fundraising progress bar (config), one-time/monthly toggle, presets $8/$25/$88/$168 + custom,
payment buttons from config (PayPal/Ko-fi/BMC/Stripe/GitHub Sponsors), fallback pledge form with allocation
(operations, promotion/marketing, hiring talent, contest prizes), supporter-wall opt-in, Patron tier card,
"where money goes", non-charity disclosure.
contests.html: featured contest with countdown, prize/judging/deadline grid, entry form, referral bonus
entries, share button, more contests, official rules (eligibility, no purchase necessary, judging,
fair play, rights), sponsor CTA, winners gallery.
careers.html: job cards (type filter: freelance/contract/commission/volunteer), Apply buttons that prefill
the role, application form (resume + portfolio URLs), "write for us" route.
```

## PHASE 7 — Trust, legal, QA & deploy
```
about.html, contact.html (topic dropdown including "Interested in this website/domain name"), faq.html,
legal.html (#trademark, #disclaimer, #terms, #privacy with AdSense/Google cookie language, GDPR/CCPA/PIPEDA).
QA: Playwright at 1366px and 390px — zero JS errors, zero horizontal overflow, top bar present and linked on
every page, email string absent from all HTML/JS, forms validate, multi-step advances.
Deploy: push to github.com/webworksa1/000093-com (main), publish with GitHub Pages (Deploy from branch → main → / root).
Custom domain: add a CNAME file containing 000093.com and set DNS (A records to GitHub Pages IPs + www CNAME).
```

## PHASE 8 — Growth (next 30 days)
```
- Programmatic SEO: /code/600.html … one page per prefix, and /number/888.html … one page per famous number,
  generated from a _data/*.yml dataset with a Jekyll collection, each with FAQ schema and internal links.
- Full Chinese (zh-Hans) page versions with hreflang.
- Newsletter automation (Buttondown/MailerLite free tier) replacing the form relay for signups.
- Shareable result images (canvas → PNG) for lucky-number results.
```

## PHASE 9 — Scale revenue (60–90 days)
```
- Apply for AdSense after ~20–30 quality pages + traffic; then test Ezoic/Mediavine thresholds.
- Affiliate blocks (brokers with Stock Connect access, language schools, VPN, travel), clearly disclosed.
- Paid "Research Brief" product via a Stripe Payment Link; a premium numeric-domain valuation report.
- Sponsor-funded monthly contests; a September 九三 remembrance series with a sponsor package.
```

## PHASE 10 — Platform
```
- Migrate to Astro or Eleventy (still static, still free on GitHub Pages) when the page count exceeds ~200.
- Community Q&A, user-submitted number stories, and a public winners gallery.
- A public API/JSON of the prefix rules; embeddable decoder widget for backlinks.
```
