# CoreERP — Integrated Enterprise ERP SaaS Platform

> **"One Platform. Every Business Process. One Source of Truth."**

CoreERP is an enterprise-grade multi-tenant Enterprise Resource Planning (ERP) platform unifying finance, general ledger, sales, CRM, procurement, inventory, warehouse management, manufacturing, HR, payroll, projects, asset management, workflows, customer support, and reporting.

---

## Dependencies

Before running CoreERP locally, ensure you have the following prerequisites installed:

- **Java JDK**: Version 21 (Eclipse Temurin / OpenJDK)
- **Node.js**: Version 20+ and npm
- **Maven**: Version 3.9+
- **Docker & Docker Compose**: Version 24+
- **PostgreSQL**: Version 16 (handled via Docker or local installation)
- **Redis**: Version 7.2 (handled via Docker or local installation)
- **Apache Kafka**: Version 7.6 (handled via Docker or local installation)

---

## Installation

Clone the repository and install dependencies for all modules:

```bash
# Clone the repository
git clone https://github.com/GaddamVasavi/CORE-ERP.git
cd CORE-ERP

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Download backend dependencies
cd backend
mvn dependency:go-offline
cd ..
```

---

## Build

Compile and build both frontend and backend modules:

```bash
# Build the complete system using root script
npm run build

# Or build individually:
# 1. Build Backend JAR
cd backend
mvn clean package -DskipTests
cd ..

# 2. Build Frontend static assets
cd frontend
npm run build
cd ..

# 3. Build Docker container images
docker build -f Dockerfile -t coreerp:latest .
docker-compose build
```

---

## Run

Run CoreERP using Docker Compose or native local services:

### Option 1: Docker Compose (Recommended)

```bash
# Start all services (Database, Redis, Kafka, Backend, Frontend, Nginx)
docker-compose up -d

# Verify running containers
docker-compose ps

# View service logs
docker-compose logs -f
```

### Option 2: Native Local Development

```bash
# Terminal 1: Start PostgreSQL and Redis (e.g. via Docker)
docker-compose up postgres redis kafka -d

# Terminal 2: Run Spring Boot Backend
cd backend
mvn spring-boot:run

# Terminal 3: Run Vite Frontend
cd frontend
npm run dev
```

---

## Usage

Once running, access the enterprise portals at:

- **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000) (or [http://localhost](http://localhost))
- **REST API Endpoints**: [http://localhost:8080/api/v1](http://localhost:8080/api/v1)
- **Swagger / OpenAPI Interactive UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **Spring Boot Actuator Health**: [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)

### Default Super Administrator Credentials
- **Email**: `admin@coreerp.com`
- **Password**: `Admin@CoreERP2026!`
- **Tenant Subdomain**: `hq`

---

## Testing

Execute automated unit, integration, and E2E test suites:

```bash
# Run backend JUnit & Mockito tests
cd backend
mvn test

# Run frontend E2E Playwright tests
cd frontend
npx playwright test
```
