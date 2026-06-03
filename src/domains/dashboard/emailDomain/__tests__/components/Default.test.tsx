import React from 'react';

import { render, cleanup } from '@testing-library/react';
import { describe, vi, it, expect, beforeEach } from 'vitest';

import Default from '../../components/productDetails/Default';

describe('Default Component', () => {
    const setFormDataMock = vi.fn();
    const setIsFormSubmittedMock = vi.fn();
    const formData = {}; // You can customize this as needed
    beforeEach(() => {
        setFormDataMock.mockClear();
        setIsFormSubmittedMock.mockClear();
        vi.clearAllMocks();
        cleanup();
    });
    it('renders without crashing', () => {
        const { getByText } = render(
            <Default
                setFormData={setFormDataMock}
                formData={formData}
                setIsFormSubmitted={setIsFormSubmittedMock}
            />
        );
        expect(
            getByText(/Get email and productivity tools for your business/i)
        ).toBeInTheDocument();
        expect(
            getByText(/Our service offers a comprehensive suite of powerful apps/i)
        ).toBeInTheDocument();
    });

    it('shows no services available message', () => {
        const { getByText } = render(
            <Default
                setFormData={setFormDataMock}
                formData={formData}
                setIsFormSubmitted={setIsFormSubmittedMock}
            />
        );

        expect(getByText(/No services available/i)).toBeInTheDocument();
    });
});
