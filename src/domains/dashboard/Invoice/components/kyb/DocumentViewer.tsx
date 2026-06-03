import React from 'react';

import { PaperClipOutlined } from '@ant-design/icons';
import { Flex, theme, Typography } from 'antd';

interface CertificateCardProps {
    label?: string;
    documentName: string;
    link?: string;
}
const DocumentViewer = ({ label, documentName, link }: CertificateCardProps) => {
    const {
        token: { colorPrimary },
    } = theme.useToken();
    return (
        <Flex vertical gap={10}>
            {/* <Typography.Text className=" text-titleText font-normal text-sm">
                {label}
            </Typography.Text> */}
            <Flex
                className=" border sm:mt-8 border-solid border-gray-200 px-3 py-1 rounded-md"
                align="center"
                justify="space-between"
            >
                <Flex gap={8}>
                    <PaperClipOutlined />
                    <Typography.Link
                        style={{ color: colorPrimary }}
                        href={link}
                        target="_blank"
                        className="font-normal text-sm"
                    >
                        {documentName}
                    </Typography.Link>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default DocumentViewer;
