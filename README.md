# Tattoo studio website

Next.js 16 (App Router) + Payload CMS 3 + Postgres (Neon). The full brief is in [docs/BUILD_SPEC.md](docs/BUILD_SPEC.md), and the content and accounts still needed from the studio are listed in [docs/RESOURCES_NEEDED.md](docs/RESOURCES_NEEDED.md).

> Work in progress: Phase 1 (scaffold) is done. A section for marketing editors is added once the CMS exists (Phase 2).

## Developer setup

**Requirements:** pnpm 10. You don't need to install Node 24 yourself: `package.json` pins Node 24.22.2 via `devEngines.runtime`, and pnpm downloads it and uses it for every `pnpm …` script. If your system Node is older than 22.23.4, pnpm prints an "Unsupported engine" warning; it's harmless, and updating your system Node removes it.

1. `pnpm install`
2. Copy `.env.example` to `.env` and fill in at least `DATABASE_URI` (Neon **pooled** connection string) and `PAYLOAD_SECRET`.
3. `pnpm dev`, then open http://localhost:3000 (site) and http://localhost:3000/admin (CMS).

| Script                     | What it does                           |
| -------------------------- | -------------------------------------- |
| `pnpm dev`                 | Dev server                             |
| `pnpm build && pnpm start` | Production build and server            |
| `pnpm lint`                | ESLint                                 |
| `pnpm format`              | Prettier (with Tailwind class sorting) |
| `pnpm generate:types`      | Regenerate `src/payload-types.ts`      |
| `pnpm generate:importmap`  | Regenerate the admin import map        |

Always use `pnpm exec` / `pnpm dlx` rather than plain `npx`, so commands run on the pinned Node.

## Design system

- Tokens live in `src/app/(frontend)/globals.css` (`@theme`). The accent is `--color-accent` and changes everywhere from that one line.
- Text on the accent uses `--color-on-accent` (black by default, for WCAG contrast).
- Layout utilities: `px-site-margin`, `max-w-site`, `py-section`, `py-section-lg`, `gap-gutter`, `h-nav`; labels: `mono-label`, `mono-label-sm`.
- Primitives: `Button`, `Eyebrow` and `Container` in `src/components/ui/`.
- Motion: `MotionProvider` (GSAP core + Lenis) in `src/components/motion/`. Heavier GSAP plugins are registered only inside the components that use them.
