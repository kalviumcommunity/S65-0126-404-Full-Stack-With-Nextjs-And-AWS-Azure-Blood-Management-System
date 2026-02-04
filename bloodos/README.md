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

![BloodOS running locally](./ScreenShot.png)

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

## 📄 License

This project is developed for educational and simulated work purposes only.