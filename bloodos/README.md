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

## 📄 License

This project is developed for educational and simulated work purposes only.