import { useState, useCallback, useEffect } from 'react';

import { categoryListing } from '../api';
import { categoryListingResponse, filterOption } from '../types';

export const useGetCategories = () => {
    const [categoryData, setCategoryData] = useState<filterOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getCategoryList = useCallback(async () => {
        const data: categoryListingResponse | false = await categoryListing();
        if (data) {
            const { category } = data;
            setCategoryData(category);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getCategoryList();
    }, [getCategoryList]);

    return { category: categoryData, categoryLoader: isLoading };
};
