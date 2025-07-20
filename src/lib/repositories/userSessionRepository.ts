import { PrismaClient, UserSession, Prisma } from '../../generated/prisma';

export interface UserSessionFilters {
    userId?: number;
    expired?: boolean;
    userSessionToken?: string;
}

export interface CreateUserSessionData {
    userId: number;
    userSessionToken: string;
    expiresAt: Date;
}

export interface UpdateUserSessionData {
    userSessionToken?: string;
    expiresAt?: Date;
}

export class UserSessionRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Create a new user session
     */
    async create(data: CreateUserSessionData): Promise<UserSession> {
        return await this.prisma.userSession.create({
            data: {
                userId: data.userId,
                userSessionToken: data.userSessionToken,
                expiresAt: data.expiresAt,
                loggedInAt: new Date(),
            },
        });
    }

    /**
     * Find session by ID
     */
    async findById(id: number): Promise<UserSession | null> {
        return await this.prisma.userSession.findUnique({
            where: { id },
        });
    }

    /**
     * Find session by token
     */
    async findByToken(userSessionToken: string): Promise<UserSession | null> {
        return await this.prisma.userSession.findFirst({
            where: {
                userSessionToken,
            },
        });
    }

    /**
     * Find valid session by token (not expired)
     */
    async findValidByToken(userSessionToken: string): Promise<UserSession | null> {
        return await this.prisma.userSession.findFirst({
            where: {
                userSessionToken,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });
    }

    /**
     * Find session with user data
     */
    async findByTokenWithUser(userSessionToken: string): Promise<any> {
        return await this.prisma.userSession.findFirst({
            where: {
                userSessionToken,
                expiresAt: {
                    gt: new Date(),
                },
            },
            include: {
                user: true,
            },
        });
    }

    /**
     * Find all sessions with optional filters
     */
    async findAll(filters: UserSessionFilters = {}): Promise<UserSession[]> {
        const where: Prisma.UserSessionWhereInput = {};

        if (filters.userId) {
            where.userId = filters.userId;
        }

        if (filters.userSessionToken) {
            where.userSessionToken = filters.userSessionToken;
        }

        if (filters.expired !== undefined) {
            if (filters.expired) {
                where.expiresAt = {
                    lt: new Date(),
                };
            } else {
                where.expiresAt = {
                    gt: new Date(),
                };
            }
        }

        return await this.prisma.userSession.findMany({
            where,
            orderBy: {
                loggedInAt: 'desc',
            },
        });
    }

    /**
     * Get all sessions for a user
     */
    async findByUserId(userId: number): Promise<UserSession[]> {
        return await this.prisma.userSession.findMany({
            where: {
                userId,
            },
            orderBy: {
                loggedInAt: 'desc',
            },
        });
    }

    /**
     * Get active sessions for a user
     */
    async findActiveByUserId(userId: number): Promise<UserSession[]> {
        return await this.prisma.userSession.findMany({
            where: {
                userId,
                expiresAt: {
                    gt: new Date(),
                },
            },
            orderBy: {
                loggedInAt: 'desc',
            },
        });
    }

    /**
     * Update session by ID
     */
    async update(id: number, data: UpdateUserSessionData): Promise<UserSession | null> {
        try {
            return await this.prisma.userSession.update({
                where: { id },
                data,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null; // Record not found
            }
            throw error;
        }
    }

    /**
     * Extend session expiry
     */
    async extendExpiry(userSessionToken: string, expiresAt: Date): Promise<UserSession | null> {
        try {
            // First find the session to get its ID
            const session = await this.findByToken(userSessionToken);
            if (!session) {
                return null;
            }

            return await this.prisma.userSession.update({
                where: { id: session.id },
                data: { expiresAt },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null; // Record not found
            }
            throw error;
        }
    }

    /**
     * Delete session by ID
     */
    async delete(id: number): Promise<UserSession | null> {
        try {
            return await this.prisma.userSession.delete({
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
     * Delete session by token
     */
    async deleteByToken(userSessionToken: string): Promise<UserSession | null> {
        try {
            // First find the session to get its ID
            const session = await this.findByToken(userSessionToken);
            if (!session) {
                return null;
            }

            return await this.prisma.userSession.delete({
                where: { id: session.id },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null; // Record not found
            }
            throw error;
        }
    }

    /**
     * Delete all sessions for a user
     */
    async deleteAllByUserId(userId: number): Promise<number> {
        const result = await this.prisma.userSession.deleteMany({
            where: { userId },
        });
        return result.count;
    }

    /**
     * Delete expired sessions
     */
    async deleteExpired(): Promise<number> {
        const result = await this.prisma.userSession.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
        return result.count;
    }

    /**
     * Count sessions
     */
    async count(filters: UserSessionFilters = {}): Promise<number> {
        const where: Prisma.UserSessionWhereInput = {};

        if (filters.userId) {
            where.userId = filters.userId;
        }

        if (filters.expired !== undefined) {
            if (filters.expired) {
                where.expiresAt = {
                    lt: new Date(),
                };
            } else {
                where.expiresAt = {
                    gt: new Date(),
                };
            }
        }

        return await this.prisma.userSession.count({ where });
    }

    /**
     * Check if session is valid
     */
    async isValidSession(userSessionToken: string): Promise<boolean> {
        const session = await this.findValidByToken(userSessionToken);
        return session !== null;
    }

} 