import React from 'react';

import { Row, Typography, Image, Grid, Flex } from 'antd';

import vendorLogo from '../../../../assets/vendorLogoSVG.svg';

const { Text } = Typography;
const { useBreakpoint } = Grid;

interface GroceryCardProps {
    value: string;
}

const GroceryCardHeader: React.FC<GroceryCardProps> = ({ value }) => {
    const screens = useBreakpoint();

    const imageSize = screens.sm ? '45px' : '40px';
    return (
        <Row gutter={[10, 10]} className="w-full sm:mb-2 ">
            <Flex className="mb-4  items-start justify-start gap-8 ">
                <Flex>
                    <Image
                        src={vendorLogo}
                        alt="grocery"
                        preview={false}
                        style={{ width: imageSize, height: imageSize }}
                        className="z-50"
                    />
                </Flex>
                <Flex>
                    <Text className="mt-3 sm:ml-4 md:text-[18px] text-[17px] font-bold">
                        {value}
                    </Text>
                </Flex>
                {/* <Flex className='sm:mt-4'>
                    <DetailSection label="Country" value="India" />
                </Flex>
                <Flex className='sm:mt-4'>
                    <DetailSection label="Destination Currency" value="INR" />
                </Flex> */}
            </Flex>
        </Row>
    );
};

export default GroceryCardHeader;
