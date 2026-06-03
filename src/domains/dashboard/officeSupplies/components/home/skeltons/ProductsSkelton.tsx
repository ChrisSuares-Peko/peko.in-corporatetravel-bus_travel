import type { FC } from 'react';

import { Col, Flex, Skeleton } from 'antd';

interface ProductsSkeltonProps {
    loading: boolean;
    itemCount: number;
}
const ProductsSkelton: FC<ProductsSkeltonProps> = ({ itemCount, loading }) => {
    const skeletons = Array.from({ length: itemCount }, (_, index) => (
        <Col key={index} xs={12} sm={12} lg={12} xl={6} xxl={6} className="flex justify-center ">
            <ProductsSkeltonItem />
        </Col>
    ));

    return <>{loading && skeletons}</>;
};

const ProductsSkeltonItem: FC = () => (
    <Flex align="center" className="w-full md:w-10/12 mb-6 " vertical gap={10}>
        <Flex className="rounded-lg text-skeltonGray bg-skeltonGray animate-pulse min-h-32 w-full">
            .
        </Flex>
        <Skeleton title={false} round paragraph={{ rows: 4 }} />
    </Flex>
);

export default ProductsSkelton;
