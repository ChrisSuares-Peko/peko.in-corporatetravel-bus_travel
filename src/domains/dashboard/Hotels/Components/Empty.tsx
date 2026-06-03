import React from 'react';

import { Flex, Image } from 'antd';

import nohotel from '@domains/dashboard/Hotels/Assets/nohotel.png';

const Empty = () => (
    <Flex justify="center" align="center" style={{ height: '60vh' }}>
        <Image height={300} width={350} src={nohotel} preview={false} />
    </Flex>
);

export default Empty;
