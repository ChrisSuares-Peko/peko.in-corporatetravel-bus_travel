import React from 'react';

import { Col, Flex, Image, Row, Tabs, Typography } from 'antd';

import { androidInstallation, iosInstallation } from '../../utils/InstallationSteps';

type Props = {
    QRurl: string;
};

const EsimTab = ({ QRurl }: Props) => (
    <Tabs
        defaultActiveKey="1"
        items={[
            {
                key: '1',
                label: 'Android',
                children: (
                    <Row className="">
                        <Col xs={24} md={6}>
                            <Flex vertical className="mt-2">
                                <Typography.Text className="text-base text-textBlack ms-1">
                                    Install eSIM
                                </Typography.Text>
                                <Flex className="mt-6">
                                    <Image
                                        src={QRurl}
                                        preview={false}
                                        width={110}
                                        height={110}
                                        className="mt-2"
                                    />
                                    <Flex
                                        className="w-48 py-2 ms-4"
                                        justify="space-between"
                                        vertical
                                    >
                                        <Typography.Text className="text-xs text-textGrey">
                                            Scan the QR code by printing out or displaying the code
                                            on another device to install your eSIM.
                                        </Typography.Text>
                                        <Typography.Text className="text-xs text-textGrey mt-3">
                                            *Make sure your device has a stable internet connection
                                            before installing.
                                        </Typography.Text>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Col>
                        <Col xs={24} md={1} />
                        <Col xs={24} md={17}>
                            <Flex vertical gap={10} className="mt-2 ms-4">
                                {androidInstallation.map((item, i) => (
                                    <Typography.Text className="text-sm font-medium">
                                        {`${i + 1}. ${item.title}:`}
                                        <Typography.Text className="text-sm font-normal ms-2">
                                            {item.content}
                                        </Typography.Text>
                                    </Typography.Text>
                                ))}

                                <Typography.Text className="text-sm font-medium my-4">
                                    Please note that the specific steps may vary slightly depending
                                    on the Android device model and the network carrier.
                                </Typography.Text>
                            </Flex>
                        </Col>
                    </Row>
                ),
            },
            {
                key: '2',
                label: 'iOS',
                children: (
                    <Row>
                        <Col xs={24} md={6}>
                            <Flex vertical className="mt-2">
                                <Typography.Text className="text-base text-textBlack ms-1">
                                    Install eSIM
                                </Typography.Text>
                                <Flex className="mt-6">
                                    <Image
                                        src={QRurl}
                                        preview={false}
                                        width={110}
                                        height={110}
                                        className="mt-2"
                                    />
                                    <Flex
                                        className="w-48 py-2 ms-4"
                                        justify="space-between"
                                        vertical
                                    >
                                        <Typography.Text className="text-xs text-textGrey">
                                            Scan the QR code by printing out or displaying the code
                                            on another device to install your eSIM.
                                        </Typography.Text>
                                        <Typography.Text className="text-xs text-textGrey mt-3">
                                            *Make sure your device has a stable internet connection
                                            before installing.
                                        </Typography.Text>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Col>
                        <Col xs={24} md={1} />
                        <Col xs={24} md={17}>
                            <Flex vertical gap={10} className="mt-2 ms-4">
                                {iosInstallation.map((item, i) => (
                                    <Typography.Text className="text-sm font-medium">
                                        {`${i + 1}. ${item.title}`}
                                        {i !== 0 && ':'}
                                        <Typography.Text className="text-sm font-normal ms-2">
                                            {i !== 0 && item.content}
                                        </Typography.Text>
                                    </Typography.Text>
                                ))}

                                <Typography.Text className="text-sm font-medium my-4">
                                    If you encounter any issues during the installation, you can
                                    reach out to your eSIM provider{`'`}s customer support for
                                    assistance.
                                </Typography.Text>
                            </Flex>
                        </Col>
                    </Row>
                ),
            },
        ]}
    />
);

export default EsimTab;
