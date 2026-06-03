import React from 'react';

import { Button, Flex, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import useScreenSize from '@src/hooks/useScreenSize';
import { paths } from '@src/routes/paths';

const HomePageHeader = () => {
    const navigate = useNavigate();
    const { sm } = useScreenSize();
    return (
        <Flex className="flex-col justify-between mt-3 md:mt-0 xs:flex-row">
            <Flex className="md:align-middle" align="center">
                <Typography.Text className="flex-shrink-0 text-lg font-medium sm:text-xl">
                    Hike{' '}
                </Typography.Text>

                <Typography.Text className="text-xs font-thin md:text-lg sm:font-thin ms-1">
                    -rewards for your employees
                </Typography.Text>
            </Flex>

            <Flex className="align-middle md:mt-0">
                <Button
                    type="default"
                    danger
                    size={sm ? 'middle' : 'small'}
                    className="text-xs md:px-5 md:text-sm"
                    onClick={() => navigate(paths.hike.historyPage)}
                >
                    Order History
                </Button>
            </Flex>
        </Flex>
    );
};

export default HomePageHeader;
