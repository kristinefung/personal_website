import { CreateEnquiryRequest, CreateEnquiryResponse, EnquiryResponse, ApiErrorResponse } from '@/types/api';

class EnquiryApiService {
    private baseUrl = '/api/enquiries';

    async createEnquiry(data: CreateEnquiryRequest): Promise<CreateEnquiryResponse> {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to create enquiry');
        }

        return result;
    }

    async getEnquiries(includeDeleted = false): Promise<EnquiryResponse[]> {
        const url = new URL(this.baseUrl, window.location.origin);
        if (includeDeleted) {
            url.searchParams.set('includeDeleted', 'true');
        }

        const response = await fetch(url.toString());
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch enquiries');
        }

        return result;
    }

    async getEnquiryById(id: number): Promise<EnquiryResponse> {
        const response = await fetch(`${this.baseUrl}/${id}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch enquiry');
        }

        return result;
    }

    async updateEnquiry(id: number, data: Partial<CreateEnquiryRequest>): Promise<{ message: string; enquiry: EnquiryResponse }> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to update enquiry');
        }

        return result;
    }

    async deleteEnquiry(id: number, hardDelete = false): Promise<{ message: string }> {
        const url = new URL(`${this.baseUrl}/${id}`, window.location.origin);
        if (hardDelete) {
            url.searchParams.set('hard', 'true');
        }

        const response = await fetch(url.toString(), {
            method: 'DELETE',
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to delete enquiry');
        }

        return result;
    }
}

export const enquiryApi = new EnquiryApiService(); 