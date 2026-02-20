# Architecture Overview

This document acts as an explicit index charting the systems, data models, and deployment constraints comprising the **Blood Management System**.

## A) System Overview

The project is built entirely strictly atop a **Next.js 13+ App Router** execution environment acting concurrently as both the SSR/React User Interface and the monolithic Node.js Backend JSON REST API.

- **Frontend Layer**: React 18, TailwindCSS styling mappings natively handled securely through Server Components limiting standard client JS bundle limits.
- **API Layer**: Route Handlers (`route.ts`) bridging HTTP mapping validation securely via `Zod` validation boundaries.
- **Database Layer**: Migrated from simple local SQLite footprints onto strictly managed remote **PostgreSQL**, physically governed structurally by the **Prisma ORM** mapping tool executing Type-Safe limits.
- **Storage Layer**: Blob assets (e.g., identity verification cards) interact via pre-signed URL mappings strictly communicating to **AWS S3** buckets or mirroring Azure Blob counterparts.
- **CI/CD Layer**: Exclusively driven structurally by **GitHub Actions** executing matrix stages (`Lint`, `Test`, `Build`) directly triggering multi-stage highly compressed **Docker** artifacts.

---

## B) Directory Structure

```text
src/
 ┣ app/                 # Next.js 13 App Router UI and API execution contexts (e.g. /api/users)
 ┣ components/          # Re-usable strict React physical boundaries mapping Tailwind metrics 
 ┣ lib/                 # Core server architecture hooks (e.g. prisma singleton, AWS wrappers)
 ┣ services/            # Business mapping abstraction (e.g., Blood Request constraint filters)
 ┣ config/              # Centralized configuration extraction rules mapping `.env` boundaries
 ┣ __tests__/           # Universal Jest unit suites extending Jest-DOM bounds
 ┣ __smoke_tests__/     # Production network assertions catching Dead Next.js containers natively
 ┗ utils/               # Pure algorithmic data mappers devoid of React constraints
```

---

## C) Data Flow Lifecycle

> Example: Creating a Blood Donation Profile 

1. **User (Frontend):** Submits the physically typed mapping constraint form bridging `components/ClientForm.tsx`.
2. **Next.js Edge (API Route):** `POST /api/users` natively parses the physical JSON stream directly interpreting the structural bounds against strict **Zod** schema validations.
3. **Database Layer:** The Edge runtime delegates physically to `Prisma Client` which safely serializes the `INSERT` metric translating natively to PostgreSQL arrays.
4. **Response Hook:** The database responds `201 Created` returning the execution `UUID` back physically mapping up to the Client which renders a "Success" HTML toast.

### Core Security Lifecycle
All requests querying structurally restricted DB assets inherently trigger a middleware boundary parsing the `Authorization: Bearer <x>` header ensuring strict local JWT verification mapping prior to physical DB arrays connecting.

---

## D) Deployment Architecture

The application strictly refuses manual SFTP deployments entirely in favor of an automated containerized CD pipeline.

- **Docker Container**: A custom Multi-Stage alpine execution context reduces deployment sizes physically down by $>85\%$, abandoning entirely massive `/node_modules` and simply relying natively on `.next/standalone`.
- **Orchestration (AWS ECS Fargate):** The resulting immutable `SHA`-tagged container physically spins natively mapping across AWS VPC clusters dynamically auto-scaling RAM structurally. 
- **Database**: The Application queries natively securely via remote `DATABASE_URL` injections mapping physically to **AWS RDS (PostgreSQL)** structures.
- **Secret Automation**: Structural `.env` secrets never exist inside Github Source Code arrays—they exist securely strictly mapped inside `Github Action Secrets` seamlessly rendering mapping onto ECS execution environment variables.

---

## E) Security Overview

1. **JWT & Context Authorization**: The boundaries actively reject payload structures absent of cryptographically validated structural hashes blocking completely native IDOR leaks.
2. **HTTPS Constraints**: All Cloud Load Balancers enforce absolute structural `443` bindings rejecting `80` traffic completely safely mapping ALBs securely.
3. **Password Salting**: Native `Bcrypt` 12-round execution mapping entirely ensures user plaintext boundaries strictly never exist inside the Postgres mappings natively at rest safely protecting leaks.
4. **Input Sanitization**: `Zod` inherently guards `Prisma` natively rejecting structurally mapping SQL injections preventing strings from acting natively as executable statements!
