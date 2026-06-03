import { cleanup, render, screen } from '@testing-library/react';
import { it, expect, describe, afterEach } from 'vitest';

import EarningsIcon from '@src/assets/icons/Earnings.svg';
import PriceInfoCard from '@src/domains/dashboard/Home/components/PriceInfoCard';

describe('PriceInfoCard', () => {
    afterEach(() => {
        cleanup();
    });

    const formatNumberWithLocalString = (num: number) => num.toLocaleString('en-US');
    const props = {
        title: 'Current Month Spend',
        value: `${formatNumberWithLocalString(1000)}`,
        currency: 'AED',
        bgColor: 'yellow-bg',
        icon: EarningsIcon,
    };

    it('should render with default props', () => {
        render(<PriceInfoCard {...props} />);
        screen.debug();

        expect(screen.getByText(/Current Month Spend/i)).toBeInTheDocument();
        expect(screen.getByText(/AED/i)).toBeInTheDocument();

        expect(screen.getByText(/1,000/i)).toBeInTheDocument();

        const iconDiv = screen.getByTestId('icon-svg');
        expect(iconDiv).toBeInTheDocument();

        const svgSrcDiv = iconDiv.querySelector('div[data-src]');
        expect(svgSrcDiv).toHaveAttribute('data-src', props.icon);
    });

    it('should render with different props', () => {
        const customProps = {
            title: 'Total Revenue',
            value: `${formatNumberWithLocalString(5000)}`,
            currency: 'USD',
            bgColor: 'blue-bg',
            icon: EarningsIcon,
            isMobile: true,
        };

        render(<PriceInfoCard {...customProps} />);

        expect(screen.getByText(/Total Revenue/i)).toBeInTheDocument();
        expect(screen.getByText(/USD/i)).toBeInTheDocument();
        expect(screen.getByText(/5,000/i)).toBeInTheDocument();

        const mobileIcon = screen.queryByTestId('icon-svg-mobile');
        expect(mobileIcon).toBeInTheDocument();
    });

    it('should render without icon when icon prop is undefined', () => {
        const noIconProps = {
            ...props,
            icon: undefined,
        };

        render(<PriceInfoCard {...noIconProps} />);

        const iconElement = screen.queryByTestId('icon-svg');
        expect(iconElement).not.toBeInTheDocument();

        const mobileIconElement = screen.queryByTestId('icon-svg-mobile');
        expect(mobileIconElement).not.toBeInTheDocument();
    });

    it('should handle large numbers and long titles', () => {
        const largeNumberProps = {
            ...props,
            value: `${formatNumberWithLocalString(10000000)}`,
            title: 'A very long title that might overflow or need truncation',
        };

        render(<PriceInfoCard {...largeNumberProps} />);

        expect(
            screen.getByText(/A very long title that might overflow or need truncation/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/10,000,000/i)).toBeInTheDocument();
    });

    it('should handle missing optional props gracefully', () => {
        const propsWithMissingOptional = {
            ...props,
            reference: undefined,
        };

        render(<PriceInfoCard {...propsWithMissingOptional} />);

        expect(screen.getByText(/Current Month Spend/i)).toBeInTheDocument();
        expect(screen.getByText(/AED/i)).toBeInTheDocument();
        expect(screen.getByText(/1,000/i)).toBeInTheDocument();
    });

    it('should render correctly on mobile and desktop viewports', () => {
        const mobileProps = { ...props, isMobile: true };
        const desktopProps = { ...props, isMobile: false };

        const { container: mobileContainer } = render(<PriceInfoCard {...mobileProps} />);
        expect(
            mobileContainer.querySelector('[data-testid="icon-svg-mobile"]')
        ).toBeInTheDocument();
        expect(mobileContainer.querySelector('[data-testid="icon-svg"]')).toBeNull();

        const { container: desktopContainer } = render(<PriceInfoCard {...desktopProps} />);
        expect(desktopContainer.querySelector('[data-testid="icon-svg"]')).toBeInTheDocument();
        expect(desktopContainer.querySelector('[data-testid="icon-svg-mobile"]')).toBeNull();
    });
});
