import React, { useEffect, useState } from 'react';

import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Flex, Input, Select, Typography } from 'antd';

import useDebounce from '@src/hooks/useDebounce';

import { useBusinessDocsListingApi } from '../hooks/useGetDocsListApI';
import '../styles/customSelect.css';

const { Option } = Select;

type props = {
    category: string | undefined;
    docsData: any;
    page: number | undefined;
    setcount: any;
    pageSize: number | undefined;
    setIsloading: (isLoading: boolean) => void;
};

const FilterComponent = ({ category, docsData, page, setcount, pageSize, setIsloading }: props) => {
    const [searchKey, setSearchKey] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('createdAt');
    const [sortType, setSortType] = useState<string>('DESC');

    const debouncedSearch = useDebounce(searchKey, 500);
    const { data, count, isLoading } = useBusinessDocsListingApi(
        debouncedSearch,
        category ? category.replaceAll('-', ' ') : '',
        page ?? 1,
        pageSize || 10,
        sortBy,
        sortType
    );

    useEffect(() => {
        setIsloading(isLoading);
        docsData(data);
        setcount(count);
    }, [isLoading, data, count, setIsloading, docsData, setcount]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKey(e.target.value);
    };

    const handleSortChange = (value: string) => {
        setSortBy(value === 'latest' || value === 'oldest' ? 'createdAt' : 'documentName');
        setSortType(value === 'latest' || value === 'z-a' ? 'DESC' : 'ASC');
    };

    return (
        <Flex gap={10} className="flex">
            <Select
                defaultValue="latest"
                style={{
                    width: '30%',
                    minWidth: '120px',
                    maxWidth: '200px',
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                }}
                onChange={handleSortChange}
                suffixIcon={
                    <Flex align="center" gap={5}>
                        <Typography.Text className="text-black text-sm">Sort</Typography.Text>
                        <FilterOutlined className="text-black text-base" />{' '}
                    </Flex>
                }
            >
                <Option value="latest">Latest</Option>
                <Option value="oldest">Oldest</Option>
                <Option value="a-z">A-Z</Option>
                <Option value="z-a">Z-A</Option>
            </Select>
            <Input
                placeholder="Search For Documents"
                suffix={<SearchOutlined />}
                allowClear
                type="text"
                value={searchKey}
                style={{
                    width: 'calc(100% - 10px)',
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                }}
                onChange={handleSearchChange}
                maxLength={100}
                className="rounded-sm "
            />
        </Flex>
    );
};

export default FilterComponent;
