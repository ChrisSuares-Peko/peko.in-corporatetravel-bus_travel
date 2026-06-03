import React from 'react';

import { Card, Image, Grid } from 'antd';

import selectVendorSVG from '../../../../assets/selectVendorSVG.svg';

const EmptyMiniCard: React.FC = () => {
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const imageHeight = screens.md ? 100 : 60;
    const imageWidth = screens.md ? 100 : 60;

    return (
        <Card className="md:mb-4 mb-6 md:p-6 p-4 rounded-3xl shadow-sm w-full flex flex-col items-center justify-center text-center sm:min-h-[300px]">
            <Image
                height={imageHeight}
                width={imageWidth}
                src={selectVendorSVG}
                preview={false}
                alt="Dashboard Logo"
                className="mb-4" // Add margin-bottom to separate image from text
            />
        </Card>
    );
};

export default EmptyMiniCard;
