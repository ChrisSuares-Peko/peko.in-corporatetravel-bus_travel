import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getProductList } from '../api/product';
import { ProductCardProps, ProductListResponse } from '../types/products';

export function useProductsApi(
    selectedCategory: number | null,
    currentPage: number,
    pageSize: number,
    filter: string,
    searchText: string
) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [products, setProducts] = useState<ProductCardProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>();

    const getProducts = useCallback(async () => {
        setIsLoading(true);
        const data: ProductListResponse | false = await getProductList({
            userId: id,
            userType: role,
            catIds: selectedCategory || '',
            limit: pageSize,
            offset: (currentPage - 1) * pageSize,
            searchText: searchText || '',
            sortBy: filter,
        });
        if (data) {
            const productsData = data as ProductListResponse;
            const arr: ProductCardProps[] = productsData?.rows?.map(product => ({
                id: product.id,
                name: product.name,
                category: product.category.categoryName,
                image: product.productImage,
                price: product.price,
                quantity: product.quantity,
                actualPrice: product.actualPrice,
                savePrice: product.discount,
            }));
            setCount(productsData.count);
            setProducts(arr);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [id, role, selectedCategory, currentPage, pageSize, filter, searchText]);

    useEffect(() => {
        getProducts();
    }, [getProducts]);

    return { data: products, isLoading, count };
}
