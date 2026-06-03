import { useState, type FC, useEffect } from 'react';

import { Flex, Pagination, Row, Typography } from 'antd';
import { debounce } from 'lodash';
import { ReactSVG } from 'react-svg';

import useScreenSize from '@src/hooks/useScreenSize';

import Filters from './Filters';
import ProductCard from './ProductCard';
import ProductsSkelton from './skeltons/ProductsSkelton';
import noProductsSVG from '../../assets/icons/noProducts.svg';
import { useProductsApi } from '../../hooks/useProductsApi';

interface ProductListingProps {
    selectedCategory: number | null;
    selectedCategoryName: string;
    searchText: string;
    setSearchText: (searchText: string) => void;
}

const ProductListing: FC<ProductListingProps> = ({
    selectedCategory,
    searchText,
    selectedCategoryName,
    setSearchText,
}) => {
    const screen = useScreenSize();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(52);
    const [filter, setFilter] = useState<string>('all');
    const [debouncedSearchText, setDebouncedSearchText] = useState<string>(searchText);

    const debouncedSearch = debounce((searchQuery: string) => {
        setDebouncedSearchText(searchQuery);
    }, 500);

    useEffect(() => {
        if (searchText && searchText !== '') {
            setCurrentPage(1);
        }
        debouncedSearch(searchText);
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchText, selectedCategory, debouncedSearch]);

    const { data, isLoading, count } = useProductsApi(
        selectedCategory,
        currentPage,
        pageSize,
        filter,
        debouncedSearchText
    );

    const handleScroll = () => {
        const productsContainer = document.getElementById('myContainer');
        if (productsContainer) {
            productsContainer.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

    return (
        <Flex className="mx-0 mt-4" vertical>
            <Filters
                selectedCategoryName={selectedCategoryName}
                filter={filter}
                setFilter={setFilter}
                searchText={searchText}
                setSearchText={setSearchText}
                setCurrentPage={setCurrentPage}
            />

            <Row
                justify="start"
                id="products_container"
                className="mt-7"
                gutter={screen.xs ? [5, 20] : [20, 20]}
            >
                <ProductsSkelton loading={isLoading} itemCount={12} />

                {data.length === 0 && !isLoading && (
                    <Flex
                        vertical
                        gap={30}
                        className="w-full h-96 mt-18"
                        justify="center"
                        align="center"
                    >
                        <ReactSVG width={120} src={noProductsSVG} />
                        <Typography.Text className="text-base text-center text-gray-300 ms-2">
                            No products
                        </Typography.Text>
                    </Flex>
                )}

                {!isLoading && data?.map(product => <ProductCard key={product.id} {...product} />)}
            </Row>
            {data.length !== 0 && !isLoading && (
                <Pagination
                    className="mt-10 text-center sm:text-end"
                    total={count}
                    current={currentPage}
                    defaultPageSize={pageSize}
                    pageSizeOptions={['10', '20', '30', '52', '100']}
                    onChange={(page, pageSize2) => {
                        handleScroll();
                        setCurrentPage(page);
                        if (pageSize2 !== pageSize) {
                            setPageSize(pageSize2);
                            setCurrentPage(1);
                        }
                    }}
                />
            )}
        </Flex>
    );
};
export default ProductListing;
