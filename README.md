# 🌙 Florence Tonight

**Your curated guide to the best nights in Florence.**

A premium event discovery and ticketing platform showcasing handpicked nightlife, aperitivo spots, live music, and cultural experiences across Florence, Italy.

![Florence Tonight](./images/hero_bg.png)

---

## ✨ Features

- **Event Discovery** — Browse curated weekly events, clubs, rooftops, and cultural experiences
- **Ticket & Table Booking** — Integrated booking system with Stripe checkout and automated QR-code tickets
- **Multi-Section Guides** — Dedicated pages for Aperitivo, Hidden Gems, After Dark, and more
- **Admin CMS** — Full content management panel for events, guides, and editorial content
- **Newsletter System** — Subscriber management with automated welcome emails via Resend
- **QR Ticket Scanner** — Built-in ticket validation page for event check-in
- **Multi-Language Support** — English/Italian with dynamic language switching
- **Responsive Design** — Premium dark-themed UI optimized for all devices

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, Vanilla CSS, Vanilla JS |
| **Icons** | Lucide Icons |
| **Fonts** | Inter, Playfair Display (Google Fonts) |
| **Payments** | Stripe Checkout |
| **Email** | Resend API |
| **Serverless API** | Vercel Functions (`/api`) |
| **Dev Server** | Vite |

## 📁 Project Structure

```
tonight-florence/
├── index.html              # Homepage
├── events.html             # Events calendar & featured events
├── guides.html             # City guides hub
├── hidden-gems.html        # Hidden gems of Florence
├── aperitivo.html          # Aperitivo guide
├── after-dark.html         # Nightlife editorial
├── explore.html            # Explore Tonight section
├── plan.html               # Plan Your Night page
├── scan.html               # QR ticket scanner
├── admin.html              # Admin CMS panel
├── style.css               # Global styles
├── main.js                 # Core JavaScript (modals, booking, UI)
├── content-loader.js       # Dynamic content renderer (from admin CMS)
├── lang.js                 # i18n language switcher
├── lucide.js               # Icon library
├── package.json            # Project config
├── api/
│   ├── create-checkout.js  # Stripe checkout session creator
│   ├── webhook.js          # Stripe webhook → ticket generation
│   ├── subscribe.js        # Newsletter subscription + welcome email
│   ├── notify.js           # Broadcast event notifications
│   └── validate.js         # QR ticket validation
└── images/                 # Event flyers, hero images, assets
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A [Stripe](https://stripe.com) account (for payments)
- A [Resend](https://resend.com) account (for emails)

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The site will be available at `http://localhost:5173`.

### Environment Variables

Create a `.env` file in the root directory for the serverless API functions:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
QR_SIGNING_SECRET=your-secret-key
SITE_URL=https://yourdomain.com
EMAIL_FROM=Florence Tonight <hello@yourdomain.com>
```

> ⚠️ **Never commit your `.env` file.** It is already included in `.gitignore`.

## 🌐 Deployment

This project is designed for **Vercel**:

1. Push this repo to GitHub
2. Import it on [vercel.com](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy — the `/api` folder is automatically detected as serverless functions

## 📄 License

All rights reserved. © 2026 Florence Tonight.
