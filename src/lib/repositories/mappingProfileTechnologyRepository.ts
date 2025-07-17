import { prisma } from '../prisma';

export interface CreateMappingData {
    profileId: number;
    technologyId: number;
}

export interface MappingFilters {
    profileId?: number;
    technologyId?: number;
}

export class MappingProfileTechnologyRepository {
    async create(data: CreateMappingData) {
        return await prisma.mappingProfileTechnology.create({
            data: {
                profileId: data.profileId,
                technologyId: data.technologyId,
            },
            include: {
                profile: true,
                technology: true,
            },
        });
    }

    async findById(id: number) {
        return await prisma.mappingProfileTechnology.findUnique({
            where: {
                id,
            },
            include: {
                profile: true,
                technology: true,
            },
        });
    }

    async findByProfileAndTechnology(profileId: number, technologyId: number) {
        return await prisma.mappingProfileTechnology.findFirst({
            where: {
                profileId,
                technologyId,
            },
            include: {
                profile: true,
                technology: true,
            },
        });
    }

    async findAll(filters: MappingFilters = {}) {
        return await prisma.mappingProfileTechnology.findMany({
            where: {
                profileId: filters.profileId,
                technologyId: filters.technologyId,
            },
            include: {
                profile: true,
                technology: true,
            },
            orderBy: [
                {
                    profile: {
                        createdAt: 'desc',
                    },
                },
                {
                    technology: {
                        name: 'asc',
                    },
                },
            ],
        });
    }

    async findByProfileId(profileId: number) {
        return await prisma.mappingProfileTechnology.findMany({
            where: {
                profileId,
                profile: {
                    deleted: false,
                },
            },
            include: {
                technology: true,
            },
            orderBy: {
                technology: {
                    name: 'asc',
                },
            },
        });
    }

    async findByTechnologyId(technologyId: number) {
        return await prisma.mappingProfileTechnology.findMany({
            where: {
                technologyId,
                profile: {
                    deleted: false,
                },
            },
            include: {
                profile: true,
            },
            orderBy: {
                profile: {
                    createdAt: 'desc',
                },
            },
        });
    }

    async delete(profileId: number, technologyId: number) {
        return await prisma.mappingProfileTechnology.deleteMany({
            where: {
                profileId,
                technologyId,
            },
        });
    }

    async deleteById(id: number) {
        return await prisma.mappingProfileTechnology.delete({
            where: {
                id,
            },
        });
    }

    async deleteByProfileId(profileId: number) {
        return await prisma.mappingProfileTechnology.deleteMany({
            where: {
                profileId,
            },
        });
    }

    async deleteByTechnologyId(technologyId: number) {
        return await prisma.mappingProfileTechnology.deleteMany({
            where: {
                technologyId,
            },
        });
    }
} 