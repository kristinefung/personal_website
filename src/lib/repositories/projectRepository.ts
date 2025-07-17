import { prisma } from '../prisma';

export interface CreateProjectData {
    name: string;
    description?: string;
    imagePath?: string;
    githubUrl?: string;
    projectUrl?: string;
    createdBy?: number;
}

export interface UpdateProjectData {
    name?: string;
    description?: string;
    imagePath?: string;
    githubUrl?: string;
    projectUrl?: string;
}

export interface ProjectFilters {
    deleted?: boolean;
    createdBy?: number;
    name?: string;
}

export class ProjectRepository {
    async create(data: CreateProjectData) {
        return await prisma.project.create({
            data: {
                name: data.name,
                description: data.description || null,
                imagePath: data.imagePath || null,
                githubUrl: data.githubUrl || null,
                projectUrl: data.projectUrl || null,
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
                MappingProjectTechnology: {
                    include: {
                        technology: true,
                    },
                },
            },
        });
    }

    async findById(id: number) {
        return await prisma.project.findFirst({
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
                MappingProjectTechnology: {
                    include: {
                        technology: true,
                    },
                },
            },
        });
    }

    async findAll(filters: ProjectFilters = {}) {
        return await prisma.project.findMany({
            where: {
                deleted: filters.deleted ?? false,
                createdBy: filters.createdBy,
                name: filters.name ? {
                    contains: filters.name,
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
                MappingProjectTechnology: {
                    include: {
                        technology: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findByName(name: string) {
        return await prisma.project.findFirst({
            where: {
                name: {
                    equals: name,
                },
                deleted: false,
            },
            include: {
                MappingProjectTechnology: {
                    include: {
                        technology: true,
                    },
                },
            },
        });
    }

    async update(id: number, data: UpdateProjectData, updatedBy?: number) {
        return await prisma.project.update({
            where: { id },
            data: {
                ...data,
                updatedBy,
                updatedAt: new Date(),
            },
            include: {
                MappingProjectTechnology: {
                    include: {
                        technology: true,
                    },
                },
            },
        });
    }

    async addTechnology(projectId: number, technologyId: number) {
        return await prisma.mappingProjectTechnology.create({
            data: {
                projectId,
                technologyId,
            },
        });
    }

    async removeTechnology(projectId: number, technologyId: number) {
        return await prisma.mappingProjectTechnology.deleteMany({
            where: {
                projectId,
                technologyId,
            },
        });
    }

    async updateTechnologies(projectId: number, technologyIds: number[]) {
        // Remove existing technologies
        await prisma.mappingProjectTechnology.deleteMany({
            where: {
                projectId,
            },
        });

        // Add new technologies
        if (technologyIds.length > 0) {
            await prisma.mappingProjectTechnology.createMany({
                data: technologyIds.map(technologyId => ({
                    projectId,
                    technologyId,
                })),
            });
        }

        return await this.findById(projectId);
    }

    async delete(id: number, deletedBy?: number) {
        return await prisma.project.update({
            where: { id },
            data: {
                deleted: true,
                deletedBy,
                deletedAt: new Date(),
            },
        });
    }

    async hardDelete(id: number) {
        // First delete associated technology mappings
        await prisma.mappingProjectTechnology.deleteMany({
            where: {
                projectId: id,
            },
        });

        return await prisma.project.delete({
            where: { id },
        });
    }

    async getProjectsByTechnology(technologyId: number) {
        return await prisma.project.findMany({
            where: {
                deleted: false,
                MappingProjectTechnology: {
                    some: {
                        technologyId,
                    },
                },
            },
            include: {
                MappingProjectTechnology: {
                    include: {
                        technology: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getProjectsCount(): Promise<number> {
        return await prisma.project.count({
            where: {
                deleted: false,
            },
        });
    }
} 