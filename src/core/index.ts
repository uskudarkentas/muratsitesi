/**
 * Core Infrastructure Exports
 * 
 * Centralized exports for core infrastructure components.
 */

// Database
export { db, prisma } from './database/client';
export * from './database/types';

// Repositories
export { BaseRepository } from './repositories/base.repository';

// Services
export { BaseService } from './services/base.service';

// Errors
export {
    AppError,
    NotFoundError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
    DatabaseError,
} from './errors/AppError';
