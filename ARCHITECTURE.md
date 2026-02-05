# Next.js Clean Architecture - Developer Guide

## 📁 Project Structure

```
src/
├── core/                    # Core infrastructure
│   ├── database/           # Database client & types
│   ├── repositories/       # Base repository pattern
│   ├── services/          # Base service pattern
│   └── errors/            # Custom error classes
│
├── entities/               # Domain models
│   ├── stage/             # Stage domain model
│   ├── post/              # Post domain model
│   ├── page-content/      # PageContent domain model
│   └── user/              # User domain model
│
├── features/              # Feature modules
│   ├── stages/           # Stage feature
│   │   ├── repositories/ # Stage data access
│   │   └── services/     # Stage business logic
│   ├── posts/            # Post feature
│   ├── page-builder/     # Page builder feature
│   └── analytics/        # Analytics feature
│
├── server/               # Server-side code
│   └── actions/         # Next.js server actions
│
├── shared/              # Shared utilities
│   ├── components/     # Reusable UI components
│   ├── lib/           # Utility functions
│   └── hooks/         # Custom React hooks
│
└── app/                # Next.js App Router
    └── (routes)/      # Page components
```

## 🏗️ Architecture Layers

### 1. Domain Layer (`entities/`)
**Purpose:** Define business entities and rules

**Rules:**
- Contains domain models with business logic
- No dependencies on other layers
- Pure TypeScript classes
- Validation and business rules

**Example:**
```typescript
import { Stage, StageStatus } from '@/entities/stage/model';

const stage = new Stage(...);
if (stage.canTransitionTo(StageStatus.ACTIVE)) {
  // Transition allowed
}
```

### 2. Repository Layer (`features/*/repositories/`)
**Purpose:** Abstract data access

**Rules:**
- Extends `BaseRepository`
- Converts between Prisma models and domain models
- Only handles data access, no business logic
- Returns domain models

**Example:**
```typescript
import { stageRepository } from '@/features/stages/repositories/stageRepository';

const stage = await stageRepository.findBySlug('slug');
const stages = await stageRepository.findAllVisible();
```

### 3. Service Layer (`features/*/services/`)
**Purpose:** Implement business logic

**Rules:**
- Extends `BaseService`
- Uses repositories for data access
- Contains business rules and validation
- Orchestrates multiple repositories if needed
- No direct database access

**Example:**
```typescript
import { stageService } from '@/features/stages/services/stageService';

// Business logic: Setting stage to ACTIVE cascades to other stages
await stageService.updateStage(id, { status: StageStatus.ACTIVE });
```

### 4. Server Actions (`server/actions/`)
**Purpose:** Next.js integration layer

**Rules:**
- Thin wrappers around services
- Handle serialization/deserialization
- Path revalidation
- Error handling
- No business logic

**Example:**
```typescript
import { updateStage } from '@/server/actions/stageActions';

const result = await updateStage(id, { status: 'ACTIVE' });
if (result.success) {
  // Success
}
```

### 5. App Router (`app/`)
**Purpose:** UI and routing

**Rules:**
- Server Components for data fetching
- Call services directly or use server actions
- Convert domain models to JSON for client components
- No business logic
- No direct database access

**Example:**
```typescript
import { stageService } from '@/features/stages/services/stageService';

export default async function Page() {
  const stages = await stageService.getAllStages();
  return <Timeline stages={stages.map(s => s.toJSON())} />;
}
```

## 📋 Coding Rules

### ✅ DO

1. **Use services for business logic**
   ```typescript
   // ✅ Good
   await stageService.updateStage(id, data);
   ```

2. **Use repositories for data access**
   ```typescript
   // ✅ Good (inside service)
   const stage = await this.repository.findById(id);
   ```

3. **Convert domain models to JSON for client components**
   ```typescript
   // ✅ Good
   <Timeline stages={stages.map(s => s.toJSON())} />
   ```

4. **Use server actions in client components**
   ```typescript
   // ✅ Good
   import { updateStage } from '@/server/actions/stageActions';
   ```

### ❌ DON'T

1. **Don't access database directly in pages**
   ```typescript
   // ❌ Bad
   const stages = await db.stage.findMany();
   ```

2. **Don't put business logic in components**
   ```typescript
   // ❌ Bad
   if (stage.status === 'ACTIVE') {
     await db.stage.updateMany({ status: 'LOCKED' });
   }
   ```

3. **Don't import repositories in pages**
   ```typescript
   // ❌ Bad
   import { stageRepository } from '@/features/stages/repositories';
   ```

4. **Don't put business logic in server actions**
   ```typescript
   // ❌ Bad - business logic should be in service
   export async function updateStage(id, data) {
     if (data.status === 'ACTIVE') {
       // Complex business logic here
     }
   }
   ```

## 🔄 Data Flow

### Server Component Flow
```
Page Component
    ↓
Service Layer
    ↓
Repository Layer
    ↓
Database
```

### Client Component Flow
```
Client Component
    ↓
Server Action
    ↓
Service Layer
    ↓
Repository Layer
    ↓
Database
```

## 🆕 Adding New Features

### 1. Create Domain Model
```typescript
// src/entities/feature/model.ts
export class Feature {
  constructor(
    public readonly id: number,
    public name: string
  ) {}
  
  // Business logic methods
  isValid(): boolean {
    return this.name.length > 0;
  }
}
```

### 2. Create Repository
```typescript
// src/features/feature/repositories/featureRepository.ts
export class FeatureRepository extends BaseRepository<...> {
  protected get model() { return db.feature; }
  protected toDomain(prisma: any): Feature { ... }
  protected toPrisma(domain: Partial<Feature>): any { ... }
}
```

### 3. Create Service
```typescript
// src/features/feature/services/featureService.ts
export class FeatureService extends BaseService<...> {
  async createFeature(data: any): Promise<Feature> {
    // Validation
    // Business logic
    return this.repository.create(data);
  }
}
```

### 4. Create Server Actions
```typescript
// src/server/actions/featureActions.ts
"use server";

export async function createFeature(data: any) {
  try {
    const feature = await featureService.createFeature(data);
    revalidatePath('/features');
    return { success: true, data: feature.toJSON() };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### 5. Use in Pages/Components
```typescript
// Server Component
const features = await featureService.getAllFeatures();

// Client Component
import { createFeature } from '@/server/actions/featureActions';
const result = await createFeature(data);
```

## 🧪 Testing Strategy

### Unit Tests (Services)
```typescript
describe('StageService', () => {
  it('should cascade status updates', async () => {
    const mockRepo = createMockRepository();
    const service = new StageService(mockRepo);
    
    await service.updateStage(1, { status: StageStatus.ACTIVE });
    
    expect(mockRepo.updateBeforeSequence).toHaveBeenCalled();
  });
});
```

### Integration Tests (Repositories)
```typescript
describe('StageRepository', () => {
  it('should find active stage', async () => {
    const stage = await stageRepository.findActive();
    expect(stage?.status).toBe(StageStatus.ACTIVE);
  });
});
```

## 📚 Additional Resources

- **SOLID Principles:** Each layer follows SRP, OCP, DIP
- **Clean Architecture:** Clear separation of concerns
- **Domain-Driven Design:** Business logic in domain models
- **Repository Pattern:** Abstract data access
- **Service Pattern:** Centralize business logic
