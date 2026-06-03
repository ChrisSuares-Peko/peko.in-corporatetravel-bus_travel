import React from 'react';

import { Flex, Typography, Image } from 'antd';

import aramexLogo from '../../../../assets/aramex.png';
import ared from '../../../../assets/ared.png';
import luluExchange from '../../../../assets/luluexchange.png';
import malabarIcon from '../../../../assets/malabarIcon.png';
import networkLogo from '../../../../assets/network.png';
import titanLogo from '../../../../assets/titan.png';

type Props = {};

const ListPartners = (props: Props) => (
    <Flex vertical justify="space-between" className="w-full my-8">
        <Flex justify="center">
            <Typography.Text className="text-xl font-medium">Trusted By</Typography.Text>
        </Flex>
        <Flex className="flex flex-wrap items-center justify-around gap-12 py-8 pt-8 pb-4">
            <Image src={malabarIcon} height={30} preview={false} />
            <Image src={titanLogo} height={25} preview={false} />
            <Image src={networkLogo} height={25} preview={false} />
            <Image src={aramexLogo} height={25} preview={false} />
            <Image src={luluExchange} height={25} preview={false} />
            <Image src={ared} height={25} preview={false} />
        </Flex>
    </Flex>
);

export default ListPartners;
