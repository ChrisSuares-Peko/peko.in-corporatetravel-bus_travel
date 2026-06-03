import { render, screen } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { useAppSelector } from '@src/hooks/store';

import ForgotPasswordView from '../../../components/views/ForgotPasswordView';

// Mock the subcomponents
vi.mock('../../../components/sections/ForgotPasswordStepOne', () => ({
    __esModule: true,
    default: () => <div>Mocked ForgotPasswordStepOne</div>,
}));

vi.mock('../../../components/sections/ForgotPasswordStepTwo', () => ({
    __esModule: true,
    default: () => <div>Mocked ForgotPasswordStepTwo</div>,
}));

// Mock the Redux hook
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

describe('ForgotPasswordView Component', () => {
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders ForgotPasswordStepOne when currentStep is 1', () => {
        // Mock the selector to return step 1
        mockUseAppSelector.mockReturnValue(1);

        render(<ForgotPasswordView />);

        // Check if ForgotPasswordStepOne is rendered
        expect(screen.getByText('Mocked ForgotPasswordStepOne')).toBeInTheDocument();
    });

    it('renders ForgotPasswordStepTwo when currentStep is 2', () => {
        // Mock the selector to return step 2
        mockUseAppSelector.mockReturnValue(2);

        render(<ForgotPasswordView />);

        // Check if ForgotPasswordStepTwo is rendered
        expect(screen.getByText('Mocked ForgotPasswordStepTwo')).toBeInTheDocument();
    });

    it('does not render any step if currentStep is not 1 or 2', () => {
        // Mock the selector to return an invalid step
        mockUseAppSelector.mockReturnValue(3);

        render(<ForgotPasswordView />);

        // Check if neither of the steps are rendered
        expect(screen.queryByText('Mocked ForgotPasswordStepOne')).not.toBeInTheDocument();
        expect(screen.queryByText('Mocked ForgotPasswordStepTwo')).not.toBeInTheDocument();
    });
});
