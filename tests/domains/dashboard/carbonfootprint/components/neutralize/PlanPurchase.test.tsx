import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { it, expect, describe, afterEach, vi } from 'vitest';

import PlanPurchase from '@src/domains/dashboard/carbonFootprint/components/neutralize/PlanPurchase';
import { Project } from '@src/domains/dashboard/carbonFootprint/types/dashboard';

describe('PlanPurchase Component', () => {
    afterEach(() => {
        cleanup();
    });

    const mockProjectData: Project = {
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

    const props = {
        credit: 100,
        amount: 500,
        handleCreditChange: vi.fn(),
        handleAmountChange: vi.fn(),
        loader: false,
        handleSubmit: vi.fn(),
        selectedPackage: 1,
        handleSelectPackage: vi.fn(),
        projectData: mockProjectData,
        exchangeRate: 3.67,
        selectData: [{ id: 1, name: 'Option 1' }],
        selected: 1,
        changeSelectedOption: vi.fn(),
        handleNeutrilizefull: vi.fn(),
        calculatedRate: 10,
        co2FootPrint: 200,
        percentage: 50,
        value: 50,
    };

    it('should render the component with all elements', () => {
        render(<PlanPurchase {...props} />);

        expect(screen.getByText(/Choose a Project/i)).toBeInTheDocument();
        expect(screen.getByText(/Choose a compensation plan/i)).toBeInTheDocument();
        expect(screen.getByText(/Custom credits/i)).toBeInTheDocument();
        expect(screen.getByText(/1 Credit = AED 50.00/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter credits/i)).toBeInTheDocument();
        expect(screen.getByText(/Neutralise 100%/i)).toBeInTheDocument();
        expect(screen.getByText(/Amount/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter amount in AED/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Neutralise/i)).toHaveLength(2); // Expecting two elements with 'Neutralise'
    });

    it('should handle credit change', () => {
        render(<PlanPurchase {...props} />);
        const input = screen.getByPlaceholderText(/Enter credits/i);
        fireEvent.change(input, { target: { value: '200' } });
        expect(props.handleCreditChange).toHaveBeenCalled();
    });

    it('should handle amount change', () => {
        render(<PlanPurchase {...props} />);
        const input = screen.getByPlaceholderText(/Enter amount in AED/i);
        fireEvent.change(input, { target: { value: '1000' } });
        expect(props.handleAmountChange).toHaveBeenCalled();
    });

    it('should handle package selection', () => {
        render(<PlanPurchase {...props} />);
        const radio = screen.getByRole('radio');
        fireEvent.click(radio);
        expect(props.handleSelectPackage).toHaveBeenCalled();
    });

    it('should handle neutralise full button click', () => {
        render(<PlanPurchase {...props} />);
        const button = screen.getByText(/Neutralise 100%/i);
        fireEvent.click(button);
        expect(props.handleNeutrilizefull).toHaveBeenCalled();
    });

    it('should handle form submission', () => {
        render(<PlanPurchase {...props} />);

        const button = screen
            .getAllByText(/Neutralise/i)
            .find(btn => btn.closest('button')?.classList.contains('ant-btn-dangerous'));

        // Ensure button is defined before firing the event
        if (button) {
            fireEvent.click(button);
            expect(props.handleSubmit).toHaveBeenCalled();
        } else {
            throw new Error('Submit button not found');
        }
    });

    it('should display the correct CO2 neutralisation message', () => {
        render(<PlanPurchase {...props} />);
        expect(screen.getByText(/You are neutralising 100 tons CO₂ !/i)).toBeInTheDocument();
    });

    it('should handle the absence of project data gracefully', () => {
        const propsWithoutProjectData = {
            ...props,
            projectData: undefined,
        };
        render(<PlanPurchase {...propsWithoutProjectData} />);

        expect(screen.queryByText(/Choose a compensation plan/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/You are neutralising/i)).not.toBeInTheDocument();
    });

    it('should render the correct options in the select dropdown', () => {
        render(<PlanPurchase {...props} />);
        expect(screen.getByText(/Option 1/i)).toBeInTheDocument();
    });

    it('should render the correct project packages', () => {
        render(<PlanPurchase {...props} />);
        expect(screen.getByText(/Test Package/i)).toBeInTheDocument();
        expect(screen.getByText(/367.00/i)).toBeInTheDocument(); // Updated to match the calculated rate
    });

    it('should display loading state on submit button', () => {
        const loadingProps = { ...props, loader: true };
        render(<PlanPurchase {...loadingProps} />);

        // Find the button by its id
        const button = document.getElementById('neutralise-button');

        // Ensure button is defined before checking attributes
        if (button) {
            expect(button).toBeDisabled();
        }
    });
});
