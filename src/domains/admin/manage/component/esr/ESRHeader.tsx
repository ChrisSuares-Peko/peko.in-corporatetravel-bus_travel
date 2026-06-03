import React, { useState } from 'react';

import { SearchOutlined, SwapRightOutlined } from '@ant-design/icons';
import { Flex, Input, Row, Button, DatePicker } from 'antd';
import dayjs from 'dayjs';

import { DownloadType } from '@customtypes/general';
import useScreenSize from '@src/hooks/useScreenSize';

type Props = {
    handleSearch: (e: any) => void;
    searchText: '';
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    downloadReport: (type: string) => void;
    handleFromChange: (dates: any, dateStrings: any) => void;
    handleToChange: (dates: any, dateStrings: any) => void;
    handleDateChange: (dates: any, dateStrings: any) => void;
    from: string;
    to: string;
};
const ESRHeader = ({
    searchText,
    handleSearch,
    setRefresh,
    downloadReport,
    handleFromChange,
    handleToChange,
    from,
    to,
    handleDateChange,
}: Props) => {
    const { xs } = useScreenSize();
    const dateFormat = 'YYYY-MM-DD';
    const [openModal, setOpenModal] = useState(false);
    return (
        <Row justify="space-between" className="w-full gap-5">
            <Flex className="flex justify-start gap-3">
                <Button danger onClick={() => downloadReport(DownloadType.Excel)}>
                    Excel
                </Button>
                <Button danger onClick={() => downloadReport(DownloadType.Csv)}>
                    CSV
                </Button>
                <Button danger onClick={() => downloadReport(DownloadType.Pdf)}>
                    PDF
                </Button>
            </Flex>
            <Flex className="flex-col justify-end w-full gap-3 px-0 md:flex-row md:w-auto">
                {xs ? (
                    <Flex className="w-full sm:w-fit" justify="space-between" align="center">
                        <DatePicker
                            onChange={handleFromChange}
                            format={dateFormat}
                            defaultValue={dayjs(from, dateFormat)}
                        />
                        <SwapRightOutlined />
                        <DatePicker
                            onChange={handleToChange}
                            format={dateFormat}
                            defaultValue={dayjs(to, dateFormat)}
                        />
                    </Flex>
                ) : (
                    <DatePicker.RangePicker
                        onChange={handleDateChange}
                        format={dateFormat}
                        className="min-w-40"
                        defaultValue={[dayjs(from, dateFormat), dayjs(to, dateFormat)]}
                    />
                )}
                <Input
                    value={searchText}
                    placeholder="Search "
                    suffix={<SearchOutlined />}
                    onChange={handleSearch}
                    allowClear
                    type="text"
                    variant="outlined"
                    maxLength={100}
                />
            </Flex>
        </Row>
    );
};

export default ESRHeader;
