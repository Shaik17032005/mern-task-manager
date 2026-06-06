<<<<<<< HEAD
# Taskflow - Premium MERN Task Management Application

Taskflow is a fully responsive, secure, and beautiful Task Management web application developed using the MERN stack (MongoDB, Express.js, React.js, Node.js). It features a premium, responsive glassmorphism Dark Mode UI, secure JWT-based authentication, and full CRUD operations with title search, status filters, and page pagination.

---

## Key Features

1. **Secure Authentication**:
   - Register new user accounts and log in securely.
   - Credentials are encrypted on the backend (BcryptJS).
   - Session management uses JSON Web Tokens (JWT) stored in the browser's `localStorage` and sent via headers.
2. **Database Fallback Mode**:
   - If a local MongoDB instance is not active, the backend automatically boots into **Fallback Database Mode**, persisting your accounts and tasks inside a local JSON file (`backend/data/db.json`). This ensures the app is immediately evaluable out-of-the-box!
3. **Comprehensive Task Management**:
   - Create, edit, and delete tasks.
   - Quick-toggle task completion status using checkbox controls.
   - Filter tasks by status (All, Pending, Completed).
   - Search tasks in real-time by title or description.
4. **Premium Responsive UX/UI**:
   - Styled using modern CSS, fluid layouts, HSL colors, and smooth fade/slide micro-animations.
   - Displays real-time summary statistics cards (Total, Pending, Completed).
   - Dynamically checks the backend API status to indicate whether it connects to MongoDB or is operating in local JSON mode.

---

## Tech Stack

* **Frontend**: React (Vite), Lucide Icons, Vanilla CSS
* **Backend**: Node.js, Express.js, JWT, BcryptJS
* **Database**: MongoDB (Mongoose) with a local JSON file database fallback.
* **Orchestration**: Concurrently (runs frontend & backend simultaneously)

---

## Directory Structure

```text
mern-task-manager/
├── backend/
│   ├── config/          # DB connection configurations
│   ├── controllers/     # Route logic handlers (auth, tasks)
│   ├── data/            # Fallback JSON database file storage
│   ├── middleware/      # JWT route protection middleware
│   ├── models/          # Mongoose schema definitions
│   ├── routes/          # API route definitions
│   └── services/        # Service layer (manages data routing between Mongoose/JSON)
├── frontend/
│   ├── src/
│   │   ├── components/  # React views (Login, Register, Dashboard, TaskModal)
│   │   ├── App.jsx      # Navigation, session verification and routing
│   │   ├── api.js       # Backend fetch integrations and token manager
│   │   ├── index.css    # Premium glassmorphic design and CSS styling
│   │   └── main.jsx     # App entrypoint
│   └── index.html       # Entry template & SEO tags
└── package.json         # Root manager scripts
=======
.3..33333
# 🚀 TaskFlow - MERN Stack Task Management Application

TaskFlow is a full-stack Task Management Web Application built using the MERN Stack (MongoDB, Express.js, React.js, and Node.js). It allows users to securely manage their daily tasks with authentication, task tracking, and a clean, responsive user interface.

---

## 📌 Features

### 🔐 Authentication
- User Registration
- User Login
- JWT-Based Authentication
- Protected Routes

### ✅ Task Management
- Create Tasks
- View All Tasks
- Update Existing Tasks
- Delete Tasks
- Mark Tasks as Completed or Pending

### 🎨 User Interface
- Responsive Design
- Clean Dashboard Layout
- React Functional Components
- React Hooks for State Management

### ⚙️ Backend Features
- RESTful API Architecture
- Secure Authentication with JWT
- MongoDB Database Integration
- Error Handling and Validation

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- Mongoose

### Database
- MongoDB Atlas

---

## 📂 Project Structure

```bash
mern-task-manager/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── data/
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
>>>>>>> ce8a6b5138e3880819f6ce781711e8b5ce8b9f3c
```

---

<<<<<<< HEAD
## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+) and `npm` installed.

### 1. Clone & Set Up Directory
Navigate to the root project folder:
```bash
cd C:\Users\shaik\.gemini\antigravity\scratch\mern-task-manager
```

### 2. Install Dependencies
Run the install command from the root folder. This automatically installs dependencies for the root orchestrator, backend server, and frontend client:
```bash
npm run install-all
```

### 3. Environment Variables
Verify or edit configuration in the `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/taskmanager
JWT_SECRET=supersecretjwtkey123!@#taskmanagementapp
```
*(No configuration is required for fallback mode. The server will launch immediately using `backend/data/db.json` if MongoDB is offline).*

### 4. Run the Application
Run both servers concurrently using the root command:
```bash
npm run dev
```

* **Frontend Client**: Runs on `http://localhost:5173`
* **Backend Express Server**: Runs on `http://localhost:5000`
* **Health Endpoint**: View connection state at `http://localhost:5000/api/health`

---

## API Endpoints Summary

### Authentication Routes (Public & Protected)
* `POST /api/auth/register` - Create a new user profile.
* `POST /api/auth/login` - Authenticate user credentials and return a token.
* `GET /api/auth/me` - Retrieve current user profile (Requires Authorization header).

### Task Routes (All Protected)
* `GET /api/tasks` - Retrieve tasks. Supports query options:
  - `search` (string)
  - `status` ('all' | 'pending' | 'completed')
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
* `POST /api/tasks` - Create a new task (body: `title`, `description`).
* `PUT /api/tasks/:id` - Update an existing task (body: `title`, `description`, `status`).
* `DELETE /api/tasks/:id` - Delete a task.
=======
## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/Shaik17032005/mern-task-manager
cd mern-task-manager
```

### Install Dependencies

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

---

## 🔑 Environment Variables


## ▶️ Running the Application

### Start Backend

```bash
npm run dev --prefix backend
```

### Start Frontend

```bash
npm run dev --prefix frontend
```

Application URLs:

```text
Frontend: http://localhost:5173
Backend : http://localhost:5000
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|----------|------------|-------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |

### Tasks

| Method | Endpoint | Description |
|----------|------------|-------------|
| GET | /api/tasks | Get All Tasks |
| POST | /api/tasks | Create Task |
| PUT | /api/tasks/:id | Update Task |
| DELETE | /api/tasks/:id | Delete Task |
| PATCH | /api/tasks/:id | Toggle Task Status |

---



## 🎯 Learning Outcomes

- MERN Stack Development
- JWT Authentication
- REST API Design
- MongoDB Integration
- React Hooks & State Management
- Full-Stack Application Architecture

---

## 👨‍💻 Author

**Shaik Imran**

- GitHub: https://github.com/Shaik17032005
- LinkedIn:  https://www.linkedin.com/in/shaik-imran1703

---

## ⭐ Project Highlights

- Full-Stack MERN Application
- Secure JWT Authentication
- CRUD Operations
- Responsive User Interface
- Industry Standard Folder Structure
- Internship Assignment Ready

If you found this project useful, consider giving it a ⭐ on GitHub.
>>>>>>> ce8a6b5138e3880819f6ce781711e8b5ce8b9f3c
