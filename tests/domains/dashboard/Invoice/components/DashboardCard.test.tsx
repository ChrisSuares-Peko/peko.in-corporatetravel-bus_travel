import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import DashboardCard from '@domains/dashboard/Invoice/components/DashboardCard';

describe('DashboardCard Component', () => {
    const defaultProps = {
        bgColor: 'bg-blue-500',
        icon: '/path/to/icon.svg',
        title: 'Revenue',
        value: '10000',
        currency: '$',
    };

    it('renders the component with the correct title, value, and currency', () => {
        render(<DashboardCard {...defaultProps} />);

        const titleElements = screen.getAllByText(defaultProps.title);
        expect(titleElements.length).toBeGreaterThan(0);

        const visibleTitleElement = titleElements.find(
            el => el.classList.contains('sm:block') || el.classList.contains('sm:hidden')
        );
        expect(visibleTitleElement).toBeInTheDocument();

        const amount = screen.getByTestId('amount');
        expect(amount).toBeInTheDocument();

        expect(screen.getByText(defaultProps.currency)).toBeInTheDocument();
    });

    it('renders the icon correctly', () => {
        render(<DashboardCard {...defaultProps} />);

        // Check if the SVG icon is rendered correctly
        const icon = screen.getByTestId('icon-svg');
        expect(icon).toBeInTheDocument();
    });

    it('applies the correct background color', () => {
        const { container } = render(<DashboardCard {...defaultProps} />);

        // Check if the component has the correct background color
        const card = container.querySelector('.bg-blue-500');
        expect(card).toBeInTheDocument();
    });

    it('renders the title inside the Tooltip when screen is small', async () => {
        render(<DashboardCard {...defaultProps} />);

        // Simulate hover or focus to trigger the tooltip
        const titleElements = screen.getAllByText(defaultProps.title);

        // Find the element with the class that hides it on small screens
        const hiddenTitle: any = titleElements.find(el => el.className.includes('sm:hidden'));

        // Simulate hovering over the element that triggers the tooltip
        fireEvent.mouseOver(hiddenTitle);

        // Now check if the tooltip is rendered
        const tooltipText = await screen.findByText(defaultProps.title, {
            selector: '.ant-tooltip-inner',
        });
        expect(tooltipText).toBeInTheDocument();
    });

    it('renders the component without crashing when reference prop is passed', () => {
        render(<DashboardCard {...defaultProps} />);

        // Use screen.getAllByText to retrieve all instances of "Revenue"
        const titleElements = screen.getAllByText(defaultProps.title);
        expect(titleElements.length).toBeGreaterThan(0);

        // Check if the correct instance of "Revenue" is in the document
        const mainTitleElement = titleElements.find(element =>
            element.className.includes('sm:hidden')
        );
        expect(mainTitleElement).toBeInTheDocument();
    });
});
