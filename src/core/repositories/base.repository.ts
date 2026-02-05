import { db } from '../database/client';
import { TransactionCallback } from '../database/types';

/**
 * Base Repository Pattern
 * 
 * Provides common database operations that all repositories can extend.
 * Implements the Repository pattern to abstract data access logic.
 * 
 * @template T - The domain model type
 * @template CreateInput - The input type for creating entities
 * @template UpdateInput - The input type for updating entities
 * @template WhereInput - The input type for filtering entities
 */
export abstract class BaseRepository<T, CreateInput, UpdateInput, WhereInput> {
    /**
     * The Prisma model delegate (e.g., db.stage, db.post)
     * Must be implemented by concrete repositories
     */
    protected abstract get model(): any;

    /**
     * Convert Prisma model to domain model
     * Must be implemented by concrete repositories
     */
    protected abstract toDomain(prismaModel: any): T;

    /**
     * Convert domain model to Prisma input
     * Must be implemented by concrete repositories
     */
    protected abstract toPrisma(domainModel: Partial<T>): any;

    /**
     * Find a single entity by ID
     */
    async findById(id: number | string): Promise<T | null> {
        const result = await this.model.findUnique({
            where: { id },
        });

        return result ? this.toDomain(result) : null;
    }

    /**
     * Find multiple entities with optional filtering and pagination
     */
    async findMany(options?: {
        where?: WhereInput;
        orderBy?: any;
        skip?: number;
        take?: number;
    }): Promise<T[]> {
        const results = await this.model.findMany(options);
        return results.map((r: any) => this.toDomain(r));
    }

    /**
     * Find first entity matching criteria
     */
    async findFirst(where: WhereInput): Promise<T | null> {
        const result = await this.model.findFirst({ where });
        return result ? this.toDomain(result) : null;
    }

    /**
     * Count entities matching criteria
     */
    async count(where?: WhereInput): Promise<number> {
        return this.model.count({ where });
    }

    /**
     * Create a new entity
     */
    async create(data: CreateInput): Promise<T> {
        const result = await this.model.create({ data });
        return this.toDomain(result);
    }

    /**
     * Update an existing entity
     */
    async update(id: number | string, data: UpdateInput): Promise<T> {
        const result = await this.model.update({
            where: { id },
            data,
        });
        return this.toDomain(result);
    }

    /**
     * Update multiple entities
     */
    async updateMany(where: WhereInput, data: UpdateInput): Promise<number> {
        const result = await this.model.updateMany({
            where,
            data,
        });
        return result.count;
    }

    /**
     * Delete an entity
     */
    async delete(id: number | string): Promise<T> {
        const result = await this.model.delete({
            where: { id },
        });
        return this.toDomain(result);
    }

    /**
     * Delete multiple entities
     */
    async deleteMany(where: WhereInput): Promise<number> {
        const result = await this.model.deleteMany({ where });
        return result.count;
    }

    /**
     * Execute operations in a transaction
     */
    async transaction<R>(callback: TransactionCallback<R>): Promise<R> {
        return db.$transaction(callback);
    }

    /**
     * Check if entity exists
     */
    async exists(where: WhereInput): Promise<boolean> {
        const count = await this.count(where);
        return count > 0;
    }
}
