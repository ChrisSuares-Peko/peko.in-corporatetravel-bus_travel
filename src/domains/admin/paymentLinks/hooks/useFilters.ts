/* eslint-disable prefer-destructuring */
import { useState } from 'react';

import { PaginationProps } from 'antd';
import { TableProps } from 'antd/lib';

import { useFilterCommon } from '../types/common';

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

    const handleTableChange: TableProps<any>['onChange'] = (pagination, filter, sorter) => {
        let sort;
        let field;

        if (Array.isArray(sorter)) {
            if (sorter.length > 0) {
                field = sorter[0].field;
                sort = sorter[0].order === 'ascend' ? 'ASC' : 'DESC';
            }
        } else {
            field = sorter.field;
            sort = sorter.order === 'ascend' ? 'ASC' : 'DESC';
        }

        if (field) {
            handleSort(field.toString(), sort);
        }
    };

    const handleSort = (sortField: string, sort?: string) => {
        const formattedSortField = sortField.includes(',')
            ? sortField.split(',').join('.')
            : sortField;

        setFilters((prevState: useFilterCommon) => ({
            ...prevState,
            sortField: formattedSortField,
            sort,
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
        handleTableChange,
    };
};

export default useFilter;
