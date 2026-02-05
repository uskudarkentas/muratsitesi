/**
 * Custom Application Error Class
 * 
 * Provides structured error handling across the application
 * with HTTP status codes and optional metadata.
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly metadata?: Record<string, any>;

    constructor(
        message: string,
        statusCode: number = 500,
        metadata?: Record<string, any>,
        isOperational: boolean = true
    ) {
        super(message);

        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.metadata = metadata;

        // Maintains proper stack trace for where error was thrown
        Error.captureStackTrace(this, this.constructor);

        // Set the prototype explicitly for proper instanceof checks
        Object.setPrototypeOf(this, AppError.prototype);
    }

    /**
     * Convert error to JSON for API responses
     */
    toJSON() {
        return {
            message: this.message,
            statusCode: this.statusCode,
            ...(this.metadata && { metadata: this.metadata }),
        };
    }
}

/**
 * Specific error types for common scenarios
 */

export class NotFoundError extends AppError {
    constructor(resource: string, id?: string | number) {
        const message = id
            ? `${resource} with id ${id} not found`
            : `${resource} not found`;
        super(message, 404);
    }
}

export class ValidationError extends AppError {
    constructor(message: string, fields?: Record<string, string>) {
        super(message, 400, { fields });
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409);
    }
}

export class DatabaseError extends AppError {
    constructor(message: string, originalError?: Error) {
        super(message, 500, { originalError: originalError?.message });
    }
}
