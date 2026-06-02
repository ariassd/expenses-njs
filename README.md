![](assets/header.png)

# Expenses Micro Service

A RESTful microservice for managing expenses, built with **NestJS**, **TypeORM**, and **PostgreSQL**. This service provides CRUD operations for expense records with filtering, pagination, and status management capabilities.

## Features

- **Create** new expense records with validation
- **List** expenses with pagination and search filtering
- **Retrieve** single expense by ID
- **Update** expense status with business rules validation
- **Search** across multiple fields (id, amount, description, status, category)
- **Pagination** support with configurable page size and sort order

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Validation**: class-validator

## Project Setup

```bash
# Install dependencies
$ npm install
```

## Compile and Run

```bash
# Development mode (with hot-reload)
$ npm run start:dev

# Production build
$ npm run build

# Production mode
$ npm run start:prod
```

## Configuration (.env)

Create a `.env` file in the project root with the following variables:

```env

# Database Connection String (alternative to individual settings)
# DATABASE_URL=postgresql://postgres:your_password@localhost:5432/expenses_db

# Application Configuration
NODE_ENV=development
PORT=3000

CURRENCIES=EUR,USD,CRC

# TypeORM Configuration
TYPEORM_SYNCHRONIZE=true
TYPEORM_LOGGING=true
```

### Environment Variables Description

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | No | - | Full connection string (overrides individual DB_* settings) |
| `NODE_ENV` | No | development | Environment mode (development, production, test) |
| `PORT` | No | 3000 | HTTP server port |
| `TYPEORM_SYNCHRONIZE` | No | false | Auto-create database tables (for development only) |
| `TYPEORM_LOGGING` | No | false | Enable TypeORM query logging |

## API Documentation

### Base URL
```
http://localhost:3000/v1/expenses
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/` | Create a new expense |
| `GET` | `/` | List all expenses with pagination and filtering |
| `GET` | `/:id` | Get a single expense by ID |
| `PUT` | `/:id/status` | Update expense status |

### Query Parameters for List Endpoint

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `queryFilter` | string | No | - | Search term (matches id, amount, description, status, category) |
| `pagination.page` | number | No | 1 | Page number |
| `pagination.limit` | number | No | 25 | Items per page |
| `pagination.sort` | enum | No | asc | Sort order (asc/desc) |

### Example Requests

**List expenses with pagination:**
```bash
curl -X GET "http://localhost:3000/v1/expenses?pagination.page=1&pagination.limit=10&pagination.sort=desc"
```

**Search expenses:**
```bash
curl -X GET "http://localhost:3000/v1/expenses?queryFilter=food"
```

**Combined search and pagination:**
```bash
curl -X GET "http://localhost:3000/v1/expenses?queryFilter=travel&pagination.page=2&pagination.limit=50"
```

## Project Structure

```
expenses/
├── src/
│   ├── expenses.controller.ts    # Route handlers
│   ├── expenses.service.ts       # Business logic
│   ├── expenses.module.ts        # Module configuration
│   ├── expenses.entity.ts        # TypeORM entity
│   └── dto/
│       ├── expenses-create.dto.ts
│       ├── expenses-update-status.dto.ts
│       ├── list-filter.dto.ts    # Filter and pagination DTO
│       ├── pagination.dto.ts     # Pagination configuration
│       └── pagination-result.dto.ts
├── .env                         # Environment configuration
└── README.md
```

## Running Tests

```bash
# Unit tests
$ npm run test

# E2E tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

## Database Schema

The `expenses` table contains the following columns:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `amount` | Integer | Expense amount |
| `category` | VARCHAR(100) | Expense category |
| `description` | VARCHAR(500) | Detailed description |
| `status` | VARCHAR(20) | Current status (pending, approved, rejected, voided) |
| `date` | TIMESTAMPTZ | Creation timestamp |

## Stay in Touch

- **Author**: Luis Arias
- **Email**: [ariassd@gmail.com](mailto:ariassd@gmail.com)
- **GitHub**: [@ariassd](https://github.com/ariassd)

## License

This project is **open source** and licensed under the [MIT License](LICENSE).

![](assets/MIT.png) ![](assets/open-source.png)

---

&copy; 2026 Luis Arias. All rights reserved.
