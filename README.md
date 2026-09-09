# NexalField Website Project Enquiry

Web app for the NexalField website project enquiry, built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Scripts

- `npm run dev` – start the development server
- `npm run build` – create a production build
- `npm run start` – run the production build locally
- `npm run lint` – run ESLint
- `npx tsc --noEmit` – type-check the project

## Status

The enquiry UI is built: a multi-step, 7-section, 35-question flow with a welcome
screen, progress indicator, validation, conditional questions, and a review
screen — all client-side. There is no submission backend yet: submitting logs
the typed answers to the console and shows a confirmation screen. No database,
auth, or file storage has been added.

The real NexalField logo is in place. The supplied master export lives at
`public/brand/nexalfield-logo-original.jpg`; `public/brand/nexalfield-logo.png`
and `public/brand/nexalfield-icon.png` are whitespace-trimmed crops of that
same file (no recolouring or redrawing) used by `src/components/Logo.tsx` via
`next/image`.

## Deployment

This project is intended to be deployed on [Vercel](https://vercel.com).
