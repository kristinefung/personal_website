import { PrismaClient, User, Prisma } from '../../generated/prisma';

export interface UserFilters {
    deleted?: boolean;
    email?: string;
    name?: string;
    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
}

export interface CreateUserData {
    name: string;
    email: string;
    hashedPassword: string;
    passwordSalt: string;
    createdBy?: number;
}

export interface UpdateUserData {
    name?: string;
    email?: string;
    hashedPassword?: string;
    passwordSalt?: string;
    updatedBy?: number;
}

export class UserRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Create a new user
     */
    async create(data: CreateUserData): Promise<User> {
        return await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                hashedPassword: data.hashedPassword,
                passwordSalt: data.passwordSalt,
                createdBy: data.createdBy,
                deleted: false,
            },
        });
    }

    /**
     * Find user by ID
     */
    async findById(id: number): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: {
                id,
                deleted: false,
            },
        });
    }

    /**
     * Find user by email
     */
    async findByEmail(email: string): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: {
                email,
                deleted: false,
            },
        });
    }

    /**
     * Find all users with optional filters
     */
    async findAll(filters: UserFilters = {}): Promise<User[]> {
        const where: Prisma.UserWhereInput = {};

        if (filters.deleted !== undefined) {
            where.deleted = filters.deleted;
        } else {
            where.deleted = false; // Default to non-deleted
        }

        if (filters.email) {
            where.email = {
                contains: filters.email,
            };
        }

        if (filters.name) {
            where.name = {
                contains: filters.name,
            };
        }

        if (filters.createdBy) {
            where.createdBy = filters.createdBy;
        }

        if (filters.updatedBy) {
            where.updatedBy = filters.updatedBy;
        }

        if (filters.deletedBy) {
            where.deletedBy = filters.deletedBy;
        }

        return await this.prisma.user.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    /**
     * Update user by ID
     */
    async update(id: number, data: UpdateUserData): Promise<User | null> {
        try {
            return await this.prisma.user.update({
                where: { id },
                data: {
                    ...data,
                    updatedAt: new Date(),
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null; // Record not found
            }
            throw error;
        }
    }

    /**
     * Soft delete user by ID
     */
    async softDelete(id: number, deletedBy?: number): Promise<User | null> {
        try {
            return await this.prisma.user.update({
                where: { id },
                data: {
                    deleted: true,
                    deletedAt: new Date(),
                    deletedBy,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null; // Record not found
            }
            throw error;
        }
    }

    /**
     * Hard delete user by ID (permanent deletion)
     */
    async hardDelete(id: number): Promise<User | null> {
        try {
            return await this.prisma.user.delete({
                where: { id },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null; // Record not found
            }
            throw error;
        }
    }

    /**
     * Check if email exists (for registration validation)
     */
    async emailExists(email: string, excludeUserId?: number): Promise<boolean> {
        const where: Prisma.UserWhereInput = {
            email,
            deleted: false,
        };

        if (excludeUserId) {
            where.id = {
                not: excludeUserId,
            };
        }

        const user = await this.prisma.user.findFirst({
            where,
        });

        return user !== null;
    }

    /**
     * Get user with their sessions
     */
    async findByIdWithSessions(id: number): Promise<any> {
        return await this.prisma.user.findFirst({
            where: {
                id,
                deleted: false,
            },
            include: {
                userSessions: {
                    where: {
                        expiresAt: {
                            gt: new Date(),
                        },
                    },
                    orderBy: {
                        loggedInAt: 'desc',
                    },
                },
            },
        });
    }

    /**
     * Count total users
     */
    async count(filters: UserFilters = {}): Promise<number> {
        const where: Prisma.UserWhereInput = {};

        if (filters.deleted !== undefined) {
            where.deleted = filters.deleted;
        } else {
            where.deleted = false;
        }

        if (filters.email) {
            where.email = {
                contains: filters.email,
            };
        }

        if (filters.name) {
            where.name = {
                contains: filters.name,
            };
        }

        return await this.prisma.user.count({ where });
    }

} 