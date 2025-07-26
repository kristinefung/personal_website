import { enquiryApi } from '@/service/enquiryService';
import { CreateEnquiryRequest } from '@/types/api';

describe('EnquiryApiService.createEnquiry', () => {
    const mockRequest: CreateEnquiryRequest = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        subject: 'Test Subject',
        message: 'Test message',
    };

    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should create an enquiry successfully', async () => {
        const mockResponse = { id: 1, ...mockRequest };
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await enquiryApi.createEnquiry(mockRequest);
        expect(result).toEqual(mockResponse);
        expect(global.fetch).toHaveBeenCalledWith(
            '/api/enquiries',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockRequest),
            })
        );
    });

    it('should throw an error if the API returns an error', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Failed to create enquiry' }),
        });

        await expect(enquiryApi.createEnquiry(mockRequest)).rejects.toThrow('Failed to create enquiry');
    });
}); 