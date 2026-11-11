# AGENTS.md

Instructions for AI coding agents (Codex and others) working on this repository.

**Read `CLAUDE.md` before changing anything.** It is the project's main notes file: the brief, every decision made so far and the reasons for them. This file repeats the rules that matter most. If the two ever disagree, `CLAUDE.md` wins.

## The project

- The website and CMS for London InkTattoo, a tattoo studio in Fier, Albania.
- Next.js 16.3.3 (App Router) with Payload CMS 3.92.1 on Neon Postgres, deployed to Vercel. Code lives in `src/`.
- Every page is built from sections ("blocks") in the CMS: `src/blocks/`. How it works: the README's "How the page builder works", and `docs/PAGE_BUILDER.md` for the full plan.
- The approved design is in `docs/design/`.
- Payload reference: `.claude/skills/payload/SKILL.md` and `.claude/skills/payload/reference/`.
- **This is not the Next.js you know.** Version 16 has breaking changes. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code, and heed deprecation notices.

## The database is the live site's

There is one database, and the live site uses it. If a `.env` file exists, its `DATABASE_URI` points at it.

- **Don't run anything that connects to the database**, unless the person you're working for tells you the database is a disposable copy:
  - `pnpm dev`, `pnpm build`, `pnpm start`
  - `pnpm seed` (replaces all content)
  - `pnpm test`, `pnpm test:int`, `pnpm test:e2e` (they create and delete documents)
  - `pnpm blocks:thumbnails`, `pnpm media:to-r2`, `pnpm payload …`
- `pnpm dev` and `pnpm seed` also change the database's tables to match the code. On the live database that can drop columns and break the site.
- These work without a database: `pnpm install`, `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm generate:types`, `pnpm generate:importmap`.

## Changing the data model

- Adding, renaming or removing fields on a **collection or global** changes the database tables. The live site doesn't update its tables when it deploys, so **say so in the pull request**: the maintainer has to update the database before merging.
- Fields inside **blocks** are stored as JSON, so changing them needs no table change. Old content keeps working only if the component copes with the field being missing.
- After changing any Payload config, run `pnpm generate:types` and `pnpm generate:importmap`, and commit what they change.

## Git

- `main` is the live site: Vercel deploys every push to it. Work on a branch and open a pull request into `main`. Never push to `main` directly.
- Commit messages: one short line in plain English that says what changed, like the existing history ("Show portfolio thumbnails in original colours").
- Before opening a pull request, `pnpm lint` and `pnpm exec tsc --noEmit` must pass. In the description, say what you couldn't check, for example anything that needs the database.

## Content, design and code rules

- **Never hard-code business facts** (studio name, city, artist, prices, numbers, contact details). They live in the CMS, and in `src/seed/` for the demo content.
- Editors get **named choices only** (backgrounds, card styles, heading sizes), never free colours, sizes or spacing, so the site keeps the approved design.
- Section numbers ("01 / …") are added by the site, not typed into the CMS.
- **Ask before adding any dependency.**
- **Secrets go in `.env` only**, never in code. `.env.example` is committed and holds placeholders only.
- Access rules must use `hasRole()` / `isCmsUser()` from `src/access`, never just `user` or `user.id`: AI access keys also log in, and a key's id can match a CMS user's.
- Next.js 16: `revalidateTag(tag, { expire: 0 })`; no `priority` on images (use `loading="eager"` with `fetchPriority="high"`, on one image per page at most).
- Accessibility: one H1 per page; never put `data-reveal` on page-top content.

## Setup

- Use `pnpm` (version in `package.json` `packageManager`) and `pnpm exec`, not `npm` or `npx`.
- Node 22.23.4 or newer. `package.json` pins 24.22.2 in `devEngines`, and pnpm downloads it. Its "Unsupported engine" warning is harmless.
- `.env.example` lists every setting. Nothing in the checks above needs real values.
