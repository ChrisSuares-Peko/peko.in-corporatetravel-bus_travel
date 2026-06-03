import type { FC } from 'react';

import { Skeleton, Tabs } from 'antd';

import useScreenSize from '@src/hooks/useScreenSize';

import CommonTabBody from './tabs/CommonTabBody';
import HighlightsTabs from './tabs/HighlightsTabs';
import { ProductDetails } from '../../types/productDetails';

interface ProductDetailTabsProps {
    productDetails: ProductDetails;
    isLoading: boolean;
}
const ProductDetailTabs: FC<ProductDetailTabsProps> = ({ productDetails, isLoading }) => {
    const screens = useScreenSize();
    return (
        <>
            {isLoading ? (
                <Skeleton className="my-8" />
            ) : (
                <Tabs
                    className="xs:mt-2 sm:mt-10"
                    defaultActiveKey="1"
                    animated={{ inkBar: true, tabPane: false }}
                    size={screens.sm ? 'middle' : 'small'}
                    items={[
                        {
                            label: 'Description',
                            key: '1',
                            children: <CommonTabBody content={productDetails?.description} />,
                        },
                        {
                            label: 'Highlights',
                            key: '2',
                            children: <HighlightsTabs content={productDetails?.highlights} />,
                        },
                        {
                            label: 'Warranty and Support',
                            key: '3',
                            children: <CommonTabBody content={productDetails?.warranty} />,
                        },
                    ]}
                />
            )}
        </>
    );
};

export default ProductDetailTabs;
