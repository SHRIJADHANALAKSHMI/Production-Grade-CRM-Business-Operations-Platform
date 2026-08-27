# CRM Pro — Production Sales & Lead Management Platform

> A full-stack, production-grade CRM SaaS application built for modern sales teams. Manage leads, track conversions, and gain real-time business insights through an enterprise-quality dashboard.

---

## 🌟 Features

| Module | Capabilities |
|---|---|
| **Authentication** | JWT-based login/register, Role-Based Access Control (Admin, Sales) |
| **Leads Pipeline** | Create, search, filter, paginate, inline status update, convert to client |
| **Client Directory** | Card grid view, converted-from-lead tracking |
| **Dashboard** | Live analytics, Leads vs Conversions area chart, Sales Funnel, activity feed |
| **Security** | Rate limiting on auth routes, locked CORS, input validation, JWT guard |
| **UX** | Toast notifications, loading skeletons, empty states, responsive layout |

---

## 🛠 Tech Stack

**Frontend**
- React 18 (JSX)
- Vite
- Tailwind CSS
- Recharts
- Axios + Interceptors
- React Router v6
- React Hot Toast
- Lucide React

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Token (JWT)
- express-validator
- express-rate-limit
- Morgan (logging)
- bcryptjs

---

## 📁 Project Structure

```
crm-mvp/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   ├── server.js
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/   (Sidebar, Navbar, Layout)
    │   │   └── ui/       (Badge, Button, PageHeader)
    │   ├── context/      (AuthContext)
    │   ├── pages/        (Dashboard, Leads, Clients, Login, Register)
    │   └── services/     (api.js)
    ├── index.html
    └── vite.config.js
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd crm-mvp
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env     # Fill in your values
npm install
npm run dev
```

**Required `.env` variables:**
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/crm
JWT_SECRET=your_long_random_secret_here
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd frontend
cp .env.example .env     # Fill in your values
npm install
npm run dev
```

**Required `.env` variables:**
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔑 API Endpoints

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login + get JWT |
| GET | `/api/leads` | Private | Get all leads |
| POST | `/api/leads` | Private | Create a lead |
| PATCH | `/api/leads/:id` | Private | Update lead |
| DELETE | `/api/leads/:id` | Admin | Delete lead |
| POST | `/api/leads/:id/convert` | Private | Convert to client |
| PATCH | `/api/leads/:id/assign` | Private | Reassign lead |
| GET | `/api/clients` | Private | Get all clients |
| DELETE | `/api/clients/:id` | Admin | Remove client |
| GET | `/api/dashboard` | Private | Get analytics |
| GET | `/api/users` | Admin | List all users |

---

## 🔐 Roles & Permissions

| Action | Sales | Admin |
|---|---|---|
| View Leads / Clients | ✅ | ✅ |
| Create / Update Lead | ✅ | ✅ |
| Convert Lead | ✅ | ✅ |
| Delete Lead | ❌ | ✅ |
| Delete Client | ❌ | ✅ |
| View All Users | ❌ | ✅ |

---

## 🚀 Deployment

**Frontend → Vercel**
1. Push `frontend/` to GitHub
2. Import into Vercel
3. Set `VITE_API_URL` as environment variable

**Backend → Render**
1. Push `backend/` to GitHub
2. Create a **Web Service** on Render
3. Set all `.env` variables in Render dashboard
4. Start command: `node server.js`

---

## 📄 License

MIT — Built for production use. Feel free to extend and deploy.

---

*Built with ⚡ using the MERN stack | Production-grade SaaS CRM*
