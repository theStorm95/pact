# Quick Start Guide: Backend API Setup

**Feature**: Backend API and Database Setup  
**Branch**: `003-backend-api-setup`  
**Time to Complete**: 15-20 minutes

## Prerequisites

Before you begin, ensure you have:

- [x] Node.js 18+ installed (`node --version`)
- [x] pnpm installed (`pnpm --version`)
- [x] PostgreSQL 17+ running (Railway or Docker)
- [x] Git repository cloned locally
- [x] Monorepo structure exists from Story 1.1 and 1.2

## Step 1: Create Backend Application (5 minutes)

Navigate to the apps directory and scaffold NestJS project:

```bash
cd /Users/nate/projects/pact/apps

# Create NestJS application with pnpm
npx @nestjs/cli new backend --package-manager pnpm --skip-git

# Return to project root
cd ..
```

**Expected Output**: New `apps/backend` directory with NestJS project structure.

## Step 2: Configure Monorepo Integration (2 minutes)

Verify the backend app is included in the workspace. Check `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

Install dependencies from project root:

```bash
pnpm install
```

**Expected Output**: Dependencies installed, `node_modules` created in `apps/backend`.

## Step 3: Install Prisma (3 minutes)

From the backend directory:

```bash
cd apps/backend

# Install Prisma CLI and Client
pnpm add -D prisma
pnpm add @prisma/client

# Initialize Prisma
npx prisma init
```

**Expected Output**:

- `prisma/schema.prisma` file created
- `.env` file created with `DATABASE_URL` placeholder

## Step 4: Configure Database Connection (2 minutes)

### Option A: Railway (Production/Cloud)

1. Create Railway project at [railway.app](https://railway.app)
2. Add PostgreSQL database service
3. Copy `DATABASE_URL` from Railway dashboard
4. Update `apps/backend/.env`:

```env
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"
PORT=3000
NODE_ENV=development
```

### Option B: Local Docker (Development)

Create `docker-compose.yml` in project root:

```yaml
version: "3.8"
services:
  postgres:
    image: postgres:17
    environment:
      POSTGRES_USER: pactuser
      POSTGRES_PASSWORD: pactpass
      POSTGRES_DB: pactdb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Start PostgreSQL:

```bash
docker-compose up -d
```

Update `apps/backend/.env`:

```env
DATABASE_URL="postgresql://pactuser:pactpass@localhost:5432/pactdb"
PORT=3000
NODE_ENV=development
```

**Verify Connection**:

```bash
cd apps/backend
npx prisma db pull
```

Should connect successfully (may show "introspected 0 models").

## Step 5: Define User Model (3 minutes)

Edit `apps/backend/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String   @map("password_hash")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@map("users")
  @@index([createdAt], name: "idx_users_created_at")
}
```

## Step 6: Create and Run Migration (2 minutes)

```bash
cd apps/backend

# Create initial migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

**Expected Output**:

- Migration file created in `prisma/migrations/`
- `users` table created in database
- Prisma Client generated with TypeScript types

**Verify Migration**:

```bash
npx prisma studio
```

Opens Prisma Studio in browser - you should see the `users` table (empty).

## Step 7: Create Prisma Module (3 minutes)

Create `apps/backend/src/prisma/prisma.service.ts`:

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

Create `apps/backend/src/prisma/prisma.module.ts`:

```typescript
import { Module, Global } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

## Step 8: Implement Health Check (5 minutes)

Update `apps/backend/src/app.controller.ts`:

```typescript
import { Controller, Get, HttpStatus, HttpException } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("health")
  async getHealth() {
    try {
      // Verify database connection
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: "ok",
        timestamp: new Date().toISOString(),
        database: "connected",
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: "Database connection failed",
          timestamp: new Date().toISOString(),
          path: "/health",
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
```

Update `apps/backend/src/app.module.ts`:

```typescript
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
})
export class AppModule {}
```

## Step 9: Configure Global Exception Filter (3 minutes)

Create `apps/backend/src/filters/http-exception.filter.ts`:

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : "Internal server error";

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

Update `apps/backend/src/main.ts`:

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS for web app
  app.enableCors({
    origin: "http://localhost:5173",
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Backend API running at http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
}
bootstrap();
```

## Step 10: Start and Test (2 minutes)

From `apps/backend`:

```bash
pnpm run start:dev
```

**Expected Output**:

```
Backend API running at http://localhost:3000
Health check: http://localhost:3000/health
```

**Test Health Endpoint**:

```bash
curl http://localhost:3000/health
```

**Expected Response**:

```json
{
  "status": "ok",
  "timestamp": "2026-01-04T12:00:00.000Z",
  "database": "connected"
}
```

## Verification Checklist

- [ ] Backend starts without errors
- [ ] Health endpoint returns 200 OK
- [ ] Health response includes `status: "ok"`
- [ ] Health response includes database status
- [ ] Prisma Studio shows `users` table
- [ ] Environment variables loaded from `.env`
- [ ] TypeScript compilation successful
- [ ] Hot reload works on file changes

## Troubleshooting

### "Cannot connect to database"

**Problem**: DATABASE_URL incorrect or database not running

**Solution**:

- Verify DATABASE_URL format in `.env`
- Check PostgreSQL is running: `docker ps` (Docker) or Railway dashboard
- Test connection: `npx prisma db pull`

### "Port 3000 already in use"

**Problem**: Another service using port 3000

**Solution**:

- Change PORT in `.env` to 3001 or another available port
- Or stop conflicting service: `lsof -ti:3000 | xargs kill`

### "Prisma Client not generated"

**Problem**: Prisma Client not installed or generated

**Solution**:

```bash
cd apps/backend
pnpm add @prisma/client
npx prisma generate
```

### "Module not found: prisma"

**Problem**: Dependencies not installed

**Solution**:

```bash
cd apps/backend
pnpm install
```

## Next Steps

After completing this quick start:

1. **Review Generated Files**: Explore the NestJS project structure
2. **Test Different Scenarios**:
   - Stop PostgreSQL and verify 503 response from health endpoint
   - Make a code change and verify hot reload
3. **Commit Your Work**:
   ```bash
   git add .
   git commit -m "feat: initialize backend API with health check and User model"
   ```
4. **Deploy to Railway** (optional):
   - Connect GitHub repository to Railway
   - Set DATABASE_URL environment variable
   - Deploy automatically on push

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Railway Documentation](https://docs.railway.app/)
- Project Constitution: `/.specify/memory/constitution.md`
- Feature Spec: `specs/003-backend-api-setup/spec.md`
- Implementation Plan: `specs/003-backend-api-setup/plan.md`

## Development Commands

From `apps/backend` directory:

```bash
# Start development server with hot reload
pnpm run start:dev

# Run production build
pnpm run build
pnpm run start:prod

# Run tests
pnpm run test

# Run E2E tests
pnpm run test:e2e

# Format code
pnpm run format

# Lint code
pnpm run lint

# Prisma commands
npx prisma studio          # Open Prisma Studio
npx prisma migrate dev     # Create and apply migration
npx prisma generate        # Regenerate Prisma Client
npx prisma db push         # Push schema changes (dev only)
```

## Environment Variables Reference

Create `apps/backend/.env.example`:

```env
# Database connection (required)
DATABASE_URL="postgresql://user:password@host:port/dbname"

# Server configuration
PORT=3000
NODE_ENV=development

# Future variables (Story 1.5)
# JWT_SECRET=your-secret-key
# CORS_ORIGIN=http://localhost:5173
```

**Remember**: Never commit `.env` to version control. Add it to `.gitignore`.
