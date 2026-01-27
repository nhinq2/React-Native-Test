# Mobile Engineering Assessment — Insight Global

**Role:** Senior Software Engineer, Mobile  
**Estimated time:** 4–5 hours  
**Focus:** React Native (Expo), React Query, React Navigation, Zustand

---

## Overview

This repo contains a **Node.js backend** (already implemented) and an **Expo React Native** app. Your job is to implement the **frontend** only: connect to the API, build the UI, and complete the tasks below.

**Tech stack you’ll use:**

- **Expo** (React Native)
- **TypeScript**
- **React Navigation** (via Expo Router)
- **TanStack Query** (React Query) for data fetching and mutations
- **Zustand** for optional client state (e.g. filters)

---

## Setup

1. **Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   API runs at `http://localhost:3000`. See `backend/README.md` for endpoints.

2. **Mobile**
   ```bash
   cd mobile
   npm install
   npx expo start
   ```
   - **iOS simulator:** Use `localhost` (default in `src/config.ts`).
   - **Android emulator:** Use `10.0.2.2` (already configured).
   - **Physical device:** Set `EXPO_PUBLIC_API_URL=http://<your-machine-ip>:3000` and ensure phone and machine are on the same network.

3. Open `ASSESSMENT.md` (this file) and the `app/` screens. Each task has a short TODO in the file and a longer description below.

---

## Tasks

### Task 1 — Projects list screen (≈1.5–2 h)

**File:** `mobile/app/projects/index.tsx`

Implement the main projects list:

1. **Fetch projects** with React Query (`useQuery`) using `fetchProjects` from `src/api/projects.ts`.
2. **Render a `FlatList`** (or equivalent) showing each project’s **name**, **description**, and **status**.
3. **Loading:** Show a spinner or skeleton while `isLoading`.
4. **Error:** Show an error message and a **retry** action.
5. **Pull-to-refresh** via `RefreshControl` to refetch the list.
6. **Tap a row** → navigate to `/projects/[id]` (detail).
7. **Add a “Create” button** (e.g. FAB or header) → navigate to `/projects/create`.

**Optional (Task 3):** Add a status filter (draft / active / completed) using `useFilterStore` and pass `status` to `fetchProjects` when filtering.

---

### Task 2 — Project detail, create, and edit (≈2–2.5 h)

#### 2a. Detail screen  
**File:** `mobile/app/projects/[id].tsx`

1. Get `id` from `useLocalSearchParams()`.
2. Fetch project with `useQuery` and `fetchProjectById(id)`.
3. Handle **loading** and **error**.
4. Display **name**, **description**, **status**, **createdAt**, **updatedAt**.
5. **“Edit” button** → navigate to `/projects/[id]/edit`.

#### 2b. Create form  
**File:** `mobile/app/projects/create.tsx`

1. Form fields: **name** (required), **description** (required), **status** (picker, default `draft`).  
   Status options: `draft` | `active` | `completed`.
2. **Client-side validation:** name and description non-empty.
3. **Submit** with `useMutation` and `createProject`. On success:
   - Invalidate the projects list query.
   - Navigate back to `/projects`.
4. **Loading** on submit (disable button, show indicator).
5. If the API returns validation errors (e.g. 400), surface them in the UI.

#### 2c. Edit form  
**File:** `mobile/app/projects/[id]/edit.tsx`

1. Get `id` from `useLocalSearchParams()`.
2. **Fetch** project with `useQuery` and **pre-fill** the form.
3. Same fields as create, same validation.
4. **Submit** with `useMutation` and `updateProject`. On success:
   - Invalidate list and detail queries.
   - Navigate back (e.g. to detail or list).
5. Loading and error handling as in create.

---

### Task 3 — Filter and polish (≈30–45 min)

**Files:** `mobile/app/projects/index.tsx`, optionally `src/stores/filterStore.ts`

1. **Status filter** on the projects list:
   - Use `useFilterStore` to hold selected status (`draft` | `active` | `completed` | “all”).
   - When a filter is selected, call `fetchProjects` with `?status=...` (or no param for “all”).
   - UI: segmented control, chips, or dropdown — your choice.

2. **Polish:**
   - **Empty state:** When the list has no projects (or no results for the filter), show a friendly message.
   - **Accessibility:** Ensure list rows and buttons have sensible `accessibilityLabel` (and `accessibilityRole` where relevant).

---

## API reference

Base URL: `http://localhost:3000` (or per `mobile/src/config.ts`).

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check. |
| `GET` | `/api/stats` | Project counts: `{ projects: { total, byStatus } }`. |
| `GET` | `/api/projects` | List projects. Optional `?status=draft|active|completed`. |
| `GET` | `/api/projects/:id` | Get one project. |
| `POST` | `/api/projects` | Create. Body: `{ name, description, status? }`. |
| `PUT` | `/api/projects/:id` | Update. Body: `{ name?, description?, status? }`. |
| `DELETE` | `/api/projects/:id` | Delete (optional; not required for the assessment). |

---

## What we look for

- **React Query:** Correct use of `useQuery` / `useMutation`, cache invalidation, loading/error handling.
- **Navigation:** Clean routing with Expo Router, correct params and navigation flow.
- **Forms:** Validation, loading states, and error display.
- **UX:** Loading, error, and empty states; pull-to-refresh; sensible layout and touch targets.
- **Code quality:** TypeScript types, readable structure, minimal duplication.

---

## Submitting your work

1. Ensure `backend` and `mobile` run as in **Setup**.
2. Record a short **screen recording** (or provide clear steps) showing:
   - List + pull-to-refresh + filter (if implemented).
   - Create project → see it in the list.
   - Open detail → Edit → save → see updates.
3. Push your code to your own repo or share a zip, and send the link (and video/steps) to your recruiter.

Good luck.
