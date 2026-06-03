import React, { useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Row } from 'antd';

import { DownloadType } from '@customtypes/general';

type Props = {
    handleSearch: (e: any) => void;
    searchText: string;
    handleDownloadReport: (type: string) => void;
};

const Header = ({ searchText, handleSearch, handleDownloadReport }: Props) => {
    const [openModal, setOpenModal] = useState(false);

    return (
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
            <Flex className="flex-col justify-end w-full gap-3 px-0 md:flex-row md:w-auto">
                <Input
                    value={searchText}
                    placeholder="Search "
                    suffix={<SearchOutlined />}
                    onChange={handleSearch}
                    allowClear
                    className="w-full"
                    type="text"
                    variant="outlined"
                    maxLength={100}
                />
            </Flex>
        </Row>
    );
};
export default Header;
