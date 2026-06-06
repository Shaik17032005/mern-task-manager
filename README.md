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
```

---

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
