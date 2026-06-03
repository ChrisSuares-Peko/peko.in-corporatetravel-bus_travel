import React from 'react';

import { Row, Card, Flex, Image, Typography } from 'antd';

interface optionsProps {
    optionName: string;
    image: string;
    walletAmount?: number | string;
    checked?: boolean;
    handleSelection: () => void;
    disabled?: boolean;
}

const PaymentOptions = ({
    optionName,
    walletAmount,
    image,
    checked,
    handleSelection,
    disabled = false,
}: optionsProps) => (
    <Card
        size="small"
        onClick={disabled ? () => false : handleSelection}
        bordered={false}
        className={`rounded-xl border border-solid p-4 ${disabled ? 'cursor-not-allowed bg-gray-100 opacity-60' : 'cursor-pointer'}  ${checked ? 'border-bgOrange2' : 'border-borderGray'}`}
    >
        <Flex gap={20} justify="space-between" align="center">
            <Row className="bg-slate-90 items-center gap-2 sm:gap-5">
                <Typography.Text className="text-xs sm:text-sm">{optionName}</Typography.Text>
                {walletAmount && (
                    <Typography.Text
                        strong
                        className="text-xs sm:text-sm tracking-widest  text-textGreen"
                    >
                        AED {walletAmount}
                    </Typography.Text>
                )}
            </Row>
            <Image src={image} alt="logo" className=" bg-transparent" preview={false} />
        </Flex>
    </Card>
);

export default PaymentOptions;
