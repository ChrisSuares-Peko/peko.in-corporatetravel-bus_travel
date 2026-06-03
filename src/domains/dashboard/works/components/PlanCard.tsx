import { Col, Flex, Typography, Button } from 'antd';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';

type Props = {
    feature: string;
    planName: string;
    price: string;
    billingCycle: string;
    description: string;
    planId: number;
    workId: string | undefined;
    isPopular?: boolean;
};

const PlanCard = ({
    isPopular,
    price,
    planName,
    billingCycle,
    description,
    feature,
    workId,
    planId,
}: Props) => {
    const name = 'Most Popular';
    const data = feature?.split('\n ');
    const isFeaturesValid = Array.isArray(data) && data.length > 0;
    return (
        <Col xs={24} sm={12} md={12} lg={12} xl={8} className={isPopular ? '' : 'pt-3'}>
            <Flex className="h-full flex-col justify-between rounded-2xl border transition duration-150 transform hover:scale-105">
                {isPopular && (
                    <Flex justify="center" className="w-full bg-red-50 rounded-t-2xl">
                        <Typography.Text className="text-lightRed text-base font-medium py-2">
                            {name}
                        </Typography.Text>
                    </Flex>
                )}
                <Flex className="h-full w-full md:p-8 p-6" gap={10} vertical>
                    <Typography.Text className=" md:text-xl   text-lg font-normal">
                        {planName}
                    </Typography.Text>

                    <Typography.Text className="text-gray-400 ">{description}</Typography.Text>

                    <Flex align="center">
                        <Typography.Text className="text-2xl font-normal mt-2">
                            AED {price}
                        </Typography.Text>
                        <Typography.Text className="text-xs font-normal ml-2">
                            /{billingCycle}
                        </Typography.Text>
                    </Flex>
                    <Flex vertical justify="space-between" className="h-full">
                        <Flex vertical gap={8}>
                            {isFeaturesValid ? (
                                data?.map((value, index) => (
                                    <Typography.Paragraph
                                        key={index}
                                        className="text-xs font-normal leading-5  overflow-hidden text-ellipsis"
                                        style={{ whiteSpace: 'pre-wrap' }}
                                    >
                                        {value}
                                    </Typography.Paragraph>
                                ))
                            ) : (
                                <></>
                            )}
                        </Flex>
                        <Flex>
                            <Link
                                to={`${paths.dashboard.works}/${paths.works.detail}/${workId}/${paths.works.purchase}/${planId}`}
                                className="w-full"
                            >
                                <Button className="mt-4 w-full" type="primary" danger>
                                    Purchase
                                </Button>
                            </Link>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Col>
    );
};

export default PlanCard;
