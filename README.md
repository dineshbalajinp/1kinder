# OneKinder marketing website

A dependency-free, responsive marketing site for the OneKinder preschool management platform. Built with plain HTML, CSS and a small amount of JavaScript — no build step, no npm install.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home |
| `features.html` | Features (deep links: `#attendance`, `#fees`) |
| `for-schools.html` | For Schools |
| `for-teachers.html` | For Teachers |
| `for-parents.html` | For Parents |
| `multi-branch.html` | Multi-Branch / Franchise |
| `admissions.html` | Admissions |
| `pricing.html` | Pricing |
| `faq.html` | FAQ |
| `demo.html` | Book a Demo (request form) |
| `privacy.html` | Privacy Policy (draft template) |
| `terms.html` | Terms of Service (draft template) |

## Preview locally

From this folder:

```powershell
python -m http.server 8000
```

Then open `http://127.0.0.1:8000/` in a browser. Opening `index.html` directly also works.

## Structure

```
index.html
assets/
  css/styles.css     design tokens, layout, responsive rules
  js/main.js         mobile menu, role tabs, FAQ accordion, demo form, screenshot lightbox
  logo.png           header logo (your artwork)
  logo-light.png     footer logo (light version)
  favicon.png        browser tab icon
  Admin_dashboard.png, Admin_student.png, Admin_fee.png
  teacher_myclassoom.png, teacher_chat.png
  parent_dashboard.png, parent_fee.png, parent_calander.png
sitemap.xml
robots.txt
```

## Before going live — replace these placeholders

1. **Demo email** — `DEMO_EMAIL` at the top of `assets/js/main.js` is currently `hello@onekinder.example`. The demo form opens the visitor's email app with a prefilled message; update this to your real address. The same address appears in the header/footer of every page.
2. **Login URL** — the "Log in" button in every page header currently points to `demo.html` because no app URL was provided.
3. **Domain** — `sitemap.xml` and `robots.txt` use `https://onekinder.example/`. Replace with your real domain.
4. **Legal pages** — `privacy.html` and `terms.html` are clearly marked draft templates. Replace with legally reviewed text before launch.
5. **Product screenshots** — web portal screenshots are now used on the home page and the three role pages. They open in a clickable lightbox (arrow keys and Escape supported); logos are not lightboxed. Mobile app screenshots can be added when available by wrapping the new `<img>` in an `<a class="shot-zoom" href="..." data-lightbox>`.
6. **Pricing** — no prices are published; the pricing page says "Contact for pricing" by design.

## Deployment

Upload the whole folder to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, or an S3 bucket). There is nothing to compile. It can also be served as static files from the existing FastAPI product if you prefer a single domain.

## Design notes

- Fonts: Plus Jakarta Sans (headings) and Figtree (body), loaded from Google Fonts with system fallbacks.
- Palette: navy `#14213D`, coral `#D0482E`, sunshine `#FFC85A`, mint `#DFF3EA`.
- Layout is centred with a 1180px max container; breakpoints at 1100, 980, 760 and 520px.
- Copy is derived from the OneKinder product brief. No invented prices, statistics or testimonials.
