# NestJS User & Document Management App

This is a modular, production-ready NestJS backend application for **user authentication**, **role-based access**, and **document management**, with full support for unit tests, environment configs, and Docker deployment.

---

## ✅ Features

- JWT-based authentication
- Role-based access (`admin`, `editor`, `viewer`)
- User CRUD and role management (admin only)
- Document upload, list, download, and delete
- Ingestion trigger API for downstream processing
- Unit test coverage for all core modules
- Environment-based config support (`.env.*`)
- Dockerized for local/CI/CD deployment

---

## 🛠️ Setup Instructions

### 1. Clone the repo and install dependencies
```bash
git clone <repo-url>
cd NestJs-UserManagement_App
npm install
```

### 2. Environment Configuration
Create one of the following in the root:

```bash
.env           # default fallback
.env.dev       # development config
.env.stage     # staging config
.env.prod      # production config
```

Example `.env.dev`:
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=devSecret
DB_HOST=localhost
```

---

## 🚀 Running the App

### Run with default `.env`
```bash
npm run start
```

### Run with specific profile:
```bash
NODE_ENV=development npm run start
NODE_ENV=stage npm run start
NODE_ENV=production npm run start
```

---

## 🧪 Running Tests & Viewing Coverage

### Run unit tests:
```bash
npm run test
```

### Run with coverage report:
```bash
npm run test:cov
```

Output HTML coverage: `coverage/lcov-report/index.html`

---

## 🏗️ Project Structure (Architecture)

```
src/
├── auth/           # Auth controller, service, JWT, guards, roles
├── users/          # User entity, service, controller
├── documents/      # Document entity, upload/download logic
├── common/         # Shared decorators, guards, utils (optional)
├── app.module.ts   # Root application module
```

### Key Design Choices
- Follows modular NestJS architecture
- Business logic split into services
- DTO validation via `class-validator`
- Config service for environment-specific setups
- Guards for clean auth & role enforcement
- Tests are isolated with mocked dependencies

---

### 🏁 Run with Docker
```bash
docker-compose up --build
```

---

## 📬 API Postman Collection
You can test APIs like:
- `POST /auth/register`
- `POST /auth/login`
- `GET /users`
- `PATCH /users/:id/role`
- `POST /documents/upload`
- `GET /documents`
- `GET /documents/:id/download`
- `DELETE /documents/:id`
- `POST /documents/:id/ingest`


---

## ✅ Final Notes
- Modular, testable, maintainable codebase
- Easy to extend with microservices or queues (SQS, Kafka)
- Ready for CI/CD integration and cloud deployment