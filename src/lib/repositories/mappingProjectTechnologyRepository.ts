import { prisma } from '../prisma';

export interface CreateProjectMappingData {
    projectId: number;
    technologyId: number;
}

export interface ProjectMappingFilters {
    projectId?: number;
    technologyId?: number;
}

export class MappingProjectTechnologyRepository {
    async create(data: CreateProjectMappingData) {
        return await prisma.mappingProjectTechnology.create({
            data: {
                projectId: data.projectId,
                technologyId: data.technologyId,
            },
            include: {
                project: true,
                technology: true,
            },
        });
    }

    async findById(id: number) {
        return await prisma.mappingProjectTechnology.findUnique({
            where: {
                id,
            },
            include: {
                project: true,
                technology: true,
            },
        });
    }

    async findByProjectAndTechnology(projectId: number, technologyId: number) {
        return await prisma.mappingProjectTechnology.findFirst({
            where: {
                projectId,
                technologyId,
            },
            include: {
                project: true,
                technology: true,
            },
        });
    }

    async findAll(filters: ProjectMappingFilters = {}) {
        return await prisma.mappingProjectTechnology.findMany({
            where: {
                projectId: filters.projectId,
                technologyId: filters.technologyId,
            },
            include: {
                project: true,
                technology: true,
            },
            orderBy: [
                {
                    project: {
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

    async findByProjectId(projectId: number) {
        return await prisma.mappingProjectTechnology.findMany({
            where: {
                projectId,
                project: {
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
        return await prisma.mappingProjectTechnology.findMany({
            where: {
                technologyId,
                project: {
                    deleted: false,
                },
            },
            include: {
                project: true,
            },
            orderBy: {
                project: {
                    createdAt: 'desc',
                },
            },
        });
    }

    async delete(projectId: number, technologyId: number) {
        return await prisma.mappingProjectTechnology.deleteMany({
            where: {
                projectId,
                technologyId,
            },
        });
    }

    async deleteById(id: number) {
        return await prisma.mappingProjectTechnology.delete({
            where: {
                id,
            },
        });
    }

    async deleteByProjectId(projectId: number) {
        return await prisma.mappingProjectTechnology.deleteMany({
            where: {
                projectId,
            },
        });
    }

    async deleteByTechnologyId(technologyId: number) {
        return await prisma.mappingProjectTechnology.deleteMany({
            where: {
                technologyId,
            },
        });
    }

    async bulkCreate(mappings: CreateProjectMappingData[]) {
        return await prisma.mappingProjectTechnology.createMany({
            data: mappings,
            skipDuplicates: true,
        });
    }

    async bulkReplace(projectId: number, technologyIds: number[]) {
        // Delete existing mappings for this project
        await this.deleteByProjectId(projectId);

        // Create new mappings
        if (technologyIds.length > 0) {
            const mappings = technologyIds.map(technologyId => ({
                projectId,
                technologyId,
            }));

            return await this.bulkCreate(mappings);
        }

        return { count: 0 };
    }

    async exists(projectId: number, technologyId: number): Promise<boolean> {
        const mapping = await prisma.mappingProjectTechnology.findFirst({
            where: {
                projectId,
                technologyId,
            },
        });
        return !!mapping;
    }

    async getProjectTechnologyCount(projectId: number): Promise<number> {
        return await prisma.mappingProjectTechnology.count({
            where: {
                projectId,
                project: {
                    deleted: false,
                },
            },
        });
    }

    async getTechnologyProjectCount(technologyId: number): Promise<number> {
        return await prisma.mappingProjectTechnology.count({
            where: {
                technologyId,
                project: {
                    deleted: false,
                },
            },
        });
    }

    async getTechnologyUsageStats() {
        return await prisma.technology.findMany({
            include: {
                _count: {
                    select: {
                        MappingProjectTechnology: {
                            where: {
                                project: {
                                    deleted: false,
                                },
                            },
                        },
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
    }
} 