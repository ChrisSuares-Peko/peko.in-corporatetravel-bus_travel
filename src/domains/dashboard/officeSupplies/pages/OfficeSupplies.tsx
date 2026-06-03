import { useState } from 'react';

import Categories from '../components/home/Categories';
import ProductListing from '../components/home/ProductListing';
import OfficeSuppliesTop from '../components/OfficeSuppliesTop';
import { useCartDetailsApi } from '../hooks/useCartDetailsApi';
import { useCategoriesApi } from '../hooks/useCategoriesApi';

const OfficeSupplies = () => {
    const { data, isLoading } = useCategoriesApi();
    useCartDetailsApi();
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [searchText, setSearchText] = useState('');
    const [selectedCategoryName, setSelectedCategoryName] = useState('All Categories');

    return (
        <>
            <OfficeSuppliesTop searchText={searchText} setSearchText={setSearchText} />
            <Categories
                isLoading={isLoading}
                categories={data}
                setSelectedCategory={setSelectedCategory}
                selectedCategory={selectedCategory}
                setSelectedCategoryName={setSelectedCategoryName}
            />
            <ProductListing
                searchText={searchText}
                setSearchText={setSearchText}
                selectedCategoryName={selectedCategoryName}
                selectedCategory={selectedCategory}
            />
        </>
    );
};
export default OfficeSupplies;
