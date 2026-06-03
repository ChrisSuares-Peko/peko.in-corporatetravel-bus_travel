import React from 'react';

import { Col, Flex, Grid, Row, Typography } from 'antd';

interface details {
    title: string;
    emp: string;
    amount: string;
    desc?: string;
    disc?: string;
}
const PaymentDetails = ({ title, emp, amount, desc, disc }: details) => {
    const screens = Grid.useBreakpoint();
    const isXs = screens.xs;
    return (
        <Row>
            <Col xl={8} xs={24}>
                <Typography.Text className="xs:font-medium xl:font-normal">{title}</Typography.Text>
            </Col>
            <Col xl={9} xs={12} className="xs:mt-2 xl:mt-0">
                <Flex gap={7} vertical={isXs}>
                    <Typography.Text className="font-normal">{emp}</Typography.Text>
                    <Typography.Text className="font-normal text-red-500">{desc}</Typography.Text>
                </Flex>
            </Col>
            <Col xl={7} xs={12} className="xs:mt-2 md:mt-0">
                <Flex gap={7} vertical={isXs}>
                    <Typography.Text className="font-normal">{amount}</Typography.Text>
                    <Typography.Text className="font-normal text-red-500">{disc}</Typography.Text>
                </Flex>
            </Col>
        </Row>
    );
};
export default PaymentDetails;
