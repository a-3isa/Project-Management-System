# Project Management System Backend

A robust backend API built with NestJS for managing projects, tasks, users, and comments. This application provides a complete project management solution with authentication, email verification, and role-based access control.

## Description

This is a NestJS-based backend application that serves as the API for a project management system. It allows users to create and manage projects, assign tasks, add comments, and collaborate effectively. The system includes user authentication with JWT tokens, email verification via OTP, and password reset functionality.

## Features

- **User Management**: User registration, login, email verification, and password reset
- **Project Management**: Create, update, delete projects and manage project members
- **Task Management**: Create and manage tasks within projects
- **Comment System**: Add comments to tasks for collaboration
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Email Integration**: OTP verification and password reset via email
- **Database Integration**: PostgreSQL with TypeORM for data persistence

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT, Passport
- **Email Service**: @nestjs-modules/mailer with Pug templates
- **Validation**: class-validator, class-transformer
- **Testing**: Jest
- **Linting**: ESLint
- **Code Formatting**: Prettier

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/a-3isa/Project-Management-System
   cd project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Setup

1. **Database Setup**:
   - Ensure PostgreSQL is installed and running
   - Create a database named `project-management-system`

2. **Environment Variables**:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     PORT=3000
     JWT_SECRET=your_jwt_secret_here
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

3. **Email Configuration**:
   - The email service is configured using environment variables
   - Templates are stored in the `templates/` directory (create if not exists)
   - Update the SMTP credentials in `.env` if using a different email service

## Running the Application

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

The application will start on `http://localhost:3000` by default.

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user (Admin only)
- `POST /auth/verify-otp` - Verify email with OTP
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

### Users

- `GET /users/me` - Get current user info
- `GET /users` - Get all users
- `GET /users/:id/tasks` - Get tasks for a specific user
- `DELETE /users/:id` - Delete a user

### Projects

- `POST /projects/create` - Create a new project
- `POST /projects/:id/add-user/:userId` - Add user to project
- `POST /projects/:projectId/tasks` - Add task to project
- `GET /projects` - Get all projects
- `GET /projects/:id` - Get project by ID
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Tasks

- `GET /tasks/:id` - Get task by ID
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `POST /tasks/:taskId/comments` - Add comment to task
- `GET /tasks/:taskId/comments` - Get comments for task

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

```
src/
├── app.controller.ts      # Main app controller
├── app.module.ts          # Main app module
├── app.service.ts         # Main app service
├── auth/                  # Authentication module
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── dto/
│   ├── entities/
│   └── jwt.strategy.ts
├── user/                  # User management module
│   ├── user.controller.ts
│   ├── user.module.ts
│   ├── user.service.ts
│   ├── dto/
│   └── entities/
├── project/               # Project management module
│   ├── project.controller.ts
│   ├── project.module.ts
│   ├── project.service.ts
│   ├── dto/
│   └── entities/
├── task/                  # Task management module
│   ├── task.controller.ts
│   ├── task.module.ts
│   ├── task.service.ts
│   ├── dto/
│   └── entities/
└── comment/               # Comment module
    ├── comment.controller.ts
    ├── comment.module.ts
    ├── comment.service.ts
    ├── dto/
    └── entities/
```

## Database Schema

The application uses the following main entities:

- **User**: Stores user information, authentication data, and relationships
- **Project**: Represents projects with title and associated users/tasks
- **Task**: Individual tasks within projects with assignments and comments
- **Comment**: Comments on tasks for collaboration

## License

This project is licensed under the UNLICENSED license.
