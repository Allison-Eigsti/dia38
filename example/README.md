# Next.js Blog

A full-stack blog application built with Next.js (App Router), React, MongoDB,
Mongoose, JWT authentication, and Tailwind CSS — in a single Next.js app that
serves both the UI and the API.

## Project Description

Public visitors can read posts and comments. Registered users can create posts
(with images), and edit or delete their own posts and comments. Authentication
uses JWT stored in an HTTP-only cookie.

## Technologies

- Next.js 16 (App Router, Route Handlers, Server/Client Components)
- React 19
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) + HTTP-only cookies
- bcryptjs for password hashing
- Zod for validation
- Tailwind CSS v4
- ESLint

## Architecture

```
Next.js
├── React UI (app/**/page.js, components/**)
├── Server Components (read from DB directly via lib/data.js)
├── Client Components (forms, navbar, comment editing)
├── Route Handlers (app/api/**/route.js)
├── Authentication (lib/auth.js, lib/jwt.js, lib/cookies.js)
├── Validation (lib/validation.js)
└── Database (lib/db.js, models/**)
         ↓
      MongoDB
```

Key boundaries:

- The browser never talks to MongoDB directly — only to `/api/*`.
- Every protected route handler calls `getAuthenticatedUser()` and checks
  resource ownership before mutating. Hiding buttons in the UI is never
  treated as authorization.
- React auth state lives in `src/context/AuthContext.js`; the durable session
  is the HTTP-only cookie, restored on refresh via `GET /api/auth/me`.

## Installation

```bash
git clone <repo-url>
cd example
npm install
```

Create `.env.local` (see `.env.example`):

```
MONGODB_URI=mongodb://localhost:27017/next-example
JWT_SECRET=<long random string>
```

## Development

```bash
npm run dev
```

Open http://localhost:3000.

## API

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| POST | /api/auth/register | No | Register user |
| POST | /api/auth/login | No | Login |
| POST | /api/auth/logout | Yes | Logout |
| GET | /api/auth/me | Yes | Get current user |
| GET | /api/posts | No | List posts |
| POST | /api/posts | Yes | Create post |
| GET | /api/posts/:id | No | Get post + comments |
| PATCH | /api/posts/:id | Yes (owner) | Update own post |
| DELETE | /api/posts/:id | Yes (owner) | Delete own post |
| POST | /api/posts/:id/comments | Yes | Create comment |
| PATCH | /api/comments/:id | Yes (owner) | Update own comment |
| DELETE | /api/comments/:id | Yes (owner) | Delete own comment |

Responses use `{ "data": ... }` on success and `{ "error": "message" }` on
failure, with appropriate HTTP status codes.

## Deployment

Frontend and backend are the same Next.js app, so a single Vercel deployment
serves both. Set `MONGODB_URI` and `JWT_SECRET` in the Vercel project's
environment variables.

- Frontend: https://<your-deployment>.vercel.app
- Backend (API): https://<your-deployment>.vercel.app/api/...

## Notes

- Post images are mandatory on the client/API and stored in MongoDB as Base64
  (`imageData` + `imageMimeType`), rendered as
  `data:<mime>;base64,<imageData>`. Max size ~2MB.
