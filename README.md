# Todo Tracker

A full-stack todo management application built with **Next.js 16** (App Router) frontend and **Express.js + Sequelize** backend.

## Overview

**Todo Tracker** is a simple yet feature-rich task management application that demonstrates best practices in full-stack web development. Users can create, read, update (toggle completion status), and delete todos with a clean, responsive UI and robust API.

### Key Features
- ✅ Create, read, update, delete (CRUD) todos
- 🏷️ Optional todo descriptions
- ✔️ Toggle completion status with real-time updates
- 🔍 Filter todos by status (All, Open, Done)
- 📊 Real-time statistics (total, completed, open counts)
- 🎨 Responsive design with Tailwind CSS
- ⚡ Built with Next.js App Router and React Hooks
- 🔒 Input validation and comprehensive error handling
- 📡 RESTful API with SQLite persistence

---

## Repository Structure

```
todo-tracker/
├── backend/                    # Express.js API server
│   ├── config/                # Database configuration
│   ├── migrations/            # Sequelize database migrations
│   │   └── 20260304160318-create-todo.js
│   ├── models/                # Sequelize models
│   │   ├── index.js
│   │   └── todo.js            # Todo model definition
│   ├── package.json
│   └── server.js              # Express application entry point
│
└── frontend/                   # Next.js application
    ├── app/                   # App Router pages and layouts
    ├── public/                # Static assets
    ├── package.json
    └── tsconfig.json          # TypeScript configuration
```

**GitHub Repository**: **https://github.com/TegarWitjaksono/Foom_TakeHomeTest_TodoTracker**
- Contains both `backend/` and `frontend/` folders
- Sequelize models in `backend/models/`
- Sequelize migrations in `backend/migrations/`
- Full Next.js App Router application in `frontend/app/`

---

## How to Run the Project

### Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed on your system.

### Local Setup (Single Machine)

#### 1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend (in a new terminal)
cd frontend
npm install
```

#### 2. Start the Backend Server
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000` and serve the API at `/todos`.

#### 3. Start the Frontend Development Server
```bash
cd frontend
npm run dev
```
Open `http://localhost:3000` in your browser.

### Network Setup (Multiple Devices)

To access the application from another device on the same network:

1. **Find your local IP address** (Windows):
   ```powershell
   ipconfig
   ```
   Look for the IPv4 Address (e.g., `192.168.1.10`)

2. **Start the backend** on your machine:
   ```bash
   cd backend
   npm run dev
   ```

3. **Set the API URL for frontend** and start it:
   ```powershell
   # Windows PowerShell
   $env:NEXT_PUBLIC_API_URL = "http://YOUR_LOCAL_IP:5000"
   
   cd frontend
   npm run dev -- --hostname 0.0.0.0
   # or: npm run dev -- --hostname 0.0.0.0 --port 3000
   ```

4. **Access from another device**:
   ```
   http://YOUR_LOCAL_IP:3000
   ```

5. **Firewall Configuration**:
   Ensure Windows Firewall allows:
   - Port 3000 (Frontend)
   - Port 5000 (Backend API)

---

## API Specification

The backend provides the following REST endpoints:

### `GET /todos`
Retrieves all todos, sorted by creation date (newest first).
- **Response**: Array of todo objects
- **Example**:
  ```json
  [
    {
      "id": 1,
      "title": "Learn Next.js",
      "description": "Master App Router",
      "completed": false,
      "createdAt": "2026-03-05T10:00:00Z",
      "updatedAt": "2026-03-05T10:00:00Z"
    }
  ]
  ```

### `POST /todos`
Creates a new todo.
- **Request Body**:
  ```json
  {
    "title": "string (required)",
    "description": "string or null (optional)"
  }
  ```
- **Validation**: Title is required and must not be empty
- **Response**: 201 Created with the new todo object
- **Error Handling**: Returns 400 if title is missing, 500 on server error

### `PUT /todos/:id`
Updates a specific todo (commonly used to toggle completion status).
- **Request Body**:
  ```json
  {
    "completed": boolean
  }
  ```
- **Response**: Updated todo object
- **Error Handling**: Returns 404 if todo not found, 500 on server error

### `DELETE /todos/:id`
Deletes a specific todo.
- **Response**: Confirmation message
- **Error Handling**: Returns 404 if todo not found, 500 on server error

---

## Design Decisions

### Architecture
- **Frontend-Backend Separation**: Clean separation of concerns with React handling UI and Express handling business logic
- **Next.js App Router**: Modern file-based routing system for better organization and performance
- **Client-Side Rendering**: Used "use client" directive for interactive components, allowing efficient state management with React Hooks

### State Management
- **React Hooks**: Lightweight state management using `useState` for simplicity and code clarity
- **Memoization**: `useMemo` used for filtered todos list and statistics to prevent unnecessary recalculations
- **Loading & Error States**: Explicit state management for loading, error, and busy states to provide user feedback

### Data Persistence
- **SQLite Database**: Lightweight, file-based database suitable for this project scope
- **Sequelize ORM**: Provides type-safe database operations and easy schema management
- **Migrations**: Database schema version control with Sequelize migrations

### API Design
- **RESTful Conventions**: Standard HTTP methods (GET, POST, PUT, DELETE) for clarity
- **Proper Status Codes**: 201 for creation, 404 for not found, 400 for validation errors
- **Stateless Operations**: Each request is independent, no server-side sessions needed

### Validation & Error Handling
- **Frontend Validation**: Input trimming and client-side checks before submission
- **Backend Validation**: Required field checks on the server
- **Error Messages**: User-friendly error messages passed to frontend for display
- **Try-Catch Blocks**: Comprehensive error handling in async operations

### Styling
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Responsive Design**: Mobile-first approach ensuring usability across devices

---

## Possible Improvements

### Short-term Enhancements
1. **Form Validation Enhancements**
   - Add description character limit validation
   - Implement regex patterns for better title validation
   - Show real-time validation feedback

2. **Optimistic Updates**
   - Update UI immediately on user action, sync with server in background
   - Rollback on error for better perceived performance

3. **Pagination**
   - Implement pagination for large todo lists
   - Load todos in batches to improve performance

4. **Sorting & Filtering**
   - Add sorting by creation date, completion status, or title
   - Search functionality by title or description

### Medium-term Features
1. **User Authentication**
   - JWT-based authentication for multi-user support
   - User-specific todo lists with privacy controls

2. **Database Improvements**
   - Add unique constraints and indexes for optimization
   - Implement soft deletes for data recovery

3. **API Enhancements**
   - Implement batch operations (delete multiple todos)
   - Add partial updates with PATCH method
   - Request rate limiting for API protection

4. **Testing**
   - Unit tests for React components using Jest/React Testing Library
   - API endpoint tests with SuperTest
   - End-to-end tests with Playwright

### Long-term Scalability
1. **Caching**
   - Implement Redis for frequently accessed data
   - Add browser caching strategies

2. **Performance Optimization**
   - Add request debouncing for rapid operations
   - Implement compression for API responses

3. **Monitoring & Logging**
   - Add structured logging (Winston, Pino)
   - Error tracking with services like Sentry
   - Performance monitoring

4. **Advanced Features**
   - Recurring todos (daily, weekly, monthly)
   - Todo priorities and categories
   - Collaboration features (sharing, assigning)
   - Export/import functionality (CSV, JSON)
   - Dark mode support

5. **Deployment**
   - Containerize with Docker for consistent environments
   - CI/CD pipeline with GitHub Actions
   - Deploy to cloud platforms (Vercel for frontend, Heroku/Railway for backend)

---

## Technology Stack

### Frontend
- **Next.js 16.1.6**: React framework with App Router
- **React 19.2.3**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS 4**: Utility-first styling
- **ESLint**: Code quality maintenance

### Backend
- **Express.js 5.2.1**: Web framework
- **Sequelize 6.37.7**: ORM for database operations
- **SQLite 3**: Lightweight database
- **CORS**: Cross-origin resource sharing
- **nodemon**: Development server auto-reload
- **Sequelize CLI**: Database migration management

---

## Project Structure

```
todo-tracker/
├── backend/
│   ├── config/
│   │   └── config.json          # Database configuration
│   ├── migrations/
│   │   └── 20260304160318-create-todo.js  # Schema migration
│   ├── models/
│   │   ├── index.js             # Model initialization
│   │   └── todo.js              # Todo model definition
│   ├── package.json
│   ├── server.js                # Express server setup
│   └── database.sqlite          # SQLite database file
│
└── frontend/
    ├── app/
    │   ├── globals.css          # Global styles
    │   ├── layout.tsx           # Root layout
    │   ├── page.tsx             # Home page (main component)
    │   └── favicon.ico
    ├── public/                  # Static assets
    ├── package.json
    ├── tsconfig.json            # TypeScript configuration
    ├── tailwind.config.mjs       # Tailwind configuration
    ├── postcss.config.mjs        # PostCSS configuration
    └── eslint.config.mjs         # ESLint configuration
```

---

## Code Quality

### Frontend Code Clarity
- **Type Safety**: Full TypeScript implementation with proper type definitions
- **Component Organization**: Single main component with clear separation of concerns
- **Hook Usage**: Following React best practices with `useState`, `useEffect`, and `useMemo`
- **Error Handling**: Comprehensive try-catch blocks with user-friendly error messages
- **State Management**: Clear, predictable state updates using React Hooks

### Backend API Correctness
- **RESTful Design**: Proper use of HTTP methods and status codes
- **Error Handling**: Try-catch blocks with appropriate error responses
- **CORS Configuration**: Enabled for cross-origin requests
- **Request Parsing**: Express middleware for JSON request body parsing

### Validation & Error Handling
- **Frontend**: Input trimming and null checks before submission
- **Backend**: Required field validation with appropriate HTTP status codes
- **Database Operations**: Async/await with error catching
- **User Feedback**: Clear error messages displayed to users

---

## Development Workflow

### Commit Messages
Follow conventional commit format for clear version control:
- `feat:` New features
- `fix:` Bug fixes
- `refactor:` Code refactoring
- `docs:` Documentation updates
- `test:` Test additions

### Running in Development
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

### Building for Production
```bash
# Backend: Just run with node
cd backend && npm start

# Frontend: Build Next.js app
cd frontend && npm run build && npm start
```

---

## Troubleshooting

### Backend connection errors
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify CORS is enabled in backend

### Database errors
- Delete `database.sqlite` and restart backend to reset data
- Run migrations: `npx sequelize-cli db:migrate`

### Port already in use
- Change port: `npm run dev -- --port 3001` (frontend)
- Kill process: `netstat -ano | findstr :5000` (Windows)
- Satu sumber API (`NEXT_PUBLIC_API_URL`) agar mudah dipindah lingkungan.
- UI fokus pada keterbacaan dan feedback status (loading, error, empty state).

## Validasi & Error Handling
- Frontend memvalidasi title tidak boleh kosong sebelum submit.
- Backend mengembalikan `400` jika title kosong dan `404` bila ID tidak ditemukan.
- Error API ditampilkan ke pengguna pada form.

## Next.js App Router
- `app/layout.tsx` untuk font dan metadata.
- `app/page.tsx` sebagai client component (interaksi dan fetch).
- `app/globals.css` untuk tema global.

## Kemungkinan Peningkatan
- Optimistic UI dengan rollback untuk pengalaman lebih cepat.
- Pagination atau virtual list untuk data besar.
- Filtering dan sorting dari backend (query params).
- Unit test untuk API dan komponen UI.

## Catatan Version Control
- Workspace ini belum menyertakan commit terstruktur.
- Rekomendasi commit: `feat(frontend): build todo UI and API integration`, `chore(ui): refine styling and typography`

