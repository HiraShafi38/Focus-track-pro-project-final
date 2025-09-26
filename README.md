# TaskMaster

TaskMaster is a full-stack task manager with email/password authentication, JWT-based sessions, and a clean, responsive UI. Create, list, complete, and delete tasks with categories — all backed by MongoDB Atlas.

---

## ✨ Features

* Email + password auth (register, login, current user)
* JWT stored in `localStorage`, automatically attached to API calls
* Protected routes (only authenticated users can access `/app`)
* Create / list / update / delete tasks
* Categories & simple progress stats
* Responsive layout with a persistent sidebar on desktop and a slide-over on mobile
* Type-safe frontend & backend (TypeScript)

---

## 🧱 Tech Stack

### Frontend

* React 18 + TypeScript
* Vite
* React Router v6+
* Tailwind CSS + your design system components

### Backend

* Node.js + Express (TypeScript)
* MongoDB Atlas (Mongoose)
* JWT (`jsonwebtoken`)
* Helmet, CORS, cookie-parser (security & middleware)

### Dev & Build

* `ts-node-dev` (backend dev)
* `tsc` (backend build)
* ESLint (optional), Prettier (optional)

### Deployment (suggested)

* Frontend → Vercel
* Backend → Render / Railway / Fly.io / any Node host

---

## 📁 Project Structure

```
TaskMaster/
├─ src/                     # Frontend (Vite React)
│  ├─ components/           # UI components (auth, tasks, layout)
│  ├─ context/              # AuthContext, TaskContext
│  ├─ pages/                # Index, Auth, Dashboard, NotFound
│  ├─ services/             # api.ts, auth.ts, tasks.ts
│  ├─ index.css
│  ├─ main.tsx
│  └─ App.tsx
├─ .env.development         # Frontend env (VITE_API_URL=...)
├─ server/                  # Backend (Express + TS)
│  ├─ src/
│  │  ├─ config/            # db.ts (Mongo connection)
│  │  ├─ middleware/        # auth.ts, error.ts
│  │  ├─ models/            # User.ts, Task.ts
│  │  ├─ routes/            # auth.route.ts, tasks.route.ts, health.route.ts
│  │  ├─ utils/             # jwt.ts
│  │  └─ index.ts           # Express app entry
│  ├─ .env                  # Backend env (PORT, MONGODB_URI, ...)
│  ├─ .env.example          # Backend env template (no secrets)
│  ├─ tsconfig.json
│  └─ package.json
├─ README.md
├─ package.json             # Frontend package.json
└─ vite.config.ts
```

> **Important:** All backend imports use **relative** paths (e.g., `./config/db`) so the code is portable on any machine.

---

## ⚙️ Environment Variables

### Frontend (`/.env.development`)

```ini
VITE_API_URL=http://localhost:5000
```

### Backend (`/server/.env`)

Create it from `/server/.env.example` and fill in real values:

```ini
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<dbname>?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:8080
JWT_SECRET=<a-strong-random-string>
JWT_EXPIRES_IN=7d
```

> **Never commit real secrets.** Keep `/server/.env` out of git; use `.env.example` for placeholders.

---

## 🧑‍💻 Local Development

### 1) Backend

```bash
cd server
cp .env.example .env      # fill in values
npm install
npm run dev               # starts Express on http://localhost:5000
```

Expected:

```
✅ MongoDB connected
🚀 API on http://localhost:5000
```

Optional quick check:

```bash
# Health
curl http://localhost:5000/api/health
# -> {"ok":true,"service":"task-master-api"}
```

### 2) Frontend

From the project root:

```bash
# If you keep a template:
cp .env.example .env.development

# Ensure it contains:
# VITE_API_URL=http://localhost:5000

npm install
npm run dev              # starts Vite on http://localhost:8080
```

Open **[http://localhost:8080](http://localhost:8080)**

* Go to `/auth?mode=register` → register → redirected to `/app`
* Create/complete/delete tasks; the sidebar is persistent on desktop and slide-over on mobile

---

## 🔐 Authentication Flow

* On register/login, the server issues a JWT.
* The frontend stores it in `localStorage` under key `tm_jwt`.
* `src/services/api.ts` attaches `Authorization: Bearer <token>` to every request.
* Protected routes (`/app`) check auth context and redirect to `/auth` if unauthenticated.

---

## 🔌 REST API (summary)

**Base URL (local):** `http://localhost:5000/api`

### Auth

* **POST** `/auth/register`
  Body:

  ```json
  { "email": "a@b.com", "password": "secret123", "name": "Alex" }
  ```
* **POST** `/auth/login`
  Body:

  ```json
  { "email": "a@b.com", "password": "secret123" }
  ```
* **GET** `/auth/me` *(requires `Authorization: Bearer <token>`)*
  Returns current user payload.

### Tasks *(all require `Authorization: Bearer <jwt>`)*

* **GET** `/tasks?page=1&limit=50`
* **POST** `/tasks`
  Body:

  ```json
  { "title": "Buy groceries", "description": "milk, bread", "category": "Personal" }
  ```
* **PATCH** `/tasks/:id`
  Body: partial updates, e.g.

  ```json
  { "status": "done" }
  ```
* **DELETE** `/tasks/:id`

**Example (PowerShell):**

```powershell
# Login
$body = @{ email="test@example.com"; password="Passw0rd!" } | ConvertTo-Json
$resp = Invoke-RestMethod -Method Post -Uri http://127.0.0.1:5000/api/auth/login -Body $body -ContentType "application/json"
$token = $resp.token

# Create a task
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:5000/api/tasks `
  -Headers @{ Authorization = "Bearer $token" } `
  -Body (@{ title="Read a book"; description="" } | ConvertTo-Json) `
  -ContentType "application/json"
```

---

## 🧪 NPM Scripts

### Frontend (root)

* `npm run dev` – start Vite dev server
* `npm run build` – production build
* `npm run preview` – preview production build

### Backend (`/server`)

* `npm run dev` – start with ts-node-dev (auto-reload)
* `npm run build` – compile to `dist/`
* `npm start` – run compiled server (`node dist/index.js`)

---

## 🚀 Deployment (suggested)

### Backend (Render / Railway / etc.)

1. Create a new Node service.
2. Set env vars from `/server/.env.example`.
3. **Build command:** `npm install && npm run build`
   **Start command:** `npm start`
4. Note your public API URL, e.g. `https://taskmaster-api.onrender.com`.

### Frontend (Vercel)

1. Import the repo in Vercel.
2. Set **Environment Variable**:
   `VITE_API_URL=https://taskmaster-api.onrender.com`
3. Deploy.

### CORS

Set `CORS_ORIGIN` in the backend to your frontend’s deployed URL
(e.g. `https://taskmaster.vercel.app`).

---

## 🛠 Troubleshooting

* **Blank page after login/registration**
  Make sure you navigate to `/app` (not `/dashboard`). Ensure `tm_jwt` exists in Local Storage.

* **401 Unauthorized / “Missing Bearer token”**
  You opened the API URL directly in a browser tab (no headers). Use the app or include the `Authorization: Bearer` token.

* **`useTaskContext` must be used within a `TaskProvider`**
  Ensure `main.tsx` wraps `<App />` with both `<AuthProvider>` and `<TaskProvider>`.

* **CORS errors**
  Check `CORS_ORIGIN` in `/server/.env` matches your frontend origin exactly.

* **Mongo auth failed**
  Double-check Atlas user, password (URL-encode if it has special chars), and IP allowlist.

---

## 🧭 Design Notes

* The dashboard shows a **persistent left sidebar** on desktop and a **slide-over** on mobile (toggle: “Menu” button).
* No UI/markup changes are required to work with the backend; all wiring is done in services/context.

---

## 📄 License

MIT © 2025 TaskMaster Contributors

---

## 🙌 Acknowledgements

Thanks to the React, Vite, Express, and MongoDB communities for the excellent tooling.
