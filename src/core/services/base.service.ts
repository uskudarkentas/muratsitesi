/**
 * Base Service Pattern
 * 
 * Provides a foundation for service classes that contain business logic.
 * Services orchestrate repositories and implement domain rules.
 * 
 * @template T - The domain model type
 * @template Repository - The repository type
 */
export abstract class BaseService<T, Repository> {
    /**
     * The repository instance
     * Injected via constructor for dependency inversion
     */
    protected repository: Repository;

    constructor(repository: Repository) {
        this.repository = repository;
    }

    /**
     * Validate input data
     * Override in concrete services for specific validation logic
     */
    protected async validate(data: any): Promise<void> {
        // Default: no validation
        // Override in concrete services
    }

    /**
     * Execute before create hook
     * Override in concrete services for pre-create logic
     */
    protected async beforeCreate(data: any): Promise<any> {
        return data;
    }

    /**
     * Execute after create hook
     * Override in concrete services for post-create logic
     */
    protected async afterCreate(entity: T): Promise<T> {
        return entity;
    }

    /**
     * Execute before update hook
     * Override in concrete services for pre-update logic
     */
    protected async beforeUpdate(id: number | string, data: any): Promise<any> {
        return data;
    }

    /**
     * Execute after update hook
     * Override in concrete services for post-update logic
     */
    protected async afterUpdate(entity: T): Promise<T> {
        return entity;
    }

    /**
     * Execute before delete hook
     * Override in concrete services for pre-delete logic
     */
    protected async beforeDelete(id: number | string): Promise<void> {
        // Default: no action
    }

    /**
     * Execute after delete hook
     * Override in concrete services for post-delete logic
     */
    protected async afterDelete(entity: T): Promise<void> {
        // Default: no action
    }
}
