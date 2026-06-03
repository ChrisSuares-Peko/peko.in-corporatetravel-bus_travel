import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { getSingleProjectData } from '@src/domains/dashboard/carbonFootprint/api';
import useGetProjectDetails from '@src/domains/dashboard/carbonFootprint/hooks/useGetProjectDetails';
import {
    Project,
    singleViewResponse,
} from '@src/domains/dashboard/carbonFootprint/types/dashboard';
import { paths } from '@src/routes/paths';

// Mock data
const mockProject: Project = {
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
};

const mockSingleViewResponse: singleViewResponse = {
    success: true,
    data: mockProject,
};

// Mock the API call
vi.mock('@src/domains/dashboard/carbonFootprint/api', () => ({
    getSingleProjectData: vi.fn(),
}));

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

// Mock the useAppSelector hook
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn().mockReturnValue({
        role: 'admin',
        id: 123,
    }),
}));

describe('useGetProjectDetails', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch project details and update state', async () => {
        (getSingleProjectData as any).mockResolvedValue(mockSingleViewResponse);

        const { result } = renderHook(() => useGetProjectDetails('1'));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.projectData).toEqual(mockProject);
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should navigate to project listing if project data is not found', async () => {
        (getSingleProjectData as any).mockResolvedValue(false);

        const { result } = renderHook(() => useGetProjectDetails('1'));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.projectData).toBeUndefined();
        expect(mockNavigate).toHaveBeenCalledWith(
            `/${paths.zeroCarbon.index}/${paths.zeroCarbon.projectListing}`
        );
    });
});
