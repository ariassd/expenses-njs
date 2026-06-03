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
- **Aggregations** - Track expense counts and totals by client, category, year, month, and currency

## Tech Stack

- **Runtime**: Node.js 26+
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Validation**: class-validator
- **Documentation**: Swagger

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
| `DATABASE_URL` | Yes | - | Full connection string |
| `NODE_ENV` | No | development | Environment mode (development, production, test) |
| `PORT` | No | 3000 | HTTP server port |
| `TYPEORM_SYNCHRONIZE` | No | false | Auto-create database tables (for development only) |
| `TYPEORM_LOGGING` | No | false | Enable TypeORM query logging |

## API Documentation

You can find OpenAPI/Swagger documentation in the `./api-docs` folder. The documentation includes:
- `swagger-spec.json` - OpenAPI specification in JSON format
- `swagger-spec.yml` - OpenAPI specification in YAML format

To update the documentation, run:
```bash
npm run gen-docs
```

This script generates the documentation files based on the current API routes and decorators.




## Base URL
```
http://localhost:3000/v1/expenses
```

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

## Running Tests

```bash
# Unit tests
$ npm run test

# E2E tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```


## Stay in Touch

**Author**: Luis Arias | [@ariassd](https://github.com/ariassd)

## License

This project is **open source** and licensed under the [MIT License](LICENSE).

![](assets/MIT.png) ![](assets/open-source.png)

---

&copy; 2026 Luis Arias. All rights reserved.
