import React from 'react';

import { Button, Flex, Grid, Input, Row, Typography } from 'antd';

const { useBreakpoint } = Grid;

const ApplyCoupon = () => {
    const screens = useBreakpoint();
    return (
        <Row>
            <Typography.Text className="font-bold text-lg sm:text-xl sm:leading-9">
                Apply Coupon Or Gift Card
            </Typography.Text>
            <Typography.Paragraph className="font-light text-xs sm:text-base sm:leading-9">
                Have a discount/ promo code to redeem
            </Typography.Paragraph>
            {screens.xs ? (
                <Flex className="mt-4 w-full">
                    <Input
                        placeholder="Enter promo code"
                        suffix={<a className="text-black">Apply</a>}
                    />
                </Flex>
            ) : (
                <Flex className="mt-4 w-full gap-4">
                    <Input placeholder="Enter promo code" />
                    <Button danger style={{ borderRadius: 2 }} type="primary" size="middle">
                        Apply
                    </Button>
                </Flex>
            )}
        </Row>
    );
};

export default ApplyCoupon;
