import React from 'react';

import { Button, Flex, Typography, Grid } from 'antd';
import '@domains/dashboard/Subscriptions/assets/styles/styles.css';
import { Link } from 'react-router-dom';

const { useBreakpoint } = Grid;

const SubscriptionHeader = () => {
    const screens = useBreakpoint();
    return (
        <Flex justify="space-between" align="middle" className="mt-3 md:mt-0">
            {screens.md ? (
                <Flex>
                    <Typography.Text className="font-medium text-lg sm:text-xl">
                        Softwares -
                    </Typography.Text>

                    <Typography.Text className="md:text-lg font-thin sm:font-thin sm:ms-1">
                        Comprehensive software solutions
                    </Typography.Text>
                </Flex>
            ) : (
                <Flex vertical>
                    <Typography.Text className="font-medium text-lg sm:text-xl">
                        Softwares -
                    </Typography.Text>

                    <Typography.Text className="md:text-lg font-thin sm:font-thin sm:ms-1">
                        Comprehensive software solutions
                    </Typography.Text>
                </Flex>
            )}

            <Flex>
                <Flex gap={5} className=" justify-end md:mt-0 xs:mt-3">
                    <Link to="order-history">
                        <Button
                            type="default"
                            danger
                            size={screens.sm ? 'middle' : 'small'}
                            className="md:px-5 text-xs md:text-sm"
                        >
                            Order History
                        </Button>
                    </Link>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default SubscriptionHeader;
