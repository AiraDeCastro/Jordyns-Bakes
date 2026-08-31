# Jordyn's Bakes

Order-request web app for a custom cake/cupcake business (weddings, events, birthdays, holidays, graduations).

## Workflow

- Read [PLANNING.md](PLANNING.md) at the start of every new conversation before doing anything else.
- Check [TASKS.md](TASKS.md) before starting work, to see what's already done and what's next.
- Mark tasks completed in TASKS.md immediately after finishing them — don't batch it up for later.
- When you discover a new task while working (a bug, a missing piece, a follow-up), add it to the "Discovered During Work" section of TASKS.md right away, tagged with the milestone it belongs to.

## Docs

- [PRD.md](PRD.md) — full product requirements and rationale. Read for context on *why*, or when a decision isn't covered in PLANNING.md.
- [PLANNING.md](PLANNING.md) — condensed technical/product plan: stack, data model, brand direction, scope boundaries, open questions. The day-to-day implementation reference.
- [TASKS.md](TASKS.md) — milestone task checklist and progress tracker.

Keep PRD.md, PLANNING.md, and TASKS.md consistent with each other. If an implementation decision changes something documented in PLANNING.md or the PRD, update those files in the same piece of work — don't let the docs drift from reality.

## Codebase notes

- [AGENTS.md](AGENTS.md) is auto-generated/maintained by `next dev` — it warns that this Next.js version has breaking changes vs. older training data. Check `node_modules/next/dist/docs/` for current API behavior before writing Next.js code that relies on memorized conventions. Don't remove its content from diffs; it gets re-added anyway.
- Stack is live: Next.js (App Router, TypeScript, Turbopack) + Tailwind CSS v4, scaffolded under this directory. Run `npm run dev` to start it locally (or use the `.claude/launch.json` preview config).
- Testing: Vitest + React Testing Library (`npm run test`, or `npm run test:watch`). Tests are colocated next to what they test (e.g. `src/app/page.test.tsx`). Every new feature needs at least a smoke test — don't leave code untested to skip the pre-commit gate.

## Commit workflow

- **Conventional Commits are required.** Format: `type(scope?): subject` — e.g. `feat(order-form): add reference image upload`, `fix(gallery): correct occasion filter`, `chore: bump dependency`. Common types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`, `ci`, `build`. Enforced by commitlint via a Husky `commit-msg` hook (`commitlint.config.js`) — non-conforming messages are rejected. `npm run commit` launches an interactive Commitizen prompt that builds the message for you.
- **A Husky pre-commit hook runs automatically on every `git commit`** (`.husky/pre-commit`) and blocks the commit unless, in order: `npm run lint` passes, `npm run test` passes, `npm run build` succeeds, and `npm audit --audit-level=high` finds no high/critical vulnerabilities. Don't bypass this with `--no-verify` — fix the underlying issue instead. The same sequence is available on demand via `npm run precommit-check`.
- If a change doesn't have tests yet, write them as part of that change — the pre-commit hook can't do its job otherwise.
