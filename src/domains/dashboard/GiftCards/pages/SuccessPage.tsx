import { Card, Col, Flex, Image, Result, Row, Typography } from 'antd';

import image from '@domains/dashboard/GiftCards/assets/images/amazonGiftCard.png';

type Props = {};

const SuccessPage = (props: Props) => (
    <Row className="px-0 sm:px-6">
        <Col span={24}>
            <Flex justify="center" align="center">
                <Result
                    status="success"
                    title="Successfully Purchased Cloud Server ECS!"
                    subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                    extra={[
                        <Flex justify="center">
                            <Card
                                className="bg-white rounded-2xl  border border-neutral-200 p-4"
                                bodyStyle={{ padding: 0 }}
                            >
                                <Flex gap={20} className="md:flex-row flex-col">
                                    <Flex className="md:w-60  rounded-xl border border-zinc-300">
                                        <Image preview={false} src={image} />
                                    </Flex>
                                    <Flex
                                        vertical
                                        className="gap-1"
                                        align="center"
                                        justify="center"
                                    >
                                        <Typography.Text className=" text-black text-base font-normal">
                                            Your eGift Card Value
                                        </Typography.Text>
                                        <Typography.Text className=" text-lime-600 text-[2.5rem] text- font-bold">
                                            AED 100
                                        </Typography.Text>
                                        <Typography.Text className=" text-black text-base font-normal">
                                            Valid Until Mar 24, 2020
                                        </Typography.Text>
                                        <Typography.Text className=" text-black text-[0.9rem] font-light">
                                            View Code
                                        </Typography.Text>
                                    </Flex>
                                </Flex>
                                <Flex vertical justify="center" className="md:mt-8 mt-5">
                                    <Typography.Text className=" text-black text-[0.6rem] font-normal">
                                        https://yougotagift.com/shop/en-ae/brands/happy-you-gift-card-ae/
                                    </Typography.Text>
                                    <Typography.Text className=" text-black text-[0.6rem] font-normal">
                                        PIN: 0000
                                    </Typography.Text>
                                </Flex>
                            </Card>
                        </Flex>,
                    ]}
                />
            </Flex>
        </Col>
    </Row>
);

export default SuccessPage;
