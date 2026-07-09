# Contributing

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>[optional scope]: <description>
```

**Types:**

- `feat` — end-user visible new functionality or behavior change, including performance improvements
- `fix` — end-user visible bug fixes
- `refactor` — restructuring code without changing behavior
- `chore` — dependency updates, config changes, i18n strings, other maintenance
- `ci` — GitHub Actions workflows
- `test` — adding or updating tests
- `docs` — documentation only

**Examples:**

- `feat: add countdown component`
- `fix: resolve mobile layout overflow`
- `docs: update deployment section`

## Branch Names

Use kebab-case: `add-countdown-component`, `fix-mobile-layout`

## Code Style

- **Nuxt 4 / Vue 3 Composition API:** Use `<script setup lang="ts">` for components.
- **TypeScript:** Ensure proper typing for props, emits, and composables.
- **Vanilla CSS:** This project prefers Vanilla CSS. Scope styles within components where appropriate, or use global CSS in `app/assets/css/`.
- **Code Formatting:** The project uses Prettier to enforce consistent code style.
  - Run `npm run format` to automatically format all files in the codebase.
  - Run `npm run format:check` to verify that files are properly formatted (this check runs automatically in the CI pipeline).

## Typography & i18n

- **No CJK–Latin spaces (in-app only):** Do not insert literal spaces between CJK and alphanumeric characters in i18n strings or UI text. Spacing is a rendering concern. GitHub discussions should still use spaces for readability.

## Git and GitHub Workflows

- Updating a branch with the base branch: prefer rebase, but use merge if the branch contains commits by other contributors (rebase rewrites authorship) or if there are conflicts.
- AI review comments should be addressed and resolved by the PR author.
- Human review comments should be resolved by the reviewer.
- Fix formatting and lint errors in the same commit as the code change, not as a separate commit.
