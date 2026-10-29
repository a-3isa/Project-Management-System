# Project Management System API

A NestJS backend for managing projects, tasks and task comments, with JWT authentication, role-based access, and email OTP verification and password reset.

## Features

- **Users**: admin-created registration, email verification by OTP, login, password reset
- **Projects**: create, update, delete, and add members
- **Tasks**: create tasks inside projects, assign them, list a user's tasks
- **Comments**: discuss tasks
- **Security**: JWT + Passport, role-based guards, DTO validation (class-validator)
- **Email**: OTP and reset mails via `@nestjs-modules/mailer` with Pug templates

## Tech stack

NestJS, TypeScript, PostgreSQL, TypeORM, Passport/JWT, Nodemailer (Pug templates), Jest, ESLint, Prettier.

## Getting started

Prerequisites: Node.js 18+, PostgreSQL, an SMTP account (Mailtrap works for development).

```bash
git clone https://github.com/a-3isa/Project-Management-System
cd Project-Management-System
npm install
```

Create a database named `project-management-system`, then add a `.env` file in the project root:

```env
PORT=3000
JWT_SECRET=change-me
JWT_EXPIRES_IN=3600
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=project-management-system
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mail_user
MAIL_PASS=your_mail_pass
MAIL_FROM=noreply@yourapp.com
```

```bash
npm run start:dev                      # development
npm run build && npm run start:prod    # production
```

The API runs on `http://localhost:3000`.

## API

**Auth**
- `POST /auth/register` register a user (admin only)
- `POST /auth/verify-otp` verify email with OTP
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

**Users**
- `GET /users/me`, `GET /users`, `GET /users/:id/tasks`, `DELETE /users/:id`

**Projects**
- `POST /projects/create`, `GET /projects`, `GET /projects/:id`, `PATCH /projects/:id`, `DELETE /projects/:id`
- `POST /projects/:id/add-user/:userId`
- `POST /projects/:projectId/tasks`

**Tasks and comments**
- `GET|PATCH|DELETE /tasks/:id`
- `POST|GET /tasks/:taskId/comments`

## Structure

```
src/
  auth/      login, OTP, password reset, JWT strategy
  user/      user entity and endpoints
  project/   projects and membership
  task/      tasks
  comment/   task comments
```

Entities: User, Project, Task, Comment.

## Testing

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## License

UNLICENSED.
