import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import { paths } from '@src/routes/paths';

type Props = {};

const Header = (props: Props) => {
    const navigate = useNavigate();
    return (
        <Col span={24}>
            <Row
                className="md:border-b border-iconRed pb-4"
                align="middle"
                justify="space-between"
                gutter={[20, 20]}
            >
                <Flex gap="large" vertical>
                    <Typography.Text className="text-3xl font-semibold text-valueText">
                        Tax & More
                    </Typography.Text>
                    <Typography.Text className="text-xl">
                        Empowering Finances, Unleashing Insights: Your Tax and More AI Partner for
                        <br />
                        Seamless Financial Excellence
                    </Typography.Text>
                </Flex>
                <Flex
                    className="xs:w-full sm:w-auto"
                    vertical
                    justify="end"
                    align="center"
                    gap="middle"
                >
                    <Typography.Text className="text-xs text-valueText">
                        Finance Health Check-Up
                        <InfoCircleOutlined className="ms-1" />
                    </Typography.Text>
                    <Button
                        className="rounded-sm xs:w-full sm:w-auto"
                        type="primary"
                        danger
                        onClick={() => navigate(paths.accounting.businessHealthCheck)}
                    >
                        <Typography.Text className="text-sm text-valueText mx-4 text-white">
                            Health Check
                        </Typography.Text>
                    </Button>
                </Flex>
            </Row>
        </Col>
    );
};

export default Header;
