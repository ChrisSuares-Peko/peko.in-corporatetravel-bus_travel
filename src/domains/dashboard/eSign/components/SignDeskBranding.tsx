import type { FC } from 'react';

import { Typography, Image } from 'antd';
import { Flex } from 'antd/lib';

import SignDeskPng from '@domains/dashboard/eSign/assets/SignDesk.png';
import useScreenSize from '@src/hooks/useScreenSize';

interface SignDeskBrandingProps {
    className?: string;
    position?: 'end' | 'center' | 'start';
}

const SignDeskBranding: FC<SignDeskBrandingProps> = ({ className, position = 'end' }) => {
    const { sm } = useScreenSize();
    return (
        <Flex justify={position}>
            <Flex vertical>
                <Typography.Text className={`text-xs ${className}`}>Partnered With</Typography.Text>
                <Image src={SignDeskPng} preview={false} width={sm ? 150 : 120} />
            </Flex>
        </Flex>
    );
};

export default SignDeskBranding;
