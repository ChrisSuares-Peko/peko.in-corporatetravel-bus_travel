/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';

import { Worker, Viewer, DocumentLoadEvent } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { Flex } from 'antd';

import { useAppSelector, useAppDispatch } from '@src/hooks/store';

import '@react-pdf-viewer/zoom/lib/styles/index.css';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';

import '../../assets/styles.css';
import { setESignDocData } from '../../slices/eSignDocSlice';

interface ThumbnailExampleProps {}

const ThumbnailExample: React.FC<ThumbnailExampleProps> = () => {
    const dispatch = useAppDispatch();
    const documentBase64 = useAppSelector(state => state.reducer.eSignDoc.documentBase64);

    const thumbnailPluginInstance = thumbnailPlugin();
    const { Thumbnails } = thumbnailPluginInstance;

    const zoomPluginInstance = zoomPlugin();
    const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;

    const handleDocumentLoad = (e: DocumentLoadEvent) => {
        const { numPages } = e.doc;
        dispatch(setESignDocData({ pageNumbers: numPages }));
    };
    return (
        <Flex className="thumbnail-example-container h-[18rem] sm:h-[50rem] border  rounded-r-md sm:rounded-none">
            <Flex className="w-2/12">
                <Thumbnails />
            </Flex>
            <Flex className="w-10/12 justify-center bg-[#F9FAFC]">
                <Flex vertical className="w-full sm:w-10/12 rpv-core__viewer">
                    <Flex justify="center" align="center" className="p-1">
                        <ZoomOutButton />
                        <ZoomPopover />
                        <ZoomInButton />
                    </Flex>
                    <Flex className="w-full overflow-auto">
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                            <Viewer
                                fileUrl={documentBase64!}
                                plugins={[zoomPluginInstance, thumbnailPluginInstance]}
                                onDocumentLoad={handleDocumentLoad}
                            />
                        </Worker>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default ThumbnailExample;
