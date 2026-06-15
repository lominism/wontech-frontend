# wontech-frontend

A Next.js 16 (App Router) front-end shell for Wontech Admin Back Office.

## What's included

- **Sidebar shell** — workspace switcher (top), grouped navigation, language
  switcher, and user avatar (bottom).
- **Organization Mgmt** — single `All Units` landing page, ready for sub-pages.
- **Settings area** — Members, Personnel, and Configurations pages.
- **Dual language** — English / Thai via `next-intl`.
- **Wontech theme** — light sidebar + orange brand accent (shadcn/ui,
  New York style, Tailwind v4).

> There is **no backend**. All data is hardcoded mock data in
> `lib/mock-data.ts`, and workspace state lives in-memory in
> `providers/WorkspaceProvider.tsx`. Auth has been removed. Wire these up to a
> real API when the backend is rebuilt.

## Getting started

```bash
npm install      # or yarn / pnpm
npm run dev      # http://localhost:3000
```

## Key locations

| Area | Path |
| --- | --- |
| App shell layout | `app/[locale]/(tab)/layout.tsx` |
| Sidebar | `components/layout/SideBar/AppSidebar.tsx` |
| Workspace switcher | `components/shared/WorkSpaceSwitcher/` |
| User avatar menu | `components/shared/AccountSettings/profile-account.tsx` |
| Language switcher | `components/shared/LanguageSwitcher/` |
| Pages | `app/[locale]/(tab)/{units,members,personnel,settings}` |
| Mock data | `lib/mock-data.ts` |
| Theme tokens | `styles/globals.css` |
| Translations | `messages/{common,settings}/{en,th}.json` |

## Stack

Next.js 16 · React 19 · Tailwind CSS v4 · shadcn/ui · next-intl
