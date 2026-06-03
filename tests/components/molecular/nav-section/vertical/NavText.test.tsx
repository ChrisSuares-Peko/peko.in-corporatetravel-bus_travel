import { cleanup, render } from '@testing-library/react';
import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';

import { NavText } from '@components/molecular/nav-section/vertical/NavText';

describe('NavText Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        cleanup();
    });

    test('renders Text component with provided text', () => {
        const { getByText } = render(NavText('Sample Text', false));
        expect(getByText('Sample Text')).toBeInTheDocument();
    });

    test('renders Text component with text-brandColor class when isActive is true', () => {
        const { container } = render(NavText('Active Text', true));
        expect(container.querySelector('.text-brandColor')).toBeInTheDocument();
    });

    test('renders Text component with text-navTextColor class when isActive is false', () => {
        const { container } = render(NavText('Inactive Text', false));
        expect(container.querySelector('.text-navTextColor')).toBeInTheDocument();
    });

    test('renders Free label when label is "free"', () => {
        const { getByText } = render(NavText('Some Text', false, 'free'));
        expect(getByText('Free')).toBeInTheDocument();
    });

    test('renders New label when label is "new"', () => {
        const { getByText } = render(NavText('Some Text', false, 'new'));
        expect(getByText('New')).toBeInTheDocument();
    });

    test('does not render label when label is undefined', () => {
        const { queryByText } = render(NavText('Some Text', false));
        expect(queryByText('Free')).not.toBeInTheDocument();
        expect(queryByText('New')).not.toBeInTheDocument();
    });

    test('does not render label when an invalid label is provided', () => {
        const { queryByText } = render(NavText('Some Text', false, 'invalid' as 'free' | 'new'));
        expect(queryByText('Free')).not.toBeInTheDocument();
        expect(queryByText('New')).not.toBeInTheDocument();
    });

    test('renders non-string text correctly', () => {
        const { getByText } = render(NavText(<strong>Bold Text</strong>, false));
        expect(getByText('Bold Text')).toBeInTheDocument();
    });
});
