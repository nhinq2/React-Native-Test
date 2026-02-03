# Assessment API

Node.js (JavaScript) + Express backend for the mobile assessment. **No database** — in-memory store only.

## Setup

```bash
npm install
npm run dev
```

Runs at **http://localhost:3000**. Use `PORT=4000 npm run dev` to change port.

## Structure

```
backend/
├── index.js           # Entry point, Express app, routes
├── config.js          # Port, NODE_ENV, valid statuses
├── data/
│   └── projects.js    # In-memory store, CRUD helpers
├── middleware/
│   ├── logger.js      # Request logging (method, path, status, ms)
│   └── errorHandler.js # Global 404 + error handler
├── routes/
│   ├── projects.js    # /api/projects CRUD
│   └── stats.js       # /api/stats (counts)
└── utils/
    └── validators.js  # validateProjectCreate, validateProjectUpdate, validateIdParam
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check (ok, service, env, timestamp) |
| `GET` | `/api/stats` | Project counts: `{ projects: { total, byStatus } }` |
| `GET` | `/api/projects` | List projects (paginated). Query: `?status=...`, `?sort=...`, `?order=...`, `?limit=20`, `?offset=0`. Response: `{ items: Project[], total: number }`. |
| `GET` | `/api/projects/:id` | Get one project |
| `POST` | `/api/projects` | Create. Body: `{ name, description, status? }` |
| `PUT` | `/api/projects/:id` | Update. Body: `{ name?, description?, status? }` |
| `DELETE` | `/api/projects/:id` | Delete project |

**Status values:** `draft` | `active` | `completed`.

## Scripts

- `npm run dev` — run with nodemon (auto-restart on file changes)
- `npm start` — run once (production)

## Validation

- **POST /api/projects:** `name` and `description` required, non-empty; `status` optional, one of draft/active/completed.
- **PUT /api/projects/:id:** same rules for provided fields; at least one field required.
- Invalid body returns `400` with `{ error, errors? }`.
