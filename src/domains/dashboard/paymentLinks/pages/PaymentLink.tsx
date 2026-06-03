import { Button, Flex, Image, Row, Typography, Input, Table, Col, Badge } from 'antd';
import { useNavigate } from 'react-router-dom';

import { paths } from '@src/routes/paths';

import { userWithLaptopVector } from '../assets/images';
import { columns, data } from '../utils/data';

type Props = {};

const PaymentLink = (props: Props) => {
    const navigate = useNavigate();
    return (
        <Row className="xs:mx-0 md:mx-8 mt-6">
            <Row className="w-full">
                <Col xs={24} md={20}>
                    <Typography.Text className="text-valueText text-3xl">
                        Payment Link
                    </Typography.Text>
                </Col>
                <Col xs={24} md={4}>
                    <Button
                        type="primary"
                        className="mt-2"
                        onClick={() => navigate(paths.paymentLinks.CreatePayment)}
                        danger
                    >
                        Create Payment Link
                    </Button>
                </Col>
            </Row>

            <Flex className="w-full mt-12" wrap="wrap" justify="space-around" align="center">
                <Image preview={false} src={userWithLaptopVector} />
                <Flex className="xs:mt-6" vertical>
                    <Flex align="center" gap="middle">
                        <Badge size="default" count={1} />
                        <Typography.Text className="text-valueText text-lg xs:ms-2 md:ms-0">
                            Generate Your Payment link with contact details
                        </Typography.Text>
                    </Flex>
                    <Flex align="center" gap="middle">
                        <Badge size="default" count={2} />
                        <Typography.Text className="text-valueText text-lg xs:ms-2 md:ms-0">
                            Receive Payments from your vendor or customer can receive payments
                            through link
                        </Typography.Text>
                    </Flex>
                </Flex>
            </Flex>
            <Flex className="w-full mt-6" wrap="wrap" justify="space-between" align="center">
                <Typography.Text className="text-valueText text-xl">Order History</Typography.Text>
                <Input.Search
                    placeholder="search"
                    className="rounded-none xs:w-full xs:mt-4 md:mt-0 md:w-1/5 "
                />
            </Flex>
            <Table
                className="w-full mt-6"
                scroll={{ x: 992 }}
                columns={columns}
                dataSource={data}
            />
        </Row>
    );
};

export default PaymentLink;
