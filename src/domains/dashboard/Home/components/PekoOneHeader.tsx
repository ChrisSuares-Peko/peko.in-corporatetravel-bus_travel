import React from 'react';

import { Button, Flex, Image, Typography } from 'antd';
import { Link } from 'react-router-dom';

import DashboardSnap from '@assets/DashboardSnap.png';
import PekoOne from '@assets/PekoOne.png';
import { paths } from '@src/routes/paths';

const PekoOneHeader = () => {
    const { Text } = Typography;
    return (
        <Flex
            className="relative mb-5 pt-7 banner-gradient rounded-2xl"
            justify="space-between"
            align="center"
        >
            <Flex vertical gap={16} className="w-7/12 px-10 md:w-fit">
                <Text className="text-2xl font-medium">
                    Upgrade to{' '}
                    <Image
                        src={PekoOne}
                        preview={false}
                        className=""
                        style={{ width: '100%', height: '100%', maxHeight: '1.4rem' }} // auto 24vh
                    />
                </Text>
                <Text
                    className="max-w-xl text-xs font-normal xxl:max-w-lg"
                    style={{ lineHeight: '1.4rem' }}
                >
                    Choose your plan, simplify your processes, and enjoy a seamless journey with
                    Peko. Upgrade today for a more efficient way to manage your tasks with ease.
                </Text>
                <Link to={paths.dashboard.plans} className="pb-7">
                    <Button danger type="primary" className="w-32 font-medium">
                        Get Started
                    </Button>
                </Link>
            </Flex>
            <Flex className="w-5/12 h-full md:w-fit">
                <Image src={DashboardSnap} preview={false} className="rounded-br-xl" width={310} />
            </Flex>
        </Flex>
        // {/* <Flex className="h-full pt-4">
        //                 <Image
        //                     src={DashboardSnap}
        //                     preview={false}
        //                     className=" rounded-br-xl"
        //                     // style={{ width: '100%', height: '100%',  maxHeigh: '9rem'}} // auto 24vh
        //                 />
        //             </Flex> */}
    );
};

export default PekoOneHeader;
