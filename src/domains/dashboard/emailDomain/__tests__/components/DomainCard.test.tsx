import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom'; // Required to mock routing context
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { paths } from '@src/routes/paths';

import DomainCard from '../../components/DomainCard';

vi.mock('react-router-dom', async importOriginal => {
    const actual: {} = await importOriginal();
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

describe('DomainCard Component', () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    });

    it('navigates to the correct page with productId when the card is clicked', () => {
        const productId = 123;
        const { container } = render(
            <BrowserRouter>
                <DomainCard
                    image="/path/to/image.png"
                    name="Test Name"
                    offersText="Special Offers"
                    productId={productId}
                />
            </BrowserRouter>
        );

        const card = container.querySelector('.ant-card'); // Selecting the card by class name
        fireEvent.click(card!);

        expect(mockNavigate).toHaveBeenCalledWith(
            `${paths.dashboard.emailDomain}/${paths.emailDomain.detailsPage}`,
            { state: { productId } }
        );
    });

    it('renders the correct name and offersText from props', () => {
        const { getByText } = render(
            <DomainCard
                image="/path/to/image.png"
                name="Test Domain"
                offersText="Limited Time Offer"
                productId={1}
            />
        );

        expect(getByText('Test Domain')).toBeInTheDocument();
        expect(getByText('Limited Time Offer')).toBeInTheDocument();
    });

    it('renders the correct image source from props', () => {
        const { getByRole } = render(
            <DomainCard
                image="/path/to/image.png"
                name="Test Domain"
                offersText="Limited Time Offer"
                productId={1}
            />
        );

        const img = getByRole('img');
        expect(img).toHaveAttribute('src', '/path/to/image.png');
    });

    it('applies correct class names to the card and its elements', () => {
        const { container, getByText } = render(
            <DomainCard
                image="/path/to/image.png"
                name="Test Domain"
                offersText="Limited Time Offer"
                productId={1}
            />
        );

        const card = container.querySelector('.relative');
        expect(card).toHaveClass('_scale_on_hover');

        const nameText = getByText('Test Domain');
        expect(nameText).toHaveClass('text-red-400');

        const offersText = getByText('Limited Time Offer');
        expect(offersText).toHaveClass('text-textGrey');
    });
});
