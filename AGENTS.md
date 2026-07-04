# Agent Instructions

This document defines guidelines and instructions for AI agents working on the TWBC codebase.

## Git & Workflow Guidelines

- **Single-Feature Commits**: make every commit littery do one feature. Do not bundle multiple features, unrelated fixes, or global refactors into a single commit.
- **Conventional Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
  - `feat`: End-user visible new functionality or behavior change.
  - `fix`: End-user visible bug fixes.
  - `refactor`: Restructuring code without changing behavior.
  - `chore`: Dependency updates, config changes, i18n strings, other maintenance.
  - `test` / `docs` / `ci`: Testing, documentation, or CI workflow changes.
- **Atomicity**: Fix formatting, styling, and lint errors in the same commit as the related code change, rather than in separate standalone commits.

## Coding Quality & Architecture

- **Nuxt 4 / Vue 3 Composition API**:
  - Always use Nuxt 4 structure (code resides in the `app/` directory).
  - Write Vue components using `<script setup lang="ts">`.
- **TypeScript & Typing**:
  - Ensure strict typing for all props, emits, custom composables, and data structures.
  - Avoid using `any`. Define precise interfaces or type aliases.
- **Documentation Preservation**:
  - Maintain documentation integrity. Keep all existing comments, docstrings, and context-providing code annotations intact unless they are directly replaced by new logic.

## Design Language & Styling

- **Vanilla CSS**:
  - This project prefers Vanilla CSS. Avoid using utility-first frameworks like TailwindCSS unless explicitly instructed.
  - Scope component styles using `<style scoped>` to prevent leakage and style pollution.
- **Design Tokens**:
  - Utilize and adhere to the CSS variables declared in the global stylesheet: [global.css](./app/assets/css/global.css).
- **Responsive Layouts**:
  - Build responsive layouts using modern CSS Flexbox and Grid.
  - Always design with a mobile-first or highly responsive approach.
- **Micro-interactions & Polish**:
  - Ensure interactive elements have hover effects, active states, and smooth transitions.
  - Prioritize visual aesthetics that align with TWBC's cosmic/paper themes.

## Typography & Internationalization (i18n)

- **No CJK–Latin Spaces**:
  - Do not insert literal spaces between Chinese/Japanese/Korean (CJK) characters and alphanumeric/Latin characters in i18n strings or raw template text. Spacing is a rendering concern and should be handled by CSS if necessary.
- **Dynamic Translation**:
  - Use `@nuxtjs/i18n` translation helpers (`$t`, `useI18n`) for all user-facing copy. Do not hardcode strings in templates.

## Performance & SEO Best Practices

- **Metadata**:
  - Set proper title and meta descriptions on every page using `useSeoMeta` or `useHead`.
- **Asset Optimization**:
  - Use high-performance image formats (like AVIF or WebP) and define correct width/height parameters to minimize Cumulative Layout Shift (CLS).
