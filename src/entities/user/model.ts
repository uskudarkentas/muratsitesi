/**
 * User Role Enum
 */
export enum UserRole {
    ADMIN = 'ADMIN',
    RESIDENT = 'RESIDENT',
}

/**
 * User Domain Model
 * 
 * Represents a user in the system (admin or resident).
 */
export class User {
    constructor(
        public readonly id: string,
        public email: string,
        public passwordHash: string,
        public role: UserRole,
        public fullName: string,
        public apartmentInfo: string | null,
        public lastLogin: Date | null
    ) { }

    /**
     * Check if user is an admin
     */
    isAdmin(): boolean {
        return this.role === UserRole.ADMIN;
    }

    /**
     * Check if user is a resident
     */
    isResident(): boolean {
        return this.role === UserRole.RESIDENT;
    }

    /**
     * Check if user has apartment info
     */
    hasApartmentInfo(): boolean {
        return this.apartmentInfo !== null && this.apartmentInfo.trim() !== '';
    }

    /**
     * Get display name
     */
    getDisplayName(): string {
        return this.fullName;
    }

    /**
     * Get full display with apartment info
     */
    getFullDisplay(): string {
        if (this.hasApartmentInfo()) {
            return `${this.fullName} (${this.apartmentInfo})`;
        }
        return this.fullName;
    }

    /**
     * Update last login timestamp
     */
    updateLastLogin(): void {
        this.lastLogin = new Date();
    }

    /**
     * Check if user has logged in before
     */
    hasLoggedInBefore(): boolean {
        return this.lastLogin !== null;
    }

    /**
     * Get days since last login
     */
    getDaysSinceLastLogin(): number | null {
        if (!this.lastLogin) return null;
        const diff = new Date().getTime() - this.lastLogin.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    /**
     * Convert to plain object for serialization (excluding password)
     */
    toJSON() {
        return {
            id: this.id,
            email: this.email,
            role: this.role,
            fullName: this.fullName,
            apartmentInfo: this.apartmentInfo,
            lastLogin: this.lastLogin,
        };
    }

    /**
     * Convert to safe object for client (no sensitive data)
     */
    toSafeJSON() {
        return {
            id: this.id,
            email: this.email,
            role: this.role,
            fullName: this.fullName,
            apartmentInfo: this.apartmentInfo,
        };
    }

    /**
     * Create from plain object
     */
    static fromJSON(data: any): User {
        return new User(
            data.id,
            data.email,
            data.passwordHash,
            data.role as UserRole,
            data.fullName,
            data.apartmentInfo,
            data.lastLogin ? new Date(data.lastLogin) : null
        );
    }
}
