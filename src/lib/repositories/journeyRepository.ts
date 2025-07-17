import { prisma } from '../prisma';

export interface CreateJourneyData {
    title: string;
    institution: string;
    description: string;
    startYear: number;
    endYear?: number;
    isCurrent?: boolean;
    createdBy?: number;
}

export interface UpdateJourneyData {
    title?: string;
    institution?: string;
    description?: string;
    startYear?: number;
    endYear?: number;
    isCurrent?: boolean;
}

export interface JourneyFilters {
    deleted?: boolean;
    createdBy?: number;
    isCurrent?: boolean;
    startYear?: number;
    endYear?: number;
}

export class JourneyRepository {
    async create(data: CreateJourneyData) {
        return await prisma.journey.create({
            data: {
                title: data.title,
                institution: data.institution,
                description: data.description,
                startYear: data.startYear,
                endYear: data.endYear || null,
                isCurrent: data.isCurrent || false,
                createdBy: data.createdBy || null,
            },
            include: {
                createdByUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async findById(id: number) {
        return await prisma.journey.findFirst({
            where: {
                id,
                deleted: false,
            },
            include: {
                createdByUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                updatedByUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async findAll(filters: JourneyFilters = {}) {
        return await prisma.journey.findMany({
            where: {
                deleted: filters.deleted ?? false,
                createdBy: filters.createdBy,
                isCurrent: filters.isCurrent,
                startYear: filters.startYear ? {
                    gte: filters.startYear,
                } : undefined,
                endYear: filters.endYear ? {
                    lte: filters.endYear,
                } : undefined,
            },
            include: {
                createdByUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: [
                {
                    isCurrent: 'desc', // Current entries first
                },
                {
                    startYear: 'desc', // Most recent first
                },
            ],
        });
    }

    async findCurrent() {
        return await prisma.journey.findMany({
            where: {
                deleted: false,
                isCurrent: true,
            },
            include: {
                createdByUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                startYear: 'desc',
            },
        });
    }

    async findByYearRange(startYear?: number, endYear?: number) {
        return await prisma.journey.findMany({
            where: {
                deleted: false,
                AND: [
                    startYear ? {
                        OR: [
                            { endYear: { gte: startYear } },
                            { isCurrent: true },
                        ],
                    } : {},
                    endYear ? {
                        startYear: { lte: endYear },
                    } : {},
                ],
            },
            orderBy: [
                {
                    isCurrent: 'desc',
                },
                {
                    startYear: 'desc',
                },
            ],
        });
    }

    async findByInstitution(institution: string) {
        return await prisma.journey.findMany({
            where: {
                deleted: false,
                institution: {
                    contains: institution,
                },
            },
            orderBy: {
                startYear: 'desc',
            },
        });
    }

    async update(id: number, data: UpdateJourneyData, updatedBy?: number) {
        return await prisma.journey.update({
            where: { id },
            data: {
                ...data,
                updatedBy,
                updatedAt: new Date(),
            },
            include: {
                createdByUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                updatedByUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async markAsCurrent(id: number, updatedBy?: number) {
        return await this.update(id, { isCurrent: true }, updatedBy);
    }

    async markAsCompleted(id: number, endYear: number, updatedBy?: number) {
        return await this.update(id, {
            isCurrent: false,
            endYear
        }, updatedBy);
    }

    async delete(id: number, deletedBy?: number) {
        return await prisma.journey.update({
            where: { id },
            data: {
                deleted: true,
                deletedBy,
                deletedAt: new Date(),
            },
        });
    }

    async hardDelete(id: number) {
        return await prisma.journey.delete({
            where: { id },
        });
    }

    async getJourneyStats() {
        const [totalJourneys, currentJourneys, completedJourneys] = await Promise.all([
            prisma.journey.count({
                where: {
                    deleted: false,
                },
            }),
            prisma.journey.count({
                where: {
                    deleted: false,
                    isCurrent: true,
                },
            }),
            prisma.journey.count({
                where: {
                    deleted: false,
                    isCurrent: false,
                },
            }),
        ]);

        return {
            totalJourneys,
            currentJourneys,
            completedJourneys,
        };
    }

    async getYearRange() {
        const result = await prisma.journey.aggregate({
            where: {
                deleted: false,
            },
            _min: {
                startYear: true,
            },
            _max: {
                startYear: true,
            },
        });

        return {
            earliestYear: result._min.startYear,
            latestYear: result._max.startYear,
        };
    }

    async getJourneysCount(): Promise<number> {
        return await prisma.journey.count({
            where: {
                deleted: false,
            },
        });
    }
} 