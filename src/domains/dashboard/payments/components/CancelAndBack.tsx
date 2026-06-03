import type { FC } from 'react';

import { Flex, Typography, Image } from 'antd';

import back from '@assets/svg/grayBack.svg';
import { useAppDispatch } from '@src/hooks/store';

import { resetPaymentData } from '../slices/payment';

interface CancelAndBackProps {
    className?: string;
}

const CancelAndBack: FC<CancelAndBackProps> = ({ className }) => {
    const dispatch = useAppDispatch();

    const handleGoBack = () => {
        window.history.back();
        setTimeout(() => dispatch(resetPaymentData()), 10);
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
            <Typography.Text className="text-[#4D4D4D]">Cancel and Go Back</Typography.Text>
        </Flex>
    );
};

export default CancelAndBack;
