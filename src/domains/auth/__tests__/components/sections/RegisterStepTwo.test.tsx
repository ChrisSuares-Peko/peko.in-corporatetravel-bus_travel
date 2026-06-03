import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import StepTwo from '../../../components/sections/RegisterStepTwo';
import { previousStep } from '../../../slices/registerSlice';

// Mock dependencies
vi.mock('react-redux', () => ({
    useDispatch: vi.fn(),
}));

vi.mock('../../../components/forms/RegisterStepTwoForm', () => ({
    default: vi.fn(() => <div>Register Step Two Form</div>),
}));

vi.mock('../../../slices/registerSlice', async importOriginal => {
    const actual = (await importOriginal()) as typeof import('../../../slices/registerSlice');
    return {
        ...actual,
        previousStep: vi.fn(),
    };
});

describe('StepTwo Component', () => {
    const mockDispatch = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();
        (useDispatch as any).mockReturnValue(mockDispatch);
    });

    it('renders all elements correctly', () => {
        render(<StepTwo />);

        // Check if the "Create Password" text is present
        expect(screen.getByText('Create Password')).toBeInTheDocument();

        // Check if the background image is set
        const backgroundImage = screen.getByText(
            /All-in-one platform for SMBs to manage all their payments, expenses, travel, insurance, and automate operations/i
        );
        expect(backgroundImage).toBeInTheDocument();

        // Check if the "Go Back" button is present
        expect(screen.getByText('Go Back')).toBeInTheDocument();
    });

    it('dispatches previousStep action when "Go Back" is clicked', () => {
        render(<StepTwo />);

        // Find and click the "Go Back" text element
        fireEvent.click(screen.getByText('Go Back'));

        // Check if previousStep action is dispatched
        expect(mockDispatch).toHaveBeenCalledWith(previousStep());
    });

    it('shows the back icon image on smaller screens and dispatches previousStep action when clicked', () => {
        // Set up a small screen mock
        global.innerWidth = 500;
        global.dispatchEvent(new Event('resize'));

        render(<StepTwo />);

        // Check if the back icon image is present and clickable
        const backIcon = screen.getByAltText('goback');
        expect(backIcon).toBeInTheDocument();
        fireEvent.click(backIcon);

        // Check if previousStep action is dispatched
        expect(mockDispatch).toHaveBeenCalledWith(previousStep());
    });
});
