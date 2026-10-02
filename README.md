# Quiz Builder

A full-stack app for building quizzes with three question types — **True/False**, **Short answer** and **Multiple choice** (several correct answers). You can create quizzes, browse them on a dashboard, open any quiz to see its structure, and delete quizzes you no longer need.

| Part     | Stack                                                                                 |
| -------- | ------------------------------------------------------------------------------------- |
| Backend  | Node.js, Express 5, TypeScript, Sequelize, SQLite, Zod                                |
| Frontend | Next.js 15 (Pages Router), React 19, TypeScript, Tailwind CSS 4, React Hook Form, Zod |
| Tooling  | ESLint 9 (flat config) + Prettier in both packages, Node test runner for API tests    |

## Project structure

```
quiz-builder/
├── backend/                  # Express REST API
│   ├── src/
│   │   ├── config/env.ts     # .env loading and validation
│   │   ├── db/               # Sequelize connection, sync and seed scripts
│   │   ├── middleware/       # 404 and error handlers
│   │   ├── models/           # Quiz, Question, Option models
│   │   ├── modules/quizzes/  # routes → controller → service, Zod schemas, DTOs
│   │   └── index.ts          # server entry point
│   └── tests/                # API integration tests (in-memory SQLite)
├── frontend/                 # Next.js app
│   ├── pages/                # /create, /quizzes, /quizzes/[id]
│   ├── components/           # layout, quiz form, question views, icons
│   ├── services/             # API client and quiz service
│   ├── lib/                  # form schema, helpers
│   └── types/                # shared API types
└── README.md
```

## Prerequisites

- Node.js **20 or newer** (developed on Node 24)
- npm

SQLite needs no separate server: the database is a single file that the backend creates on first run.

## Getting started

Run the backend and the frontend in two terminals.

### 1. Backend (http://localhost:4000)

```bash
cd backend
npm install
cp .env.example .env
npm run seed      # optional: creates the database and adds two sample quizzes
npm run dev
```

### 2. Frontend (http://localhost:3000)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The root URL redirects to the quiz list.

## Database setup

The backend uses SQLite through Sequelize. The file location comes from `DB_STORAGE` in `backend/.env` (default `./data/quiz-builder.sqlite`).

- **Tables are created automatically** when the server starts. To create them without starting the server, run `npm run db:sync`.
- **Sample data:** `npm run seed` adds the quizzes "JavaScript Basics" and "Web Fundamentals". Running it again skips quizzes that already exist.
- **Reset:** stop the server and delete the `backend/data` folder.

Schema: `quizzes` 1 → N `questions` 1 → N `options`. Deleting a quiz cascades to its questions and options. A question stores its correct answer by type: `correctBoolean` for True/False, `correctText` for Short answer, and rows in `options` (with `isCorrect`) for Multiple choice.

## Creating a sample quiz

Pick one of three ways:

1. **Seed script:** `cd backend && npm run seed`.
2. **UI:** open http://localhost:3000/create, enter a title, add questions with the buttons at the bottom, and click **Save quiz**.
3. **API:**

   ```bash
   curl -X POST http://localhost:4000/quizzes -H "Content-Type: application/json" -d '{"title":"Space facts","questions":[{"type":"boolean","text":"The Sun is a star.","correctAnswer":true},{"type":"input","text":"Which planet is known as the Red Planet?","correctAnswer":"Mars"},{"type":"checkbox","text":"Which of these are gas giants?","options":[{"text":"Jupiter","isCorrect":true},{"text":"Mars","isCorrect":false},{"text":"Saturn","isCorrect":true}]}]}'
   ```

## Environment variables

`.env` files are git-ignored. Copy the `.env.example` file in each package and adjust as needed.

**backend/.env**

| Variable      | Default                      | Description                                     |
| ------------- | ---------------------------- | ----------------------------------------------- |
| `PORT`        | `4000`                       | Port the API listens on                         |
| `DB_STORAGE`  | `./data/quiz-builder.sqlite` | Path to the SQLite file (`:memory:` also works) |
| `CORS_ORIGIN` | `http://localhost:3000`      | Allowed frontend origin(s), comma-separated     |

**frontend/.env.local**

| Variable              | Default                 | Description         |
| --------------------- | ----------------------- | ------------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Base URL of the API |

## API

| Method   | Path           | Description                                               | Success         |
| -------- | -------------- | --------------------------------------------------------- | --------------- |
| `POST`   | `/quizzes`     | Create a quiz with its questions                          | `201` full quiz |
| `GET`    | `/quizzes`     | List quizzes: `id`, `title`, `questionCount`, `createdAt` | `200`           |
| `GET`    | `/quizzes/:id` | Full quiz with all questions and options                  | `200`           |
| `DELETE` | `/quizzes/:id` | Delete a quiz and its questions                           | `204`           |
| `GET`    | `/health`      | Health check                                              | `200`           |

Question shapes in the `POST /quizzes` body:

```jsonc
{ "type": "boolean",  "text": "...", "correctAnswer": true }
{ "type": "input",    "text": "...", "correctAnswer": "expected text" }
{ "type": "checkbox", "text": "...", "options": [{ "text": "...", "isCorrect": true }, ...] }
```

Validation rules: the title is required, a quiz needs at least one question, and a multiple-choice question needs 2–10 options with at least one marked correct.

Errors return JSON as `{ "error", "message", "details?" }`: `400` for validation errors, a bad id or malformed JSON, and `404` for an unknown quiz.

## Scripts

Both packages have these scripts:

| Script              | What it does                              |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Start in development mode                 |
| `npm run build`     | Production build                          |
| `npm start`         | Run the production build                  |
| `npm run lint`      | ESLint (`lint:fix` to auto-fix)           |
| `npm run format`    | Prettier write (`format:check` to verify) |
| `npm run typecheck` | TypeScript type check                     |

Backend only: `npm test` runs the API integration tests against an in-memory database. `npm run db:sync` creates the tables and `npm run seed` adds the sample quizzes.
