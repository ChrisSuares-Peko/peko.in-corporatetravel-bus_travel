import { Col, Flex, Typography, Button } from 'antd';

type Props = {
    feature: string[];
    planName: string;
    price: string;
    isPopular?: boolean;
};

const PlanCard = ({ isPopular, price, planName, feature }: Props) => {
    const name = 'Most Popular';
    return (
        <Col xs={24} sm={12} md={10} lg={11} xl={7} className="pt-3">
            <Flex className="h-full flex-col justify-between rounded-2xl border transition duration-150 transform hover:scale-105">
                {isPopular && (
                    <Flex justify="center" className="w-full bg-red-50 rounded-t-2xl">
                        <Typography.Text className="text-lightRed text-base font-medium py-2">
                            {name}
                        </Typography.Text>
                    </Flex>
                )}
                <Flex className="h-full w-full p-8" gap={10} vertical>
                    <Typography.Text className=" md:text-xl   text-lg font-normal  overflow-hidden line-clamp-1 h-8">
                        {planName}
                    </Typography.Text>

                    <Typography.Text className="text-gray-400">
                        For teams looking to streamline their spend management process and stay on
                        top of their finances
                    </Typography.Text>

                    <Flex align="center">
                        <Typography.Text className="text-3xl font-normal mt-2">
                            AED {price}
                        </Typography.Text>
                        <Typography.Text className="text-sm font-normal ml-2">
                            /Monthly
                        </Typography.Text>
                    </Flex>
                    <Flex vertical justify="space-between" className="h-full">
                        <Flex vertical gap={8}>
                            {feature.map((data: string) => (
                                <Typography.Paragraph
                                    className="text-xs font-normal leading-5  overflow-hidden text-ellipsis "
                                    style={{ whiteSpace: 'pre-wrap' }}
                                >
                                    {data}
                                </Typography.Paragraph>
                            ))}
                        </Flex>
                        <Flex>
                            <Button className="mt-4 w-full" type="primary" danger>
                                Coming soon
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Col>
    );
};

export default PlanCard;
