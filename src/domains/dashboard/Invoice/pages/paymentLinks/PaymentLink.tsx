import { Button, Flex, Image, Row, Typography, Badge } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import CreatePaymentLink from './CreatePaymentLink';
import userWithLaptopVector from '../../assets/images/user-with-laptop-vector.png';

type Props = {};

const PaymentLink = (props: Props) => {
    const navigate = useNavigate();
    const { kybStatus } = useAppSelector(state => state.reducer.invoices);
    if (kybStatus !== 'APPROVED') {
        navigate(`/${paths.invoice.index}`);
        return null;
    }

    return (
        <Row className="xs:mx-0 md:mx-8 mt-6">
            <Flex className="w-full" justify="space-between">
                <Typography.Text className="text-valueText text-3xl">Payment Links</Typography.Text>
                <Link to={`${paths.invoice.orderHistory}`}>
                    <Button danger className="px-3 rounded-md">
                        Order History
                    </Button>
                </Link>
            </Flex>

            <Flex className="w-full mt-12" wrap="wrap" justify="space-around" align="center">
                <Image preview={false} src={userWithLaptopVector} />
                <Flex className="xs:mt-6" vertical>
                    <Flex align="center" gap="middle">
                        <Badge size="default" count={1} />
                        <Typography.Text className="text-valueText text-lg xs:ms-2 md:ms-0">
                            Generate payment links with contact details
                        </Typography.Text>
                    </Flex>
                    <Flex align="center" gap="middle">
                        <Badge size="default" count={2} />
                        <Typography.Text className="text-valueText text-lg xs:ms-2 md:ms-0">
                            Send the links to your vendors and receive payments
                        </Typography.Text>
                    </Flex>
                </Flex>
            </Flex>

            <CreatePaymentLink />
        </Row>
    );
};

export default PaymentLink;
