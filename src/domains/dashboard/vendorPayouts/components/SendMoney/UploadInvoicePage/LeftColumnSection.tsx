import React from 'react';

import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { Image, Typography, Row, Col, Flex } from 'antd';
import { ReactSVG } from 'react-svg';

import uploadIcon from '@domains/dashboard/Invoice/assets/UploadIcon.svg';

const { Text } = Typography;

const LeftColumnSection: React.FC<{
    files: any[];
    previews: any[];
    viewPdf: any;
    fileSelected: boolean;
    fileInputRef: React.RefObject<HTMLInputElement>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ files, previews, viewPdf, fileSelected, fileInputRef, handleChange }) => {
    const newPlugin = defaultLayoutPlugin();

    return (
        <Flex className="border rounded-md p-3 md:p-0 flex flex-col h-full">
            <input
                type="file"
                onChange={handleChange}
                className="mb-3"
                multiple
                accept="application/pdf"
                style={{ display: 'none' }}
                ref={fileInputRef}
                disabled={fileSelected}
            />
            <Flex
                className="pdf-container w-full overflow-y-auto flex-grow flex items-center justify-center"
                onClick={() => !fileSelected && fileInputRef?.current?.click()}
                style={{ maxHeight: 'calc(140vh - 140px)' }} // Adjust height as needed
            >
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    {viewPdf && <Viewer fileUrl={viewPdf} plugins={[newPlugin]} />}
                </Worker>
            </Flex>

            {previews.length > 0 && (
                <Row className="image-previews mt-3" gutter={[16, 16]}>
                    {previews.map((img: any, index: number) => (
                        <Col key={index} span={24} md={12} className="mb-3">
                            <Image
                                preview={false}
                                src={img}
                                alt={`preview ${index}`}
                                onClick={() => !fileSelected && fileInputRef?.current?.click()}
                            />
                        </Col>
                    ))}
                </Row>
            )}

            {!viewPdf && previews.length === 0 && (
                <Flex
                    className="flex flex-col items-center justify-center text-center mt-3"
                    onClick={() => !fileSelected && fileInputRef?.current?.click()}
                    style={{ flexGrow: 1 }} // Ensures the container grows to fill available space
                >
                    <ReactSVG src={uploadIcon} />
                    <Text className="font-medium mt-2">Click file to this area to upload</Text>
                    <Text className="text-xs mt-1" style={{ color: '#999' }}>
                        Upload receipt in PDF format
                    </Text>
                </Flex>
            )}
        </Flex>
    );
};

export default LeftColumnSection;
