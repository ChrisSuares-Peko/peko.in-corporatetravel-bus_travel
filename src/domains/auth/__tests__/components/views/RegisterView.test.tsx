import { render, screen } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { useAppSelector } from '@src/hooks/store';

import RegisterView from '../../../components/views/RegisterView';

// Mock the subcomponents
vi.mock('../../../components/sections/RegisterStepOne', () => ({
    __esModule: true,
    default: () => <div>Mocked RegisterStepOne</div>,
}));

vi.mock('../../../components/sections/RegisterStepTwo', () => ({
    __esModule: true,
    default: () => <div>Mocked RegisterStepTwo</div>,
}));

vi.mock('../../../components/sections/RegisterStepThree', () => ({
    __esModule: true,
    default: () => <div>Mocked RegisterStepThree</div>,
}));

vi.mock('../../../components/sections/RegisterStepFour', () => ({
    __esModule: true,
    default: () => <div>Mocked RegisterStepFour</div>,
}));

vi.mock('../../../components/sections/RegisterStepFive', () => ({
    __esModule: true,
    default: () => <div>Mocked RegisterStepFive</div>,
}));

// Mock the Redux hook
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

describe('RegisterView Component', () => {
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders RegisterStepOne when currentStep is 1', () => {
        // Mock the selector to return step 1
        mockUseAppSelector.mockReturnValue(1);

        render(<RegisterView />);

        // Check if RegisterStepOne is rendered
        expect(screen.getByText('Mocked RegisterStepOne')).toBeInTheDocument();
    });

    it('renders RegisterStepTwo when currentStep is 2', () => {
        // Mock the selector to return step 2
        mockUseAppSelector.mockReturnValue(2);

        render(<RegisterView />);

        // Check if RegisterStepTwo is rendered
        expect(screen.getByText('Mocked RegisterStepTwo')).toBeInTheDocument();
    });

    it('renders RegisterStepThree when currentStep is 3', () => {
        // Mock the selector to return step 3
        mockUseAppSelector.mockReturnValue(3);

        render(<RegisterView />);

        // Check if RegisterStepThree is rendered
        expect(screen.getByText('Mocked RegisterStepThree')).toBeInTheDocument();
    });

    it('renders RegisterStepFour when currentStep is 4', () => {
        // Mock the selector to return step 4
        mockUseAppSelector.mockReturnValue(4);

        render(<RegisterView />);

        // Check if RegisterStepFour is rendered
        expect(screen.getByText('Mocked RegisterStepFour')).toBeInTheDocument();
    });

    it('renders RegisterStepFive when currentStep is 5', () => {
        // Mock the selector to return step 5
        mockUseAppSelector.mockReturnValue(5);

        render(<RegisterView />);

        // Check if RegisterStepFive is rendered
        expect(screen.getByText('Mocked RegisterStepFive')).toBeInTheDocument();
    });

    it('does not render any step if currentStep is not between 1 and 5', () => {
        // Mock the selector to return an invalid step
        mockUseAppSelector.mockReturnValue(6);

        render(<RegisterView />);

        // Check if none of the steps are rendered
        expect(screen.queryByText('Mocked RegisterStepOne')).not.toBeInTheDocument();
        expect(screen.queryByText('Mocked RegisterStepTwo')).not.toBeInTheDocument();
        expect(screen.queryByText('Mocked RegisterStepThree')).not.toBeInTheDocument();
        expect(screen.queryByText('Mocked RegisterStepFour')).not.toBeInTheDocument();
        expect(screen.queryByText('Mocked RegisterStepFive')).not.toBeInTheDocument();
    });
});
