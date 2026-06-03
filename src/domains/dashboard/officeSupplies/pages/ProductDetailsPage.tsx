import { useState } from 'react';

import { useParams } from 'react-router-dom';

import OfficeSuppliesTop from '../components/OfficeSuppliesTop';
import ProductDetails from '../components/productDetails/ProductDetails';
import ProductDetailTabs from '../components/productDetails/ProductDetailTabs';
import RelatedProducts from '../components/productDetails/RelatedProducts';
import { useProductDetailsApi } from '../hooks/useProductDetailsApi';

function OfficeSupplies() {
    const [searchText, setSearchText] = useState('');
    const { id } = useParams();
    const { relatedProducts, productImages, productDetails, isLoading } = useProductDetailsApi(id!);
    return (
        <>
            <OfficeSuppliesTop
                searchText={searchText}
                setSearchText={setSearchText}
                titleHidden
                searchHidden
                categoryText={productDetails?.category?.categoryName}
            />
            <ProductDetails
                productDetails={productDetails!}
                productImages={productImages}
                isLoading={isLoading}
            />
            <ProductDetailTabs productDetails={productDetails!} isLoading={isLoading} />
            <RelatedProducts products={relatedProducts} isLoading={isLoading} />
        </>
    );
}

export default OfficeSupplies;
