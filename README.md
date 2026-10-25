# DomesticStaffProvider.com — Next.js theme

An editable, responsive Next.js implementation inspired by the approved green-and-white website mockup. Includes homepage, 14 service pages, 10 city pages, full navigation, enquiry forms that open WhatsApp, mobile navigation/CTAs, FAQs, SEO metadata, JSON-LD, sitemap and robots.txt.

## Start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build / deploy

```bash
npm run build
npm run start
```

Deploy to Vercel, a Node.js hosting provider or your own server capable of running Next.js. Uploading this folder to a WordPress theme installer won't work; it is a Next.js project, not a WordPress theme.

## Editing

- `data/site.ts`: site name, contact details, WhatsApp number, services, cities, FAQs and terms.
- `app/globals.css`: layout, colors, typography and mobile breakpoints.
- `components/HomePage.tsx`: homepage sections and interactive sliders.
- `components/UI.tsx`: header, footer and buttons.
- `components/EnquiryForm.tsx`: WhatsApp lead form.
- `public/images`: locally hosted photos extracted from the approved AI-generated reference mockup. Replace with high-resolution commissioned/licensed photographs for production.
- `app/services/[slug]` and `app/areas/[city]`: dynamic statically generated pages.

## Important content notes

- This implementation uses the owner's requested `.com` branding but adopts the public contact number and staffing terms from the existing `.pk` brand site, as `.com` content could not be verified. Review all details before going live.
- The reference mockup contained unverified 5,000+ customer, ratings, instant 1-day hiring and testimonial claims. This implementation preserves their visual placement where practical but replaces claims with cautious service copy and labelled use cases. Do not publish fictitious reviews/endorsements.
- The city pages accept enquiries; they do **not** claim local offices or immediate candidate availability.
- The form is intentionally client-side and opens WhatsApp; add a backend only if you need lead storage or email sending. This requires privacy/consent updates.
- Social links in the footer are generic placeholders: replace with verified brand accounts, or remove.
- For future optimization, replace reference mockup photo crops with higher-resolution originals.

## Visual QA and exact-design limitations

The delivered reference reproduction was rendered as a standalone HTML preview at **1440px desktop** and **390px mobile**, both without missing pictures, JavaScript errors or horizontal overflow. The standalone preview supports service filters, card arrows, family-carousel selection, expandable FAQs and a mobile menu. The actual app uses React state for these controls. All local TS/TSX files passed a TypeScript syntax/transpilation check.

A Next.js `npm run build` could not be completed in this environment because installing npm dependencies was blocked/timed out. Run `npm install` and `npm run build` before deployment to confirm version compatibility. The previews show the project's intended appearance but are not a substitute for testing the installed Next.js app in your hosting environment.

The approved image file is stored in `reference/approved-homepage.png` for design comparison; it is **not** used as a full-screen site background. Since the original was a generated 724px-wide mockup with rasterized text, a truly pixel-perfect copy with high-resolution standalone photographs requires those original design/image source files; this project recreates the visual structure, palette and sections in editable components.
