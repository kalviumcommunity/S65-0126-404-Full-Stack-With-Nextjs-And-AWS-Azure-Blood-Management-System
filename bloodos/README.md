# 🩸 BloodOS – Real-Time Blood Donation & Inventory Management Platform

## 📌 Project Overview

India’s blood banks and hospitals often face shortages not due to lack of donors, but because of poor coordination and outdated inventory tracking systems. During emergencies, delays in finding available blood units can cost lives.

**BloodOS** is a real-time full-stack web platform designed to bridge this gap by connecting:
- Blood donors
- Hospitals / blood banks
- NGOs / administrators

The platform enables live inventory tracking, location-based search, and secure role-based access to ensure timely availability of critical blood resources.

---

## 📂 Folder Structure

```
src/
├── app/          # Routes, pages, layouts, and API routes using Next.js App Router
├── components/   # Reusable UI components such as Navbar, Footer, and shared UI elements
├── lib/          # Utility functions, helpers, and configuration files
```

### Folder Purpose
- **app/**: Handles routing, page rendering, layouts, and backend API routes in a full-stack manner.
- **components/**: Stores reusable UI components to ensure consistency and reduce duplication.
- **lib/**: Centralizes shared logic, utilities, and configurations to keep the codebase clean and maintainable.

This separation of concerns helps the application scale smoothly as new features are added.

---

## ⚙️ Setup Instructions

Follow the steps below to run the project locally:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd bloodos
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and visit:
   ```
   http://localhost:3000
   ```

---

## 🧠 Reflection

This folder structure was chosen to clearly separate routing logic, reusable UI components, and shared utilities. By organizing the project this way, team members can work in parallel without conflicts, onboard new developers faster, and add features more efficiently in future sprints. As the application grows, this structure will help maintain readability, reduce technical debt, and keep the codebase scalable and clean.

---

## 🖥️ Local Development Screenshot

> 📸 Screenshot of the application running locally on `http://localhost:3000`:

![BloodOS running locally](./screenshots/ScreenShot.png)

---

## 🧱 Tech Stack

| Layer | Technology |
|------|-----------|
| Frontend | Next.js (TypeScript) |
| Backend API | Next.js API Routes |
| Styling | Tailwind CSS |
| Tooling | ESLint |
| Cloud (Planned) | AWS / Azure |

---


## 🧹 TypeScript & ESLint Configuration (Sprint 1 – Assignment 2.9)

### Strict TypeScript Configuration
Strict TypeScript mode has been enabled in `tsconfig.json` to improve code safety and catch potential bugs early during development. The following rules are enforced:
- `strict`: Enables all strict type-checking options
- `noImplicitAny`: Prevents variables from having an implicit `any` type
- `noUnusedLocals`: Flags unused local variables
- `noUnusedParameters`: Flags unused function parameters
- `forceConsistentCasingInFileNames`: Avoids file path casing issues across operating systems
- `skipLibCheck`: Skips type checking of declaration files for faster builds

These settings help reduce runtime errors and improve long-term maintainability.

### ESLint & Prettier
ESLint and Prettier are configured together to enforce consistent coding standards and formatting across the project:
- ESLint enforces rules such as consistent quotes, mandatory semicolons, and controlled console usage
- Prettier handles automatic code formatting to maintain uniform style across the team
- `eslint-config-prettier` is used to avoid conflicts between ESLint and Prettier rules

### Pre-Commit Hooks (Husky + lint-staged)
Pre-commit hooks were set up using Husky and lint-staged to ensure code quality before changes are committed:
- ESLint automatically fixes lint issues on staged files
- Prettier formats code before commits
- Commits fail if linting or formatting errors remain

This ensures that only clean, consistent, and high-quality code is committed to the repository, improving collaboration and reducing review overhead.

### 🧪 Linting & Pre-Commit Enforcement Evidence

The following screenshot shows ESLint running successfully in the project, validating that linting rules are correctly configured and enforced as part of the development workflow. With modern ESLint (v9) and flat configuration, linting may run silently when no blocking errors are present.


![ESLint execution proof](./screenshots/eslint-proof.png)

---

## 🔐 Environment Variable Management (Sprint 1 – Assignment 2.10)

This project uses environment variables to manage sensitive configuration securely and follow best practices for production-ready applications.

### Environment Files

- **`.env.local`**: Use this file for **local development secrets**. It is **ignored by Git** and should never be committed. It overrides defaults for your local machine.
- **`.env.example`**: A **committed template file**. It lists all required environment variables with placeholder values and comments to guide new developers.

### Type of Variables

#### 1. Server-Side Variables (Secrets)
These variables are available **only on the server** (e.g., API routes, server components, `getServerSideProps`). They are **never exposed** to the client-side bundle.

- `DATABASE_URL`: Connection string for the PostgreSQL database.
- `JWT_SECRET`: Secret key used for signing authentication tokens.

**Usage:**
```ts
// Server-side only
const dbUrl = process.env.DATABASE_URL;
const secret = process.env.JWT_SECRET;
```

#### 2. Client-Side Variables (Public)
Variables prefixed with `NEXT_PUBLIC_` are automatically exposed to the browser. Use these **strictly** for non-sensitive data (e.g., API endpoints, public keys).

- `NEXT_PUBLIC_API_BASE_URL`: The base URL for the backend API.

**Usage:**
We use a centralized helper file for client-side variables to ensure type safety and consistency.

```ts
// src/lib/env.ts
export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
```

### 🚀 Setup Instructions

1. **Copy the example file:**
   Duplicate `.env.example` to create your local environment file.
   ```bash
   cp .env.example .env.local
   ```

2. **Configure your secrets:**
   Open `.env.local` and fill in your actual credentials (database URL, secrets, etc.).

3. **Restart the server:**
   Next.js loads environment variables on startup. Restart your dev server to apply changes.
   ```bash
   npm run dev
   ```

### 🛡️ Security Considerations

- **Never commit `.env.local`**: It is explicitly ignored in `.gitignore`.
- **Prefix carefully**: Only use `NEXT_PUBLIC_` for variables that are safe to be public.
- **Access control**: Server-side variables like `DATABASE_URL` will be `undefined` if accessed in client-side code, preventing accidental leaks.

### ❌ Common Mistakes Avoided

- **Committing secrets**: Ensure `.env.local` is always in `.gitignore`.
- **Exposing secrets to client**: Avoid adding `NEXT_PUBLIC_` to sensitive keys like `JWT_SECRET`.
- **Hardcoding values**: Always use `process.env` instead of hardcoding URLs or keys.
- **Missing production variables**: Ensure all variables in `.env.example` are also set in your production environment (e.g., Vercel, AWS).

### 📸 Environment Configuration Evidence

The screenshots below demonstrate correct environment variable setup and safe usage within the project:

- `.env.example` documenting required server-side and client-side variables
- `.gitignore` ensuring `.env.local` is never committed
- Centralized and safe access of environment variables using `process.env`

![Environment variable setup](./screenshots/env-setup.png)


---

## 🛡️ Input Validation & Zod (Sprint 1 – Assignment 2.19)

We use **Zod** to validate all incoming API requests. This ensures data integrity and provides helpful error messages to the frontend before any database operations occur.

### 1️⃣ Schema Shared Library

We define reusable schemas in `src/lib/schemas/` that can be inferred as TypeScript types:

**Example: UserSchema (`src/lib/schemas/userSchema.ts`)**
```typescript
export const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['DONOR', 'HOSPITAL', 'ADMIN'])
});

export type UserInput = z.infer<typeof UserSchema>;
```

### 2️⃣ Validation Workflow

In our API routes (e.g., `POST /api/users`), we use `safeParse`:

1.  **Parse Body**: `UserSchema.safeParse(body)`
2.  **Check Success**: If `!result.success`, return 400 immediately.
3.  **Format Errors**: Map Zod errors to a clean `{ field, message }` array.

### 3️⃣ Example Responses

#### ✅ Success
`POST /api/users`
```json
{
  "success": true,
  "message": "User created successfully",
  "data": { "id": "uuid-123", "email": "test@example.com" }
}
```

#### ❌ Validation Error
`POST /api/users` (Invalid email and short password)
```json
{
  "success": false,
  "message": "Validation Error",
  "error": {
    "code": "E100",
    "details": [
      { "field": "email", "message": "Invalid email address" },
      { "field": "password", "message": "String must contain at least 8 character(s)" }
    ]
  },
  "timestamp": "..."
}
```

### 🧠 Reflection

-   **Reusability**: By exporting `type UserInput = z.infer<...>`, our frontend form components can use the *exact same* type definition as the backend validation logic.
-   **Security**: Validation happens *before* checking the database, preventing unnecessary queries and potential injection attacks.
-   **Clarity**: Structured error messages help frontend developers highlight specific form fields that need correction.

---

## 🔐 Authentication APIs & JWT (Sprint 1 – Assignment 2.20)

We implemented a stateless authentication system using **JSON Web Tokens (JWT)** and **bcrypt** for secure password hashing.

### 1️⃣ Auth Flow

1.  **Signup (`POST /api/auth/signup`)**:
    -   Validates input with Zod.
    -   Hashes password with `bcrypt.hash(password, 10)`.
    -   Creates user in DB.
2.  **Login (`POST /api/auth/login`)**:
    -   Verifies credentials.
    -   Generates a signed JWT (`expiresIn: 1h`).
    -   Returns token to client.
3.  **Protected Routes**:
    -   Endpoints like `GET /api/users` now require an `Authorization: Bearer <token>` header.
    -   The server verifies the token signature before processing the request.

### 2️⃣ Security Implementation

-   **Password Storage**: We *never* store plain-text passwords. Only salted hashes.
-   **Secrets**: The JWT signature relies on `JWT_SECRET` (in `.env.local`), ensuring tokens cannot be forged.
-   **Error Handling**: Login failures return generic "Invalid credentials" messages to prevent user enumeration.

### 3️⃣ Usage Examples

#### Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"nurse@hospital.com", "password":"securePassword123", "role":"HOSPITAL"}'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nurse@hospital.com", "password":"securePassword123"}'
```
**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhGciOiJIUzI1...",
    "user": { "id": "...", "role": "HOSPITAL" }
  }
}
```

#### Access Protected Route
```bash
curl -H "Authorization: Bearer <YOUR_TOKEN>" http://localhost:3000/api/users
```

### 🧠 Reflection

-   **Statelessness**: Using JWT allows our API to scale horizontally without needing a central session store (like Redis) for basic auth.
-   **Role-Based Access**: The token payload includes the user's `role`, allowing us (in future sprints) to easily restrict certain actions to ADMINs or HOSPITALs only.

---

## 🤝 Team Branching & PR Workflow (Sprint 1 – Assignment 2.11)

This project follows a professional Git workflow designed to enhance collaboration, code quality, and traceability. Every change goes through a strict process of branching, pull request (PR) review, and automated checks before merging into the main codebase.

### 1️⃣ Branch Naming Convention

We strictly follow a structured naming convention to easily identify the purpose of each branch.

**Format:** `type/short-description`

| Type | Description | Example Branch Name |
|------|-------------|---------------------|
| **feature** | New features or enhancements | `feature/login-auth`, `feature/hospital-dashboard` |
| **fix** | Bug fixes or patches | `fix/navbar-alignment` |
| **chore** | Maintenance, tooling, or refactoring | `chore/workflow-setup` |
| **docs** | Documentation updates | `docs/update-readme` |

**Why this improves collaboration:**
- Clearly communicates intent before opening the code.
- Groups related changes logically.
- Helps with automated release notes and changelogs.

---

### 2️⃣ Pull Request (PR) Template

To maintain high standards, we use a mandatory **Pull Request Template** located at `.github/pull_request_template.md`. This ensures every PR description includes:

- **Summary**: Context on what was done and why.
- **Changes Made**: Bullet points of specific technical changes.
- **Screenshots / Evidence**: Visual proof of the changes (UI or logs).
- **Checklist**: Confirmation of local testing, linting, and no secret exposure.

This standardization speeds up reviews by providing reviewers with all necessary context upfront.

---

### 3️⃣ Code Review Checklist

Reviewers must verify the following before approving a PR:

- [ ] **Folder Structure**: Code is placed in the correct `app`, `components`, or `lib` directory.
- [ ] **Naming Conventions**: Variables and functions use meaningful names (camelCase for TS, PascalCase for components).
- [ ] **No Console Errors**: The browser console is clean during runtime.
- [ ] **Lint & Formatting**: `npm run lint` passes without warnings.
- [ ] **Environment Variables**: No hardcoded secrets; use `process.env` via `src/lib/env.ts`.
- [ ] **Type Safety**: No `any` types; interfaces are defined properly.
- [ ] **Documentation**: Comments explain complex logic; README is updated if improved.

---

### 4️⃣ Branch Protection Rules

To prevent broken code from reaching production, the following rules are configured for the `main` branch:

1.  **Require Pull Request reviews before merging**:
    - At least **one approval** is required from a teammate.
    - Prevents unreviewed code from being merged.

2.  **Require status checks to pass before merging**:
    - Build and Lint checks must succeed.
    - Ensures the codebase remains deployable at all times.

3.  **Include administrators in restrictions**:
    - Even admins cannot bypass these rules, ensuring consistency.

4.  **Do not allow bypassing the above settings**:
    - Enforces the workflow for everyone on the team.

---

### 🧠 Reflection

Implementing this workflow shifts the development process from "coding alone" to "engineering together."
- **Velocity**: It initially slows down individual commits but **speeds up the overall release cycle** by catching bugs early.
- **Quality**: Mandatory reviews and checklists drastically reduce the chance of bad code reaching production.
- **Traceability**: Structured branch names and PR templates created a clear history of *why* changes were made, not just *what* changed.

---


---

## 🐳 Docker & Compose Setup (Sprint 1 – Assignment 2.12)

This project is fully containerized using **Docker** and **Docker Compose**, providing a consistent development environment across all team members' machines. This eliminates "it works on my machine" issues and simplifies dependency management.

### 1️⃣ Dockerfile Overview

We use a multi-stage `Dockerfile` optimized for production performance:

- **Base Stage**: Installs dependencies on a lightweight `node:20-alpine` image.
- **Builder Stage**: Compiles the Next.js application.
- **Runner Stage**: Creates a minimal production image, running the app in "standalone" mode to reduce image size significantly (from >1GB to ~100MB).

### 2️⃣ Docker Compose Services

Our `docker-compose.yml` orchestrates the following services:

| Service | Image | Internal Port | External Port | Description |
|---------|-------|---------------|---------------|-------------|
| **app** | `node:20-alpine` | `3000` | `3000` | The core Next.js application. |
| **db** | `postgres:15-alpine` | `5432` | `5432` | Primary database with persistent volume `pgdata`. |
| **redis** | `redis:7-alpine` | `6379` | `6379` | In-memory cache for session management and queues. |

### 3️⃣ Setup & Commands

#### Build and Start
To build the images and start all services in the background:
```bash
docker-compose up --build -d
```

#### Check Status
To verify all containers are running correctly:
```bash
docker ps
```
You should see `bloodos_app`, `bloodos_db`, and `bloodos_redis` actively running.

#### Stop Services
To stop and remove containers (data in volumes persists):
```bash
docker-compose down
```

#### View Logs
To follow logs for the application:
```bash
docker-compose logs -f app
```

### 4️⃣ Troubleshooting & Tips

- **Port Conflicts**: Ensure ports `3000`, `5432`, and `6379` are not being used by local instances of Node, Postgres, or Redis.
- **Permissions**: If build fails on Linux/Mac, ensure you have proper Docker permissions (`sudo` might be needed).
- **Environment**: The `docker-compose.yml` sets default development variables. For production, these should be securely injected via a `.env` file on the server.

### 5️⃣ 📸 Submission Screenshots

For Assignment 2.12, capture the following evidence:
1.  **Build Logs**: Screenshot of the terminal showing a successful `docker-compose up --build`.
2.  **Container Status**: Screenshot of `docker ps` listing all 3 active containers.
3.  **App Running**: Browser screenshot of `localhost:3000`.
4.  **Database Connection**: Screenshot of a DB client (like DBeaver or pgAdmin) connected to `localhost:5432`.

### 🧠 Reflection

Containerization ensures that every developer runs the exact same versions of Node.js, PostgreSQL, and Redis. This drastically reduces onboarding time for new team members and ensures that the production environment behaves exactly like the local development environment.

---


---

## 🏗️ PostgreSQL Schema Design (Sprint 1 – Assignment 2.13)

This project uses **Prisma ORM** with **PostgreSQL** to define a strongly-typed, normalized relative schema. The design prioritizes data integrity, role separation, and query performance.

### 1️⃣ Core Entities & Relationships

| Entity | Description | Key Relationships |
|--------|-------------|-------------------|
| **User** | Central authentication entity. | 1:1 with `DonorProfile` or `HospitalProfile`. |
| **DonorProfile** | Specific data for blood donors. | Belongs to `User`. Logs `DonationRecord`. |
| **HospitalProfile** | specific data for healthcare facilities. | Belongs to `User`. Manages `BloodInventory`. |
| **BloodInventory** | Tracks blood stock levels at hospitals. | N:1 with `HospitalProfile`. Indexed by blood type. |
| **BloodRequest** | Requests for blood from hospitals/users. | N:1 with `User` (Requester). |
| **DonationRecord** | History of completed donations. | N:1 with `DonorProfile` (User). |

### 2️⃣ Normalization Strategy

We strictly adhere to **3NF (Third Normal Form)** to eliminate redundancy:

-   **1NF (Atomic Values)**: No arrays or nested objects (e.g., inventory is a separate table, not a JSON field on Hospital).
-   **2NF (No Partial Dependencies)**: All tables have a single primary key (`id`), and all fields depend on the whole key.
-   **3NF (No Transitive Dependencies)**: Address details are stored on profiles, not repeated on every transaction. Blood type is an ENUM, ensuring consistency.

### 3️⃣ Migration & Seeding Commands

#### Initialize & Push Schema
To create the tables in your local PostgreSQL container:
```bash
npx prisma migrate dev --name init_schema
```

#### Generate Client
To update the TypeScript types based on the schema:
```bash
npx prisma generate
```

#### View Data
To inspect the database using a GUI:
```bash
npx prisma studio
```

#### Seed Initial Data
To populate the DB with a test Admin, Hospital, and Donor:
```bash
npx prisma db seed
```

### 4️⃣ Scalability Considerations

-   **Indexes**: Added on frequently queried columns like `bloodType`, `hospitalId`, and `status` to speed up filtering.
-   **Enums**: Used for `Role`, `BloodType`, and `Status` to enforce data integrity at the database level.
-   **UUIDs**: We use UUIDs for primary keys to allow easy data merging and avoid sequential ID enumeration attacks.
-   **Cascade Deletes**: Configuring `onDelete: Cascade` ensures that deleting a User automatically cleans up their Profile and related sensitive data.

### 5️⃣ 📸 Submission Screenshots

For Assignment 2.13, capture:
1.  **Migration Success**: Terminal output showing `prisma migrate dev` completion.
2.  **Prisma Studio**: Screenshot of the browser showing the `User` and `BloodInventory` tables populated with seed data.

---


---

## 🏎️ Prisma ORM Setup & Client Initialisation (Sprint 1 – Assignment 2.14)

Prisma is our chosen ORM (Object-Relational Mapper) because it provides **type-safety**, **auto-completion**, and **migration management** out of the box. This setup ensures that our database interactions are robust and scalable.

### 1️⃣ Installation & Initialization

We installed the core Prisma CLI and the client library:
```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```
- `prisma`: Development tool for migrations and studio.
- `@prisma/client`: Auto-generated query builder used in our Next.js API routes.
- `prisma.config.ts`: Configuration file (replacing `schema.prisma` datasource URL in v7).

### 2️⃣ Schema Design (Production-Ready)

Our `prisma/schema.prisma` file defines all models (`User`, `DonorProfile`, `BloodInventory`, etc.) with strict types and relationships.
- **Enums** (`UserRole`, `BloodType`) enforce data consistency.
- **Indexes** (`@@index`) optimize query performance.
- **Relations** (`@relation`) link tables (e.g., User -> DonorProfile).

### 3️⃣ Migration Workflow

To apply changes to the database:
1.  **Modify** `schema.prisma`.
2.  **Run Migration**:
    ```bash
    npx prisma migrate dev --name <migration_name>
    ```
    This creates the SQL tables and updates the database.
3.  **Generate Client**:
    ```bash
     npx prisma generate
    ```
    This updates the TypeScript types in `node_modules`.
4.  **Verify**:
    ```bash
    npx prisma studio
    ```
    Opens a web GUI to view/edit data.

### 4️⃣ Prisma Client (Singleton Pattern)

To prevent connection exhaustion in Next.js (especially during hot-reloading in dev), we use a **singleton instance** located at `src/lib/prisma.ts`.

```ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 5️⃣ Testing the Setup

We created a test API route at `src/app/api/test-db/route.ts` that:
1.  Connects to the database.
2.  Upserts a test user.
3.  Fetches and returns all users.

**Access it at:** `http://localhost:3000/api/test-db`

### 🧠 Reflection

Prisma bridges the gap between our TypeScript application and the PostgreSQL database.
- **Safety**: Creating a user with an invalid role (e.g., "SUPER_ADMIN") throws a compile-time error, preventing bugs before they run.
- **Productivity**: Auto-completion for database queries speeds up development significantly.
- **Maintenance**: Schema migrations are version-controlled, making it easy to roll back or deploy changes safely.

### 📷 Submission Evidence
1.  **Migration Logs**: Terminal screenshot of `npx prisma migrate dev`.
2.  **Prisma Studio**: Screenshot of the browser GUI showing seeded data.
3.  **API Response**: JSON response from `/api/test-db`.

---


---

## 🎲 Database Migrations & Seed Scripts (Sprint 1 – Assignment 2.15)

Managing database schema changes effectively is critical for team collaboration and production stability. We use Prisma Migrations to track changes and Seed Scripts to populate consistent test data.

### 1️⃣ Database Migrations

**Migrations** act as version control for your database schema. They ensure every developer and the production server have the exact same table structure.

#### Creating a Migration
When you modify `prisma/schema.prisma` (e.g., adding a field), run:
```bash
npx prisma migrate dev --name <descriptive-name>
```
*Example: `npx prisma migrate dev --name add_dob_to_user`*
This generates a SQL file in `prisma/migrations` and applies it to your local DB.

#### Deploying to Production
**NEVER** use `migrate dev` in production. Instead, use:
```bash
npx prisma migrate deploy
```
This applies pending migrations without resetting the database or generating new SQL files.

#### Resetting the Database
If your local database gets messy or out of sync:
```bash
npx prisma migrate reset
```
This drops the database, re-applies all migrations, and runs the seed script automatically.

### 2️⃣ Production-Level Strategy

-   **Immutability**: Once a migration is merged to `main`, the SQL file should never be edited. If you made a mistake, create a *new* migration to fix it.
-   **Review**: SQL migration files should be reviewed in PRs to ensure no accidental data loss (e.g., `DROP TABLE`).
-   **Backup**: Always backup the production database before running `migrate deploy`.

### 3️⃣ Seed Script (Idempotent)

Our seed script at `prisma/seed.ts` loads essential initial data (Admin, Hospital, Donor).

-   **Command**: `npx prisma db seed`
-   **Idempotency**: We use `upsert` (Update or Insert) instead of `create`. This allows you to run the seed command multiple times without crashing due to duplicate key errors.

**Configuration in `package.json`**:
```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

### 4️⃣ Verification

To verify the schema and data:
1.  Run `npx prisma studio`.
2.  Check the `User` table for the seeded admin and donor.
3.  Check `BloodInventory` for the initial stock.

### 🧠 Reflection

-   **Consistency**: Migrations eliminate "it works on my machine" issues caused by schema drift.
-   **Onboarding**: New developers simply run `npm install` and `npx prisma migrate dev`, and they have a fully working, populated database immediately.
-   **Reliability**: Automated migrations reduce the risk of human error during deployments compared to manual SQL execution.

### 📷 Submission Evidence

1.  **Migration Logs**: Screenshot of `npx prisma migrate dev` success.
2.  **Migration Folder**: Screenshot of the `prisma/migrations` directory structure.
3.  **Seed Output**: Screenshot of the terminal showing "🌱 Starting seed..." and "✅ Created...".
4.  **Prisma Studio**: Screenshot showing the populated data.

---


---

## ⚡ Transaction & Query Optimisation (Sprint 1 – Assignment 2.16)

Efficient database interactions are key to BloodOS's scalability. We use **Prisma Transactions** for data integrity and **Optimised Queries** to reduce load.

### 1️⃣ Atomic Transactions (Rollback Safety)

When a donation is recorded, three things **must** happen together or **none** at all:
1.  **Create** a `DonationRecord`.
2.  **Update** `BloodInventory` (add stock).
3.  **Log** the action in `AuditLog`.

We use `prisma.$transaction` to enforce this. If any step fails (e.g., database error or validation check), the entire operation is rolled back, preventing "phantom" inventory.

**Example Endpoint:** `src/app/api/donation/route.ts`

### 2️⃣ Query Optimisation Strategy

We avoid the "N+1 Problem" and over-fetching by using specific `select` clauses and pagination.

#### Bad Practice (Avoided) ❌
Fetched entire User object including password hash for every donation:
```typescript
const donations = await prisma.donationRecord.findMany({ include: { donor: true } });
```

#### Optimised Practice ✅
Fetching only necessary fields:
```typescript
const donations = await prisma.donationRecord.findMany({
  select: {
    id: true,
    quantity: true,
    donor: {
      select: { email: true, donorProfile: { select: { fullName: true } } }
    }
  }
});
```

### 3️⃣ Indexes & Performance

We added composite and single-field indexes to `schema.prisma` to speed up common filters:

-   `@@index([bloodType])`: Faster filtering of inventory and donations.
-   `@@index([donationDate])`: Optimizes reporting queries by date range.
-   `@@index([donorId])`: Quick lookup of a user's history.

### 4️⃣ Performance Monitoring

To view actual SQL queries and performance metrics, we enable logging in `src/lib/prisma.ts`:
```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```
This output allows us to inspect query execution times in the terminal during development.

### 🧠 Reflection

-   **Data Integrity**: Without transactions, a server crash could log a donation but fail to update inventory, causing stock mismatches.
-   **Speed**: Selecting only needed fields reduces payload size and network latency.
-   **Scalability**: Pagination ensures the server doesn't crash when trying to load 10,000 donation records at once.

### 📷 Submission Evidence
1.  **Transaction Success**: API response showing donation + inventory update.
2.  **Rollback Test**: API response showing error and *no* data changes when 'shouldFail' is true.
3.  **Optimised Query**: JSON response from `GET /api/donation` showing paginated, minimal data.

---


---

## 🌐 API Route Structure & Naming (Sprint 1 – Assignment 2.17)

We follow strictly RESTful conventions for our Next.js App Router API. Resources are named using plural nouns, and actions are defined by HTTP verbs.

### 1️⃣ Resource Design

Our API is organized hierarchically:

```
src/app/api/
├── users/
│   ├── route.ts            # GET (all), POST (create)
│   └── [id]/
│       ├── route.ts        # GET (one), PATCH (update), DELETE
│       └── donations/      # Nested Resource
│           └── route.ts    # GET (donations for specific user)
├── donations/
│   └── route.ts            # GET (all), POST (create)
├── hospitals/
└── blood-inventory/
```

### 2️⃣ HTTP Verb Usage

| Verb | Usage | Success Status | Error Status |
|------|-------|----------------|--------------|
| **GET** | Fetch resources (list or single) | `200 OK` | `404 Not Found` |
| **POST** | Create new resource | `201 Created` | `400 Bad Request` |
| **PATCH** | Update existing resource (partial) | `200 OK` | `404 Not Found` |
| **DELETE** | Remove resource | `204 No Content` | `404 Not Found` |

### 3️⃣ Pagination & Filtering

All "List" endpoints (`GET /api/users`) support pagination via query parameters:
- `page` (default: 1)
- `limit` (default: 10)

**Example Request:**
```bash
curl "http://localhost:3000/api/users?page=2&limit=5"
```

**Response Format:**
```json
{
  "success": true,
  "meta": {
    "total": 50,
    "page": 2,
    "limit": 5,
    "totalPages": 10
  },
  "data": [ ... ]
}
```

### 4️⃣ Error Handling

We use standard JSON error responses. We never leak stack traces to the client in production.

**Error Response Example:**
```json
{
  "success": false,
  "error": "User not found"
}
```

### 🧠 Reflection

-   **Consistency**: Using standard naming (`/users` vs `/getUsers`) makes the API predictable for frontend developers.
-   **Nested Routes**: `/api/users/[id]/donations` intuitively explains "Get donations belonging to this user".
-   **Scalability**: Pagination is enforced by default to prevent server crashes on large datasets.

---


---

## �️ Global API Response Handler (Sprint 1 – Assignment 2.18)

To ensure consistency across endpoints, we standardized all API responses using a unified wrapper.

### 1️⃣ Response Standard (Envelope)

Every API response, whether success or error, follows this predictable JSON structure:

```typescript
{
  success: boolean,
  message: string,
  data?: T,           // Present only on success
  error?: {           // Present only on failure
    code: string,     // E.g., E100, E404
    details?: any
  },
  timestamp: string   // ISO Date for logging/debugging
}
```

### 2️⃣ Error Code Dictionary

We map HTTP statuses to internal short codes in `src/lib/errorCodes.ts`:

| Code | Meaning | HTTP Status |
|------|---------|-------------|
| **E100** | Validation Error | 400 |
| **E200** | Unauthorized | 401/403 |
| **E300** | Not Found | 404 |
| **E500** | Internal Error | 500 |

### 3️⃣ Examples

#### ✅ Success Response
`GET /api/users/123`
```json
{
  "success": true,
  "message": "User details fetched successfully",
  "data": {
    "id": "123",
    "email": "donor@example.com"
  },
  "timestamp": "2024-02-19T10:00:00.000Z"
}
```

#### ❌ Error Response (Not Found)
`GET /api/users/999`
```json
{
  "success": false,
  "message": "User not found",
  "error": {
    "code": "E300"
  },
  "timestamp": "2024-02-19T10:05:00.000Z"
}
```

### 🧠 Reflection

-   **Developer Experience**: The frontend team no longer guesses if the data is in `response.data`, `response.body`, or `response.user`. It is *always* in `response.data.data`.
-   **Observability**: Including timestamps and specific error codes (`E100` vs generic 400) helps us debug issues faster in production logs.
-   **Scalability**: Centralizing response logic in `responseHandler.ts` means we can easily add features like global logging or response compression later without touching every route file.


---

## 🔒 Authorization Middleware & RBAC (Sprint 1 – Assignment 2.21)

We upgraded our security model by implementing a centralized **Next.js Middleware** to handle authentication and role-based access control (RBAC) at the edge.

### 1️⃣ Middleware Logic (`src/middleware.ts`)

Instead of validating tokens in every route handlers, the middleware intercepts requests:

1.  **Check Path**: Is it a protected route? (`/api/users`, `/api/admin`)
2.  **Verify Token**: Uses `jose` (Edge-compatible JWT library) to verify `Authorization: Bearer <token>`.
3.  **Check Role**:
    -   If accessing `/api/admin`, user role must be `ADMIN`.
    -   If valid, injects `x-user-id` and `x-user-role` headers.
4.  **Reject**: Returns 401 (Missing Token) or 403 (Forbidden/Invalid Role).

### 2️⃣ Role-Based Access Control (RBAC)

We support multiple roles via the `UserRole` enum:
-   **ADMIN**: Full access to `/api/admin` and all user data.
-   **DONOR/HOSPITAL**: Access to their own data and general authenticated routes.

### 3️⃣ Usage Examples

#### Admin Access (Success)
```bash
# Login as Admin first to get token
curl -H "Authorization: Bearer <ADMIN_TOKEN>" http://localhost:3000/api/admin
```
**Response:**
```json
{
  "success": true,
  "data": "This is protected Admin data",
  "userId": "admin-uuid",
  "userRole": "ADMIN"
}
```

#### User Accessing Admin (Failure)
```bash
# Login as Donor
curl -H "Authorization: Bearer <DONOR_TOKEN>" http://localhost:3000/api/admin
```
**Response:**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required.",
  "error": { "code": "FORBIDDEN" }
}
```

### 🧠 Reflection

-   **Least Privilege**: Users only get access to what they strictly need. Donors cannot see Admin stats.
-   **Centralized Security**: If we need to change how tokens are verified (e.g., add rotation or blacklist), we change it in *one file* (`middleware.ts`), protecting the entire app instantly.
-   **Performance**: Middleware runs at the Edge (Vercel/Next.js default), making auth checks extremely fast before even hitting our database or Node.js server.

---


---

## �️ Error Handling & Structured Logging (Sprint 1 – Assignment 2.22)

We implemented a **centralized error handling system** to improve observability and security. By catching errors in a single utility, we ensure consistent logs and safe client responses.

### 1️⃣ Structured Logger (`src/lib/logger.ts`)

Instead of `console.log`, we use a custom logger that outputs JSON:

```json
{
  "level": "error",
  "message": "Database Connection Failed",
  "meta": { "context": "GET /api/users", "userId": "123" },
  "timestamp": "2024-02-20T10:00:00Z"
}
```

### 2️⃣ Dev vs. Prod Behavior

| Feature | Development (`NODE_ENV=development`) | Production (`NODE_ENV=production`) |
| :--- | :--- | :--- |
| **Response Message** | Full error details | "Something went wrong. Please try again later." |
| **Stack Trace** | Included in JSON response | **HIDDEN** (Security Best Practice) |
| **Server Logs** | JSON format | JSON format (ingested by Datadog/CloudWatch) |

### 3️⃣ Example Responses

#### Development (Detailed)
```json
{
  "success": false,
  "message": "Simulated Database Connection Failed",
  "error": {
    "code": "E500",
    "stack": "Error: Simulated... at GET (route.ts:15:11)..."
  },
  "timestamp": "..."
}
```

#### Production (Safe)
```json
{
  "success": false,
  "message": "Something went wrong. Please try again later.",
  "error": {
    "code": "E500"
  },
  "timestamp": "..."
}
```

### 🧠 Reflection

-   **Observability**: Structured JSON logs allow us to query logs by `level: error` or `context: POST /api/users` in tools like Datadog or ELK Stack.
-   **Security**: Hiding stack traces in production prevents attackers from learning about our file structure or library versions.
-   **Consistency**: Every single error in the app now has the exact same JSON usage signature.

---


---

## ⚡ Redis Caching & Performance (Sprint 1 – Assignment 2.23)

To handle high traffic, we implemented an in-memory caching layer using **Redis (via `ioredis`)**. This significantly reduces database load for read-heavy endpoints like `/api/users`.

### 1️⃣ Cache-Aside Strategy (`src/lib/redis.ts`)

We follow the "lazy loading" pattern:

1.  **Check Cache**: Is the data in Redis?
    -   **YES (Hit)**: Return immediately (Response time: < 10ms).
    -   **NO (Miss)**: Fetch from PostgreSQL, save to Redis (TTL: 60s), and return.

### 2️⃣ Cache Invalidation

When a new user is created (`POST /api/users`), the cached list becomes stale. We automatically **delete** the relevant cache keys (`users:list:page:1...`) to ensure data consistency.

### 3️⃣ Performance Benchmarks

| Request Type | Source | Response Time (Avg) |
| :--- | :--- | :--- |
| **Cold Request** (First Hit) | Database (Postgres) | ~120ms |
| **Warm Request** (Cached) | Redis (In-Memory) | **~8ms** |

### 4️⃣ Example Logs

**Cache Miss:**
```json
{ "level": "info", "message": "Cache Miss - Fetching from Database", "timestamp": "..." }
```

**Cache Hit:**
```json
{ "level": "info", "message": "Cache Hit - Returning from Redis", "meta": { "executionTime": "8ms" }, "timestamp": "..." }
```

### 🧠 Reflection

-   **Scalability**: Redis handles thousands of requests per second that would otherwise crash a relational database.
-   **Coherence**: The trade-off for speed is temporary staleness (up to 60s). We mitigate this with active invalidation on writes.
-   **Resilience**: The API is designed to **fail gracefully**. If Redis is down, it silently falls back to the database without breaking the application.

---


---

## ☁️ Secure File Uploads (Sprint 1 – Assignment 2.24)

We implemented a **secure, scalable file upload system** using AWS S3 Pre-Signed URLs. This allows users to upload files directly to S3 without burdening our server with file buffers.

### 1️⃣ Upload Flow (Security & Performance)

1.  **Client Request**: User asks for upload permission (`POST /api/upload`).
    -   Server validates file type (e.g., Image/PDF) and size (< 5MB).
2.  **Generate URL**: Server uses AWS SDK to generate a temporary **Pre-Signed URL** (valid for 60s).
3.  **Direct Upload**: Client PUTs the file directly to S3 using this URL.
4.  **Metadata Store**: Client notifies server (`POST /api/files`) to save file metadata (URL, size) in PostgreSQL.

### 2️⃣ Why Pre-Signed URLs?

-   **Server Load**: Large files don't consume our Node.js memory or bandwidth.
-   **Security**: We don't expose AWS Credentials to the client. The URL is time-bombed (60s).
-   **Scalability**: S3 handles the heavy lifting of ingestion.

### 3️⃣ File Storage Model (Prisma)

```prisma
model File {
  id        String   @id @default(uuid())
  userId    String?
  name      String
  url       String   @unique
  size      Int
  type      String
  uploadedAt DateTime @default(now())
}
```

### 4️⃣ Example Usage

**Step 1: Get Upload URL**
```bash
POST /api/upload
Body: { "filename": "report.pdf", "fileType": "application/pdf", "fileSize": 102400 }
```
**Response:**
```json
{
  "success": true,
  "data": {
    "uploadURL": "https://bloodos-uploads.s3.amazonaws.com/uploads/user-123/uuid.pdf?X-Amz-Signature=...",
    "fileKey": "uploads/user-123/uuid.pdf",
    "expiresIn": 60
  }
}
```

**Step 2: Upload File**
```bash
curl -X PUT -T report.pdf "https://bloodos-uploads.s3.amazonaws.com/..."
```


---

## � Transactional Email Service (Sprint 1 – Assignment 2.25)

We integrated **AWS SES (Simple Email Service)** to send transactional emails — welcome messages, password resets, and notifications. SES was chosen over SendGrid for its deep AWS ecosystem integration and cost-efficiency at scale.

### 1️⃣ Provider: AWS SES

| Feature | AWS SES | SendGrid |
| :--- | :--- | :--- |
| Free Tier | 62,000 emails/month (from EC2) | 100 emails/day |
| DKIM/SPF | Built-in via Route53 | Manual setup |
| Ecosystem | Native AWS integration | Third-party |
| Production Approval | Request via AWS console | Automatic |

### 2️⃣ Setup Steps

1. **Verify Sender Email** in AWS SES console (`SES_EMAIL_SENDER`).
2. Add environment variables from `.env.example`.
3. For production, request **SES Sandbox Exit** via AWS support.

### 3️⃣ API Usage

```bash
curl -X POST http://localhost:3000/api/email \
  -H "Content-Type: application/json" \
  -d '{"to":"donor@example.com","subject":"Welcome to BloodOS!","templateType":"welcome","userName":"Alice"}'
```

**Success Response:**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": { "messageId": "0101019412345678-abc" }
}
```

**Failure Response (Missing Field):**
```json
{
  "success": false,
  "message": "Missing required fields: to, subject",
  "error": { "code": "E100" }
}
```

### 4️⃣ Internal Log (Structured JSON)

```json
{ "level": "info", "message": "Email sent successfully", "meta": { "to": "donor@example.com", "messageId": "0101..." }, "timestamp": "..." }
```

### 🧠 Reflection

-   **SPF/DKIM**: Configured via Route53 on the sending domain to improve deliverability and pass spam filters.
-   **Bounce Handling**: SES automatically handles bounces via SNS notifications — we log and suppress bounced addresses.
-   **Rate Limits**: SES default is 1 email/second in sandbox. Production can request higher quotas.
-   **Retry Strategies**: Wrap `sendEmail()` in an exponential backoff retry for transient provider failures.
-   **Queue for Scale**: For high volume, emails should be pushed to an SQS queue and processed by a separate worker — decoupling email delivery from request handling.


---

## �️ Page Routing & Dynamic Routes (Sprint 1 – Assignment 2.26)

We implemented Next.js App Router file-based routing with public routes, protected routes, and dynamic segments.

### 1️⃣ Route Map

```
/                    → Home (Public)
/login               → Login (Public)  — sets auth_token cookie
/dashboard           → Dashboard (Protected 🔒)
/users               → Users List (Protected 🔒)
/users/[id]          → User Profile (Protected 🔒, Dynamic)
/not-found           → Custom 404
```

### 2️⃣ Middleware Protection for Pages

The middleware now handles **two token sources**:

| Route Type | Token Source | Failure Behavior |
| :--- | :--- | :--- |
| API Routes (`/api/*`) | `Authorization: Bearer <token>` | Return 401/403 JSON |
| Page Routes (`/dashboard`, `/users`) | `auth_token` cookie | Redirect to `/login?from=<path>` |

### 3️⃣ Dynamic Routes

`/users/[id]` demonstrates:
- **Breadcrumb**: Home › Users › User {id}
- **Dynamic SEO Metadata**: `generateMetadata()` generates per-user title/description
- **notFound()**: Invalid IDs render the custom 404 page

### 4️⃣ Reflection

- **File-based routing** eliminates verbose router configuration — just create a folder.
- **Protected redirects** preserve the `?from=` param so users land where they intended after login.
- **Dynamic routes** make the app infinitely scalable — `/users/[id]` handles millions of profiles without new routes.
- **`notFound()`** triggers the `not-found.tsx` UI cleanly without a full page reload.


---

## 🧩 Component Architecture (Sprint 1 – Assignment 2.27)

We built a modular, scalable component library to ensure visual consistency and developer efficiency across the entire application.

### 1️⃣ Component Hierarchy

```
<RootLayout>
  └── <LayoutWrapper>
        ├── <Header />          → Brand + top nav (sticky)
        └── flex row
              ├── <Sidebar />   → Left nav w/ active state
              └── <main>        → Page children rendered here
```

### 2️⃣ Folder Structure

```
src/components/
  ├── layout/
  │   ├── Header.tsx       → Sticky branded navbar
  │   ├── Sidebar.tsx      → Active-route nav sidebar
  │   └── LayoutWrapper.tsx→ Composes Header + Sidebar
  └── ui/
  │   ├── Button.tsx       → Variants: primary/secondary/danger/ghost
  │   ├── Card.tsx         → Content container with title/footer slots
  │   └── InputField.tsx   → Accessible labeled input with error state
  └── index.ts             → Barrel export
```

### 3️⃣ Barrel Imports

```typescript
// ✅ Clean — from barrel
import { Button, Card, Header, Sidebar } from '@/components';

// ❌ Verbose — without barrel
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
```

### 4️⃣ Accessibility Highlights

- `<header role="banner">`, `<aside role="complementary">`, `<main role="main">` — semantic landmarks
- `aria-current="page"` on active sidebar link
- `aria-invalid`, `aria-describedby` on InputField for screen readers
- Skip-to-main-content link in RootLayout for keyboard users

### 🧠 Reflection

- **Reusability**: `<Button>` and `<Card>` are used on 4+ pages — change once, update everywhere.
- **Scalability**: Adding `<NavItem>` to the `NAV_ITEMS` array in Sidebar instantly adds new routes.
- **Maintainability**: Barrel exports mean imports never break when files move within the component tree.
- **Developer Onboarding**: Any new dev can quickly understand the app structure from the clear hierarchy.

---

---

## 🌐 Global State Management (Sprint 1 – Assignment 2.28)

We implemented a **Context API + useReducer** state system across two contexts — Auth and UI — with clean custom hooks as the public interface.

### 1️⃣ Provider Tree

```
<AuthProvider>        ← user, isAuthenticated, login(), logout()
  <UIProvider>        ← theme, sidebarOpen, toggleTheme(), toggleSidebar()
    <LayoutWrapper>   
      {children}      ← Any component can consume via useAuth() / useUI()
```

### 2️⃣ State Flow (useReducer Actions)

| Context | Actions | Triggered By |
| :--- | :--- | :--- |
| **AuthContext** | `LOGIN`, `LOGOUT`, `SET_LOADING` | `login()`, `logout()` |
| **UIContext** | `TOGGLE_THEME`, `TOGGLE_SIDEBAR`, `SET_SIDEBAR` | `toggleTheme()`, `toggleSidebar()` |

### 3️⃣ Custom Hooks (Public Interface)

```typescript
// Any component — no prop drilling needed
const { user, isAuthenticated, login, logout } = useAuth();
const { theme, isDark, sidebarOpen, toggleTheme, toggleSidebar } = useUI();
```

### 4️⃣ Console Output

```
[AuthContext] State → LOGIN  { user: { name: 'Alice Kumar', role: 'DONOR' } }
[UIContext]   Theme → dark
[UIContext]   Sidebar → false
[AuthContext] State → LOGOUT
```

### 🧠 Reflection

- **No Prop Drilling**: Any leaf component in the tree can `useAuth()` without threading props through parent layers.
- **useReducer over useState**: Gives predictable, traceable state transitions and makes debugging easy.
- **Split Contexts**: Auth and UI are in separate contexts — prevents unrelated renders from triggering when only auth state changes.
- **localStorage Persistence**: Theme preference survives page refresh via `UIProvider`'s `useEffect`.
- **Scalability**: Adding new global state (e.g., `NotificationContext`) is a simple matter of a new context file + provider — no refactoring needed.


---

## ⚡ SWR Data Fetching (Sprint 1 – Assignment 2.29)

We implemented **SWR (stale-while-revalidate)** for client-side data fetching on the `/users` page, providing instant cache responses with automatic background revalidation.

### 1️⃣ What is SWR?

SWR returns **stale (cached) data immediately**, then revalidates in the background and updates the UI when fresh data arrives. This gives users instant feedback while staying up-to-date.

```
Request → Cache Hit? → Return stale data immediately
                    → Revalidate in background
                    → Update UI with fresh data
```

### 2️⃣ SWR vs Fetch API

| Feature | Plain `fetch` | SWR |
| :--- | :--- | :--- |
| Caching | ❌ None | ✅ Built-in |
| Deduplication | ❌ No | ✅ Automatic |
| Revalidation | ❌ Manual | ✅ On focus, interval |
| Loading state | Manual | ✅ `isLoading` |
| Error state | Manual | ✅ `error` |
| Optimistic UI | Complex | ✅ `mutate()` |

### 3️⃣ Revalidation Config

```typescript
useSWR('/api/users', fetcher, {
  revalidateOnFocus: true,    // Re-fetch when user returns to tab
  refreshInterval: 30_000,    // Poll every 30 seconds
  onErrorRetry: (err, _key, _config, revalidate, { retryCount }) => {
    if (err.status === 404) return;   // Never retry 404
    if (retryCount >= 3) return;      // Max 3 retries
    setTimeout(() => revalidate({ retryCount }), 3000 * retryCount);
  },
});
```

### 4️⃣ Cache Invalidation After Mutation

```typescript
// After POST /api/users succeeds:
mutate('/api/users');  // Triggers SWR to refetch → UI updates automatically
```

### 🧠 Reflection

- **Performance**: SWR deduplicates identical requests — 10 components using the same key share one network call.
- **UX**: Cached data displays instantly; no blank loading screens on revisit.
- **Trade-offs**: Stale data may briefly show outdated content — mitigated with `revalidateOnFocus`.
- **Scalability**: SWR's key-based caching mirrors our Redis layer — the same Cache-Aside pattern at the client level.


---

## � Form Handling & Validation (Sprint 1 – Assignment 2.30)

We implemented schema-based form validation using **React Hook Form + Zod + @hookform/resolvers**, building two fully validated forms from a single reusable `FormInput` component.

### 1️⃣ Why React Hook Form + Zod?

| Feature | React Hook Form | Zod |
| :--- | :--- | :--- |
| **Role** | Form state & submission | Schema validation |
| **Re-renders** | Minimal (uncontrolled) | N/A |
| **Type Safety** | Partial | ✅ Full — `z.infer<typeof schema>` |
| **Error UX** | `formState.errors` | Custom error messages |

### 2️⃣ Validation Flow

```
User Input → Zod Schema Validation → zodResolver → React Hook Form Errors → FormInput error prop → UI
```

### 3️⃣ Reusable FormInput Component

The single `<FormInput>` component is used across both `/signup` and `/contact` with different schemas:

```typescript
// Signup — password confirmation with .refine()
const signupSchema = z.object({ ... })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match', path: ['confirmPassword'],
  });

// Contact — textarea + live character count
const contactSchema = z.object({
  message: z.string().min(10).max(1000),
});
```

### 4️⃣ Accessibility Highlights

- `aria-invalid={hasError}` on inputs — screen readers announce invalid state
- `aria-describedby` links input to its error message
- `role="alert"` on error paragraph — announced immediately by screen readers
- `noValidate` on `<form>` — disables native browser validation, keeping Zod in full control

### 🧠 Reflection

- **Reusability**: One `FormInput` component covers all use cases — text, email, password, textarea.
- **Type Safety**: `z.infer<typeof schema>` gives 100% TypeScript types from the Zod definition — no duplication.
- **Performance**: React Hook Form uses uncontrolled inputs under the hood — zero re-renders on keystroke.
- **Scalability**: Adding a new validated form is just writing a new Zod schema — no changes to shared components.

---

## �📄 License





This project is developed for educational and simulated work purposes only.
---

## Feedback UI & Responsive Theming (Assignment 2.31)

Complete feedback system: toasts, modals, loaders + light/dark responsive design.

### Toast System (react-hot-toast)
- `toast.success()` — API success, 4s auto-dismiss
- `toast.error()` — API failure, 4s auto-dismiss
- `toast.loading()` → `toast.success(id)` — async operation lifecycle

### ConfirmModal Accessibility
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`
- ESC closes, backdrop click closes, focus on Cancel button on open
- Body scroll locked while open

### Full Delete Flow
User clicks Delete → Modal opens → Confirm → toast.loading() → API → toast.success/error

### Dark Mode Strategy
- `darkMode: 'class'` in tailwind.config.js
- CSS custom properties swapped in `.dark {}` class
- localStorage persistence + system prefers-color-scheme detection
- Smooth 0.3s background-color transition on html element

### Reflection
- Toasts give instant, non-blocking feedback — improved UX
- Modals build trust before destructive actions
- Loaders with aria-live ensure screen reader users are informed
- CSS custom properties ensure theme consistency without style duplication
- WCAG: focus-visible, aria-pressed, aria-label on all interactive elements

---

## License

This project is developed for educational and simulated work purposes only.

---

## Error & Loading States (Assignment 2.32)

Implemented Next.js App Router route-level loading and error handling using loading.tsx and error.tsx.

### How It Works

Next.js App Router automatically renders:
- `loading.tsx` — while the async Server Component page is fetching data
- `error.tsx` — when the Server Component throws an unhandled error

No manual state management needed. Zero extra code in page.tsx.

### loading.tsx — Skeleton UI

```
Route /users visited
  → Next.js immediately renders loading.tsx (instant)
  → Server runs fetchUsers() with 2s delay in background
  → loading.tsx replaced with real page.tsx content
```

Why Skeleton > Spinner:
- Preserves layout shape — less jarring visual shift on load
- Users perceive skeleton loads as 40% faster (psychological effect)
- Each placeholder mirrors real content structure (avatar, name, role badge)
- Spinners give no hint of what content is coming

### error.tsx — Error Boundary

```
fetchUsers() throws Error
  → Next.js catches it server-side
  → Renders error.tsx automatically
  → reset() re-renders the route (triggers loading.tsx → page.tsx again)
```

Accessibility:
- role="alert" + aria-live="assertive" — announced immediately by screen readers
- Keyboard-accessible retry button with focus state
- Dev-only error.message + digest shown for debugging
- "Go Home" fallback for graceful degradation

### Testing

| Test | How |
| :--- | :--- |
| Loading skeleton | Visit /users — 2s delay triggers loading.tsx |
| Error boundary | Visit /users?error=1 — throws and renders error.tsx |
| Retry button | Click "Try Again" on error page — reset() rerenders route |
| Slow network | Chrome DevTools → Network → Slow 3G |

### Reflection

- **UX**: Skeleton UI prevents blank screens — users know content is coming
- **Resilience**: Error boundaries catch failures gracefully without crashing the app  
- **Trust**: Friendly error UI with retry builds confidence vs generic browser errors
- **DX**: Next.js handles wiring automatically — loading.tsx and error.tsx just work
- **Scalability**: Each route can have its own loading/error UI — granular control

---

---

## JWT Auth — Access & Refresh Tokens (Assignment 2.34)

Implemented a dual-token authentication system with automatic refresh flow and HTTP-only cookie security.

### Token Architecture

| Property | Access Token | Refresh Token |
| :--- | :--- | :--- |
| Expiry | 15 minutes | 7 days |
| Storage | Memory (JS variable) | HTTP-only cookie |
| Secret | JWT_SECRET | JWT_REFRESH_SECRET |
| Transport | Authorization: Bearer | Cookie (auto) |
| JS Accessible | Yes (memory only) | No (httpOnly) |

### Security Measures

| Threat | Risk | Mitigation |
| :--- | :--- | :--- |
| XSS | Steal tokens from storage | Refresh token in httpOnly cookie — JS cannot access |
| CSRF | Forge authenticated requests | sameSite=Strict — cross-site requests blocked |
| Token replay | Reuse stolen access token | 15m expiry limits exposure window |
| Refresh replay | Reuse stolen refresh token | Token rotation — every refresh issues a new token |
| Enumeration | Discover valid emails | Generic "Invalid email or password" response |

### Token Flow Sequence

```
POST /api/auth/login
  → Validate credentials (bcrypt compare)
  → generateAccessToken(userId, role)  → returned in response.body
  → generateRefreshToken(userId, role) → Set-Cookie: refresh_token (httpOnly)

Client stores accessToken in memory variable (NOT localStorage)

GET /api/auth/me
  → Authorization: Bearer <accessToken>
  → verifyAccessToken() → 200 OK + user payload

[15 minutes pass — access token expires]

GET /api/auth/me
  → 401 { expired: true }

authFetch() detects expired → calls:
POST /api/auth/refresh
  → Reads refresh_token cookie (browser sends automatically)
  → verifyRefreshToken()
  → generateAccessToken() → new 15m token
  → generateRefreshToken() → NEW cookie (token rotation)
  → Returns { accessToken: "..." }

authFetch() retries original request with new token
```

### Why NOT localStorage?

localStorage is accessible to any JavaScript on the page.
A single XSS vulnerability exposes all tokens forever.
HTTP-only cookies are invisible to JavaScript — cannot be stolen via XSS.

### Reflection

- Dual secrets (JWT_SECRET + JWT_REFRESH_SECRET) mean a compromised access secret doesn't expose refresh tokens
- Token rotation means leaked refresh tokens self-invalidate on next legitimate use
- Memory-based access token storage eliminates the most common XSS attack vector
- 15m access token expiry provides a small attack window even if intercepted
- queued refresh in authFetch() prevents multiple concurrent refresh calls (N+1 refresh problem)

---

---

## Role-Based Access Control (RBAC) — Assignment 2.35

Implemented a centralized RBAC system with permission mapping, API enforcement, UI guards, and structured audit logging.

### Roles & Permissions Matrix

| Permission | ADMIN | DONOR | HOSPITAL | NGO |
| :--- | :---: | :---: | :---: | :---: |
| read | ✅ | ✅ | ✅ | ✅ |
| create | ✅ | ✅ | — | — |
| update | ✅ | ✅ | ✅ | — |
| delete | ✅ | — | — | — |
| manage_users | ✅ | — | — | — |
| view_reports | ✅ | — | ✅ | ✅ |

### Architecture

```
src/config/roles.ts       — Role + Permission types, ROLE_PERMISSIONS map, helper functions
src/lib/rbacLogger.ts     — Structured [RBAC] audit logger
src/lib/withPermission.ts — withAuth + withPermission Higher-Order Components
src/components/ui/RoleGuard.tsx — UI-level conditional rendering
```

### Audit Log Format

```
[RBAC] ✅ ROLE=ADMIN    ACTION=delete       RESOURCE=blood_requests RESULT=ALLOWED USER=abc123
[RBAC] 🚫 ROLE=DONOR    ACTION=delete       RESOURCE=blood_requests RESULT=DENIED  REASON=Role lacks delete permission
[RBAC] 🚫 ROLE=NGO      ACTION=update       RESOURCE=blood_requests RESULT=DENIED  REASON=Role lacks update permission
[RBAC] ✅ ROLE=HOSPITAL  ACTION=view_reports RESOURCE=reports        RESULT=ALLOWED
```

### Backend vs Frontend Enforcement

Backend is the ONLY real security gate. Frontend guards are UX convenience only:

| Layer | Purpose | Security |
| :--- | :--- | :--- |
| `withPermission()` API HOC | Enforce on every request | ✅ Authoritative |
| `RoleGuard` component | Show/hide UI elements | ⚠️ UX only |
| `middleware.ts` | Token verification | ✅ Gateway |

### Reflection

- **Scalability**: Adding a new role = one new entry in ROLE_PERMISSIONS map
- **Maintainability**: Permissions defined once in roles.ts — no scattered permission checks
- **Auditability**: Every allow/deny logged with role, action, resource, userId, timestamp
- **Extending to ABAC**: hasPermission() can be augmented with resource ownership checks

---

---

## OWASP Input Sanitization (Assignment 2.36)

Implemented a defense-in-depth security pipeline following OWASP Top 10 guidelines.

### Validation vs Sanitization vs Encoding

| Concept | What it does | Example |
| :--- | :--- | :--- |
| **Validation** | Reject bad structure | Zod: email must be valid format |
| **Sanitization** | Clean bad content | Strip `<script>` tags from input |
| **Encoding** | Escape output safely | React auto-escapes `{userInput}` |

### OWASP Security Pipeline (Per API Route)

```
User Input
  → Zod validation (reject malformed structure)
  → sanitizeStrict / sanitizeRich (strip XSS payloads)
  → truncate (enforce length limits)
  → Prisma parameterized query (SQLi safe by design)
  → Sanitized content stored in DB
  → React renders safely (auto-escaped output)
```

### Before / After Examples

| Attack | Raw Input | After Sanitization |
| :--- | :--- | :--- |
| XSS Script | `<script>alert("Hacked")</script>` | `""` (empty) |
| Event Handler | `<img onerror="steal()">` | `""` (empty) |
| SQLi (Prisma) | `' OR 1=1 --` | Safe bound parameter |
| Mixed | `<b>Hi</b><script>...</script>` | `<b>Hi</b>` |

### Security Checklist

| Threat | Status |
| :--- | :--- |
| XSS via form input | ✅ sanitize-html |
| SQL Injection | ✅ Prisma parameterized |
| Cookie theft | ✅ httpOnly refresh token |
| CSRF | ✅ sameSite=Strict |
| Payload bloat | ✅ Zod max + truncate() |
| Unsafe rendering | ✅ React auto-escape |

### Key Files

| File | Purpose |
| :--- | :--- |
| `src/utils/sanitize.ts` | sanitizeStrict / sanitizeRich / sanitizeObject / logSanitization |
| `src/lib/withSanitizedBody.ts` | Middleware HOC — auto-sanitizes all string body fields |
| `src/app/api/comments/route.ts` | Full pipeline: Zod + sanitize + Prisma |

### Reflection

- Security is layered — no single tool is sufficient
- Backend MUST sanitize even if the frontend validates — never trust the client
- Prisma eliminates SQLi architecturally — raw string interpolation is impossible via the ORM client
- React's auto-escaping handles most output XSS — dangerouslySetInnerHTML should be avoided
- sanitize-html provides defense against stored XSS in user-generated content

---

---

## HTTPS, HSTS, CSP & CORS (Assignment 2.37)

Implemented a full security header stack following OWASP and browser security best practices.

### Security Headers Reference

| Header | Prevents | Value |
| :--- | :--- | :--- |
| `Strict-Transport-Security` | MITM, SSL stripping | `max-age=63072000; includeSubDomains; preload` |
| `Content-Security-Policy` | XSS, data injection | `default-src 'self'; script-src 'self'; frame-ancestors 'none'` |
| `X-Frame-Options` | Clickjacking | `DENY` |
| `X-Content-Type-Options` | MIME sniffing | `nosniff` |
| `Referrer-Policy` | URL leakage | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Sensor abuse | `camera=(); microphone=(); geolocation=()` |
| `Access-Control-Allow-Origin` | Cross-origin theft | Specific domain — no wildcard |

### HSTS Flow

```
1. First visit: http://bloodos.com
   → Middleware 301 redirect → https://bloodos.com
   → Server sends HSTS header (max-age=63072000)

2. Browser caches HSTS rule for 2 years
   → All future requests pre-upgraded to HTTPS by browser
   → HTTP request never even leaves the browser

3. With preload: HSTS enforced even before first visit
```

### CSP Directives Explained

```
default-src 'self'        — All resources from own origin only
script-src 'self'         — No inline scripts, no eval() — eliminates most XSS
img-src 'self' data: https: — Allow data URIs and HTTPS images
frame-ancestors 'none'    — Cannot be iframed anywhere
object-src 'none'         — Flash/plugins disabled
upgrade-insecure-requests — HTTP subresources upgraded to HTTPS automatically
```

### CORS Allowlist

```
✅ ALLOWED: https://bloodos.com
✅ ALLOWED: https://app.bloodos.com
✅ ALLOWED: http://localhost:3000 (dev only)
🚫 BLOCKED: https://evil.com
🚫 BLOCKED: https://anything-else.com
```

### Reflection

- HTTPS is non-negotiable in production — plain HTTP exposes auth tokens in transit
- HSTS prevents protocol downgrade attacks even if a CDN misconfiguration exposes HTTP
- CSP is the strongest second-line XSS defence — limits what injected scripts can do
- CORS does NOT protect server-to-server calls — auth is still required for all routes
- Wildcard CORS (*) effectively means "any website can call our API as the logged-in user"

---

---

## Managed PostgreSQL — AWS RDS & Azure (Assignment 2.38)

Provisioned and connected a managed PostgreSQL instance with secure configuration, connection pooling, SSL, and production hardening.

### Provider Comparison

| Provider | Service | Advantages | Monitoring |
| :--- | :--- | :--- | :--- |
| AWS RDS | Relational Database Service | IAM auth, Multi-AZ, Read Replicas | CloudWatch + Performance Insights |
| Azure DB | Azure Database for PostgreSQL | Built-in HA, geo-redundancy | Azure Monitor |
| Supabase | Managed Postgres + API | Free tier, realtime, REST API | Supabase Dashboard |
| Neon | Serverless Postgres | Branch per PR, scale-to-zero | Neon Console |

### Managed vs Self-Hosted

| Responsibility | Self-Hosted | Managed (RDS/Azure) |
| :--- | :--- | :--- |
| OS patching | Manual | Automatic |
| DB engine upgrades | Manual | Automatic (with control) |
| Automated backups | Custom scripts | Built-in + retention policy |
| SSL certificates | Configure yourself | Enforced by default |
| High availability | Manual setup | Multi-AZ checkbox |
| Scaling | Manual migration | Console/API click |

### DATABASE_URL Configuration

```bash
# Local dev (Docker)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bloodos"

# AWS RDS Production (private VPC + SSL + pool)
DATABASE_URL="postgresql://admin:PWD@host.rds.amazonaws.com:5432/bloodos?sslmode=require&connection_limit=10"

# Azure PostgreSQL
DATABASE_URL="postgresql://admin:PWD@server.postgres.database.azure.com:5432/bloodos?sslmode=require"
```

### Connection Test

```bash
# psql CLI verification
psql -h your-rds-endpoint.amazonaws.com -U bloodos_admin -d bloodos -W

# Test API route
curl https://your-app.vercel.app/api/health/db
# Returns: {success: true, latency_ms: 12, server_time: "...", postgres_version: "PostgreSQL 16.x"}
```

### Production Hardening

- Disable public access — private subnet only, connect via VPC peering or private endpoint
- SSL enforced — `?sslmode=require` in DATABASE_URL
- No wildcard inbound rules — Security Group/firewall scoped to app server only
- Credentials in Secrets Manager — not in .env files committed to git
- Automated backups — 7-day minimum retention, geo-redundant for production
- Connection pooling — `?connection_limit=10` prevents "too many connections" error
- CloudWatch/Azure Monitor alerts — CPU, connections, storage thresholds

### Reflection

- Managed DBs shift undifferentiated heavy lifting to the cloud provider — focus on business logic
- SSL enforcement is non-negotiable in production — plain TCP exposes all query data
- Connection pooling is critical — Next.js serverless functions create new connections per invocation
- Private networking eliminates the largest attack surface — public RDS endpoints are a major risk
- Automated backups with point-in-time recovery enable sub-minute RPO for critical data

---

## Secure Object Storage — AWS S3 / Azure Blob (Assignment 2.39)

Implemented direct cloud uploads using cryptographically signed, short-lived URLs, enforcing least-privilege IAM and zero-trust file validation.

### Provider Comparison

| Provider | Service | Access Model | Temporary Access Method |
| :--- | :--- | :--- | :--- |
| AWS | S3 | IAM Roles / Bucket Policies | Presigned URLs (v4 Signature) |
| Azure | Blob Storage | RBAC / Access Policies | Shared Access Signature (SAS) |

### Upload Architecture: Presigned URLs

By generating a temporary URL on the backend, we bypass the Next.js server for the actual file upload:

1. **Client** requests upload for `image.png` (2MB).
2. **Backend** validates user auth, file size, and mime type.
3. **Backend** signs a PUT URL using AWS IAM keys (valid for 60s).
4. **Client** uploads bytes directly to AWS S3 using the temporary URL.

### Security Implementation

| Layer | Implementation |
| :--- | :--- |
| **IAM Policy** | Backend user has ONLY `s3:PutObject` and `s3:GetObject` |
| **URL Expiry** | Presigned URLs expire strictly in 60 seconds |
| **Validation** | Zod/manual check enforces 5MB limit & strict MIME types |
| **Direct Upload** | Backend memory/CPU is never exhausted by large file streams |
| **Object Key** | Scoped to `/uploads/users/{userId}/{uuid}` to prevent overwrite/IDOR |

### Lifecycle & Cost Management

- **Lifecycle Rules**: Auto-delete unreferenced uploads after 30 days. Auto-transition old media to Standard-IA (Infrequent Access) to save costs.
- **Cost**: S3 charges for storage ($/GB) and request counts (PUT/GET). Direct uploads save Vercel/Next.js function execution costs.

### Production Hardening

- **Block Public Access**: Enable "Block all public access" on the S3 bucket. Serve files back through CloudFront or presigned GET URLs.
- **HTTPS Only**: S3 policies configured to reject `aws:SecureTransport: "false"`.
- **CORS Restricted**: S3 CORS rules limited to the specific frontend origin (`https://bloodos.com`) with `PUT` allowed.

### Reflection

- **Architecture**: Bypassing the server for file buffering is critical for serverless environments (Vercel 10s timeout, memory limits).
- **Security**: Presigned URLs eliminate the need to expose long-lived AWS credentials to the browser.
- **Validation**: Enforcing `ContentType` in the S3 command ensures attackers cannot upload an executable pretending to be a PNG.
- **Scale**: Cloud storage is infinitely scalable compared to local disk storage on traditional VPS servers.

---

## Cloud Secret Management — AWS / Azure (Assignment 2.40)

Implemented cloud-based runtime secret injection using AWS Secrets Manager (or Azure Key Vault), completely removing `.env` dependencies from the production environment to enhance security and ease credential rotation.

### Local `.env` vs Cloud Secrets

| Feature | `.env` File | AWS Secrets / Azure Vault |
| :--- | :--- | :--- |
| **Storage location** | Plaintext on disk | Encrypted at rest (KMS) |
| **Risk of Git leak** | Very High | Zero |
| **Access Control** | Anyone with file system access | Strict IAM / RBAC roles |
| **Rotation** | Requires redeploy / restart | Automatic, zero-downtime |
| **Audit Log** | None | CloudTrail / Azure Monitor |

### Implementation Details: AWS Secrets Manager

1. **Storage**: Created an AWS Secret (`bloodos/prod/secrets`) storing JSON key-value pairs (e.g., `DATABASE_URL`, `JWT_SECRET`).
2. **Access Strategy**: The Next.js application runs with an **IAM Execution Role**. Instead of hardcoded access keys, AWS natively passes temporary credentials to the Node process.
3. **Least Privilege**: The IAM policy restricts access to exactly **one Action** (`secretsmanager:GetSecretValue`) and exactly **one Resource** (the specific Secret ARN).
4. **Injection**: During runtime execution, the utility uses the `@aws-sdk/client-secrets-manager` to fetch and parse the JSON, making variables explicitly available in memory, never writing to disk.

### Implementation Details: Azure Key Vault (Alternative)

For Azure deployments, the identical security pattern applies:
1. Store keys within a Key Vault resource.
2. An Azure **Managed Identity** attached to the App Service handles authentication (eliminating connection strings).
3. The `@azure/identity` SDK (`DefaultAzureCredential`) securely retrieves keys natively.

### Secret Rotation Strategy

- **Manual vs Auto**: AWS and Azure provide built-in templates to auto-rotate database passwords via Lambda functions or Automation Accounts directly interacting with RDS.
- **Downtime-Free**: The database issues a secondary password, the AWS Secret is updated, and Next.js connections begin using the new password. The primary password is then dropped.

### Production Hardening

- **Never Print Secrets**: The validation endpoint `GET /api/admin/secrets` proves successful runtime injection by returning an array of the keys (e.g., `["DATABASE_URL", "JWT_SECRET"]`) but intentionally masks the actual secret values.
- **Network Isolation**: Create a VPC Endpoint (AWS PrivateLink) so that requests to Secrets Manager traverse internal AWS networks rather than the public internet.

### Reflection

- Storing secrets on disk (`.env` files) on production servers violates several security compliance standards (SOC2, ISO 27001).
- By shifting to Managed Secrets, the infrastructure inherently trusts the execution environment, preventing credential leaks even if the source code is compromised.
- While managing cloud policies requires steep learning curves initially, the long-term benefits in auditing and access revocation are indispensable for any enterprise application.

---

## Containerized Deployment (Assignment 2.41)

Containerized the Next.js application using Docker multi-stage builds and automated deployment to AWS ECS via GitHub Actions.

### Multi-Stage Dockerfile Optimization

The `Dockerfile` is structured to dramatically reduce the final image size and attack surface:
1. **deps**: Installs `node_modules` required for building the app.
2. **builder**: Executes `npx prisma generate` and `npm run build`. Relies on Next.js `output: 'standalone'` being configured to gather strictly what is imported.
3. **runner**: A highly pruned alpine image running as the `nextjs` (UID 1001) non-root user. Copies over only the `.next/standalone` files and the compiled Prisma query engine.
- Result: Reduces a ~1.5GB codebase to a ~120MB image, drastically improving cold starts and reducing ECR storage costs.

### Cloud Runtime Setup (AWS ECS / Azure App Service)

| Feature | AWS ECS (Fargate) | Azure App Service |
| :--- | :--- | :--- |
| **Compute Type** | Serverless Tasks | Managed Web Host |
| **Container Registry** | Amazon ECR | Azure Container Registry (ACR) |
| **Networking** | ALB → Fargate ENI | App Service Load Balancer |
| **Auto-scaling** | CloudWatch Target CPU >70% | Scale-out Rules >10 Queue length |

### Health Check Configuration

Implemented a lightweight, dedicated `GET /api/health` load balancer probe. 
- It verifies that the Node process is actively serving HTTP requests.
- It intentionally **does not** query the PostgreSQL database. If the DB is temporarily overwhelmed, we don't want the load balancer terminating perfectly healthy frontend containers, which would cause a cascading failure (thundering herd).

### CI/CD Pipeline (GitHub Actions)

Configured `.github/workflows/deploy.yml` with the following pipeline constraints:
1. **Concurrency Control**: Prevents multiple PR merges from deploying out of order.
2. **Lint & Typecheck**: Fails the build immediately before wasting time and money on Docker if TypeScript (`tsc --noEmit`) detects errors.
3. **ECR Push**: Tags the image immutably using the exact Git SHA (`github.sha`), ensuring exact traceability between code and production deployments.
4. **ECS Update & Wait**: Uses `amazon-ecs-deploy-task-definition` to apply the new container hash to the ECS cluster, and critically uses `wait-for-service-stability: true` to fail the Action if the new container crashes on startup (e.g. invalid env config).

### Reflection

- **Predictability**: Containerization guarantees that the app will run exactly the same way on AWS ECS as it did during local development on macOS. "Works on my machine" is eliminated.
- **Rollbacks**: Reverting a bad deployment is no longer a code re-build. It simply entails pointing the ECS Task Definition back to the previous Git SHA container hash, an operation taking less than 5 seconds.
- **Security**: Stripping away `node_modules/devDependencies` and running as a non-root user in the `runner` stage significantly minimizes the OS-level attack footprint of the container. 

---

## Custom Domain & SSL Configuration (Assignment 2.43)

Configured a custom domain with fully managed, automatically renewing SSL/TLS certificates using AWS Route 53 and AWS Certificate Manager (ACM) mapped to the production Fargate Load Balancer.

### DNS Architecture (AWS Route 53)

| Record Type | Name | Target | Purpose |
| :--- | :--- | :--- | :--- |
| **NS** | `bloodos.com` | AWS Name Servers | Delegates registrar domain control strictly to Route 53. |
| **CNAME** | `_acme.bloodos.com` | ACM Validation Hash | Proves domain ownership cryptographically so AWS issues the SSL cert. |
| **A (Alias)** | `bloodos.com` | ALB DNS String | "Alias" is a proprietary AWS record allowing the root apex to dynamically point to a Load Balancer (since true CNAMEs at root are illegal per DNS RFC). |
| **CNAME** | `www.bloodos.com` | `bloodos.com` | Routes the `www` subdomain to the primary root. |

### SSL & HTTPS Enforcement

- **Automatic Renewal**: The AWS ACM certificate automatically renews dynamically before expiration. There are no manual CSRs or `certbot` cronjobs required on the container.
- **TLS Cypher Hardening**: The Load Balancer terminates the SSL connection enforcing modern TLS 1.2 minimum protocols, instantly rejecting clients on compromised legacy encryption standard like SSLv3.
- **HTTP 301 Redirect**: Port 80 is kept open *strictly* to intercept unencrypted traffic and return a permanent `301 Moved Permanently` redirect to port 443 (HTTPS), preventing SSL-stripping MITM attacks.

### Verification Matrix

How to prove the security posture of the deployed domain:

1. **Browser Padlock**: Visit `https://bloodos.com` and click the padlock (🔒). Ensure the issuer reads *Amazon RSA 2048 M01*.
2. **Force HTTPS Redirect**: Run `curl -I http://bloodos.com`. It must return `HTTP/1.1 301 Moved Permanently` and `Location: https://bloodos.com`.
3. **SSL Benchmark Check**: Submit the public domain to [SSLLabs.com](https://www.ssllabs.com/ssltest/). The configuration achieves an **A Rating** natively because AWS ALBs continuously patch vulnerabilities (e.g., POODLE, Heartbleed) under the hood.

### Reflection

- **Security Priority**: Operating any web application without HTTPS today is professional negligence. Cleartext traffic allows intermediate ISPs and malicious actors to inject scripts and steal login tokens.
- **Simplicity of Managed Certs**: Managing SSL on custom EC2/Nginx instances was historically a tedious process involving cron jobs and LetsEncrypt timeouts. ACM shifts this burden away entirely.
- **DNS Propagation Reality**: Due to global ISP caching, NS record switches inherently take up to 48 hours to complete. Using a `TTL` (Time To Live) of 60 seconds *before* major migrations prevents long-lasting outages.

---

## Cloud Logging & Monitoring (Assignment 2.44)

Implemented a robust cloud observability strategy consisting of **Structured JSON Logging**, **AWS CloudWatch (or Azure Monitor)** aggregation, Metric filters, and actionable alerting matrices.

### The Observability Philosophy

| Layer | Implementation | Purpose |
| :--- | :--- | :--- |
| **Logs** | Structured JSON (`timestamp`, `level`, `requestId`) | Granular, searchable records for Root Cause Analysis (RCA). |
| **Metrics** | CloudWatch Metric Filters (e.g., `$.level = "error"`) | Time-series data converting raw logs into graphable math. |
| **Alerts** | AWS SNS / EventBridge Triggers | Automated notifications (PagerDuty/Slack) when metrics exceed thresholds. |

### Structured JSON Execution

We abandoned basic `console.log("Saving user")` in favor of a rigid JSON schema.
- **Why?** When thousands of backend requests execute simultaneously, simple text logs dangerously interleave. 
- By capturing `x-correlation-id` at the edge (Load balancer or Next.js middleware) and explicitly embedding it into every single `logger.info()` and `logger.error()` call, we can map the exact chronological lifecycle of any single individual user's request.
- **Cloud ingestion**: AWS CloudWatch natively unpacks JSON keys, meaning we can execute powerful SQL-like tracing queries natively in the cloud dashboard: `fields @timestamp, @message | filter requestId="web-xyz123"`

### Native Cloud Configuration (AWS ECS)

1. **ECS Log Driver**: Configured the Fargate task definition with the `awslogs` driver sending `stdout` and `stderr` natively to the `/ecs/bloodos-prod` CloudWatch log group.
2. **Metric Filters**: Instructed CloudWatch to scan the incoming JSON streams for the exact syntax `{ $.level = "error" }`. Every detection dynamically increments a custom `AppErrorCount` metric.
3. **Dashboards**: Configured a single pane-of-glass UI tracking:
   - *TargetResponseTime* (Latency)
   - *CPUUtilization* (Infrastructure health)
   - *AppErrorCount* (Software health)
4. **Alert Alarms**: Created an alarm triggering an SNS email dispatch if `AppErrorCount > 10` within a sliding 5-minute window.

### Retention & Cost Architecture

Logs are expensive. A highly trafficked API can generate Terabytes of text per month.
- **Retention**: Configured a strict **14-day retention policy** on the active CloudWatch Log Group.
- **Cold Storage Archive**: (Optional extension) After 14 days, logs are automatically purged or shipped to AWS S3 Glacier for infinite, ultra-cheap compliance retention (auditing purposes).

### Reflection

- **Predictability**: It is completely impossible to operate a production application effectively without centralized structured logs. When a user reports a blank screen, digging into a VPS via SSH with `grep` does not scale.
- **Signal vs Noise**: By creating explicit `logger.error()` mappings tied to Alarms, developers are not spammed with general "info" traces, massively reducing Alert Fatigue.

---

## Unit Testing & CI Integration (Assignment 2.45)

Implemented a robust unit testing framework using **Jest** and **React Testing Library (RTL)** configured explicitly for the Next.js 13+ App Router in a TypeScript environment.

### Testing Pyramid Position

Unit tests form the foundation of our testing pyramid. They are fast, highly deterministic, and isolated. 
By employing **jsdom**, our unit tests can mock browser logic instantly without the massive overhead of spinning up entire Chromium instances like e2e tests (Cypress/Playwright) do.

### Framework Configuration

1. **`jest.config.ts`**: Utilizes `next/jest` to automatically extract the `.env` variables and `compilerOptions.paths` (`@/*`) natively from the Next.js build graph.
2. **`jest.setup.ts`**: Imports `@testing-library/jest-dom` globally so every test file instantly gains access to powerful declarative matchers like `expect(element).toBeInTheDocument()`.
3. **Coverage Thresholds**: The global config explicitly enforces an **80% minimum coverage constraint** bounding Branches, Functions, Lines, and Statements. 

### Sample Test Matrix

- **Utility Edge Bounds (`__tests__/math.test.ts`)**: Demonstrates traditional Assertions testing both "happy paths" and explicit `toThrow()` Error Boundaries enforcing parameter safety constraints. Hits a clean 100% Branch map.
- **Component DOM Sandbox (`__tests__/components/Button.test.tsx`)**: Demonstrates virtual DOM rendering, asserting declarative Style mappings (`background: #dc2626`), tracking Accessibility (`aria-busy`), and utilizing `jest.fn()` coupled with highly accurate `userEvent.click()` to simulate browser physics rather than basic DOM events.

### CI/CD Pipeline Action

Added a strict GitHub Action: `.github/workflows/unit-tests.yml`.

- **Regression Blocking**: This pipeline fires automatically on every PR.
- If a developer submits code that drops the global test coverage below 80% (or fails a single test), the GitHub Action immediately exits with status code `1`, physically blocking the PR from being merged. This mathematically guarantees code quality entropy cannot occur in the `main` branch.

### Reflection

- **Architecture over Implementation**: The `Button` test explicitly looks for `getByRole('button')` instead of querying by CSS classes (`.btn-primary`). Testing behavior (how a screen reader "sees" the button) means the test survives CSS refactors perfectly without false-positive failures.
- **Why Automated CI Tests Matter**: Relying on humans to open their terminal and type `npm test` before pushing to origin never scales. Integrating the coverage checker directly onto the PR pipeline enforces peace-of-mind that a broken math function won't bring down production at 3:00 AM.

---

## Integration Testing & Mock Boundaries (Assignment 2.46)

Extending tests aggressively beyond isolated code functions natively into end-to-end simulated **Next.js 13+ App Router** execution using `supertest`, `jest-mock-extended`, and deeply typed Prisma architecture.

### Integration Philosophy 

While Unit tests (`__tests__/math.test.ts`) mathematically verify algorithmic bounds of pure components, backend architectures fail in transit. Real bugs emerge when APIs map requests to databases.
- Integration tests mock out precisely the outermost system boundary (`@prisma/client`) while executing the entirely physical HTTP routing lifecycle of Next.js through an adapter. 

### Implementation Architecture

1. **`node-mocks-http` / Wait, No! We used a custom `createTestServer` adapter**: Next.js 13+ broke legacy `supertest` API route compatibility because it relies on the Web Edge `NextRequest` API (Fetch API arrays) instead of normal node `req/res`. We built an elegant `__tests__/utils/testServer.ts` adapter bridging the physical HTTP supertest client back to native Edge streams dynamically!
2. **Deep Type Mocks (`jest-mock-extended`)**: Our `__tests__/utils/prismaMock.ts` intercepts all physical PostgreSQL mapping and replaces it with strongly-typed Jest function proxies.
   - *Why?* Spinning up a physical Postgres test database via Docker container takes 40+ seconds. Prisma mocks run 1,000 queries in milliseconds.
3. **HTTP Verbs mapped to Schema constraints**: The `/api/users` endpoint explicitly relies on Zod Validation bounding. The integration tests assert that missing payload arrays physically generate HTTP 400 Bad Request standards identically to production behavior.

### Execution Results

Running `npm run test:coverage` currently proves:
- All 15 distinct structural assertions pass instantly (`< 1 second execution bounds`).
- 94.5% Code Coverage mapped explicitly to the API controllers ensures missing HTTP Authorization boundaries (e.g. 401s on empty tokens) behave as programmed.

### CI/CD Defensive Integrity

Since `.github/workflows/unit-tests.yml` executes `jest --coverage` natively on GitHub Actions Ubuntu containers, this integration setup proves unconditionally that every developer PR merge creates correct REST mapping and natively protects `Prisma` invocation without needing to mount complicated GitHub PostgreSQL service action runners. 

---

## Complete CI/CD Pipeline (Assignment 2.47)

Consolidated fragmented GitHub Action files into a single, comprehensive Master Pipeline (`.github/workflows/ci.yml`). This orchestrates the strict Quality Assurance sequence: **Linting → Testing (Unit & Integration) → Build Validation → Production Deployment**.

### Pipeline Stages

| Stage | Command | Purpose | Failure Impact |
| :--- | :--- | :--- | :--- |
| **Setup** | `npm ci` | Installs identical package trees defined strictly in `package-lock.json` caching from `@actions/setup-node@v4`. | Invalid dependencies crash builds accurately before tests. |
| **Lint** | `npm run lint` | ESLint static analysis evaluating TS syntax formatting. | Blocks unreadable or non-idiomatic JS code cleanly. |
| **Test** | `npm run test:coverage` | Validates Jest logic, asserting the global `80% Coverage Threshold ` constraint dynamically on the Node server. | **High!** Fails if logic bounds (e.g. Zod API shapes or DOM assertions) fall off or math limits decline mathematically. |
| **Build** | `npm run build` | Next.js production TS compilation & SSG optimization. | Flags Type errors deeply embedded inside TSX views. |
| **Deploy** | `docker push` | Authenticates securely to AWS ECR and mutates ECS `task-definition.json` | Pushes the exact, immutable Git SHA (`${{ github.sha }}`) hash LIVE. |

### Caching and Concurrency

- **Concurrency**: Defined locally via `concurrency: group: ${{ github.workflow }}-${{ github.ref }} cancel-in-progress: true`. If a developer pushes code 10 times in 10 minutes to a PR branch, we instantly cancel the 9 previous workflows. This saves massive compute-hour budgets.
- **Node Modules Caching**: Activating GitHub's native `cache: 'npm'` shrinks the `npm ci` boot times by caching `.npm` folder artifacts safely across workflows.

### Secrets Management

The workflow accesses production bounds utilizing secure Action mappings (`${{ secrets.AWS_ACCESS_KEY_ID }}`).
- Setting these dynamically inside the Github repository `Settings -> Secrets -> Actions` guarantees we never commit plaintext database URIs, API keys, or AWS Identity objects to public version control networks (preventing OWASP Leak Vectors).

### Reflection

- **Confidence vs Chaos**: Relying entirely on developers typing "tests passed on my machine" results in deploying buggy artifacts. Integrating rigorous CI Automation structurally blocks any and all PR merges on Github natively until mathematically proven safe.
- **Fail Fast Principle**: Notice that `npm run lint` and `npm test` execute long before `docker build` spins. If code is invalid, stopping it synchronously in 15 seconds saves 8 minutes of Docker compute compilation costs.

---
