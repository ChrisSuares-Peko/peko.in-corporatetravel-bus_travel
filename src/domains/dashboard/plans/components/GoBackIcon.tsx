import type { FC } from 'react';

import { Flex, Typography, Image } from 'antd';

import back from '@assets/svg/grayBack.svg';

interface CancelAndBackProps {
    className?: string;
    url?: string;
}

const GoBackIcon: FC<CancelAndBackProps> = ({ className, url }) => {
    const handleGoBack = () => {
        window.location.href = url ?? '/plans';
    };

    return (
        <Flex
            className={`${className} cursor-pointer`}
            align="center"
            gap={6}
            onClick={handleGoBack}
        >
            <Image
                src={back}
                alt="goback"
                preview={false}
                style={{ width: '1.2rem', height: '1.2rem' }}
                className="z-50"
            />
            <Typography.Text className="text-[#4D4D4D]">Go Back</Typography.Text>
        </Flex>
    );
};

export default GoBackIcon;
