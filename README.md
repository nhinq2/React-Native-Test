# Insight Global — Mobile Engineering Assessment

Assessment repository for **Senior Software Engineer (Mobile)** candidates.  
Backend is implemented; candidates implement the **React Native (Expo)** frontend.

## Repo structure

```
├── backend/          # Node.js API (implemented)
├── mobile/           # Expo React Native app (candidates implement tasks)
├── ASSESSMENT.md     # Task instructions — start here
└── README.md         # This file
```

## Quick start

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Runs at **http://localhost:3000**. See `backend/README.md` for API details.

### 2. Mobile

```bash
cd mobile
npm install
npx expo start
```

- **iOS simulator:** default config uses `localhost`.
- **Android emulator:** uses `10.0.2.2` (see `mobile/src/config.ts`).
- **Physical device:** set `EXPO_PUBLIC_API_URL=http://<your-ip>:3000`.

## Assessment

Open **[ASSESSMENT.md](./ASSESSMENT.md)** for:

- Setup steps
- **Task 1:** Projects list (React Query, FlatList, pull-to-refresh, navigation)
- **Task 2:** Detail, create, and edit (forms, validation, mutations)
- **Task 3:** Status filter + UX polish (Zustand, empty state, a11y)

**Estimated time:** 4–5 hours.

## Stack

- **Backend:** Node.js (JavaScript), Express, in-memory store
- **Mobile:** Expo, React Native, TypeScript, Expo Router (React Navigation), TanStack Query, Zustand

## Links

- [Insight Global](https://insightglobal.com/)
- [Workforce Privacy Policy](https://insightglobal.com/workforce-privacy-policy/)
