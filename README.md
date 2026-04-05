# Parcel Pickup Scheduler

A full-stack MERN application that allows customers to book parcel pickup slots and admins to manage slots and bookings.

---

## Public URL

**http://13.239.140.67:3000**

---

## Demo Credentials

### Customer Account
| Field | Value |
|-------|-------|
| Phone | `0499999001` |
| Password | `Test1234` |

### Admin Account
| Field | Value |
|-------|-------|
| Admin ID | `N12544591` |
| Work Email | `n12544591@qut.edu.au` |
| Password | `Admin1234` |

> To create/reset the admin account, run: `cd backend && node scripts/seedAdmin.js`

---

## Features

### Customer
- Register and log in (via phone or email)
- Browse available pickup slots
- Create, view, edit, and cancel bookings
- Track booking status
- Manage profile and delete account

### Admin
- Log in with Admin ID + work email
- Dashboard with booking/slot statistics
- Create, edit, and delete pickup slots
- View, update, and delete all customer bookings
- Filter bookings by status (Confirmed / Cancelled)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (7-day expiry), bcrypt |
| Process Manager | PM2 |
| Deployment | EC2 (Express serves frontend + API on port 3000) |
| CI/CD | GitHub Actions (self-hosted runner) |

---

## Project Setup

### Prerequisites
- Node.js v18+
- npm
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the repository

```bash
git clone <your-github-repo-url>
cd Parcel-Pickup-Scheduler
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/Parcel-Pickup-Scheduler
JWT_SECRET=<your-jwt-secret>
PORT=3000
```

Start the backend:

```bash
npm start          # production
npm run dev        # development (nodemon)
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm start          # development server on port 3000
npm run build      # production build
```

### 4. Run both together (from root)

```bash
npm install
npm run dev        # starts backend (nodemon) + frontend (react-scripts) concurrently
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/customer/register` | Register new customer |
| POST | `/api/auth/customer/login` | Customer login (phone or email) |
| POST | `/api/auth/admin/login` | Admin login (adminId + email) |
| GET | `/api/auth/profile` | Get current user profile |
| PUT | `/api/auth/profile` | Update profile |
| DELETE | `/api/auth/profile` | Delete account |

### Customer Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings` | Get my bookings (optional `?status=`) |
| GET | `/api/bookings/:id` | Get booking by ID |
| PUT | `/api/bookings/:id` | Update booking |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking |
| GET | `/api/bookings/track/:bookingId` | Track by booking number |

### Slots (customer read)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/slots` | Get all slots (authenticated) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/bookings` | All bookings (optional `?status=`) |
| GET | `/api/admin/bookings/:id` | Get booking by ID |
| PATCH | `/api/admin/bookings/:id` | Update booking |
| DELETE | `/api/admin/bookings/:id` | Delete booking |
| GET | `/api/admin/slots` | All slots |
| POST | `/api/admin/slots` | Create slot |
| PATCH | `/api/admin/slots/:id` | Update slot |
| DELETE | `/api/admin/slots/:id` | Delete slot |
| DELETE | `/api/admin/account` | Delete admin account |

---

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`) triggers on every push to `main`:

1. Checkout code
2. Install backend dependencies
3. Run backend tests (Mocha + Chai + Sinon)
4. Install frontend dependencies and build (`npm run build`)
5. Write `.env` from GitHub Secrets (`PROD` secret)
6. Restart PM2 backend (serves both API and frontend on port 3000)

### Required GitHub Secrets
| Secret | Description |
|--------|-------------|
| `PROD` | Full content of `backend/.env` |
| `MONGO_URI` | MongoDB connection string (used in tests) |
| `JWT_SECRET` | JWT signing secret (used in tests) |
| `PORT` | Backend port (used in tests) |

---

## Deployment Architecture (EC2)

```
Internet
   │
   ▼
PM2: backend (port 3000)
   ├── /api/...   → Express API routes
   └── /*         → React build (static files)
```

---

## Running Tests

```bash
cd backend
npm test
```

Tests cover: Auth controller (register success, register error) — using Mocha, Chai, and Sinon stubs (no real DB required).

---

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production — CI/CD deploys from here |
| `appfeatures` | Feature development branch |

Pull requests are used to merge feature branches into `main`.
