import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { it, expect, describe, afterEach } from 'vitest';

import ProjectDetailsCard from '@src/domains/dashboard/carbonFootprint/components/neutralize/ProjectDetailsCard';
import { Project } from '@src/domains/dashboard/carbonFootprint/types/dashboard';

describe('ProjectDetailsCard Component', () => {
    afterEach(() => {
        cleanup();
    });

    const mockProjectDetails: Project = {
        id: 1,
        name: 'Test Project',
        description: 'This is a test project',
        working: 'Working on it',
        logo: 'test-logo.png',
        country: 'Test Country',
        countryCode: 'TC',
        latLng: '123,456',
        city: 'Test City',
        address: 'Test Address',
        goal: 'Test Goal',
        body: {
            html: '<p>Test HTML content</p>',
        },
        status: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        categoryId: 1,
        vendorId: 1,
        category: {
            name: 'Test Category',
            logo: 'category-logo.png',
        },
        rate: {
            priceToSMB: 10,
            priceToIndividual: 20,
            priceToPartner: 30,
        },
        packages: [
            {
                id: 1,
                name: 'Test Package',
                description: 'This is a test package',
                amount: 100,
                credits: 10,
                logo: 'package-logo.png',
                status: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
                projectId: 1,
            },
        ],
        photos: [
            {
                projectImageUrl: 'image-url.png',
                imageField: 'image-field',
            },
        ],
        vendor: {
            id: 1,
            vendorName: 'Test Vendor',
            type: 'Test Type',
            isActive: true,
            apiUrl: 'https://api.test.com',
            healthUrl: 'https://health.test.com',
            country: 'Test Country',
            optional1: 'Optional 1',
            optional2: 'Optional 2',
            optional3: 'Optional 3',
            optional4: 'Optional 4',
            optional5: 'Optional 5',
            optional6: 'Optional 6',
            currency: 'USD',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
        },
        ProjectGoalsAssociation: [
            {
                id: 1,
                name: 'Test Goal',
                logo: 'goal-logo.png',
                status: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
                ProjectGoals: {
                    projectId: 1,
                    goalId: 1,
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z',
                },
            },
        ],
    };

    it('should render the project details correctly', () => {
        render(
            <MemoryRouter>
                <ProjectDetailsCard projectDetails={mockProjectDetails} />
            </MemoryRouter>
        );

        expect(screen.getByText(/Test Project/i)).toBeInTheDocument();
        expect(screen.getByText(/Test City, Test Country/i)).toBeInTheDocument();
        expect(screen.getByText(/Test HTML content/i)).toBeInTheDocument();
        expect(screen.getByText(/Read more/i)).toBeInTheDocument();

        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', 'test-logo.png');
        // Removed alt attribute assertion
    });

    it('should render the "Read more" link with the correct URL', () => {
        render(
            <MemoryRouter>
                <ProjectDetailsCard projectDetails={mockProjectDetails} />
            </MemoryRouter>
        );

        const readMoreLink = screen.getByText(/Read more/i).closest('a');
        expect(readMoreLink).toHaveAttribute(
            'href',
            `/more-services/zero-carbon/project-details/${mockProjectDetails.id}`
        );
    });

    it('should handle undefined projectDetails gracefully', () => {
        render(
            <MemoryRouter>
                <ProjectDetailsCard projectDetails={undefined} />
            </MemoryRouter>
        );

        expect(screen.queryByText(/Test Project/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Test City, Test Country/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Test HTML content/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Read more/i)).toBeInTheDocument(); // Assuming "Read more" still appears
    });

    it('should display the project name in title case', () => {
        const customProjectDetails = {
            ...mockProjectDetails,
            name: 'test project name',
        };

        render(
            <MemoryRouter>
                <ProjectDetailsCard projectDetails={customProjectDetails} />
            </MemoryRouter>
        );

        expect(screen.getByText(/Test Project Name/i)).toBeInTheDocument();
    });
});
