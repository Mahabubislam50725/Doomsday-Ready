# ☢ Doomsday Ready

A full-stack app to help MCU fans plan their rewatch before **Avengers: Doomsday** and book an opening-night watch party.

---

## Data Model Diagram

```
┌─────────────────────────────────────┐
│               Movie                 │
├─────────────────────────────────────┤
│ _id          ObjectId (PK)          │
│ title        String (unique)        │
│ releaseYear  Number (1–3000)        │
│ runtime      Number (1–300 min)     │
│ prerequisites [ObjectId] → Movie[]  │  self-referential (DAG, no cycles)
│ watched      Boolean (default false)│
│ createdAt    Date                   │
│ updatedAt    Date                   │
└─────────────────────────────────────┘
         │ prerequisites (many-to-many self-ref)
         └──────────────────────────────┐
                                        ▼
                                    Movie (same collection)

┌─────────────────────────────────────┐
│               Cinema                │
├─────────────────────────────────────┤
│ _id          ObjectId (PK)          │
│ name         String (unique)        │
│ bundleSizes  Number[] (1–10 items,  │
│              each 1–500, unique)    │
│ createdAt    Date                   │
│ updatedAt    Date                   │
└─────────────────────────────────────┘
```

Movies and Cinemas are independent — no foreign key between them.

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Backend  | Node.js, Express 5, MongoDB Atlas |
| Frontend | Next.js 16, React 19, Tailwind 4  |

---

## Features

### Feature 1 — Movies & Rewatch Order
- Create / list / update movies (title, year, runtime, prerequisites, watched)
- Circular dependency detection using DFS — returns `409 CIRCULAR_DEPENDENCY`
- Rewatch order via **Kahn's topological sort** (BFS-based) on the prerequisite DAG
- Returns watched count and total unwatched runtime

### Feature 2 — Cinemas & Watch-Party Booking
- Create / list cinemas with bundle sizes
- Booking quote via **bottom-up dynamic programming** (coin-change variant) — finds the minimum number of bundles that sum exactly to the group size, or reports "not possible"

### Feature 3 — Frontend (Next.js)
1. **Movies** — add movies, edit prerequisites inline, tick as watched
2. **Rewatch Plan** — pick target movie, see ordered list, progress bar, remaining time
3. **Booking** — add cinemas, pick cinema + group size, see bundle breakdown

---

## API Reference

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/movies` | Create movie |
| GET | `/api/movies` | List movies |
| PATCH | `/api/movies/:id` | Update movie |
| GET | `/api/movies/:id/rewatch-order` | Rewatch order |
| POST | `/api/cinemas` | Create cinema |
| GET | `/api/cinemas` | List cinemas |
| GET | `/api/cinemas/:id/booking?groupSize=N` | Booking quote |

---

## Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas URI (or local MongoDB)

### Backend
```bash
cd doomsday-server
npm install
# create .env with PORT=5000 and MONGO_URI=...
npm run dev
```

### Frontend
```bash
cd doomsday-client
npm install
npm run dev
# opens at http://localhost:3000
```

---

## How I Used AI

- **Amazon Q (IDE)** — used to scaffold boilerplate (Express setup, Mongoose schemas, Next.js layout/nav), generate Tailwind UI components, and write file contents faster.
- **Logic written manually** — the circular dependency check (DFS traversal), topological sort (Kahn's algorithm), and booking DP (coin-change minimum bundles) were designed and implemented by me without any library solving them.
