import React, { useEffect, useState } from 'react';

import { SearchOutlined, SwapRightOutlined } from '@ant-design/icons';
import { Col, Row, Button, Select, Input, DatePicker, Flex } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';

import { DownloadType } from '@customtypes/general';
import useDebounce from '@src/hooks/useDebounce';
import useScreenSize from '@src/hooks/useScreenSize';

import { filterOption } from '../types';
import { filterOptions } from '../utils/data';

type Props = {
    isLoading: boolean;
    category: filterOption[];
    handleChangeFilters: (selectedOption: string) => void;
    handleDateChange: (dates: any, dateStrings: any) => void;
    handleFromChange: (dates: any, dateStrings: any) => void;
    handleToChange: (dates: any, dateStrings: any) => void;
    handleDownloadReport: (type: string) => void;
    from: string;
    to: string;
    searchText: string;
    handleSearch: (searchKey: string) => void; // Fixed type
    text: string;
    initialFrom: string;
    initialTo: string;
};
const dateFormat = 'YYYY-MM-DD';
const disabledDate = (current: any) => current && current > moment().startOf('day');
const { RangePicker } = DatePicker;

const Headers = ({
    isLoading,
    category,
    handleChangeFilters,
    handleDateChange,
    from,
    to,
    searchText,
    handleSearch,
    handleFromChange,
    handleToChange,
    handleDownloadReport,
    text,
    initialFrom,
    initialTo,
}: Props) => {
    const { md } = useScreenSize();
    const [searchKey, setSearchKey] = useState<string>(searchText);
    const debouncedSearchKey = useDebounce(searchKey, 500);

    useEffect(() => {
        if (debouncedSearchKey !== searchText) {
            handleSearch(debouncedSearchKey);
        }
    }, [debouncedSearchKey, searchText, handleSearch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKey(e.target.value);
    };

    return (
        <Row gutter={[20, 20]}>
            <Col xs={24} sm={12} md={7} xl={6} style={{ minWidth: '200px', maxWidth: '250px' }}>
                <Flex gap={4} style={{ width: '100%' }}>
                    <Button
                        danger
                        style={{ flex: 1 }}
                        onClick={() => handleDownloadReport(DownloadType.Excel)}
                    >
                        Excel
                    </Button>
                    <Button
                        danger
                        style={{ flex: 1 }}
                        onClick={() => handleDownloadReport(DownloadType.Csv)}
                    >
                        CSV
                    </Button>
                    <Button
                        danger
                        style={{ flex: 1 }}
                        onClick={() => handleDownloadReport(DownloadType.Pdf)}
                    >
                        PDF
                    </Button>
                </Flex>
            </Col>

            <Col xs={24} sm={12} md={5} xl={6} style={{ minWidth: '200px', maxWidth: '250px' }}>
                <Select
                    loading={isLoading}
                    defaultValue={filterOptions[0].value}
                    options={category}
                    className="w-full"
                    onChange={handleChangeFilters}
                    popupMatchSelectWidth={false} // Avoid dropdown affecting layout width
                    style={{ width: '100%' }}
                />
            </Col>

            <Col xs={24} sm={12} md={7} style={{ minWidth: '200px', maxWidth: '250px' }}>
                {md ? (
                    <RangePicker
                        disabledDate={disabledDate}
                        onChange={handleDateChange}
                        format={dateFormat}
                        value={[dayjs(from, dateFormat), dayjs(to, dateFormat)]}
                        className="w-full"
                    />
                ) : (
                    <Flex className="w-full" justify="space-between" align="center">
                        <DatePicker
                            disabledDate={disabledDate}
                            onChange={handleFromChange}
                            format={dateFormat}
                            value={dayjs(from, dateFormat)}
                        />
                        <SwapRightOutlined />
                        <DatePicker
                            minDate={dayjs(from, dateFormat)}
                            disabledDate={disabledDate}
                            onChange={handleToChange}
                            format={dateFormat}
                            value={dayjs(to, dateFormat)}
                        />
                    </Flex>
                )}
            </Col>

            <Col xs={24} sm={12} md={5} style={{ minWidth: '200px', maxWidth: '250px' }}>
                <Input
                    value={searchKey}
                    placeholder={`Search for ${text}`}
                    suffix={<SearchOutlined />}
                    onChange={handleSearchChange}
                    allowClear
                    type="text"
                    variant="outlined"
                    maxLength={100}
                    // style={{ width: '100%' }}
                />
            </Col>
        </Row>
    );
};

export default Headers;
