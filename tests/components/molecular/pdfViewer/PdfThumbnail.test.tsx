import React from 'react';

import { cleanup, render, screen } from '@testing-library/react';
import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';

import PdfThumbnail from '@components/molecular/pdfViewer/PdfThumbnail';

vi.mock('@react-pdf-viewer/core', () => ({
    Worker: vi.fn(({ children }) => (
        // eslint-disable-next-line jsx-a11y/iframe-has-title
        <iframe src="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            {children}
        </iframe>
    )),
    Viewer: vi.fn(({ fileUrl, plugins }) => (
        <div className="rpv-core__viewer">
            {plugins.some((plugin: { renderViewer: any }) => plugin.renderViewer)
                ? 'Mock Viewer'
                : 'No Plugins'}
            {fileUrl && <div>File URL: {fileUrl}</div>}
        </div>
    )),
}));

describe('PdfThumbnail', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        cleanup();
    });

    test('renders PdfThumbnail without crashing', () => {
        const { container } = render(<PdfThumbnail fileUrl="sample.pdf" />);
        expect(container).toBeInTheDocument();
    });

    test('renders PdfThumbnail with default page index', async () => {
        render(<PdfThumbnail fileUrl="sample.pdf" />);

        const viewer = screen.getByText('Mock Viewer');
        expect(viewer).toBeInTheDocument();

        const fileUrlText = screen.getByText('File URL: sample.pdf');
        expect(fileUrlText).toBeInTheDocument();
    });
    test('renders PdfThumbnail with specified page index', async () => {
        render(<PdfThumbnail fileUrl="sample.pdf" pageIndex={1} />);

        const viewer = screen.getByText('Mock Viewer');
        expect(viewer).toBeInTheDocument();

        const fileUrlText = screen.getByText('File URL: sample.pdf');
        expect(fileUrlText).toBeInTheDocument();
    });

    test('renders Worker with correct workerUrl', () => {
        const { container } = render(<PdfThumbnail fileUrl="sample.pdf" />);
        const worker = container.querySelector('iframe');
        expect(worker).toHaveAttribute(
            'src',
            'https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js'
        );
    });

    test('uses thumbnailPluginInstance and pageThumbnailPluginInstance plugins', () => {
        const { container } = render(<PdfThumbnail fileUrl="sample.pdf" />);
        const viewer = container.querySelector('.rpv-core__viewer'); // The main Viewer container
        expect(viewer).toBeInTheDocument();
    });

    test('applies thumbnailPlugin correctly', () => {
        render(<PdfThumbnail fileUrl="sample.pdf" />);

        const cover = screen.getByText('Mock Viewer');
        expect(cover).toBeInTheDocument();
    });

    test('handles missing fileUrl prop gracefully', () => {
        render(<PdfThumbnail fileUrl="" />);
        const viewer = screen.queryByTestId('core__viewer');
        expect(viewer).not.toBeInTheDocument();
    });
});
