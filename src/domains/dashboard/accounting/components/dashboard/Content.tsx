import { Button, Col, Flex, Image, Typography } from 'antd';

import { FinanceManagementImg } from '../../assets/images';

type Props = {};

const Content = (props: Props) => (
    <>
        <Col xs={24} sm={24} md={24} lg={12}>
            <Flex gap="middle" vertical>
                <Typography.Text className="text-3xl font-semibold">
                    We take care of your financial management needs
                </Typography.Text>
                <Typography.Text className="text-lg">
                    Simplify your financial management with Hysab. Say goodbye to the stress of
                    bookkeeping and taxes, and hello to more time and energy to focus on growing
                    your business.
                </Typography.Text>
                <Button className="border-iconRed text-iconRed w-2/5 rounded-sm">
                    Subscribe Now
                </Button>
            </Flex>
        </Col>
        <Col className="flex justify-center items-center" xs={24} sm={24} md={24} lg={10}>
            <Image width={400} preview={false} src={FinanceManagementImg} />
        </Col>
    </>
);

export default Content;
