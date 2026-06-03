import { useState } from 'react';

import { PaginationProps } from 'antd';

import { useFilterCommon } from '../types/types';

interface Props {
    setFilters: (value: any) => void;
}

const useFilter = ({ setFilters }: Props) => {
    const [searchText, setSearchText] = useState<string>('');
    const handleSearch = (e: any) => {
        setFilters((prevState: useFilterCommon) => ({
            ...prevState,
            searchText: e.target.value,
            page: 1,
        }));
    };
    const handlePageChange: PaginationProps['onChange'] = page => {
        setFilters((prevState: useFilterCommon) => ({
            ...prevState,
            page,
        }));
    };

    const handleChangeFilters = (e: any) => {
        setFilters((prevState: useFilterCommon) => ({
            ...prevState,
            partnerId: e,
            page: 1,
        }));
        setSearchText('');
    };
    return {
        handleSearch,
        handlePageChange,
        handleChangeFilters,
        searchText,
        setSearchText,
    };
};

export default useFilter;
