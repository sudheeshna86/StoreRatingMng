# StoreRating

A full-stack store rating application with role-based dashboards for Admin, Store Owner, and User. Built with a Node.js + Express + PostgreSQL backend and a React + Vite + Tailwind CSS frontend.

---

## 🔗 Project Overview

StoreRating enables:
- Users to browse stores, submit and update ratings
- Store owners to view store ratings and customer feedback
- Admins to manage users and stores with pagination and role-based access

This repository contains two main parts:
- `backend/` — Node.js Express API with PostgreSQL
- `Frontend/` — React web app with Tailwind CSS and React Router

---

## 🎬 Demo Video

- Add a demo video link here to showcase the app flow.
- Example: `https://youtube.com/...` or a screen recording link.

---

## 🚀 Key Features

- JWT authentication with login/register
- Password change for authenticated users
- Role-based dashboard routing for `ADMIN`, `STORE_OWNER`, and `USER`
- Secure protected routes for each role
- Admin user management with pagination and user creation
- Admin store management with pagination and store creation
- Store owner dashboard and rating report
- User store browsing, rating submission, and rating updates
- Tailwind CSS styling with responsive layout

---

## 🧠 Technical Stack

### Frontend
- React 19
- Vite
- Tailwind CSS 4
- React Router DOM v7
- Axios
- JWT auth persisted in `localStorage`

### Backend
- Node.js
- Express.js
- PostgreSQL
- `pg` database driver
- JWT authentication
- `bcryptjs` password hashing
- `express-validator` validation
- `dotenv` environment variables
- `cors`, `helmet`, `morgan`

---

## 📁 Folder Structure

```
StoreRating/
├── backend/
│   ├── src/
│   │   ├── config/          # DB configuration
│   │   ├── controllers/     # Route handlers
│   │   ├── middlewares/     # Auth, validation, error handling
│   │   ├── routes/          # Express routing
│   │   ├── services/        # Business logic and DB queries
│   │   ├── utils/           # Helpers and token generation
│   │   ├── validators/      # Request validators
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server startup
│   ├── package.json
│   └── .env.example?
├── Frontend/
│   ├── src/
│   │   ├── api/             # Axios wrappers
│   │   ├── components/      # Shared UI components
│   │   ├── context/         # Auth context
│   │   ├── pages/           # App pages
│   │   ├── utils/           # Local storage helpers
│   │   ├── App.jsx          # Route and layout config
│   │   ├── main.jsx         # App entry point
│   │   ├── index.css        # Tailwind import
│   │   └── App.css          # app-specific styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

---

## 🧩 Available Pages

### Public
- `/` — Landing page
- `/login` — Login page
- `/register` — Register page

### Admin
- `/admin/dashboard` — Admin metrics
- `/admin/users` — User management
- `/admin/stores` — Store management

### Store Owner
- `/owner/dashboard` — Store owner summary
- `/owner/ratings` — Ratings report

### User
- `/user/stores` — Store list and rating action

---

## 🔧 Backend API Endpoints

### Auth
- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — login and retrieve JWT token
- `PUT /api/auth/change-password` — authenticated password update

### Admin
- `GET /api/admin/dashboard` — admin stats
- `GET /api/admin/users` — list users with pagination
- `POST /api/admin/users` — create user
- `GET /api/admin/users/:id` — user details
- `GET /api/admin/stores` — list stores with pagination
- `POST /api/admin/stores` — create a store
- `GET /api/admin/stores/:id` — store details

### Owner
- `GET /api/owner/dashboard` — store owner dashboard
- `GET /api/owner/ratings` — ratings list for owner’s store

### User/Store Rating
- `GET /api/stores` — browse stores
- `POST /api/stores/:storeId/rating` — submit rating
- `PUT /api/stores/:storeId/rating` — update rating

---

## 🎯 Role-Based Behavior

### Admin
- Manage users and stores
- View admin dashboard stats
- Create new users and assign roles

### Store Owner
- View store performance
- See ratings from users

### User
- Browse stores
- Submit a new rating
- Update existing rating

---

## ⚙️ Environment Variables

Create `.env` files for backend and optionally frontend.

### Backend `.env`

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=postgres
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Setup Instructions

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env    # or create .env manually
npm run dev
```

The backend starts on `http://localhost:5000` by default.

### 2. Frontend

```bash
cd Frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:5173` by default.

---

## ✅ How to Use

1. Start PostgreSQL and configure `.env`
2. Run backend server
3. Run frontend app
4. Register or login
5. Use dashboards based on your role

---

## 🎯 Role-Based Behavior

### Admin
- Manage users and stores
- View admin dashboard stats
- Create new users and assign roles

### Store Owner
- View store performance
- See ratings from users

### User
- Browse stores
- Submit a new rating
- Update existing rating

---

## 📸 Postman Screenshots

### 1. Auth APIs

#### `POST /api/auth/register`

*Request and response screenshot*:



#### `POST /api/auth/login`

*Request and response screenshot*:



---

### 2. Admin APIs

#### `GET /api/admin/dashboard`

*Request and response screenshot*:



#### `GET /api/admin/users`

*Request and response screenshot*:



#### `POST /api/admin/users`

*Request and response screenshot*:



#### `GET /api/admin/stores`

*Request and response screenshot*:



#### `POST /api/admin/stores`

*Request and response screenshot*:



---

### 3. Owner APIs

#### `GET /api/owner/dashboard`

*Request and response screenshot*:



#### `GET /api/owner/ratings`

*Request and response screenshot*:



---

### 4. User / Store Rating APIs

#### `GET /api/stores`

*Request and response screenshot*:



#### `POST /api/stores/:storeId/rating`

*Request and response screenshot*:



#### `PUT /api/stores/:storeId/rating`

*Request and response screenshot*:



---

## ✅ Notes

- Auth token is stored in frontend `localStorage`
- API client injects JWT token automatically on protected calls
- Backend routes use middleware for authentication and role authorization
- User stores page supports both rating submission and updates

---

## 📦 Dependencies

### Backend
- `express`
- `pg`
- `jsonwebtoken`
- `bcryptjs`
- `express-validator`
- `dotenv`
- `cors`
- `helmet`
- `morgan`
- `nodemon`

### Frontend
- `react`
- `react-dom`
- `react-router-dom`
- `axios`
- `tailwindcss`
- `@tailwindcss/postcss`
- `vite`

---

##  Contact

This README is written for the StoreRating project in this repository. If you want, I can also add a `project demo` section, `schema overview`, or `seed data steps`.
