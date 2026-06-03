import React from 'react';

import { Flex, Row, Typography } from 'antd';

import RelatedProductsCard from './RelatedProductsCard';
import { Product } from '../../types/products';
import ProductsSkelton from '../home/skeltons/ProductsSkelton';

type RelatedProductsProps = {
    products: Product[];
    isLoading: boolean;
};

const RelatedProducts: React.FC<RelatedProductsProps> = ({ isLoading, products }) => (
    <Flex vertical gap={20} className="my-16 ">
        <Typography.Text className="text-lg font-roboto text-gray-600">
            Related Products
        </Typography.Text>

        <Row gutter={[10, 10]} className="p-0 m-0">
            <ProductsSkelton loading={isLoading} itemCount={4} />
            {!isLoading &&
                products?.map(product => (
                    <RelatedProductsCard
                        key={product.id}
                        image={product.productImage}
                        name={product.name}
                        price={product.price}
                        savePrice="12"
                        category={product.category.categoryName}
                        quantity={product.quantity}
                        actualPrice={product.actualPrice}
                        id={product.id}
                    />
                ))}
        </Row>
    </Flex>
);

export default RelatedProducts;
