import { cleanup, render, screen } from '@testing-library/react';
import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';

import FieldLabelValue from '@components/molecular/Text/FieldLabelValue';

describe('FieldLabelValue', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        cleanup();
    });

    test('renders FieldLabelValue component without crashing', () => {
        render(<FieldLabelValue label="Test Label" value="Test Value" />);
        expect(screen.getByText('Test Label')).toBeInTheDocument();
        expect(screen.getByText('Test Value')).toBeInTheDocument();
    });

    test('displays correct label and value', () => {
        render(<FieldLabelValue label="Label" value="Value" />);
        expect(screen.getByText('Label')).toBeInTheDocument();
        expect(screen.getByText('Value')).toBeInTheDocument();
    });

    test('displays N/A when value is null', () => {
        render(<FieldLabelValue label="Label" value={null} />);
        expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    test('displays N/A when value is undefined', () => {
        render(<FieldLabelValue label="Label" value={undefined} />);
        expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    test('displays correct value when value is a number', () => {
        render(<FieldLabelValue label="Label" value={123} />);
        expect(screen.getByText('123')).toBeInTheDocument();
    });

    test('displays correct value when value is a string', () => {
        render(<FieldLabelValue label="Label" value="String Value" />);
        expect(screen.getByText('String Value')).toBeInTheDocument();
    });
});
