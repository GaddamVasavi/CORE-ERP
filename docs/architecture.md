# CoreERP Architectural Design Document

## 1. System Overview
CoreERP is architected as a modern, modular backend with domain-driven boundaries, paired with a high-performance React TypeScript Single Page Application (SPA), integrated asynchronously via Apache Kafka and cached via Redis.

## 2. Multi-Tenancy Strategy
- **Discriminator Isolation**: All tenant-owned records contain an indexed tenant_id foreign key.
- **Context Resolution**: The TenantFilter extracts X-Tenant-ID from headers or decodes the validated JWT claim into TenantContext.
- **Automatic Query Scoping**: Repositories enforce tenant_id filtering preventing cross-tenant leakage.

## 3. High-Volume Event-Driven Integration
Domain events are published to Kafka topics when critical operations occur (e.g. invoice created, inventory low, payroll run completed), enabling decoupled downstream processing and notifications.
