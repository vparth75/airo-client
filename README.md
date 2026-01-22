Modern, sporty landing page for a college fest website built with Next.js (App Router) and Tailwind CSS.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the site.

Key UI components live in `app/components`, and the landing page is composed in `app/page.tsx`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project structure

- `app/components`: Reusable UI sections (NavBar, Hero, EventsGrid, AppSection, SponsorsSection, Footer).
- `app/page.tsx`: Composes the landing page and mock data.
- `public/images`: Placeholder visuals and sponsor logos.
