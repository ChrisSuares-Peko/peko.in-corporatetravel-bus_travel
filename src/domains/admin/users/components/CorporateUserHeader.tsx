import React from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Row, Select } from 'antd';

import { DownloadType } from '@customtypes/general';

import { categoryData } from '../types/corporateUserTypes';

type Props = {
    handleSearch: (e: any) => void;
    handleChangeFilters: (e: any) => void;
    categoryDatas: categoryData[] | undefined;
    setSearchText: (e: any) => void;
    searchText: string;
    partnerSelected: string;
    handleDownloadReport: (type: string) => void;
    isDisabled: boolean;
};

const CorporateUserHeader = ({
    searchText,
    categoryDatas,
    setSearchText,
    handleSearch,
    handleChangeFilters,
    handleDownloadReport,
    isDisabled,
    partnerSelected,
}: Props) => (
    <Row justify="space-between" className="w-full gap-5">
        <Flex className="flex justify-start gap-3">
            <Button danger onClick={() => handleDownloadReport(DownloadType.Excel)}>
                Excel
            </Button>
            <Button danger onClick={() => handleDownloadReport(DownloadType.Csv)}>
                CSV
            </Button>
            <Button danger onClick={() => handleDownloadReport(DownloadType.Pdf)}>
                PDF
            </Button>
        </Flex>
        <Flex className="flex-col justify-end gap-3 px-0 md:flex-row">
            {categoryDatas && (
                <Select
                    allowClear
                    showSearch
                    options={(categoryDatas || []).map(d => ({
                        value: d.id,
                        label: d.name,
                    }))}
                    placeholder="Select a Partner"
                    loading={categoryDatas.length < 0}
                    className="w-full md:w-auto min-w-52"
                    onChange={handleChangeFilters}
                    value={partnerSelected === '' ? null : Number(partnerSelected)}
                    onSearch={setSearchText}
                    defaultActiveFirstOption={false}
                    filterOption={false}
                    disabled={isDisabled}
                />
            )}

            <Input
                value={searchText}
                placeholder="Search For Corporates"
                suffix={<SearchOutlined />}
                onChange={handleSearch}
                className="w-full md:w-auto min-w-52"
                allowClear
                type="text"
                variant="outlined"
                maxLength={100}
            />
        </Flex>
    </Row>
);
export default CorporateUserHeader;
