# Research: Backend API and Database Setup

**Feature**: Backend API and Database Setup  
**Branch**: `003-backend-api-setup`  
**Date**: January 4, 2026

## Research Questions

Based on Technical Context analysis, all implementation details are clear from constitutional requirements and existing project structure. No unknowns requiring research.

## Technology Decisions

### Decision 1: NestJS Framework Setup

**Decision**: Use `@nestjs/cli` to scaffold project with standard structure

**Rationale**:

- Official NestJS CLI provides battle-tested project structure
- Includes TypeScript configuration, Jest setup, and build scripts out of the box
- Follows NestJS best practices automatically
- Reduces setup time and configuration errors

**Alternatives Considered**:

- Manual setup: Rejected due to higher error potential and longer setup time
- Custom template: Rejected as standard NestJS structure meets all requirements

**Implementation Notes**:

- Run `npx @nestjs/cli new backend` within `/apps` directory
- Configure as monorepo workspace in root `package.json`
- Set `packageManager: pnpm` in nest-cli.json

### Decision 2: Prisma Schema Design for User Model

**Decision**: UUID primary keys, snake_case database columns with @map() to camelCase

**Rationale**:

- UUIDs prevent enumeration attacks and enable distributed ID generation
- snake_case aligns with PostgreSQL conventions
- @map() provides TypeScript-friendly camelCase without database changes
- Follows constitutional naming requirements exactly

**Alternatives Considered**:

- Auto-increment integers: Rejected due to enumeration risk and scaling limitations
- camelCase in database: Rejected as non-idiomatic for PostgreSQL
- No @map(): Rejected as forces snake_case in TypeScript code

**Implementation Notes**:

```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String   @map("password_hash")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@map("users")
}
```

### Decision 3: Database Connection Strategy

**Decision**: Use environment variable `DATABASE_URL` with connection pooling via Prisma

**Rationale**:

- Standard pattern for 12-factor apps
- Railway provides DATABASE_URL automatically
- Prisma handles connection pooling efficiently
- No credentials in code or version control

**Alternatives Considered**:

- Individual env vars (host, port, etc.): Rejected as less convenient and Railway doesn't provide this format
- Hardcoded connection: Rejected due to security and flexibility concerns

**Implementation Notes**:

- Add `DATABASE_URL` to `.env.example` with placeholder
- Document Railway-specific setup in README
- Include local Docker Compose alternative for development

### Decision 4: Global Exception Filter Design

**Decision**: Custom NestJS exception filter extending BaseExceptionFilter

**Rationale**:

- Centralizes error handling logic
- Provides consistent JSON error format across all endpoints
- Prevents internal error details from leaking to clients
- Supports future error logging integration

**Alternatives Considered**:

- Built-in NestJS filter only: Rejected as doesn't customize response format
- Middleware-based error handling: Rejected as exception filters are idiomatic NestJS pattern

**Implementation Notes**:

- Catch all HttpException and Error types
- Return format: `{ statusCode, message, timestamp, path }`
- Log errors server-side for debugging
- Register globally in main.ts

### Decision 5: Health Check Implementation

**Decision**: Simple controller endpoint that verifies database connectivity

**Rationale**:

- Railway and other platforms use health checks for deployment verification
- Database connectivity check ensures full system health
- Simple HTTP GET requires no authentication
- Fast response for load balancer health checks

**Alternatives Considered**:

- @nestjs/terminus library: Deferred to future story as overkill for MVP
- No database check: Rejected as doesn't verify full system health

**Implementation Notes**:

- GET /health returns `{ status: 'ok', timestamp }`
- Include try/catch for database ping
- Return 503 Service Unavailable if database unreachable
- Target <100ms response time

## Best Practices

### NestJS Configuration

- Enable CORS for future web app integration (origin: localhost:5173 in dev)
- Use global validation pipe for consistent DTO validation
- Enable shutdown hooks for graceful database disconnection
- Set global route prefix `/api` for cleaner URL structure

### Prisma Best Practices

- Always use Prisma Client singleton pattern (via service)
- Run migrations in development: `npx prisma migrate dev`
- Generate client after schema changes: `npx prisma generate`
- Use `prisma.$disconnect()` in NestJS onModuleDestroy lifecycle hook

### Environment Variables

Required variables for production:

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default 3000)
- `NODE_ENV`: Environment name (development, production)

Optional variables for future:

- `JWT_SECRET`: For authentication (Story 1.5)
- `CORS_ORIGIN`: Allowed origins for CORS

### Development Workflow

1. Start PostgreSQL (Railway or local Docker)
2. Run `npx prisma migrate dev` to apply migrations
3. Start dev server: `npm run start:dev`
4. Test health endpoint: `curl http://localhost:3000/health`

### Testing Strategy

Focus on integration tests for this infrastructure story:

- Health endpoint returns 200 when database connected
- Health endpoint returns 503 when database unavailable
- Exception filter transforms errors to consistent format
- Prisma service connects successfully on module init

Defer unit tests for business logic to future stories.

## Dependencies Summary

**Production Dependencies**:

- @nestjs/common, @nestjs/core, @nestjs/platform-express
- @prisma/client
- class-validator, class-transformer
- reflect-metadata, rxjs

**Development Dependencies**:

- @nestjs/cli, @nestjs/schematics, @nestjs/testing
- prisma
- @types/node, @types/express
- typescript, ts-node, ts-loader
- jest, supertest, @types/jest, @types/supertest

## Migration Path

Since this is initial backend setup:

1. Create `/apps/backend` directory structure
2. Initialize NestJS project
3. Configure Prisma with schema
4. Create initial migration
5. Implement health endpoint and exception filter
6. Add to monorepo workspace configuration
7. Update root README with backend setup instructions

No data migration needed as this is greenfield development.

## Risks and Mitigations

**Risk 1**: PostgreSQL connection failure during deployment

- **Mitigation**: Validate DATABASE_URL format on startup, fail fast with clear error message

**Risk 2**: Migration conflicts in team development

- **Mitigation**: Document migration workflow, use feature branches, review schema changes in PRs

**Risk 3**: Missing environment variables in production

- **Mitigation**: Validate required env vars in main.ts bootstrap, Railway provides checklist

**Risk 4**: Port conflicts in local development

- **Mitigation**: Use PORT env var, document default 3000, check Railway port assignment

## Next Steps

Phase 1 will produce:

- `data-model.md`: Detailed User entity specification with field validation rules
- `contracts/health.yaml`: OpenAPI specification for health endpoint
- `quickstart.md`: Step-by-step guide for developers to set up and run the backend locally
