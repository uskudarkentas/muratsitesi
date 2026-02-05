import { Prisma } from '@prisma/client';

/**
 * Database utility types for type-safe queries
 */

// Stage types
export type StageWhereInput = Prisma.StageWhereInput;
export type StageOrderByInput = Prisma.StageOrderByWithRelationInput;
export type StageCreateInput = Prisma.StageCreateInput;
export type StageUpdateInput = Prisma.StageUpdateInput;

// Post types
export type PostWhereInput = Prisma.PostWhereInput;
export type PostOrderByInput = Prisma.PostOrderByWithRelationInput;
export type PostCreateInput = Prisma.PostCreateInput;
export type PostUpdateInput = Prisma.PostUpdateInput;

// User types
export type UserWhereInput = Prisma.UserWhereInput;
export type UserCreateInput = Prisma.UserCreateInput;
export type UserUpdateInput = Prisma.UserUpdateInput;

// PageContent types
export type PageContentWhereInput = Prisma.PageContentWhereInput;
export type PageContentCreateInput = Prisma.PageContentCreateInput;
export type PageContentUpdateInput = Prisma.PageContentUpdateInput;

// Analytics types
export type AnalyticsLogWhereInput = Prisma.AnalyticsLogWhereInput;
export type AnalyticsLogCreateInput = Prisma.AnalyticsLogCreateInput;

/**
 * Generic repository types
 */
export interface FindManyOptions<T> {
    where?: T;
    orderBy?: any;
    skip?: number;
    take?: number;
}

export interface TransactionCallback<T> {
    (): Promise<T>;
}
