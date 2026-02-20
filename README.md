# AUBH Library System

A library management system built for the Aliah University Boys Hostel Mosque. It allows users to view the library catalog, borrow books, and manage returns through a streamlined Next.js dashboard.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org) (App Router)
- **Frontend library:** [React 19](https://react.dev)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend/Database:** [Supabase](https://supabase.com)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)

## Prerequisites

Before setting up the project, ensure you have the following installed:

- Node.js (v20+ recommended)
- npm, yarn, pnpm, or bun

You will also need a Supabase project set up. Ensure the corresponding `.env.local` variables are present:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Getting Started

First, install the dependencies using your preferred package manager:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the library.

## Project Structure

- `app/` - Next.js App Router folders, page definitions, and main layouts.
- `app/api/` - Backend route handlers, particularly useful for user login and borrowing APIs.
- `app/_components/` - Reusable UI widgets and layout blocks. 
- `utils/` - Global utility functions (e.g., helpers for UI logic, specific calculations like dates).
- `lib/` - Specialized library functions, like standardizing database hooks.

## Key Features

- **Auth Session Management**: Cookie-based authentication ensuring secure, persistent sessions.
- **Book Exploration**: Server-rendered browsing interfaces supporting pagination and detailed views.
- **Borrowing Flow**: Built-in modal components triggering state changes on the Supabase backend in a transaction-safe logic pattern.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Vercel Deployment](https://nextjs.org/docs/app/building-your-application/deploying) - easiest way to host this app.
