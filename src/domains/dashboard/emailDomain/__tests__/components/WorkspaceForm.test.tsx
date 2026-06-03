import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import WorkspaceForm from '../../components/WorkspaceForm';

describe('WorkspaceForm Component', () => {
    const setFormDataMock = vi.fn();
    const setIsFormSubmittedMock = vi.fn();

    beforeEach(() => {
        setFormDataMock.mockClear();
        setIsFormSubmittedMock.mockClear();
    });

    it('renders the form with required fields', () => {
        render(
            <WorkspaceForm
                setFormData={setFormDataMock}
                formData={{}}
                setIsFormSubmitted={setIsFormSubmittedMock}
            />
        );

        expect(screen.getByText(/Company Name/i)).toBeInTheDocument();
        expect(screen.getByText(/What is your email ID/i)).toBeInTheDocument();
        expect(screen.getByText(/What is your mobile number/i)).toBeInTheDocument();
    });

    it('shows validation error when required fields are empty', async () => {
        render(
            <WorkspaceForm
                setFormData={setFormDataMock}
                formData={{}}
                setIsFormSubmitted={setIsFormSubmittedMock}
            />
        );

        fireEvent.click(screen.getByText(/Next/i)); // Trigger form submission

        expect(await screen.findAllByText(/Required/i)).toHaveLength(7); // Adjust this according to number of required fields
    });
});
