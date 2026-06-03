import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { getAllProjectData } from '@src/domains/dashboard/carbonFootprint/api'; // Import directly
import useGetAllProjects from '@src/domains/dashboard/carbonFootprint/hooks/useGetAllProjects';
import {
    Project,
    projectListingResponse,
} from '@src/domains/dashboard/carbonFootprint/types/dashboard';
// Mock data
const mockProjects: Project[] = [
    {
        id: 1,
        name: 'Project One',
        description: 'A sample project',
        working: 'active',
        logo: 'https://example.com/logo1.png',
        country: 'Country A',
        countryCode: 'CA',
        latLng: '12.34,56.78',
        city: 'City A',
        address: '123 Street, City A, Country A',
        goal: 'Goal A',
        body: { html: '<p>Project Body</p>' },
        status: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        categoryId: 1,
        vendorId: 1,
        category: {
            name: 'Category A',
            logo: 'https://example.com/category-logo.png',
        },
        rate: {
            priceToSMB: 100,
            priceToIndividual: 50,
            priceToPartner: 75,
        },
        packages: [
            {
                id: 1,
                name: 'Package One',
                description: 'Sample Package',
                amount: 100,
                credits: 10,
                logo: 'https://example.com/package-logo.png',
                status: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-02T00:00:00Z',
                projectId: 1,
            },
        ],
        photos: [
            {
                projectImageUrl: 'https://example.com/photo1.png',
                imageField: 'field1',
            },
        ],
        vendor: {
            id: 1,
            vendorName: 'Vendor A',
            type: 'Type A',
            isActive: true,
            apiUrl: 'https://api.example.com',
            healthUrl: 'https://health.example.com',
            country: 'Country A',
            optional1: 'Optional 1',
            optional2: 'Optional 2',
            optional3: 'Optional 3',
            optional4: 'Optional 4',
            optional5: 'Optional 5',
            optional6: 'Optional 6',
            currency: 'USD',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-02T00:00:00Z',
        },
        ProjectGoalsAssociation: [
            {
                id: 1,
                name: 'Goal A',
                logo: 'https://example.com/goal-logo.png',
                status: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-02T00:00:00Z',
                ProjectGoals: {
                    projectId: 1,
                    goalId: 1,
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-02T00:00:00Z',
                },
            },
        ],
    },
    // Add more projects as needed
];

const mockProjectListingResponse: projectListingResponse = {
    success: true,
    data: mockProjects,
    count: mockProjects.length,
    totalPages: 1,
};

// Mock the API call
vi.mock('@src/domains/dashboard/carbonFootprint/api', () => ({
    getAllProjectData: vi.fn(), // This is mocked now
}));

// Mock the useAppSelector hook
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn().mockReturnValue({
        role: 'admin',
        id: 123,
    }),
}));

describe('useGetAllProjects', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch project data and update states', async () => {
        (getAllProjectData as any).mockResolvedValue(mockProjectListingResponse); // Use the mocked import directly

        const { result } = renderHook(() => useGetAllProjects('query', 1, 10));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.data).toEqual(mockProjects);
        expect(result.current.count).toBe(mockProjects.length);
        expect(result.current.totalPage).toBe(1);
    });

    it('should handle empty response gracefully', async () => {
        (getAllProjectData as any).mockResolvedValue({
            success: true,
            data: [],
            count: 0,
            totalPages: 0,
        });

        const { result } = renderHook(() => useGetAllProjects('query', 1, 10));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.data).toEqual([]);
        expect(result.current.count).toBe(0);
        expect(result.current.totalPage).toBe(0);
    });

    it('should handle API failure', async () => {
        (getAllProjectData as any).mockResolvedValue(false);

        const { result } = renderHook(() => useGetAllProjects('query', 1, 10));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.data).toBeUndefined();
        expect(result.current.count).toBeUndefined();
        expect(result.current.totalPage).toBeUndefined();
    });
});
