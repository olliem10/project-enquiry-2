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

The NexalField logo asset has not been added to the repository yet — `src/components/Logo.tsx`
currently renders a hand-traced recreation of the icon mark shown in the reference
images as a placeholder. Once the real logo file is added under `public/`, that
component is the only place that needs to change.

## Deployment

This project is intended to be deployed on [Vercel](https://vercel.com).
