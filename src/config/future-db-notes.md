# Future Database Integration Notes

This document describes the planned evolution of MorseLab to include a PostgreSQL
database with Prisma ORM, without requiring changes to the core application
architecture.

## Proposed Stack

- **Database**: PostgreSQL 16+
- **ORM**: Prisma 5+
- **Auth**: NextAuth.js (optional, for user accounts)

## Proposed Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  sessions  PracticeSession[]
  progress  UserProgress[]
}

model PracticeSession {
  id        String   @id @default(cuid())
  userId    String
  score     Int
  total     Int
  mode      String   // "char-to-morse" | "morse-to-char" | "random"
  durationMs Int?
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  answers   SessionAnswer[]
}

model SessionAnswer {
  id          String   @id @default(cuid())
  sessionId   String
  char        String
  morse       String
  userAnswer  String
  correct     Boolean
  createdAt   DateTime @default(now())

  session     PracticeSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
}

model Score {
  id        String   @id @default(cuid())
  userId    String
  type      String   // "daily" | "all-time"
  value     Int
  date      DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Lesson {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  content     String   // MDX or HTML
  order       Int
  category    String   // "basics" | "numbers" | "symbols" | "advanced"
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  progress    UserProgress[]
}

model UserProgress {
  id          String   @id @default(cuid())
  userId      String
  lessonId    String
  completed   Boolean  @default(false)
  completedAt DateTime?
  score       Int?

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@unique([userId, lessonId])
}
```

## Integration Steps

1. **Install dependencies**
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```

2. **Configure DATABASE_URL** in `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/morselab"
   ```

3. **Create a Prisma singleton** at `src/lib/db.ts`:
   ```ts
   import { PrismaClient } from "@prisma/client";

   const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
   export const prisma = globalForPrisma.prisma ?? new PrismaClient();
   if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
   ```

4. **Use in Server Components and API routes** (no changes to client components needed):
   ```ts
   import { prisma } from "@/lib/db";
   const sessions = await prisma.practiceSession.findMany({ where: { userId } });
   ```

5. **Add new API routes** for saving sessions:
   - `POST /api/sessions` — save a completed practice session
   - `GET /api/scores` — leaderboard
   - `GET /api/progress` — user lesson progress

## Architecture Notes

- All Prisma calls stay in **Server Components** or **API Route Handlers** — never in Client Components.
- The existing `usePracticeStore` (Zustand) tracks local state; on session end, a client fetch to `POST /api/sessions` persists it.
- The Morse logic (`src/lib/morse/`) remains **pure functions** — no database coupling.
- UI components remain unchanged.

## Why This Architecture Works

The clean separation of concerns means database integration is purely additive:
- Pure Morse functions (`lib/morse/`) → untouched
- UI components → untouched  
- Zustand store → only add a `saveSession()` action that calls the API
- New: `lib/db.ts` singleton
- New: additional API routes under `app/api/`
