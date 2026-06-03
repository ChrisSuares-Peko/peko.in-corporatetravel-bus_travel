import React from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Row } from 'antd';

import { DownloadType } from '@customtypes/general';

import { refresh } from '../../officeSupplies/types/products';

// const RoleModal = lazy(() => import('./RoleModal'));

type Props = {
    handleSearch: (e: any) => void;
    searchText: string;
    handleDownloadReport: (type: string) => Promise<void>;
    handleOpenModal: () => void;
};

const PartnerHeader = ({
    searchText,
    handleSearch,
    setRefresh,
    handleDownloadReport,
    handleOpenModal,
}: Props & refresh) => (
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
            <Button type="primary" className="" danger onClick={handleOpenModal}>
                Add New Partner
            </Button>
            <Input
                value={searchText}
                placeholder="Search For Partner"
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
export default PartnerHeader;
