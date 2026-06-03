import type { FC } from 'react';

import { Flex, Image } from 'antd';

import DubaiDEDLogo from '../assets/dubai_tourism.svg';

interface HeaderProps {}

const Header: FC<HeaderProps> = () => (
    <Flex justify="space-between" align="center">
        <Flex className="text-lg sm:text-xl font-medium">DED License Renewal</Flex>

        <Flex vertical>
            <Flex className="text-neutral-900 text-xs ml-5 font-medium">Powered by</Flex>
            <Image
                width={128}
                className="mt-2"
                alt="Dubai DED logo"
                src={DubaiDEDLogo}
                preview={false}
            />
        </Flex>
    </Flex>
);

export default Header;
