# Claude Code

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

## Project brief

- Full build spec: `docs/BUILD_SPEC.md`. Follow its 8 phases in order. After each phase run `pnpm build` and `pnpm lint`, fix everything, and check in with the user before continuing.
- Content and accounts still needed from the studio: `docs/RESOURCES_NEEDED.md`.
- This is a real tattoo studio in Tirana, but its real content comes later. Use realistic placeholder content, keep everything editable in the CMS, and never hard-code business facts.
- Ask before adding any dependency the spec doesn't list.

## Decisions so far

- **Database:** Neon Postgres. The connection string goes in `DATABASE_URI` (pooled string). No local Postgres or Docker on this machine.
- **Node:** pinned per project to 24.22.2 via `devEngines.runtime` in `package.json`, because Payload 3.92 needs ≥22.23.4 and the system Node is 22.19. Run everything through `pnpm` / `pnpm exec` / `pnpm dlx`, not plain `npx`. The pnpm "Unsupported engine" warning is harmless.
- **Versions:** Payload 3.92.1, Next.js 16.3.3 (Payload's supported range is >=16.3.3 <17).
- **Code location:** code lives under `src/` (Payload's layout), not the repo root shown in the spec's tree.
- **Tailwind v4 tokens:** in `src/app/(frontend)/globals.css`. Spacing and container token names must not collide: `max-w-*` checks `--spacing-*` first, which is why the side gutter is `px-site-margin` and the max width is `max-w-site`.
- **Accent buttons:** use `--color-on-accent` (black) for text. White on #FF4800 fails WCAG AA; the alternative is darkening the accent to about #D93D00. This is flagged to the user.
- **GSAP:** only core plugins (ScrollTrigger, CustomEase "studio") are registered globally in `src/lib/motion/gsap.ts`. Other plugins are registered inside the components that use them.
- **Slider:** GSAP Draggable + InertiaPlugin, not Embla.
- **Placeholder frames:** the placeholder frame sequence is generated with sharp, not node-canvas. ffmpeg is installed only when real footage arrives (`winget install Gyan.FFmpeg`).
- **Privacy page:** add a CMS-editable `/privacy` stub, which the spec lacks.

## Status

- **Phase 1 (scaffold): done.** Tokens, fonts, MotionProvider (GSAP + Lenis), and the Button / Eyebrow / Container primitives. `/` is a temporary design-system preview.
- **Phase 2 (CMS model + seed): next.** Blocked until the user fills `DATABASE_URI` and `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env`. Pending user choice: the email adapter (`@payloadcms/email-resend` or `@payloadcms/email-nodemailer`) and approval of `@payloadcms/live-preview-react`.
