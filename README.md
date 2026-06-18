![](assets/header.png)

# Expenses Micro Service

A RESTful microservice for managing expenses, built with **NestJS**, **TypeORM**, **PostgreSQL**, and **RabbitMQ**. This service provides CRUD operations for expense records with filtering, pagination, and status management capabilities.

## Features

- **Create** new expense records with validation
- **List** expenses with pagination and search filtering
- **Retrieve** single expense by ID
- **Update** expense status with business rules validation
- **Event Messages** Create and update expenses asynchronously via RabbitMQ
- **Search** across multiple fields (id, amount, description, status, category)
- **Pagination** support with configurable page size and sort order
- **Aggregations** - Track expense counts and totals by client, category, year, month, and currency

## Tech Stack

- **Runtime**: Node.js 26+
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Message Broker**: RabbitMQ
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
# Database Configuration
# DATABASE_URL=postgresql://postgres:your_password@localhost:5432/expenses_db

# Application Configuration
NODE_ENV=development
PORT=3000

# Currency Configuration
CURRENCIES=EUR,USD,CRC

# RabbitMQ Configuration
AMQP_URI=amqp://localhost:5672
AMQP_EXCHANGE=my_company
AMQP_REGISTER_EXPENSES_QUEUE=com.my_company.expenses
AMQP_REGISTER_EXPENSES_ROUTING_KEY=com.my_company.expenses.register_expenses
AMQP_UPDATE_EXPENSES_STATUS_QUEUE=com.my_company.expenses
AMQP_UPDATE_EXPENSES_STATUS_ROUTING_KEY=com.my_company.expenses.update_expenses_status

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
| `CURRENCIES` | No | - | Comma-separated list of valid ISO 4217 currency codes (e.g., USD,EUR,CRC) |
| `AMQP_URI` | Yes | - | RabbitMQ connection URI (e.g., amqp://user:pass@localhost:5672) |
| `AMQP_EXCHANGE` | No | my_company | RabbitMQ exchange name |
| `AMQP_REGISTER_EXPENSES_QUEUE` | No | com.my_company.expenses. | Queue for expense registration messages |
| `AMQP_REGISTER_EXPENSES_ROUTING_KEY` | No | com.my_company.expenses.register_expenses | Routing key for expense registration |
| `AMQP_UPDATE_EXPENSES_STATUS_QUEUE` | No | com.my_company.expenses. | Queue for expense status update messages |
| `AMQP_UPDATE_EXPENSES_STATUS_ROUTING_KEY` | No | com.my_company.expenses.update_expenses_status | Routing key for status updates |
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
