import React from 'react';

import { PaperClipOutlined } from '@ant-design/icons';
import { Flex, Typography, theme } from 'antd';

interface CertificateCardProps {
    // label: string;
    certificateName: string;
    link: any;
    highlight?: boolean;
}
const CertificateCard = ({
    // label,
    certificateName,
    link,
    highlight,
}: CertificateCardProps) => {
    const {
        token: { colorPrimary },
    } = theme.useToken();

    return (
        <Flex vertical gap={10}>
            <Typography.Text className="mt-2 text-titleText font-normal text-sm" />

            <Flex
                className={` border border-solid ${highlight ? 'border-blue-300' : 'border-gray-200'} px-3 py-2 rounded-md`}
                align="center"
                justify="space-between"
            >
                <Flex gap={8}>
                    <PaperClipOutlined />

                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="text-blue-700"
                    >
                        {certificateName}
                    </a>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default CertificateCard;
