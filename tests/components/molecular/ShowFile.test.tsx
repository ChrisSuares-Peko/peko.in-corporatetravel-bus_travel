import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';

import ShowFile from '@components/molecular/viewFiles/ShowFile';

describe('ShowFile', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        cleanup();
    });

    test('renders ShowFile component without crashing', () => {
        render(<ShowFile label="Document" fileName="file.pdf" />);
        expect(screen.getByText('Document')).toBeInTheDocument();
        expect(screen.getByText('file.pdf')).toBeInTheDocument();
    });

    test('displays correct label and file name', () => {
        render(<ShowFile label="Document" fileName="file.pdf" />);
        expect(screen.getByText('Document')).toBeInTheDocument();
        expect(screen.getByText('file.pdf')).toBeInTheDocument();
    });

    test('displays link when provided', () => {
        render(<ShowFile label="Document" fileName="file.pdf" link="http://example.com" />);
        const linkElement = screen.getByText('file.pdf');
        expect(linkElement).toBeInTheDocument();
        expect(linkElement.closest('a')).toHaveAttribute('href', 'http://example.com');
    });

    test('does not render link when not provided', () => {
        render(<ShowFile label="Document" fileName="file.pdf" />);
        const linkElement = screen.queryByText('file.pdf');
        expect(linkElement).toBeInTheDocument();
        if (linkElement) {
            const anchorTag = linkElement.closest('a');
            expect(anchorTag).toBeInTheDocument();
            expect(anchorTag).not.toHaveAttribute('href');
        }
    });

    test('calls handleDeleteDocs when delete icon is clicked', () => {
        const handleDeleteDocs = vi.fn();
        render(
            <ShowFile label="Document" fileName="file.pdf" handleDeleteDocs={handleDeleteDocs} />
        );
        const deleteIcon = screen.getByRole('img', { name: /delete/i });
        fireEvent.click(deleteIcon);
        expect(handleDeleteDocs).toHaveBeenCalled();
    });

    test('does not call handleDeleteDocs when not provided', () => {
        const handleDeleteDocs = vi.fn();
        render(<ShowFile label="Document" fileName="file.pdf" />);
        const deleteIcon = screen.queryByRole('img', { name: /delete/i });
        if (deleteIcon) fireEvent.click(deleteIcon);
        expect(handleDeleteDocs).not.toHaveBeenCalled();
    });
});
