# PicHost.io — Modern High-Performance Image Hosting Platform (Frontend)

PicHost.io is a modern, full-stack image hosting web application built with **Nuxt 4**, **Vue 3**, **Tailwind CSS v4**, and **TypeScript**, connected to a high-performance **Go (Gin + Bun ORM)** backend.

---

## 🚀 Features

- ⚡ **Guest & Authenticated Uploads**: Instant image uploading with presigned URL / S3-backed storage, shortcodes, and auto-expiration policy (24h for guest uploads).
- 🔒 **Security & Authentication**: Custom JWT authentication with auto-refresh rotation, password reset flows with token hashing, email verification, and session management.
- 💳 **Subscriptions & Payments**: Support for manual slip upload verification and automated Omise Payment Gateway integration with webhook signature & idempotency validation.
- 🌏 **Multi-language Support (i18n)**: Seamless Thai (TH) and English (EN) switching powered by `@nuxtjs/i18n`.
- 📊 **Admin Dashboard**: Content moderation (image inspection/deletion), payment transaction verification/refund, user management, and audit log inspection.
- 📱 **Responsive Dark Theme UI**: Built with modern ambient glassmorphism aesthetics and dark mode palette.

---

## 🛠️ Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3 Composition API)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State & Utils**: `@nuxtjs/i18n`, Native Composables (`useAuth`, `useToast`, `useSeoMeta`)
- **Testing**: [Vitest](https://vitest.dev/), `@nuxt/test-utils`, [Playwright](https://playwright.dev/)
- **Code Quality**: ESLint, Prettier, `vue-tsc`

---

## ⚙️ Environment Configuration

Copy `.env.example` to `.env` before running the development server:

```bash
cp .env.example .env
```

### Environment Variables

| Variable | Description | Default Value |
|---|---|---|
| `NUXT_PUBLIC_API_BASE` | Base URL for PicHost Go REST API | `http://localhost:8080/api/v1` |
| `NUXT_PUBLIC_STORAGES_SERVICE_URL` | Base URL for Storage Service API | `http://localhost:8080/api/v1` |

---

## 📦 Getting Started

### 1. Install Dependencies

```bash
yarn install
```

### 2. Development Server

Start the dev server on `http://localhost:3000`:

```bash
yarn dev
```

### 3. Running Quality Checks & Tests

```bash
# Typecheck TypeScript / Vue files
yarn typecheck

# Run Linter
yarn lint

# Run Unit Tests with Vitest
yarn test:unit

# Run E2E Tests with Playwright
npx playwright test
```

### 4. Production Build

```bash
yarn build
yarn preview
```

---

## 📂 Project Structure

```
PicHost.io-web/
├── app/
│   ├── assets/css/        # Global CSS & Tailwind setup
│   ├── components/        # UI components & loaders
│   ├── composables/       # Vue composables (useAuth, useToast, etc.)
│   ├── i18n/locales/      # Translation files (th.json, en.json)
│   ├── layouts/           # App layouts (default.vue, admin.vue)
│   ├── middleware/        # Route middlewares (auth.ts, admin.ts, guest.ts)
│   ├── pages/             # Nuxt file-based pages
│   ├── types/             # TypeScript interfaces & API types
│   ├── utils/             # Format & API client helpers
│   ├── error.vue          # Custom 404/500 dark error page
│   └── app.vue            # Root entry point
├── public/                # Static assets (og-image.png, favicon.svg, robots.txt)
├── tests/
│   ├── composables/       # Vitest unit tests for composables
│   ├── utils/             # Vitest unit tests for utilities
│   └── e2e/               # Playwright end-to-end test specs
├── nuxt.config.ts         # Nuxt configuration
├── vitest.config.ts       # Vitest test runner configuration
└── playwright.config.ts   # Playwright configuration
```
