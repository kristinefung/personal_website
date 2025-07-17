import { prisma } from '../prisma';

export interface CreateProfileData {
    bio: string;
    profileImagePath?: string;
    email?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    createdBy?: number;
}

export interface UpdateProfileData {
    bio?: string;
    profileImagePath?: string;
    email?: string;
    githubUrl?: string;
    linkedinUrl?: string;
}

export interface ProfileFilters {
    deleted?: boolean;
    createdBy?: number;
}

export class ProfileRepository {
    async create(data: CreateProfileData) {
        return await prisma.profile.create({
            data: {
                bio: data.bio,
                profileImagePath: data.profileImagePath || null,
                email: data.email || null,
                githubUrl: data.githubUrl || null,
                linkedinUrl: data.linkedinUrl || null,
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
                MappingProfileTechnology: {
                    include: {
                        technology: true,
                    },
                },
            },
        });
    }

    async findById(id: number) {
        return await prisma.profile.findFirst({
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
                MappingProfileTechnology: {
                    include: {
                        technology: true,
                    },
                },
            },
        });
    }

    async findAll(filters: ProfileFilters = {}) {
        return await prisma.profile.findMany({
            where: {
                deleted: filters.deleted ?? false,
                createdBy: filters.createdBy,
            },
            include: {
                createdByUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                MappingProfileTechnology: {
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

    async findFirst() {
        return await prisma.profile.findFirst({
            where: {
                deleted: false,
            },
            include: {
                MappingProfileTechnology: {
                    include: {
                        technology: true,
                    },
                },
            },
        });
    }

    async update(id: number, data: UpdateProfileData, updatedBy?: number) {
        return await prisma.profile.update({
            where: { id },
            data: {
                ...data,
                updatedBy,
                updatedAt: new Date(),
            },
            include: {
                MappingProfileTechnology: {
                    include: {
                        technology: true,
                    },
                },
            },
        });
    }

    async addTechnology(profileId: number, technologyId: number) {
        return await prisma.mappingProfileTechnology.create({
            data: {
                profileId,
                technologyId,
            },
        });
    }

    async removeTechnology(profileId: number, technologyId: number) {
        return await prisma.mappingProfileTechnology.deleteMany({
            where: {
                profileId,
                technologyId,
            },
        });
    }

    async updateTechnologies(profileId: number, technologyIds: number[]) {
        // Remove existing technologies
        await prisma.mappingProfileTechnology.deleteMany({
            where: {
                profileId,
            },
        });

        // Add new technologies
        if (technologyIds.length > 0) {
            await prisma.mappingProfileTechnology.createMany({
                data: technologyIds.map(technologyId => ({
                    profileId,
                    technologyId,
                })),
            });
        }

        return await this.findById(profileId);
    }

    async delete(id: number, deletedBy?: number) {
        return await prisma.profile.update({
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
        await prisma.mappingProfileTechnology.deleteMany({
            where: {
                profileId: id,
            },
        });

        return await prisma.profile.delete({
            where: { id },
        });
    }
} 