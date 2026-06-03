import React from 'react';

import { Button, Col, Flex, Row, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';

const BeneficiaryHeader = () => (
    <Col span={24} className="">
        <Row className="pb-8 " align="middle" justify="space-between" gutter={[20, 20]}>
            <Flex gap="middle" vertical>
                <Typography.Text className="text-xl font-medium ms-3">
                    Beneficiaries
                </Typography.Text>
            </Flex>
            <Flex justify="end" align="center" gap={14} className="xs:w-full md:w-auto">
                <Link to={`${paths.vendorPayouts.registerBeneficiary}`}>
                    <Button className="" type="primary" danger>
                        Add Beneficiary
                    </Button>
                </Link>
            </Flex>
        </Row>
    </Col>
);
export default BeneficiaryHeader;
