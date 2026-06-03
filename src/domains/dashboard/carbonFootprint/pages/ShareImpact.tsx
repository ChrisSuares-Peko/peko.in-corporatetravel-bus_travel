import { Divider, Flex, Image, List, Row, Typography } from 'antd';

import PRImg from '../assets/images/PR-img.jpeg';
import { data } from '../utils/shareImpact/data';

const ShareImpact = () => (
    <Row className="mt-20 xs:p-0 md:px-8 lg:px-14">
        <Flex className="w-full" justify="center">
            <Typography.Text className="w-3/4 text-2xl text-center text-valueText xl:text-2xl xxl:text-4xl">
                We aim to inspire everyone to help save our planet. To amplify this message, we
                provide access to tools, ads, press releases and more for effective advocacy.
            </Typography.Text>
        </Flex>
        <Flex
            gap="large"
            className="w-full mt-8 xs:mx-0 md:mx-auto"
            wrap="wrap"
            align="center"
            justify="center"
        >
            <Flex gap="large" className="mt-12">
                <Flex align="center" vertical>
                    <Typography.Text className="text-xl text-valueText xxl:text-2xl">
                        PR Template
                    </Typography.Text>
                    <Image width={300} src={PRImg} />
                </Flex>
                <Divider className="mt-6 h-96 border-iconRed xs:hidden md:inline" type="vertical" />
            </Flex>

            <Flex gap="large" className="mt-12">
                <Flex align="center" className="w-64" vertical>
                    <Typography.Text className="text-xl text-valueText xxl:text-2xl">
                        ADS
                    </Typography.Text>
                    <Typography.Text className="mt-4 text-base text-valueText xxl:text-lg text-start">
                        What is the difference between weather and climate?
                    </Typography.Text>
                </Flex>
                <Divider className="mt-6 h-96 border-iconRed xs:hidden md:inline" type="vertical" />
            </Flex>

            <Flex gap="large" className="mt-12">
                <Flex align="center" className="w-64" vertical>
                    <Typography.Text className="text-xl text-valueText xxl:text-2xl">
                        Resources
                    </Typography.Text>
                    <List
                        dataSource={data}
                        renderItem={item => (
                            <List.Item className="mt-1 border-0">
                                <Flex align="center" gap="middle ">
                                    <Flex className="w-2 h-2 text-transparent bg-iconRed">.</Flex>
                                    <Typography.Text className="text-base ms-4 xxl:text-lg ">
                                        {item}
                                    </Typography.Text>
                                </Flex>
                            </List.Item>
                        )}
                    />
                </Flex>
                <Divider
                    className="mt-6 border-transparent h-96 xs:hidden md:inline"
                    type="vertical"
                />
            </Flex>
        </Flex>
    </Row>
);

export default ShareImpact;
