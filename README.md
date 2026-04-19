# drchristopherbutler.com

Static landing pages for Dr. Chris Butler's Cold Hack ebook and 1:1 consultations. Deployed to Railway at https://www.drchristopherbutler.com.

## Pages

| Page | URL | Purpose |
|---|---|---|
| `index.html` | `/` | Main Cold Hack ebook landing ($19.97) |
| `spring60.html` | `/spring60.html` | 60% off variant (code: `SPRING60`, $7.99) |
| `spring80.html` | `/spring80.html` | 80% off variant (code: `SPRING80`, $3.99) |
| `spring100.html` | `/spring100.html` | 100% off variant (code: `SPRING100`, FREE) |
| `thank-you.html` | `/thank-you.html` | Post-purchase confirmation page |
| `book-consultation.html` | `/book-consultation.html` | 1:1 consultation booking page ($350) |

## Deployment

Railway auto-deploys from the `main` branch. Push a commit and the site rebuilds in ~1 minute.

```bash
git add .
git commit -m "your message"
git push
```

## Local preview

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Stack

- Plain HTML with inline CSS (no build step)
- Nginx served via Docker on Railway
- Custom domain: www.drchristopherbutler.com

## Payment links

- Ebook purchase: https://link.clinicdragon.ai/payment-link/69e0ab88557558e89e520509
- Consultation booking: (placeholder — needs real link)

## Brand

Ebook-matched warm palette: gold `#B8860B`, brown `#3D2E15`, cream `#FDF8F0`. Playfair Display (serif headings) + Inter (sans body).
