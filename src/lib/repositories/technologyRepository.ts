import { prisma } from '../prisma';

export interface CreateTechnologyData {
    name: string;
    color: string;
}

export interface UpdateTechnologyData {
    name?: string;
    color?: string;
}

export interface TechnologyFilters {
    name?: string;
}

export class TechnologyRepository {
    async create(data: CreateTechnologyData) {
        return await prisma.technology.create({
            data: {
                name: data.name,
                color: data.color,
            },
        });
    }

    async findById(id: number) {
        return await prisma.technology.findUnique({
            where: {
                id,
            },
            include: {
                MappingProfileTechnology: {
                    include: {
                        profile: true,
                    },
                    where: {
                        profile: {
                            deleted: false,
                        },
                    },
                },
            },
        });
    }

    async findByName(name: string) {
        return await prisma.technology.findFirst({
            where: {
                name: {
                    equals: name,
                },
            },
        });
    }

    async findAll(filters: TechnologyFilters = {}) {
        return await prisma.technology.findMany({
            where: {
                name: filters.name ? {
                    contains: filters.name,
                } : undefined,
            },
            orderBy: {
                name: 'asc',
            },
        });
    }

    async findAllWithProfiles() {
        return await prisma.technology.findMany({
            include: {
                MappingProfileTechnology: {
                    include: {
                        profile: true,
                    },
                    where: {
                        profile: {
                            deleted: false,
                        },
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
    }

    async update(id: number, data: UpdateTechnologyData) {
        return await prisma.technology.update({
            where: { id },
            data,
        });
    }

    async delete(id: number) {
        // First remove all profile-technology mappings
        await prisma.mappingProfileTechnology.deleteMany({
            where: {
                technologyId: id,
            },
        });

        return await prisma.technology.delete({
            where: { id },
        });
    }

} 