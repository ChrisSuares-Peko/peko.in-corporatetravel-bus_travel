import { useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { getProductDetailsApi } from '../api/product';
import { ProductDetails, ProductDetailsResponse, ProductImage } from '../types/productDetails';
import { Product } from '../types/products';

export function useProductDetailsApi(productId: string) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const navigate = useNavigate();

    const [productDetails, setProductDetails] = useState<ProductDetails>();
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [productImages, setProductImages] = useState<ProductImage[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const getProductDetails = useCallback(async () => {
        setIsLoading(true);
        const data: ProductDetailsResponse | false = await getProductDetailsApi({
            userId: id,
            userType: role,
            productId,
            limit: 6,
            page: 1,
        });
        if (data) {
            const productDetailsData = data as ProductDetailsResponse;
            setProductImages(productDetailsData.photos);
            setProductDetails(productDetailsData.productDetails);
            setRelatedProducts(productDetailsData.relatedProducts.products);

            setIsLoading(false);
        } else {
            navigate(`/${paths.officeSupplies.index}`);
            setIsLoading(false);
        }
    }, [id, role, productId, navigate]);

    useEffect(() => {
        getProductDetails();
    }, [getProductDetails]);

    return { relatedProducts, productImages, productDetails, isLoading };
}
