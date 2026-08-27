# Production-Grade CRM & Business Operations Platform

A full-stack, production-ready MERN MVP designed to handle authentication, lead generation, client conversion pipelines, and dashboard statistical analytics.

## Tech Stack
* **Frontend:** React (JSX) built with Vite, styled with Tailwind CSS, requests via Axios.
* **Backend:** Node.js, Express.js architecture pattern.
* **Database:** MongoDB (Mongoose ORM).
* **Security:** bcryptjs (password hashing), jsonwebtoken (JWT).

---

## Prerequisites
Before you begin, ensure you have the following installed:
* **Node.js** (v16.0 or higher)
* **MongoDB** (Local instance or an Atlas cluster URI)

---

## 1. Environment Configuration

### Backend Setup
Navigate to the `backend` folder and ensure your `.env` file looks like this:
```env
# backend/.env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/crm-mvp
JWT_SECRET=super_secret_jwt_key_here_for_crm
```
*(Change the `MONGO_URI` if you are using an external Atlas cluster).*

### Frontend Setup
Navigate to the `frontend` folder and ensure your `.env` file looks like this:
```env
# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

---

## 2. Installation & Running Locally

Because this is a decoupled architecture, you will need to run the **Backend** and the **Frontend** in two separate terminal windows.

### Terminal 1: Start the Backend (Express Server)
```bash
cd backend
npm install
npm run dev
```
*If everything is configured correctly, you will see:*
>`MongoDB Connected: 127.0.0.1` 
> `Server running on port 5000`

### Terminal 2: Start the Frontend (Vite Client)
```bash
cd frontend
npm install
npm run dev
```
*This will spin up a local development server, typically available at `http://localhost:3000` or `http://localhost:5173`.*

---

## 3. Project Structure
```text
├── backend/
│   ├── src/
│   │   ├── config/          # DB Connection Logic
│   │   ├── controllers/     # Business API Logic (Auth, Leads, Clients, Dashboard)
│   │   ├── middleware/      # JWT Protection & Global Error Handlers
│   │   ├── models/          # Mongoose Schemas (User, Lead, Client)
│   │   └── routes/          # Express Routers
│   ├── .env
│   ├── server.js            # Entry Point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI (Navbar)
    │   ├── context/         # React AuthContext State Flow
    │   ├── pages/           # Views (Login, Dashboard, Leads, Clients)
    │   ├── App.jsx          # Route Definitions
    │   └── main.jsx
    ├── .env
    ├── tailwind.config.js   
    └── package.json
```

## 4. Usage Flow
1. Open the frontend in your browser.
2. Click **Register** mapped on the login page to create either a "sales" or "admin" account.
3. Access the **Leads** menu, and add a few test leads.
4. Click **Convert Client** to automatically migrate a qualified lead into the permanent Client Directory.
5. Track your overall business volumes on the **Dashboard**.
