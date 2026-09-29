# Fort Worth Magic Maids — Website

A complete redesign of the Fort Worth Magic Maids website: locally owned, professional
house cleaning in Fort Worth, TX and surrounding areas.

## Stack

Vanilla HTML, CSS and JavaScript — no build step, no dependencies. Open `index.html`
or serve the folder statically:

```bash
python3 -m http.server 8000
```

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, trust strip, why choose us, services, how it works, about, CTA |
| `services.html` | Standard, deep and move-in/move-out cleaning + booking options |
| `pricing.html` | How pricing works and the estimate request form |
| `about.html` | Local team, standards and service area |
| `careers.html` | Join our team + application form |
| `contact.html` | Contact details and contact form |

## Assets

- `assets/css/styles.css` — design system (tokens, layout, components, responsive rules)
- `assets/js/main.js` — mobile nav, sticky header, scroll reveals, form handling
- `favicon.svg` — brand favicon
- Photography is referenced from the live fortworthmagicmaids.com asset URLs

## Forms

All three forms (Estimate request, Contact, Job application) POST to the LeadrVision
endpoint. They work without JavaScript (returning to the page with `?submitted=1`) and,
with JavaScript enabled, submit via `fetch()` to the same URL and show an inline
confirmation. Each form includes a `_form` name, a `_page` field set to the current URL
and a hidden `_gotcha` honeypot.

## Business details

- Phone: (817) 420-7106
- Email: info@fortworthmagicmaids.com
- Service area: Fort Worth, Arlington, Southlake & surrounding areas
