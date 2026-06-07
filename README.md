# DevCamp 2 Final Project — Frontend

Personalized Code Learning Platform. Frontend cho sản phẩm giúp beginner programmer học theo roadmap hand-crafted với quiz-verified progress và AI Socratic hints.

## 🚀 Live Deployment

| Môi trường           | URL                                                 |
| -------------------- | --------------------------------------------------- |
| Frontend (Vercel)    | https://devcamp2-frontend.vercel.app                |
| Backend API (Render) | https://devcamp2-backend.onrender.com/api/v1/client |
| Backend health check | https://devcamp2-backend.onrender.com/health        |

- **Auto-deploy**: merge vào `main` là Vercel tự deploy production. Mỗi PR có sẵn 1 **preview deploy** riêng (xem check `Vercel` trên PR).
- **Env**: `VITE_API_URL` được set trên Vercel (Settings → Environment Variables). Đổi env phải redeploy lại mới ăn.
- Backend free tier ngủ sau ~15 phút không request → request đầu mất ~50s (cold start).

## Tech Stack

- **React 19 + Vite 7 + TypeScript strict**
- **React Router v7** — client-side routing
- **TanStack Query v5** — server state
- **React Hook Form + Zod** — form + validation
- **Tailwind CSS v4 + daisyUI** — styling & component library
- **React Flow** (@xyflow/react) — roadmap visualization
- **Axios** — HTTP client
- **ESLint + Prettier + Husky + commitlint + lint-staged** — code quality
- **Yarn 1.22 + Node 22 + Corepack**

## Prerequisites

- Node.js 22 LTS
- Yarn (enable qua Corepack: `corepack enable`)
- Git

## Quickstart

```bash
# Clone
git clone https://github.com/<your-org>/devcamp2-frontend.git
cd devcamp2-frontend

# Bật Corepack (1 lần / máy)
corepack enable

# Install deps
yarn install

# Config env
cp .env.example .env
# Sửa VITE_API_URL trong .env nếu cần

# Run dev
yarn dev
```

Mở http://localhost:5173

## Scripts

| Command           | Mô tả                         |
| ----------------- | ----------------------------- |
| `yarn dev`        | Chạy dev server (hot reload)  |
| `yarn build`      | Type-check + build production |
| `yarn preview`    | Preview bản build             |
| `yarn lint`       | Chạy ESLint                   |
| `yarn type-check` | Chạy `tsc --noEmit`           |
| `yarn format`     | Prettier format toàn project  |

## Cấu trúc thư mục

```
src/
├── pages/       # page components (thin)
├── features/    # business logic per feature
│   ├── auth/            # F1
│   ├── onboarding/      # F2 + F3
│   ├── roadmap/         # F4 + F5 + F6
│   ├── quiz/            # F7
│   ├── progress/        # F8 + F11 + F12
│   ├── ai/              # F9 Gemini Socratic
│   └── dashboard/       # F10
├── components/
│   ├── ui/      # primitives (Button, Input, daisyUI wrappers...)
│   └── shared/  # composed (AppHeader, AppLayout, ...)
├── lib/         # axios, query, utils
├── hooks/       # global hooks
└── types/       # global types
```

**Rule:** Component dùng ở >1 feature → `components/shared/`. Chỉ 1 feature dùng → `features/X/components/`.

## Branch strategy

- `main` — production (protected, PR + review bắt buộc)
- `dev` — integration (protected, CI + 1 review)
- `feat/<name>` — feature branch
- `fix/<name>` — bug fix
- `chore/<name>` — config / tooling

## Commit convention

Conventional Commits (commitlint sẽ reject format sai):

```
feat(auth): add login form with validation
fix(roadmap): prevent infinite zoom on React Flow
chore(deps): bump react-router to 7.6.2
```

Type hợp lệ: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, `perf`, `ci`.

## License

Internal — GDG on Campus DevCamp 2.
