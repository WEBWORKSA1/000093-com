# 000093.com — China's Numbers, Decoded

A static website with free tools and guides to Chinese securities codes, lucky numbers, China's markets and number culture (九三). It runs on the free plan of **GitHub Pages**.

- **Research & business case:** [RESEARCH.md](RESEARCH.md)
- **Phase-wise build prompt:** [PROMPT.md](PROMPT.md)

## Structure (Jekyll — built automatically by GitHub Pages, no Actions needed)
```
_layouts/default.html ← shared <head>, top interest bar, header/nav, footer, cookie banner
_config.yml           ← canonical domain + excludes
*.html, insights/*.html ← pages (YAML front matter: title, description, root, tools, article)
sitemap.xml           ← auto-generated from all pages
assets/css/style.css
assets/js/config.js   ← ALL go-live settings (AdSense, GA4, payment links, videos, contest, fundraising)
assets/js/main.js     ← UI, forms, ads, consent, donations, countdowns, nav state
assets/js/tools.js    ← Code Decoder, Lucky Number Analyzer, Quiz
preview.py            ← optional local preview without Ruby (python3 preview.py → _site/)
```
To add a page, copy an existing `.html` file, edit its front matter and body, and commit. Pages rebuilds automatically.

## Go-live checklist
0. **Publishing:** Settings → Pages → Build and deployment → *Deploy from a branch* → `main` / `(root)`. Live URL: https://webworksa1.github.io/000093-com/
1. **Forms:** every form posts privately through FormSubmit. The **first** submission sends an *activation email* to the site inbox. Click "Activate" once, and all forms deliver from then on. The address is stored obfuscated in `config.js` and never appears in page source.
2. **AdSense:** add `adsenseClient` and the slot IDs in `config.js`, and put your publisher line in `ads.txt`. Until then, the slots show house ads.
3. **Donations:** paste PayPal.me / Ko-fi / Buy Me a Coffee / Stripe Payment Link URLs into `config.pay`. Until then, the pledge form is used.
4. **YouTube:** add video IDs to `config.videos` and your channel URL to `config.youtubeChannel`.
5. **Custom domain:** in repo Settings → Pages, set the custom domain to `000093.com` (this creates a CNAME file). At your registrar, add A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and `www` CNAME → `webworksa1.github.io`. Then enable "Enforce HTTPS".
6. **Analytics:** add a GA4 ID to `config.ga4`, then submit `sitemap.xml` in Google Search Console.

## Legal
Independent educational publisher. No affiliation with any exchange, fund, issuer or organisation using the number 000093. Not investment advice. See `legal.html`.

The top bar on every page links to https://web.works/contact for website, domain, sponsorship, advertising and partnership inquiries.
