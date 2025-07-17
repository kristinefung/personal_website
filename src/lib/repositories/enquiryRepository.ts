import { prisma } from '../prisma';

export interface CreateEnquiryData {
    name: string;
    email?: string;
    phone?: string;
    subject: string;
    message: string;
}

export interface EnquiryFilters {
    deleted?: boolean;
    createdBy?: number;
}

export class EnquiryRepository {
    async create(data: CreateEnquiryData) {
        return await prisma.enquiry.create({
            data: {
                name: data.name,
                email: data.email || null,
                phone: data.phone || null,
                subject: data.subject,
                message: data.message,
            },
        });
    }

    async findById(id: number) {
        return await prisma.enquiry.findFirst({
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

    async findAll(filters: EnquiryFilters = {}) {
        return await prisma.enquiry.findMany({
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
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async update(id: number, data: Partial<CreateEnquiryData>, updatedBy?: number) {
        return await prisma.enquiry.update({
            where: { id },
            data: {
                ...data,
                updatedBy,
                updatedAt: new Date(),
            },
        });
    }

    async delete(id: number, deletedBy?: number) {
        return await prisma.enquiry.update({
            where: { id },
            data: {
                deleted: true,
                deletedBy,
                deletedAt: new Date(),
            },
        });
    }

    async hardDelete(id: number) {
        return await prisma.enquiry.delete({
            where: { id },
        });
    }
} 